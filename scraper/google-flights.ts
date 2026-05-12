import type { Page } from 'playwright'
import { randomDelay, humanMove, randInt } from './browser'

export interface FlightResult {
  airline:   string
  airlineCode: string
  price:     number   // raw PKR
  duration:  string   // "3h 15m"
  departure: string   // "06:30"
  arrival:   string   // "09:45"
  stops:     number
  stopInfo:  string   // "Nonstop" | "1 stop in Dubai"
}

export interface RouteData {
  route:      string   // "KHI-DXB"
  fromCode:   string
  toCode:     string
  fromCity:   string
  toCity:     string
  minPrice:   number
  currency:   'PKR'
  flights:    FlightResult[]
  scrapedAt:  string   // ISO timestamp
  history:    { date: string; minPrice: number }[]
}

// Build Google Flights URL — uses pre-filled search params
function buildUrl(from: string, to: string, date: string): string {
  // Date 14 days from now for consistent comparison prices
  const params = new URLSearchParams({
    hl:   'en',
    gl:   'pk',
    curr: 'PKR',
  })
  return `https://www.google.com/travel/flights/search?${params}&tfs=CBwQAhooag0IAxIJL20vMDMzcnBuEg1lbi0ke2RhdGV9En0vbS8wZjJoeXdyGgA%3D`
    // ^ fallback — we use the form-based approach below
}

// Main scrape function for one route
export async function scrapeRoute(
  page: Page,
  from: string,
  to: string,
  fromCity: string,
  toCity: string,
): Promise<FlightResult[]> {

  // Get date 7 days from now (consistent window for prices)
  const searchDate = new Date()
  searchDate.setDate(searchDate.getDate() + 7)
  const dateStr = searchDate.toISOString().split('T')[0] // YYYY-MM-DD

  // Navigate to Google Flights with pre-filled query
  const query = `Flights from ${fromCity} to ${toCity}`
  const url = `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}&hl=en&curr=PKR`

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 })
    await randomDelay(1500, 3000)

    // Handle Google consent screen (shown for EU/UK proxy IPs)
    if (page.url().includes('consent.google.com')) {
      console.log('  → Handling Google consent screen...')
      // Click "Reject all" — minimal cookies, still passes through
      const rejectBtn = page.locator('button:has-text("Reject all"), button:has-text("Reject All")')
      if (await rejectBtn.count() > 0) {
        await rejectBtn.first().click()
        await randomDelay(2000, 3000)
      } else {
        // Fallback: click first button (Accept all)
        const acceptBtn = page.locator('button:has-text("Accept all"), button:has-text("I agree")')
        if (await acceptBtn.count() > 0) {
          await acceptBtn.first().click()
          await randomDelay(2000, 3000)
        }
      }
    }

    await humanMove(page)

    // Wait for flight results to appear
    await page.waitForSelector('[aria-label*="Pakistani rupee"], [aria-label*="PKR"], .YMlIz, .pIav2d', {
      timeout: 20000,
    }).catch(() => null)

    await randomDelay(2000, 3500)

    // Extract via aria-labels — stable, never breaks on class renames
    // Format: "From 80806 Pakistani rupees round trip total. Nonstop flight with Air Arabia.
    //          Leaves X Airport at 10:45 AM on Monday, May 25 and arrives at Y Airport at
    //          12:05 PM on Monday, May 25. Total duration 2 hr 20 min. Select flight"
    const flights = await page.evaluate(() => {
      const results: Array<{
        airline: string; price: number; duration: string
        departure: string; arrival: string; stops: number; stopInfo: string
      }> = []

      // All elements with "Pakistani rupee" or "rupee" in aria-label
      const els = document.querySelectorAll('[aria-label*="Pakistani rupee"], [aria-label*="rupees"]')

      const seen = new Set<string>()
      els.forEach(el => {
        const label = el.getAttribute('aria-label') || ''

        // Only process the full flight description (contains "flight with")
        if (!label.includes('flight with')) return
        if (seen.has(label)) return
        seen.add(label)

        // Price: "From 80806 Pakistani rupees" or "80806 Pakistani rupees"
        const priceMatch = label.match(/(\d[\d,]*)\s*Pakistani rupee/)
        if (!priceMatch) return
        const price = parseInt(priceMatch[1].replace(/,/g, ''), 10)
        if (!price || price < 5000 || price > 2000000) return

        // Trip type
        const isRoundTrip = label.includes('round trip')

        // Stops
        const nonstop = label.includes('Nonstop')
        const stopMatch = label.match(/(\d+)\s*stop/)
        const stops   = nonstop ? 0 : stopMatch ? parseInt(stopMatch[1]) : 1
        const stopInfo = nonstop ? 'Nonstop' : stopMatch ? `${stopMatch[1]} stop` : '1 stop'

        // Airline: "flight with Air Arabia."
        const airlineMatch = label.match(/flight with ([^.]+)\./i)
        const airline = airlineMatch ? airlineMatch[1].trim() : 'Unknown'

        // Duration: "Total duration 2 hr 20 min"
        const durMatch = label.match(/Total duration\s+([^.]+?)(?:\s*\.|$)/i)
        const duration = durMatch ? durMatch[1].trim() : ''

        // Times: "at 10:45 AM on" (first = departure, second = arrival)
        const timeMatches = [...label.matchAll(/at\s+(\d+:\d+\s*[AP]M)\s+on/gi)]
        const departure   = timeMatches[0]?.[1]?.trim() || ''
        const arrival     = timeMatches[1]?.[1]?.trim() || ''

        results.push({ airline, price, duration, departure, arrival, stops, stopInfo })
      })

      return results
    })

    if (flights.length === 0) return await fallbackExtract(page)

    // Dedupe by price+airline, sort cheapest first
    const unique = flights
      .sort((a, b) => a.price - b.price)
      .filter((f, i, arr) => i === arr.findIndex(x => x.airline === f.airline && x.price === f.price))

    return unique.map(f => ({ ...f, airlineCode: getAirlineCode(f.airline) }))

  } catch (err) {
    console.error(`  ✗ Failed to scrape ${from}-${to}:`, (err as Error).message)
    return []
  }
}

