import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { canAccessCrm2 } from '@/lib/crm2-access'
import { getCrm2Lesson, CRM2_LAST_REVIEWED, type Crm2Block } from '@/lib/crm2-content'
import PrintButton from '@/components/crm2/PrintButton'

// A one-page, print-optimised version of the CRM 2.0 cheatsheet — the "when X,
// do Y" tables on white, ready to print or save to PDF and pin by the desk.
// Pulls straight from the cheatsheet lesson so it never drifts from the source.

export default async function Crm2CheatsheetPrintPage() {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  if (!(await canAccessCrm2(supabase, user))) redirect('/hub')

  const lesson = getCrm2Lesson('cheatsheet')
  if (!lesson) redirect('/hub/crm-2')

  const tables = lesson.content.filter(
    (b): b is Crm2Block & { headers: string[]; rows: string[][] } =>
      b.type === 'table' && !!b.headers && !!b.rows,
  )
  // Headings paired with the table that follows, so each table keeps its title.
  const sections: { title: string | null; table: Crm2Block & { headers: string[]; rows: string[][] } }[] = []
  let pendingHeading: string | null = null
  for (const b of lesson.content) {
    if (b.type === 'heading' && b.text) pendingHeading = b.text
    if (b.type === 'table' && b.headers && b.rows) {
      sections.push({ title: pendingHeading, table: b as Crm2Block & { headers: string[]; rows: string[][] } })
      pendingHeading = null
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls — hidden on paper */}
      <div className="print:hidden flex items-center justify-between gap-4">
        <Link href="/hub/crm-2/cheatsheet" className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] flex items-center gap-1.5 transition">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to the lesson
        </Link>
        <PrintButton label="Print / Save as PDF" />
      </div>

      {/* Title */}
      <header className="border-b border-[#E8E8ED] pb-4">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-[#0071E3]">
          <span aria-hidden>{lesson.icon}</span> CRM 2.0 · Quick reference
        </div>
        <h1 className="text-2xl font-bold tracking-tight mt-1.5">{lesson.title}</h1>
        <p className="text-sm text-[#6E6E73] mt-1">The most common “when X, do Y” calls, on one page. Reviewed {CRM2_LAST_REVIEWED}.</p>
      </header>

      {sections.length === 0 && (
        <p className="text-sm text-[#6E6E73]">This lesson has no tables to print.</p>
      )}

      {sections.map((s, i) => (
        <section key={i} className="space-y-2 break-inside-avoid">
          {s.title && <h2 className="text-sm font-bold text-[#1D1D1F]">{s.title}</h2>}
          <table className="w-full text-left border border-[#E8E8ED] text-[13px]">
            <thead>
              <tr className="bg-[#F5F5F7]">
                {s.table.headers.map((h, j) => (
                  <th key={j} className="border border-[#E8E8ED] px-3 py-2 font-semibold text-[#6E6E73] uppercase text-[11px] tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.table.rows.map((row, j) => (
                <tr key={j} className="break-inside-avoid">
                  {row.map((cell, k) => (
                    <td key={k} className="border border-[#E8E8ED] px-3 py-2 align-top leading-relaxed">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      <footer className="pt-2 text-[11px] text-[#AEAEB2]">
        Dwelly · CRM 2.0 learning space · This is a summary — the full reasoning lives in the feature lessons.
      </footer>
    </div>
  )
}
