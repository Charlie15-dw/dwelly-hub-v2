import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wrench } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { canAccessCrm2 } from '@/lib/crm2-access'
import { isMaintenancePreview } from '@/lib/preview'

// CRM 2.0 → Maintenance. The sibling track to Compliance, reached from the 2.0
// tab chooser. It's an empty shell for now — the guides and video links get
// dropped in here once the content is ready. Gated to the same preview
// allow-list as the rest of the split.
export default async function Crm2MaintenancePage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!(await canAccessCrm2(supabase, user))) redirect('/hub')
  if (!isMaintenancePreview(user.email)) redirect('/hub/crm-2')

  return (
    <div className="mx-auto max-w-[880px] space-y-7 hub-fade">
      <Link
        href="/hub/crm-2"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-navy transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden /> CRM 2.0
      </Link>

      <header className="flex items-start gap-4">
        <span className="w-12 h-12 rounded-2xl bg-navy text-white flex items-center justify-center flex-shrink-0">
          <Wrench className="w-6 h-6" aria-hidden />
        </span>
        <div>
          <h1 className="text-[26px] font-bold text-navy leading-tight tracking-tight">Maintenance</h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1 leading-relaxed">
            The maintenance side of CRM 2.0 — it runs the same agent-led way as compliance.
          </p>
        </div>
      </header>

      <div className="card p-10 text-center">
        <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 bg-navy-50 text-navy">
          <Wrench className="w-7 h-7" aria-hidden />
        </div>
        <h2 className="text-lg font-bold text-navy mb-2">Guides coming soon</h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          The maintenance guides and video walkthroughs will live here. If you&rsquo;re not sure
          how the flow works yet, the shared overview covers both tracks.
        </p>
        <Link
          href="/hub/crm-2/how-it-works"
          className="mt-6 btn-primary inline-flex items-center gap-2"
        >
          How CRM 2.0 works
        </Link>
      </div>
    </div>
  )
}
