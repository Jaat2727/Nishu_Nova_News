import { supabase } from '../supabaseClient'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ user }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const initial = (user.email || 'U')[0].toUpperCase()

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate('/')}>
        <span className="navbar-logo">⚡</span>
        <span className="navbar-title">NovaNews</span>
      </div>

      <div className="nav-links">
        <button
          className={`nav-btn ${location.pathname === '/' ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          Home
        </button>
        <button
          className={`nav-btn ${location.pathname === '/library' ? 'active' : ''}`}
          onClick={() => navigate('/library')}
        >
          My Library
        </button>
        <button
          className={`nav-btn ${location.pathname === '/contact' ? 'active' : ''}`}
          onClick={() => navigate('/contact')}
        >
          Contact
        </button>
        <div className="nav-user">
          <div className="nav-avatar">{initial}</div>
          <span className="nav-email">{user.email}</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">Sign Out</button>
      </div>
    </nav>
  )
}