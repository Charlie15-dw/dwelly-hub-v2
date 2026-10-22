'use client'

import { Download, Home, Check } from 'lucide-react'

// Dwelly's own course certificate — its own design, not a copy of anyone else's.
// A navy credential card with a gold rule and a teal seal, using the brand
// palette from the printed Competency Passport (navy #1B2A4A, teal #6ECFCC,
// gold #C9A84C). Shown on screen when a learner passes a knowledge-base course,
// with a one-click download of the matching PDF.

const NAVY = '#1B2A4A'
const TEAL = '#6ECFCC'
const GOLD = '#C9A84C'

export default function CourseCertificate({
  courseId,
  certificateTitle,
  learnerName,
  completedAt,
}: {
  courseId: string
  certificateTitle: string
  learnerName: string
  completedAt: Date
}) {
  const dateLabel = completedAt.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  return (
    <div className="space-y-4">
      {/* The credential */}
      <div
        className="relative overflow-hidden rounded-3xl text-center px-8 py-10 shadow-panel"
        style={{ backgroundColor: NAVY }}
      >
        {/* Gold top rule */}
        <span
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: `linear-gradient(90deg, ${GOLD}, ${TEAL}, ${GOLD})` }}
          aria-hidden
        />
        {/* Inner gold frame */}
        <div
          className="absolute inset-4 rounded-2xl pointer-events-none"
          style={{ border: `1px solid rgba(201,168,76,0.35)` }}
          aria-hidden
        />

        <div className="relative space-y-5">
          {/* Seal */}
          <div className="flex justify-center">
            <span
              className="relative flex items-center justify-center w-20 h-20 rounded-2xl"
              style={{ backgroundColor: 'rgba(110,207,204,0.14)', border: `1.5px solid ${TEAL}` }}
            >
              <Home className="w-9 h-9" style={{ color: TEAL }} aria-hidden />
              <span
                className="absolute -bottom-2 -right-2 flex items-center justify-center w-7 h-7 rounded-full"
                style={{ backgroundColor: GOLD }}
              >
                <Check className="w-4 h-4 text-white" strokeWidth={3} aria-hidden />
              </span>
            </span>
          </div>

          <p
            className="text-[11px] font-bold uppercase tracking-[0.28em]"
            style={{ color: GOLD }}
          >
            Dwelly Certified
          </p>

          <div className="space-y-1">
            <p className="text-[13px] text-white/60">This certifies that</p>
            <p className="text-[26px] font-semibold text-white leading-tight">{learnerName}</p>
          </div>

          <p className="text-[14px] text-white/70 max-w-sm mx-auto leading-relaxed">
            has successfully completed the assessment and is certified in{' '}
            <span className="font-semibold text-white">{certificateTitle}</span>.
          </p>

          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="text-center">
              <p className="text-[12px] text-white/50">Date</p>
              <p className="text-[13px] font-medium text-white/90">{dateLabel}</p>
            </div>
            <span className="w-px h-8" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} aria-hidden />
            <div className="text-center">
              <p className="text-[12px] text-white/50">Issued by</p>
              <p className="text-[13px] font-medium text-white/90">The Hub · Dwelly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download */}
      <a
        href={`/api/certificate?course=${encodeURIComponent(courseId)}`}
        className="btn-primary w-full justify-center"
      >
        <Download className="w-4 h-4" aria-hidden />
        Download certificate (PDF)
      </a>
    </div>
  )
}
