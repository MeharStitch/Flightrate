import { put, list, head } from '@vercel/blob'
import type { RouteData } from './google-flights'

const MAX_HISTORY_DAYS = 30

// Save route price data to Vercel Blob
export async function saveRouteData(data: RouteData): Promise<void> {
  const key = `prices/${data.fromCode}-${data.toCode}.json`

  // Load existing data to preserve history
  const existing = await loadRouteData(data.fromCode, data.toCode)

  // Build rolling 30-day history
  const today = new Date().toISOString().split('T')[0]
  const history = existing?.history || []

  // Add today's price if not already recorded
  const todayEntry = { date: today, minPrice: data.minPrice }
  const historyUpdated = [
    todayEntry,
    ...history.filter(h => h.date !== today),
  ].slice(0, MAX_HISTORY_DAYS)

  const payload: RouteData = {
    ...data,
    history: historyUpdated,
  }

  await put(key, JSON.stringify(payload), {
    access:          'public',
    contentType:     'application/json',
    addRandomSuffix: false,
  })

  console.log(`  ✓ Saved ${data.fromCode}-${data.toCode}: PKR ${data.minPrice.toLocaleString()}`)
}

// Load existing route data from Vercel Blob
export async function loadRouteData(from: string, to: string): Promise<RouteData | null> {
  try {
    const key = `prices/${from}-${to}.json`
    const { blobs } = await list({ prefix: key })
    if (blobs.length === 0) return null

    const res = await fetch(blobs[0].url)
    if (!res.ok) return null
    return await res.json() as RouteData
  } catch {
    return null
  }
}

// Save scrape run summary (for monitoring)
export async function saveSummary(summary: {
  runAt:     string
  total:     number
  success:   number
  failed:    number
  routes:    string[]
}): Promise<void> {
  await put('scrape-summary.json', JSON.stringify(summary), {
    access:          'public',
    contentType:     'application/json',
    addRandomSuffix: false,
  })
}
