import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Clock, ExternalLink, ChevronRight,
  ChevronLeft, BookOpen, AlertTriangle, Info, Lightbulb,
} from 'lucide-react'
import { getTrainingPage, getAdjacentPages, TRAINING_PAGES } from '@/lib/training-content'
import ContentCompletionButton from '@/components/hub/ContentCompletionButton'
import { cn } from '@/lib/utils'

export function generateStaticParams() {
  return TRAINING_PAGES.map(p => ({ id: p.id }))
}

export default function TrainingSectionPage({ params }: { params: { id: string } }) {
  const page = getTrainingPage(params.id)
  if (!page) notFound()

  const { prev, next } = getAdjacentPages(params.id)
  const isCompliance = ['compliance'].includes(page.id)
  const hasContent = page.content.length > 0

  return (
    <div className="max-w-3xl space-y-6">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link href="/training" className="text-[#6E6E73] hover:text-[#1D1D1F] flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Training Guide
        </Link>
        <span className="text-[#D2D2D7]">/</span>
        <span className="text-[#1D1D1F] font-medium">{page.title}</span>
      </div>

      {/* Page header */}
      <div className="card p-7">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-4">
            <div className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0',
              isCompliance ? 'bg-red-100' : 'bg-[#F5F5F7]',
            )}>
              {page.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight text-[#1D1D1F]">
                  {page.title}
                </h1>
                {isCompliance && (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                    Compliance Required
                  </span>
                )}
              </div>
              <p className="text-[#6E6E73] text-sm leading-relaxed max-w-xl">{page.subtitle}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="flex items-center gap-1.5 text-xs text-[#AEAEB2]">
                  <Clock className="w-3.5 h-3.5" aria-hidden /> {page.readTime}
                </span>
                {page.notionUrl && (
                  <a
                    href={page.notionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-[#0071E3] hover:underline font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                    Open in Notion
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content area */}
      {hasContent ? (
        <div className="card p-7 space-y-6">
          {page.content.map((block, i) => {
            switch (block.type) {

              case 'heading':
                return (
                  <h2 key={i} className="text-xl font-bold text-[#1D1D1F] tracking-tight pt-2">
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

              case 'callout': {
                const calloutStyles: Record<string, { bg: string; border: string; icon: React.ElementType; iconColor: string }> = {
                  info:      { bg: 'bg-[#F0F7FF]', border: 'border-[#CCE4FF]',   icon: Info,         iconColor: 'text-[#0071E3]' },
                  tip:       { bg: 'bg-[#F0FFF4]', border: 'border-[#B0EACC]',   icon: Lightbulb,    iconColor: 'text-green-600' },
                  warning:   { bg: 'bg-[#FFFBF0]', border: 'border-[#FFE4B0]',   icon: AlertTriangle, iconColor: 'text-amber-500' },
                  important: { bg: 'bg-red-50',    border: 'border-red-200',      icon: AlertTriangle, iconColor: 'text-red-500' },
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
          })}
        </div>
      ) : (
        /* Placeholder — shown until Notion content is loaded */
        <div className="card p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6 text-[#AEAEB2]" aria-hidden />
          </div>
          <h2 className="text-base font-semibold text-[#1D1D1F] mb-2">Content loading soon</h2>
          <p className="text-sm text-[#6E6E73] leading-relaxed max-w-sm mx-auto mb-6">
            The full written guide for this section is being imported from Notion.
            In the meantime, you can read it directly on the Notion page.
          </p>
          {page.notionUrl && (
            <a
              href={page.notionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              Read on Notion
              <ExternalLink className="w-4 h-4" aria-hidden />
            </a>
          )}
        </div>
      )}

      {/* Mark as read */}
      <ContentCompletionButton contentType="training" contentId={page.id} />

      {/* Section navigation */}
      <div className="grid grid-cols-2 gap-3">
        {prev ? (
          <Link
            href={`/training/${prev.id}`}
            className="card card-hover p-4 flex items-center gap-3 group"
          >
            <ChevronLeft className="w-4 h-4 text-[#AEAEB2] flex-shrink-0 group-hover:text-[#0071E3] transition-colors" />
            <div className="min-w-0">
              <p className="text-[10px] text-[#AEAEB2] uppercase tracking-wide font-medium">Previous</p>
              <p className="text-sm font-semibold text-[#1D1D1F] truncate mt-0.5">{prev.title}</p>
            </div>
          </Link>
        ) : <div />}

        {next ? (
          <Link
            href={`/training/${next.id}`}
            className="card card-hover p-4 flex items-center justify-end gap-3 text-right group"
          >
            <div className="min-w-0">
              <p className="text-[10px] text-[#AEAEB2] uppercase tracking-wide font-medium">Next</p>
              <p className="text-sm font-semibold text-[#1D1D1F] truncate mt-0.5">{next.title}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#AEAEB2] flex-shrink-0 group-hover:text-[#0071E3] transition-colors" />
          </Link>
        ) : <div />}
      </div>

    </div>
  )
}
