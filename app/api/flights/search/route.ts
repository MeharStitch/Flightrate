import { NextRequest, NextResponse } from 'next/server'
import { formatDuration, formatPKR, buildWhatsAppUrl, USD_TO_PKR } from '@/lib/travelpayouts'
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

const WA_NUMBER = process.env.WA_NUMBER ?? '923240763099'

function getMeta(code: string) {
  return AIRLINE_META[code] ?? { name: code, color: '#374151' }
}

// ISO 8601 duration → minutes  e.g. "PT3H25M" → 205
function parseDuration(iso: string): number {
  const m = iso?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!m) return 180
  return (parseInt(m[1] || '0') * 60) + parseInt(m[2] || '0')
}

// "2026-04-20T14:30:00" → "14:30"
function fmtTime(iso: string): string {
  if (!iso) return '--:--'
  return iso.slice(11, 16)
}

// Approximate FX rates to PKR
const FX_TO_PKR: Record<string, number> = {
  USD: USD_TO_PKR,          // ~280
  GBP: USD_TO_PKR * 1.27,  // ~355
  EUR: USD_TO_PKR * 1.09,  // ~305
  AED: USD_TO_PKR * 0.272, // ~76
  SAR: USD_TO_PKR * 0.267, // ~75
  QAR: USD_TO_PKR * 0.274, // ~77
  KWD: USD_TO_PKR * 3.25,  // ~910
  PKR: 1,
}

function toPKR(amount: number, currency = 'USD'): number {
  const rate = FX_TO_PKR[currency] ?? USD_TO_PKR
  return Math.round(amount * rate)
}

// ─── Sky Scrapper (RapidAPI) airport lookup cache ────────────────────────────
// Pre-populated for common Pakistan ↔ Gulf routes to avoid extra API calls
const AIRPORT_IDS: Record<string, { skyId: string; entityId: string }> = {
  // Pakistan
  KHI: { skyId: 'KHI', entityId: '95673320' },
  LHE: { skyId: 'LHE', entityId: '95673627' },
  ISB: { skyId: 'ISB', entityId: '95673416' },
  PEW: { skyId: 'PEW', entityId: '95673491' },
  MUX: { skyId: 'MUX', entityId: '95673643' },
  SKT: { skyId: 'SKT', entityId: '95673726' },
  UET: { skyId: 'UET', entityId: '95673556' },
  // UAE
  DXB: { skyId: 'DXB', entityId: '95673506' },
  AUH: { skyId: 'AUH', entityId: '95673461' },
  SHJ: { skyId: 'SHJ', entityId: '95673529' },
  // Gulf
  DOH: { skyId: 'DOH', entityId: '95673505' },
  KWI: { skyId: 'KWI', entityId: '95673584' },
  BAH: { skyId: 'BAH', entityId: '95673466' },
  MCT: { skyId: 'MCT', entityId: '95673618' },
  // Saudi
  RUH: { skyId: 'RUH', entityId: '95673711' },
  JED: { skyId: 'JED', entityId: '95673574' },
  MED: { skyId: 'MED', entityId: '95673613' },
  DMM: { skyId: 'DMM', entityId: '95673507' },
  // Other
  LHR: { skyId: 'LHR', entityId: '95565050' },
  CDG: { skyId: 'CDG', entityId: '95565041' },
  IST: { skyId: 'IST', entityId: '95673564' },
  DEL: { skyId: 'DEL', entityId: '95673476' },
  BOM: { skyId: 'BOM', entityId: '95673470' },
}

// Runtime fallback lookup cache
const runtimeAirportCache = new Map<string, { skyId: string; entityId: string }>()

