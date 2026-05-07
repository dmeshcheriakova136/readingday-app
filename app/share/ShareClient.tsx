'use client'

import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'

export default function ShareClient({ appUrl }: { appUrl: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(appUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 20px', background: '#FAF7F0',
    }}>
      {/* [UIUC][MAY 7] pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <span style={{
          background: '#13294B', color: '#fff',
          borderRadius: 999, padding: '5px 14px',
          fontSize: 11.5, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>UIUC</span>
        <span style={{
          background: '#E84A27', color: '#fff',
          borderRadius: 999, padding: '5px 14px',
          fontSize: 11.5, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>MAY 7</span>
      </div>

      {/* Card */}
      <div style={{
        background: '#fff', borderRadius: 28, padding: '32px 24px 28px',
        width: '100%', maxWidth: 360, textAlign: 'center',
        border: '1px solid rgba(20,18,14,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        <h1 style={{
          margin: '0 0 6px', fontSize: 30, fontWeight: 800,
          letterSpacing: '-0.035em', color: '#13294B',
        }}>
          Reading <span style={{ color: '#E84A27' }}>Day</span>
        </h1>
        <p style={{ margin: '0 0 28px', fontSize: 14, color: '#8C8678' }}>
          Scan to open on your phone
        </p>

        {/* QR code */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{
            padding: 16, background: '#fff',
            border: '2px solid #FFE0D2', borderRadius: 20,
          }}>
            <QRCodeSVG
              value={appUrl}
              size={196}
              fgColor="#13294B"
              bgColor="#ffffff"
              level="M"
            />
          </div>
        </div>

        {/* URL copy row */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#F4F4F2', borderRadius: 14, padding: '12px 14px',
          marginBottom: 16,
        }}>
          <span style={{
            flex: 1, fontSize: 12, color: '#8C8678',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            fontFamily: '"SF Mono", ui-monospace, monospace',
          }}>{appUrl}</span>
          <button
            onClick={handleCopy}
            style={{
              flexShrink: 0, border: 'none', cursor: 'pointer',
              background: copied ? '#DCE4F5' : '#FFE0D2',
              borderRadius: 10, padding: '7px 14px',
              fontSize: 13, fontWeight: 700,
              color: copied ? '#13294B' : '#E84A27',
              fontFamily: 'inherit',
              transition: 'all 150ms',
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        <p style={{ margin: 0, fontSize: 13, color: '#8C8678', lineHeight: 1.5 }}>
          Share in GroupMe, iMessage, or Instagram —<br />no download needed
        </p>
      </div>

      <p style={{ marginTop: 24, fontSize: 13, color: '#E84A27', fontWeight: 700 }}>
        Good luck on finals, Illini
      </p>
    </div>
  )
}
