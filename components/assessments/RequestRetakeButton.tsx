'use client'

import { useState } from 'react'
import { Check, AlertTriangle, Loader2 } from 'lucide-react'

type Status = 'idle' | 'loading' | 'sent' | 'no_manager' | 'error'

export default function RequestRetakeButton({ assessmentId }: { assessmentId: string }) {
  const [status, setStatus] = useState<Status>('idle')

  async function request() {
    if (status === 'loading' || status === 'sent') return
    setStatus('loading')
    try {
      const res = await fetch('/api/assessments/request-retake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) { setStatus('error'); return }
      if (data?.reason === 'no_manager') { setStatus('no_manager'); return }
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#1A7F37] flex-shrink-0">
        <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden />
        Request sent to your manager
      </span>
    )
  }

  if (status === 'no_manager') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#995500] flex-shrink-0">
        <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
        No manager assigned yet — ask an admin
      </span>
    )
  }

  return (
    <button
      type="button"
      onClick={request}
      disabled={status === 'loading'}
      className="btn-outline text-[13px] flex-shrink-0 disabled:opacity-60"
    >
      {status === 'loading' && <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />}
      {status === 'error' ? 'Try again' : 'Request retake'}
    </button>
  )
}
