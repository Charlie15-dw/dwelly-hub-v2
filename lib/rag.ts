/** Shared RAG (Red / Amber / Green) status logic — single source of truth */

export type RagStatus = 'green' | 'amber' | 'red'

export function ragStatus(progressPct: number): RagStatus {
  if (progressPct >= 60) return 'green'
  if (progressPct >= 20) return 'amber'
  return 'red'
}

export const RAG_DOT: Record<RagStatus, string> = {
  red:   'bg-red-500',
  amber: 'bg-amber-400',
  green: 'bg-green-500',
}

export const RAG_ROW: Record<RagStatus, string> = {
  red:   'border-red-200 bg-red-50/40',
  amber: 'border-amber-200 bg-amber-50/40',
  green: 'border-teal/20 bg-teal/3',
}

export const RAG_LABEL: Record<RagStatus, string> = {
  green: 'On Track',
  amber: 'In Progress',
  red:   'Needs Attention',
}

export const RAG_TEXT: Record<RagStatus, string> = {
  green: 'text-green-700',
  amber: 'text-amber-700',
  red:   'text-red-700',
}
