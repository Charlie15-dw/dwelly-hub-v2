'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, X, Copy, Check } from 'lucide-react'

type Role = 'property-manager' | 'manager' | 'admin'

export default function InviteUserButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<Role>('property-manager')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  function reset() {
    setEmail('')
    setFullName('')
    setRole('property-manager')
    setError(null)
    setInviteLink(null)
    setCopied(false)
  }

  async function copyLink(link: string) {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function close() {
    if (loading) return
    setOpen(false)
    reset()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      const res = await fetch('/api/admin/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), fullName: fullName.trim(), role }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Failed to create invite')
      } else {
        setInviteLink(data.inviteLink)
        router.refresh()
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition"
      >
        <UserPlus className="w-4 h-4" />
        Invite User
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={close}>
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-navy" />
                <h3 className="text-sm font-bold text-navy">Invite a new user</h3>
              </div>
              <button
                onClick={close}
                disabled={loading}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
                  <p className="text-xs text-red-700">{error}</p>
                </div>
              )}
              {inviteLink && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2.5 space-y-2">
                  <p className="text-xs font-semibold text-green-800">Invite created — share this link via Slack:</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-green-700 font-mono break-all flex-1">{inviteLink}</p>
                    <button
                      type="button"
                      onClick={() => copyLink(inviteLink)}
                      className="flex-shrink-0 p-1.5 rounded-md bg-green-100 hover:bg-green-200 text-green-700 transition"
                      aria-label="Copy link"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="invite-email" className="block text-xs font-semibold text-navy mb-1.5">
                  Email address
                </label>
                <input
                  id="invite-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
                />
              </div>

              <div>
                <label htmlFor="invite-name" className="block text-xs font-semibold text-navy mb-1.5">
                  Full name <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  id="invite-name"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
                />
              </div>

              <div>
                <label htmlFor="invite-role" className="block text-xs font-semibold text-navy mb-1.5">
                  Role
                </label>
                <select
                  id="invite-role"
                  value={role}
                  onChange={e => setRole(e.target.value as Role)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
                >
                  <option value="property-manager">Property Manager</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={close}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-100 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition disabled:opacity-50"
                >
                  {loading ? 'Creating…' : inviteLink ? 'Create another' : 'Create invite link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
