import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Clock, ChevronRight,
  AlertTriangle, Info, Lightbulb,
} from 'lucide-react'
import { KNOWLEDGE_ARTICLES, getKnowledgeArticle, type ContentBlock } from '@/lib/training-content'
import KnowledgeTabs from '@/components/roleplay/KnowledgeTabs'
import ReadingProgress from '@/components/knowledge/ReadingProgress'
import ArticleTOC from '@/components/knowledge/ArticleTOC'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return KNOWLEDGE_ARTICLES.map(a => ({ id: a.id }))
}

const DIFFICULTY_META = {
  foundation:   { label: 'Foundation',   colour: 'bg-[#F5F5F7] text-[#6E6E73] border-[#D2D2D7]' },
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
          {block.text}
        </p>
      )

    case 'bullets':
      return (
        <ul key={i} className="space-y-2">
          {block.items?.map((item, j) => (
            <li key={j} className="flex gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#1D1D1F] mt-2" />
              <p className="text-sm text-[#3A3A3C] leading-relaxed">{item}</p>
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
        info:      { bg: 'bg-[#F0F7FF]', border: 'border-[#CCE4FF]',  icon: Info,          iconColor: 'text-[#0071E3]' },
        tip:       { bg: 'bg-[#F0FFF4]', border: 'border-[#B0EACC]',  icon: Lightbulb,     iconColor: 'text-green-600' },
        warning:   { bg: 'bg-[#FFFBF0]', border: 'border-[#FFE4B0]',  icon: AlertTriangle, iconColor: 'text-amber-500' },
        important: { bg: 'bg-red-50',    border: 'border-red-200',     icon: AlertTriangle, iconColor: 'text-red-500' },
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

    case 'warning':
      return (
        <div key={i} className="rounded-2xl p-4 border border-red-200 bg-red-50 flex gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm leading-relaxed text-red-800">{block.text}</p>
        </div>
      )

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
              <Link href="/knowledge" className="text-[#6E6E73] hover:text-[#1D1D1F] flex items-center gap-1.5 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Knowledge Base
              </Link>
              <span className="text-[#D2D2D7]">/</span>
              <span className="text-[#1D1D1F] font-medium">{article.title}</span>
            </div>

            {/* Header card */}
            <div className="card p-7">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center text-2xl flex-shrink-0">
                  {article.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">{article.title}</h1>
                    <span className={cn('text-[10px] font-semibold px-2 py-1 rounded-full border', diff.colour)}>
                      {diff.label}
                    </span>
                    {isRoleplayArticle && (
                      <span className="text-[10px] font-semibold text-[#0071E3] bg-[#0071E3]/10 border border-[#0071E3]/20 px-2 py-1 rounded-full">
                        Includes AI Roleplay
                      </span>
                    )}
                  </div>
                  <p className="text-[#6E6E73] text-sm leading-relaxed max-w-xl">{article.subtitle}</p>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="text-xs font-medium text-[#6E6E73]">{CATEGORY_LABEL[article.category]}</span>
                    <span className="flex items-center gap-1.5 text-xs text-[#AEAEB2]">
                      <Clock className="w-3.5 h-3.5" aria-hidden /> {article.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content — tabbed for Difficult Conversations, plain for all others */}
            {isRoleplayArticle
              ? <KnowledgeTabs articleContent={articleContent} />
              : articleContent
            }

            {/* Article navigation */}
            <div className="grid grid-cols-2 gap-3">
              {prev ? (
                <Link href={`/knowledge/${prev.id}`} className="card card-hover p-4 flex items-center gap-3 group">
                  <ArrowLeft className="w-4 h-4 text-[#AEAEB2] flex-shrink-0 group-hover:text-[#0071E3] transition-colors" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-[#AEAEB2] uppercase tracking-wide font-medium">Previous</p>
                    <p className="text-sm font-semibold text-[#1D1D1F] truncate mt-0.5">{prev.title}</p>
                  </div>
                </Link>
              ) : <div />}

              {next ? (
                <Link href={`/knowledge/${next.id}`} className="card card-hover p-4 flex items-center justify-end gap-3 text-right group">
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
