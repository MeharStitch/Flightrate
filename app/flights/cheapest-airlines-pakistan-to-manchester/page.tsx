import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600

const ROUTES = [
  { from: 'KHI', fromName: 'Karachi',   slug: 'karachi-to-manchester' },
  { from: 'LHE', fromName: 'Lahore',    slug: 'lahore-to-manchester' },
  { from: 'ISB', fromName: 'Islamabad', slug: 'islamabad-to-manchester' },
]

const AIRLINES = [
  { name: 'PIA',              code: 'PK', type: 'Full Service', baggage: '23 kg', meals: 'Yes', stops: 'Direct',  notes: 'Only direct flights Pakistan to Manchester' },
  { name: 'Qatar Airways',    code: 'QR', type: 'Full Service', baggage: '30 kg', meals: 'Yes', stops: '1 stop',  notes: 'Via Doha, excellent for students (30 kg)' },
  { name: 'Emirates',         code: 'EK', type: 'Full Service', baggage: '30 kg', meals: 'Yes', stops: '1 stop',  notes: 'Via Dubai, daily connections' },
  { name: 'Turkish Airlines', code: 'TK', type: 'Full Service', baggage: '30 kg', meals: 'Yes', stops: '1 stop',  notes: 'Via Istanbul, often cheapest 1-stop' },
]

async function getRoutePrice(from: string) {
  try {
    const res = await fetch(
      `https://www.flightrate.pk/api/prices/${from}-MAN`,
      { next: { revalidate: 3600, tags: [`price-${from}-MAN`] } }
    )
    if (!res.ok) return null
    const d = await res.json()
    return d?.minPrice ? d.minPrice + 7000 : null
  } catch { return null }
}

