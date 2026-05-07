import { notFound } from 'next/navigation'
import Link from 'next/link'
import events from '@/data/events.json'
import type { Event } from '@/lib/types'
import { formatTimeRange, getFeatureChips } from '@/lib/utils'
import Glyph, { ICON_FOR, PIN_COLOR, TILE_TINT } from '@/components/Glyph'

const foodTypeLabel: Record<string, string> = {
  meal:           'Meal',
  drinks:         'Free Drinks',
  snacks:         'Free Snacks',
  treats:         'Treats',
  coffee:         'Free Coffee',
  'care-package': 'Care Package',
  samples:        'Free Samples',
}

export async function generateStaticParams() {
  return (events as Event[]).map(e => ({ id: String(e.id) }))
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = (events as Event[]).find(e => e.id === Number(id))
  if (!event) notFound()

  const pinColor   = PIN_COLOR[event.color] ?? '#13294B'
  const tint       = TILE_TINT[event.color] ?? '#DCE4F5'
  const icon       = ICON_FOR[event.id] ?? 'mountain'
  const mapsUrl    = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address)}`
  const accessIsOpen = event.access.startsWith('Open') || event.access.startsWith('Free')

  // All offerings as flat chips: food types + activities
  const offeringChips: string[] = [
    ...event.food_types.map(ft => foodTypeLabel[ft] ?? ft),
    ...event.activities,
  ]

  return (
    <div style={{ minHeight: '100%', background: '#FAF7F0', overflowY: 'auto' }}>

      {/* ── Hero ── */}
      <div style={{
        position: 'relative',
        background: tint,
        padding: '48px 20px 36px',
        overflow: 'hidden',
      }}>
        {/* Decorative circle */}
        <div style={{
          position: 'absolute', right: -60, top: -60,
          width: 220, height: 220, borderRadius: '50%',
          background: pinColor, opacity: 0.1,
          pointerEvents: 'none',
        }} />

        {/* Back */}
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          color: '#4A463E', fontSize: 14, fontWeight: 600,
          textDecoration: 'none', marginBottom: 28, opacity: 0.8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
          </svg>
          All events
        </Link>

        {/* Icon tile */}
        <div style={{
          width: 88, height: 88, borderRadius: 28,
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 20,
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
          <Glyph name={icon} size={44} stroke={pinColor} sw={1.6} />
        </div>

        {/* Title */}
        <h1 style={{
          margin: '0 0 8px', fontSize: 30, fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.1, color: '#13294B',
        }}>
          {event.location}
        </h1>

        {/* Headline */}
        {event.headline && (
          <p style={{ margin: '0 0 18px', fontSize: 16, color: '#4A463E', lineHeight: 1.4 }}>
            {event.headline}
          </p>
        )}

        {/* Access badge */}
        <span style={{
          display: 'inline-block',
          fontSize: 13, fontWeight: 700, borderRadius: 999,
          padding: '7px 16px',
          background: accessIsOpen ? '#13294B' : '#E84A27',
          color: '#fff',
          letterSpacing: '-0.01em',
          marginBottom: 16,
        }}>
          {event.access}
        </span>

        {/* Feature chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {getFeatureChips(event as Event).map(chip => (
            <span key={chip.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 600, borderRadius: 999,
              padding: '5px 12px',
              background: 'rgba(255,255,255,0.60)',
              backdropFilter: 'blur(10px)',
              color: pinColor,
              border: `1.5px solid ${pinColor}22`,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14, lineHeight: 1 }}>
                {chip.icon}
              </span>
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Cards ── */}
      <div style={{ padding: '16px 16px 64px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* WHEN */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--hair)' }}>
          <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16, background: '#FFE0D2', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E84A27" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="9"/>
                <path d="M12 7v5l3 3"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8C8678', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>
                When
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#E84A27', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {formatTimeRange(event.start_time, event.end_time)}
              </div>
              <div style={{ fontSize: 13, color: '#8C8678', marginTop: 3 }}>
                Wednesday, May 7, 2026
              </div>
            </div>
          </div>
        </div>

        {/* WHERE */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--hair)' }}>
          <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16, background: '#DCE4F5', flexShrink: 0, marginTop: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#13294B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8C8678', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 4 }}>
                Where
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1814', lineHeight: 1.35 }}>
                {event.address}
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  marginTop: 10, fontSize: 13.5, fontWeight: 700,
                  color: '#E84A27', textDecoration: 'none',
                }}
              >
                Get directions
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M7 17L17 7M7 7h10v10"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* SCHEDULE */}
        {event.schedule && event.schedule.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--hair)' }}>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8C8678', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 16 }}>
                Schedule
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {event.schedule.map((slot, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: i < event.schedule!.length - 1 ? 16 : 0 }}>
                    {/* Timeline spine */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 16 }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: 3,
                        background: slot.time === 'All day' ? '#DCE4F5' : '#E84A27',
                        border: slot.time === 'All day' ? '2px solid #13294B' : 'none',
                      }} />
                      {i < event.schedule!.length - 1 && (
                        <div style={{ width: 1.5, flex: 1, background: 'var(--hair)', marginTop: 4 }} />
                      )}
                    </div>
                    {/* Content */}
                    <div style={{ flex: 1, paddingBottom: 2 }}>
                      <div style={{
                        fontSize: 12, fontWeight: 800, letterSpacing: '-0.01em',
                        color: slot.time === 'All day' ? '#13294B' : '#E84A27',
                        marginBottom: 4,
                      }}>
                        {slot.time}
                      </div>
                      {slot.items.map((item, j) => (
                        <div key={j} style={{ fontSize: 13.5, color: '#4A463E', lineHeight: 1.5, marginBottom: j < slot.items.length - 1 ? 3 : 0 }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WHAT'S OFFERED — flat chips for everything */}
        {offeringChips.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--hair)' }}>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8C8678', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>
                What&apos;s offered
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {offeringChips.map(chip => (
                  <span key={chip} style={{
                    fontSize: 13.5, fontWeight: 600, borderRadius: 12,
                    padding: '7px 15px',
                    background: '#DCE4F5', color: '#13294B',
                  }}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {event.notes && (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid var(--hair)' }}>
            <div style={{ padding: '16px 18px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8C8678', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 10 }}>
                About
              </div>
              <p style={{ margin: 0, fontSize: 14, color: '#4A463E', lineHeight: 1.65 }}>
                {event.notes}
              </p>
            </div>
          </div>
        )}

        {/* SOURCE LINK */}
        {event.link && (
          <a
            href={event.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <div style={{
              background: '#13294B', color: '#fff', borderRadius: 20,
              padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>More info & official listing</span>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>open_in_new</span>
            </div>
          </a>
        )}

      </div>
    </div>
  )
}
