/**
 * Travelpayouts / Aviasales Flight Data API
 * Docs: https://support.travelpayouts.com/hc/en-us/articles/203956053
 * Free tier — no credit card, 2,000 req/day
 */

const BASE = 'https://api.travelpayouts.com'

// ── Types ────────────────────────────────────────────────────────────────────

export interface TPCalendarEntry {
  origin: string
  destination: string
  airline: string        // IATA 2-letter code e.g. "PK"
  departure_at: string   // ISO datetime "2026-04-07T19:00:00+05:00"
  return_at: string
  expires_at: string
  price: number          // in requested currency (USD)
  flight_number: number
  transfers: number      // stops (0 = non-stop)
}

export interface TPDirectEntry {
  airline: string
  departure_at: string
  return_at: string
  expires_at: string
  price: number
  flight_number: number
  duration: number       // total round-trip minutes
  duration_to: number    // one-way minutes
  duration_back: number
}

export interface TPSearchOptions {
  origin: string        // IATA e.g. "ISB"
  destination: string   // IATA e.g. "DXB"
  date: string          // YYYY-MM-DD
  currency?: string
}

// ── API calls ────────────────────────────────────────────────────────────────

/**
 * Calendar endpoint — cheapest price per day for the month.
 * Returns per-date entries with airline codes, prices, flight numbers, stops.
 */
export async function searchByCalendar(opts: TPSearchOptions): Promise<TPCalendarEntry[]> {
  const token = process.env.TRAVELPAYOUTS_TOKEN
  if (!token) throw new Error('TRAVELPAYOUTS_TOKEN not set in .env.local')

  const { origin, destination, date, currency = 'usd' } = opts
  const month = date.substring(0, 7)   // YYYY-MM

  const params = new URLSearchParams({
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    month,
    currency,
    token,
  })

  const res = await fetch(`${BASE}/v1/prices/calendar?${params}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 1800 },          // cache 30 min
  })

  if (!res.ok) throw new Error(`Travelpayouts calendar ${res.status}`)
  const json = await res.json()
  if (!json.success) throw new Error('Travelpayouts calendar unsuccessful')

  // shape: { data: { "YYYY-MM-DD": entry, ... } }
  return Object.values(json.data ?? {}) as TPCalendarEntry[]
}

/**
 * Direct flights endpoint — non-stop fares with duration.
 */
export async function searchDirect(opts: TPSearchOptions): Promise<TPDirectEntry[]> {
  const token = process.env.TRAVELPAYOUTS_TOKEN
  if (!token) throw new Error('TRAVELPAYOUTS_TOKEN not set in .env.local')

  const { origin, destination, date, currency = 'usd' } = opts
  const month = date.substring(0, 7)

  const params = new URLSearchParams({
    origin: origin.toUpperCase(),
    destination: destination.toUpperCase(),
    depart_date: month,
    currency,
    token,
  })

  const res = await fetch(`${BASE}/v1/prices/direct?${params}`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 1800 },
  })

  if (!res.ok) return []
  const json = await res.json()
  if (!json.success) return []

  // shape: { data: { [DEST]: { "0": entry } } }
  const destData = json.data?.[destination.toUpperCase()] ?? {}
  return Object.values(destData) as TPDirectEntry[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert USD price to PKR */
export const USD_TO_PKR = 278

export function toPKR(usd: number): number {
  return Math.round(usd * USD_TO_PKR)
}

/** Format minutes → "2h 35m" */
export function formatDuration(minutes: number): string {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

/** Format ISO datetime → "08:30" */
export function formatTime(iso: string): string {
  if (!iso) return '--:--'
  return new Date(iso).toLocaleTimeString('en-PK', {
    hour: '2-digit', minute: '2-digit', hour12: false,
  })
}

/** Format PKR number → "PKR 45,200" */
export function formatPKR(amount: number): string {
  return 'PKR ' + Math.round(amount).toLocaleString('en-PK')
}

/**
 * Travelpayouts affiliate marker (public id — appears in every affiliate URL).
 * Verified from the account's generated link (aviasales.tpo.lv → ?marker=716361).
 * NOTE: this is the affiliate MARKER, distinct from the site-embed id (547351).
 * Env var overrides it if the marker ever changes.
 */
export const AFFILIATE_MARKER = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER || '716361'

/**
 * Build Aviasales affiliate deep-link.
 * Format: https://www.aviasales.com/search/{origin}{DDMM}{dest}{adults}?marker=X
 * Aviasales attributes commission via the marker query param on its own domain.
 */
export function buildAffiliateUrl(opts: {
  origin: string
  destination: string
  date: string      // YYYY-MM-DD
  adults: number
  marker?: string
}): string {
  const { origin, destination, date, adults, marker = AFFILIATE_MARKER } = opts
  const d   = new Date(date)
  const dd  = String(d.getDate()).padStart(2, '0')
  const mm  = String(d.getMonth() + 1).padStart(2, '0')
  const seg = `${origin.toUpperCase()}${dd}${mm}${destination.toUpperCase()}${adults}`
  const base = `https://www.aviasales.com/search/${seg}`
  return marker ? `${base}?marker=${marker}` : base
}

/**
 * Route-page "Book Online" affiliate link — one-way Aviasales search deep link
 * departing `daysAhead` days out (default 7), 1 adult. Always returns a link
 * (marker has a verified default), so the button renders on every page.
 */
export function getAffiliateLink(
  fromCode: string,
  toCode: string,
  daysAhead = 7
): string | null {
  if (!AFFILIATE_MARKER) return null
  const dep = new Date()
  dep.setDate(dep.getDate() + daysAhead)
  const date = dep.toISOString().split('T')[0]
  return buildAffiliateUrl({ origin: fromCode, destination: toCode, date, adults: 1, marker: AFFILIATE_MARKER })
}

/**
 * Build WhatsApp pre-filled booking message URL.
 */
export function buildWhatsAppUrl(opts: {
  airline: string
  flightNo: string
  from: string
  to: string
  date: string
  price: string
  adults: number
  waNumber: string   // e.g. "923240763099"
}): string {
  const { airline, flightNo, from, to, date, price, adults, waNumber } = opts
  const msg = [
    `✈️ *Flight Booking Request*`,
    `Flight: ${airline} (${flightNo})`,
    `Route:  ${from} → ${to}`,
    `Date:   ${date}`,
    `Fare:   ${price} / person`,
    `Adults: ${adults}`,
    ``,
    `Please confirm availability & payment options.`,
  ].join('\n')
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`
}
