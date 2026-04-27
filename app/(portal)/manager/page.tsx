import { redirect } from 'next/navigation'
import {
  Users, TrendingUp, AlertTriangle, BarChart3,
  CheckCircle2, Brain, RefreshCw, CalendarCheck,
} from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import StatCard from '@/components/ui/StatCard'
import TeamAssignmentPanel from '@/components/ui/TeamAssignmentPanel'
import ReassignButton from '@/components/ui/ReassignButton'
import WrongAnswersPanel from '@/components/ui/WrongAnswersPanel'
import { MODULES, RECAP_ROUNDS } from '@/lib/data'
import { cn } from '@/lib/utils'
import { createServerClient } from '@/lib/supabase/server'

const TOTAL_MODULES = MODULES.filter(m => !m.locked).length

// RAG status based on progress percentage
function ragStatus(progress: number): 'green' | 'amber' | 'red' {
  if (progress >= 60) return 'green'
  if (progress >= 20) return 'amber'
  return 'red'
}

const RAG_DOT: Record<string, string> = {
  red:   'bg-red-500',
  amber: 'bg-amber-400',
  green: 'bg-green-500',
}
const RAG_ROW: Record<string, string> = {
  red:   'border-red-200 bg-red-50/40',
  amber: 'border-amber-200 bg-amber-50/40',
  green: 'border-teal/20 bg-teal/3',
}
const RAG_LABEL: Record<string, string> = {
  green: 'On Track',
  amber: 'In Progress',
  red:   'Needs Attention',
}
const RAG_TEXT: Record<string, string> = {
  green: 'text-green-700',
  amber: 'text-amber-700',
  red:   'text-red-700',
}

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

  // Fetch my team members (assigned to me)
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, role, created_at, manager_id')
    .eq('manager_id', user.id)
    .order('created_at', { ascending: true })

  // Fetch unassigned users (no manager yet, not managers themselves)
  const { data: unassignedProfiles } = await supabase
    .from('user_profiles')
    .select('id, full_name, email, manager_id')
    .is('manager_id', null)
    .neq('role', 'manager')

  const teamMembers = profiles ?? []
  const unassigned = (unassignedProfiles ?? []).map(u => ({
    id: u.id,
    displayName: u.full_name
      || u.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      || 'Unknown',
    email: u.email ?? null,
    manager_id: u.manager_id ?? null,
  }))

  // Fetch module progress for all users
  const { data: allProgress } = await supabase
    .from('module_progress')
    .select('user_id, completed')

  // Fetch assessment results for all users
  const { data: allResults } = await supabase
    .from('assessment_results')
    .select('user_id, assessment_id, score, passed, completed_at')

  // Fetch learning profiles for team members
  const teamIds = (profiles ?? []).map(p => p.id)
  const { data: learningProfiles } = teamIds.length > 0
    ? await supabase
        .from('learning_profiles')
        .select('user_id, style_label, style_icon, confidence_label, confidence_pct, manager_note, completed_at')
        .in('user_id', teamIds)
    : { data: [] }

  // Build per-user stats
  const memberStats = teamMembers.map(member => {
    const progress = (allProgress ?? []).filter(p => p.user_id === member.id)
    const completedCount = progress.filter(p => p.completed).length
    const progressPct = TOTAL_MODULES > 0
      ? Math.round((completedCount / TOTAL_MODULES) * 100)
      : 0

    const results = (allResults ?? []).filter(r => r.user_id === member.id)
    const avgScore = results.length > 0
      ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
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

    return { ...member, displayName, initials, completedCount, progressPct, avgScore, rag, joinDate, failedModules }
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

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-navy">Manager Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Team progress — 2026–2027 Training Programme</p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Team Members"
          value={teamCount}
          sub="Active on the programme"
          icon={<Users className="w-5 h-5" />}
          accent="navy"
        />
        <StatCard
          label="Avg Progress"
          value={`${avgProgress}%`}
          sub="Across all pathways"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="teal"
        />
        <StatCard
          label="Avg Assessment Score"
          value={avgScore !== null ? `${avgScore}%` : '—'}
          sub="Pass threshold: 80%"
          icon={<BarChart3 className="w-5 h-5" />}
          accent="orange"
        />
        <StatCard
          label="Needing Attention"
          value={ragCounts.red}
          sub={`${ragCounts.amber} in progress · ${ragCounts.green} on track`}
          icon={<AlertTriangle className="w-5 h-5" />}
          accent="gold"
        />
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

      {/* Team table */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-bold text-navy">Team Progress</h2>
          <span className="text-xs text-slate-400">{teamCount} {teamCount === 1 ? 'member' : 'members'}</span>
        </div>

        {teamCount === 0 ? (
          <div className="px-5 py-12 text-center">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">No team members yet</p>
            <p className="text-xs text-slate-400 mt-1">Add users in Supabase → Authentication → Users</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  {['Team Member', 'Role', 'Modules', 'Progress', 'Avg Score', 'Status', 'Joined'].map(h => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap"
                      scope="col"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sorted.map(member => (
                  <tr key={member.id} className={cn('transition-colors hover:bg-slate-50/60', RAG_ROW[member.rag])}>

                    {/* Name */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">{member.initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-navy">{member.displayName}</p>
                          <p className="text-[11px] text-slate-400">{member.email ?? '—'}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-slate-600 capitalize">
                        {member.role?.replace(/-/g, ' ') ?? 'Property Manager'}
                      </span>
                    </td>

                    {/* Modules */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-sm tabular-nums text-slate-600">
                        {member.completedCount}<span className="text-slate-400">/{TOTAL_MODULES}</span>
                      </span>
                    </td>

                    {/* Progress */}
                    <td className="px-4 py-3">
                      <div className="w-24">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className="font-semibold text-navy">{member.progressPct}%</span>
                        </div>
                        <ProgressBar
                          value={member.progressPct}
                          size="sm"
                          color={member.progressPct >= 60 ? 'teal' : member.progressPct >= 20 ? 'gold' : 'red'}
                        />
                      </div>
                    </td>

                    {/* Avg score */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      {member.avgScore !== null ? (
                        <span className={cn('text-sm font-bold tabular-nums', {
                          'text-teal':      member.avgScore >= 80,
                          'text-amber-500': member.avgScore >= 65 && member.avgScore < 80,
                          'text-red-500':   member.avgScore < 65,
                        })}>
                          {member.avgScore}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">No attempts</span>
                      )}
                    </td>

                    {/* RAG */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className={cn('w-2 h-2 rounded-full flex-shrink-0', RAG_DOT[member.rag])} aria-hidden />
                        <span className={cn('text-xs font-semibold', RAG_TEXT[member.rag])}>
                          {RAG_LABEL[member.rag]}
                        </span>
                      </div>
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs text-slate-400">{member.joinDate}</span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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
