"use client"

import { useState } from "react"
import { ArrowLeft, Plus, Type, CheckSquare, Palette, MoreHorizontal } from "lucide-react"
import type { Todo, ContentBlock } from "@/types/todo"
import { ContentBlockComponent } from "./content-block"

interface TodoDetailProps {
  todo: Todo
  onBack: () => void
  onUpdate: (todo: Todo) => void
}

export function TodoDetail({ todo, onBack, onUpdate }: TodoDetailProps) {
  const [title, setTitle] = useState(todo.title)
  const [emoji, setEmoji] = useState(todo.emoji || "")
  const [showBlockMenu, setShowBlockMenu] = useState(false)

  const updateTodo = (updates: Partial<Todo>) => {
    onUpdate({ ...todo, ...updates })
  }

  const addContentBlock = (type: ContentBlock["type"]) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: "",
      ...(type === "subtask" && { completed: false }),
    }
    updateTodo({ content: [...todo.content, newBlock] })
    setShowBlockMenu(false)
  }

  const updateContentBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    const updatedContent = todo.content.map((block) => (block.id === blockId ? { ...block, ...updates } : block))
    updateTodo({ content: updatedContent })
  }

  const deleteContentBlock = (blockId: string) => {
    const updatedContent = todo.content.filter((block) => block.id !== blockId)
    updateTodo({ content: updatedContent })
  }

  const reorderContentBlocks = (fromIndex: number, toIndex: number) => {
    const updatedContent = [...todo.content]
    const [movedBlock] = updatedContent.splice(fromIndex, 1)
    updatedContent.splice(toIndex, 0, movedBlock)
    updateTodo({ content: updatedContent })
  }

  const completedSubtasks = todo.content.filter((block) => block.type === "subtask" && block.completed).length
  const totalSubtasks = todo.content.filter((block) => block.type === "subtask").length

  return (
    <div className="max-w-md mx-auto min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={emoji}
                onChange={(e) => {
                  setEmoji(e.target.value)
                  updateTodo({ emoji: e.target.value })
                }}
                placeholder="📝"
                className="w-8 text-lg bg-transparent border-none outline-none"
              />
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value)
                  updateTodo({ title: e.target.value })
                }}
                className="flex-1 text-xl font-light text-neutral-800 bg-transparent border-none outline-none"
                placeholder="Task title..."
              />
            </div>
            {totalSubtasks > 0 && (
              <div className="flex items-center gap-2 text-xs text-neutral-500">
                <CheckSquare size={12} />
                <span>
                  {completedSubtasks}/{totalSubtasks} subtasks completed
                </span>
                <div className="flex-1 bg-neutral-100 rounded-full h-1 ml-2">
                  <div
                    className="bg-green-200 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
                  />
                </div>
              </div>
            )}
          </div>
          <button className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-4 pb-32">
        {todo.content.map((block, index) => (
          <ContentBlockComponent
            key={block.id}
            block={block}
            index={index}
            onUpdate={(updates) => updateContentBlock(block.id, updates)}
            onDelete={() => deleteContentBlock(block.id)}
            onReorder={reorderContentBlocks}
          />
        ))}

        {/* Empty state */}
        {todo.content.length === 0 && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Type size={20} className="text-neutral-400" />
            </div>
            <p className="text-sm text-neutral-500 mb-4">Start adding content to your task</p>
          </div>
        )}

        <div className="relative">
          {showBlockMenu ? (
            <div className="bg-white rounded-lg border border-neutral-200 shadow-lg p-2 space-y-1">
              <button
                onClick={() => addContentBlock("text")}
                className="w-full flex items-center gap-3 p-3 text-left text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center">
                  <Type size={14} className="text-neutral-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Text</div>
                  <div className="text-xs text-neutral-500">Add some notes or thoughts</div>
                </div>
              </button>
              <button
                onClick={() => addContentBlock("subtask")}
                className="w-full flex items-center gap-3 p-3 text-left text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center">
                  <CheckSquare size={14} className="text-neutral-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Subtask</div>
                  <div className="text-xs text-neutral-500">Break down into smaller tasks</div>
                </div>
              </button>
              <button
                onClick={() => addContentBlock("rich-text")}
                className="w-full flex items-center gap-3 p-3 text-left text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-neutral-100 rounded flex items-center justify-center">
                  <Palette size={14} className="text-neutral-600" />
                </div>
                <div>
                  <div className="font-medium text-sm">Rich Text</div>
                  <div className="text-xs text-neutral-500">Format with bold, italic, links</div>
                </div>
              </button>
              <div className="border-t border-neutral-100 pt-2">
                <button
                  onClick={() => setShowBlockMenu(false)}
                  className="w-full p-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowBlockMenu(true)}
              className="w-full flex items-center gap-2 p-4 text-left text-neutral-600 hover:bg-white hover:border-neutral-200 border border-transparent rounded-lg transition-all duration-200"
            >
              <Plus size={16} />
              <span className="text-sm">Add content block</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
