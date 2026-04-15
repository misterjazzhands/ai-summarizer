import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1000))
    
    if (form.email && form.password.length >= 6) {
      // Mock login - any email/pass works
      login(form.email, form.password)
      navigate('/')
    } else {
      setError('Invalid credentials. Please check your email and password.')
    }
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 40px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Background blobs */}
        <div className="glow-blob" style={{ width: 500, height: 500, background: 'rgba(0,229,255,0.06)', top: -100, left: -200 }} />
        <div className="glow-blob" style={{ width: 400, height: 400, background: 'rgba(123,94,167,0.08)', bottom: -100, right: -100 }} />

        <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
              <div style={{
                width: 36, height: 36, background: 'var(--cyan)', borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 20px var(--cyan-glow)',
              }}>
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke="#03050a" strokeWidth="1.5" fill="none"/>
                  <circle cx="9" cy="9" r="2.5" fill="#03050a"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20 }}>
                Syn<span style={{ color: 'var(--cyan)' }}>apse</span>
              </span>
            </Link>
            <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Welcome back</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Sign in to your Synapse workspace</p>
          </div>

          {/* Card */}
          <div className="card" style={{ padding: 40 }}>
            {/* Social login */}
            <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginBottom: 24, gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>EMAIL</label>
                <input className="input" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>PASSWORD</label>
                  <a href="#" style={{ fontSize: 12, color: 'var(--cyan)' }}>Forgot password?</a>
                </div>
                <input className="input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
              </div>

              {error && (
                <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ff6b6b' }}>
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '15px 0', marginTop: 4 }}>
                {loading ? 'Signing in...' : 'Sign in →'}
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--cyan)', fontWeight: 500 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </>
  )
}
