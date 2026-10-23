'use client'

import Link from 'next/link'
import {
  BookOpen, PlayCircle, Check, Lock, ArrowRight, ArrowLeft, History,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type StageData } from './StageJourney'

export type CompletedStage = StageData & { n: number }

// Read-only review of a stage the learner has already completed. Guides and
// videos can be reopened freely; assessments that have been passed are shown as
// such and cannot be retaken, while any still-outstanding assessment can still
// be taken (the quiz page enforces its own lock on prior attempts).
export default function StageReview({
  stage,
  onBack,
}: {
  stage: CompletedStage
  onBack: () => void
}) {
  const hasAssessments = stage.assessments.length > 0

  return (
    <div className="card p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-teal/30 bg-teal/10 px-3 py-1 text-[12px] font-semibold text-teal">
            <History className="w-3.5 h-3.5" aria-hidden />
            Reviewing a completed stage
          </span>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-tertiary)] hover:text-navy transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden />
            Back to current stage
          </button>
        </div>
        <div>
          <h2 className="text-[24px] font-bold tracking-tight text-navy">{stage.label}</h2>
          <p className="mt-1.5 max-w-[62ch] text-[15.5px] leading-[1.6] text-[var(--text-secondary)]">{stage.blurb}</p>
        </div>
      </div>

      {/* Guides */}
      <div className="space-y-2.5">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
          Guides
        </p>
        <ul className="flex flex-col gap-2.5">
          {stage.guides.map((g) => (
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
                  Read again
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Videos */}
      {stage.videos.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Video walkthroughs
          </p>
          <ul className="flex flex-col gap-2.5">
            {stage.videos.map((v) => (
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

      {/* Assessments — passed ones are locked from retaking; outstanding ones can still be taken */}
      {hasAssessments && (
        <div className="space-y-2.5">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            Assessments
          </p>
          <ul className="flex flex-col gap-2.5">
            {stage.assessments.map((a) =>
              a.passed ? (
                <li
                  key={a.href}
                  className="flex items-center gap-3.5 rounded-2xl border border-navy-100 bg-navy-50/40 px-4 py-3.5"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-teal/10 text-teal flex-shrink-0">
                    <Check className="w-4 h-4" aria-hidden />
                  </span>
                  <span className="flex-1 min-w-0 text-[15px] font-medium text-navy leading-snug">{a.title}</span>
                  <span className="flex items-center gap-1 text-[12.5px] font-semibold text-teal flex-shrink-0">
                    <Lock className="w-3.5 h-3.5" aria-hidden />
                    Passed
                  </span>
                </li>
              ) : (
                <li key={a.href}>
                  <Link
                    href={a.href}
                    className="flex items-center gap-3.5 rounded-2xl border border-navy-100 bg-white px-4 py-3.5 hover:border-orange/40 hover:bg-orange-50/30 transition-colors group"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-navy-50 text-[var(--text-tertiary)] flex-shrink-0">
                      <ArrowRight className="w-4 h-4" aria-hidden />
                    </span>
                    <span className="flex-1 min-w-0 text-[15px] font-medium text-navy leading-snug">{a.title}</span>
                    <span className="text-[12.5px] font-medium text-[var(--text-tertiary)] group-hover:text-orange transition-colors flex items-center gap-1 flex-shrink-0">
                      Take assessment
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden />
                    </span>
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
