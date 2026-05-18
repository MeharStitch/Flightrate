import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600 // re-render every hour

// ─── Routes covered on this page ─────────────────────────────────────────────
const ROUTES = [
  { from: 'KHI', fromName: 'Karachi',   slug: 'karachi-to-london' },
  { from: 'LHE', fromName: 'Lahore',    slug: 'lahore-to-london' },
  { from: 'ISB', fromName: 'Islamabad', slug: 'islamabad-to-london' },
]

// Airline info for comparison table
const AIRLINES = [
  { name: 'PIA',              code: 'PK', type: 'Full Service', baggage: '23 kg', meals: 'Yes',  stops: 'Direct',  notes: 'Only direct flights from KHI, LHE, ISB to LHR' },
  { name: 'British Airways',  code: 'BA', type: 'Full Service', baggage: '23 kg', meals: 'Yes',  stops: 'Direct',  notes: 'Premium direct service to Heathrow' },
  { name: 'Qatar Airways',    code: 'QR', type: 'Full Service', baggage: '30 kg', meals: 'Yes',  stops: '1 stop',  notes: 'Via Doha, excellent connections' },
  { name: 'Emirates',         code: 'EK', type: 'Full Service', baggage: '30 kg', meals: 'Yes',  stops: '1 stop',  notes: 'Via Dubai, daily flights' },
  { name: 'Turkish Airlines', code: 'TK', type: 'Full Service', baggage: '30 kg', meals: 'Yes',  stops: '1 stop',  notes: 'Via Istanbul, often cheapest 1-stop' },
]

// ─── Live prices fetched per route ───────────────────────────────────────────
async function getRoutePrice(from: string) {
  try {
    const res = await fetch(
      `https://www.flightrate.pk/api/prices/${from}-LHR`,
      { next: { revalidate: 3600, tags: [`price-${from}-LHR`] } }
    )
    if (!res.ok) return null
    const d = await res.json()
    return d?.minPrice ? d.minPrice + 7000 : null
  } catch { return null }
}

