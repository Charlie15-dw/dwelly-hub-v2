'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Send, Plus, MessageSquare, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ConversationMeta {
  id: string
  title: string
  updated_at: string
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
  const supabase = useMemo(() => createClient(), [])

  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<ConversationMeta[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // On first load, pull the user's conversation list and reopen the most recent
  // chat so it isn't lost between visits.
  useEffect(() => {
    let active = true
    ;(async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!active) return
      if (!user) { setHydrated(true); return }
      setUserId(user.id)

      const { data: convs } = await supabase
        .from('dobby_conversations')
        .select('id, title, updated_at')
        .order('updated_at', { ascending: false })
      if (!active) return
      const list = (convs ?? []) as ConversationMeta[]
      setConversations(list)

      if (list.length > 0) {
        const { data: msgs } = await supabase
          .from('dobby_messages')
          .select('role, content')
          .eq('conversation_id', list[0].id)
          .order('created_at', { ascending: true })
        if (!active) return
        setMessages((msgs ?? []).map(m => ({ role: m.role as Message['role'], content: m.content })))
        setCurrentId(list[0].id)
      }
      setHydrated(true)
    })()
    return () => { active = false }
  }, [supabase])

  async function createConversation(title: string): Promise<string | null> {
    if (!userId) return null
    const { data } = await supabase
      .from('dobby_conversations')
      .insert({ user_id: userId, title: title.slice(0, 80) })
      .select('id, title, updated_at')
      .single()
    if (!data) return null
    const meta = data as ConversationMeta
    setConversations(prev => [meta, ...prev])
    setCurrentId(meta.id)
    return meta.id
  }

  async function persistMessage(conversationId: string, role: Message['role'], content: string) {
    if (!userId) return
    await supabase.from('dobby_messages').insert({ conversation_id: conversationId, user_id: userId, role, content })
  }

  // Bump a conversation to the top of the list after new activity.
  async function touchConversation(conversationId: string) {
    const now = new Date().toISOString()
    await supabase.from('dobby_conversations').update({ updated_at: now }).eq('id', conversationId)
    setConversations(prev => {
      const found = prev.find(c => c.id === conversationId)
      if (!found) return prev
      return [{ ...found, updated_at: now }, ...prev.filter(c => c.id !== conversationId)]
    })
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    // Ensure we have a conversation to attach this to (created on first message).
    let convId = currentId
    if (!convId) convId = await createConversation(trimmed)
    if (convId) persistMessage(convId, 'user', trimmed)

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
      if (convId) {
        await persistMessage(convId, 'assistant', data.message)
        touchConversation(convId)
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function openConversation(id: string) {
    setShowHistory(false)
    if (id === currentId) return
    setError(null)
    const { data } = await supabase
      .from('dobby_messages')
      .select('role, content')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
    setMessages((data ?? []).map(m => ({ role: m.role as Message['role'], content: m.content })))
    setCurrentId(id)
  }

  function newChat() {
    setMessages([])
    setCurrentId(null)
    setError(null)
    setShowHistory(false)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  async function deleteConversation(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    setConversations(prev => prev.filter(c => c.id !== id))
    if (id === currentId) {
      setMessages([])
      setCurrentId(null)
    }
    await supabase.from('dobby_conversations').delete().eq('id', id)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const isEmpty = hydrated && messages.length === 0

  const historyList = (
    <>
      <div className="px-3 py-3 border-b border-slate-100">
        <button
          onClick={newChat}
          className="w-full flex items-center gap-2 rounded-xl bg-navy text-white text-sm font-semibold px-3 py-2.5 hover:bg-navy/80 transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden /> New chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="text-xs text-slate-400 px-2 py-3 text-center">No previous chats yet.</p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map(c => (
              <li key={c.id}>
                <button
                  onClick={() => openConversation(c.id)}
                  className={cn(
                    'group w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                    c.id === currentId ? 'bg-navy/5 text-navy font-medium' : 'text-slate-600 hover:bg-slate-50',
                  )}
                >
                  <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" aria-hidden />
                  <span className="truncate flex-1" title={c.title}>{c.title}</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => deleteConversation(c.id, e)}
                    onKeyDown={(e) => { if (e.key === 'Enter') deleteConversation(c.id, e as unknown as React.MouseEvent) }}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all flex-shrink-0"
                    aria-label={`Delete chat: ${c.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )

  return (
    <div className="flex h-full">

      {/* History drawer — mobile */}
      {showHistory && (
        <>
          <div className="md:hidden fixed inset-0 z-40 bg-navy/30" onClick={() => setShowHistory(false)} />
          <aside className="md:hidden fixed inset-y-0 right-0 z-50 w-72 flex flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
              <span className="text-sm font-bold text-navy">Chats</span>
              <button onClick={() => setShowHistory(false)} aria-label="Close history" className="text-slate-400 hover:text-navy">
                <X className="w-4 h-4" aria-hidden />
              </button>
            </div>
            {historyList}
          </aside>
        </>
      )}

      {/* Main chat column */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-slate-100">
          <button
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600"
          >
            <MessageSquare className="w-4 h-4" aria-hidden /> Chats
          </button>
          <button
            onClick={newChat}
            className="flex items-center gap-1 text-sm font-semibold text-navy"
          >
            <Plus className="w-4 h-4" aria-hidden /> New
          </button>
        </div>

        {/* Empty state / intro */}
        {isEmpty && (
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mb-4 shadow-md">
              <span className="text-3xl" role="img" aria-label="Dobby">🐾</span>
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">Ask Dobby</h2>
            <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
              Ask me anything about UK residential lettings and how Dwelly works. Your chats are saved, so you can come back and pick up where you left off.
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
                    'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
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
        <div className={cn('px-4 pb-4', isEmpty && 'pb-6 max-w-lg mx-auto w-full')}>
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
            Dobby is an assistant and can make mistakes. Check anything important. Press Enter to send.
          </p>
        </div>
      </div>

      {/* History sidebar — desktop (right) */}
      <aside className="hidden md:flex md:flex-col w-64 flex-shrink-0 border-l border-slate-200 bg-white">
        {historyList}
      </aside>
    </div>
  )
}
