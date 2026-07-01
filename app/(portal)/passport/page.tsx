import { redirect } from 'next/navigation'
import {
  Award, Clock, Shield, Trophy, CheckCircle2, Circle, MinusCircle,
  BadgeCheck, Target, Layers, ClipboardList, UserCheck,
} from 'lucide-react'
import AchievementBadge from '@/components/ui/AchievementBadge'
import ExportPassportButton from '@/components/ui/ExportPassportButton'
import ProgressRing from '@/components/ui/ProgressRing'
import SkillsRadar from '@/components/ui/SkillsRadar'
import { computeAchievements } from '@/lib/achievements-data'
import { ROLE_LABELS } from '@/lib/data'
import { createServerClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import {
  PASSPORT_ASSESSMENTS,
  PASSPORT_MILESTONES,
  SECTION_ORDER,
  PASS_MARK,
  computeSectionCompetency,
  buildAssessmentRecord,
  computeSummary,
  certificationStatus,
  type ResultRow,
  type PassportSection,
} from '@/lib/passport'

// Icon per competency area (keys match PassportSection).
const SECTION_ICON: Record<PassportSection, typeof Layers> = {
  Maintenance: Layers,
  Compliance: Shield,
  Inspections: ClipboardList,
  'Move-Outs': UserCheck,
  Support: Target,
  Knowledge: BadgeCheck,
}

// Certification pill styling per status.
const CERT_PILL: Record<string, { label: string; bg: string; color: string }> = {
  certified:     { label: 'Certified',      bg: 'rgba(52,211,153,0.18)',  color: '#6EE7B7' },
  'recert-due':  { label: 'Re-cert Due',    bg: 'rgba(251,191,36,0.18)',  color: '#FCD34D' },
  'in-training': { label: 'In Training',    bg: 'rgba(0,113,227,0.20)',   color: '#7CC0FF' },
  'not-started': { label: 'Not Started',    bg: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)' },
}

// The 90-day supervised period checkpoints. There is no data source for these
// yet, so they are shown honestly as pending manager sign-off — never faked.
const TC_CHECKPOINTS = [
  { label: 'Week 1 · Observation',  note: 'Shadowing & first supervised tasks' },
  { label: 'Month 1 · Review',       note: 'Progress check with line manager' },
  { label: 'Month 2 · Review',       note: 'Independent task competency check' },
  { label: 'Month 3 · Sign-Off',     note: 'Final supervised-period sign-off' },
]

function scoreColor(score: number | null): string {
  if (score === null) return '#8E8E93'
  if (score >= PASS_MARK) return '#059669'
  if (score >= 65) return '#D97706'
  return '#DC2626'
}

export default async function PassportPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const [{ data: profile }, { data: resultRows }] = await Promise.all([
    supabase.from('user_profiles').select('full_name, role, created_at').eq('id', user.id).maybeSingle(),
    supabase.from('assessment_results').select('assessment_id, score, passed, completed_at').eq('user_id', user.id),
  ])

  const name = profile?.full_name ?? user.email ?? 'You'
  const role = (profile?.role as keyof typeof ROLE_LABELS) ?? 'property_manager'
  const startDate = profile?.created_at ?? user.created_at

  const results: ResultRow[] = (resultRows ?? []) as ResultRow[]

  // Re-certification: 1 year from account creation.
  const startDateObj = new Date(startDate)
  const recertDate = new Date(startDateObj)
  recertDate.setFullYear(recertDate.getFullYear() + 1)
  const today = new Date()
  const daysUntilRecert = Math.ceil((recertDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const recertLabel = recertDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  // Derived competency data (pure, tested — see lib/passport.ts).
  const summary = computeSummary(results)
  const sections = computeSectionCompetency(results)
  const record = buildAssessmentRecord(results)
  const certStatus = certificationStatus(summary, daysUntilRecert)
  const achievements = computeAchievements(results, user.id)
  const earnedBadges = achievements.filter(a => a.earned).length

  const pill = CERT_PILL[certStatus]

  // Radar: one axis per competency area, using latest-attempt average score.
  const radarScores = sections.map(s => ({
    label: s.section,
    value: s.avgScore ?? 0,
    max: 100,
  }))

  const monogram = name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()

  const coreRecord = record.filter(r => r.section !== 'Milestone')
  const milestoneRecord = record.filter(r => r.section === 'Milestone')

  return (
    <div className="space-y-6">
      {/* ── Premium credential hero ─────────────────────────────── */}
      <div className="rounded-3xl p-6 sm:p-8 relative overflow-hidden bg-navy text-white shadow-lg">
        {/* Glow accents */}
        <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full blur-3xl" style={{ background: 'rgba(0,113,227,0.35)' }} />
        <div className="absolute -left-10 bottom-0 w-56 h-56 rounded-full blur-3xl" style={{ background: 'rgba(110,207,204,0.22)' }} />
        {/* Gold hairline top accent */}
        <div className="absolute inset-x-0 top-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-4 h-4" style={{ color: '#C9A84C' }} aria-hidden />
              <p className="text-xs uppercase tracking-[0.18em] font-semibold" style={{ color: '#C9A84C' }}>
                Competency Passport
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-xl font-black"
                style={{ background: 'linear-gradient(135deg, #0071E3, #6ECFCC)', color: '#fff' }}
              >
                {monogram}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold leading-tight truncate text-white">{name}</h1>
                <p className="text-sm text-white/70 mt-0.5">{ROLE_LABELS[role] ?? 'Property Manager'}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: pill.bg, color: pill.color }}
              >
                <BadgeCheck className="w-3.5 h-3.5" aria-hidden />
                {pill.label}
              </span>
              <span className="text-xs text-white/50">Programme start · {formatDate(startDate)}</span>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <ExportPassportButton />
              <span className="inline-flex items-center gap-1.5 text-xs text-white/40">
                <Shield className="w-3 h-3" aria-hidden />
                Date-stamped &amp; auditable
              </span>
            </div>
          </div>

          {/* Overall completion ring */}
          <div className="flex flex-col items-center gap-2 lg:pr-4">
            <ProgressRing
              value={summary.progressPct}
              size={160}
              stroke={13}
              color="#6ECFCC"
              caption="Complete"
            />
            <p className="text-xs text-white/60">
              {summary.passedCount} of {summary.totalCount} assessments passed
            </p>
          </div>
        </div>
      </div>

      {/* ── Stat strip ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: CheckCircle2, label: 'Assessments Passed', value: `${summary.passedCount}/${summary.totalCount}`, sub: `${summary.progressPct}% of programme` },
          { icon: Target,       label: 'Average Score',       value: summary.avgScore !== null ? `${summary.avgScore}%` : '—', sub: `Pass threshold ${PASS_MARK}%` },
          { icon: Trophy,       label: 'Badges Earned',        value: `${earnedBadges}/${achievements.length}`, sub: 'Achievements unlocked' },
          { icon: BadgeCheck,   label: 'Pass Rate',            value: summary.passRate !== null ? `${summary.passRate}%` : '—', sub: 'Across all attempts' },
        ].map(({ icon: Icon, label, value, sub }) => (
          <div key={label} className="card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-orange" aria-hidden />
              <p className="text-xs font-semibold text-slate-500">{label}</p>
            </div>
            <p className="text-2xl font-black text-navy tabular-nums leading-none">{value}</p>
            <p className="text-[11px] text-slate-400 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Competency by area ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillsRadar scores={radarScores} />

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-orange" aria-hidden />
            <h3 className="text-sm font-bold text-navy">Competency by Area</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4">Progress across the six core competency areas</p>

          <div className="space-y-3">
            {SECTION_ORDER.map(sectionName => {
              const s = sections.find(x => x.section === sectionName)!
              const Icon = SECTION_ICON[sectionName]
              const statusMeta =
                s.status === 'proficient' ? { label: 'Proficient', color: '#059669' }
                : s.status === 'developing' ? { label: 'Developing', color: '#D97706' }
                : { label: 'Not started', color: '#8E8E93' }
              const pct = Math.round((s.passed / s.total) * 100)
              return (
                <div key={sectionName} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden />
                      <span className="text-sm font-semibold text-navy truncate">{sectionName}</span>
                    </div>
                    <span
                      className="text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `${statusMeta.color}1A`, color: statusMeta.color }}
                    >
                      {statusMeta.label}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: statusMeta.color }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[11px] text-slate-500">{s.passed}/{s.total} passed</span>
                    <span className="text-[11px] font-semibold" style={{ color: scoreColor(s.avgScore) }}>
                      {s.avgScore !== null ? `${s.avgScore}% avg` : 'No attempts'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Full assessment record ──────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList className="w-4 h-4 text-orange" aria-hidden />
          <h3 className="text-sm font-bold text-navy">Assessment Record</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Every programme assessment · latest attempt</p>

        <div className="space-y-4">
          {SECTION_ORDER.map(sectionName => {
            const items = coreRecord.filter(r => r.section === sectionName)
            if (items.length === 0) return null
            return (
              <div key={sectionName}>
                <p className="text-[11px] uppercase tracking-wide font-bold text-slate-400 mb-1.5">{sectionName}</p>
                <div className="space-y-1">
                  {items.map(r => (
                    <AssessmentRow key={r.id} label={PASSPORT_ASSESSMENTS.find(a => a.id === r.id)?.label ?? r.label} attempted={r.attempted} passed={r.passed} score={r.score} completedAt={r.completedAt} />
                  ))}
                </div>
              </div>
            )
          })}

          {milestoneRecord.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide font-bold text-slate-400 mb-1.5">Milestone</p>
              <div className="space-y-1">
                {milestoneRecord.map(r => (
                  <AssessmentRow key={r.id} label={PASSPORT_MILESTONES.find(m => m.id === r.id)?.label ?? r.label} attempted={r.attempted} passed={r.passed} score={r.score} completedAt={r.completedAt} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── 90-day T&C supervision ──────────────────────────────── */}
      <div className="card p-5">
        <div className="flex items-center gap-2 mb-1">
          <UserCheck className="w-4 h-4 text-orange" aria-hidden />
          <h3 className="text-sm font-bold text-navy">90-Day Supervised Period</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Terms &amp; conditions supervision — signed off by your line manager</p>

        <ol className="relative border-l border-slate-200 ml-2 space-y-4">
          {TC_CHECKPOINTS.map(cp => (
            <li key={cp.label} className="ml-4">
              <span className="absolute -left-[7px] w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300" aria-hidden />
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <p className="text-sm font-semibold text-navy">{cp.label}</p>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  Pending manager sign-off
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{cp.note}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* ── Annual re-certification ─────────────────────────────── */}
      <div className="card p-5 border-l-4 border-l-orange">
        <div className="flex items-start gap-2.5">
          <Shield className="w-4 h-4 text-orange mt-0.5 flex-shrink-0" aria-hidden />
          <div>
            <h3 className="text-sm font-bold text-navy">Annual Re-Certification</h3>
            <p className="text-xs text-slate-500 mt-0.5">{recertLabel}</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Compliance-critical re-certification covering deposit protection, gas safety, and tenancy legislation.
            </p>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3 h-3" aria-hidden />
              <span>{daysUntilRecert > 0 ? `${daysUntilRecert} days until re-certification` : 'Re-certification due'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Achievement badges ──────────────────────────────────── */}
      <div id="achievements" className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange" aria-hidden />
            <h3 className="text-sm font-bold text-navy">Achievement Badges</h3>
          </div>
          <span className="text-xs text-slate-500">
            {earnedBadges} of {achievements.length} earned
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

function AssessmentRow({
  label, attempted, passed, score, completedAt,
}: {
  label: string
  attempted: boolean
  passed: boolean
  score: number | null
  completedAt: string | null
}) {
  const StatusIcon = !attempted ? MinusCircle : passed ? CheckCircle2 : Circle
  const statusColor = !attempted ? '#C7C7CC' : passed ? '#059669' : '#DC2626'
  return (
    <div className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-lg hover:bg-slate-50">
      <div className="flex items-center gap-2 min-w-0">
        <StatusIcon className="w-4 h-4 flex-shrink-0" style={{ color: statusColor }} aria-hidden />
        <span className="text-sm text-navy truncate">{label}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {completedAt && <span className="text-[11px] text-slate-400 hidden sm:inline">{formatDate(completedAt)}</span>}
        <span className="text-sm font-bold tabular-nums w-12 text-right" style={{ color: scoreColor(score) }}>
          {score !== null ? `${score}%` : '—'}
        </span>
      </div>
    </div>
  )
}
