/**
 * ScrollToTop.jsx — Floating "Back to Top" button for mobile UI.
 *
 * Shows a sleek arrow-up button in the bottom-right corner
 * when the user scrolls down past 400px. Tapping scrolls
 * smoothly back to the top of the page.
 *
 * Only visible on screens ≤ 768px (mobile/tablet).
 */

import { useState, useEffect } from 'react'
import './ScrollToTop.css'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 400px
      setVisible(window.scrollY > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      className={`scroll-to-top ${visible ? 'visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to top"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}
