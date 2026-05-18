import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600 // re-render every hour

// ─── Routes covered on this page ─────────────────────────────────────────────
const ROUTES = [
  { from: 'KHI', fromName: 'Karachi',   slug: 'karachi-to-jeddah' },
  { from: 'LHE', fromName: 'Lahore',    slug: 'lahore-to-jeddah' },
  { from: 'ISB', fromName: 'Islamabad', slug: 'islamabad-to-jeddah' },
  { from: 'PEW', fromName: 'Peshawar',  slug: 'peshawar-to-jeddah' },
  { from: 'SKT', fromName: 'Sialkot',   slug: 'sialkot-to-jeddah' },
  { from: 'MUX', fromName: 'Multan',    slug: 'multan-to-jeddah' },
]

// Airline info for comparison table
const AIRLINES = [
  { name: 'Saudia',  code: 'SV', type: 'Full Service', baggage: '30 kg', meals: 'Yes',  stops: 'Direct', notes: 'Best for Umrah packages, daily flights' },
  { name: 'PIA',     code: 'PK', type: 'Full Service', baggage: '23 kg', meals: 'Yes',  stops: 'Direct', notes: 'Strong schedule during Hajj/Umrah seasons' },
  { name: 'flynas',  code: 'XY', type: 'Low Cost',     baggage: '20 kg', meals: 'Paid', stops: 'Direct', notes: 'Cheapest fares outside peak Umrah season' },
]

// ─── Live prices fetched per route ───────────────────────────────────────────
async function getRoutePrice(from: string) {
  try {
    const res = await fetch(
      `https://www.flightrate.pk/api/prices/${from}-JED`,
      { next: { revalidate: 3600, tags: [`price-${from}-JED`] } }
    )
    if (!res.ok) return null
    const d = await res.json()
    return d?.minPrice ? d.minPrice + 7000 : null
  } catch { return null }
}

