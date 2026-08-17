import { redirect } from 'next/navigation'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { ragStatus } from '@/lib/rag'
import { type DirectoryPerson } from '@/components/manager/PeopleDirectory'
import { isMd } from '@/lib/md'
import AdminDashboard, { type MemberRow, type SupervisorSummary } from '@/components/admin/AdminDashboard'

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

  const [{ data: allProfiles }, { data: allResults }] = await Promise.all([
    service
      .from('user_profiles')
      .select('id, full_name, email, role, created_at, manager_id')
      .order('created_at', { ascending: true }),
    service
      .from('assessment_results')
      .select('user_id, assessment_id, score, passed, completed_at')
      .order('completed_at', { ascending: true }),
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
  const supervisorStats = supervisors.map(mgr => {
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

  // Managing Directors — learners flagged in the MD allowlist, surfaced in their
  // own section for at-a-glance individual progress. They remain in the org
  // stats and their team; this is an additional lens, not a filter.
  const mdDirectoryPeople = directoryPeople.filter(p => isMd(p.email))

  // ── Map computed stats into the (serializable) props the client shell needs ──
  const toRow = (m: ReturnType<typeof getMemberStats>): MemberRow => ({
    id: m.id,
    displayName: m.displayName,
    initials: m.initials,
    email: m.email ?? null,
    progressPct: m.progressPct,
    completedCount: m.completedCount,
    rag: m.rag,
  })

  const supervisorSummaries: SupervisorSummary[] = supervisorStats.map(mgr => ({
    id: mgr.id,
    displayName: mgr.displayName,
    initials: mgr.initials,
    email: mgr.email ?? null,
    role: mgr.role ?? null,
    teamCount: mgr.teamCount,
    avgProgress: mgr.avgProgress,
    avgScore: mgr.avgScore,
    ragCounts: mgr.ragCounts,
    team: mgr.team.map(toRow),
  }))

  const orgStats = {
    totalLearners: allLearnerStats.length,
    teamCount: supervisorStats.length,
    avgProgress: orgAvgProgress,
    onTrack: orgRag.green,
    needsAttention: orgRag.red,
  }

  const crm2People = profiles.map(p => {
    const name = displayName(p)
    return { id: p.id, displayName: name, initials: initials(name) }
  })
  const crm2Results = results.map(r => ({
    user_id: r.user_id,
    assessment_id: r.assessment_id,
    score: r.score,
    passed: r.passed,
    completed_at: r.completed_at,
  }))

  return (
    <AdminDashboard
      orgStats={orgStats}
      directoryPeople={directoryPeople}
      mdDirectoryPeople={mdDirectoryPeople}
      supervisorSummaries={supervisorSummaries}
      unassigned={unassigned.map(toRow)}
      crm2People={crm2People}
      crm2Results={crm2Results}
      totalAssessments={TOTAL_ASSESSMENTS}
    />
  )
}
