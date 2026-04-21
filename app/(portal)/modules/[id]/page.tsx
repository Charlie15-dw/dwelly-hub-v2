import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, Play, Clock, ClipboardCheck, CheckCircle2,
  Download, Star, BookOpen, AlertTriangle, ChevronRight,
} from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import Badge from '@/components/ui/Badge'
import { MODULES, SECTION_LABELS, QUIZ_QUESTIONS } from '@/lib/data'
import { cn } from '@/lib/utils'

const SECTION_COLORS: Record<string, string> = {
  onboarding:  'text-teal bg-teal/10 border-teal/20',
  maintenance: 'text-orange bg-orange/10 border-orange/20',
  compliance:  'text-red-600 bg-red-50 border-red-200',
  system:      'text-navy bg-navy/10 border-navy/20',
  knowledge:   'text-yellow-700 bg-gold/10 border-gold/20',
}

// Mock module content body
function getModuleContent(id: string): { overview: string; steps: string[]; watchFor: string[] } {
  const defaults: Record<string, { overview: string; steps: string[]; watchFor: string[] }> = {
    'mnt-01': {
      overview: 'This module covers the complete process for logging a repair request in Dwelly — from initial tenant contact through to contractor instruction and resolution. A consistent, auditable approach to repair logging protects the landlord, the tenant, and Dwelly.',
      steps: [
        'Receive the repair request (call, email, or portal submission)',
        'Log immediately in Dwelly under the correct property and tenancy',
        'Categorise the repair: Emergency, Urgent (within 24h), or Routine',
        'Notify the landlord in writing and request authorisation for non-emergency works',
        'Instruct an approved contractor once authorised',
        'Track progress — follow up if no update within the agreed SLA',
        'Close the repair with evidence of completion (photo, invoice)',
      ],
      watchFor: [
        'Never leave an emergency repair unactioned — tenant health and safety is paramount',
        'Always get landlord authorisation in writing before instructing works above your threshold',
        'Missing a repair log can create significant liability — log same day, always',
      ],
    },
    'cmp-02': {
      overview: 'Deposit protection is one of the most legally significant responsibilities in lettings. Failure to protect a deposit within the required timeframe can result in a court awarding the tenant between one and three times the deposit amount.',
      steps: [
        'Collect the tenancy deposit at the point of signing',
        'Protect the deposit within 30 days using an approved scheme (TDS, DPS, or mydeposits)',
        'Issue the Prescribed Information to the tenant (and any relevant person) within 30 days',
        'Record the scheme, reference number, and issue date in Dwelly',
        'At renewal — check if protection needs to be refreshed (check your scheme rules)',
        'At end of tenancy — return the deposit within 10 days of agreement, or submit a dispute',
      ],
      watchFor: [
        'The 30-day clock starts from receipt of cleared funds, not the tenancy start date',
        'Prescribed Information must be served correctly — verbal confirmation is not sufficient',
        'If the tenancy is renewed on a new fixed term, re-serving prescribed information may be required',
      ],
    },
  }
  return defaults[id] ?? {
    overview: 'This module provides structured guidance on this key area of property management. Work through the steps below, watch the video guide, and complete the assessment at the end.',
    steps: [
      'Review the learning objectives at the start of this module',
      'Watch the video guide in full',
      'Read the written step-by-step guide',
      'Complete any practical tasks indicated',
      'Attempt the knowledge assessment',
    ],
    watchFor: [
      'Refer to Dwelly SOPs for process-specific detail',
      'Escalate to your manager if unsure before taking action',
    ],
  }
}