export const metadata: Metadata = {
  title: 'Cheapest Airlines from Pakistan to London — Compare PKR Prices | FlightRate',
  description: 'Compare all airlines flying Pakistan to London: PIA, British Airways, Qatar Airways, Emirates, Turkish Airlines. See today\'s PKR prices from Karachi, Lahore, Islamabad. Best for UK diaspora & students. Book via WhatsApp.',
  keywords: [
    'cheapest airline from pakistan to london',
    'cheapest airline pakistan london pkr',
    'which airline is cheapest from karachi to london',
    'pakistan to london flight comparison',
    'pia direct flight london pakistan',
    'pakistan uk flights cheapest',
    'karachi lahore islamabad to london heathrow',
    'pakistani community uk flights',
    'student visa flight pakistan london',
    'cheapest month fly pakistan london',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-london' },
  openGraph: {
    title: 'Cheapest Airlines Pakistan to London — PKR Prices Compared | FlightRate',
    description: 'Today\'s cheapest flight prices from Pakistani cities to London Heathrow. Compare PIA, British Airways, Qatar Airways, Emirates and Turkish Airlines in PKR.',
    url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-london',
    type: 'website',
  },
}

const FAQ = [
  {
    q: 'Does PIA fly direct from Pakistan to London?',
    a: 'Yes — PIA operates direct non-stop flights from Karachi (KHI), Lahore (LHE), and Islamabad (ISB) to London Heathrow (LHR). This makes PIA the only Pakistani carrier offering non-stop service to the UK. Direct flights take approximately 8–9 hours versus 12–16 hours on connecting itineraries.',
  },
  {
    q: 'Which is the cheapest airline from Pakistan to London?',
    a: 'Turkish Airlines via Istanbul is frequently the cheapest 1-stop option, often undercutting PIA direct fares by PKR 15,000–30,000 on economy. However, PIA direct is often competitive and saves 4–8 hours of travel time. Emirates via Dubai and Qatar Airways via Doha offer premium connecting options. FlightRate compares all five airlines daily.',
  },
  {
    q: 'When is the cheapest month to fly from Pakistan to London?',
    a: 'January and February offer the lowest fares on the Pakistan–London route, typically 25–40% cheaper than July–August peak season. November is also relatively affordable. Summer (June–August) and winter holidays (December) see the highest demand from the Pakistani diaspora in Birmingham, Bradford, and Manchester.',
  },
  {
    q: 'What is the best airline for a student visa flight from Pakistan to London?',
    a: 'For students travelling with heavy luggage (laptops, books, bedding), Turkish Airlines and Qatar Airways offer 30 kg checked baggage — significantly more than PIA\'s 23 kg. Turkish Airlines is also often the cheapest option for students on a budget. British Airways offers strong student fares during off-peak periods. Contact our WhatsApp team for the current best student deal.',
  },
  {
    q: 'How much extra baggage does PIA allow on Pakistan to London flights?',
    a: 'PIA economy class includes 23 kg checked baggage on the Pakistan–London route. Extra bags or additional weight can be pre-purchased at significantly lower rates than airport rates — typically PKR 8,000–15,000 per extra 10 kg depending on the route and fare class. Book early for the best excess baggage rates.',
  },
]

export default async function CheapestAirlinesLondonPage() {
  const prices = await Promise.all(ROUTES.map(r => getRoutePrice(r.from)))
  const today  = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-london',
        name: 'Cheapest Airlines from Pakistan to London — Compare PKR Prices',
        dateModified: new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: 'Cheapest Airlines Pakistan to London', item: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-london' },
          ],
        },
      },
      {
        '@type': 'Article',
        headline: 'Cheapest Airlines from Pakistan to London — Live PKR Price Comparison',
        description: 'Real-time PKR prices for all airlines flying Pakistan to London. Compare PIA, British Airways, Qatar Airways, Emirates, Turkish Airlines. Updated daily.',
        url: 'https://www.flightrate.pk/flights/cheapest-airlines-pakistan-to-london',
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
          <span>Cheapest Airlines Pakistan to London</span>
        </nav>

        <div className="route-hero">
          <h1 className="route-h1">Cheapest Airlines from Pakistan to London</h1>
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
                <span className="compare-code">{r.from} → LHR</span>
                <span className="compare-price">
                  {prices[i] ? `PKR ${prices[i]!.toLocaleString('en-PK')}` : 'Check price →'}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Airline comparison table */}
        <section className="route-section">
          <h2>Airlines Flying Pakistan to London — Full Comparison</h2>
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
          <h2>Tips for Finding the Cheapest Pakistan to London Flight</h2>
          <ul className="route-tips">
            <li>📅 <strong>Book 6–10 weeks ahead</strong> — London fares jump 35–60% in summer and during school holidays</li>
            <li>📆 <strong>Fly Tuesday or Wednesday</strong> — consistently 10–20% cheaper than weekends</li>
            <li>✈ <strong>Compare PIA direct vs Turkish Airlines 1-stop</strong> — TK via IST is often PKR 15,000–30,000 cheaper</li>
            <li>🧳 <strong>Students: check baggage allowance</strong> — QR and TK both offer 30 kg vs PIA&apos;s 23 kg</li>
            <li>🕐 <strong>January and February</strong> are the cheapest months for Pakistan–London flights</li>
            <li>💬 <strong>Message FlightRate on WhatsApp</strong> — we find and hold the best fare within 7 minutes</li>
          </ul>
        </section>

        {/* Individual route links */}
        <section className="route-section">
          <h2>Flights to London from Each Pakistani City</h2>
          <div className="route-related">
            {ROUTES.map(r => (
              <Link key={r.from} href={`/flights/${r.slug}`} className="route-related-link">
                {r.fromName} → London
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
          <h3>Ready to find the cheapest Pakistan to London flight?</h3>
          <p>Our agents compare all airlines and book via WhatsApp in 7 minutes.</p>
          <a href="/search?to=LHR&adults=1&class=ECONOMY" className="route-search-btn">
            Search All Flights to London
          </a>
          <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">
            💬 Get Best Price on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
