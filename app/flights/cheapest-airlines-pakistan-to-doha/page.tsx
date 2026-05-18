import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600 // re-render every hour

// ─── Routes covered on this page ─────────────────────────────────────────────
const ROUTES = [
  { from: 'KHI', fromName: 'Karachi',   slug: 'karachi-to-doha' },
  { from: 'LHE', fromName: 'Lahore',    slug: 'lahore-to-doha' },
  { from: 'ISB', fromName: 'Islamabad', slug: 'islamabad-to-doha' },
]

// Airline info for comparison table
const AIRLINES = [
  { name: 'Qatar Airways', code: 'QR', type: 'Full Service', baggage: '30 kg', meals: 'Yes',  stops: 'Direct', notes: 'World-class service, Hamad Airport hub' },
  { name: 'PIA',           code: 'PK', type: 'Full Service', baggage: '23 kg', meals: 'Yes',  stops: 'Direct', notes: 'Competitive fares, Pakistani workers\' choice' },
]

// ─── Live prices fetched per route ───────────────────────────────────────────
async function getRoutePrice(from: string) {
  try {
    const res = await fetch(
      `https://www.flightrate.pk/api/prices/${from}-DOH`,
      { next: { revalidate: 3600, tags: [`price-${from}-DOH`] } }
    )
    if (!res.ok) return null
    const d = await res.json()
    return d?.minPrice ? d.minPrice + 7000 : null
  } catch { return null }
}

export const metadata: Metadata = {
  title: 'Cheapest Airlines from Pakistan to Doha — Compare PKR Prices | FlightRate',
  description: 'Compare all airlines flying Pakistan to Doha: Qatar Airways & PIA. See today\'s PKR prices from Karachi, Lahore, Islamabad. Ideal for Pakistani workers in Qatar & transit passengers. Book via WhatsApp.',
  keywords: [
    'cheapest airline from pakistan to doha',
    'cheapest airline pakistan doha pkr',
    'which airline is cheapest from karachi to doha',
    'pakistan to doha flight comparison',
    'qatar airways vs pia pakistan doha',
    'karachi lahore islamabad to doha cheapest',
    'pakistani workers doha flights',
    'pakistan qatar flights pkr',
    'doha transit flights from pakistan',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-doha' },
  openGraph: {
    title: 'Cheapest Airlines Pakistan to Doha — PKR Prices Compared | FlightRate',
    description: 'Today\'s cheapest flight prices from Pakistani cities to Doha. Compare Qatar Airways and PIA in PKR.',
    url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-doha',
    type: 'website',
  },
}

const FAQ = [
  {
    q: 'Which is the cheapest airline from Pakistan to Doha?',
    a: 'PIA generally offers the most competitive direct fares from Pakistan to Doha for economy travellers. Qatar Airways frequently matches or undercuts PIA on promotional fares while offering superior service and baggage allowance. FlightRate monitors both airlines daily so you always see the current cheapest option.',
  },
  {
    q: 'Is Qatar Airways worth it for the Pakistan to Doha route?',
    a: 'Qatar Airways offers 30 kg baggage, full meals, and award-winning in-flight service. For Pakistani workers heading to Qatar, the extra baggage allowance often makes it cost-competitive with PIA once excess luggage costs are factored in. Qatar Airways is also consistently rated among the world\'s top airlines.',
  },
  {
    q: 'Can I use Doha as a transit hub to other destinations from Pakistan?',
    a: 'Yes — Hamad International Airport (Doha) is one of the busiest transit hubs in the world. Many passengers fly Pakistan to Doha and connect onward to the US, UK, Europe, and Africa via Qatar Airways. If transiting, ensure your layover is at least 2 hours for domestic-to-international connections.',
  },
  {
    q: 'What documents do Pakistani workers need to fly to Doha?',
    a: 'Pakistani citizens travelling to Qatar for work require a valid Qatari work visa and residency permit (QID). Tourist visas for Qatar are also available for leisure travellers. Ensure your Qatar work contract and visa are valid before booking. Our WhatsApp team can advise on documentation requirements.',
  },
  {
    q: 'Which city in Pakistan has the cheapest flights to Doha?',
    a: 'Karachi (KHI) typically has the most frequent flights and competitive fares to Doha due to higher airline competition. Lahore and Islamabad also offer strong options. FlightRate shows the cheapest available price across all three cities above.',
  },
]

export default async function CheapestAirlinesDohaPage() {
  const prices = await Promise.all(ROUTES.map(r => getRoutePrice(r.from)))
  const today  = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-doha',
        name: 'Cheapest Airlines from Pakistan to Doha — Compare PKR Prices',
        dateModified: new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: 'Cheapest Airlines Pakistan to Doha', item: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-doha' },
          ],
        },
      },
      {
        '@type': 'Article',
        headline: 'Cheapest Airlines from Pakistan to Doha — Live PKR Price Comparison',
        description: 'Real-time PKR prices for all airlines flying Pakistan to Doha. Compare Qatar Airways and PIA. Updated daily.',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-doha',
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
          <span>Cheapest Airlines Pakistan to Doha</span>
        </nav>

        <div className="route-hero">
          <h1 className="route-h1">Cheapest Airlines from Pakistan to Doha</h1>
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
                <span className="compare-code">{r.from} → DOH</span>
                <span className="compare-price">
                  {prices[i] ? `PKR ${prices[i]!.toLocaleString('en-PK')}` : 'Check price →'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Airline comparison table */}
        <section className="route-section">
          <h2>Airlines Flying Pakistan to Doha — Full Comparison</h2>
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
          <h2>Tips for Finding the Cheapest Pakistan to Doha Flight</h2>
          <ul className="route-tips">
            <li>📅 <strong>Book 3–5 weeks ahead</strong> — last-minute Pakistan–Doha fares jump 25–45%</li>
            <li>📆 <strong>Fly Tuesday or Wednesday</strong> — consistently 10–20% cheaper than weekends</li>
            <li>✈ <strong>Compare Qatar Airways vs PIA</strong> — QR adds 30 kg baggage and superior service</li>
            <li>🧳 <strong>Factor in baggage</strong> — QR&apos;s 30 kg allowance vs PIA&apos;s 23 kg can offset the fare difference</li>
            <li>🕐 <strong>Early morning departures</strong> are typically the cheapest on any airline</li>
            <li>💬 <strong>Message FlightRate on WhatsApp</strong> — we find and hold the best fare within 7 minutes</li>
          </ul>
        </section>

        {/* Individual route links */}
        <section className="route-section">
          <h2>Flights to Doha from Each Pakistani City</h2>
          <div className="route-related">
            {ROUTES.map(r => (
              <Link key={r.from} href={`/flights/${r.slug}`} className="route-related-link">
                {r.fromName} → Doha
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
          <h3>Ready to find the cheapest Pakistan to Doha flight?</h3>
          <p>Our agents compare all airlines and book via WhatsApp in 7 minutes.</p>
          <a href="/search?to=DOH&adults=1&class=ECONOMY" className="route-search-btn">
            Search All Flights to Doha
          </a>
          <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">
            💬 Get Best Price on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
