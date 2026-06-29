import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Megaphone, MessageSquareDashed, Users, GraduationCap, ArrowRight,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import WelcomeGreeting from '@/components/ui/WelcomeGreeting'

// Cards for each area of the Hub. Areas that aren't built yet are marked
// `comingSoon` and render as non-interactive placeholders so the full shape
// of the Hub is visible during preview.
const HUB_AREAS = [
  {
    href: '/training',
    label: 'Training',
    description: 'Your learning journey, video modules, knowledge base and assessments — all in one place.',
    icon: GraduationCap,
    accent: 'text-teal bg-teal/10 border-teal/20',
    comingSoon: false,
  },
  {
    href: '/hub/updates',
    label: 'Dwelly Updates',
    description: 'What\u2019s changing and why — with a rolling FAQ and a searchable archive of past decisions.',
    icon: Megaphone,
    accent: 'text-indigo-700 bg-indigo-100 border-indigo-200',
    comingSoon: true,
  },
  {
    href: '/hub/ask',
    label: 'Anonymous Q&A',
    description: 'Raise questions, ideas and sticking points honestly — no name attached. Only the admin team sees submissions.',
    icon: MessageSquareDashed,
    accent: 'text-purple-700 bg-purple-100 border-purple-200',
    comingSoon: false,
  },
  {
    href: '/hub/meet',
    label: 'Monthly PM Meet',
    description: 'Agenda, recordings and captured decisions from the monthly conference-style forum.',
    icon: Users,
    accent: 'text-amber-700 bg-amber-100 border-amber-200',
    comingSoon: true,
  },
] as const

export default async function HubPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20 mb-3">
          Preview
        </span>
        <WelcomeGreeting fallbackRole="Property Manager" />
        <p className="text-sm text-slate-500 mt-3 max-w-2xl">
          The Hub is where things happen — updates, questions, the monthly meet, and your training,
          all in one place. This is an early preview only you can see.
        </p>
      </div>

      {/* Area cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {HUB_AREAS.map(({ href, label, description, icon: Icon, accent, comingSoon }) => {
          const inner = (
            <>
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${accent}`}>
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
                {comingSoon ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                    Coming soon
                  </span>
                ) : (
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-navy transition" aria-hidden />
                )}
              </div>
              <h3 className="text-base font-bold text-navy mt-4">{label}</h3>
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            </>
          )

          if (comingSoon) {
            return (
              <div key={href} className="card p-5 opacity-70 cursor-default select-none">
                {inner}
              </div>
            )
          }

          return (
            <Link key={href} href={href} className="card p-5 group hover:shadow-md transition block">
              {inner}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
