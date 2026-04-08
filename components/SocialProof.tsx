'use client'
import { useEffect, useRef, useState } from 'react'

const REVIEWS = [
  {
    name:'Ahsan Raza', city:'Lahore', init:'A',
    grad:'linear-gradient(135deg,#003F88,#0052B4)',
    text:'"Yaar FlightRate ne sach mein mera paisa bacha diya! ISB se DXB ka ticket 12,000 rupay sasta mila aur booking bhi sirf 6 minute mein WhatsApp pe ho gayi. Bilkul zabardast service hai!"',
  },
  {
    name:'Sadia Noor', city:'Karachi', init:'S',
    grad:'linear-gradient(135deg,#10B981,#34D399)',
    text:'"I booked tickets for my whole family — husband + 2 kids — from KHI to DMM. The agent was super helpful, explained everything on WhatsApp and got us a great deal. Highly recommend!"',
  },
  {
    name:'Bilal Chaudhry', city:'Islamabad', init:'B',
    grad:'linear-gradient(135deg,#F59E0B,#FBBF24)',
    text:'"SastaTicket pe bohot confusion hoti thi. FlightRate ka process completely different hai — WhatsApp pe baat, EasyPaisa se payment, 7 minute mein ticket ready. Kamaal hai!"',
  },
]

export default function SocialProof() {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let cur = 0
        const inc = 14832 / 60
        const t = setInterval(() => {
          cur += inc
          if (cur >= 14832) { setCount(14832); clearInterval(t) }
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
      <h2 className="section-title reveal">Trusted by 14,000+ Pakistani Travelers</h2>

      <div className="stats-row reveal">
        {[
          { ic:'✈', num:<span ref={ref}>{count.toLocaleString()}</span>, lbl:'Flights Booked' },
          { ic:'⚡', num:'98.7%', lbl:'On-time Ticketing' },
          { ic:'★',  num:'4.9',  lbl:'Average Rating' },
          { ic:'💬', num:'24/7', lbl:'WhatsApp Support' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <span className="stat-icon">{s.ic}</span>
            <span className="stat-num">{s.num}</span>
            <span className="stat-lbl">{s.lbl}</span>
          </div>
        ))}
      </div>

      <div className="reviews-grid">
        {REVIEWS.map((r, i) => (
          <div key={r.name} className={`rev-card reveal d${i+1}`}>
            <div className="rev-top">
              <div className="rev-av" style={{ background: r.grad }}>{r.init}</div>
              <div>
                <div className="rev-name">{r.name}</div>
                <div className="rev-city">📍 {r.city}</div>
              </div>
            </div>
            <div className="rev-stars">★★★★★</div>
            <p className="rev-text">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
