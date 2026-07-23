'use client'

// Searchable, sortable directory of people (property managers / learners) for
// the manager and admin dashboards. Replaces the old static "scroll the whole
// list" table with an online-shopping style experience: type to filter by name
// or email, filter by RAG status, and sort by score, progress, join date or
// recent activity.
//
// Pure client component — it receives already-computed stats as props and does
// all filtering/sorting in the browser, so no extra Supabase calls are needed.

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, X, ArrowUpDown } from 'lucide-react'
import ProgressBar from '@/components/ui/ProgressBar'
import { cn } from '@/lib/utils'
import { RAG_DOT, RAG_ROW, RAG_LABEL, RAG_TEXT, type RagStatus } from '@/lib/rag'

export interface DirectoryPerson {
  id: string
  displayName: string
  email: string | null
  initials: string
  /** e.g. "Property Manager", "Manager", "Admin" */
  roleLabel: string
  /** Admin view only — the supervisor this learner reports to. */
  managerName?: string | null
  completedCount: number
  progressPct: number
  avgScore: number | null
  rag: RagStatus
  /** ISO timestamp (created_at) or null. */
  joinedTs?: string | null
  /** ISO timestamp of most recent activity, or null. */
  lastActiveTs?: string | null
  /** Where clicking the row navigates. */
  href: string
}

type SortKey =
  | 'status'
  | 'name-asc'
  | 'name-desc'
  | 'score-desc'
  | 'score-asc'
  | 'progress-desc'
  | 'progress-asc'
  | 'joined-desc'
  | 'joined-asc'
  | 'active-desc'

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'status', label: 'Status — needs attention first' },
  { value: 'name-asc', label: 'Name — A to Z' },
  { value: 'name-desc', label: 'Name — Z to A' },
  { value: 'score-desc', label: 'Avg score — high to low' },
  { value: 'score-asc', label: 'Avg score — low to high' },
  { value: 'progress-desc', label: 'Progress — high to low' },
  { value: 'progress-asc', label: 'Progress — low to high' },
  { value: 'joined-desc', label: 'Joined — newest first' },
  { value: 'joined-asc', label: 'Joined — oldest first' },
  { value: 'active-desc', label: 'Recently active' },
]

const STATUS_ORDER: Record<RagStatus, number> = { red: 0, amber: 1, green: 2 }

