'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Search, X, ChevronRight, Bookmark, Sparkles, ArrowRight, Clock,
  Scale, MessageCircle, BarChart2, Home, Handshake, MonitorSmartphone, type LucideIcon,
} from 'lucide-react'
import { KNOWLEDGE_ARTICLES, type KnowledgeArticle } from '@/lib/training-content'
import { useSettings } from '@/components/SettingsProvider'
import { cn } from '@/lib/utils'

// Elevated Knowledge Base — "search-first" (handoff). The search field is the
// primary control, not a hero. Subject becomes a filter chip row (rule 03),
// results are rows not a card wall (rule 04). We use the real per-article
// signal we actually have — bookmarks — rather than inventing a read/unread
// state the schema can't back (there is no per-article completion row).

type Category = KnowledgeArticle['category']

const CATEGORY_META: Record<Category, { label: string; icon: LucideIcon; dot: string }> = {
  legal:         { label: 'Legal & Compliance', icon: Scale,         dot: 'bg-red-500' },
  standards:     { label: 'Property Standards', icon: Home,          dot: 'bg-emerald-500' },
  finance:       { label: 'Finance',            icon: BarChart2,     dot: 'bg-amber-500' },
  communication: { label: 'Communication',      icon: MessageCircle, dot: 'bg-[#0071E3]' },
  landlord:      { label: 'Landlord Relations', icon: Handshake,     dot: 'bg-violet-500' },
  portals:       { label: 'Portals',            icon: MonitorSmartphone, dot: 'bg-cyan-500' },
}

// Ordered by how much of the library each covers — legal is the bulk of it.
const CATEGORY_ORDER: Category[] = ['legal', 'standards', 'finance', 'communication', 'landlord', 'portals']

// The cornerstone article surfaced as "Start here" when nothing is filtered.
const FEATURED_ID = 'kb-tenancy-law'

