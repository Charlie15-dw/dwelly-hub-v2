import Link from 'next/link'
import { Award, ArrowRight, ChevronRight } from 'lucide-react'

// The gold half of "Prove it". Gold is the product's "earned" colour, so it's
// reserved for the certificate. Progress is shown against guides read — the
// path to being ready for the capstone — and once the capstone is passed the
// card flips to the finished certificate.

export default function CertificateProgress({
  guidesDone,
  guidesTotal,
  hasCertificate,
}: {
  guidesDone: number
  guidesTotal: number
  hasCertificate: boolean
}) {
  const remaining = Math.max(0, guidesTotal - guidesDone)
  const pct = guidesTotal > 0 ? Math.round((guidesDone / guidesTotal) * 100) : 0

  return (
    <div className="relative overflow-hidden card p-6 flex flex-col justify-between">
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }}
        aria-hidden
      />

      <div className="flex items-start gap-4">
        <span
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
          style={{ background: 'linear-gradient(135deg, #E9C767, #C9A84C)' }}
        >
          <Award className="w-6 h-6" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-[18px] font-bold text-navy leading-snug">
            {hasCertificate ? 'Your certificate is ready' : 'Certified Operator'}
          </p>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed">
            {hasCertificate
              ? 'You passed the capstone — view, print or save it as a PDF.'
              : remaining === 0
                ? 'Every guide read — you\u2019re ready for the capstone.'
                : `${remaining} ${remaining === 1 ? 'guide' : 'guides'} to go before you\u2019re ready for the capstone.`}
          </p>
        </div>
      </div>

      {!hasCertificate && (
        <div className="mt-4">
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #E9C767, #C9A84C)' }}
            />
          </div>
        </div>
      )}

      {hasCertificate ? (
        <Link href="/print/crm-2/certificate" target="_blank" className="btn-primary mt-5 self-start">
          View certificate <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      ) : (
        <Link
          href="/hub/crm-2/capstone"
          className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-orange self-start group"
        >
          Go to the capstone
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden />
        </Link>
      )}
    </div>
  )
}
