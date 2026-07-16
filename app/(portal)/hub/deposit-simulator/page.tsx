import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Scale } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { isHubPreview, isHubBeta } from '@/lib/preview'

export default async function DepositSimulatorPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!isHubPreview(user.email)) redirect('/dashboard')
  if (!isHubBeta(user.email)) redirect('/hub')

  return (
    <div className="space-y-5">
      <Link href="/hub" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy transition">
        <ArrowLeft className="w-4 h-4" aria-hidden />
        Back to Hub
      </Link>

      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center border text-orange bg-orange/10 border-orange/20">
          <Scale className="w-5 h-5" aria-hidden />
        </div>
        <div>
          <h1 className="text-xl font-bold text-navy">Deposit Dispute Simulator</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Build a deduction case, choose your evidence, and see how a TDS adjudicator would rule.
            A safe place to practise before it matters for real.
          </p>
        </div>
      </div>

      {/* The simulator is a self-contained app served from /public. Iframing it
          keeps it fully working (its own state, localStorage and sample docs)
          without porting thousands of lines to React. */}
      <div className="card p-0 overflow-hidden">
        <iframe
          src="/deposit-sim/index.html"
          title="Deposit Dispute Simulator"
          className="w-full border-0"
          style={{ height: 'calc(100vh - 220px)', minHeight: '640px' }}
        />
      </div>
    </div>
  )
}
