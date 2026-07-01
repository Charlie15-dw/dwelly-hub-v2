import Skeleton, { SkeletonCard } from '@/components/ui/Skeleton'

export default function KnowledgeLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 rounded-3xl" />
      <Skeleton className="h-24 rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  )
}
