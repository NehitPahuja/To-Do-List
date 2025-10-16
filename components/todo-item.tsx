"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Check, Trash2, GripVertical } from "lucide-react"
import type { Todo } from "@/types/todo"
import { cn } from "@/lib/utils"

interface TodoItemProps {
  todo: Todo
  index: number
  onToggle: (id: string) => Promise<void> | void
  onSelect: (todo: Todo) => void
  onDelete: (id: string) => Promise<void> | void
  onDragStart: (e: React.DragEvent, index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  isDragging: boolean
  isDragOver: boolean
}

export function TodoItem({
  todo,
  index,
  onToggle,
  onSelect,
  onDelete,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  isDragging,
  isDragOver,
}: TodoItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isSwipeActive, setIsSwipeActive] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)
  const itemRef = useRef<HTMLDivElement>(null)
  const startX = useRef(0)
  const currentX = useRef(0)
  const isDraggingSwipe = useRef(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isDragging) return
    startX.current = e.touches[0].clientX
    currentX.current = startX.current
    isDraggingSwipe.current = true
    setIsSwipeActive(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingSwipe.current || isDragging) return

    currentX.current = e.touches[0].clientX
    const diff = currentX.current - startX.current
    const maxSwipe = 120
    const clampedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff))

    setSwipeOffset(clampedDiff)
    setSwipeDirection(clampedDiff > 0 ? "right" : "left")
  }

  const handleTouchEnd = () => {
    if (!isDraggingSwipe.current || isDragging) return

    const threshold = 60
    const absOffset = Math.abs(swipeOffset)

    if (absOffset > threshold) {
      if (swipeDirection === "right") {
        // Swipe right - complete/uncomplete task
        onToggle(todo.id)
      } else if (swipeDirection === "left") {
        // Swipe left - delete task
        onDelete(todo.id)
      }
    }

    // Reset swipe state
    setSwipeOffset(0)
    setIsSwipeActive(false)
    setSwipeDirection(null)
    isDraggingSwipe.current = false
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left click
    startX.current = e.clientX
    currentX.current = startX.current
    isDraggingSwipe.current = true
    setIsSwipeActive(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingSwipe.current || isDragging) return

    currentX.current = e.clientX
    const diff = currentX.current - startX.current
    const maxSwipe = 120
    const clampedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff))

    setSwipeOffset(clampedDiff)
    setSwipeDirection(clampedDiff > 0 ? "right" : "left")
  }

  const handleMouseUp = () => {
    if (!isDraggingSwipe.current || isDragging) return

    const threshold = 60
    const absOffset = Math.abs(swipeOffset)

    if (absOffset > threshold) {
      if (swipeDirection === "right") {
        onToggle(todo.id)
      } else if (swipeDirection === "left") {
        onDelete(todo.id)
      }
    }

    setSwipeOffset(0)
    setIsSwipeActive(false)
    setSwipeDirection(null)
    isDraggingSwipe.current = false
  }

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingSwipe.current && !isDragging) {
        currentX.current = e.clientX
        const diff = currentX.current - startX.current
        const maxSwipe = 120
        const clampedDiff = Math.max(-maxSwipe, Math.min(maxSwipe, diff))

        setSwipeOffset(clampedDiff)
        setSwipeDirection(clampedDiff > 0 ? "right" : "left")
      }
    }

    const handleGlobalMouseUp = () => {
      if (isDraggingSwipe.current) {
        handleMouseUp()
      }
    }

    document.addEventListener("mousemove", handleGlobalMouseMove)
    document.addEventListener("mouseup", handleGlobalMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [isDragging])

  return (
    <div className="relative overflow-hidden">
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-6">
        <div
          className={cn(
            "flex items-center gap-2 text-green-600 transition-opacity duration-200",
            swipeDirection === "right" && Math.abs(swipeOffset) > 30 ? "opacity-100" : "opacity-0",
          )}
        >
          <Check size={20} />
          <span className="text-sm font-medium">{todo.completed ? "Mark incomplete" : "Complete"}</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 text-red-500 transition-opacity duration-200",
            swipeDirection === "left" && Math.abs(swipeOffset) > 30 ? "opacity-100" : "opacity-0",
          )}
        >
          <span className="text-sm font-medium">Delete</span>
          <Trash2 size={20} />
        </div>
      </div>

      {/* Main Item */}
      <div
        ref={itemRef}
        draggable={!isSwipeActive}
        onDragStart={(e) => !isSwipeActive && onDragStart(e, index)}
        onDragOver={(e) => !isSwipeActive && onDragOver(e, index)}
        onDragLeave={() => !isSwipeActive && onDragLeave()}
        onDrop={(e) => !isSwipeActive && onDrop(e, index)}
        onDragEnd={() => !isSwipeActive && onDragEnd()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        className={cn(
          "relative bg-white rounded-lg border transition-all duration-200 overflow-hidden group",
          todo.completed
            ? "border-neutral-100 bg-neutral-50/50"
            : "border-neutral-200 hover:border-neutral-300 hover:shadow-sm",
          isDragging && "opacity-50 scale-95 shadow-lg",
          isDragOver && "border-blue-300 bg-blue-50/50",
          !isSwipeActive && "cursor-move",
          isSwipeActive && "cursor-grabbing",
        )}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwipeActive ? "none" : "transform 0.2s ease-out",
        }}
        onMouseEnter={() => !isSwipeActive && setShowActions(true)}
        onMouseLeave={() => !isSwipeActive && setShowActions(false)}
      >
        {isDragOver && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400" />}

        <div className="flex items-center p-4 gap-3">
          <div
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing",
              showActions && "opacity-100",
              isSwipeActive && "opacity-0",
            )}
          >
            <GripVertical size={16} className="text-neutral-400" />
          </div>

          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggle(todo.id)
            }}
            className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
              todo.completed
                ? "bg-green-100 border-green-300 scale-95"
                : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50",
            )}
          >
            {todo.completed && <Check size={12} className="text-green-600" />}
          </button>

          {/* Content */}
          <div className="flex-1 cursor-pointer" onClick={() => onSelect(todo)}>
            <div className="flex items-center gap-2">
              {todo.emoji && (
                <span className={cn("text-lg transition-opacity duration-200", todo.completed && "opacity-50")}>
                  {todo.emoji}
                </span>
              )}
              <span
                className={cn(
                  "text-neutral-800 font-normal transition-all duration-200",
                  todo.completed && "line-through text-neutral-400",
                )}
              >
                {todo.title}
              </span>
            </div>
            {todo.content.length > 0 && (
              <div className="mt-1 flex items-center gap-1">
                <div className="w-1 h-1 bg-neutral-300 rounded-full" />
                <span className="text-xs text-neutral-400">
                  {todo.content.length} note{todo.content.length !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div
            className={cn(
              "flex items-center gap-1 transition-opacity duration-200",
              showActions && !isSwipeActive ? "opacity-100" : "opacity-0",
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(todo.id)
              }}
              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
