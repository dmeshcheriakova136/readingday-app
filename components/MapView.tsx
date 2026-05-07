'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Link from 'next/link'
import type { Event } from '@/lib/types'
import { formatTimeRange, getFeatureChips } from '@/lib/utils'
import Glyph, { ICON_FOR, PIN_COLOR, TILE_TINT } from './Glyph'
import BlockI from './BlockI'

// ── Time helpers ────────────────────────────────────────────────────────────
function getNowMins(): number {
  const real = new Date()
  const isReadingDay = real.getFullYear() === 2026 && real.getMonth() === 4 && real.getDate() === 7
  const d = isReadingDay ? real : new Date('2026-05-07T13:30:00')
  return d.getHours() * 60 + d.getMinutes()
}
function toMins(t: string): number {
  if (!t || t === 'TBD') return -1
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
const nowMins = getNowMins()

// ── Filters ─────────────────────────────────────────────────────────────────
const FILTERS = [
  { label: 'All',           match: null },
  { label: 'Free Food',     match: (e: Event) => e.food_types.length > 0 || e.free_food.length > 0 },
  { label: 'Activities',    match: (e: Event) => e.activities.length > 0 },
  { label: 'Games',         match: (e: Event) => e.activities.some(a => /game|board|puzzle/i.test(a)) },
  { label: 'Giveaways',     match: (e: Event) => e.tags.includes('care-package') || e.activities.some(a => /giveaway|prize|swag/i.test(a)) },
  { label: 'Arts & Crafts', match: (e: Event) => e.tags.includes('crafts') || e.activities.some(a => /craft|art|coloring|drawing|paint/i.test(a)) },
  { label: 'Free Coffee',   match: (e: Event) => e.food_types.includes('coffee') },
  { label: 'Free Snacks',   match: (e: Event) => e.food_types.some(t => ['snacks','treats','meal'].includes(t)) },
]

function walkMin(id: number) { return 4 + (id * 3) % 14 }

// ── Campus building labels ────────────────────────────────────────────────────
const CAMPUS_LABELS = [
  { name: 'Main Quad',   lat: 40.10695,  lng: -88.22720,   minZoom: 14 },
  { name: 'South Quad',  lat: 40.10415,  lng: -88.22700,   minZoom: 14 },
  { name: 'Illini Union', lat: 40.109714, lng: -88.2267806, minZoom: 14 },
]

// ── Material Symbols icon mapping ────────────────────────────────────────────
const MATERIAL_ICON_FOR: Record<string, string> = {
  mountain: 'landscape',
  cup:      'local_cafe',
  palette:  'palette',
  book:     'menu_book',
  scissors: 'content_cut',
  gift:     'card_giftcard',
  dumbbell: 'fitness_center',
  heart:    'favorite',
  flower:   'local_florist',
  basket:   'shopping_basket',
}

// ── Food type labels ─────────────────────────────────────────────────────────
const FOOD_LABEL: Record<string, string> = {
  meal: 'Meal', drinks: 'Free Drinks', snacks: 'Free Snacks',
  treats: 'Treats', coffee: 'Free Coffee', 'care-package': 'Care Package', samples: 'Free Samples',
}

// ── Event detail panel (shown inside the sheet when a pin is tapped) ─────────
function EventDetailPanel({ ev, onBack }: { ev: Event; onBack: () => void }) {
  const pinColor   = PIN_COLOR[ev.color] ?? '#13294B'
  const tint       = TILE_TINT[ev.color] ?? '#DCE4F5'
  const icon       = ICON_FOR[ev.id] ?? 'mountain'
  const mapsUrl    = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.address)}`
  const accessOpen = ev.access.startsWith('Open') || ev.access.startsWith('Free')

  const offeringChips: string[] = [
    ...ev.food_types.map(ft => FOOD_LABEL[ft] ?? ft),
    ...ev.activities,
  ]

  return (
    <div className="rd-scroll" style={{ flex: 1 }}>

      {/* ── Hero ── */}
      <div style={{ position: 'relative', background: tint, padding: '16px 20px 28px', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', right: -50, top: -50,
          width: 180, height: 180, borderRadius: '50%',
          background: pinColor, opacity: 0.1, pointerEvents: 'none',
        }} />

        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 0 20px', background: 'none', border: 'none',
          cursor: 'pointer', color: '#4A463E', fontSize: 14, fontWeight: 600,
          fontFamily: 'inherit', opacity: 0.8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
          </svg>
          All events
        </button>

        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 16, boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
        }}>
          <Glyph name={icon} size={38} stroke={pinColor} sw={1.6} />
        </div>

        <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1, color: '#13294B' }}>
          {ev.location}
        </h2>

        {ev.headline && (
          <p style={{ margin: '0 0 14px', fontSize: 15, color: '#4A463E', lineHeight: 1.4 }}>{ev.headline}</p>
        )}

        <span style={{
          display: 'inline-block', fontSize: 13, fontWeight: 700, borderRadius: 999,
          padding: '7px 16px', marginBottom: 14,
          background: accessOpen ? '#13294B' : '#E84A27', color: '#fff',
        }}>
          {ev.access}
        </span>

        {/* Feature chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {getFeatureChips(ev).map(chip => (
            <span key={chip.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 11.5, fontWeight: 600, borderRadius: 999,
              padding: '5px 11px',
              background: 'rgba(255,255,255,0.60)',
              backdropFilter: 'blur(10px)',
              color: pinColor,
              border: `1.5px solid ${pinColor}22`,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13, lineHeight: 1 }}>
                {chip.icon}
              </span>
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Cards ── */}
      <div style={{ padding: '14px 14px 80px', display: 'flex', flexDirection: 'column', gap: 10, background: '#FAF7F0' }}>

        {/* WHEN */}
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid var(--hair)' }}>
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: '#FFE0D2', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E84A27" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8C8678', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3 }}>When</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: '#E84A27', letterSpacing: '-0.02em', lineHeight: 1 }}>
                {formatTimeRange(ev.start_time, ev.end_time)}
              </div>
              <div style={{ fontSize: 12, color: '#8C8678', marginTop: 3 }}>Wednesday, May 7, 2026</div>
            </div>
          </div>
        </div>

        {/* WHERE */}
        <div style={{ background: '#fff', borderRadius: 18, border: '1px solid var(--hair)' }}>
          <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: '#DCE4F5', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#13294B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8C8678', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3 }}>Where</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1814', lineHeight: 1.35 }}>{ev.address}</div>
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                marginTop: 8, fontSize: 13, fontWeight: 700, color: '#E84A27', textDecoration: 'none',
              }}>
                Get directions
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M7 17L17 7M7 7h10v10"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* SCHEDULE */}
        {ev.schedule && ev.schedule.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid var(--hair)' }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8C8678', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 14 }}>
                Schedule
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {ev.schedule.map((slot, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: i < ev.schedule!.length - 1 ? 14 : 0 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 14 }}>
                      <div style={{
                        width: 9, height: 9, borderRadius: '50%', flexShrink: 0, marginTop: 3,
                        background: slot.time === 'All day' ? '#DCE4F5' : '#E84A27',
                        border: slot.time === 'All day' ? '2px solid #13294B' : 'none',
                      }} />
                      {i < ev.schedule!.length - 1 && (
                        <div style={{ width: 1.5, flex: 1, background: 'var(--hair)', marginTop: 4 }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: slot.time === 'All day' ? '#13294B' : '#E84A27', marginBottom: 3 }}>
                        {slot.time}
                      </div>
                      {slot.items.map((item, j) => (
                        <div key={j} style={{ fontSize: 13, color: '#4A463E', lineHeight: 1.5, marginBottom: j < slot.items.length - 1 ? 2 : 0 }}>
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

        {/* WHAT'S OFFERED */}
        {offeringChips.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid var(--hair)' }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8C8678', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 12 }}>
                What&apos;s offered
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {offeringChips.map(chip => (
                  <span key={chip} style={{ fontSize: 13, fontWeight: 600, borderRadius: 12, padding: '7px 14px', background: '#DCE4F5', color: '#13294B' }}>
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABOUT */}
        {ev.notes && (
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid var(--hair)' }}>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#8C8678', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 8 }}>About</div>
              <p style={{ margin: 0, fontSize: 14, color: '#4A463E', lineHeight: 1.65 }}>{ev.notes}</p>
            </div>
          </div>
        )}

        {/* SOURCE LINK */}
        {ev.link && (
          <a href={ev.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#13294B', color: '#fff', borderRadius: 16,
              padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 13.5, fontWeight: 700 }}>More info & official listing</span>
              <span className="material-symbols-outlined" style={{ fontSize: 17 }}>open_in_new</span>
            </div>
          </a>
        )}

      </div>
    </div>
  )
}

// ── Sheet list row ───────────────────────────────────────────────────────────
function SheetRow({ ev, selected, onSelect }: { ev: Event; selected: boolean; onSelect: () => void }) {
  const pinColor = PIN_COLOR[ev.color] ?? '#13294B'
  const tint     = TILE_TINT[ev.color] ?? '#DCE4F5'
  const icon     = ICON_FOR[ev.id] ?? 'mountain'

  return (
    <div
      role="button"
      onClick={onSelect}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 22px',
        borderBottom: '1px solid var(--hair)',
        background: selected ? 'rgba(232,74,39,0.04)' : 'transparent',
        cursor: 'pointer',
        transition: 'background 150ms',
      }}
    >
      <div style={{
        width: 56, height: 56, borderRadius: 18, flexShrink: 0,
        background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Glyph name={icon} size={26} stroke={pinColor} sw={1.8} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#1A1814', letterSpacing: '-0.015em',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ev.location}
        </div>
        <div style={{ marginTop: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#E84A27' }}>
            {formatTimeRange(ev.start_time, ev.end_time)}
          </span>
        </div>
      </div>

      <Glyph name="chev" size={16} stroke="#8C8678" />
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────
export default function MapView({ events }: { events: Event[] }) {
  const outerRef      = useRef<HTMLDivElement>(null)
  const mapRef        = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<unknown>(null)
  const leafletRef    = useRef<unknown>(null)
  const markersRef    = useRef<Record<number, unknown>>({})
  const labelMarkersRef = useRef<Array<{ marker: unknown; minZoom: number }>>([])

  const [selectedId,   setSelectedId]   = useState<number>(events[0]?.id ?? 1)
  const [activeFilter, setActiveFilter] = useState('All')
  const [query,        setQuery]        = useState('')
  const [sheetPos,     setSheetPos]     = useState<'full' | 'half' | 'min'>('half')
  const [detailView,   setDetailView]   = useState(false)

  const sheetRef  = useRef<HTMLDivElement>(null)
  const dragY0    = useRef<number | null>(null)
  const dragged   = useRef(false)

  // Sheet is always full height. We slide it with translateY:
  //   0%  = full view
  //   38% = half view (shows lower ~62%)
  //   88% = minimized — just the drag handle peek, map fully visible
  const TRANSLATE_FULL = 0
  const TRANSLATE_HALF = 38
  const TRANSLATE_MIN  = 88

  function currentTranslate() {
    if (sheetPos === 'full') return TRANSLATE_FULL
    if (sheetPos === 'half') return TRANSLATE_HALF
    return TRANSLATE_MIN
  }

  function onHandleTouchStart(e: React.TouchEvent) {
    dragged.current = false
    dragY0.current = e.touches[0].clientY
    if (sheetRef.current) sheetRef.current.style.transition = 'none'
  }

  function onHandleTouchMove(e: React.TouchEvent) {
    if (dragY0.current === null || !sheetRef.current) return
    const dy = e.touches[0].clientY - dragY0.current
    if (Math.abs(dy) < 6) return
    dragged.current = true
    const h = sheetRef.current.offsetHeight || 1
    const deltaPct = (dy / h) * 100
    const next = Math.max(0, Math.min(TRANSLATE_MIN, currentTranslate() + deltaPct))
    sheetRef.current.style.transform = `translateY(${next}%)`
  }

  function onHandleTouchEnd(e: React.TouchEvent) {
    if (sheetRef.current) {
      sheetRef.current.style.transition = ''
      sheetRef.current.style.transform = ''
    }
    if (!dragged.current) { dragY0.current = null; return }
    const dy = e.changedTouches[0].clientY - (dragY0.current ?? 0)
    dragY0.current = null
    dragged.current = false
    if (dy > 60) setSheetPos(p => p === 'full' ? 'half' : 'min')
    else if (dy < -60) setSheetPos(p => p === 'min' ? 'half' : 'full')
  }

  function onHandleClick() {
    if (dragged.current) return
    setSheetPos(p => p === 'full' ? 'half' : p === 'half' ? 'min' : 'half')
  }

  const sorted = useMemo(() =>
    [...events].sort((a, b) => (a.start_time || 'z').localeCompare(b.start_time || 'z')),
  [events])

  const filterFn = FILTERS.find(f => f.label === activeFilter)?.match
  const q = query.trim().toLowerCase()
  const filtered = useMemo(() => sorted.filter(ev => {
    const matchFilter = filterFn ? filterFn(ev) : true
    const matchSearch = q === '' ||
      ev.location.toLowerCase().includes(q) ||
      ev.address.toLowerCase().includes(q) ||
      (ev.short ?? '').toLowerCase().includes(q) ||
      ev.activities.some(a => a.toLowerCase().includes(q))
    return matchFilter && matchSearch
  }), [sorted, filterFn, q])

  const displayList = filtered
  const selectedEv  = events.find(e => e.id === selectedId)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function makeIcon(L: any, ev: Event, isSelected: boolean) {
    const pinColor  = PIN_COLOR[ev.color] ?? '#13294B'
    const glyphName = ICON_FOR[ev.id] ?? 'mountain'
    const matIcon   = MATERIAL_ICON_FOR[glyphName] ?? 'place'
    if (isSelected) {
      const label = (ev.short ?? ev.location).slice(0, 16)
      const html = `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;pointer-events:none;">
        <div style="background:#0F0E0B;color:white;border-radius:12px;padding:4px 10px;font-size:10.5px;font-weight:600;white-space:nowrap;font-family:-apple-system,system-ui,sans-serif;letter-spacing:-0.01em;">${label}</div>
        <div style="width:46px;height:46px;border-radius:50%;background:${pinColor};display:flex;align-items:center;justify-content:center;box-shadow:0 3px 14px rgba(0,0,0,0.28);">
          <span class="material-symbols-outlined" style="font-size:24px;color:white;line-height:1;user-select:none;">${matIcon}</span>
        </div>
      </div>`
      return L.divIcon({ className: '', html, iconSize: [110, 74], iconAnchor: [55, 70] })
    }
    const html = `<div style="width:40px;height:40px;border-radius:50%;background:white;border:2.5px solid ${pinColor};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.18);cursor:pointer;">
      <span class="material-symbols-outlined" style="font-size:20px;color:${pinColor};line-height:1;user-select:none;">${matIcon}</span>
    </div>`
    return L.divIcon({ className: '', html, iconSize: [40, 40], iconAnchor: [20, 20] })
  }

  // Init Leaflet
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    let cancelled = false

    async function init() {
      const L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')
      if (cancelled || !mapRef.current) return

      leafletRef.current = L

      const map = L.map(mapRef.current, {
        center: [40.1075, -88.228],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
      })

      // CartoDB Voyager — Google Maps-like with building labels & paths
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map)

      L.control.attribution({ position: 'bottomleft', prefix: false }).addTo(map)

      // Event pins
      events.forEach(ev => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const marker = L.marker([ev.lat, ev.lng], { icon: makeIcon(L, ev, false) }).addTo(map)
        marker.on('click', () => {
          setSelectedId(ev.id)
          setDetailView(true)
          setSheetPos('half')
        })
        ;(markersRef.current as Record<number, unknown>)[ev.id] = marker
      })

      // Campus building labels
      function syncLabels() {
        const z = map.getZoom()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        labelMarkersRef.current.forEach(({ marker, minZoom }: any) => {
          if (z >= minZoom) marker.addTo(map)
          else marker.remove()
        })
      }

      CAMPUS_LABELS.forEach(b => {
        const isLarge = b.minZoom <= 14
        const html = `<div style="
          font-family: -apple-system, system-ui, sans-serif;
          font-size: ${isLarge ? 12 : 11}px;
          font-weight: ${isLarge ? 700 : 600};
          color: #3C4043;
          text-shadow:
            1px  1px 0 rgba(255,255,255,0.95),
           -1px -1px 0 rgba(255,255,255,0.95),
            1px -1px 0 rgba(255,255,255,0.95),
           -1px  1px 0 rgba(255,255,255,0.95),
            0    2px 4px rgba(255,255,255,0.6);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
          letter-spacing: -0.01em;
        ">${b.name}</div>`

        const labelMarker = L.marker([b.lat, b.lng], {
          icon: L.divIcon({ className: '', html, iconSize: [0, 0], iconAnchor: [0, 8] }),
          zIndexOffset: -200,
          interactive: false,
        })

        labelMarkersRef.current.push({ marker: labelMarker, minZoom: b.minZoom })
      })

      syncLabels()
      map.on('zoomend', syncLabels)

      mapInstanceRef.current = map
    }

    init()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Update marker icons when selection changes
  useEffect(() => {
    const L = leafletRef.current
    if (!L) return
    events.forEach(ev => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const marker = (markersRef.current as Record<number, any>)[ev.id]
      if (marker) marker.setIcon(makeIcon(L, ev, ev.id === selectedId))
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  // Fly to selected event
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map = mapInstanceRef.current as any
    if (!map?.flyTo) return
    const ev = events.find(e => e.id === selectedId)
    if (ev) map.flyTo([ev.lat, ev.lng], 16, { duration: 0.6 })
  }, [selectedId, events])

  // Zoom controls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function zoomIn()  { (mapInstanceRef.current as any)?.zoomIn?.() }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function zoomOut() { (mapInstanceRef.current as any)?.zoomOut?.() }
  function flyHome() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(mapInstanceRef.current as any)?.flyTo([40.1075, -88.228], 15, { duration: 0.6 })
  }

  const sheetTranslate = `translateY(${sheetPos === 'full' ? TRANSLATE_FULL : sheetPos === 'half' ? TRANSLATE_HALF : TRANSLATE_MIN}%)`

  return (
    <div ref={outerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#F4F4F2' }}>
      {/* Map — z-index:0 creates a stacking context that contains Leaflet's internal panes (z-index 200–700) */}
      <div ref={mapRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Share button */}
      <Link href="/share" style={{ textDecoration: 'none' }}>
        <div style={{
          position: 'absolute', top: 56, right: 16, zIndex: 10,
          width: 48, height: 48, borderRadius: 16,
          background: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1814" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="12" r="2.5"/>
            <circle cx="18" cy="6" r="2.5"/>
            <circle cx="18" cy="18" r="2.5"/>
            <path d="M8 11l8-4M8 13l8 4"/>
          </svg>
        </div>
      </Link>

      {/* Zoom controls */}
      <div style={{ position: 'absolute', top: 112, right: 16, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 10 }}>
        {([
          { icon: 'plus'   as const, action: zoomIn  },
          { icon: 'minus'  as const, action: zoomOut },
          { icon: 'target' as const, action: flyHome },
        ]).map(({ icon, action }) => (
          <button key={icon} onClick={action} style={{
            width: 48, height: 48, borderRadius: 16, border: 'none',
            background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <Glyph name={icon} size={20} stroke="#1A1814" />
          </button>
        ))}
      </div>

      {/* Bottom sheet — full height, positioned via translateY so it never collapses */}
      <div ref={sheetRef} style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: '100%',
        background: '#FFFFFF',
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 50,
        transform: sheetTranslate,
        transition: 'transform 320ms cubic-bezier(0.32,0.72,0.3,1)',
      }}>
        {/* Drag handle */}
        <div
          onTouchStart={onHandleTouchStart}
          onTouchMove={onHandleTouchMove}
          onTouchEnd={onHandleTouchEnd}
          onClick={onHandleClick}
          style={{ padding: '12px 0 8px', cursor: 'pointer', flexShrink: 0, touchAction: 'none' }}
        >
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(20,18,14,0.16)', margin: '0 auto' }} />
        </div>

        {detailView && selectedEv ? (
          /* ── Detail view ─────────────────────────────── */
          <EventDetailPanel ev={selectedEv} onBack={() => setDetailView(false)} />
        ) : (
          /* ── List view ───────────────────────────────── */
          <>
            {/* Sheet header */}
            <div style={{ padding: '8px 22px 8px', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <BlockI size={32} />
                <h2 style={{
                  margin: 0, fontSize: 34, fontWeight: 800,
                  letterSpacing: '-0.035em', lineHeight: 1, color: '#13294B',
                }}>
                  Reading <span style={{ color: '#E84A27' }}>Day</span>
                </h2>
              </div>

              {/* Filter pills — horizontally scrollable */}
              <div style={{
                display: 'flex', gap: 8,
                overflowX: 'auto', WebkitOverflowScrolling: 'touch',
                paddingBottom: 2, marginRight: -22, paddingRight: 22,
              }}
                className="scrollbar-hide"
              >
                {FILTERS.map(f => {
                  const active = activeFilter === f.label
                  return (
                    <button
                      key={f.label}
                      onClick={() => setActiveFilter(f.label)}
                      style={{
                        flexShrink: 0,
                        padding: '8px 18px', borderRadius: 999, fontSize: 13.5, fontWeight: 700,
                        fontFamily: 'inherit', cursor: 'pointer', letterSpacing: '-0.01em',
                        border: active ? 'none' : '1.5px solid #13294B',
                        background: active ? '#E84A27' : 'transparent',
                        color: active ? '#fff' : '#13294B',
                        transition: 'all 150ms',
                      }}
                    >
                      {f.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Search */}
            <div style={{ padding: '8px 22px 10px', flexShrink: 0 }}>
              <div style={{
                background: '#F4F4F2', borderRadius: 14, padding: '11px 16px',
                display: 'flex', alignItems: 'center', gap: 10,
                border: '1px solid rgba(20,18,14,0.07)',
              }}>
                <Glyph name="search" size={16} stroke="#8C8678" sw={2} />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search locations, food, activities…"
                  style={{
                    flex: 1, border: 'none', background: 'transparent', outline: 'none',
                    fontSize: 14, fontFamily: 'inherit', color: '#1A1814', padding: 0, minWidth: 0,
                  }}
                />
                {query && (
                  <button onClick={() => setQuery('')} style={{
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    padding: 4, color: '#8C8678', fontSize: 13, fontWeight: 600, fontFamily: 'inherit',
                  }}>Clear</button>
                )}
              </div>
            </div>

            {/* Event list */}
            <div className="rd-scroll" style={{ flex: 1 }}>
              {displayList.length === 0 ? (
                <div style={{ padding: '40px 22px', textAlign: 'center', color: '#8C8678' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#4A463E' }}>No matches</div>
                  <div style={{ fontSize: 12.5, marginTop: 4 }}>Try a different filter</div>
                </div>
              ) : (
                <>
                  {displayList.map(ev => (
                    <SheetRow
                      key={ev.id}
                      ev={ev}
                      selected={selectedId === ev.id}
                      onSelect={() => {
                        setSelectedId(ev.id)
                        setDetailView(true)
                        setSheetPos('half')
                      }}
                    />
                  ))}
                  <div style={{ padding: '24px 22px 20px', textAlign: 'center', fontSize: 12, color: '#8C8678' }}>
                    {displayList.length} spot{displayList.length !== 1 ? 's' : ''} · Good luck on finals
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
