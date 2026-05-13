import { revalidateTag, revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

const INDEXNOW_KEY = 'afca479ff10350d858a67c66f62e8a1e'
const SITE         = 'https://www.flightrate.pk'

// Map scraper route key (KHI-DXB) → all matching page slugs
function routeToSlugs(route: string): string[] {
  const [from, to] = route.split('-').map(c => c.toLowerCase())
  const CITY: Record<string, string> = {
    khi: 'karachi', lhe: 'lahore', isb: 'islamabad', pew: 'peshawar',
    skt: 'sialkot', mux: 'multan', lyp: 'faisalabad', uet: 'quetta',
    dxb: 'dubai', auh: 'abu-dhabi', shj: 'sharjah', doh: 'doha',
    ruh: 'riyadh', jed: 'jeddah', dmm: 'dammam', med: 'madinah',
    kwi: 'kuwait-city', mct: 'muscat', bah: 'bahrain',
    man: 'manchester', yyz: 'toronto', jfk: 'new-york',
  }
  const f = CITY[from] ?? from
  const t = CITY[to]   ?? to
  return [`/flights/${f}-to-${t}`]
}

async function pingIndexNow(urls: string[]) {
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host:        'www.flightrate.pk',
        key:         INDEXNOW_KEY,
        keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
        urlList:     urls.map(u => `${SITE}${u}`),
      }),
    })
  } catch {
    // IndexNow ping is best-effort — don't fail the revalidation
  }
}

// Called by the scraper (GitHub Actions) after each successful save.
// Invalidates ISR cache + pings Bing/Yandex via IndexNow — no redeploy needed.
export async function POST(req: Request) {
  const secret = req.headers.get('x-revalidate-secret')
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let routes: string[] = []
  try {
    const body = await req.json()
    routes = Array.isArray(body.routes) ? body.routes : []
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Invalidate per-route fetch cache — pages regenerate on next request
  for (const route of routes) {
    revalidateTag(`price-${route}`)
  }
  revalidatePath('/', 'page')

  // Ping IndexNow so Bing/Yandex re-crawl updated pages immediately
  const slugs = ['/', ...routes.flatMap(routeToSlugs)]
  await pingIndexNow(slugs)

  return NextResponse.json({
    revalidated: routes.length,
    indexnow:    slugs.length,
    routes,
    ts:          new Date().toISOString(),
  })
}
