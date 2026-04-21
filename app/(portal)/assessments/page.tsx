'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, ChevronRight, ClipboardCheck, BookOpen, Play, Library, ArrowRight, Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isLocked } from '@/lib/assessmentStorage'

const VIDEO_MODULE_ASSESSMENTS = [
  { label: 'Maintenance',              icon: '🔧', id: 'mnt-02', questions: 10 },
  { label: 'Compliance',               icon: '⚖️', id: 'cmp-02', questions: 26 },
  { label: 'Move-Outs',                icon: '📦', id: 'mvt-02', questions: 8  },
  { label: 'Inspections',              icon: '🔍', id: 'ins-02', questions: 6  },
  { label: 'Support',                  icon: '🤝', id: 'sup-02', questions: 6  },
] as const

const KNOWLEDGE_ASSESSMENTS = [
  { label: 'Difficult Conversations',      icon: '💬', id: 'kno-01', questions: 5 },
  { label: 'Handling Disrepair Claims',    icon: '🔨', id: 'kno-02', questions: 7 },
  { label: 'Understanding a P&L',          icon: '📊', id: 'kno-03', questions: 5 },
] as const

export default function AssessmentsPage() {
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const allIds = [
      'master-assessment',
      'full-assessment',
      ...VIDEO_MODULE_ASSESSMENTS.map(a => a.id),
      ...KNOWLEDGE_ASSESSMENTS.map(a => a.id),
    ]
    setLockedIds(new Set(allIds.filter(id => isLocked(id))))
  }, [])

  return (
    <div className="space-y-6 max-w-5xl">

      {/* Hero */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ backgroundColor: '#1D1D1F' }}>
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/10 rounded-r-2xl" />
        <div className="absolute right-8 top-4 w-32 h-32 rounded-full bg-white/4" />
        <div className="absolute right-24 bottom-2 w-20 h-20 rounded-full bg-white/4" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Assessments</p>
              <h2 className="text-2xl font-bold text-white">Master Assessment</h2>
              <p className="text-sm text-white/60 mt-1.5 max-w-xl leading-relaxed">
                An advanced test with scenario-based questions across all 11 sections —
                harder than individual assessments, testing applied judgement and legal knowledge.
              </p>
            </div>
            {lockedIds.has('master-assessment') ? (
              <Link
                href="/quiz/master-assessment"
                className="flex-shrink-0 mt-1 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/50 bg-white/8 border border-white/15 cursor-default"
              >
                <Lock className="w-4 h-4" aria-hidden />
                Locked
              </Link>
            ) : (
              <Link href="/quiz/master-assessment" className="btn-primary flex-shrink-0 mt-1">
                Start Master Assessment
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            )}
          </div>

          {/* Coverage pills */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              { icon: BookOpen,      label: 'Training Guides' },
              { icon: Play,          label: 'Video Modules'   },
              { icon: Library,       label: 'Knowledge Base'  },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-xs font-medium text-white/70 bg-white/8 border border-white/12 px-2.5 py-1 rounded-full">
                <Icon className="w-3 h-3" aria-hidden />{label}
              </span>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Sections',   value: '11' },
            { label: 'Questions',  value: '33' },
            { label: 'Est. time',  value: '~50 min' },
            { label: 'Pass mark',  value: '80%' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-center">
              <p className="text-xl font-black text-white tabular-nums">{value}</p>
              <p className="text-xs text-white/40 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Video Module assessments */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-[#F5F5F7] text-[#1D1D1F] border-[#D2D2D7]">
            <Play className="w-3.5 h-3.5" aria-hidden />
            Video Module Assessments
          </div>
          <div className="flex-1 h-px bg-[#E8E8ED]" />
        </div>
        <p className="text-xs text-[#6E6E73] mb-4">
          Each section assessment is linked to the 2/2 video module for that area. Complete the module before taking the assessment.
        </p>
        <div className="card divide-y divide-[#F5F5F7]">
          {VIDEO_MODULE_ASSESSMENTS.map((a) => {
            const locked = lockedIds.has(a.id)
            return (
              <Link
                key={a.id}
                href={`/quiz/${a.id}`}
                className="flex items-center justify-between p-4 hover:bg-[#F5F5F7]/60 transition-colors group first:rounded-t-[17px] last:rounded-b-[17px]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center" aria-hidden>{a.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#1D1D1F]">{a.label}</p>
                    <p className="text-xs text-[#6E6E73] mt-0.5">{a.questions} questions · Pass mark 80%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {locked ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" aria-hidden />
                      Locked
                    </span>
                  ) : (
                    <span className="hidden sm:flex items-center gap-1 text-[10px] font-semibold text-[#0071E3] bg-[#0071E3]/8 border border-[#0071E3]/20 px-2 py-0.5 rounded-full">
                      <ClipboardCheck className="w-3 h-3" aria-hidden />
                      Assessment
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#D2D2D7] group-hover:text-[#0071E3] transition-colors" aria-hidden />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Knowledge Base assessments */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-[#F5F5F7] text-[#1D1D1F] border-[#D2D2D7]">
            <Library className="w-3.5 h-3.5" aria-hidden />
            Knowledge Base Assessments
          </div>
          <div className="flex-1 h-px bg-[#E8E8ED]" />
        </div>
        <p className="text-xs text-[#6E6E73] mb-4">
          Read the knowledge article first, then test your understanding with the linked assessment.
        </p>
        <div className="card divide-y divide-[#F5F5F7]">
          {KNOWLEDGE_ASSESSMENTS.map((a) => {
            const locked = lockedIds.has(a.id)
            return (
              <Link
                key={a.id}
                href={`/quiz/${a.id}`}
                className="flex items-center justify-between p-4 hover:bg-[#F5F5F7]/60 transition-colors group first:rounded-t-[17px] last:rounded-b-[17px]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center" aria-hidden>{a.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-[#1D1D1F]">{a.label}</p>
                    <p className="text-xs text-[#6E6E73] mt-0.5">{a.questions} questions · Pass mark 80%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {locked ? (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" aria-hidden />
                      Locked
                    </span>
                  ) : (
                    <span className="hidden sm:block text-xs text-[#6E6E73]">Knowledge Base</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-[#D2D2D7] group-hover:text-[#0071E3] transition-colors" aria-hidden />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Note */}
      <div className="rounded-2xl bg-[#F5F5F7] border border-[#E8E8ED] p-5">
        <p className="text-sm text-[#6E6E73] leading-relaxed">
          <span className="font-semibold text-[#1D1D1F]">Tip: </span>
          Work through the Training Guides, complete your Learning Profile, watch the Video Modules, and read the Knowledge Base articles before attempting the Master Assessment. The Master Assessment samples 3 questions per section for a balanced test of everything.
        </p>
      </div>

    </div>
  )
}
