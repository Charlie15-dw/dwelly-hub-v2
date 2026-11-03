'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send, RefreshCw, ChevronDown, ChevronUp, Lightbulb,
  Mic, User, Shuffle,
} from 'lucide-react'
import { ROLEPLAY_SCENARIOS, getRandomScenario, type RoleplayScenario } from '@/lib/roleplay-scenarios'
import { SCENARIO_SCRIPTS, matchResponse, advanceStage } from '@/lib/roleplay-engine'
import type { Stage } from '@/lib/roleplay-engine'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const CATEGORY_COLOURS: Record<string, string> = {
  arrears:    'bg-red-50 text-red-700 border-red-200',
  complaint:  'bg-amber-50 text-amber-700 border-amber-200',
  maintenance:'bg-orange-50 text-orange-700 border-orange-200',
  noise:      'bg-violet-50 text-violet-700 border-violet-200',
  eviction:   'bg-slate-100 text-slate-700 border-slate-200',
  renewal:    'bg-[#EEF3FE] text-[#2C68ED] border-[#D5E1FB]',
  deposit:    'bg-emerald-50 text-emerald-700 border-emerald-200',
}

const DIFFICULTY_COLOURS = {
  foundation:   'bg-[#F2F2F3] text-[#7D7C86] border-[#C8C8CC]',
  intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  advanced:     'bg-red-50 text-red-700 border-red-200',
}

// Simulate a brief typing delay so responses feel natural
function fakeTypingDelay(): Promise<void> {
  const ms = 800 + Math.random() * 900
  return new Promise(resolve => setTimeout(resolve, ms))
}

