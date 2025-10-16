import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { SignUp } from "@clerk/nextjs"

import { ProductivityCard } from "@/components/login/productivity-card"

export default function SignUpPage() {
  const { userId } = auth()

  if (userId) {
    redirect("/")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center gap-12 px-6 py-16 lg:flex-row lg:items-stretch">
        <section className="w-full max-w-md rounded-3xl bg-white/90 p-10 shadow-[0_40px_80px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur">
          <header>
            <p className="text-sm font-medium text-emerald-600">Create an account</p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">Start planning with us</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Set up your profile to sync tasks across devices, invite collaborators, and stay motivated with progress insights.
            </p>
          </header>
          <div className="mt-10">
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/login"
              afterSignUpUrl="/"
              appearance={{
                elements: {
                  card: "shadow-none p-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "rounded-2xl border border-neutral-200 text-neutral-700 hover:border-neutral-300",
                  formButtonPrimary:
                    "rounded-2xl bg-emerald-500 py-3 text-sm font-semibold shadow-lg shadow-emerald-200 hover:bg-emerald-600",
                  formFieldInput:
                    "h-12 rounded-2xl border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100",
                  footerActionText: "text-sm text-neutral-600",
                  footerActionLink: "text-emerald-600 hover:text-emerald-500",
                },
              }}
            />
          </div>
        </section>
        <ProductivityCard />
      </div>
    </main>
  )
}
