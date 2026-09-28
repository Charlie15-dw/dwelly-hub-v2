'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ClipboardCheck, ChevronRight, CheckCircle2, XCircle, RotateCcw, ShieldCheck, Wrench,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// The two-track assessments view. Compliance and Maintenance each become a tab;
// clicking one swaps the list below without a page load. The heavy lifting
// (results, retake grants, question counts) is done server-side and handed down
// as plain data, so this stays a thin presentational client component.

export type AssessmentCard = {
  slug: string
  quizModuleId: string
  title: string
  pillarId: string
  questionCount: number
  state: 'passed' | 'granted' | 'failed' | 'new'
  score?: number
}

export type AssessmentTrack = {
  key: string
  label: string
  icon: 'shield' | 'wrench'
  pillars: { id: string; label: string }[]
  cards: AssessmentCard[]
}

const ICONS = { shield: ShieldCheck, wrench: Wrench } as const

export default function AssessmentTracks({ tracks }: { tracks: AssessmentTrack[] }) {
  const [active, setActive] = useState(tracks[0]?.key ?? '')
  const track = tracks.find((t) => t.key === active) ?? tracks[0]
  if (!track) return null

  return (
    <div className="space-y-6">
      {/* Tabs — only shown when there's more than one track to choose between */}
      {tracks.length > 1 && (
        <div className="flex items-center gap-2 rounded-2xl bg-navy-50 p-1.5">
          {tracks.map((t) => {
            const Icon = ICONS[t.icon]
            const isActive = t.key === track.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                className={cn(
                  'flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition-all',
                  isActive
                    ? 'bg-white text-navy shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-navy',
                )}
                aria-pressed={isActive}
              >
                <Icon className="w-4 h-4" aria-hidden />
                {t.label}
                <span className="text-[12px] font-medium text-[var(--text-tertiary)] tabular-nums">
                  {t.cards.length}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* The active track's checks, grouped by its own pillars */}
      {track.pillars.map(({ id, label }) => {
        const cards = track.cards.filter((c) => c.pillarId === id)
        if (cards.length === 0) return null
        return (
          <div key={id} className="space-y-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{label}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cards.map((card) => {
                const { state, score } = card
                return (
                  <Link
                    key={card.slug}
                    href={`/quiz/${card.quizModuleId}`}
                    className="card card-hover p-5 flex items-center gap-4 group"
                  >
                    <div className={cn(
                      'w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0',
                      state === 'passed' ? 'rag-green' : state === 'failed' ? 'rag-red' : 'bg-orange/10 text-orange',
                    )}>
                      {state === 'passed'
                        ? <CheckCircle2 className="w-5 h-5" aria-hidden />
                        : state === 'failed'
                          ? <XCircle className="w-5 h-5" aria-hidden />
                          : state === 'granted'
                            ? <RotateCcw className="w-5 h-5" aria-hidden />
                            : <ClipboardCheck className="w-5 h-5" aria-hidden />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-navy truncate">{card.title}</p>
                      <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">
                        {card.questionCount} questions · 80% to pass
                      </p>
                    </div>
                    {state === 'passed' ? (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[12px] font-semibold rag-green rounded-full px-2.5 py-1 flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
                        Passed{score !== undefined ? ` · ${score}%` : ''}
                      </span>
                    ) : state === 'granted' ? (
                      <span className="hidden sm:inline-flex items-center gap-2 flex-shrink-0">
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold rag-amber rounded-full px-2.5 py-1">
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden />
                          Retake granted
                        </span>
                        <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-orange group-hover:gap-2 transition-all">
                          Retake <ChevronRight className="w-4 h-4" aria-hidden />
                        </span>
                      </span>
                    ) : state === 'failed' ? (
                      <span className="hidden sm:inline-flex items-center gap-2 flex-shrink-0">
                        <span className="inline-flex items-center gap-1 text-[12px] font-semibold rag-red rounded-full px-2.5 py-1">
                          <XCircle className="w-3.5 h-3.5" aria-hidden />
                          Failed{score !== undefined ? ` · ${score}%` : ''}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-orange group-hover:gap-2 transition-all">
                          Retake <ChevronRight className="w-4 h-4" aria-hidden />
                        </span>
                      </span>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[14px] font-semibold text-orange flex-shrink-0 group-hover:gap-2 transition-all">
                        Start <ChevronRight className="w-4 h-4" aria-hidden />
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
