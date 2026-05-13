import { NextResponse } from 'next/server'

export const runtime  = 'nodejs'
export const revalidate = 3600

// R2 public URL — set in Vercel env vars as R2_PUBLIC_URL
// e.g. https://pub-xxxxxxxx.r2.dev  or  https://prices.flightrate.pk
const R2_PUBLIC = (process.env.R2_PUBLIC_URL ?? '').replace(/\/$/, '')

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ route: string }> }
) {
  const { route } = await params
  const [from, to] = route.toUpperCase().split('-')

  if (!from || !to) {
    return NextResponse.json({ error: 'Invalid route. Use FROM-TO e.g. KHI-DXB' }, { status: 400 })
  }

  if (!R2_PUBLIC) {
    return NextResponse.json({
      route, minPrice: null, flights: [], history: [],
      scrapedAt: null, fresh: false,
      message: 'R2_PUBLIC_URL not configured',
    })
  }

  try {
    const url = `${R2_PUBLIC}/prices/${from}-${to}.json`
    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (res.status === 404 || !res.ok) {
      return NextResponse.json({
        route, minPrice: null, flights: [], history: [],
        scrapedAt: null, fresh: false,
        message: 'No price data yet — scraper will update tonight',
      })
    }

    const data = await res.json()

    const hoursOld = (Date.now() - new Date(data.scrapedAt).getTime()) / 3600000
    const fresh    = hoursOld < 48

    return NextResponse.json({ ...data, fresh, hoursOld: Math.round(hoursOld) }, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })

  } catch (err) {
    console.error('Price API error:', err)
    return NextResponse.json({ error: 'Failed to load prices' }, { status: 500 })
  }
}
