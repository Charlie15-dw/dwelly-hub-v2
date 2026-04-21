import Link from 'next/link'
import {
  Award, CheckCircle2, Clock, Download, AlertTriangle,
  TrendingUp, BookOpen, Shield, Plus, ChevronRight, Trophy,
} from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import AchievementBadge from '@/components/ui/AchievementBadge'
import { ACHIEVEMENTS } from '@/lib/achievements-data'
import {
  CURRENT_USER, CPD_ENTRIES, SIGN_OFF_GATES, MODULES,
  ROLE_LABELS,
} from '@/lib/data'
import { formatDate, cn } from '@/lib/utils'

const cpdByType = {
  formal:     CPD_ENTRIES.filter(e => e.type === 'formal'),
  technical:  CPD_ENTRIES.filter(e => e.type === 'technical'),
  reflective: CPD_ENTRIES.filter(e => e.type === 'reflective'),
}

const totalCPD = CPD_ENTRIES.reduce((sum, e) => sum + e.hours, 0)

const TYPE_LABELS = { formal: 'Formal Learning', technical: 'Technical Update', reflective: 'Reflective Practice' }
const TYPE_COLORS: Record<string, string> = {
  formal:     'bg-teal/10 text-teal border-teal/20',
  technical:  'bg-navy/10 text-navy border-navy/20',
  reflective: 'bg-gold/20 text-yellow-700 border-gold/30',
}

