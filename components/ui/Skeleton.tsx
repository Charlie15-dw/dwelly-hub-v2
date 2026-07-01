import { cn } from '@/lib/utils'

// A single shimmering placeholder block. Compose these inside a page's
// loading.tsx to mirror the shape of the content that's about to load.
export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-[#E8E8ED]', className)}
      aria-hidden
    />
  )
}

// A card-shaped skeleton — matches the app's `.card` surface, useful for
// grids of module / article / stat cards.
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('card p-5 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <Skeleton className="w-8 h-8 rounded-xl" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="w-3/4 h-4" />
      <Skeleton className="w-full h-3" />
      <Skeleton className="w-1/2 h-3" />
    </div>
  )
}
