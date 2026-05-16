import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600 // re-render every hour

// ─── Routes covered on this page ─────────────────────────────────────────────
const ROUTES = [
  { from: 'KHI', fromName: 'Karachi',   slug: 'karachi-to-dubai' },
  { from: 'LHE', fromName: 'Lahore',    slug: 'lahore-to-dubai' },
  { from: 'ISB', fromName: 'Islamabad', slug: 'islamabad-to-dubai' },
  { from: 'PEW', fromName: 'Peshawar',  slug: 'peshawar-to-dubai' },
  { from: 'SKT', fromName: 'Sialkot',   slug: 'sialkot-to-dubai' },
  { from: 'MUX', fromName: 'Multan',    slug: 'multan-to-dubai' },
  { from: 'LYP', fromName: 'Faisalabad',slug: 'faisalabad-to-dubai' },
  { from: 'UET', fromName: 'Quetta',    slug: 'quetta-to-dubai' },
]

// Airline info for comparison table
const AIRLINES = [
  { name: 'Emirates',       code: 'EK', type: 'Full Service', baggage: '30 kg', meals: 'Yes', stops: 'Direct', notes: 'Premium comfort, daily flights' },
  { name: 'flydubai',       code: 'FZ', type: 'Low Cost',     baggage: '20 kg', meals: 'Paid', stops: 'Direct', notes: 'Cheapest on many dates' },
  { name: 'Air Arabia',     code: 'G9', type: 'Low Cost',     baggage: '20 kg', meals: 'Paid', stops: 'Direct', notes: 'Often cheapest from KHI' },
  { name: 'PIA',            code: 'PK', type: 'Full Service', baggage: '23 kg', meals: 'Yes', stops: 'Direct', notes: 'National carrier, wide schedule' },
  { name: 'Airblue',        code: 'PA', type: 'Low Cost',     baggage: '20 kg', meals: 'Paid', stops: 'Direct', notes: 'Budget option from LHE/ISB' },
  { name: 'FlyJinnah',      code: '9P', type: 'Low Cost',     baggage: '20 kg', meals: 'Paid', stops: 'Direct', notes: 'Newest budget carrier' },
  { name: 'Qatar Airways',  code: 'QR', type: 'Full Service', baggage: '30 kg', meals: 'Yes', stops: '1 stop',  notes: 'Via Doha, premium service' },
  { name: 'Etihad Airways', code: 'EY', type: 'Full Service', baggage: '30 kg', meals: 'Yes', stops: '1 stop',  notes: 'Via Abu Dhabi' },
]

// ─── Live prices fetched per route ───────────────────────────────────────────
async function getRoutePrice(from: string) {
  try {
    const res = await fetch(
      `https://www.flightrate.pk/api/prices/${from}-DXB`,
      { next: { revalidate: 3600, tags: [`price-${from}-DXB`] } }
    )
    if (!res.ok) return null
    const d = await res.json()
    return d?.minPrice ? d.minPrice + 7000 : null
  } catch { return null }
}

