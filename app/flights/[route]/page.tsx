import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAllRoutes, parseRouteSlug,
  getRouteAirlines, getRouteDuration,
  PK_CITIES, DEST_CITIES,
} from '@/lib/routes'
import PriceGraph from '@/components/PriceGraph'
import PriceInsight from '@/components/PriceInsight'

// ─── Static params — build all 88 route pages at deploy ─────────────────────
export function generateStaticParams() {
  return getAllRoutes().map(r => ({ route: r.slug }))
}

// ─── Dynamic metadata per route ──────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ route: string }> }
): Promise<Metadata> {
  const { route } = await params
  const parsed = parseRouteSlug(route)
  if (!parsed) return { title: 'Route Not Found' }

  const { from, to } = parsed
  const isReverse  = to.country === 'Pakistan'                     // Gulf → Pakistan
  const isDiaspora = from.country === 'Pakistan' && !['UAE','Qatar','Saudi Arabia','Kuwait','Oman','Bahrain'].includes(to.country)

  const title = isReverse
    ? `${from.name} to ${to.name} Flights — Cheap Tickets for Expats | FlightRate`
    : isDiaspora
      ? `${from.name} to ${to.name} Flights — Cheapest Fares in PKR | FlightRate`
      : `${from.name} to ${to.name} Cheap Flights — PKR Prices, All Airlines | FlightRate`

  const description = isReverse
    ? `Flying from ${from.name} back to ${to.name}? Compare all airlines, PKR prices. Book via WhatsApp in 7 minutes. No hidden fees.`
    : isDiaspora
      ? `Cheapest ${from.name} to ${to.name} flights. Compare Qatar Airways, Emirates, PIA & more. PKR prices. Book via WhatsApp.`
      : `Cheapest ${from.name} to ${to.name} flights in PKR. Compare PIA, Emirates, flydubai & more. Confirm price & book via WhatsApp in 7 minutes. No hidden fees.`

  const keywords = isReverse ? [
    `${from.name} to ${to.name} flights`,
    `${from.code} to ${to.code} cheap ticket`,
    `${from.name} ${to.name} flight price`,
    `fly from ${from.country} to Pakistan`,
    `expat flights ${from.name} Pakistan`,
    `${to.name} se ${from.name} flight`,
  ] : isDiaspora ? [
    `${from.name} to ${to.name} flights`,
    `cheap flights Pakistan ${to.name}`,
    `${from.code} ${to.code} ticket price`,
    `Pakistan to ${to.country} flights`,
    `${from.name} ${to.name} flight PKR`,
    `Qatar Airways ${from.name} ${to.name}`,
    `Emirates ${from.name} ${to.name}`,
  ] : [
    `${from.name} to ${to.name} flights`,
    `cheap flights ${from.name} ${to.name}`,
    `${from.code} to ${to.code}`,
    `${from.name} ${to.name} ticket price`,
    `${from.name} ${to.country} flights`,
    `Pakistan to ${to.country} flights`,
    `flights from ${from.name}`,
    `${to.name} se ${from.name} flight`,
  ]

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `https://www.flightrate.pk/flights/${route}` },
    openGraph: {
      title,
      description,
      url: `https://www.flightrate.pk/flights/${route}`,
      type: 'website',
    },
  }
}

// ─── Baggage allowances by airline ───────────────────────────────────────────
const BAGGAGE: Record<string, { checkin: string; cabin: string }> = {
  'Emirates':         { checkin: '30 kg', cabin: '7 kg' },
  'Etihad Airways':   { checkin: '23 kg', cabin: '7 kg' },
  'Qatar Airways':    { checkin: '23 kg', cabin: '7 kg' },
  'PIA':              { checkin: '23 kg', cabin: '7 kg' },
  'Saudia':           { checkin: '23 kg', cabin: '7 kg' },
  'Oman Air':         { checkin: '23 kg', cabin: '7 kg' },
  'Kuwait Airways':   { checkin: '23 kg', cabin: '7 kg' },
  'Gulf Air':         { checkin: '23 kg', cabin: '7 kg' },
  'British Airways':  { checkin: '23 kg', cabin: '12 kg' },
  'Air Canada':       { checkin: '23 kg', cabin: '10 kg' },
  'United Airlines':  { checkin: '23 kg', cabin: '9 kg' },
  'Turkish Airlines': { checkin: '20 kg', cabin: '8 kg' },
  'flydubai':         { checkin: '20 kg', cabin: '7 kg' },
  'Air Arabia':       { checkin: '20 kg', cabin: '10 kg' },
  'flynas':           { checkin: '20 kg', cabin: '7 kg' },
  'Airblue':          { checkin: '20 kg', cabin: '7 kg' },
  'Serene Air':       { checkin: '20 kg', cabin: '7 kg' },
  'FlyJinnah':        { checkin: '20 kg', cabin: '7 kg' },
  'Jazeera Airways':  { checkin: '20 kg', cabin: '7 kg' },
}

