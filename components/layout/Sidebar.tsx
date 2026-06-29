'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Award, Users,
  ClipboardCheck, Settings, LogOut, ChevronRight, Bell, GraduationCap, Brain, Library, RefreshCw,
  AlertTriangle, BarChart3, BookA, MessageCircle, Building2, Scale, LayoutGrid, ChevronDown,
  MessageSquareDashed,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { isHubPreview } from '@/lib/preview'
import { useEffect, useState } from 'react'

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
  { href: '/emergency',   label: 'Emergency Procedures',   icon: AlertTriangle },
]

const managerItems = [
  { href: '/manager', label: 'Manager Dashboard', icon: Users },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isManager, setIsManager] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [trainingOpen, setTrainingOpen] = useState(false)
  const [propertyToolsOpen, setPropertyToolsOpen] = useState(false)
  const [developmentOpen, setDevelopmentOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const preview = isHubPreview(user.email)
      setIsPreview(preview)
      // In the Hub preview, these sections are collapsible groups; open the one
      // matching the current page automatically.
      if (preview) {
        if (pathname === '/dashboard' || journeyItems.some(i => pathname === i.href || pathname.startsWith(i.href))) {
          setTrainingOpen(true)
        }
        if (['/glossary', '/emergency'].some(p => pathname.startsWith(p))) {
          setPropertyToolsOpen(true)
        }
        if (['/recap', '/analytics'].some(p => pathname.startsWith(p))) {
          setDevelopmentOpen(true)
        }
      }
      const { data } = await supabase
        .from('user_profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()
      setIsManager(data?.role === 'manager')
      setIsAdmin(data?.role === 'admin')
      setUserDisplayName(data?.full_name ?? user.email?.split('@')[0] ?? null)
      setUserRole(data?.role ?? null)
    })
  }, [pathname])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 flex flex-col bg-gradient-navy select-none">
      {/* Logo */}
      <div className="flex flex-col gap-1 px-5 py-5 border-b border-white/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Dwelly" width={108} height={29} className="block" />
        <p className="text-[10px] font-medium text-[#1D1D1F] pl-0.5">{isPreview ? 'The Hub' : 'Training Portal'}</p>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide" aria-label="Main navigation">
        {/* Hub — the front door (preview only) */}
        {isPreview && (() => {
          const active = pathname.startsWith('/hub')
          return (
            <Link href="/hub" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
              <LayoutGrid className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">Hub</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20">
                Preview
              </span>
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
            </Link>
          )
        })()}

        {/* Dashboard — top-level in classic nav; lives inside Training in Hub preview */}
        {!isPreview && (() => {
          const active = pathname === '/dashboard'
          return (
            <Link href="/dashboard" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">Dashboard</span>
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
            </Link>
          )
        })()}

        {isPreview ? (
          <>
            {/* Training — collapsible group: Dashboard + numbered journey steps */}
            {(() => {
              const groupActive = pathname === '/dashboard' || journeyItems.some(i => pathname === i.href || pathname.startsWith(i.href))
              return (
                <button
                  type="button"
                  onClick={() => setTrainingOpen(o => !o)}
                  aria-expanded={trainingOpen}
                  className={cn('sidebar-link w-full text-left mt-4', groupActive && !trainingOpen && 'active')}
                >
                  <GraduationCap className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Training</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 flex-shrink-0 text-[#1D1D1F]/40 transition-transform', trainingOpen && 'rotate-180')} aria-hidden />
                </button>
              )
            })()}
            {trainingOpen && (
              <div className="ml-3 pl-3 border-l border-white/40 space-y-1">
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
                {journeyItems.map(({ href, label, step }) => {
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
              </div>
            )}

            {/* Ask Dobby — standalone (kept out of any group) */}
            {(() => {
              const active = pathname.startsWith('/dobby')
              return (
                <Link href="/dobby" className={cn('sidebar-link mt-2', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <MessageCircle className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Ask Dobby</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
                </Link>
              )
            })()}

            {/* Property Tools — collapsible group */}
            {(() => {
              const groupActive = ['/glossary', '/emergency'].some(p => pathname.startsWith(p))
              return (
                <button
                  type="button"
                  onClick={() => setPropertyToolsOpen(o => !o)}
                  aria-expanded={propertyToolsOpen}
                  className={cn('sidebar-link w-full text-left mt-2', groupActive && !propertyToolsOpen && 'active')}
                >
                  <Scale className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Property Tools</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 flex-shrink-0 text-[#1D1D1F]/40 transition-transform', propertyToolsOpen && 'rotate-180')} aria-hidden />
                </button>
              )
            })()}
            {propertyToolsOpen && (
              <div className="ml-3 pl-3 border-l border-white/40 space-y-1">
                {(() => {
                  const active = pathname.startsWith('/glossary')
                  return (
                    <Link href="/glossary" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                      <BookA className="w-4 h-4 flex-shrink-0" aria-hidden />
                      <span className="flex-1">Glossary</span>
                      {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
                    </Link>
                  )
                })()}
                {(() => {
                  const active = pathname.startsWith('/emergency')
                  return (
                    <Link href="/emergency" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" aria-hidden />
                      <span className="flex-1">Emergency Procedures</span>
                      {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
                    </Link>
                  )
                })()}
                <a
                  href="https://deposit-sim.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-link"
                >
                  <Scale className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Deposit Simulator</span>
                  <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40 rotate-45" aria-hidden />
                </a>
              </div>
            )}

            {/* Your Development — collapsible group */}
            {(() => {
              const groupActive = ['/recap', '/analytics'].some(p => pathname.startsWith(p))
              return (
                <button
                  type="button"
                  onClick={() => setDevelopmentOpen(o => !o)}
                  aria-expanded={developmentOpen}
                  className={cn('sidebar-link w-full text-left mt-2', groupActive && !developmentOpen && 'active')}
                >
                  <BarChart3 className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Your Development</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 flex-shrink-0 text-[#1D1D1F]/40 transition-transform', developmentOpen && 'rotate-180')} aria-hidden />
                </button>
              )
            })()}
            {developmentOpen && (
              <div className="ml-3 pl-3 border-l border-white/40 space-y-1">
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
              </div>
            )}
          </>
        ) : (
          <>
            {/* Your Journey */}
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-[#1D1D1F]/40">Your Journey</p>
            {journeyItems.map(({ href, label, step }) => {
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

            {/* Property Tools */}
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-[#1D1D1F]/40">Property Tools</p>
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
            {(() => {
              const active = pathname.startsWith('/dobby')
              return (
                <Link href="/dobby" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <MessageCircle className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Ask Dobby</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
                </Link>
              )
            })()}
            <a
              href="https://deposit-sim.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="sidebar-link"
            >
              <Scale className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">Deposit Simulator</span>
              <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40 rotate-45" aria-hidden />
            </a>

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
          </>
        )}

        {/* Management — managers and admins */}
        {(isManager || isAdmin) && (
          <>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-[#1D1D1F]/40">Management</p>
            {isAdmin && (() => {
              const active = pathname.startsWith('/admin') && !pathname.startsWith('/admin/questions')
              return (
                <Link href="/admin" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <Building2 className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Admin Overview</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
                </Link>
              )
            })()}
            {isAdmin && isPreview && (() => {
              const active = pathname.startsWith('/admin/questions')
              return (
                <Link href="/admin/questions" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <MessageSquareDashed className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Questions</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20">
                    Preview
                  </span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-[#1D1D1F]/40" aria-hidden />}
                </Link>
              )
            })()}
            {isManager && managerItems.map(({ href, label, icon: Icon }) => {
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
          </>
        )}
      </nav>

      {/* User identity */}
      {userDisplayName && (
        <div className="px-4 py-3 border-t border-white/40 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#1D1D1F]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[#1D1D1F] text-[10px] font-bold leading-none">
              {userDisplayName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-[#1D1D1F] truncate leading-tight">{userDisplayName}</p>
            {userRole && (
              <p className="text-[10px] text-[#1D1D1F]/50 leading-tight capitalize">{userRole.replace(/-/g, ' ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="px-3 py-3 space-y-1 border-t border-white/40">
        <Link href="/settings" className="sidebar-link">
          <Settings className="w-4 h-4 flex-shrink-0" aria-hidden />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="sidebar-link w-full text-left"
          style={{ color: '#CC3333' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#991111' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = ''; (e.currentTarget as HTMLButtonElement).style.color = '#CC3333' }}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" aria-hidden />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
