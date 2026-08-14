'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, ChevronRight, Play, Infinity as InfinityIcon } from 'lucide-react'
import { SECTION_LABELS, type ModuleSection } from '@/lib/data'

// Elevated Video Modules — "group by state, not taxonomy" (rule 03). Subject
// (Maintenance, Compliance…) becomes a filter chip row, not five separate
// headings. State drives the layout: Continue → Not started → Always on →
// Completed (collapsed). One progress line, never four stat cards (rule 02).

export interface ModuleRow {
  id: string
  title: string
  section: ModuleSection
  duration: string
  videoLength: string
  passmark: number
  quizCount: number
  completed: boolean
  progress: number
}

const SECTIONS: ModuleSection[] = ['maintenance', 'compliance', 'inspections', 'move-outs', 'support', 'knowledge']

export default function ElevatedModules({ modules }: { modules: ModuleRow[] }) {
  const [section, setSection] = useState<ModuleSection | 'all'>('all')

  // "Always on" reference modules (no quiz, no pass mark) are not part of the
  // trainable count — the progress line would be dishonest if they were.
  const trainable = modules.filter(m => m.quizCount > 0 || m.passmark > 0)
  const alwaysOn = modules.filter(m => m.quizCount === 0 && m.passmark === 0)

  const completedCount = trainable.filter(m => m.completed).length
  const total = trainable.length
  const pct = total ? Math.round((completedCount / total) * 100) : 0

  const filtered = useMemo(
    () => (section === 'all' ? trainable : trainable.filter(m => m.section === section)),
    [section, trainable],
  )

  const inProgress = filtered.filter(m => m.progress > 0 && !m.completed)
  const notStarted = filtered.filter(m => m.progress === 0 && !m.completed)
  const completed = filtered.filter(m => m.completed)
  const resume = inProgress[0] ?? notStarted[0]

  // Only offer chips for sections that actually have trainable modules.
  const availableSections = SECTIONS.filter(s => trainable.some(m => m.section === s))

  return (
    <div className="space-y-6 max-w-[880px]">
      {/* Header — one H1, one purpose line, one action */}
      <div className="hub-fade flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-1.5">
          <h1 className="text-[26px] font-semibold text-navy tracking-tight">Video Modules</h1>
          <p className="text-[15px] text-[var(--text-secondary)]">
            Short videos that walk you through Dwelly, one workflow at a time. Watch, then pass the assessment.
          </p>
        </div>
        {resume && (
          <Link href={`/modules/${resume.id}`} className="btn-primary flex-shrink-0">
            {inProgress.length > 0 ? 'Pick up where you left off' : 'Start first module'}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        )}
      </div>

      {/* One progress line */}
      <div className="hub-fade-1 card px-6 py-5 flex items-center gap-7">
        <div className="flex items-baseline gap-1.5 flex-shrink-0">
          <span className="text-3xl font-semibold text-navy leading-none tabular-nums">{completedCount}</span>
          <span className="text-[15px] text-[var(--text-tertiary)]">/ {total}</span>
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-2 rounded-full bg-[#E8E8ED] overflow-hidden">
            <span className="hub-bar block h-full bg-[#0071E3]" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-[13.5px] text-[var(--text-secondary)]">
            {inProgress.length > 0 ? `${inProgress.length} in progress · ` : ''}{notStarted.length} not started · {completedCount} completed
          </p>
        </div>
      </div>

      {/* Subject filter chips (taxonomy demoted from headings to a filter) */}
      <div className="hub-fade-1 flex flex-wrap gap-2">
        <Chip active={section === 'all'} onClick={() => setSection('all')}>All</Chip>
        {availableSections.map(s => (
          <Chip key={s} active={section === s} onClick={() => setSection(s)}>{SECTION_LABELS[s]}</Chip>
        ))}
      </div>

      {inProgress.length > 0 && (
        <Group title="Continue" fade="hub-fade-2">
          {inProgress.map(m => <ModuleRowLink key={m.id} m={m} />)}
        </Group>
      )}

      {notStarted.length > 0 && (
        <Group title="Not started" fade="hub-fade-3">
          {notStarted.map(m => <ModuleRowLink key={m.id} m={m} />)}
        </Group>
      )}

      {/* Always-on reference — only when unfiltered or filtered to its section */}
      {alwaysOn.length > 0 && (section === 'all' || alwaysOn.some(m => m.section === section)) && (
        <div className="hub-fade-3 space-y-3">
          <GroupLabel>Always on</GroupLabel>
          <div className="card overflow-hidden">
            {alwaysOn
              .filter(m => section === 'all' || m.section === section)
              .map(m => (
                <Link key={m.id} href={`/modules/${m.id}`} className="group flex items-center gap-4 px-6 py-[18px] border-t border-slate-100 first:border-t-0 hover:bg-slate-50 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center flex-shrink-0">
                    <InfinityIcon className="w-3 h-3 text-[var(--text-secondary)]" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15.5px] font-semibold text-navy truncate">{m.title}</p>
                    <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">Reference · always available, no assessment</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071E3] transition-colors flex-shrink-0" aria-hidden />
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Completed — collapsed by default so it never crowds the active work */}
      {completed.length > 0 && (
        <details className="hub-fade-3 group">
          <summary className="flex items-center gap-2 cursor-pointer list-none text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">
            <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" aria-hidden />
            Completed ({completed.length})
          </summary>
          <div className="card overflow-hidden mt-3">
            {completed.map(m => (
              <Link key={m.id} href={`/modules/${m.id}`} className="group/row flex items-center gap-4 px-6 py-[18px] border-t border-slate-100 first:border-t-0 hover:bg-slate-50 transition-colors">
                <span className="w-5 h-5 rounded-full bg-[#F0FFF4] border border-[#B0EACC] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#1A7F37]" strokeWidth={3} aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15.5px] font-semibold text-navy truncate">{m.title}</p>
                  <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">Completed · {SECTION_LABELS[m.section]}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover/row:text-[#0071E3] transition-colors flex-shrink-0" aria-hidden />
              </Link>
            ))}
          </div>
        </details>
      )}

      {filtered.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-sm text-[var(--text-tertiary)]">No modules in this section.</p>
        </div>
      )}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'text-[13px] font-medium px-3.5 py-1.5 rounded-full border transition-colors ' +
        (active
          ? 'bg-navy text-white border-navy'
          : 'bg-white text-[var(--text-secondary)] border-[#D2D2D7] hover:border-[#0071E3] hover:text-navy')
      }
    >
      {children}
    </button>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{children}</h2>
}

function Group({ title, children, fade }: { title: string; children: React.ReactNode; fade: string }) {
  return (
    <div className={`${fade} space-y-3`}>
      <GroupLabel>{title}</GroupLabel>
      <div className="card overflow-hidden">{children}</div>
    </div>
  )
}

function ModuleRowLink({ m }: { m: ModuleRow }) {
  return (
    <Link href={`/modules/${m.id}`} className="group flex items-center gap-4 px-6 py-[18px] border-t border-slate-100 first:border-t-0 hover:bg-slate-50 transition-colors">
      <span className="w-5 h-5 rounded-full bg-[#0071E3]/10 flex items-center justify-center flex-shrink-0">
        <Play className="w-2.5 h-2.5 text-[#0071E3] fill-[#0071E3]" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15.5px] font-semibold text-navy truncate">{m.title}</p>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
          {SECTION_LABELS[m.section]} · {m.videoLength} video · {m.quizCount} questions
          {m.progress > 0 && !m.completed ? ` · ${m.progress}% watched` : ''}
        </p>
        {m.progress > 0 && !m.completed && (
          <div className="mt-2 h-1 rounded-full bg-[#E8E8ED] overflow-hidden max-w-[220px]">
            <span className="block h-full bg-[#0071E3]" style={{ width: `${m.progress}%` }} />
          </div>
        )}
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071E3] transition-colors flex-shrink-0" aria-hidden />
    </Link>
  )
}
