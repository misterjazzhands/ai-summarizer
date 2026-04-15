import { Link } from 'react-router-dom'

const footerLinks = {
  Product: [
    { label: 'AI Summarizer', to: '/summarizer' },
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
  ],
  Company: [
    { label: 'Contact', href: '#contact' },
    { label: 'About', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '64px 0 32px',
      position: 'relative', zIndex: 1,
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 56 }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 30, height: 30, background: 'var(--cyan)', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px var(--cyan-glow)',
              }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke="#03050a" strokeWidth="1.5" fill="none"/>
                  <circle cx="9" cy="9" r="2.5" fill="#03050a"/>
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17 }}>
                Syn<span style={{ color: 'var(--cyan)' }}>apse</span>
              </span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7, maxWidth: 260 }}>
              AI-powered text & PDF summarization. Extract insights from any document in seconds.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              {[
                { icon: '𝕏', href: 'https://twitter.com' },
                { icon: 'in', href: 'https://linkedin.com' },
                { icon: 'gh', href: 'https://github.com' },
              ].map(social => (
                <a key={social.icon} href={social.href} target="_blank" rel="noopener noreferrer" style={{
                  width: 34, height: 34, borderRadius: 8,
                  border: '1px solid var(--border)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', fontSize: 13, fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.color = 'var(--cyan)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >{social.icon}</a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 20, letterSpacing: '0.06em' }}>
                {heading.toUpperCase()}
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {links.map(link => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} style={{ fontSize: 14, color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                      >{link.label}</Link>
                    ) : (
                      <a href={link.href} style={{ fontSize: 14, color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = 'var(--cyan)'}
                        onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                      >{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            © {new Date().getFullYear()} Synapse AI. All rights reserved.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            Made with <span style={{ color: 'var(--cyan)' }}>♥</span> in VIT
          </p>
        </div>
      </div>
    </footer>
  )
}
