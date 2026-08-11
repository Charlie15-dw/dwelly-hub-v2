'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PlayCircle, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import { COMPLETED_KEY } from './LessonActions'

// "Pick up where you left off" for the CRM 2.0 landing page. Reads the same
// completion state the progress ring uses and points the reader at the next
// lesson they haven't finished, with an estimate of the reading time left
// across everything still outstanding. Re-reads on the same events as the ring
// so it stays in sync when a lesson is completed or another tab changes state.

export interface ResumeLesson { slug: string; title: string; icon: string; readTime: string }

function parseMinutes(readTime: string): number {
  const m = readTime.match(/\d+/)
  return m ? parseInt(m[0], 10) : 0
}

function readCompleted(): string[] {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default function ResumeCard({ lessons }: { lessons: ResumeLesson[] }) {
  const [completed, setCompleted] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const update = () => setCompleted(readCompleted())
    update()
    setLoaded(true)
    const onVisibility = () => { if (!document.hidden) update() }
    window.addEventListener('crm2-progress', update)
    window.addEventListener('storage', update)
    window.addEventListener('focus', update)
    window.addEventListener('pageshow', update)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('crm2-progress', update)
      window.removeEventListener('storage', update)
      window.removeEventListener('focus', update)
      window.removeEventListener('pageshow', update)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const done = new Set(completed)
  const outstanding = lessons.filter((l) => !done.has(l.slug))
  const next = outstanding[0] ?? null
  const minutesLeft = outstanding.reduce((sum, l) => sum + parseMinutes(l.readTime), 0)
  const allDone = loaded && outstanding.length === 0 && lessons.length > 0

  // Until we've read localStorage, show a neutral shell to avoid a flash of the
  // wrong lesson.
  if (!loaded) {
    return (
      <div className="card p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-[#F5F5F7] flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-navy">Your learning path</p>
          <p className="text-sm text-slate-500 mt-0.5">Loading your progress…</p>
        </div>
      </div>
    )
  }

  if (allDone) {
    return (
      <div className="card p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-7 h-7" aria-hidden />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-navy">You’ve completed every lesson</p>
          <p className="text-sm text-slate-500 mt-0.5">Nice work — try the capstone to prove it all stuck.</p>
        </div>
      </div>
    )
  }

  if (!next) return null

  return (
    <Link href={`/hub/crm-2/${next.slug}`} className="card card-hover p-5 flex items-center gap-4 group">
      <div className="w-16 h-16 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center flex-shrink-0 relative">
        <PlayCircle className="w-7 h-7" aria-hidden />
        <span className="absolute -bottom-1 -right-1 text-lg" aria-hidden>{next.icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#0071E3]">
          {completed.length === 0 ? 'Start here' : 'Pick up where you left off'}
        </p>
        <p className="text-sm font-bold text-navy truncate mt-0.5">{next.title}</p>
        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" aria-hidden />
          {minutesLeft > 0 ? `~${minutesLeft} min left across ${outstanding.length} ${outstanding.length === 1 ? 'lesson' : 'lessons'}` : 'Almost there'}
        </p>
      </div>
      <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-navy transition flex-shrink-0" aria-hidden />
    </Link>
  )
}
