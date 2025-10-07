"use client"

import { cn } from "@/lib/utils"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Plus, X, Sparkles } from "lucide-react"

interface AddTodoInputProps {
  onAdd: (title: string) => void
  onCancel: () => void
}

export function AddTodoInput({ onAdd, onCancel }: AddTodoInputProps) {
  const [title, setTitle] = useState("")
  const [emoji, setEmoji] = useState("📝")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim())
      setTitle("")
      setEmoji("📝")
    }
  }

  const commonEmojis = [
    "📝",
    "💼",
    "🏠",
    "🎯",
    "📚",
    "💡",
    "🚀",
    "⭐",
    "🔥",
    "✨",
    "🎨",
    "💻",
    "📱",
    "🎵",
    "🏃‍♂️",
    "🍎",
    "☕",
    "🌟",
    "🎉",
    "💪",
  ]

  const quickSuggestions = [
    "Review project proposal",
    "Call mom",
    "Buy groceries",
    "Exercise for 30 minutes",
    "Read for 20 minutes",
    "Plan weekend trip",
  ]

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-neutral-600" />
              <h2 className="text-lg font-medium text-neutral-800">Add new task</h2>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2 p-4 border border-neutral-200 rounded-xl focus-within:ring-2 focus-within:ring-neutral-300 focus-within:border-neutral-300">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-2xl hover:bg-neutral-100 rounded-lg p-1 transition-colors"
              >
                {emoji}
              </button>
              <input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-1 bg-transparent border-none outline-none text-neutral-800 placeholder-neutral-400"
              />
            </div>

            {showEmojiPicker && (
              <div className="grid grid-cols-10 gap-2 p-4 bg-neutral-50 rounded-xl">
                {commonEmojis.map((emojiOption) => (
                  <button
                    key={emojiOption}
                    type="button"
                    onClick={() => {
                      setEmoji(emojiOption)
                      setShowEmojiPicker(false)
                    }}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-lg",
                      emoji === emojiOption ? "bg-neutral-200" : "hover:bg-neutral-200",
                    )}
                  >
                    {emojiOption}
                  </button>
                ))}
              </div>
            )}

            {!title && (
              <div className="space-y-2">
                <p className="text-xs text-neutral-500 font-medium">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.slice(0, 3).map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setTitle(suggestion)}
                      className="px-3 py-1.5 text-xs bg-neutral-100 text-neutral-600 rounded-full hover:bg-neutral-200 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-neutral-800 text-white rounded-xl hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Plus size={18} />
                Add Task
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-3 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
