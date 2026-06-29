import { redirect } from 'next/navigation'
import { Clock, Target, BookOpen, TrendingUp, Award, BarChart3 } from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import SkillsRadar from '@/components/ui/SkillsRadar'
import { createServerClient } from '@/lib/supabase/server'

const ALL_ASSESSMENT_IDS = [
  'mnt-01', 'mnt-02', 'cmp-01', 'cmp-02', 'mnt-03', 'ins-02',
  'sys-01', 'mvt-02', 'sys-02', 'sup-02',
  'kno-01', 'kno-02', 'kno-03', 'full-assessment', 'master-assessment',
]
const TOTAL_ASSESSMENTS = ALL_ASSESSMENT_IDS.length // 15

// Map assessment IDs to readable labels and sections
const ASSESSMENT_META: Record<string, { label: string; section: string }> = {
  'mnt-01': { label: 'Maintenance 1/2 — Repair Requests',      section: 'Maintenance'  },
  'mnt-02': { label: 'Maintenance 2/2 — Actioning Tasks',       section: 'Maintenance'  },
  'cmp-02': { label: 'Compliance — Deposit Protection',         section: 'Compliance'   },
  'mvt-02': { label: 'Move-Outs — End of Tenancy',              section: 'Move-Outs'    },
  'ins-02': { label: 'Inspections — Mid-Term Reports',          section: 'Inspections'  },
  'sup-02': { label: 'Support — Tenant Relations',              section: 'Support'      },
  'kno-01': { label: 'Knowledge — Dwelly Best Practice',            section: 'Knowledge' },
  'kno-02': { label: 'Knowledge — Repairs & Legal Responsibilities', section: 'Knowledge' },
  'kno-03': { label: 'Knowledge — Property Finances & the Ledger',   section: 'Knowledge' },
  'full-assessment':   { label: 'Full Assessment — All Video Modules', section: 'Combined' },
  'master-assessment': { label: 'Master Assessment — All Sections',    section: 'Combined' },
}

function scoreColour(score: number) {
  if (score >= 80) return 'bg-green-500'
  if (score >= 65) return 'bg-orange'
  return 'bg-amber-400'
}
function scoreTextColour(score: number) {
  if (score >= 80) return 'text-green-700'
  if (score >= 65) return 'text-orange'
  return 'text-amber-600'
}

