'use client'

import { useEffect, useState } from 'react'
import { Flame } from 'lucide-react'

// A gentle, PRIVATE habit loop (beta). Records the days a learner shows up and
// reflects a forgiving streak back to them — encouragement, never pressure.
//
// Deliberate design choices, grounded in the learning research:
//   • Private only. No leaderboards, no comparison to others — public streaks
//     and rankings drive anxiety and burnout, which is the opposite of what a
//     learning habit needs.
//   • Forgiving. Missing a single day doesn't wipe the streak; the anchor can
//     be today OR yesterday. We never show "you lost your streak" shaming.
//   • Client-side only for the beta (localStorage) — no schema change needed
//     while we trial it with a single account.

const STREAK_KEY = 'dwelly:hub:streak:v1'

/** Local date as YYYY-MM-DD (not UTC — a learner's "day" is their own day). */
function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d)
  copy.setDate(copy.getDate() + n)
  return copy
}

/** Consecutive-day streak ending today or yesterday (a one-day grace). */
function computeStreak(days: Set<string>): number {
  const today = new Date()
  // Anchor: if today isn't recorded but yesterday is, count from yesterday so a
  // learner who hasn't opened the Hub yet today still sees their streak intact.
  let cursor: Date
  if (days.has(dayKey(today))) cursor = today
  else if (days.has(dayKey(addDays(today, -1)))) cursor = addDays(today, -1)
  else return 0

  let streak = 0
  while (days.has(dayKey(cursor))) {
    streak += 1
    cursor = addDays(cursor, -1)
  }
  return streak
}

export default function LearningStreak() {
  const [days, setDays] = useState<Set<string> | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STREAK_KEY)
      const stored: string[] = raw ? JSON.parse(raw) : []
      const set = new Set(stored)
      const todayKey = dayKey(new Date())
      if (!set.has(todayKey)) {
        set.add(todayKey)
        // Keep the last ~90 days only — enough for any streak, bounded storage.
        const cutoff = dayKey(addDays(new Date(), -90))
        const trimmed = Array.from(set).filter(k => k >= cutoff)
        localStorage.setItem(STREAK_KEY, JSON.stringify(trimmed))
        setDays(new Set(trimmed))
      } else {
        setDays(set)
      }
    } catch {
      // localStorage unavailable — skip the streak rather than block the Hub.
      setDays(new Set())
    }
  }, [])

  if (!days) return null

  const streak = computeStreak(days)

  // Last 7 days, oldest → newest, for the dot row.
  const today = new Date()
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, -(6 - i))
    return { key: dayKey(d), active: days.has(dayKey(d)), label: d.toLocaleDateString('en-GB', { weekday: 'narrow' }) }
  })

  const headline =
    streak >= 2 ? `You\u2019ve shown up ${streak} days running` :
    streak === 1 ? 'You\u2019re here today — nice' :
    'Welcome back'
  const sub =
    streak >= 2 ? 'A little each day is how it sticks. No pressure — just keep coming back.' :
    'Learning a little and often beats cramming. See you again tomorrow?'

  return (
    <div className="card p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-orange/10 text-orange border-orange/20 flex-shrink-0">
        <Flame className="w-5 h-5" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-navy">{headline}</p>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{sub}</p>
      </div>
      <div className="hidden sm:flex items-end gap-1.5 flex-shrink-0" aria-hidden>
        {week.map(({ key, active, label }) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-orange' : 'bg-slate-200'}`} />
            <span className="text-[10px] text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
