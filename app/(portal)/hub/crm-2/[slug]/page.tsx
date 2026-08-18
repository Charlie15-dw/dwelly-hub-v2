import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft, Clock, ChevronRight, ChevronLeft, ChevronDown, ClipboardCheck, Printer,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isCrm2Preview } from '@/lib/preview'
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
import AnnotatedImage from '@/components/crm2/AnnotatedImage'
import ButtonAdvisor from '@/components/crm2/ButtonAdvisor'
import ScenarioDrills from '@/components/crm2/ScenarioDrills'
import GlossaryText, { type GlossaryEntry } from '@/components/crm2/GlossaryText'
import Callout, { type CalloutVariant } from '@/components/ui/Callout'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return CRM2_LESSONS.map((l) => ({ slug: l.slug }))
}

// A two-column table whose second column is long prose reads far better as
// stacked definition rows than as cramped cells. Decide per block on cell
// length — matches the Training Guide's treatment so the two feel like one app.
function isProseTable(block: Crm2Block): boolean {
  return (
    block.headers?.length === 2 &&
    !!block.rows?.some((r) => (r[1]?.length ?? 0) > 120)
  )
}

function renderBlock(block: Crm2Block, i: number, glossary: GlossaryEntry[], ledeIndex: number) {
  const withGlossary = (text: string) =>
    glossary.length > 0 ? <GlossaryText text={text} glossary={glossary} /> : text

  switch (block.type) {

    case 'heading':
      // A slim accent bar turns a long guide into clearly scannable sections.
      return (
        <h2
          key={i}
          id={headingAnchor(block.text ?? '')}
          className="scroll-mt-24 flex items-center gap-3 text-[25px] font-bold tracking-tight text-navy leading-[1.2] mt-14 mb-4"
        >
          <span className="h-[26px] w-[3.5px] rounded-full bg-orange flex-shrink-0" aria-hidden />
          {block.text}
        </h2>
      )

    case 'subheading':
      return (
        <h3 key={i} className="text-[19px] font-semibold text-navy leading-[1.3] mt-8 mb-3">
          {block.text}
        </h3>
      )

    case 'paragraph':
      // The first paragraph reads as a lede — a touch larger and lighter.
      if (i === ledeIndex) {
        return (
          <p key={i} className="text-[19.5px] leading-[1.6] text-navy-700 max-w-[68ch] mt-5">
            {block.text ? withGlossary(block.text) : null}
          </p>
        )
      }
      return (
        <p key={i} className="text-[17px] leading-[1.75] text-navy-800 max-w-[68ch] mt-5">
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

    case 'table': {
      if (!block.headers || !block.rows) return null
      // Long-prose two-column tables → stacked definition rows.
      if (isProseTable(block)) {
        return (
          <div key={i} className="mt-6 rounded-2xl border border-navy-100 overflow-hidden">
            <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-6 bg-navy-50 border-b border-navy-100 px-5 py-3">
              {block.headers.map((h, j) => (
                <span key={j} className="text-[12px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{h}</span>
              ))}
            </div>
            {block.rows.map((row, j) => (
              <div
                key={j}
                className={cn(
                  'grid grid-cols-[200px_minmax(0,1fr)] gap-6 px-5 py-4',
                  j > 0 && 'border-t border-navy-100',
                )}
              >
                <span className="text-[16px] font-semibold text-navy">{row[0]}</span>
                <p className="text-[16px] leading-[1.65] text-navy-800">{row[1]}</p>
              </div>
            ))}
          </div>
        )
      }
      // Genuinely tabular data keeps a real table, at 16px.
      return (
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
      )
    }

    case 'faq':
      // A themed group of questions as native disclosure rows — scannable at a
      // glance, one open at a time by the reader, no client JS required.
      if (!block.faqs || block.faqs.length === 0) return null
      return (
        <div key={i} className="mt-5 flex flex-col gap-2.5">
          {block.faqs.map((f, j) => (
            <details
              key={j}
              className="group rounded-2xl border border-navy-100 bg-white overflow-hidden [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer list-none flex items-start gap-3 px-5 py-4 hover:bg-navy-50/40 transition-colors">
                <span className="flex-1 text-[16.5px] font-semibold text-navy leading-snug">{f.q}</span>
                <ChevronDown
                  className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0 mt-1 transition-transform duration-200 group-[[open]]:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="px-5 pb-4 -mt-0.5">
                <p className="text-[16px] leading-[1.7] text-navy-800 max-w-[68ch]">{withGlossary(f.a)}</p>
              </div>
            </details>
          ))}
        </div>
      )

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
