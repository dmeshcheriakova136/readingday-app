import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const root  = join(__dir, '..')
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=3`
  const res = await fetch(url, { headers: { 'User-Agent': 'UIUC-ReadingDay-App/1.0' } })
  const data = await res.json()
  const best = data.find(r => r.display_name.includes('Champaign')) ?? data[0]
  if (!best) return null
  return { lat: parseFloat(best.lat), lng: parseFloat(best.lon), display: best.display_name.slice(0, 70) }
}

// ── Fix remaining events ──────────────────────────────────────────────────────
const eventsPath = join(root, 'data/events.json')
const events = JSON.parse(readFileSync(eventsPath, 'utf8'))

const eventFixes = [
  // Grainger: try plain street address
  { id: 13, query: '1301 W Springfield Ave, Urbana, IL' },
  // Women's Resources Center: try alternate address
  { id: 7,  query: '616 East Green Street, Champaign, IL' },
]

console.log('── Fixing remaining events ──')
for (const fix of eventFixes) {
  await sleep(1100)
  const result = await geocode(fix.query)
  const ev = events.find(e => e.id === fix.id)
  if (result && ev) {
    console.log(`✓ [${fix.id}] ${ev.location}: ${result.lat}, ${result.lng}  (${result.display})`)
    ev.lat = result.lat
    ev.lng = result.lng
  } else {
    console.log(`✗ [${fix.id}] ${ev?.location} — no result, keeping current coords`)
  }
}

writeFileSync(eventsPath, JSON.stringify(events, null, 2))
console.log('✓ events.json updated\n')

// ── Remaining campus labels — geocode + hardcode known-good coords ────────────
const mapViewPath = join(root, 'components/MapView.tsx')
let mapSrc = readFileSync(mapViewPath, 'utf8')

// Geocode attempts for the remaining unknowns
const toGeocode = [
  { name: 'Armory Building',               query: '505 E Armory Ave, Champaign, IL' },
  { name: 'Krannert Art Museum',           query: '500 E Peabody Dr, Champaign, IL' },
  { name: 'George Huff Hall',              query: '1801 S First St, Champaign, IL' },
  { name: 'Ikenberry Dining Center',       query: '1010 W Stoughton St, Urbana, IL' },
  { name: 'School of Information Sciences',query: '501 E Daniel St, Champaign, IL' },
  { name: 'Anniversary Plaza',             query: '504 E Armory Ave, Champaign, IL' },
]

// Hardcoded fallbacks for things that won't geocode (landmarks / quads)
const hardcoded = {
  'Main Quad':   { lat: 40.10695, lng: -88.22720 },
  'South Quad':  { lat: 40.10415, lng: -88.22700 },
  'Alma Mater':  { lat: 40.10672, lng: -88.22564 },
}

console.log('── Geocoding remaining campus labels ──')
for (const b of toGeocode) {
  await sleep(1100)
  const result = await geocode(b.query)
  if (result) {
    console.log(`✓ ${b.name}: ${result.lat}, ${result.lng}  (${result.display})`)
    hardcoded[b.name] = { lat: result.lat, lng: result.lng }
  } else {
    console.log(`✗ ${b.name} — using hardcoded fallback if available`)
  }
}

// Patch all into MapView.tsx
for (const [name, coords] of Object.entries(hardcoded)) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(\\{ name: '${escaped}',\\s*lat: )[\\d.-]+(, lng: )[\\d.-]+`)
  if (re.test(mapSrc)) {
    mapSrc = mapSrc.replace(re, `$1${coords.lat}$2${coords.lng}`)
    console.log(`  patched ${name}: ${coords.lat}, ${coords.lng}`)
  }
}

writeFileSync(mapViewPath, mapSrc)
console.log('\n✓ MapView.tsx CAMPUS_LABELS updated')

// ── Final summary ─────────────────────────────────────────────────────────────
console.log('\n── Final event coords ──')
const finalEvents = JSON.parse(readFileSync(eventsPath, 'utf8'))
finalEvents.forEach(e => console.log(`  [${e.id}] ${e.location.padEnd(40)} ${e.lat}, ${e.lng}`))
