import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Award } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isCrm2Preview } from '@/lib/preview'
import { CRM2_CAPSTONE_MODULE_ID, CRM2_LAST_REVIEWED } from '@/lib/crm2-content'
import PrintButton from '@/components/crm2/PrintButton'

// A printable certificate awarded once the capstone has been passed. It reads
// the capstone result from assessment_results (the same table the assessments
// page uses) and, if there's no pass on record, sends the user back to the
// capstone rather than showing an unearned certificate.

export default async function Crm2CertificatePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isCrm2Preview(user.email)) redirect('/hub')

  const { data: results } = await supabase
    .from('assessment_results')
    .select('score, passed, created_at')
    .eq('user_id', user.id)
    .eq('assessment_id', CRM2_CAPSTONE_MODULE_ID)
    .eq('passed', true)
    .order('created_at', { ascending: true })

  const first = results?.[0]
  if (!first) redirect('/hub/crm-2/capstone')

  const bestScore = Math.max(...(results ?? []).map((r) => r.score ?? 0))
  const earned = first.created_at
    ? new Date(first.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : CRM2_LAST_REVIEWED
  const name = user.email ?? 'Team member'

  return (
    <div className="space-y-6">
      {/* Controls — hidden on paper */}
      <div className="print:hidden flex items-center justify-between gap-4">
        <Link href="/hub/crm-2" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] flex items-center gap-1.5 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to CRM 2.0
        </Link>
        <PrintButton label="Print / Save as PDF" />
      </div>

      {/* Certificate */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#0071E3]/20 bg-white px-8 py-12 text-center print:border-[#0071E3]/40">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06]" aria-hidden
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #0071E3 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
            <Award className="w-8 h-8" aria-hidden />
          </div>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0071E3]">Certificate of completion</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#1D1D1F]">CRM 2.0 Certified Operator</h1>
          <p className="mt-4 text-sm text-[#6E6E73]">This certifies that</p>
          <p className="mt-1 text-xl font-bold text-[#1D1D1F]">{name}</p>
          <p className="mt-4 max-w-md mx-auto text-sm text-[#3A3A3C] leading-relaxed">
            has completed the CRM 2.0 learning space and passed the capstone assessment,
            demonstrating confident, end-to-end command of the new CRM.
          </p>
          <div className="mt-8 flex items-center justify-center gap-10">
            <div>
              <p className="text-lg font-bold text-[#1D1D1F] tabular-nums">{bestScore}%</p>
              <p className="text-[11px] uppercase tracking-wider text-[#AEAEB2] mt-0.5">Best score</p>
            </div>
            <div className="w-px h-10 bg-[#E8E8ED]" />
            <div>
              <p className="text-lg font-bold text-[#1D1D1F]">{earned}</p>
              <p className="text-[11px] uppercase tracking-wider text-[#AEAEB2] mt-0.5">Awarded</p>
            </div>
          </div>
          <p className="mt-10 text-[11px] text-[#AEAEB2]">Dwelly · CRM 2.0 learning space</p>
        </div>
      </div>
    </div>
  )
}
