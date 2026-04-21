import {
  Shield, AlertTriangle, CheckCircle2, Clock,
  ChevronRight, Scale, FileText,
} from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import ComplianceCalendar from '@/components/ui/ComplianceCalendar'
import Badge from '@/components/ui/Badge'
import {
  COMPLIANCE_AREAS, LEGISLATION_SUMMARIES, COMPLIANCE_DEADLINES,
} from '@/lib/compliance-data'
import { cn, formatDate } from '@/lib/utils'

const STATUS_STYLES: Record<string, string> = {
  compliant:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'due-soon':     'bg-amber-50 text-amber-700 border-amber-200',
  overdue:        'bg-red-50 text-red-600 border-red-200',
  'not-applicable': 'bg-slate-50 text-slate-500 border-slate-200',
}

const STATUS_LABELS: Record<string, string> = {
  compliant:      'Compliant',
  'due-soon':     'Due Soon',
  overdue:        'Overdue',
  'not-applicable': 'N/A',
}

const compliantCount = COMPLIANCE_AREAS.filter(a => a.status === 'compliant').length
const dueSoonCount   = COMPLIANCE_AREAS.filter(a => a.status === 'due-soon').length
const overdueCount   = COMPLIANCE_AREAS.filter(a => a.status === 'overdue').length

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ backgroundColor: '#E0F7F4' }}>
        {/* Decorative white circles */}
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/60 rounded-r-2xl" />
        <div className="absolute right-8 top-3 w-28 h-28 rounded-full bg-white/50" />
        <div className="absolute right-20 bottom-1 w-16 h-16 rounded-full bg-white/40" />
        <div className="absolute left-1/2 top-0 w-48 h-12 rounded-full bg-white/25 blur-xl" />

        <div className="relative">
          <p className="text-sm mb-1" style={{ color: '#3A9E98' }}>Regulatory</p>
          <h2 className="text-2xl font-bold text-[#1D1D1F]">Compliance Hub</h2>
          <p className="text-sm mt-1 max-w-xl" style={{ color: '#5AADA8' }}>
            Track regulatory compliance, monitor deadlines, and stay ahead of requirements across your portfolio
          </p>

          {/* Stat pills */}
          <div className="flex items-center gap-2 mt-5 flex-wrap">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3 h-3" aria-hidden />
              {compliantCount} Compliant
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <Clock className="w-3 h-3" aria-hidden />
              {dueSoonCount} Due Soon
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
              <AlertTriangle className="w-3 h-3" aria-hidden />
              {overdueCount} Overdue
            </span>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Compliant Areas"
          value={compliantCount}
          sub={`of ${COMPLIANCE_AREAS.length} total areas`}
          icon={<Shield className="w-5 h-5" />}
          accent="teal"
        />
        <StatCard
          label="Due Within 30 Days"
          value={dueSoonCount}
          sub="Certificates expiring soon"
          icon={<Clock className="w-5 h-5" />}
          accent="gold"
        />
        <StatCard
          label="Overdue"
          value={overdueCount}
          sub="Immediate action required"
          icon={<AlertTriangle className="w-5 h-5" />}
          accent="orange"
        />
      </div>

      {/* Compliance Areas Grid */}
      <div>
        <h3 className="text-sm font-bold text-navy mb-3">Compliance Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {COMPLIANCE_AREAS.map(area => {
            const isDueSoonOrOverdue = area.status === 'due-soon' || area.status === 'overdue'
            return (
              <div key={area.id} className="card p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl" aria-hidden>{area.icon}</span>
                    <h3 className="text-sm font-bold text-navy">{area.name}</h3>
                  </div>
                  <span className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap',
                    STATUS_STYLES[area.status],
                  )}>
                    {STATUS_LABELS[area.status]}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{area.description}</p>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Last Check</span>
                    <span className="font-medium text-navy">
                      {area.lastCheckDate ? formatDate(area.lastCheckDate) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Next Due</span>
                    <span className={cn(
                      'font-medium',
                      isDueSoonOrOverdue ? 'text-red-500' : 'text-navy',
                    )}>
                      {area.nextDueDate ? formatDate(area.nextDueDate) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Penalty</span>
                    <span className="font-medium text-slate-600">{area.penaltyInfo}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">{area.legislation}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Compliance Calendar */}
      <ComplianceCalendar deadlines={COMPLIANCE_DEADLINES} />

      {/* Key Legislation */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-4 h-4 text-navy" aria-hidden />
          <h3 className="text-sm font-bold text-navy">Key Legislation</h3>
        </div>
        <div>
          {LEGISLATION_SUMMARIES.map(leg => (
            <details key={leg.id} className="border-b border-slate-100 last:border-0">
              <summary className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 px-3 -mx-3 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-navy">{leg.title}</p>
                  <p className="text-xs text-slate-500">{leg.shortName} ({leg.year})</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 transition-transform [details[open]>&]:rotate-90" />
              </summary>
              <div className="pb-3 px-3 -mx-3">
                <p className="text-xs text-slate-600 leading-relaxed mb-2">{leg.description}</p>
                <p className="text-xs font-semibold text-navy mb-1">Key Points:</p>
                <ul className="space-y-1 mb-2">
                  {leg.keyPoints.map((point, i) => (
                    <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                      <span className="text-slate-400 mt-0.5">&#8226;</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* Penalty Quick Reference */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-navy" aria-hidden />
          <h3 className="text-sm font-bold text-navy">Penalty Quick Reference</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left text-[11px] uppercase tracking-wide text-slate-400 font-medium px-3 py-2">Area</th>
                <th className="text-left text-[11px] uppercase tracking-wide text-slate-400 font-medium px-3 py-2">Legislation</th>
                <th className="text-left text-[11px] uppercase tracking-wide text-slate-400 font-medium px-3 py-2">Maximum Penalty</th>
              </tr>
            </thead>
            <tbody>
              {COMPLIANCE_AREAS
                .filter(area => area.status !== 'not-applicable')
                .map(area => (
                  <tr key={area.id} className="border-t border-slate-100">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm" aria-hidden>{area.icon}</span>
                        <span className="text-xs font-medium text-navy">{area.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-slate-600">{area.legislation}</td>
                    <td className="px-3 py-2.5">
                      <span className="text-xs font-semibold text-red-600">{area.penaltyInfo}</span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
