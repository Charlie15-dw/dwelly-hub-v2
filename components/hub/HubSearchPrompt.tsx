'use client'

import { Search } from 'lucide-react'

// A full-width search trigger for the Hub landing page. Clicking (or the
// global Cmd/Ctrl-K shortcut) opens the command palette via the shared
// `hub:open-search` event. The palette itself self-gates to preview users.
export default function HubSearchPrompt() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('hub:open-search'))}
      className="group w-full flex items-center gap-3 h-11 px-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition text-left"
      aria-label="Search the Hub"
    >
      <Search className="w-4 h-4 text-slate-400 flex-shrink-0" aria-hidden />
      <span className="flex-1 text-sm text-slate-400">Search modules, guides, knowledge, glossary…</span>
      <kbd className="hidden sm:flex items-center text-[10px] font-sans font-semibold text-slate-400 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5">
        ⌘K
      </kbd>
    </button>
  )
}
