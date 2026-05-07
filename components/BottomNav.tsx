'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, Map, Clock, Share2 } from 'lucide-react'

const tabs = [
  { href: '/',      label: 'Events', icon: List  },
  { href: '/map',   label: 'Map',    icon: Map   },
  { href: '/now',   label: 'Now',    icon: Clock },
  { href: '/share', label: 'Share',  icon: Share2 },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.96)',
      borderTop: '1px solid var(--hair)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      display: 'flex',
    }}>
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href))
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '8px 0 10px', gap: 3, fontSize: 10, fontWeight: 700,
              color: active ? '#E84A27' : '#8C8678',
              textDecoration: 'none', transition: 'color 150ms',
              letterSpacing: '0.01em', textTransform: 'uppercase',
            }}
          >
            <Icon size={21} strokeWidth={active ? 2.5 : 1.8} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
