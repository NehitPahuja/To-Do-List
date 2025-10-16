import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { TodoApp } from "@/components/todo-app"

export default function Home() {
  const { userId } = auth()

  if (!userId) {
    redirect("/login")
  }

  return (
    <main className="min-h-screen bg-neutral-50">
      <TodoApp />
    </main>
  )
}
