'use client'

// Admin dashboard — tabbed shell.
//
// The page used to be one long scroll (org stats → PM directory → MDs → CRM 2.0
// → Teams → Unassigned). This splits it into jump-able sections (Overview ·
// Property Managers · Managing Directors · Teams) with a segmented control, so
// admins land on the health summary and step into a section instead of
// scrolling. All data is computed server-side and passed in as props — this
// component is purely presentational and does its own tab state in the browser.

import { useState } from 'react'
import Link from 'next/link'
import { Building2, Activity, Users, Briefcase, LayoutGrid, UserCog } from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import InviteUserButton from '@/components/ui/InviteUserButton'
import { cn } from '@/lib/utils'
import { RAG_DOT, RAG_ROW, RAG_LABEL, RAG_TEXT, type RagStatus } from '@/lib/rag'
import PeopleDirectory, { type DirectoryPerson } from '@/components/manager/PeopleDirectory'
import Crm2AssessmentPanel from '@/components/manager/Crm2AssessmentPanel'

export interface MemberRow {
  id: string
  displayName: string
  initials: string
  email: string | null
  progressPct: number
  completedCount: number
  rag: RagStatus
}

export interface SupervisorSummary {
  id: string
  displayName: string
  initials: string
  email: string | null
  role: string | null
  teamCount: number
  avgProgress: number
  avgScore: number | null
  ragCounts: { green: number; amber: number; red: number }
  team: MemberRow[]
}

export interface OrgStats {
  totalLearners: number
  teamCount: number
  avgProgress: number
  onTrack: number
  needsAttention: number
}

interface Crm2Person { id: string; displayName: string; initials: string }
interface Crm2Result {
  user_id: string
  assessment_id: string
  score: number
  passed: boolean
  completed_at: string | null
}

interface Props {
  orgStats: OrgStats
  directoryPeople: DirectoryPerson[]
  mdDirectoryPeople: DirectoryPerson[]
  supervisorSummaries: SupervisorSummary[]
  unassigned: MemberRow[]
  crm2People: Crm2Person[]
  crm2Results: Crm2Result[]
  totalAssessments: number
}

type TabKey = 'overview' | 'pms' | 'mds' | 'teams'

