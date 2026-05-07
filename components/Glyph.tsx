interface GlyphProps {
  name: string
  size?: number
  stroke?: string
  fill?: string
  sw?: number
}

export default function Glyph({ name, size = 22, stroke = 'currentColor', fill = 'none', sw = 1.8 }: GlyphProps) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill, stroke, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'mountain': return <svg {...props}><path d="M3 19l5-9 4 6 3-4 6 7H3z"/><circle cx="16" cy="6" r="1.5"/></svg>
    case 'cup':      return <svg {...props}><path d="M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8z"/><path d="M17 10h2a3 3 0 0 1 0 6h-2"/><path d="M9 3v2M12 3v2M15 3v2"/></svg>
    case 'palette':  return <svg {...props}><path d="M12 3a9 9 0 1 0 0 18c1 0 1.5-.5 1.5-1.3 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-.8.7-1.4 1.5-1.4H16a5 5 0 0 0 5-5c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/><circle cx="17.5" cy="11" r="1"/></svg>
    case 'book':     return <svg {...props}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M4 19a2 2 0 0 0 2 2h13"/></svg>
    case 'scissors': return <svg {...props}><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8.5L20 20"/><path d="M8.5 15.5L20 4"/></svg>
    case 'gift':     return <svg {...props}><rect x="3" y="9" width="18" height="11" rx="1"/><path d="M3 14h18"/><path d="M12 9v11"/><path d="M8 9c-2 0-3-1-3-2.5S6 4 7.5 4 12 6 12 9c0-3 3-5 4.5-5S19 5 19 6.5 18 9 16 9"/></svg>
    case 'dumbbell': return <svg {...props}><rect x="2" y="9" width="3" height="6" rx="1"/><rect x="19" y="9" width="3" height="6" rx="1"/><rect x="6" y="7" width="3" height="10" rx="1"/><rect x="15" y="7" width="3" height="10" rx="1"/><path d="M9 12h6"/></svg>
    case 'heart':    return <svg {...props}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/></svg>
    case 'flower':   return <svg {...props}><circle cx="12" cy="12" r="2.5"/><path d="M12 9.5V4M12 14.5V20M9.5 12H4M14.5 12H20M10 10l-3-3M14 14l3 3M14 10l3-3M10 14l-3 3"/></svg>
    case 'basket':   return <svg {...props}><path d="M3 9h18l-2 11H5L3 9z"/><path d="M8 9l3-5M16 9l-3-5"/><path d="M9 13v3M12 13v3M15 13v3"/></svg>
    case 'walk':     return <svg {...props}><circle cx="13" cy="4" r="1.6"/><path d="M9 21l2-7-3-2 1-5 4 1 3 4 3 1"/><path d="M11 14l-1 4 3 3"/></svg>
    case 'chev':     return <svg {...props} strokeWidth={2}><path d="M9 6l6 6-6 6"/></svg>
    case 'search':   return <svg {...props}><circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/></svg>
    case 'plus':     return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>
    case 'minus':    return <svg {...props}><path d="M5 12h14"/></svg>
    case 'target':   return <svg {...props}><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>
    default:         return null
  }
}

export const ICON_FOR: Record<number, string> = {
  1: 'mountain', 2: 'cup',      3: 'palette', 4: 'book',
  5: 'mountain', 6: 'cup',      7: 'scissors', 8: 'gift',
  9: 'dumbbell', 10: 'heart',   11: 'flower',  12: 'basket',
  13: 'book',    14: 'book',   15: 'palette',
}

// UIUC duotone: orange events → Illini orange, everything else → Illini navy
export const PIN_COLOR: Record<string, string> = {
  orange: '#E84A27', blue: '#13294B', green: '#13294B', purple: '#E84A27',
}

export const TILE_TINT: Record<string, string> = {
  orange: '#FFE0D2', blue: '#DCE4F5', green: '#DCE4F5', purple: '#FFE0D2',
}