// Fallback: extract prices from full page text
async function fallbackExtract(page: Page): Promise<FlightResult[]> {
  try {
    const bodyText = await page.innerText('body')

    // Find PKR price patterns: "PKR 41,200" or "₨41,200"
    const priceMatches = bodyText.match(/(?:PKR|₨)\s*([\d,]+)/g) || []
    const prices = priceMatches
      .map(m => parseInt(m.replace(/[^\d]/g, ''), 10))
      .filter(p => p > 10000 && p < 1000000)
      .slice(0, 5)

    if (prices.length === 0) return []

    return prices.map((price, i) => ({
      airline:     'Various',
      airlineCode: '',
      price,
      duration:    '',
      departure:   '',
      arrival:     '',
      stops:       0,
      stopInfo:    'See Google Flights',
    }))
  } catch {
    return []
  }
}

// Airline name → IATA code mapping
function getAirlineCode(name: string): string {
  const map: Record<string, string> = {
    'Emirates':         'EK',
    'flydubai':         'FZ',
    'FlyDubai':         'FZ',
    'PIA':              'PK',
    'Pakistan International': 'PK',
    'Air Arabia':       'G9',
    'Qatar Airways':    'QR',
    'Saudia':           'SV',
    'Saudi Arabian':    'SV',
    'flynas':           'XY',
    'Kuwait Airways':   'KU',
    'Oman Air':         'WY',
    'Etihad':           'EY',
    'Etihad Airways':   'EY',
    'Airblue':          'PA',
    'Serene Air':       'WZ',
    'FlyJinnah':        '9P',
    'Gulf Air':         'GF',
    'Jazeera':          'J9',
    'IndiGo':           '6E',
    'Turkish Airlines': 'TK',
    'Air Arabia Abu Dhabi': 'G9',
  }
  for (const [key, code] of Object.entries(map)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return code
  }
  return ''
}
