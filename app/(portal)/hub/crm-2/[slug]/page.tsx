import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import {
  ArrowLeft, Clock, ChevronRight, CalendarCheck, ClipboardCheck,
  AlertTriangle, Info, Lightbulb, Printer,
} from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isCrm2Preview } from '@/lib/preview'
import {
  CRM2_LESSONS, CRM2_PILLARS, CRM2_LAST_REVIEWED, getCrm2Lesson, getCrm2Glossary, type Crm2Block,
} from '@/lib/crm2-content'
import ReadingProgress from '@/components/knowledge/ReadingProgress'
import ArticleTOC from '@/components/knowledge/ArticleTOC'
import BookmarkButton from '@/components/knowledge/BookmarkButton'
import LessonActions from '@/components/crm2/LessonActions'
import AnnotatedImage from '@/components/crm2/AnnotatedImage'
import ButtonAdvisor from '@/components/crm2/ButtonAdvisor'
import ScenarioDrills from '@/components/crm2/ScenarioDrills'
import GlossaryText, { type GlossaryEntry } from '@/components/crm2/GlossaryText'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return CRM2_LESSONS.map((l) => ({ slug: l.slug }))
}

// Stable anchor id from a heading's text.
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function renderBlock(block: Crm2Block, i: number, glossary: GlossaryEntry[]) {
  const withGlossary = (text: string) =>
    glossary.length > 0 ? <GlossaryText text={text} glossary={glossary} /> : text

  switch (block.type) {

    case 'heading':
      return (
        <h2 key={i} id={slugify(block.text ?? '')} className="text-xl font-bold text-[#1D1D1F] tracking-tight pt-2 first:pt-0 scroll-mt-24">
          {block.text}
        </h2>
      )

    case 'subheading':
      return (
        <h3 key={i} className="text-base font-semibold text-[#1D1D1F] mt-4">
          {block.text}
        </h3>
      )

    case 'paragraph':
      return (
        <p key={i} className="text-sm text-[#3A3A3C] leading-relaxed">
          {block.text ? withGlossary(block.text) : null}
        </p>
      )

    case 'bullets':
      return (
        <ul key={i} className="space-y-2">
          {block.items?.map((item, j) => (
            <li key={j} className="flex gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#1D1D1F] mt-2" />
              <p className="text-sm text-[#3A3A3C] leading-relaxed">{withGlossary(item)}</p>
            </li>
          ))}
        </ul>
      )

    case 'steps':
      return (
        <ol key={i} className="space-y-3">
          {block.items?.map((item, j) => (
            <li key={j} className="flex gap-3.5">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1D1D1F] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {j + 1}
              </span>
              <p className="text-sm text-[#3A3A3C] leading-relaxed flex-1">{item}</p>
            </li>
          ))}
        </ol>
      )

    case 'callout': {
      const calloutStyles: Record<string, { bg: string; border: string; icon: React.ElementType; iconColor: string }> = {
        info:      { bg: 'bg-[#F0F7FF]', border: 'border-[#CCE4FF]', icon: Info,          iconColor: 'text-[#0071E3]' },
        tip:       { bg: 'bg-[#F0FFF4]', border: 'border-[#B0EACC]', icon: Lightbulb,     iconColor: 'text-green-600' },
        warning:   { bg: 'bg-[#FFFBF0]', border: 'border-[#FFE4B0]', icon: AlertTriangle, iconColor: 'text-amber-500' },
        important: { bg: 'bg-red-50',    border: 'border-red-200',    icon: AlertTriangle, iconColor: 'text-red-500' },
      }
      const style = calloutStyles[block.variant ?? 'info']
      const Icon = style.icon
      return (
        <div key={i} className={cn('rounded-2xl p-4 border flex gap-3', style.bg, style.border)}>
          <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', style.iconColor)} aria-hidden />
          <p className="text-sm leading-relaxed text-[#3A3A3C]">{block.text}</p>
        </div>
      )
    }

    case 'table':
      return block.headers && block.rows ? (
        <div key={i} className="overflow-x-auto rounded-xl border border-[#E8E8ED]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F7] border-b border-[#E8E8ED]">
                {block.headers.map((h, j) => (
                  <th key={j} className="px-4 py-3 text-left text-xs font-semibold text-[#6E6E73] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F7]">
              {block.rows.map((row, j) => (
                <tr key={j} className="hover:bg-[#F5F5F7]/60 transition-colors">
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-3 text-[#3A3A3C] leading-relaxed">
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
      return <hr key={i} className="border-[#E8E8ED]" />

    case 'image':
      if (!block.src) return null
      // With hotspots the screenshot becomes an interactive, guided tour.
      if (block.hotspots && block.hotspots.length > 0) {
        return <AnnotatedImage key={i} src={block.src} caption={block.text} hotspots={block.hotspots} />
      }
      return (
        <figure key={i} className="my-1">
          <div className="rounded-xl border border-[#E8E8ED] overflow-hidden bg-[#F5F5F7]">
            {/* Static screenshot from the playbook; next/image is unnecessary here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={block.src} alt={block.text ?? ''} className="w-full h-auto block" loading="lazy" />
          </div>
          {block.text && (
            <figcaption className="text-xs text-[#6E6E73] mt-2 text-center leading-relaxed">{block.text}</figcaption>
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

  // Inline glossary tooltips — but not on the glossary lesson itself, where the
  // terms are already the subject, nor the capstone/practice pages.
  const glossary: GlossaryEntry[] =
    lesson.slug === 'glossary' ? [] : getCrm2Glossary()

  // Top-level headings drive the table of contents.
  const headings = lesson.content
    .filter((b): b is Crm2Block & { text: string } => b.type === 'heading' && !!b.text)
    .map((b) => ({ id: slugify(b.text), text: b.text }))

  // Adjacent lessons, following the CRM2_LESSONS order.
  const idx = CRM2_LESSONS.findIndex((l) => l.slug === lesson.slug)
  const prev = idx > 0 ? CRM2_LESSONS[idx - 1] : null
  const next = idx < CRM2_LESSONS.length - 1 ? CRM2_LESSONS[idx + 1] : null

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-5xl">
        <div className="flex gap-10">
          {/* Main column */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-6 hub-fade">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Link href="/hub/crm-2" className="text-[#6E6E73] hover:text-[#1D1D1F] flex items-center gap-1.5 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> CRM 2.0
              </Link>
              <span className="text-[#D2D2D7]">/</span>
              <span className="text-[#1D1D1F] font-medium">{lesson.title}</span>
            </div>

            {/* Header card */}
            <div className="card p-7">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-2xl flex-shrink-0">
                  <span aria-hidden>{lesson.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">{lesson.title}</h1>
                  <p className="text-[#6E6E73] text-sm leading-relaxed max-w-xl mt-1.5">{lesson.summary}</p>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    {pillar && <span className="text-xs font-medium text-[#6E6E73]">{pillar.label}</span>}
                    <span className="flex items-center gap-1.5 text-xs text-[#AEAEB2]">
                      <Clock className="w-3.5 h-3.5" aria-hidden /> {lesson.readTime}
                    </span>
                    <span
                      className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full"
                      title="Checked against the live CRM 2.0 build"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" aria-hidden /> Reviewed {CRM2_LAST_REVIEWED}
                    </span>
                  </div>
                </div>
                <BookmarkButton articleId={`crm2-${lesson.slug}`} variant="labelled" className="flex-shrink-0 hidden sm:inline-flex" />
              </div>
            </div>

            {/* Content */}
            <div className="card p-7 space-y-6">
              {lesson.content.map((block, i) => renderBlock(block, i, glossary))}
            </div>

            {/* Printable one-pager — cheatsheet only */}
            {lesson.slug === 'cheatsheet' && (
              <Link
                href="/print/crm-2/cheatsheet"
                target="_blank"
                className="card card-hover p-5 flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center flex-shrink-0">
                  <Printer className="w-5 h-5" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1D1D1F]">Print this cheat sheet</p>
                  <p className="text-xs text-[#6E6E73] mt-0.5">Open a clean one-page version to print or save as PDF.</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#0071E3] flex-shrink-0 group-hover:gap-2 transition-all">
                  Open <ChevronRight className="w-4 h-4" aria-hidden />
                </span>
              </Link>
            )}

            {/* Mark complete + was this helpful */}
            <LessonActions slug={lesson.slug} />

            {/* Test yourself — links to the lesson's quiz */}
            {lesson.quizModuleId && (
              <Link
                href={`/quiz/${lesson.quizModuleId}`}
                className="card card-hover p-5 flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck className="w-5 h-5" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1D1D1F]">Test yourself on this lesson</p>
                  <p className="text-xs text-[#6E6E73] mt-0.5">Take a short quiz to check what you&apos;ve taken in.</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#0071E3] flex-shrink-0 group-hover:gap-2 transition-all">
                  Start quiz <ChevronRight className="w-4 h-4" aria-hidden />
                </span>
              </Link>
            )}

            {/* Lesson navigation */}
            <div className="grid grid-cols-2 gap-3">
              {prev ? (
                <Link href={`/hub/crm-2/${prev.slug}`} className="card card-hover p-4 flex items-center gap-3 group">
                  <ArrowLeft className="w-4 h-4 text-[#AEAEB2] flex-shrink-0 group-hover:text-[#0071E3] transition-colors" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#AEAEB2] uppercase tracking-wide font-medium">Previous</p>
                    <p className="text-sm font-semibold text-[#1D1D1F] truncate mt-0.5">{prev.title}</p>
                  </div>
                </Link>
              ) : <div />}

              {next ? (
                <Link href={`/hub/crm-2/${next.slug}`} className="card card-hover p-4 flex items-center justify-end gap-3 text-right group">
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#AEAEB2] uppercase tracking-wide font-medium">Next</p>
                    <p className="text-sm font-semibold text-[#1D1D1F] truncate mt-0.5">{next.title}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#AEAEB2] flex-shrink-0 group-hover:text-[#0071E3] transition-colors" />
                </Link>
              ) : <div />}
            </div>
          </div>

          {/* Table of contents */}
          <ArticleTOC headings={headings} />
        </div>
      </div>
    </>
  )
}
