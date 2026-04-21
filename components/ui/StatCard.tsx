import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  trend?: { value: string; positive?: boolean }
  accent?: 'orange' | 'teal' | 'gold' | 'navy'
  className?: string
}

const accentMap: Record<string, string> = {
  orange: 'border-l-orange',
  teal:   'border-l-teal',
  gold:   'border-l-gold',
  navy:   'border-l-navy',
}

const iconBgMap: Record<string, string> = {
  orange: 'bg-orange/10 text-orange',
  teal:   'bg-teal/10 text-teal',
  gold:   'bg-gold/20 text-yellow-700',
  navy:   'bg-navy/10 text-navy',
}

export default function StatCard({ label, value, sub, icon, trend, accent = 'orange', className }: StatCardProps) {
  return (
    <div className={cn('card p-5 border-l-4', accentMap[accent], className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{label}</p>
          <p className="text-2xl font-bold text-navy tabular-nums leading-none">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
          {trend && (
            <p className={cn('text-xs font-medium mt-1.5', trend.positive !== false ? 'text-green-600' : 'text-red-500')}>
              {trend.positive !== false ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn('flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center', iconBgMap[accent])}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
