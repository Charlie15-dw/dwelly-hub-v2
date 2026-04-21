import { Phone, AlertTriangle, Shield, Printer } from 'lucide-react'
import { EMERGENCY_PROCEDURES, EMERGENCY_CONTACTS } from '@/lib/emergency-data'
import EmergencyCard from '@/components/ui/EmergencyCard'

export default function EmergencyPage() {
  const p1 = EMERGENCY_PROCEDURES.filter(p => p.priority === 'P1')
  const p2 = EMERGENCY_PROCEDURES.filter(p => p.priority === 'P2')
  const p3 = EMERGENCY_PROCEDURES.filter(p => p.priority === 'P3')

  return (
    <div className="space-y-6">
      {/* ── Emergency Contacts Bar ── */}
      <div className="rounded-2xl p-5 border border-red-200" style={{ backgroundColor: '#FFF5F5' }}>
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-4 h-4 text-red-500" />
          <h2 className="text-sm font-bold text-navy">Emergency Contacts</h2>
          <span className="text-[10px] text-red-500 font-semibold">Always call 999 for life-threatening emergencies</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {EMERGENCY_CONTACTS.map(contact => (
            <div key={contact.label} className="bg-white rounded-xl p-3 border border-red-100">
              <p className="text-xs font-semibold text-navy mb-0.5">{contact.label}</p>
              <p className="text-base font-black text-red-600 font-mono tabular-nums">{contact.number}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{contact.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── P1 Critical ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
            P1 — Critical
          </span>
          <span className="text-xs text-slate-500">Immediate action required — risk to life or property</span>
          <div className="flex-1 h-px bg-red-100" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {p1.map(p => <EmergencyCard key={p.id} procedure={p} />)}
        </div>
      </div>

      {/* ── P2 Urgent ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
            P2 — Urgent
          </span>
          <span className="text-xs text-slate-500">Action within 4 hours — significant disruption or safety concern</span>
          <div className="flex-1 h-px bg-amber-100" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {p2.map(p => <EmergencyCard key={p.id} procedure={p} />)}
        </div>
      </div>

      {/* ── P3 Standard ── */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            P3 — Standard
          </span>
          <span className="text-xs text-slate-500">Action within 24 hours — managed response required</span>
          <div className="flex-1 h-px bg-slate-100" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {p3.map(p => <EmergencyCard key={p.id} procedure={p} />)}
        </div>
      </div>

      {/* ── Footer Tip ── */}
      <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex items-center gap-3">
        <Printer className="w-5 h-5 text-slate-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-navy">Keep a printed copy</p>
          <p className="text-xs text-slate-500">Use Ctrl+P (Windows) or Cmd+P (Mac) to print this page for offline reference. We recommend keeping a copy at your desk and in each managed property.</p>
        </div>
      </div>
    </div>
  )
}
