// Universal search index for The Hub.
//
// Aggregates every searchable piece of content — video modules, training
// guides, knowledge articles, glossary terms, emergency procedures and
// product updates — into a single flat list of SearchEntry records. The
// command palette (components/hub/CommandPalette.tsx) scores these against
// the user's query entirely client-side; no network/DB calls.

import { MODULES, SECTION_LABELS } from '@/lib/data'
import { TRAINING_PAGES, KNOWLEDGE_ARTICLES, type ContentBlock } from '@/lib/training-content'
import { GLOSSARY_TERMS } from '@/lib/glossary-data'
import { EMERGENCY_PROCEDURES } from '@/lib/emergency-data'
import { HUB_UPDATES } from '@/lib/updates'

export type SearchKind =
  | 'module'
  | 'guide'
  | 'knowledge'
  | 'glossary'
  | 'emergency'
  | 'update'

export interface SearchEntry {
  id: string
  kind: SearchKind
  kindLabel: string
  title: string
  description: string
  href: string
  /** Extra free text folded into matching but not displayed. */
  keywords: string
}

const KIND_LABELS: Record<SearchKind, string> = {
  module: 'Video module',
  guide: 'Training guide',
  knowledge: 'Knowledge base',
  glossary: 'Glossary',
  emergency: 'Emergency',
  update: 'Update',
}

// Pull plain text out of the rich ContentBlock[] used by guides/knowledge so
// the body copy is searchable, not just titles.
function blocksToText(blocks: ContentBlock[]): string {
  const out: string[] = []
  for (const b of blocks) {
    if (b.text) out.push(b.text)
    if (b.items) out.push(b.items.join(' '))
    if (b.headers) out.push(b.headers.join(' '))
    if (b.rows) out.push(b.rows.map(r => r.join(' ')).join(' '))
  }
  return out.join(' ')
}

let cached: SearchEntry[] | null = null

export function getSearchIndex(): SearchEntry[] {
  if (cached) return cached

  const entries: SearchEntry[] = []

  for (const m of MODULES) {
    entries.push({
      id: `module-${m.id}`,
      kind: 'module',
      kindLabel: KIND_LABELS.module,
      title: m.title,
      description: m.description,
      href: `/modules/${m.id}`,
      keywords: [SECTION_LABELS[m.section] ?? m.section, ...m.tags].join(' '),
    })
  }

  for (const p of TRAINING_PAGES) {
    entries.push({
      id: `guide-${p.id}`,
      kind: 'guide',
      kindLabel: KIND_LABELS.guide,
      title: p.title,
      description: p.subtitle,
      href: `/training/${p.id}`,
      keywords: blocksToText(p.content),
    })
  }

  for (const a of KNOWLEDGE_ARTICLES) {
    entries.push({
      id: `knowledge-${a.id}`,
      kind: 'knowledge',
      kindLabel: KIND_LABELS.knowledge,
      title: a.title,
      description: a.subtitle,
      href: `/knowledge/${a.id}`,
      keywords: [a.category, a.difficulty, blocksToText(a.content)].join(' '),
    })
  }

  for (const t of GLOSSARY_TERMS) {
    entries.push({
      id: `glossary-${t.id}`,
      kind: 'glossary',
      kindLabel: KIND_LABELS.glossary,
      title: t.term,
      description: t.definition,
      href: `/glossary#term-${t.id}`,
      keywords: [t.category, t.context, ...t.relatedTerms].join(' '),
    })
  }

  for (const e of EMERGENCY_PROCEDURES) {
    entries.push({
      id: `emergency-${e.id}`,
      kind: 'emergency',
      kindLabel: `${KIND_LABELS.emergency} · ${e.priority}`,
      title: e.title,
      description: e.immediateActions[0] ?? e.priorityLabel,
      href: `/emergency#${e.id}`,
      keywords: [e.priority, e.priorityLabel, ...e.immediateActions, ...e.escalationPath].join(' '),
    })
  }

  for (const u of HUB_UPDATES) {
    entries.push({
      id: `update-${u.id}`,
      kind: 'update',
      kindLabel: KIND_LABELS.update,
      title: u.title,
      description: u.intro ?? '',
      href: '/hub/updates',
      keywords: u.sections.map(s => `${s.heading} ${s.items.map(i => i.text).join(' ')}`).join(' '),
    })
  }

  cached = entries
  return entries
}

// Lightweight relevance scorer. Higher is better; 0 means no match.
// Weights title/exact matches above keyword/body matches so the most
// relevant result surfaces first.
export function scoreEntry(entry: SearchEntry, query: string): number {
  const q = query.trim().toLowerCase()
  if (!q) return 0

  const title = entry.title.toLowerCase()
  const description = entry.description.toLowerCase()
  const keywords = entry.keywords.toLowerCase()
  const terms = q.split(/\s+/).filter(Boolean)

  let score = 0

  // Whole-query signals.
  if (title === q) score += 120
  if (title.startsWith(q)) score += 60
  if (title.includes(q)) score += 40
  if (description.includes(q)) score += 12

  // Per-term signals — every term must appear somewhere to keep the result.
  for (const term of terms) {
    const inTitle = title.includes(term)
    const inDesc = description.includes(term)
    const inKeywords = keywords.includes(term)
    if (!inTitle && !inDesc && !inKeywords) return 0
    if (inTitle) score += 20
    if (inDesc) score += 6
    if (inKeywords) score += 3
  }

  return score
}

export function searchIndex(query: string, limit = 8): SearchEntry[] {
  const q = query.trim()
  if (!q) return []
  return getSearchIndex()
    .map(entry => ({ entry, score: scoreEntry(entry, q) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.entry)
}
