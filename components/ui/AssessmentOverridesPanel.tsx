'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { KeyRound, X } from 'lucide-react'
import { DEPARTMENTS, DEPARTMENT_META, type Department } from '@/lib/departments'

export interface OverrideRow {
  id: string
  department: Department
  assessment_id: string | null
  granted_at: string | null
}

export default function AssessmentOverridesPanel({
  userId,
  overrides,
}: {
  userId: string
  overrides: OverrideRow[]
}) {
  const router = useRouter()
  const [department, setDepartment] = useState<Department>('property-management')
  const [assessmentId, setAssessmentId] = useState('')
  const [saving, setSaving] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGrant() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/assessment-override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, department, assessmentId: assessmentId || null }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Failed to grant override')
        return
      }
      setAssessmentId('')
      router.refresh()
    } catch (err) {
      setError(String(err))
    } finally {
      setSaving(false)
    }
  }

  async function handleRevoke(id: string) {
    setRevokingId(id)
    setError(null)
    try {
      const res = await fetch('/api/admin/assessment-override', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        setError(data?.error ?? 'Failed to revoke override')
        return
      }
      router.refresh()
    } catch (err) {
      setError(String(err))
    } finally {
      setRevokingId(null)
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <KeyRound className="w-4 h-4 text-navy" />
        <h3 className="text-sm font-bold text-navy">Assessment Overrides</h3>
      </div>
      <p className="text-[11px] text-slate-400 mb-4">
        Grant this person access to a department&apos;s assessments without changing their own
        department. Leave the assessment id blank to unlock the whole department.
      </p>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 mb-3">
          <p className="text-xs text-red-700">{error}</p>
        </div>
      )}

      {overrides.length > 0 && (
        <div className="space-y-2 mb-4">
          {overrides.map(o => (
            <div key={o.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-navy">
                  {DEPARTMENT_META[o.department]?.label ?? o.department}
                  <span className="text-slate-400 font-normal"> · {o.assessment_id ?? 'whole department'}</span>
                </p>
                {o.granted_at && (
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Granted {new Date(o.granted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <button
                onClick={() => handleRevoke(o.id)}
                disabled={revokingId === o.id}
                className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50 flex-shrink-0"
                aria-label="Revoke override"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={department}
          onChange={e => setDepartment(e.target.value as Department)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
        >
          {DEPARTMENTS.map(d => (
            <option key={d} value={d}>{DEPARTMENT_META[d].label}</option>
          ))}
        </select>
        <input
          type="text"
          value={assessmentId}
          onChange={e => setAssessmentId(e.target.value)}
          placeholder="Assessment id (optional)"
          className="flex-1 min-w-[160px] text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange/30 focus:border-orange"
        />
        <button
          onClick={handleGrant}
          disabled={saving}
          className="px-4 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy/90 transition disabled:opacity-50"
        >
          {saving ? 'Granting…' : 'Grant'}
        </button>
      </div>
    </div>
  )
}
