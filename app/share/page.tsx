import ShareClient from './ShareClient'

export default function SharePage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reading-day-uiuc.vercel.app'
  return <ShareClient appUrl={appUrl} />
}
