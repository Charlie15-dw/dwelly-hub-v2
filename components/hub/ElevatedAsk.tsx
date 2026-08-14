'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, ShieldCheck, ArrowRight, Check } from 'lucide-react'
import { HUB_QUESTION_CATEGORIES, HUB_QUESTION_MAX_LENGTH } from '@/lib/hub'

// Elevated Anonymous Q&A — "composer-first" (handoff). The box you type in is
// the first thing on the page, with the anonymity promise sitting right where
// you write so it reassures at the moment of hesitation. "Yours" below shows
// real lifecycle status for the submissions this user made — the rows are
// fetched server-side and passed in; submitted_by never reaches the client.

export interface YourQuestion {
  id: string
  body: string
  category: string | null
  stage: 'received' | 'reviewing' | 'answered' | 'published'
  admin_response: string | null
  created_at: string | null
}

const STAGE_META: Record<YourQuestion['stage'], { label: string; cls: string }> = {
  received:  { label: 'Received',  cls: 'status-received' },
  reviewing: { label: 'Reviewing', cls: 'status-review' },
  answered:  { label: 'Answered',  cls: 'status-done' },
  published: { label: 'Published', cls: 'status-done' },
}

function fmt(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
}

export default function ElevatedAsk({ yours }: { yours: YourQuestion[] }) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [justSent, setJustSent] = useState(false)

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
      setBody('')
      setCategory('')
      setJustSent(true)
      router.refresh() // reload "Yours" from the server
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[880px] space-y-6">
      <Link href="/hub" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      <div className="hub-fade space-y-1.5">
        <h1 className="text-[26px] font-semibold text-navy tracking-tight">Anonymous Q&amp;A</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">
          Raise a question, an idea, or something that feels broken. No name attached.
        </p>
      </div>

      {/* Composer-first */}
      <div className="hub-fade-1 card p-6 space-y-4">
        <div className="relative">
          <textarea
            value={body}
            onChange={e => { setBody(e.target.value); setJustSent(false) }}
            maxLength={HUB_QUESTION_MAX_LENGTH}
            rows={5}
            placeholder="Ask a question, raise an idea, or flag something that feels broken…"
            className="w-full text-[15px] rounded-2xl border border-[#D2D2D7] px-4 py-3.5 text-navy focus:outline-none focus:ring-2 focus:ring-[#0071E3]/15 focus:border-[#0071E3] resize-y"
          />
        </div>

        {/* Anonymity promise sits right where you type */}
        <div className="flex items-start gap-2.5 rounded-xl bg-[#0071E3]/6 border border-[#0071E3]/15 px-3.5 py-3">
          <ShieldCheck className="w-4 h-4 text-[#0071E3] flex-shrink-0 mt-0.5" aria-hidden />
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            Anonymous. Reviewers see the text, never who wrote it. Your name is never attached to what you send.
          </p>
        </div>

        {/* Real categories as chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-[var(--text-tertiary)] mr-1">Area</span>
          {HUB_QUESTION_CATEGORIES.map(c => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(category === c ? '' : c)}
              className={
                'text-[13px] font-medium px-3 py-1.5 rounded-full border transition-colors ' +
                (category === c
                  ? 'bg-navy text-white border-navy'
                  : 'bg-white text-[var(--text-secondary)] border-[#D2D2D7] hover:border-[#0071E3] hover:text-navy')
              }
            >
              {c}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-[#B42318]">{error}</p>}

        <div className="flex items-center justify-between gap-4">
          <span className="text-[12px] text-[var(--text-tertiary)] tabular-nums">
            {body.length} / {HUB_QUESTION_MAX_LENGTH}
          </span>
          <div className="flex items-center gap-3">
            {justSent && (
              <span className="inline-flex items-center gap-1.5 text-[13px] text-[#1A7F37]">
                <Check className="w-4 h-4" aria-hidden /> Sent anonymously
              </span>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !body.trim()}
              className="btn-primary disabled:opacity-50"
            >
              <Send className="w-4 h-4" aria-hidden />
              {submitting ? 'Sending…' : 'Submit anonymously'}
            </button>
          </div>
        </div>
      </div>

      {/* Yours — real lifecycle status */}
      {yours.length > 0 && (
        <section className="hub-fade-2 space-y-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">Yours</h2>
          <div className="card overflow-hidden">
            {yours.map(q => {
              const meta = STAGE_META[q.stage]
              return (
                <div key={q.id} className="px-6 py-[18px] border-t border-slate-100 first:border-t-0 space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] text-navy whitespace-pre-wrap">{q.body}</p>
                      <p className="text-[12.5px] text-[var(--text-tertiary)] mt-1">{q.category ?? 'General'} · {fmt(q.created_at)}</p>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${meta.cls}`}>
                      {meta.label}
                    </span>
                  </div>
                  {q.admin_response && (
                    <div className="rag-green rounded-xl px-4 py-3 border">
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-1">Reply</p>
                      <p className="text-sm whitespace-pre-wrap">{q.admin_response}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}

      <Link href="/hub/answered" className="hub-fade-3 card card-hover p-5 flex items-center gap-4 group">
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-navy">You said, we did</p>
          <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">See what the team raised — and what we actually did about it.</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071E3] transition-colors flex-shrink-0" aria-hidden />
      </Link>
    </div>
  )
}
