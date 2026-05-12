import { revalidateTag, revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

// Called by the scraper (GitHub Actions) after each successful save.
// Immediately invalidates cached pages so users always see fresh prices —
// no redeploy needed, no waiting for the 1-hour ISR window.
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

  // Also revalidate the home page (shows popular route prices)
  revalidatePath('/', 'page')

  return NextResponse.json({
    revalidated: routes.length,
    routes,
    ts: new Date().toISOString(),
  })
}
