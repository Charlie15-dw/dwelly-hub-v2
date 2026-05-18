'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'

interface Manager {
  id: string
  full_name: string | null
  email: string | null
}

export default function AssignManagerPanel({
  userId,
  currentManagerId,
  managers,
}: {
  userId: string
  currentManagerId: string | null
  managers: Manager[]
}) {
  const router = useRouter()
  const [selectedManagerId, setSelectedManagerId] = useState(currentManagerId ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function displayName(m: Manager) {
    return m.full_name
      || m.email?.split('@')[0]?.replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      || m.email
      || 'Unknown'
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/manager/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          managerId: selectedManagerId || null,
        }),
      })
      setSaved(true)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-4 h-4 text-navy" />
        <h3 className="text-sm font-bold text-navy">Assign to Manager</h3>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={selectedManagerId}
          onChange={e => { setSelectedManagerId(e.target.value); setSaved(false) }}
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
        >
          <option value="">— Unassigned —</option>
          {managers.map(m => (
            <option key={m.id} value={m.id}>{displayName(m)}</option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition disabled:opacity-50"
        >
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>

      <p className="text-[11px] text-slate-400 mt-2">
        {selectedManagerId
          ? `This user will appear in ${displayName(managers.find(m => m.id === selectedManagerId)!)} 's team.`
          : 'This user is currently unassigned and will not appear in any team.'}
      </p>
    </div>
  )
}
