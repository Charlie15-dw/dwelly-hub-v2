import Link from 'next/link'
import { Check, ArrowRight, ChevronRight, Lock, Circle, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GuidedJourneyResult, GuidedStage, GuidedTask } from '@/lib/hub-guided-journey'

// Guided new-starter journey (beta). Presentational only — all state is computed
// server-side by computeGuidedJourney(). Stages unlock in sequence: a locked
// stage is dimmed and not clickable until the previous stage is complete.

function TaskRow({ task }: { task: GuidedTask }) {
  const isDone = task.state === 'done'
  const isCurrent = task.state === 'current'
  const isLocked = task.state === 'locked'

  const inner = (
    <>
      <span
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
          isDone && 'bg-teal text-white',
          isCurrent && 'bg-orange text-white ring-4 ring-orange/15',
          task.state === 'todo' && 'bg-slate-100 text-slate-400',
          isLocked && 'bg-slate-100 text-slate-300',
        )}
      >
        {isDone ? <Check className="w-3.5 h-3.5" aria-hidden />
          : isLocked ? <Lock className="w-3 h-3" aria-hidden />
          : <Circle className="w-2.5 h-2.5 fill-current" aria-hidden />}
      </span>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm font-semibold truncate', isLocked ? 'text-slate-400' : 'text-navy')}>
          {task.label}
          {!task.required && <span className="ml-2 text-[10px] font-medium text-slate-400">Optional</span>}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{task.detail}</p>
      </div>
      {isCurrent && <span className="text-[11px] font-semibold text-orange flex-shrink-0">Do this next</span>}
      {isDone && <span className="text-[11px] font-semibold text-teal flex-shrink-0">Done</span>}
      {!isLocked && <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-navy transition flex-shrink-0" aria-hidden />}
    </>
  )

  if (isLocked) {
    return (
      <li className="flex items-center gap-3 rounded-2xl border border-slate-100 p-3 opacity-60 cursor-not-allowed">
        {inner}
      </li>
    )
  }
  return (
    <li>
      <Link
        href={task.href}
        className={cn(
          'flex items-center gap-3 rounded-2xl border p-3 transition group',
          isCurrent ? 'border-orange/30 bg-orange/5 hover:bg-orange/10' : 'border-slate-100 hover:shadow-sm hover:border-slate-200',
        )}
      >
        {inner}
      </Link>
    </li>
  )
}

function StageCard({ stage }: { stage: GuidedStage }) {
  return (
    <div
      className={cn(
        'rounded-3xl border p-5 transition',
        stage.current && 'border-orange/30 shadow-panel',
        stage.complete && 'border-teal/30 bg-teal/[0.03]',
        stage.locked && 'border-slate-100 bg-slate-50/60',
        !stage.current && !stage.complete && !stage.locked && 'border-slate-100',
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold',
            stage.complete && 'bg-teal text-white',
            stage.current && 'bg-orange text-white ring-4 ring-orange/15',
            stage.locked && 'bg-slate-200 text-slate-400',
            !stage.current && !stage.complete && !stage.locked && 'bg-slate-100 text-slate-500',
          )}
        >
          {stage.complete ? <Check className="w-4 h-4" aria-hidden />
            : stage.locked ? <Lock className="w-3.5 h-3.5" aria-hidden />
            : stage.n}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={cn('text-base font-bold', stage.locked ? 'text-slate-400' : 'text-navy')}>
              Stage {stage.n} · {stage.title}
            </h4>
            {stage.current && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-orange/10 text-orange">In progress</span>}
            {stage.complete && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-teal/10 text-teal">Complete</span>}
            {stage.locked && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 text-slate-400">Locked</span>}
          </div>
          <p className={cn('text-xs mt-0.5', stage.locked ? 'text-slate-400' : 'text-slate-500')}>{stage.blurb}</p>
        </div>
        {!stage.locked && (
          <span className="text-xs font-bold text-navy flex-shrink-0">{stage.pct}%</span>
        )}
      </div>

      {stage.locked ? (
        <p className="mt-4 text-xs text-slate-400 flex items-center gap-1.5">
          <Lock className="w-3 h-3" aria-hidden /> Finish the previous stage to unlock this.
        </p>
      ) : (
        <ol className="mt-4 space-y-2">
          {stage.tasks.map((task) => <TaskRow key={task.href} task={task} />)}
        </ol>
      )}
    </div>
  )
}

export default function GuidedJourney({
  firstName, journey,
}: {
  firstName: string
  journey: GuidedJourneyResult
}) {
  const { isNewStarter, allComplete, pct, nextHref, nextLabel, stages } = journey

  return (
    <section className="space-y-4">
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="text-lg font-bold text-navy">Your journey</h3>
            <p className="text-sm text-slate-500 mt-0.5 max-w-xl">
              {allComplete
                ? `You\u2019ve completed every stage${firstName ? `, ${firstName}` : ''}. You\u2019re fully signed off — keep your knowledge sharp with Recap & Refresh.`
                : isNewStarter
                  ? `Welcome${firstName ? `, ${firstName}` : ''} — here\u2019s your path from day one to signed off. Complete each stage to unlock the next.`
                  : 'Complete each stage to unlock the next. No rush — go at your own pace.'}
            </p>
          </div>
          {allComplete ? (
            <span className="inline-flex items-center gap-2 text-sm font-bold text-teal flex-shrink-0">
              <PartyPopper className="w-4 h-4" aria-hidden /> All stages complete
            </span>
          ) : (
            <Link href={nextHref} className="btn-primary text-sm whitespace-nowrap flex-shrink-0">
              {nextLabel}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          )}
        </div>

        <div className="mt-5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-medium text-slate-500">Overall progress</span>
            <span className="text-sm font-bold text-navy">{pct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-slate-100">
            <div className="h-full bg-orange rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      {stages.map((stage) => <StageCard key={stage.n} stage={stage} />)}
    </section>
  )
}
