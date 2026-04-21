import { cn } from '@/lib/utils'

interface ComplianceDeadline {
  id: string
  areaId: string
  propertyAddress: string
  dueDate: string
  type: 'certificate-renewal' | 'inspection' | 'check' | 'registration'
  status: 'upcoming' | 'due-soon' | 'overdue'
}

const STATUS_BADGE: Record<string, string> = {
  upcoming: 'bg-teal/10 text-teal border-teal/20',
  'due-soon': 'bg-amber-50 text-amber-700 border-amber-200',
  overdue: 'bg-red-50 text-red-600 border-red-200',
}

const STATUS_LABEL: Record<string, string> = {
  upcoming: 'Upcoming',
  'due-soon': 'Due Soon',
  overdue: 'Overdue',
}

const TYPE_LABEL: Record<string, string> = {
  'certificate-renewal': 'Certificate Renewal',
  inspection: 'Inspection',
  check: 'Check',
  registration: 'Registration',
}

// Map areaId to human-readable label
const AREA_LABELS: Record<string, string> = {
  'gas-safety': 'Gas Safety (CP12)',
  eicr: 'EICR',
  'epc-mees': 'EPC / MEES',
  legionella: 'Legionella',
  'fire-safety': 'Fire Safety',
  'smoke-co': 'Smoke & CO Alarms',
  'right-to-rent': 'Right to Rent',
  'deposit-protection': 'Deposit Protection',
  'hmo-licensing': 'HMO Licensing',
  'furniture-furnishings': 'Furniture & Furnishings',
  asbestos: 'Asbestos',
}

export default function ComplianceCalendar({ deadlines }: { deadlines: ComplianceDeadline[] }) {
  // Sort by date
  const sorted = [...deadlines].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
  )

  // Group by month
  const byMonth = sorted.reduce<Record<string, ComplianceDeadline[]>>((acc, d) => {
    const month = new Date(d.dueDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    if (!acc[month]) acc[month] = []
    acc[month].push(d)
    return acc
  }, {})

  return (
    <div className="card p-5">
      <h3 className="text-sm font-bold text-navy mb-1">Compliance Calendar</h3>
      <p className="text-xs text-slate-500 mb-4">Upcoming deadlines across your portfolio — next 90 days</p>

      <div className="space-y-5">
        {Object.entries(byMonth).map(([month, items]) => (
          <div key={month}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">{month}</p>
            <div className="space-y-2">
              {items.map(d => (
                <div
                  key={d.id}
                  className={cn(
                    'flex items-center justify-between gap-3 p-3 rounded-xl border',
                    d.status === 'overdue'
                      ? 'border-red-200 bg-red-50/40'
                      : d.status === 'due-soon'
                        ? 'border-amber-200 bg-amber-50/40'
                        : 'border-slate-100 bg-white',
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Date */}
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-xs font-black text-navy leading-none">
                        {new Date(d.dueDate).getDate()}
                      </span>
                      <span className="text-[8px] font-semibold text-slate-400 uppercase leading-none mt-0.5">
                        {new Date(d.dueDate).toLocaleDateString('en-GB', { month: 'short' })}
                      </span>
                    </div>
                    {/* Details */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">
                        {AREA_LABELS[d.areaId] ?? d.areaId}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {d.propertyAddress} · {TYPE_LABEL[d.type] ?? d.type}
                      </p>
                    </div>
                  </div>
                  {/* Status badge */}
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0',
                    STATUS_BADGE[d.status],
                  )}>
                    {STATUS_LABEL[d.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
