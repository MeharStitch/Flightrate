import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cheapest Airlines from Pakistan to Gulf Countries (2026 Ranked) | FlightRate',
  description: 'We rank PIA, Emirates, flydubai, Air Arabia, flydubai, Qatar Airways, Saudia and more by real PKR price data across all Pakistan–Gulf routes.',
  keywords: [
    'cheapest airline pakistan to dubai',
    'cheapest airline pakistan to riyadh',
    'cheapest airline karachi to dubai pkr',
    'flydubai vs air arabia pakistan',
    'pia vs emirates pakistan gulf',
    'cheapest flight pakistan gulf 2026',
    'best airline pakistan to uae',
    'budget airlines pakistan to saudi arabia',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/blog/cheapest-airlines-pakistan-gulf' },
  openGraph: {
    title: 'Cheapest Airlines from Pakistan to Gulf — Ranked by Real PKR Prices',
    description: 'Which airline is actually cheapest on Pakistan–Dubai, Riyadh, Doha routes? We compared real fare data so you do not have to.',
    url: 'https://www.flightrate.pk/blog/cheapest-airlines-pakistan-gulf',
    type: 'article',
  },
}

const AIRLINES = [
  {
    rank: 1,
    name: 'flydubai',
    routes: 'KHI, LHE, ISB, PEW, SKT, MUX → DXB',
    typicalPKR: '35,000 – 55,000',
    baggage: '20 kg included (economy lite = 0 kg)',
    verdict: 'Cheapest on Pakistan–Dubai routes. No-frills but reliable.',
    best: 'Dubai trips under 10 days',
    rating: '★★★★☆',
  },
  {
    rank: 2,
    name: 'Air Arabia',
    routes: 'KHI, LHE, ISB → SHJ (Sharjah), AUH',
    typicalPKR: '36,000 – 58,000',
    baggage: '20 kg included',
    verdict: 'Slightly pricier than flydubai but Sharjah airport is fast and easy.',
    best: 'Abu Dhabi & Northern Emirates trips',
    rating: '★★★★☆',
  },
  {
    rank: 3,
    name: 'PIA',
    routes: 'KHI, LHE, ISB, PEW → DXB, AUH, SHJ, RUH, JED, DOH, KWI',
    typicalPKR: '40,000 – 70,000',
    baggage: '30 kg included (best allowance)',
    verdict: 'Widest Gulf coverage from Pakistan. 30 kg baggage beats budget carriers. Fares competitive when booked 4+ weeks ahead.',
    best: 'Travellers with heavy baggage or connecting to smaller Gulf cities',
    rating: '★★★☆☆',
  },
  {
    rank: 4,
    name: 'Emirates',
    routes: 'KHI, LHE, ISB → DXB',
    typicalPKR: '55,000 – 110,000',
    baggage: '30 kg included',
    verdict: 'Premium product. Not the cheapest but offers superior onboard experience, wide DXB connection options.',
    best: 'Onward connections through Dubai Hub',
    rating: '★★★★★',
  },
  {
    rank: 5,
    name: 'Qatar Airways',
    routes: 'KHI, LHE, ISB → DOH (and onward to 150+ cities)',
    typicalPKR: '60,000 – 120,000',
    baggage: '30 kg included',
    verdict: 'Best for onward connections. Doha–Dubai add-on available. Direct Pakistan–Doha competitive with UAE carriers.',
    best: 'Long-haul connections and Pakistan–Doha route',
    rating: '★★★★★',
  },
  {
    rank: 6,
    name: 'Saudia',
    routes: 'KHI, LHE, ISB → RUH, JED, MED',
    typicalPKR: '45,000 – 85,000',
    baggage: '30 kg included',
    verdict: 'Dominant on Pakistan–Saudi routes. Consistent pricing but less competitive on UAE routes.',
    best: 'Pakistan to Riyadh, Jeddah, Medina',
    rating: '★★★☆☆',
  },
  {
    rank: 7,
    name: 'FlyJinnah',
    routes: 'KHI, LHE, ISB → AUH',
    typicalPKR: '32,000 – 50,000',
    baggage: '0 kg (add 20 kg = ~PKR 6,000)',
    verdict: 'Cheapest base fares to Abu Dhabi. Watch the baggage add-on cost — it can erase the saving.',
    best: 'Abu Dhabi with carry-on only',
    rating: '★★★☆☆',
  },
  {
    rank: 8,
    name: 'Etihad Airways',
    routes: 'KHI, LHE, ISB → AUH',
    typicalPKR: '55,000 – 105,000',
    baggage: '30 kg included',
    verdict: 'Premium Abu Dhabi carrier. Strong onward connections. More expensive than budget options.',
    best: 'Abu Dhabi hub connections',
    rating: '★★★★☆',
  },
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Cheapest Airlines from Pakistan to Gulf Countries (2026 Ranked)',
      description: 'Data-driven ranking of all airlines flying Pakistan to Gulf routes, compared by real PKR fares, baggage, and route coverage.',
      url: 'https://www.flightrate.pk/blog/cheapest-airlines-pakistan-gulf',
      datePublished: '2026-05-15',
      dateModified: new Date().toISOString().split('T')[0],
      author: { '@type': 'Organization', name: 'FlightRate', url: 'https://www.flightrate.pk' },
      publisher: { '@type': 'Organization', name: 'FlightRate', url: 'https://www.flightrate.pk' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Which is the cheapest airline from Pakistan to Dubai?',
          acceptedAnswer: { '@type': 'Answer', text: 'flydubai and FlyJinnah consistently offer the lowest base fares from Pakistan to Dubai and Abu Dhabi. flydubai flies from Karachi, Lahore, Islamabad, Peshawar, Sialkot and Multan. FlyJinnah flies from major cities to Abu Dhabi. However, always compare total price including baggage — budget carriers charge PKR 5,000–10,000 extra for checked bags.' },
        },
        {
          '@type': 'Question',
          name: 'Is PIA cheaper than flydubai for Pakistan to Gulf flights?',
          acceptedAnswer: { '@type': 'Answer', text: 'Rarely. flydubai base fares are typically PKR 5,000–15,000 cheaper than PIA. However, PIA includes 30 kg baggage in all fares, which changes the comparison if you are carrying heavy luggage. PIA also flies more Gulf destinations than any other airline from Pakistan.' },
        },
        {
          '@type': 'Question',
          name: 'Is flydubai or Air Arabia cheaper from Pakistan?',
          acceptedAnswer: { '@type': 'Answer', text: 'On Pakistan to Dubai routes, flydubai is usually slightly cheaper. For Abu Dhabi and Northern Emirates, Air Arabia from Sharjah is competitive. Check both on the same travel date — prices flip regularly. FlightRate checks both daily and shows you the lower fare.' },
        },
        {
          '@type': 'Question',
          name: 'What is the cheapest airline from Pakistan to Riyadh?',
          acceptedAnswer: { '@type': 'Answer', text: 'For Pakistan to Riyadh, Saudia and PIA are the dominant carriers with direct flights from Karachi, Lahore, and Islamabad. Saudia typically offers competitive fares on this route. Qatar Airways via Doha and Emirates via Dubai are alternatives but add connection time.' },
        },
        {
          '@type': 'Question',
          name: 'Are budget airlines from Pakistan reliable?',
          acceptedAnswer: { '@type': 'Answer', text: 'flydubai (owned by Emirates Group) has a strong safety record and is reliable. Air Arabia is also well-regarded. FlyJinnah is newer (launched 2022) but operates modern Airbus A320 aircraft. All three are certified by their respective civil aviation authorities. Budget airline means lower cost, not lower safety.' },
        },
      ],
    },
  ],
}

export default function CheapestAirlinesGulfPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="blog-post">
        <div className="blog-post-inner">
          <nav className="route-breadcrumb">
            <Link href="/">Home</Link><span>›</span>
            <Link href="/blog">Guides</Link><span>›</span>
            <span>Cheapest Airlines Pakistan to Gulf</span>
          </nav>

          <span className="blog-tag">Airline Guide</span>
          <h1 className="blog-h1">Cheapest Airlines from Pakistan to Gulf Countries (2026 Ranked)</h1>
          <p className="blog-meta">Ranked by real PKR price data across all Pakistan–Gulf routes · Updated May 2026</p>

          <div className="blog-data-callout">
            <strong>Bottom line:</strong> <strong>flydubai</strong> wins on Pakistan–Dubai. <strong>Saudia + PIA</strong> dominate Pakistan–Saudi. <strong>Qatar Airways</strong> is best for Pakistan–Doha and onward connections. Always compare total cost including baggage.
          </div>

          <div className="blog-body">
            <h2>All Airlines Ranked: Pakistan to Gulf</h2>
            <p>Eight airlines fly Pakistan–Gulf routes regularly. We ranked them by typical economy fares in PKR, baggage included, and route coverage. Rankings are based on FlightRate daily price scraping — not estimates.</p>

            <div className="airline-cards">
              {AIRLINES.map(a => (
                <div key={a.rank} className="airline-card">
                  <div className="airline-card-header">
                    <span className="airline-rank">#{a.rank}</span>
                    <span className="airline-name">{a.name}</span>
                    <span className="airline-rating">{a.rating}</span>
                  </div>
                  <div className="airline-card-body">
                    <div className="airline-stat"><strong>Routes:</strong> {a.routes}</div>
                    <div className="airline-stat"><strong>Typical PKR fare:</strong> PKR {a.typicalPKR}</div>
                    <div className="airline-stat"><strong>Baggage:</strong> {a.baggage}</div>
                    <div className="airline-stat"><strong>Best for:</strong> {a.best}</div>
                    <p className="airline-verdict">{a.verdict}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2>The Baggage Trap — Why Cheapest Base Fare is Not Always Cheapest Total</h2>
            <p>Budget carriers (flydubai Economy Lite, FlyJinnah) advertise low base fares but charge separately for checked baggage. A 20 kg bag typically adds <strong>PKR 5,000–10,000</strong> to a budget carrier ticket. For travellers carrying heavy luggage, PIA or Emirates — which include 30 kg — can be cheaper total.</p>
            <p><strong>Example:</strong> flydubai Economy Lite at PKR 38,000 + PKR 8,000 bag = PKR 46,000. PIA at PKR 45,000 with 30 kg included = PKR 45,000. PIA wins.</p>

            <h2>Route-by-Route: Which Airline Wins?</h2>
            <div className="baggage-table-wrap">
              <table className="baggage-table">
                <thead>
                  <tr><th>Route</th><th>Cheapest Direct</th><th>Typical PKR</th><th>Alternative</th></tr>
                </thead>
                <tbody>
                  <tr><td>Pakistan → Dubai (DXB)</td><td><strong>flydubai</strong></td><td>PKR 35,000–55,000</td><td>Air Arabia (SHJ)</td></tr>
                  <tr><td>Pakistan → Abu Dhabi (AUH)</td><td><strong>FlyJinnah</strong></td><td>PKR 32,000–50,000</td><td>Air Arabia, Etihad</td></tr>
                  <tr><td>Pakistan → Riyadh (RUH)</td><td><strong>Saudia / PIA</strong></td><td>PKR 45,000–75,000</td><td>flydubai via DXB</td></tr>
                  <tr><td>Pakistan → Jeddah (JED)</td><td><strong>PIA / Saudia</strong></td><td>PKR 50,000–80,000</td><td>Emirates via DXB</td></tr>
                  <tr><td>Pakistan → Doha (DOH)</td><td><strong>Qatar Airways</strong></td><td>PKR 45,000–70,000</td><td>PIA</td></tr>
                  <tr><td>Pakistan → Kuwait (KWI)</td><td><strong>PIA / Jazeera</strong></td><td>PKR 50,000–85,000</td><td>Flydubai via DXB</td></tr>
                </tbody>
              </table>
            </div>

            <h2>When Do Prices Spike? Seasonal Patterns</h2>
            <ul>
              <li><strong>Eid-ul-Fitr + Eid-ul-Adha</strong> — both directions surge 30–50%. Book 8–12 weeks ahead</li>
              <li><strong>June–August</strong> — school summer holidays. Prices up 20–40%. Family travel peaks</li>
              <li><strong>December</strong> — year-end + winter break pushes fares up</li>
              <li><strong>January, February, September</strong> — consistently cheapest months on all Pakistan–Gulf routes</li>
            </ul>

            <h2>See Today&apos;s Live Fares by Route</h2>
            <div className="route-related" style={{ marginTop: 12 }}>
              {[
                { slug: 'karachi-to-dubai',       label: 'Karachi → Dubai' },
                { slug: 'lahore-to-dubai',         label: 'Lahore → Dubai' },
                { slug: 'islamabad-to-dubai',      label: 'Islamabad → Dubai' },
                { slug: 'karachi-to-riyadh',       label: 'Karachi → Riyadh' },
                { slug: 'lahore-to-riyadh',        label: 'Lahore → Riyadh' },
                { slug: 'karachi-to-doha',         label: 'Karachi → Doha' },
                { slug: 'karachi-to-jeddah',       label: 'Karachi → Jeddah' },
                { slug: 'peshawar-to-dubai',       label: 'Peshawar → Dubai' },
              ].map(r => (
                <Link key={r.slug} href={`/flights/${r.slug}`} className="route-related-link">{r.label}</Link>
              ))}
            </div>

            <h2>Frequently Asked Questions</h2>
            <div className="route-faqs">
              {[
                { q: 'Which is the cheapest airline from Pakistan to Dubai?', a: 'flydubai is consistently cheapest on Pakistan–Dubai routes, operating from 6 Pakistani cities. Compare total price including baggage — budget carrier Economy Lite fares exclude checked bags.' },
                { q: 'Is PIA cheaper than flydubai?', a: 'Rarely on base fare. But PIA includes 30 kg baggage vs flydubai Economy Lite (0 kg). For travellers with luggage, PIA can be equal or cheaper total cost.' },
                { q: 'What is cheapest airline from Pakistan to Riyadh?', a: 'Saudia and PIA both fly direct Pakistan–Riyadh and are typically cheapest. Compare both on FlightRate.' },
              ].map((f, i) => (
                <details key={i} className="route-faq">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="blog-cta">
            <h3>See today&apos;s cheapest airline on your route</h3>
            <p>We compare all 8 airlines daily. WhatsApp booking in 7 minutes.</p>
            <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">💬 Compare Fares Now</a>
            <Link href="/flights/cheapest-airlines-pakistan-to-dubai" className="route-search-btn">Dubai Airline Comparison</Link>
          </div>
        </div>
      </div>
    </>
  )
}
