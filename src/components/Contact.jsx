import { useState } from 'react'
import emailjs from 'emailjs-com'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('') // '', 'sending', 'sent', 'error'

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setStatus('sending')

    await emailjs.send(
     'service_jetv2fv',
     'template_cxxdotp',
     form,
     '6rOZGQB71sQPk3tXu'
   )
   setStatus('sent')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <section id="contact" className="section">
      <div className="glow-blob" style={{ width: 400, height: 400, background: 'rgba(0,229,255,0.05)', bottom: 0, right: 0 }} />
      <div className="container">
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span className="section-label">// contact</span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>Get in touch</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 12, fontSize: 16 }}>
              Have questions? Want a demo? We'd love to hear from you.
            </p>
          </div>

          <div className="card" style={{ padding: 48 }}>
            {status === 'sent' ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <h3 style={{ fontSize: 22, marginBottom: 8 }}>Message sent!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>We'll get back to you within 24 hours.</p>
                <button className="btn-outline" style={{ marginTop: 24 }} onClick={() => setStatus('')}>Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>NAME</label>
                    <input className="input" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>EMAIL</label>
                    <input className="input" name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>MESSAGE</label>
                  <textarea className="input" name="message" rows={5} placeholder="Tell us about your use case..." value={form.message} onChange={handleChange} required style={{ resize: 'vertical' }} />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={status === 'sending'}
                  style={{ alignSelf: 'flex-start', padding: '14px 40px' }}
                >
                  {status === 'sending' ? 'Sending...' : 'Send message →'}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
            {[
              { label: 'Email', val: 'hello@synapse.ai' },
              { label: 'Twitter', val: '@synapse_ai' },
              { label: 'Location', val: 'Vellore, IN' },
            ].map(c => (
              <div key={c.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{c.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
