import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, MessageSquareReply } from 'lucide-react'
import { createServerClient, createServiceClient } from '@/lib/supabase/server'
import { isHubPreview } from '@/lib/preview'

export default async function AnsweredPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')

  // Public feed: only published items. Never select submitted_by.
  const service = createServiceClient()
  const { data: answered } = await service
    .from('hub_questions')
    .select('id, body, category, admin_response, published_at')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  const items = answered ?? []

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/hub" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-teal bg-teal/10 border-teal/20">
          <MessageSquareReply className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">You said, we did</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Questions and ideas the team raised, with what we did about them.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm text-slate-400">Nothing published yet. Answered questions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => {
            const published = item.published_at
              ? new Date(item.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              : ''
            return (
              <div key={item.id} className="card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  {item.category && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.category}
                    </span>
                  )}
                  {published && <span className="text-[11px] text-slate-400">{published}</span>}
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">You said</p>
                  <p className="text-sm text-slate-700 whitespace-pre-wrap">{item.body}</p>
                </div>

                {item.admin_response && (
                  <div className="rounded-lg bg-teal/5 border border-teal/15 px-3 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-teal mb-1">We did</p>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{item.admin_response}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
