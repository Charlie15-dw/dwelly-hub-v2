'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BookOpen, PlayCircle, ClipboardCheck, Check, Lock, ArrowRight, Loader2,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StageData {
  label: string
  blurb: string
  guides: { title: string; href: string; done: boolean }[]
  videos: { title: string; href: string }[]
  assessments: { title: string; href: string; passed: boolean }[]
  guidesComplete: boolean
  assessmentsUnlocked: boolean
  assessmentsComplete: boolean
  canAdvance: boolean
}

export default function StageJourney({
  state,
  stage,
  totalStages,
}: {
  state: StageData
  stage: number
  totalStages: number
}) {
  const router = useRouter()
  const [tab, setTab] = useState<'guides' | 'assessments'>('guides')
  const [advancing, setAdvancing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLastStage = stage >= totalStages
  const doneCount = state.guides.filter((g) => g.done).length
  const hasAssessments = state.assessments.length > 0

  async function advance() {
    if (!state.canAdvance || advancing) return
    setAdvancing(true)
    setError(null)
    try {
      const res = await fetch('/api/onboarding/advance', { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body?.error ?? 'Couldn\u2019t move on — please try again.')
        setAdvancing(false)
        return
      }
      const body = await res.json().catch(() => ({})) as { graduated?: boolean }
      if (body.graduated) {
        router.push('/hub')
      } else {
        router.refresh()
        setAdvancing(false)
      }
    } catch {
      setError('Couldn\u2019t move on — please try again.')
      setAdvancing(false)
    }
  }

  return (
    <div className="card p-6 sm:p-8 space-y-6">
      {/* Stage header */}
      <div>
        <h2 className="text-[24px] font-bold tracking-tight text-navy">{state.label}</h2>
        <p className="mt-1.5 max-w-[62ch] text-[15.5px] leading-[1.6] text-[var(--text-secondary)]">{state.blurb}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-navy-100">
        <TabButton active={tab === 'guides'} onClick={() => setTab('guides')}>
          <BookOpen className="w-4 h-4" aria-hidden />
          Guides
          <span className="ml-1 text-[12px] tabular-nums text-[var(--text-tertiary)]">
            {doneCount}/{state.guides.length}
          </span>
        </TabButton>
        {hasAssessments && (
          <TabButton
            active={tab === 'assessments'}
            onClick={() => state.assessmentsUnlocked && setTab('assessments')}
            disabled={!state.assessmentsUnlocked}
          >
            {state.assessmentsUnlocked ? <ClipboardCheck className="w-4 h-4" aria-hidden /> : <Lock className="w-3.5 h-3.5" aria-hidden />}
            Assessments
            {!state.assessmentsUnlocked && (
              <span className="ml-1 text-[12px] text-[var(--text-tertiary)]">Come back to this</span>
            )}
          </TabButton>
        )}
      </div>

      {/* Guides tab */}
      {tab === 'guides' && (
        <div className="space-y-5">
          <ul className="flex flex-col gap-2.5">
            {state.guides.map((g) => (
              <li key={g.href}>
                <Link
                  href={g.href}
                  className="flex items-center gap-3.5 rounded-2xl border border-navy-100 bg-white px-4 py-3.5 hover:border-orange/40 hover:bg-orange-50/30 transition-colors group"
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0',
                      g.done ? 'bg-teal/10 text-teal' : 'bg-navy-50 text-[var(--text-tertiary)]',
                    )}
                  >
                    {g.done ? <Check className="w-4 h-4" aria-hidden /> : <BookOpen className="w-4 h-4" aria-hidden />}
                  </span>
                  <span className="flex-1 min-w-0 text-[15px] font-medium text-navy leading-snug">{g.title}</span>
                  <span className="text-[12.5px] font-medium text-[var(--text-tertiary)] group-hover:text-orange transition-colors flex items-center gap-1 flex-shrink-0">
                    {g.done ? 'Read again' : 'Read'}
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {state.videos.length > 0 && (
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-2.5">
                Video walkthroughs
              </p>
              <ul className="flex flex-col gap-2.5">
                {state.videos.map((v) => (
                  <li key={v.href}>
                    <Link
                      href={v.href}
                      className="flex items-center gap-3.5 rounded-2xl border border-navy-100 bg-white px-4 py-3.5 hover:border-orange/40 hover:bg-orange-50/30 transition-colors group"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-navy-50 text-navy flex-shrink-0">
                        <PlayCircle className="w-4 h-4" aria-hidden />
                      </span>
                      <span className="flex-1 min-w-0 text-[15px] font-medium text-navy leading-snug">{v.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-orange transition-colors flex-shrink-0" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Assessments tab */}
      {tab === 'assessments' && (
        <div className="space-y-3">
          <p className="text-[14px] text-[var(--text-secondary)] leading-relaxed">
            Take these when you&rsquo;re ready — you can move on to the next stage and come back to any you
            haven&rsquo;t passed yet.
          </p>
          <ul className="flex flex-col gap-2.5">
            {state.assessments.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="flex items-center gap-3.5 rounded-2xl border border-navy-100 bg-white px-4 py-3.5 hover:border-orange/40 hover:bg-orange-50/30 transition-colors group"
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0',
                      a.passed ? 'bg-teal/10 text-teal' : 'bg-navy-50 text-[var(--text-tertiary)]',
                    )}
                  >
                    {a.passed ? <Check className="w-4 h-4" aria-hidden /> : <ClipboardCheck className="w-4 h-4" aria-hidden />}
                  </span>
                  <span className="flex-1 min-w-0 text-[15px] font-medium text-navy leading-snug">{a.title}</span>
                  <span className="text-[12.5px] font-medium text-[var(--text-tertiary)] group-hover:text-orange transition-colors flex items-center gap-1 flex-shrink-0">
                    {a.passed ? 'Passed' : 'Start'}
                    {!a.passed && <ArrowRight className="w-3.5 h-3.5" aria-hidden />}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Advance */}
      <div className="border-t border-navy-100 pt-5 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-[14px] text-[var(--text-secondary)]">
          {state.canAdvance
            ? hasAssessments && !state.assessmentsComplete
              ? 'Guides done. You can move on now and return to the assessments later.'
              : 'Guides done — you\u2019re ready to move on.'
            : `Read all ${state.guides.length} guide${state.guides.length === 1 ? '' : 's'} to unlock the next stage.`}
        </p>
        <button
          type="button"
          onClick={advance}
          disabled={!state.canAdvance || advancing}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {advancing && <Loader2 className="w-4 h-4 animate-spin" aria-hidden />}
          {isLastStage ? 'Finish & open the Hub' : 'Continue to next stage'}
          {!advancing && <ArrowRight className="w-4 h-4" aria-hidden />}
        </button>
      </div>
      {error && <p className="text-[13px] text-red-600">{error}</p>}
    </div>
  )
}

function TabButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center gap-1.5 px-4 py-2.5 text-[14px] font-semibold border-b-2 -mb-px transition-colors',
        active ? 'border-orange text-navy' : 'border-transparent text-[var(--text-tertiary)] hover:text-navy',
        disabled && 'cursor-not-allowed hover:text-[var(--text-tertiary)]',
      )}
    >
      {children}
    </button>
  )
}
