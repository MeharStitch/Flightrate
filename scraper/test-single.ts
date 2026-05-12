// Quick test — scrape ONE route and print results
import { newContext } from './browser'
import { chromium } from 'playwright'
import { scrapeRoute } from './google-flights'

async function test() {
  console.log('🧪 Testing scraper: KHI → DXB\n')
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] })
  const ctx     = await newContext(browser)
  const page    = await ctx.newPage()

  const flights = await scrapeRoute(page, 'KHI', 'DXB', 'Karachi', 'Dubai')

  await browser.close()

  if (flights.length === 0) {
    console.log('❌ No flights found — proxy or selector issue')
  } else {
    console.log(`✅ Found ${flights.length} flights:\n`)
    flights.forEach(f => {
      console.log(`  ${f.airline} (${f.airlineCode}) — PKR ${f.price.toLocaleString()} — ${f.duration} — ${f.stopInfo}`)
    })
  }
}

test().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
