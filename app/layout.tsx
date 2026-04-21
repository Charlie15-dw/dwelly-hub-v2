import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Dwelly Training Portal',
  description: 'The Dwelly internal training portal for property management excellence — 12-month structured learning programme.',
  keywords: ['Dwelly', 'training', 'property management', 'ARLA', 'portal'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
