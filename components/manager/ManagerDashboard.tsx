'use client'

// Manager dashboard — tabbed shell.
//
// Mirrors the admin refresh: the old single-scroll page (team directory → RAG
// → heatmap → CRM 2.0 → reassignments → assignment → learning profiles → recap)
// is split into jump-able segmented tabs (Overview · Team · Manage ·
// Development) with a sticky nav. All data is computed server-side and passed
// in as serializable props; this component is purely presentational and owns
// the tab state in the browser.

import { useState } from 'react'
import {
  Users, CheckCircle2, Brain, RefreshCw, CalendarCheck, Activity,
  LayoutGrid, ClipboardList,
} from 'lucide-react'
import TeamAssignmentPanel from '@/components/ui/TeamAssignmentPanel'
import ReassignButton from '@/components/ui/ReassignButton'
import WrongAnswersPanel from '@/components/ui/WrongAnswersPanel'
import { cn } from '@/lib/utils'
import { RAG_DOT, RAG_LABEL } from '@/lib/rag'
import CompetencyHeatmap from '@/components/manager/CompetencyHeatmap'
import PeopleDirectory, { type DirectoryPerson } from '@/components/manager/PeopleDirectory'
import Crm2AssessmentPanel from '@/components/manager/Crm2AssessmentPanel'
import UsageDashboard from '@/components/usage/UsageDashboard'
import type { UsageEvent } from '@/lib/usage'

interface Member { id: string; displayName: string; initials: string }
interface HeatmapResult { user_id: string; assessment_id: string; score: number }
interface Crm2Result {
  user_id: string
  assessment_id: string
  score: number
  passed: boolean
  completed_at: string | null
}
interface FailedModule { assessmentId: string; label: string; score: number }
interface ReassignMember extends Member { failedModules: FailedModule[] }
interface AssignPerson { id: string; displayName: string; email: string | null; manager_id: string | null }
interface LearningCard extends Member {
  lp: {
    style_label: string | null
    style_icon: string | null
    confidence_label: string | null
    confidence_pct: number | null
    manager_note: string | null
    completed_at: string | null
  } | null
}
interface RecapCell { roundId: string; month: string; score: number | null }
interface RecapRow extends Member { cells: RecapCell[] }

interface Props {
  teamCount: number
  avgProgress: number
  ragCounts: { green: number; amber: number; red: number }
  directoryPeople: DirectoryPerson[]
  beta: boolean
  heatmapMembers: Member[]
  heatmapResults: HeatmapResult[]
  crm2People: Member[]
  crm2Results: Crm2Result[]
  usageEvents: UsageEvent[]
  reassignMembers: ReassignMember[]
  assignUnassigned: AssignPerson[]
  assignMyTeam: AssignPerson[]
  managerId: string
  learningCards: LearningCard[]
  recapRows: RecapRow[]
  recapMonths: { id: string; month: string }[]
  totalAssessments: number
}

type TabKey = 'overview' | 'team' | 'usage' | 'manage' | 'development'

