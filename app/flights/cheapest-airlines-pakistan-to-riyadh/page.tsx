import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600 // re-render every hour

// ─── Routes covered on this page ─────────────────────────────────────────────
const ROUTES = [
  { from: 'KHI', fromName: 'Karachi',   slug: 'karachi-to-riyadh' },
  { from: 'LHE', fromName: 'Lahore',    slug: 'lahore-to-riyadh' },
  { from: 'ISB', fromName: 'Islamabad', slug: 'islamabad-to-riyadh' },
  { from: 'PEW', fromName: 'Peshawar',  slug: 'peshawar-to-riyadh' },
  { from: 'SKT', fromName: 'Sialkot',   slug: 'sialkot-to-riyadh' },
  { from: 'MUX', fromName: 'Multan',    slug: 'multan-to-riyadh' },
]

// Airline info for comparison table
const AIRLINES = [
  { name: 'Saudia',       code: 'SV', type: 'Full Service', baggage: '30 kg', meals: 'Yes',  stops: 'Direct', notes: 'National carrier of Saudi, daily flights' },
  { name: 'PIA',          code: 'PK', type: 'Full Service', baggage: '23 kg', meals: 'Yes',  stops: 'Direct', notes: 'Wide schedule from all PK cities' },
  { name: 'flynas',       code: 'XY', type: 'Low Cost',     baggage: '20 kg', meals: 'Paid', stops: 'Direct', notes: 'Often cheapest option to Riyadh' },
]

// ─── Live prices fetched per route ───────────────────────────────────────────
async function getRoutePrice(from: string) {
  try {
    const res = await fetch(
      `https://www.flightrate.pk/api/prices/${from}-RUH`,
      { next: { revalidate: 3600, tags: [`price-${from}-RUH`] } }
    )
    if (!res.ok) return null
    const d = await res.json()
    return d?.minPrice ? d.minPrice + 7000 : null
  } catch { return null }
}

