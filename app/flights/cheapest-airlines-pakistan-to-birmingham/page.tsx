import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600

const ROUTES = [
  { from: 'KHI', fromName: 'Karachi',   slug: 'karachi-to-birmingham' },
  { from: 'LHE', fromName: 'Lahore',    slug: 'lahore-to-birmingham' },
  { from: 'ISB', fromName: 'Islamabad', slug: 'islamabad-to-birmingham' },
]

const AIRLINES = [
  { name: 'PIA',              code: 'PK', type: 'Full Service', baggage: '23 kg', meals: 'Yes', stops: 'Direct',  notes: 'Only direct service to Birmingham' },
  { name: 'Qatar Airways',    code: 'QR', type: 'Full Service', baggage: '30 kg', meals: 'Yes', stops: '1 stop',  notes: 'Via Doha, 30 kg baggage ideal for families' },
  { name: 'Emirates',         code: 'EK', type: 'Full Service', baggage: '30 kg', meals: 'Yes', stops: '1 stop',  notes: 'Via Dubai, strong connections' },
  { name: 'Turkish Airlines', code: 'TK', type: 'Full Service', baggage: '30 kg', meals: 'Yes', stops: '1 stop',  notes: 'Via Istanbul, frequently cheapest option' },
]

async function getRoutePrice(from: string) {
  try {
    const res = await fetch(
      `https://www.flightrate.pk/api/prices/${from}-BHX`,
      { next: { revalidate: 3600, tags: [`price-${from}-BHX`] } }
    )
    if (!res.ok) return null
    const d = await res.json()
    return d?.minPrice ? d.minPrice + 7000 : null
  } catch { return null }
}

