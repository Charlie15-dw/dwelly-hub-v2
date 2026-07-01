'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Search, Clock, ArrowRight, BookOpen, Layers, Sparkles,
  Scale, MessageCircle, BarChart2, Home, Handshake, X, Bookmark, type LucideIcon,
} from 'lucide-react'
import { KNOWLEDGE_ARTICLES, type KnowledgeArticle } from '@/lib/training-content'
import { useSettings } from '@/components/SettingsProvider'
import BookmarkButton from '@/components/knowledge/BookmarkButton'
import { cn } from '@/lib/utils'

type Category = KnowledgeArticle['category']
type Difficulty = KnowledgeArticle['difficulty']

const CATEGORY_META: Record<Category, { label: string; icon: LucideIcon; chip: string; dot: string }> = {
  legal:         { label: 'Legal & Compliance', icon: Scale,         chip: 'bg-red-50 text-red-700 border-red-200',           dot: 'bg-red-500' },
  communication: { label: 'Communication',      icon: MessageCircle, chip: 'bg-[#0071E3]/8 text-[#0071E3] border-[#0071E3]/20', dot: 'bg-[#0071E3]' },
  finance:       { label: 'Finance',            icon: BarChart2,     chip: 'bg-amber-50 text-amber-700 border-amber-200',      dot: 'bg-amber-500' },
  standards:     { label: 'Property Standards', icon: Home,          chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  landlord:      { label: 'Landlord Relations', icon: Handshake,     chip: 'bg-violet-50 text-violet-700 border-violet-200',   dot: 'bg-violet-500' },
}

const CATEGORY_ORDER: Category[] = ['legal', 'communication', 'finance', 'standards', 'landlord']

const DIFFICULTY_META: Record<Difficulty, { label: string; colour: string }> = {
  foundation:   { label: 'Foundation',   colour: 'bg-[#F5F5F7] text-[#6E6E73] border-[#D2D2D7]' },
  intermediate: { label: 'Intermediate', colour: 'bg-amber-50 text-amber-700 border-amber-200' },
  advanced:     { label: 'Advanced',     colour: 'bg-red-50 text-red-700 border-red-200' },
}

const DIFFICULTY_ORDER: Difficulty[] = ['foundation', 'intermediate', 'advanced']

// The cornerstone article surfaced as "Start here" when no filters are active.
const FEATURED_ID = 'kb-tenancy-law'

function readMinutes(readTime: string): number {
  const m = readTime.match(/\d+/)
  return m ? parseInt(m[0], 10) : 0
}

function ArticleCard({ article }: { article: KnowledgeArticle }) {
  const diff = DIFFICULTY_META[article.difficulty]
  const cat = CATEGORY_META[article.category]
  return (
    <Link
      href={`/knowledge/${article.id}`}
      className="card card-hover p-5 flex flex-col gap-3 group"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl" aria-hidden>{article.icon}</span>
        <div className="flex items-center gap-1">
          <span className={cn('text-[10px] font-semibold px-2 py-1 rounded-full border', diff.colour)}>
            {diff.label}
          </span>
          <BookmarkButton articleId={article.id} />
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-[#1D1D1F] leading-snug group-hover:text-[#0071E3] transition-colors">{article.title}</h3>
        <p className="text-xs text-[#6E6E73] mt-1 leading-relaxed line-clamp-2">{article.subtitle}</p>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#E8E8ED]">
        <span className={cn('inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border', cat.chip)}>
          <cat.icon className="w-3 h-3" aria-hidden />
          {cat.label}
        </span>
        <span className="flex items-center gap-1.5 text-[#6E6E73]">
          <Clock className="w-3 h-3" aria-hidden />
          <span className="text-xs">{article.readTime}</span>
        </span>
      </div>
    </Link>
  )
}

export default function KnowledgeExplorer() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [savedOnly, setSavedOnly] = useState(false)

  const { settings } = useSettings()
  const bookmarks = settings.bookmarks
  const savedCount = bookmarks.length

  const totalMinutes = useMemo(
    () => KNOWLEDGE_ARTICLES.reduce((sum, a) => sum + readMinutes(a.readTime), 0),
    [],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return KNOWLEDGE_ARTICLES.filter(a => {
      if (savedOnly && !bookmarks.includes(a.id)) return false
      if (category !== 'all' && a.category !== category) return false
      if (difficulty !== 'all' && a.difficulty !== difficulty) return false
      if (q && !(`${a.title} ${a.subtitle}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [query, category, difficulty, savedOnly, bookmarks])

  const isFiltering = query.trim() !== '' || category !== 'all' || difficulty !== 'all' || savedOnly
  const featured = KNOWLEDGE_ARTICLES.find(a => a.id === FEATURED_ID)

  function clearFilters() {
    setQuery(''); setCategory('all'); setDifficulty('all'); setSavedOnly(false)
  }

  return (
    <div className="space-y-6">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-navy text-white shadow-panel">
        <div className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-[#0071E3]/30 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -left-10 w-72 h-72 rounded-full bg-teal-400/10 blur-3xl" aria-hidden />
        <div className="relative px-7 py-9 sm:px-10 sm:py-10">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-2">Knowledge Base</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Property &amp; Management Knowledge</h2>
          <p className="text-sm text-white/70 mt-2 max-w-2xl leading-relaxed">
            In-depth guides on tenancy law, property standards, finance and communication — the
            reference library that takes you beyond the video modules.
          </p>
          <div className="flex items-center gap-2.5 mt-5 flex-wrap">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" aria-hidden /> {KNOWLEDGE_ARTICLES.length} articles
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <Layers className="w-3.5 h-3.5" aria-hidden /> {CATEGORY_ORDER.length} categories
            </span>
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-xl px-3 py-1.5 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" aria-hidden /> ~{totalMinutes} min of reading
            </span>
          </div>
        </div>
      </section>

      {/* Search + filters */}
      <div className="card p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#AEAEB2]" aria-hidden />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search the knowledge base…"
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-[#E8E8ED] bg-[#F9F9FB] focus:bg-white focus:border-[#0071E3] focus:outline-none focus:ring-2 focus:ring-[#0071E3]/15 transition"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AEAEB2] hover:text-[#1D1D1F]"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCategory('all')}
            className={cn(
              'text-xs font-semibold px-3 py-1.5 rounded-full border transition',
              category === 'all' ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]' : 'bg-white text-[#6E6E73] border-[#E8E8ED] hover:border-[#1D1D1F]/30',
            )}
          >
            All areas
          </button>
          {CATEGORY_ORDER.map(c => {
            const meta = CATEGORY_META[c]
            const on = category === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(on ? 'all' : c)}
                className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition',
                  on ? meta.chip : 'bg-white text-[#6E6E73] border-[#E8E8ED] hover:border-[#1D1D1F]/30',
                )}
              >
                <meta.icon className="w-3 h-3" aria-hidden />
                {meta.label}
              </button>
            )
          })}

          <span className="mx-1 h-5 w-px bg-[#E8E8ED]" aria-hidden />

          {DIFFICULTY_ORDER.map(d => {
            const on = difficulty === d
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(on ? 'all' : d)}
                className={cn(
                  'text-xs font-semibold px-3 py-1.5 rounded-full border transition',
                  on ? DIFFICULTY_META[d].colour : 'bg-white text-[#6E6E73] border-[#E8E8ED] hover:border-[#1D1D1F]/30',
                )}
              >
                {DIFFICULTY_META[d].label}
              </button>
            )
          })}

          <span className="mx-1 h-5 w-px bg-[#E8E8ED]" aria-hidden />

          <button
            type="button"
            onClick={() => setSavedOnly(s => !s)}
            aria-pressed={savedOnly}
            className={cn(
              'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition',
              savedOnly ? 'bg-[#0071E3]/10 text-[#0071E3] border-[#0071E3]/20' : 'bg-white text-[#6E6E73] border-[#E8E8ED] hover:border-[#1D1D1F]/30',
            )}
          >
            <Bookmark className={cn('w-3 h-3', savedOnly && 'fill-current')} aria-hidden />
            Saved{savedCount > 0 ? ` (${savedCount})` : ''}
          </button>

          {isFiltering && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-xs font-medium text-[#0071E3] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Featured — only when not filtering */}
      {!isFiltering && featured && (
        <Link
          href={`/knowledge/${featured.id}`}
          className="card card-hover p-6 flex items-start gap-5 group border-[#0071E3]/20 bg-gradient-to-br from-[#F0F7FF] to-white"
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-[#0071E3]/15 flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
            {featured.icon}
          </div>
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#0071E3] mb-1">
              <Sparkles className="w-3 h-3" aria-hidden /> Start here
            </span>
            <h3 className="text-lg font-bold text-[#1D1D1F] group-hover:text-[#0071E3] transition-colors">{featured.title}</h3>
            <p className="text-sm text-[#6E6E73] mt-1 leading-relaxed line-clamp-2">{featured.subtitle}</p>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#AEAEB2] mt-3">
              <Clock className="w-3.5 h-3.5" aria-hidden /> {featured.readTime}
            </span>
          </div>
          <ArrowRight className="w-5 h-5 text-[#0071E3] flex-shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" aria-hidden />
        </Link>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F5F7] flex items-center justify-center mx-auto mb-3">
            {savedOnly && savedCount === 0
              ? <Bookmark className="w-5 h-5 text-[#AEAEB2]" aria-hidden />
              : <Search className="w-5 h-5 text-[#AEAEB2]" aria-hidden />}
          </div>
          {savedOnly && savedCount === 0 ? (
            <>
              <p className="text-sm font-semibold text-[#1D1D1F]">No saved articles yet</p>
              <p className="text-xs text-[#6E6E73] mt-1">Tap the bookmark icon on any article to save it here for quick access.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-[#1D1D1F]">No articles match your filters</p>
              <p className="text-xs text-[#6E6E73] mt-1">Try a different search term or clear the filters.</p>
            </>
          )}
          <button type="button" onClick={clearFilters} className="btn-outline text-sm mt-4 inline-flex">Clear filters</button>
        </div>
      ) : isFiltering ? (
        <div>
          <p className="text-xs text-[#6E6E73] mb-3">{filtered.length} {filtered.length === 1 ? 'article' : 'articles'}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(a => <ArticleCard key={a.id} article={a} />)}
          </div>
        </div>
      ) : (
        CATEGORY_ORDER.map(c => {
          const articles = KNOWLEDGE_ARTICLES.filter(a => a.category === c)
          if (articles.length === 0) return null
          const meta = CATEGORY_META[c]
          return (
            <div key={c}>
              <div className="flex items-center gap-3 mb-3">
                <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border', meta.chip)}>
                  <meta.icon className="w-3.5 h-3.5" aria-hidden />
                  {meta.label}
                </div>
                <span className="text-xs text-[#AEAEB2]">{articles.length}</span>
                <div className="flex-1 h-px bg-[#E8E8ED]" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {articles.map(a => <ArticleCard key={a.id} article={a} />)}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