export const metadata: Metadata = {
  title: 'Cheapest Airlines from Pakistan to Riyadh — Compare PKR Prices | FlightRate',
  description: 'Compare all airlines flying Pakistan to Riyadh: Saudia, PIA, flynas. See today\'s PKR prices from Karachi, Lahore, Islamabad, Peshawar, Sialkot, Multan. Ideal for Pakistani workers & Iqama holders. Book via WhatsApp.',
  keywords: [
    'cheapest airline from pakistan to riyadh',
    'cheapest airline pakistan riyadh pkr',
    'which airline is cheapest from karachi to riyadh',
    'pakistan to riyadh flight comparison',
    'saudia vs pia pakistan riyadh',
    'flynas pakistan riyadh',
    'pakistan riyadh airlines compare',
    'karachi lahore islamabad to riyadh cheapest',
    'pakistani workers riyadh flights',
    'iqama holders pakistan to riyadh',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-riyadh' },
  openGraph: {
    title: 'Cheapest Airlines Pakistan to Riyadh — PKR Prices Compared | FlightRate',
    description: 'Today\'s cheapest flight prices from all Pakistani cities to Riyadh. Compare Saudia, PIA and flynas in PKR.',
    url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-riyadh',
    type: 'website',
  },
}

const FAQ = [
  {
    q: 'Which is the cheapest airline from Pakistan to Riyadh?',
    a: 'flynas frequently offers the lowest fares from Pakistan to Riyadh, often 15–25% cheaper than full-service carriers. Saudia and PIA also run competitive promotions, especially for Iqama holders returning to Saudi Arabia. FlightRate monitors all airlines daily so you always see the current cheapest option.',
  },
  {
    q: 'Do Pakistani workers (Iqama holders) get any discount on Riyadh flights?',
    a: 'Saudia and PIA occasionally offer special fares for workers holding valid Saudi Iqama. Additionally, booking 4–6 weeks in advance significantly reduces costs. WhatsApp our team to check current worker-friendly deals and multi-trip discounts.',
  },
  {
    q: 'What is the baggage allowance for workers sending luggage to Riyadh?',
    a: 'Saudia allows 30 kg checked baggage on most economy tickets, while PIA allows 23 kg. flynas starts at 20 kg with paid add-ons. For workers carrying tools or extra luggage, Saudia or PIA are typically more economical once excess baggage is factored in. Extra bags can be pre-purchased for PKR 4,000–7,000 less than airport rates.',
  },
  {
    q: 'What documents do Pakistani passport holders need to fly to Riyadh?',
    a: 'Pakistani citizens require a valid Saudi work visa or Iqama for re-entry. Tourist visas are also available for Saudi Arabia. Workers returning on Iqama renewal should ensure their exit/re-entry permit is active. Contact our WhatsApp team if you need visa guidance.',
  },
  {
    q: 'Which Pakistani city has the cheapest flights to Riyadh?',
    a: 'Karachi (KHI) generally has the most competitive fares due to higher flight frequency. Lahore and Islamabad also have strong options. Peshawar, Sialkot, and Multan may have fewer direct options and slightly higher fares.',
  },
]

export default async function CheapestAirlinesRiyadhPage() {
  const prices = await Promise.all(ROUTES.map(r => getRoutePrice(r.from)))
  const today  = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-riyadh',
        name: 'Cheapest Airlines from Pakistan to Riyadh — Compare PKR Prices',
        dateModified: new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: 'Cheapest Airlines Pakistan to Riyadh', item: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-riyadh' },
          ],
        },
      },
      {
        '@type': 'Article',
        headline: 'Cheapest Airlines from Pakistan to Riyadh — Live PKR Price Comparison',
        description: 'Real-time PKR prices for all airlines flying Pakistan to Riyadh. Compare Saudia, PIA, flynas. Updated daily.',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-riyadh',
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
          <span>Cheapest Airlines Pakistan to Riyadh</span>
        </nav>

        <div className="route-hero">
          <h1 className="route-h1">Cheapest Airlines from Pakistan to Riyadh</h1>
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
                <span className="compare-code">{r.from} → RUH</span>
                <span className="compare-price">
                  {prices[i] ? `PKR ${prices[i]!.toLocaleString('en-PK')}` : 'Check price →'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Airline comparison table */}
        <section className="route-section">
          <h2>Airlines Flying Pakistan to Riyadh — Full Comparison</h2>
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
          <h2>Tips for Finding the Cheapest Pakistan to Riyadh Flight</h2>
          <ul className="route-tips">
            <li>📅 <strong>Book 4–6 weeks ahead</strong> — last-minute Pakistan–Riyadh fares jump 30–50%</li>
            <li>📆 <strong>Fly Tuesday or Wednesday</strong> — consistently 10–20% cheaper than weekends</li>
            <li>✈ <strong>Compare flynas vs Saudia</strong> — flynas is budget, Saudia adds baggage and meals</li>
            <li>🧳 <strong>Factor in baggage</strong> — adding 10 kg on flynas often costs PKR 4,000–7,000 extra</li>
            <li>🕐 <strong>Early morning departures</strong> are typically the cheapest on any airline</li>
            <li>💬 <strong>Message FlightRate on WhatsApp</strong> — we find and hold the best fare within 7 minutes</li>
          </ul>
        </section>

        {/* Individual route links */}
        <section className="route-section">
          <h2>Flights to Riyadh from Each Pakistani City</h2>
          <div className="route-related">
            {ROUTES.map(r => (
              <Link key={r.from} href={`/flights/${r.slug}`} className="route-related-link">
                {r.fromName} → Riyadh
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
          <h3>Ready to find the cheapest Pakistan to Riyadh flight?</h3>
          <p>Our agents compare all airlines and book via WhatsApp in 7 minutes.</p>
          <a href="/search?to=RUH&adults=1&class=ECONOMY" className="route-search-btn">
            Search All Flights to Riyadh
          </a>
          <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">
            💬 Get Best Price on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
