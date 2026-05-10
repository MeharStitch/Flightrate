import type { Metadata } from 'next'
import Link from 'next/link'
import { PK_CITIES, DEST_CITIES } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Cheap Flights from Pakistan — All Routes | FlightRate',
  description: 'Find the cheapest flights from Karachi, Lahore, Islamabad to Dubai, Riyadh, Doha and more. Compare all airlines in PKR. Book via WhatsApp.',
  alternates: { canonical: 'https://flightrate.pk/flights' },
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
