'use client'

// The admin command centre for CRM 2.0 assessments. One screen that answers:
// who has been assessed, how are they doing, and which knowledge checks are
// tripping people up — with a reassign control on any failed attempt so a
// retake can be granted without leaving the 2.0 section.
//
// Presentational only: all data is computed server-side (latest attempt per
// person/assessment, plus any pending reset) and passed in. State here is just
// the expanded-row UI.

import { Fragment, useState } from 'react'
import { Sparkles, CheckCircle2, XCircle, ChevronDown } from 'lucide-react'
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
  /** Latest attempt keyed by assessment id. Absent = not attempted. */
  attempts: Record<string, Crm2Attempt>
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

export default function Crm2AdminOverview({ assessments, people }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  // ── Derived stats ────────────────────────────────────────────────────────
  let attemptedCells = 0
  let passedCells = 0
  const perAssessment = assessments.map((a) => {
    let attempted = 0
    let passed = 0
    for (const p of people) {
      const at = p.attempts[a.id]
      if (at) {
        attempted += 1
        attemptedCells += 1
        if (at.passed) {
          passed += 1
          passedCells += 1
        }
      }
    }
    return { ...a, attempted, passed }
  })
  const overallPassRate = attemptedCells > 0 ? Math.round((passedCells / attemptedCells) * 100) : 0

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
      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'People assessed', value: people.length, sub: 'have taken at least one check' },
          { label: 'Overall pass rate', value: `${overallPassRate}%`, sub: `${passedCells} of ${attemptedCells} attempts passed`, accent: overallPassRate >= 80 ? 'text-teal' : overallPassRate >= 50 ? 'text-amber-500' : 'text-red-500' },
          { label: 'Assessments', value: assessments.length, sub: 'knowledge checks in CRM 2.0' },
        ].map(({ label, value, sub, accent }) => (
          <div key={label} className="card p-5">
            <p className={cn('text-3xl font-black tabular-nums', accent ?? 'text-navy')}>{value}</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Pass rate per assessment — spot the checks that are tripping people up */}
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

      {/* Results matrix — every person, every assessment. Click a cell to see the
          question breakdown and reassign. */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0071E3]" aria-hidden />
          <h2 className="text-sm font-bold text-navy">Assessment results</h2>
          <span className="ml-auto text-xs text-slate-400">Click a score to see the breakdown &amp; reassign</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap sticky left-0 bg-slate-50/80" scope="col">
                  Team Member
                </th>
                {assessments.map((a) => (
                  <th key={a.id} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap" scope="col">
                    {a.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {people.map((person) => {
                const openKey = expanded?.startsWith(`${person.id}::`) ? expanded : null
                const openAssessmentId = openKey ? openKey.split('::')[1] : null
                const openAttempt = openAssessmentId ? person.attempts[openAssessmentId] : null
                const openAssessment = assessments.find((a) => a.id === openAssessmentId)
                return (
                  <Fragment key={person.id}>
                    <tr className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap sticky left-0 bg-white">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[11px] font-bold">{person.initials}</span>
                          </div>
                          <p className="text-sm font-medium text-navy">{person.displayName}</p>
                        </div>
                      </td>
                      {assessments.map((a) => {
                        const at = person.attempts[a.id]
                        const key = `${person.id}::${a.id}`
                        const isOpen = expanded === key
                        return (
                          <td key={a.id} className="px-4 py-3 whitespace-nowrap">
                            {at ? (
                              <button
                                type="button"
                                onClick={() => setExpanded(isOpen ? null : key)}
                                className={cn(
                                  'inline-flex items-center gap-1 rounded-full transition-transform hover:scale-105',
                                  isOpen && 'ring-2 ring-[#0071E3]/30 ring-offset-1 rounded-full',
                                )}
                                aria-expanded={isOpen}
                              >
                                <ScoreBadge passed={at.passed} score={at.score} />
                              </button>
                            ) : (
                              <span className="text-xs text-slate-300">Not completed</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>

                    {openAttempt && openAssessment && (
                      <tr className="bg-slate-50/60">
                        <td colSpan={assessments.length + 1} className="px-4 py-4">
                          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                              <div className="flex items-center gap-2 min-w-0">
                                <ChevronDown className="w-4 h-4 text-[#0071E3] flex-shrink-0" aria-hidden />
                                <p className="text-sm font-bold text-navy truncate">
                                  {person.displayName} · {openAssessment.title}
                                </p>
                                <ScoreBadge passed={openAttempt.passed} score={openAttempt.score} />
                                {openAttempt.completedAt && (
                                  <span className="text-xs text-slate-400">
                                    {new Date(openAttempt.completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                              {!openAttempt.passed && (
                                <ReassignButton
                                  userId={person.id}
                                  moduleId={openAssessment.id}
                                  moduleName={openAssessment.title}
                                  pending={person.pending.includes(openAssessment.id)}
                                />
                              )}
                            </div>

                            {openAttempt.answers.length > 0 ? (
                              <div className="p-4 space-y-3">
                                {openAttempt.answers.map((ans, qi) => (
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
                            ) : (
                              <p className="px-4 py-4 text-xs text-slate-400">No answer detail available for this attempt.</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
