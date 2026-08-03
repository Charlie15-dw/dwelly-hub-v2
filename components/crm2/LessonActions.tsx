'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Circle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// Per-lesson "mark complete" + "was this helpful?" controls for CRM 2.0.
// Both persist to localStorage only — this is a lightweight, private learning
// space, so there's no need to touch the shared settings blob or Supabase.
// The landing page's progress ring reads the same COMPLETED_KEY.

export const COMPLETED_KEY = 'crm2_completed'
const FEEDBACK_KEY = 'crm2_feedback'

function readList(key: string): string[] {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readMap(key: string): Record<string, string> {
  try {
    const raw = localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export default function LessonActions({ slug }: { slug: string }) {
  const [loaded, setLoaded] = useState(false)
  const [complete, setComplete] = useState(false)
  const [vote, setVote] = useState<'up' | 'down' | null>(null)

  useEffect(() => {
    setComplete(readList(COMPLETED_KEY).includes(slug))
    const fb = readMap(FEEDBACK_KEY)[slug]
    setVote(fb === 'up' || fb === 'down' ? fb : null)
    setLoaded(true)
  }, [slug])

  function toggleComplete() {
    const list = readList(COMPLETED_KEY)
    const next = list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]
    try {
      localStorage.setItem(COMPLETED_KEY, JSON.stringify(next))
    } catch {
      // Ignore storage errors — progress is a nicety, not critical.
    }
    setComplete(next.includes(slug))
    // Let the landing page (and any open tab) react to the change.
    window.dispatchEvent(new Event('crm2-progress'))
  }

  function castVote(next: 'up' | 'down') {
    const map = readMap(FEEDBACK_KEY)
    const applied = vote === next ? undefined : next
    if (applied) map[slug] = applied
    else delete map[slug]
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify(map))
    } catch {
      // Ignore storage errors.
    }
    setVote(applied ?? null)
  }

  return (
    <div className="card p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      {/* Mark complete */}
      <button
        type="button"
        onClick={toggleComplete}
        disabled={!loaded}
        aria-pressed={complete}
        className={cn(
          'inline-flex items-center gap-2.5 text-sm font-semibold px-4 py-2.5 rounded-xl border transition disabled:opacity-50',
          complete
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-white text-[#1D1D1F] border-[#E8E8ED] hover:border-[#1D1D1F]/30',
        )}
      >
        {complete ? <CheckCircle2 className="w-4 h-4" aria-hidden /> : <Circle className="w-4 h-4" aria-hidden />}
        {complete ? 'Completed' : 'Mark as complete'}
      </button>

      {/* Was this helpful? */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-[#6E6E73]">{vote ? 'Thanks for the feedback' : 'Was this helpful?'}</span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => castVote('up')}
            disabled={!loaded}
            aria-label="Yes, this was helpful"
            aria-pressed={vote === 'up'}
            className={cn(
              'p-2 rounded-lg border transition disabled:opacity-50',
              vote === 'up'
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-white text-[#6E6E73] border-[#E8E8ED] hover:text-[#1D1D1F] hover:border-[#1D1D1F]/30',
            )}
          >
            <ThumbsUp className={cn('w-4 h-4', vote === 'up' && 'fill-current')} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => castVote('down')}
            disabled={!loaded}
            aria-label="No, this needs improvement"
            aria-pressed={vote === 'down'}
            className={cn(
              'p-2 rounded-lg border transition disabled:opacity-50',
              vote === 'down'
                ? 'bg-red-50 text-red-600 border-red-200'
                : 'bg-white text-[#6E6E73] border-[#E8E8ED] hover:text-[#1D1D1F] hover:border-[#1D1D1F]/30',
            )}
          >
            <ThumbsDown className={cn('w-4 h-4', vote === 'down' && 'fill-current')} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
