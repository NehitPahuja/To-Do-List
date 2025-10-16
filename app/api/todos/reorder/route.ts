import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

import { getTodosCollection } from "@/lib/mongodb"

interface ReorderPayload {
  items: Array<{ id: string; order: number }>
}

export async function PATCH(request: Request) {
  const { userId } = auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const payload = (await request.json().catch(() => null)) as ReorderPayload | null

  if (!payload || !Array.isArray(payload.items)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const operations = payload.items
    .filter((item) => typeof item.id === "string" && typeof item.order === "number")
    .map((item) => {
      try {
        return {
          updateOne: {
            filter: { _id: new ObjectId(item.id), userId },
            update: { $set: { order: item.order, updatedAt: new Date() } },
          },
        }
      } catch {
        return null
      }
    })
    .filter((operation): operation is NonNullable<typeof operation> => Boolean(operation))

  if (operations.length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
  }

  const collection = await getTodosCollection()
  await collection.bulkWrite(operations)

  return NextResponse.json({ success: true })
}
