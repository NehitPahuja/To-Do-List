import { CalendarDays, Check, CheckCircle2 } from "lucide-react"

export function ProductivityCard() {
  return (
    <section className="w-full max-w-xl rounded-[34px] bg-white p-10 shadow-[0_35px_80px_rgba(15,23,42,0.14)] ring-1 ring-black/5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-900">Good evening</h2>
          <p className="mt-2 text-sm text-neutral-500">Stay focused on what matters</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-500">
          <CalendarDays className="h-3.5 w-3.5" /> Thu, Oct 16
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-neutral-500">Progress</span>
          <span className="font-semibold text-neutral-800">1/3</span>
        </div>
        <div className="mt-3 h-2 w-full rounded-full bg-neutral-200">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-neutral-50/80 px-4 py-3 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-emerald-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-100 text-lg">✨</span>
          <span>Design the perfect workspace</span>
          <input type="checkbox" className="ml-auto h-5 w-5 rounded-lg border border-neutral-300" />
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-transparent bg-neutral-50/80 px-4 py-3 text-sm font-medium text-neutral-800 shadow-sm transition hover:border-emerald-100">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-100 text-lg">📚</span>
          <span>Learn a new skill</span>
          <input type="checkbox" className="ml-auto h-5 w-5 rounded-lg border border-neutral-300" />
        </div>
      </div>

      <div className="mt-10 rounded-3xl bg-neutral-50 px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
          <CheckCircle2 className="h-4 w-4" /> Completed (1)
        </div>
        <div className="mt-4 flex items-center gap-3 text-sm font-medium text-neutral-400">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Check className="h-4 w-4" />
          </span>
          <span className="line-through">Plan weekend getaway</span>
        </div>
      </div>
    </section>
  )
}
