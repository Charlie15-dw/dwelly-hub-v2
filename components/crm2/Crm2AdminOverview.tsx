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
import { CheckCircle2, XCircle, ChevronDown, ChevronRight, RefreshCw, LayoutGrid, BookOpen, Wrench } from 'lucide-react'
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
  /** Which 2.0 track the check belongs to. Optional so older callers still fit. */
  track?: 'compliance' | 'maintenance'
}

/** Per-guide read count, one entry per guide across both tracks. */
export interface Crm2GuideUsage {
  slug: string
  title: string
  track: 'compliance' | 'maintenance'
  reads: number
}
/** Per-person read totals, split by track. */
export interface Crm2PersonUsage {
  id: string
  displayName: string
  initials: string
  complianceRead: number
  maintenanceRead: number
}
/** Everything the Usage tab needs — guide reads across both 2.0 tracks. */
export interface Crm2Usage {
  complianceGuideCount: number
  maintenanceGuideCount: number
  peopleEngaged: number
  totalReads: number
  guides: Crm2GuideUsage[]
  people: Crm2PersonUsage[]
}

interface Props {
  assessments: Crm2Assessment[]
  people: Crm2PersonRow[]
  usage: Crm2Usage
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

// A single cell in the scoreboard matrix: the person's latest score for one
// assessment, colour-coded pass/fail — or a muted dash when not yet attempted.
function ScoreCell({ attempt }: { attempt: Crm2Attempt | undefined }) {
  if (!attempt) {
    return (
      <td className="px-2 py-2 text-center">
        <span className="inline-block w-8 text-sm text-slate-300 tabular-nums" aria-label="Not taken">–</span>
      </td>
    )
  }
  return (
    <td className="px-2 py-2 text-center">
      <span
        className={cn(
          'inline-block min-w-[2.75rem] rounded-md px-1.5 py-1 text-xs font-bold tabular-nums',
          attempt.passed
            ? 'text-teal bg-teal/10 border border-teal/20'
            : 'text-red-600 bg-red-50 border border-red-100',
        )}
      >
        {attempt.score}%
      </span>
    </td>
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

// A single track's results table — latest score per person, per assessment, with
// a per-column pass rate and an expandable question breakdown per person. Scoped
// to the assessments and people passed in, so compliance and maintenance each
// get their own board.
function Scoreboard({
  title,
  assessments,
  people,
  expandedPerson,
  setExpandedPerson,
}: {
  title: string
  assessments: Crm2Assessment[]
  people: Crm2PersonRow[]
  expandedPerson: string | null
  setExpandedPerson: (id: string | null) => void
}) {
  const attemptedFor = (p: Crm2PersonRow) =>
    assessments
      .filter((a) => p.attempts[a.id]?.length)
      .map((a) => {
        const list = p.attempts[a.id]!
        return { assessment: a, attempts: list, latest: list[0] }
      })

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
  const passRate = attemptedCells > 0 ? Math.round((passedCells / attemptedCells) * 100) : 0

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-navy">{title}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Latest score per person, per assessment. Click a name to open their full breakdown.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3 text-[11px] font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-teal/10 border border-teal/20" aria-hidden />
            Passed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-red-50 border border-red-100" aria-hidden />
            Failed
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-slate-50 border border-slate-200" aria-hidden />
            Not taken
          </span>
        </div>
      </div>

      {people.length === 0 ? (
        <p className="px-5 py-8 text-center text-xs text-slate-400">
          Nobody has sat a {title.toLowerCase()} knowledge check yet.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="sticky left-0 z-10 bg-white px-5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Person
                  </th>
                  {perAssessment.map((a, i) => (
                    <th
                      key={a.id}
                      title={a.title}
                      className="px-2 py-2.5 text-center text-xs font-bold text-slate-500 tabular-nums"
                    >
                      {i + 1}
                    </th>
                  ))}
                  <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400 whitespace-nowrap">
                    Passed
                  </th>
                  <th className="w-8 px-2 py-2.5" aria-hidden />
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {people.map((person) => {
                  const attempted = attemptedFor(person)
                  const passedCount = attempted.filter((x) => x.latest.passed).length
                  const failCount = attempted.length - passedCount
                  const isOpen = expandedPerson === person.id
                  return (
                    <Fragment key={person.id}>
                      <tr
                        onClick={() => setExpandedPerson(isOpen ? null : person.id)}
                        className={cn('cursor-pointer transition-colors', isOpen ? 'bg-slate-50' : 'hover:bg-slate-50/70')}
                        aria-expanded={isOpen}
                      >
                        <td className={cn('sticky left-0 z-10 px-5 py-2.5', isOpen ? 'bg-slate-50' : 'bg-white')}>
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-[10px] font-bold">{person.initials}</span>
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-navy truncate">{person.displayName}</p>
                              {failCount > 0 && (
                                <p className="text-[11px] text-red-500 font-medium">{failCount} to retake</p>
                              )}
                            </div>
                          </div>
                        </td>
                        {perAssessment.map((a) => (
                          <ScoreCell key={a.id} attempt={person.attempts[a.id]?.[0]} />
                        ))}
                        <td className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 tabular-nums whitespace-nowrap">
                          {passedCount}/{attempted.length}
                        </td>
                        <td className="px-2 py-2.5 text-center">
                          {isOpen
                            ? <ChevronDown className="w-4 h-4 text-slate-400 inline" aria-hidden />
                            : <ChevronRight className="w-4 h-4 text-slate-400 inline" aria-hidden />}
                        </td>
                      </tr>

                      {isOpen && (
                        <tr>
                          <td colSpan={perAssessment.length + 3} className="px-5 py-4 bg-slate-50/60">
                            <div className="space-y-3">
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
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>

              {/* Pass rate per column */}
              <tfoot>
                <tr className="border-t-2 border-slate-100 bg-slate-50/40">
                  <td className="sticky left-0 z-10 bg-slate-50/40 px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    Pass rate
                  </td>
                  {perAssessment.map((a) => {
                    const pct = a.attempted > 0 ? Math.round((a.passed / a.attempted) * 100) : null
                    return (
                      <td key={a.id} className="px-2 py-2.5 text-center">
                        <span
                          className="text-xs font-bold tabular-nums"
                          style={{ color: pct === null ? '#CBD5E1' : pct >= 80 ? '#1A7F37' : pct >= 50 ? '#F59E0B' : '#DC2626' }}
                          title={pct === null ? 'Not taken yet' : `${a.passed}/${a.attempted} passed`}
                        >
                          {pct === null ? '–' : `${pct}%`}
                        </span>
                      </td>
                    )
                  })}
                  <td className="px-4 py-2.5 text-right text-xs font-bold tabular-nums" style={{ color: passRate >= 80 ? '#1A7F37' : passRate >= 50 ? '#F59E0B' : '#DC2626' }}>
                    {passRate}%
                  </td>
                  <td className="px-2 py-2.5" aria-hidden />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Legend: column number → assessment title */}
          <div className="px-5 py-4 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-2">Assessments</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5">
              {perAssessment.map((a, i) => (
                <div key={a.id} className="flex items-baseline gap-2 text-xs">
                  <span className="font-bold text-slate-400 tabular-nums w-4 flex-shrink-0">{i + 1}</span>
                  <span className="text-navy font-medium truncate">{a.title}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// One track's guides, each with a read count and a bar relative to the most-read
// guide in that track — a quick read on which material is landing and which is
// being skipped.
function TrackUsage({
  label,
  icon: Icon,
  guides,
}: {
  label: string
  icon: typeof BookOpen
  guides: Crm2GuideUsage[]
}) {
  const totalReads = guides.reduce((s, g) => s + g.reads, 0)
  const maxReads = Math.max(1, ...guides.map((g) => g.reads))
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
        <Icon className="w-4 h-4 text-orange" aria-hidden />
        <h3 className="text-sm font-bold text-navy">{label}</h3>
        <span className="ml-auto text-xs text-slate-400 tabular-nums">
          {totalReads} {totalReads === 1 ? 'read' : 'reads'} · {guides.length} guides
        </span>
      </div>
      <div className="divide-y divide-slate-50">
        {guides.map((g) => (
          <div key={g.slug} className="px-5 py-2.5 flex items-center gap-3">
            <p className="text-xs font-medium text-navy truncate flex-1 min-w-0" title={g.title}>{g.title}</p>
            <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden flex-shrink-0" aria-hidden>
              <div className="h-full rounded-full bg-orange" style={{ width: `${(g.reads / maxReads) * 100}%` }} />
            </div>
            <span className="text-xs font-bold text-navy tabular-nums w-6 text-right flex-shrink-0">{g.reads}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// The Usage tab: how much of the 2.0 material the team is actually working
// through, across both the compliance and maintenance tracks.
function UsagePanel({ usage }: { usage: Crm2Usage }) {
  const compliance = usage.guides.filter((g) => g.track === 'compliance')
  const maintenance = usage.guides.filter((g) => g.track === 'maintenance')

  if (usage.peopleEngaged === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-sm font-semibold text-slate-500">No reading activity yet</p>
        <p className="text-xs text-slate-400 mt-1">
          Once someone opens a CRM 2.0 guide and marks it read, their progress will show here.
        </p>
      </div>
    )
  }

  const guideTotal = usage.complianceGuideCount + usage.maintenanceGuideCount

  return (
    <div className="space-y-6">
      {/* Headline usage numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Working through 2.0', value: usage.peopleEngaged, sub: 'have opened at least one guide' },
          { label: 'Guide reads', value: usage.totalReads, sub: 'marked read across both tracks' },
          { label: 'Compliance', value: usage.complianceGuideCount, sub: 'guides in the track' },
          { label: 'Maintenance', value: usage.maintenanceGuideCount, sub: 'guides in the track' },
        ].map(({ label, value, sub }) => (
          <div key={label} className="card p-5">
            <p className="text-3xl font-black tabular-nums text-navy">{value}</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Which guides are landing, per track */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrackUsage label="Compliance" icon={BookOpen} guides={compliance} />
        <TrackUsage label="Maintenance" icon={Wrench} guides={maintenance} />
      </div>

      {/* Per-person progress across both tracks */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-navy">Who&rsquo;s reading</h2>
          <p className="text-xs text-slate-400 mt-0.5">Guides marked read per person, per track.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wide text-slate-400">Person</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400 whitespace-nowrap">Compliance</th>
                <th className="px-4 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400 whitespace-nowrap">Maintenance</th>
                <th className="px-5 py-2.5 text-right text-[11px] font-bold uppercase tracking-wide text-slate-400 whitespace-nowrap">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {usage.people.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[10px] font-bold">{p.initials}</span>
                      </div>
                      <p className="text-sm font-semibold text-navy truncate">{p.displayName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 tabular-nums whitespace-nowrap">
                    {p.complianceRead}/{usage.complianceGuideCount}
                  </td>
                  <td className="px-4 py-2.5 text-right text-xs font-semibold text-slate-500 tabular-nums whitespace-nowrap">
                    {p.maintenanceRead}/{usage.maintenanceGuideCount}
                  </td>
                  <td className="px-5 py-2.5 text-right text-xs font-bold text-navy tabular-nums whitespace-nowrap">
                    {p.complianceRead + p.maintenanceRead}/{guideTotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function Crm2AdminOverview({ assessments, people, usage }: Props) {
  const [tab, setTab] = useState<'usage' | 'results' | 'reassign'>('usage')
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
  for (const a of assessments) {
    for (const p of people) {
      const latest = p.attempts[a.id]?.[0]
      if (latest) {
        attemptedCells += 1
        if (latest.passed) passedCells += 1
      }
    }
  }
  const overallPassRate = attemptedCells > 0 ? Math.round((passedCells / attemptedCells) * 100) : 0

  // People whose latest attempt on a check is a fail — the reassign queue.
  const reassignQueue = people
    .map((p) => ({ person: p, fails: attemptedFor(p).filter((x) => !x.latest.passed) }))
    .filter((row) => row.fails.length > 0)
  const totalFails = reassignQueue.reduce((s, r) => s + r.fails.length, 0)

  // Results split by track. A scoreboard only lists people who've sat a check in
  // that track, so the compliance board isn't padded with maintenance-only names
  // (and vice versa).
  const complianceAssessments = assessments.filter((a) => a.track !== 'maintenance')
  const maintenanceAssessments = assessments.filter((a) => a.track === 'maintenance')
  const peopleWithAttemptIn = (list: Crm2Assessment[]) =>
    people.filter((p) => list.some((a) => p.attempts[a.id]?.length))
  const compliancePeople = peopleWithAttemptIn(complianceAssessments)
  const maintenancePeople = peopleWithAttemptIn(maintenanceAssessments)

  return (
    <div className="space-y-6">
      {/* Summary stats — assessment tabs only; Usage carries its own headline. */}
      {tab !== 'usage' && (
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
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {([
          { key: 'usage' as const, label: 'Usage', icon: BookOpen },
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

      {/* ── Usage ────────────────────────────────────────────────────────── */}
      {tab === 'usage' && (
        <UsagePanel usage={usage} />
      )}

      {/* ── Results ──────────────────────────────────────────────────────── */}
      {tab === 'results' && people.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-sm font-semibold text-slate-500">No assessments completed yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Once someone in the CRM 2.0 group sits a knowledge check, their results will appear here.
          </p>
        </div>
      )}
      {tab === 'results' && people.length > 0 && (
        <div className="space-y-6">
          {complianceAssessments.length > 0 && (
            <Scoreboard
              title="Compliance"
              assessments={complianceAssessments}
              people={compliancePeople}
              expandedPerson={expandedPerson}
              setExpandedPerson={setExpandedPerson}
            />
          )}
          {maintenanceAssessments.length > 0 && (
            <Scoreboard
              title="Maintenance"
              assessments={maintenanceAssessments}
              people={maintenancePeople}
              expandedPerson={expandedPerson}
              setExpandedPerson={setExpandedPerson}
            />
          )}
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
