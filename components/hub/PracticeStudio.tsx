'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessagesSquare, Sparkles, RotateCcw, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  PRACTICE_SCENARIOS,
  PRACTICE_DIFFICULTY_LABELS,
  type PracticeScenario,
} from '@/lib/practice'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const DIFFICULTY_STYLES: Record<string, string> = {
  foundation: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  advanced: 'bg-rose-100 text-rose-700 border-rose-200',
}

export default function PracticeStudio() {
  const [scenario, setScenario] = useState<PracticeScenario | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [coaching, setCoaching] = useState<string | null>(null)
  const [coachLoading, setCoachLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, coaching, coachLoading])

  function startScenario(s: PracticeScenario) {
    setScenario(s)
    setMessages([{ role: 'assistant', content: s.opening }])
    setCoaching(null)
    setError(null)
    setInput('')
  }

  function reset() {
    setScenario(null)
    setMessages([])
    setCoaching(null)
    setError(null)
    setInput('')
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading || !scenario || coaching) return

    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/hub/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: scenario.id, messages: newMessages, mode: 'roleplay' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Server error ${res.status}`)
      }
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.message }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function getFeedback() {
    if (!scenario || coachLoading) return
    setCoachLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/hub/practice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId: scenario.id, messages, mode: 'coach' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Server error ${res.status}`)
      }
      const data = await res.json()
      setCoaching(data.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not get feedback. Please try again.')
    } finally {
      setCoachLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  // ── Scenario picker ────────────────────────────────────────────────────────
  if (!scenario) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PRACTICE_SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => startScenario(s)}
            className="card p-5 text-left group hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center border bg-orange/10 text-orange border-orange/20">
                <MessagesSquare className="w-4.5 h-4.5" aria-hidden />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border ${DIFFICULTY_STYLES[s.difficulty]}`}>
                {PRACTICE_DIFFICULTY_LABELS[s.difficulty]}
              </span>
            </div>
            <p className="text-sm font-bold text-navy">{s.title}</p>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.summary}</p>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange mt-3 group-hover:gap-1.5 transition-all">
              Start practising
            </span>
          </button>
        ))}
      </div>
    )
  }

  // ── Conversation ───────────────────────────────────────────────────────────
  const personaName = scenario.persona.split(',')[0]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <button onClick={reset} className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition">
          <ArrowLeft className="w-4 h-4" aria-hidden />
          Choose another scenario
        </button>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md border ${DIFFICULTY_STYLES[scenario.difficulty]}`}>
          {PRACTICE_DIFFICULTY_LABELS[scenario.difficulty]}
        </span>
      </div>

      <div className="card p-4">
        <p className="text-sm font-bold text-navy">{scenario.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">You&apos;re speaking with <span className="font-semibold">{personaName}</span>. Respond as you would in real life.</p>
      </div>

      {/* Thread */}
      <div className="space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 shadow-sm">
                <span className="text-[10px] font-bold text-white leading-none">{personaName.slice(0, 2).toUpperCase()}</span>
              </div>
            )}
            <div className={cn(
              'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              msg.role === 'user'
                ? 'bg-navy text-white rounded-tr-sm'
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm',
            )}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 shadow-sm">
              <span className="text-[10px] font-bold text-white leading-none">{personaName.slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center h-4">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        {/* Coaching feedback */}
        {coaching && (
          <div className="card p-5 border-orange/30 bg-orange/[0.03]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-orange flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" aria-hidden />
              </div>
              <p className="text-sm font-bold text-navy">Coaching feedback</p>
            </div>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{coaching}</p>
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange mt-4 hover:gap-2 transition-all"
            >
              <RotateCcw className="w-4 h-4" aria-hidden />
              Practise another
            </button>
          </div>
        )}

        {coachLoading && (
          <div className="card p-5 flex items-center gap-2">
            <div className="flex gap-1 items-center h-4">
              <span className="w-1.5 h-1.5 bg-orange/50 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 bg-orange/50 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 bg-orange/50 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
            <span className="text-sm text-slate-500">Reviewing how you handled that…</span>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input + feedback action */}
      {!coaching && (
        <div className="space-y-3">
          <div className="flex items-end gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-navy/30 focus-within:ring-2 focus-within:ring-navy/10 transition-all">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Reply to ${personaName}…`}
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none leading-relaxed max-h-32"
              style={{ scrollbarWidth: 'none' }}
              disabled={loading || coachLoading}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading || coachLoading}
              className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                input.trim() && !loading && !coachLoading
                  ? 'bg-navy text-white hover:bg-navy/80'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed',
              )}
              aria-label="Send reply"
            >
              <Send className="w-3.5 h-3.5" aria-hidden />
            </button>
          </div>
          {messages.filter(m => m.role === 'user').length > 0 && (
            <button
              onClick={getFeedback}
              disabled={coachLoading}
              className="w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-orange border border-orange/30 bg-orange/[0.03] rounded-xl py-2.5 hover:bg-orange/[0.06] transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" aria-hidden />
              End &amp; get coaching feedback
            </button>
          )}
        </div>
      )}
    </div>
  )
}
