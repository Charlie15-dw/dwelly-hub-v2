'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// Sticky "On this page" contents list for a training guide. Built from the
// guide's heading blocks (their anchors come from headingAnchor() in
// lib/search-index.ts, rendered as ids on the <h2>s). Tracks the reading
// position within the shell's scroll container (#main-content) to fill a
// progress bar and highlight the section you're currently in.

interface Heading {
  text: string
  anchor: string
}

export default function GuideContents({ headings }: { headings: Heading[] }) {
  const [progress, setProgress] = useState(0)
  const [activeAnchor, setActiveAnchor] = useState<string>(headings[0]?.anchor ?? '')
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const scroller = document.getElementById('main-content')
    if (!scroller) return

    function update() {
      rafRef.current = null
      const el = document.getElementById('main-content')
      if (!el) return

      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0)

      // Active section = the last heading whose top has passed a line ~120px
      // below the top of the scroll viewport.
      const line = el.getBoundingClientRect().top + 120
      let current = headings[0]?.anchor ?? ''
      for (const h of headings) {
        const node = document.getElementById(h.anchor)
        if (node && node.getBoundingClientRect().top <= line) current = h.anchor
      }
      setActiveAnchor(current)
    }

    function onScroll() {
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(update)
    }

    update()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [headings])

  function jumpTo(e: React.MouseEvent, anchor: string) {
    e.preventDefault()
    const node = document.getElementById(anchor)
    if (!node) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    setActiveAnchor(anchor)
  }

  if (headings.length === 0) return null

  return (
    <div className="card p-5 flex flex-col gap-3.5">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2.5">
          <span className="text-[12px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">On this page</span>
          <span className="text-[13px] text-[var(--text-secondary)]">{Math.round(progress)}%</span>
        </div>
        <div className="h-[5px] rounded-full bg-navy-100 overflow-hidden">
          <span
            className="block h-full bg-orange transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col border-t border-navy-100 pt-2.5">
        {headings.map(h => {
          const active = h.anchor === activeAnchor
          return (
            <a
              key={h.anchor}
              href={`#${h.anchor}`}
              onClick={e => jumpTo(e, h.anchor)}
              className={cn(
                'flex items-center gap-2.5 py-1.5 text-[14px] transition-colors',
                active ? 'font-semibold text-orange' : 'font-medium text-[var(--text-secondary)] hover:text-navy',
              )}
            >
              <span
                className={cn(
                  'w-[3px] h-[15px] rounded-sm flex-shrink-0 transition-colors',
                  active ? 'bg-orange' : 'bg-transparent',
                )}
                aria-hidden
              />
              <span className="min-w-0">{h.text}</span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
