'use client'

import { useState, useEffect } from 'react'

const READING_DAY = new Date('2026-05-07T09:00:00-05:00').getTime()

function getTimeLeft() {
  const diff = READING_DAY - Date.now()
  if (diff <= 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return { days, hours, mins }
}

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!timeLeft) return <p className="text-xs text-orange-500 font-semibold">🎉 Today is Reading Day!</p>

  return (
    <div className="flex items-center gap-3 mt-2">
      {timeLeft.days > 0 && (
        <div className="text-center">
          <p className="text-lg font-extrabold text-orange-500 leading-none">{timeLeft.days}</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">days</p>
        </div>
      )}
      <div className="text-center">
        <p className="text-lg font-extrabold text-orange-500 leading-none">{timeLeft.hours}</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">hrs</p>
      </div>
      <div className="text-center">
        <p className="text-lg font-extrabold text-orange-500 leading-none">{timeLeft.mins}</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide">min</p>
      </div>
      <p className="text-xs text-gray-400">until Reading Day</p>
    </div>
  )
}
