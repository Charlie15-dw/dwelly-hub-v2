import { cn } from '@/lib/utils'

// "Your progress" for the CRM 2.0 landing page. Progress is now measured only
// across the twelve guides (references and the capstone don't count), and it's
// broken out per pillar — the level people actually think in — rather than one
// blended percentage across eighteen unlike things. State is passed in from the
// server (read from content_completions), so there's no client fetch or flash.

export interface PillarProgress {
  label: string
  done: number
  total: number
}

export default function ProgressRing({
  done,
  total,
  pillars,
}: {
  done: number
  total: number
  pillars: PillarProgress[]
}) {
  return (
    <div className="card p-6 flex flex-col">
      <p className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
        Your progress
      </p>
      <p className="mt-1 text-navy">
        <span className="text-[40px] font-bold tabular-nums leading-none">{done}</span>
        <span className="text-[15px] font-medium text-[var(--text-secondary)]"> of {total} guides read</span>
      </p>

      <div className="mt-5 space-y-3.5">
        {pillars.map((p) => {
          const complete = p.total > 0 && p.done === p.total
          const started = p.done > 0
          const pct = p.total > 0 ? Math.round((p.done / p.total) * 100) : 0
          return (
            <div key={p.label}>
              <div className="flex items-center justify-between text-[13px] mb-1.5">
                <span className="font-medium text-navy">{p.label}</span>
                <span className={cn(started ? 'text-[var(--text-secondary)]' : 'text-[var(--text-secondary)]')}>
                  {started ? `${p.done} of ${p.total}` : 'Not started'}
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${pct}%`,
                    background: complete ? '#1A7F37' : started ? '#0071E3' : 'transparent',
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-5 text-[12.5px] text-[var(--text-secondary)] leading-relaxed">
        Saved to your account, so it follows you between devices.
      </p>
    </div>
  )
}
