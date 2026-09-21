import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
  Sparkles, Search, Printer, ChevronRight, Target, Check,
  BookOpen, LayoutGrid, HelpCircle, Megaphone, BarChart3,
  Wrench, ShieldCheck, Workflow, ArrowRight, type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createServerClient } from '@/lib/supabase/server'
import { canAccessCrm2 } from '@/lib/crm2-access'
import { isMaintenancePreview } from '@/lib/preview'
import {
  CRM2_PILLARS, CRM2_LESSONS, CRM2_GUIDES, CRM2_GUIDE_COUNT, CRM2_GUIDE_MINUTES,
  CRM2_CAPSTONE_MODULE_ID, getCrm2GuideNumber, getCrm2Guides,
} from '@/lib/crm2-content'
import { getCrm2CompletedSlugs } from '@/lib/crm2-completions'
import ProgressRing, { type PillarProgress } from '@/components/crm2/ProgressRing'
import ResumeCard from '@/components/crm2/ResumeCard'
import GuideRow from '@/components/crm2/GuideRow'
import CertificateProgress from '@/components/crm2/CertificateProgress'
import Crm2LegacyImport from '@/components/crm2/Crm2LegacyImport'
import SearchTrigger from '@/components/crm2/SearchTrigger'

// CRM 2.0 — the private learning space for Dwelly's next-generation CRM.
// A single-column landing whose order answers a returning PM's three questions:
// where was I, how far in am I, what's next. Progress lives in Supabase, so the
// counts here are the real thing, not a localStorage guess. Gated to a small
// allow-list via isCrm2Preview.

// One Lucide icon per reference sheet — the landing page uses number chips for
// guides and these for references, so there's a single icon system per screen.
const REFERENCE_ICONS: Record<string, LucideIcon> = {
  glossary: BookOpen,
  cheatsheet: LayoutGrid,
  faq: HelpCircle,
  'whats-new': Megaphone,
}

