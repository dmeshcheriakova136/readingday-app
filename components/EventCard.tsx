import Link from 'next/link'
import type { Event } from '@/lib/types'
import { formatTimeRange } from '@/lib/utils'
import Glyph, { ICON_FOR, PIN_COLOR, TILE_TINT } from './Glyph'

const foodTypeLabel: Record<string, string> = {
  meal:           'Meal',
  drinks:         'Drinks',
  snacks:         'Snacks',
  treats:         'Treats',
  coffee:         'Coffee',
  'care-package': 'Care Package',
  samples:        'Samples',
}

export default function EventCard({ event }: { event: Event }) {
  const pinColor = PIN_COLOR[event.color] ?? '#13294B'
  const tint = TILE_TINT[event.color] ?? '#DCE4F5'
  const icon = ICON_FOR[event.id] ?? 'mountain'

  const accessIsOpen = event.access.startsWith('Open') || event.access.startsWith('Free')
  const accessStyle = accessIsOpen
    ? { background: '#DCE4F5', color: '#13294B' }
    : { background: '#FBE9DF', color: '#E84A27' }

  return (
    <Link href={`/event/${event.id}`}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid var(--hair)',
        padding: '16px',
        display: 'flex', alignItems: 'flex-start', gap: 14,
        transition: 'transform 100ms',
      }}
        className="active:scale-[0.98]"
      >
        {/* Glyph tile */}
        <div style={{
          width: 56, height: 56, borderRadius: 18, flexShrink: 0,
          background: tint,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: pinColor,
        }}>
          <Glyph name={icon} size={26} stroke={pinColor} sw={1.8} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name */}
          <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1814', letterSpacing: '-0.015em',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {event.location}
          </div>

          {/* Time in orange */}
          <div style={{ fontSize: 13, fontWeight: 700, color: '#E84A27', marginTop: 3 }}>
            {formatTimeRange(event.start_time, event.end_time)}
          </div>

          {/* Headline subtitle */}
          {event.headline && (
            <div style={{ fontSize: 12.5, color: '#8C8678', marginTop: 2,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.headline}
            </div>
          )}

          {/* Chips row: access + food types */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '3px 9px',
              ...accessStyle,
            }}>
              {event.access}
            </span>
            {event.food_types.slice(0, 2).map(ft => (
              <span key={ft} style={{
                fontSize: 11, fontWeight: 600, borderRadius: 999,
                padding: '3px 9px', background: '#FFE0D2', color: '#E84A27',
              }}>
                {foodTypeLabel[ft] ?? ft}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
