'use client'

import { Fragment, useMemo, useState } from 'react'

// Renders a string of lesson copy with CRM 2.0 glossary terms turned into
// subtle, hoverable/tappable definitions — so a reader can check "what does
// Result awaiting mean again?" without leaving the page. To avoid clutter we
// only decorate the first occurrence of each term within a given string.

export interface GlossaryEntry { term: string; definition: string }

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

interface Segment { text: string; def?: string }

function segment(text: string, glossary: GlossaryEntry[]): Segment[] {
  // Longest-first so multi-word terms win. One match per term per string.
  const used = new Set<string>()
  let segments: Segment[] = [{ text }]

  for (const { term, definition } of glossary) {
    const re = new RegExp(`\\b${escapeRegExp(term)}\\b`, 'i')
    const nextSegments: Segment[] = []
    for (const seg of segments) {
      if (seg.def || used.has(term.toLowerCase())) {
        nextSegments.push(seg)
        continue
      }
      const m = seg.text.match(re)
      if (!m || m.index === undefined) {
        nextSegments.push(seg)
        continue
      }
      used.add(term.toLowerCase())
      const before = seg.text.slice(0, m.index)
      const hit = seg.text.slice(m.index, m.index + m[0].length)
      const after = seg.text.slice(m.index + m[0].length)
      if (before) nextSegments.push({ text: before })
      nextSegments.push({ text: hit, def: definition })
      if (after) nextSegments.push({ text: after })
    }
    segments = nextSegments
  }
  return segments
}

function Term({ text, def }: { text: string; def: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="text-[#0071E3] underline decoration-dotted decoration-[#0071E3]/40 underline-offset-2 hover:decoration-[#0071E3] transition"
        aria-label={`Definition of ${text}`}
      >
        {text}
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 bottom-full mb-1.5 z-20 w-64 rounded-xl border border-[#E8E8ED] bg-white shadow-lg p-3 text-left hub-fade"
        >
          <span className="block text-xs font-bold text-[#1D1D1F]">{text}</span>
          <span className="block text-xs text-[#6E6E73] leading-relaxed mt-1">{def}</span>
        </span>
      )}
    </span>
  )
}

export default function GlossaryText({ text, glossary }: { text: string; glossary: GlossaryEntry[] }) {
  const segments = useMemo(() => segment(text, glossary), [text, glossary])
  return (
    <>
      {segments.map((s, i) =>
        s.def
          ? <Term key={i} text={s.text} def={s.def} />
          : <Fragment key={i}>{s.text}</Fragment>,
      )}
    </>
  )
}