export default function ManagerDashboard({
  teamCount,
  avgProgress,
  ragCounts,
  directoryPeople,
  beta,
  heatmapMembers,
  heatmapResults,
  crm2People,
  crm2Results,
  usageEvents,
  reassignMembers,
  assignUnassigned,
  assignMyTeam,
  managerId,
  learningCards,
  recapRows,
  recapMonths,
  totalAssessments,
}: Props) {
  const [tab, setTab] = useState<TabKey>('overview')

  const header = (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-xl font-bold text-navy">Manager Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Team progress — Training Programme</p>
      </div>
    </div>
  )

  // No team yet — skip the tab shell and show a simple empty state.
  if (teamCount === 0) {
    return (
      <div className="space-y-6">
        {header}
        <div className="card overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-base font-bold text-navy">Team Progress</h2>
          </div>
          <div className="px-6 py-16 text-center">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">No team members yet</p>
            <p className="text-xs text-slate-400 mt-1">Add users in Supabase → Authentication → Users</p>
          </div>
        </div>
      </div>
    )
  }

  const tabs: { key: TabKey; label: string; icon: typeof Users; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutGrid },
    { key: 'team', label: 'Team', icon: Users, count: teamCount },
    { key: 'usage', label: 'Usage', icon: Activity },
    { key: 'manage', label: 'Manage', icon: RefreshCw, count: reassignMembers.length || undefined },
    { key: 'development', label: 'Development', icon: Brain },
  ]

  return (
    <div className="space-y-6">
      {header}

      {/* Segmented section nav — jump instead of scroll */}
      <div className="sticky top-0 z-10 -mx-4 px-4 py-2 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full overflow-x-auto sm:w-fit">
          {tabs.map(({ key, label, icon: Icon, count }) => (
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
              {typeof count === 'number' && (
                <span className={cn(
                  'text-[11px] font-bold tabular-nums px-1.5 py-0.5 rounded-full',
                  tab === key ? 'bg-navy/10 text-navy' : 'bg-slate-200 text-slate-500',
                )}>
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Team Members',   value: teamCount, sub: 'in your team' },
              { label: 'Avg Progress',   value: `${avgProgress}%`, sub: 'across the team' },
              { label: 'On Track',       value: ragCounts.green, sub: 'members at 60%+', accent: 'text-green-600' },
              { label: 'Needs Attention', value: ragCounts.red, sub: 'members below 20%', accent: 'text-red-600' },
            ].map(({ label, value, sub, accent }) => (
              <div key={label} className="card p-5">
                <p className={cn('text-3xl font-black tabular-nums', accent ?? 'text-navy')}>{value}</p>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* RAG summary */}
          <div className="grid grid-cols-3 gap-4">
            {(['green', 'amber', 'red'] as const).map(status => (
              <div key={status} className={cn('card p-5 border-l-4', {
                'border-l-green-500': status === 'green',
                'border-l-amber-400': status === 'amber',
                'border-l-red-500':   status === 'red',
              })}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn('w-3 h-3 rounded-full', RAG_DOT[status])} aria-hidden />
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {RAG_LABEL[status]}
                  </span>
                </div>
                <p className="text-3xl font-black text-navy tabular-nums">{ragCounts[status]}</p>
                <p className="text-xs text-slate-400 mt-0.5">team members</p>
              </div>
            ))}
          </div>

          {/* Competency heatmap — beta only */}
          {beta && (
            <CompetencyHeatmap members={heatmapMembers} results={heatmapResults} />
          )}

          {/* CRM 2.0 assessments — private preview, kept separate from the main
              team-completion metric so it doesn't skew everyone's denominator */}
          <Crm2AssessmentPanel people={crm2People} results={crm2Results} />

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-teal mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-navy">Live data from Supabase</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Progress and scores update in real time as team members complete modules and assessments.
                To add a new team member, go to Supabase → Authentication → Users → Add User, then assign them here.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      {tab === 'team' && (
        <PeopleDirectory
          people={directoryPeople}
          totalAssessments={totalAssessments}
          title="Team Progress"
          secondaryColumn="role"
          showActivity
        />
      )}

      {/* ── Usage ────────────────────────────────────────────────────────── */}
      {tab === 'usage' && (
        <UsageDashboard
          events={usageEvents}
          title="Team Usage"
          subtitle="What your team is viewing on the Hub, and how active they are."
          emptyHint="Once your team members start using the Hub, their activity will show here."
        />
      )}

      {/* ── Manage ───────────────────────────────────────────────────────── */}
      {tab === 'manage' && (
        <div className="space-y-6">
          {/* Reassignment panel — only when there are failed modules */}
          {reassignMembers.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-500" aria-hidden />
                <h2 className="text-sm font-bold text-navy">Reassignment Actions</h2>
                <span className="ml-auto text-xs text-slate-400">Modules scored below 80% — grant a retake</span>
              </div>
              <div className="divide-y divide-slate-50">
                {reassignMembers.map(member => (
                  <div key={member.id} className="px-5 py-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[11px] font-bold">{member.initials}</span>
                      </div>
                      <p className="text-sm font-semibold text-navy">{member.displayName}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {member.failedModules.map(f => (
                        <div
                          key={f.assessmentId}
                          className="rounded-xl border border-red-100 bg-red-50/50 px-3 py-3 w-full"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-navy truncate max-w-[200px]">{f.label}</p>
                              <p className="text-[11px] text-red-500">Score: {f.score}% · Failed</p>
                            </div>
                            <ReassignButton
                              userId={member.id}
                              moduleId={f.assessmentId}
                              moduleName={f.label}
                            />
                          </div>
                          <WrongAnswersPanel
                            userId={member.id}
                            moduleId={f.assessmentId}
                            moduleName={f.label}
                            score={f.score}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team assignment */}
          <TeamAssignmentPanel
            unassigned={assignUnassigned}
            myTeam={assignMyTeam}
            managerId={managerId}
          />
        </div>
      )}

      {/* ── Development ──────────────────────────────────────────────────── */}
      {tab === 'development' && (
        <div className="space-y-6">
          {/* Team Learning Profiles */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#0071E3]" aria-hidden />
              <h2 className="text-sm font-bold text-navy">Team Learning Profiles</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {learningCards.map(member => (
                <div key={member.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{member.initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{member.displayName}</p>
                    </div>
                  </div>
                  {member.lp ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{member.lp.style_icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-navy">{member.lp.style_label}</p>
                          <p className="text-[11px] text-slate-400">Learning style</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] text-slate-500">Starting confidence</p>
                          <p className="text-[11px] font-semibold text-navy">{member.lp.confidence_label}</p>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0071E3] rounded-full"
                            style={{ width: `${member.lp.confidence_pct ?? 0}%` }}
                          />
                        </div>
                      </div>
                      {member.lp.manager_note && (
                        <div className="rounded-lg bg-white border border-slate-100 px-3 py-2">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Manager note</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{member.lp.manager_note}</p>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-300">
                        Completed {member.lp.completed_at ? new Date(member.lp.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-xs text-slate-400">Learning profile not yet completed</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recap & Refresh tracker */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-indigo-500" aria-hidden />
              <h2 className="text-sm font-bold text-navy">Recap &amp; Refresh</h2>
              <span className="ml-auto text-xs text-slate-400">Monthly knowledge checks</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap" scope="col">
                      Team Member
                    </th>
                    {recapMonths.map(round => (
                      <th key={round.id} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap" scope="col">
                        {round.month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recapRows.map(member => (
                    <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[11px] font-bold">{member.initials}</span>
                          </div>
                          <p className="text-sm font-medium text-navy">{member.displayName}</p>
                        </div>
                      </td>
                      {member.cells.map(cell => (
                        <td key={cell.roundId} className="px-4 py-3 whitespace-nowrap">
                          {cell.score !== null ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5">
                              <CheckCircle2 className="w-3 h-3" aria-hidden />
                              {cell.score}%
                            </span>
                          ) : (
                            <span className="text-xs text-slate-300">Not completed</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
