import { useState, useEffect, useRef } from 'react'
import { supabase } from '../supabaseClient'
import './Login.css'

/* ────────────────────────────────────────────
   Pupil – tracks mouse or accepts forced direction
──────────────────────────────────────────── */
function Pupil({ size = 12, maxDistance = 5, pupilColor = '#2D2D2D', forceLookX, forceLookY }) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const getPos = () => {
    if (!ref.current) return { x: 0, y: 0 }
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY }
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2
    const dx = mouse.x - cx, dy = mouse.y - cy
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance)
    const angle = Math.atan2(dy, dx)
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
  }

  const pos = getPos()

  return (
    <div
      ref={ref}
      style={{
        width: size, height: size, borderRadius: '50%',
        backgroundColor: pupilColor,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  )
}

/* ────────────────────────────────────────────
   EyeBall – white sclera + tracking pupil
──────────────────────────────────────────── */
function EyeBall({
  size = 48, pupilSize = 16, maxDistance = 10,
  eyeColor = 'white', pupilColor = '#2D2D2D',
  isBlinking = false, forceLookX, forceLookY,
}) {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const getPos = () => {
    if (!ref.current) return { x: 0, y: 0 }
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY }
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2
    const dx = mouse.x - cx, dy = mouse.y - cy
    const dist = Math.min(Math.sqrt(dx * dx + dy * dy), maxDistance)
    const angle = Math.atan2(dy, dx)
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist }
  }

  const pos = getPos()

  return (
    <div
      ref={ref}
      style={{
        width: size, height: isBlinking ? 2 : size,
        borderRadius: '50%', backgroundColor: eyeColor,
        overflow: 'hidden', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        transition: 'height 0.15s ease',
      }}
    >
      {!isBlinking && (
        <div style={{
          width: pupilSize, height: pupilSize, borderRadius: '50%',
          backgroundColor: pupilColor,
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          transition: 'transform 0.1s ease-out',
        }} />
      )}
    </div>
  )
}

