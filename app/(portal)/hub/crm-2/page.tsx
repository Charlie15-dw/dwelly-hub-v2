import { redirect } from 'next/navigation'
import {
  Sparkles, ArrowRight, Rocket, Compass, GraduationCap, Lightbulb,
  Wand2, type LucideIcon,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isCrm2Preview } from '@/lib/preview'

// CRM 2.0 — the private learning space for Dwelly's next-generation CRM.
// A premium landing that sets the tone; lessons and guides are added into
// CRM2_LESSONS below as the content lands. Gated to a small allow-list via
// isCrm2Preview so it stays hidden while it's being built.

interface Pillar {
  label: string
  description: string
  icon: LucideIcon
}

// The evergreen shape of what 2.0 learning will cover — surfaced as an
// enticing preview while the detailed content is written.
const PILLARS: Pillar[] = [
  {
    label: 'Get orientated',
    description: 'A guided tour of the new CRM — what\u2019s changed, where everything lives, and how to find your feet fast.',
    icon: Compass,
  },
  {
    label: 'Master the features',
    description: 'Deep-dives into everything 2.0 can do, from the everyday workflows to the powerful bits most people miss.',
    icon: GraduationCap,
  },
  {
    label: 'Work smarter',
    description: 'Tips, shortcuts and best-practice ways of working that turn 2.0 into a genuine time-saver.',
    icon: Lightbulb,
  },
]

interface Lesson {
  title: string
  description: string
  href?: string
}

// Lessons and guides are added here as the content is written. When this is
// empty, the page shows an elegant "landing shortly" state instead of a grid.
const CRM2_LESSONS: Lesson[] = []

export default async function Crm2Page() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isCrm2Preview(user.email)) redirect('/hub')

  const hasLessons = CRM2_LESSONS.length > 0

  return (
    <div className="space-y-10 hub-fade">
      {/* Hero — the wow moment */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        {/* Ambient, animated glow */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hub-orb-a absolute -top-28 -right-16 w-[30rem] h-[30rem] rounded-full bg-orange/30 blur-3xl" />
          <div className="hub-orb-b absolute -bottom-32 -left-16 w-[26rem] h-[26rem] rounded-full bg-indigo-500/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
              backgroundSize: '30px 30px',
              maskImage: 'radial-gradient(ellipse at 75% 0%, #000 0%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 75% 0%, #000 0%, transparent 70%)',
            }}
          />
        </div>

        <div className="relative px-7 py-12 sm:px-12 sm:py-16">
          {/* Eyebrow */}
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-200" aria-hidden />
            Introducing the next generation
          </span>

          {/* Title */}
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight">
            Everything you need to
            <br className="hidden sm:block" />
            {' '}master{' '}
            <span className="hub-shimmer">CRM 2.0</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/70 leading-relaxed">
            A smarter, faster, more powerful CRM is on its way — and this is the place to learn it
            inside out. Clear, beautifully-made guides that take you from your first login to
            power-user, one step at a time.
          </p>

          {/* Status pills */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold backdrop-blur-sm">
              <Rocket className="w-4 h-4 text-orange-200" aria-hidden />
              Built for the way you work
            </span>
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-semibold backdrop-blur-sm">
              <Wand2 className="w-4 h-4 text-orange-200" aria-hidden />
              New guides landing soon
            </span>
          </div>
        </div>
      </section>

      {/* What you'll find here */}
      <section aria-labelledby="crm2-pillars" className="space-y-4">
        <div>
          <h2 id="crm2-pillars" className="text-xl font-bold text-navy">What you&rsquo;ll find here</h2>
          <p className="text-sm text-slate-500 mt-1">Your complete learning companion for CRM 2.0.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PILLARS.map(({ label, description, icon: Icon }) => (
            <div key={label} className="card p-6 group relative overflow-hidden">
              <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-orange/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-70" aria-hidden />
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-navy text-white shadow-sm">
                  <Icon className="w-5 h-5" aria-hidden />
                </div>
                <h3 className="text-base font-bold text-navy mt-4">{label}</h3>
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lessons grid, or an elegant "landing shortly" state */}
      <section aria-labelledby="crm2-lessons" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="crm2-lessons" className="text-xl font-bold text-navy">Guides &amp; lessons</h2>
            <p className="text-sm text-slate-500 mt-1">Step-by-step walkthroughs for every part of 2.0.</p>
          </div>
        </div>

        {hasLessons ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRM2_LESSONS.map((lesson) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-slate-50 text-navy border-slate-100">
                      <Sparkles className="w-5 h-5" aria-hidden />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-navy transition" aria-hidden />
                  </div>
                  <h3 className="text-base font-bold text-navy mt-4">{lesson.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 leading-relaxed">{lesson.description}</p>
                </>
              )
              return lesson.href ? (
                <a key={lesson.title} href={lesson.href} className="card p-5 group hover:shadow-md transition block">
                  {inner}
                </a>
              ) : (
                <div key={lesson.title} className="card p-5 group">{inner}</div>
              )
            })}
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-dashed border-navy-200 bg-gradient-to-br from-white to-slate-50 px-8 py-14 text-center">
            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-orange/5 blur-3xl" aria-hidden />
            <div className="relative">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-navy text-white flex items-center justify-center shadow-sm">
                <Sparkles className="w-6 h-6" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-bold text-navy">Something great is being built</h3>
              <p className="mt-2 max-w-md mx-auto text-sm text-slate-500 leading-relaxed">
                The first CRM 2.0 guides are being crafted right now. Check back shortly — this space
                will fill up with everything you need to get the very best out of 2.0.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