export const metadata: Metadata = {
  title: 'Cheapest Airlines from Pakistan to Manchester — PKR Prices | FlightRate',
  description: 'Compare all airlines flying Pakistan to Manchester: PIA direct, Qatar Airways, Emirates, Turkish Airlines. PKR prices from Karachi, Lahore, Islamabad. Best for Pakistani community in Manchester & Bradford. Book via WhatsApp.',
  keywords: [
    'cheapest airline from pakistan to manchester',
    'pakistan to manchester flight price pkr',
    'khi to man flight',
    'karachi to manchester cheap flights',
    'lahore to manchester ticket price',
    'islamabad to manchester flights pkr',
    'pia flight pakistan manchester',
    'pakistan manchester airlines compare',
    'cheap flights to manchester from pakistan',
    'pakistani community manchester flights',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-manchester' },
  openGraph: {
    title: 'Cheapest Airlines Pakistan to Manchester — PKR Prices Compared | FlightRate',
    description: "Today's cheapest Pakistan to Manchester flight prices in PKR. Compare PIA direct, Qatar Airways, Emirates & Turkish Airlines.",
    url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-manchester',
    type: 'website',
  },
}

const FAQ = [
  {
    q: 'Does PIA fly direct from Pakistan to Manchester?',
    a: 'Yes — PIA is the only airline offering direct non-stop flights from Pakistan to Manchester Airport (MAN). Flights operate from Karachi (KHI), Lahore (LHE), and Islamabad (ISB). Direct flight time is approximately 9.5 hours. Connecting options via Doha, Dubai, or Istanbul add 3–6 hours but can be significantly cheaper depending on the date.',
  },
  {
    q: 'Which is the cheapest airline from Pakistan to Manchester?',
    a: 'Turkish Airlines via Istanbul is frequently the cheapest option, often PKR 20,000–35,000 lower than PIA direct on economy. Qatar Airways via Doha offers 30 kg baggage which is better value for students. PIA direct saves travel time but pricing varies significantly by season. FlightRate compares all four airlines daily in PKR.',
  },
  {
    q: 'How long is the flight from Pakistan to Manchester?',
    a: 'PIA direct flights from Karachi to Manchester take approximately 9.5 hours. Lahore and Islamabad are slightly shorter at 9–9.5 hours. Connecting flights via Istanbul (Turkish Airlines) take 12–14 hours total, via Doha (Qatar Airways) 13–15 hours, and via Dubai (Emirates) 14–16 hours depending on the layover.',
  },
  {
    q: 'When is the cheapest time to fly from Pakistan to Manchester?',
    a: 'January to March offers the lowest fares on the Pakistan–Manchester route, typically 30–45% below peak pricing. August and December are the most expensive months due to Pakistani community visiting family. Ramadan shoulder periods (just before/after) can offer good deals. Book at least 6–8 weeks ahead for the best prices.',
  },
  {
    q: 'Is Manchester or London cheaper to fly to from Pakistan?',
    a: 'Manchester and London fares are similar for PIA direct flights. However, Turkish Airlines and other connecting carriers often price Manchester competitively since fewer airlines serve MAN vs Heathrow. If you are travelling to the North of England (Manchester, Bradford, Leeds, Sheffield, Burnley), flying into Manchester saves significant ground travel time and cost.',
  },
]

export default async function CheapestAirlinesManPage() {
  const prices = await Promise.all(ROUTES.map(r => getRoutePrice(r.from)))
  const today  = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-manchester',
        name: 'Cheapest Airlines from Pakistan to Manchester — Compare PKR Prices',
        dateModified: new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: 'Cheapest Airlines Pakistan to Manchester', item: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-manchester' },
          ],
        },
      },
      {
        '@type': 'Article',
        headline: 'Cheapest Airlines from Pakistan to Manchester — Live PKR Price Comparison',
        description: 'Real-time PKR prices for all airlines flying Pakistan to Manchester. Compare PIA direct, Qatar Airways, Emirates, Turkish Airlines. Updated daily.',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-manchester',
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
          <span>Cheapest Airlines Pakistan to Manchester</span>
        </nav>

        <div className="route-hero">
          <h1 className="route-h1">Cheapest Airlines from Pakistan to Manchester</h1>
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
                <span className="compare-code">{r.from} → MAN</span>
                <span className="compare-price">
                  {prices[i] ? `PKR ${prices[i]!.toLocaleString('en-PK')}` : 'Check price →'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="route-section">
          <h2>Airlines Flying Pakistan to Manchester — Full Comparison</h2>
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
          <h2>Tips for Cheapest Pakistan to Manchester Flights</h2>
          <ul className="route-tips">
            <li>📅 <strong>Book 6–10 weeks ahead</strong> — Manchester fares spike 40–60% in summer and Eid</li>
            <li>✈ <strong>PIA direct vs Turkish Airlines</strong> — TK via Istanbul is often PKR 20,000–35,000 cheaper but 3–5 hours longer</li>
            <li>🧳 <strong>Students: choose QR or TK</strong> — both allow 30 kg check-in vs PIA&apos;s 23 kg</li>
            <li>📆 <strong>January to March</strong> — cheapest months, 30–45% below peak season</li>
            <li>🏙 <strong>Manchester beats London</strong> for North England destinations — saves train/coach time</li>
            <li>💬 <strong>Message FlightRate on WhatsApp</strong> — best Pakistan–Manchester fare confirmed in 7 minutes</li>
          </ul>
        </section>

        <section className="route-section">
          <h2>Flights to Manchester from Each Pakistani City</h2>
          <div className="route-related">
            {ROUTES.map(r => (
              <Link key={r.from} href={`/flights/${r.slug}`} className="route-related-link">
                {r.fromName} → Manchester
              </Link>
            ))}
            <Link href="/flights/cheapest-airlines-pakistan-to-london" className="route-related-link">
              Compare Pakistan → London too
            </Link>
            <Link href="/flights/cheapest-airlines-pakistan-to-birmingham" className="route-related-link">
              Compare Pakistan → Birmingham too
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
          <h3>Ready to find the cheapest Pakistan to Manchester flight?</h3>
          <p>Our agents compare all airlines and book via WhatsApp in 7 minutes.</p>
          <a href="/search?to=MAN&adults=1&class=ECONOMY" className="route-search-btn">
            Search All Flights to Manchester
          </a>
          <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">
            💬 Get Best Price on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
