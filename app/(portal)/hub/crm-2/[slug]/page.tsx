import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft, Clock, ChevronRight, ChevronLeft, ClipboardCheck, Printer,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { canAccessCrm2 } from '@/lib/crm2-access'
import {
  CRM2_LESSONS, CRM2_PILLARS, CRM2_GUIDES, CRM2_GUIDE_COUNT,
  getCrm2Lesson, getCrm2Glossary, getCrm2GuideNumber, getCrm2Guides, type Crm2Block,
} from '@/lib/crm2-content'
import { QUIZ_QUESTIONS } from '@/lib/data'
import { headingAnchor } from '@/lib/search-index'
import ReadingProgress from '@/components/knowledge/ReadingProgress'
import ArticleTOC from '@/components/knowledge/ArticleTOC'
import BookmarkButton from '@/components/knowledge/BookmarkButton'
import LessonActions from '@/components/crm2/LessonActions'
import { renderBlock } from '@/components/crm2/renderBlock'
import { type GlossaryEntry } from '@/components/crm2/GlossaryText'

export function generateStaticParams() {
  return CRM2_LESSONS.map((l) => ({ slug: l.slug }))
}

export default async function Crm2LessonPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!(await canAccessCrm2(supabase, user))) redirect('/hub')

  const lesson = getCrm2Lesson(params.slug)
  if (!lesson) notFound()

  const pillar = CRM2_PILLARS.find((p) => p.id === lesson.pillar)
  const isGuide = lesson.kind === 'guide'
  const guideNumber = getCrm2GuideNumber(lesson.slug)
  const guideSlugs = CRM2_GUIDES.map((l) => l.slug)
  const quizCount = lesson.quizModuleId
    ? QUIZ_QUESTIONS.filter((q) => q.moduleId === lesson.quizModuleId).length
    : undefined

  // Inline glossary tooltips — but not on the glossary lesson itself, where the
  // terms are already the subject.
  const glossary: GlossaryEntry[] = lesson.slug === 'glossary' ? [] : getCrm2Glossary()

  // Top-level headings drive the table of contents.
  const headings = lesson.content
    .filter((b): b is Crm2Block & { text: string } => b.type === 'heading' && !!b.text)
    .map((b) => ({ id: headingAnchor(b.text), text: b.text }))

  // The first paragraph is styled as a lede.
  const ledeIndex = lesson.content.findIndex((b) => b.type === 'paragraph')

  // Adjacent lessons for the bottom nav, following the reading order.
  const idx = CRM2_LESSONS.findIndex((l) => l.slug === lesson.slug)
  const prev = idx > 0 ? CRM2_LESSONS[idx - 1] : null
  const next = idx < CRM2_LESSONS.length - 1 ? CRM2_LESSONS[idx + 1] : null

  // "Next in this pillar" — the following guides in the same pillar (guides only).
  const nextInPillar =
    isGuide && guideNumber
      ? getCrm2Guides(lesson.pillar)
          .filter((g) => (getCrm2GuideNumber(g.slug) ?? 0) > guideNumber)
          .slice(0, 2)
      : []

  const kindLabel = isGuide
    ? `Guide ${String(guideNumber ?? 0).padStart(2, '0')} of ${CRM2_GUIDE_COUNT}`
    : lesson.kind === 'reference' ? 'Reference sheet' : 'Practice'

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-[1000px] space-y-6">

        {/* Breadcrumb + bookmark */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[14px] min-w-0">
            <Link href="/hub/crm-2" className="text-[var(--text-secondary)] hover:text-navy flex items-center gap-1.5 transition-colors flex-shrink-0">
              <ArrowLeft className="w-4 h-4" aria-hidden /> CRM 2.0
            </Link>
            <span className="text-navy-200 flex-shrink-0">/</span>
            <span className="text-navy font-medium truncate">{lesson.title}</span>
          </div>
          <BookmarkButton articleId={`crm2-${lesson.slug}`} variant="labelled" className="flex-shrink-0 hidden sm:inline-flex" />
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
                  {quizCount !== undefined && quizCount > 0 && (
                    <>
                      <span className="hidden sm:block w-px h-3.5 bg-white/15" aria-hidden />
                      <span className="flex items-center gap-2">
                        <ClipboardCheck className="w-4 h-4" aria-hidden /> Test yourself · {quizCount} questions
                      </span>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Content */}
            <article className="card p-6 sm:p-9 [&>*:first-child]:mt-0">
              {lesson.content.map((block, i) => renderBlock(block, i, glossary, ledeIndex))}
            </article>

            {/* Printable one-pager — cheatsheet only */}
            {lesson.slug === 'cheatsheet' && (
              <Link
                href="/print/crm-2/cheatsheet"
                target="_blank"
                className="card card-hover p-5 flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-orange/10 text-orange flex items-center justify-center flex-shrink-0">
                  <Printer className="w-5 h-5" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-navy">Print this cheat sheet</p>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">Open a clean one-page version to print or save as PDF.</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[14px] font-semibold text-orange flex-shrink-0 group-hover:gap-2 transition-all">
                  Open <ChevronRight className="w-4 h-4" aria-hidden />
                </span>
              </Link>
            )}

            {/* Mark as read + test yourself + was this helpful */}
            <LessonActions
              slug={lesson.slug}
              isGuide={isGuide}
              guideCount={CRM2_GUIDE_COUNT}
              guideSlugs={guideSlugs}
              quizModuleId={lesson.quizModuleId}
              quizCount={quizCount}
            />

            {/* Lesson navigation */}
            <div className="grid grid-cols-2 gap-3">
              {prev ? (
                <Link href={`/hub/crm-2/${prev.slug}`} className="card card-hover p-4 flex items-center gap-3 group">
                  <ChevronLeft className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 group-hover:text-orange transition-colors" aria-hidden />
                  <div className="min-w-0">
                    <p className="text-[13px] text-[var(--text-secondary)]">Previous</p>
                    <p className="text-[16px] font-semibold text-navy truncate mt-0.5">{prev.title}</p>
                  </div>
                </Link>
              ) : <div />}

              {next ? (
                <Link href={`/hub/crm-2/${next.slug}`} className="card card-hover p-4 flex items-center justify-end gap-3 text-right group">
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
                    <Link key={g.slug} href={`/hub/crm-2/${g.slug}`} className="flex items-center gap-3 group">
                      <span className="w-7 h-7 rounded-lg bg-navy-50 text-navy text-[12px] font-bold tabular-nums flex items-center justify-center flex-shrink-0">
                        {String(getCrm2GuideNumber(g.slug) ?? 0).padStart(2, '0')}
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
