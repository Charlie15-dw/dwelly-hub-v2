import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight, Megaphone, MessageSquareDashed, MessageSquareReply, Users,
  BookA, AlertTriangle, RefreshCw, BarChart3, Scale, Sparkles, type LucideIcon,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import { hubUpdatesSorted } from '@/lib/updates'
import { MODULES } from '@/lib/data'
import WelcomeGreeting from '@/components/ui/WelcomeGreeting'
import HubSearchPrompt from '@/components/hub/HubSearchPrompt'
import HubJourney, { type JourneyStep } from '@/components/hub/HubJourney'

// The Hub home — the centre of the Hub and the first place everyone lands.
// A hero, a progress-aware training journey, the latest Dwelly update, and the
// rest of the Hub grouped for quick access. Preview-gated.

// The canonical 15 assessments (mirrors ALL_ASSESSMENT_IDS on the dashboard) —
// used to measure assessment progress consistently with the dashboard.
const ALL_ASSESSMENT_IDS = [
  'mnt-01', 'mnt-02', 'cmp-01', 'cmp-02', 'mnt-03', 'ins-02',
  'sys-01', 'mvt-02', 'sys-02', 'sup-02',
  'kno-01', 'kno-02', 'kno-03', 'full-assessment', 'master-assessment',
]

interface ExploreItem {
  href: string
  label: string
  description: string
  icon: LucideIcon
  external?: boolean
  comingSoon?: boolean
  badge?: string
}
interface ExploreGroup {
  id: string
  label: string
  items: ExploreItem[]
}

const EXPLORE_GROUPS: ExploreGroup[] = [
  {
    id: 'tools', label: 'Tools & Reference',
    items: [
      { href: '/glossary', label: 'Glossary', description: 'A\u2013Z of property management terminology.', icon: BookA },
      { href: '/emergency', label: 'Emergency Procedures', description: 'Quick-reference guides for property emergencies.', icon: AlertTriangle },
      { href: 'https://deposit-sim.vercel.app/', label: 'Deposit Simulator', description: 'Practise deposit deductions and disputes.', icon: Scale, external: true },
    ],
  },
  {
    id: 'development', label: 'Your Development',
    items: [
      { href: '/recap', label: 'Recap & Refresh', description: 'Your monthly knowledge refresher.', icon: RefreshCw, badge: 'Monthly' },
      { href: '/analytics', label: 'My Analytics', description: 'Your learning performance and insights.', icon: BarChart3 },
    ],
  },
  {
    id: 'connect', label: 'Connect',
    items: [
      { href: '/hub/updates', label: 'Dwelly Updates', description: 'What\u2019s changing across the product and why.', icon: Megaphone },
      { href: '/hub/ask', label: 'Anonymous Q&A', description: 'Raise questions and ideas — no name attached.', icon: MessageSquareDashed },
      { href: '/hub/answered', label: 'You said, we did', description: 'What the team raised and what we did about it.', icon: MessageSquareReply },
      { href: '/hub/meet', label: 'Monthly PM Meet', description: 'Agenda, recordings and captured decisions.', icon: Users, comingSoon: true },
    ],
  },
]

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function ExploreCard({ item }: { item: ExploreItem }) {
  const Icon = item.icon
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-100 text-navy">
          <Icon className="w-4 h-4" aria-hidden />
        </div>
        {item.comingSoon ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            Coming soon
          </span>
        ) : item.badge ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
            {item.badge}
          </span>
        ) : (
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-navy transition" aria-hidden />
        )}
      </div>
      <h4 className="text-sm font-bold text-navy mt-3">{item.label}</h4>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
    </>
  )

  if (item.comingSoon) {
    return <div className="card p-4 opacity-70 cursor-default select-none">{inner}</div>
  }
  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className="card p-4 group hover:shadow-md transition block">
        {inner}
      </a>
    )
  }
  return (
    <Link href={item.href} className="card p-4 group hover:shadow-md transition block">
      {inner}
    </Link>
  )
}

