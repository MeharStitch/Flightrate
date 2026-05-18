import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600 // re-render every hour

// ─── Routes covered on this page ─────────────────────────────────────────────
const ROUTES = [
  { from: 'KHI', fromName: 'Karachi',   slug: 'karachi-to-toronto' },
  { from: 'LHE', fromName: 'Lahore',    slug: 'lahore-to-toronto' },
  { from: 'ISB', fromName: 'Islamabad', slug: 'islamabad-to-toronto' },
]

// Airline info for comparison table
const AIRLINES = [
  { name: 'Qatar Airways',    code: 'QR', type: 'Full Service', baggage: '30 kg', meals: 'Yes',  stops: '1 stop',  notes: 'Via Doha, award-winning service' },
  { name: 'Emirates',         code: 'EK', type: 'Full Service', baggage: '30 kg', meals: 'Yes',  stops: '1 stop',  notes: 'Via Dubai, daily connections' },
  { name: 'Turkish Airlines', code: 'TK', type: 'Full Service', baggage: '30 kg', meals: 'Yes',  stops: '1 stop',  notes: 'Via Istanbul, often lowest fares' },
  { name: 'Air Canada',       code: 'AC', type: 'Full Service', baggage: '23 kg', meals: 'Yes',  stops: '1-2 stops', notes: 'Canadian national carrier via Europe/US' },
]

// ─── Live prices fetched per route ───────────────────────────────────────────
async function getRoutePrice(from: string) {
  try {
    const res = await fetch(
      `https://www.flightrate.pk/api/prices/${from}-YYZ`,
      { next: { revalidate: 3600, tags: [`price-${from}-YYZ`] } }
    )
    if (!res.ok) return null
    const d = await res.json()
    return d?.minPrice ? d.minPrice + 7000 : null
  } catch { return null }
}

