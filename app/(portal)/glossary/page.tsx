'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { GLOSSARY_TERMS, type GlossaryTerm } from '@/lib/glossary-data'

// ── Types & Constants ────────────────────────────────────────────────────────

type GlossaryCategory = GlossaryTerm['category']
type CategoryFilter = 'all' | GlossaryCategory

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: 'all',              label: 'All' },
  { value: 'legal',            label: 'Legal' },
  { value: 'operational',      label: 'Operational' },
  { value: 'financial',        label: 'Financial' },
  { value: 'compliance',       label: 'Compliance' },
  { value: 'tenant-relations', label: 'Tenant Relations' },
]

const CATEGORY_BADGE: Record<GlossaryCategory, string> = {
  legal:            'bg-blue-50 text-blue-700 border border-blue-200',
  operational:      'bg-slate-100 text-slate-600 border border-slate-200',
  financial:        'bg-green-50 text-green-700 border border-green-200',
  compliance:       'bg-amber-50 text-amber-700 border border-amber-200',
  'tenant-relations': 'bg-purple-50 text-purple-700 border border-purple-200',
}

const CATEGORY_LABEL: Record<GlossaryCategory, string> = {
  legal:            'Legal',
  operational:      'Operational',
  financial:        'Financial',
  compliance:       'Compliance',
  'tenant-relations': 'Tenant Relations',
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function firstLetter(term: GlossaryTerm): string {
  return term.term.charAt(0).toUpperCase()
}

function scrollToTerm(termId: string) {
  const el = document.getElementById(`term-${termId}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('ring-2', 'ring-orange', 'ring-offset-2')
    setTimeout(() => el.classList.remove('ring-2', 'ring-orange', 'ring-offset-2'), 1800)
  }
}

// ── Sub-components ───────────────────────────────────────────────────────────

function TermCard({ term, allTerms }: { term: GlossaryTerm; allTerms: GlossaryTerm[] }) {
  return (
    <div
      id={`term-${term.id}`}
      className="card p-5 transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
        <h3 className="text-base font-bold text-navy leading-snug">{term.term}</h3>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex-shrink-0 ${CATEGORY_BADGE[term.category]}`}>
          {CATEGORY_LABEL[term.category]}
        </span>
      </div>

      <p className="text-sm text-slate-600 leading-relaxed mb-3">{term.definition}</p>

      {term.context && (
        <p className="text-sm text-slate-500 italic leading-relaxed mb-3">
          <span className="font-semibold not-italic text-slate-600">Example: </span>
          {term.context}
        </p>
      )}

      {term.relatedTerms.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mr-1">Related:</span>
          {term.relatedTerms.map((relatedName) => {
            const related = allTerms.find(t => t.term === relatedName || t.id === relatedName)
            return related ? (
              <button
                key={relatedName}
                onClick={() => scrollToTerm(related.id)}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium
                           bg-orange/8 text-orange border border-orange/20
                           hover:bg-orange/15 hover:border-orange/40
                           transition-colors cursor-pointer"
              >
                {related.term}
              </button>
            ) : (
              <span
                key={relatedName}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium
                           bg-slate-50 text-slate-400 border border-slate-200"
              >
                {relatedName}
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function GlossaryPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return GLOSSARY_TERMS.filter(term => {
      const matchesCategory = activeCategory === 'all' || term.category === activeCategory
      const matchesQuery = q === '' ||
        term.term.toLowerCase().includes(q) ||
        term.definition.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  // Group by first letter
  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {}
    for (const term of filtered) {
      const letter = firstLetter(term)
      if (!map[letter]) map[letter] = []
      map[letter].push(term)
    }
    return map
  }, [filtered])

  const sortedLetters = Object.keys(grouped).sort()

  // All letters that have at least one term in the full dataset (for jump nav)
  const activeLetters = useMemo(() => {
    const set = new Set<string>()
    for (const term of GLOSSARY_TERMS) set.add(firstLetter(term))
    return set
  }, [])

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  return (
    <div className="space-y-6 pb-12">

      {/* Hero */}
      <div className="rounded-2xl p-6 bg-white border border-slate-100 shadow-sm">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">
              Reference
            </p>
            <h1 className="text-3xl font-bold text-navy tracking-tight">Glossary</h1>
            <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-prose">
              {GLOSSARY_TERMS.length} essential property management terms — from legal notices to compliance
              requirements. Use the search or A–Z jump to find what you need fast.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 bg-orange/8 border border-orange/20 px-4 py-2 rounded-xl">
            <span className="text-2xl font-black text-orange tabular-nums">{GLOSSARY_TERMS.length}</span>
            <span className="text-xs text-slate-500 leading-tight">terms<br />defined</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search terms or definitions…"
          className="input pl-11 pr-11"
          aria-label="Search glossary"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center
                       rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.value
                ? 'bg-orange text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* A-Z jump row */}
      {!query && (
        <div className="flex items-center gap-0.5 flex-wrap overflow-x-auto scrollbar-hide py-1" aria-label="Jump to letter">
          {ALPHABET.map(letter => {
            const hasTerms = activeLetters.has(letter)
            const hasFilteredTerms = sortedLetters.includes(letter)
            return (
              <a
                key={letter}
                href={hasFilteredTerms ? `#letter-${letter}` : undefined}
                onClick={e => { if (!hasFilteredTerms) e.preventDefault() }}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                  hasFilteredTerms
                    ? 'text-orange hover:bg-orange/10 cursor-pointer'
                    : hasTerms
                    ? 'text-slate-300 cursor-default'
                    : 'text-slate-200 cursor-default'
                }`}
                aria-label={`Jump to ${letter}`}
                aria-disabled={!hasFilteredTerms}
              >
                {letter}
              </a>
            )
          })}
        </div>
      )}

      {/* Terms grouped by letter */}
      {sortedLetters.length > 0 ? (
        <div className="space-y-10">
          {sortedLetters.map(letter => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-9 h-9 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-base">{letter}</span>
                </div>
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-xs text-slate-400 font-medium">
                  {grouped[letter].length} {grouped[letter].length === 1 ? 'term' : 'terms'}
                </span>
              </div>
              <div className="space-y-3">
                {grouped[letter].map(term => (
                  <TermCard key={term.id} term={term} allTerms={GLOSSARY_TERMS} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="card p-12 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-slate-400" aria-hidden />
          </div>
          <h3 className="text-base font-bold text-navy mb-1">No terms found</h3>
          <p className="text-sm text-slate-500 max-w-xs">
            No glossary terms match your search for <span className="font-semibold text-navy">"{query}"</span>.
            Try a different word or clear the search to browse all terms.
          </p>
          <button
            onClick={() => { setQuery(''); setActiveCategory('all') }}
            className="mt-5 btn-outline text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
