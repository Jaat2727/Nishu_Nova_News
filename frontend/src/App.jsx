/**
 * App.jsx — Root component of the NovaNews application.
 *
 * Responsibilities:
 *   1. Check if the user is logged in (via Supabase session)
 *   2. Listen for auth changes (login/logout/token refresh)
 *   3. Show a loading spinner while checking auth status
 *   4. Render routes: Login, Home, Library, Contact
 *   5. Show the Navbar on all pages when logged in
 *
 * Route structure:
 *   /login    → Login page (only if NOT logged in)
 *   /         → Home / news feed (only if logged in)
 *   /library  → Saved articles (only if logged in)
 *   /contact  → Contact / social links (only if logged in)
 */

import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Library from './pages/Library'
import Login from './pages/Login'
import Contact from './pages/Contact'
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [user, setUser] = useState(null)      // current logged-in user object
  const [loading, setLoading] = useState(true) // true while checking auth

  useEffect(() => {
    // Check if the user already has an active session (e.g., from a previous visit)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // Clean up the listener when the component unmounts
    return () => subscription.unsubscribe()
  }, [])

  // Show loading spinner while we check if user is logged in
  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <span className="loading-text">Loading NovaNews...</span>
    </div>
  )

  return (
    <BrowserRouter>
      {/* Navbar is only shown when user is logged in */}
      {user && <Navbar user={user} />}

      <Routes>
        {/* Login page — redirect to Home if already logged in */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

        {/* Protected routes — redirect to Login if not logged in */}
        <Route path="/" element={user ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/library" element={user ? <Library user={user} /> : <Navigate to="/login" />} />
        <Route path="/contact" element={user ? <Contact /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App