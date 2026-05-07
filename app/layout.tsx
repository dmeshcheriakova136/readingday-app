import type { Metadata } from 'next'
import './globals.css'
import InstallBanner from '@/components/InstallBanner'

export const metadata: Metadata = {
  title: 'UIUC Reading Day 2026',
  description: 'All events, food, and activities on UIUC Reading Day — May 7, 2026',
  manifest: '/manifest.json',
  openGraph: {
    title: 'UIUC Reading Day 2026 🎉',
    description: 'Free food, games, and activities across campus — May 7!',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
      </head>
      <body className="antialiased">
        <div className="phone-outer">
          <div className="phone-device">
            {/* Dynamic Island */}
            <div className="phone-island" aria-hidden="true" />
            <div className="phone-screen">
              <InstallBanner />
              <main className="phone-main">{children}</main>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
