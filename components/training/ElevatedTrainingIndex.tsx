import Link from 'next/link'
import { ChevronRight, Check, PlayCircle } from 'lucide-react'
import { TRAINING_PAGES, COMPLIANCE_IDS } from '@/lib/training-content'
import { createServerClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'

// Redesigned Training Guide index — real progress, still-to-read / read
// grouping, deep-linking. Gated to the two review accounts; the route renders
// the original grid for everyone else.

const SECTION_ID = '__section__'

function readMinutes(readTime: string): number {
  const m = readTime.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

export default async function ElevatedTrainingIndex() {
  const sorted = [...TRAINING_PAGES].sort((a, b) => a.order - b.order)
  const total = sorted.length

  // Per-guide read state drives the real progress numbers.
  const readMap = new Map<string, string>()
  try {
    const supabase = createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('content_completions')
        .select('content_id, completed_at')
        .eq('user_id', user.id)
        .eq('content_type', 'training')
      for (const row of data ?? []) {
        if (row.content_id !== SECTION_ID) readMap.set(row.content_id, row.completed_at ?? '')
      }
    }
  } catch {
    // Non-critical — index still renders without read state.
  }

  const unread = sorted.filter(p => !readMap.has(p.id))
  const read = sorted.filter(p => readMap.has(p.id))
  const readCount = read.length
  const minutesLeft = unread.reduce((sum, p) => sum + readMinutes(p.readTime), 0)

  const continueTarget = unread[0] ?? sorted[0]
  const continueLabel = readCount === 0 ? 'Start reading' : unread.length === 0 ? 'Read again' : 'Continue reading'

  const readVisible = read.slice(0, 4)
  const readHidden = read.slice(4)

  return (
    <div className="max-w-[880px] space-y-7">

      {/* Header */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="max-w-[560px] space-y-2">
          <h1 className="text-[27px] font-semibold tracking-tight text-navy">Training Guide</h1>
          <p className="text-[16px] leading-[1.6] text-[var(--text-secondary)]">
            Ten written guides covering every area of the platform. Work through them in order, or jump to what you need.
          </p>
        </div>
        <Link href={`/training/${continueTarget.id}`} className="btn-primary flex-shrink-0">
          {continueLabel}
        </Link>
      </div>

      {/* Real progress */}
      <div className="card p-6 flex items-center gap-7">
        <div className="flex items-baseline gap-1.5 flex-shrink-0">
          <span className="text-[30px] font-semibold tracking-tight leading-none text-navy">{readCount}</span>
          <span className="text-[15px] text-[var(--text-tertiary)]">/ {total}</span>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="progress-track">
            <span
              className="progress-fill bg-orange"
              style={{ width: `${total > 0 ? (readCount / total) * 100 : 0}%` }}
            />
          </div>
          <span className="text-[14px] text-[var(--text-secondary)]">
            {minutesLeft > 0 ? (
              <>Guides read · about <strong className="font-semibold text-navy">{minutesLeft} minutes</strong> of reading left</>
            ) : (
              <>All ten guides read — nothing left to work through.</>
            )}
          </span>
        </div>
      </div>

      {/* Still to read */}
      {unread.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
              Still to read · {unread.length}
            </h2>
            <span className="text-[14px] text-[var(--text-secondary)]">In the order they&apos;re written</span>
          </div>
          <div className="card overflow-hidden">
            {unread.map((page) => {
              const isCompliance = COMPLIANCE_IDS.includes(page.id)
              const n = sorted.findIndex(p => p.id === page.id) + 1
              return (
                <Link
                  key={page.id}
                  href={`/training/${page.id}`}
                  className="group flex items-center gap-[18px] px-6 py-5 border-t border-navy-100 first:border-t-0 hover:bg-navy-50 transition-colors"
                >
                  <span className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center text-[14px] font-semibold flex-shrink-0',
                    isCompliance ? 'rag-red' : 'bg-navy-50 text-[var(--text-secondary)] border border-navy-100',
                  )}>
                    {String(n).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[17px] font-semibold text-navy">{page.title}</span>
                      {isCompliance && (
                        <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full rag-red">Required</span>
                      )}
                    </div>
                    <p className="text-[14.5px] leading-[1.5] text-[var(--text-secondary)]">{page.subtitle}</p>
                  </div>
                  <span className="text-[14px] text-[var(--text-secondary)] whitespace-nowrap flex-shrink-0">{page.readTime}</span>
                  <ChevronRight className="w-4 h-4 text-navy-200 group-hover:text-orange transition-colors flex-shrink-0" aria-hidden />
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Read */}
      {read.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Read · {read.length}
          </h2>
          <div className="rounded-2xl bg-navy-50 border border-navy-100 overflow-hidden">
            {readVisible.map((page, i) => (
              <ReadRow key={page.id} id={page.id} title={page.title} n={sorted.findIndex(p => p.id === page.id) + 1} date={readMap.get(page.id)} first={i === 0} />
            ))}
            {readHidden.length > 0 && (
              <details>
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden px-6 py-3 border-t border-navy-100 text-[14px] font-semibold text-orange hover:underline">
                  Show all {read.length}
                </summary>
                {readHidden.map((page) => (
                  <ReadRow key={page.id} id={page.id} title={page.title} n={sorted.findIndex(p => p.id === page.id) + 1} date={readMap.get(page.id)} first={false} />
                ))}
              </details>
            )}
          </div>
        </section>
      )}

      {/* Footer note — one line, no duplicate */}
      <div className="card p-5 flex items-start gap-3.5">
        <PlayCircle className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0 mt-0.5" aria-hidden />
        <p className="text-[14.5px] leading-[1.6] text-[var(--text-secondary)]">
          These are the written guides. The video walkthrough for each area is linked on{' '}
          <Link href="/modules" className="text-orange hover:underline font-medium">Video Modules</Link>
          {' '}— most people read first, then watch.
        </p>
      </div>
    </div>
  )
}

function ReadRow({ id, title, n, date, first }: { id: string; title: string; n: number; date?: string; first: boolean }) {
  const dateLabel = date
    ? new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : null
  return (
    <Link
      href={`/training/${id}`}
      className={cn('flex items-center gap-4 px-6 py-4 hover:bg-white transition-colors', !first && 'border-t border-navy-100')}
    >
      <span className="w-[22px] h-[22px] rounded-full rag-green flex items-center justify-center flex-shrink-0">
        <Check className="w-3 h-3" strokeWidth={3} aria-hidden />
      </span>
      <span className="flex-1 min-w-0 text-[15.5px] font-medium text-navy truncate">
        {String(n).padStart(2, '0')} · {title}
      </span>
      {dateLabel && <span className="text-[14px] text-[var(--text-secondary)] whitespace-nowrap flex-shrink-0">Read {dateLabel}</span>}
    </Link>
  )
}
