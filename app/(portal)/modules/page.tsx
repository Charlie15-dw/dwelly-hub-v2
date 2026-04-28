import Link from 'next/link'
import {
  BookOpen, Lock, CheckCircle2, Play, Clock,
  ClipboardCheck, Filter, ChevronRight, Brain, ArrowRight,
} from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { MODULES, SECTION_LABELS, ROLE_LABELS, CURRENT_USER } from '@/lib/data'
import { cn } from '@/lib/utils'

const sections = [
  'maintenance',
  'compliance',
  'move-outs',
  'inspections',
  'support',
] as const

const SECTION_META: Record<string, { color: string; bgLight: string; title: string; icon: string }> = {
  'maintenance':         { color: 'orange', bgLight: 'bg-orange/5 border-orange/20', title: 'Maintenance',             icon: '🔧' },
  'compliance':          { color: 'red',    bgLight: 'bg-red-50   border-red-200',   title: 'Compliance',              icon: '⚖️' },
  'move-outs':           { color: 'navy',   bgLight: 'bg-navy/5   border-navy/20',   title: 'Move-Outs',               icon: '📦' },
  'inspections':         { color: 'orange', bgLight: 'bg-orange/5 border-orange/20', title: 'Inspections',             icon: '🔍' },
  'support':             { color: 'teal',   bgLight: 'bg-teal/5   border-teal/20',   title: 'Support',                 icon: '🤝' },
}

const SECTION_BADGE_VARIANT: Record<string, 'teal'|'orange'|'red'|'navy'|'gold'> = {
  'maintenance':         'orange',
  'compliance':          'red',
  'move-outs':           'navy',
  'inspections':         'orange',
  'support':             'teal',
}

