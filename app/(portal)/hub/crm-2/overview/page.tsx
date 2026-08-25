import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { CRM2_LESSONS } from '@/lib/crm2-content'
import Crm2AdminOverview, {
  type Crm2PersonRow,
  type Crm2Attempt,
  type Crm2Assessment,
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

  // The assessments are exactly the CRM 2.0 lessons that carry a quiz, so this
  // list stays in step automatically as lessons gain or lose knowledge checks.
  const quizLessons = CRM2_LESSONS.filter(l => l.quizModuleId)
  const assessments: Crm2Assessment[] = quizLessons.map(l => ({ id: l.quizModuleId as string, title: l.title }))
  const quizIds = assessments.map(a => a.id)

  // Service client — read every user's results and any queued resets, bypassing RLS.
  const service = createServiceClient()
  const [{ data: profiles }, { data: results }, { data: pendingResets }] = await Promise.all([
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
  ])

  const allResults = results ?? []
  const allProfiles = profiles ?? []

  // Pending (unconsumed) resets, grouped per user, filtered to CRM 2.0 assessments.
  const quizIdSet = new Set(quizIds)
  const pendingByUser = new Map<string, string[]>()
  for (const r of pendingResets ?? []) {
    if (!quizIdSet.has(r.module_id)) continue
    const list = pendingByUser.get(r.user_id) ?? []
    list.push(r.module_id)
    pendingByUser.set(r.user_id, list)
  }

  // Latest attempt per (user, assessment). Results come back newest-first, so the
  // first one we see for a key is the latest.
  const latest = new Map<string, Crm2Attempt>()
  const usersWithResults = new Set<string>()
  for (const r of allResults) {
    usersWithResults.add(r.user_id)
    const key = `${r.user_id}::${r.assessment_id}`
    if (latest.has(key)) continue
    latest.set(key, {
      score: r.score,
      passed: r.passed,
      answers: Array.isArray(r.answers) ? (r.answers as AnswerEntry[]) : [],
      completedAt: r.completed_at,
    })
  }

  // One row per person who has taken at least one CRM 2.0 assessment.
  const people: Crm2PersonRow[] = allProfiles
    .filter(p => usersWithResults.has(p.id))
    .map(p => {
      const name = displayName(p)
      const attempts: Record<string, Crm2Attempt> = {}
      for (const a of assessments) {
        const at = latest.get(`${p.id}::${a.id}`)
        if (at) attempts[a.id] = at
      }
      return {
        id: p.id,
        displayName: name,
        initials: initials(name),
        attempts,
        pending: pendingByUser.get(p.id) ?? [],
      }
    })
    // Most-recently-active people first.
    .sort((a, b) => {
      const la = Math.max(0, ...Object.values(a.attempts).map(x => (x.completedAt ? Date.parse(x.completedAt) : 0)))
      const lb = Math.max(0, ...Object.values(b.attempts).map(x => (x.completedAt ? Date.parse(x.completedAt) : 0)))
      return lb - la
    })

  return (
    <div className="space-y-8 hub-fade">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/hub/crm-2" className="text-[var(--text-secondary)] hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> CRM 2.0
        </Link>
        <span className="text-navy-200">/</span>
        <span className="text-navy font-medium">Assessment Overview</span>
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
          <h1 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-white">Assessment Overview</h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed">
            Every CRM 2.0 knowledge check in one place — track who&rsquo;s been assessed, spot the
            checks people are struggling with, and grant a retake on any failed attempt.
          </p>
        </div>
      </section>

      <Crm2AdminOverview assessments={assessments} people={people} />
    </div>
  )
}
