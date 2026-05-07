// Geocodes all event addresses + campus labels via Nominatim, then patches the source files.
// Run: node scripts/geocode.mjs
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const root  = join(__dir, '..')

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function geocode(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`
  const res = await fetch(url, { headers: { 'User-Agent': 'UIUC-ReadingDay-App/1.0' } })
  const data = await res.json()
  if (!data[0]) return null
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name }
}

// ── Event addresses ───────────────────────────────────────────────────────────
const eventsPath = join(root, 'data/events.json')
const events = JSON.parse(readFileSync(eventsPath, 'utf8'))

// Clean addresses: strip "Building Name ·" prefix, append city/state for precision
function cleanAddress(addr) {
  const stripped = addr.replace(/^[^·]+·\s*/, '').trim()
  // Append state if not already there
  if (!stripped.includes('IL') && !stripped.includes('Illinois')) return stripped + ', IL, USA'
  return stripped
}

console.log('── Geocoding event addresses ──')
for (const ev of events) {
  const query = cleanAddress(ev.address)
  await sleep(1100) // Nominatim: 1 req/sec
  const result = await geocode(query)
  if (result) {
    console.log(`✓ [${ev.id}] ${ev.location}`)
    console.log(`    ${result.lat}, ${result.lng}  (${result.display.slice(0, 60)})`)
    ev.lat = result.lat
    ev.lng = result.lng
  } else {
    console.log(`✗ [${ev.id}] ${ev.location} — no result for "${query}"`)
  }
}

writeFileSync(eventsPath, JSON.stringify(events, null, 2))
console.log('\n✓ events.json updated\n')

// ── Campus building labels ────────────────────────────────────────────────────
const mapViewPath = join(root, 'components/MapView.tsx')
let mapSrc = readFileSync(mapViewPath, 'utf8')

const buildings = [
  { name: 'Main Quad',                        query: 'Main Quad, University of Illinois Urbana-Champaign' },
  { name: 'South Quad',                       query: 'South Quad, University of Illinois Urbana-Champaign' },
  { name: 'Illini Union',                     query: '1401 W Green St, Urbana, IL' },
  { name: 'Altgeld Hall',                     query: 'Altgeld Hall, University of Illinois Urbana-Champaign' },
  { name: 'Lincoln Hall',                     query: 'Lincoln Hall, University of Illinois Urbana-Champaign' },
  { name: 'Henry Administration Building',    query: 'Henry Administration Building, University of Illinois Urbana-Champaign' },
  { name: 'Foellinger Auditorium',            query: 'Foellinger Auditorium, University of Illinois Urbana-Champaign' },
  { name: 'Alma Mater',                       query: 'Alma Mater statue, University of Illinois Urbana-Champaign' },
  { name: 'Armory Building',                  query: 'Armory, University of Illinois Urbana-Champaign' },
  { name: 'Anniversary Plaza',                query: 'Anniversary Plaza, University of Illinois Urbana-Champaign' },
  { name: 'Illini Union Bookstore',           query: 'Illini Union Bookstore, 809 S Wright St, Champaign, IL' },
  { name: 'School of Information Sciences',   query: 'iSchool, 501 E Daniel St, Champaign, IL' },
  { name: 'Natural History Building',         query: 'Natural History Building, University of Illinois Urbana-Champaign' },
  { name: 'Foreign Languages Building',       query: 'Foreign Languages Building, University of Illinois Urbana-Champaign' },
  { name: 'English Building',                 query: 'English Building, 608 S Wright St, Champaign, IL' },
  { name: 'George Huff Hall',                 query: 'George Huff Hall, University of Illinois Urbana-Champaign' },
  { name: 'Krannert Art Museum',              query: 'Krannert Art Museum, 500 E Peabody Dr, Champaign, IL' },
  { name: 'Ikenberry Dining Center',          query: 'Ikenberry Dining Center, University of Illinois Urbana-Champaign' },
  { name: 'David Kinley Hall',                query: 'David Kinley Hall, University of Illinois Urbana-Champaign' },
  { name: 'Gregory Hall',                     query: 'Gregory Hall, University of Illinois Urbana-Champaign' },
]

console.log('── Geocoding campus labels ──')
const results = {}
for (const b of buildings) {
  await sleep(1100)
  const result = await geocode(b.query)
  if (result) {
    console.log(`✓ ${b.name}: ${result.lat}, ${result.lng}`)
    results[b.name] = result
  } else {
    console.log(`✗ ${b.name} — no result`)
  }
}

// Patch CAMPUS_LABELS in MapView.tsx
// Replace lat/lng for each building name found
for (const [name, result] of Object.entries(results)) {
  // Match: { name: 'NAME', lat: X, lng: Y, minZoom: Z }
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(\\{ name: '${escaped}',\\s*lat: )[\\d.-]+(, lng: )[\\d.-]+`)
  if (re.test(mapSrc)) {
    mapSrc = mapSrc.replace(re, `$1${result.lat}$2${result.lng}`)
    console.log(`  patched ${name}`)
  } else {
    console.log(`  could not patch ${name} in MapView.tsx`)
  }
}

writeFileSync(mapViewPath, mapSrc)
console.log('\n✓ MapView.tsx CAMPUS_LABELS updated')