export default function ModulesPage() {
  const completedCount = MODULES.filter(m => m.completed).length
  const totalCount = MODULES.length

  return (
    <div className="space-y-6">

      {/* Pre-training prompt banner */}
      <div className="rounded-2xl bg-[#0071E3]/6 border border-[#0071E3]/20 p-5 flex items-start sm:items-center justify-between gap-4 flex-wrap">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#0071E3]/10 flex items-center justify-center flex-shrink-0">
            <Brain className="w-5 h-5 text-[#0071E3]" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-bold text-[#1D1D1F]">Complete your Learning Profile first</p>
            <p className="text-xs text-[#6E6E73] mt-0.5 leading-relaxed">
              8 quick questions that help us tailor your training — and give your manager useful context to support you.
            </p>
          </div>
        </div>
        <Link
          href="/pre-training"
          className="btn-primary flex items-center gap-2 text-sm flex-shrink-0"
        >
          Start Assessment
          <ArrowRight className="w-3.5 h-3.5" aria-hidden />
        </Link>
      </div>

      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="text-2xl font-black text-navy tabular-nums">{completedCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Completed</p>
          <ProgressBar value={completedCount} max={totalCount} color="teal" className="mt-2" />
        </div>
        <div className="card p-4">
          <p className="text-2xl font-black text-orange tabular-nums">
            {MODULES.filter(m => m.progress > 0 && !m.completed).length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">In Progress</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-black text-slate-400 tabular-nums">
            {MODULES.filter(m => m.locked).length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Locked</p>
        </div>
        <div className="card p-4">
          <p className="text-2xl font-black text-navy tabular-nums">{totalCount}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Modules</p>
        </div>
      </div>

      {/* Role pathway banner */}
      <div className="rounded-xl p-4 flex items-center justify-between gap-4" style={{ backgroundColor: '#E0F7F4' }}>
        <div>
          <p className="text-xs mb-0.5" style={{ color: '#5AADA8' }}>Your Pathway</p>
          <p className="font-bold text-[#1D1D1F]">{ROLE_LABELS[CURRENT_USER.role]}</p>
          <p className="text-xs mt-0.5 text-[#1D1D1F]/60">
            Showing {MODULES.filter(m => m.roles.includes(CURRENT_USER.role)).length} relevant modules
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white/70 border border-white rounded-lg px-3 py-2">
          <Filter className="w-3.5 h-3.5 text-[#1D1D1F]/50" aria-hidden />
          <span className="text-xs text-[#1D1D1F]/60 font-medium">Filtered for your role</span>
        </div>
      </div>

      {/* Module sections */}
      <div className="space-y-8">
        {sections.map(section => {
          const meta = SECTION_META[section]
          const sectionModules = MODULES.filter(m => m.section === section)
          if (sectionModules.length === 0) return null
          const sectionCompleted = sectionModules.filter(m => m.completed).length

          return (
            <div key={section}>
              {/* Section header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg" aria-hidden>{meta.icon}</span>
                  <div>
                    <h2 className="text-base font-bold text-navy">{meta.title}</h2>
                    <p className="text-xs text-slate-500">{sectionCompleted}/{sectionModules.length} completed</p>
                  </div>
                </div>
                <ProgressBar
                  value={sectionCompleted}
                  max={sectionModules.length}
                  color={meta.color as 'teal'|'orange'|'navy'|'gold'}
                  className="w-24"
                />
              </div>

              {/* Module cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sectionModules.map(module => (
                  <ModuleCard key={module.id} module={module} section={section} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Assessments CTA */}
      <div className="rounded-2xl border border-[#E8E8ED] bg-[#F5F5F7] p-5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#0071E3]/10 flex items-center justify-center flex-shrink-0">
            <ClipboardCheck className="w-4.5 h-4.5 text-[#0071E3]" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1D1D1F]">Ready to test your knowledge?</p>
            <p className="text-xs text-[#6E6E73] mt-0.5">Section assessments and the full assessment are in the Assessments tab.</p>
          </div>
        </div>
        <Link href="/assessments" className="btn-primary flex-shrink-0">
          Go to Assessments
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>

    </div>
  )
}

function ModuleCard({ module, section }: { module: typeof MODULES[0]; section: string }) {
  const meta = SECTION_META[section as keyof typeof SECTION_META]
  const badgeVariant = SECTION_BADGE_VARIANT[section]

  return (
    <Link
      href={module.locked ? '#' : `/modules/${module.id}`}
      className={cn(
        'card card-hover block p-5 relative transition-all duration-200',
        module.locked && 'opacity-60 cursor-not-allowed pointer-events-none',
        module.completed && 'border-teal/30',
        !module.locked && !module.completed && 'hover:border-orange/30',
      )}
      aria-disabled={module.locked}
      tabIndex={module.locked ? -1 : 0}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge variant={badgeVariant}>{SECTION_LABELS[section as keyof typeof SECTION_LABELS]}</Badge>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {module.locked && <Lock className="w-3.5 h-3.5 text-slate-400" aria-label="Module locked" />}
          {module.completed && <CheckCircle2 className="w-3.5 h-3.5 text-teal" aria-label="Completed" />}
          {module.passmark === 100 && !module.completed && (
            <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded">
              100% Required
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-sm font-bold text-navy leading-snug mb-1.5">{module.title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">{module.description}</p>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" aria-hidden /> {module.duration}
        </span>
        <span className="flex items-center gap-1">
          <Play className="w-3 h-3" aria-hidden /> {module.videoLength}
        </span>
        <span className="flex items-center gap-1">
          <ClipboardCheck className="w-3 h-3" aria-hidden /> {module.quizCount} Qs
        </span>
      </div>

      {/* Progress */}
      {module.progress > 0 && !module.completed && (
        <div className="mb-3">
          <ProgressBar value={module.progress} color="orange" size="sm" />
          <p className="text-[11px] text-slate-400 mt-1">{module.progress}% complete</p>
        </div>
      )}


      {/* CTA */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-[11px] text-slate-400">
          Pass mark: {module.passmark}%
        </span>
        {module.completed ? (
          <span className="text-xs font-semibold text-teal flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Complete
          </span>
        ) : module.locked ? (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked
          </span>
        ) : module.progress > 0 ? (
          <span className="text-xs font-semibold text-orange flex items-center gap-1">
            Continue <ChevronRight className="w-3 h-3" />
          </span>
        ) : (
          <span className="text-xs font-semibold text-navy flex items-center gap-1">
            Start <ChevronRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </Link>
  )
}
