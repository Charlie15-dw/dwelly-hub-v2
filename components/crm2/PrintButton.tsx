'use client'

import { Printer } from 'lucide-react'

// A print trigger for the standalone printable pages. Hidden when actually
// printing (print:hidden) so it never shows up on the paper/PDF.

export default function PrintButton({ label = 'Print' }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl bg-[#2C68ED] text-white hover:bg-[#3D74EE] transition"
    >
      <Printer className="w-4 h-4" aria-hidden /> {label}
    </button>
  )
}
