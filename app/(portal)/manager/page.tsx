import { redirect } from 'next/navigation'
import { MODULES, RECAP_ROUNDS } from '@/lib/data'
import { CRM2_LESSONS } from '@/lib/crm2-content'
import { createServerClient } from '@/lib/supabase/server'
import { isHubBeta } from '@/lib/preview'
import { ragStatus } from '@/lib/rag'
import { type DirectoryPerson } from '@/components/manager/PeopleDirectory'
import ManagerDashboard from '@/components/manager/ManagerDashboard'

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

export default async function ManagerPage() {
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

    return { ...member, displayName, initials, completedCount, progressPct, avgScore, rag, failedModules }
  })

  // Summary stats
  const teamCount = memberStats.length
  const avgProgress = teamCount > 0
    ? Math.round(memberStats.reduce((s, m) => s + m.progressPct, 0) / teamCount)
    : 0
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

  // ── Map computed stats into the serializable props the client shell needs ──

  const heatmapMembers = memberStats.map(m => ({ id: m.id, displayName: m.displayName, initials: m.initials }))
  const heatmapResults = (allResults ?? []).map(r => ({
    user_id: r.user_id, assessment_id: r.assessment_id, score: r.score,
  }))

  const crm2People = memberStats.map(m => ({ id: m.id, displayName: m.displayName, initials: m.initials }))
  const crm2Results = (allResults ?? []).map(r => ({
    user_id: r.user_id,
    assessment_id: r.assessment_id,
    score: r.score,
    passed: r.passed,
    completed_at: r.completed_at,
  }))

  // Reassignment — resolve module labels server-side (via MODULES / CRM2_LESSONS).
  const reassignMembers = sorted
    .filter(m => m.failedModules.length > 0)
    .map(m => ({
      id: m.id,
      displayName: m.displayName,
      initials: m.initials,
      failedModules: m.failedModules.map(f => {
        const mod = MODULES.find(x => x.id === f.assessment_id)
        const crm2 = CRM2_LESSONS.find(l => l.quizModuleId === f.assessment_id)
        return {
          assessmentId: f.assessment_id,
          label: mod?.title ?? crm2?.title ?? f.assessment_id,
          score: f.score,
        }
      }),
    }))

  const assignMyTeam = memberStats.map(m => ({
    id: m.id,
    displayName: m.displayName,
    email: m.email ?? null,
    manager_id: user.id,
  }))

  const learningCards = sorted.map(m => {
    const lp = (learningProfiles ?? []).find(p => p.user_id === m.id)
    return {
      id: m.id,
      displayName: m.displayName,
      initials: m.initials,
      lp: lp
        ? {
            style_label: lp.style_label ?? null,
            style_icon: lp.style_icon ?? null,
            confidence_label: lp.confidence_label ?? null,
            confidence_pct: lp.confidence_pct ?? null,
            manager_note: lp.manager_note ?? null,
            completed_at: lp.completed_at ?? null,
          }
        : null,
    }
  })

  const recapMonths = RECAP_ROUNDS.map(r => ({ id: r.id, month: r.month }))
  const recapRows = sorted.map(m => {
    const memberResults = (allResults ?? []).filter(r => r.user_id === m.id)
    return {
      id: m.id,
      displayName: m.displayName,
      initials: m.initials,
      cells: RECAP_ROUNDS.map(round => {
        const attempt = memberResults
          .filter(r => r.assessment_id === round.id)
          .sort((a, b) => new Date(b.completed_at ?? 0).getTime() - new Date(a.completed_at ?? 0).getTime())[0]
        return { roundId: round.id, month: round.month, score: attempt ? attempt.score : null }
      }),
    }
  })

  return (
    <ManagerDashboard
      teamCount={teamCount}
      avgProgress={avgProgress}
      ragCounts={ragCounts}
      directoryPeople={directoryPeople}
      beta={beta}
      heatmapMembers={heatmapMembers}
      heatmapResults={heatmapResults}
      crm2People={crm2People}
      crm2Results={crm2Results}
      reassignMembers={reassignMembers}
      assignUnassigned={unassigned}
      assignMyTeam={assignMyTeam}
      managerId={user.id}
      learningCards={learningCards}
      recapRows={recapRows}
      recapMonths={recapMonths}
      totalAssessments={TOTAL_ASSESSMENTS}
    />
  )
}
