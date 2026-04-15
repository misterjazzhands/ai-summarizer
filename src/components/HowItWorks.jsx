import { Link } from 'react-router-dom'

const steps = [
  { num: '01', title: 'Paste text or upload PDF', desc: 'Drop in any content — meeting notes, articles, emails, research papers, or upload a PDF document directly.' },
  { num: '02', title: 'AI analyzes your content', desc: 'Synapse uses Google Gemini 2.5 Flash to understand context, identify key themes, and extract the most important information.' },
  { num: '03', title: 'Get actionable insights', desc: 'Receive a clean, structured summary with bold key terms. Copy to clipboard or download as a text file instantly.' },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.02), transparent)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <span className="section-label">// how it works</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
            Summarize in 3 simple steps
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, position: 'relative' }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{ position: 'relative' }}>
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: 28, left: 'calc(100% - 20px)',
                  width: 40, height: 1,
                  background: 'linear-gradient(90deg, var(--cyan-dim), transparent)',
                }} />
              )}
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <div style={{
                  flex: '0 0 56px', width: 56, height: 56,
                  background: 'var(--bg-2)', border: '1px solid var(--border-hover)',
                  borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, color: 'var(--cyan)',
                  boxShadow: '0 0 20px var(--cyan-dim)',
                }}>
                  {s.num}
                </div>
                <div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, marginBottom: 10 }}>{s.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 64 }}>
          <Link to="/summarizer" className="btn-primary" style={{ fontSize: 15, padding: '14px 36px' }}>
            ⚡ Try it now — it's free
          </Link>
        </div>
      </div>
    </section>
  )
}
