'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

// Sticky "On this page" table of contents with scroll-spy. Headings are derived
// server-side and passed in; this component handles the active-section
// highlight and smooth scrolling.

export default function ArticleTOC({ headings }: { headings: { id: string; text: string }[] }) {
  const [active, setActive] = useState(headings[0]?.id ?? '')

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
    <nav className="hidden xl:block sticky top-6 w-56 flex-shrink-0 self-start" aria-label="On this page">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#AEAEB2] mb-3">On this page</p>
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