export const metadata: Metadata = {
  title: 'Cheapest Airlines from Pakistan to Dubai — Compare PKR Prices | FlightRate',
  description: 'Compare all airlines flying Pakistan to Dubai: Emirates, flydubai, PIA, Air Arabia, Airblue & more. See today\'s PKR prices from Karachi, Lahore, Islamabad, Peshawar, Sialkot, Multan. Book via WhatsApp.',
  keywords: [
    'cheapest airline from pakistan to dubai',
    'cheapest airline pakistan dubai pkr',
    'which airline is cheapest from karachi to dubai',
    'pakistan to dubai flight comparison',
    'emirates vs flydubai pakistan',
    'pia vs air arabia dubai',
    'pakistan dubai airlines compare',
    'karachi lahore islamabad to dubai cheapest',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-dubai' },
  openGraph: {
    title: 'Cheapest Airlines Pakistan to Dubai — PKR Prices Compared | FlightRate',
    description: 'Today\'s cheapest flight prices from all Pakistani cities to Dubai. Compare 8 airlines in PKR.',
    url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-dubai',
    type: 'website',
  },
}

const FAQ = [
  {
    q: 'Which is the cheapest airline from Pakistan to Dubai?',
    a: 'flydubai and Air Arabia consistently offer the lowest fares from Pakistan to Dubai, often 15–25% cheaper than full-service carriers. However, PIA and Airblue run promotional fares that can beat budget airlines on specific dates. FlightRate checks all airlines daily so you always see the current cheapest option.',
  },
  {
    q: 'Is Emirates worth the extra cost from Pakistan to Dubai?',
    a: 'Emirates offers 30 kg baggage (vs 20 kg on budget carriers), full meals, and superior in-flight experience. If your fare difference is under PKR 8,000–10,000, Emirates often represents better value after factoring in baggage costs. For pure price, flydubai or Air Arabia win.',
  },
  {
    q: 'Which Pakistani city has the cheapest flights to Dubai?',
    a: 'Karachi (KHI) typically has the most competitive fares to Dubai due to higher frequency and more airline options including Air Arabia direct. Sialkot and Multan often have fewer airlines and higher base fares.',
  },
  {
    q: 'Can I book a Pakistan to Dubai flight and pay in PKR?',
    a: 'Yes. FlightRate shows all fares in Pakistani Rupees with no hidden fees. You pay via bank transfer — no foreign currency conversion required.',
  },
  {
    q: 'Do I need a visa to travel from Pakistan to Dubai?',
    a: 'Pakistani passport holders require a UAE visa to enter Dubai. A 30-day tourist visa costs approximately USD 90–120 and can be arranged through your airline or a travel agent. Emirates and flydubai offer visa assistance. Contact our WhatsApp team for help.',
  },
]

export default async function CheapestAirlinesDubaiPage() {
  // Fetch all route prices in parallel — pulls live from scraper pipeline
  const prices = await Promise.all(ROUTES.map(r => getRoutePrice(r.from)))
  const today  = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-dubai',
        name: 'Cheapest Airlines from Pakistan to Dubai — Compare PKR Prices',
        dateModified: new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: 'Cheapest Airlines Pakistan to Dubai', item: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-dubai' },
          ],
        },
      },
      {
        '@type': 'Article',
        headline: 'Cheapest Airlines from Pakistan to Dubai — Live PKR Price Comparison',
        description: 'Real-time PKR prices for all airlines flying Pakistan to Dubai. Compare Emirates, flydubai, Air Arabia, PIA and more. Updated daily.',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-dubai',
        datePublished: '2026-05-15',
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
          <span>Cheapest Airlines Pakistan to Dubai</span>
        </nav>

        <div className="route-hero">
          <h1 className="route-h1">Cheapest Airlines from Pakistan to Dubai</h1>
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
                <span className="compare-code">{r.from} → DXB</span>
                <span className="compare-price">
                  {prices[i] ? `PKR ${prices[i]!.toLocaleString('en-PK')}` : 'Check price →'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Airline comparison table */}
        <section className="route-section">
          <h2>Airlines Flying Pakistan to Dubai — Full Comparison</h2>
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
          <h2>Tips for Finding the Cheapest Pakistan to Dubai Flight</h2>
          <ul className="route-tips">
            <li>📅 <strong>Book 3–5 weeks ahead</strong> — last-minute Pakistan–Dubai fares jump 30–50%</li>
            <li>📆 <strong>Fly Tuesday or Wednesday</strong> — consistently 10–20% cheaper than weekends</li>
            <li>✈ <strong>Compare flydubai vs Air Arabia</strong> — both direct, both budget, prices differ by date</li>
            <li>🧳 <strong>Factor in baggage</strong> — adding 10 kg on a budget carrier often costs PKR 5,000–8,000 extra</li>
            <li>🕐 <strong>Early morning departures</strong> are typically the cheapest on any airline</li>
            <li>💬 <strong>Message FlightRate on WhatsApp</strong> — we find and hold the best fare within 7 minutes</li>
          </ul>
        </section>

        {/* Individual route links */}
        <section className="route-section">
          <h2>Flights to Dubai from Each Pakistani City</h2>
          <div className="route-related">
            {ROUTES.map(r => (
              <Link key={r.from} href={`/flights/${r.slug}`} className="route-related-link">
                {r.fromName} → Dubai
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
          <h3>Ready to find the cheapest Pakistan to Dubai flight?</h3>
          <p>Our agents compare all airlines and book via WhatsApp in 7 minutes.</p>
          <a href="/search?to=DXB&adults=1&class=ECONOMY" className="route-search-btn">
            Search All Flights to Dubai
          </a>
          <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">
            💬 Get Best Price on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
