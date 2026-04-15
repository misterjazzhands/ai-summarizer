const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: '',
    desc: 'Perfect for individuals and side projects.',
    features: ['5 AI summaries / day', '50 tasks', 'Basic automations', 'Email support'],
    cta: 'Get started free',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    desc: 'For professionals who want to move faster.',
    features: ['Unlimited AI summaries', 'Unlimited tasks', 'Advanced automations', 'Analytics dashboard', 'Priority support'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For teams that need security, scale, and SLAs.',
    features: ['Everything in Pro', 'SSO & SAML', 'Custom AI models', 'Dedicated account manager', 'SLA guarantee'],
    cta: 'Contact sales',
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="glow-blob" style={{ width: 500, height: 500, background: 'rgba(0,229,255,0.05)', bottom: 0, left: '-100px' }} />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="section-label">// pricing</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>Simple, transparent pricing</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>Start free. Scale when you're ready.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>
          {plans.map(plan => (
            <div key={plan.name} className="card" style={{
              padding: 36,
              border: plan.highlight ? '1px solid var(--cyan)' : '1px solid var(--border)',
              boxShadow: plan.highlight ? '0 0 40px var(--cyan-dim)' : 'none',
              position: 'relative',
            }}>
              {plan.highlight && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--cyan)', color: '#03050a', fontSize: 11, fontWeight: 700,
                  padding: '4px 16px', borderRadius: 100, fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.06em', whiteSpace: 'nowrap',
                }}>MOST POPULAR</div>
              )}

              <div style={{ marginBottom: 8, fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{plan.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 8 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: plan.highlight ? 'var(--cyan)' : 'var(--text-primary)' }}>{plan.price}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>{plan.period}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>{plan.desc}</p>

              <ul style={{ listStyle: 'none', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--cyan)', fontSize: 16, flexShrink: 0 }}>✓</span> {f}
                  </li>
                ))}
              </ul>

              <button
                className={plan.highlight ? 'btn-primary' : 'btn-outline'}
                style={{ width: '100%', justifyContent: 'center', padding: '13px 0' }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
