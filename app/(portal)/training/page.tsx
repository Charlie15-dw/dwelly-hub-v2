import Link from 'next/link'
import { ChevronRight, Clock, BookOpen } from 'lucide-react'
import { TRAINING_PAGES } from '@/lib/training-content'
import ContentCompletionButton from '@/components/hub/ContentCompletionButton'
import { createServerClient } from '@/lib/supabase/server'
import { isHubElevated } from '@/lib/preview'
import ElevatedTrainingIndex from '@/components/training/ElevatedTrainingIndex'
import { cn } from '@/lib/utils'

const COMPLIANCE_IDS = ['compliance', 'auto-vs-hold-compliance']

export default async function TrainingHubPage() {
  // Redesigned readability pass is review-gated to the two elevated accounts.
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (isHubElevated(user?.email)) return <ElevatedTrainingIndex />

  const sorted = [...TRAINING_PAGES].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-8 max-w-5xl">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#101010]">Training Guide</h1>
        <p className="text-[#7D7C86] mt-2 text-base">
          Detailed written guides for every area of the Dwelly platform. Work through each section in order,
          or jump to the area you need. Video guides are separate and linked within each module.
        </p>
      </div>

      {/* Progress strip */}
      <div className="card p-5 flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#101010] flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5 text-white" aria-hidden />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#101010]">
              {sorted.length} training sections
            </p>
            <p className="text-xs text-[#7D7C86] mt-0.5">
              Covering navigation, maintenance, compliance, inspections and more
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#7D7C86]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#101010]" />
            Written guides
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            Compliance-critical
          </span>
        </div>
      </div>

      {/* Section grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sorted.map((page, i) => {
          const isCompliance = COMPLIANCE_IDS.includes(page.id)
          return (
            <Link
              key={page.id}
              href={`/training/${page.id}`}
              className={cn(
                'card card-hover block p-6 group',
                isCompliance && 'border-red-200',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Number */}
                  <div className={cn(
                    'w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0',
                    isCompliance
                      ? 'bg-red-100 text-red-700'
                      : 'bg-[#F2F2F3] text-[#101010]',
                  )}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg leading-none" aria-hidden>{page.icon}</span>
                      <h2 className="text-sm font-bold text-[#101010]">{page.title}</h2>
                      {isCompliance && (
                        <span className="text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7D7C86] leading-relaxed line-clamp-2">
                      {page.subtitle}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="flex items-center gap-1 text-[11px] text-[#AEAEB4]">
                        <Clock className="w-3 h-3" aria-hidden />
                        {page.readTime}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className="w-4 h-4 text-[#AEAEB4] flex-shrink-0 mt-1
                             group-hover:text-[#2C68ED] group-hover:translate-x-0.5 transition-all"
                  aria-hidden
                />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Note */}
      <div className="rounded-2xl bg-[#F2F2F3] border border-[#E2E2E4] p-5">
        <p className="text-sm text-[#7D7C86] leading-relaxed">
          <span className="font-semibold text-[#101010]">Note: </span>
          These written guides are separate to video modules. Video walkthroughs are linked within each
          individual training module on the{' '}
          <Link href="/modules" className="text-[#2C68ED] hover:underline font-medium">
            Modules page
          </Link>
          . Work through both for full understanding.
        </p>
      </div>

      {/* Mark the whole Training Guide as complete */}
      <ContentCompletionButton contentType="training" label="Training Guide" />
    </div>
  )
}
