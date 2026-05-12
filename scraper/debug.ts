import { launchBrowser, newContext, randomDelay } from './browser'

async function debug() {
  console.log('🔍 Debug scrape — KHI → DXB\n')
  const browser = await launchBrowser()
  const ctx     = await newContext(browser)
  const page    = await ctx.newPage()

  const url = `https://www.google.com/travel/flights?q=${encodeURIComponent('Flights from Karachi to Dubai')}&hl=en&curr=PKR`
  console.log('Navigating to:', url)

  await page.goto(url, { waitUntil: 'commit', timeout: 60000 })
  await randomDelay(2000, 3000)

  // Handle consent screen
  if (page.url().includes('consent.google.com')) {
    console.log('  → Consent screen detected, scrolling + clicking Reject all...')
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await randomDelay(1000, 2000)

    // Try various button texts
    for (const txt of ['Reject all', 'Reject All', 'Accept all', 'I agree']) {
      const btn = page.locator(`button:has-text("${txt}")`)
      if (await btn.count() > 0) {
        console.log(`  → Clicking "${txt}"`)
        await btn.first().click()
        await randomDelay(3000, 5000)
        break
      }
    }
    console.log('  → After consent URL:', page.url())
  }

  await randomDelay(3000, 5000)

  // Take screenshot
  await page.screenshot({ path: 'scraper/debug-screenshot.png', fullPage: false })
  console.log('Screenshot saved: scraper/debug-screenshot.png')

  // Print page title and URL
  console.log('Title:', await page.title())
  console.log('URL:', page.url())

  // Check for common Google Flights elements
  const checks = [
    '[aria-label*="Pakistani rupee"]',
    '[aria-label*="PKR"]',
    '.YMlIz',
    '.pIav2d',
    '.yR1nGd',
    'li[class]',
    '[data-ved]',
  ]

  for (const sel of checks) {
    const count = await page.locator(sel).count()
    if (count > 0) console.log(`  ✓ Found ${count}× "${sel}"`)
  }

  // Print all text containing PKR
  const pkrText = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    const matches: string[] = []
    let node
    while ((node = walker.nextNode())) {
      if (node.textContent?.includes('PKR') || node.textContent?.includes('₨')) {
        matches.push(node.textContent.trim().slice(0, 80))
      }
    }
    return matches.filter(t => t.length > 2).slice(0, 10)
  })

  console.log('\nPKR text found on page:')
  pkrText.forEach(t => console.log(' ', t))

  await browser.close()
}

debug().catch(err => { console.error('Fatal:', err.message); process.exit(1) })
