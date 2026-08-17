import Link from 'next/link'
import {
  Megaphone, MessageSquareDashed, MessageSquareReply, Users, ArrowRight, Sparkles, type LucideIcon,
} from 'lucide-react'

// Elevated Connect landing — matches the CRM 2.0 style: navy hero with a blur
// orb and glass pill, then the connective features as clean cards on navy
// tokens. Gated to the review accounts; everyone else sees the original.

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

export default function ElevatedConnect({ latest }: { latest: { title: string; date: string } | null }) {
  return (
    <div className="space-y-6 max-w-[880px]">
      {/* Hero */}
      <section className="hub-fade relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hub-orb-a absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-[#0071E3]/30 blur-3xl" />
          <div className="hub-orb-b absolute -bottom-28 -left-16 w-[22rem] h-[22rem] rounded-full bg-[#0071E3]/12 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
              backgroundSize: '30px 30px',
              maskImage: 'radial-gradient(ellipse at 75% 0%, #000 0%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 75% 0%, #000 0%, transparent 70%)',
            }}
          />
        </div>
        <div className="relative px-7 py-9 sm:px-10 sm:py-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-200" aria-hidden />
            Connect
          </span>
          <h1 className="mt-4 text-[34px] leading-[1.1] font-bold tracking-tight text-white">
            Stay in the loop
          </h1>
          <p className="mt-3 max-w-[52ch] text-[15px] text-white/70 leading-relaxed">
            Raise your voice, follow what&apos;s changing, and see what the team&apos;s feedback turned into.
          </p>
        </div>
      </section>

      {/* Connect areas */}
      <div className="hub-fade-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CONNECT_AREAS.map(({ href, label, description, icon: Icon, comingSoon }) => (
          <Link key={href} href={href} className="card card-hover p-5 flex flex-col group">
            <div className="flex items-start justify-between">
              <span className="w-11 h-11 rounded-xl bg-navy-50 text-navy flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" aria-hidden />
              </span>
              {comingSoon ? (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full rag-amber">
                  Coming soon
                </span>
              ) : (
                <ArrowRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[#0071E3] transition-colors mt-1" aria-hidden />
              )}
            </div>
            <h3 className="text-[16px] font-bold text-navy mt-4 group-hover:text-[#0071E3] transition-colors">{label}</h3>
            <p className="text-[13.5px] text-[var(--text-secondary)] mt-1 leading-relaxed flex-1">{description}</p>
            {href === '/hub/updates' && latest && (
              <p className="text-[12px] text-[var(--text-tertiary)] mt-3 pt-3 border-t border-navy-100">
                Latest: <span className="font-medium text-[var(--text-secondary)]">{latest.title}</span> · {formatDate(latest.date)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
