import { chromium } from 'playwright-extra'
// @ts-ignore — no types for this plugin
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import type { Browser, BrowserContext, Page } from 'playwright'

chromium.use(StealthPlugin())

const PROXY_HOST = process.env.PROXY_HOST || 'p.webshare.io'
const PROXY_PORT = process.env.PROXY_PORT || '80'
const PROXY_USER = process.env.PROXY_USER || ''
const PROXY_PASS = process.env.PROXY_PASS || ''

// Rotate through country-specific usernames to vary IP pool
const PROXY_USERS = [
  'bflefkme-gb-1',
  'bflefkme-de-3',
  'bflefkme-fr-4',
  'bflefkme-nl-6',
  'bflefkme-au-5',
]

let userIndex = 0
function nextProxyUser(): string {
  // Use env var if set, otherwise rotate through list
  if (PROXY_USER) return PROXY_USER
  const user = PROXY_USERS[userIndex % PROXY_USERS.length]
  userIndex++
  return user
}

// Random delay — human-like timing
export function randomDelay(min = 800, max = 2500): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min) + min)
  return new Promise(r => setTimeout(r, ms))
}

// Random int helper
export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Launch stealth browser — proxy optional (set PROXY_HOST to enable)
export async function launchBrowser(): Promise<Browser> {
  const useProxy = !!PROXY_HOST && !!PROXY_PASS
  const proxyUser = nextProxyUser()

  // Fail loud if a proxy is required but not configured — otherwise the scraper
  // silently runs from the GitHub datacenter IP, which Google Flights blocks,
  // wasting a full ~47-min run before failing. Set REQUIRE_PROXY=1 in CI.
  if (process.env.REQUIRE_PROXY === '1' && !useProxy) {
    throw new Error(
      'REQUIRE_PROXY=1 but proxy not configured. Set PROXY_HOST and PROXY_PASS ' +
      '(residential rotating proxy). Refusing to scrape from the bare runner IP.'
    )
  }

  const launchOpts: Parameters<typeof chromium.launch>[0] = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  }

  if (useProxy) {
    // If no password (gost local bridge), use SOCKS5 without auth
    // If password set, use HTTP proxy directly
    const protocol = PROXY_PASS ? 'http' : 'socks5'
    launchOpts.proxy = {
      server: `${protocol}://${PROXY_HOST}:${PROXY_PORT}`,
      ...(PROXY_PASS ? { username: proxyUser, password: PROXY_PASS } : {}),
    }
  }

  return chromium.launch(launchOpts) as unknown as Browser
}

// Create a realistic browser context
export async function newContext(browser: Browser): Promise<BrowserContext> {
  // Randomise viewport slightly so fingerprint varies
  const width  = randInt(1280, 1440)
  const height = randInt(720, 900)

  const ctx = await browser.newContext({
    viewport:          { width, height },
    userAgent:         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    locale:            'en-GB',
    timezoneId:        'Europe/London',
    geolocation:       { latitude: 51.5074, longitude: -0.1278 },
    permissions:       ['geolocation'],
    extraHTTPHeaders:  {
      'Accept-Language': 'en-GB,en;q=0.9',
      'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    },
  })

  // Block heavy resources — saves ~75% bandwidth
  // Only block after consent page is handled (consent page needs CSS to render buttons)
  await ctx.route('**/*', (route) => {
    const type = route.request().resourceType()
    const url  = route.request().url()

    // Never block on consent domain
    if (route.request().url().includes('consent.google.com')) return route.continue()

    // Block: images, fonts, media, analytics, ads
    if (['image', 'font', 'media'].includes(type)) return route.abort()
    if (url.includes('google-analytics') ||
        url.includes('doubleclick') ||
        url.includes('googletagmanager') ||
        url.includes('googlesyndication')) return route.abort()

    route.continue()
  })

  return ctx
}

// Simulate human mouse movement on page
export async function humanMove(page: Page) {
  const x = randInt(200, 800)
  const y = randInt(200, 500)
  await page.mouse.move(x, y, { steps: randInt(5, 15) })
  await randomDelay(200, 600)
}
