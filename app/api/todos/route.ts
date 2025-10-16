import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { getTodosCollection } from "@/lib/mongodb"
import type { Todo, TodoDocument } from "@/types/todo"

const PRIORITIES = new Set(["low", "medium", "high"])

function serializeTodo(doc: TodoDocument): Todo {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    completed: doc.completed,
    emoji: doc.emoji,
    content: doc.content ?? [],
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    priority: doc.priority,
    order: doc.order,
  }
}

export async function GET() {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const collection = await getTodosCollection()
  const todos = await collection.find({ userId }).sort({ order: 1, createdAt: -1 }).toArray()

  return NextResponse.json(todos.map(serializeTodo))
}

export async function POST(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = await request.json().catch(() => null)

  if (!payload || typeof payload.title !== "string" || !payload.title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 })
  }

  const collection = await getTodosCollection()
  const now = new Date()
  const priority = typeof payload.priority === "string" && PRIORITIES.has(payload.priority) ? payload.priority : undefined
  const doc: TodoDocument = {
    _id: new ObjectId(),
    userId,
    title: payload.title.trim(),
    completed: false,
    emoji: typeof payload.emoji === "string" && payload.emoji.trim() ? payload.emoji : "📝",
    content: [],
    createdAt: now,
    updatedAt: now,
    priority,
    order: typeof payload.order === "number" ? payload.order : now.getTime(),
  }

  await collection.insertOne(doc)

  return NextResponse.json(serializeTodo(doc), { status: 201 })
}
