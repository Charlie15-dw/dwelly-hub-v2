import Link from 'next/link'
import {
  ArrowRight, BookOpen, Clock, Award,
  TrendingUp, CheckCircle2, ChevronRight, Play, AlertTriangle,
} from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import StatCard from '@/components/ui/StatCard'
import QuickActions from '@/components/ui/QuickActions'
import {
  CURRENT_USER, MODULES, SIGN_OFF_GATES,
  ROLE_LABELS, SECTION_LABELS,
} from '@/lib/data'
import { cn } from '@/lib/utils'

const inProgressModules = MODULES.filter(m => !m.completed && m.progress > 0 && !m.locked)
const upcomingModules   = MODULES.filter(m => !m.completed && m.progress === 0 && !m.locked).slice(0, 4)
const pendingSignOffs   = SIGN_OFF_GATES.filter(g => !g.signedOff).slice(0, 3)

export default function DashboardPage() {
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
              <p className="text-sm mb-1" style={{ color: '#3A9E98' }}>Welcome back,</p>
              <h2 className="text-2xl font-bold text-[#1D1D1F]">{CURRENT_USER.name.split(' ')[0]}</h2>
              <p className="text-sm mt-1" style={{ color: '#5AADA8' }}>{ROLE_LABELS[CURRENT_USER.role]}</p>
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
                { label: 'Learning Profile',   href: '/pre-training', done: true               },
                { label: 'Training Guide',      href: '/training',     done: true               },
                { label: 'Video Modules',       href: '/modules',      done: false, active: true },
                { label: 'Knowledge Base',      href: '/knowledge',    done: false               },
                { label: 'Assessments',         href: '/assessments',  done: false               },
                { label: 'Competency Passport', href: '/passport',     done: false               },
              ].map((item, i) => (
                <div key={item.href} className="flex items-center gap-2">
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all',
                      item.done   && 'bg-white text-teal border-teal/20 shadow-sm hover:shadow',
                      item.active && 'bg-white text-orange border-orange/25 shadow-sm hover:shadow',
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
                <span className="text-sm font-bold text-[#1D1D1F]">{CURRENT_USER.overallProgress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#C8EDEA' }}>
                <div className="h-full bg-orange rounded-full transition-all duration-700" style={{ width: `${CURRENT_USER.overallProgress}%` }} />
              </div>
              <p className="text-xs mt-1 text-[#1D1D1F]/60">
                {CURRENT_USER.modulesCompleted}/{CURRENT_USER.modulesTotal} modules completed
              </p>
            </div>
            <Link href="/modules" className="btn-primary text-sm whitespace-nowrap flex-shrink-0">
              Continue Learning
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Modules Completed"
          value={CURRENT_USER.modulesCompleted}
          sub={`of ${CURRENT_USER.modulesTotal} total`}
          icon={<BookOpen className="w-5 h-5" />}
          accent="orange"
          trend={{ value: '2 this week', positive: true }}
        />
        <StatCard
          label="Avg Assessment Score"
          value={`${CURRENT_USER.assessmentScore}%`}
          sub="Passing threshold: 80%"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="teal"
          trend={{ value: '+4% vs last month', positive: true }}
        />
        <StatCard
          label="CPD Hours Logged"
          value={CURRENT_USER.cpdHours}
          sub={`Target: ${CURRENT_USER.cpdTarget} hours / year`}
          icon={<Clock className="w-5 h-5" />}
          accent="gold"
        />
        <StatCard
          label="Competencies Signed Off"
          value={CURRENT_USER.competenciesSignedOff.length}
          sub={`${CURRENT_USER.pendingSignOffs.length} pending approval`}
          icon={<Award className="w-5 h-5" />}
          accent="navy"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — continue + up next */}
        <div className="lg:col-span-2 space-y-6">

          {/* Continue Learning */}
          {inProgressModules.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-navy">Continue Learning</h3>
                <Link href="/modules" className="text-xs text-teal hover:text-teal-600 font-medium flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {inProgressModules.map(module => (
                  <Link
                    key={module.id}
                    href={`/modules/${module.id}`}
                    className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-orange/30 hover:bg-orange/3 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange/20 transition-colors">
                      <Play className="w-4 h-4 text-orange" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-navy truncate">{module.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">{SECTION_LABELS[module.section]}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-500">{module.duration}</span>
                      </div>
                      <ProgressBar value={module.progress} className="mt-2" />
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-sm font-bold text-orange">{module.progress}%</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Progress</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Up Next */}
          {upcomingModules.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-navy">Up Next</h3>
                <Link href="/modules" className="text-xs text-teal hover:text-teal-600 font-medium flex items-center gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-2">
                {upcomingModules.map(module => (
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
        </div>

        {/* Right — sign-offs + competency */}
        <div className="space-y-5">

          {/* Pending Sign-Offs */}
          {pendingSignOffs.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-500" aria-hidden />
                <h3 className="text-sm font-bold text-navy">Pending Sign-Offs</h3>
              </div>
              <div className="space-y-2.5">
                {pendingSignOffs.map(gate => (
                  <div key={gate.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                    <div className={cn(
                      'w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                      gate.risk === 'high' ? 'bg-red-500' : 'bg-amber-400',
                    )} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-navy">{gate.area}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {gate.description.substring(0, 60)}…
                      </p>
                      {gate.risk === 'high' && (
                        <span className="inline-block mt-1 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                          High Risk Area
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/passport" className="btn-outline w-full mt-3 text-xs">
                View Competency Passport
              </Link>
            </div>
          )}

          {/* Competency summary */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy mb-4">Competency Summary</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Signed off</span>
                  <span className="font-semibold text-navy">{CURRENT_USER.competenciesSignedOff.length}</span>
                </div>
                <ProgressBar
                  value={CURRENT_USER.competenciesSignedOff.length}
                  max={CURRENT_USER.competenciesSignedOff.length + CURRENT_USER.pendingSignOffs.length}
                  color="teal"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">CPD Hours</span>
                  <span className="font-semibold text-navy">{CURRENT_USER.cpdHours} / {CURRENT_USER.cpdTarget}</span>
                </div>
                <ProgressBar value={CURRENT_USER.cpdHours} max={CURRENT_USER.cpdTarget} color="orange" />
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
