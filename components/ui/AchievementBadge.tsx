import { Lock, Check } from 'lucide-react'
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
  const { earned } = achievement

  return (
    <div
      title={achievement.description}
      className={cn(
        'group relative rounded-2xl border text-center overflow-hidden transition-all duration-200',
        isSm ? 'p-3' : 'p-4',
        earned
          ? 'bg-white border-slate-200 shadow-sm hover:-translate-y-1 hover:shadow-lg'
          : 'bg-slate-50 border-slate-100',
      )}
    >
      {/* Gold sheen strip + glow — earned only */}
      {earned && (
        <>
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
            aria-hidden
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-6 w-20 h-20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'rgba(201,168,76,0.35)' }}
            aria-hidden
          />
        </>
      )}

      {/* Verified tick — earned only */}
      {earned && (
        <div
          className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
          style={{ background: 'linear-gradient(135deg, #E9C767, #C9A84C)' }}
          aria-hidden
        >
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}

      {/* Medallion */}
      <div className={cn('relative mx-auto', isSm ? 'w-12 h-12' : 'w-16 h-16')}>
        {earned ? (
          <>
            {/* Gradient ring */}
            <div
              className="absolute inset-0 rounded-full shadow-inner"
              style={{ background: 'linear-gradient(135deg, #E9C767, #C9A84C)' }}
              aria-hidden
            />
            {/* Inner face */}
            <div className={cn(
              'absolute rounded-full bg-white flex items-center justify-center',
              isSm ? 'inset-[2.5px] text-xl' : 'inset-[3px] text-2xl',
            )}>
              <span className="transition-transform duration-200 group-hover:scale-110" aria-hidden>
                {achievement.icon}
              </span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
            <Lock className={cn('text-slate-300', isSm ? 'w-4 h-4' : 'w-5 h-5')} aria-hidden />
          </div>
        )}
      </div>

      {/* Title */}
      <p className={cn(
        'font-semibold mt-2.5 leading-tight',
        earned ? 'text-navy' : 'text-slate-400',
        isSm ? 'text-[11px]' : 'text-xs',
      )}>
        {achievement.title}
      </p>

      {/* Status line */}
      {earned ? (
        <p
          className="text-[10px] font-semibold mt-1 tracking-wide"
          style={{ color: '#A9863A' }}
        >
          {achievement.earnedDate
            ? new Date(achievement.earnedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            : 'UNLOCKED'}
        </p>
      ) : (
        <p className="text-[10px] text-slate-300 mt-1">Locked</p>
      )}
    </div>
  )
}
