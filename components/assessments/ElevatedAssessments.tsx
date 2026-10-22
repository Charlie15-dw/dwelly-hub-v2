'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, ChevronRight, Lock, Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { clearLegacyLockData } from '@/lib/assessmentStorage'
import { MODULES, RETIRED_ASSESSMENT_IDS } from '@/lib/data'
import RequestRetakeButton from '@/components/assessments/RequestRetakeButton'

// Elevated Assessments — "group by state, not taxonomy" (rule 03). The only
// real locks in the product live here (rule 05), so the locked group always
// explains why and the way out. Pass marks are per-assessment (rule: never a
// single global figure — kno-03 is 75, the rest 80). Assessments are self-paced
// with no due dates in the schema, so there is deliberately no "Overdue" group;
// inventing one would be dishonest.

interface AssessmentMeta {
  id: string
  title: string
  questions: number
  passmark: number
}

// The canonical assessments: the system/video module assessments, then the two
// programme milestones. The old combined "Knowledge Base Assessment" has been
// retired — the Knowledge Base now carries two standalone certified courses
// (Renters' Rights Act, Property Management Induction) surfaced on the Knowledge
// Base page itself. Knowledge modules are excluded above as before.
const ASSESSMENTS: AssessmentMeta[] = [
  ...MODULES.filter(m =>
    m.quizCount > 0 && m.passmark > 0 && m.section !== 'knowledge' &&
    !RETIRED_ASSESSMENT_IDS.includes(m.id),
  ).map(m => ({
    id: m.id,
    title: m.title,
    questions: m.quizCount,
    passmark: m.passmark,
  })),
  { id: 'full-assessment', title: 'Full Assessment — All Sections', questions: 15, passmark: 80 },
  { id: 'master-assessment', title: 'Master Assessment', questions: 27, passmark: 80 },
]

type Stage = 'ready' | 'locked' | 'passed'

interface Row extends AssessmentMeta {
  stage: Stage
  score: number | null
}