export default function ElevatedKnowledge() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [savedOnly, setSavedOnly] = useState(false)

  const { settings } = useSettings()
  const bookmarks = settings.bookmarks
  const savedCount = bookmarks.length

  const q = query.trim().toLowerCase()
  const isFiltering = q !== '' || category !== 'all' || savedOnly

  const filtered = useMemo(() => {
    return KNOWLEDGE_ARTICLES.filter(a => {
      if (savedOnly && !bookmarks.includes(a.id)) return false
      if (category !== 'all' && a.category !== category) return false
      if (q && !`${a.title} ${a.subtitle}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [q, category, savedOnly, bookmarks])

  const featured = KNOWLEDGE_ARTICLES.find(a => a.id === FEATURED_ID)
  const counts = useMemo(() => {
    const m = {} as Record<Category, number>
    for (const c of CATEGORY_ORDER) m[c] = KNOWLEDGE_ARTICLES.filter(a => a.category === c).length
    return m
  }, [])

  return (
    <div className="space-y-6 max-w-[880px]">
      {/* Header — one H1, one purpose line */}
      <div className="hub-fade space-y-1.5">
        <h1 className="text-[26px] font-semibold text-navy tracking-tight">Knowledge Base</h1>
        <p className="text-[15px] text-[var(--text-secondary)]">
          {KNOWLEDGE_ARTICLES.length} in-depth guides on tenancy law, property standards, finance and communication. Search, or browse by area.
        </p>
      </div>

      {/* Search-first */}
      <div className="hub-fade-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" aria-hidden />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search the knowledge base…"
          className="w-full pl-11 pr-11 py-3.5 text-[15px] rounded-2xl border border-[#D2D2D7] bg-white shadow-sm focus:border-[#0071E3] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/15 transition"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-navy"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Subject filter chips */}
      <div className="hub-fade-1 flex flex-wrap gap-2">
        <Chip active={category === 'all' && !savedOnly} onClick={() => { setCategory('all'); setSavedOnly(false) }}>All areas</Chip>
        {CATEGORY_ORDER.map(c => (
          <Chip key={c} active={category === c} onClick={() => { setCategory(category === c ? 'all' : c); setSavedOnly(false) }}>
            {CATEGORY_META[c].label} · {counts[c]}
          </Chip>
        ))}
        <button
          type="button"
          onClick={() => setSavedOnly(s => !s)}
          aria-pressed={savedOnly}
          className={
            'inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-1.5 rounded-full border transition-colors ' +
            (savedOnly
              ? 'bg-[#0071E3]/10 text-[#0071E3] border-[#0071E3]/30'
              : 'bg-white text-[var(--text-secondary)] border-[#D2D2D7] hover:border-[#0071E3] hover:text-navy')
          }
        >
          <Bookmark className={cn('w-3.5 h-3.5', savedOnly && 'fill-current')} aria-hidden />
          Saved{savedCount > 0 ? ` · ${savedCount}` : ''}
        </button>
      </div>

      {/* Start here — only when nothing is filtered */}
      {!isFiltering && featured && (
        <Link
          href={`/knowledge/${featured.id}`}
          className="hub-fade-2 card card-hover p-6 flex items-start gap-5 group border-[#0071E3]/20 bg-gradient-to-br from-[#F0F7FF] to-white block"
        >
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0071E3] mb-1">
              <Sparkles className="w-3 h-3" aria-hidden /> Start here
            </span>
            <h3 className="text-lg font-semibold text-navy group-hover:text-[#0071E3] transition-colors">{featured.title}</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed line-clamp-2">{featured.subtitle}</p>
            <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] mt-3">
              <Clock className="w-3.5 h-3.5" aria-hidden /> {featured.readTime}
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-[#0071E3] flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" aria-hidden />
        </Link>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm font-semibold text-navy">
            {savedOnly && savedCount === 0 ? 'No saved articles yet' : 'No articles match your search'}
          </p>
          <p className="text-[13px] text-[var(--text-secondary)] mt-1">
            {savedOnly && savedCount === 0
              ? 'Bookmark any article to keep it here for quick access.'
              : 'Try a different term or clear the filters.'}
          </p>
        </div>
      ) : isFiltering ? (
        <div className="hub-fade-2 space-y-3">
          <GroupLabel>{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</GroupLabel>
          <div className="card overflow-hidden">
            {filtered.map(a => <ArticleRow key={a.id} article={a} saved={bookmarks.includes(a.id)} />)}
          </div>
        </div>
      ) : (
        CATEGORY_ORDER.map((c, i) => {
          const articles = KNOWLEDGE_ARTICLES.filter(a => a.category === c && a.id !== FEATURED_ID)
          if (articles.length === 0) return null
          return (
            <div key={c} className={`hub-fade-${Math.min(i + 2, 4)} space-y-3`}>
              <div className="flex items-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', CATEGORY_META[c].dot)} aria-hidden />
                <GroupLabel>{CATEGORY_META[c].label}</GroupLabel>
              </div>
              <div className="card overflow-hidden">
                {articles.map(a => <ArticleRow key={a.id} article={a} saved={bookmarks.includes(a.id)} />)}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'text-[13px] font-medium px-3.5 py-1.5 rounded-full border transition-colors ' +
        (active
          ? 'bg-navy text-white border-navy'
          : 'bg-white text-[var(--text-secondary)] border-[#D2D2D7] hover:border-[#0071E3] hover:text-navy')
      }
    >
      {children}
    </button>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[13px] font-semibold uppercase tracking-widest text-[var(--text-secondary)]">{children}</h2>
}

function ArticleRow({ article, saved }: { article: KnowledgeArticle; saved: boolean }) {
  const cat = CATEGORY_META[article.category]
  return (
    <Link href={`/knowledge/${article.id}`} className="group flex items-center gap-4 px-6 py-[18px] border-t border-slate-100 first:border-t-0 hover:bg-slate-50 transition-colors">
      <span className="w-8 h-8 rounded-lg bg-[#F5F5F7] flex items-center justify-center flex-shrink-0">
        <cat.icon className="w-4 h-4 text-[var(--text-secondary)]" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15.5px] font-semibold text-navy truncate">{article.title}</p>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5 truncate">{article.subtitle}</p>
      </div>
      {saved && <Bookmark className="w-3.5 h-3.5 text-[#0071E3] fill-[#0071E3] flex-shrink-0" aria-label="Saved" />}
      <span className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] flex-shrink-0">
        <Clock className="w-3.5 h-3.5" aria-hidden /> {article.readTime}
      </span>
      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0071E3] transition-colors flex-shrink-0" aria-hidden />
    </Link>
  )
}
