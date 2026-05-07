import events from '@/data/events.json'
import type { Event } from '@/lib/types'
import NowClient from './NowClient'

export default function NowPage() {
  return <NowClient events={events as Event[]} />
}
