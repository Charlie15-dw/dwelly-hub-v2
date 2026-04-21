'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'
import { MODULES } from '@/lib/data'
import { cn } from '@/lib/utils'

const VIDEO_SECTIONS = [
  { id: 'maintenance',          label: 'Maintenance',              icon: '🔧' },
  { id: 'compliance',           label: 'Compliance',               icon: '⚖️' },
  { id: 'move-outs',            label: 'Move-Outs',                icon: '📦' },
  { id: 'inspections',          label: 'Inspections',              icon: '🔍' },
  { id: 'support',              label: 'Support',                  icon: '🤝' },
] as const

type SectionId = typeof VIDEO_SECTIONS[number]['id']

export default function VideoLibraryTabs() {
  const [active, setActive] = useState<SectionId | 'all'>('all')

  const visibleSections = active === 'all'
    ? VIDEO_SECTIONS
    : VIDEO_SECTIONS.filter(s => s.id === active)

  return (
    <>
      {/* Tab bar */}
      <div className="flex items-center gap-2 flex-wrap mb-5">
        <button
          onClick={() => setActive('all')}
          className={cn(
            'text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors',
            active === 'all'
              ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
              : 'bg-white text-[#6E6E73] border-[#D2D2D7] hover:border-[#AEAEB2] hover:text-[#1D1D1F]'
          )}
        >
          All Sections
        </button>
        {VIDEO_SECTIONS.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            className={cn(
              'text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors',
              active === s.id
                ? 'bg-[#1D1D1F] text-white border-[#1D1D1F]'
                : 'bg-white text-[#6E6E73] border-[#D2D2D7] hover:border-[#AEAEB2] hover:text-[#1D1D1F]'
            )}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Section grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {visibleSections.map(section => {
          const sectionModules = MODULES.filter(m => m.section === section.id)
          const previewModules = sectionModules.slice(0, 3)

          return (
            <div
              key={section.id}
              className="rounded-xl border border-[#E8E8ED] bg-white p-4 flex flex-col gap-3"
            >
              {/* Section header */}
              <div className="flex items-center gap-2.5">
                <span className="text-xl leading-none" aria-hidden>{section.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#1D1D1F] leading-tight">{section.label}</p>
                  <p className="text-[11px] text-[#6E6E73] mt-0.5">
                    {sectionModules.length} module{sectionModules.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Module links */}
              <div className="space-y-0.5">
                {previewModules.map(m => (
                  <Link
                    key={m.id}
                    href={`/modules/${m.id}`}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-[#F5F5F7] transition-colors group"
                  >
                    <Play className="w-3 h-3 text-[#4F46E5] flex-shrink-0" aria-hidden />
                    <span className="text-xs text-[#1D1D1F] flex-1 leading-snug line-clamp-2 min-w-0">
                      {m.title}
                    </span>
                    <span className="text-[10px] font-semibold text-[#4F46E5] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1">
                      Rewatch
                    </span>
                  </Link>
                ))}
              </div>

              {sectionModules.length > 3 && (
                <Link
                  href="/modules"
                  className="text-xs text-[#4F46E5] font-medium hover:underline mt-auto pt-1"
                >
                  +{sectionModules.length - 3} more →
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
