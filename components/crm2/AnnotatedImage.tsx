'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Crm2Hotspot } from '@/lib/crm2-content'

// A screenshot with interactive hotspots. Numbered pins sit on top of a static
// CRM 2.0 screenshot; tapping one reveals what that control does. Turns a flat
// image into a guided product tour without needing a video. Pin positions are
// percentages so they stay put as the image scales.

export default function AnnotatedImage({
  src, caption, hotspots,
}: {
  src: string
  caption?: string
  hotspots: Crm2Hotspot[]
}) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <figure className="my-1">
      {/* The image sits in its own overflow-hidden box so the rounded corners
          crop the picture — but the pins and their pop-over panels live in the
          outer, un-clipped `relative` wrapper. Otherwise, on short button-bar
          images the panel opens below the pin, past the image edge, and gets
          clipped away — which reads as "the pins don't do anything". */}
      <div className="relative">
        <div className="rounded-xl border border-[#E8E8ED] overflow-hidden bg-[#F5F5F7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={caption ?? ''} className="w-full h-auto block" loading="lazy" />
        </div>

        {/* Pins */}
        {hotspots.map((h, i) => {
          const isActive = active === i
          return (
            <div
              key={i}
              className="absolute"
              style={{ left: `${h.x}%`, top: `${h.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <button
                type="button"
                onClick={() => setActive(isActive ? null : i)}
                aria-label={h.label}
                aria-expanded={isActive}
                className={cn(
                  'w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shadow-md ring-2 ring-white transition',
                  isActive ? 'bg-[#1D1D1F] text-white scale-110' : 'bg-[#0071E3] text-white hover:scale-110',
                )}
              >
                {i + 1}
              </button>

              {isActive && (
                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-56 z-10 hub-fade">
                  <div className="rounded-xl border border-[#E8E8ED] bg-white shadow-lg p-3">
                    <p className="text-xs font-bold text-[#1D1D1F]">{h.label}</p>
                    <p className="text-xs text-[#6E6E73] leading-relaxed mt-1">{h.detail}</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend + caption */}
      <figcaption className="mt-2 space-y-1.5">
        {caption && (
          <p className="text-xs text-[#6E6E73] text-center leading-relaxed">{caption}</p>
        )}
        <p className="text-[11px] text-[#AEAEB2] text-center">
          Tap a numbered pin to see what each control does.
        </p>
      </figcaption>
    </figure>
  )
}
