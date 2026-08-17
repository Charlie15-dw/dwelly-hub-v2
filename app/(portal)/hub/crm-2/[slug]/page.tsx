import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft, Clock, ChevronRight, ChevronLeft, CalendarCheck, ClipboardCheck, Printer,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isCrm2Preview } from '@/lib/preview'
import {
  CRM2_LESSONS, CRM2_PILLARS, CRM2_LAST_REVIEWED, CRM2_GUIDES, CRM2_GUIDE_COUNT,
  getCrm2Lesson, getCrm2Glossary, getCrm2GuideNumber, getCrm2Guides, type Crm2Block,
} from '@/lib/crm2-content'
import { QUIZ_QUESTIONS } from '@/lib/data'
import { headingAnchor } from '@/lib/search-index'
import ReadingProgress from '@/components/knowledge/ReadingProgress'
import ArticleTOC from '@/components/knowledge/ArticleTOC'
import BookmarkButton from '@/components/knowledge/BookmarkButton'
import LessonActions from '@/components/crm2/LessonActions'
import AnnotatedImage from '@/components/crm2/AnnotatedImage'
import ButtonAdvisor from '@/components/crm2/ButtonAdvisor'
import ScenarioDrills from '@/components/crm2/ScenarioDrills'
import GlossaryText, { type GlossaryEntry } from '@/components/crm2/GlossaryText'
import Callout, { type CalloutVariant } from '@/components/ui/Callout'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return CRM2_LESSONS.map((l) => ({ slug: l.slug }))
}

