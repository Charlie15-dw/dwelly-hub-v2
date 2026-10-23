'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Lock, Award, GraduationCap, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import StageJourney, { type StageData } from './StageJourney'
import StageReview, { type CompletedStage } from './StageReview'

interface CourseData {
  id: string
  title: string
  blurb: string
  href: string
  passed: boolean
}

export default function OnboardingTabs({
  stages,
  currentStage,
  state,
  completedStages,
  totalStages,
  courses,
}: {
  stages: { n: number; label: string }[]
  currentStage: number
  state: StageData
  completedStages: CompletedStage[]
  totalStages: number
  courses: CourseData[]
}) {
  const [view, setView] = useState<'training' | 'courses'>('training')
  // null = viewing the live current stage; a number = reviewing that completed stage.
  const [reviewStage, setReviewStage] = useState<number | null>(null)
  const coursesPassed = courses.filter((c) => c.passed).length
  const reviewing = reviewStage !== null ? completedStages.find((s) => s.n === reviewStage) ?? null : null

  return (
    <div className="space-y-6">
      {/* Top-level tabs: the guided training vs. the certified courses */}
      <div className="flex items-center gap-1 border-b border-navy-100">
        <TopTab active={view === 'training'} onClick={() => setView('training')}>
          <GraduationCap className="w-4 h-4" aria-hidden />
          Your training
        </TopTab>
        {courses.length > 0 && (
          <TopTab active={view === 'courses'} onClick={() => setView('courses')}>
            <Award className="w-4 h-4" aria-hidden />
            Knowledge Base Courses
            <span className="ml-1 text-[12px] tabular-nums text-[var(--text-tertiary)]">
              {coursesPassed}/{courses.length}
            </span>
          </TopTab>
        )}
      </div>

      {view === 'training' && (
        <div className="space-y-8">
          {/* Stepper — completed and current steps are clickable to review/return */}
          <ol className="flex flex-wrap gap-2">
            {stages.map((s) => {
              const done = s.n < currentStage
              const current = s.n === currentStage
              const selected = reviewStage === null ? current : reviewStage === s.n
              const clickable = done || current

              const content = (
                <>
                  <span
                    className={cn(
                      'flex items-center justify-center w-5 h-5 rounded-full text-[11px] font-bold',
                      selected && 'bg-white/20',
                      !selected && done && 'bg-teal text-white',
                      !selected && !done && 'bg-navy-50',
                    )}
                  >
                    {done ? <Check className="w-3 h-3" aria-hidden /> : !current ? <Lock className="w-2.5 h-2.5" aria-hidden /> : s.n}
                  </span>
                  {s.label}
                </>
              )

              const className = cn(
                'flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors',
                // The selected pill (current stage when not reviewing, or the stage being reviewed) is navy-filled
                selected && 'border-navy bg-navy text-white',
                // Completed, not selected
                !selected && done && 'border-teal/30 bg-teal/10 text-teal hover:border-teal/60',
                // Future, not selected
                !selected && !done && !current && 'border-navy-100 bg-white text-[var(--text-tertiary)]',
                // Current, not selected (i.e. while reviewing an earlier stage)
                !selected && current && 'border-navy-100 bg-white text-navy hover:border-navy/40',
                clickable && 'cursor-pointer',
              )

              return (
                <li key={s.n}>
                  {clickable ? (
                    <button
                      type="button"
                      onClick={() => setReviewStage(current ? null : s.n)}
                      className={className}
                    >
                      {content}
                    </button>
                  ) : (
                    <span className={className}>{content}</span>
                  )}
                </li>
              )
            })}
          </ol>

          {reviewing ? (
            <StageReview stage={reviewing} onBack={() => setReviewStage(null)} />
          ) : (
            <StageJourney state={state} stage={currentStage} totalStages={totalStages} />
          )}
        </div>
      )}

      {view === 'courses' && (
        <div className="card p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-[24px] font-bold tracking-tight text-navy">Knowledge Base Courses</h2>
            <p className="mt-1.5 max-w-[62ch] text-[15.5px] leading-[1.6] text-[var(--text-secondary)]">
              Certified courses you can take any time during your onboarding. Pass each one to earn a
              downloadable Dwelly certificate.
            </p>
          </div>
          <ul className="flex flex-col gap-2.5">
            {courses.map((c) => (
              <li key={c.id}>
                <Link
                  href={c.href}
                  className="flex items-center gap-3.5 rounded-2xl border border-navy-100 bg-white px-4 py-3.5 hover:border-orange/40 hover:bg-orange-50/30 transition-colors group"
                >
                  <span
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-xl flex-shrink-0',
                      c.passed ? 'bg-teal/10 text-teal' : 'bg-navy-50 text-[var(--text-tertiary)]',
                    )}
                  >
                    {c.passed ? <Check className="w-4 h-4" aria-hidden /> : <Award className="w-4 h-4" aria-hidden />}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15px] font-medium text-navy leading-snug">{c.title}</span>
                    <span className="block text-[12.5px] text-[var(--text-tertiary)] mt-0.5 leading-snug">{c.blurb}</span>
                  </span>
                  <span className="text-[12.5px] font-medium text-[var(--text-tertiary)] group-hover:text-orange transition-colors flex items-center gap-1 flex-shrink-0">
                    {c.passed ? 'Certified' : 'Start'}
                    {!c.passed && <ArrowRight className="w-3.5 h-3.5" aria-hidden />}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function TopTab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-4 py-2.5 text-[14px] font-semibold border-b-2 -mb-px transition-colors',
        active ? 'border-orange text-navy' : 'border-transparent text-[var(--text-tertiary)] hover:text-navy',
      )}
    >
      {children}
    </button>
  )
}
