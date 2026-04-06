/**
 * Navbar.jsx — Top navigation bar shown on every page when logged in.
 *
 * Features:
 *   - Brand logo + name (clickable → Home)
 *   - Nav links: Home, My Library, Contact (active state highlighted)
 *   - User avatar + email display
 *   - Sign Out button
 *   - Mobile hamburger menu for small screens
 */

import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ user }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Mobile menu toggle state
  const [menuOpen, setMenuOpen] = useState(false)

  // Sign the user out and redirect to login
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  // First letter of email for the avatar circle
  const initial = (user.email || 'U')[0].toUpperCase()

  return (
    <nav className="navbar">
      {/* Brand — clicking goes to home */}
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <span className="navbar-logo">⚡</span>
        <span className="navbar-title">NovaNews</span>
      </div>

      {/* Hamburger toggle for mobile */}
      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Backdrop overlay — closes sidebar when tapped (mobile only) */}
      {menuOpen && (
        <div
          className="nav-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Nav links — collapse into sidebar on mobile */}
      <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
        <button
          className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => { navigate('/'); setMenuOpen(false); }}
        >
          Home
        </button>
        <button
          className={`nav-btn ${location.pathname === '/library' ? 'active' : ''}`}
          onClick={() => { navigate('/library'); setMenuOpen(false); }}
        >
          My Library
        </button>
        <button
          className={`nav-btn ${location.pathname === '/contact' ? 'active' : ''}`}
          onClick={() => { navigate('/contact'); setMenuOpen(false); }}
        >
          Contact
        </button>

        {/* User info */}
        <div className="nav-user">
          <div className="nav-avatar">{initial}</div>
          <span className="nav-email">{user.email}</span>
        </div>

        {/* Sign out */}
        <button onClick={handleLogout} className="logout-btn">Sign Out</button>
      </div>
    </nav>
  )
}