'use client'

import { useEffect, useState } from 'react'
import { COMPLETED_KEY } from './LessonActions'

// Landing-page progress indicator for CRM 2.0. Reads the same localStorage key
// that LessonActions writes, and re-reads when a lesson is marked complete
// (via the 'crm2-progress' event) or another tab changes it (via 'storage').

function readCount(slugs: string[]): number {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    if (!Array.isArray(parsed)) return 0
    // Only count slugs that still exist, so removed lessons don't inflate it.
    return parsed.filter((s) => slugs.includes(s)).length
  } catch {
    return 0
  }
}

export default function ProgressRing({ slugs }: { slugs: string[] }) {
  const total = slugs.length
  const [done, setDone] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const update = () => setDone(readCount(slugs))
    update()
    setLoaded(true)
    // Re-read whenever the page could have gone stale: another tab's change
    // (storage), a lesson marked complete in this tab (crm2-progress), and —
    // crucially — coming back to this page via focus, tab switch or the
    // browser back button (pageshow covers bfcache restores, where the mount
    // effect does not re-run).
    const onPageShow = () => update()
    const onVisibility = () => { if (!document.hidden) update() }
    window.addEventListener('crm2-progress', update)
    window.addEventListener('storage', update)
    window.addEventListener('focus', update)
    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('crm2-progress', update)
      window.removeEventListener('storage', update)
      window.removeEventListener('focus', update)
      window.removeEventListener('pageshow', onPageShow)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [slugs])

  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const r = 26
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64" aria-hidden>
          <circle cx="32" cy="32" r={r} fill="none" stroke="#E8E8ED" strokeWidth="6" />
          <circle
            cx="32" cy="32" r={r} fill="none" stroke="#0071E3" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={loaded ? offset : circ}
            style={{ transition: 'stroke-dashoffset 500ms ease-out' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#1D1D1F]">
          {loaded ? `${pct}%` : ''}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#1D1D1F]">Your progress</p>
        <p className="text-sm text-[#6E6E73] mt-0.5">
          {loaded ? (
            done === total && total > 0
              ? 'All lessons complete — nice work.'
              : `${done} of ${total} lessons complete`
          ) : `${total} lessons`}
        </p>
      </div>
    </div>
  )
}
