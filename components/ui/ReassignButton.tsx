'use client'

import { useState } from 'react'
import { RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  userId: string
  moduleId: string
  moduleName: string
  pending?: boolean
}

export default function ReassignButton({ userId, moduleId, moduleName, pending = false }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [justReassigned, setJustReassigned] = useState(false)

  async function handleReassign() {
    if (status === 'loading' || status === 'done') return
    setStatus('loading')
    try {
      const res = await fetch('/api/manager/reassign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, moduleId }),
      })
      if (!res.ok) throw new Error()
      setJustReassigned(true)
      setStatus('done')
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  if (pending && !justReassigned) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
        <RefreshCw className="w-3.5 h-3.5" aria-hidden />
        Reset Pending
      </span>
    )
  }

  if (status === 'done') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
        Reassigned
      </span>
    )
  }

  if (status === 'error') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
        <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
        Failed — try again
      </span>
    )
  }

  return (
    <button
      onClick={handleReassign}
      disabled={status === 'loading'}
      title={`Reassign ${moduleName}`}
      className={cn(
        'inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors',
        'border-[#0071E3]/30 text-[#0071E3] hover:bg-[#0071E3]/8',
        status === 'loading' && 'opacity-50 cursor-not-allowed',
      )}
    >
      <RefreshCw className={cn('w-3 h-3', status === 'loading' && 'animate-spin')} aria-hidden />
      {status === 'loading' ? 'Reassigning…' : 'Reassign'}
    </button>
  )
}
