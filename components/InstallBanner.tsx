'use client'

import { useState, useEffect } from 'react'
import { X, Share } from 'lucide-react'

export default function InstallBanner() {
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    const dismissed = sessionStorage.getItem('install-banner-dismissed')
    if (ios && !standalone && !dismissed) {
      setIsIOS(true)
      setShow(true)
    }
  }, [])

  function dismiss() {
    setShow(false)
    sessionStorage.setItem('install-banner-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-16 left-4 right-4 z-40 bg-gray-900 text-white rounded-2xl shadow-xl p-4 flex items-start gap-3">
      <span className="text-2xl shrink-0">📲</span>
      <div className="flex-1">
        <p className="text-sm font-semibold">Add to Home Screen</p>
        <p className="text-xs text-gray-300 mt-0.5">
          Tap <Share size={11} className="inline" /> then &ldquo;Add to Home Screen&rdquo; for quick access on May 7
        </p>
      </div>
      <button onClick={dismiss} className="shrink-0 text-gray-400 hover:text-white mt-0.5">
        <X size={18} />
      </button>
    </div>
  )
}
