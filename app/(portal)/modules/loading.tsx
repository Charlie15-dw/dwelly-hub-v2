import Skeleton, { SkeletonCard } from '@/components/ui/Skeleton'

export default function ModulesLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-20 rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-16 rounded-xl" />
      <div className="space-y-8">
        {Array.from({ length: 2 }).map((_, s) => (
          <div key={s} className="space-y-3">
            <Skeleton className="w-40 h-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
