import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', background: '#FAF7F0', textAlign: 'center',
    }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🗺️</div>
      <h1 style={{ margin: '0 0 8px', fontSize: 26, fontWeight: 800, color: '#13294B', letterSpacing: '-0.03em' }}>
        Page not found
      </h1>
      <p style={{ margin: '0 0 28px', fontSize: 15, color: '#8C8678' }}>
        This spot isn&apos;t on the map.
      </p>
      <Link href="/" style={{
        background: '#E84A27', color: '#fff',
        borderRadius: 999, padding: '12px 28px',
        fontSize: 15, fontWeight: 700, textDecoration: 'none',
        letterSpacing: '-0.01em',
      }}>
        Back to Events
      </Link>
    </div>
  )
}
