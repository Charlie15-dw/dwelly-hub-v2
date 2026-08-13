import { cn } from '@/lib/utils'
import { type ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?:
    | 'default' | 'teal' | 'orange' | 'gold' | 'navy' | 'outline'
    // RAG — the single source of truth lives in globals.css (.rag-*)
    | 'red' | 'amber' | 'green'
    // Lifecycle stage of something raised (.status-*)
    | 'received' | 'review' | 'progress' | 'done'
  size?: 'sm' | 'md'
  className?: string
}

// Structural variants stay inline; the colour-carrying ones defer to the
// shared globals.css classes so status colour is defined exactly once.
const variantMap: Record<string, string> = {
  default:  'bg-slate-100 text-slate-600 border-slate-200',
  teal:     'bg-teal/10 text-teal border-teal/20',
  orange:   'bg-orange/10 text-orange border-orange/20',
  gold:     'bg-gold/20 text-yellow-700 border-gold/30',
  navy:     'bg-navy/10 text-navy border-navy/20',
  outline:  'bg-transparent text-slate-600 border-slate-200',
  red:      'rag-red',
  amber:    'rag-amber',
  green:    'rag-green',
  received: 'status-received',
  review:   'status-review',
  progress: 'status-progress',
  done:     'status-done',
}

const sizeMap: Record<string, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
}

export default function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium',
        variantMap[variant],
        sizeMap[size],
        className,
      )}
    >
      {children}
    </span>
  )
}
