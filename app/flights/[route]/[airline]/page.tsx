import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getAllRoutes, parseRouteSlug,
  getRouteAirlines, getRouteDuration,
  BAGGAGE,
} from '@/lib/routes'
import { fetchPriceData } from '@/lib/prices'
import { getAirlineRouteIntro } from '@/lib/airline-route-intros'

export const revalidate = 3600 // ISR — re-render hourly with fresh price data

async function getLivePrice(fromCode: string, toCode: string): Promise<number | null> {
  const d = await fetchPriceData(fromCode, toCode)
  return d?.minPrice ? d.minPrice + 7000 : null
}

// Airline slug → display name + IATA
const AIRLINE_SLUGS: Record<string, { name: string; iata: string }> = {
  'emirates':         { name: 'Emirates',         iata: 'EK' },
  'flydubai':         { name: 'flydubai',          iata: 'FZ' },
  'pia':              { name: 'PIA',               iata: 'PK' },
  'air-arabia':       { name: 'Air Arabia',        iata: 'G9' },
  'qatar-airways':    { name: 'Qatar Airways',     iata: 'QR' },
  'saudia':           { name: 'Saudia',            iata: 'SV' },
  'etihad-airways':   { name: 'Etihad Airways',    iata: 'EY' },
  'flynas':           { name: 'flynas',             iata: 'XY' },
  'kuwait-airways':   { name: 'Kuwait Airways',    iata: 'KU' },
  'oman-air':         { name: 'Oman Air',          iata: 'WY' },
  'gulf-air':         { name: 'Gulf Air',          iata: 'GF' },
  'airblue':          { name: 'Airblue',           iata: 'PA' },
  'serene-air':       { name: 'Serene Air',        iata: 'WZ' },
  'flyjinnah':        { name: 'FlyJinnah',         iata: '9P' },
  'jazeera-airways':  { name: 'Jazeera Airways',   iata: 'J9' },
  'british-airways':  { name: 'British Airways',   iata: 'BA' },
  'turkish-airlines': { name: 'Turkish Airlines',  iata: 'TK' },
  'air-canada':       { name: 'Air Canada',        iata: 'AC' },
  'united-airlines':  { name: 'United Airlines',   iata: 'UA' },
}

// Reverse: display name → slug
const NAME_TO_SLUG = Object.fromEntries(
  Object.entries(AIRLINE_SLUGS).map(([slug, { name }]) => [name, slug])
)

export function generateStaticParams() {
  const params: { route: string; airline: string }[] = []
  for (const r of getAllRoutes()) {
    const parsed = parseRouteSlug(r.slug)
    if (!parsed) continue
    const airlines = getRouteAirlines(parsed.from.code, parsed.to.code)
    for (const airlineName of airlines) {
      const slug = NAME_TO_SLUG[airlineName]
      if (slug) params.push({ route: r.slug, airline: slug })
    }
  }
  return params
}

