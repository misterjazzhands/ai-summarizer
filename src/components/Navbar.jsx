import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const landingLinks = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const isLanding = location.pathname === '/'
  const isSummarizer = location.pathname === '/summarizer'
  const dropdownRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '0 24px',
      background: scrolled ? 'rgba(3,5,10,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      transition: 'all 0.35s ease',
    }}>
      <div style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', height: 68, gap: 40 }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, background: 'var(--cyan)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px var(--cyan-glow)',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke="#03050a" strokeWidth="1.5" fill="none"/>
              <circle cx="9" cy="9" r="2.5" fill="#03050a"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Syn<span style={{ color: 'var(--cyan)' }}>apse</span>
          </span>
        </Link>

        {/* Desktop links — landing page sections */}
        {isLanding && (
          <div style={{ display: 'flex', gap: 32, marginLeft: 16, flex: 1 }} className="desktop-nav">
            {landingLinks.map(l => (
              <a key={l.label} href={l.href} style={{
                color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
                transition: 'color 0.2s', textDecoration: 'none',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >{l.label}</a>
            ))}
          </div>
        )}

        {/* Other pages — back to home */}
        {!isLanding && (
          <div style={{ display: 'flex', gap: 32, marginLeft: 16, flex: 1 }}>
            <Link to="/" style={{
              color: 'var(--text-secondary)', fontSize: 14, fontWeight: 500,
              transition: 'color 0.2s', textDecoration: 'none',
            }}
              onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
            >← Back to Home</Link>
          </div>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          {!isSummarizer && (
            <Link to="/summarizer" className="btn-outline" style={{ padding: '9px 22px', fontSize: 14 }}>
              ⚡ AI Summarizer
            </Link>
          )}

          {user ? (
            /* Logged in — show avatar & dropdown */
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '6px 14px 6px 6px', borderRadius: 100,
                  border: '1px solid var(--border)', background: 'rgba(255,255,255,0.03)',
                  cursor: 'pointer', transition: 'all 0.2s',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cyan)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = dropdownOpen ? 'var(--cyan)' : 'var(--border)'}
              >
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--cyan-dim), var(--violet-dim))',
                  border: '1px solid rgba(0,229,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: 'var(--cyan)',
                }}>{user.initials}</div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{user.displayName}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: 'var(--bg-2)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: 8, minWidth: 200,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                  animation: 'fadeUp 0.2s ease',
                }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{user.displayName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{user.email}</div>
                  </div>
                  <Link
                    to="/summarizer"
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'block', padding: '10px 14px', borderRadius: 8,
                      fontSize: 13, color: 'var(--text-secondary)', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--cyan-dim)'; e.currentTarget.style.color = 'var(--cyan)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >⚡ AI Summarizer</Link>
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 14px', borderRadius: 8, border: 'none', background: 'none',
                      fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,100,100,0.1)'; e.currentTarget.style.color = '#ff6b6b' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                  >↳ Sign out</button>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in — show login/register */
            <>
              <Link to="/login" className="btn-outline" style={{ padding: '9px 22px', fontSize: 14 }}>Log in</Link>
              <Link to="/register" className="btn-primary" style={{ padding: '9px 22px', fontSize: 14 }}>Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
