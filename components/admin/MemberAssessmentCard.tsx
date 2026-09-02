'use client'

// One assessment on the admin member page. Collapsed by default to a single
// row (label, latest score, pass/fail, attempts, date); click to reveal the
// attempt history and question breakdown. Keeping it collapsed means opening a
// member shows a tidy list of assessments rather than every question for every
// assessment blown open at once. When expanded, the breakdown leads with the
// questions they got wrong (the actionable part) and tucks the correct ones
// behind a toggle.

import { useState } from 'react'
import { CheckCircle2, XCircle, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnswerEntry {
  question: string
  yourAnswer: string
  correctAnswer: string
  isCorrect: boolean
  rationale: string
}

export interface MemberAttempt {
  score: number
  passed: boolean
  answers: unknown
  completed_at: string
}

function formatDate(iso: string | null) {
  return iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—'
}

function AnswerCard({ ans }: { ans: AnswerEntry }) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4',
        ans.isCorrect ? 'border-teal/20 bg-teal/3' : 'border-red-200 bg-red-50/40',
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className="mt-0.5 flex-shrink-0">
          {ans.isCorrect
            ? <CheckCircle2 className="w-4 h-4 text-teal" />
            : <XCircle className="w-4 h-4 text-red-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-navy leading-snug">{ans.question}</p>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 w-20 flex-shrink-0 mt-0.5">Their answer</span>
              <span className={cn('text-xs leading-relaxed font-medium', ans.isCorrect ? 'text-teal' : 'text-red-600')}>
                {ans.yourAnswer}
              </span>
            </div>
            {!ans.isCorrect && (
              <div className="flex items-start gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 w-20 flex-shrink-0 mt-0.5">Correct</span>
                <span className="text-xs text-teal font-medium leading-relaxed">{ans.correctAnswer}</span>
              </div>
            )}
            {ans.rationale && (
              <div className="flex items-start gap-2 mt-1 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 w-20 flex-shrink-0 mt-0.5">Rationale</span>
                <span className="text-xs text-slate-500 leading-relaxed">{ans.rationale}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// The question breakdown for one attempt: wrong answers up front, correct ones
// behind a toggle so the view stays scannable.
function AnswerBreakdown({ answers }: { answers: AnswerEntry[] }) {
  const [showCorrect, setShowCorrect] = useState(false)
  if (answers.length === 0) {
    return <p className="px-5 pb-4 text-xs text-slate-400">No answer detail available for this attempt.</p>
  }
  const wrongCount = answers.filter(a => !a.isCorrect).length
  const correctCount = answers.length - wrongCount
  return (
    <div className="px-5 pb-5 space-y-3">
      {wrongCount === 0 && !showCorrect ? (
        <p className="flex items-center gap-1.5 text-xs font-medium text-teal">
          <CheckCircle2 className="w-3.5 h-3.5" />
          All {answers.length} answers correct
        </p>
      ) : (
        answers.map((ans, qi) => (!showCorrect && ans.isCorrect ? null : <AnswerCard key={qi} ans={ans} />))
      )}
      {correctCount > 0 && (
        <button
          type="button"
          onClick={() => setShowCorrect(v => !v)}
          className="text-xs font-semibold text-slate-500 hover:text-navy transition-colors"
        >
          {showCorrect
            ? 'Hide correct answers'
            : `Show ${correctCount} correct answer${correctCount !== 1 ? 's' : ''}`}
        </button>
      )}
    </div>
  )
}

export default function MemberAssessmentCard({ label, attempts }: { label: string; attempts: MemberAttempt[] }) {
  const [open, setOpen] = useState(false)
  const latest = attempts[0]
  const latestDate = formatDate(latest.completed_at ?? null)
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-slate-50/60 transition-colors"
        aria-expanded={open}
      >
        {open
          ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden />
          : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden />}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-navy truncate">{label}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {attempts.length} attempt{attempts.length !== 1 ? 's' : ''} · {latestDate}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {latest.passed ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-teal bg-teal/10 border border-teal/20 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Passed
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
              <XCircle className="w-3.5 h-3.5" /> Failed
            </span>
          )}
          <span className={cn('text-lg font-black tabular-nums', {
            'text-teal': latest.score >= 80,
            'text-amber-500': latest.score >= 65 && latest.score < 80,
            'text-red-500': latest.score < 65,
          })}>
            {latest.score}%
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100">
          {attempts.map((attempt, attemptIdx) => {
            const answers: AnswerEntry[] = Array.isArray(attempt.answers) ? attempt.answers : []
            const correctCount = answers.filter(a => a.isCorrect).length
            return (
              <div key={attemptIdx} className={cn('border-b border-slate-50 last:border-b-0', attemptIdx > 0 && 'bg-slate-50/40')}>
                <div className="px-5 py-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium text-slate-500">
                    {attempts.length > 1 ? `Attempt ${attempts.length - attemptIdx}${attemptIdx === 0 ? ' · latest' : ''}` : 'Latest attempt'} · {formatDate(attempt.completed_at ?? null)}
                  </span>
                  {answers.length > 0 && <span>{correctCount}/{answers.length} correct</span>}
                </div>
                <AnswerBreakdown answers={answers} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