function renderBlock(block: Crm2Block, i: number, glossary: GlossaryEntry[]) {
  const withGlossary = (text: string) =>
    glossary.length > 0 ? <GlossaryText text={text} glossary={glossary} /> : text

  switch (block.type) {

    case 'heading':
      return (
        <h2
          key={i}
          id={headingAnchor(block.text ?? '')}
          className="scroll-mt-8 text-[24px] font-semibold tracking-tight text-navy leading-[1.25] mt-10 mb-3.5"
        >
          {block.text}
        </h2>
      )

    case 'subheading':
      return (
        <h3 key={i} className="text-[19px] font-semibold text-navy leading-[1.3] mt-7 mb-3">
          {block.text}
        </h3>
      )

    case 'paragraph':
      return (
        <p key={i} className="text-[17px] leading-[1.7] text-navy-800 max-w-[68ch] mt-4">
          {block.text ? withGlossary(block.text) : null}
        </p>
      )

    case 'bullets':
      return (
        <ul key={i} className="mt-5 flex flex-col gap-3">
          {block.items?.map((item, j) => (
            <li key={j} className="flex gap-3.5 items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-navy mt-[11px]" />
              <p className="text-[17px] leading-[1.7] text-navy-800 max-w-[64ch]">{withGlossary(item)}</p>
            </li>
          ))}
        </ul>
      )

    case 'steps':
      return (
        <ol key={i} className="mt-5 flex flex-col gap-4">
          {block.items?.map((item, j) => {
            const emphasised = block.emphasisIndex === j
            return (
              <li
                key={j}
                className={cn(
                  'flex gap-4 items-start',
                  emphasised && 'rounded-xl bg-[#F0F7FF]/60 border border-[#CCE4FF] -mx-3.5 px-3.5 py-3',
                )}
              >
                <span
                  className={cn(
                    'flex-shrink-0 w-7 h-7 rounded-full text-white text-[14px] font-semibold flex items-center justify-center mt-0.5',
                    emphasised ? 'bg-orange' : 'bg-navy',
                  )}
                >
                  {j + 1}
                </span>
                <p className={cn('text-[17px] leading-[1.7] max-w-[64ch] flex-1', emphasised ? 'text-navy font-medium' : 'text-navy-800')}>
                  {withGlossary(item)}
                </p>
              </li>
            )
          })}
        </ol>
      )

    case 'callout':
      return (
        <Callout key={i} variant={(block.variant ?? 'info') as CalloutVariant} className="mt-6">
          {block.text ? withGlossary(block.text) : null}
        </Callout>
      )

    case 'table':
      return block.headers && block.rows ? (
        <div key={i} className="mt-6 overflow-x-auto rounded-2xl border border-navy-100">
          <table className="w-full text-[16px]">
            <thead>
              <tr className="bg-navy-50 border-b border-navy-100">
                {block.headers.map((h, j) => (
                  <th key={j} className="px-5 py-3 text-left text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {block.rows.map((row, j) => (
                <tr key={j}>
                  {row.map((cell, k) => (
                    <td key={k} className="px-5 py-4 text-navy-800 leading-[1.6] align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null

    case 'divider':
      return <hr key={i} className="mt-8 border-navy-100" />

    case 'image':
      if (!block.src) return null
      if (block.hotspots && block.hotspots.length > 0) {
        return <AnnotatedImage key={i} src={block.src} caption={block.text} hotspots={block.hotspots} />
      }
      return (
        <figure key={i} className="mt-6">
          <div className="rounded-2xl border border-navy-100 overflow-hidden bg-navy-50">
            {/* Static screenshot from the playbook; next/image is unnecessary here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.src} alt={block.text ?? ''} className="w-full h-auto block" loading="lazy" />
          </div>
          {block.text && (
            <figcaption className="text-[13px] text-[var(--text-secondary)] mt-2 text-center leading-relaxed">{block.text}</figcaption>
          )}
        </figure>
      )

    case 'widget':
      if (block.widget === 'button-advisor') return <ButtonAdvisor key={i} />
      if (block.widget === 'scenario-drills') return <ScenarioDrills key={i} />
      return null

    default:
      return null
  }
}

export default async function Crm2LessonPage({ params }: { params: { slug: string } }) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isCrm2Preview(user.email)) redirect('/hub')

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

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[14px]">
          <Link href="/hub/crm-2" className="text-[var(--text-secondary)] hover:text-navy flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" aria-hidden /> CRM 2.0
          </Link>
          <span className="text-navy-200">/</span>
          <span className="text-navy font-medium">{lesson.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_236px] gap-9 items-start">

          {/* ── Main column ─────────────────────────────────────────────── */}
          <div className="min-w-0 space-y-6 hub-fade">

            {/* Header card */}
            <div className="card p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[11.5px] font-semibold px-2.5 py-0.5 rounded-full phase-onboarding">
                      {kindLabel}
                    </span>
                    {pillar && (
                      <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
                        {pillar.label}
                      </span>
                    )}
                  </div>
                  <h1 className="text-[34px] font-semibold tracking-tight text-navy leading-[1.15] mt-3">
                    {lesson.title}
                  </h1>
                  <p className="text-[18px] leading-[1.6] text-[var(--text-secondary)] max-w-[58ch] mt-2">
                    {lesson.summary}
                  </p>
                </div>
                <BookmarkButton articleId={`crm2-${lesson.slug}`} variant="labelled" className="flex-shrink-0 hidden sm:inline-flex" />
              </div>

              <div className="flex items-center gap-x-6 gap-y-2 flex-wrap border-t border-navy-100 mt-5 pt-4">
                <span className="flex items-center gap-2 text-[14.5px] text-[var(--text-secondary)]">
                  <Clock className="w-4 h-4" aria-hidden /> {lesson.minutes} min read
                </span>
                <span className="flex items-center gap-2 text-[14.5px] text-[var(--text-secondary)]" title="Checked against the live CRM 2.0 build">
                  <CalendarCheck className="w-4 h-4" aria-hidden /> Reviewed {CRM2_LAST_REVIEWED}
                </span>
                {quizCount !== undefined && quizCount > 0 && (
                  <span className="flex items-center gap-2 text-[14.5px] text-[var(--text-secondary)]">
                    <ClipboardCheck className="w-4 h-4" aria-hidden /> Test yourself · {quizCount} questions
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <article className="card p-9 [&>*:first-child]:mt-0">
              {lesson.content.map((block, i) => renderBlock(block, i, glossary))}
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
