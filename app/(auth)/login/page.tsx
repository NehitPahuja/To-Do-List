import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"

import { LoginForm } from "@/components/login/login-form"
import { ProductivityCard } from "@/components/login/productivity-card"

export default function LoginPage() {
  const { userId } = auth()

  if (userId) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-12 px-6 py-16 lg:flex-row lg:items-stretch">
        <LoginForm />
        <ProductivityCard />
      </div>
    </main>
  )
}
