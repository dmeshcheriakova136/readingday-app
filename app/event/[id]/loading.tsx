export default function EventLoading() {
  return (
    <div style={{ minHeight: '100dvh', background: '#FAF7F0' }}>
      {/* Hero skeleton */}
      <div style={{ background: '#13294B', padding: '48px 20px 28px' }}>
        <div style={{ width: 60, height: 16, borderRadius: 8, background: 'rgba(255,255,255,0.15)', marginBottom: 20 }} />
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.10)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 24, borderRadius: 8, background: 'rgba(255,255,255,0.15)', width: '80%', marginBottom: 12 }} />
            <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.10)', width: '50%', marginBottom: 8 }} />
            <div style={{ height: 13, borderRadius: 6, background: 'rgba(255,255,255,0.10)', width: '60%' }} />
          </div>
        </div>
      </div>

      {/* Content skeletons */}
      <div style={{ padding: '16px 16px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[90, 70, 120, 100].map((h, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 18, height: h, border: '1px solid rgba(20,18,14,0.08)' }} />
        ))}
      </div>
    </div>
  )
}
