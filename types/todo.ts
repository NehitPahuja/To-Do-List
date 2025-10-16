export interface ContentBlock {
  id: string
  type: "text" | "subtask" | "rich-text"
  content: string
  completed?: boolean
  formatting?: {
    bold?: boolean
    italic?: boolean
    link?: string
  }
}

export interface Todo {
  id: string
  title: string
  completed: boolean
  emoji?: string
  content: ContentBlock[]
  createdAt?: string
  updatedAt?: string
  priority?: "low" | "medium" | "high"
  order?: number
}

export type TodoDocument = {
  _id: import("mongodb").ObjectId
  userId: string
  title: string
  completed: boolean
  emoji?: string
  content: ContentBlock[]
  createdAt: Date
  updatedAt: Date
  priority?: "low" | "medium" | "high"
  order: number
}
