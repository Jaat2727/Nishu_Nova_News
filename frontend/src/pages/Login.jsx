import { supabase } from '../supabaseClient'
import './Login.css'

export default function Login() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>📰 NovaNews</h1>
        <p>Your AI-powered personalized news portal</p>
        <button onClick={handleGoogleLogin} className="google-btn">
          Sign in with Google
        </button>
      </div>
    </div>
  )
}