export default async function AnalyticsPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Fetch assessment results
  const { data: results } = await supabase
    .from('assessment_results')
    .select('assessment_id, score, passed, completed_at')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  const allResults = results ?? []

  // Count unique passed assessments (excluding recap rounds)
  const passedIds = new Set(
    allResults
      .filter(r => r.passed && ALL_ASSESSMENT_IDS.includes(r.assessment_id))
      .map(r => r.assessment_id)
  )
  const completedModules = passedIds.size
  const avgScore = allResults.length > 0
    ? Math.round(allResults.reduce((s, r) => s + r.score, 0) / allResults.length)
    : null

  // Most recent attempt per assessment (for history display)
  const seen = new Set<string>()
  const recentResults = allResults.filter(r => {
    if (seen.has(r.assessment_id)) return false
    seen.add(r.assessment_id)
    return true
  }).slice(0, 8)

  // Radar scores — average score per section
  const sectionScores: Record<string, number[]> = {
    Maintenance: [], Compliance: [], Inspections: [], 'Move-Outs': [], Support: [], Knowledge: [],
  }
  allResults.forEach(r => {
    const meta = ASSESSMENT_META[r.assessment_id]
    if (meta?.section && sectionScores[meta.section]) {
      sectionScores[meta.section].push(r.score)
    }
  })
  const radarScores = Object.entries(sectionScores).map(([label, scores]) => ({
    label,
    value: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    max: 100,
  }))

  const hasAnyData = allResults.length > 0 || completedModules > 0

  return (
    <div className="space-y-6 pb-12">

      {/* Hero */}
      <div className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-orange" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Personal</p>
            <h1 className="text-3xl font-bold text-navy tracking-tight">My Analytics</h1>
            <p className="text-slate-500 mt-1 text-sm leading-relaxed">
              Track your learning journey and identify areas for development.
            </p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Assessment Average"
          value={avgScore !== null ? `${avgScore}%` : '—'}
          icon={<Target className="w-5 h-5" />}
          accent="teal"
          sub="Passing threshold: 80%"
        />
        <StatCard
          label="Modules Completed"
          value={`${completedModules} / ${TOTAL_ASSESSMENTS}`}
          icon={<BookOpen className="w-5 h-5" />}
          accent="gold"
        />
        <StatCard
          label="Assessments Taken"
          value={allResults.length}
          icon={<Award className="w-5 h-5" />}
          accent="navy"
        />
      </div>

      {!hasAnyData ? (
        <div className="card p-10 text-center">
          <BarChart3 className="w-10 h-10 text-slate-300 mx-auto mb-3" aria-hidden />
          <p className="text-sm font-semibold text-slate-500">No data yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Complete a module assessment to start tracking your progress here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — spans 2 */}
          <div className="lg:col-span-2 space-y-6">

            {/* Skills Radar */}
            <div className="card p-5">
              <div className="flex items-start justify-between gap-4 mb-1">
                <div>
                  <h2 className="text-sm font-bold text-navy">Skills Overview</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Average assessment score per training area.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange/20 border border-orange/40" />
                  <span className="text-[11px] text-slate-400">Your score</span>
                </div>
              </div>
              <SkillsRadar scores={radarScores} />
            </div>

            {/* Assessment Score History */}
            {recentResults.length > 0 && (
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-orange" aria-hidden />
                  <h2 className="text-sm font-bold text-navy">Assessment Score History</h2>
                </div>
                <p className="text-xs text-slate-500 mb-5">Most recent attempt per assessment</p>
                <div className="space-y-4">
                  {recentResults.map((r) => {
                    const meta = ASSESSMENT_META[r.assessment_id]
                    const label = meta?.label ?? r.assessment_id
                    return (
                      <div key={r.assessment_id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-navy truncate max-w-[75%]">{label}</span>
                          <span className={`text-xs font-bold tabular-nums ${scoreTextColour(r.score)}`}>
                            {r.score}%
                          </span>
                        </div>
                        <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${scoreColour(r.score)}`}
                            style={{ width: `${r.score}%` }}
                            role="progressbar"
                            aria-valuenow={r.score}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    <span className="text-[11px] text-slate-500">80%+ Pass</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange" />
                    <span className="text-[11px] text-slate-500">65–79% Near pass</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="text-[11px] text-slate-500">Below 65%</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-5">

            {/* Score breakdown */}
            <div className="card p-5">
              <h2 className="text-sm font-bold text-navy mb-4">Score Breakdown</h2>
              <div className="space-y-3">
                {[
                  { label: 'Passed', count: allResults.filter(r => r.passed).length, color: 'bg-green-500' },
                  { label: 'Failed', count: allResults.filter(r => !r.passed).length, color: 'bg-red-400' },
                ].map(({ label, count, color }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      <span className="text-xs text-slate-600">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-navy tabular-nums">{count}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Pass rate</span>
                  <span className="text-sm font-bold text-navy tabular-nums">
                    {allResults.length > 0
                      ? `${Math.round((allResults.filter(r => r.passed).length / allResults.length) * 100)}%`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Module progress */}
            <div className="card p-5">
              <h2 className="text-sm font-bold text-navy mb-4">Module Progress</h2>
              <div className="text-center py-2">
                <p className="text-3xl font-black text-navy tabular-nums">{completedModules}</p>
                <p className="text-xs text-slate-500 mt-1">of {TOTAL_ASSESSMENTS} modules completed</p>
              </div>
              <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal rounded-full transition-all"
                  style={{ width: `${TOTAL_ASSESSMENTS > 0 ? Math.round((completedModules / TOTAL_ASSESSMENTS) * 100) : 0}%` }}
                />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
