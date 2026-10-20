'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GraduationCap, RotateCcw, Loader2 } from 'lucide-react'

const STAGE_LABELS: Record<number, string> = {
  1: 'Maintenance',
  2: 'Compliance',
  3: 'Move-outs',
  4: 'Inspections',
  5: 'Support',
  6: 'Right to Rent',
  7: 'Graduated — full Hub',
}

export default function OnboardingControl({
  userId,
  stage,
  bypass,
}: {
  userId: string
  stage: number
  bypass: boolean
}) {
  const router = useRouter()
  const [busy, setBusy] = useState<'skip' | 'restart' | null>(null)
  const [error, setError] = useState(false)

  const graduated = bypass || stage >= 7

  async function run(action: 'skip' | 'restart') {
    if (busy) return
    setBusy(action)
    setError(false)
    try {
      const res = await fetch('/api/admin/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      })
      if (!res.ok) { setError(true); setBusy(null); return }
      router.refresh()
      setBusy(null)
    } catch {
      setError(true)
      setBusy(null)
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-navy" aria-hidden />
            <h2 className="text-sm font-bold text-navy">Onboarding</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {graduated
              ? bypass
                ? 'Skipped by an admin — has full Hub access.'
                : 'Finished the staged journey — has full Hub access.'
              : `On stage ${stage} of 6 · ${STAGE_LABELS[stage] ?? 'In progress'}`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {!graduated && (
            <button
              type="button"
              onClick={() => run('skip')}
              disabled={busy !== null}
              className="btn-primary text-sm disabled:opacity-60"
            >
              {busy === 'skip' ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <GraduationCap className="w-4 h-4" aria-hidden />}
              Skip onboarding
            </button>
          )}
          {graduated && (
            <button
              type="button"
              onClick={() => run('restart')}
              disabled={busy !== null}
              className="btn-outline text-sm disabled:opacity-60"
            >
              {busy === 'restart' ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <RotateCcw className="w-4 h-4" aria-hidden />}
              Restart onboarding
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-xs text-red-600 mt-2">Couldn&rsquo;t update — please try again.</p>}
    </div>
  )
}
