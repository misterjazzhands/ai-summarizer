const team = [
  { name: 'Aisha Nwosu', role: 'CEO & Co-founder', bio: 'Former ML lead at DeepMind. Obsessed with human-AI collaboration.', initials: 'AN', color: '#00e5ff' },
  { name: 'Rohan Mehta', role: 'CTO & Co-founder', bio: 'Ex-Google SWE. Built infra that served 200M users daily.', initials: 'RM', color: '#7b5ea7' },
  { name: 'Sofia Lindqvist', role: 'Head of Design', bio: 'Designed products at Linear and Figma. Obsessive about craft.', initials: 'SL', color: '#00e5ff' },
  { name: 'James Park', role: 'Head of AI Research', bio: 'PhD in NLP from Stanford. Published 20+ papers on language models.', initials: 'JP', color: '#7b5ea7' },
]

export default function Team() {
  return (
    <section id="team" className="section">
      <div className="glow-blob" style={{ width: 400, height: 400, background: 'rgba(123,94,167,0.06)', top: '20%', right: 0 }} />
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span className="section-label">// the team</span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>Built by people who get it</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16, maxWidth: 480, margin: '12px auto 0' }}>
            We've lived the pain of fragmented tools and endless context-switching. Synapse is what we wished existed.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
          {team.map(member => (
            <div key={member.name} className="card" style={{ padding: 32, textAlign: 'center' }}>
              {/* Avatar */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%', margin: '0 auto 20px',
                background: `${member.color}18`, border: `1.5px solid ${member.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
                color: member.color,
              }}>{member.initials}</div>

              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{member.name}</h3>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--cyan)', marginBottom: 14 }}>{member.role}</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{member.bio}</p>

              {/* LinkedIn placeholder */}
              <div style={{ marginTop: 20 }}>
                <a href="#" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12,
                  color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  ↗ LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
