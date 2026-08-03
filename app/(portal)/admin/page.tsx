import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Building2, Activity } from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import InviteUserButton from '@/components/ui/InviteUserButton'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { cn } from '@/lib/utils'
import { ragStatus, RAG_DOT, RAG_ROW, RAG_LABEL, RAG_TEXT } from '@/lib/rag'
import PeopleDirectory, { type DirectoryPerson } from '@/components/manager/PeopleDirectory'
import Crm2AssessmentPanel from '@/components/manager/Crm2AssessmentPanel'

const ALL_ASSESSMENT_IDS = [
  'mnt-01', 'mnt-02', 'cmp-01', 'cmp-02', 'mnt-03', 'ins-02',
  'sys-01', 'mvt-02', 'sys-02', 'sup-02',
  'kno-01', 'kno-02', 'kno-03', 'full-assessment', 'master-assessment',
]
const TOTAL_ASSESSMENTS = ALL_ASSESSMENT_IDS.length

function displayName(profile: { full_name?: string | null; email?: string | null }) {
  return profile.full_name
    || profile.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    || 'Unknown'
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

export default async function AdminPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: currentProfile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).single()

  if (currentProfile?.role !== 'admin') redirect('/dashboard')

  // Use service client to bypass RLS and read all users/results
  const service = createServiceClient()

  const [{ data: allProfiles }, { data: allResults }, { data: pendingInvites }] = await Promise.all([
    service
      .from('user_profiles')
      .select('id, full_name, email, role, created_at, manager_id')
      .order('created_at', { ascending: true }),
    service
      .from('assessment_results')
      .select('user_id, assessment_id, score, passed, completed_at')
      .order('completed_at', { ascending: true }),
    service
      .from('pending_invites')
      .select('id, email, full_name, role, created_at, invited_by')
      .is('used_at', null)
      .order('created_at', { ascending: false }),
  ])

  const profiles = allProfiles ?? []
  const results = allResults ?? []

  // Both managers and admins can lead a team (a property manager can be
  // assigned directly to an admin). Learners are everyone else.
  const supervisors = profiles.filter(p => p.role === 'manager' || p.role === 'admin')
  const learners = profiles.filter(p => p.role !== 'manager' && p.role !== 'admin')

  function getMemberStats(member: typeof profiles[0]) {
    const memberResults = results.filter(r => r.user_id === member.id)
    // Results ordered ascending by completed_at — iterate oldest→newest
    // completedCount: "ever passed" — a pass is permanent once earned
    // avgScore: latest attempt per assessment (last write wins)
    const everPassed = new Map<string, boolean>()
    const latestScore = new Map<string, number>()
    for (const r of memberResults) {
      if (ALL_ASSESSMENT_IDS.includes(r.assessment_id)) {
        if (r.passed) everPassed.set(r.assessment_id, true)
        else if (!everPassed.get(r.assessment_id)) everPassed.set(r.assessment_id, false)
        latestScore.set(r.assessment_id, r.score)
      }
    }
    const completedCount = Array.from(everPassed.values()).filter(Boolean).length
    const progressPct = Math.round((completedCount / TOTAL_ASSESSMENTS) * 100)
    const scores = Array.from(latestScore.values())
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
      : null
    const rag = ragStatus(progressPct)
    const name = displayName(member)
    return { ...member, displayName: name, initials: initials(name), completedCount, progressPct, avgScore, rag }
  }

  // Team summaries — one per supervisor (manager or admin)
  const supervisorSummaries = supervisors.map(mgr => {
    const team = learners.filter(p => p.manager_id === mgr.id).map(getMemberStats)
    const avgProgress = team.length > 0
      ? Math.round(team.reduce((s, m) => s + m.progressPct, 0) / team.length)
      : 0
    const scored = team.filter(m => m.avgScore !== null)
    const avgScore = scored.length > 0
      ? Math.round(scored.reduce((s, m) => s + (m.avgScore ?? 0), 0) / scored.length)
      : null
    const ragCounts = {
      green: team.filter(m => m.rag === 'green').length,
      amber: team.filter(m => m.rag === 'amber').length,
      red: team.filter(m => m.rag === 'red').length,
    }
    const name = displayName(mgr)
    return {
      ...mgr, displayName: name, initials: initials(name),
      team: [...team].sort((a, b) => { const o = { red: 0, amber: 1, green: 2 }; return o[a.rag] - o[b.rag] }),
      teamCount: team.length, avgProgress, avgScore, ragCounts,
    }
  })

  const unassigned = learners.filter(p => !p.manager_id).map(getMemberStats)

  const allLearnerStats = learners.map(getMemberStats).sort((a, b) => {
    const o = { red: 0, amber: 1, green: 2 }
    return o[a.rag] - o[b.rag]
  })

  const orgAvgProgress = allLearnerStats.length > 0
    ? Math.round(allLearnerStats.reduce((s, m) => s + m.progressPct, 0) / allLearnerStats.length)
    : 0
  const orgRag = {
    green: allLearnerStats.filter(m => m.rag === 'green').length,
    amber: allLearnerStats.filter(m => m.rag === 'amber').length,
    red: allLearnerStats.filter(m => m.rag === 'red').length,
  }

  // Directory rows — every property manager, searchable and sortable, with the
  // supervisor they report to shown in the Manager column.
  const directoryPeople: DirectoryPerson[] = allLearnerStats.map(m => {
    const mgr = supervisors.find(s => s.id === m.manager_id)
    return {
      id: m.id,
      displayName: m.displayName,
      email: m.email ?? null,
      initials: m.initials,
      roleLabel: m.role?.replace(/-/g, ' ') ?? 'Property Manager',
      managerName: mgr ? displayName(mgr) : 'Unassigned',
      completedCount: m.completedCount,
      progressPct: m.progressPct,
      avgScore: m.avgScore,
      rag: m.rag,
      joinedTs: m.created_at ?? null,
      href: `/admin/member/${m.id}`,
    }
  })

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
            <p className="text-sm text-slate-500 mt-0.5">All teams · 2026–2027 Training Programme</p>
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

      {/* Org-wide stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Learners',    value: allLearnerStats.length, sub: `across ${supervisorSummaries.length} team${supervisorSummaries.length !== 1 ? 's' : ''}` },
          { label: 'Org Avg Progress',  value: `${orgAvgProgress}%`,   sub: 'across all learners' },
          { label: 'On Track',          value: orgRag.green,            sub: 'learners at 60%+', accent: 'text-green-600' },
          { label: 'Needs Attention',   value: orgRag.red,              sub: 'learners below 20%', accent: 'text-red-600' },
        ].map(({ label, value, sub, accent }) => (
          <div key={label} className="card p-5">
            <p className={cn('text-3xl font-black tabular-nums', accent ?? 'text-navy')}>{value}</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">{label}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Search / filter — property managers (at the top for quick lookup) */}
      <PeopleDirectory
        people={directoryPeople}
        totalAssessments={TOTAL_ASSESSMENTS}
        title="All Property Managers"
        secondaryColumn="manager"
      />

      {/* CRM 2.0 assessments — private preview, surfaced separately so it stays
          out of the org-wide completion metrics above */}
      <Crm2AssessmentPanel
        people={profiles.map(p => {
          const name = displayName(p)
          return { id: p.id, displayName: name, initials: initials(name) }
        })}
        results={results.map(r => ({
          user_id: r.user_id,
          assessment_id: r.assessment_id,
          score: r.score,
          passed: r.passed,
          completed_at: r.completed_at,
        }))}
      />

      {/* Teams by supervisor (managers + admins) — scroll down for the org breakdown */}
      <div>
        <h2 className="text-sm font-bold text-navy mb-3">Teams</h2>
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
                            <span className="text-slate-400">{member.completedCount}/{TOTAL_ASSESSMENTS}</span>
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
      </div>

    </div>
  )
}
