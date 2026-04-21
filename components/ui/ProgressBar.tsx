'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  color?: 'orange' | 'teal' | 'gold' | 'navy' | 'green' | 'red'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
  animated?: boolean
}

const colorMap = {
  orange: 'bg-orange',
  teal:   'bg-teal',
  gold:   'bg-gold',
  navy:   'bg-navy',
  green:  'bg-green-500',
  red:    'bg-red-500',
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'orange',
  size = 'md',
  showLabel = false,
  className,
  animated = false,
}: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-500">Progress</span>
          <span className="text-xs font-semibold text-navy">{pct}%</span>
        </div>
      )}
      <div className={cn('progress-track w-full', sizeMap[size])}>
        <div
          className={cn(
            'progress-fill',
            colorMap[color],
            animated && 'animate-pulse',
          )}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
}
