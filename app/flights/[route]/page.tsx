import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAllRoutes, parseRouteSlug,
  getRouteAirlines, getRouteDuration,
  PK_CITIES, DEST_CITIES,
} from '@/lib/routes'

// ─── Static params — build all 88 route pages at deploy ─────────────────────
export function generateStaticParams() {
  return getAllRoutes().map(r => ({ route: r.slug }))
}

// ─── Dynamic metadata per route ──────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ route: string }> }
): Promise<Metadata> {
  const { route } = await params
  const parsed = parseRouteSlug(route)
  if (!parsed) return { title: 'Route Not Found' }

  const { from, to } = parsed
  const title       = `${from.name} to ${to.name} Flights (${from.code}-${to.code}) — Cheapest Fares | FlightRate`
  const description = `Compare cheap flights from ${from.name} (${from.code}) to ${to.name} (${to.code}). Book via WhatsApp in 7 minutes. PKR prices, all airlines. Updated daily.`

  return {
    title,
    description,
    keywords: [
      `${from.name} to ${to.name} flights`,
      `cheap flights ${from.name} ${to.name}`,
      `${from.code} to ${to.code}`,
      `${from.name} ${to.name} ticket price`,
      `${from.name} ${to.country} flights`,
      `Pakistan to ${to.country} flights`,
      `flights from ${from.name}`,
      `${to.name} se ${from.name} flight`,
    ],
    alternates: { canonical: `https://flightrate.pk/flights/${route}` },
    openGraph: {
      title,
      description,
      url: `https://flightrate.pk/flights/${route}`,
      type: 'website',
    },
  }
}

// ─── FAQ data per route ───────────────────────────────────────────────────────
function getFAQs(from: { name: string; code: string }, to: { name: string; code: string }) {
  const airlines = getRouteAirlines(from.code, to.code)
  const duration = getRouteDuration(from.code, to.code)
  return [
    {
      q: `Which airlines fly from ${from.name} to ${to.name}?`,
      a: `${airlines.join(', ')} operate flights on the ${from.name}–${to.name} route. Availability varies by season.`,
    },
    {
      q: `How long is the flight from ${from.name} to ${to.name}?`,
      a: `Direct flights typically take around ${duration}. Connecting flights may take 4–8 hours depending on layover.`,
    },
    {
      q: `What is the cheapest time to fly from ${from.name} to ${to.name}?`,
      a: `Tuesday and Wednesday departures are usually cheapest. Avoid school holidays and Eid periods. Book 3–6 weeks in advance for best fares.`,
    },
    {
      q: `How do I book a ${from.name} to ${to.name} flight via FlightRate?`,
      a: `Search your route and date above, pick your preferred flight, then click "Book via WhatsApp". Our agent confirms the exact price and books your ticket within 7 minutes.`,
    },
    {
      q: `Are prices shown in PKR?`,
      a: `Yes. All fares are displayed in Pakistani Rupees (PKR) including an estimated tax buffer. Final price is confirmed via WhatsApp before payment.`,
    },
  ]
}

