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
            ? 'bg-[#2C68ED]/10 text-[#2C68ED] border-[#2C68ED]/20'
            : 'bg-white text-[#7D7C86] border-[#E2E2E4] hover:border-[#101010]/30',
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
        saved ? 'text-[#2C68ED]' : 'text-[#AEAEB4] hover:text-[#101010]',
        className,
      )}
    >
      <Bookmark className={cn('w-4 h-4', saved && 'fill-current')} aria-hidden />
    </button>
  )
}
