import { NextRequest, NextResponse } from 'next/server'
import {
  searchByCalendar,
  searchDirect,
  toPKR,
  formatDuration,
  formatTime,
  formatPKR,
  buildAffiliateUrl,
  buildWhatsAppUrl,
  USD_TO_PKR,
  type TPCalendarEntry,
  type TPDirectEntry,
} from '@/lib/travelpayouts'
import type { FlightOffer } from '@/types/flight'

// ─── Airline meta ─────────────────────────────────────────────────────────────
const AIRLINE_META: Record<string, { name: string; color: string }> = {
  PK:  { name: 'PIA Pakistan International', color: '#006E3F' },
  FZ:  { name: 'flydubai',                   color: '#E31E37' },
  EK:  { name: 'Emirates',                   color: '#C8102E' },
  G9:  { name: 'Air Arabia',                 color: '#FF6B35' },
  QR:  { name: 'Qatar Airways',              color: '#5C0632' },
  WZ:  { name: 'Serene Air',                 color: '#1B75BB' },
  '9P':{ name: 'FlyJinnah',                  color: '#E63329' },
  WY:  { name: 'Oman Air',                   color: '#CC0001' },
  GF:  { name: 'Gulf Air',                   color: '#8B1538' },
  KU:  { name: 'Kuwait Airways',             color: '#1F5E9A' },
  SV:  { name: 'Saudia',                     color: '#006400' },
  XY:  { name: 'flynas',                     color: '#1C1C1C' },
  PA:  { name: 'airblue',                    color: '#0055A5' },
  EY:  { name: 'Etihad Airways',             color: '#A07840' },
  TK:  { name: 'Turkish Airlines',           color: '#E81932' },
  AI:  { name: 'Air India',                  color: '#F26522' },
  UL:  { name: 'SriLankan Airlines',         color: '#0072BC' },
  BG:  { name: 'Biman Bangladesh',           color: '#006A4E' },
  '6E':{ name: 'IndiGo',                     color: '#1A1D6B' },
}

const BAGGAGE: Record<string, string> = {
  PK: '23kg', EK: '30kg', FZ: '20kg', G9: '20kg',
  QR: '30kg', WY: '23kg', GF: '23kg', KU: '23kg',
  SV: '23kg', EY: '30kg', PA: '20kg', WZ: '20kg', '9P': '20kg',
}

const MEAL_AIRLINES = new Set(['EK','QR','EY','PK','WY','GF','KU','SV','TK','UL','BG'])

const ROUTE_DURATION: Record<string, number> = {
  'ISB-DXB': 155, 'LHE-DXB': 155, 'KHI-DXB': 120,
  'ISB-DMM': 195, 'LHE-DMM': 195, 'KHI-DMM': 165,
  'ISB-RUH': 210, 'LHE-RUH': 210, 'KHI-RUH': 175,
  'ISB-KWI': 195, 'LHE-KWI': 195, 'KHI-KWI': 165,
  'ISB-BAH': 195, 'KHI-BAH': 165,
  'ISB-MCT': 200, 'KHI-MCT': 155,
  'ISB-DOH': 200, 'LHE-DOH': 200, 'KHI-DOH': 155,
  'ISB-AUH': 160, 'KHI-AUH': 125,
}

function getMeta(code: string) {
  return AIRLINE_META[code] ?? { name: code, color: '#374151' }
}

function getRouteDuration(from: string, to: string): number {
  return ROUTE_DURATION[`${from}-${to}`] ?? ROUTE_DURATION[`${to}-${from}`] ?? 180
}

// Extract 2-3 letter IATA airline code from flight number string e.g. "PK 211" → "PK"
function extractAirlineCode(flightNumber: string): string {
  const match = flightNumber.trim().match(/^([A-Z0-9]{2,3})\s*\d+/i)
  return match ? match[1].toUpperCase() : ''
}

const WA_NUMBER = process.env.WA_NUMBER ?? '923001234567'

