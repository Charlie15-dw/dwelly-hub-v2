import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft, Clock, ChevronRight, ChevronLeft,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { canAccessCrm2 } from '@/lib/crm2-access'
import { isMaintenancePreview } from '@/lib/preview'
import { type Crm2Block } from '@/lib/crm2-content'
import {
  MAINTENANCE_LESSONS, MAINTENANCE_PILLARS, MAINTENANCE_GUIDES, MAINTENANCE_GUIDE_COUNT,
  getMaintenanceLesson, getMaintenanceGuideNumber, getMaintenanceGuides,
} from '@/lib/crm2-maintenance-content'
import { MAINTENANCE_CONTENT_TYPE } from '@/lib/crm2-completions'
import { QUIZ_QUESTIONS } from '@/lib/data'
import { headingAnchor } from '@/lib/search-index'
import ReadingProgress from '@/components/knowledge/ReadingProgress'
import ArticleTOC from '@/components/knowledge/ArticleTOC'
import BookmarkButton from '@/components/knowledge/BookmarkButton'
import LessonActions from '@/components/crm2/LessonActions'
import { renderBlock } from '@/components/crm2/renderBlock'
import { type GlossaryEntry } from '@/components/crm2/GlossaryText'

export function generateStaticParams() {
  return MAINTENANCE_LESSONS.map((l) => ({ slug: l.slug }))
}

