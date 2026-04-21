import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  earnedDate?: string
}

export default function AchievementBadge({
  achievement,
  size = 'md',
}: {
  achievement: Achievement
  size?: 'sm' | 'md'
}) {
  const isSm = size === 'sm'

  return (
    <div
      className={cn(
        'relative rounded-2xl border text-center transition-all',
        isSm ? 'p-3 min-w-[100px]' : 'p-4 min-w-[130px]',
        achievement.earned
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-slate-50 border-slate-100',
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'mx-auto rounded-full flex items-center justify-center',
          isSm ? 'w-10 h-10 text-lg' : 'w-12 h-12 text-2xl',
          achievement.earned ? '' : 'grayscale opacity-40',
        )}
        style={{
          backgroundColor: achievement.earned ? 'rgba(0,113,227,0.08)' : undefined,
        }}
      >
        {achievement.earned ? (
          <span aria-hidden>{achievement.icon}</span>
        ) : (
          <Lock className={cn('text-slate-300', isSm ? 'w-4 h-4' : 'w-5 h-5')} aria-hidden />
        )}
      </div>

      {/* Title */}
      <p className={cn(
        'font-semibold text-navy mt-2 leading-tight',
        isSm ? 'text-[11px]' : 'text-xs',
      )}>
        {achievement.title}
      </p>

      {/* Date or locked label */}
      {achievement.earned && achievement.earnedDate ? (
        <p className="text-[10px] text-slate-400 mt-0.5">
          {new Date(achievement.earnedDate).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short',
          })}
        </p>
      ) : (
        <p className="text-[10px] text-slate-300 mt-0.5">Locked</p>
      )}
    </div>
  )
}