export default function PassportPage() {
  return (
    <div className="space-y-6">
      {/* Passport hero */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ backgroundColor: '#E0F7F4' }}>
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/60 rounded-r-2xl" />
        <div className="absolute right-8 top-0 w-40 h-40 rounded-full bg-white/45" />
        <div className="absolute right-24 bottom-2 w-24 h-24 rounded-full bg-white/30" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.70)', border: '1px solid rgba(255,255,255,0.90)' }}>
              <Award className="w-8 h-8" style={{ color: '#3A9E98' }} aria-hidden />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide font-semibold mb-0.5" style={{ color: '#5AADA8' }}>Competency Passport</p>
              <h1 className="text-xl font-bold text-[#1D1D1F]">{CURRENT_USER.name}</h1>
              <p className="text-sm mt-0.5" style={{ color: '#5AADA8' }}>{ROLE_LABELS[CURRENT_USER.role]}</p>
              <p className="text-xs mt-0.5" style={{ color: '#8ECFCC' }}>Programme start: {formatDate(CURRENT_USER.startDate)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button className="btn-outline flex items-center gap-1.5 text-xs">
              <Download className="w-3.5 h-3.5" aria-hidden /> Export Passport PDF
            </button>
            <p className="text-xs" style={{ color: '#8ECFCC' }}>Date-stamped & auditable</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Modules Completed',   value: CURRENT_USER.modulesCompleted, sub: `of ${CURRENT_USER.modulesTotal}` },
            { label: 'CPD Hours Logged',     value: totalCPD.toFixed(1),           sub: `/ ${CURRENT_USER.cpdTarget} target` },
            { label: 'Competencies Signed',  value: CURRENT_USER.competenciesSignedOff.length, sub: `${CURRENT_USER.pendingSignOffs.length} pending` },
            { label: 'Avg Assessment Score', value: `${CURRENT_USER.assessmentScore}%`, sub: 'Pass threshold: 80%' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.85)' }}>
              <p className="text-xl font-black text-[#1D1D1F] tabular-nums">{value}</p>
              <p className="text-xs mt-0.5" style={{ color: '#5AADA8' }}>{label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8ECFCC' }}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left col */}
        <div className="lg:col-span-2 space-y-6">
          {/* Competency sign-off gates */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-navy">Competency Sign-Off Gates</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manager approval required for high-risk areas</p>
              </div>
              <Badge variant="navy">{SIGN_OFF_GATES.filter(g => g.signedOff).length}/{SIGN_OFF_GATES.length} Complete</Badge>
            </div>
            <div className="space-y-3">
              {SIGN_OFF_GATES.map(gate => (
                <div
                  key={gate.id}
                  className={cn(
                    'rounded-xl p-4 border',
                    gate.signedOff
                      ? 'border-teal/30 bg-teal/3'
                      : gate.risk === 'high'
                        ? 'border-red-200 bg-red-50/50'
                        : 'border-amber-200 bg-amber-50/50',
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                        gate.signedOff ? 'bg-teal/15' : gate.risk === 'high' ? 'bg-red-100' : 'bg-amber-100',
                      )}>
                        {gate.signedOff
                          ? <CheckCircle2 className="w-4 h-4 text-teal" />
                          : <AlertTriangle className={cn('w-4 h-4', gate.risk === 'high' ? 'text-red-500' : 'text-amber-500')} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-bold text-navy">{gate.area}</p>
                          {gate.risk === 'high' && !gate.signedOff && (
                            <span className="text-[10px] font-semibold text-red-600 bg-red-100 border border-red-200 px-1.5 py-0.5 rounded">
                              High Risk
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{gate.description}</p>
                        {gate.signedOff && gate.signedOffBy && (
                          <p className="text-xs text-teal mt-1.5 font-medium">
                            ✓ Signed off by {gate.signedOffBy} · {gate.signedOffDate && formatDate(gate.signedOffDate)}
                          </p>
                        )}
                        {!gate.signedOff && (
                          <div className="mt-2">
                            <p className="text-[11px] text-slate-500 mb-1">Required modules:</p>
                            <div className="flex flex-wrap gap-1">
                              {gate.requiredModules.map(modId => {
                                const mod = MODULES.find(m => m.id === modId)
                                return mod ? (
                                  <Link key={modId} href={`/modules/${modId}`} className="text-[10px] text-teal bg-teal/10 border border-teal/20 px-2 py-0.5 rounded-full hover:bg-teal/20 transition-colors">
                                    {mod.title}
                                  </Link>
                                ) : null
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {!gate.signedOff && (
                      <button className="btn-outline text-xs flex-shrink-0">Request Sign-Off</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CPD Log */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-navy">CPD Log</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {totalCPD.toFixed(1)} / {CURRENT_USER.cpdTarget} hours completed · Target: 20 hrs/year
                </p>
              </div>
              <button className="btn-outline text-xs flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" aria-hidden /> Log CPD
              </button>
            </div>

            {/* CPD breakdown */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {(['formal', 'technical', 'reflective'] as const).map(type => {
                const hours = cpdByType[type].reduce((s, e) => s + e.hours, 0)
                return (
                  <div key={type} className={cn('rounded-xl p-3 border', TYPE_COLORS[type])}>
                    <p className="text-lg font-bold tabular-nums">{hours.toFixed(1)}h</p>
                    <p className="text-[11px] mt-0.5">{TYPE_LABELS[type]}</p>
                  </div>
                )
              })}
            </div>

            {/* Annual progress */}
            <div className="mb-5 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-slate-600">Annual CPD Target</span>
                <span className="text-xs font-bold text-navy tabular-nums">{totalCPD.toFixed(1)} / {CURRENT_USER.cpdTarget}h</span>
              </div>
              <ProgressBar value={totalCPD} max={CURRENT_USER.cpdTarget} color="teal" size="lg" />
            </div>

            {/* Log entries */}
            <div className="space-y-2">
              {CPD_ENTRIES.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', {
                      'bg-teal':   entry.type === 'formal',
                      'bg-navy':   entry.type === 'technical',
                      'bg-gold':   entry.type === 'reflective',
                    })} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{entry.title}</p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded border', TYPE_COLORS[entry.type])}>
                          {TYPE_LABELS[entry.type]}
                        </span>
                        <span className="text-[11px] text-slate-400">{entry.source}</span>
                        <span className="text-[11px] text-slate-400">{formatDate(entry.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-navy tabular-nums">{entry.hours}h</p>
                    {entry.verified
                      ? <p className="text-[10px] text-teal font-medium">Verified</p>
                      : <p className="text-[10px] text-amber-500 font-medium">Pending</p>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-5">
          {/* Competencies achieved */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal" /> Competencies Achieved
            </h3>
            <div className="space-y-2">
              {CURRENT_USER.competenciesSignedOff.map(comp => (
                <div key={comp} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-teal/5 border border-teal/20">
                  <CheckCircle2 className="w-4 h-4 text-teal flex-shrink-0" aria-hidden />
                  <span className="text-xs font-medium text-navy">{comp}</span>
                </div>
              ))}
            </div>

            {CURRENT_USER.pendingSignOffs.length > 0 && (
              <>
                <div className="my-3 border-t border-slate-100" />
                <p className="text-xs font-semibold text-slate-500 mb-2">Pending</p>
                <div className="space-y-2">
                  {CURRENT_USER.pendingSignOffs.map(comp => (
                    <div key={comp} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                      <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" aria-hidden />
                      <span className="text-xs font-medium text-navy">{comp}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* T&C Supervision */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy mb-1">T&amp;C Supervision</h3>
            <p className="text-xs text-slate-500 mb-3">90-day supervised period tracker</p>
            <div className="relative">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Day 1</span>
                <span>Day 90</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-teal to-orange rounded-full"
                  style={{ width: '65%' }}
                  role="progressbar"
                  aria-valuenow={65}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="T&C supervision progress: 65 of 90 days"
                />
              </div>
              <p className="text-xs text-slate-600 font-medium">Day 58 of 90</p>
              <p className="text-xs text-slate-400 mt-0.5">32 days remaining before solo sign-off eligibility</p>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { label: 'Week 1 Observation', done: true },
                { label: 'Month 1 Review',     done: true },
                { label: 'Month 2 Review',     done: false },
                { label: 'Month 3 Sign-Off',   done: false },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className={cn(
                    'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0',
                    done ? 'bg-teal' : 'bg-slate-100 border border-slate-200',
                  )}>
                    {done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={cn('text-xs', done ? 'text-teal font-medium' : 'text-slate-500')}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Annual re-cert */}
          <div className="card p-5 border-l-4 border-l-orange">
            <div className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" aria-hidden />
              <div>
                <h3 className="text-sm font-bold text-navy">Annual Re-Certification</h3>
                <p className="text-xs text-slate-500 mt-0.5">December 2026</p>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Compliance-critical re-certification covering deposit protection, gas safety, and tenancy legislation.
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3 h-3" aria-hidden />
                  <span>245 days until re-certification</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div id="achievements" className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange" aria-hidden />
            <h3 className="text-sm font-bold text-navy">Achievement Badges</h3>
          </div>
          <span className="text-xs text-slate-500">
            {ACHIEVEMENTS.filter(a => a.earned).length} of {ACHIEVEMENTS.length} earned
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-3">
          {[...ACHIEVEMENTS.filter(a => a.earned), ...ACHIEVEMENTS.filter(a => !a.earned)].map(a => (
            <AchievementBadge key={a.id} achievement={a} />
          ))}
        </div>
      </div>
    </div>
  )
}
