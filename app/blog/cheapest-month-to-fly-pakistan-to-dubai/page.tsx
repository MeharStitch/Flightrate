import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600 // re-renders with fresh R2 data every hour

export const metadata: Metadata = {
  title: 'Cheapest Month to Fly from Pakistan to Dubai (2026) | FlightRate',
  description: 'Based on real daily price data: the cheapest and most expensive months to fly from Karachi, Lahore and Islamabad to Dubai in 2026. All fares in PKR.',
  keywords: [
    'cheapest month to fly pakistan to dubai',
    'cheapest time to fly karachi to dubai',
    'best time to book pakistan dubai flight',
    'pakistan dubai flight price by month 2026',
    'when is cheapest to fly to dubai from pakistan',
    'karachi dubai cheap month pkr',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/blog/cheapest-month-to-fly-pakistan-to-dubai' },
  openGraph: {
    title: 'Cheapest Month to Fly Pakistan to Dubai 2026 | FlightRate',
    description: 'Real price data shows which month is cheapest to fly from Pakistan to Dubai. Updated daily.',
    url: 'https://www.flightrate.pk/blog/cheapest-month-to-fly-pakistan-to-dubai',
    type: 'article',
  },
}

// Fetch 30-day price history from R2 via prices API — live scraper data
async function getHistory(from: string) {
  try {
    const res = await fetch(
      `https://www.flightrate.pk/api/prices/${from}-DXB`,
      { next: { revalidate: 3600, tags: [`price-${from}-DXB`] } }
    )
    if (!res.ok) return null
    const d = await res.json()
    return d?.history as { date: string; minPrice: number }[] | null
  } catch { return null }
}

function cheapestMonthFromHistory(history: { date: string; minPrice: number }[]): string | null {
  if (history.length < 10) return null
  const byMonth: Record<string, number[]> = {}
  for (const h of history) {
    const m = h.date.slice(0, 7)
    ;(byMonth[m] ??= []).push(h.minPrice)
  }
  let cheapest = '', cheapestAvg = Infinity
  for (const [m, prices] of Object.entries(byMonth)) {
    const avg = prices.reduce((s, p) => s + p, 0) / prices.length
    if (avg < cheapestAvg) { cheapestAvg = avg; cheapest = m }
  }
  if (!cheapest) return null
  const [y, mo] = cheapest.split('-')
  return new Date(+y, +mo - 1, 1).toLocaleString('en', { month: 'long', year: 'numeric' })
}

const MONTH_GUIDE = [
  { month: 'January',   level: 'Cheap',     reason: 'Post-holiday lull, low demand. Excellent fares.' },
  { month: 'February',  level: 'Cheap',     reason: 'Off-peak. One of the best months to book.' },
  { month: 'March',     level: 'Moderate',  reason: 'Ramadan period — prices rise closer to Eid.' },
  { month: 'April',     level: 'High',      reason: 'Eid-ul-Fitr typically falls here — peak demand.' },
  { month: 'May',       level: 'Moderate',  reason: 'Post-Eid drop. Good deals available mid-month.' },
  { month: 'June',      level: 'Very High', reason: 'School holidays start — prices surge 30–50%.' },
  { month: 'July',      level: 'Very High', reason: 'Peak summer. Highest fares of the year.' },
  { month: 'August',    level: 'Very High', reason: 'School holidays continue. Book very early or avoid.' },
  { month: 'September', level: 'Cheap',     reason: 'Schools back, demand drops. Great value month.' },
  { month: 'October',   level: 'Moderate',  reason: 'Steady demand. Reasonable fares.' },
  { month: 'November',  level: 'Moderate',  reason: 'Pre-winter. Prices start climbing late month.' },
  { month: 'December',  level: 'High',      reason: 'Winter holidays + year-end travel push fares up.' },
]

const LEVEL_COLOR: Record<string, string> = {
  'Cheap': '#10B981', 'Moderate': '#F59E0B', 'High': '#EF4444', 'Very High': '#DC2626',
}

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Cheapest Month to Fly from Pakistan to Dubai (2026 Price Data)',
      description: 'Based on real daily price data scraped from all airlines, we reveal the cheapest and most expensive months to fly Pakistan to Dubai in 2026.',
      url: 'https://www.flightrate.pk/blog/cheapest-month-to-fly-pakistan-to-dubai',
      datePublished: '2026-05-15',
      dateModified: new Date().toISOString(),
      image: { '@type': 'ImageObject', url: 'https://www.flightrate.pk/opengraph-image', width: 1200, height: 630 },
      author: { '@type': 'Organization', '@id': 'https://www.flightrate.pk/#organization', name: 'FlightRate', url: 'https://www.flightrate.pk' },
      publisher: { '@type': 'Organization', '@id': 'https://www.flightrate.pk/#organization', name: 'FlightRate', url: 'https://www.flightrate.pk', logo: { '@type': 'ImageObject', url: 'https://www.flightrate.pk/opengraph-image', width: 1200, height: 630 } },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',   item: 'https://www.flightrate.pk' },
        { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://www.flightrate.pk/blog' },
        { '@type': 'ListItem', position: 3, name: 'Cheapest Month to Fly Pakistan to Dubai', item: 'https://www.flightrate.pk/blog/cheapest-month-to-fly-pakistan-to-dubai' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is the cheapest month to fly from Pakistan to Dubai?',
          acceptedAnswer: { '@type': 'Answer', text: 'January, February, and September are consistently the cheapest months to fly from Pakistan to Dubai. Fares are typically 20–35% lower than peak summer months. Avoid June, July, August (school holidays) and Eid periods for the best prices.' },
        },
        {
          '@type': 'Question',
          name: 'When is the most expensive time to fly from Pakistan to Dubai?',
          acceptedAnswer: { '@type': 'Answer', text: 'June, July, and August are the most expensive months due to school summer holidays. Eid-ul-Fitr and Eid-ul-Adha periods also see prices spike 30–50% above normal.' },
        },
        {
          '@type': 'Question',
          name: 'How far in advance should I book a Pakistan to Dubai flight?',
          acceptedAnswer: { '@type': 'Answer', text: 'Book 3–6 weeks in advance for the best fares on Pakistan–Dubai routes. During peak periods (Eid, summer), book 8–12 weeks ahead. Last-minute fares (under 1 week) are typically 40–60% more expensive.' },
        },
      ],
    },
  ],
}

