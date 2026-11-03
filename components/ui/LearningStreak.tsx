'use client'

import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function LearningStreak({
  currentStreak,
  lastSevenDays,
}: {
  currentStreak: number
  lastSevenDays: boolean[]
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-4 h-4 text-orange" aria-hidden />
        <h3 className="text-sm font-bold text-navy">Learning Streak</h3>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl font-black text-navy tabular-nums">{currentStreak}</span>
        <span className="text-xs text-navy-500 leading-tight">
          day streak<br />
          <span className="text-[10px] text-navy-400">Keep it going!</span>
        </span>
      </div>

      {/* 7-day activity dots */}
      <div className="flex items-center gap-2">
        {lastSevenDays.map((active, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={cn(
                'w-5 h-5 rounded-full transition-colors',
                active
                  ? 'bg-orange shadow-sm'
                  : 'bg-navy-100 border border-navy-200',
              )}
              aria-label={`${DAY_LABELS[i]}: ${active ? 'Active' : 'Inactive'}`}
            />
            <span className="text-[9px] font-medium text-navy-400">{DAY_LABELS[i]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