export default function ElevatedAssessments() {
  const [rows, setRows] = useState<Row[] | null>(null)

  useEffect(() => {
    clearLegacyLockData()

    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setRows(ASSESSMENTS.map(a => ({ ...a, stage: 'ready' as Stage, score: null })))
        return
      }

      const { data: profile } = await supabase
        .from('user_profiles').select('role').eq('id', user.id).maybeSingle()
      const privileged = profile?.role === 'manager' || profile?.role === 'admin'

      const [{ data: results }, { data: resets }] = await Promise.all([
        supabase.from('assessment_results').select('assessment_id, score, passed, completed_at').eq('user_id', user.id),
        supabase.from('module_resets').select('module_id').eq('user_id', user.id).is('consumed_at', null),
      ])

      // Latest attempt per assessment.
      const latest = new Map<string, { score: number; passed: boolean; at: string }>()
      for (const r of results ?? []) {
        const at = r.completed_at ?? ''
        const cur = latest.get(r.assessment_id)
        if (!cur || at >= cur.at) latest.set(r.assessment_id, { score: r.score ?? 0, passed: !!r.passed, at })
      }
      const pendingReset = new Set((resets ?? []).map(r => r.module_id))

      setRows(ASSESSMENTS.map(a => {
        const attempt = latest.get(a.id)
        let stage: Stage = 'ready'
        let score: number | null = attempt?.score ?? null
        if (attempt?.passed) stage = 'passed'
        else if (attempt && !pendingReset.has(a.id) && !privileged) stage = 'locked'
        return { ...a, stage, score }
      }))
    }
    init()
  }, [])

  if (!rows) {
    return (
      <div className="space-y-6 max-w-[880px] animate-pulse">
        <div className="h-8 w-56 bg-navy-100 rounded-full" />
        <div className="h-24 bg-navy-100 rounded-2xl" />
        <div className="h-64 bg-navy-100 rounded-2xl" />
      </div>
    )
  }

  const passed = rows.filter(r => r.stage === 'passed')
  const locked = rows.filter(r => r.stage === 'locked')
  const ready = rows.filter(r => r.stage === 'ready')
  const total = rows.length
  const pct = Math.round((passed.length / total) * 100)
  const nextReady = ready[0]

  return (
    <div className="space-y-6 max-w-[880px]">
      {/* Header — one H1, one purpose line, one action */}
      <div className="hub-fade flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-1.5">
          <h1 className="text-[26px] font-semibold text-navy tracking-tight">Assessments</h1>
          <p className="text-[15px] text-[var(--text-secondary)]">
            Pass each one to build your Competency Passport. One attempt each — your manager can grant a retake.
          </p>
        </div>
        {nextReady && (
          <Link href={`/quiz/${nextReady.id}`} className="btn-primary flex-shrink-0">
            Take next
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        )}
      </div>

      {/* One progress line, not four stat cards */}
      <div className="hub-fade-1 card px-6 py-5 flex items-center gap-7">
        <div className="flex items-baseline gap-1.5 flex-shrink-0">
          <span className="text-3xl font-semibold text-navy leading-none tabular-nums">{passed.length}</span>
          <span className="text-[15px] text-[var(--text-tertiary)]">/ {total}</span>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-2 rounded-full bg-[#E8E8ED] overflow-hidden">
            <span className="hub-bar block h-full bg-[#0071E3]" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[13.5px] text-[var(--text-secondary)]">
            {ready.length} ready to take{locked.length > 0 ? ` · ${locked.length} locked` : ''} · {passed.length} passed
          </p>
        </div>
      </div>

      {ready.length > 0 && (
        <Group title="Ready to take">
          {ready.map((r, i) => (
            <RowLink key={r.id} row={r} primary={i === 0} />
          ))}
        </Group>
      )}

      {locked.length > 0 && (
        <div className="hub-fade-2 space-y-3">
          <GroupLabel>Locked</GroupLabel>
          {/* Locks always say why and what next (rule 05) */}
          <div className="rag-amber rounded-2xl px-5 py-4 flex items-start gap-3 border">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden />
            <p className="text-[13.5px] leading-relaxed">
              One attempt used. Ask a manager for a retake — nothing is lost, your previous score stays on record.
            </p>
          </div>
          <div className="card overflow-hidden">
            {locked.map(r => (
              <div key={r.id} className="flex items-center gap-4 px-6 py-[18px] border-t border-navy-100 first:border-t-0">
                <span className="w-2 h-2 rounded-full bg-[#995500] flex-shrink-0" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-[15.5px] font-semibold text-navy truncate">{r.title}</p>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
                    {r.score != null ? `Scored ${r.score}% · ` : ''}pass mark {r.passmark}% · {r.questions} questions
                  </p>
                </div>
                <RequestRetakeButton assessmentId={r.id} />
              </div>
            ))}
          </div>
        </div>
      )}

      {passed.length > 0 && (
        <Group title="Passed" fade="hub-fade-3">
          {passed.map(r => (
            <Link key={r.id} href={`/quiz/${r.id}`} className="group flex items-center gap-4 px-6 py-[18px] border-t border-navy-100 first:border-t-0 hover:bg-navy-50 transition-colors">
              <span className="w-5 h-5 rounded-full bg-[#F0FFF4] border border-[#B0EACC] flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-[#1A7F37]" strokeWidth={3} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[15.5px] font-semibold text-navy truncate">{r.title}</p>
                <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">Passed{r.score != null ? ` · scored ${r.score}%` : ''} · pass mark {r.passmark}%</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[#0071E3] transition-colors flex-shrink-0" aria-hidden />
            </Link>
          ))}
        </Group>
      )}
    </div>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{children}</h2>
}

function Group({ title, children, fade = 'hub-fade-2' }: { title: string; children: React.ReactNode; fade?: string }) {
  return (
    <div className={`${fade} space-y-3`}>
      <GroupLabel>{title}</GroupLabel>
      <div className="card overflow-hidden">{children}</div>
    </div>
  )
}

function RowLink({ row, primary }: { row: Row; primary: boolean }) {
  return (
    <Link href={`/quiz/${row.id}`} className="group flex items-center gap-4 px-6 py-[18px] border-t border-navy-100 first:border-t-0 hover:bg-navy-50 transition-colors">
      <span className="w-2 h-2 rounded-full bg-[#0071E3] flex-shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="text-[15.5px] font-semibold text-navy truncate">{row.title}</p>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{row.questions} questions · pass mark {row.passmark}%</p>
      </div>
      <span className={(primary ? 'btn-primary' : 'btn-outline') + ' text-[13px] flex-shrink-0'}>
        Start
        <ChevronRight className="w-3.5 h-3.5" aria-hidden />
      </span>
    </Link>
  )
}
