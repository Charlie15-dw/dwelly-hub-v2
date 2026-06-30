import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  GraduationCap, ArrowRight, Megaphone, MessageSquareDashed, MessageSquareReply, Users,
  BookA, AlertTriangle, RefreshCw, BarChart3, Scale, Sparkles, type LucideIcon,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import { hubUpdatesSorted } from '@/lib/updates'
import WelcomeGreeting from '@/components/ui/WelcomeGreeting'
import HubSearchPrompt from '@/components/hub/HubSearchPrompt'

// The Hub home — the centre of the Hub and the first place everyone lands.
// A hero, the full training journey kept as one, the latest Dwelly update, and
// the rest of the Hub grouped for quick access. Preview-gated.

// Training is one cohesive journey; these are its stages, surfaced as quick
// links on the training feature card.
const TRAINING_STEPS = [
  { href: '/pre-training', label: 'Learning Profile' },
  { href: '/training', label: 'Training Guide' },
  { href: '/modules', label: 'Video Modules' },
  { href: '/knowledge', label: 'Knowledge Base' },
  { href: '/assessments', label: 'Assessments' },
  { href: '/passport', label: 'Competency Passport' },
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

  const latest = hubUpdatesSorted()[0]

  return (
    <div className="space-y-8">
      {/* Hero — the centre of the Hub */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        {/* Decorative glow */}
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

      {/* Training feature + latest update */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Training — kept as one journey */}
        <Link
          href="/dashboard"
          className="lg:col-span-2 card p-6 group hover:shadow-md transition block relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-orange/10 text-orange border-orange/20">
              <GraduationCap className="w-5 h-5" aria-hidden />
            </div>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange group-hover:gap-2 transition-all">
              Open training <ArrowRight className="w-4 h-4" aria-hidden />
            </span>
          </div>
          <h3 className="text-lg font-bold text-navy mt-4">Training</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Your complete learning journey — guides, video modules, the knowledge base,
            assessments and your competency passport, all in one path from day one to signed off.
          </p>
          <div className="flex flex-wrap gap-2 mt-5">
            {TRAINING_STEPS.map((step, i) => (
              <span
                key={step.href}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-full pl-1.5 pr-3 py-1"
              >
                <span className="w-4 h-4 rounded-full bg-navy text-white flex items-center justify-center text-[9px] font-bold leading-none">
                  {i + 1}
                </span>
                {step.label}
              </span>
            ))}
          </div>
        </Link>

        {/* Latest from Dwelly */}
        {latest && (
          <Link href="/hub/updates" className="card p-6 group hover:shadow-md transition block">
            <div className="flex items-center gap-2 text-indigo-700">
              <Sparkles className="w-4 h-4" aria-hidden />
              <span className="text-[11px] font-bold uppercase tracking-widest">Latest update</span>
            </div>
            <h3 className="text-base font-bold text-navy mt-3">{latest.title}</h3>
            <p className="text-xs text-slate-400 mt-1">{formatDate(latest.date)}</p>
            {latest.intro && (
              <p className="text-sm text-slate-500 mt-3 leading-relaxed line-clamp-4">{latest.intro}</p>
            )}
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-orange mt-4 group-hover:gap-2 transition-all">
              See what&apos;s new <ArrowRight className="w-4 h-4" aria-hidden />
            </span>
          </Link>
        )}
      </div>

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
