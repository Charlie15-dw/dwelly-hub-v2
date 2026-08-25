'use client'

// The admin command centre for CRM 2.0 assessments. One screen that answers:
// who has been assessed, how are they doing, and which knowledge checks are
// tripping people up — with a reassign control on any failed attempt so a
// retake can be granted without leaving the 2.0 section.
//
// Two tabs:
//   • Results  — summary + pass-rate-by-assessment + a member table. Click a
//                person to open their FULL overview (every assessment at once,
//                with the question breakdown and a reassign on any fail).
//   • Reassign — a focused queue of everyone who has failed at least one check,
//                so retakes can be granted in one place.
//
// Presentational only: all data is computed server-side (latest attempt per
// person/assessment, plus any pending reset) and passed in.

import { Fragment, useState } from 'react'
import { Sparkles, CheckCircle2, XCircle, ChevronDown, ChevronRight, RefreshCw, LayoutGrid } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReassignButton from '@/components/ui/ReassignButton'

interface AnswerEntry {
  question: string
  yourAnswer: string
  correctAnswer: string
  isCorrect: boolean
  rationale: string
}
export interface Crm2Attempt {
  score: number
  passed: boolean
  answers: AnswerEntry[]
  completedAt: string | null
}
export interface Crm2PersonRow {
  id: string
  displayName: string
  initials: string
  /**
   * All attempts keyed by assessment id, newest-first (index 0 is the latest).
   * Absent = not attempted. Keeping the full history means a prior attempt stays
   * visible even after a retake.
   */
  attempts: Record<string, Crm2Attempt[]>
  /** Assessment ids with an unconsumed reset already queued. */
  pending: string[]
}
export interface Crm2Assessment {
  id: string
  title: string
}

interface Props {
  assessments: Crm2Assessment[]
  people: Crm2PersonRow[]
}

function ScoreBadge({ passed, score }: { passed: boolean; score: number }) {
  return passed ? (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal bg-teal/10 border border-teal/20 rounded-full px-2.5 py-0.5">
      <CheckCircle2 className="w-3 h-3" aria-hidden />
      {score}%
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-full px-2.5 py-0.5">
      <XCircle className="w-3 h-3" aria-hidden />
      {score}%
    </span>
  )
}

function formatDate(iso: string | null) {
  return iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : null
}

// The question-by-question breakdown for a single attempt.
function AnswerList({ answers }: { answers: AnswerEntry[] }) {
  if (answers.length === 0) {
    return <p className="px-4 py-4 text-xs text-slate-400">No answer detail available for this attempt.</p>
  }
  return (
    <div className="p-4 space-y-3">
      {answers.map((ans, qi) => (
        <div
          key={qi}
          className={cn(
            'rounded-xl border p-3.5',
            ans.isCorrect ? 'border-teal/20 bg-teal/5' : 'border-red-200 bg-red-50/40',
          )}
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 flex-shrink-0">
              {ans.isCorrect
                ? <CheckCircle2 className="w-4 h-4 text-teal" aria-hidden />
                : <XCircle className="w-4 h-4 text-red-500" aria-hidden />}
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
      ))}
    </div>
  )
}

// One assessment for one person — pass/fail header (latest attempt), reassign on
// fail, and the full attempt history. Every retake is recorded, so prior
// attempts stay visible beneath the latest rather than being replaced.
function AssessmentDetail({
  person,
  assessment,
  attempts,
}: {
  person: Crm2PersonRow
  assessment: Crm2Assessment
  attempts: Crm2Attempt[]
}) {
  const latest = attempts[0]
  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-sm font-bold text-navy truncate">{assessment.title}</p>
          <ScoreBadge passed={latest.passed} score={latest.score} />
          <span className="text-xs text-slate-400">
            {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
          </span>
        </div>
        {!latest.passed && (
          <ReassignButton
            userId={person.id}
            moduleId={assessment.id}
            moduleName={assessment.title}
            pending={person.pending.includes(assessment.id)}
          />
        )}
      </div>

      {attempts.map((attempt, idx) => {
        const date = formatDate(attempt.completedAt)
        return (
          <div key={idx} className={cn('border-b border-slate-50 last:border-b-0', idx > 0 && 'bg-slate-50/50')}>
            <div className="px-4 py-2.5 flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">
                {attempts.length > 1 ? `Attempt ${attempts.length - idx}${idx === 0 ? ' · latest' : ''}` : 'Attempt'}
              </span>
              <ScoreBadge passed={attempt.passed} score={attempt.score} />
              {date && <span className="text-slate-400">{date}</span>}
            </div>
            <AnswerList answers={attempt.answers} />
          </div>
        )
      })}
    </div>
  )
}

