// A minimal, chrome-free layout for printable CRM 2.0 pages. It deliberately
// sits outside the portal layout so printouts don't carry the sidebar, header
// or ambient background — just the content, on white. Each page underneath
// still gates itself to the CRM 2.0 allow-list.

export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-[#1D1D1F]">
      <div className="mx-auto max-w-3xl px-8 py-10 print:px-0 print:py-0">
        {children}
      </div>
    </div>
  )
}
