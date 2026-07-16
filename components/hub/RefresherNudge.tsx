import Link from 'next/link'
import { RefreshCw, ArrowRight } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { MODULES } from '@/lib/data'

// Surfaces spaced-repetition refreshers that are due today. The recall
// schedule itself is created elsewhere (when a user passes an assessment);
// this is purely the gentle nudge that resurfaces them before knowledge fades.
export default async function RefresherNudge() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const today = new Date().toISOString().split('T')[0]

  // RLS lets a user read their own schedules. Due = not completed and the due
  // date has arrived.
  const { data: due } = await supabase
    .from('recall_schedules')
    .select('id, assessment_id, interval_days, due_date')
    .eq('user_id', user.id)
    .is('completed_at', null)
    .lte('due_date', today)
    .order('due_date', { ascending: true })

  if (!due || due.length === 0) return null

  // One nudge per assessment — if several intervals are overdue, surface the
  // shortest one so the chain stays in order.
  const byAssessment = new Map<string, { assessment_id: string; interval_days: number }>()
  for (const row of due) {
    const existing = byAssessment.get(row.assessment_id)
    if (!existing || row.interval_days < existing.interval_days) {
      byAssessment.set(row.assessment_id, { assessment_id: row.assessment_id, interval_days: row.interval_days })
    }
  }
  const items = Array.from(byAssessment.values())

  return (
    <section aria-labelledby="refresher-heading" className="card p-5 border-orange/30 bg-orange/[0.03]">
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-orange/10 text-orange border-orange/20 flex-shrink-0">
          <RefreshCw className="w-5 h-5" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <h3 id="refresher-heading" className="text-sm font-bold text-navy">
            Time for a quick refresher
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            A short recall check keeps what you&apos;ve learned fresh. Two minutes, no pressure — it won&apos;t affect your results.
          </p>
          <div className="mt-3 space-y-2">
            {items.map(item => {
              const title = MODULES.find(m => m.id === item.assessment_id)?.title ?? item.assessment_id
              return (
                <Link
                  key={item.assessment_id}
                  href={`/quiz/recall-${item.assessment_id}-${item.interval_days}`}
                  className="flex items-center gap-2 justify-between rounded-lg border border-slate-200 bg-white px-3 py-2.5 group hover:border-orange/40 hover:shadow-sm transition"
                >
                  <span className="text-sm font-semibold text-navy truncate">{title}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange flex-shrink-0 group-hover:gap-1.5 transition-all">
                    Start <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
