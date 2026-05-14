'use client'
import Link from 'next/link'

const TOP_ROUTES = [
  { slug: 'karachi-to-dubai',      label: 'Karachi → Dubai',      code: 'KHI-DXB' },
  { slug: 'lahore-to-dubai',       label: 'Lahore → Dubai',       code: 'LHE-DXB' },
  { slug: 'islamabad-to-dubai',    label: 'Islamabad → Dubai',    code: 'ISB-DXB' },
  { slug: 'karachi-to-riyadh',     label: 'Karachi → Riyadh',     code: 'KHI-RUH' },
  { slug: 'lahore-to-riyadh',      label: 'Lahore → Riyadh',      code: 'LHE-RUH' },
  { slug: 'islamabad-to-riyadh',   label: 'Islamabad → Riyadh',   code: 'ISB-RUH' },
  { slug: 'karachi-to-jeddah',     label: 'Karachi → Jeddah',     code: 'KHI-JED' },
  { slug: 'lahore-to-jeddah',      label: 'Lahore → Jeddah',      code: 'LHE-JED' },
  { slug: 'karachi-to-doha',       label: 'Karachi → Doha',       code: 'KHI-DOH' },
  { slug: 'islamabad-to-doha',     label: 'Islamabad → Doha',     code: 'ISB-DOH' },
  { slug: 'peshawar-to-dubai',     label: 'Peshawar → Dubai',     code: 'PEW-DXB' },
  { slug: 'karachi-to-london',     label: 'Karachi → London',     code: 'KHI-LHR' },
  { slug: 'islamabad-to-london',   label: 'Islamabad → London',   code: 'ISB-LHR' },
  { slug: 'lahore-to-manchester',  label: 'Lahore → Manchester',  code: 'LHE-MAN' },
  { slug: 'karachi-to-toronto',    label: 'Karachi → Toronto',    code: 'KHI-YYZ' },
  { slug: 'karachi-to-new-york',   label: 'Karachi → New York',   code: 'KHI-JFK' },
]

export default function TopRoutesGrid() {
  return (
    <section className="top-routes-section section">
      <div className="section-label">Browse Routes</div>
      <h2 className="section-title reveal">Popular Flight Routes from Pakistan</h2>
      <p className="section-sub reveal">Click any route to see live PKR prices, airlines, and baggage info</p>
      <div className="top-routes-grid reveal">
        {TOP_ROUTES.map(r => (
          <Link key={r.slug} href={`/flights/${r.slug}`} className="top-route-link">
            <span className="trl-label">{r.label}</span>
            <span className="trl-code">{r.code}</span>
            <span className="trl-arrow">→</span>
          </Link>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/flights" className="trl-view-all">View all flight routes →</Link>
      </div>
    </section>
  )
}
