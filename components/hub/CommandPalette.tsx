'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Search, X, GraduationCap, BookOpen, Library, BookA, AlertTriangle, Megaphone, CornerDownLeft, Sparkles,
} from 'lucide-react'
import { useUser } from '@/components/UserProvider'
import { isHubPreview, isCrm2Preview } from '@/lib/preview'
import { searchIndex, type SearchKind } from '@/lib/search-index'

const KIND_ICON: Record<SearchKind, typeof Search> = {
  module: BookOpen,
  guide: GraduationCap,
  knowledge: Library,
  glossary: BookA,
  emergency: AlertTriangle,
  update: Megaphone,
  crm2: Sparkles,
}

const KIND_ACCENT: Record<SearchKind, string> = {
  module: 'text-orange bg-orange/10',
  guide: 'text-teal bg-teal/10',
  knowledge: 'text-gold-700 bg-gold/10',
  glossary: 'text-blue-700 bg-blue-50',
  emergency: 'text-red-600 bg-red-50',
  update: 'text-indigo-700 bg-indigo-100',
  crm2: 'text-[#0071E3] bg-[#0071E3]/10',
}

export default function CommandPalette() {
  const { email, profile } = useUser()
  const isPreview = isHubPreview(email)
  const canSeeCrm2 = isCrm2Preview(email, profile?.role)

  const router = useRouter()
  const pathname = usePathname()
  // Inside the private CRM 2.0 space, scope search to that content only so it
  // stays on topic rather than pulling in the rest of the Hub.
  const crm2Only = Boolean(pathname?.startsWith('/hub/crm-2')) && canSeeCrm2
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(
    () => (open ? searchIndex(query, 8, canSeeCrm2, crm2Only) : []),
    [open, query, canSeeCrm2, crm2Only],
  )

  // Open with Cmd/Ctrl-K; allow other components to open via a custom event.
  useEffect(() => {
    if (!isPreview) return
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    function onOpen() { setOpen(true) }
    window.addEventListener('keydown', onKey)
    window.addEventListener('hub:open-search', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('hub:open-search', onOpen)
    }
  }, [isPreview])

  // Reset and focus when opening; reset highlight as results change.
  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
      // Focus after paint.
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => { setActive(0) }, [query])

  const go = useCallback((href: string) => {
    setOpen(false)
    router.push(href)
  }, [router])

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(i => Math.min(results.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(i => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const r = results[active]
      if (r) go(r.href)
    }
  }

  if (!isPreview || !open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh] bg-navy/30 backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search the Hub"
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder={crm2Only ? 'Search CRM 2.0…' : 'Search modules, guides, knowledge, glossary…'}
            className="flex-1 py-4 text-sm text-navy placeholder:text-slate-400 outline-none bg-transparent"
            aria-label="Search query"
          />
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 transition flex-shrink-0"
            aria-label="Close search"
          >
            <X className="w-4 h-4 text-slate-500" aria-hidden />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {query.trim() === '' ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">
              {crm2Only ? 'Start typing to search CRM 2.0.' : 'Start typing to search across the Hub.'}
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">
              No results for <span className="font-semibold text-navy">&ldquo;{query}&rdquo;</span>.
            </p>
          ) : (
            <ul>
              {results.map((r, i) => {
                const Icon = KIND_ICON[r.kind]
                const isActive = i === active
                return (
                  <li key={r.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(r.href)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-2.5 transition ${
                        isActive ? 'bg-indigo-50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${KIND_ACCENT[r.kind]}`}>
                        <Icon className="w-4 h-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-navy truncate">{r.title}</span>
                        <span className="block text-xs text-slate-400 truncate">{r.description}</span>
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 flex-shrink-0">
                        {r.kindLabel}
                      </span>
                      {isActive && <CornerDownLeft className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" aria-hidden />}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-slate-100 bg-slate-50">
          <span className="text-[11px] text-slate-400">
            <kbd className="font-sans font-semibold">↑↓</kbd> navigate · <kbd className="font-sans font-semibold">↵</kbd> open · <kbd className="font-sans font-semibold">esc</kbd> close
          </span>
          <span className="text-[11px] text-slate-400">{crm2Only ? 'CRM 2.0' : 'The Hub'}</span>
        </div>
      </div>
    </div>
  )
}
