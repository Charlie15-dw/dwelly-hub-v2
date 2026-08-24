import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Award, Sparkles, Star, ShieldCheck } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { canAccessCrm2 } from '@/lib/crm2-access'
import { CRM2_CAPSTONE_MODULE_ID, CRM2_LAST_REVIEWED } from '@/lib/crm2-content'
import PrintButton from '@/components/crm2/PrintButton'

// A printable certificate awarded once the capstone has been passed. It reads
// the capstone result from assessment_results (the same table the assessments
// page uses) and, if there's no pass on record, sends the user back to the
// capstone rather than showing an unearned certificate.
//
// The look is a navy-and-gold "premium award" — brand navy with a gold frame,
// a medallion seal and a ribbon — designed to feel like something worth saving.
// Backgrounds are forced to print via print-color-adjust so the PDF keeps the
// colour, and the page prints landscape.

export default async function Crm2CertificatePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!(await canAccessCrm2(supabase, user))) redirect('/hub')

  const { data: results } = await supabase
    .from('assessment_results')
    .select('score, passed, completed_at')
    .eq('user_id', user.id)
    .eq('assessment_id', CRM2_CAPSTONE_MODULE_ID)
    .eq('passed', true)
    .order('completed_at', { ascending: true })

  const first = results?.[0]
  if (!first) redirect('/hub/crm-2/capstone')

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  const bestScore = Math.max(...(results ?? []).map((r) => r.score ?? 0))
  const earned = first.completed_at
    ? new Date(first.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : CRM2_LAST_REVIEWED
  const name = profile?.full_name?.trim() || (user.email ? user.email.split('@')[0] : 'Team member')
  // A stable, official-looking credential id derived from the user's id.
  const credentialId = `CRM2-${user.id.replace(/-/g, '').slice(0, 8).toUpperCase()}`

  return (
    <div className="space-y-6">
      {/* Print rules — force background colour into the PDF and go landscape. */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { size: A4 landscape; margin: 0; }
              html, body { background: #0B1B3B !important; }
              .cert-print { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              .cert-frame { border-radius: 0 !important; }
            }
          `,
        }}
      />

      {/* Controls — hidden on paper */}
      <div className="print:hidden flex items-center justify-between gap-4">
        <Link href="/hub/crm-2" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] flex items-center gap-1.5 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to CRM 2.0
        </Link>
        <PrintButton label="Print / Save as PDF" />
      </div>

      {/* The gold frame */}
      <div
        className="cert-print cert-frame relative overflow-hidden rounded-[28px] p-[6px]"
        style={{
          background: 'linear-gradient(135deg, #E9C767 0%, #C9A84C 35%, #8A6D2A 60%, #E9C767 100%)',
          printColorAdjust: 'exact',
          WebkitPrintColorAdjust: 'exact',
        }}
      >
        {/* The navy field */}
        <div
          className="relative overflow-hidden rounded-[22px] px-8 py-14 sm:px-14 text-center"
          style={{ background: 'radial-gradient(120% 120% at 50% -10%, #16305F 0%, #0B1B3B 55%, #071026 100%)' }}
        >
          {/* Ambient glow + faint grid — echoes the app's hero */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="absolute -top-24 -right-16 w-[26rem] h-[26rem] rounded-full blur-3xl" style={{ background: 'rgba(230,126,34,0.22)' }} />
            <div className="absolute -bottom-28 -left-16 w-[22rem] h-[22rem] rounded-full blur-3xl" style={{ background: 'rgba(201,168,76,0.18)' }} />
            <div
              className="absolute inset-0 opacity-[0.10]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)',
                backgroundSize: '26px 26px',
                maskImage: 'radial-gradient(ellipse at 50% 0%, #000 0%, transparent 72%)',
                WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, #000 0%, transparent 72%)',
              }}
            />
          </div>

          {/* Inner hairline ring for the double-frame effect */}
          <div className="pointer-events-none absolute inset-3 rounded-[16px] border" style={{ borderColor: 'rgba(201,168,76,0.35)' }} aria-hidden />

          {/* Corner sparkles */}
          <Star className="absolute top-6 left-6 w-4 h-4" style={{ color: 'rgba(233,199,103,0.6)' }} aria-hidden />
          <Star className="absolute top-6 right-6 w-4 h-4" style={{ color: 'rgba(233,199,103,0.6)' }} aria-hidden />
          <Sparkles className="absolute bottom-6 left-6 w-4 h-4" style={{ color: 'rgba(233,199,103,0.5)' }} aria-hidden />
          <Sparkles className="absolute bottom-6 right-6 w-4 h-4" style={{ color: 'rgba(233,199,103,0.5)' }} aria-hidden />

          <div className="relative">
            {/* Medallion seal + ribbon */}
            <div className="relative mx-auto w-24 h-24">
              {/* Ribbon tails */}
              <div className="absolute left-1/2 top-16 -translate-x-1/2 flex gap-1" aria-hidden>
                <div className="w-5 h-14 rotate-6 origin-top" style={{ background: 'linear-gradient(180deg, #E27A22, #B95C10)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)' }} />
                <div className="w-5 h-14 -rotate-6 origin-top" style={{ background: 'linear-gradient(180deg, #E27A22, #B95C10)', clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 78%, 0 100%)' }} />
              </div>
              {/* Seal */}
              <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: 'conic-gradient(from 210deg, #E9C767, #C9A84C, #F3D782, #C9A84C, #E9C767)' }}
              >
                <div className="w-[4.75rem] h-[4.75rem] rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle at 50% 35%, #16305F, #0B1B3B)' }}>
                  <Award className="w-9 h-9" style={{ color: '#F3D782' }} aria-hidden />
                </div>
              </div>
            </div>

            <p className="mt-9 text-[12px] font-semibold uppercase tracking-[0.32em]" style={{ color: '#E9C767' }}>
              Certificate of Completion
            </p>
            <h1 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight text-white leading-[1.05]">
              CRM 2.0 Certified Operator
            </h1>

            <p className="mt-7 text-sm text-white/60">This is proudly awarded to</p>
            <p className="mt-2 text-3xl sm:text-4xl font-bold text-white">{name}</p>
            {/* Gold flourish under the name */}
            <div className="mx-auto mt-3 h-[3px] w-40 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #E9C767, transparent)' }} aria-hidden />

            <p className="mt-6 max-w-xl mx-auto text-[15px] text-white/70 leading-relaxed">
              For completing the CRM 2.0 learning space and passing the capstone assessment —
              demonstrating confident, end-to-end command of the new CRM.
            </p>

            {/* Stats */}
            <div className="mt-10 flex items-center justify-center gap-8 sm:gap-12">
              <div>
                <p className="text-2xl font-bold text-white tabular-nums">{bestScore}%</p>
                <p className="text-[10.5px] uppercase tracking-[0.15em] mt-1" style={{ color: 'rgba(233,199,103,0.75)' }}>Best score</p>
              </div>
              <div className="w-px h-12" style={{ background: 'rgba(201,168,76,0.35)' }} />
              <div>
                <p className="text-2xl font-bold text-white">{earned}</p>
                <p className="text-[10.5px] uppercase tracking-[0.15em] mt-1" style={{ color: 'rgba(233,199,103,0.75)' }}>Awarded</p>
              </div>
              <div className="hidden sm:block w-px h-12" style={{ background: 'rgba(201,168,76,0.35)' }} />
              <div className="hidden sm:block">
                <p className="text-2xl font-bold text-white tabular-nums tracking-tight">{credentialId}</p>
                <p className="text-[10.5px] uppercase tracking-[0.15em] mt-1" style={{ color: 'rgba(233,199,103,0.75)' }}>Credential ID</p>
              </div>
            </div>

            {/* Footer — wordmark + verified badge */}
            <div className="mt-11 flex items-center justify-center gap-3 text-white/55">
              <span className="text-[13px] font-bold tracking-tight text-white">Dwelly</span>
              <span className="w-1 h-1 rounded-full bg-white/30" aria-hidden />
              <span className="text-[12px]">CRM 2.0 Programme</span>
              <span className="w-1 h-1 rounded-full bg-white/30" aria-hidden />
              <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: '#E9C767' }}>
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden /> Verified
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
