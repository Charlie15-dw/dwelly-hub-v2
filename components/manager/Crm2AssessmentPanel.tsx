import { Sparkles, CheckCircle2, XCircle } from 'lucide-react'
import { CRM2_LESSONS } from '@/lib/crm2-content'

// A self-contained panel for the manager/admin dashboards showing CRM 2.0
// knowledge-check results. CRM 2.0 is a private preview (gated to an allow-list),
// so these assessments deliberately sit OUTSIDE the main team-completion metric —
// this panel surfaces them separately and only renders when someone in scope has
// actually taken one, so ordinary teams never see an empty box.

interface Crm2Result {
  user_id: string
  assessment_id: string
  score: number
  passed: boolean
  completed_at?: string | null
}

interface Crm2Person {
  id: string
  displayName: string
  initials: string
}

export default function Crm2AssessmentPanel({
  people,
  results,
}: {
  people: Crm2Person[]
  results: Crm2Result[]
}) {
  // The quizzes are derived from the lessons that carry a quizModuleId, so this
  // stays in sync automatically as CRM 2.0 lessons gain or lose quizzes.
  const quizzes = CRM2_LESSONS
    .filter((l) => l.quizModuleId)
    .map((l) => ({ id: l.quizModuleId!, title: l.title }))
  const quizIds = new Set(quizzes.map((q) => q.id))

  const crm2Results = results.filter((r) => quizIds.has(r.assessment_id))
  if (crm2Results.length === 0) return null

  // Latest attempt per (user, quiz).
  const latest = new Map<string, Crm2Result>()
  for (const r of crm2Results) {
    const key = `${r.user_id}::${r.assessment_id}`
    const prev = latest.get(key)
    if (!prev || (r.completed_at ?? '') > (prev.completed_at ?? '')) latest.set(key, r)
  }

  // Only show people who have taken at least one CRM 2.0 assessment.
  const rows = people.filter((p) =>
    quizzes.some((q) => latest.has(`${p.id}::${q.id}`))
  )
  if (rows.length === 0) return null

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-[#0071E3]" aria-hidden />
        <h2 className="text-sm font-bold text-navy">CRM 2.0 Assessments</h2>
        <span className="ml-auto text-xs text-slate-400">Private preview · 80% to pass</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap" scope="col">
                Team Member
              </th>
              {quizzes.map((q) => (
                <th key={q.id} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap" scope="col">
                  {q.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((person) => (
              <tr key={person.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[11px] font-bold">{person.initials}</span>
                    </div>
                    <p className="text-sm font-medium text-navy">{person.displayName}</p>
                  </div>
                </td>
                {quizzes.map((q) => {
                  const attempt = latest.get(`${person.id}::${q.id}`)
                  return (
                    <td key={q.id} className="px-4 py-3 whitespace-nowrap">
                      {attempt ? (
                        attempt.passed ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-0.5">
                            <CheckCircle2 className="w-3 h-3" aria-hidden />
                            {attempt.score}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">
                            <XCircle className="w-3 h-3" aria-hidden />
                            {attempt.score}%
                          </span>
                        )
                      ) : (
                        <span className="text-xs text-slate-300">Not completed</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
