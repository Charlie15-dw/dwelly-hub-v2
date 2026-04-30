'use client'

import { useState, useRef, useEffect } from 'react'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED_QUESTIONS = [
  'What is the process for serving a Section 8 notice?',
  'How do I complete a Right to Rent check?',
  'What documents do I need before serving an S8 notice?',
  'What are the mandatory grounds for possession?',
  'What is the difference between Ground 8 and Ground 11?',
  'How do I raise a maintenance job in Dwelly?',
]

export default function DobbyPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/dobby', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? `Server error ${res.status}`)
      }

      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.message }])
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      {/* Empty state / intro */}
      {isEmpty && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mb-4 shadow-md">
            <span className="text-3xl" role="img" aria-label="Dobby">🐾</span>
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Ask Dobby</h2>
          <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
            Ask me anything about Dwelly's processes and training. I only use information from the portal, so my answers are accurate to how Dwelly works.
          </p>
          <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-left text-sm text-slate-600 bg-white border border-slate-200 rounded-xl px-4 py-3 hover:border-navy/30 hover:bg-navy/3 hover:text-navy transition-colors leading-snug"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message thread */}
      {!isEmpty && (
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-navy flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 shadow-sm">
                  <span className="text-sm" role="img" aria-label="Dobby">🐾</span>
                </div>
              )}
              <div
                className={cn(
                  'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-navy text-white rounded-tr-sm'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-sm shadow-sm',
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="w-7 h-7 rounded-lg bg-navy flex items-center justify-center flex-shrink-0 mr-2.5 mt-0.5 shadow-sm">
                <span className="text-sm" role="img" aria-label="Dobby">🐾</span>
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

          {/* Error */}
          {error && (
            <div className="flex justify-center">
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}

      {/* Input bar */}
      <div className={cn('px-4 pb-4', isEmpty && 'hidden')}>
        <div className="flex items-end gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-navy/30 focus-within:ring-2 focus-within:ring-navy/10 transition-all">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Dobby a question..."
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none leading-relaxed max-h-32"
            style={{ scrollbarWidth: 'none' }}
            disabled={loading}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className={cn(
              'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
              input.trim() && !loading
                ? 'bg-navy text-white hover:bg-navy/80'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed',
            )}
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" aria-hidden />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          Dobby only uses information from the Dwelly portal. Press Enter to send.
        </p>
      </div>

      {/* Input bar when NOT empty state — also shown in empty state below suggestions */}
      {isEmpty && (
        <div className="px-4 pb-6 max-w-lg mx-auto w-full">
          <div className="flex items-end gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm focus-within:border-navy/30 focus-within:ring-2 focus-within:ring-navy/10 transition-all">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Dobby a question..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none leading-relaxed max-h-32"
              style={{ scrollbarWidth: 'none' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors',
                input.trim()
                  ? 'bg-navy text-white hover:bg-navy/80'
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed',
              )}
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" aria-hidden />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-2">
            Dobby only uses information from the Dwelly portal. Press Enter to send.
          </p>
        </div>
      )}

    </div>
  )
}
