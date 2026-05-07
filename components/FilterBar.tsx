'use client'

import { useState } from 'react'

export const FILTERS = [
  { label: 'All',         tag: 'all' },
  { label: 'Free Food',   tag: 'free-food-snacks' },
  { label: 'Meals',       tag: 'meal' },
  { label: 'Drinks',      tag: 'drinks' },
  { label: 'Active',      tag: 'active' },
  { label: 'Crafts',      tag: 'crafts' },
  { label: 'Study',       tag: 'study-space' },
  { label: 'Outdoors',    tag: 'outdoors' },
]

export interface FilterBarProps {
  onFilterChange: (tag: string) => void
  onSearch: (query: string) => void
}

export default function FilterBar({ onFilterChange, onSearch }: FilterBarProps) {
  const [active, setActive] = useState('all')

  function handleFilter(tag: string) {
    setActive(tag)
    onFilterChange(tag)
  }

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      background: '#fff',
      borderBottom: '1px solid var(--hair)',
      padding: '12px 16px',
    }}>
      {/* Search */}
      <input
        type="search"
        placeholder="Search locations, food, activities..."
        onChange={e => onSearch(e.target.value)}
        style={{
          width: '100%', borderRadius: 999,
          border: '1.5px solid var(--hair-2)',
          padding: '9px 16px', fontSize: 14,
          fontFamily: 'inherit', outline: 'none',
          color: 'var(--ink)', background: '#FAFAF9',
          boxSizing: 'border-box',
        }}
      />

      {/* Filter pills */}
      <div style={{
        display: 'flex', gap: 8, overflowX: 'auto',
        marginTop: 10, paddingBottom: 2,
        scrollbarWidth: 'none',
      }}>
        {FILTERS.map(({ label, tag }) => {
          const isActive = active === tag
          return (
            <button
              key={tag}
              onClick={() => handleFilter(tag)}
              style={{
                flexShrink: 0, borderRadius: 999,
                padding: '7px 16px', fontSize: 13, fontWeight: 700,
                fontFamily: 'inherit', cursor: 'pointer',
                letterSpacing: '-0.01em',
                border: isActive ? 'none' : '1.5px solid #13294B',
                background: isActive ? '#E84A27' : 'transparent',
                color: isActive ? '#fff' : '#13294B',
                transition: 'all 150ms',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
