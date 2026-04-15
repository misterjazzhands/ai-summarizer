import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 12000, suffix: '+', label: 'Active users' },
  { value: 98, suffix: '%', label: 'Uptime SLA' },
  { value: 4200000, suffix: '+', label: 'Tasks automated' },
  { value: 32, suffix: 'h', label: 'Avg. hours saved/mo' },
]

function useCounter(target, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setCount(Math.floor(ease * target))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration])

  return { count, ref }
}

function StatCard({ value, suffix, label }) {
  const { count, ref } = useCounter(value)
  const display = value >= 1000000
    ? (count / 1000000).toFixed(1) + 'M'
    : value >= 1000
    ? (count / 1000).toFixed(0) + 'K'
    : count

  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '32px 24px' }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
        fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1,
      }}>
        {display}<span style={{ color: 'var(--cyan)' }}>{suffix}</span>
      </div>
      <div style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 8 }}>{label}</div>
    </div>
  )
}

export default function Stats() {
  return (
    <section style={{ padding: '60px 0', position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0 }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{ borderRight: i < stats.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <StatCard {...s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
