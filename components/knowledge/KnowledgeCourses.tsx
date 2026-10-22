'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Award, ArrowRight, Check, Download, ScrollText, FileQuestion, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { KNOWLEDGE_COURSES } from '@/lib/data'
import { cn } from '@/lib/utils'

// Certified knowledge-base courses, shown right at the top of the Knowledge Base
// so they're the first thing a learner sees. Each is a short assessment that,
// once passed, awards a downloadable Dwelly certificate.

type Status = 'not-started' | 'passed' | 'locked'

interface CourseRow {
  id: string
  title: string
  blurb: string
  passmark: number
  questions: number
  status: Status
  score: number | null
}

export default function KnowledgeCourses() {
  const [rows, setRows] = useState<CourseRow[] | null>(null)

  useEffect(() => {
    async function init() {
      const base = KNOWLEDGE_COURSES.map(c => ({
        id: c.id,
        title: c.title,
        blurb: c.blurb,
        passmark: c.passmark,
        questions: 12,
      }))

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setRows(base.map(c => ({ ...c, status: 'not-started' as Status, score: null })))
        return
      }

      const [{ data: results }, { data: resets }] = await Promise.all([
        supabase.from('assessment_results')
          .select('assessment_id, score, passed, completed_at')
          .eq('user_id', user.id),
        supabase.from('module_resets')
          .select('module_id').eq('user_id', user.id).is('consumed_at', null),
      ])

      const latest = new Map<string, { score: number; passed: boolean; at: string }>()
      for (const r of results ?? []) {
        const at = r.completed_at ?? ''
        const cur = latest.get(r.assessment_id)
        if (!cur || at >= cur.at) latest.set(r.assessment_id, { score: r.score ?? 0, passed: !!r.passed, at })
      }
      const pendingReset = new Set((resets ?? []).map(r => r.module_id))

      setRows(base.map(c => {
        const attempt = latest.get(c.id)
        let status: Status = 'not-started'
        if (attempt?.passed) status = 'passed'
        else if (attempt && !pendingReset.has(c.id)) status = 'locked'
        return { ...c, status, score: attempt?.score ?? null }
      }))
    }
    init()
  }, [])

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#C9A84C]/15">
          <Award className="w-5 h-5 text-[#A9863A]" aria-hidden />
        </span>
        <div>
          <h2 className="text-[20px] font-semibold text-navy tracking-tight leading-tight">Certified courses</h2>
          <p className="text-[13.5px] text-[var(--text-secondary)]">
            Pass the assessment to earn a Dwelly certificate.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(rows ?? KNOWLEDGE_COURSES.map(c => ({
          id: c.id, title: c.title, blurb: c.blurb, passmark: c.passmark,
          questions: 12, status: 'not-started' as Status, score: null as number | null,
        }))).map(c => (
          <CourseCard key={c.id} course={c} loading={rows === null} />
        ))}
      </div>
    </section>
  )
}

function CourseCard({ course, loading }: { course: CourseRow; loading: boolean }) {
  const Icon = course.id === 'renters-rights-act' ? ScrollText : FileQuestion
  const passed = course.status === 'passed'

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-white p-5 flex flex-col',
        passed ? 'border-[#6ECFCC]/50' : 'border-navy-100',
      )}
    >
      <span
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: passed ? '#6ECFCC' : 'linear-gradient(90deg,#1B2A4A,#6ECFCC)' }}
        aria-hidden
      />
      <div className="flex items-start gap-3 mb-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-navy-50 flex-shrink-0">
          <Icon className="w-5 h-5 text-navy" aria-hidden />
        </span>
        <div className="min-w-0">
          <h3 className="text-[16px] font-semibold text-navy leading-snug">{course.title}</h3>
          <p className="text-[12px] text-[var(--text-tertiary)] mt-0.5">
            {course.questions} questions · pass mark {course.passmark}%
          </p>
        </div>
      </div>

      <p className="text-[13.5px] text-[var(--text-secondary)] leading-relaxed flex-1">{course.blurb}</p>

      {loading ? (
        <div className="mt-4 h-9 flex items-center">
          <Loader2 className="w-4 h-4 animate-spin text-[var(--text-tertiary)]" aria-hidden />
        </div>
      ) : passed ? (
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A7F37]">
            <Check className="w-4 h-4" strokeWidth={3} aria-hidden />
            Certified{course.score != null ? ` · ${course.score}%` : ''}
          </span>
          <a
            href={`/api/certificate?course=${encodeURIComponent(course.id)}`}
            className="ml-auto btn-outline text-[13px]"
          >
            <Download className="w-3.5 h-3.5" aria-hidden />
            Certificate
          </a>
        </div>
      ) : course.status === 'locked' ? (
        <div className="mt-4 flex items-center justify-between gap-2">
          <span className="text-[13px] text-[var(--text-secondary)]">
            Scored {course.score ?? 0}% · ask a manager for a retake
          </span>
        </div>
      ) : (
        <Link href={`/quiz/${course.id}`} className="mt-4 btn-primary justify-center text-[13.5px]">
          Start assessment
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      )}
    </div>
  )
}
