'use client'


import { usePathname } from 'next/navigation'
import { Search, Menu } from 'lucide-react'
import { useSidebar } from '@/components/layout/SidebarContext'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/hub':          { title: 'The Hub',              subtitle: 'The home of property management at Dwelly' },
  '/hub/connect':  { title: 'Connect',              subtitle: 'Updates, Q&A and team communication' },
  '/hub/updates':  { title: 'Dwelly Updates',       subtitle: 'What\u2019s changing across the product and why' },
  '/hub/ask':      { title: 'Anonymous Q&A',        subtitle: 'Raise questions and ideas — no name attached' },
  '/hub/answered': { title: 'You said, we did',      subtitle: 'What the team raised and what we did about it' },
  '/hub/meet':     { title: 'Monthly PM Meet',       subtitle: 'Agenda, recordings and captured decisions' },
  '/dashboard':    { title: 'Dashboard',            subtitle: 'Your learning overview' },
  '/pre-training': { title: 'Learning Profile',     subtitle: 'Tell us how you learn best before you start the modules' },
  '/training':     { title: 'Training Guide',       subtitle: 'Written guides for every area of the Dwelly platform' },
  '/modules':      { title: 'Video Modules',        subtitle: 'Browse and continue your learning pathway' },
  '/knowledge':    { title: 'Knowledge Base',       subtitle: 'In-depth property and management knowledge articles' },
  '/assessments':  { title: 'Assessments',          subtitle: 'Test your knowledge across training, modules, and the knowledge base' },
  '/passport':     { title: 'Competency Passport',  subtitle: 'Your verified skills and competency sign-off record' },
  '/glossary':     { title: 'Glossary',             subtitle: 'A-Z of property management terminology' },
  '/emergency':    { title: 'Emergency Procedures', subtitle: 'Quick-reference guides for property emergencies' },
  '/recap':        { title: 'Recap & Refresh',      subtitle: 'Monthly check-ins and refresher content for experienced PMs' },
  '/analytics':    { title: 'My Analytics',         subtitle: 'Your learning performance and development insights' },
  '/settings':     { title: 'Settings',             subtitle: 'Profile, preferences, and accessibility' },
  '/manager':      { title: 'Manager Dashboard',    subtitle: 'Team progress and performance overview' },
  '/dobby':        { title: 'Ask Dobby',            subtitle: 'Your portal assistant — questions answered from Dwelly\'s training content' },
}

export default function Header() {
  const pathname = usePathname()
  const pageInfo = pageTitles[pathname] ?? { title: 'The Hub', subtitle: 'Dwelly training & knowledge' }
  const { toggle } = useSidebar()

  return (
    <header className="relative overflow-hidden bg-navy text-white sticky top-0 z-30">
      {/* Ambient glow + faint grid — echoes the sign-in screen */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hub-orb-a absolute -top-24 right-12 w-64 h-64 rounded-full bg-orange-500/25 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-56 h-56 rounded-full bg-orange-400/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '34px 34px',
            maskImage: 'linear-gradient(90deg, #000 30%, transparent 90%)',
            WebkitMaskImage: 'linear-gradient(90deg, #000 30%, transparent 90%)',
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      </div>

      <div className="relative flex items-center justify-between gap-3 px-4 sm:px-6 h-16">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={toggle}
            className="lg:hidden -ml-1 p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition flex-shrink-0"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" aria-hidden />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white leading-tight tracking-tight truncate">
              {pageInfo.title}
            </h1>
            <p className="text-xs text-white/55 mt-0.5 leading-none hidden sm:block truncate">
              {pageInfo.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Universal ⌘K search trigger */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('hub:open-search'))}
            className="group flex items-center gap-2 h-9 pl-3 pr-2 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 backdrop-blur-sm transition text-white/70 hover:text-white"
            aria-label="Search the Hub"
          >
            <Search className="w-4 h-4 flex-shrink-0" aria-hidden />
            <span className="text-sm hidden sm:block">Search the Hub…</span>
            <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-sans font-semibold text-white/70 bg-white/10 border border-white/20 rounded px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>

          {/* Date */}
          <div className="hidden lg:block text-right">
            <p className="text-xs font-medium text-white">
              {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
            <p className="text-[10px] text-white/45">Training Programme</p>
          </div>
        </div>
      </div>
    </header>
  )
}