export const metadata: Metadata = {
  title: 'Cheapest Airlines from Pakistan to Birmingham — PKR Prices | FlightRate',
  description: 'Compare all airlines flying Pakistan to Birmingham: PIA direct, Qatar Airways, Emirates, Turkish Airlines. PKR prices from Karachi, Lahore, Islamabad. Best for Pakistani community in Birmingham, Wolverhampton & Midlands. Book via WhatsApp.',
  keywords: [
    'cheapest airline from pakistan to birmingham',
    'pakistan to birmingham flight price pkr',
    'karachi to birmingham cheap flights',
    'lahore to birmingham ticket price',
    'islamabad to birmingham flights pkr',
    'pia flight pakistan birmingham',
    'pakistan birmingham airlines compare',
    'cheap flights to birmingham from pakistan',
    'birmingham airport pakistan flights',
    'pakistani community birmingham flights',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-birmingham' },
  openGraph: {
    title: 'Cheapest Airlines Pakistan to Birmingham — PKR Prices Compared | FlightRate',
    description: "Today's cheapest Pakistan to Birmingham flight prices in PKR. Compare PIA direct, Qatar Airways, Emirates & Turkish Airlines.",
    url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-birmingham',
    type: 'website',
  },
}

const FAQ = [
  {
    q: 'Does PIA fly direct from Pakistan to Birmingham?',
    a: 'Yes — PIA operates direct flights from Karachi (KHI), Lahore (LHE), and Islamabad (ISB) to Birmingham Airport (BHX). PIA is the only Pakistani carrier with direct service to Birmingham, making it the preferred choice for Pakistani families in the West Midlands. Flight duration is approximately 8.5–9 hours direct.',
  },
  {
    q: 'Which is the cheapest airline from Pakistan to Birmingham?',
    a: 'Turkish Airlines via Istanbul is frequently the cheapest option for Pakistan to Birmingham, often PKR 18,000–32,000 lower than PIA on economy class. Qatar Airways via Doha offers 30 kg baggage at competitive prices. Emirates via Dubai is premium but reliable. FlightRate compares all four carriers daily so you always see the current best price in PKR.',
  },
  {
    q: 'Is it cheaper to fly into Birmingham or London from Pakistan?',
    a: 'Birmingham and London fares are often very similar on PIA direct routes. However, for the Pakistani community in Birmingham, Wolverhampton, West Bromwich, and the wider Midlands, BHX is the better choice — avoiding the London Heathrow to Midlands train (2 hours, PKR 6,000–10,000+). Birmingham Airport is also smaller and less congested than Heathrow.',
  },
  {
    q: 'When is the cheapest time to fly from Pakistan to Birmingham?',
    a: 'January to March is the cheapest period for Pakistan–Birmingham flights, typically 25–40% below summer peak. August (school holidays) and December (Christmas/winter break) are the most expensive — the Pakistani diaspora in Birmingham travels heavily during these periods. Book 6–10 weeks ahead for the best rates.',
  },
  {
    q: 'What baggage allowance does PIA give on Pakistan to Birmingham flights?',
    a: 'PIA economy class on Pakistan–Birmingham routes includes 23 kg check-in baggage. Families sending extra luggage should note that Qatar Airways and Turkish Airlines both allow 30 kg at competitive fares — often better value when you factor in baggage costs. FlightRate\'s WhatsApp team can calculate total cost including baggage on all airlines.',
  },
]

export default async function CheapestAirlinesBhamPage() {
  const prices = await Promise.all(ROUTES.map(r => getRoutePrice(r.from)))
  const today  = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-birmingham',
        name: 'Cheapest Airlines from Pakistan to Birmingham — Compare PKR Prices',
        dateModified: new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: 'Cheapest Airlines Pakistan to Birmingham', item: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-birmingham' },
          ],
        },
      },
      {
        '@type': 'Article',
        headline: 'Cheapest Airlines from Pakistan to Birmingham — Live PKR Price Comparison',
        description: 'Real-time PKR prices for all airlines flying Pakistan to Birmingham. Compare PIA direct, Qatar Airways, Emirates, Turkish Airlines. Updated daily.',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-birmingham',
        datePublished: '2026-05-18',
        dateModified: new Date().toISOString(),
        image: { '@type': 'ImageObject', url: 'https://www.flightrate.pk/opengraph-image', width: 1200, height: 630 },
        author: { '@type': 'Organization', '@id': 'https://www.flightrate.pk/#organization', name: 'FlightRate', url: 'https://www.flightrate.pk' },
        publisher: { '@type': 'Organization', '@id': 'https://www.flightrate.pk/#organization', name: 'FlightRate', url: 'https://www.flightrate.pk', logo: { '@type': 'ImageObject', url: 'https://www.flightrate.pk/opengraph-image', width: 1200, height: 630 } },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="route-page">
        <nav className="route-breadcrumb">
          <Link href="/">Home</Link><span>›</span>
          <Link href="/flights">Flights</Link><span>›</span>
          <span>Cheapest Airlines Pakistan to Birmingham</span>
        </nav>

        <div className="route-hero">
          <h1 className="route-h1">Cheapest Airlines from Pakistan to Birmingham</h1>
          <p className="route-sub">
            Compare PKR prices across all airlines — updated daily from live data
          </p>
          <p className="route-freshness">
            <time dateTime={new Date().toISOString()}>
              ✓ Prices last updated {today}
            </time>
          </p>
        </div>

        <section className="route-section">
          <h2>Today&apos;s Cheapest Price by Departure City</h2>
          <div className="compare-grid">
            {ROUTES.map((r, i) => (
              <Link key={r.from} href={`/flights/${r.slug}`} className="compare-card">
                <span className="compare-city">{r.fromName}</span>
                <span className="compare-code">{r.from} → BHX</span>
                <span className="compare-price">
                  {prices[i] ? `PKR ${prices[i]!.toLocaleString('en-PK')}` : 'Check price →'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="route-section">
          <h2>Airlines Flying Pakistan to Birmingham — Full Comparison</h2>
          <div className="baggage-table-wrap">
            <table className="baggage-table">
              <thead>
                <tr>
                  <th>Airline</th><th>Type</th><th>Check-in Bag</th><th>Meals</th><th>Stops</th><th>Best For</th>
                </tr>
              </thead>
              <tbody>
                {AIRLINES.map(a => (
                  <tr key={a.code}>
                    <td><strong>{a.name}</strong></td>
                    <td>{a.type}</td>
                    <td>{a.baggage}</td>
                    <td>{a.meals}</td>
                    <td>{a.stops}</td>
                    <td>{a.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="route-note">
            Prices vary by date and availability. FlightRate compares all airlines daily.{' '}
            <a href="https://wa.me/923240763099" target="_blank" rel="noopener noreferrer">
              Message us on WhatsApp
            </a>{' '}for today&apos;s best deal.
          </p>
        </section>

        <section className="route-section">
          <h2>Tips for Cheapest Pakistan to Birmingham Flights</h2>
          <ul className="route-tips">
            <li>📅 <strong>Book 6–10 weeks ahead</strong> — Birmingham fares jump 35–55% in summer and Eid</li>
            <li>✈ <strong>PIA direct vs Turkish Airlines</strong> — TK via IST is often PKR 18,000–32,000 cheaper but 3–5 hours longer</li>
            <li>🧳 <strong>Families sending luggage: choose QR or TK</strong> — 30 kg allowance vs PIA&apos;s 23 kg</li>
            <li>📆 <strong>January to March</strong> — cheapest months, avoid August &amp; December</li>
            <li>🏙 <strong>Skip London if you&apos;re going to the Midlands</strong> — BHX saves 2h train + PKR 8,000+</li>
            <li>💬 <strong>Message FlightRate on WhatsApp</strong> — we confirm the best fare in 7 minutes</li>
          </ul>
        </section>

        <section className="route-section">
          <h2>Flights to Birmingham from Each Pakistani City</h2>
          <div className="route-related">
            {ROUTES.map(r => (
              <Link key={r.from} href={`/flights/${r.slug}`} className="route-related-link">
                {r.fromName} → Birmingham
              </Link>
            ))}
            <Link href="/flights/cheapest-airlines-pakistan-to-london" className="route-related-link">
              Compare Pakistan → London too
            </Link>
            <Link href="/flights/cheapest-airlines-pakistan-to-manchester" className="route-related-link">
              Compare Pakistan → Manchester too
            </Link>
          </div>
        </section>

        <section className="route-section">
          <h2>Frequently Asked Questions</h2>
          <div className="route-faqs">
            {FAQ.map((f, i) => (
              <details key={i} className="route-faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <div className="route-final-cta">
          <h3>Ready to find the cheapest Pakistan to Birmingham flight?</h3>
          <p>Our agents compare all airlines and book via WhatsApp in 7 minutes.</p>
          <a href="/search?to=BHX&adults=1&class=ECONOMY" className="route-search-btn">
            Search All Flights to Birmingham
          </a>
          <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">
            💬 Get Best Price on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
