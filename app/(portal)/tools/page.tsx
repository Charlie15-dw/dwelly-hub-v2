import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Phone, BookA, Home, MessagesSquare, Scale, RefreshCw, BarChart3, ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubElevated } from '@/lib/preview'

// Property Tools — a new landing page grouping the standalone tools by *when
// you'd reach for one*, not by type (handoff). This route is new, so it is
// gated to the two review accounts while the elevated design is signed off;
// everyone else is bounced back to the Hub.

interface Tool {
  href: string
  label: string
  blurb: string
  icon: LucideIcon
}

const GROUPS: { title: string; caption: string; tools: Tool[] }[] = [
  {
    title: 'Mid-call',
    caption: 'When you need an answer right now, with someone on the line.',
    tools: [
      { href: '/emergency', label: 'Emergency Procedures', blurb: 'What to do first when something is urgent.', icon: Phone },
      { href: '/glossary', label: 'Glossary', blurb: 'Plain-English definitions for the term you just heard.', icon: BookA },
    ],
  },
  {
    title: 'Practise',
    caption: 'Build the muscle before you need it for real.',
    tools: [
      { href: '/hub/deposit-simulator', label: 'Deposit Simulator', blurb: 'Work a dispute end to end against an adjudicator.', icon: Home },
      { href: '/hub/practice', label: 'Conversation practice', blurb: 'Rehearse difficult calls with an AI counterpart.', icon: MessagesSquare },
    ],
  },
  {
    title: 'Keep up & look back',
    caption: 'Stay current, and review how you\u2019re doing.',
    tools: [
      { href: '/hub/law', label: 'Law & legislation', blurb: 'The changes that affect how you manage.', icon: Scale },
      { href: '/recap', label: 'Recap & Refresh', blurb: 'Spaced refreshers that keep knowledge sharp.', icon: RefreshCw },
      { href: '/analytics', label: 'My Analytics', blurb: 'Where your time and scores are going.', icon: BarChart3 },
    ],
  },
]

export default async function ToolsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  // New page — review-gated until the elevated design is signed off.
  if (!isHubElevated(user.email)) redirect('/hub')

  return (
    <div className="max-w-[880px] space-y-6">
      <div className="hub-fade space-y-1.5">
        <h1 className="text-[26px] font-semibold text-navy tracking-tight">Property Tools</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">
          Everything that isn&apos;t a lesson — grouped by when you&apos;d reach for it, not by what it is.
        </p>
      </div>

      {GROUPS.map((g, gi) => (
        <section key={g.title} className={`hub-fade-${Math.min(gi + 1, 3)} space-y-3`}>
          <div className="space-y-0.5">
            <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{g.title}</h2>
            <p className="text-[13px] text-[var(--text-tertiary)]">{g.caption}</p>
          </div>
          <div className="card overflow-hidden">
            {g.tools.map(t => (
              <Link key={t.href} href={t.href} className="group flex items-center gap-4 px-6 py-[18px] border-t border-slate-100 first:border-t-0 hover:bg-slate-50 transition-colors">
                <span className="w-10 h-10 rounded-xl bg-[#F5F5F7] flex items-center justify-center flex-shrink-0">
                  <t.icon className="w-5 h-5 text-[var(--text-secondary)]" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15.5px] font-semibold text-navy">{t.label}</p>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{t.blurb}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071E3] transition-colors flex-shrink-0" aria-hidden />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
