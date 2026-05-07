'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

export default function ExportPassportButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch('/api/passport/export')
      if (!res.ok) throw new Error('Failed to generate PDF')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'Dwelly_Competency_Passport.pdf'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="btn-outline flex items-center gap-1.5 text-xs disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading
        ? <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden />
        : <Download className="w-3.5 h-3.5" aria-hidden />
      }
      {loading ? 'Generating…' : 'Export Passport PDF'}
    </button>
  )
}
