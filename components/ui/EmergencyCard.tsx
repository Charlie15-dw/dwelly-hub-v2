import { cn } from '@/lib/utils'

interface EmergencyProcedure {
  id: string
  title: string
  priority: 'P1' | 'P2' | 'P3'
  priorityLabel: string
  immediateActions: string[]
  whoToContact: { role: string; detail: string }[]
  escalationPath: string[]
  documentationRequired: string[]
  dwellySteps: string[]
  icon: string
}

const PRIORITY_STYLES = {
  P1: 'bg-red-50 border-red-200 text-red-700',
  P2: 'bg-amber-50 border-amber-200 text-amber-700',
  P3: 'bg-slate-50 border-slate-200 text-slate-600',
}

const PRIORITY_BADGE = {
  P1: 'bg-red-100 text-red-700 border-red-200',
  P2: 'bg-amber-100 text-amber-700 border-amber-200',
  P3: 'bg-slate-100 text-slate-600 border-slate-200',
}

export default function EmergencyCard({ procedure }: { procedure: EmergencyProcedure }) {
  const p = procedure

  return (
    <div className={cn('rounded-2xl border p-5 space-y-4', PRIORITY_STYLES[p.priority])}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden>{p.icon}</span>
          <h3 className="text-base font-bold text-navy">{p.title}</h3>
        </div>
        <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0', PRIORITY_BADGE[p.priority])}>
          {p.priority} {p.priorityLabel}
        </span>
      </div>

      {/* Immediate Actions */}
      <div>
        <p className="text-xs font-bold text-navy mb-2">Immediate Actions</p>
        <ol className="space-y-1.5">
          {p.immediateActions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-navy mt-0.5">
                {i + 1}
              </span>
              {action}
            </li>
          ))}
        </ol>
      </div>

      {/* Who to Contact */}
      <div>
        <p className="text-xs font-bold text-navy mb-2">Who to Contact</p>
        <div className="space-y-1">
          {p.whoToContact.map((c, i) => (
            <div key={i} className="flex items-center justify-between bg-white/60 rounded-lg px-3 py-2 border border-white">
              <span className="text-xs font-semibold text-navy">{c.role}</span>
              <span className="text-xs text-slate-600 font-mono">{c.detail}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Escalation */}
      <div>
        <p className="text-xs font-bold text-navy mb-2">Escalation Path</p>
        <div className="flex items-center gap-1.5 flex-wrap">
          {p.escalationPath.map((step, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-xs text-slate-600 bg-white/60 border border-white rounded-lg px-2.5 py-1">{step}</span>
              {i < p.escalationPath.length - 1 && <span className="text-slate-300 text-xs">&rarr;</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Documentation */}
      <div>
        <p className="text-xs font-bold text-navy mb-2">Documentation Required</p>
        <ul className="space-y-1">
          {p.documentationRequired.map((doc, i) => (
            <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
              <span className="text-slate-400 mt-0.5">•</span>
              {doc}
            </li>
          ))}
        </ul>
      </div>

      {/* Dwelly Steps */}
      <div>
        <p className="text-xs font-bold text-navy mb-2">Dwelly System Steps</p>
        <ol className="space-y-1">
          {p.dwellySteps.map((step, i) => (
            <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 mt-0.5">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
