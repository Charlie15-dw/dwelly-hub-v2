import Link from 'next/link'
import { Check, ArrowRight, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

// Progress-aware "Your journey" for the Hub home. Pure presentational — all
// progress is computed server-side (from learning_profiles, module_progress and
// assessment_results) and passed in. No completion data is invented: untracked
// steps are shown as "explore" rather than checkable milestones.

export type JourneyState = 'done' | 'current' | 'todo' | 'explore'

export interface JourneyStep {
  n: number
  label: string
  href: string
  state: JourneyState
  detail: string
}

interface HubJourneyProps {
  firstName: string
  isNewStarter: boolean
  pct: number
  continueHref: string
  continueLabel: string
  steps: JourneyStep[]
}

export default function HubJourney({
  firstName, isNewStarter, pct, continueHref, continueLabel, steps,
}: HubJourneyProps) {
  return (
    <section className="card p-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-lg font-bold text-navy">Your journey</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {isNewStarter
              ? `Welcome${firstName ? `, ${firstName}` : ''} — let\u2019s get you started. Here\u2019s your path from day one to signed off.`
              : 'Your path through training, from day one to signed off.'}
          </p>
        </div>
        <Link href={continueHref} className="btn-primary text-sm whitespace-nowrap flex-shrink-0">
          {continueLabel}
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>

      {/* Overall progress */}
      <div className="mt-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-slate-500">Overall progress</span>
          <span className="text-sm font-bold text-navy">{pct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden bg-slate-100">
          <div className="h-full bg-orange rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {isNewStarter && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-orange/20 bg-orange/5 px-4 py-3">
          <Sparkles className="w-4 h-4 text-orange flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-slate-600">
            New here? Start with your <span className="font-semibold text-navy">Learning Profile</span> —
            it takes a couple of minutes and tailors the rest of your training to how you learn best.
          </p>
        </div>
      )}

      {/* Steps */}
      <ol className="mt-6 space-y-2">
        {steps.map((step) => {
          const isCurrent = step.state === 'current'
          const isDone = step.state === 'done'
          return (
            <li key={step.href}>
              <Link
                href={step.href}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border p-3 transition group',
                  isCurrent ? 'border-orange/30 bg-orange/5 hover:bg-orange/10' : 'border-slate-100 hover:shadow-sm hover:border-slate-200',
                )}
              >
                <span
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
                    isDone && 'bg-teal text-white',
                    isCurrent && 'bg-orange text-white ring-4 ring-orange/15',
                    (step.state === 'todo' || step.state === 'explore') && 'bg-slate-100 text-slate-500',
                  )}
                >
                  {isDone ? <Check className="w-4 h-4" aria-hidden /> : step.n}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-semibold truncate', isCurrent ? 'text-navy' : 'text-navy')}>
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{step.detail}</p>
                </div>
                {isDone && (
                  <span className="text-[11px] font-semibold text-teal flex-shrink-0">Done</span>
                )}
                {isCurrent && (
                  <span className="text-[11px] font-semibold text-orange flex-shrink-0">Continue</span>
                )}
                {step.state === 'explore' && (
                  <span className="text-[11px] font-medium text-slate-400 flex-shrink-0">Explore</span>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-navy transition flex-shrink-0" aria-hidden />
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
