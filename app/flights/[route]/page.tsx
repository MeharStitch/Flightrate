import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAllRoutes, parseRouteSlug,
  getRouteAirlines, getRouteDuration,
  PK_CITIES, DEST_CITIES, BAGGAGE,
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
  const isReverse  = to.country === 'Pakistan'
  const isDiaspora = from.country === 'Pakistan' && !['UAE','Qatar','Saudi Arabia','Kuwait','Oman','Bahrain'].includes(to.country)

  // Fetch live price — Next.js deduplicates this with the page component's call
  const priceData = await getLivePrice(from.code, to.code)
  const priceNum  = priceData?.minPrice ? priceData.minPrice + 7000 : null
  const priceStr  = priceNum ? `PKR ${priceNum.toLocaleString('en-PK')}` : null

  // Title format matches #1 search query: "cheap flights from X to Y"
  // Sastaticket pattern: "Cheap Flights from Karachi to Dubai (PKR 45,015) | ..."
  const title = priceStr
    ? `Cheap Flights from ${from.name} to ${to.name} (${priceStr}) | FlightRate`
    : isReverse
      ? `Cheap Flights from ${from.name} to ${to.name} | Expat Fares in PKR | FlightRate`
      : isDiaspora
        ? `Cheap Flights from ${from.name} to ${to.name} | PKR Prices | FlightRate`
        : `Cheap Flights from ${from.name} to ${to.name} | All Airlines in PKR | FlightRate`

  const description = priceStr
    ? `Cheap flights from ${from.name} to ${to.name} from ${priceStr} today. Compare all airlines in PKR. Book via WhatsApp in 7 minutes.`
    : isReverse
      ? `Cheap flights from ${from.name} to ${to.name}. Compare all airlines in PKR. Book via WhatsApp in 7 minutes. No hidden fees.`
      : isDiaspora
        ? `Cheap flights from ${from.name} to ${to.name} in PKR. Compare Qatar Airways, Emirates, PIA & more. Book via WhatsApp.`
        : `Cheap flights from ${from.name} to ${to.name} in PKR. Compare PIA, Emirates, flydubai & more. Book via WhatsApp in 7 minutes.`

  const keywords = [
    `cheap flights from ${from.name} to ${to.name}`,
    `${from.name} to ${to.name} flights`,
    `${from.name} to ${to.name} ticket price`,
    `${from.name} to ${to.name} ticket price today`,
    `${from.code} to ${to.code}`,
    `${from.name} ${to.name} flight price in PKR`,
    `cheapest airline from ${from.name} to ${to.name}`,
    `${from.name} to ${to.name} cheap flights`,
    ...(isReverse ? [
      `fly from ${from.country} to Pakistan`,
      `expat flights ${from.name} to ${to.name}`,
    ] : []),
    ...(isDiaspora ? [
      `Pakistan to ${to.country} flights`,
      `${from.name} to ${to.name} flight PKR`,
    ] : [
      `${from.name} to ${to.country} flights`,
      `Pakistan to ${to.country} flights`,
    ]),
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

// ─── FAQ data per route — 12 questions for PAA + Tier 1-4 keyword coverage ───
function getFAQs(
  from: { name: string; code: string; country: string },
  to:   { name: string; code: string; country: string },
  livePrice: number | null,
  cheapestMonth: string | null,
) {
  const airlines  = getRouteAirlines(from.code, to.code)
  const duration  = getRouteDuration(from.code, to.code)
  const cheapest  = airlines[0] ?? 'PIA'
  const priceStr  = livePrice ? `PKR ${(livePrice + 7000).toLocaleString('en-PK')}` : null
  const isGulf    = ['UAE','Qatar','Saudi Arabia','Kuwait','Oman','Bahrain'].includes(to.country)
  const isPakDest = to.country === 'Pakistan'

  return [
    {
      q: `What is today's ${from.name} to ${to.name} ticket price in PKR?`,
      a: priceStr
        ? `Today's lowest ${from.name} to ${to.name} fare is ${priceStr} (PKR). Prices are scraped daily from all airlines and updated automatically. Final price is confirmed via WhatsApp before you pay.`
        : `${from.name} to ${to.name} ticket prices are updated daily. Message us on WhatsApp for today's exact fare in PKR — our agent responds within 7 minutes.`,
    },
    {
      q: `Which is the cheapest airline from ${from.name} to ${to.name}?`,
      a: `${cheapest} frequently offers the lowest fares on ${from.name}–${to.name}. Other competitive options include ${airlines.slice(1, 3).join(' and ')}. Prices vary by date — FlightRate compares all carriers daily so you always see the best rate.`,
    },
    {
      q: `Which airlines fly from ${from.name} to ${to.name}?`,
      a: `${airlines.join(', ')} operate flights on the ${from.name}–${to.name} route. Availability and frequency vary by season.`,
    },
    {
      q: `How long is the flight from ${from.name} to ${to.name}?`,
      a: `Direct flights take around ${duration}. Connecting flights via a hub (Dubai, Doha, Istanbul) may take 5–10 hours depending on the layover.`,
    },
    {
      q: `Is there a direct flight from ${from.name} to ${to.name}?`,
      a: `Yes, direct (non-stop) flights operate on ${from.name}–${to.name}. ${cheapest} and other carriers offer non-stop services. Search above to filter by direct flights only.`,
    },
    {
      q: `What is the cheapest month to fly from ${from.name} to ${to.name}?`,
      a: cheapestMonth
        ? `Based on 30 days of price data, ${cheapestMonth} tends to have the lowest fares on this route. Eid seasons (Eid-ul-Fitr and Eid-ul-Adha) and summer school holidays are typically the most expensive periods.`
        : `January, February, and September are generally off-peak months with lower fares. Prices peak during Eid holidays and June–August school holidays. Book 3–6 weeks ahead for best rates.`,
    },
    {
      q: `How much baggage am I allowed on ${from.name} to ${to.name} flights?`,
      a: `Economy baggage varies by airline: Emirates allows 30 kg check-in, while most others (PIA, Qatar Airways, Saudia, Oman Air) allow 23 kg. Budget carriers like flydubai, Air Arabia, and FlyJinnah allow 20 kg. Cabin baggage is typically 7–10 kg. Always verify on your ticket.`,
    },
    {
      q: `What is the cheapest time to fly from ${from.name} to ${to.name}?`,
      a: `Tuesday and Wednesday departures are typically cheapest. Early morning flights (before 7 AM) also tend to be lower priced. Avoid booking for Friday or Sunday travel. Book 3–6 weeks in advance for the best fares.`,
    },
    {
      q: `Can I pay for my ${from.name} to ${to.name} ticket in Pakistani Rupees?`,
      a: `Yes. FlightRate shows all fares in PKR with no hidden currency conversion fees. Payment is made directly via bank transfer — the price you see is the price you pay.`,
    },
    ...(isGulf || isPakDest ? [{
      q: `Do I need a visa to travel from ${from.name} to ${to.name}?`,
      a: isPakDest
        ? `Pakistani nationals returning home do not need a visa for Pakistan. Ensure your CNIC or Pakistani passport is valid. Foreign nationals may require a Pakistani visa — check with the relevant embassy.`
        : `Pakistani passport holders travelling to ${to.country} typically need a visa. ${to.country === 'UAE' ? 'UAE issues 30-day and 90-day visas on arrival for some passport holders, but Pakistani nationals must apply in advance.' : `Contact the ${to.country} embassy or your travel agent for current requirements.`} FlightRate can assist with visa guidance via WhatsApp.`,
    }] : []),
    {
      q: `What documents do I need at ${from.name} airport?`,
      a: isPakDest
        ? `Flying into Pakistan: valid passport (or NICOP/CNIC for Pakistani nationals), your boarding pass, and return/onward ticket. International arrivals complete immigration and customs at the destination. No separate airport entry document required.`
        : `Flying from ${from.name}: valid passport (at least 6 months validity), printed or digital boarding pass, and your visa/residency permit for ${to.country} if applicable. Pakistanis travelling to ${to.country} must have a valid UAE/Saudi/Qatar/Kuwait visa before arriving at the airport — no visa on arrival for Pakistani passport holders to most Gulf countries.`,
    },
    {
      q: `How do I book a ${from.name} to ${to.name} flight via FlightRate?`,
      a: `Search your route and departure date above. Browse fares, then click "Book via WhatsApp." Our agent confirms the exact fare in PKR and completes the booking within 7 minutes. You receive your ticket directly from the airline.`,
    },
    {
      q: `Is FlightRate safe and legitimate?`,
      a: `Yes. FlightRate is a Pakistan-based flight price comparison service. We never ask for card details over WhatsApp — you pay directly via bank transfer. Your ticket comes directly from the airline and is fully verifiable. Our agents are available 7 days a week.`,
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
  const faqs          = getFAQs(from, to, livePrice, cheapestMonth)

  // Search date 7 days from now
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 7)
  const searchDate = tomorrow.toISOString().split('T')[0]

  // Related routes (same origin, different dest)
  const relatedDest = DEST_CITIES.filter(c => c.code !== to.code).slice(0, 5)
  const relatedFrom = PK_CITIES.filter(c => c.code !== from.code).slice(0, 4)

  const priceValidUntil = new Date(Date.now() + 86400000).toISOString().split('T')[0]

  // JSON-LD schema
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // WebPage — clean, no offers here (Google ignores Offer on WebPage)
      {
        '@type': 'WebPage',
        '@id': `https://www.flightrate.pk/flights/${route}`,
        url: `https://www.flightrate.pk/flights/${route}`,
        name: `${from.name} to ${to.name} Flights — ${livePrice ? `from PKR ${(livePrice+7000).toLocaleString('en-PK')} ` : ''}FlightRate`,
        description: `Compare cheap ${from.name} to ${to.name} flights in PKR. Book via WhatsApp.`,
        dateModified: scrapedAt ?? new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: `${from.name} to ${to.name}`, item: `https://www.flightrate.pk/flights/${route}` },
          ],
        },
      },
      // Product + Offer — THIS is what Google uses for price rich snippets in SERP
      // (same pattern Sastaticket, Booking.com, Skyscanner use)
      {
        '@type': 'Product',
        '@id': `https://www.flightrate.pk/flights/${route}#product`,
        name: `${from.name} to ${to.name} Flight Ticket`,
        description: `Cheapest ${from.name} to ${to.name} flights in PKR. Compare ${airlines.slice(0,3).join(', ')} and more. Book via WhatsApp in 7 minutes.`,
        // image is REQUIRED for Google Product rich results eligibility
        image: {
          '@type': 'ImageObject',
          url: 'https://www.flightrate.pk/opengraph-image',
          width: 1200,
          height: 630,
        },
        brand: { '@type': 'Brand', name: 'FlightRate' },
        url: `https://www.flightrate.pk/flights/${route}`,
        ...(livePrice ? {
          offers: {
            '@type': 'Offer',
            '@id': `https://www.flightrate.pk/flights/${route}#offer`,
            priceCurrency: 'PKR',
            price: String(livePrice + 7000),
            priceValidUntil,
            availability: 'https://schema.org/InStock',
            url: `https://www.flightrate.pk/flights/${route}`,
            seller: {
              '@type': 'Organization',
              name: 'FlightRate',
              url: 'https://www.flightrate.pk',
            },
          },
        } : {
          offers: {
            '@type': 'AggregateOffer',
            priceCurrency: 'PKR',
            lowPrice: '30000',
            highPrice: '120000',
            offerCount: String(airlines.length),
            availability: 'https://schema.org/InStock',
            url: `https://www.flightrate.pk/flights/${route}`,
          },
        }),
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
            {from.name} to {to.name} Flights
            {livePrice
              ? (
                <span className="route-live-price">
                  {' '}— from PKR {(livePrice + 7000).toLocaleString('en-PK')} today
                </span>
              ) : (
                <span className="route-live-price route-live-price--fallback">
                  {' '}— Cheap Fares in PKR
                </span>
              )}
            <span className="route-codes">({from.code} → {to.code})</span>
          </h1>
          <p className="route-sub">
            Compare all airlines in PKR · Book via WhatsApp in 7 minutes · No hidden fees
          </p>
          {scrapedAt && (
            <p className="route-freshness">
              <time dateTime={scrapedAt}>
                ✓ Prices updated {hoursAgo !== null && hoursAgo < 24 ? `${hoursAgo}h ago` : 'today'} — scraped daily from all airlines
              </time>
            </p>
          )}
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

        {/* Airline-specific pages for this route */}
        <section className="route-section">
          <h2>Airline Guide — {from.name} to {to.name}</h2>
          <div className="route-related">
            {airlines.map(airlineName => {
              const SLUG_MAP: Record<string, string> = {
                'Emirates': 'emirates', 'flydubai': 'flydubai', 'PIA': 'pia',
                'Air Arabia': 'air-arabia', 'Qatar Airways': 'qatar-airways',
                'Saudia': 'saudia', 'Etihad Airways': 'etihad-airways',
                'flynas': 'flynas', 'Kuwait Airways': 'kuwait-airways',
                'Oman Air': 'oman-air', 'Gulf Air': 'gulf-air',
                'Airblue': 'airblue', 'Serene Air': 'serene-air',
                'FlyJinnah': 'flyjinnah', 'Jazeera Airways': 'jazeera-airways',
                'British Airways': 'british-airways', 'Turkish Airlines': 'turkish-airlines',
                'Air Canada': 'air-canada', 'United Airlines': 'united-airlines',
              }
              const s = SLUG_MAP[airlineName]
              return s ? (
                <Link key={s} href={`/flights/${route}/${s}`} className="route-related-link">
                  {airlineName} — {from.name} → {to.name}
                </Link>
              ) : null
            })}
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
