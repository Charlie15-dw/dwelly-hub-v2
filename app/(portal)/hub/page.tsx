import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronRight, Megaphone, MessageCircle, RefreshCw } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubBeta, isHubElevated } from '@/lib/preview'
import { hubUpdatesSorted } from '@/lib/updates'
import WelcomeGreeting from '@/components/ui/WelcomeGreeting'
import HubSearchPrompt from '@/components/hub/HubSearchPrompt'
import HubJourney from '@/components/hub/HubJourney'
import GuidedJourney from '@/components/hub/GuidedJourney'
import FirstRunWelcome from '@/components/hub/FirstRunWelcome'
import NeedsYou from '@/components/hub/NeedsYou'
import ElevatedHome from '@/components/hub/ElevatedHome'
import { getHubHome } from '@/lib/hub-progress'

// The Hub home — "Today first". Order: what needs you today → how far through
// you are → where everything else lives. Each answered once.

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

// Bottom-of-page reference pills — the visual variety for Explore lives here,
// not in a stack of icon chips.
const TOOL_PILLS = [
  { href: '/glossary', label: 'Glossary' },
  { href: '/emergency', label: 'Emergency Procedures' },
  { href: '/hub/deposit-simulator', label: 'Deposit Simulator' },
  { href: '/hub/practice', label: 'Conversation practice' },
  { href: '/hub/law', label: 'Law & legislation' },
  { href: '/analytics', label: 'My Analytics' },
]

export default async function HubPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { firstName, journey, guided, needsYou, elevated } = await getHubHome(user.id, user.email)

  // Gated "Today first" elevated home — only the two review accounts see this
  // while it's being signed off. Everyone else falls through to the current home.
  if (isHubElevated(user.email)) {
    return <ElevatedHome firstName={firstName} needsYou={needsYou} data={elevated} />
  }

  const beta = isHubBeta(user.email)

  const latest = hubUpdatesSorted()[0]

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const n = needsYou.length
  const statusLine =
    n === 0
      ? `${dateStr} · You’re all caught up`
      : `${dateStr} · ${n} ${n === 1 ? 'thing needs' : 'things need'} you`

  return (
    <div className="space-y-6 max-w-[860px]">
      {/* 1 — Compact hero */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute -top-24 -right-16 w-60 h-60 rounded-full bg-orange/30 blur-3xl" aria-hidden />
        <div className="relative px-8 py-7 flex items-start justify-between gap-6 flex-wrap">
          <div className="min-w-0">
            <WelcomeGreeting fallbackRole="Property Manager" tone="light" />
            <p className="text-sm text-white/70 mt-2">{statusLine}</p>
          </div>
          <div className="w-full lg:w-[300px] flex-shrink-0">
            <HubSearchPrompt />
          </div>
        </div>
      </section>

      {/* 2 — Needs you (or the first-run welcome for a brand-new account) */}
      {journey.isNewStarter ? (
        <FirstRunWelcome firstName={firstName} />
      ) : (
        <NeedsYou items={needsYou} />
      )}

      {/* 3 — Your journey */}
      {beta ? (
        <GuidedJourney firstName={firstName} journey={guided} />
      ) : (
        <HubJourney
          firstName={firstName}
          isNewStarter={journey.isNewStarter}
          pct={journey.pct}
          continueHref={journey.continueHref}
          continueLabel={journey.continueLabel}
          steps={journey.steps}
        />
      )}

      {/* 4 — Explore the Hub */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Explore the Hub</h3>
        <div className="card overflow-hidden">
          {/* Dwelly Updates */}
          <Link href="/hub/updates" className="flex items-center gap-3.5 px-[22px] py-[15px] hover:bg-slate-50 transition-colors">
            <Megaphone className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-navy">Dwelly Updates</p>
              {latest && (
                <p className="text-[13px] text-slate-500 truncate">{latest.title} · {formatDate(latest.date)}</p>
              )}
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" aria-hidden />
          </Link>

          {/* Ask Dobby */}
          <Link href="/dobby" className="flex items-center gap-3.5 px-[22px] py-[15px] border-t border-slate-100 hover:bg-slate-50 transition-colors">
            <MessageCircle className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-navy">Ask Dobby</p>
              <p className="text-[13px] text-slate-500 truncate">Your portal assistant — answers from Dwelly’s training content</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" aria-hidden />
          </Link>

          {/* Recap & Refresh */}
          <Link href="/recap" className="flex items-center gap-3.5 px-[22px] py-[15px] border-t border-slate-100 hover:bg-slate-50 transition-colors">
            <RefreshCw className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold text-navy">Recap &amp; Refresh</p>
              <p className="text-[13px] text-slate-500 truncate">Spaced refreshers that keep knowledge sharp</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" aria-hidden />
          </Link>

          {/* Tools & Reference — pills carry the variety */}
          <div className="px-[22px] py-[15px] border-t border-slate-100">
            <p className="text-[13px] font-semibold text-navy mb-2.5">Tools &amp; Reference</p>
            <div className="flex flex-wrap gap-2">
              {TOOL_PILLS.map(pill => (
                <Link key={pill.href} href={pill.href} className="btn-outline text-[13px]">
                  {pill.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
