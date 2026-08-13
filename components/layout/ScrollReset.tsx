'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// The portal shell makes <main> the scroll container (so only the content
// scrolls, not the whole document). That breaks Next.js's default
// scroll-to-top on navigation, which targets the window. This restores it by
// resetting the main scroll region to the top whenever the route changes.
export default function ScrollReset() {
  const pathname = usePathname()

  useEffect(() => {
    document.getElementById('main-content')?.scrollTo({ top: 0 })
  }, [pathname])

  return null
}
