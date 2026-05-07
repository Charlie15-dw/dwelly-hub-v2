'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Trophy, ChevronRight, ClipboardCheck, BookOpen, Play, Library, ArrowRight, Lock } from 'lucide-react'
import { isLocked } from '@/lib/assessmentStorage'
import { createClient } from '@/lib/supabase/client'

const VIDEO_MODULE_ASSESSMENTS = [
  { label: 'Maintenance 1/2 — Creating a Repair Request',    icon: '🔧', id: 'mnt-01', questions: 6  },
  { label: 'Maintenance 2/2 — Actioning the Maintenance Task', icon: '🔧', id: 'mnt-02', questions: 10 },
  { label: 'Compliance 1/2 — Creating a Compliance Task',    icon: '⚖️', id: 'cmp-01', questions: 6  },
  { label: 'Compliance 2/2 — Actioning the Compliance Task', icon: '⚖️', id: 'cmp-02', questions: 15 },
  { label: 'Inspections 1/2 — Creating an Inspection Task',  icon: '🔍', id: 'mnt-03', questions: 5  },
  { label: 'Inspections 2/2 — Completing the Inspection',    icon: '🔍', id: 'ins-02', questions: 6  },
  { label: 'Move-Outs 1/2 — Initiating the Move-Out Process', icon: '📦', id: 'sys-01', questions: 5 },
  { label: 'Move-Outs 2/2 — Completing the Move-Out',        icon: '📦', id: 'mvt-02', questions: 8  },
  { label: 'Support 1/2 — Raising a Support Task',           icon: '🤝', id: 'sys-02', questions: 5  },
  { label: 'Support 2/2 — Actioning the Support Task',       icon: '🤝', id: 'sup-02', questions: 6  },
] as const

const KNOWLEDGE_ASSESSMENTS = [
  { label: 'Difficult Conversations',   icon: '💬', id: 'kno-01', questions: 5 },
  { label: 'Handling Disrepair Claims', icon: '🔨', id: 'kno-02', questions: 7 },
  { label: 'Understanding a P&L',       icon: '📊', id: 'kno-03', questions: 5 },
] as const

