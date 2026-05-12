/**
 * FlightRate Price Scraper
 * Scrapes Google Flights for all routes and stores in Vercel Blob.
 *
 * Usage:
 *   npx ts-node scraper/index.ts          — full run (all routes)
 *   npx ts-node scraper/index.ts top      — tier 1 routes only
 */

import { launchBrowser, newContext, randomDelay } from './browser'
import { scrapeRoute }                            from './google-flights'
import { saveRouteData, saveSummary }             from './storage'
import { getRoutesForRun, type ScrapeRoute }      from './routes'

const MAX_RETRIES    = 3
const DELAY_BETWEEN  = { min: 8000, max: 20000 }  // ms between routes
const ROTATE_BROWSER = 8                            // new browser every N routes

async function scrapeWithRetry(
  route: ScrapeRoute,
  retries = MAX_RETRIES
): Promise<{ minPrice: number; flights: Awaited<ReturnType<typeof scrapeRoute>> } | null> {

  for (let attempt = 1; attempt <= retries; attempt++) {
    let browser
    try {
      browser  = await launchBrowser()
      const ctx  = await newContext(browser)
      const page = await ctx.newPage()

      console.log(`  → Attempt ${attempt}/${retries}: ${route.from}-${route.to}`)

      const flights = await scrapeRoute(page, route.from, route.to, route.fromCity, route.toCity)

      await browser.close()

      if (flights.length === 0) {
        console.log(`  ⚠ No results for ${route.from}-${route.to} (attempt ${attempt})`)
        if (attempt < retries) {
          await randomDelay(5000, 12000)
          continue
        }
        return null
      }

      const prices   = flights.map(f => f.price).filter(p => p > 0)
      const minPrice = Math.min(...prices)
      return { minPrice, flights }

    } catch (err) {
      console.error(`  ✗ Error on ${route.from}-${route.to} attempt ${attempt}:`, (err as Error).message)
      try { await browser?.close() } catch { /* ignore */ }
      if (attempt < retries) await randomDelay(8000, 20000)
    }
  }
  return null
}

async function main() {
  const runType  = process.argv[2] === 'top' ? 'top' : 'full'
  const routes   = getRoutesForRun(runType)
  const runAt    = new Date().toISOString()

  console.log(`\n🛫 FlightRate Scraper — ${runType.toUpperCase()} RUN`)
  console.log(`   Routes: ${routes.length} | Started: ${runAt}\n`)

  let success = 0
  let failed  = 0
  const successRoutes: string[] = []
  let browser

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i]
    console.log(`\n[${i + 1}/${routes.length}] ${route.from} → ${route.to} (${route.fromCity} → ${route.toCity})`)

    // Rotate browser every N routes to refresh proxy session
    if (i % ROTATE_BROWSER === 0 && i > 0) {
      console.log('  ↻ Rotating browser session...')
      await randomDelay(3000, 6000)
    }

    const result = await scrapeWithRetry(route)

    if (result && result.flights.length > 0) {
      await saveRouteData({
        route:     `${route.from}-${route.to}`,
        fromCode:  route.from,
        toCode:    route.to,
        fromCity:  route.fromCity,
        toCity:    route.toCity,
        minPrice:  result.minPrice,
        currency:  'PKR',
        flights:   result.flights.slice(0, 6), // top 6 flights
        scrapedAt: new Date().toISOString(),
        history:   [], // storage.ts fills this from existing data
      })
      success++
      successRoutes.push(`${route.from}-${route.to}`)
    } else {
      console.log(`  ✗ FAILED: ${route.from}-${route.to} — will use cached data`)
      failed++
    }

    // Human-like delay between routes
    if (i < routes.length - 1) {
      const delay = Math.floor(Math.random() * (DELAY_BETWEEN.max - DELAY_BETWEEN.min) + DELAY_BETWEEN.min)
      console.log(`  ⏳ Waiting ${(delay / 1000).toFixed(1)}s before next route...`)
      await randomDelay(delay, delay + 2000)
    }
  }

  // Save run summary
  await saveSummary({ runAt, total: routes.length, success, failed, routes: successRoutes })

  console.log(`\n✅ Scrape complete!`)
  console.log(`   Success: ${success}/${routes.length}`)
  console.log(`   Failed:  ${failed}/${routes.length}`)
  console.log(`   Time:    ${((Date.now() - new Date(runAt).getTime()) / 60000).toFixed(1)} min\n`)

  process.exit(failed > routes.length * 0.5 ? 1 : 0) // exit 1 if >50% failed
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