function getPriceTrend(history: { date: string; minPrice: number }[]): { pct: number; dir: 'down' | 'up' } | null {
  if (history.length < 8) return null
  const current = history[0].minPrice
  const weekAvg = history.slice(1, 8).reduce((s, h) => s + h.minPrice, 0) / 7
  const pct = Math.round(((current - weekAvg) / weekAvg) * 100)
  if (Math.abs(pct) < 2) return null
  return { pct: Math.abs(pct), dir: pct < 0 ? 'down' : 'up' }
}

function getCheapestMonth(history: { date: string; minPrice: number }[]): string | null {
  if (history.length < 15) return null
  const byMonth: Record<string, number[]> = {}
  for (const h of history) {
    const m = h.date.slice(0, 7)
    ;(byMonth[m] ??= []).push(h.minPrice)
  }
  let cheapest = ''
  let cheapestAvg = Infinity
  for (const [m, prices] of Object.entries(byMonth)) {
    const avg = prices.reduce((s, p) => s + p, 0) / prices.length
    if (avg < cheapestAvg) { cheapestAvg = avg; cheapest = m }
  }
  if (!cheapest) return null
  const [y, mo] = cheapest.split('-')
  return new Date(+y, +mo - 1, 1).toLocaleString('en', { month: 'long', year: 'numeric' })
}

// ─── FAQ data per route ───────────────────────────────────────────────────────
function getFAQs(from: { name: string; code: string }, to: { name: string; code: string }) {
  const airlines = getRouteAirlines(from.code, to.code)
  const duration = getRouteDuration(from.code, to.code)
  return [
    {
      q: `Which airlines fly from ${from.name} to ${to.name}?`,
      a: `${airlines.join(', ')} operate flights on the ${from.name}–${to.name} route. Availability varies by season.`,
    },
    {
      q: `How long is the flight from ${from.name} to ${to.name}?`,
      a: `Direct flights typically take around ${duration}. Connecting flights may take 4–8 hours depending on layover.`,
    },
    {
      q: `What is the cheapest time to fly from ${from.name} to ${to.name}?`,
      a: `Tuesday and Wednesday departures are usually cheapest. Avoid school holidays and Eid periods. Book 3–6 weeks in advance for best fares.`,
    },
    {
      q: `How do I book a ${from.name} to ${to.name} flight via FlightRate?`,
      a: `Search your route and date above, pick your preferred flight, then click "Book via WhatsApp". Our agent confirms the exact price and books your ticket within 7 minutes.`,
    },
    {
      q: `Are prices shown in PKR?`,
      a: `Yes. All fares are displayed in Pakistani Rupees (PKR) including an estimated tax buffer. Final price is confirmed via WhatsApp before payment.`,
    },
  ]
}

