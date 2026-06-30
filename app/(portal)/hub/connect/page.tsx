import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Megaphone, MessageSquareDashed, MessageSquareReply, Users, ArrowRight, type LucideIcon,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import { hubUpdatesSorted } from '@/lib/updates'

// The Connect area — the Hub's connective features as a dedicated page of
// boxes. Mirrors the sidebar's Connect group (which also drops down for quick
// access). Preview-gated.

interface ConnectArea {
  href: string
  label: string
  description: string
  icon: LucideIcon
  comingSoon?: boolean
}

const CONNECT_AREAS: ConnectArea[] = [
  {
    href: '/hub/updates',
    label: 'Dwelly Updates',
    description: 'What\u2019s changing across the product and why — a rolling, searchable archive of releases.',
    icon: Megaphone,
  },
  {
    href: '/hub/ask',
    label: 'Anonymous Q&A',
    description: 'Raise questions, ideas and sticking points honestly — no name attached. Only the admin team sees submissions.',
    icon: MessageSquareDashed,
  },
  {
    href: '/hub/answered',
    label: 'You said, we did',
    description: 'See the questions and ideas the team raised, and what we did about them.',
    icon: MessageSquareReply,
  },
  {
    href: '/hub/meet',
    label: 'Monthly PM Meet',
    description: 'Agenda, recordings and captured decisions from the monthly conference-style forum.',
    icon: Users,
    comingSoon: true,
  },
]

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default async function HubConnectPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  const latest = hubUpdatesSorted()[0]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center border bg-indigo-100 text-indigo-700 border-indigo-200">
            <Users className="w-5 h-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy leading-tight">Connect</h2>
            <p className="text-sm text-slate-500">Stay in the loop, raise your voice and see what changed.</p>
          </div>
        </div>
      </div>

      {/* Connect boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONNECT_AREAS.map(({ href, label, description, icon: Icon, comingSoon }) => {
          const inner = (
            <>
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-slate-50 text-navy border-slate-100">
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
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{description}</p>
              {href === '/hub/updates' && latest && (
                <p className="text-xs text-slate-400 mt-3">
                  Latest: <span className="font-medium text-slate-500">{latest.title}</span> · {formatDate(latest.date)}
                </p>
              )}
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