export default async function Crm2Page() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!(await canAccessCrm2(supabase, user))) redirect('/hub')

  // Preview-only: the 2.0 tab as a chooser. A new agency lands here and picks a
  // track — Maintenance or Compliance — after the shared "how it works". The
  // guides/progress that used to live on this page now sit behind Compliance.
  // Everyone outside the allow-list keeps the current single-page landing below.
  if (isMaintenancePreview(user.email)) {
    const chooserReferences = CRM2_LESSONS.filter((l) => l.kind === 'reference')
    return (
      <div className="mx-auto max-w-[880px] space-y-7 hub-fade">
        <Crm2LegacyImport knownSlugs={CRM2_LESSONS.map((l) => l.slug)} />

        {/* Hero — unchanged from the single-page landing */}
        <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="hub-orb-a absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-orange/30 blur-3xl" />
            <div className="hub-orb-b absolute -bottom-28 -left-16 w-[22rem] h-[22rem] rounded-full bg-orange/12 blur-3xl" />
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
          <div className="relative px-7 py-9 sm:px-10 sm:py-11">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-orange-200" aria-hidden />
              The next generation
            </span>
            <h1 className="mt-4 text-[40px] leading-[1.05] font-bold tracking-tight text-white">
              Master <span className="hub-shimmer">CRM 2.0</span>
            </h1>
            <p className="mt-3 max-w-xl text-[15px] text-white/70 leading-relaxed">
              Two sides, one system. Learn how it works, then dive into maintenance or compliance.
            </p>
            <div className="mt-7 w-full sm:max-w-xs">
              <SearchTrigger />
            </div>
          </div>
        </section>

        {/* How it works — the shared starting point for both tracks */}
        <Link
          href="/hub/crm-2/how-it-works"
          className="card card-hover p-6 flex items-center gap-4 group"
        >
          <span className="w-12 h-12 rounded-2xl bg-orange/10 text-orange flex items-center justify-center flex-shrink-0">
            <Workflow className="w-6 h-6" aria-hidden />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">Start here</p>
            <h2 className="text-[17px] font-bold text-navy leading-tight mt-0.5">How CRM 2.0 works</h2>
            <p className="text-[13.5px] text-[var(--text-secondary)] mt-1 leading-snug">
              Maintenance and compliance run the same agent-led way — get the model first.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0 group-hover:text-orange group-hover:translate-x-0.5 transition-all" aria-hidden />
        </Link>

        {/* The split — pick a track */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          <Link href="/hub/crm-2/maintenance" className="card card-hover p-6 flex flex-col justify-between group">
            <div className="flex items-start gap-4">
              <span className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[18px] font-bold text-navy leading-snug">Maintenance</p>
                <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                  Running maintenance jobs through 2.0 — the agent, your checkpoints and the calls that are yours.
                </p>
              </div>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-orange self-start group-hover:gap-2 transition-all">
              Open Maintenance <ChevronRight className="w-4 h-4" aria-hidden />
            </span>
          </Link>

          <Link href="/hub/crm-2/compliance" className="card card-hover p-6 flex flex-col justify-between group">
            <div className="flex items-start gap-4">
              <span className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[18px] font-bold text-navy leading-snug">Compliance</p>
                <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                  Certificates end to end — {CRM2_GUIDE_COUNT} guides, the review checkpoints, then prove it.
                </p>
              </div>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-orange self-start group-hover:gap-2 transition-all">
              Open Compliance <ChevronRight className="w-4 h-4" aria-hidden />
            </span>
          </Link>
        </div>

        {/* Keep to hand — the reference sheets, below the main choices */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-navy">Keep to hand</h2>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1">
              Reference sheets — these don&rsquo;t count towards your progress.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {chooserReferences.map((ref) => {
              const Icon = REFERENCE_ICONS[ref.slug] ?? BookOpen
              return (
                <div key={ref.slug} className="card p-5 flex flex-col">
                  <Link href={`/hub/crm-2/${ref.slug}`} className="flex items-start gap-4 group">
                    <span className="w-11 h-11 rounded-xl bg-navy-50 text-navy flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" aria-hidden />
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-bold text-navy">{ref.title}</h3>
                      <p className="text-[13.5px] text-[var(--text-secondary)] mt-0.5 leading-snug">{ref.summary}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 mt-1 group-hover:text-navy transition-colors" aria-hidden />
                  </Link>
                  {ref.slug === 'cheatsheet' && (
                    <Link
                      href="/print/crm-2/cheatsheet"
                      target="_blank"
                      className="mt-3 pt-3 border-t border-navy-100 inline-flex items-center gap-1.5 text-[13px] font-semibold text-orange"
                    >
                      <Printer className="w-3.5 h-3.5" aria-hidden /> Print a one-pager
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </div>
    )
  }

  // Admins get an extra entry point to the org-wide assessment overview.
  const { data: roleRow } = await supabase
    .from('user_profiles').select('role').eq('id', user.id).maybeSingle()
  const isAdmin = roleRow?.role === 'admin'

  const completed = await getCrm2CompletedSlugs(supabase, user.id)

  // Has this user passed the capstone? If so, a certificate is available.
  const { data: capstonePass } = await supabase
    .from('assessment_results')
    .select('id')
    .eq('user_id', user.id)
    .eq('assessment_id', CRM2_CAPSTONE_MODULE_ID)
    .eq('passed', true)
    .limit(1)
  const hasCertificate = (capstonePass?.length ?? 0) > 0

  // Progress is measured across the twelve guides only.
  const guidesDone = CRM2_GUIDES.filter((g) => completed.has(g.slug)).length
  const outstandingGuides = CRM2_GUIDES.filter((g) => !completed.has(g.slug))
  const nextGuide = outstandingGuides[0] ?? null
  const minutesLeft = outstandingGuides.reduce((s, g) => s + g.minutes, 0)

  const pillarProgress: PillarProgress[] = CRM2_PILLARS.map(({ id, label }) => {
    const guides = getCrm2Guides(id)
    return { label, done: guides.filter((g) => completed.has(g.slug)).length, total: guides.length }
  })

  const references = CRM2_LESSONS.filter((l) => l.kind === 'reference')

  return (
    <div className="mx-auto max-w-[880px] space-y-7 hub-fade">
      <Crm2LegacyImport knownSlugs={CRM2_LESSONS.map((l) => l.slug)} />

      {/* Hero — the wow, at half the height */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="hub-orb-a absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full bg-orange/30 blur-3xl" />
          <div className="hub-orb-b absolute -bottom-28 -left-16 w-[22rem] h-[22rem] rounded-full bg-orange/12 blur-3xl" />
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

        <div className="relative px-7 py-9 sm:px-10 sm:py-11">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-orange-200" aria-hidden />
            The next generation
          </span>

          <h1 className="mt-4 text-[40px] leading-[1.05] font-bold tracking-tight text-white">
            Master <span className="hub-shimmer">CRM 2.0</span> Compliance
          </h1>
          <p className="mt-3 max-w-xl text-[15px] text-white/70 leading-relaxed">
            Everything you need to run the agent-led compliance flow with confidence, one guide at a time.
          </p>

          {/* Informative stat row */}
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tabular-nums">{CRM2_GUIDE_COUNT} guides</span>
              <span className="text-white/50">·</span>
              <span className="text-white/70">{CRM2_GUIDE_MINUTES} min</span>
            </div>
            <span className="hidden sm:block w-px h-4 bg-white/15" aria-hidden />
            <span className="text-white/70">{references.length} reference sheets</span>
            <div className="ml-auto w-full sm:w-auto sm:max-w-xs">
              <SearchTrigger />
            </div>
          </div>
        </div>
      </section>

      {/* Admin-only — jump to the org-wide assessment command centre */}
      {isAdmin && (
        <Link
          href="/hub/crm-2/overview"
          className="card card-hover p-5 flex items-center gap-4 group"
        >
          <span className="w-11 h-11 rounded-xl bg-navy text-white flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5" aria-hidden />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-bold text-navy">Assessment overview</p>
            <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
              Admin · track everyone&rsquo;s knowledge-check results and grant retakes
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-orange flex-shrink-0 group-hover:gap-2 transition-all">
            Open <ChevronRight className="w-4 h-4" aria-hidden />
          </span>
        </Link>
      )}

      {/* Where was I + how far in am I */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-4 items-stretch">
        <ResumeCard
          next={nextGuide ? { slug: nextGuide.slug, title: nextGuide.title, minutes: nextGuide.minutes } : null}
          guidesDone={guidesDone}
          guidesTotal={CRM2_GUIDE_COUNT}
          minutesLeft={minutesLeft}
          outstanding={outstandingGuides.length}
          hasCertificate={hasCertificate}
        />
        <ProgressRing done={guidesDone} total={CRM2_GUIDE_COUNT} pillars={pillarProgress} />
      </div>

      {/* The guides, as one row group per pillar */}
      {CRM2_PILLARS.map(({ id, label, description }, pillarIndex) => {
        const guides = getCrm2Guides(id)
        if (guides.length === 0) return null
        const done = guides.filter((g) => completed.has(g.slug)).length
        const minutes = guides.reduce((s, g) => s + g.minutes, 0)
        const complete = done === guides.length
        return (
          <section key={id} className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-navy-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Numbered badge — the three pillars read as a 1·2·3 journey. */}
                <span
                  className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center text-[15px] font-bold tabular-nums flex-shrink-0',
                    complete ? 'rag-green' : 'bg-navy text-white',
                  )}
                >
                  {complete ? <Check className="w-4 h-4" strokeWidth={2.5} aria-hidden /> : pillarIndex + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="text-[16px] font-bold text-navy leading-tight">{label}</h2>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 leading-snug">{description}</p>
                </div>
              </div>
              <span className="text-[12.5px] font-medium text-[var(--text-secondary)] tabular-nums whitespace-nowrap flex-shrink-0">
                {minutes} min · {done} of {guides.length} read
              </span>
            </div>
            <div>
              {guides.map((g) => (
                <GuideRow
                  key={g.slug}
                  slug={g.slug}
                  number={getCrm2GuideNumber(g.slug) ?? 0}
                  title={g.title}
                  summary={g.summary}
                  minutes={g.minutes}
                  read={completed.has(g.slug)}
                  inProgress={nextGuide?.slug === g.slug && guidesDone > 0}
                />
              ))}
            </div>
          </section>
        )
      })}

      {/* Keep to hand — the reference sheets */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-navy">Keep to hand</h2>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            Reference sheets — these don&rsquo;t count towards your progress.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {references.map((ref) => {
            const Icon = REFERENCE_ICONS[ref.slug] ?? BookOpen
            return (
              <div key={ref.slug} className="card p-5 flex flex-col">
                <Link href={`/hub/crm-2/${ref.slug}`} className="flex items-start gap-4 group">
                  <span className="w-11 h-11 rounded-xl bg-navy-50 text-navy flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" aria-hidden />
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-navy">{ref.title}</h3>
                    <p className="text-[13.5px] text-[var(--text-secondary)] mt-0.5 leading-snug">{ref.summary}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 mt-1 group-hover:text-navy transition-colors" aria-hidden />
                </Link>
                {ref.slug === 'cheatsheet' && (
                  <Link
                    href="/print/crm-2/cheatsheet"
                    target="_blank"
                    className="mt-3 pt-3 border-t border-navy-100 inline-flex items-center gap-1.5 text-[13px] font-semibold text-orange"
                  >
                    <Printer className="w-3.5 h-3.5" aria-hidden /> Print a one-pager
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Prove it — practice and the certificate */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-navy">Prove it</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          <Link href="/hub/crm-2/practice" className="card card-hover p-6 flex flex-col justify-between group">
            <div className="flex items-start gap-4">
              <span className="w-12 h-12 rounded-2xl bg-orange/10 text-orange flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[18px] font-bold text-navy leading-snug">Practice drills</p>
                <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed">
                  Work realistic jobs decision-by-decision. No score recorded — pure practice.
                </p>
              </div>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-orange self-start group-hover:gap-2 transition-all">
              Start practising <ChevronRight className="w-4 h-4" aria-hidden />
            </span>
          </Link>

          <CertificateProgress guidesDone={guidesDone} guidesTotal={CRM2_GUIDE_COUNT} hasCertificate={hasCertificate} />
        </div>
        <Link
          href="/hub/crm-2/assessments"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--text-secondary)] hover:text-navy transition-colors"
        >
          <Search className="w-3.5 h-3.5" aria-hidden /> Browse all knowledge checks
        </Link>
      </section>
    </div>
  )
}
