import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { UserProvider } from '@/components/UserProvider'
import { SettingsProvider } from '@/components/SettingsProvider'
import { SidebarProvider } from '@/components/layout/SidebarContext'
import CommandPalette from '@/components/hub/CommandPalette'
import ActivityTracker from '@/components/hub/ActivityTracker'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
    <SettingsProvider>
    <SidebarProvider>
    <CommandPalette />
    <ActivityTracker />
    <div className="relative min-h-screen bg-[#F5F5F7]">
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
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="hub-fade flex-1 p-6 max-w-[1400px]">
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
