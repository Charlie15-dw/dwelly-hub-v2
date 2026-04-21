import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short',
  })
}

export function daysUntil(dateString: string): number {
  const now = new Date()
  const target = new Date(dateString)
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getPhaseColor(phase: string): string {
  const map: Record<string, string> = {
    foundation: 'phase-foundation',
    onboarding: 'phase-onboarding',
    embedding:  'phase-embedding',
    optimise:   'phase-optimise',
  }
  return map[phase] ?? 'bg-slate-100 text-slate-600 border-slate-200'
}

export function getRAGColor(status: string): string {
  const map: Record<string, string> = {
    red:   'rag-red',
    amber: 'rag-amber',
    green: 'rag-green',
  }
  return map[status] ?? 'bg-slate-100 text-slate-600'
}

export function getRAGLabel(status: string): string {
  return { red: 'Needs Attention', amber: 'In Progress', green: 'On Track' }[status] ?? status
}

export function getRoleIcon(role: string): string {
  return { property_manager: '🏠', maintenance_coordinator: '🔧', lettings_negotiator: '📋' }[role] ?? '👤'
}
