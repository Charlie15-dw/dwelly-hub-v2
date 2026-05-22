import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Award, Clock,
  Shield, Trophy,
} from 'lucide-react'
import AchievementBadge from '@/components/ui/AchievementBadge'
import ExportPassportButton from '@/components/ui/ExportPassportButton'
import { computeAchievements } from '@/lib/achievements-data'
import { ROLE_LABELS } from '@/lib/data'
import { createServerClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

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

  const achievements = computeAchievements(resultRows ?? [])

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
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 gap-4">
          {[
            { label: 'Assessments Passed',  value: completedCount,                            sub: `of ${TOTAL_ASSESSMENTS} total` },
            { label: 'Avg Assessment Score', value: avgScore !== null ? `${avgScore}%` : '—', sub: 'Pass threshold: 80%' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="rounded-xl p-4 shadow-sm" style={{ backgroundColor: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.85)' }}>
              <p className="text-xl font-black text-[#1D1D1F] tabular-nums">{value}</p>
              <p className="text-xs mt-0.5" style={{ color: '#5AADA8' }}>{label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8ECFCC' }}>{sub}</p>
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

      {/* Achievement Badges */}
      <div id="achievements" className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange" aria-hidden />
            <h3 className="text-sm font-bold text-navy">Achievement Badges</h3>
          </div>
          <span className="text-xs text-slate-500">
            {achievements.filter(a => a.earned).length} of {achievements.length} earned
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-5 gap-3">
          {achievements.map(a => (
            <AchievementBadge key={a.id} achievement={a} />
          ))}
        </div>
      </div>
    </div>
  )
}
