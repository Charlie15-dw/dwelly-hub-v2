'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  userId: string
  userName: string
  userEmail: string | null
}

// A guarded, irreversible delete. Because it permanently removes the user and
// cascades away all their records, the admin must type the account's email to
// confirm before the button arms.
export default function DeleteUserButton({ userId, userName, userEmail }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')

  const confirmTarget = userEmail ?? userName
  const canDelete = confirmText.trim().toLowerCase() === confirmTarget.trim().toLowerCase()

  async function handleDelete() {
    if (!canDelete || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      if (!res.ok) throw new Error()
      router.push('/admin')
      router.refresh()
    } catch {
      setStatus('error')
    }
  }

  function close() {
    if (status === 'loading') return
    setOpen(false)
    setConfirmText('')
    setStatus('idle')
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" aria-hidden />
        Delete user
      </button>

      {open && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 sm:pt-28 bg-navy/40 backdrop-blur-sm overflow-y-auto" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
            <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-red-600" aria-hidden />
                </div>
                <h2 className="text-sm font-bold text-navy">Delete {userName}?</h2>
              </div>
              <button onClick={close} aria-label="Close" className="p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                This permanently deletes the account and <strong>all of their records</strong> —
                assessment results, progress, learning profile and more. This cannot be undone.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Type <span className="font-mono text-navy">{confirmTarget}</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300"
                  placeholder={confirmTarget}
                />
              </div>
              {status === 'error' && (
                <p className="text-xs font-medium text-red-500 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" aria-hidden />
                  Couldn&apos;t delete this user. Please try again.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 bg-slate-50/60">
              <button onClick={close} disabled={status === 'loading'} className="btn-secondary text-sm">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!canDelete || status === 'loading'}
                className={cn(
                  'inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white transition-colors',
                  canDelete && status !== 'loading' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed',
                )}
              >
                <Trash2 className="w-4 h-4" aria-hidden />
                {status === 'loading' ? 'Deleting…' : 'Delete permanently'}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