export async function generateMetadata(
  { params }: { params: Promise<{ route: string; airline: string }> }
): Promise<Metadata> {
  const { route, airline } = await params
  const parsed = parseRouteSlug(route)
  const airlineData = AIRLINE_SLUGS[airline]
  if (!parsed || !airlineData) return { title: 'Not Found' }

  const { from, to } = parsed
  const airlines = getRouteAirlines(from.code, to.code)
  if (!airlines.includes(airlineData.name)) return { title: 'Not Found' }

  const title = `${airlineData.name} ${from.name} to ${to.name} Ticket Price Today (PKR) | FlightRate`
  const description = `${airlineData.name} ${from.name} to ${to.name} ticket price today in PKR. Compare live fares, baggage allowance & flight schedule. Book via WhatsApp in 7 minutes.`

  return {
    title,
    description,
    keywords: [
      `${airlineData.name} ${from.name} to ${to.name} ticket price today`,
      `${airlineData.name} ${from.name} to ${to.name} ticket price`,
      `${airlineData.name} ${from.name} to ${to.name}`,
      `${airlineData.name} ${from.name} ${to.name} flights`,
      `${airlineData.name} ${from.code} ${to.code}`,
      `${airlineData.name} ${from.name} to ${to.name} ticket price PKR`,
      `${airlineData.name} ${from.name} to ${to.name} baggage`,
      `${airlineData.iata} ${from.code}-${to.code} price`,
    ],
    alternates: { canonical: `https://www.flightrate.pk/flights/${route}/${airline}` },
    openGraph: {
      title,
      description,
      url: `https://www.flightrate.pk/flights/${route}/${airline}`,
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  }
}

// Airline-specific baggage lookup
function getAirlineBaggage(airlineName: string) {
  return (BAGGAGE as Record<string, { checkin: string; cabin: string }>)[airlineName] ?? null
}

// Typical frequencies by airline
const AIRLINE_FREQUENCY: Record<string, string> = {
  'Emirates':         'Daily flights, multiple departures',
  'flydubai':         'Daily flights from major Pakistani cities',
  'PIA':              'Several flights per week, depends on route',
  'Air Arabia':       'Daily flights via Sharjah',
  'Qatar Airways':    'Daily flights via Doha hub',
  'Saudia':           'Multiple weekly flights on Saudi routes',
  'Etihad Airways':   'Daily flights via Abu Dhabi',
  'flynas':           'Several flights per week',
  'Kuwait Airways':   'Several flights per week',
  'Oman Air':         'Several flights per week via Muscat',
  'Gulf Air':         'Several weekly flights via Bahrain',
  'Airblue':          'Several flights per week',
  'Serene Air':       'Several flights per week',
  'FlyJinnah':        'Regular flights to Abu Dhabi',
  'Jazeera Airways':  'Several weekly flights',
  'British Airways':  'Daily flights via London Heathrow',
  'Turkish Airlines': 'Daily flights via Istanbul',
  'Air Canada':       'Seasonal flights via Toronto',
  'United Airlines':  'Flights via US hubs',
}

export default async function AirlineRoutePage(
  { params }: { params: Promise<{ route: string; airline: string }> }
) {
  const { route, airline } = await params
  const parsed = parseRouteSlug(route)
  const airlineData = AIRLINE_SLUGS[airline]
  if (!parsed || !airlineData) notFound()

  const { from, to } = parsed
  const airlines = getRouteAirlines(from.code, to.code)
  if (!airlines.includes(airlineData.name)) notFound()

  const intro = getAirlineRouteIntro(route, airline)

  const duration   = getRouteDuration(from.code, to.code)
  const baggage    = getAirlineBaggage(airlineData.name)
  const freq       = AIRLINE_FREQUENCY[airlineData.name] ?? 'Check airline website for schedule'
  const livePrice  = await getLivePrice(from.code, to.code)
  const priceStr   = livePrice ? `PKR ${livePrice.toLocaleString('en-PK')}` : null
  const today      = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  // Other airlines on same route (for comparison links)
  const otherAirlines = airlines.filter(a => a !== airlineData.name)

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        url: `https://www.flightrate.pk/flights/${route}/${airline}`,
        name: `${airlineData.name} ${from.name} to ${to.name} Flights`,
        dateModified: new Date().toISOString(),
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',    item: 'https://www.flightrate.pk' },
            { '@type': 'ListItem', position: 2, name: 'Flights', item: 'https://www.flightrate.pk/flights' },
            { '@type': 'ListItem', position: 3, name: `${from.name} to ${to.name}`, item: `https://www.flightrate.pk/flights/${route}` },
            { '@type': 'ListItem', position: 4, name: airlineData.name, item: `https://www.flightrate.pk/flights/${route}/${airline}` },
          ],
        },
      },
      {
        '@type': 'Product',
        '@id': `https://www.flightrate.pk/flights/${route}/${airline}#product`,
        name: `${airlineData.name} ${from.name} to ${to.name} Flight Ticket`,
        image: { '@type': 'ImageObject', url: 'https://www.flightrate.pk/opengraph-image', width: 1200, height: 630 },
        brand: { '@type': 'Brand', name: airlineData.name },
        offers: livePrice ? {
          '@type': 'Offer',
          priceCurrency: 'PKR',
          price: String(livePrice),
          priceValidUntil: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'FlightRate' },
        } : {
          '@type': 'AggregateOffer',
          priceCurrency: 'PKR',
          lowPrice: '30000',
          highPrice: '180000',
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How much is ${airlineData.name} ${from.name} to ${to.name} ticket price in PKR?`,
            acceptedAnswer: { '@type': 'Answer', text: `${airlineData.name} ${from.name} to ${to.name} fares vary by date and availability. FlightRate tracks ${airlineData.name} prices daily in PKR. Message us on WhatsApp for today's exact ${airlineData.name} fare — we respond in 7 minutes.` },
          },
          {
            '@type': 'Question',
            name: `What is the baggage allowance on ${airlineData.name} ${from.name} to ${to.name}?`,
            acceptedAnswer: { '@type': 'Answer', text: baggage ? `${airlineData.name} economy class allows ${baggage.checkin} check-in baggage and ${baggage.cabin} cabin baggage on the ${from.name}–${to.name} route.` : `Baggage allowance varies by ticket class and booking. Contact ${airlineData.name} or FlightRate on WhatsApp for exact allowance on your booking.` },
          },
          {
            '@type': 'Question',
            name: `How long is the ${airlineData.name} flight from ${from.name} to ${to.name}?`,
            acceptedAnswer: { '@type': 'Answer', text: `${airlineData.name} ${from.name} to ${to.name} direct flights take approximately ${duration}. Connecting flights via ${airlineData.name}'s hub may take longer depending on the layover.` },
          },
          {
            '@type': 'Question',
            name: `How often does ${airlineData.name} fly from ${from.name} to ${to.name}?`,
            acceptedAnswer: { '@type': 'Answer', text: `${freq}. Schedule changes seasonally — check with FlightRate via WhatsApp for current ${airlineData.name} availability on this route.` },
          },
          {
            '@type': 'Question',
            name: `Is ${airlineData.name} the cheapest airline from ${from.name} to ${to.name}?`,
            acceptedAnswer: { '@type': 'Answer', text: `${airlineData.name} is one of ${airlines.length} airlines on ${from.name}–${to.name}. Other options include ${otherAirlines.slice(0,3).join(', ')}. Which is cheapest changes by date — FlightRate compares all fares daily in PKR so you always get the best rate.` },
          },
        ],
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
          <Link href={`/flights/${route}`}>{from.name} to {to.name}</Link><span>›</span>
          <span>{airlineData.name}</span>
        </nav>

        <div className="route-hero">
          <h1 className="route-h1">
            {airlineData.name} {from.name} to {to.name} Ticket Price Today
            {priceStr && (
              <span className="route-live-price"> — from {priceStr}</span>
            )}
          </h1>
          <p className="route-sub">
            {airlineData.name} fares in PKR · Baggage, schedule & booking via WhatsApp
          </p>
          <p className="route-freshness">
            <time dateTime={new Date().toISOString()}>
              ✓ Prices last updated {today}
            </time>
          </p>
          {priceStr && (
            <p className="route-price-note">
              💡 <strong>&ldquo;From&rdquo;</strong> is the lowest live base fare. Your final all-in price
              (taxes · baggage · seat) is confirmed <strong>free on WhatsApp</strong> before you pay —
              no hidden charges, no obligation.
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="route-cta-bar">
          <a
            href={`https://wa.me/923240763099?text=${encodeURIComponent(`Hi FlightRate! I need ${airlineData.name} flights from ${from.name} (${from.code}) to ${to.name} (${to.code}). Please share the best price.`)}`}
            className="route-wa-cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Get {airlineData.name} Price on WhatsApp
          </a>
          <Link href={`/flights/${route}`} className="route-search-btn">
            Compare All Airlines
          </Link>
        </div>

        {/* Airline info */}
        <div className="route-facts">
          <div className="route-fact">
            <span className="rf-icon">⏱</span>
            <span className="rf-label">Flight Time</span>
            <span className="rf-val">{duration}</span>
          </div>
          {baggage && (
            <>
              <div className="route-fact">
                <span className="rf-icon">🧳</span>
                <span className="rf-label">Check-in Bag</span>
                <span className="rf-val">{baggage.checkin}</span>
              </div>
              <div className="route-fact">
                <span className="rf-icon">💼</span>
                <span className="rf-label">Cabin Bag</span>
                <span className="rf-val">{baggage.cabin}</span>
              </div>
            </>
          )}
          <div className="route-fact">
            <span className="rf-icon">🔁</span>
            <span className="rf-label">Frequency</span>
            <span className="rf-val" style={{ fontSize: '0.8rem' }}>{freq}</span>
          </div>
        </div>

        {/* Unique intro for proven-demand routes (SEO depth vs thin template) */}
        {intro && (
          <section className="route-section route-airline-intro">
            <h2>{intro.heading}</h2>
            {intro.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        )}

        {/* Baggage table */}
        {baggage && (
          <section className="route-section">
            <h2>{airlineData.name} Baggage Allowance — {from.name} to {to.name}</h2>
            <div className="baggage-table-wrap">
              <table className="baggage-table">
                <thead><tr><th>Class</th><th>Check-in</th><th>Cabin</th></tr></thead>
                <tbody>
                  <tr><td>Economy</td><td>{baggage.checkin}</td><td>{baggage.cabin}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="route-note">Business class allowances are higher. Confirm on your ticket or with FlightRate via WhatsApp.</p>
          </section>
        )}

        {/* FAQ */}
        <section className="route-section">
          <h2>FAQs — {airlineData.name} {from.name} to {to.name}</h2>
          <div className="route-faqs">
            {[
              { q: `How much is ${airlineData.name} ${from.name} to ${to.name} ticket in PKR?`, a: `${airlineData.name} fares on ${from.name}–${to.name} change daily. FlightRate tracks ${airlineData.name} prices every day in PKR. WhatsApp us for today's exact fare — response in 7 minutes.` },
              { q: `What baggage does ${airlineData.name} allow on ${from.name}–${to.name}?`, a: baggage ? `Economy: ${baggage.checkin} check-in + ${baggage.cabin} cabin. Business class gets more. Confirm your specific ticket terms before travel.` : `Verify baggage on your ${airlineData.name} ticket. Economy typically allows 20–30 kg. FlightRate can confirm the exact allowance when booking.` },
              { q: `Is ${airlineData.name} direct from ${from.name} to ${to.name}?`, a: `${airlineData.name} operates on ${from.name}–${to.name}. Direct or connecting depends on your specific flight. Check with FlightRate on WhatsApp for current route options.` },
              { q: `How do I book ${airlineData.name} ${from.name} to ${to.name} via FlightRate?`, a: `WhatsApp FlightRate at +923240763099. Tell us your travel date and we compare ${airlineData.name} against all other airlines on this route — you get the best available fare confirmed in 7 minutes.` },
            ].map((f, i) => (
              <details key={i} className="route-faq">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Compare other airlines */}
        {otherAirlines.length > 0 && (
          <section className="route-section">
            <h2>Compare Other Airlines — {from.name} to {to.name}</h2>
            <div className="route-related">
              <Link href={`/flights/${route}`} className="route-related-link">
                All airlines on {from.name} → {to.name}
              </Link>
              {otherAirlines.map(a => {
                const s = NAME_TO_SLUG[a]
                return s ? (
                  <Link key={s} href={`/flights/${route}/${s}`} className="route-related-link">
                    {a} — {from.name} → {to.name}
                  </Link>
                ) : null
              })}
            </div>
          </section>
        )}

        {/* Final CTA */}
        <div className="route-final-cta">
          <h3>Book {airlineData.name} {from.name} to {to.name}</h3>
          <p>WhatsApp us — we confirm the exact PKR fare in 7 minutes.</p>
          <a
            href={`https://wa.me/923240763099?text=${encodeURIComponent(`Hi! I want to book ${airlineData.name} from ${from.name} to ${to.name}. Please share today's best price.`)}`}
            className="route-wa-btn"
            target="_blank"
            rel="noopener"
          >
            💬 Book {airlineData.name} via WhatsApp
          </a>
          <Link href={`/flights/${route}`} className="route-search-btn">
            See All Airlines
          </Link>
        </div>
      </div>
    </>
  )
}
