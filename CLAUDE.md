# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

UIUC Reading Day app (May 7, 2026) — a mobile-first PWA showing all campus locations, food, and activities for the day. Deployed to Vercel as a shareable URL.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build (run before deploy)
npm run lint     # ESLint check
npx vercel --prod  # deploy to production
```

## Architecture

This is a **Next.js 16 App Router** project with **Tailwind CSS v4** and **TypeScript**.

**Important Next.js 16 notes (breaking changes from prior versions):**
- All components are Server Components by default. Add `'use client'` for anything using state, effects, event handlers, or browser APIs.
- Leaflet and react-leaflet require `'use client'` — they use browser DOM APIs.
- `params` in dynamic routes (`app/event/[id]/page.tsx`) is now a `Promise` — must be awaited: `const { id } = await params`.
- Tailwind v4 uses `@import "tailwindcss"` in CSS (not `@tailwind` directives). Theme tokens defined in `globals.css` via `@theme inline`.

**Data layer:** All event data lives in `data/events.json` — a flat array of location objects. No database, no API routes. Import directly in Server Components.

**Key routes:**
- `/` — filterable list of all Reading Day events
- `/map` — Leaflet map with pins for each location
- `/event/[id]` — detail view for a single location
- `/share` — QR code page pointing to the deployed URL

**Component split rule:** Pages (`app/*/page.tsx`) are Server Components that read from `data/events.json` and pass data down. Interactive UI (filters, map, modals) lives in `components/` as Client Components with `'use client'`.

**Map:** Uses `leaflet` + `react-leaflet`. Always wrap `MapContainer` in a Client Component. Fix the Leaflet default icon issue by importing `leaflet/dist/leaflet.css` and manually setting icon URLs (Leaflet's default icon breaks in webpack builds).

**Sharing:** The `/share` page uses `qrcode.react` to render a QR code. The deployed Vercel URL should be hardcoded or set via `NEXT_PUBLIC_APP_URL` env var.

**PWA:** `public/manifest.json` enables "Add to Home Screen" on mobile.

## Design System (UIUC Mood — from Claude Design)

The visual design comes from a Claude Design handoff (`app-onboarding/project/variants/day-map-styles.jsx`). The UIUC mood is the canonical style — all new UI must follow these rules.

### Colors (never hardcode hex — use CSS vars or these exact values)
```
Orange accent:  #E84A27  (var(--orange))
Navy:           #13294B  (var(--blue))
Orange tint:    #FFE0D2  (tint for orange/purple category events)
Navy tint:      #DCE4F5  (var(--blue-soft), tint for blue/green category events)
Walk pill bg:   #E5ECFA  walk pill bg
Walk pill fg:   #13294B  walk pill text
Ink:            #1A1814  (var(--ink))
Ink-2:          #4A463E  (var(--ink-2))
Ink-3:          #8C8678  (var(--ink-3))
Hair:           rgba(20,18,14,0.08) (var(--hair))  divider lines
Background:     #FAF7F0  (var(--cream))  page bg
```

### Event category → pin/tile colors (UIUC duotone)
```
orange category → pinColor #E84A27, tint #FFE0D2
purple category → pinColor #E84A27, tint #FFE0D2
blue category   → pinColor #13294B, tint #DCE4F5
green category  → pinColor #13294B, tint #DCE4F5
```
This is defined in `components/Glyph.tsx` as `PIN_COLOR` and `TILE_TINT`.

### Icon tiles (cozy density — UIUC default)
- Size: **56×56px**
- Border radius: **18px**
- No border (tileBorder: false for UIUC mood)
- Background: tint color from category
- Icon size: **26px**, strokeWidth: **1.8**

### Typography
- Font: `system-ui, -apple-system, sans-serif`
- Title weight: **800** (headers), **700** (card titles), **600** (row titles)
- Letter spacing: `-0.035em` (large headings), `-0.015em` (card titles), `-0.01em` (rows)

### Filter pills (orange fill active, navy outline inactive)
```css
active:   background #E84A27, color #fff, border none
inactive: background transparent, color #13294B, border 1.5px solid #13294B
padding: 7px 16px, borderRadius: 999, fontSize: 13, fontWeight: 700
```
Do NOT add emojis to filter pills.

### Sheet header pattern (all map/list headers)
```jsx
<div>
  <span style={{ background: '#13294B', color: '#fff', borderRadius: 999, padding: '3px 10px',
                 fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em' }}>UIUC</span>
  <span style={{ background: '#E84A27', color: '#fff', borderRadius: 999, padding: '3px 10px',
                 fontSize: 10.5, fontWeight: 800, letterSpacing: '0.14em' }}>May 7</span>
</div>
<h2>Reading <span style={{ color: '#E84A27' }}>Day</span></h2>
```

### Row layout (map sheet / flat list rows)
Row: `padding 18px 22px`, `borderBottom: 1px solid var(--hair)`
- Icon tile: 56×56, radius 18
- Location name: 17px, weight 600, `--ink`
- Address: 13px, `--ink-3`, ellipsis
- Time row: orange 13px bold + walk pill (bg `#E5ECFA`, fg `#13294B`, 11px, padding 3px 9px)
- Chevron: `<Glyph name="chev" size={16} stroke="var(--ink-3)" />`

### Card layout (events list page)
Cards on `/`: rounded-20, `border: 1px solid var(--hair)` (NO left-border accent), padding 16px.
Show: location name → orange time → headline subtitle → access badge + food type chips.
