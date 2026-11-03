import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Dwelly Training Portal',
  description: 'The Dwelly internal training portal for property management excellence — 12-month structured learning programme.',
  keywords: ['Dwelly', 'training', 'property management', 'ARLA', 'portal'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
