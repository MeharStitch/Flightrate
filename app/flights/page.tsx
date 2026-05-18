import type { Metadata } from 'next'
import Link from 'next/link'
import { PK_CITIES, DEST_CITIES } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Cheap Flights from Pakistan — All Routes | FlightRate',
  description: 'Find the cheapest flights from Karachi, Lahore, Islamabad to Dubai, Riyadh, Doha and more. Compare all airlines in PKR. Book via WhatsApp.',
  alternates: { canonical: 'https://www.flightrate.pk/flights' },
}

export default function FlightsHubPage() {
  return (
    <div className="route-page">
      <nav className="route-breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span>All Flights</span>
      </nav>

      <div className="route-hero">
        <h1 className="route-h1">Flights from Pakistan</h1>
        <p className="route-sub">Compare fares on all routes to Gulf, Middle East & beyond. Book via WhatsApp.</p>
      </div>

      {/* Destination guides */}
      <section className="route-section">
        <h2>Compare Cheapest Airlines by Destination</h2>
        <div className="route-related">
          <Link href="/flights/cheapest-airlines-pakistan-to-dubai"   className="route-related-link">Pakistan → Dubai</Link>
          <Link href="/flights/cheapest-airlines-pakistan-to-riyadh"  className="route-related-link">Pakistan → Riyadh</Link>
          <Link href="/flights/cheapest-airlines-pakistan-to-jeddah"  className="route-related-link">Pakistan → Jeddah</Link>
          <Link href="/flights/cheapest-airlines-pakistan-to-doha"    className="route-related-link">Pakistan → Doha</Link>
          <Link href="/flights/cheapest-airlines-pakistan-to-london"  className="route-related-link">Pakistan → London</Link>
          <Link href="/flights/cheapest-airlines-pakistan-to-toronto" className="route-related-link">Pakistan → Toronto</Link>
        </div>
      </section>

      {PK_CITIES.map(from => (
        <section key={from.code} className="route-section">
          <h2>Flights from {from.name} ({from.code})</h2>
          <div className="route-related">
            {DEST_CITIES.map(to => (
              <Link
                key={to.code}
                href={`/flights/${from.slug}-to-${to.slug}`}
                className="route-related-link"
              >
                {from.name} → {to.name}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
