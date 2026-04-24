'use client'

import { useState, useTransition } from 'react'
import { UserPlus, UserMinus, Loader2, CheckCircle2 } from 'lucide-react'

interface UserProfile {
  id: string
  displayName: string
  email: string | null
  manager_id: string | null
}

export default function TeamAssignmentPanel({
  unassigned,
  myTeam,
  managerId,
}: {
  unassigned: UserProfile[]
  myTeam: UserProfile[]
  managerId: string
}) {
  const [pending, startTransition] = useTransition()
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [localUnassigned, setLocalUnassigned] = useState(unassigned)
  const [localTeam, setLocalTeam] = useState(myTeam)
  const [message, setMessage] = useState<string | null>(null)

  async function assign(user: UserProfile) {
    setLoadingId(user.id)
    setMessage(null)
    startTransition(async () => {
      const res = await fetch('/api/manager/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action: 'assign' }),
      })
      if (res.ok) {
        setLocalUnassigned(prev => prev.filter(u => u.id !== user.id))
        setLocalTeam(prev => [...prev, { ...user, manager_id: managerId }])
        setMessage(`${user.displayName} added to your team.`)
      }
      setLoadingId(null)
    })
  }

  async function unassign(user: UserProfile) {
    setLoadingId(user.id)
    setMessage(null)
    startTransition(async () => {
      const res = await fetch('/api/manager/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, action: 'unassign' }),
      })
      if (res.ok) {
        setLocalTeam(prev => prev.filter(u => u.id !== user.id))
        setLocalUnassigned(prev => [...prev, { ...user, manager_id: null }])
        setMessage(`${user.displayName} removed from your team.`)
      }
      setLoadingId(null)
    })
  }

  if (localUnassigned.length === 0 && localTeam.length === 0) return null

  return (
    <div className="card p-5 space-y-5">
      <div className="flex items-center gap-2">
        <UserPlus className="w-4 h-4 text-[#0071E3]" aria-hidden />
        <h2 className="text-sm font-bold text-navy">Team Assignment</h2>
      </div>

      {message && (
        <div className="flex items-center gap-2 text-sm text-teal bg-teal/8 border border-teal/20 rounded-lg px-3 py-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Unassigned users */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Unassigned ({localUnassigned.length})
          </p>
          {localUnassigned.length === 0 ? (
            <p className="text-xs text-slate-400">No unassigned users.</p>
          ) : (
            <div className="space-y-2">
              {localUnassigned.map(u => (
                <div key={u.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{u.displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{u.email ?? '—'}</p>
                  </div>
                  <button
                    onClick={() => assign(u)}
                    disabled={loadingId === u.id || pending}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0071E3] hover:bg-[#0071E3]/90 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    {loadingId === u.id
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <UserPlus className="w-3 h-3" />
                    }
                    Add to my team
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My team */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Your Team ({localTeam.length})
          </p>
          {localTeam.length === 0 ? (
            <p className="text-xs text-slate-400">No one assigned yet — add from the left.</p>
          ) : (
            <div className="space-y-2">
              {localTeam.map(u => (
                <div key={u.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-teal/20 bg-teal/3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">{u.displayName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{u.email ?? '—'}</p>
                  </div>
                  <button
                    onClick={() => unassign(u)}
                    disabled={loadingId === u.id || pending}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 flex-shrink-0"
                  >
                    {loadingId === u.id
                      ? <Loader2 className="w-3 h-3 animate-spin" />
                      : <UserMinus className="w-3 h-3" />
                    }
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
