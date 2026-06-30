import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Megaphone, MessageSquareDashed, MessageSquareReply, Users, GraduationCap, ArrowRight,
  Compass, Library, BookA, MonitorPlay, BookOpen, AlertTriangle, Award, ClipboardCheck,
  BarChart3, type LucideIcon,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'
import WelcomeGreeting from '@/components/ui/WelcomeGreeting'
import HubSearchPrompt from '@/components/hub/HubSearchPrompt'

// The Hub is organised into five pillars — the journey a property manager
// travels from learning the profession, to mastering Dwelly's system, to doing
// the job day to day, to proving their growth, to staying connected with the
// team. Each pillar groups the existing areas of the portal. Areas not yet
// built are marked `comingSoon` and render as non-interactive placeholders.

interface HubArea {
  href: string
  label: string
  description: string
  icon: LucideIcon
  comingSoon?: boolean
}

interface HubPillar {
  id: string
  title: string
  tagline: string
  icon: LucideIcon
  accent: string      // icon chip
  areas: HubArea[]
}

const PILLARS: HubPillar[] = [
  {
    id: 'learn',
    title: 'Learn the craft',
    tagline: 'Understand the UK residential lettings profession you work in.',
    icon: Compass,
    accent: 'text-teal bg-teal/10 border-teal/20',
    areas: [
      { href: '/knowledge', label: 'Knowledge Base', description: 'In-depth property and management knowledge articles.', icon: Library },
      { href: '/glossary', label: 'Glossary', description: 'A–Z of property management terminology.', icon: BookA },
    ],
  },
  {
    id: 'system',
    title: 'Master the system',
    tagline: 'Get fluent in the Dwelly platform you use every day.',
    icon: MonitorPlay,
    accent: 'text-orange bg-orange/10 border-orange/20',
    areas: [
      { href: '/training', label: 'Training Guide', description: 'Written guides for every area of the Dwelly platform.', icon: GraduationCap },
      { href: '/modules', label: 'Video Modules', description: 'Browse and continue your learning pathway.', icon: BookOpen },
    ],
  },
  {
    id: 'do',
    title: 'Do the job',
    tagline: 'Quick reference for the situations you face on the job.',
    icon: AlertTriangle,
    accent: 'text-red-600 bg-red-50 border-red-200',
    areas: [
      { href: '/emergency', label: 'Emergency Procedures', description: 'Quick-reference guides for property emergencies.', icon: AlertTriangle },
    ],
  },
  {
    id: 'grow',
    title: 'Grow & prove it',
    tagline: 'Test your knowledge, log your competencies and track your progress.',
    icon: Award,
    accent: 'text-gold-700 bg-gold/10 border-gold/20',
    areas: [
      { href: '/assessments', label: 'Assessments', description: 'Test your knowledge across training, modules and the knowledge base.', icon: ClipboardCheck },
      { href: '/passport', label: 'Competency Passport', description: 'Your verified skills and competency sign-off record.', icon: Award },
      { href: '/analytics', label: 'My Analytics', description: 'Your learning performance and development insights.', icon: BarChart3 },
    ],
  },
  {
    id: 'connect',
    title: 'Connect',
    tagline: 'Stay in the loop, raise your voice and see what changed.',
    icon: Users,
    accent: 'text-indigo-700 bg-indigo-100 border-indigo-200',
    areas: [
      { href: '/hub/updates', label: 'Dwelly Updates', description: 'What\u2019s changing and why — a rolling, searchable archive.', icon: Megaphone },
      { href: '/hub/ask', label: 'Anonymous Q&A', description: 'Raise questions and ideas honestly — no name attached.', icon: MessageSquareDashed },
      { href: '/hub/answered', label: 'You said, we did', description: 'The questions the team raised and what we did about them.', icon: MessageSquareReply },
      { href: '/hub/meet', label: 'Monthly PM Meet', description: 'Agenda, recordings and decisions from the monthly forum.', icon: Users, comingSoon: true },
    ],
  },
]

function AreaCard({ area }: { area: HubArea }) {
  const Icon = area.icon
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-slate-50 border border-slate-100 text-navy">
          <Icon className="w-4 h-4" aria-hidden />
        </div>
        {area.comingSoon ? (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
            Coming soon
          </span>
        ) : (
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-navy transition" aria-hidden />
        )}
      </div>
      <h4 className="text-sm font-bold text-navy mt-3">{area.label}</h4>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{area.description}</p>
    </>
  )

  if (area.comingSoon) {
    return <div className="card p-4 opacity-70 cursor-default select-none">{inner}</div>
  }

  return (
    <Link href={area.href} className="card p-4 group hover:shadow-md transition block">
      {inner}
    </Link>
  )
}

export default async function HubPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <span className="inline-block text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange/10 text-orange border border-orange/20 mb-3">
          Preview
        </span>
        <WelcomeGreeting fallbackRole="Property Manager" />
        <p className="text-sm text-slate-500 mt-3 max-w-2xl">
          Everything a Dwelly property manager needs, in one place — learn the craft, master the
          system, do the job, prove your growth and stay connected with the team.
        </p>
        <div className="mt-5 max-w-md">
          <HubSearchPrompt />
        </div>
      </div>

      {/* Pillars */}
      <div className="space-y-10">
        {PILLARS.map((pillar) => {
          const PillarIcon = pillar.icon
          return (
            <section key={pillar.id} aria-labelledby={`pillar-${pillar.id}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${pillar.accent}`}>
                  <PillarIcon className="w-5 h-5" aria-hidden />
                </div>
                <div>
                  <h3 id={`pillar-${pillar.id}`} className="text-base font-bold text-navy leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-500">{pillar.tagline}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {pillar.areas.map((area) => (
                  <AreaCard key={area.href} area={area} />
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
