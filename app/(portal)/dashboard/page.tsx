import Link from 'next/link'
import {
  ArrowRight, BookOpen, Award,
  TrendingUp, CheckCircle2, ChevronRight,
} from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import StatCard from '@/components/ui/StatCard'
import QuickActions from '@/components/ui/QuickActions'
import WelcomeGreeting from '@/components/ui/WelcomeGreeting'
import { MODULES, ROLE_LABELS, CURRENT_USER } from '@/lib/data'
import { cn } from '@/lib/utils'
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
  const overallPct = Math.round((completedCount / totalModules) * 100)

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

  const hasLearningProfile = !!learningProfile
  const hasStartedModules = completedCount > 0
  const hasAssessmentResult = (resultRows ?? []).length > 0

  return (
    <div className="space-y-6">

      {/* Welcome banner — navy hero, matching the Hub */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-orange/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-orange-400/10 blur-3xl" aria-hidden />

        <div className="relative p-6 sm:p-8">
          <WelcomeGreeting fallbackRole={ROLE_LABELS[CURRENT_USER.role]} tone="light" />

          {/* Learning order pills */}
          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3 text-white/50">
              Your Journey
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Learning Profile',   href: '/pre-training', done: hasLearningProfile,    active: !hasLearningProfile },
                { label: 'Training Guide',      href: '/training',     done: false,                 active: hasLearningProfile && !hasStartedModules },
                { label: 'Video Modules',       href: '/modules',      done: upNextModules.length === 0 && completedModuleIds.size > 0, active: hasLearningProfile && hasStartedModules && upNextModules.length > 0 },
                { label: 'Knowledge Base',      href: '/knowledge',    done: false,                 active: false },
                { label: 'Assessments',         href: '/assessments',  done: false,                 active: hasAssessmentResult },
                { label: 'Competency Passport', href: '/passport',     done: false,                 active: false },
              ].map((item, i) => (
                <div key={item.href} className="flex items-center gap-2">
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                      item.done   && 'bg-white/15 text-white border-white/25 hover:bg-white/20',
                      item.active && !item.done && 'bg-orange text-white border-orange shadow-sm hover:brightness-110',
                      !item.done && !item.active && 'bg-white/5 text-white/55 border-white/10 hover:bg-white/10',
                    )}
                  >
                    {item.done && <CheckCircle2 className="w-3 h-3 flex-shrink-0" aria-hidden />}
                    {String(i + 1)}. {item.label}
                  </Link>
                  {i < 5 && <ChevronRight className="w-3 h-3 flex-shrink-0 text-white/25" aria-hidden />}
                </div>
              ))}
            </div>
          </div>

          {/* Overall progress */}
          <div className="mt-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-5 py-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-48">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-white/70">Overall Progress</span>
                <span className="text-sm font-bold text-white">{overallPct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden bg-white/15">
                <div className="h-full bg-orange rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
              </div>
              <p className="text-xs mt-1 text-white/60">
                {completedCount}/{totalModules} assessments completed
              </p>
            </div>
            <Link
              href={hasLearningProfile ? '/modules' : '/pre-training'}
              className="btn-primary text-sm whitespace-nowrap flex-shrink-0"
            >
              {completedCount > 0 ? 'Continue Learning' : 'Start Learning'}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — up next */}
        <div className="lg:col-span-2 space-y-6">

          {/* Up Next */}
          {upNextModules.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-navy">Modules Up Next</h3>
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

        {/* Right — competency */}
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy mb-4">Competency Summary</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Assessments done</span>
                  <span className="font-semibold text-navy">{completedCount} / {totalModules}</span>
                </div>
                <ProgressBar value={completedCount} max={totalModules} color="teal" />
              </div>
            </div>
            <Link href="/passport" className="btn-outline w-full mt-4 text-xs">
              View Full Passport
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
