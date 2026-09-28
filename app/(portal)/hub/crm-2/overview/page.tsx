import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { CRM2_LESSONS, CRM2_GUIDES } from '@/lib/crm2-content'
import { MAINTENANCE_LESSONS, MAINTENANCE_GUIDES } from '@/lib/crm2-maintenance-content'
import { CRM2_CONTENT_TYPE, MAINTENANCE_CONTENT_TYPE } from '@/lib/crm2-completions'
import Crm2AdminOverview, {
  type Crm2PersonRow,
  type Crm2Attempt,
  type Crm2Assessment,
  type Crm2Usage,
} from '@/components/crm2/Crm2AdminOverview'

// Admin command centre for CRM 2.0 assessments — lives inside the 2.0 section so
// there's one clear place to track how the whole group is doing and grant
// retakes, rather than stepping through people one by one on the org admin pages.
// Admin-only: managers/allow-listed users can reach the rest of CRM 2.0, but this
// org-wide roll-up is gated to admins.

interface AnswerEntry {
  question: string
  yourAnswer: string
  correctAnswer: string
  isCorrect: boolean
  rationale: string
}

function displayName(profile: { full_name?: string | null; email?: string | null }) {
  return profile.full_name
    || profile.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    || 'Unknown'
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
}

export default async function Crm2OverviewPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: currentProfile } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).maybeSingle()
  if (currentProfile?.role !== 'admin') redirect('/hub/crm-2')

  // The assessments are exactly the CRM 2.0 lessons that carry a quiz — across
  // BOTH tracks — so this list stays in step automatically as lessons gain or
  // lose knowledge checks. Maintenance checks are tagged so the scoreboard can
  // group them apart from compliance.
  const assessments: Crm2Assessment[] = [
    ...CRM2_LESSONS.filter(l => l.quizModuleId).map(l => ({ id: l.quizModuleId as string, title: l.title, track: 'compliance' as const })),
    ...MAINTENANCE_LESSONS.filter(l => l.quizModuleId).map(l => ({ id: l.quizModuleId as string, title: l.title, track: 'maintenance' as const })),
  ]
  const quizIds = assessments.map(a => a.id)

  // Service client — read every user's results, queued resets, and lesson reads,
  // bypassing RLS.
  const service = createServiceClient()
  const [{ data: profiles }, { data: results }, { data: pendingResets }, { data: completions }] = await Promise.all([
    service
      .from('user_profiles')
      .select('id, full_name, email, created_at')
      .order('created_at', { ascending: true }),
    quizIds.length > 0
      ? service
          .from('assessment_results')
          .select('user_id, assessment_id, score, passed, answers, completed_at')
          .in('assessment_id', quizIds)
          .order('completed_at', { ascending: false })
      : Promise.resolve({ data: [] as Array<{ user_id: string; assessment_id: string; score: number; passed: boolean; answers: unknown; completed_at: string | null }> }),
    service
      .from('module_resets')
      .select('user_id, module_id')
      .is('consumed_at', null),
    service
      .from('content_completions')
      .select('user_id, content_type, content_id')
      .in('content_type', [CRM2_CONTENT_TYPE, MAINTENANCE_CONTENT_TYPE]),
  ])

  const allResults = results ?? []
  const allProfiles = profiles ?? []
  const allCompletions = completions ?? []

  // Pending (unconsumed) resets, grouped per user, filtered to CRM 2.0 assessments.
  const quizIdSet = new Set(quizIds)
  const pendingByUser = new Map<string, string[]>()
  for (const r of pendingResets ?? []) {
    if (!quizIdSet.has(r.module_id)) continue
    const list = pendingByUser.get(r.user_id) ?? []
    list.push(r.module_id)
    pendingByUser.set(r.user_id, list)
  }

  // All attempts per (user, assessment), newest-first — results come back
  // ordered by completed_at desc, so we just append. Keeping the full history
  // (not just the latest) means a prior attempt stays visible after a retake.
  const attemptsByKey = new Map<string, Crm2Attempt[]>()
  const usersWithResults = new Set<string>()
  for (const r of allResults) {
    usersWithResults.add(r.user_id)
    const key = `${r.user_id}::${r.assessment_id}`
    const list = attemptsByKey.get(key) ?? []
    list.push({
      score: r.score,
      passed: r.passed,
      answers: Array.isArray(r.answers) ? (r.answers as AnswerEntry[]) : [],
      completedAt: r.completed_at,
    })
    attemptsByKey.set(key, list)
  }

  // One row per person who has taken at least one CRM 2.0 assessment.
  const people: Crm2PersonRow[] = allProfiles
    .filter(p => usersWithResults.has(p.id))
    .map(p => {
      const name = displayName(p)
      const attempts: Record<string, Crm2Attempt[]> = {}
      for (const a of assessments) {
        const list = attemptsByKey.get(`${p.id}::${a.id}`)
        if (list && list.length > 0) attempts[a.id] = list
      }
      return {
        id: p.id,
        displayName: name,
        initials: initials(name),
        attempts,
        pending: pendingByUser.get(p.id) ?? [],
      }
    })
    // Most-recently-active people first (by their latest attempt across checks).
    .sort((a, b) => {
      const la = Math.max(0, ...Object.values(a.attempts).map(list => (list[0]?.completedAt ? Date.parse(list[0].completedAt) : 0)))
      const lb = Math.max(0, ...Object.values(b.attempts).map(list => (list[0]?.completedAt ? Date.parse(list[0].completedAt) : 0)))
      return lb - la
    })

  // ── Usage: guide reads across both tracks ───────────────────────────────
  // Reads live in content_completions, keyed by content_type ('crm2' for
  // compliance, 'crm2-maint' for maintenance) — the two tracks share slugs, so
  // we must split on content_type, not the content_id prefix. Only guides count
  // (references aren't progress), matching the reader-facing progress lines.
  const complianceGuideSet = new Set(CRM2_GUIDES.map(g => g.slug))
  const maintenanceGuideSet = new Set(MAINTENANCE_GUIDES.map(g => g.slug))
  const readsByUser = new Map<string, { compliance: Set<string>; maintenance: Set<string> }>()
  const readsByGuide = new Map<string, number>() // key `${track}:${slug}` → people who've read it
  for (const c of allCompletions) {
    const isMaint = c.content_type === MAINTENANCE_CONTENT_TYPE
    const prefix = isMaint ? 'crm2-maint-' : 'crm2-'
    const slug = c.content_id.startsWith(prefix) ? c.content_id.slice(prefix.length) : c.content_id
    if (!(isMaint ? maintenanceGuideSet.has(slug) : complianceGuideSet.has(slug))) continue
    const bucket = readsByUser.get(c.user_id) ?? { compliance: new Set<string>(), maintenance: new Set<string>() }
    ;(isMaint ? bucket.maintenance : bucket.compliance).add(slug)
    readsByUser.set(c.user_id, bucket)
    const gk = `${isMaint ? 'maintenance' : 'compliance'}:${slug}`
    readsByGuide.set(gk, (readsByGuide.get(gk) ?? 0) + 1)
  }

  const usagePeople = allProfiles
    .filter(p => readsByUser.has(p.id))
    .map(p => {
      const name = displayName(p)
      const b = readsByUser.get(p.id)!
      return {
        id: p.id,
        displayName: name,
        initials: initials(name),
        complianceRead: b.compliance.size,
        maintenanceRead: b.maintenance.size,
      }
    })
    .sort((a, b) => (b.complianceRead + b.maintenanceRead) - (a.complianceRead + a.maintenanceRead))

  const usage: Crm2Usage = {
    complianceGuideCount: complianceGuideSet.size,
    maintenanceGuideCount: maintenanceGuideSet.size,
    peopleEngaged: usagePeople.length,
    totalReads: usagePeople.reduce((s, p) => s + p.complianceRead + p.maintenanceRead, 0),
    guides: [
      ...CRM2_GUIDES.map(g => ({ slug: g.slug, title: g.title, track: 'compliance' as const, reads: readsByGuide.get(`compliance:${g.slug}`) ?? 0 })),
      ...MAINTENANCE_GUIDES.map(g => ({ slug: g.slug, title: g.title, track: 'maintenance' as const, reads: readsByGuide.get(`maintenance:${g.slug}`) ?? 0 })),
    ],
    people: usagePeople,
  }

  return (
    <div className="space-y-8 hub-fade">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/hub/crm-2" className="text-[var(--text-secondary)] hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> CRM 2.0
        </Link>
        <span className="text-navy-200">/</span>
        <span className="text-navy font-medium">Admin</span>
      </div>

      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hub-orb-a absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-orange/30 blur-3xl" />
          <div className="hub-orb-b absolute -bottom-28 -left-16 w-[22rem] h-[22rem] rounded-full bg-orange/12 blur-3xl" />
        </div>
        <div className="relative px-7 py-10 sm:px-10 sm:py-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-200" aria-hidden />
            Admin
          </span>
          <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-white">CRM 2.0 Admin</h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
            The whole of CRM 2.0 in one place — see how much of the compliance and maintenance
            material the team is working through, track every knowledge check, and grant a retake
            on any failed attempt.
          </p>
        </div>
      </section>

      <Crm2AdminOverview assessments={assessments} people={people} usage={usage} />
    </div>
  )
}
