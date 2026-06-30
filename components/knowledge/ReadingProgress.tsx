'use client'

import { useEffect, useState } from 'react'

// A slim reading-progress bar pinned to the very top of the viewport. Tracks
// how far down the page the reader has scrolled.

export default function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement
      const height = el.scrollHeight - el.clientHeight
      setPct(height > 0 ? Math.min(100, (el.scrollTop / height) * 100) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 pointer-events-none">
      <div
        className="h-full bg-[#0071E3] transition-[width] duration-150 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
