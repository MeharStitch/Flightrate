/**
 * Direct R2 price fetcher — used by Server Components.
 *
 * Why this lib exists: route pages used to fetch `/api/prices/[route]` on their
 * own domain, which means one Vercel function calls another Vercel function
 * which then calls R2. That extra hop added ~600ms to TTFB. This helper hits
 * R2 directly from the page render, cutting one full round trip.
 */

const R2_PUBLIC = (process.env.R2_PUBLIC_URL ?? '').replace(/\/$/, '')

export interface FlightRow {
  airline:    string
  price:      number
  duration?:  number
  stops?:     number
  departure?: string
  arrival?:   string
}

export interface PriceData {
  route:     string
  minPrice:  number | null
  flights:   FlightRow[]
  history:   { date: string; minPrice: number }[]
  scrapedAt: string | null
  fresh:     boolean
  hoursOld:  number | null
}

export async function fetchPriceData(fromCode: string, toCode: string): Promise<PriceData | null> {
  if (!R2_PUBLIC) return null
  try {
    const url = `${R2_PUBLIC}/prices/${fromCode}-${toCode}.json`
    const res = await fetch(url, {
      next: { revalidate: 3600, tags: [`price-${fromCode}-${toCode}`] },
    })
    if (!res.ok) return null
    const data = await res.json()

    const hoursOld = data.scrapedAt
      ? Math.round((Date.now() - new Date(data.scrapedAt).getTime()) / 3600000)
      : null
    const fresh = hoursOld !== null && hoursOld < 48

    return { ...data, fresh, hoursOld } as PriceData
  } catch {
    return null
  }
}
