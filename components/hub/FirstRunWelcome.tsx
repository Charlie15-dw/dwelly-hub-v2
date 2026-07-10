'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Sparkles, X, BookOpen, Award, Users } from 'lucide-react'

// One-time welcome for a first-time Hub visitor. A warm, values-framed "here's
// what this is" moment — the cheapest, highest-impact onboarding touch. Shows
// once per browser (persisted in localStorage), then never again unless reset.
// Rendered only for beta testers by the Hub page.

const SEEN_KEY = 'dwelly:hub:welcome-seen:v1'

const POINTS = [
  { icon: BookOpen, title: 'Learn the craft', body: 'Guided training, video modules and a deep knowledge base — everything a great property manager needs.' },
  { icon: Award, title: 'Prove it', body: 'Assessments and a signed-off Competency Passport, built to professional standards.' },
  { icon: Users, title: 'Never stuck', body: 'Ask anything anonymously, get answers, and see what the team\u2019s changing.' },
]

export default function FirstRunWelcome({ firstName }: { firstName: string }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_KEY)) setOpen(true)
    } catch {
      /* localStorage unavailable — skip the welcome rather than block. */
    }
  }, [])

  function dismiss() {
    try { localStorage.setItem(SEEN_KEY, new Date().toISOString()) } catch { /* ignore */ }
    setOpen(false)
  }

  if (!open) return null

  // Portal to <body> so the fixed overlay escapes any transformed/filtered
  // ancestor in the portal shell — otherwise `inset-0` maps to that ancestor's
  // box and the modal centres in the tall page content (off-screen), not the
  // viewport. Guard for SSR: `open` only flips true after mount, so document
  // is available here.
  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm hub-fade"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navy header band */}
        <div className="relative overflow-hidden bg-navy text-white px-7 pt-8 pb-7">
          <div className="pointer-events-none absolute -top-16 -right-10 w-56 h-56 rounded-full bg-orange/30 blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-orange-400/10 blur-3xl" aria-hidden />
          <button
            type="button"
            onClick={dismiss}
            aria-label="Close welcome"
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white transition"
          >
            <X className="w-4 h-4" aria-hidden />
          </button>
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
              <Sparkles className="w-3 h-3" aria-hidden /> Welcome to the Hub
            </span>
            <h2 id="welcome-title" className="text-2xl font-bold mt-4 text-white">
              {firstName ? `Welcome, ${firstName}.` : 'Welcome.'}
            </h2>
            <p className="text-sm text-white/70 mt-2 leading-relaxed">
              This is the home of property management at Dwelly — where you learn the craft,
              master the system and prove your competence. Built to a standard we&rsquo;re proud of.
            </p>
          </div>
        </div>

        {/* Points */}
        <div className="px-7 py-6 space-y-4">
          {POINTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100 text-navy flex-shrink-0">
                <Icon className="w-4 h-4" aria-hidden />
              </div>
              <div>
                <p className="text-sm font-bold text-navy">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="px-7 pb-7">
          <button type="button" onClick={dismiss} className="btn-primary w-full justify-center">
            Let&rsquo;s get started
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
