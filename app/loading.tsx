function SkeletonCard() {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, borderLeft: '4px solid #E5E2DA',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '14px 16px',
      display: 'flex', gap: 14,
    }}>
      <div style={{ width: 52, height: 52, borderRadius: 16, background: '#F0EDE6', flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ height: 16, borderRadius: 8, background: '#F0EDE6', width: '70%' }} />
        <div style={{ height: 13, borderRadius: 8, background: '#F0EDE6', width: '40%' }} />
        <div style={{ height: 22, borderRadius: 999, background: '#F0EDE6', width: '50%' }} />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div>
      {/* Header skeleton */}
      <div style={{ background: '#fff', padding: '40px 20px 16px', borderBottom: '1px solid rgba(20,18,14,0.08)' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 56, height: 22, borderRadius: 999, background: '#DCE4F5' }} />
          <div style={{ width: 56, height: 22, borderRadius: 999, background: '#FBE9DF' }} />
        </div>
        <div style={{ height: 34, borderRadius: 10, background: '#F0EDE6', width: '55%', marginBottom: 8 }} />
        <div style={{ height: 14, borderRadius: 8, background: '#F0EDE6', width: '45%' }} />
      </div>

      {/* Filter bar skeleton */}
      <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid rgba(20,18,14,0.08)' }}>
        <div style={{ height: 38, borderRadius: 999, background: '#F0EDE6', marginBottom: 10 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          {[80, 120, 70, 90, 80].map((w, i) => (
            <div key={i} style={{ width: w, height: 34, borderRadius: 999, background: '#F0EDE6', flexShrink: 0 }} />
          ))}
        </div>
      </div>

      {/* Card skeletons */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 12, borderRadius: 6, background: '#F0EDE6', width: 60, marginBottom: 4 }} />
        {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
      </div>
    </div>
  )
}
