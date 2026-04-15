import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const words = ['Summarize.', 'Automate.', 'Prioritize.', 'Accelerate.']

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[wordIdx]
    let timeout
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 90)
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setWordIdx((wordIdx + 1) % words.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, wordIdx])

  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>

      {/* Background blobs */}
      <div className="glow-blob" style={{ width: 600, height: 600, background: 'rgba(0,229,255,0.07)', top: -100, left: -200 }} />
      <div className="glow-blob" style={{ width: 500, height: 500, background: 'rgba(123,94,167,0.1)', top: 100, right: -150 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>

        {/* Badge */}
        <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <span className="section-label">✦ AI-Powered Productivity</span>
        </div>

        {/* Headline */}
        <h1 className="fade-up delay-1" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.08 }}>
          Your AI workspace<br />
          that can{' '}
          <span style={{ color: 'var(--cyan)', display: 'inline-block', minWidth: '3ch' }}>
            {displayed}<span style={{ animation: 'blink 1s step-end infinite', borderRight: '2px solid var(--cyan)', marginLeft: 2 }} />
          </span>
        </h1>

        {/* Subheading */}
        <p className="fade-up delay-2" style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '24px auto 44px', lineHeight: 1.7 }}>
          Synapse combines AI-powered text & PDF summarization with smart workflow tools — so you can extract insights faster and focus on what matters.
        </p>

        {/* CTA buttons */}
        <div className="fade-up delay-3" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/summarizer" className="btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
            ⚡ Try AI Summarizer →
          </Link>
          <a href="#features" className="btn-outline" style={{ fontSize: 16, padding: '16px 36px' }}>
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <p className="fade-up delay-4" style={{ marginTop: 28, fontSize: 13, color: 'var(--text-muted)' }}>
          Free to use · No sign-up required · Supports Text & PDF
        </p>

        {/* Dashboard mockup */}
        <div className="fade-up delay-4" style={{
          marginTop: 72, animation: 'float 5s ease-in-out infinite',
          position: 'relative', display: 'inline-block',
        }}>
          <div style={{
            background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 20, padding: 20, maxWidth: 780, margin: '0 auto',
            boxShadow: '0 0 80px rgba(0,229,255,0.08), 0 40px 80px rgba(0,0,0,0.5)',
          }}>
            {/* Fake window chrome */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
            </div>
            {/* Mock summarizer preview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
              {/* Input mock */}
              <div style={{ background: 'var(--bg-1)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 10 }}>INPUT // paste text or upload PDF</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  The Q3 planning meeting covered three main topics. The product team presented the new onboarding flow which reduced drop-off by 22%...
                </div>
                <div style={{ marginTop: 12, padding: '8px 16px', background: 'var(--cyan)', borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#03050a', textAlign: 'center' }}>
                  ⚡ Summarize Content
                </div>
              </div>
              {/* Output mock */}
              <div style={{ background: 'var(--bg-1)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 10 }}>OUTPUT // synapse summary</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>•</span>
                    <span><strong style={{ color: 'var(--cyan)' }}>Onboarding flow</strong> reduced drop-off by 22%</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                    <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>•</span>
                    <span><strong style={{ color: 'var(--cyan)' }}>Holiday co-campaign</strong> with 2 partners proposed</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <span style={{ color: 'var(--cyan)', fontWeight: 800 }}>•</span>
                    <span><strong style={{ color: 'var(--cyan)' }}>API v2</strong> delayed to mid-October</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
