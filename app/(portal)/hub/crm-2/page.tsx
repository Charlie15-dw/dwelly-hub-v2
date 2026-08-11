import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles, ArrowRight, Rocket, Compass, GraduationCap, Lightbulb,
  Wand2, ClipboardCheck, ChevronRight, Award, type LucideIcon,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isCrm2Preview } from '@/lib/preview'
import { CRM2_PILLARS, CRM2_LESSONS, CRM2_CAPSTONE_MODULE_ID, type Crm2Pillar } from '@/lib/crm2-content'
import ProgressRing from '@/components/crm2/ProgressRing'
import ResumeCard from '@/components/crm2/ResumeCard'
import SearchTrigger from '@/components/crm2/SearchTrigger'

// CRM 2.0 — the private learning space for Dwelly's next-generation CRM.
// A premium landing that opens onto the lessons, which live in
// lib/crm2-content.ts and are grouped here by pillar. Gated to a small
// allow-list via isCrm2Preview so it stays hidden while it's being built.

// Each pillar gets an icon for the "what you'll find" preview cards.
const PILLAR_ICONS: Record<Crm2Pillar, LucideIcon> = {
  orientate: Compass,
  features: GraduationCap,
  operate: Lightbulb,
}

export default async function Crm2Page() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isCrm2Preview(user.email)) redirect('/hub')

  // Has this user passed the capstone? If so, a certificate is available.
  const { data: capstonePass } = await supabase
    .from('assessment_results')
    .select('id')
    .eq('user_id', user.id)
    .eq('assessment_id', CRM2_CAPSTONE_MODULE_ID)
    .eq('passed', true)
    .limit(1)
  const hasCertificate = (capstonePass?.length ?? 0) > 0

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
          <h1 className="mt-6 text-4xl sm:text-6xl font-bold leading-[1.05] tracking-tight text-white">
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
              {CRM2_LESSONS.length} guides ready to explore
            </span>
          </div>

          {/* Section search */}
          <div className="mt-6 max-w-md">
            <SearchTrigger />
          </div>
        </div>
      </section>

      {/* Pick up where you left off + your progress */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResumeCard lessons={CRM2_LESSONS.map((l) => ({ slug: l.slug, title: l.title, icon: l.icon, readTime: l.readTime }))} />
        <ProgressRing slugs={CRM2_LESSONS.map((l) => l.slug)} />
      </div>

      {/* Assessments + certificate (when earned) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/hub/crm-2/assessments" className="card card-hover p-5 flex items-center gap-4 group">
          <div className="w-16 h-16 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="w-7 h-7" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-navy">Assessments</p>
            <p className="text-sm text-slate-500 mt-0.5">Test yourself on the key lessons — retake any time.</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-navy transition flex-shrink-0" aria-hidden />
        </Link>

        {hasCertificate ? (
          <Link href="/print/crm-2/certificate" target="_blank" className="card card-hover p-5 flex items-center gap-4 group border-2 border-[#0071E3]/20">
            <div className="w-16 h-16 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center flex-shrink-0">
              <Award className="w-7 h-7" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-navy">Your certificate is ready</p>
              <p className="text-sm text-slate-500 mt-0.5">You passed the capstone — view, print or save it as a PDF.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-navy transition flex-shrink-0" aria-hidden />
          </Link>
        ) : (
          <Link href="/hub/crm-2/capstone" className="card card-hover p-5 flex items-center gap-4 group">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center flex-shrink-0">
              <Award className="w-7 h-7" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-navy">Earn your certificate</p>
              <p className="text-sm text-slate-500 mt-0.5">Pass the capstone assessment to unlock your CRM 2.0 certificate.</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-navy transition flex-shrink-0" aria-hidden />
          </Link>
        )}
      </div>

      {/* What you'll find here */}
      <section aria-labelledby="crm2-pillars" className="space-y-4">
        <div>
          <h2 id="crm2-pillars" className="text-xl font-bold text-navy">What you&rsquo;ll find here</h2>
          <p className="text-sm text-slate-500 mt-1">Your complete learning companion for CRM 2.0.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CRM2_PILLARS.map(({ id, label, description }) => {
            const Icon = PILLAR_ICONS[id]
            const count = CRM2_LESSONS.filter((l) => l.pillar === id).length
            return (
              <div key={id} className="card p-6 group relative overflow-hidden">
                <div className="pointer-events-none absolute -top-10 -right-10 w-28 h-28 rounded-full bg-orange/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-70" aria-hidden />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-navy text-white shadow-sm">
                    <Icon className="w-5 h-5" aria-hidden />
                  </div>
                  <h3 className="text-base font-bold text-navy mt-4">{label}</h3>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{description}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-3">
                    {count} {count === 1 ? 'guide' : 'guides'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Lessons, grouped by pillar */}
      <section aria-labelledby="crm2-lessons" className="space-y-8">
        <div>
          <h2 id="crm2-lessons" className="text-xl font-bold text-navy">Guides &amp; lessons</h2>
          <p className="text-sm text-slate-500 mt-1">Step-by-step walkthroughs for every part of 2.0.</p>
        </div>

        {CRM2_PILLARS.map(({ id, label }) => {
          const lessons = CRM2_LESSONS.filter((l) => l.pillar === id)
          if (lessons.length === 0) return null
          return (
            <div key={id} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">{label}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.slug}
                    href={`/hub/crm-2/${lesson.slug}`}
                    className="card p-5 group hover:shadow-md transition block"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-slate-50 text-2xl border-slate-100">
                        <span aria-hidden>{lesson.icon}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-navy transition" aria-hidden />
                    </div>
                    <h4 className="text-base font-bold text-navy mt-4">{lesson.title}</h4>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{lesson.summary}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-3">
                      {lesson.readTime}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </section>
    </div>
  )
}
