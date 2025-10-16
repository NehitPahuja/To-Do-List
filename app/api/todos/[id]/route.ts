import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { getTodosCollection } from "@/lib/mongodb"
import type { Todo, TodoDocument } from "@/types/todo"

const PRIORITIES = new Set(["low", "medium", "high"])

function serialize(doc: TodoDocument): Todo {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    completed: doc.completed,
    emoji: doc.emoji,
    content: doc.content ?? [],
    createdAt: doc.createdAt?.toISOString(),
    updatedAt: doc.updatedAt?.toISOString(),
    priority: doc.priority,
    order: doc.order,
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const updates = await request.json().catch(() => null)

  if (!updates || typeof updates !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const collection = await getTodosCollection()
  let _id: ObjectId

  try {
    _id = new ObjectId(params.id)
  } catch {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const allowedUpdates: Record<string, unknown> = {}

  if (typeof updates.title === "string") {
    const title = updates.title.trim()
    if (title) {
      allowedUpdates.title = title
    }
  }

  if (typeof updates.completed === "boolean") {
    allowedUpdates.completed = updates.completed
  }

  if (typeof updates.emoji === "string") {
    const emoji = updates.emoji.trim()
    if (emoji) {
      allowedUpdates.emoji = emoji
    }
  }

  if (Array.isArray(updates.content)) {
    allowedUpdates.content = updates.content
  }

  if (typeof updates.priority === "string" && PRIORITIES.has(updates.priority)) {
    allowedUpdates.priority = updates.priority
  }

  if (typeof updates.order === "number") {
    allowedUpdates.order = updates.order
  }

  if (Object.keys(allowedUpdates).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
  }

  allowedUpdates.updatedAt = new Date()

  const result = await collection.findOneAndUpdate(
    { _id, userId },
    { $set: allowedUpdates },
    { returnDocument: "after" }
  )

  const doc = result.value

  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(serialize(doc))
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const collection = await getTodosCollection()
  let _id: ObjectId

  try {
    _id = new ObjectId(params.id)
  } catch {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 })
  }

  const result = await collection.deleteOne({ _id, userId })

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}
