"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { TodoList } from "./todo-list"
import { TodoDetail } from "./todo-detail"
import type { Todo } from "@/types/todo"

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const showError = useCallback(
    (message: string) => {
      setError(message)
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
      errorTimeoutRef.current = setTimeout(() => {
        setError(null)
        errorTimeoutRef.current = null
      }, 6000)
    },
    []
  )

  const fetchTodos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/todos", { cache: "no-store" })
      if (!response.ok) {
        throw new Error("Failed to load tasks")
      }
      const data = (await response.json()) as Todo[]
      const ordered = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      setTodos(ordered)
    } catch (err) {
      console.error(err)
      showError("We couldn't load your tasks. Please refresh the page.")
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    void fetchTodos()
  }, [fetchTodos])

  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current)
      }
    }
  }, [])

  const addTodo = async (title: string) => {
    setError(null)
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      const created = (await response.json()) as Todo
      setTodos((prev) => [...prev, created].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)))
    } catch (err) {
      console.error(err)
      showError("We couldn't add that task. Please try again.")
      throw err instanceof Error ? err : new Error("Failed to add task")
    }
  }

  const updateTodoState = (updated: Todo) => {
    setTodos((prev) => prev.map((todo) => (todo.id === updated.id ? updated : todo)))
    setSelectedTodo((current) => (current?.id === updated.id ? updated : current))
  }

  const toggleTodo = async (id: string) => {
    const current = todos.find((todo) => todo.id === id)
    if (!current) return

    const optimistic: Todo = {
      ...current,
      completed: !current.completed,
      updatedAt: new Date().toISOString(),
    }

    updateTodoState(optimistic)

    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: optimistic.completed }),
      })

      if (!response.ok) {
        throw new Error("Failed to toggle task")
      }

      const updated = (await response.json()) as Todo
      updateTodoState(updated)
    } catch (err) {
      console.error(err)
      updateTodoState({ ...current })
      showError("We couldn't update that task. Please try again.")
    }
  }

  const updateTodo = async (updatedTodo: Todo) => {
    const previous = todos
    updateTodoState(updatedTodo)

    try {
      const response = await fetch(`/api/todos/${updatedTodo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedTodo.title,
          emoji: updatedTodo.emoji,
          content: updatedTodo.content,
          completed: updatedTodo.completed,
          priority: updatedTodo.priority,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      const saved = (await response.json()) as Todo
      updateTodoState(saved)
    } catch (err) {
      console.error(err)
      setTodos([...previous])
      setSelectedTodo(previous.find((todo) => todo.id === updatedTodo.id) ?? null)
      showError("Changes weren't saved. Please try again.")
    }
  }

  const deleteTodo = async (id: string) => {
    const previous = todos
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
    setSelectedTodo((current) => (current?.id === id ? null : current))

    try {
      const response = await fetch(`/api/todos/${id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Failed to delete task")
      }
    } catch (err) {
      console.error(err)
      setTodos([...previous])
      setSelectedTodo((current) => (current ? previous.find((todo) => todo.id === current.id) ?? current : current))
      showError("We couldn't delete that task. Please try again.")
    }
  }

  const reorderTodos = async (fromIndex: number, toIndex: number) => {
    const previous = todos
    const updated = [...previous]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    const reindexed = updated.map((todo, index) => ({ ...todo, order: index }))

    setTodos(reindexed)
    setSelectedTodo((current) => (current ? reindexed.find((todo) => todo.id === current.id) ?? current : current))

    try {
      const response = await fetch("/api/todos/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: reindexed.map((todo) => ({ id: todo.id, order: todo.order ?? 0 })) }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder tasks")
      }
    } catch (err) {
      console.error(err)
      showError("We couldn't reorder tasks. Please try again.")
      setTodos([...previous])
      setSelectedTodo((current) => (current ? previous.find((todo) => todo.id === current.id) ?? current : current))
    }
  }

  if (selectedTodo) {
    return <TodoDetail todo={selectedTodo} onBack={() => setSelectedTodo(null)} onUpdate={updateTodo} />
  }

  return (
    <>
      {error && (
        <div className="mx-auto mb-4 w-full max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm">
          {error}
        </div>
      )}
      <TodoList
        todos={todos}
        onToggle={toggleTodo}
        onAdd={addTodo}
        onSelect={setSelectedTodo}
        onDelete={deleteTodo}
        onReorder={reorderTodos}
        loading={loading}
      />
    </>
  )
}
