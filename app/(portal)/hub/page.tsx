import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight, Megaphone, MessageSquareDashed, MessageSquareReply, Users,
  BookA, AlertTriangle, RefreshCw, BarChart3, Scale, Sparkles,
  MessagesSquare, Landmark, type LucideIcon,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview, isHubBeta } from '@/lib/preview'
import { hubUpdatesSorted } from '@/lib/updates'
import { MODULES } from '@/lib/data'
import WelcomeGreeting from '@/components/ui/WelcomeGreeting'
import HubSearchPrompt from '@/components/hub/HubSearchPrompt'
import HubJourney from '@/components/hub/HubJourney'
import GuidedJourney from '@/components/hub/GuidedJourney'
import FirstRunWelcome from '@/components/hub/FirstRunWelcome'
import LearningStreak from '@/components/hub/LearningStreak'
import RefresherNudge from '@/components/hub/RefresherNudge'
import SupportNetwork from '@/components/hub/SupportNetwork'
import { computeJourney } from '@/lib/hub-journey'
import { computeGuidedJourney } from '@/lib/hub-guided-journey'

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
  const [{ data: profile }, { data: resultRows }, { data: progressRows }, { data: learningProfile }, { data: completionRows }] =
    await Promise.all([
      supabase.from('user_profiles').select('full_name').eq('id', user.id).maybeSingle(),
      supabase.from('assessment_results').select('assessment_id, passed').eq('user_id', user.id),
      supabase.from('module_progress').select('module_id, completed').eq('user_id', user.id),
      supabase.from('learning_profiles').select('completed_at').eq('user_id', user.id).maybeSingle(),
      supabase.from('content_completions').select('content_type, content_id').eq('user_id', user.id),
    ])

  const passedIds = new Set(
    (resultRows ?? [])
      .filter(r => r.passed && ALL_ASSESSMENT_IDS.includes(r.assessment_id))
      .map(r => r.assessment_id)
  )
  const completedAssessments = passedIds.size
  const totalAssessments = ALL_ASSESSMENT_IDS.length // 15

  // Countable modules exclude locked modules and always-on reference resources
  // (e.g. the Dobby-linked FAQ), which have no completion path — otherwise the
  // journey would be permanently stuck one short. Mirrors how the always-on
  // module is already excluded from ALL_ASSESSMENT_IDS.
  const countableModuleIds = new Set(
    MODULES.filter(m => !m.locked && m.duration !== 'Always-on').map(m => m.id)
  )
  const completedModuleIds = new Set(
    (progressRows ?? []).filter(r => r.completed && countableModuleIds.has(r.module_id)).map(r => r.module_id)
  )
  const totalModules = countableModuleIds.size
  const completedModules = Math.min(completedModuleIds.size, totalModules)

  // Section-level "worked through this" markers for the Training Guide and
  // Knowledge Base. Each section has a single sentinel marker (content_id
  // '__section__') the user sets on the section's listing page.
  const SECTION_ID = '__section__'
  const completions = completionRows ?? []
  const trainingDone = completions.some(
    c => c.content_type === 'training' && c.content_id === SECTION_ID
  )
  const knowledgeDone = completions.some(
    c => c.content_type === 'knowledge' && c.content_id === SECTION_ID
  )

  const journeyInput = {
    hasLearningProfile: !!learningProfile,
    completedModules,
    totalModules,
    completedAssessments,
    totalAssessments,
    hasAssessmentAttempts: (resultRows ?? []).length > 0,
    modulesStarted: completedModuleIds.size > 0,
    trainingDone,
    knowledgeDone,
  }

  const beta = isHubBeta(user.email)
  const { isNewStarter, continueHref, continueLabel, pct, steps } = computeJourney(journeyInput)
  const guided = beta ? computeGuidedJourney(journeyInput) : null

  const firstName = (profile?.full_name ?? user.email?.split('@')[0] ?? '').split(' ')[0]

  const latest = hubUpdatesSorted()[0]

  return (
    <div className="space-y-8">
      {/* Hero — the centre of the Hub */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-orange/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-teal-400/10 blur-3xl" aria-hidden />
        <div className="relative px-7 py-9 sm:px-10 sm:py-11">
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

      {/* First-run welcome — beta only, shows once */}
      {beta && <FirstRunWelcome firstName={firstName} />}

      {/* Gentle private habit loop — beta only */}
      {beta && <LearningStreak />}

      {/* Spaced-repetition refreshers due today — beta only */}
      {beta && <RefresherNudge />}

      {/* Your journey — progress-aware. Beta testers get the staged guided
          journey; everyone else keeps the current flat step list. */}
      {beta && guided ? (
        <GuidedJourney firstName={firstName} journey={guided} />
      ) : (
        <HubJourney
          firstName={firstName}
          isNewStarter={isNewStarter}
          pct={pct}
          continueHref={continueHref}
          continueLabel={continueLabel}
          steps={steps}
        />
      )}

      {/* Support network — beta only */}
      {beta && <SupportNetwork />}

      {/* Sharpen your skills — beta only tools */}
      {beta && (
        <section aria-labelledby="sharpen-heading" className="space-y-3">
          <h3 id="sharpen-heading" className="text-sm font-bold uppercase tracking-widest text-slate-400">Sharpen your skills</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/hub/practice" className="card p-5 group hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-orange/10 text-orange border-orange/20">
                <MessagesSquare className="w-5 h-5" aria-hidden />
              </div>
              <p className="text-sm font-bold text-navy mt-3">Conversation practice</p>
              <p className="text-xs text-slate-500 mt-1">Rehearse tough tenant &amp; landlord conversations with instant coaching.</p>
            </Link>
            <Link href="/hub/deposit-simulator" className="card p-5 group hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-emerald-100 text-emerald-700 border-emerald-200">
                <Scale className="w-5 h-5" aria-hidden />
              </div>
              <p className="text-sm font-bold text-navy mt-3">Deposit simulator</p>
              <p className="text-xs text-slate-500 mt-1">Build a deduction case and see how a TDS adjudicator would rule.</p>
            </Link>
            <Link href="/hub/law" className="card p-5 group hover:shadow-md transition">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-indigo-100 text-indigo-700 border-indigo-200">
                <Landmark className="w-5 h-5" aria-hidden />
              </div>
              <p className="text-sm font-bold text-navy mt-3">Law &amp; legislation feed</p>
              <p className="text-xs text-slate-500 mt-1">The latest UK lettings law changes, in plain English.</p>
            </Link>
          </div>
        </section>
      )}

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
