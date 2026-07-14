'use client'

import { useState } from 'react'
import { Send, CheckCircle2, GraduationCap, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TRAINING_REQUEST_TYPES,
  TRAINING_TYPE_LABELS,
  TRAINING_FOCUS_AREAS,
  TRAINING_URGENCIES,
  TRAINING_URGENCY_LABELS,
  TRAINING_REQUEST_MAX_LENGTH,
  type TrainingRequestType,
} from '@/lib/training-requests'

const TYPE_ICON = {
  further: GraduationCap,
  new_starter: UserPlus,
} as const

export default function RequestTrainingForm() {
  const [requestType, setRequestType] = useState<TrainingRequestType>('further')
  const [focusArea, setFocusArea] = useState('')
  const [subjectName, setSubjectName] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    const trimmed = details.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/hub/training-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType,
          focusArea: focusArea || undefined,
          subjectName: subjectName || undefined,
          urgency,
          details: trimmed,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }
      setSubmitted(true)
      setFocusArea('')
      setSubjectName('')
      setUrgency('normal')
      setDetails('')
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
        <h3 className="text-base font-bold text-navy">Request sent</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Your training request has gone straight to the Dwelly team. We&rsquo;ll pick it up and be in touch.
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

  const isNewStarter = requestType === 'new_starter'

  return (
    <div className="card p-6 space-y-5">
      {/* Request type */}
      <div>
        <label className="block text-sm font-semibold text-navy mb-2">What&rsquo;s this request for?</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TRAINING_REQUEST_TYPES.map(t => {
            const Icon = TYPE_ICON[t]
            const active = requestType === t
            return (
              <button
                key={t}
                type="button"
                onClick={() => setRequestType(t)}
                aria-pressed={active}
                className={cn(
                  'flex items-start gap-3 p-3.5 rounded-xl border text-left transition',
                  active ? 'bg-orange/8 border-orange text-navy' : 'bg-white border-slate-200 hover:border-orange/40',
                )}
              >
                <span className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                  active ? 'bg-orange text-white' : 'bg-slate-100 text-slate-500',
                )}>
                  <Icon className="w-4 h-4" aria-hidden />
                </span>
                <span className="text-xs font-semibold leading-snug pt-1">{TRAINING_TYPE_LABELS[t]}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Who it's for */}
      <div>
        <label htmlFor="subjectName" className="block text-sm font-semibold text-navy mb-1.5">
          {isNewStarter ? 'New starter\u2019s name' : 'Who is this for?'}
          {' '}<span className="font-normal text-slate-400">(optional)</span>
        </label>
        <input
          id="subjectName"
          type="text"
          value={subjectName}
          onChange={e => setSubjectName(e.target.value)}
          placeholder={isNewStarter ? 'e.g. Jordan Smith, starting soon' : 'Leave blank if it\u2019s for you'}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
        />
      </div>

      {/* Focus area + urgency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="focusArea" className="block text-sm font-semibold text-navy mb-1.5">
            Focus area <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <select
            id="focusArea"
            value={focusArea}
            onChange={e => setFocusArea(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
          >
            <option value="">— Select an area —</option>
            {TRAINING_FOCUS_AREAS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="urgency" className="block text-sm font-semibold text-navy mb-1.5">Urgency</label>
          <select
            id="urgency"
            value={urgency}
            onChange={e => setUrgency(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
          >
            {TRAINING_URGENCIES.map(u => (
              <option key={u} value={u}>{TRAINING_URGENCY_LABELS[u]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Details */}
      <div>
        <label htmlFor="details" className="block text-sm font-semibold text-navy mb-1.5">
          What training is needed?
        </label>
        <textarea
          id="details"
          value={details}
          onChange={e => setDetails(e.target.value)}
          maxLength={TRAINING_REQUEST_MAX_LENGTH}
          rows={6}
          placeholder={isNewStarter
            ? 'Tell us about the new starter — their role, start date, and what they\u2019ll need to get up to speed…'
            : 'Describe the training or areas of the system the person needs more support with…'}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-y"
        />
        <p className="text-[11px] text-slate-400 mt-1 text-right">
          {details.length} / {TRAINING_REQUEST_MAX_LENGTH}
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={submitting || !details.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" aria-hidden />
          {submitting ? 'Sending…' : 'Send request'}
        </button>
      </div>
    </div>
  )
}
