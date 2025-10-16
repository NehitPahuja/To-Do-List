import Link from "next/link"
import { SignIn } from "@clerk/nextjs"

export function LoginForm() {
  return (
    <section className="w-full max-w-md rounded-3xl bg-white/90 p-10 shadow-[0_40px_80px_rgba(15,23,42,0.08)] ring-1 ring-black/5 backdrop-blur">
      <header>
        <p className="text-sm font-medium text-emerald-600">Welcome back</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-neutral-900">Sign in to stay on track</h1>
        <p className="mt-3 text-sm leading-6 text-neutral-600">
          Keep your goals front and center. Log in to sync your checklist, track progress, and finish the day strong.
        </p>
      </header>
      <div className="mt-10">
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/sign-up"
          afterSignInUrl="/"
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

      <p className="mt-6 text-center text-sm text-neutral-500">
        Need a Clerk account?{' '}
        <Link href="https://clerk.com" className="font-semibold text-emerald-600 transition hover:text-emerald-500">
          Learn more
        </Link>
      </p>
    </section>
  )
}
