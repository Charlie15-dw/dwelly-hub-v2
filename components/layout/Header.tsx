'use client'


import { usePathname } from 'next/navigation'
import SearchBar from '@/components/ui/SearchBar'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
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
  const pageInfo = pageTitles[pathname] ?? { title: 'Portal', subtitle: 'Dwelly Training System' }

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 min-w-0">
        <div className="min-w-0">
          <h1 className="text-base font-bold text-navy leading-none">{pageInfo.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5 leading-none hidden sm:block">{pageInfo.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <SearchBar />

        {/* Date */}
        <div className="hidden lg:block text-right">
          <p className="text-xs font-medium text-navy">
            {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
          </p>
          <p className="text-[10px] text-slate-400">2026–2027 Programme</p>
        </div>
      </div>
    </header>
  )
}
