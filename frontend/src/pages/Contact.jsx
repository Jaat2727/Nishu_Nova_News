import { useState, useEffect } from 'react'
import './Contact.css'

const SOCIALS = [
  {
    name: 'GitHub',
    description: 'Code Repository',
    link: 'https://github.com/Jaat2727',
    gradient: 'ct-grad-github',
    glow: 'rgba(75, 85, 99, 0.5)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    name: 'LinkedIn',
    description: 'Professional Network',
    link: 'https://www.linkedin.com/in/nishu-dahiya-33b7a8263/',
    gradient: 'ct-grad-linkedin',
    glow: 'rgba(59, 130, 246, 0.5)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    description: 'Visual Stories',
    link: 'https://www.instagram.com/nd_dahiya_927/',
    gradient: 'ct-grad-instagram',
    glow: 'rgba(219, 39, 119, 0.5)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    description: 'Quick Chat',
    link: 'https://wa.me/918607504876',
    gradient: 'ct-grad-whatsapp',
    glow: 'rgba(34, 197, 94, 0.5)',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
  },
  {
    name: 'Phone',
    description: 'Direct Call',
    link: 'tel:+918607504876',
    gradient: 'ct-grad-phone',
    glow: 'rgba(139, 92, 246, 0.5)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
      </svg>
    ),
  },
  {
    name: 'Email',
    description: 'Drop a Mail',
    link: 'mailto:nishu@example.com',
    gradient: 'ct-grad-email',
    glow: 'rgba(251, 146, 60, 0.5)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
      </svg>
    ),
  },
]

export default function Contact() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    const onMove = (e) => setMouse({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="ct-root">
      {/* Ambient background */}
      <div className="ct-bg">
        <div className="ct-bg-grad-1" />
        <div className="ct-bg-grad-2" />
        <div className="ct-bg-grid" />
        <div className="ct-orb ct-orb-1" />
        <div className="ct-orb ct-orb-2" />
      </div>

      {/* Mouse follow glow */}
      <div
        className="ct-mouse-glow"
        style={{ left: mouse.x - 192, top: mouse.y - 192 }}
      />

      {/* Content */}
      <div className="ct-content">
        {/* Header */}
        <div className={`ct-header ${loaded ? 'ct-visible' : ''}`}>
          <div className="ct-badge">
            <span>Connect &amp; Collaborate</span>
          </div>
          <h1>Get In Touch</h1>
          <p className="ct-subtitle">
            Hey, I'm <strong>Nishu</strong>! Feel free to reach out — whether
            it's about a project, collaboration, or just to say hi 👋
          </p>
        </div>

        {/* Cards Grid */}
        <div className="ct-grid">
          {SOCIALS.map((s, i) => (
            <a
              key={s.name}
              href={s.link}
              target={s.link.startsWith('http') ? '_blank' : undefined}
              rel={s.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`ct-card ${loaded ? 'ct-visible' : ''}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Hover glow */}
              <div className="ct-card-glow" style={{
                background: `radial-gradient(circle at 50% 50%, ${s.glow}, transparent 70%)`,
              }} />

              {/* Shimmer */}
              <div className="ct-shimmer" />

              {/* Card body */}
              <div className="ct-card-inner">
                <div className={`ct-icon-wrap ${s.gradient}`}>
                  {s.icon}
                </div>
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <div className="ct-arrow">
                  <span>Connect</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Phone number callout */}
        <div className={`ct-callout ${loaded ? 'ct-visible' : ''}`} style={{ transitionDelay: '700ms' }}>
          <span className="ct-callout-icon">📱</span>
          <span className="ct-callout-text">
            <strong>+91 8607504876</strong> — WhatsApp or Call anytime
          </span>
        </div>
      </div>
    </div>
  )
}