export default function ModulePage({ params }: { params: { id: string } }) {
  const module = MODULES.find(m => m.id === params.id)
  if (!module) notFound()

  const content = getModuleContent(params.id)
  const moduleQuestions = QUIZ_QUESTIONS.filter(q => q.moduleId === params.id)
  const sectionColorClass = SECTION_COLORS[module.section] ?? 'text-slate-600 bg-slate-100 border-slate-200'

  const prevModule = MODULES[MODULES.indexOf(module) - 1]
  const nextModule = MODULES[MODULES.indexOf(module) + 1]

  return (
    <div className="max-w-4xl space-y-6">
      {/* Back */}
      <div className="flex items-center gap-2">
        <Link href="/modules" className="text-sm text-slate-500 hover:text-navy flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Modules
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-500">{SECTION_LABELS[module.section]}</span>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-navy font-medium truncate">{module.title}</span>
      </div>

      {/* Module header */}
      <div className="card p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full border', sectionColorClass)}>
                {SECTION_LABELS[module.section]}
              </span>
              {module.passmark === 100 && (
                <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                  100% Required to Pass
                </span>
              )}
              {module.completed && (
                <span className="text-xs font-semibold text-teal bg-teal/10 border border-teal/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-navy mb-2">{module.title}</h1>
            <p className="text-sm text-slate-600 leading-relaxed">{module.description}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-6 mt-5 pt-5 border-t border-slate-100 flex-wrap">
          {[
            { icon: Clock,         label: module.duration,    sub: 'Total time' },
            { icon: Play,          label: module.videoLength, sub: 'Video guide' },
            { icon: ClipboardCheck,label: `${module.quizCount} questions`, sub: 'Assessment' },
            { icon: Star,          label: `${module.passmark}%`,           sub: 'Pass mark' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={sub} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-slate-500" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">{label}</p>
                <p className="text-[11px] text-slate-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Progress */}
        {module.progress > 0 && (
          <div className="mt-5">
            <ProgressBar value={module.progress} showLabel size="lg" />
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {module.tags.map(tag => (
            <span key={tag} className="text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Video placeholder */}
      <div className="card p-1 overflow-hidden rounded-2xl">
        <div className="aspect-video rounded-xl flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#E0F7F4' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #D4F3EF 0%, #E8FAF8 100%)' }} />
          <div className="absolute right-6 top-4 w-28 h-28 rounded-full bg-white/40" />
          <div className="absolute left-8 bottom-4 w-20 h-20 rounded-full bg-white/30" />
          <div className="relative text-center">
            <button
              className="w-16 h-16 rounded-full bg-orange flex items-center justify-center
                         shadow-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-4 focus:ring-orange/30
                         active:scale-95"
              aria-label={`Play video: ${module.title}`}
            >
              <Play className="w-6 h-6 text-white ml-0.5" aria-hidden />
            </button>
            <p className="font-semibold mt-3 text-sm text-[#1D1D1F]">{module.title}</p>
            <p className="text-xs mt-1" style={{ color: '#5AADA8' }}>{module.videoLength} · Dwelly Training Video</p>
          </div>
        </div>
      </div>

      {/* Content body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Overview */}
          <div className="card p-6">
            <h2 className="text-base font-bold text-navy mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal" /> Overview
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{content.overview}</p>
          </div>

          {/* Step-by-step */}
          <div className="card p-6">
            <h2 className="text-base font-bold text-navy mb-4">Step-by-Step Guide</h2>
            <ol className="space-y-3">
              {content.steps.map((step, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Watch out for */}
          <div className="card p-6 border-l-4 border-l-amber-400">
            <h2 className="text-base font-bold text-navy mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> What to Watch Out For
            </h2>
            <ul className="space-y-2.5">
              {content.watchFor.map((item, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5" />
                  <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Sample quiz preview */}
          {moduleQuestions.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-navy">Assessment Preview</h2>
                <span className="text-xs text-slate-500">{module.quizCount} questions total</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-navy mb-3">{moduleQuestions[0].question}</p>
                <div className="space-y-2">
                  {moduleQuestions[0].options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white border border-slate-200
                                 hover:border-orange/40 hover:bg-orange/3 cursor-pointer transition-colors"
                    >
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href={`/quiz/${module.id}`} className="btn-primary w-full justify-center">
                Start Full Assessment
                <ChevronRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Confidence rating */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy mb-3">Rate Your Confidence</h3>
            <p className="text-xs text-slate-500 mb-3">After completing this module, how confident do you feel?</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  className={cn(
                    'flex-1 h-8 rounded-lg border text-xs font-semibold transition-all',
                    n === (module.confidenceRating ?? 0)
                      ? 'bg-orange text-white border-orange'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-orange/40 hover:text-orange',
                  )}
                  aria-label={`Rate confidence ${n} out of 5`}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">1 = Not confident · 5 = Very confident</p>
          </div>

          {/* Resources */}
          <div className="card p-5">
            <h3 className="text-sm font-bold text-navy mb-3">Resources</h3>
            <div className="space-y-2">
              {['Module Reference Guide', 'Quick Reference Card', 'Legislation Summary'].map(res => (
                <button
                  key={res}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-100
                             hover:border-teal/30 hover:bg-teal/3 transition-colors text-left"
                  aria-label={`Download ${res}`}
                >
                  <Download className="w-3.5 h-3.5 text-teal flex-shrink-0" aria-hidden />
                  <span className="text-xs text-slate-600">{res}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Next/prev navigation */}
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-navy">Navigation</h3>
            {prevModule && (
              <Link
                href={`/modules/${prevModule.id}`}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <div className="min-w-0">
                  <p className="text-[11px] text-slate-400">Previous</p>
                  <p className="text-xs font-medium text-navy truncate">{prevModule.title}</p>
                </div>
              </Link>
            )}
            {nextModule && !nextModule.locked && (
              <Link
                href={`/modules/${nextModule.id}`}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-slate-400">Next</p>
                  <p className="text-xs font-medium text-navy truncate">{nextModule.title}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