export default async function CheapestMonthPage() {
  // Pull live history from scraper pipeline for 3 key routes
  const [khiHistory, lheHistory, isbHistory] = await Promise.all([
    getHistory('KHI'), getHistory('LHE'), getHistory('ISB'),
  ])

  const khiCheapest = khiHistory ? cheapestMonthFromHistory(khiHistory) : null
  const lheCheapest = lheHistory ? cheapestMonthFromHistory(lheHistory) : null
  const isbCheapest = isbHistory ? cheapestMonthFromHistory(isbHistory) : null

  const today = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="blog-post">
        <div className="blog-post-inner">
          <nav className="route-breadcrumb">
            <Link href="/">Home</Link><span>›</span>
            <Link href="/blog">Guides</Link><span>›</span>
            <span>Cheapest Month Pakistan to Dubai</span>
          </nav>

          <span className="blog-tag">Price Guide</span>
          <h1 className="blog-h1">Cheapest Month to Fly from Pakistan to Dubai (2026)</h1>
          <p className="blog-meta">
            Based on real daily price scraping from all airlines ·{' '}
            <time dateTime={new Date().toISOString()}>Updated {today}</time>
          </p>

          {/* Live data callout — from scraper pipeline */}
          {(khiCheapest || lheCheapest || isbCheapest) && (
            <div className="blog-data-callout">
              <strong>📊 Based on our 30-day price data:</strong>
              <ul>
                {khiCheapest && <li>Karachi → Dubai: cheapest fares in <strong>{khiCheapest}</strong></li>}
                {lheCheapest && <li>Lahore → Dubai: cheapest fares in <strong>{lheCheapest}</strong></li>}
                {isbCheapest && <li>Islamabad → Dubai: cheapest fares in <strong>{isbCheapest}</strong></li>}
              </ul>
            </div>
          )}

          <div className="blog-body">
            <h2>Quick Answer</h2>
            <p><strong>January, February, and September</strong> are the cheapest months to fly from Pakistan to Dubai. Fares during these months can be 20–40% lower than peak periods. <strong>June, July, and August</strong> are the most expensive — avoid these months if price is your priority.</p>

            <h2>Month-by-Month Price Guide</h2>
            <p>Here is what to expect for each month on Pakistan–Dubai routes, based on historical pricing patterns and our daily data:</p>

            <div className="month-guide">
              {MONTH_GUIDE.map(m => (
                <div key={m.month} className="month-row">
                  <span className="month-name">{m.month}</span>
                  <span className="month-level" style={{ color: LEVEL_COLOR[m.level] }}>{m.level}</span>
                  <span className="month-reason">{m.reason}</span>
                </div>
              ))}
            </div>

            <h2>Why Eid Makes Pakistan–Dubai Flights Expensive</h2>
            <p>Dubai has one of the largest Pakistani expat communities in the world — over 1.2 million Pakistanis live in the UAE. During Eid-ul-Fitr and Eid-ul-Adha, hundreds of thousands of expats fly home to Pakistan, while families in Pakistan fly to visit relatives in the UAE. This dual surge in demand pushes fares up 30–50% in the two weeks before and after Eid.</p>
            <p><strong>Tip:</strong> If you must travel during Eid, book at least 8–10 weeks in advance. Even then, expect to pay 20–30% more than normal fares.</p>

            <h2>How to Get the Cheapest Pakistan–Dubai Fare Regardless of Month</h2>
            <ul>
              <li><strong>Book mid-week (Tue/Wed departures)</strong> — typically 10–20% cheaper than Friday or Sunday flights</li>
              <li><strong>Fly early morning</strong> — the 3 AM and 5 AM departures from Karachi are almost always the cheapest on any given day</li>
              <li><strong>Compare flydubai vs Air Arabia</strong> — both fly direct, both are budget carriers. Which is cheaper changes daily</li>
              <li><strong>Book 3–5 weeks ahead</strong> — this is the sweet spot for Pakistan–Dubai routes. Too early or too late, and prices are higher</li>
              <li><strong>Avoid extra baggage if possible</strong> — adding 10 kg to a budget carrier ticket can cost PKR 6,000–10,000 extra</li>
            </ul>

            <h2>Current Cheapest Pakistan to Dubai Fares</h2>
            <p>Our scraper checks all airline prices daily. See today&apos;s live fares for each departure city:</p>
            <div className="route-related" style={{ marginTop: 12 }}>
              {[
                { slug: 'karachi-to-dubai',    label: 'Karachi → Dubai' },
                { slug: 'lahore-to-dubai',     label: 'Lahore → Dubai' },
                { slug: 'islamabad-to-dubai',  label: 'Islamabad → Dubai' },
                { slug: 'peshawar-to-dubai',   label: 'Peshawar → Dubai' },
                { slug: 'sialkot-to-dubai',    label: 'Sialkot → Dubai' },
                { slug: 'multan-to-dubai',     label: 'Multan → Dubai' },
              ].map(r => (
                <Link key={r.slug} href={`/flights/${r.slug}`} className="route-related-link">{r.label}</Link>
              ))}
            </div>
          </div>

          <div className="blog-cta">
            <h3>Ready to book at the best price?</h3>
            <p>Our agents compare all airlines daily and book via WhatsApp in 7 minutes.</p>
            <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">💬 Get Today&apos;s Best Price</a>
            <Link href="/flights/cheapest-airlines-pakistan-to-dubai" className="route-search-btn">Compare All Airlines</Link>
          </div>
        </div>
      </div>
    </>
  )
}
