'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2 } from 'lucide-react'
import { DEPARTMENTS, DEPARTMENT_META, type Department } from '@/lib/departments'

export default function ChangeDepartmentPanel({
  userId,
  currentDepartment,
}: {
  userId: string
  currentDepartment: Department
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<Department>(currentDepartment)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changed = selected !== currentDepartment

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch('/api/admin/department', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, department: selected }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Failed to update department')
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
        <Building2 className="w-4 h-4 text-navy" />
        <h3 className="text-sm font-bold text-navy">Department</h3>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 mb-3">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      <div className="flex items-center gap-3">
        <select
          value={selected}
          onChange={e => { setSelected(e.target.value as Department); setSaved(false) }}
          className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
        >
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>{DEPARTMENT_META[d].label}</option>
          ))}
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
        Decides which role-overview and training content this person sees, and locks their
        assessment access to this track. Separate from their permission role above.
      </p>
    </div>
  )
}
