import Link from 'next/link'
import {
  ArrowRight, BookOpen, Clock, Award, AlertTriangle,
  TrendingUp, CheckCircle2, Bell, ChevronRight, Play, Trophy,
} from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import QuickActions from '@/components/ui/QuickActions'
import LearningStreak from '@/components/ui/LearningStreak'
import AchievementBadge from '@/components/ui/AchievementBadge'
import { ACHIEVEMENTS } from '@/lib/achievements-data'
import {
  CURRENT_USER, MODULES, CPD_ENTRIES, SIGN_OFF_GATES,
  ROLE_LABELS, SECTION_LABELS,
} from '@/lib/data'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const inProgressModules = MODULES.filter(m => !m.completed && m.progress > 0 && !m.locked)
const upcomingModules = MODULES.filter(m => !m.completed && m.progress === 0 && !m.locked).slice(0, 3)
const completedModules = MODULES.filter(m => m.completed)
const dueSpacedRep = MODULES.filter(m => m.spacedRepetitionDue).slice(0, 2)
const pendingSignOffs = SIGN_OFF_GATES.filter(g => !g.signedOff).slice(0, 3)

// Forgetting curve data
const RETENTION_SCHEDULE = [
  { label: 'Day 1',    pct: 58,  done: true,  action: 'Micro quiz completed' },
  { label: 'Day 3',    pct: 35,  done: true,  action: 'Dobby recall prompt completed' },
  { label: 'Week 1',   pct: 20,  done: false, action: 'Knowledge check due' },
  { label: 'Month 1',  pct: 10,  done: false, action: 'Scenario review pending' },
  { label: 'Quarter',  pct: 5,   done: false, action: 'Quarterly refresher' },
]

export default function DashboardPage() {

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ backgroundColor: '#E0F7F4' }}>
        {/* Decorative white pops */}
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/60 rounded-r-2xl" />
        <div className="absolute right-8 top-3 w-28 h-28 rounded-full bg-white/50" />
        <div className="absolute right-20 bottom-1 w-16 h-16 rounded-full bg-white/40" />
        <div className="absolute left-1/2 top-0 w-48 h-12 rounded-full bg-white/25 blur-xl" />

        <div className="relative">
          {/* Greeting row */}
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

          {/* Recommended learning order */}
          <div className="mt-5 pt-5 border-t border-white/50">
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: '#5AADA8' }}>
              Recommended Learning Order
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Learning Profile',     href: '/pre-training', done: true               },
                { label: 'Training Guide',        href: '/training',     done: true               },
                { label: 'Video Modules',         href: '/modules',      done: false, active: true },
                { label: 'Knowledge Base',        href: '/knowledge',    done: false               },
                { label: 'Assessments',           href: '/assessments',  done: false               },
                { label: 'Competency Passport',   href: '/passport',     done: false               },
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
                  {i < 5 && (
                    <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: '#8ECFCC' }} aria-hidden />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Overall progress — white pop card */}
          <div className="mt-4 bg-white/60 backdrop-blur-sm border border-white/80 rounded-2xl px-5 py-4 flex items-center gap-4 flex-wrap shadow-sm">
            <div className="flex-1 min-w-48">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-medium text-[#6E6E73]">Overall Progress</span>
                <span className="text-sm font-bold text-[#1D1D1F]">{CURRENT_USER.overallProgress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#C8EDEA' }}>
                <div
                  className="h-full bg-orange rounded-full transition-all duration-700"
                  style={{ width: `${CURRENT_USER.overallProgress}%` }}
                />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* In-progress modules */}
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
                    className="flex items-center gap-4 p-3 rounded-xl border border-slate-100
                               hover:border-orange/30 hover:bg-orange/3 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange/10 flex items-center justify-center flex-shrink-0
                                    group-hover:bg-orange/20 transition-colors">
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

          {/* Spaced repetition due */}
          {dueSpacedRep.length > 0 && (
            <div className="card p-5 border-l-4 border-l-gold">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-4 h-4 text-yellow-700" aria-hidden />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy">Spaced Repetition Due</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Beat the forgetting curve — quick recall checks</p>
                </div>
              </div>
              <div className="space-y-2">
                {dueSpacedRep.map(module => (
                  <Link
                    key={module.id}
                    href={`/quiz/${module.id}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-gold/5 border border-gold/20
                               hover:bg-gold/10 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-navy">{module.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">3 quick questions · ~2 min</p>
                    </div>
                    <span className="text-xs font-semibold text-yellow-700 bg-gold/20 border border-gold/30 px-2.5 py-1 rounded-full">
                      Due Today
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Forgetting curve tracker */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy mb-1">Retention Schedule</h3>
            <p className="text-xs text-slate-500 mb-4">Onboarding: Welcome to Dwelly</p>
            <div className="space-y-3">
              {RETENTION_SCHEDULE.map(({ label, pct, done, action }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                    done ? 'bg-teal' : 'bg-slate-100 border border-slate-200',
                  )}>
                    {done && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-navy">{label}</span>
                      <span className="text-[10px] text-slate-400">{pct}% retained</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{action}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending sign-offs */}
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

          {/* Upcoming modules */}
          {upcomingModules.length > 0 && (
            <div className="card p-5">
              <h3 className="text-sm font-bold text-navy mb-3">Up Next</h3>
              <div className="space-y-2">
                {upcomingModules.map(module => (
                  <Link
                    key={module.id}
                    href={`/modules/${module.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center flex-shrink-0
                                    group-hover:bg-navy/10 transition-colors">
                      <BookOpen className="w-3.5 h-3.5 text-navy" aria-hidden />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-navy truncate">{module.title}</p>
                      <p className="text-[11px] text-slate-400">{module.duration} · {module.videoLength} video</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CPD snapshot */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-navy">CPD Progress</h3>
              <Link href="/passport" className="text-xs text-teal hover:text-teal-600 font-medium">View all</Link>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-black text-navy tabular-nums">{CURRENT_USER.cpdHours}</span>
              <span className="text-sm text-slate-400">/ {CURRENT_USER.cpdTarget} hours</span>
            </div>
            <ProgressBar
              value={CURRENT_USER.cpdHours}
              max={CURRENT_USER.cpdTarget}
              color="teal"
              showLabel
            />
            <p className="text-xs text-slate-500 mt-2">
              {CURRENT_USER.cpdTarget - CURRENT_USER.cpdHours} hours remaining to annual target
            </p>
          </div>

          {/* Learning Streak */}
          <LearningStreak currentStreak={5} lastSevenDays={[true, true, false, true, true, true, true]} />

          {/* Weekly Learning Goal */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy mb-3">Weekly Learning Goal</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-black text-navy tabular-nums">2.5</span>
              <span className="text-sm text-slate-400">/ 4 hours</span>
            </div>
            <ProgressBar value={2.5} max={4} color="orange" showLabel />
            <p className="text-xs text-slate-500 mt-2">1.5 hours to go this week — keep it up!</p>
          </div>
        </div>
      </div>

      {/* Achievement Badges */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-orange" aria-hidden />
            <h3 className="text-sm font-bold text-navy">Recent Achievements</h3>
          </div>
          <Link href="/passport#achievements" className="text-xs text-teal hover:text-teal-600 font-medium flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="flex items-stretch gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {[...ACHIEVEMENTS.filter(a => a.earned).slice(-5), ...ACHIEVEMENTS.filter(a => !a.earned).slice(0, 2)].map(a => (
            <AchievementBadge key={a.id} achievement={a} size="sm" />
          ))}
        </div>
      </div>
    </div>
  )
}