/* ────────────────────────────────────────────
   Main Login Page
──────────────────────────────────────────── */
export default function Login() {
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false)
  const [isBlackBlinking, setIsBlackBlinking] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false)
  const [isPurplePeeking, setIsPurplePeeking] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const purpleRef = useRef(null)
  const blackRef  = useRef(null)
  const yellowRef = useRef(null)
  const orangeRef = useRef(null)

  useEffect(() => {
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* Random blinking for purple */
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setIsPurpleBlinking(true)
        setTimeout(() => { setIsPurpleBlinking(false); schedule() }, 150)
      }, Math.random() * 4000 + 3000)
      return t
    }
    const t = schedule()
    return () => clearTimeout(t)
  }, [])

  /* Random blinking for black */
  useEffect(() => {
    const schedule = () => {
      const t = setTimeout(() => {
        setIsBlackBlinking(true)
        setTimeout(() => { setIsBlackBlinking(false); schedule() }, 150)
      }, Math.random() * 4000 + 3000)
      return t
    }
    const t = schedule()
    return () => clearTimeout(t)
  }, [])

  /* Characters look at each other when typing */
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true)
      const t = setTimeout(() => setIsLookingAtEachOther(false), 800)
      return () => clearTimeout(t)
    } else {
      setIsLookingAtEachOther(false)
    }
  }, [isTyping])

  /* Purple sneaky peek when password is shown */
  useEffect(() => {
    if (password.length > 0 && showPassword) {
      const schedule = () => {
        const t = setTimeout(() => {
          setIsPurplePeeking(true)
          setTimeout(() => setIsPurplePeeking(false), 800)
        }, Math.random() * 3000 + 2000)
        return t
      }
      const t = schedule()
      return () => clearTimeout(t)
    } else {
      setIsPurplePeeking(false)
    }
  }, [password, showPassword, isPurplePeeking])

  /* Calculate lean + face offset per character */
  const calcPos = (ref) => {
    if (!ref?.current) return { faceX: 0, faceY: 0, bodySkew: 0 }
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2, cy = r.top + r.height / 3
    const dx = mouse.x - cx, dy = mouse.y - cy
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    }
  }

  const purplePos = calcPos(purpleRef)
  const blackPos  = calcPos(blackRef)
  const yellowPos = calcPos(yellowRef)
  const orangePos = calcPos(orangeRef)

  const passwordVisible = password.length > 0 && showPassword
  const passwordHidden  = password.length > 0 && !showPassword

  /* Google OAuth */
  const handleGoogleLogin = async () => {
    setIsLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    setIsLoading(false)
  }

  return (
    <div className="lp-root">
      {/* ── Left panel ── */}
      <div className="lp-left">
        {/* Brand */}
        <div className="lp-brand">
          <div className="lp-brand-icon">⚡</div>
          <span className="lp-brand-name">NovaNews</span>
        </div>

        {/* Animated Characters Stage */}
        <div className="lp-stage-wrap">
          <div className="lp-stage">

            {/* Purple – back layer */}
            <div
              ref={purpleRef}
              className="lp-char lp-purple"
              style={{
                height: (isTyping || passwordHidden) ? 440 : 400,
                transform: passwordVisible
                  ? 'skewX(0deg)'
                  : (isTyping || passwordHidden)
                    ? `skewX(${purplePos.bodySkew - 12}deg) translateX(40px)`
                    : `skewX(${purplePos.bodySkew}deg)`,
              }}
            >
              <div
                className="lp-eyes"
                style={{
                  left: passwordVisible ? 20 : isLookingAtEachOther ? 55 : 45 + purplePos.faceX,
                  top:  passwordVisible ? 35 : isLookingAtEachOther ? 65 : 40 + purplePos.faceY,
                  gap: 32,
                }}
              >
                <EyeBall size={18} pupilSize={7} maxDistance={5}
                  eyeColor="white" pupilColor="#2D2D2D"
                  isBlinking={isPurpleBlinking}
                  forceLookX={passwordVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={passwordVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                />
                <EyeBall size={18} pupilSize={7} maxDistance={5}
                  eyeColor="white" pupilColor="#2D2D2D"
                  isBlinking={isPurpleBlinking}
                  forceLookX={passwordVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={passwordVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined}
                />
              </div>
            </div>

            {/* Black – middle layer */}
            <div
              ref={blackRef}
              className="lp-char lp-black"
              style={{
                transform: passwordVisible
                  ? 'skewX(0deg)'
                  : isLookingAtEachOther
                    ? `skewX(${blackPos.bodySkew * 1.5 + 10}deg) translateX(20px)`
                    : `skewX(${blackPos.bodySkew}deg)`,
              }}
            >
              <div
                className="lp-eyes"
                style={{
                  left: passwordVisible ? 10 : isLookingAtEachOther ? 32 : 26 + blackPos.faceX,
                  top:  passwordVisible ? 28 : isLookingAtEachOther ? 12 : 32 + blackPos.faceY,
                  gap: 24,
                }}
              >
                <EyeBall size={16} pupilSize={6} maxDistance={4}
                  eyeColor="white" pupilColor="#2D2D2D"
                  isBlinking={isBlackBlinking}
                  forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined}
                />
                <EyeBall size={16} pupilSize={6} maxDistance={4}
                  eyeColor="white" pupilColor="#2D2D2D"
                  isBlinking={isBlackBlinking}
                  forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined}
                />
              </div>
            </div>

            {/* Orange – front left semi-circle */}
            <div
              ref={orangeRef}
              className="lp-char lp-orange"
              style={{
                transform: passwordVisible ? 'skewX(0deg)' : `skewX(${orangePos.bodySkew}deg)`,
              }}
            >
              <div
                className="lp-eyes"
                style={{
                  left: passwordVisible ? 50 : 82 + orangePos.faceX,
                  top:  passwordVisible ? 85 : 90 + orangePos.faceY,
                  gap: 32,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined}
                />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined}
                />
              </div>
            </div>

            {/* Yellow – front right pill */}
            <div
              ref={yellowRef}
              className="lp-char lp-yellow"
              style={{
                transform: passwordVisible ? 'skewX(0deg)' : `skewX(${yellowPos.bodySkew}deg)`,
              }}
            >
              <div
                className="lp-eyes"
                style={{
                  left: passwordVisible ? 20 : 52 + yellowPos.faceX,
                  top:  passwordVisible ? 35 : 40 + yellowPos.faceY,
                  gap: 24,
                }}
              >
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined}
                />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined}
                />
              </div>
              {/* Mouth */}
              <div
                className="lp-mouth"
                style={{
                  left: passwordVisible ? 10 : 40 + yellowPos.faceX,
                  top:  passwordVisible ? 88 : 88 + yellowPos.faceY,
                }}
              />
            </div>

          </div>
        </div>

        {/* Footer links */}
        <div className="lp-left-footer">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact</a>
        </div>

        {/* Decorative blobs */}
        <div className="lp-blob lp-blob-1" />
        <div className="lp-blob lp-blob-2" />
      </div>

      {/* ── Right panel ── */}
      <div className="lp-right">
        {/* Mobile brand */}
        <div className="lp-brand lp-brand-mobile">
          <div className="lp-brand-icon lp-brand-icon-dark">⚡</div>
          <span className="lp-brand-name lp-brand-name-dark">NovaNews</span>
        </div>

        <div className="lp-form-wrap">
          <div className="lp-header">
            <h1>Welcome back!</h1>
            <p>AI-powered news, personalized for you.</p>
          </div>

          {/* Password field – still shown so characters react */}
          <div className="lp-field">
            <label htmlFor="lp-pw">Peek detection demo</label>
            <div className="lp-pw-wrap">
              <input
                id="lp-pw"
                type={showPassword ? 'text' : 'password'}
                placeholder="Type something to see characters react…"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                className="lp-input"
                autoComplete="off"
              />
              <button
                type="button"
                className="lp-pw-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide' : 'Show'}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            <p className="lp-hint">
              {passwordHidden
                ? '🙈 Characters are looking away!'
                : passwordVisible
                  ? '👀 Purple is sneaky-peeking your password!'
                  : '✨ Type a password and toggle visibility to see characters react'}
            </p>
          </div>

          <div className="lp-divider"><span>Sign in to continue</span></div>

          {/* Google OAuth */}
          <button
            className="lp-google-btn"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            id="google-signin-btn"
          >
            <svg className="lp-google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>

          {/* Feature grid */}
          <div className="lp-features">
            <div className="lp-feature"><span>✨</span><span>AI Summaries</span></div>
            <div className="lp-feature"><span>📚</span><span>Save Articles</span></div>
            <div className="lp-feature"><span>🌐</span><span>Global News</span></div>
            <div className="lp-feature"><span>🔒</span><span>Secure &amp; Private</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}