export default function AdminDashboard({
  orgStats,
  directoryPeople,
  mdDirectoryPeople,
  supervisorSummaries,
  unassigned,
  crm2People,
  crm2Results,
  totalAssessments,
}: Props) {
  const [tab, setTab] = useState<TabKey>('overview')

  const tabs: { key: TabKey; label: string; icon: typeof Users; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutGrid },
    { key: 'pms', label: 'Property Managers', icon: Users, count: directoryPeople.length },
    ...(mdDirectoryPeople.length > 0
      ? [{ key: 'mds' as TabKey, label: 'Managing Directors', icon: UserCog, count: mdDirectoryPeople.length }]
      : []),
    { key: 'teams', label: 'Teams', icon: Briefcase, count: supervisorSummaries.length },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy">Organisation Overview</h1>
            <p className="text-sm text-slate-500 mt-0.5">All teams · Training Programme</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/usage" className="btn-outline text-sm">
            <Activity className="w-4 h-4" aria-hidden />
            Usage
          </Link>
          <InviteUserButton />
        </div>
      </div>

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
              { label: 'Total Learners',   value: orgStats.totalLearners, sub: `across ${orgStats.teamCount} team${orgStats.teamCount !== 1 ? 's' : ''}` },
              { label: 'Org Avg Progress', value: `${orgStats.avgProgress}%`, sub: 'across all learners' },
              { label: 'On Track',         value: orgStats.onTrack, sub: 'learners at 60%+', accent: 'text-green-600' },
              { label: 'Needs Attention',  value: orgStats.needsAttention, sub: 'learners below 20%', accent: 'text-red-600' },
            ].map(({ label, value, sub, accent }) => (
              <div key={label} className="card p-5">
                <p className={cn('text-3xl font-black tabular-nums', accent ?? 'text-navy')}>{value}</p>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* CRM 2.0 assessments — private preview, kept out of the org-wide
              completion metrics above */}
          <Crm2AssessmentPanel people={crm2People} results={crm2Results} />
        </div>
      )}

      {/* ── Property Managers ────────────────────────────────────────────── */}
      {tab === 'pms' && (
        <PeopleDirectory
          people={directoryPeople}
          totalAssessments={totalAssessments}
          title="All Property Managers"
          secondaryColumn="manager"
        />
      )}

      {/* ── Managing Directors ───────────────────────────────────────────── */}
      {tab === 'mds' && mdDirectoryPeople.length > 0 && (
        <PeopleDirectory
          people={mdDirectoryPeople}
          totalAssessments={totalAssessments}
          title="Managing Directors"
          secondaryColumn="manager"
        />
      )}

      {/* ── Teams ────────────────────────────────────────────────────────── */}
      {tab === 'teams' && (
        <div className="space-y-4">
          {supervisorSummaries.map(mgr => (
            <div key={mgr.id} className="card overflow-hidden">

              {/* Supervisor header — clickable to view their scores */}
              <Link href={`/admin/member/${mgr.id}`} className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{mgr.initials}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-navy">{mgr.displayName}</p>
                      <span className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded-full border',
                        mgr.role === 'admin'
                          ? 'text-purple-700 bg-purple-100 border-purple-200'
                          : 'text-indigo-700 bg-indigo-100 border-indigo-200',
                      )}>
                        {mgr.role === 'admin' ? 'Admin' : 'Manager'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{mgr.email} · {mgr.teamCount} {mgr.teamCount === 1 ? 'member' : 'members'} · <span className="text-teal">View scores →</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-lg font-black text-navy tabular-nums">{mgr.avgProgress}%</p>
                    <p className="text-[11px] text-slate-400">Team avg</p>
                  </div>
                  {mgr.avgScore !== null && (
                    <div className="text-center">
                      <p className={cn('text-lg font-black tabular-nums', {
                        'text-teal': mgr.avgScore >= 80,
                        'text-amber-500': mgr.avgScore >= 65 && mgr.avgScore < 80,
                        'text-red-500': mgr.avgScore < 65,
                      })}>{mgr.avgScore}%</p>
                      <p className="text-[11px] text-slate-400">Avg score</p>
                    </div>
                  )}
                  <div className="flex gap-3">
                    {(['green', 'amber', 'red'] as const).map(r => (
                      <div key={r} className="flex items-center gap-1.5">
                        <div className={cn('w-2 h-2 rounded-full', RAG_DOT[r])} />
                        <span className="text-sm font-semibold text-slate-500">{mgr.ragCounts[r]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>

              {/* Team rows */}
              {mgr.teamCount === 0 ? (
                <div className="px-5 py-4">
                  <p className="text-xs text-slate-400">No team members assigned yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {mgr.team.map(member => (
                    <Link
                      key={member.id}
                      href={`/admin/member/${member.id}`}
                      className={cn('flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/80 transition-colors', RAG_ROW[member.rag])}
                    >
                      <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{member.initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-navy">{member.displayName}</p>
                        <p className="text-xs text-slate-400 truncate">{member.email}</p>
                      </div>
                      <div className="flex items-center gap-6 flex-shrink-0">
                        <div className="w-28">
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-bold text-navy">{member.progressPct}%</span>
                            <span className="text-slate-400">{member.completedCount}/{totalAssessments}</span>
                          </div>
                          <ProgressBar
                            value={member.progressPct}
                            size="sm"
                            color={member.progressPct >= 60 ? 'teal' : member.progressPct >= 20 ? 'gold' : 'red'}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className={cn('w-2 h-2 rounded-full flex-shrink-0', RAG_DOT[member.rag])} />
                          <span className={cn('text-xs font-semibold', RAG_TEXT[member.rag])}>{RAG_LABEL[member.rag]}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Unassigned */}
          {unassigned.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-sm font-bold text-navy">Unassigned Learners</p>
                <p className="text-xs text-slate-400 mt-0.5">{unassigned.length} {unassigned.length === 1 ? 'user' : 'users'} not yet assigned to a manager or admin</p>
              </div>
              <div className="divide-y divide-slate-50">
                {unassigned.map(member => (
                  <Link
                    key={member.id}
                    href={`/admin/member/${member.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{member.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy">{member.displayName}</p>
                      <p className="text-xs text-slate-400">{member.email}</p>
                    </div>
                    <span className="text-xs text-slate-400">No manager assigned</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
