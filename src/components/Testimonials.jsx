const testimonials = [
  { name: 'Priya Sharma', role: 'Engineering Lead, Zephyr', text: 'Synapse cut our sprint planning from 2 hours to 20 minutes. The AI task prioritization is eerily accurate — it knows what to tackle before we do.', avatar: 'PS' },
  { name: 'Marcus Obi', role: 'Founder, Loopline', text: 'I was skeptical, but the summarizer alone saves me 90 minutes a day. My inbox is no longer a source of dread.', avatar: 'MO' },
  { name: 'Yuna Kato', role: 'Product Manager, Arkive', text: 'Our team shipped 40% faster in Q3. We attribute most of that to Synapse automations handling the handoffs between design and engineering.', avatar: 'YK' },
  { name: 'Daniel Torres', role: 'Solo Developer', text: 'As a one-person team, Synapse is like having a part-time chief of staff. It keeps me on track and kills the busywork.', avatar: 'DT' },
]

const stars = '★★★★★'

export default function Testimonials() {
  return (
    <section id="testimonials" className="section" style={{ background: 'linear-gradient(180deg, transparent, rgba(0,229,255,0.02), transparent)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="section-label">// testimonials</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>Loved by builders worldwide</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {testimonials.map(t => (
            <div key={t.name} className="card" style={{ padding: 28 }}>
              <div style={{ color: 'var(--cyan)', fontSize: 16, letterSpacing: 2, marginBottom: 16 }}>{stars}</div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: 'var(--cyan-dim)', border: '1px solid rgba(0,229,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--cyan)', fontWeight: 600,
                }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
