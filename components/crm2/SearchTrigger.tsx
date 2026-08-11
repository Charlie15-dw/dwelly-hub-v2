'use client'

import { Search } from 'lucide-react'

// A visible entry point to the Hub command palette, placed inside the CRM 2.0
// space. Rather than mount a second ⌘K listener, it dispatches the same event
// the global palette already listens for — so there's one palette, one source
// of truth, and CRM 2.0 users see their private lessons in the results.

export default function SearchTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('hub:open-search'))}
      className="w-full flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2.5 text-left text-sm text-white/70 hover:bg-white/15 transition backdrop-blur-sm"
    >
      <Search className="w-4 h-4 flex-shrink-0" aria-hidden />
      <span className="flex-1">Search lessons, sections, glossary…</span>
      <kbd className="hidden sm:inline-flex items-center rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 text-[11px] font-semibold text-white/70">
        ⌘K
      </kbd>
    </button>
  )
}
