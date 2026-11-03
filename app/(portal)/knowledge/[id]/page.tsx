import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Clock, ChevronRight,
  AlertTriangle, Info, Lightbulb, CalendarCheck, ClipboardCheck,
} from 'lucide-react'
import { KNOWLEDGE_ARTICLES, getKnowledgeArticle, type ContentBlock } from '@/lib/training-content'
import KnowledgeTabs from '@/components/roleplay/KnowledgeTabs'
import ReadingProgress from '@/components/knowledge/ReadingProgress'
import ArticleTOC from '@/components/knowledge/ArticleTOC'
import BookmarkButton from '@/components/knowledge/BookmarkButton'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return KNOWLEDGE_ARTICLES.map(a => ({ id: a.id }))
}

const DIFFICULTY_META = {
  foundation:   { label: 'Foundation',   colour: 'bg-[#F2F2F3] text-[#7D7C86] border-[#C8C8CC]' },
  intermediate: { label: 'Intermediate', colour: 'bg-amber-50 text-amber-700 border-amber-200' },
  advanced:     { label: 'Advanced',     colour: 'bg-red-50 text-red-700 border-red-200' },
}

const CATEGORY_LABEL: Record<string, string> = {
  legal: 'Legal & Compliance',
  communication: 'Communication',
  finance: 'Finance',
  standards: 'Property Standards',
  landlord: 'Landlord Relations',
}