export default async function Crm2MaintenanceLessonPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!(await canAccessCrm2(supabase, user))) redirect('/hub')
  // The Maintenance track is preview-only for now.
  if (!isMaintenancePreview(user.email)) redirect('/hub/crm-2')

  const lesson = getMaintenanceLesson(params.slug)
  if (!lesson) notFound()

  const pillar = MAINTENANCE_PILLARS.find((p) => p.id === lesson.pillar)
  const guideNumber = getMaintenanceGuideNumber(lesson.slug)

  // The maintenance track has no glossary tooltips yet — pass an empty list so
  // the shared renderer skips them.
  const glossary: GlossaryEntry[] = []

  // Top-level headings drive the table of contents.
  const headings = lesson.content
    .filter((b): b is Crm2Block & { text: string } => b.type === 'heading' && !!b.text)
    .map((b) => ({ id: headingAnchor(b.text), text: b.text }))

  // The first paragraph is styled as a lede.
  const ledeIndex = lesson.content.findIndex((b) => b.type === 'paragraph')

  // Adjacent lessons for the bottom nav, following the reading order.
  const idx = MAINTENANCE_LESSONS.findIndex((l) => l.slug === lesson.slug)
  const prev = idx > 0 ? MAINTENANCE_LESSONS[idx - 1] : null
  const next = idx < MAINTENANCE_LESSONS.length - 1 ? MAINTENANCE_LESSONS[idx + 1] : null

  // "Next in this pillar" — the following guides in the same pillar.
  const nextInPillar =
    guideNumber
      ? getMaintenanceGuides(lesson.pillar)
          .filter((g) => (getMaintenanceGuideNumber(g.slug) ?? 0) > guideNumber)
          .slice(0, 2)
      : []

  const kindLabel = `Guide ${String(guideNumber ?? 0).padStart(2, '0')} of ${MAINTENANCE_GUIDE_COUNT}`
  const guideSlugs = MAINTENANCE_GUIDES.map((l) => l.slug)
  const quizCount = lesson.quizModuleId
    ? QUIZ_QUESTIONS.filter((q) => q.moduleId === lesson.quizModuleId).length
    : undefined

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-[1000px] space-y-6">

        {/* Breadcrumb + bookmark */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[14px] min-w-0">
            <Link href="/hub/crm-2/maintenance" className="text-[var(--text-secondary)] hover:text-navy flex items-center gap-1.5 transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" aria-hidden /> Maintenance
            </Link>
            <span className="text-navy-200 flex-shrink-0">/</span>
            <span className="text-navy font-medium truncate">{lesson.title}</span>
          </div>
          <BookmarkButton articleId={`crm2-maint-${lesson.slug}`} variant="labelled" className="flex-shrink-0 hidden sm:inline-flex" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_236px] gap-9 items-start">

          {/* ── Main column ─────────────────────────────────────────────── */}
          <div className="min-w-0 space-y-6 hub-fade">

            {/* Header — a compact hero, matching the section's landing page */}
            <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
              <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div className="hub-orb-a absolute -top-20 -right-16 w-[22rem] h-[22rem] rounded-full bg-orange/25 blur-3xl" />
                <div className="hub-orb-b absolute -bottom-24 -left-16 w-[18rem] h-[18rem] rounded-full bg-orange/10 blur-3xl" />
                <div
                  className="absolute inset-0 opacity-[0.1]"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
                    backgroundSize: '30px 30px',
                    maskImage: 'radial-gradient(ellipse at 80% 0%, #000 0%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at 80% 0%, #000 0%, transparent 70%)',
                  }}
                />
              </div>

              <div className="relative px-7 py-8 sm:px-9 sm:py-9">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
                    {kindLabel}
                  </span>
                  {pillar && (
                    <span className="text-[12px] font-semibold uppercase tracking-widest text-white/55">
                      {pillar.label}
                    </span>
                  )}
                </div>
                <h1 className="mt-3.5 text-[34px] leading-[1.12] font-bold tracking-tight text-white">
                  {lesson.title}
                </h1>
                <p className="mt-3 max-w-[60ch] text-[16.5px] leading-[1.6] text-white/70">
                  {lesson.summary}
                </p>

                <div className="mt-6 flex items-center gap-x-5 gap-y-2 flex-wrap border-t border-white/10 pt-4 text-[13.5px] text-white/65">
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" aria-hidden /> {lesson.minutes} min read
                  </span>
                </div>
              </div>
            </section>

            {/* Content */}
            <article className="card p-6 sm:p-9 [&>*:first-child]:mt-0">
              {lesson.content.map((block, i) => renderBlock(block, i, glossary, ledeIndex))}
            </article>

            {/* Mark as read + test yourself + was this helpful. Maintenance
                completions live in their own bucket, so they never touch the
                compliance certificate count. */}
            <LessonActions
              slug={lesson.slug}
              isGuide
              guideCount={MAINTENANCE_GUIDE_COUNT}
              guideSlugs={guideSlugs}
              quizModuleId={lesson.quizModuleId}
              quizCount={quizCount}
              contentType={MAINTENANCE_CONTENT_TYPE}
              progressSuffix="maintenance guides read"
            />

            {/* Lesson navigation */}
            <div className="grid grid-cols-2 gap-3">
              {prev ? (
                <Link href={`/hub/crm-2/maintenance/${prev.slug}`} className="card card-hover p-4 flex items-center gap-3 group">
                  <ChevronLeft className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 group-hover:text-orange transition-colors" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[13px] text-[var(--text-secondary)]">Previous</p>
                    <p className="text-[16px] font-semibold text-navy truncate mt-0.5">{prev.title}</p>
                  </div>
                </Link>
              ) : <div />}

              {next ? (
                <Link href={`/hub/crm-2/maintenance/${next.slug}`} className="card card-hover p-4 flex items-center justify-end gap-3 text-right group">
                  <div className="min-w-0">
                    <p className="text-[13px] text-[var(--text-secondary)]">Next</p>
                    <p className="text-[16px] font-semibold text-navy truncate mt-0.5">{next.title}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 group-hover:text-orange transition-colors" aria-hidden />
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* ── Sidebar ─────────────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col gap-4 sticky top-6 self-start">
            <ArticleTOC headings={headings} inline />

            {nextInPillar.length > 0 && (
              <div className="card p-5">
                <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] mb-3">
                  Next in this pillar
                </p>
                <div className="flex flex-col gap-2.5">
                  {nextInPillar.map((g) => (
                    <Link key={g.slug} href={`/hub/crm-2/maintenance/${g.slug}`} className="flex items-center gap-3 group">
                      <span className="w-7 h-7 rounded-lg bg-navy-50 text-navy text-[12px] font-bold tabular-nums flex items-center justify-center flex-shrink-0">
                        {String(getMaintenanceGuideNumber(g.slug) ?? 0).padStart(2, '0')}
                      </span>
                      <span className="text-[14px] font-medium text-navy leading-snug group-hover:text-orange transition-colors">
                        {g.title}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
