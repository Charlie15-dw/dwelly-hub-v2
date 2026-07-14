'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, UserPlus, User, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TRAINING_REQUEST_STATUSES,
  TRAINING_STATUS_LABELS,
  TRAINING_TYPE_LABELS,
  TRAINING_URGENCY_LABELS,
  type TrainingRequestStatus,
  type TrainingRequestType,
  type TrainingUrgency,
} from '@/lib/training-requests'

export interface TrainingRequest {
  id: string
  request_type: string
  focus_area: string | null
  subject_name: string | null
  details: string
  urgency: string
  status: string
  admin_notes: string | null
  created_at: string
  requester_name: string | null
  requester_email: string | null
}

const STATUS_STYLES: Record<TrainingRequestStatus, string> = {
  new: 'text-amber-700 bg-amber-100 border-amber-200',
  reviewing: 'text-indigo-700 bg-indigo-100 border-indigo-200',
  scheduled: 'text-sky-700 bg-sky-100 border-sky-200',
  completed: 'text-emerald-700 bg-emerald-100 border-emerald-200',
}

const TYPE_ICON = {
  further: GraduationCap,
  new_starter: UserPlus,
} as const

export default function AdminTrainingRequestCard({ request }: { request: TrainingRequest }) {
  const router = useRouter()
  const [status, setStatus] = useState(request.status)
  const [notes, setNotes] = useState(request.admin_notes ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function patch(update: { status?: string; adminNotes?: string }) {
    setSaving(true)
    setSaved(false)
    try {
      const res = await fetch('/api/hub/training-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: request.id, ...update }),
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

  const created = new Date(request.created_at).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  const TypeIcon = TYPE_ICON[request.request_type as TrainingRequestType] ?? GraduationCap
  const isHighUrgency = request.urgency === 'high'

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            <TypeIcon className="w-3 h-3" aria-hidden />
            {TRAINING_TYPE_LABELS[request.request_type as TrainingRequestType] ?? request.request_type}
          </span>
          {request.focus_area && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {request.focus_area}
            </span>
          )}
          {isHighUrgency && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              <AlertTriangle className="w-3 h-3" aria-hidden />
              {TRAINING_URGENCY_LABELS[request.urgency as TrainingUrgency]}
            </span>
          )}
          <span className="text-[11px] text-slate-400">{created}</span>
        </div>
        <span className={cn(
          'text-[11px] font-semibold px-2 py-0.5 rounded-full border',
          STATUS_STYLES[status as TrainingRequestStatus] ?? 'text-slate-600 bg-slate-100 border-slate-200',
        )}>
          {TRAINING_STATUS_LABELS[status as TrainingRequestStatus] ?? status}
        </span>
      </div>

      {/* Who requested + who it's for */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-slate-400" aria-hidden />
          Requested by <span className="font-semibold text-navy">{request.requester_name ?? request.requester_email ?? 'Unknown'}</span>
          {request.requester_email && request.requester_name && (
            <span className="text-slate-400">({request.requester_email})</span>
          )}
        </span>
        <span>
          For: <span className="font-semibold text-navy">{request.subject_name ?? 'Themselves'}</span>
        </span>
      </div>

      <p className="text-sm text-slate-700 whitespace-pre-wrap">{request.details}</p>

      <div className="flex items-center gap-2 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Status</span>
        <div className="flex gap-1 flex-wrap">
          {TRAINING_REQUEST_STATUSES.map(s => (
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
              {TRAINING_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={e => { setNotes(e.target.value); setSaved(false) }}
          rows={2}
          placeholder="Private notes on how this is being actioned…"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange resize-y"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={() => patch({ adminNotes: notes })}
            disabled={saving}
            className="px-3 py-1.5 bg-navy text-white text-xs font-semibold rounded-lg hover:bg-navy/90 transition disabled:opacity-50"
          >
            {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save notes'}
          </button>
        </div>
      </div>
    </div>
  )
}
