// Second pass: fixes failed campus labels + bad event coords
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
  // Prefer results in Champaign County
  const best = data.find(r => r.display_name.includes('Champaign')) ?? data[0]
  if (!best) return null
  return { lat: parseFloat(best.lat), lng: parseFloat(best.lon), display: best.display_name.slice(0, 70) }
}

// ── Fix event #2 (ECEB is at 306 N Wright, not 306 S Wright) ─────────────────
// ── Fix event #13 (Grainger Library — try OSM name) ──────────────────────────
const eventsPath = join(root, 'data/events.json')
const events = JSON.parse(readFileSync(eventsPath, 'utf8'))

const eventFixes = [
  { id: 2,  query: 'Electrical and Computer Engineering Building, 306 N Wright St, Urbana, IL' },
  { id: 13, query: 'Grainger Engineering Library, University of Illinois, Urbana, IL' },
  { id: 7,  query: "Women's Resources Center, 616 E Green St, Champaign, IL" },
]

console.log('── Re-geocoding specific events ──')
for (const fix of eventFixes) {
  await sleep(1100)
  const result = await geocode(fix.query)
  const ev = events.find(e => e.id === fix.id)
  if (result && ev) {
    console.log(`✓ [${fix.id}] ${ev.location}: ${result.lat}, ${result.lng}  (${result.display})`)
    ev.lat = result.lat
    ev.lng = result.lng
  } else {
    console.log(`✗ [${fix.id}] no result for: ${fix.query}`)
  }
}

writeFileSync(eventsPath, JSON.stringify(events, null, 2))
console.log('✓ events.json updated\n')

// ── Re-geocode failed campus labels with street addresses ─────────────────────
const remaining = [
  { name: 'Main Quad',                       query: 'Main Quad, 601 E John St, Champaign, IL' },
  { name: 'South Quad',                      query: 'South Quad, University of Illinois, Champaign, IL' },
  { name: 'Altgeld Hall',                    query: 'Altgeld Hall, 1409 W Green St, Urbana, IL' },
  { name: 'Lincoln Hall',                    query: 'Lincoln Hall, 702 S Wright St, Champaign, IL' },
  { name: 'Henry Administration Building',   query: 'Henry Administration Building, 506 S Wright St, Champaign, IL' },
  { name: 'Foellinger Auditorium',           query: 'Foellinger Auditorium, 709 S Mathews Ave, Urbana, IL' },
  { name: 'Alma Mater',                      query: 'Alma Mater statue, Illinois, 1402 W Green St, Urbana, IL' },
  { name: 'Armory Building',                 query: 'University of Illinois Armory, 505 E Armory Ave, Champaign, IL' },
  { name: 'Anniversary Plaza',               query: 'Anniversary Plaza, 504 E Armory Ave, Champaign, IL' },
  { name: 'School of Information Sciences',  query: 'iSchool, 614 E Daniel St, Champaign, IL' },
  { name: 'Natural History Building',        query: 'Natural History Building, 1301 W Green St, Urbana, IL' },
  { name: 'Foreign Languages Building',      query: 'Foreign Languages Building, 707 S Mathews Ave, Urbana, IL' },
  { name: 'George Huff Hall',                query: 'George Huff Hall, 1801 S First St, Champaign, IL' },
  { name: 'Krannert Art Museum',             query: 'Krannert Art Museum, 500 E Peabody Dr, Champaign, IL' },
  { name: 'Ikenberry Dining Center',         query: 'Ikenberry Commons, 1010 W Stoughton St, Urbana, IL' },
  { name: 'David Kinley Hall',               query: 'David Kinley Hall, 1407 W Gregory Dr, Urbana, IL' },
  { name: 'Gregory Hall',                    query: 'Gregory Hall, 810 S Wright St, Champaign, IL' },
]

const mapViewPath = join(root, 'components/MapView.tsx')
let mapSrc = readFileSync(mapViewPath, 'utf8')

console.log('── Re-geocoding campus labels ──')
for (const b of remaining) {
  await sleep(1100)
  const result = await geocode(b.query)
  if (result) {
    console.log(`✓ ${b.name}: ${result.lat}, ${result.lng}  (${result.display})`)
    const escaped = b.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`(\\{ name: '${escaped}',\\s*lat: )[\\d.-]+(, lng: )[\\d.-]+`)
    if (re.test(mapSrc)) {
      mapSrc = mapSrc.replace(re, `$1${result.lat}$2${result.lng}`)
    } else {
      console.log(`  (could not patch in MapView.tsx)`)
    }
  } else {
    console.log(`✗ ${b.name} — still no result`)
  }
}

writeFileSync(mapViewPath, mapSrc)
console.log('\n✓ MapView.tsx CAMPUS_LABELS updated')
