"use client"

import { useState } from "react"
import { TodoList } from "./todo-list"
import { TodoDetail } from "./todo-detail"
import type { Todo } from "@/types/todo"

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: "1",
      title: "Design the perfect workspace",
      completed: false,
      emoji: "✨",
      content: [],
    },
    {
      id: "2",
      title: "Plan weekend getaway",
      completed: true,
      emoji: "🏔️",
      content: [],
    },
    {
      id: "3",
      title: "Learn a new skill",
      completed: false,
      emoji: "📚",
      content: [],
    },
  ])

  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null)

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      emoji: "📝",
      content: [],
    }
    setTodos([...todos, newTodo])
  }

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)))
    setSelectedTodo(updatedTodo)
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const reorderTodos = (fromIndex: number, toIndex: number) => {
    const updatedTodos = [...todos]
    const [movedTodo] = updatedTodos.splice(fromIndex, 1)
    updatedTodos.splice(toIndex, 0, movedTodo)
    setTodos(updatedTodos)
  }

  if (selectedTodo) {
    return <TodoDetail todo={selectedTodo} onBack={() => setSelectedTodo(null)} onUpdate={updateTodo} />
  }

  return (
    <TodoList
      todos={todos}
      onToggle={toggleTodo}
      onAdd={addTodo}
      onSelect={setSelectedTodo}
      onDelete={deleteTodo}
      onReorder={reorderTodos}
    />
  )
}
