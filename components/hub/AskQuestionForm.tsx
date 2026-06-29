'use client'

import { useState } from 'react'
import { Send, CheckCircle2, ShieldCheck } from 'lucide-react'
import { HUB_QUESTION_CATEGORIES, HUB_QUESTION_MAX_LENGTH } from '@/lib/hub'

export default function AskQuestionForm() {
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    const trimmed = body.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/hub/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: trimmed, category: category || undefined }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
      setBody('')
      setCategory('')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="card p-6 text-center">
        <CheckCircle2 className="w-10 h-10 text-teal mx-auto mb-3" aria-hidden />
        <h3 className="text-base font-bold text-navy">Thanks — that's been submitted</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Your submission is anonymous and goes straight to the admin team. You won't be identified.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition"
        >
          Submit another
        </button>
      </div>
    )
  }

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-start gap-2 rounded-lg bg-teal/5 border border-teal/15 px-3 py-2.5">
        <ShieldCheck className="w-4 h-4 text-teal flex-shrink-0 mt-0.5" aria-hidden />
        <p className="text-xs text-slate-500">
          This is anonymous. Your name isn't shown to anyone reviewing it — only the admin team sees
          submissions, and they see the text, not who wrote it.
        </p>
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-semibold text-navy mb-1.5">
          Area <span className="font-normal text-slate-400">(optional)</span>
        </label>
        <select
          id="category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
        >
          <option value="">— Select an area —</option>
          {HUB_QUESTION_CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-semibold text-navy mb-1.5">
          Your question or comment
        </label>
        <textarea
          id="body"
          value={body}
          onChange={e => setBody(e.target.value)}
          maxLength={HUB_QUESTION_MAX_LENGTH}
          rows={6}
          placeholder="Ask a question, raise an idea, or flag something that feels broken…"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-y"
        />
        <p className="text-[11px] text-slate-400 mt-1 text-right">
          {body.length} / {HUB_QUESTION_MAX_LENGTH}
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !body.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" aria-hidden />
          {submitting ? 'Submitting…' : 'Submit anonymously'}
        </button>
      </div>
    </div>
  )
}
