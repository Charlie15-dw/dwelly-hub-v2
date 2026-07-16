'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Award, Users,
  ClipboardCheck, Settings, LogOut, ChevronRight, Bell, GraduationCap, Brain, Library, RefreshCw,
  AlertTriangle, BarChart3, BookA, MessageCircle, Building2, Scale, LayoutGrid, ChevronDown,
  MessageSquareDashed, Megaphone, MessageSquareReply, type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { isHubPreview } from '@/lib/preview'
import { useSidebar } from '@/components/layout/SidebarContext'
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

// Hub preview navigation, organised into collapsible groups. Training is kept
// as one cohesive journey (the numbered steps, including assessments and the
// competency passport); the remaining areas group into tools, development and
// the Hub's own connective features.
interface HubNavItem {
  href: string
  label: string
  icon: LucideIcon
  external?: boolean
  comingSoon?: boolean
  badge?: string
  step?: number
}
interface HubNavGroup {
  id: string
  label: string
  icon: LucideIcon
  items: HubNavItem[]
  href?: string // if set, the group header links to this page (plus a toggle)
}

const HUB_GROUPS: HubNavGroup[] = [
  {
    id: 'training', label: 'Training', icon: GraduationCap,
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/pre-training', label: 'Learning Profile', icon: Brain, step: 1 },
      { href: '/training', label: 'Training Guide', icon: GraduationCap, step: 2 },
      { href: '/modules', label: 'Video Modules', icon: BookOpen, step: 3 },
      { href: '/knowledge', label: 'Knowledge Base', icon: Library, step: 4 },
      { href: '/assessments', label: 'Assessments', icon: ClipboardCheck, step: 5 },
      { href: '/passport', label: 'Competency Passport', icon: Award, step: 6 },
    ],
  },
  {
    id: 'tools', label: 'Tools & Reference', icon: Scale,
    items: [
      { href: '/glossary', label: 'Glossary', icon: BookA },
      { href: '/emergency', label: 'Emergency Procedures', icon: AlertTriangle },
      { href: '/hub/deposit-simulator', label: 'Deposit Simulator', icon: Scale },
    ],
  },
  {
    id: 'development', label: 'Your Development', icon: BarChart3,
    items: [
      { href: '/recap', label: 'Recap & Refresh', icon: RefreshCw, badge: 'Monthly' },
      { href: '/analytics', label: 'My Analytics', icon: BarChart3 },
    ],
  },
  {
    id: 'connect', label: 'Connect', icon: Users, href: '/hub/connect',
    items: [
      { href: '/hub/updates', label: 'Dwelly Updates', icon: Megaphone },
      { href: '/hub/ask', label: 'Anonymous Q&A', icon: MessageSquareDashed },
      { href: '/hub/answered', label: 'You said, we did', icon: MessageSquareReply },
      { href: '/hub/meet', label: 'Monthly PM Meet', icon: Users, comingSoon: true },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { open, close } = useSidebar()
  const [isManager, setIsManager] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const preview = isHubPreview(user.email)
      setIsPreview(preview)
      // In the Hub preview, each pillar is a collapsible group; open the one
      // matching the current page automatically.
      if (preview) {
        const toOpen: Record<string, boolean> = {}
        for (const group of HUB_GROUPS) {
          const hrefMatch = group.href ? pathname.startsWith(group.href) : false
          if (hrefMatch || group.items.some(i => !i.external && pathname.startsWith(i.href))) {
            toOpen[group.id] = true
          }
        }
        if (Object.keys(toOpen).length) setOpenGroups(prev => ({ ...prev, ...toOpen }))
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

  // Close the mobile drawer whenever the route changes (i.e. a nav link was
  // tapped). No-op on desktop where the sidebar is always visible.
  useEffect(() => { close() }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const renderGroup = (group: HubNavGroup) => {
    const GroupIcon = group.icon
    const open = !!openGroups[group.id]
    const hrefActive = group.href ? pathname.startsWith(group.href) : false
    const groupActive = hrefActive || group.items.some(i => !i.external && pathname.startsWith(i.href))
    const toggle = () => setOpenGroups(prev => ({ ...prev, [group.id]: !prev[group.id] }))
    return (
      <div key={group.id}>
        {group.href ? (
          // Header links to the group's page; a separate chevron toggles the dropdown.
          <div className="flex items-center gap-1 mt-2">
            <Link
              href={group.href}
              className={cn('sidebar-link flex-1', groupActive && 'active')}
              aria-current={hrefActive ? 'page' : undefined}
            >
              <GroupIcon className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">{group.label}</span>
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-label={`${open ? 'Collapse' : 'Expand'} ${group.label}`}
              className="flex items-center justify-center px-2 py-2.5 rounded-xl text-white/40 hover:bg-white/10 hover:text-white transition-all flex-shrink-0"
            >
              <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} aria-hidden />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            className={cn('sidebar-link w-full text-left mt-2', groupActive && !open && 'active')}
          >
            <GroupIcon className="w-4 h-4 flex-shrink-0" aria-hidden />
            <span className="flex-1">{group.label}</span>
            <ChevronDown className={cn('w-3.5 h-3.5 flex-shrink-0 text-white/40 transition-transform', open && 'rotate-180')} aria-hidden />
          </button>
        )}
        {open && (
          <div className="ml-3 pl-3 border-l border-white/15 space-y-1 mt-1">
            {group.items.map((item) => {
              const Icon = item.icon
              if (item.external) {
                return (
                  <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className="sidebar-link">
                    <Icon className="w-4 h-4 flex-shrink-0" aria-hidden />
                    <span className="flex-1">{item.label}</span>
                    <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40 rotate-45" aria-hidden />
                  </a>
                )
              }
              const active = pathname.startsWith(item.href)
              if (item.comingSoon) {
                return (
                  <Link key={item.href} href={item.href} className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                    <Icon className="w-4 h-4 flex-shrink-0" aria-hidden />
                    <span className="flex-1">{item.label}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/50 border border-white/10">
                      Soon
                    </span>
                  </Link>
                )
              }
              return (
                <Link key={item.href} href={item.href} className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  {item.step ? (
                    <span className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[9px] font-bold leading-none',
                      active ? 'bg-white text-navy' : 'bg-white/15 text-white/60',
                    )}>
                      {item.step}
                    </span>
                  ) : (
                    <Icon className="w-4 h-4 flex-shrink-0" aria-hidden />
                  )}
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
    {/* Mobile backdrop — tap to dismiss the drawer */}
    <div
      className={cn(
        'lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300',
        open ? 'opacity-100' : 'opacity-0 pointer-events-none',
      )}
      onClick={close}
      aria-hidden
    />
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-navy text-white select-none overflow-hidden',
        'transform transition-transform duration-300 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      {/* Ambient glow + faint grid — echoes the sign-in screen */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="hub-orb-a absolute -top-20 -left-10 w-56 h-56 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="hub-orb-b absolute top-1/2 -right-16 w-56 h-56 rounded-full bg-orange-400/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '30px 30px',
            maskImage: 'linear-gradient(180deg, #000 20%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(180deg, #000 20%, transparent 80%)',
          }}
        />
      </div>

      {/* Logo */}
      <div className="relative flex flex-col gap-1 px-5 py-5 border-b border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Dwelly" width={108} height={29} className="block" style={{ filter: 'brightness(0) invert(1)' }} />
        <p className="text-[10px] font-medium text-white/60 pl-0.5">{isPreview ? 'The Hub' : 'Training Portal'}</p>
      </div>

      {/* Main nav */}
      <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide" aria-label="Main navigation">
        {/* Hub — the front door (preview only) */}
        {isPreview && (() => {
          const active = pathname === '/hub'
          return (
            <Link href="/hub" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
              <LayoutGrid className="w-4 h-4 flex-shrink-0" aria-hidden />
              <span className="flex-1">Hub</span>
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
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
              {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
            </Link>
          )
        })()}

        {isPreview ? (
          <>
            {/* Connect — featured above Ask Dobby */}
            {HUB_GROUPS.filter(g => g.id === 'connect').map(renderGroup)}

            {/* Ask Dobby — standalone (kept out of any group) */}
            {(() => {
              const active = pathname.startsWith('/dobby')
              return (
                <Link href="/dobby" className={cn('sidebar-link mt-2', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <MessageCircle className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Ask Dobby</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })()}

            {/* Remaining collapsible groups — Training kept as one journey */}
            {HUB_GROUPS.filter(g => g.id !== 'connect').map(renderGroup)}
          </>
        ) : (
          <>
            {/* Your Journey */}
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-white/40">Your Journey</p>
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
                    active ? 'bg-white text-navy' : 'bg-white/15 text-white/60',
                  )}>
                    {step}
                  </span>
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })}

            {/* References */}
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-white/40">References</p>
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
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })}

            {/* Property Tools */}
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-white/40">Property Tools</p>
            {(() => {
              const active = pathname.startsWith('/recap')
              return (
                <Link href="/recap" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <RefreshCw className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Recap &amp; Refresh</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    Monthly
                  </span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })()}
            {(() => {
              const active = pathname.startsWith('/dobby')
              return (
                <Link href="/dobby" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <MessageCircle className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Ask Dobby</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })()}
            {(() => {
              const active = pathname.startsWith('/hub/deposit-simulator')
              return (
                <Link href="/hub/deposit-simulator" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <Scale className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Deposit Simulator</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })()}

            {/* Your Development */}
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-white/40">Your Development</p>
            {(() => {
              const active = pathname.startsWith('/analytics')
              return (
                <Link href="/analytics" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <BarChart3 className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">My Analytics</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })()}
          </>
        )}

        {/* Management — managers and admins */}
        {(isManager || isAdmin) && (
          <>
            <p className="px-3 text-[10px] font-semibold uppercase tracking-widest mt-4 mb-2 text-white/40">Management</p>
            {isAdmin && (() => {
              const active = pathname.startsWith('/admin') && !pathname.startsWith('/admin/questions')
              return (
                <Link href="/admin" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <Building2 className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Admin Overview</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })()}
            {isAdmin && isPreview && (() => {
              const active = pathname.startsWith('/admin/questions')
              return (
                <Link href="/admin/questions" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <MessageSquareDashed className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Questions</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })()}
            {isAdmin && (() => {
              const active = pathname.startsWith('/admin/training-requests')
              return (
                <Link href="/admin/training-requests" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <GraduationCap className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Training requests</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })()}
            {/* Request training — managers and admins only (not property managers) */}
            {(() => {
              const active = pathname.startsWith('/hub/request-training')
              return (
                <Link href="/hub/request-training" className={cn('sidebar-link', active && 'active')} aria-current={active ? 'page' : undefined}>
                  <GraduationCap className="w-4 h-4 flex-shrink-0" aria-hidden />
                  <span className="flex-1">Request training</span>
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
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
                  {active && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/40" aria-hidden />}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User identity */}
      {userDisplayName && (
        <div className="relative px-4 py-3 border-t border-white/10 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold leading-none">
              {userDisplayName.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[12px] font-semibold text-white truncate leading-tight">{userDisplayName}</p>
            {userRole && (
              <p className="text-[10px] text-white/50 leading-tight capitalize">{userRole.replace(/-/g, ' ')}</p>
            )}
          </div>
        </div>
      )}

      {/* Bottom actions */}
      <div className="relative px-3 py-3 space-y-1 border-t border-white/10">
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
    </>
  )
}
