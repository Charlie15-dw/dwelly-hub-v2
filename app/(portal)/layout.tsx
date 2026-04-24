import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import { UserProvider } from '@/components/UserProvider'

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="pl-64 flex flex-col min-h-screen">
        <Header />
        <main id="main-content" className="flex-1 p-6 max-w-[1400px]">
          {children}
        </main>
        <footer className="px-6 py-4 border-t border-slate-100 bg-white">
          <p className="text-xs text-slate-400">
            Dwelly Training Portal · 2026–2027 Programme · Built to property industry standards ·{' '}
            <a href="/governance" className="hover:text-teal transition-colors focus:outline-none focus:underline">
              Governance & Security Policy
            </a>
          </p>
        </footer>
      </div>
    </div>
    </UserProvider>
  )
}
