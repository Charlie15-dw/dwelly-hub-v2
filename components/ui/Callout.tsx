import { AlertTriangle, Info, Lightbulb, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// The one callout across the app. Three visual variants only, each on a real
// design token so the colours stay consistent with RAG/phase chips elsewhere:
//   info    → phase-onboarding (blue)  — context, "how to think about this"
//   tip     → rag-green                — a shortcut or good habit
//   warning → rag-amber                — watch out / don't do this
// The old red "important" panel folds into amber warning — two shades of "be
// careful" was one too many. Takes children (not just text) so callers can pass
// glossary-linked prose.

export type CalloutVariant = 'info' | 'tip' | 'warning' | 'important'

const STYLES: Record<'info' | 'tip' | 'warning', { klass: string; Icon: LucideIcon }> = {
  info:    { klass: 'phase-onboarding', Icon: Info },
  tip:     { klass: 'rag-green',        Icon: Lightbulb },
  warning: { klass: 'rag-amber',        Icon: AlertTriangle },
}

export default function Callout({
  variant = 'info',
  className,
  children,
}: {
  variant?: CalloutVariant
  className?: string
  children: React.ReactNode
}) {
  const key = variant === 'important' ? 'warning' : variant
  const { klass, Icon } = STYLES[key] ?? STYLES.info
  return (
    <div className={cn('rounded-2xl p-5 flex gap-3.5 items-start', klass, className)}>
      <Icon className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" aria-hidden />
      <p className="text-[16.5px] leading-[1.65] max-w-[64ch]">{children}</p>
    </div>
  )
}
