"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Calendar, CheckCircle2, Sparkles } from "lucide-react"
import { TodoItem } from "./todo-item"
import { AddTodoInput } from "./add-todo-input"
import type { Todo } from "@/types/todo"

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onAdd: (title: string) => void
  onSelect: (todo: Todo) => void
  onDelete: (id: string) => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function TodoList({ todos, onToggle, onAdd, onSelect, onDelete, onReorder }: TodoListProps) {
  const [showAddInput, setShowAddInput] = useState(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [greeting, setGreeting] = useState("")

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length
  const activeTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Good morning")
    } else if (hour < 17) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }
  }, [])

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", "")
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onReorder(draggedIndex, dropIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const getMotivationalMessage = () => {
    if (totalCount === 0) return null
    if (completedCount === totalCount) {
      return {
        icon: <Sparkles size={16} className="text-green-500" />,
        message: "All done! You're crushing it today!",
        color: "text-green-600",
      }
    }
    if (completedCount > totalCount / 2) {
      return {
        icon: <CheckCircle2 size={16} className="text-blue-500" />,
        message: "Great progress! Keep it up!",
        color: "text-blue-600",
      }
    }
    return null
  }

  const motivationalMessage = getMotivationalMessage()

  return (
    <div className="max-w-md mx-auto min-h-screen bg-neutral-50 px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-light text-neutral-800 mb-1">{greeting}</h1>
            <p className="text-sm text-neutral-500">Stay focused on what matters</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-neutral-400 mb-1">
              <Calendar size={14} />
              <span className="text-xs">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Card */}
        {totalCount > 0 && (
          <div className="bg-white rounded-lg p-4 border border-neutral-200 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-neutral-600">Progress</span>
              <span className="text-sm text-neutral-500">
                {completedCount}/{totalCount}
              </span>
            </div>
            <div className="w-full bg-neutral-100 rounded-full h-2 mb-3">
              <div
                className="bg-gradient-to-r from-green-200 to-green-300 h-2 rounded-full transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            {motivationalMessage && (
              <div className={cn("flex items-center gap-2 text-sm", motivationalMessage.color)}>
                {motivationalMessage.icon}
                <span className="font-medium">{motivationalMessage.message}</span>
              </div>
            )}
          </div>
        )}

        {/* Quick tip for new users */}
        {totalCount > 0 && totalCount < 3 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-xs text-blue-700">
              <strong>Tip:</strong> Swipe right to complete tasks, swipe left to delete, or drag to reorder!
            </p>
          </div>
        )}
      </div>

      {/* Active Tasks */}
      {activeTodos.length > 0 && (
        <div className="mb-8">
          <div className="space-y-3">
            {activeTodos.map((todo) => {
              const originalIndex = todos.findIndex((t) => t.id === todo.id)
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={originalIndex}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedIndex === originalIndex}
                  isDragOver={dragOverIndex === originalIndex}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTodos.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={16} className="text-green-500" />
            <h2 className="text-sm font-medium text-neutral-600">Completed ({completedTodos.length})</h2>
          </div>
          <div className="space-y-2">
            {completedTodos.map((todo) => {
              const originalIndex = todos.findIndex((t) => t.id === todo.id)
              return (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  index={originalIndex}
                  onToggle={onToggle}
                  onSelect={onSelect}
                  onDelete={onDelete}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedIndex === originalIndex}
                  isDragOver={dragOverIndex === originalIndex}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalCount === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={24} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-light text-neutral-600 mb-2">Ready to get organized?</h3>
          <p className="text-sm text-neutral-400 mb-6">Add your first task to start building momentum</p>
        </div>
      )}

      {/* Add Todo Input */}
      {showAddInput && (
        <AddTodoInput
          onAdd={(title) => {
            onAdd(title)
            setShowAddInput(false)
          }}
          onCancel={() => setShowAddInput(false)}
        />
      )}

      {/* Add Button */}
      <button
        onClick={() => setShowAddInput(true)}
        className="fixed bottom-8 right-6 w-14 h-14 bg-gradient-to-r from-neutral-800 to-neutral-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 active:scale-95"
      >
        <Plus size={24} />
      </button>
    </div>
  )
}
