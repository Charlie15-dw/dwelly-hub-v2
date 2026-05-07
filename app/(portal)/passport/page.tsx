import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Award, CheckCircle2, Clock, AlertTriangle,
  Shield, ChevronRight, Trophy,
} from 'lucide-react'
import Badge from '@/components/ui/Badge'
import AchievementBadge from '@/components/ui/AchievementBadge'
import ExportPassportButton from '@/components/ui/ExportPassportButton'
import { ACHIEVEMENTS } from '@/lib/achievements-data'
import { SIGN_OFF_GATES, MODULES, ROLE_LABELS } from '@/lib/data'
import { createServerClient } from '@/lib/supabase/server'
import { formatDate, cn } from '@/lib/utils'

const ALL_ASSESSMENT_IDS = [
  'mnt-01', 'mnt-02', 'cmp-01', 'cmp-02', 'mnt-03', 'ins-02',
  'sys-01', 'mvt-02', 'sys-02', 'sup-02',
  'kno-01', 'kno-02', 'kno-03', 'full-assessment', 'master-assessment',
]
const TOTAL_ASSESSMENTS = ALL_ASSESSMENT_IDS.length // 15

export default async function PassportPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: profile }, { data: resultRows }] = await Promise.all([
    supabase.from('user_profiles').select('full_name, role, created_at').eq('id', user.id).maybeSingle(),
    supabase.from('assessment_results').select('assessment_id, score, passed').eq('user_id', user.id),
  ])

  const name = profile?.full_name ?? user.email ?? 'You'
  const role = (profile?.role as keyof typeof ROLE_LABELS) ?? 'property_manager'
  const startDate = profile?.created_at ?? user.created_at

  const passedIds = new Set(
    (resultRows ?? [])
      .filter(r => r.passed && ALL_ASSESSMENT_IDS.includes(r.assessment_id))
      .map(r => r.assessment_id)
  )
  const completedCount = passedIds.size
  const avgScore = (resultRows ?? []).length > 0
    ? Math.round((resultRows ?? []).reduce((s, r) => s + r.score, 0) / (resultRows ?? []).length)
    : null

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
              <h1 className="text-xl font-bold text-[#1D1D1F]">{name}</h1>
              <p className="text-sm mt-0.5" style={{ color: '#5AADA8' }}>{ROLE_LABELS[role] ?? 'Property Manager'}</p>
              <p className="text-xs mt-0.5" style={{ color: '#8ECFCC' }}>Programme start: {formatDate(startDate)}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <ExportPassportButton />
            <p className="text-xs" style={{ color: '#8ECFCC' }}>Date-stamped & auditable</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Assessments Passed',   value: completedCount,                              sub: `of ${TOTAL_ASSESSMENTS} total` },
            { label: 'Competencies Signed',   value: SIGN_OFF_GATES.filter(g => g.signedOff).length, sub: `${SIGN_OFF_GATES.filter(g => !g.signedOff).length} pending` },
            { label: 'Avg Assessment Score',  value: avgScore !== null ? `${avgScore}%` : '—',   sub: 'Pass threshold: 80%' },
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

        </div>

        {/* Right col */}
        <div className="space-y-5">

          {/* T&C Supervision */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy mb-1">T&amp;C Supervision</h3>
            <p className="text-xs text-slate-500 mb-3">90-day supervised period tracker</p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <p className="text-xs text-slate-500">Your manager will update your supervision status here.</p>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { label: 'Week 1 Observation', done: false },
                { label: 'Month 1 Review',     done: false },
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
          {ACHIEVEMENTS.map(a => (
            <AchievementBadge key={a.id} achievement={a} />
          ))}
        </div>
      </div>
    </div>
  )
}
