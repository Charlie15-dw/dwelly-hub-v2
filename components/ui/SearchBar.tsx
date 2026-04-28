'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, BookOpen, FileText, BookA, X } from 'lucide-react'
import { MODULES } from '@/lib/data'
import { KNOWLEDGE_ARTICLES } from '@/lib/training-content'
import { GLOSSARY_TERMS } from '@/lib/glossary-data'
import { cn } from '@/lib/utils'

type ResultItem = {
  id: string
  label: string
  sublabel: string
  href: string
  type: 'module' | 'knowledge' | 'glossary'
}

function buildIndex(): ResultItem[] {
  const items: ResultItem[] = []

  for (const m of MODULES) {
    items.push({
      id: m.id,
      label: m.title,
      sublabel: m.description,
      href: `/modules/${m.id}`,
      type: 'module',
    })
  }

  for (const a of KNOWLEDGE_ARTICLES) {
    items.push({
      id: a.id,
      label: a.title,
      sublabel: a.subtitle,
      href: `/knowledge/${a.id}`,
      type: 'knowledge',
    })
  }

  for (const g of GLOSSARY_TERMS) {
    items.push({
      id: g.id,
      label: g.term,
      sublabel: g.definition.slice(0, 80) + (g.definition.length > 80 ? '…' : ''),
      href: `/glossary#${g.id}`,
      type: 'glossary',
    })
  }

  return items
}

const ALL_ITEMS = buildIndex()

const TYPE_ICON = {
  module: BookOpen,
  knowledge: FileText,
  glossary: BookA,
}

const TYPE_LABEL = {
  module: 'Module',
  knowledge: 'Knowledge',
  glossary: 'Glossary',
}

const TYPE_COLOUR = {
  module: 'text-navy bg-navy/10',
  knowledge: 'text-teal bg-teal/10',
  glossary: 'text-orange bg-orange/10',
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const trimmed = query.trim().toLowerCase()
  const results = trimmed.length < 2
    ? []
    : ALL_ITEMS.filter(item =>
        item.label.toLowerCase().includes(trimmed) ||
        item.sublabel.toLowerCase().includes(trimmed)
      ).slice(0, 8)

  // Reset active index when results change
  useEffect(() => { setActiveIndex(0) }, [trimmed])

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function navigate(item: ResultItem) {
    router.push(item.href)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[activeIndex]) navigate(results[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div ref={containerRef} className="relative hidden md:block w-56">
      <div className={cn(
        'flex items-center gap-2 bg-slate-50 border rounded-lg px-3 py-2 transition-colors',
        open ? 'border-teal/40 bg-white ring-2 ring-teal/10' : 'border-slate-200',
      )}>
        <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" aria-hidden />
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search portal…"
          className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full"
          aria-label="Search portal"
          aria-expanded={open}
          aria-autocomplete="list"
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus() }}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
          <ul role="listbox">
            {results.map((item, i) => {
              const Icon = TYPE_ICON[item.type]
              return (
                <li key={item.id} role="option" aria-selected={i === activeIndex}>
                  <button
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => navigate(item)}
                    className={cn(
                      'w-full flex items-start gap-3 px-3 py-2.5 text-left transition-colors',
                      i === activeIndex ? 'bg-slate-50' : 'hover:bg-slate-50',
                    )}
                  >
                    <div className={cn('mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0', TYPE_COLOUR[item.type])}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy truncate">{item.label}</p>
                      <p className="text-[11px] text-slate-400 truncate">{TYPE_LABEL[item.type]} · {item.sublabel}</p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {open && trimmed.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 z-50">
          <p className="text-sm text-slate-500">No results for <span className="font-medium text-navy">"{query}"</span></p>
        </div>
      )}
    </div>
  )
}
