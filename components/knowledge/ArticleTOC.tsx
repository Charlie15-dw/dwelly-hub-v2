'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Sticky "On this page" table of contents with scroll-spy and a reading-progress
// bar. Headings are derived server-side and passed in; this component handles
// the active-section highlight, smooth scrolling and the page-scroll percentage.
//
// `inline` drops the self-positioning wrapper (visibility / sticky / width) so a
// parent layout can own placement — the CRM 2.0 lesson sidebar uses this; the
// Knowledge base renders the standalone default.

export default function ArticleTOC({
  headings,
  inline = false,
}: {
  headings: { id: string; text: string }[]
  inline?: boolean
}) {
  const [active, setActive] = useState(headings[0]?.id ?? '')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-90px 0px -65% 0px', threshold: 0 },
    )
    headings.forEach(h => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setProgress(max > 0 ? Math.min(100, Math.max(0, Math.round((doc.scrollTop / max) * 100))) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  function handleClick(e: React.MouseEvent, id: string) {
    const el = document.getElementById(id)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActive(id)
    history.replaceState(null, '', `#${id}`)
  }

  if (headings.length < 2) return null

  return (
    <nav
      className={cn(!inline && 'hidden xl:block sticky top-6 w-56 flex-shrink-0 self-start')}
      aria-label="On this page"
    >
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#AEAEB2]">On this page</p>
        <span className="text-[11px] font-semibold tabular-nums text-[#AEAEB2]">{progress}%</span>
      </div>
      <div className="h-1 rounded-full bg-[#E8E8ED] overflow-hidden mb-3">
        <div className="h-full bg-[#0071E3] transition-[width] duration-150 ease-out" style={{ width: `${progress}%` }} />
      </div>
      <ul className="border-l border-[#E8E8ED]">
        {headings.map(h => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => handleClick(e, h.id)}
              className={cn(
                'block text-xs leading-snug py-1.5 pl-3 -ml-px border-l transition-colors',
                active === h.id
                  ? 'border-[#0071E3] text-[#0071E3] font-semibold'
                  : 'border-transparent text-[#6E6E73] hover:text-[#1D1D1F]',
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