export default function Crm2AdminOverview({ assessments, people }: Props) {
  const [tab, setTab] = useState<'results' | 'reassign'>('results')
  const [expandedPerson, setExpandedPerson] = useState<string | null>(null)

  // Everything a person has actually attempted, in assessment order. Each entry
  // carries the full attempt list plus the latest (index 0) for at-a-glance use.
  const attemptedFor = (p: Crm2PersonRow) =>
    assessments
      .filter((a) => p.attempts[a.id]?.length)
      .map((a) => {
        const list = p.attempts[a.id]!
        return { assessment: a, attempts: list, latest: list[0] }
      })

  // ── Derived stats ──────────────────────────────────────────────────────── (based on each person's latest attempt per check)
  let attemptedCells = 0
  let passedCells = 0
  const perAssessment = assessments.map((a) => {
    let attempted = 0
    let passed = 0
    for (const p of people) {
      const latest = p.attempts[a.id]?.[0]
      if (latest) {
        attempted += 1
        attemptedCells += 1
        if (latest.passed) {
          passed += 1
          passedCells += 1
        }
      }
    }
    return { ...a, attempted, passed }
  })
  const overallPassRate = attemptedCells > 0 ? Math.round((passedCells / attemptedCells) * 100) : 0

  // People whose latest attempt on a check is a fail — the reassign queue.
  const reassignQueue = people
    .map((p) => ({ person: p, fails: attemptedFor(p).filter((x) => !x.latest.passed) }))
    .filter((row) => row.fails.length > 0)
  const totalFails = reassignQueue.reduce((s, r) => s + r.fails.length, 0)

  if (people.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-sm font-semibold text-slate-500">No assessments completed yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Once someone in the CRM 2.0 group sits a knowledge check, their results will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary stats — always visible */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'People assessed', value: people.length, sub: 'have taken at least one check' },
          { label: 'Overall pass rate', value: `${overallPassRate}%`, sub: `${passedCells} of ${attemptedCells} attempts passed`, accent: overallPassRate >= 80 ? 'text-teal' : overallPassRate >= 50 ? 'text-amber-500' : 'text-red-500' },
          { label: 'Need a retake', value: totalFails, sub: `${reassignQueue.length} ${reassignQueue.length === 1 ? 'person' : 'people'} with a fail`, accent: totalFails > 0 ? 'text-red-500' : 'text-navy' },
          { label: 'Assessments', value: assessments.length, sub: 'knowledge checks in CRM 2.0' },
        ].map(({ label, value, sub, accent }) => (
          <div key={label} className="card p-5">
            <p className={cn('text-3xl font-black tabular-nums', accent ?? 'text-navy')}>{value}</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {([
          { key: 'results' as const, label: 'Results', icon: LayoutGrid },
          { key: 'reassign' as const, label: 'Reassign', icon: RefreshCw, count: totalFails },
        ]).map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors',
              tab === key ? 'bg-white text-navy shadow-sm' : 'text-slate-500 hover:text-navy',
            )}
            aria-current={tab === key}
          >
            <Icon className="w-4 h-4" aria-hidden />
            {label}
            {typeof count === 'number' && count > 0 && (
              <span className={cn(
                'text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded-full',
                tab === key ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500',
              )}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {tab === 'results' && (
        <div className="space-y-6">
          {/* Pass rate per assessment */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h2 className="text-sm font-bold text-navy">Pass rate by assessment</h2>
              <p className="text-xs text-slate-400 mt-0.5">Share of people who have passed each knowledge check</p>
            </div>
            <div className="divide-y divide-slate-50">
              {perAssessment.map((a) => {
                const pct = a.attempted > 0 ? Math.round((a.passed / a.attempted) * 100) : 0
                return (
                  <div key={a.id} className="px-5 py-3.5 flex items-center gap-4">
                    <p className="text-sm font-medium text-navy flex-1 min-w-0 truncate">{a.title}</p>
                    <div className="w-32 flex-shrink-0">
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: pct >= 80 ? '#1A7F37' : pct >= 50 ? '#F59E0B' : '#DC2626' }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 tabular-nums w-24 text-right flex-shrink-0">
                      {a.passed}/{a.attempted} passed
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Members — click a person to open their full overview */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0071E3]" aria-hidden />
              <h2 className="text-sm font-bold text-navy">Members</h2>
              <span className="ml-auto text-xs text-slate-400">Click a person to see their full breakdown</span>
            </div>
            <div className="divide-y divide-slate-50">
              {people.map((person) => {
                const attempted = attemptedFor(person)
                const passedCount = attempted.filter((x) => x.latest.passed).length
                const failCount = attempted.length - passedCount
                const isOpen = expandedPerson === person.id
                return (
                  <Fragment key={person.id}>
                    <button
                      type="button"
                      onClick={() => setExpandedPerson(isOpen ? null : person.id)}
                      className="w-full text-left px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50/70 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{person.initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy">{person.displayName}</p>
                        <p className="text-xs text-slate-400">
                          {attempted.length} of {assessments.length} taken · {passedCount} passed
                          {failCount > 0 && <span className="text-red-500 font-medium"> · {failCount} to retake</span>}
                        </p>
                      </div>
                      {/* Compact per-assessment badges — latest attempt each */}
                      <div className="hidden md:flex items-center gap-1.5 flex-shrink-0">
                        {attempted.map(({ assessment, latest }) => (
                          <ScoreBadge key={assessment.id} passed={latest.passed} score={latest.score} />
                        ))}
                      </div>
                      {isOpen
                        ? <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden />
                        : <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden />}
                    </button>

                    {isOpen && (
                      <div className="px-5 py-4 bg-slate-50/60 space-y-3">
                        {attempted.length === 0 ? (
                          <p className="text-xs text-slate-400">No assessments attempted yet.</p>
                        ) : (
                          attempted.map(({ assessment, attempts }) => (
                            <AssessmentDetail
                              key={assessment.id}
                              person={person}
                              assessment={assessment}
                              attempts={attempts}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </Fragment>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Reassign ─────────────────────────────────────────────────────── */}
      {tab === 'reassign' && (
        <div className="space-y-4">
          {reassignQueue.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="w-11 h-11 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-5 h-5" aria-hidden />
              </div>
              <p className="text-sm font-semibold text-slate-500">Nobody needs a retake</p>
              <p className="text-xs text-slate-400 mt-1">Everyone who has sat a CRM 2.0 assessment has passed it.</p>
            </div>
          ) : (
            reassignQueue.map(({ person, fails }) => (
              <div key={person.id} className="card overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">{person.initials}</span>
                  </div>
                  <p className="text-sm font-semibold text-navy">{person.displayName}</p>
                  <span className="ml-auto text-xs text-red-500 font-medium">
                    {fails.length} to retake
                  </span>
                </div>
                <div className="p-4 flex flex-wrap gap-3">
                  {fails.map(({ assessment, latest }) => (
                    <div key={assessment.id} className="rounded-xl border border-red-100 bg-red-50/50 px-4 py-3 flex items-center gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-navy truncate max-w-[220px]">{assessment.title}</p>
                        <p className="text-[11px] text-red-500">Score: {latest.score}% · Failed</p>
                      </div>
                      <ReassignButton
                        userId={person.id}
                        moduleId={assessment.id}
                        moduleName={assessment.title}
                        pending={person.pending.includes(assessment.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