// Stable anchor id from a heading's text, shared by the rendered heading and
// the table of contents so in-page links line up.
function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {

    case 'heading':
      return (
        <h2 key={i} id={slugify(block.text ?? '')} className="text-xl font-bold text-[#101010] tracking-tight pt-2 first:pt-0 scroll-mt-24">
          {block.text}
        </h2>
      )

    case 'subheading':
      return (
        <h3 key={i} className="text-base font-semibold text-[#101010] mt-4">
          {block.text}
        </h3>
      )

    case 'paragraph':
      return (
        <p key={i} className="text-sm text-[#404044] leading-relaxed">
          {block.text}
        </p>
      )

    case 'bullets':
      return (
        <ul key={i} className="space-y-2">
          {block.items?.map((item, j) => (
            <li key={j} className="flex gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#101010] mt-2" />
              <p className="text-sm text-[#404044] leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      )

    case 'steps':
      return (
        <ol key={i} className="space-y-3">
          {block.items?.map((item, j) => (
            <li key={j} className="flex gap-3.5">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#101010] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                {j + 1}
              </span>
              <p className="text-sm text-[#404044] leading-relaxed flex-1">{item}</p>
            </li>
          ))}
        </ol>
      )

    case 'callout': {
      const calloutStyles: Record<string, { bg: string; border: string; icon: React.ElementType; iconColor: string }> = {
        info:      { bg: 'bg-[#EEF3FE]', border: 'border-[#D5E1FB]',  icon: Info,          iconColor: 'text-[#2C68ED]' },
        tip:       { bg: 'bg-[#F0FFF4]', border: 'border-[#B0EACC]',  icon: Lightbulb,     iconColor: 'text-green-600' },
        warning:   { bg: 'bg-[#FFFBF0]', border: 'border-[#FFE4B0]',  icon: AlertTriangle, iconColor: 'text-amber-500' },
        important: { bg: 'bg-red-50',    border: 'border-red-200',     icon: AlertTriangle, iconColor: 'text-red-500' },
      }
      const style = calloutStyles[block.variant ?? 'info']
      const Icon = style.icon
      return (
        <div key={i} className={cn('rounded-2xl p-4 border flex gap-3', style.bg, style.border)}>
          <Icon className={cn('w-4 h-4 flex-shrink-0 mt-0.5', style.iconColor)} aria-hidden />
          <p className="text-sm leading-relaxed text-[#404044]">{block.text}</p>
        </div>
      )
    }

    case 'warning':
      return (
        <div key={i} className="rounded-2xl p-4 border border-red-200 bg-red-50 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm leading-relaxed text-red-800">{block.text}</p>
        </div>
      )

    case 'table':
      return block.headers && block.rows ? (
        <div key={i} className="overflow-x-auto rounded-xl border border-[#E2E2E4]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F2F2F3] border-b border-[#E2E2E4]">
                {block.headers.map((h, j) => (
                  <th key={j} className="px-4 py-3 text-left text-xs font-semibold text-[#7D7C86] uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F2F3]">
              {block.rows.map((row, j) => (
                <tr key={j} className="hover:bg-[#F2F2F3]/60 transition-colors">
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-3 text-[#404044] leading-relaxed">
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
      return <hr key={i} className="border-[#E2E2E4]" />

    default:
      return null
  }
}

export default function KnowledgeArticlePage({ params }: { params: { id: string } }) {
  const article = getKnowledgeArticle(params.id)
  if (!article) notFound()

  const diff = DIFFICULTY_META[article.difficulty]
  const isRoleplayArticle = article.id === 'kb-difficult-conversations'

  // Top-level headings drive the table of contents. Skip it for the tabbed
  // roleplay article, where the content lives inside a tab panel.
  const headings = isRoleplayArticle
    ? []
    : article.content
        .filter((b): b is ContentBlock & { text: string } => b.type === 'heading' && !!b.text)
        .map(b => ({ id: slugify(b.text), text: b.text }))

  // Adjacent articles
  const idx = KNOWLEDGE_ARTICLES.findIndex(a => a.id === article.id)
  const prev = idx > 0 ? KNOWLEDGE_ARTICLES[idx - 1] : null
  const next = idx < KNOWLEDGE_ARTICLES.length - 1 ? KNOWLEDGE_ARTICLES[idx + 1] : null

  // Curated related reading — resolve ids to articles, dropping any that don't exist.
  const related = (article.related ?? [])
    .map(getKnowledgeArticle)
    .filter((a): a is NonNullable<typeof a> => !!a)

  const articleContent = (
    <div className="card p-7 space-y-6">
      {article.content.map((block, i) => renderBlock(block, i))}
    </div>
  )

  return (
    <>
      <ReadingProgress />
      <div className="mx-auto max-w-5xl">
        <div className="flex gap-10">
          {/* Main column */}
          <div className="flex-1 min-w-0 max-w-3xl space-y-6">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <Link href="/knowledge" className="text-[#7D7C86] hover:text-[#101010] flex items-center gap-1.5 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Knowledge Base
              </Link>
              <span className="text-[#C8C8CC]">/</span>
              <span className="text-[#101010] font-medium">{article.title}</span>
            </div>

            {/* Header card */}
            <div className="card p-7">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F2F2F3] flex items-center justify-center text-2xl flex-shrink-0">
                  {article.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h1 className="text-2xl font-bold tracking-tight text-[#101010]">{article.title}</h1>
                    <span className={cn('text-[10px] font-semibold px-2 py-1 rounded-full border', diff.colour)}>
                      {diff.label}
                    </span>
                    {isRoleplayArticle && (
                      <span className="text-[10px] font-semibold text-[#2C68ED] bg-[#2C68ED]/10 border border-[#2C68ED]/20 px-2 py-1 rounded-full">
                        Includes AI Roleplay
                      </span>
                    )}
                  </div>
                  <p className="text-[#7D7C86] text-sm leading-relaxed max-w-xl">{article.subtitle}</p>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="text-xs font-medium text-[#7D7C86]">{CATEGORY_LABEL[article.category]}</span>
                    <span className="flex items-center gap-1.5 text-xs text-[#AEAEB4]">
                      <Clock className="w-3.5 h-3.5" aria-hidden /> {article.readTime}
                    </span>
                    {article.lastReviewed && (
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full"
                        title="Content checked against current legislation and guidance"
                      >
                        <CalendarCheck className="w-3.5 h-3.5" aria-hidden /> Reviewed {article.lastReviewed}
                      </span>
                    )}
                  </div>
                </div>
                <BookmarkButton articleId={article.id} variant="labelled" className="flex-shrink-0 hidden sm:inline-flex" />
              </div>
            </div>

            {/* Content — tabbed for Difficult Conversations, plain for all others */}
            {isRoleplayArticle
              ? <KnowledgeTabs articleContent={articleContent} />
              : articleContent
            }

            {/* Test yourself — links to the article's linked quiz */}
            {article.quizModuleId && (
              <Link
                href={`/quiz/${article.quizModuleId}`}
                className="card card-hover p-5 flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#2C68ED]/10 text-[#2C68ED] flex items-center justify-center flex-shrink-0">
                  <ClipboardCheck className="w-5 h-5" aria-hidden />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#101010]">Test yourself on this topic</p>
                  <p className="text-xs text-[#7D7C86] mt-0.5">Take a short quiz to check what you&apos;ve taken in.</p>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#2C68ED] flex-shrink-0 group-hover:gap-2 transition-all">
                  Start quiz <ChevronRight className="w-4 h-4" aria-hidden />
                </span>
              </Link>
            )}

            {/* Related articles */}
            {related.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-[#101010] uppercase tracking-wide mb-3">Related articles</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/knowledge/${r.id}`}
                      className="card card-hover p-4 flex items-start gap-3 group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#F2F2F3] flex items-center justify-center text-lg flex-shrink-0">
                        {r.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-[#AEAEB4] uppercase tracking-wide font-medium">{CATEGORY_LABEL[r.category]}</p>
                        <p className="text-sm font-semibold text-[#101010] mt-0.5 group-hover:text-[#2C68ED] transition-colors">{r.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Article navigation */}
            <div className="grid grid-cols-2 gap-3">
              {prev ? (
                <Link href={`/knowledge/${prev.id}`} className="card card-hover p-4 flex items-center gap-3 group">
                  <ArrowLeft className="w-4 h-4 text-[#AEAEB4] flex-shrink-0 group-hover:text-[#2C68ED] transition-colors" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#AEAEB4] uppercase tracking-wide font-medium">Previous</p>
                    <p className="text-sm font-semibold text-[#101010] truncate mt-0.5">{prev.title}</p>
                  </div>
                </Link>
              ) : <div />}

              {next ? (
                <Link href={`/knowledge/${next.id}`} className="card card-hover p-4 flex items-center justify-end gap-3 text-right group">
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#AEAEB4] uppercase tracking-wide font-medium">Next</p>
                    <p className="text-sm font-semibold text-[#101010] truncate mt-0.5">{next.title}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#AEAEB4] flex-shrink-0 group-hover:text-[#2C68ED] transition-colors" />
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