export const metadata: Metadata = {
  title: 'Cheapest Airlines from Pakistan to Jeddah — Compare PKR Prices | FlightRate',
  description: 'Compare all airlines flying Pakistan to Jeddah: Saudia, PIA, flynas. See today\'s PKR prices from Karachi, Lahore, Islamabad, Peshawar, Sialkot, Multan. Best for Umrah & Hajj passengers. Book via WhatsApp.',
  keywords: [
    'cheapest airline from pakistan to jeddah',
    'cheapest airline pakistan jeddah pkr',
    'umrah flights from pakistan cheapest',
    'pakistan to jeddah flight comparison',
    'hajj flights pakistan jeddah',
    'saudia vs pia jeddah pakistan',
    'flynas pakistan jeddah',
    'karachi lahore islamabad to jeddah cheapest',
    'umrah package flights pakistan',
    'cheapest umrah flights 2026',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-jeddah' },
  openGraph: {
    title: 'Cheapest Airlines Pakistan to Jeddah — PKR Prices Compared | FlightRate',
    description: 'Today\'s cheapest flight prices from all Pakistani cities to Jeddah. Compare Saudia, PIA and flynas in PKR. Best for Umrah travellers.',
    url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-jeddah',
    type: 'website',
  },
}

const FAQ = [
  {
    q: 'Which is the cheapest airline from Pakistan to Jeddah for Umrah?',
    a: 'Outside peak Umrah season, flynas consistently offers the lowest fares. During Ramadan and peak Umrah periods, Saudia and PIA fares can surge by 40–70%. Booking 6–8 weeks ahead during peak season is strongly advised. FlightRate monitors all airlines daily so you always see the current cheapest option.',
  },
  {
    q: 'When is the cheapest time to fly from Pakistan to Jeddah for Umrah?',
    a: 'The cheapest months for Jeddah flights are typically August–October and January–February, well outside Ramadan and the pre-Hajj rush. Ramadan and the weeks before Hajj (Dhul Hijjah) see the highest prices. Midweek departures (Tuesday–Wednesday) are also significantly cheaper than weekends.',
  },
  {
    q: 'Do I need a visa to travel from Pakistan to Jeddah for Umrah?',
    a: 'Pakistani pilgrims require a Saudi Umrah visa or Hajj visa. Umrah visas can be obtained through registered tour operators and are separate from tourist visas. Saudi Arabia also offers tourist e-visas for non-pilgrimage travel. Contact our WhatsApp team for visa and package guidance.',
  },
  {
    q: 'Do flight prices surge during Hajj season for Pakistan to Jeddah routes?',
    a: 'Yes — Hajj season causes the single biggest price surge on the Pakistan–Jeddah route. Fares can increase 60–100% in the weeks before Hajj. If you are a Hajj pilgrim, book as early as possible once your Hajj package is confirmed. Government-operated Hajj flights through PIA are often the most cost-effective during this period.',
  },
  {
    q: 'Is Jeddah the closest airport to Madinah for Pakistani pilgrims?',
    a: 'Madinah has its own international airport (MED — Prince Mohammad bin Abdulaziz Airport) with direct flights from some Pakistani cities. Jeddah (JED) is the main gateway for Umrah and Hajj. Many pilgrims fly into Jeddah and travel overland to Makkah and Madinah. Ask our WhatsApp team about the most convenient routing for your pilgrimage.',
  },
]

export default async function CheapestAirlinesJeddahPage() {
  const prices = await Promise.all(ROUTES.map(r => getRoutePrice(r.from)))
  const today  = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-jeddah',
        name: 'Cheapest Airlines from Pakistan to Jeddah — Compare PKR Prices',
        dateModified: new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: 'Cheapest Airlines Pakistan to Jeddah', item: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-jeddah' },
          ],
        },
      },
      {
        '@type': 'Article',
        headline: 'Cheapest Airlines from Pakistan to Jeddah — Live PKR Price Comparison',
        description: 'Real-time PKR prices for all airlines flying Pakistan to Jeddah. Compare Saudia, PIA, flynas. Best for Umrah and Hajj travellers. Updated daily.',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-jeddah',
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
          <span>Cheapest Airlines Pakistan to Jeddah</span>
        </nav>

        <div className="route-hero">
          <h1 className="route-h1">Cheapest Airlines from Pakistan to Jeddah</h1>
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
                <span className="compare-code">{r.from} → JED</span>
                <span className="compare-price">
                  {prices[i] ? `PKR ${prices[i]!.toLocaleString('en-PK')}` : 'Check price →'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Airline comparison table */}
        <section className="route-section">
          <h2>Airlines Flying Pakistan to Jeddah — Full Comparison</h2>
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
          <h2>Tips for Finding the Cheapest Pakistan to Jeddah Flight</h2>
          <ul className="route-tips">
            <li>📅 <strong>Book 6–8 weeks ahead for Umrah season</strong> — Ramadan fares surge 40–70%</li>
            <li>📆 <strong>Fly Tuesday or Wednesday</strong> — consistently 10–20% cheaper than weekends</li>
            <li>✈ <strong>Avoid Hajj season if not a pilgrim</strong> — prices peak in Dhul Hijjah</li>
            <li>🧳 <strong>Factor in baggage</strong> — adding 10 kg on flynas costs PKR 4,000–7,000 extra</li>
            <li>🕐 <strong>Early morning departures</strong> are typically the cheapest on any airline</li>
            <li>💬 <strong>Message FlightRate on WhatsApp</strong> — we find and hold the best fare within 7 minutes</li>
          </ul>
        </section>

        {/* Individual route links */}
        <section className="route-section">
          <h2>Flights to Jeddah from Each Pakistani City</h2>
          <div className="route-related">
            {ROUTES.map(r => (
              <Link key={r.from} href={`/flights/${r.slug}`} className="route-related-link">
                {r.fromName} → Jeddah
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
          <h3>Ready to find the cheapest Pakistan to Jeddah flight?</h3>
          <p>Our agents compare all airlines and book via WhatsApp in 7 minutes.</p>
          <a href="/search?to=JED&adults=1&class=ECONOMY" className="route-search-btn">
            Search All Flights to Jeddah
          </a>
          <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">
            💬 Get Best Price on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