function fmtDate(ts: string | null | undefined): string {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ts(v: string | null | undefined): number {
  return v ? new Date(v).getTime() : 0
}

interface Props {
  people: DirectoryPerson[]
  totalAssessments: number
  title?: string
  /** Which column to show alongside the name. */
  secondaryColumn?: 'role' | 'manager'
  /** Show the Last Active and Joined columns (manager view has this data). */
  showActivity?: boolean
}

export default function PeopleDirectory({
  people,
  totalAssessments,
  title = 'People',
  secondaryColumn = 'role',
  showActivity = false,
}: Props) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('status')
  const [statusFilter, setStatusFilter] = useState<RagStatus | 'all'>('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = people.filter(p => {
      if (statusFilter !== 'all' && p.rag !== statusFilter) return false
      if (!q) return true
      return (
        p.displayName.toLowerCase().includes(q) ||
        (p.email ?? '').toLowerCase().includes(q) ||
        (p.managerName ?? '').toLowerCase().includes(q)
      )
    })

    const byName = (a: DirectoryPerson, b: DirectoryPerson) =>
      a.displayName.localeCompare(b.displayName)

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'status':
          return STATUS_ORDER[a.rag] - STATUS_ORDER[b.rag] || byName(a, b)
        case 'name-asc':
          return byName(a, b)
        case 'name-desc':
          return byName(b, a)
        case 'score-desc':
          return (b.avgScore ?? -1) - (a.avgScore ?? -1) || byName(a, b)
        case 'score-asc':
          return (a.avgScore ?? Infinity) - (b.avgScore ?? Infinity) || byName(a, b)
        case 'progress-desc':
          return b.progressPct - a.progressPct || byName(a, b)
        case 'progress-asc':
          return a.progressPct - b.progressPct || byName(a, b)
        case 'joined-desc':
          return ts(b.joinedTs) - ts(a.joinedTs) || byName(a, b)
        case 'joined-asc':
          return ts(a.joinedTs) - ts(b.joinedTs) || byName(a, b)
        case 'active-desc':
          return ts(b.lastActiveTs) - ts(a.lastActiveTs) || byName(a, b)
        default:
          return 0
      }
    })

    return list
  }, [people, query, sort, statusFilter])

  const statusChips: { key: RagStatus | 'all'; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: people.length },
    { key: 'green', label: RAG_LABEL.green, count: people.filter(p => p.rag === 'green').length },
    { key: 'amber', label: RAG_LABEL.amber, count: people.filter(p => p.rag === 'amber').length },
    { key: 'red', label: RAG_LABEL.red, count: people.filter(p => p.rag === 'red').length },
  ]

  const headers = [
    secondaryColumn === 'manager' ? 'Manager' : 'Role',
    'Assessments',
    'Progress',
    'Avg Score',
    'Status',
    ...(showActivity ? ['Last Active', 'Joined'] : []),
  ]

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-4 border-b border-slate-100 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-base font-bold text-navy">{title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {filtered.length} of {people.length} {people.length === 1 ? 'person' : 'people'}
              {' · '}{totalAssessments} assessments in programme
            </p>
          </div>

          {/* Sort */}
          <label className="flex items-center gap-2 text-sm">
            <ArrowUpDown className="w-4 h-4 text-slate-400" aria-hidden />
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy
                         focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-9 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status filter chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {statusChips.map(chip => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setStatusFilter(chip.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                  statusFilter === chip.key
                    ? 'border-navy bg-navy text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300',
                )}
              >
                {chip.key !== 'all' && (
                  <span className={cn('w-2 h-2 rounded-full', RAG_DOT[chip.key as RagStatus])} aria-hidden />
                )}
                {chip.label}
                <span className={cn('tabular-nums', statusFilter === chip.key ? 'text-white/70' : 'text-slate-400')}>
                  {chip.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="px-6 py-16 text-center">
          <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-500">No matches</p>
          <p className="text-xs text-slate-400 mt-1">
            {query ? `Nothing matches “${query}”.` : 'No people for this filter.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap" scope="col">
                  Name
                </th>
                {headers.map(h => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap" scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(person => (
                <tr key={person.id} className={cn('transition-colors hover:bg-slate-50/60', RAG_ROW[person.rag])}>
                  {/* Name */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <Link href={person.href} className="flex items-center gap-3 group/name">
                      <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">{person.initials}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy group-hover/name:text-teal transition-colors">{person.displayName}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{person.email ?? '—'}</p>
                      </div>
                    </Link>
                  </td>

                  {/* Role or Manager */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 capitalize">
                      {secondaryColumn === 'manager'
                        ? (person.managerName ?? '—')
                        : person.roleLabel}
                    </span>
                  </td>

                  {/* Assessments */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-base font-bold tabular-nums text-navy">
                      {person.completedCount}<span className="text-slate-300 font-normal text-sm">/{totalAssessments}</span>
                    </span>
                  </td>

                  {/* Progress */}
                  <td className="px-5 py-4">
                    <div className="w-32">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="font-bold text-navy">{person.progressPct}%</span>
                      </div>
                      <ProgressBar
                        value={person.progressPct}
                        size="sm"
                        color={person.progressPct >= 60 ? 'teal' : person.progressPct >= 20 ? 'gold' : 'red'}
                      />
                    </div>
                  </td>

                  {/* Avg score */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    {person.avgScore !== null ? (
                      <span className={cn('text-base font-bold tabular-nums', {
                        'text-teal': person.avgScore >= 80,
                        'text-amber-500': person.avgScore >= 65 && person.avgScore < 80,
                        'text-red-500': person.avgScore < 65,
                      })}>
                        {person.avgScore}%
                      </span>
                    ) : (
                      <span className="text-sm text-slate-400">No attempts</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', RAG_DOT[person.rag])} aria-hidden />
                      <span className={cn('text-sm font-semibold', RAG_TEXT[person.rag])}>
                        {RAG_LABEL[person.rag]}
                      </span>
                    </div>
                  </td>

                  {/* Activity columns */}
                  {showActivity && (
                    <>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-400">{fmtDate(person.lastActiveTs)}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-400">{fmtDate(person.joinedTs)}</span>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
