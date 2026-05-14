'use client'
import { useEffect, useRef, useState } from 'react'

const REVIEWS = [
  {
    name: 'Ahsan Raza', city: 'Lahore', init: 'A', route: 'ISB → DXB', date: '2 days ago',
    grad: 'linear-gradient(135deg,#003F88,#0052B4)',
    text: '"FlightRate ne sach mein mera paisa bacha diya! ISB se DXB ka ticket 12,000 rupay sasta mila aur booking bhi sirf 6 minute mein WhatsApp pe ho gayi. Bilkul zabardast service!"',
  },
  {
    name: 'Sadia Noor', city: 'Karachi', init: 'S', route: 'KHI → DMM', date: '5 days ago',
    grad: 'linear-gradient(135deg,#10B981,#34D399)',
    text: '"Booked for my whole family — husband + 2 kids — from KHI to DMM. The agent explained everything on WhatsApp and got us a great deal. Trusted service, no stress!"',
  },
  {
    name: 'Bilal Chaudhry', city: 'Islamabad', init: 'B', route: 'ISB → DOH', date: '1 week ago',
    grad: 'linear-gradient(135deg,#F59E0B,#FBBF24)',
    text: '"SastaTicket pe bohot confusion hoti thi. FlightRate ka process bilkul alag hai — WhatsApp pe baat, EasyPaisa se payment, 7 minute mein ticket ready. Highly recommend!"',
  },
  {
    name: 'Tariq Mahmood', city: 'London', init: 'T', route: 'LHR → KHI', date: '3 days ago',
    grad: 'linear-gradient(135deg,#8B5CF6,#A78BFA)',
    text: '"Living in London, I always struggled finding PKR-priced tickets. FlightRate shows exact rupee costs with zero hidden charges. Booked London to Karachi in minutes!"',
  },
  {
    name: 'Rabia Tariq', city: 'Dubai', init: 'R', route: 'DXB → LHE', date: '4 days ago',
    grad: 'linear-gradient(135deg,#EF4444,#F87171)',
    text: '"Ghabra rahi thi ke online booking safe hai ya nahi. Agent ne WhatsApp pe pehle sab details confirm ki, phir payment li. Ticket 5 minute mein aa gaya. Bahut trustworthy!"',
  },
  {
    name: 'Usman Ali', city: 'Multan', init: 'U', route: 'MUX → RUH', date: '1 week ago',
    grad: 'linear-gradient(135deg,#0EA5E9,#38BDF8)',
    text: '"Compared 4 sites before FlightRate. Same flight was PKR 8,500 cheaper here. Agent was responsive, ticket came through in 7 minutes. This is how booking should work."',
  },
]

const TRUST_POINTS = [
  { icon: '🔒', text: 'We never ask for card details on WhatsApp — you pay directly via EasyPaisa, JazzCash or bank' },
  { icon: '📋', text: 'Ticket sent to your email + WhatsApp directly from the airline — fully verifiable' },
  { icon: '💸', text: 'Refunds go back to your original payment method — no vouchers, no delays beyond 48 hours' },
  { icon: '📞', text: 'Call or message anytime — real agents, not bots. Our number is +92 324 076 3099' },
]

export default function SocialProof() {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let cur = 0
        const target = 4200
        const inc = target / 60
        const t = setInterval(() => {
          cur += inc
          if (cur >= target) { setCount(target); clearInterval(t) }
          else setCount(Math.floor(cur))
        }, 20)
        obs.disconnect()
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section section-alt">
      <div className="section-label">Social Proof</div>
      <h2 className="section-title reveal">Trusted by Pakistani Families Worldwide</h2>

      {/* Stats */}
      <div className="stats-row reveal">
        {[
          { ic: '✈', num: <span ref={ref}>{count.toLocaleString()}+</span>, lbl: 'Bookings Completed' },
          { ic: '⭐', num: '4.9 / 5',  lbl: 'Customer Rating' },
          { ic: '⚡', num: '< 7 min', lbl: 'Avg. Response Time' },
          { ic: '🌍', num: '154+',    lbl: 'Routes Covered' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <span className="stat-icon">{s.ic}</span>
            <span className="stat-num">{s.num}</span>
            <span className="stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>

      {/* Reviews */}
      <div className="reviews-grid">
        {REVIEWS.map((r, i) => (
          <div key={r.name} className={`rev-card reveal d${(i % 3) + 1}`}>
            <div className="rev-top">
              <div className="rev-av" style={{ background: r.grad }}>{r.init}</div>
              <div className="rev-meta">
                <div className="rev-name">{r.name}</div>
                <div className="rev-city">📍 {r.city}</div>
              </div>
              <span className="rev-verified">✓ Verified</span>
            </div>
            <div className="rev-stars">★★★★★</div>
            <p className="rev-text">{r.text}</p>
            <div className="rev-footer">
              <span className="rev-route">✈ {r.route}</span>
              <span className="rev-date">{r.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Anti-scam trust section */}
      <div className="trust-callout reveal">
        <div className="trust-callout-header">
          <span className="trust-callout-icon">🛡️</span>
          <div>
            <h3>Is FlightRate safe to use?</h3>
            <p>A question we take seriously. Here's exactly how we protect you:</p>
          </div>
        </div>
        <div className="trust-callout-points">
          {TRUST_POINTS.map((p, i) => (
            <div key={i} className="trust-callout-point">
              <span>{p.icon}</span>
              <span>{p.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
