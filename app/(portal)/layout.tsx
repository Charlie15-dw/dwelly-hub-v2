import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { UserProvider } from '@/components/UserProvider'
import { SettingsProvider } from '@/components/SettingsProvider'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import CommandPalette from '@/components/hub/CommandPalette'
import ActivityTracker from '@/components/hub/ActivityTracker'
import ScrollReset from '@/components/layout/ScrollReset'
import OnboardingHeader from '@/components/onboarding/OnboardingHeader'
import { ONBOARDING_HOME, isGraduated } from '@/lib/onboarding-gate'
import { createServerClient } from '@/lib/supabase/server'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  // New starters reach the real lesson / guide / video / quiz pages during their
  // staged journey, but should see a segregated shell — no Hub sidebar or
  // navigation — not the full Hub. Decide here which chrome to render.
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  let onboarding = false
  if (user) {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role, onboarding_stage, onboarding_bypass')
      .eq('id', user.id)
      .maybeSingle()
    onboarding = !isGraduated(profile ?? null)
  }

  if (onboarding) {
    return (
      <UserProvider>
        <SettingsProvider>
          <div className="relative min-h-[100dvh] bg-[#F5F5F7]">
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="hub-orb-a absolute -top-32 -right-24 w-[32rem] h-[32rem] rounded-full bg-orange-500/[0.06] blur-3xl" />
            </div>
            <OnboardingHeader backHref={ONBOARDING_HOME} />
            <main id="main-content" className="hub-fade mx-auto w-full max-w-[1100px] px-4 sm:px-6 py-8">
              <ScrollReset />
              {children}
            </main>
          </div>
        </SettingsProvider>
      </UserProvider>
    )
  }

  return (
    <UserProvider>
    <SettingsProvider>
    <SidebarProvider>
    <CommandPalette />
    <ActivityTracker />
    <div className="relative h-[100dvh] overflow-hidden bg-[#F5F5F7]">
      {/* Ambient backdrop — a whisper of the sign-in / Hub vibe behind every page */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="hub-orb-a absolute -top-32 -right-24 w-[32rem] h-[32rem] rounded-full bg-orange-500/[0.06] blur-3xl" />
        <div className="hub-orb-b absolute top-1/3 -left-32 w-[28rem] h-[28rem] rounded-full bg-orange-400/[0.05] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(29,29,31,0.06) 1px, transparent 0)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse at 70% 0%, #000 0%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 70% 0%, #000 0%, transparent 70%)',
          }}
        />
      </div>
      <Sidebar />
      <div className="lg:pl-64 flex flex-col h-[100dvh]">
        <Header />
        <main id="main-content" className="hub-fade flex-1 min-h-0 overflow-y-auto p-6 w-full max-w-[1400px]">
          <ScrollReset />
          {children}
        </main>
        <footer className="px-6 py-4 border-t border-slate-200/70 bg-white/60 backdrop-blur-sm">
          <p className="text-xs text-slate-400">
            Dwelly Training Portal · Built to property industry standards ·{' '}
            <a href="/governance" className="hover:text-teal transition-colors focus:outline-none focus:underline">
              Governance & Security Policy
            </a>
          </p>
        </footer>
      </div>
    </div>
    </SidebarProvider>
    </SettingsProvider>
    </UserProvider>
  )
}
