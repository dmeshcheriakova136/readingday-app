export interface Event {
  id: number
  location: string
  short: string
  headline: string
  address: string
  lat: number
  lng: number
  start_time: string
  end_time: string
  free_food: string[]
  food_types: string[]
  access: string
  activities: string[]
  category: string
  tags: string[]
  emoji: string
  color: string
  notes: string
  link?: string
  schedule?: Array<{ time: string; items: string[] }>
}
