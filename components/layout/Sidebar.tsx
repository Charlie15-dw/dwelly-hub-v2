'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Award, Users, MessageCircle,
  ClipboardCheck, Settings, LogOut, ChevronRight, Bell, GraduationCap, Brain, Library, RefreshCw,
  Shield, AlertTriangle, BarChart3, BookA,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const journeyItems = [
  { href: '/pre-training',  label: 'Learning Profile',     icon: Brain,          step: 1 },
  { href: '/training',      label: 'Training Guide',       icon: GraduationCap,  step: 2 },
  { href: '/modules',       label: 'Video Modules',        icon: BookOpen,       step: 3 },
  { href: '/knowledge',     label: 'Knowledge Base',       icon: Library,        step: 4 },
  { href: '/assessments',   label: 'Assessments',          icon: ClipboardCheck, step: 5 },
  { href: '/passport',      label: 'Competency Passport',  icon: Award,          step: 6 },
]

const referenceItems = [
  { href: '/glossary',    label: 'Glossary',              icon: BookA },
  { href: '/compliance',  label: 'Compliance Hub',         icon: Shield },
  { href: '/emergency',   label: 'Emergency Procedures',   icon: AlertTriangle },
]

const pmItems = [
  { href: '/dobby', label: 'Ask Dobby',        icon: MessageCircle },
  // Recap & Refresh rendered separately with Monthly badge
]

const managerItems = [
  { href: '/manager', label: 'Manager Dashboard', icon: Users },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-gradient-navy select-none">
      {/* Logo */}
      <div className="flex flex-col gap-1 px-5 py-5 border-b border-white/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Dwelly" width={108} height={29} className="block" />
        <p className="text-[10px] font-medium text-[#1D1D1F] pl-0.5">Training Portal</p>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide" aria-label="Main navigation">
        {/* Dashboard */}
        {(() => {
          const active = pathname === '/dashboard'
          return (
            <Link href="/dashboard" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">Dashboard</span>
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
            </Link>
          )
        })()}

        {/* Your Journey — numbered learning steps */}
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-[#1D1D1F]/40">Your Journey</p>
        {journeyItems.map(({ href, label, icon: Icon, step }) => {
          const active = pathname === href || pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn('sidebar-link', active && 'active')}
              aria-current={active ? 'page' : undefined}
            >
              <span className={cn(
                'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold leading-none',
                active ? 'bg-[#1D1D1F] text-white' : 'bg-[#1D1D1F]/15 text-[#1D1D1F]/60',
              )}>
                {step}
              </span>
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
            </Link>
          )
        })}

        {/* References */}
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-[#1D1D1F]/40">References</p>
        {referenceItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn('sidebar-link', active && 'active')}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
            </Link>
          )
        })}

        {/* Property Managers */}
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-[#1D1D1F]/40">Property Managers</p>
        {pmItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn('sidebar-link', active && 'active')}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
            </Link>
          )
        })}
        {(() => {
          const active = pathname.startsWith('/recap')
          return (
            <Link href="/recap" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
              <RefreshCw className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">Recap &amp; Refresh</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                Monthly
              </span>
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
            </Link>
          )
        })()}

        {/* Your Development */}
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-[#1D1D1F]/40">Your Development</p>
        {(() => {
          const active = pathname.startsWith('/analytics')
          return (
            <Link href="/analytics" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
              <BarChart3 className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">My Analytics</span>
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
            </Link>
          )
        })()}

        {/* Management */}
        <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-[#1D1D1F]/40">Management</p>
        {managerItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn('sidebar-link', active && 'active')}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-3 space-y-1 border-t border-white/40">
        <Link href="/settings" className="sidebar-link">
          <Settings className="w-4 h-4 flex-shrink-0" aria-hidden />
          <span>Settings</span>
        </Link>
        <Link href="/" className="sidebar-link" style={{ color: '#CC3333' }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(220,38,38,0.08)'; (e.currentTarget as HTMLAnchorElement).style.color = '#991111' }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = ''; (e.currentTarget as HTMLAnchorElement).style.color = '#CC3333' }}>
          <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden />
          <span>Sign Out</span>
        </Link>
      </div>
    </aside>
  )
}
