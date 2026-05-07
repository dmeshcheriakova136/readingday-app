'use client'

import { useState, useMemo } from 'react'
import FilterBar from './FilterBar'
import EventCard from './EventCard'
import type { Event } from '@/lib/types'

export default function EventListClient({ events }: { events: Event[] }) {
  const [activeTag, setActiveTag] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return events.filter((e) => {
      const matchTag =
        activeTag === 'all' ||
        (activeTag === 'free-food-snacks'
          ? e.tags.includes('free-food') || e.tags.includes('snacks')
          : e.tags.includes(activeTag))
      const matchSearch =
        q === '' ||
        e.location.toLowerCase().includes(q) ||
        e.address.toLowerCase().includes(q) ||
        e.free_food.some((f) => f.toLowerCase().includes(q)) ||
        e.food_types.some((f) => f.toLowerCase().includes(q)) ||
        e.activities.some((a) => a.toLowerCase().includes(q)) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.notes.toLowerCase().includes(q)
      return matchTag && matchSearch
    })
  }, [events, activeTag, search])

  return (
    <>
      <FilterBar onFilterChange={setActiveTag} onSearch={setSearch} />
      <div style={{ padding: '12px 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#8C8678' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#4A463E', margin: '0 0 4px' }}>No results</p>
            <p style={{ fontSize: 13, margin: 0 }}>Try a different filter or search term</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 11.5, color: '#8C8678', fontWeight: 600, margin: '0 0 2px', letterSpacing: '0.02em' }}>
              {filtered.length} location{filtered.length !== 1 ? 's' : ''}
            </p>
            {filtered.map((event) => <EventCard key={event.id} event={event} />)}
          </>
        )}
      </div>
    </>
  )
}
