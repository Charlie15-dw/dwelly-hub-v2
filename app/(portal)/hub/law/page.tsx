import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Landmark, CircleCheck, Clock, Lightbulb, BookOpen } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview, isHubBeta } from '@/lib/preview'
import { lawFeedSorted, LAW_STATUS_LABELS, type LawStatus } from '@/lib/law-feed'
import { getKnowledgeArticle } from '@/lib/training-content'

const STATUS_STYLES: Record<LawStatus, string> = {
  'in-force': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'upcoming': 'bg-amber-100 text-amber-700 border-amber-200',
  'proposed': 'bg-slate-100 text-slate-600 border-slate-200',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function LawFeedPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')
  if (!isHubBeta(user.email)) redirect('/hub')

  const items = lawFeedSorted()

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/hub" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-indigo-700 bg-indigo-100 border-indigo-200">
          <Landmark className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Law &amp; legislation feed</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            The UK lettings law changes that matter — in plain English, with what each one means for your day-to-day.
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 border border-slate-200 rounded-xl px-4 py-3 bg-slate-50">
        These are training summaries to help you stay current — not legal advice. Always check the official
        guidance and raise anything unclear with your manager.
      </p>

      <div className="space-y-4">
        {items.map(item => (
          <article key={item.id} className="card p-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border ${STATUS_STYLES[item.status]}`}>
                  {LAW_STATUS_LABELS[item.status]}
                </span>
                <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                  {item.category}
                </span>
                <span className="text-xs text-slate-400">{formatDate(item.date)}</span>
              </div>
              <h2 className="text-base font-bold text-navy">{item.title}</h2>
              <p className="text-sm text-slate-600">{item.summary}</p>
              {item.effectiveFrom && (
                <p className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Clock className="w-3.5 h-3.5" aria-hidden /> Effective: {item.effectiveFrom}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-400 mb-2">
                  <CircleCheck className="w-3.5 h-3.5" aria-hidden /> What changed
                </p>
                <ul className="space-y-1.5">
                  {item.whatChanged.map((point, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-slate-300 mt-1.5 w-1 h-1 rounded-full bg-slate-300 flex-shrink-0" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl bg-orange/[0.04] border border-orange/15 p-3">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-orange mb-2">
                  <Lightbulb className="w-3.5 h-3.5" aria-hidden /> What this means for you
                </p>
                <ul className="space-y-1.5">
                  {item.whatThisMeans.map((point, i) => (
                    <li key={i} className="text-sm text-slate-700 flex gap-2">
                      <span className="text-orange mt-1.5 w-1 h-1 rounded-full bg-orange flex-shrink-0" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {item.related && item.related.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 inline-flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" aria-hidden /> Learn more:
                </span>
                {item.related.map(id => {
                  const article = getKnowledgeArticle(id)
                  if (!article) return null
                  return (
                    <Link
                      key={id}
                      href={`/knowledge/${id}`}
                      className="text-xs font-semibold text-orange hover:underline"
                    >
                      {article.title}
                    </Link>
                  )
                })}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