export default async function HubPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  // Progress for the journey — same tables the dashboard reads.
  const [{ data: profile }, { data: resultRows }, { data: progressRows }, { data: learningProfile }] =
    await Promise.all([
      supabase.from('user_profiles').select('full_name').eq('id', user.id).maybeSingle(),
      supabase.from('assessment_results').select('assessment_id, passed').eq('user_id', user.id),
      supabase.from('module_progress').select('module_id, completed').eq('user_id', user.id),
      supabase.from('learning_profiles').select('completed_at').eq('user_id', user.id).maybeSingle(),
    ])

  const passedIds = new Set(
    (resultRows ?? [])
      .filter(r => r.passed && ALL_ASSESSMENT_IDS.includes(r.assessment_id))
      .map(r => r.assessment_id)
  )
  const completedAssessments = passedIds.size
  const totalAssessments = ALL_ASSESSMENT_IDS.length // 15

  const completedModuleIds = new Set(
    (progressRows ?? []).filter(r => r.completed).map(r => r.module_id)
  )
  const totalModules = MODULES.filter(m => !m.locked).length
  const completedModules = Math.min(completedModuleIds.size, totalModules)

  const hasLearningProfile = !!learningProfile
  const modulesStarted = completedModuleIds.size > 0
  const modulesDone = totalModules > 0 && completedModules >= totalModules
  const assessmentsStarted = (resultRows ?? []).length > 0
  const assessmentsDone = completedAssessments >= totalAssessments

  const isNewStarter = !hasLearningProfile && !modulesStarted && !assessmentsStarted

  // The single "current" milestone drives the Continue button and step states.
  const current: 'profile' | 'modules' | 'assessments' | 'passport' =
    !hasLearningProfile ? 'profile'
    : !modulesDone ? 'modules'
    : !assessmentsDone ? 'assessments'
    : 'passport'

  const continueHref =
    current === 'profile' ? '/pre-training'
    : current === 'modules' ? '/modules'
    : current === 'assessments' ? '/assessments'
    : '/passport'
  const continueLabel =
    isNewStarter ? 'Start here'
    : current === 'profile' ? 'Continue: Learning Profile'
    : current === 'modules' ? 'Continue: Video Modules'
    : current === 'assessments' ? 'Continue: Assessments'
    : 'View your Passport'

  const pct = Math.round(
    ((hasLearningProfile ? 1 : 0)
      + (totalModules > 0 ? completedModules / totalModules : 0)
      + completedAssessments / totalAssessments) / 3 * 100
  )

  const firstName = (profile?.full_name ?? user.email?.split('@')[0] ?? '').split(' ')[0]

  const steps: JourneyStep[] = [
    {
      n: 1, label: 'Learning Profile', href: '/pre-training',
      state: hasLearningProfile ? 'done' : 'current',
      detail: hasLearningProfile ? 'Completed' : 'Start here — takes a couple of minutes',
    },
    {
      n: 2, label: 'Training Guide', href: '/training',
      state: 'explore',
      detail: 'Written guides for every area of the platform',
    },
    {
      n: 3, label: 'Video Modules', href: '/modules',
      state: modulesDone ? 'done' : current === 'modules' ? 'current' : 'todo',
      detail: modulesDone ? 'All modules complete' : `${completedModules} of ${totalModules} modules complete`,
    },
    {
      n: 4, label: 'Knowledge Base', href: '/knowledge',
      state: 'explore',
      detail: 'In-depth property management articles',
    },
    {
      n: 5, label: 'Assessments', href: '/assessments',
      state: assessmentsDone ? 'done' : current === 'assessments' ? 'current' : 'todo',
      detail: `${completedAssessments} of ${totalAssessments} passed`,
    },
    {
      n: 6, label: 'Competency Passport', href: '/passport',
      state: current === 'passport' ? 'current' : 'todo',
      detail: current === 'passport' ? 'Ready — view your signed-off record' : 'Your finish line',
    },
  ]

  const latest = hubUpdatesSorted()[0]

  return (
    <div className="space-y-8">
      {/* Hero — the centre of the Hub */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-orange/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-teal-400/10 blur-3xl" aria-hidden />
        <div className="relative px-7 py-9 sm:px-10 sm:py-11">
          <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-white border border-white/20 mb-4">
            Preview
          </span>
          <WelcomeGreeting fallbackRole="Property Manager" tone="light" />
          <p className="text-sm sm:text-base text-white/70 mt-4 max-w-2xl leading-relaxed">
            Welcome to the Hub — the home of property management at Dwelly. Everything you need to
            learn the craft, master the system and do great work, all in one place.
          </p>
          <div className="mt-6 max-w-lg">
            <HubSearchPrompt />
          </div>
        </div>
      </section>

      {/* Your journey — progress-aware */}
      <HubJourney
        firstName={firstName}
        isNewStarter={isNewStarter}
        pct={pct}
        continueHref={continueHref}
        continueLabel={continueLabel}
        steps={steps}
      />

      {/* Latest from Dwelly */}
      {latest && (
        <Link href="/hub/updates" className="card p-5 group hover:shadow-md transition flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-indigo-100 text-indigo-700 border-indigo-200 flex-shrink-0">
            <Sparkles className="w-5 h-5" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-700">Latest update</span>
              <span className="text-xs text-slate-400">{formatDate(latest.date)}</span>
            </div>
            <p className="text-sm font-bold text-navy mt-0.5 truncate">{latest.title}</p>
            {latest.intro && <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{latest.intro}</p>}
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-orange flex-shrink-0 group-hover:gap-2 transition-all">
            See what&apos;s new <ArrowRight className="w-4 h-4" aria-hidden />
          </span>
        </Link>
      )}

      {/* Explore the Hub */}
      <div className="space-y-6">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Explore the Hub</h3>
        {EXPLORE_GROUPS.map((group) => (
          <section key={group.id} aria-labelledby={`explore-${group.id}`}>
            <h4 id={`explore-${group.id}`} className="text-sm font-bold text-navy mb-3">{group.label}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.items.map((item) => (
                <ExploreCard key={item.href} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