// ─── Fetch live price from Blob (cached 1h) ───────────────────────────────────
async function getLivePrice(fromCode: string, toCode: string) {
  try {
    const res = await fetch(
      `https://www.flightrate.pk/api/prices/${fromCode}-${toCode}`,
      { next: { revalidate: 3600, tags: [`price-${fromCode}-${toCode}`] } }
    )
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

// ─── Page component ───────────────────────────────────────────────────────────
export default async function RoutePage(
  { params }: { params: Promise<{ route: string }> }
) {
  const { route } = await params
  const parsed = parseRouteSlug(route)
  if (!parsed) notFound()

  const { from, to } = parsed
  const airlines  = getRouteAirlines(from.code, to.code)
  const duration  = getRouteDuration(from.code, to.code)
  const faqs      = getFAQs(from, to)

  // Fetch live scraped price
  const priceData  = await getLivePrice(from.code, to.code)
  const livePrice  = priceData?.minPrice ?? null
  const scrapedAt  = priceData?.scrapedAt ?? null
  const isFresh    = priceData?.fresh ?? false
  const priceLabel = livePrice
    ? `PKR ${(livePrice + 7000).toLocaleString('en-PK')}`
    : 'Check WhatsApp'
  const hoursAgo      = priceData?.hoursOld ?? null
  const history       = priceData?.history ?? []
  const priceTrend    = getPriceTrend(history)
  const cheapestMonth = getCheapestMonth(history)

  // Search date 7 days from now
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 7)
  const searchDate = tomorrow.toISOString().split('T')[0]

  // Related routes (same origin, different dest)
  const relatedDest = DEST_CITIES.filter(c => c.code !== to.code).slice(0, 5)
  const relatedFrom = PK_CITIES.filter(c => c.code !== from.code).slice(0, 4)

  // JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `https://www.flightrate.pk/flights/${route}`,
        url: `https://www.flightrate.pk/flights/${route}`,
        name: `${from.name} to ${to.name} Flights — FlightRate`,
        description: `Compare cheap flights ${from.name} to ${to.name}. Book via WhatsApp.`,
        dateModified: scrapedAt ?? new Date().toISOString(),
        ...(livePrice ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'PKR',
            price: String(livePrice + 7000),
            priceValidUntil: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            availability: 'https://schema.org/InStock',
          }
        } : {}),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: `${from.name} to ${to.name}`, item: `https://www.flightrate.pk/flights/${route}` },
          ],
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      ...(history.length >= 2 ? [{
        '@type': 'Dataset',
        name: `${from.name} to ${to.name} Flight Price History`,
        description: `Daily lowest PKR fares for ${from.code}-${to.code} flights over the past 30 days, updated daily by FlightRate.pk`,
        url: `https://www.flightrate.pk/flights/${route}`,
        creator: { '@type': 'Organization', name: 'FlightRate', url: 'https://www.flightrate.pk' },
        dateModified: scrapedAt ?? new Date().toISOString(),
        temporalCoverage: `${history[0]?.date ?? ''}/${history[history.length - 1]?.date ?? ''}`,
        variableMeasured: [{
          '@type': 'PropertyValue',
          name: 'Minimum Flight Price',
          unitCode: 'PKR',
          measurementTechnique: 'Web scraping of Google Flights, updated daily',
        }],
        distribution: {
          '@type': 'DataDownload',
          encodingFormat: 'application/json',
          contentUrl: `https://www.flightrate.pk/api/prices/${from.code}-${to.code}`,
        },
      }] : []),
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="route-page">
        {/* Breadcrumb */}
        <nav className="route-breadcrumb">
          <Link href="/">Home</Link>
          <span>›</span>
          <Link href="/flights">Flights</Link>
          <span>›</span>
          <span>{from.name} to {to.name}</span>
        </nav>

        {/* Hero */}
        <div className="route-hero">
          <h1 className="route-h1">
            Cheap Flights: {from.name} to {to.name}
            <span className="route-codes">({from.code} → {to.code})</span>
          </h1>
          <p className="route-sub">
            Compare all airlines · PKR prices · Book via WhatsApp in 7 minutes
          </p>
        </div>

        {/* CTA bar */}
        <div className="route-cta-bar">
          <a
            href={`/search?from=${from.code}&to=${to.code}&date=${searchDate}&adults=1&class=ECONOMY`}
            className="route-search-btn"
          >
            ✈ Search Live Fares
          </a>
          <a
            href={`https://wa.me/923240763099?text=${encodeURIComponent(`Hi FlightRate! I need a flight from ${from.name} (${from.code}) to ${to.name} (${to.code}). Please share the best price.`)}`}
            className="route-wa-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Get Best Price on WhatsApp
          </a>
        </div>

        {/* Quick facts */}
        <div className="route-facts">
          <div className="route-fact">
            <span className="rf-icon">⏱</span>
            <span className="rf-label">Flight Time</span>
            <span className="rf-val">{duration}</span>
          </div>
          <div className="route-fact">
            <span className="rf-icon">✈</span>
            <span className="rf-label">Airlines</span>
            <span className="rf-val">{airlines.length}+ carriers</span>
          </div>
          <div className="route-fact">
            <span className="rf-icon">💰</span>
            <span className="rf-label">Price From</span>
            <span className="rf-val">{priceLabel}</span>
            {hoursAgo !== null && (
              <span className="rf-freshness">
                {isFresh ? `Updated ${hoursAgo}h ago` : 'Price may be stale'}
              </span>
            )}
          </div>
          <div className="route-fact">
            <span className="rf-icon">⚡</span>
            <span className="rf-label">Booking</span>
            <span className="rf-val">7 min via WhatsApp</span>
          </div>
        </div>

        {/* Price trend bar */}
        {priceTrend && (
          <div className={`price-trend-bar ${priceTrend.dir === 'down' ? 'trend-good' : 'trend-bad'}`}>
            {priceTrend.dir === 'down'
              ? `✅ Good time to book — prices are ${priceTrend.pct}% cheaper than last week`
              : `⚠️ Prices are ${priceTrend.pct}% higher than last week — consider booking soon or waiting`}
          </div>
        )}

        {/* Price history graph */}
        {history.length >= 2 && (
          <PriceGraph
            history={history}
            fromCity={from.name}
            toCity={to.name}
          />
        )}

        {/* Best time to book insight */}
        {history.length >= 7 && (
          <PriceInsight history={history} />
        )}

        {/* Airlines */}
        <section className="route-section">
          <h2>Airlines Flying {from.name} to {to.name}</h2>
          <div className="route-airlines">
            {airlines.map(a => (
              <div key={a} className="route-airline-chip">
                {getAirlineCode(a) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://www.gstatic.com/flights/airline_logos/70px/${getAirlineCode(a)}.png`}
                    alt={a} width={24} height={24}
                    style={{ objectFit: 'contain' }}
                  />
                )}
                {a}
              </div>
            ))}
          </div>
          <p className="route-note">
            Availability and frequency vary by season. FlightRate compares fares across all carriers in real time.
          </p>
        </section>

        {/* Baggage allowance table */}
        <section className="route-section">
          <h2>Baggage Allowance — {from.name} to {to.name}</h2>
          <div className="baggage-table-wrap">
            <table className="baggage-table">
              <thead>
                <tr><th>Airline</th><th>Check-in</th><th>Cabin</th></tr>
              </thead>
              <tbody>
                {airlines.map(a => {
                  const b = BAGGAGE[a]
                  if (!b) return null
                  return (
                    <tr key={a}>
                      <td>{a}</td>
                      <td>{b.checkin}</td>
                      <td>{b.cabin}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="route-note">Economy class standard allowances. Business class and extra baggage available on request.</p>
        </section>

        {/* Tips */}
        <section className="route-section">
          <h2>Tips for Booking {from.name} to {to.name} Flights</h2>
          {cheapestMonth && (
            <div className="cheapest-month-box">
              📅 Based on price data, <strong>{cheapestMonth}</strong> tends to have the lowest fares on this route. Book early for that month to lock in the best price.
            </div>
          )}
          <ul className="route-tips">
            <li>📅 <strong>Book 3–6 weeks ahead</strong> for the lowest fares on this route</li>
            <li>📆 <strong>Fly mid-week</strong> (Tue/Wed) — cheaper than weekends by up to 20%</li>
            <li>🕐 <strong>Early morning departures</strong> from {from.name} are typically cheapest</li>
            <li>🧳 <strong>Check baggage carefully</strong> — economy allowances vary from 20–30 kg depending on airline</li>
            <li>💬 <strong>Message us on WhatsApp</strong> — our agent finds you the best deal in minutes</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="route-section">
          <h2>Frequently Asked Questions</h2>
          <div className="route-faqs">
            {faqs.map((f, i) => (
              <details key={i} className="route-faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related routes */}
        <section className="route-section">
          <h2>More flights from {from.name}</h2>
          <div className="route-related">
            {relatedDest.map(d => (
              <Link key={d.code} href={`/flights/${from.slug}-to-${d.slug}`} className="route-related-link">
                {from.name} → {d.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="route-section">
          <h2>Flights to {to.name} from other cities</h2>
          <div className="route-related">
            {relatedFrom.map(f2 => (
              <Link key={f2.code} href={`/flights/${f2.slug}-to-${to.slug}`} className="route-related-link">
                {f2.name} → {to.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <div className="route-final-cta">
          <h3>Ready to book your {from.name} to {to.name} flight?</h3>
          <p>Search live fares now — our agent books via WhatsApp in 7 minutes.</p>
          <a
            href={`/search?from=${from.code}&to=${to.code}&date=${searchDate}&adults=1&class=ECONOMY`}
            className="route-search-btn"
          >
            Search Flights Now
          </a>
          <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">
            💬 Chat on WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}

// Helper: airline name → IATA code for logo
function getAirlineCode(name: string): string {
  const map: Record<string, string> = {
    'Emirates': 'EK', 'flydubai': 'FZ', 'PIA': 'PK', 'Air Arabia': 'G9',
    'Qatar Airways': 'QR', 'Saudia': 'SV', 'flynas': 'XY', 'Kuwait Airways': 'KU',
    'Oman Air': 'WY', 'Etihad Airways': 'EY', 'Airblue': 'PA', 'Serene Air': 'WZ',
    'FlyJinnah': '9P', 'Gulf Air': 'GF', 'Jazeera Airways': 'J9',
    'British Airways': 'BA', 'Turkish Airlines': 'TK',
    'Air Canada': 'AC', 'United Airlines': 'UA',
  }
  return map[name] ?? ''
}