// ─── SerpAPI → Google Flights ─────────────────────────────────────────────────
async function searchSerpAPI(
  from: string,
  to: string,
  date: string,
  adults: number,
  marker?: string | null,
): Promise<FlightOffer[]> {
  const key = process.env.SERPAPI_KEY
  if (!key) throw new Error('SERPAPI_KEY not set')

  const url = new URL('https://serpapi.com/search.json')
  url.searchParams.set('engine',        'google_flights')
  url.searchParams.set('departure_id',  from)
  url.searchParams.set('arrival_id',    to)
  url.searchParams.set('outbound_date', date)
  url.searchParams.set('currency',      'PKR')
  url.searchParams.set('hl',            'en')
  url.searchParams.set('gl',            'pk')
  url.searchParams.set('adults',        String(adults))
  url.searchParams.set('type',          '2')   // 2 = one-way
  url.searchParams.set('api_key',       key)

  const res = await fetch(url.toString(), {
    next: { revalidate: 300 },   // cache response for 5 minutes
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`SerpAPI ${res.status}: ${body.slice(0, 200)}`)
  }

  const data = await res.json()

  if (data.error) throw new Error(`SerpAPI error: ${data.error}`)

  // Combine best_flights + other_flights
  const raw: any[] = [
    ...(data.best_flights  ?? []),
    ...(data.other_flights ?? []),
  ]

  if (!raw.length) return []

  const offers: FlightOffer[] = raw.map((item: any, idx: number) => {
    const legs     = item.flights as any[]
    const firstLeg = legs[0]
    const lastLeg  = legs[legs.length - 1]

    const flightNo  = firstLeg.flight_number ?? ''
    const code      = extractAirlineCode(flightNo)
    const meta      = getMeta(code)

    // Stops = legs - 1 (each extra leg means one stop)
    const stops  = legs.length - 1
    const stopTxt = stops === 0
      ? 'Non-stop'
      : stops === 1
        ? `1 Stop · ${legs[0].arrival_airport?.id ?? ''}`
        : `${stops} Stops`

    // Times from "YYYY-MM-DD HH:MM" strings
    const depTime = (firstLeg.departure_airport?.time ?? '').split(' ')[1]?.slice(0, 5) || '--:--'
    const arrTime = (lastLeg.arrival_airport?.time ?? '').split(' ')[1]?.slice(0, 5) || '--:--'

    const durMins = item.total_duration ?? getRouteDuration(from, to)
    const priceRaw = Math.round(item.price ?? 0)
    const fmtPrice = formatPKR(priceRaw)

    return {
      id:           `serp-${idx}-${code}-${flightNo.replace(/\s/g, '')}`,
      airline:      firstLeg.airline || meta.name,
      airlineCode:  code,
      airlineColor: meta.color,
      flightNo,
      dep:          depTime,
      depCode:      from,
      arr:          arrTime,
      arrCode:      to,
      dur:          formatDuration(durMins),
      stops,
      stopTxt,
      bag:          BAGGAGE[code] ?? '23kg',
      meal:         MEAL_AIRLINES.has(code),
      price:        fmtPrice,
      priceRaw,
      priceTotal:   formatPKR(priceRaw * adults),
      priceFor:     `for ${adults} adult${adults > 1 ? 's' : ''}`,
      aircraft:     firstLeg.airplane ?? '',
      fareType:     firstLeg.travel_class ?? 'Economy',
      affiliateUrl: buildAffiliateUrl({ origin: from, destination: to, date, adults, marker }),
      waUrl:        buildWhatsAppUrl({
        airline:  firstLeg.airline || meta.name,
        flightNo,
        from, to, date,
        price:    fmtPrice,
        adults,
        waNumber: WA_NUMBER,
      }),
    }
  })

  return offers
}

// ─── Travelpayouts fallback ───────────────────────────────────────────────────
async function searchTravelpayoutsFallback(
  from: string,
  to: string,
  date: string,
  adults: number,
  marker?: string | null,
): Promise<FlightOffer[]> {
  const [calEntries, directEntries] = await Promise.allSettled([
    searchByCalendar({ origin: from, destination: to, date }),
    searchDirect({ origin: from, destination: to, date }),
  ])

  const calData: TPCalendarEntry[] = calEntries.status === 'fulfilled' ? calEntries.value : []
  const dirData: TPDirectEntry[]   = directEntries.status === 'fulfilled' ? directEntries.value : []

  if (!calData.length && !dirData.length) return []

  const durationByAirline: Record<string, number> = {}
  for (const d of dirData) {
    if (d.airline && d.duration_to) durationByAirline[d.airline.toUpperCase()] = d.duration_to
  }

  const seenIds = new Set<string>()
  const merged: FlightOffer[] = []

  for (const e of calData) {
    const code  = (e.airline ?? '').toUpperCase()
    const key   = `${code}-${e.flight_number}`
    if (seenIds.has(key)) continue
    seenIds.add(key)

    const priceRaw = toPKR(e.price)
    const durMins  = durationByAirline[code] || getRouteDuration(from, to)
    const meta     = getMeta(code)
    const fmtPrice = formatPKR(priceRaw)

    merged.push({
      id:           `tp-cal-${key}-${merged.length}`,
      airline:      meta.name,
      airlineCode:  code,
      airlineColor: meta.color,
      flightNo:     `${code}-${e.flight_number}`,
      dep:          formatTime(e.departure_at),
      depCode:      from,
      arr:          calcArrTime(e.departure_at, durMins + (e.transfers > 0 ? 60 : 0)),
      arrCode:      to,
      dur:          formatDuration(durMins),
      stops:        e.transfers ?? 0,
      stopTxt:      e.transfers === 0 ? 'Non-stop' : `${e.transfers} stop${e.transfers > 1 ? 's' : ''}`,
      bag:          BAGGAGE[code] ?? '23kg',
      meal:         MEAL_AIRLINES.has(code),
      price:        fmtPrice,
      priceRaw,
      priceTotal:   formatPKR(priceRaw * adults),
      priceFor:     `for ${adults} adult${adults > 1 ? 's' : ''}`,
      aircraft:     '',
      fareType:     'Economy',
      affiliateUrl: buildAffiliateUrl({ origin: from, destination: to, date, adults, marker }),
      waUrl:        buildWhatsAppUrl({ airline: meta.name, flightNo: `${code}-${e.flight_number}`, from, to, date, price: fmtPrice, adults, waNumber: WA_NUMBER }),
    })
  }

  for (const d of dirData) {
    const code = (d.airline ?? '').toUpperCase()
    const key  = `${code}-${d.flight_number}`
    if (seenIds.has(key)) continue
    seenIds.add(key)

    const priceRaw = toPKR(d.price)
    const durMins  = d.duration_to || getRouteDuration(from, to)
    const meta     = getMeta(code)
    const fmtPrice = formatPKR(priceRaw)

    merged.push({
      id:           `tp-dir-${key}`,
      airline:      meta.name,
      airlineCode:  code,
      airlineColor: meta.color,
      flightNo:     `${code}-${d.flight_number}`,
      dep:          formatTime(d.departure_at),
      depCode:      from,
      arr:          calcArrTime(d.departure_at, durMins),
      arrCode:      to,
      dur:          formatDuration(durMins),
      stops:        0,
      stopTxt:      'Non-stop',
      bag:          BAGGAGE[code] ?? '23kg',
      meal:         MEAL_AIRLINES.has(code),
      price:        fmtPrice,
      priceRaw,
      priceTotal:   formatPKR(priceRaw * adults),
      priceFor:     `for ${adults} adult${adults > 1 ? 's' : ''}`,
      aircraft:     '',
      fareType:     'Economy',
      affiliateUrl: buildAffiliateUrl({ origin: from, destination: to, date, adults, marker }),
      waUrl:        buildWhatsAppUrl({ airline: meta.name, flightNo: `${code}-${d.flight_number}`, from, to, date, price: fmtPrice, adults, waNumber: WA_NUMBER }),
    })
  }

  return merged
}

