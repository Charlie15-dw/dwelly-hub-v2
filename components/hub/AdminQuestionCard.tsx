'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HUB_QUESTION_STATUSES, HUB_STATUS_LABELS, type HubQuestionStatus } from '@/lib/hub'

interface HubQuestion {
  id: string
  body: string
  category: string | null
  status: string
  admin_response: string | null
  created_at: string
  published_at: string | null
}

const STATUS_STYLES: Record<HubQuestionStatus, string> = {
  new: 'text-amber-700 bg-amber-100 border-amber-200',
  reviewing: 'text-indigo-700 bg-indigo-100 border-indigo-200',
  answered: 'text-emerald-700 bg-emerald-100 border-emerald-200',
}

export default function AdminQuestionCard({ question }: { question: HubQuestion }) {
  const router = useRouter()
  const [status, setStatus] = useState(question.status)
  const [response, setResponse] = useState(question.admin_response ?? '')
  const [published, setPublished] = useState(!!question.published_at)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function patch(update: { status?: string; adminResponse?: string; published?: boolean }) {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/hub/questions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: question.id, ...update }),
      })
      if (res.ok) {
        setSaved(true)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  function handleStatusChange(next: string) {
    setStatus(next)
    patch({ status: next })
  }

  function handleTogglePublish() {
    const next = !published
    setPublished(next)
    // Publish the latest response text so the public feed is never stale.
    patch(next ? { published: true, adminResponse: response } : { published: false })
  }

  const created = new Date(question.created_at).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          {question.category && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {question.category}
            </span>
          )}
          <span className="text-[11px] text-slate-400">{created}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {published && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border text-teal bg-teal/10 border-teal/20">
              <Globe className="w-3 h-3" aria-hidden />
              Published
            </span>
          )}
          <span className={cn(
            'text-[11px] font-semibold px-2 py-0.5 rounded-full border',
            STATUS_STYLES[status as HubQuestionStatus] ?? 'text-slate-600 bg-slate-100 border-slate-200',
          )}>
            {HUB_STATUS_LABELS[status as HubQuestionStatus] ?? status}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-700 whitespace-pre-wrap">{question.body}</p>

      <div className="flex items-center gap-2 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Status</span>
        <div className="flex gap-1">
          {HUB_QUESTION_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={saving}
              className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-lg border transition disabled:opacity-50',
                status === s
                  ? STATUS_STYLES[s]
                  : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50',
              )}
            >
              {HUB_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          Response
        </label>
        <textarea
          value={response}
          onChange={e => { setResponse(e.target.value); setSaved(false) }}
          rows={2}
          placeholder="Write a response (for the round-up / records)…"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-y"
        />
        <div className="flex items-center justify-between gap-2 mt-2">
          <button
            onClick={handleTogglePublish}
            disabled={saving}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition disabled:opacity-50',
              published
                ? 'text-teal bg-teal/10 border-teal/20 hover:bg-teal/15'
                : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50',
            )}
            title={published ? 'Visible on the Hub answered feed' : 'Publish this answer to the Hub'}
          >
            <Globe className="w-3.5 h-3.5" aria-hidden />
            {published ? 'Published to Hub' : 'Publish to Hub'}
          </button>
          <button
            onClick={() => patch({ adminResponse: response })}
            disabled={saving}
            className="px-3 py-1.5 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy/90 transition disabled:opacity-50"
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save response'}
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-1.5">
          Publishing shows the original question and your response on the Hub answered feed, visible to everyone. The submitter stays anonymous.
        </p>
      </div>
    </div>
  )
}
