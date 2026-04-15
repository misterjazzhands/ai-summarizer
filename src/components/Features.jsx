import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🧠',
    title: 'Smart Text Summarization',
    desc: 'Paste any document, meeting notes, or thread. Synapse distills it into crisp, actionable bullet points in seconds using Gemini AI.',
    tag: 'AI-powered',
    action: '/summarizer',
    cta: 'Try it now →',
  },
  {
    icon: '📄',
    title: 'PDF Summarization',
    desc: 'Upload any PDF document and get an instant, intelligent summary. Synapse extracts text and generates clear insights automatically.',
    tag: 'New',
    action: '/summarizer',
    cta: 'Upload a PDF →',
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    desc: 'Powered by Google Gemini 2.5 Flash, get blazing fast summaries with high accuracy. No waiting, no queues — results in seconds.',
    tag: 'Performance',
    action: '/summarizer',
    cta: 'See it in action →',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    desc: 'Your text is processed in real-time and never stored. PDF files are parsed client-side — nothing leaves your browser until summarization.',
    tag: 'Security',
    action: null,
    cta: null,
  },
]

export default function Features() {
  return (
    <section id="features" className="section">
      <div className="glow-blob" style={{ width: 400, height: 400, background: 'rgba(123,94,167,0.08)', top: '10%', right: '-100px' }} />

      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="section-label">// features</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
            Everything you need<br />to extract insights
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontSize: 17, maxWidth: 480, margin: '16px auto 0' }}>
            From raw text to polished summaries — Synapse handles it all with AI precision.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {features.map((f) => (
            <div key={f.title} className="card" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'var(--cyan-dim)', border: '1px solid rgba(0,229,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, marginBottom: 20,
              }}>{f.icon}</div>

              <span style={{
                fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--cyan)',
                background: 'var(--cyan-dim)', padding: '3px 10px', borderRadius: 100, marginBottom: 12, display: 'inline-block',
                width: 'fit-content',
              }}>{f.tag}</span>

              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, marginTop: 8 }}>{f.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, flex: 1 }}>{f.desc}</p>

              {f.action && (
                <Link
                  to={f.action}
                  style={{
                    marginTop: 20, fontSize: 13, fontFamily: 'var(--font-mono)',
                    color: 'var(--cyan)', textDecoration: 'none', fontWeight: 600,
                    transition: 'opacity 0.2s',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  {f.cta}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
