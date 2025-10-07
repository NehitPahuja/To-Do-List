"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Check, Trash2, Bold, Italic, Link, GripVertical, Type, CheckSquare, Palette } from "lucide-react"
import type { ContentBlock } from "@/types/todo"
import { cn } from "@/lib/utils"

interface ContentBlockProps {
  block: ContentBlock
  index: number
  onUpdate: (updates: Partial<ContentBlock>) => void
  onDelete: () => void
  onReorder: (fromIndex: number, toIndex: number) => void
}

export function ContentBlockComponent({ block, index, onUpdate, onDelete, onReorder }: ContentBlockProps) {
  const [showFormatting, setShowFormatting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/html", "")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    // Note: This would need to be implemented with a proper drag context
    // For now, we'll show the visual feedback
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    setIsDragOver(false)
  }

  const getBlockIcon = () => {
    switch (block.type) {
      case "subtask":
        return <CheckSquare size={14} className="text-neutral-500" />
      case "rich-text":
        return <Palette size={14} className="text-neutral-500" />
      default:
        return <Type size={14} className="text-neutral-500" />
    }
  }

  if (block.type === "subtask") {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        className={cn(
          "group flex items-center gap-3 p-4 bg-white rounded-lg border border-neutral-200 transition-all duration-200 cursor-move",
          isDragging && "opacity-50 scale-95 shadow-lg",
          isDragOver && "border-blue-300 bg-blue-50/50",
          showActions && "border-neutral-300",
        )}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {isDragOver && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400" />}

        <div
          className={cn(
            "cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity",
            showActions && "opacity-100",
          )}
        >
          <GripVertical size={14} className="text-neutral-400" />
        </div>

        <button
          onClick={() => onUpdate({ completed: !block.completed })}
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
            block.completed
              ? "bg-green-100 border-green-300 scale-95"
              : "border-neutral-300 hover:border-neutral-400 hover:bg-neutral-50",
          )}
        >
          {block.completed && <Check size={12} className="text-green-600" />}
        </button>

        <input
          type="text"
          value={block.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Subtask..."
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-neutral-800 transition-all duration-200",
            block.completed && "line-through text-neutral-400",
          )}
        />

        <div className={cn("flex items-center gap-1", showActions ? "opacity-100" : "opacity-0")}>
          <button
            onClick={onDelete}
            className="p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      className={cn(
        "group bg-white rounded-lg border border-neutral-200 transition-all duration-200 cursor-move relative",
        isDragging && "opacity-50 scale-95 shadow-lg",
        isDragOver && "border-blue-300 bg-blue-50/50",
        showActions && "border-neutral-300",
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {isDragOver && <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-400" />}

      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={cn(
              "cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity mt-1",
              showActions && "opacity-100",
            )}
          >
            <GripVertical size={14} className="text-neutral-400" />
          </div>
          <div className="flex items-center gap-2 mt-1">
            {getBlockIcon()}
            <span className="text-xs text-neutral-500 font-medium">
              {block.type === "rich-text" ? "Rich Text" : "Text"}
            </span>
          </div>
          <div className={cn("ml-auto flex items-center gap-1", showActions ? "opacity-100" : "opacity-0")}>
            <button
              onClick={onDelete}
              className="p-1 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        <textarea
          ref={textareaRef}
          value={block.content}
          onChange={(e) => {
            onUpdate({ content: e.target.value })
            adjustTextareaHeight()
          }}
          onInput={adjustTextareaHeight}
          placeholder={block.type === "text" ? "Add some notes..." : "Rich text content..."}
          className="w-full bg-transparent border-none outline-none text-neutral-800 resize-none leading-relaxed"
          rows={1}
          style={{
            fontWeight: block.formatting?.bold ? "bold" : "normal",
            fontStyle: block.formatting?.italic ? "italic" : "normal",
            minHeight: "24px",
          }}
        />

        {block.type === "rich-text" && (
          <div className="flex items-center gap-2 pt-3 mt-3 border-t border-neutral-100">
            <button
              onClick={() =>
                onUpdate({
                  formatting: {
                    ...block.formatting,
                    bold: !block.formatting?.bold,
                  },
                })
              }
              className={cn(
                "p-2 rounded-lg transition-colors",
                block.formatting?.bold
                  ? "bg-neutral-200 text-neutral-800"
                  : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100",
              )}
            >
              <Bold size={14} />
            </button>
            <button
              onClick={() =>
                onUpdate({
                  formatting: {
                    ...block.formatting,
                    italic: !block.formatting?.italic,
                  },
                })
              }
              className={cn(
                "p-2 rounded-lg transition-colors",
                block.formatting?.italic
                  ? "bg-neutral-200 text-neutral-800"
                  : "text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100",
              )}
            >
              <Italic size={14} />
            </button>
            <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
              <Link size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
