import events from '@/data/events.json'
import MapView from '@/components/MapView'
import type { Event } from '@/lib/types'

export default function MapPage() {
  return <MapView events={events as Event[]} />
}