export default function RoleplayChat() {
  const [scenario, setScenario]           = useState<RoleplayScenario>(() => getRandomScenario())
  const [messages, setMessages]           = useState<Message[]>([])
  const [input, setInput]                 = useState('')
  const [loading, setLoading]             = useState(false)
  const [started, setStarted]             = useState(false)
  const [showTip, setShowTip]             = useState(false)
  const [showScenarios, setShowScenarios] = useState(false)
  const [stage, setStage]                   = useState<Stage>('opening')
  const [positiveStreak, setPositiveStreak] = useState(0)
  const usedMessages = useRef<Set<string>>(new Set())
  const turnCount    = useRef(0)
  const bottomRef    = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const startScenario = useCallback(async (sc: RoleplayScenario) => {
    setScenario(sc)
    setMessages([])
    setStarted(true)
    setShowScenarios(false)
    setStage('opening')
    setPositiveStreak(0)
    usedMessages.current = new Set()
    turnCount.current = 0
    setLoading(true)

    // Get the scripted opening line for this scenario
    const script = SCENARIO_SCRIPTS[sc.id]
    const openingMessage = script?.opening ?? `Hi, I need to speak to someone about my tenancy.`

    await fakeTypingDelay()
    setMessages([{ role: 'assistant', content: openingMessage }])
    setLoading(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = input.trim()
    setInput('')

    const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setLoading(true)
    turnCount.current += 1

    let reply: string | null = null

    try {
      const res = await fetch('/api/roleplay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, scenario }),
      })
      const data = await res.json()
      if (data.message) reply = data.message
    } catch {
      // fall through to scripted engine
    }

    // Fall back to scripted engine if AI unavailable
    if (!reply) {
      const script = SCENARIO_SCRIPTS[scenario.id]
      if (script) {
        const { message, newStage } = matchResponse(userMessage, stage, script, positiveStreak, usedMessages.current, turnCount.current)
        const stageOrder = ['tense', 'opening', 'engaged', 'progressing', 'resolving'] as const
        const prevIdx = stageOrder.indexOf(stage)
        const nextIdx = stageOrder.indexOf(newStage)
        if (nextIdx > prevIdx) setPositiveStreak(n => n + 1)
        else if (nextIdx < prevIdx) setPositiveStreak(0)
        setStage(newStage)
        reply = message
      } else {
        reply = "Right... okay. Can you just give me a moment?"
      }
    }

    setMessages(prev => [...prev, { role: 'assistant', content: reply! }])

    setLoading(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const newScenario = () => {
    const next = getRandomScenario(scenario.id)
    startScenario(next)
  }

  // ── Not started yet ───────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="space-y-5">
        {/* Intro card */}
        <div className="rounded-2xl p-6 relative overflow-hidden bg-navy text-white shadow-panel">
          <div className="pointer-events-none absolute -top-16 -right-10 w-56 h-56 rounded-full bg-orange/30 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-orange-400/10 blur-3xl" aria-hidden />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Mic className="w-4 h-4 text-white" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-widest text-white/60">Roleplay Simulator</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-1.5">Practice Difficult Conversations</h3>
            <p className="text-sm text-white/65 leading-relaxed max-w-xl">
              A scripted tenant will open the conversation. You respond as the property manager.
              Each scenario is different — the tenant's mood, issue, and outcome depend on how you handle it.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {['Rent arrears', 'Maintenance complaints', 'Deposit disputes', 'Noise issues', 'Early surrender', 'Damp & mould'].map(t => (
                <span key={t} className="text-xs bg-white/10 border border-white/15 text-white/70 px-2.5 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Random start */}
        <div className="card p-5 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-bold text-[#101010]">Ready to begin?</p>
            <p className="text-xs text-[#7D7C86] mt-0.5">
              A scenario will be randomly assigned — or choose one below.
            </p>
          </div>
          <button
            onClick={() => startScenario(getRandomScenario())}
            className="btn-primary flex items-center gap-2"
          >
            <Shuffle className="w-4 h-4" aria-hidden />
            Start Random Scenario
          </button>
        </div>

        {/* Scenario picker */}
        <div>
          <button
            onClick={() => setShowScenarios(v => !v)}
            className="flex items-center gap-2 text-sm font-semibold text-[#101010] mb-3"
          >
            {showScenarios ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Browse all {ROLEPLAY_SCENARIOS.length} scenarios
          </button>
          {showScenarios && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ROLEPLAY_SCENARIOS.map(sc => (
                <button
                  key={sc.id}
                  onClick={() => startScenario(sc)}
                  className="card card-hover p-4 text-left flex flex-col gap-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-lg">{sc.moodEmoji}</span>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', DIFFICULTY_COLOURS[sc.difficulty])}>
                      {sc.difficulty.charAt(0).toUpperCase() + sc.difficulty.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#101010] leading-snug">{sc.title}</p>
                    <span className={cn('inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border', CATEGORY_COLOURS[sc.category])}>
                      {sc.categoryLabel}
                    </span>
                  </div>
                  <p className="text-xs text-[#7D7C86] leading-relaxed line-clamp-2">{sc.situation.slice(0, 90)}…</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Active chat ───────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Scenario header */}
      <div className="card p-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#101010] flex items-center justify-center flex-shrink-0 text-lg">
              {scenario.moodEmoji}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="text-sm font-bold text-[#101010]">{scenario.tenantName}</p>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', CATEGORY_COLOURS[scenario.category])}>
                  {scenario.categoryLabel}
                </span>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full border', DIFFICULTY_COLOURS[scenario.difficulty])}>
                  {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                </span>
              </div>
              <p className="text-xs text-[#7D7C86]">{scenario.title} · Mood: <span className="font-medium text-[#101010]">{scenario.moodLabel}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTip(v => !v)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                showTip
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-[#F2F2F3] text-[#7D7C86] border-[#C8C8CC] hover:bg-white',
              )}
            >
              <Lightbulb className="w-3.5 h-3.5" /> Coaching tip
            </button>
            <button
              onClick={newScenario}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border bg-[#F2F2F3] text-[#7D7C86] border-[#C8C8CC] hover:bg-white transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> New scenario
            </button>
          </div>
        </div>

        {/* Coaching tip */}
        {showTip && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex gap-2.5">
            <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden />
            <p className="text-xs text-amber-800 leading-relaxed">{scenario.coachingTip}</p>
          </div>
        )}
      </div>

      {/* Chat window */}
      <div className="card overflow-hidden flex flex-col" style={{ height: '480px' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Scenario context banner */}
          <div className="rounded-xl bg-[#F2F2F3] border border-[#E2E2E4] p-3 text-center">
            <p className="text-[11px] text-[#7D7C86] leading-relaxed">
              <span className="font-semibold text-[#101010]">Scenario: </span>{scenario.situation}
            </p>
          </div>

          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn('flex gap-2.5', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-[#101010] flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">
                  {scenario.moodEmoji}
                </div>
              )}
              <div
                className={cn(
                  'max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                  msg.role === 'assistant'
                    ? 'bg-[#F2F2F3] text-[#101010] rounded-tl-sm'
                    : 'bg-[#101010] text-white rounded-tr-sm',
                )}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-[#2C68ED] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-[#101010] flex items-center justify-center flex-shrink-0 text-sm">
                {scenario.moodEmoji}
              </div>
              <div className="bg-[#F2F2F3] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#AEAEB4] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#AEAEB4] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#AEAEB4] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-[#E2E2E4] p-3 flex gap-2.5 items-end bg-white">
          <div className="flex items-center gap-1.5 mr-1">
            <User className="w-3.5 h-3.5 text-[#7D7C86]" aria-hidden />
            <span className="text-[11px] font-medium text-[#7D7C86]">You (PM)</span>
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response as the property manager…"
            rows={1}
            className="flex-1 resize-none text-sm text-[#101010] placeholder:text-[#AEAEB4] bg-[#F2F2F3] border border-[#E2E2E4] rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#2C68ED] focus:ring-2 focus:ring-[#2C68ED]/20 transition-all leading-relaxed"
            style={{ maxHeight: '120px' }}
            onInput={e => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 120) + 'px'
            }}
            disabled={loading}
            aria-label="Your message"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all',
              input.trim() && !loading
                ? 'bg-[#101010] hover:bg-[#404044] text-white'
                : 'bg-[#F2F2F3] text-[#AEAEB4] cursor-not-allowed',
            )}
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" aria-hidden />
          </button>
        </div>
      </div>

      {/* Footer hint */}
      <p className="text-[11px] text-[#AEAEB4] text-center">
        Press <kbd className="font-mono bg-[#F2F2F3] border border-[#E2E2E4] px-1.5 py-0.5 rounded text-[10px]">Enter</kbd> to send · <kbd className="font-mono bg-[#F2F2F3] border border-[#E2E2E4] px-1.5 py-0.5 rounded text-[10px]">Shift + Enter</kbd> for new line · Click "New scenario" to restart with a different situation
      </p>
    </div>
  )
}
