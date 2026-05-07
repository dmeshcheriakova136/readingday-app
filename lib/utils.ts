import type { Event } from './types'

export interface FeatureChip {
  icon: string
  label: string
}

export function getFeatureChips(ev: Event): FeatureChip[] {
  const chips: FeatureChip[] = []

  const foodPriority: Array<[string, string, string]> = [
    ['coffee',        'local_cafe',    'Free Coffee'],
    ['meal',          'restaurant',    'Free Meal'],
    ['treats',        'cake',          'Free Treats'],
    ['snacks',        'lunch_dining',  'Free Snacks'],
    ['drinks',        'sports_bar',    'Free Drinks'],
    ['care-package',  'redeem',        'Care Package'],
    ['samples',       'science',       'Free Samples'],
  ]
  for (const [type, icon, label] of foodPriority) {
    if (ev.food_types.includes(type)) { chips.push({ icon, label }); break }
  }

  if (ev.tags.includes('animals'))     chips.push({ icon: 'pets',           label: 'Live Animals' })
  if (ev.tags.includes('crafts'))      chips.push({ icon: 'brush',          label: 'Arts & Crafts' })
  if (ev.tags.includes('study-space')) chips.push({ icon: 'menu_book',      label: 'Study Space' })
  if (ev.tags.includes('active'))      chips.push({ icon: 'fitness_center', label: 'Active' })
  if (ev.tags.includes('outdoors'))    chips.push({ icon: 'park',           label: 'Outdoors' })

  const isOpen = ev.access.startsWith('Open') || ev.access.startsWith('Free')
  chips.push(isOpen
    ? { icon: 'lock_open', label: 'Open to All' }
    : { icon: 'badge',     label: 'i-Card Required' })

  return chips.slice(0, 4)
}

export function formatTime(time: string): string {
  if (!time || time === 'TBD') return 'TBD'
  const [h, m] = time.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return m === 0 ? `${hour} ${period}` : `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function formatTimeRange(start: string, end: string): string {
  if (start === 'TBD' || end === 'TBD') return 'Time TBD'
  return `${formatTime(start)} – ${formatTime(end)}`
}