// ─── Badge helper ─────────────────────────────────────────────────────────────
function applyBadges(flights: FlightOffer[]): FlightOffer[] {
  if (!flights.length) return flights
  const sorted = [...flights].sort((a, b) => a.priceRaw - b.priceRaw)

  sorted[0].badge    = 'cheap'
  sorted[0].badgeTxt = '💰 Lowest Fare'

  if (sorted.length > 1) {
    const nonStopIdx = sorted.findIndex((f, i) => i > 0 && f.stops === 0)
    const bestIdx    = nonStopIdx > 0 ? nonStopIdx : 1
    sorted[bestIdx].badge    = 'best'
    sorted[bestIdx].badgeTxt = '⭐ Best Pick'
  }

  return sorted
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const sp     = new URL(req.url).searchParams
  const from   = sp.get('from')?.toUpperCase()
  const to     = sp.get('to')?.toUpperCase()
  const date   = sp.get('date')
  const adults = Math.max(1, Math.min(9, parseInt(sp.get('adults') || '1')))
  const marker = process.env.TRAVELPAYOUTS_MARKER

  if (!from || !to || !date) {
    return NextResponse.json({ error: 'Missing params: from, to, date' }, { status: 400 })
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Date must be YYYY-MM-DD' }, { status: 400 })
  }

  try {
    let flights: FlightOffer[] = []
    let source = 'serpapi'

    // ── 1. Try SerpAPI (Google Flights — real-time) ──────────────────────────
    if (process.env.SERPAPI_KEY) {
      try {
        flights = await searchSerpAPI(from, to, date, adults, marker)
        console.log(`[search] SerpAPI returned ${flights.length} flights for ${from}→${to}`)
      } catch (serpErr: any) {
        console.warn('[search] SerpAPI failed, trying Travelpayouts fallback:', serpErr.message)
        flights = []
      }
    }

    // ── 2. Fallback: Travelpayouts (cached prices) ───────────────────────────
    if (!flights.length && process.env.TRAVELPAYOUTS_TOKEN) {
      source = 'travelpayouts'
      try {
        flights = await searchTravelpayoutsFallback(from, to, date, adults, marker)
        console.log(`[search] Travelpayouts returned ${flights.length} flights for ${from}→${to}`)
      } catch (tpErr: any) {
        console.warn('[search] Travelpayouts also failed:', tpErr.message)
      }
    }

    if (!flights.length) {
      return NextResponse.json({
        flights: [], count: 0,
        searchedAt: new Date().toISOString(),
        route: `${from} → ${to}`, date, adults, source,
        note: 'No flights found for this route and date. Try a different date or nearby airport.',
      })
    }

    const result = applyBadges(flights)

    return NextResponse.json({
      flights:    result,
      count:      result.length,
      searchedAt: new Date().toISOString(),
      route:      `${from} → ${to}`,
      date,
      adults,
      source,
      ...(source === 'travelpayouts' && { fxRate: USD_TO_PKR }),
    })

  } catch (err: any) {
    console.error('[/api/flights/search]', err.message)
    return NextResponse.json({ error: err.message }, { status: 502 })
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function calcArrTime(departISO: string, durMins: number): string {
  if (!departISO) return '--:--'
  const d = new Date(departISO)
  d.setMinutes(d.getMinutes() + durMins)
  return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: false })
}