async function lookupAirport(
  iata: string,
  key: string,
): Promise<{ skyId: string; entityId: string }> {
  // 1. Static cache
  if (AIRPORT_IDS[iata]) return AIRPORT_IDS[iata]
  // 2. Runtime cache
  if (runtimeAirportCache.has(iata)) return runtimeAirportCache.get(iata)!

  // 3. Live lookup
  const res = await fetch(
    `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${iata}&locale=en-US`,
    {
      headers: {
        'x-rapidapi-key':  key,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
      cache: 'no-store',
    },
  )
  const data = await res.json()
  const place = (data?.data ?? [])[0]
  if (!place?.entityId) throw new Error(`Airport not found: ${iata}`)

  const result = { skyId: place.skyId ?? iata, entityId: String(place.entityId) }
  runtimeAirportCache.set(iata, result)
  return result
}

// ─── Sky Scrapper search ──────────────────────────────────────────────────────
async function searchSkyScrapper(
  from: string,
  to: string,
  date: string,
  adults: number,
): Promise<FlightOffer[]> {
  const key = process.env.RAPIDAPI_KEY
  if (!key) throw new Error('RAPIDAPI_KEY not set')

  // Lookup entityIds in parallel
  const [orig, dest] = await Promise.all([
    lookupAirport(from, key),
    lookupAirport(to, key),
  ])

  const url = new URL('https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlightsComplete')
  url.searchParams.set('originSkyId',        orig.skyId)
  url.searchParams.set('destinationSkyId',   dest.skyId)
  url.searchParams.set('originEntityId',     orig.entityId)
  url.searchParams.set('destinationEntityId',dest.entityId)
  url.searchParams.set('date',               date)
  url.searchParams.set('adults',             String(adults))
  url.searchParams.set('currency',           'PKR')
  url.searchParams.set('market',             'en-PK')
  url.searchParams.set('countryCode',        'PK')
  url.searchParams.set('sortBy',             'best')
  url.searchParams.set('cabinClass',         'economy')

  const res = await fetch(url.toString(), {
    headers: {
      'x-rapidapi-key':  key,
      'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`SkyScrapper ${res.status}: ${body.slice(0, 300)}`)
  }

  const json = await res.json()
  const itineraries: any[] = json?.data?.itineraries ?? []
  if (!itineraries.length) return []

  return itineraries.map((item: any, idx: number) => {
    const leg      = item.legs?.[0]
    const segments: any[] = leg?.segments ?? []
    const first    = segments[0]
    const last     = segments[segments.length - 1]

    const carrier  = leg?.carriers?.marketing?.[0] ?? {}
    const code     = carrier.alternateId ?? ''
    const meta     = getMeta(code)
    const flightNo = first
      ? `${first.marketingCarrier?.alternateId ?? code} ${first.flightNumber ?? ''}`.trim()
      : code

    const stops    = leg?.stopCount ?? (segments.length - 1)
    const stopTxt  = stops === 0
      ? 'Non-stop'
      : stops === 1
        ? `1 Stop · ${segments[0]?.destination?.flightPlaceId ?? ''}`
        : `${stops} Stops`

    const durMins  = leg?.durationInMinutes ?? 180
    const priceRaw = Math.round(item.price?.raw ?? 0)
    const fmtPrice = formatPKR(priceRaw)

    const bags     = BAGGAGE[code] ?? '23kg'
    const airlineName = carrier.name || meta.name

    return {
      id:           `sky-${idx}-${code}-${item.id?.slice(-6) ?? idx}`,
      airline:      airlineName,
      airlineCode:  code,
      airlineColor: meta.color,
      flightNo,
      dep:          fmtTime(leg?.departure ?? ''),
      depCode:      from,
      arr:          fmtTime(leg?.arrival ?? ''),
      arrCode:      to,
      dur:          formatDuration(durMins),
      stops,
      stopTxt,
      bag:          bags,
      meal:         MEAL_AIRLINES.has(code),
      price:        fmtPrice,
      priceRaw,
      priceTotal:   formatPKR(priceRaw * adults),
      priceFor:     `for ${adults} adult${adults > 1 ? 's' : ''}`,
      aircraft:     first?.operatingCarrier?.alternateId ?? '',
      fareType:     'economy',
      affiliateUrl: '',
      waUrl: buildWhatsAppUrl({
        airline:  airlineName,
        flightNo, from, to, date,
        price:    fmtPrice,
        adults,
        waNumber: WA_NUMBER,
      }),
    } satisfies FlightOffer
  })
}

// ─── Duffel search (fallback) ─────────────────────────────────────────────────
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
          slices:     [{ origin: from, destination: to, departure_date: date }],
          passengers,
        },
      }),
      cache: 'no-store',
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Duffel ${res.status}: ${body.slice(0, 300)}`)
  }

  const json   = await res.json()
  const offers: any[] = json?.data?.offers ?? []
  if (!offers.length) return []

  // Deduplicate: same airline + dep time + segments = keep cheapest
  const seen = new Map<string, number>()
  const deduped: any[] = []

  for (const offer of offers) {
    const slice    = offer.slices?.[0]
    const first    = slice?.segments?.[0]
    const code     = first?.operating_carrier?.iata_code ?? first?.marketing_carrier?.iata_code ?? ''
    const depTime  = fmtTime(first?.departing_at ?? '')
    const key2     = `${code}-${depTime}-${slice?.segments?.length}`
    const price    = parseFloat(offer.total_amount ?? '0')

    if (!seen.has(key2) || price < (seen.get(key2) ?? Infinity)) {
      seen.set(key2, price)
      const existing = deduped.findIndex(o => {
        const s = o.slices?.[0]?.segments?.[0]
        const c = s?.operating_carrier?.iata_code ?? s?.marketing_carrier?.iata_code ?? ''
        return `${c}-${fmtTime(s?.departing_at ?? '')}-${o.slices?.[0]?.segments?.length}` === key2
      })
      if (existing >= 0) deduped[existing] = offer
      else deduped.push(offer)
    }
  }

  return deduped.map((offer: any, idx: number) => {
    const slice    = offer.slices?.[0]
    const segments: any[] = slice?.segments ?? []
    const first    = segments[0]
    const last     = segments[segments.length - 1]

    const code     = first?.operating_carrier?.iata_code ?? first?.marketing_carrier?.iata_code ?? ''
    const meta     = getMeta(code)
    const flightNo = `${code} ${first?.operating_carrier_flight_number ?? ''}`.trim()
    const stops    = segments.length - 1
    const stopTxt  = stops === 0
      ? 'Non-stop'
      : stops === 1
        ? `1 Stop · ${segments[0]?.destination?.iata_code ?? ''}`
        : `${stops} Stops`

    const durMins  = parseDuration(slice?.duration ?? 'PT3H0M')
    const currency = offer.total_currency ?? 'USD'
    const amount   = parseFloat(offer.total_amount ?? '0')
    const perAdult = amount / adults
    const priceRaw = toPKR(perAdult, currency)
    const fmtPrice = formatPKR(priceRaw)

    const bags     = first?.passengers?.[0]?.baggages?.find((b: any) => b.type === 'checked')
    const bagStr   = bags && bags.quantity > 0 ? `${bags.quantity}×23kg` : (BAGGAGE[code] ?? '23kg')

    const airlineName = first?.marketing_carrier?.name || meta.name

    return {
      id:           `duffel-${idx}-${offer.id?.slice(-6) ?? code}`,
      airline:      airlineName,
      airlineCode:  code,
      airlineColor: meta.color,
      flightNo,
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
      fareType:     offer.cabin_class ?? 'economy',
      affiliateUrl: '',
      waUrl: buildWhatsAppUrl({
        airline: airlineName,
        flightNo,
        from, to, date,
        price:   fmtPrice,
        adults,
        waNumber: WA_NUMBER,
      }),
    } satisfies FlightOffer
  })
}

// ─── Badge helper ─────────────────────────────────────────────────────────────
function applyBadges(flights: FlightOffer[]): FlightOffer[] {
  if (!flights.length) return flights
  const sorted = [...flights].sort((a, b) => a.priceRaw - b.priceRaw)
  sorted[0].badge    = 'cheap'
  sorted[0].badgeTxt = '💰 Lowest Fare'
  if (sorted.length > 1) {
    const idx  = sorted.findIndex((f, i) => i > 0 && f.stops === 0)
    const best = idx > 0 ? idx : 1
    sorted[best].badge    = 'best'
    sorted[best].badgeTxt = '⭐ Best Pick'
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
    let source = 'skyscrapper'

    // 1. Sky Scrapper (RapidAPI) — primary, most results
    try {
      flights = await searchSkyScrapper(from, to, date, adults)
      console.log(`[search] SkyScrapper: ${flights.length} flights for ${from}→${to}`)
    } catch (e: any) {
      console.warn('[search] SkyScrapper failed:', e.message)
    }

    // 2. Duffel — fallback (real bookable inventory)
    if (!flights.length) {
      source = 'duffel'
      try {
        flights = await searchDuffel(from, to, date, adults)
        console.log(`[search] Duffel: ${flights.length} flights for ${from}→${to}`)
      } catch (e: any) {
        console.warn('[search] Duffel failed:', e.message)
      }
    }

    if (!flights.length) {
      return NextResponse.json({
        flights: [], count: 0,
        searchedAt: new Date().toISOString(),
        route: `${from} → ${to}`, date, adults, source,
        note: 'No flights found. Try a different date or route.',
      })
    }

    return NextResponse.json({
      flights:    applyBadges(flights),
      count:      flights.length,
      searchedAt: new Date().toISOString(),
      route:      `${from} → ${to}`,
      date, adults, source,
    })

  } catch (err: any) {
    console.error('[/api/flights/search]', err.message)
    return NextResponse.json({ error: 'Flight search unavailable.' }, { status: 502 })
  }
}
