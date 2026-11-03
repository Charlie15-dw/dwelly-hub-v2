import { redirect } from 'next/navigation'
import {
  GraduationCap, Brain, BookOpen, Library, ClipboardCheck, Award,
  Scale, AlertTriangle, RefreshCw, BarChart3, Users, type LucideIcon,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { roleSkipsOnboarding } from '@/lib/onboarding-gate'
import WelcomeContinueButton from '@/components/onboarding/WelcomeContinueButton'

// Step 1 of 2 of the welcome gate (see lib/onboarding-gate.ts). A real rundown
// of where things live in the Hub, mirrored from the actual nav groups in
// components/layout/Sidebar.tsx — not invented copy.
const GROUPS: { label: string; icon: LucideIcon; blurb: string; items: { label: string; icon: LucideIcon }[] }[] = [
  {
    label: 'Training', icon: GraduationCap,
    blurb: 'Your numbered journey — work through it in order, step by step.',
    items: [
      { label: 'Learning Profile', icon: Brain },
      { label: 'Training Guide', icon: GraduationCap },
      { label: 'Video Modules', icon: BookOpen },
      { label: 'Knowledge Base', icon: Library },
      { label: 'Assessments', icon: ClipboardCheck },
      { label: 'Competency Passport', icon: Award },
    ],
  },
  {
    label: 'Tools & Reference', icon: Scale,
    blurb: 'Come back to these any time you need a quick answer.',
    items: [
      { label: 'Glossary', icon: Library },
      { label: 'Emergency Procedures', icon: AlertTriangle },
      { label: 'Deposit Simulator', icon: Scale },
    ],
  },
  {
    label: 'Your Development', icon: BarChart3,
    blurb: 'Track how you\u2019re doing and keep your knowledge fresh.',
    items: [
      { label: 'Recap & Refresh', icon: RefreshCw },
      { label: 'My Analytics', icon: BarChart3 },
    ],
  },
  {
    label: 'Connect', icon: Users,
    blurb: 'Company updates, anonymous Q&A, and your monthly PM meet.',
    items: [
      { label: 'Dwelly Updates', icon: Users },
      { label: 'Anonymous Q&A', icon: Users },
      { label: 'You said, we did', icon: Users },
    ],
  },
]

export default async function WelcomeNavigationPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .maybeSingle()

  if (roleSkipsOnboarding(profile?.role)) redirect('/hub')

  const firstName = profile?.full_name?.trim().split(' ')[0] ?? null

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-widest text-orange">
          Welcome · Step 1 of 2
        </p>
        <h1 className="mt-2 text-[30px] sm:text-[34px] font-bold tracking-tight text-navy leading-[1.1]">
          {firstName ? `Welcome to the Hub, ${firstName}` : 'Welcome to the Hub'}
        </h1>
        <p className="mt-2 max-w-[60ch] text-[16px] leading-[1.6] text-[var(--text-secondary)]">
          Before we get into your training, here&rsquo;s a quick tour of where everything lives.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {GROUPS.map((group) => (
          <div key={group.label} className="card p-5">
            <div className="flex items-center gap-2.5 mb-1.5">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#EEF3FE] text-orange">
                <group.icon className="w-4.5 h-4.5" aria-hidden />
              </span>
              <h2 className="font-bold text-navy">{group.label}</h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-3">{group.blurb}</p>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm text-navy">
                  <item.icon className="w-3.5 h-3.5 text-[var(--text-tertiary)]" aria-hidden />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card p-5 flex items-center justify-between gap-4 flex-wrap">
        <p className="text-sm text-[var(--text-secondary)] max-w-md">
          Next up: a quick overview of what&rsquo;s expected in your role.
        </p>
        <WelcomeContinueButton step="navigation" label="Continue" />
      </div>
    </div>
  )
}
