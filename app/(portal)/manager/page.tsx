import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Users,
  CheckCircle2, Brain, RefreshCw, CalendarCheck, Activity,
} from 'lucide-react'
import TeamAssignmentPanel from '@/components/ui/TeamAssignmentPanel'
import ReassignButton from '@/components/ui/ReassignButton'
import WrongAnswersPanel from '@/components/ui/WrongAnswersPanel'
import { MODULES, RECAP_ROUNDS } from '@/lib/data'
import { cn } from '@/lib/utils'
import { createServerClient } from '@/lib/supabase/server'
import { isHubBeta } from '@/lib/preview'
import { ragStatus, RAG_DOT, RAG_LABEL } from '@/lib/rag'
import CompetencyHeatmap from '@/components/manager/CompetencyHeatmap'
import PeopleDirectory, { type DirectoryPerson } from '@/components/manager/PeopleDirectory'

// All assessable items — matches the assessments page exactly
const ALL_ASSESSMENT_IDS = [
  'mnt-01', 'mnt-02',
  'cmp-01', 'cmp-02',
  'mnt-03', 'ins-02',
  'sys-01', 'mvt-02',
  'sys-02', 'sup-02',
  'kno-01', 'kno-02', 'kno-03',
  'full-assessment',
  'master-assessment',
  'release-contractor-portal-2026',
]
const TOTAL_ASSESSMENTS = ALL_ASSESSMENT_IDS.length // 16

