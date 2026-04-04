import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import './Navbar.css'

export default function Navbar({ user }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <h1 onClick={() => navigate('/')}>📰 NovaNews</h1>
      <div className="nav-links">
        <button onClick={() => navigate('/')}>Home</button>
        <button onClick={() => navigate('/library')}>My Library</button>
        <span>{user.email}</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  )
}