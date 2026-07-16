import { LayoutGrid } from 'lucide-react'

// Competency areas group the individual assessments into meaningful skill
// domains, so a manager can see team strengths and gaps at a glance rather
// than reading a wall of per-module scores.
const COMPETENCY_AREAS: { id: string; label: string; short: string; assessments: string[] }[] = [
  { id: 'maintenance', label: 'Maintenance', short: 'Maint', assessments: ['mnt-01', 'mnt-02', 'mnt-03'] },
  { id: 'compliance',  label: 'Compliance',  short: 'Comp',  assessments: ['cmp-01', 'cmp-02'] },
  { id: 'inspections', label: 'Inspections', short: 'Insp',  assessments: ['ins-02'] },
  { id: 'system',      label: 'System / CRM', short: 'Sys',  assessments: ['sys-01', 'sys-02'] },
  { id: 'moveouts',    label: 'Move-outs',   short: 'Move',  assessments: ['mvt-02'] },
  { id: 'support',     label: 'Support',     short: 'Supp',  assessments: ['sup-02'] },
  { id: 'knowledge',   label: 'Knowledge',   short: 'Know',  assessments: ['kno-01', 'kno-02', 'kno-03'] },
]

interface Member { id: string; displayName: string; initials: string }
interface ResultRow { user_id: string; assessment_id: string; score: number }

function cellStyle(score: number | null): { className: string; label: string } {
  if (score === null) return { className: 'bg-slate-50 text-slate-300 border-slate-100', label: '–' }
  if (score >= 80) return { className: 'bg-emerald-500 text-white border-emerald-500', label: `${score}` }
  if (score >= 60) return { className: 'bg-amber-400 text-white border-amber-400', label: `${score}` }
  return { className: 'bg-rose-500 text-white border-rose-500', label: `${score}` }
}

export default function CompetencyHeatmap({ members, results }: { members: Member[]; results: ResultRow[] }) {
  // Latest score per user + assessment (results arrive oldest-first, so a plain
  // set keeps the most recent).
  const latest = new Map<string, number>() // key: `${userId}:${assessmentId}`
  for (const r of results) latest.set(`${r.user_id}:${r.assessment_id}`, r.score)

  // Per member, per area: average of attempted assessments in that area.
  function areaScore(userId: string, assessments: string[]): number | null {
    const scores = assessments
      .map(a => latest.get(`${userId}:${a}`))
      .filter((s): s is number => typeof s === 'number')
    if (scores.length === 0) return null
    return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length)
  }

  if (members.length === 0) return null

  return (
    <section className="card p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-indigo-100 text-indigo-700 border-indigo-200 flex-shrink-0">
          <LayoutGrid className="w-4.5 h-4.5" aria-hidden />
        </div>
        <div>
          <h2 className="text-base font-bold text-navy">Team competency heatmap</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Latest scores by skill area. Spot gaps at a glance, then raise a training request to close them.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1">
          <thead>
            <tr>
              <th className="text-left text-[11px] font-bold uppercase tracking-wide text-slate-400 pb-1 pr-3">Team member</th>
              {COMPETENCY_AREAS.map(area => (
                <th key={area.id} className="text-center text-[11px] font-semibold text-slate-500 pb-1 px-1" title={area.label}>
                  {area.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map(member => (
              <tr key={member.id}>
                <td className="pr-3 py-0.5">
                  <div className="flex items-center gap-2 min-w-[9rem]">
                    <div className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-navy leading-none">{member.initials}</span>
                    </div>
                    <span className="text-sm font-medium text-navy truncate">{member.displayName}</span>
                  </div>
                </td>
                {COMPETENCY_AREAS.map(area => {
                  const score = areaScore(member.id, area.assessments)
                  const { className, label } = cellStyle(score)
                  return (
                    <td key={area.id} className="px-1 py-0.5">
                      <div
                        className={`h-9 rounded-md border flex items-center justify-center text-xs font-bold ${className}`}
                        title={`${member.displayName} — ${area.label}: ${score === null ? 'not started' : score + '%'}`}
                      >
                        {label}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4 mt-4 flex-wrap">
        {[
          { c: 'bg-emerald-500', t: 'Strong (80%+)' },
          { c: 'bg-amber-400', t: 'Developing (60–79%)' },
          { c: 'bg-rose-500', t: 'Needs support (<60%)' },
          { c: 'bg-slate-100 border border-slate-200', t: 'Not started' },
        ].map(({ c, t }) => (
          <span key={t} className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className={`w-3 h-3 rounded ${c}`} aria-hidden />
            {t}
          </span>
        ))}
      </div>
    </section>
  )
}
