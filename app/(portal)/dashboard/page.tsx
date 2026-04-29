import Link from 'next/link'
import {
  ArrowRight, BookOpen, Award,
  TrendingUp, CheckCircle2, ChevronRight,
} from 'lucide-react'
import StatCard from '@/components/ui/StatCard'
import QuickActions from '@/components/ui/QuickActions'
import { MODULES } from '@/lib/data'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

const ALL_ASSESSMENT_IDS = [
  'mnt-01', 'mnt-02', 'cmp-01', 'cmp-02', 'mnt-03', 'ins-02',
  'sys-01', 'mvt-02', 'sys-02', 'sup-02',
  'kno-01', 'kno-02', 'kno-03', 'full-assessment', 'master-assessment',
]
const TOTAL_ASSESSMENTS = ALL_ASSESSMENT_IDS.length // 15

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Fetch assessment results, module progress (for Up Next), and learning profile
  const [{ data: resultRows }, { data: progressRows }, { data: learningProfile }] = await Promise.all([
    supabase.from('assessment_results').select('assessment_id, score, passed').eq('user_id', user.id),
    supabase.from('module_progress').select('module_id, completed').eq('user_id', user.id),
    supabase.from('learning_profiles').select('completed_at').eq('user_id', user.id).maybeSingle(),
  ])

  // Count unique passed assessments from the canonical 15
  const passedIds = new Set(
    (resultRows ?? [])
      .filter(r => r.passed && ALL_ASSESSMENT_IDS.includes(r.assessment_id))
      .map(r => r.assessment_id)
  )
  const completedCount = passedIds.size
  const totalModules = TOTAL_ASSESSMENTS
  const avgScore = (resultRows ?? []).length > 0
    ? Math.round((resultRows ?? []).reduce((s, r) => s + r.score, 0) / (resultRows ?? []).length)
    : null

  // Up Next — video modules not yet completed in module_progress
  const completedModuleIds = new Set(
    (progressRows ?? []).filter(r => r.completed).map(r => r.module_id)
  )
  const upNextModules = MODULES
    .filter(m => !completedModuleIds.has(m.id))
    .slice(0, 4)


  return (
    <div className="space-y-6">

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Modules Completed"
          value={completedCount}
          sub={`of ${totalModules} assessments`}
          icon={<BookOpen className="w-5 h-5" />}
          accent="orange"
        />
        <StatCard
          label="Avg Assessment Score"
          value={avgScore !== null ? `${avgScore}%` : '—'}
          sub="Passing threshold: 80%"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="teal"
        />
        <StatCard
          label="Competencies Signed Off"
          value={0}
          sub="0 pending approval"
          icon={<Award className="w-5 h-5" />}
          accent="navy"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main content */}
      <div className="space-y-6">

          {/* Up Next */}
          {upNextModules.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-navy">Up Next</h3>
                <Link href="/modules" className="text-xs text-teal hover:text-teal-600 font-medium flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {upNextModules.map(module => (
                  <Link
                    key={module.id}
                    href={`/modules/${module.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-[#0071E3]/20 hover:bg-[#0071E3]/3 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0 group-hover:bg-navy/10 transition-colors">
                      <BookOpen className="w-3.5 h-3.5 text-navy" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{module.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{module.duration} · {module.videoLength} video</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0071E3] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All done */}
          {upNextModules.length === 0 && completedCount > 0 && (
            <div className="card p-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-teal mx-auto mb-3" />
              <p className="text-sm font-bold text-navy mb-1">All modules completed!</p>
              <p className="text-xs text-slate-500 mb-4">Head to Assessments to test your knowledge.</p>
              <Link href="/assessments" className="btn-primary text-sm inline-flex">
                Go to Assessments <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
      </div>
    </div>
  )
}
