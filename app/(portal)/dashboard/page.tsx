import Link from 'next/link'
import {
  ArrowRight, BookOpen, Clock, Award,
  TrendingUp, CheckCircle2, ChevronRight,
} from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import StatCard from '@/components/ui/StatCard'
import QuickActions from '@/components/ui/QuickActions'
import WelcomeGreeting from '@/components/ui/WelcomeGreeting'
import { MODULES, SECTION_LABELS, ROLE_LABELS, CURRENT_USER } from '@/lib/data'
import { cn } from '@/lib/utils'
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // Fetch real progress and scores
  const [{ data: progressRows }, { data: resultRows }, { data: learningProfile }] = await Promise.all([
    supabase.from('module_progress').select('module_id, completed').eq('user_id', user.id),
    supabase.from('assessment_results').select('score, passed').eq('user_id', user.id),
    supabase.from('learning_profiles').select('completed_at').eq('user_id', user.id).maybeSingle(),
  ])

  const completedModuleIds = new Set(
    (progressRows ?? []).filter(r => r.completed).map(r => r.module_id)
  )
  const unlockedModules = MODULES.filter(m => !m.locked)
  const completedCount = unlockedModules.filter(m => completedModuleIds.has(m.id)).length
  const totalModules = unlockedModules.length
  const overallPct = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

  const moduleResults = (resultRows ?? []).filter(r =>
    !['full-assessment', 'master-assessment'].includes(r.score?.toString() ?? '') // keep all
  )
  const avgScore = moduleResults.length > 0
    ? Math.round(moduleResults.reduce((s, r) => s + r.score, 0) / moduleResults.length)
    : null

  // Next modules to complete — first 4 unlocked that haven't been completed yet
  const upNextModules = unlockedModules
    .filter(m => !completedModuleIds.has(m.id))
    .slice(0, 4)

  // Journey pill states based on real data
  const hasLearningProfile = !!learningProfile
  const hasStartedModules = completedCount > 0
  const hasAssessmentResult = moduleResults.length > 0

  return (
    <div className="space-y-6">

      {/* Welcome banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ backgroundColor: '#E0F7F4' }}>
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/60 rounded-r-2xl" />
        <div className="absolute right-8 top-3 w-28 h-28 rounded-full bg-white/50" />
        <div className="absolute right-20 bottom-1 w-16 h-16 rounded-full bg-white/40" />

        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <WelcomeGreeting fallbackRole={ROLE_LABELS[CURRENT_USER.role]} />
            </div>
            <div className="flex items-center gap-2 bg-white/70 border border-white rounded-xl px-4 py-2 shadow-sm backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-teal" aria-hidden />
              <span className="text-sm font-semibold text-[#1D1D1F]">Active Programme</span>
            </div>
          </div>

          {/* Learning order pills */}
          <div className="mt-5 pt-5 border-t border-white/50">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#5AADA8' }}>
              Your Journey
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Learning Profile',   href: '/pre-training', done: hasLearningProfile,    active: !hasLearningProfile },
                { label: 'Training Guide',      href: '/training',     done: false,                 active: hasLearningProfile && !hasStartedModules },
                { label: 'Video Modules',       href: '/modules',      done: completedCount === totalModules && totalModules > 0, active: hasLearningProfile && hasStartedModules && completedCount < totalModules },
                { label: 'Knowledge Base',      href: '/knowledge',    done: false,                 active: false },
                { label: 'Assessments',         href: '/assessments',  done: false,                 active: hasAssessmentResult },
                { label: 'Competency Passport', href: '/passport',     done: false,                 active: false },
              ].map((item, i) => (
                <div key={item.href} className="flex items-center gap-2">
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                      item.done   && 'bg-white text-teal border-teal/20 shadow-sm hover:shadow',
                      item.active && !item.done && 'bg-white text-orange border-orange/25 shadow-sm hover:shadow',
                      !item.done && !item.active && 'bg-white/40 text-[#5AADA8] border-white/60 hover:bg-white/70',
                    )}
                  >
                    {item.done && <CheckCircle2 className="w-3 h-3 flex-shrink-0" aria-hidden />}
                    {String(i + 1)}. {item.label}
                  </Link>
                  {i < 5 && <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#8ECFCC' }} aria-hidden />}
                </div>
              ))}
            </div>
          </div>

          {/* Overall progress */}
          <div className="mt-4 bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl px-5 py-4 flex items-center gap-4 flex-wrap shadow-sm">
            <div className="flex-1 min-w-48">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-[#6E6E73]">Overall Progress</span>
                <span className="text-sm font-bold text-[#1D1D1F]">{overallPct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#C8EDEA' }}>
                <div className="h-full bg-orange rounded-full transition-all duration-700" style={{ width: `${overallPct}%` }} />
              </div>
              <p className="text-xs mt-1 text-[#1D1D1F]/60">
                {completedCount}/{totalModules} modules completed
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
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Modules Completed"
          value={completedCount}
          sub={`of ${totalModules} total`}
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
          label="CPD Hours Logged"
          value={0}
          sub="Target: 20 hours / year"
          icon={<Clock className="w-5 h-5" />}
          accent="gold"
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

        {/* Right — competency */}
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy mb-4">Competency Summary</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Modules done</span>
                  <span className="font-semibold text-navy">{completedCount} / {totalModules}</span>
                </div>
                <ProgressBar value={completedCount} max={totalModules} color="teal" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">CPD Hours</span>
                  <span className="font-semibold text-navy">0 / 20</span>
                </div>
                <ProgressBar value={0} max={20} color="orange" />
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
