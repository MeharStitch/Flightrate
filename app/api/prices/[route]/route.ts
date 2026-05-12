import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 3600 // cache 1 hour

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ route: string }> }
) {
  const { route } = await params
  const [from, to] = route.toUpperCase().split('-')

  if (!from || !to) {
    return NextResponse.json({ error: 'Invalid route format. Use FROM-TO e.g. KHI-DXB' }, { status: 400 })
  }

  try {
    const key = `prices/${from}-${to}.json`
    const { blobs } = await list({ prefix: key })

    if (blobs.length === 0) {
      return NextResponse.json({
        route,
        minPrice:  null,
        flights:   [],
        history:   [],
        scrapedAt: null,
        fresh:     false,
        message:   'No price data yet — scraper will update tonight',
      })
    }

    const res  = await fetch(blobs[0].url, { next: { revalidate: 3600 } })
    const data = await res.json()

    // Mark data as stale if older than 48 hours
    const scrapedAt  = new Date(data.scrapedAt)
    const hoursOld   = (Date.now() - scrapedAt.getTime()) / 3600000
    const fresh      = hoursOld < 48

    return NextResponse.json({
      ...data,
      fresh,
      hoursOld: Math.round(hoursOld),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })

  } catch (err) {
    console.error('Price API error:', err)
    return NextResponse.json({ error: 'Failed to load prices' }, { status: 500 })
  }
}