export default async function ManagerDashboard() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: currentProfile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentProfile?.role !== 'manager') redirect('/dashboard')

  const beta = isHubBeta(user.email)

  // Fetch my team members (assigned to me)
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, role, created_at, manager_id')
    .eq('manager_id', user.id)
    .order('created_at', { ascending: true })

  // Fetch unassigned users (property-managers only — exclude managers and admins)
  const { data: unassignedProfiles } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, manager_id')
    .is('manager_id', null)
    .eq('role', 'property-manager')

  const teamMembers = profiles ?? []
  const unassigned = (unassignedProfiles ?? []).map(u => ({
    id: u.id,
    displayName: u.full_name
      || u.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      || 'Unknown',
    email: u.email ?? null,
    manager_id: u.manager_id ?? null,
  }))

  // Fetch assessment results scoped to this manager's team only
  const teamIds = (profiles ?? []).map(p => p.id)
  const { data: allResults } = teamIds.length > 0
    ? await supabase
        .from('assessment_results')
        .select('user_id, assessment_id, score, passed, completed_at')
        .in('user_id', teamIds)
        .order('completed_at', { ascending: true })
    : { data: [] }

  // Fetch learning profiles for team members
  const { data: learningProfiles } = teamIds.length > 0
    ? await supabase
        .from('learning_profiles')
        .select('user_id, style_label, style_icon, confidence_label, confidence_pct, manager_note, completed_at')
        .in('user_id', teamIds)
    : { data: [] }

  // Build per-user stats
  const memberStats = teamMembers.map(member => {
    const memberResults = (allResults ?? []).filter(r => r.user_id === member.id)
    // Count unique assessments passed (latest attempt per ID)
    const latestPassed = new Map<string, boolean>()
    for (const r of memberResults) {
      if (ALL_ASSESSMENT_IDS.includes(r.assessment_id)) {
        // Only overwrite if not already passed — a pass locks it in
        if (!latestPassed.get(r.assessment_id)) {
          latestPassed.set(r.assessment_id, r.passed)
        }
      }
    }
    const completedCount = Array.from(latestPassed.values()).filter(Boolean).length
    const progressPct = Math.round((completedCount / TOTAL_ASSESSMENTS) * 100)

    const results = (allResults ?? []).filter(r => r.user_id === member.id)
    // Deduplicate to last attempt per assessment before averaging
    const lastByAssessment = new Map<string, number>()
    for (const r of results) lastByAssessment.set(r.assessment_id, r.score)
    const avgScore = lastByAssessment.size > 0
      ? Math.round(Array.from(lastByAssessment.values()).reduce((s, v) => s + v, 0) / lastByAssessment.size)
      : null

    // Modules failed (score < 80, not a full/master assessment) — deduplicated to last attempt per module
    const moduleResults = results.filter(r =>
      r.assessment_id &&
      !['full-assessment', 'master-assessment'].includes(r.assessment_id) &&
      !r.assessment_id.startsWith('recap-')
    )
    const latestByModule = new Map<string, typeof moduleResults[0]>()
    for (const r of moduleResults) latestByModule.set(r.assessment_id, r)
    const failedModules = Array.from(latestByModule.values()).filter(r => !r.passed)

    const rag = ragStatus(progressPct)
    const displayName = member.full_name
      || member.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      || 'Unknown'
    const initials = displayName.split(' ').map((p: string) => p[0]).join('').toUpperCase().slice(0, 2)

    const joinDate = member.created_at
      ? new Date(member.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : '—'

    const lastActiveTs = memberResults.reduce<string | null>((max, r) => {
      if (!r.completed_at) return max
      return max === null || r.completed_at > max ? r.completed_at : max
    }, null)
    const lastActive = lastActiveTs
      ? new Date(lastActiveTs).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      : null

    return { ...member, displayName, initials, completedCount, progressPct, avgScore, rag, joinDate, lastActive, failedModules }
  })

  // Summary stats
  const teamCount = memberStats.length
  const avgProgress = teamCount > 0
    ? Math.round(memberStats.reduce((s, m) => s + m.progressPct, 0) / teamCount)
    : 0
  const scoredMembers = memberStats.filter(m => m.avgScore !== null)
  const avgScore = scoredMembers.length > 0
    ? Math.round(scoredMembers.reduce((s, m) => s + (m.avgScore ?? 0), 0) / scoredMembers.length)
    : null
  const ragCounts = {
    green: memberStats.filter(m => m.rag === 'green').length,
    amber: memberStats.filter(m => m.rag === 'amber').length,
    red:   memberStats.filter(m => m.rag === 'red').length,
  }

  const sorted = [...memberStats].sort((a, b) => {
    const order = { red: 0, amber: 1, green: 2 }
    return order[a.rag] - order[b.rag]
  })

  // Directory rows for the searchable/sortable team table.
  const directoryPeople: DirectoryPerson[] = memberStats.map(m => ({
    id: m.id,
    displayName: m.displayName,
    email: m.email ?? null,
    initials: m.initials,
    roleLabel: m.role?.replace(/-/g, ' ') ?? 'Property Manager',
    completedCount: m.completedCount,
    progressPct: m.progressPct,
    avgScore: m.avgScore,
    rag: m.rag,
    joinedTs: m.created_at ?? null,
    lastActiveTs: (allResults ?? [])
      .filter(r => r.user_id === m.id && r.completed_at)
      .reduce<string | null>((max, r) => (max === null || r.completed_at! > max ? r.completed_at! : max), null),
    href: `/manager/member/${m.id}`,
  }))

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy">Manager Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Team progress — 2026–2027 Training Programme</p>
        </div>
        <Link href="/manager/usage" className="btn-outline text-sm">
          <Activity className="w-4 h-4" aria-hidden />
          Usage
        </Link>
      </div>

      {/* Search / filter — team members (at the top for quick lookup) */}
      {teamCount === 0 ? (
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
      ) : (
        <PeopleDirectory
          people={directoryPeople}
          totalAssessments={TOTAL_ASSESSMENTS}
          title="Team Progress"
          secondaryColumn="role"
          showActivity
        />
      )}

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
        <CompetencyHeatmap
          members={memberStats.map(m => ({ id: m.id, displayName: m.displayName, initials: m.initials }))}
          results={(allResults ?? []).map(r => ({ user_id: r.user_id, assessment_id: r.assessment_id, score: r.score }))}
        />
      )}

      {/* Reassignment panel — only show when there are failed modules */}
      {sorted.some(m => m.failedModules.length > 0) && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-amber-500" aria-hidden />
            <h2 className="text-sm font-bold text-navy">Reassignment Actions</h2>
            <span className="ml-auto text-xs text-slate-400">Modules scored below 80% — grant a retake</span>
          </div>
          <div className="divide-y divide-slate-50">
            {sorted.filter(m => m.failedModules.length > 0).map(member => (
              <div key={member.id} className="px-5 py-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[11px] font-bold">{member.initials}</span>
                  </div>
                  <p className="text-sm font-semibold text-navy">{member.displayName}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {member.failedModules.map(f => {
                    const mod = MODULES.find(m => m.id === f.assessment_id)
                    const label = mod?.title ?? f.assessment_id
                    return (
                      <div
                        key={f.assessment_id}
                        className="rounded-xl border border-red-100 bg-red-50/50 px-3 py-3 w-full"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-navy truncate max-w-[200px]">{label}</p>
                            <p className="text-[11px] text-red-500">Score: {f.score}% · Failed</p>
                          </div>
                          <ReassignButton
                            userId={member.id}
                            moduleId={f.assessment_id}
                            moduleName={label}
                          />
                        </div>
                        <WrongAnswersPanel
                          userId={member.id}
                          moduleId={f.assessment_id}
                          moduleName={label}
                          score={f.score}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Team assignment */}
      <TeamAssignmentPanel
        unassigned={unassigned}
        myTeam={memberStats.map(m => ({
          id: m.id,
          displayName: m.displayName,
          email: m.email ?? null,
          manager_id: user.id,
        }))}
        managerId={user.id}
      />

      {/* Team Learning Profiles */}
      {teamCount > 0 && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
            <Brain className="w-4 h-4 text-[#0071E3]" aria-hidden />
            <h2 className="text-sm font-bold text-navy">Team Learning Profiles</h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {sorted.map(member => {
              const lp = (learningProfiles ?? []).find(p => p.user_id === member.id)
              return (
                <div key={member.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{member.initials}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{member.displayName}</p>
                    </div>
                  </div>
                  {lp ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{lp.style_icon}</span>
                        <div>
                          <p className="text-xs font-semibold text-navy">{lp.style_label}</p>
                          <p className="text-[11px] text-slate-400">Learning style</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[11px] text-slate-500">Starting confidence</p>
                          <p className="text-[11px] font-semibold text-navy">{lp.confidence_label}</p>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#0071E3] rounded-full"
                            style={{ width: `${lp.confidence_pct}%` }}
                          />
                        </div>
                      </div>
                      {lp.manager_note && (
                        <div className="rounded-lg bg-white border border-slate-100 px-3 py-2">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">Manager note</p>
                          <p className="text-xs text-slate-600 leading-relaxed">{lp.manager_note}</p>
                        </div>
                      )}
                      <p className="text-[10px] text-slate-300">
                        Completed {lp.completed_at ? new Date(lp.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-xs text-slate-400">Learning profile not yet completed</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Recap & Refresh tracker */}
      {teamCount > 0 && (
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
                  {RECAP_ROUNDS.map(round => (
                    <th key={round.id} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap" scope="col">
                      {round.month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sorted.map(member => {
                  const memberResults = (allResults ?? []).filter(r => r.user_id === member.id)
                  return (
                    <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[11px] font-bold">{member.initials}</span>
                          </div>
                          <p className="text-sm font-medium text-navy">{member.displayName}</p>
                        </div>
                      </td>
                      {RECAP_ROUNDS.map(round => {
                        const attempt = memberResults
                          .filter(r => r.assessment_id === round.id)
                          .sort((a, b) => new Date(b.completed_at ?? 0).getTime() - new Date(a.completed_at ?? 0).getTime())[0]
                        return (
                          <td key={round.id} className="px-4 py-3 whitespace-nowrap">
                            {attempt ? (
                              <div>
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5">
                                  <CheckCircle2 className="w-3 h-3" aria-hidden />
                                  {attempt.score}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-300">Not completed</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info note */}
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
  )
}
