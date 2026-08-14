import { createServiceClient } from '@/lib/supabase/server'
import { Check } from 'lucide-react'

// Elevated "You said, we did". The old page only showed published items, so a
// suggestion in flight was indistinguishable from one being ignored — the thing
// most likely to erode trust. This drops that filter and shows every stage.
//
// Privacy: hub_questions is service-role only and anonymous. submitted_by is
// used *server-side only* to split "Yours" from the team feed and is never
// rendered or sent to the client. We add no DB enum value — the "Published"
// stage is derived from published_at, "Answered" from status/admin_response.

type Stage = 'received' | 'in-progress' | 'answered' | 'published'

const STAGES: { key: Stage; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'in-progress', label: 'In progress' },
  { key: 'answered', label: 'Answered' },
  { key: 'published', label: 'Published' },
]
const STAGE_INDEX: Record<Stage, number> = { received: 0, 'in-progress': 1, answered: 2, published: 3 }

interface QRow {
  id: string
  body: string
  category: string | null
  status: string | null
  admin_response: string | null
  published_at: string | null
  created_at: string | null
  submitted_by: string | null
}

function stageOf(q: QRow): Stage {
  if (q.published_at) return 'published'
  if (q.status === 'answered' || q.admin_response) return 'answered'
  if (q.status === 'reviewing') return 'in-progress'
  return 'received'
}

function fmt(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
}

export default async function ElevatedAnswered({ userId }: { userId: string }) {
  const service = createServiceClient()
  const { data } = await service
    .from('hub_questions')
    .select('id, body, category, status, admin_response, published_at, created_at, submitted_by')
    .order('created_at', { ascending: false })

  const all = (data ?? []) as QRow[]
  const yours = all.filter(q => q.submitted_by === userId)
  // Team feed: other people's items that have reached a shareable stage.
  const team = all.filter(q => q.submitted_by !== userId && (q.admin_response || q.published_at))

  const year = new Date().getFullYear()
  const shipped = all.filter(q => q.published_at && new Date(q.published_at).getFullYear() === year).length

  const counts: Record<Stage, number> = { received: 0, 'in-progress': 0, answered: 0, published: 0 }
  for (const q of all) counts[stageOf(q)] += 1

  return (
    <div className="space-y-6 max-w-[880px]">
      {/* Hero — count shipped this year */}
      <section className="hub-fade relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel px-9 py-8">
        <div className="hub-orb-a pointer-events-none absolute -top-24 -right-16 w-60 h-60 rounded-full bg-[#0071E3]/25 blur-3xl" aria-hidden />
        <div className="relative space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">You said, we did</p>
          <div className="flex items-baseline gap-3">
            <span className="text-[44px] font-bold leading-none tabular-nums">{shipped}</span>
            <span className="text-[15px] text-white/70">shipped in {year}</span>
          </div>
          <p className="text-[15px] text-white/70 max-w-[440px] pt-1">Questions and ideas the team raised — and what we actually did about them. Nothing hidden while it&apos;s in flight.</p>
        </div>
      </section>

      {/* Four-stage summary */}
      <div className="hub-fade-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAGES.map(s => (
          <div key={s.key} className="card px-5 py-4">
            <p className="text-2xl font-semibold text-navy tabular-nums">{counts[s.key]}</p>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Yours — full cards with a stepper */}
      {yours.length > 0 && (
        <section className="hub-fade-2 space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Yours</h2>
          <div className="space-y-3">
            {yours.map(q => {
              const stage = stageOf(q)
              const idx = STAGE_INDEX[stage]
              return (
                <div key={q.id} className="card p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    {q.category && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F5F5F7] text-[var(--text-secondary)] border border-[#D2D2D7]">{q.category}</span>
                    )}
                    <span className="text-[11px] text-[var(--text-tertiary)]">{fmt(q.created_at)}</span>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] mb-1">You said</p>
                    <p className="text-sm text-navy whitespace-pre-wrap">{q.body}</p>
                  </div>

                  {/* Stepper */}
                  <div className="flex items-center gap-1.5">
                    {STAGES.map((s, i) => (
                      <div key={s.key} className="flex items-center gap-1.5 flex-1 last:flex-none">
                        <span className={`flex items-center justify-center w-5 h-5 rounded-full flex-shrink-0 ${i <= idx ? 'bg-[#0071E3] text-white' : 'bg-[#E8E8ED] text-[var(--text-tertiary)]'}`}>
                          {i < idx ? <Check className="w-3 h-3" strokeWidth={3} aria-hidden /> : <span className="text-[10px] font-bold">{i + 1}</span>}
                        </span>
                        <span className={`text-[11.5px] font-medium whitespace-nowrap ${i <= idx ? 'text-navy' : 'text-[var(--text-tertiary)]'}`}>{s.label}</span>
                        {i < STAGES.length - 1 && <span className={`hidden sm:block h-px flex-1 ${i < idx ? 'bg-[#0071E3]' : 'bg-[#E8E8ED]'}`} />}
                      </div>
                    ))}
                  </div>

                  {q.admin_response && (
                    <div className="rag-green rounded-xl px-4 py-3 border">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1">We did</p>
                      <p className="text-sm whitespace-pre-wrap">{q.admin_response}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Team — rows */}
      <section className="hub-fade-3 space-y-3">
        <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">From the team</h2>
        {team.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-[var(--text-tertiary)]">Nothing published yet. Answered questions will appear here.</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            {team.map(q => (
              <div key={q.id} className="flex items-center gap-4 px-6 py-[18px] border-t border-slate-100 first:border-t-0">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium text-navy truncate">{q.body}</p>
                  <p className="text-[12.5px] text-[var(--text-secondary)] mt-0.5">{q.category ?? 'General'} · {fmt(q.published_at ?? q.created_at)}</p>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full status-done flex-shrink-0">
                  {q.published_at ? 'Published' : 'Answered'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
