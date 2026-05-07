'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { Event } from '@/lib/types'
import { formatTimeRange } from '@/lib/utils'
import Glyph, { ICON_FOR, PIN_COLOR, TILE_TINT } from '@/components/Glyph'
import BlockI from '@/components/BlockI'

// Reading Day is May 7 2026 — for preview on other dates, use a fixed 13:30 anchor
function getNow(): Date {
  const real = new Date()
  const readingDay = new Date('2026-05-07T00:00:00')
  const isReadingDay =
    real.getFullYear() === 2026 && real.getMonth() === 4 && real.getDate() === 7
  return isReadingDay ? real : new Date('2026-05-07T13:30:00')
}

function toMins(t: string): number {
  if (!t || t === 'TBD') return -1
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function classify(ev: Event, nowMins: number): 'now' | 'next' | 'later' | 'done' {
  const s = toMins(ev.start_time)
  const e = toMins(ev.end_time)
  if (s < 0) return 'later'
  if (nowMins >= s && nowMins < e) return 'now'
  if (s > nowMins && s - nowMins <= 120) return 'next'
  if (s > nowMins) return 'later'
  return 'done'
}

function minsUntil(start: string, nowMins: number): string {
  const s = toMins(start)
  if (s < 0) return ''
  const diff = s - nowMins
  if (diff <= 0) return 'Now'
  if (diff < 60) return `in ${diff}m`
  const h = Math.floor(diff / 60)
  const m = diff % 60
  return m === 0 ? `in ${h}h` : `in ${h}h ${m}m`
}

function EventRow({ ev, badge }: { ev: Event; badge?: string }) {
  const pinColor = PIN_COLOR[ev.color] ?? '#13294B'
  const tint = TILE_TINT[ev.color] ?? '#DCE4F5'
  const icon = ICON_FOR[ev.id] ?? 'mountain'

  return (
    <Link href={`/event/${ev.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '14px 0',
        borderBottom: '1px solid var(--hair)',
      }}>
        <div style={{
          width: 50, height: 50, borderRadius: 15, flexShrink: 0,
          background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Glyph name={icon} size={22} stroke={pinColor} sw={1.8} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1814', letterSpacing: '-0.015em',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {ev.location}
          </div>
          <div style={{ fontSize: 13, color: '#E84A27', fontWeight: 700, marginTop: 2 }}>
            {formatTimeRange(ev.start_time, ev.end_time)}
          </div>
          {ev.headline && (
            <div style={{ fontSize: 12.5, color: '#8C8678', marginTop: 2,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {ev.headline}
            </div>
          )}
        </div>
        {badge && (
          <span style={{
            flexShrink: 0, fontSize: 11, fontWeight: 800,
            padding: '4px 10px', borderRadius: 999,
            background: '#13294B', color: '#fff',
            letterSpacing: '0.02em',
          }}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  )
}

function HeroCard({ ev }: { ev: Event }) {
  const pinColor = PIN_COLOR[ev.color] ?? '#13294B'
  const tint = TILE_TINT[ev.color] ?? '#DCE4F5'
  const icon = ICON_FOR[ev.id] ?? 'mountain'

  return (
    <Link href={`/event/${ev.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#13294B', borderRadius: 24, padding: '20px',
        marginBottom: 8,
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: '#E84A27', borderRadius: 999, padding: '4px 12px',
          fontSize: 11, fontWeight: 800, color: '#fff',
          letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14,
        }}>
          ● Happening now
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, flexShrink: 0,
            background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Glyph name={icon} size={28} stroke={pinColor} sw={1.8} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              {ev.location}
            </div>
            <div style={{ fontSize: 13, color: '#E84A27', fontWeight: 700, marginTop: 4 }}>
              {formatTimeRange(ev.start_time, ev.end_time)}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
              {ev.headline}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function NowClient({ events }: { events: Event[] }) {
  const now = useMemo(getNow, [])
  const nowMins = now.getHours() * 60 + now.getMinutes()

  const sorted = useMemo(() =>
    [...events].sort((a, b) => toMins(a.start_time) - toMins(b.start_time)),
  [events])

  const happening = sorted.filter(e => classify(e, nowMins) === 'now')
  const next      = sorted.filter(e => classify(e, nowMins) === 'next')
  const later     = sorted.filter(e => classify(e, nowMins) === 'later')
  const done      = sorted.filter(e => classify(e, nowMins) === 'done')

  const timeLabel = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })

  return (
    <div style={{ minHeight: '100dvh', background: '#FAF7F0' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '40px 20px 16px', borderBottom: '1px solid var(--hair)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <BlockI size={30} />
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: '-0.035em', color: '#13294B' }}>
            What&apos;s <span style={{ color: '#E84A27' }}>On</span>
          </h1>
        </div>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#8C8678' }}>
          As of {timeLabel} · May 7, 2026
        </p>
      </div>

      <div style={{ padding: '16px 20px 80px' }}>

        {/* Happening now */}
        {happening.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            {happening.map(ev => <HeroCard key={ev.id} ev={ev} />)}
          </section>
        )}

        {happening.length === 0 && (
          <div style={{
            background: '#fff', borderRadius: 20, padding: '20px',
            marginBottom: 24, textAlign: 'center', border: '1px solid var(--hair)',
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#13294B' }}>Nothing right now</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8C8678' }}>Check what&apos;s up next below</p>
          </div>
        )}

        {/* Up next */}
        {next.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#13294B', letterSpacing: '-0.02em' }}>
                Up next
              </h2>
              <span style={{ fontSize: 12, color: '#8C8678' }}>within 2 hrs</span>
            </div>
            <div style={{ background: '#fff', borderRadius: 20, padding: '0 16px', border: '1px solid var(--hair)' }}>
              {next.map(ev => (
                <EventRow key={ev.id} ev={ev} badge={minsUntil(ev.start_time, nowMins)} />
              ))}
            </div>
          </section>
        )}

        {/* Later today */}
        {later.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 800, color: '#13294B', letterSpacing: '-0.02em' }}>
              Later today
            </h2>
            <div style={{ background: '#fff', borderRadius: 20, padding: '0 16px', border: '1px solid var(--hair)' }}>
              {later.map(ev => (
                <EventRow key={ev.id} ev={ev} badge={minsUntil(ev.start_time, nowMins)} />
              ))}
            </div>
          </section>
        )}

        {/* Already done */}
        {done.length > 0 && (
          <section>
            <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#8C8678', letterSpacing: '-0.01em' }}>
              Already ended
            </h2>
            <div style={{ background: '#fff', borderRadius: 20, padding: '0 16px',
                          border: '1px solid var(--hair)', opacity: 0.6 }}>
              {done.map(ev => <EventRow key={ev.id} ev={ev} />)}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
