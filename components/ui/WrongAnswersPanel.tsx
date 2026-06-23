'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, XCircle, CheckCircle2, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface WrongAnswer {
  question: string
  yourAnswer: string
  correctAnswer: string
  rationale: string
  isCorrect?: boolean
}

interface Props {
  userId: string
  moduleId: string
  moduleName: string
  score: number
}

export default function WrongAnswersPanel({ userId, moduleId, moduleName, score }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[] | null>(null)
  const [error, setError] = useState(false)

  async function load() {
    if (wrongAnswers !== null) { setOpen(o => !o); return }
    setOpen(true)
    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('assessment_results')
        .select('answers')
        .eq('user_id', userId)
        .eq('assessment_id', moduleId)
        .eq('passed', false)
        .order('completed_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Stored answers include every question with an isCorrect flag — only
      // show the ones the user actually got wrong.
      const all = (data?.answers as WrongAnswer[]) ?? []
      setWrongAnswers(all.filter(a => a.isCorrect === false))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-2">
      <button
        onClick={load}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-navy transition-colors"
      >
        <BookOpen className="w-3.5 h-3.5" aria-hidden />
        Review incorrect answers
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-slate-100 bg-white overflow-hidden">
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              {moduleName} — {score}% — Incorrect answers
            </p>
          </div>

          {loading && (
            <div className="px-4 py-6 text-center">
              <p className="text-xs text-slate-400">Loading…</p>
            </div>
          )}

          {error && (
            <div className="px-4 py-4">
              <p className="text-xs text-red-500">Failed to load. Try again.</p>
            </div>
          )}

          {!loading && !error && wrongAnswers !== null && wrongAnswers.length === 0 && (
            <div className="px-4 py-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-xs text-slate-500">No wrong answers recorded for this attempt.</p>
            </div>
          )}

          {!loading && !error && wrongAnswers && wrongAnswers.length > 0 && (
            <div className="divide-y divide-slate-50">
              {wrongAnswers.map((wa, i) => (
                <div key={i} className="px-4 py-3 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <XCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden />
                    <p className="text-xs font-semibold text-navy leading-snug">{wa.question}</p>
                  </div>
                  <div className="ml-5 space-y-1">
                    <p className="text-[11px] text-red-500">
                      <span className="font-semibold">Their answer: </span>{wa.yourAnswer}
                    </p>
                    <p className="text-[11px] text-green-700 font-semibold">
                      <span>Correct: </span>{wa.correctAnswer}
                    </p>
                    <p className={cn(
                      'text-[11px] text-slate-500 leading-relaxed bg-slate-50 rounded-lg px-2.5 py-1.5',
                      'border border-slate-100',
                    )}>
                      <span className="font-semibold text-slate-600">Why: </span>{wa.rationale}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
