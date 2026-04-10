import { NextRequest, NextResponse } from 'next/server'
import {
  toPKR,
  formatDuration,
  formatPKR,
  formatTime,
  buildWhatsAppUrl,
  buildAffiliateUrl,
  searchByCalendar,
  searchDirect,
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

function getMeta(code: string) {
  return AIRLINE_META[code] ?? { name: code, color: '#374151' }
}

const WA_NUMBER = process.env.WA_NUMBER ?? '923240763099'

// ─── Parse ISO 8601 duration → minutes (e.g. "PT3H25M" → 205) ────────────────
function parseDuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!m) return 180
  return (parseInt(m[1] || '0') * 60) + parseInt(m[2] || '0')
}

// ─── Format datetime string → "HH:MM" ────────────────────────────────────────
function fmtTime(iso: string): string {
  if (!iso) return '--:--'
  return iso.slice(11, 16)
}

// ─── Duffel → real airline inventory ─────────────────────────────────────────
async function searchDuffel(
  from: string,
  to: string,
  date: string,
  adults: number,
): Promise<FlightOffer[]> {
  const key = process.env.DUFFEL_API_KEY
  if (!key) throw new Error('DUFFEL_API_KEY not set')

  const passengers = Array.from({ length: adults }, () => ({ type: 'adult' }))

  const res = await fetch(
    'https://api.duffel.com/air/offer_requests?return_offers=true',
    {
      method: 'POST',
      headers: {
        'Authorization':  `Bearer ${key}`,
        'Duffel-Version': 'v2',
        'Content-Type':   'application/json',
        'Accept':         'application/json',
      },
      body: JSON.stringify({
        data: {
          slices: [{ origin: from, destination: to, departure_date: date }],
          passengers,
          cabin_class: 'economy',
        },
      }),
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Duffel ${res.status}: ${body.slice(0, 300)}`)
  }

  const json = await res.json()
  const offers: any[] = json?.data?.offers ?? []

  if (!offers.length) return []

  const results: FlightOffer[] = offers.slice(0, 20).map((offer: any, idx: number) => {
    const slice    = offer.slices?.[0]
    const segments: any[] = slice?.segments ?? []
    const first    = segments[0]
    const last     = segments[segments.length - 1]

    const code     = first?.operating_carrier?.iata_code ?? first?.marketing_carrier?.iata_code ?? ''
    const meta     = getMeta(code)
    const flightNo = `${code} ${first?.operating_carrier_flight_number ?? ''}`
    const stops    = segments.length - 1
    const stopTxt  = stops === 0
      ? 'Non-stop'
      : stops === 1
        ? `1 Stop · ${segments[0]?.destination?.iata_code ?? ''}`
        : `${stops} Stops`

    const durMins  = parseDuration(slice?.duration ?? 'PT3H0M')
    const currency = offer.total_currency ?? 'USD'
    const amount   = parseFloat(offer.total_amount ?? '0')

    // Convert to PKR
    const priceRaw = currency === 'PKR'
      ? Math.round(amount)
      : Math.round(toPKR(amount / adults))   // toPKR converts USD→PKR per person

    const fmtPrice = formatPKR(priceRaw)

    // Baggage from offer passenger data
    const bags = first?.passengers?.[0]?.baggages?.find((b: any) => b.type === 'checked')
    const bagStr = bags
      ? `${bags.quantity}×${bags.quantity > 0 ? '23kg' : 'none'}`
      : (BAGGAGE[code] ?? '23kg')

    return {
      id:           `duffel-${idx}-${offer.id ?? code}`,
      airline:      first?.marketing_carrier?.name ?? meta.name,
      airlineCode:  code,
      airlineColor: meta.color,
      flightNo:     flightNo.trim(),
      dep:          fmtTime(first?.departing_at ?? ''),
      depCode:      from,
      arr:          fmtTime(last?.arriving_at ?? ''),
      arrCode:      to,
      dur:          formatDuration(durMins),
      stops,
      stopTxt,
      bag:          bagStr,
      meal:         MEAL_AIRLINES.has(code),
      price:        fmtPrice,
      priceRaw,
      priceTotal:   formatPKR(priceRaw * adults),
      priceFor:     `for ${adults} adult${adults > 1 ? 's' : ''}`,
      aircraft:     first?.aircraft?.iata_code ?? '',
      fareType:     offer.cabin_class ?? 'Economy',
      affiliateUrl: '',
      waUrl: buildWhatsAppUrl({
        airline:  first?.marketing_carrier?.name ?? meta.name,
        flightNo: flightNo.trim(),
        from, to, date,
        price:    fmtPrice,
        adults,
        waNumber: WA_NUMBER,
      }),
    }
  })

  return results
}

// ─── Travelpayouts fallback ───────────────────────────────────────────────────
async function searchTravelpayoutsFallback(
  from: string,
  to: string,
  date: string,
  adults: number,
): Promise<FlightOffer[]> {
  const marker = process.env.TRAVELPAYOUTS_MARKER

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
  const routeDur = (f: string, t: string) =>
    ROUTE_DURATION[`${f}-${t}`] ?? ROUTE_DURATION[`${t}-${f}`] ?? 180

  const calcArr = (depISO: string, mins: number) => {
    if (!depISO) return '--:--'
    const d = new Date(depISO)
    d.setMinutes(d.getMinutes() + mins)
    return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  const seenIds = new Set<string>()
  const merged: FlightOffer[] = []

  for (const e of calData) {
    const code  = (e.airline ?? '').toUpperCase()
    const key   = `${code}-${e.flight_number}`
    if (seenIds.has(key)) continue
    seenIds.add(key)
    const priceRaw = toPKR(e.price)
    const durMins  = durationByAirline[code] || routeDur(from, to)
    const meta     = getMeta(code)
    const fmtPrice = formatPKR(priceRaw)
    merged.push({
      id: `tp-cal-${key}-${merged.length}`,
      airline: meta.name, airlineCode: code, airlineColor: meta.color,
      flightNo: `${code}-${e.flight_number}`,
      dep: formatTime(e.departure_at), depCode: from,
      arr: calcArr(e.departure_at, durMins + (e.transfers > 0 ? 60 : 0)), arrCode: to,
      dur: formatDuration(durMins), stops: e.transfers ?? 0,
      stopTxt: e.transfers === 0 ? 'Non-stop' : `${e.transfers} stop${e.transfers > 1 ? 's' : ''}`,
      bag: BAGGAGE[code] ?? '23kg', meal: MEAL_AIRLINES.has(code),
      price: fmtPrice, priceRaw,
      priceTotal: formatPKR(priceRaw * adults),
      priceFor: `for ${adults} adult${adults > 1 ? 's' : ''}`,
      aircraft: '', fareType: 'Economy',
      affiliateUrl: buildAffiliateUrl({ origin: from, destination: to, date, adults, marker }),
      waUrl: buildWhatsAppUrl({ airline: meta.name, flightNo: `${code}-${e.flight_number}`, from, to, date, price: fmtPrice, adults, waNumber: WA_NUMBER }),
    })
  }

  for (const d of dirData) {
    const code = (d.airline ?? '').toUpperCase()
    const key  = `${code}-${d.flight_number}`
    if (seenIds.has(key)) continue
    seenIds.add(key)
    const priceRaw = toPKR(d.price)
    const durMins  = d.duration_to || routeDur(from, to)
    const meta     = getMeta(code)
    const fmtPrice = formatPKR(priceRaw)
    merged.push({
      id: `tp-dir-${key}`,
      airline: meta.name, airlineCode: code, airlineColor: meta.color,
      flightNo: `${code}-${d.flight_number}`,
      dep: formatTime(d.departure_at), depCode: from,
      arr: calcArr(d.departure_at, durMins), arrCode: to,
      dur: formatDuration(durMins), stops: 0, stopTxt: 'Non-stop',
      bag: BAGGAGE[code] ?? '23kg', meal: MEAL_AIRLINES.has(code),
      price: fmtPrice, priceRaw,
      priceTotal: formatPKR(priceRaw * adults),
      priceFor: `for ${adults} adult${adults > 1 ? 's' : ''}`,
      aircraft: '', fareType: 'Economy',
      affiliateUrl: buildAffiliateUrl({ origin: from, destination: to, date, adults, marker }),
      waUrl: buildWhatsAppUrl({ airline: meta.name, flightNo: `${code}-${d.flight_number}`, from, to, date, price: fmtPrice, adults, waNumber: WA_NUMBER }),
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
    const bestIdx = sorted.findIndex((f, i) => i > 0 && f.stops === 0)
    const idx     = bestIdx > 0 ? bestIdx : 1
    sorted[idx].badge    = 'best'
    sorted[idx].badgeTxt = '⭐ Best Pick'
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

  if (!from || !to || !date) {
    return NextResponse.json({ error: 'Missing params: from, to, date' }, { status: 400 })
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Date must be YYYY-MM-DD' }, { status: 400 })
  }

  try {
    let flights: FlightOffer[] = []
    let source = 'duffel'

    // ── 1. Duffel — real bookable inventory ───────────────────────────────────
    if (process.env.DUFFEL_API_KEY) {
      try {
        flights = await searchDuffel(from, to, date, adults)
        console.log(`[search] Duffel returned ${flights.length} flights for ${from}→${to}`)
      } catch (err: any) {
        console.warn('[search] Duffel failed, trying Travelpayouts:', err.message)
      }
    }

    // ── 2. Travelpayouts fallback ─────────────────────────────────────────────
    if (!flights.length && process.env.TRAVELPAYOUTS_TOKEN) {
      source = 'travelpayouts'
      try {
        flights = await searchTravelpayoutsFallback(from, to, date, adults)
        console.log(`[search] Travelpayouts returned ${flights.length} flights for ${from}→${to}`)
      } catch (err: any) {
        console.warn('[search] Travelpayouts also failed:', err.message)
      }
    }

    if (!flights.length) {
      return NextResponse.json({
        flights: [], count: 0,
        searchedAt: new Date().toISOString(),
        route: `${from} → ${to}`, date, adults, source,
        note: 'No flights found for this route and date.',
      })
    }

    const result = applyBadges(flights)

    return NextResponse.json({
      flights: result,
      count:   result.length,
      searchedAt: new Date().toISOString(),
      route:   `${from} → ${to}`,
      date, adults, source,
      ...(source === 'travelpayouts' && { fxRate: USD_TO_PKR }),
    })

  } catch (err: any) {
    console.error('[/api/flights/search]', err.message)
    return NextResponse.json({ error: err.message }, { status: 502 })
  }
}