// ─── Page component ───────────────────────────────────────────────────────────
export default async function RoutePage(
  { params }: { params: Promise<{ route: string }> }
) {
  const { route } = await params
  const parsed = parseRouteSlug(route)
  if (!parsed) notFound()

  const { from, to } = parsed
  const airlines  = getRouteAirlines(from.code, to.code)
  const duration  = getRouteDuration(from.code, to.code)
  const faqs      = getFAQs(from, to)

  // Tomorrow's date for default search
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 7)
  const searchDate = tomorrow.toISOString().split('T')[0]

  // Related routes (same origin, different dest)
  const relatedDest = DEST_CITIES.filter(c => c.code !== to.code).slice(0, 5)
  const relatedFrom = PK_CITIES.filter(c => c.code !== from.code).slice(0, 4)

  // JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://flightrate.pk/flights/${route}`,
        url: `https://flightrate.pk/flights/${route}`,
        name: `${from.name} to ${to.name} Flights — FlightRate`,
        description: `Compare cheap flights ${from.name} to ${to.name}. Book via WhatsApp.`,
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: `${from.name} to ${to.name}`, item: `https://flightrate.pk/flights/${route}` },
          ],
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="route-page">
        {/* Breadcrumb */}
        <nav className="route-breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/flights">Flights</Link>
          <span>›</span>
          <span>{from.name} to {to.name}</span>
        </nav>

        {/* Hero */}
        <div className="route-hero">
          <h1 className="route-h1">
            Cheap Flights: {from.name} to {to.name}
            <span className="route-codes">({from.code} → {to.code})</span>
          </h1>
          <p className="route-sub">
            Compare all airlines · PKR prices · Book via WhatsApp in 7 minutes
          </p>
        </div>

        {/* Search CTA */}
        <div className="route-search-cta">
          <a
            href={`/search?from=${from.code}&to=${to.code}&date=${searchDate}&adults=1&class=ECONOMY`}
            className="route-search-btn"
          >
            ✈ Search {from.name} → {to.name} Flights
          </a>
        </div>

        {/* Quick facts */}
        <div className="route-facts">
          <div className="route-fact">
            <span className="rf-icon">⏱</span>
            <span className="rf-label">Flight Time</span>
            <span className="rf-val">{duration}</span>
          </div>
          <div className="route-fact">
            <span className="rf-icon">✈</span>
            <span className="rf-label">Airlines</span>
            <span className="rf-val">{airlines.length}+ carriers</span>
          </div>
          <div className="route-fact">
            <span className="rf-icon">💰</span>
            <span className="rf-label">Price From</span>
            <span className="rf-val">PKR 35,000</span>
          </div>
          <div className="route-fact">
            <span className="rf-icon">⚡</span>
            <span className="rf-label">Booking</span>
            <span className="rf-val">7 min via WhatsApp</span>
          </div>
        </div>

        {/* Airlines */}
        <section className="route-section">
          <h2>Airlines Flying {from.name} to {to.name}</h2>
          <div className="route-airlines">
            {airlines.map(a => (
              <div key={a} className="route-airline-chip">
                <img
                  src={`https://www.gstatic.com/flights/airline_logos/70px/${getAirlineCode(a)}.png`}
                  alt={a} width={24} height={24}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
                {a}
              </div>
            ))}
          </div>
          <p className="route-note">
            Availability and frequency vary by season. FlightRate compares fares across all carriers in real time.
          </p>
        </section>

        {/* Tips */}
        <section className="route-section">
          <h2>Tips for Booking {from.name} to {to.name} Flights</h2>
          <ul className="route-tips">
            <li>📅 <strong>Book 3–6 weeks ahead</strong> for the lowest fares on this route</li>
            <li>📆 <strong>Fly mid-week</strong> (Tue/Wed) — cheaper than weekends by up to 20%</li>
            <li>🕐 <strong>Early morning departures</strong> from {from.name} are typically cheapest</li>
            <li>🧳 <strong>Check baggage allowance</strong> — PIA allows 23kg, Emirates 30kg</li>
            <li>💬 <strong>Message us on WhatsApp</strong> — our agent finds you the best deal in minutes</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="route-section">
          <h2>Frequently Asked Questions</h2>
          <div className="route-faqs">
            {faqs.map((f, i) => (
              <details key={i} className="route-faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related routes */}
        <section className="route-section">
          <h2>More flights from {from.name}</h2>
          <div className="route-related">
            {relatedDest.map(d => (
              <Link key={d.code} href={`/flights/${from.slug}-to-${d.slug}`} className="route-related-link">
                {from.name} → {d.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="route-section">
          <h2>Flights to {to.name} from other cities</h2>
          <div className="route-related">
            {relatedFrom.map(f2 => (
              <Link key={f2.code} href={`/flights/${f2.slug}-to-${to.slug}`} className="route-related-link">
                {f2.name} → {to.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className="route-final-cta">
          <h3>Ready to book your {from.name} to {to.name} flight?</h3>
          <p>Search live fares now — our agent books via WhatsApp in 7 minutes.</p>
          <a
            href={`/search?from=${from.code}&to=${to.code}&date=${searchDate}&adults=1&class=ECONOMY`}
            className="route-search-btn"
          >
            Search Flights Now
          </a>
          <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}

// Helper: airline name → IATA code for logo
function getAirlineCode(name: string): string {
  const map: Record<string, string> = {
    'Emirates': 'EK', 'flydubai': 'FZ', 'PIA': 'PK', 'Air Arabia': 'G9',
    'Qatar Airways': 'QR', 'Saudia': 'SV', 'flynas': 'XY', 'Kuwait Airways': 'KU',
    'Oman Air': 'WY', 'Etihad Airways': 'EY', 'Airblue': 'PA', 'Serene Air': 'WZ',
    'FlyJinnah': '9P', 'Gulf Air': 'GF', 'Jazeera Airways': 'J9',
  }
  return map[name] ?? ''
}