export const metadata: Metadata = {
  title: 'Cheapest Airlines from Pakistan to Toronto — Compare PKR Prices | FlightRate',
  description: 'Compare all airlines flying Pakistan to Toronto: Qatar Airways, Emirates, Turkish Airlines, Air Canada. See today\'s PKR prices from Karachi, Lahore, Islamabad. Ideal for Pakistani-Canadians & students. Book via WhatsApp.',
  keywords: [
    'cheapest airline from pakistan to toronto',
    'cheapest airline pakistan toronto pkr',
    'which airline is cheapest from karachi to toronto',
    'pakistan to toronto flight comparison',
    'pakistan canada flights cheapest',
    'karachi lahore islamabad to toronto',
    'pakistani community canada flights',
    'student visa flight pakistan toronto',
    'pakistan to toronto via doha dubai',
    'cheapest way fly pakistan canada',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-toronto' },
  openGraph: {
    title: 'Cheapest Airlines Pakistan to Toronto — PKR Prices Compared | FlightRate',
    description: 'Today\'s cheapest flight prices from Pakistani cities to Toronto Pearson. Compare Qatar Airways, Emirates, Turkish Airlines and Air Canada in PKR.',
    url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-toronto',
    type: 'website',
  },
}

const FAQ = [
  {
    q: 'How long is the flight from Pakistan to Toronto?',
    a: 'Total travel time from Pakistan to Toronto (YYZ) is typically 14–17 hours including a layover, depending on the hub. Via Doha (Qatar Airways) is around 15–17 hours total. Via Dubai (Emirates) is similar at 15–17 hours. Via Istanbul (Turkish Airlines) is approximately 14–16 hours. There are currently no non-stop flights between Pakistan and Canada.',
  },
  {
    q: 'Which hub is cheapest for Pakistan to Toronto — Doha, Dubai, or Istanbul?',
    a: 'Turkish Airlines via Istanbul is frequently the cheapest option for Pakistan to Toronto, often PKR 20,000–50,000 less than Emirates or Qatar Airways on economy. However, Qatar Airways and Emirates run promotional fares that can be very competitive. FlightRate compares all hubs daily so you always get the current best price.',
  },
  {
    q: 'Which airline is best for Pakistani students flying to Toronto?',
    a: 'Turkish Airlines is often the best value for students — cheapest fares plus 30 kg baggage allowance for carrying laptops, books, and clothing. Qatar Airways and Emirates also offer 30 kg with superior in-flight comfort for the long 14–17 hour journey. Air Canada\'s student fares can be competitive but typically involve more stops. Contact our WhatsApp team for current student deals.',
  },
  {
    q: 'Can Pakistani permanent residents (PR holders) get cheaper flights to Toronto?',
    a: 'PR holders flying back to Canada after visiting Pakistan should compare all airlines — there are no PR-specific discounts. However, booking 6–10 weeks ahead and travelling midweek (Tuesday–Thursday) can save PKR 20,000–40,000 versus last-minute weekend bookings. FlightRate can set up a price alert for your preferred dates.',
  },
  {
    q: 'What documents do Pakistani passport holders need to fly to Toronto?',
    a: 'Pakistani citizens require a valid Canadian visa (visitor, student, or work) or Permanent Resident card to enter Canada. Additionally, a Canadian Electronic Travel Authorization (eTA) is required if transiting through Canada without a visa. Always verify your transit visa requirements for the layover country (Qatar, UAE, or Turkey) before booking. Our WhatsApp team can advise on documentation.',
  },
]

export default async function CheapestAirlinesTorontoPage() {
  const prices = await Promise.all(ROUTES.map(r => getRoutePrice(r.from)))
  const today  = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-toronto',
        name: 'Cheapest Airlines from Pakistan to Toronto — Compare PKR Prices',
        dateModified: new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: 'Cheapest Airlines Pakistan to Toronto', item: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-toronto' },
          ],
        },
      },
      {
        '@type': 'Article',
        headline: 'Cheapest Airlines from Pakistan to Toronto — Live PKR Price Comparison',
        description: 'Real-time PKR prices for all airlines flying Pakistan to Toronto. Compare Qatar Airways, Emirates, Turkish Airlines, Air Canada. Updated daily.',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-toronto',
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
          <span>Cheapest Airlines Pakistan to Toronto</span>
        </nav>

        <div className="route-hero">
          <h1 className="route-h1">Cheapest Airlines from Pakistan to Toronto</h1>
          <p className="route-sub">
            Compare PKR prices across all airlines — updated daily from live data
          </p>
          <p className="route-freshness">
            <time dateTime={new Date().toISOString()}>
              ✓ Prices last updated {today}
            </time>
          </p>
        </div>

        {/* Today's prices by city */}
        <section className="route-section">
          <h2>Today&apos;s Cheapest Price by Departure City</h2>
          <div className="compare-grid">
            {ROUTES.map((r, i) => (
              <Link key={r.from} href={`/flights/${r.slug}`} className="compare-card">
                <span className="compare-city">{r.fromName}</span>
                <span className="compare-code">{r.from} → YYZ</span>
                <span className="compare-price">
                  {prices[i] ? `PKR ${prices[i]!.toLocaleString('en-PK')}` : 'Check price →'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Airline comparison table */}
        <section className="route-section">
          <h2>Airlines Flying Pakistan to Toronto — Full Comparison</h2>
          <div className="baggage-table-wrap">
            <table className="baggage-table">
              <thead>
                <tr>
                  <th>Airline</th>
                  <th>Type</th>
                  <th>Check-in Bag</th>
                  <th>Meals</th>
                  <th>Stops</th>
                  <th>Best For</th>
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

        {/* Tips */}
        <section className="route-section">
          <h2>Tips for Finding the Cheapest Pakistan to Toronto Flight</h2>
          <ul className="route-tips">
            <li>📅 <strong>Book 6–10 weeks ahead</strong> — long-haul Pakistan–Toronto fares surge 40–70% last minute</li>
            <li>📆 <strong>Fly Tuesday or Wednesday</strong> — consistently 10–20% cheaper than weekends</li>
            <li>✈ <strong>Turkish Airlines via Istanbul</strong> is frequently the cheapest hub for Pakistan–Toronto</li>
            <li>🧳 <strong>All major airlines offer 30 kg</strong> except Air Canada — factor this in for heavy packers</li>
            <li>🕐 <strong>January–March and September–October</strong> are the cheapest months for this route</li>
            <li>💬 <strong>Message FlightRate on WhatsApp</strong> — we find and hold the best fare within 7 minutes</li>
          </ul>
        </section>

        {/* Individual route links */}
        <section className="route-section">
          <h2>Flights to Toronto from Each Pakistani City</h2>
          <div className="route-related">
            {ROUTES.map(r => (
              <Link key={r.from} href={`/flights/${r.slug}`} className="route-related-link">
                {r.fromName} → Toronto
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
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
          <h3>Ready to find the cheapest Pakistan to Toronto flight?</h3>
          <p>Our agents compare all airlines and book via WhatsApp in 7 minutes.</p>
          <a href="/search?to=YYZ&adults=1&class=ECONOMY" className="route-search-btn">
            Search All Flights to Toronto
          </a>
          <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">
            💬 Get Best Price on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