function SectionHeader({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border bg-[#F5F5F7] text-[#1D1D1F] border-[#D2D2D7]">
        <Icon className="w-3.5 h-3.5" aria-hidden />
        {label}
      </div>
      <div className="flex-1 h-px bg-[#E8E8ED]" />
    </div>
  )
}

export default function AssessmentsPage() {
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle()
        // Managers (or users with no profile row) are never locked out
        if (!profile || profile.role === 'manager') return
      }
      const allIds = [
        'master-assessment',
        'full-assessment',
        ...VIDEO_MODULE_ASSESSMENTS.map(a => a.id),
        ...KNOWLEDGE_ASSESSMENTS.map(a => a.id),
      ] as string[]
      setLockedIds(new Set(allIds.filter(id => isLocked(id))))
    }
    init()
  }, [])

  const AssessmentRow = ({ icon, label, id, questions, sublabel }: {
    icon: string; label: string; id: string; questions: number; sublabel?: string
  }) => {
    const locked = lockedIds.has(id)
    return (
      <Link
        href={`/quiz/${id}`}
        className="flex items-center justify-between p-4 hover:bg-[#F5F5F7]/60 transition-colors group first:rounded-t-[17px] last:rounded-b-[17px]"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl w-8 text-center" aria-hidden>{icon}</span>
          <div>
            <p className="text-sm font-semibold text-[#1D1D1F]">{label}</p>
            <p className="text-xs text-[#6E6E73] mt-0.5">
              {sublabel ?? `${questions} questions · Pass mark 80%`}
            </p>
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
  }

  return (
    <div className="space-y-8 max-w-5xl">

      {/* ── 1. Video Module Assessments ─────────────────────────────────── */}
      <div>
        <SectionHeader icon={Play} label="Video Module Assessments" />
        <p className="text-xs text-[#6E6E73] mb-4">
          Complete each video module before taking its assessment. Work through them in order.
        </p>
        <div className="card divide-y divide-[#F5F5F7]">
          {VIDEO_MODULE_ASSESSMENTS.map((a) => (
            <AssessmentRow key={a.id} {...a} />
          ))}
        </div>
      </div>

      {/* ── 2. Full Assessment ──────────────────────────────────────────── */}
      <div>
        <SectionHeader icon={ClipboardCheck} label="Full Video Module Assessment" />
        <p className="text-xs text-[#6E6E73] mb-4">
          Tests your knowledge across all five video module sections in one combined assessment.
        </p>
        <div className="card overflow-hidden">
          <div className="p-5 relative overflow-hidden" style={{ backgroundColor: '#1D1D1F' }}>
            <div className="absolute right-6 top-4 w-24 h-24 rounded-full bg-white/5" />
            <div className="absolute right-16 bottom-2 w-14 h-14 rounded-full bg-white/5" />
            <div className="relative flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-1">Combined</p>
                <h3 className="text-lg font-bold text-white">Full Assessment — All Sections</h3>
                <p className="text-sm text-white/60 mt-1 max-w-lg">
                  Questions drawn from Maintenance, Compliance, Move-Outs, Inspections, and Support.
                </p>
              </div>
              {lockedIds.has('full-assessment') ? (
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/50 bg-white/8 border border-white/15 mt-1">
                  <Lock className="w-4 h-4" aria-hidden />
                  Locked
                </span>
              ) : (
                <Link href="/quiz/full-assessment" className="btn-primary flex-shrink-0 mt-1">
                  Start Full Assessment
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#E8E8ED] border-t border-[#E8E8ED]">
            {[
              { label: 'Sections', value: '5' },
              { label: 'Questions', value: '24' },
              { label: 'Est. time', value: '~30 min' },
              { label: 'Pass mark', value: '80%' },
            ].map(({ label, value }) => (
              <div key={label} className="px-5 py-4 text-center">
                <p className="text-xl font-black text-[#1D1D1F] tabular-nums">{value}</p>
                <p className="text-xs text-[#6E6E73] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Knowledge Base Assessments ───────────────────────────────── */}
      <div>
        <SectionHeader icon={Library} label="Knowledge Base Assessments" />
        <p className="text-xs text-[#6E6E73] mb-4">
          Read the knowledge article first, then test your understanding with the linked assessment.
        </p>
        <div className="card divide-y divide-[#F5F5F7]">
          {KNOWLEDGE_ASSESSMENTS.map((a) => (
            <AssessmentRow key={a.id} {...a} />
          ))}
        </div>
      </div>

      {/* ── 4. Master Assessment (final) ────────────────────────────────── */}
      <div>
        <SectionHeader icon={Trophy} label="Master Assessment" />
        <p className="text-xs text-[#6E6E73] mb-4">
          Complete all modules, knowledge base articles, and individual assessments before attempting this.
        </p>
        <div className="rounded-2xl p-6 relative overflow-hidden" style={{ backgroundColor: '#1D1D1F' }}>
          <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-white/10 rounded-r-2xl" />
          <div className="absolute right-8 top-4 w-32 h-32 rounded-full bg-white/4" />
          <div className="absolute right-24 bottom-2 w-20 h-20 rounded-full bg-white/4" />
          <div className="relative">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-1">Final</p>
                <h2 className="text-2xl font-bold text-white">Master Assessment</h2>
                <p className="text-sm text-white/60 mt-1.5 max-w-xl leading-relaxed">
                  An advanced test with scenario-based questions across all 11 sections —
                  harder than individual assessments, testing applied judgement and legal knowledge.
                </p>
              </div>
              {lockedIds.has('master-assessment') ? (
                <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white/50 bg-white/8 border border-white/15 mt-1">
                  <Lock className="w-4 h-4" aria-hidden />
                  Locked
                </span>
              ) : (
                <Link href="/quiz/master-assessment" className="btn-primary flex-shrink-0 mt-1">
                  Start Master Assessment
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-2 mt-5">
              {[
                { icon: BookOpen, label: 'Training Guides' },
                { icon: Play,     label: 'Video Modules'  },
                { icon: Library,  label: 'Knowledge Base' },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 text-xs font-medium text-white/70 bg-white/8 border border-white/12 px-2.5 py-1 rounded-full">
                  <Icon className="w-3 h-3" aria-hidden />{label}
                </span>
              ))}
            </div>
          </div>
          <div className="relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Sections',  value: '11'     },
              { label: 'Questions', value: '33'     },
              { label: 'Est. time', value: '~50 min'},
              { label: 'Pass mark', value: '80%'    },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/6 border border-white/10 rounded-xl px-4 py-3 text-center">
                <p className="text-xl font-black text-white tabular-nums">{value}</p>
                <p className="text-xs text-white/40 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
