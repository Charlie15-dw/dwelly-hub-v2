'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'

type Role = 'property-manager' | 'manager' | 'admin'

const ROLE_LABELS: Record<Role, string> = {
  'property-manager': 'Property Manager',
  'manager': 'Manager',
  'admin': 'Admin',
}

export default function ChangeRolePanel({
  userId,
  currentRole,
}: {
  userId: string
  currentRole: Role
}) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changed = selectedRole !== currentRole

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/admin/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: selectedRole }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Failed to update role')
        return
      }
      setSaved(true)
      router.refresh()
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <ShieldCheck className="w-4 h-4 text-navy" />
        <h3 className="text-sm font-bold text-navy">Change Role</h3>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 mb-3">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <select
          value={selectedRole}
          onChange={e => { setSelectedRole(e.target.value as Role); setSaved(false) }}
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
        >
          <option value="property-manager">Property Manager</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button
          onClick={handleSave}
          disabled={saving || !changed}
          className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>

      <p className="text-[11px] text-slate-400 mt-2">
        {selectedRole === 'property-manager'
          ? 'Property Managers go through staged onboarding and can be assigned to a manager.'
          : `${ROLE_LABELS[selectedRole]}s skip onboarding and land straight on the full Hub.`}
      </p>
    </div>
  )
}
