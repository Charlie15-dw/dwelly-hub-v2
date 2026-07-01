'use client'

import { Bookmark } from 'lucide-react'
import { useSettings } from '@/components/SettingsProvider'
import { cn } from '@/lib/utils'

// A star/bookmark toggle for a Knowledge Base article. Persists via the
// shared settings blob (localStorage + Supabase). Safe to nest inside a
// card Link — it stops the click from bubbling to the parent navigation.
export default function BookmarkButton({
  articleId,
  variant = 'icon',
  className,
}: {
  articleId: string
  variant?: 'icon' | 'labelled'
  className?: string
}) {
  const { isBookmarked, toggleBookmark, loaded } = useSettings()
  const saved = isBookmarked(articleId)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleBookmark(articleId)
  }

  if (variant === 'labelled') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={!loaded}
        aria-pressed={saved}
        className={cn(
          'inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-xl border transition disabled:opacity-50',
          saved
            ? 'bg-[#0071E3]/10 text-[#0071E3] border-[#0071E3]/20'
            : 'bg-white text-[#6E6E73] border-[#E8E8ED] hover:border-[#1D1D1F]/30',
          className,
        )}
      >
        <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} aria-hidden />
        {saved ? 'Saved' : 'Save'}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!loaded}
      aria-pressed={saved}
      aria-label={saved ? 'Remove bookmark' : 'Save article'}
      className={cn(
        'p-1.5 rounded-full transition disabled:opacity-40',
        saved ? 'text-[#0071E3]' : 'text-[#AEAEB2] hover:text-[#1D1D1F]',
        className,
      )}
    >
      <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} aria-hidden />
    </button>
  )
}
