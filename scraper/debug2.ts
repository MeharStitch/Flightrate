// Test with plain Playwright (no playwright-extra) to isolate proxy issue
import { chromium } from 'playwright'

async function debug() {
  console.log('🔍 Plain Playwright proxy test\n')

  const browser = await chromium.launch({
    headless: true,
    // No proxy — test scraper logic first
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  const ctx  = await browser.newContext()
  const page = await ctx.newPage()

  // First check our IP
  try {
    await page.goto('https://ipv4.webshare.io/', { timeout: 20000 })
    const ip = await page.innerText('body')
    console.log('Proxy IP:', ip.trim())
  } catch (e) {
    console.log('IP check failed:', (e as Error).message)
  }

  // Try Google Flights with pre-filled search
  try {
    const searchUrl = `https://www.google.com/travel/flights?q=${encodeURIComponent('Flights from Karachi to Dubai')}&hl=en&curr=PKR`
    await page.goto(searchUrl, { waitUntil: 'networkidle', timeout: 45000 })
    console.log('URL:', page.url())

    // Wait extra for SPA to render
    await new Promise(r => setTimeout(r, 5000))

    await page.screenshot({ path: 'scraper/debug2-screenshot.png', fullPage: true })
    console.log('Screenshot saved')
    console.log('Title:', await page.title())

    // Check what price-related elements exist
    const checks = [
      '[aria-label*="rupee"]',
      '[aria-label*="PKR"]',
      'li[class*="pIav"]',
      '.YMlIz', '.yR1nGd', '.gvkrdb',
      '[data-price]',
      'span[role="text"]',
    ]
    for (const sel of checks) {
      const n = await page.locator(sel).count()
      if (n > 0) console.log(`  ✓ ${n}× "${sel}"`)
    }

    // Print any PKR amounts visible
    const prices = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('*'))
      return all
        .map(el => el.getAttribute('aria-label') || '')
        .filter(t => t.includes('rupee') || t.includes('PKR') || t.includes('₨'))
        .slice(0, 5)
    })
    console.log('\nPrice aria-labels:', prices)

  } catch (e) {
    console.log('Google failed:', (e as Error).message)
    await page.screenshot({ path: 'scraper/debug2-screenshot.png', fullPage: true }).catch(() => {})
  }

  await browser.close()
}

debug().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
