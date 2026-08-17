import Link from 'next/link'
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react'

// "Pick up where you left off" for the CRM 2.0 landing page. Answers a returning
// PM's first question — where was I — and points them straight back in with a
// primary action. Completion state is resolved on the server from
// content_completions and passed in, so this is a plain, flash-free component.

export interface ResumeNext {
  slug: string
  title: string
  minutes: number
}

export default function ResumeCard({
  next,
  guidesDone,
  guidesTotal,
  minutesLeft,
  outstanding,
}: {
  next: ResumeNext | null
  guidesDone: number
  guidesTotal: number
  minutesLeft: number
  outstanding: number
}) {
  const pct = guidesTotal > 0 ? Math.round((guidesDone / guidesTotal) * 100) : 0

  // Every guide read — celebrate and point at the sign-off.
  if (!next) {
    return (
      <div className="card p-6 flex flex-col justify-between">
        <div className="flex items-start gap-4">
          <span className="w-12 h-12 rounded-2xl bg-[#F0FFF4] text-[#1A7F37] flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <p className="text-[18px] font-bold text-navy leading-snug">You&rsquo;ve read every guide</p>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed">
              Nice work. The capstone is the last step to your Certified Operator badge.
            </p>
          </div>
        </div>
        <Link href="/hub/crm-2/capstone" className="btn-primary mt-5 self-start">
          Take the capstone <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    )
  }

  const isStart = guidesDone === 0

  return (
    <div className="card p-6 flex flex-col justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-orange">
          {isStart ? 'Start here' : 'Pick up where you left off'}
        </p>
        <p className="mt-1.5 text-[19px] font-bold text-navy leading-snug">{next.title}</p>
        <p className="mt-1.5 text-[13px] text-[var(--text-secondary)] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" aria-hidden />
          {minutesLeft > 0
            ? `~${minutesLeft} min left across ${outstanding} ${outstanding === 1 ? 'guide' : 'guides'}`
            : 'Almost there'}
        </p>

        {/* Within-guide progress across the twelve. */}
        <div className="mt-4 flex items-center gap-3">
          <div className="progress-track flex-1">
            <div className="progress-fill" style={{ width: `${pct}%`, background: '#0071E3' }} />
          </div>
          <span className="text-[12.5px] font-medium text-[var(--text-secondary)] tabular-nums flex-shrink-0">
            {guidesDone}/{guidesTotal}
          </span>
        </div>
      </div>

      <Link href={`/hub/crm-2/${next.slug}`} className="btn-primary mt-5 self-start">
        {isStart ? 'Start reading' : 'Resume'} <ArrowRight className="w-4 h-4" aria-hidden />
      </Link>
    </div>
  )
}
