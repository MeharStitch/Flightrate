/**
 * /llms.txt — curated site map for LLMs / AI answer engines (AEO).
 * Spec: https://llmstxt.org  — a concise, link-rich markdown brief that
 * helps ChatGPT, Perplexity, Claude, Gemini & Google AI Overviews understand
 * what FlightRate is and cite the right pages.
 *
 * Dynamic so new blog-content/*.json posts appear automatically.
 * Served at https://www.flightrate.pk/llms.txt as text/plain.
 */
import fs from 'fs'
import path from 'path'

export const revalidate = 86400 // rebuild daily

const BASE = 'https://www.flightrate.pk'

// Old static blog pages (app/blog/<slug>/page.tsx) + titles
const STATIC_GUIDES: { slug: string; title: string }[] = [
  { slug: 'cheapest-month-to-fly-pakistan-to-dubai', title: 'Cheapest Month to Fly from Pakistan to Dubai (2026 Price Data)' },
  { slug: 'dubai-visa-requirements-pakistan',        title: 'Dubai Visa Requirements for Pakistani Passport Holders (2026)' },
  { slug: 'cheapest-airlines-pakistan-gulf',         title: 'Cheapest Airlines from Pakistan to Gulf Countries (Ranked)' },
  { slug: 'how-to-book-cheap-flights-pakistan',      title: 'How to Book Cheap Flights from Pakistan: 9 Proven Tips' },
]

function getGuides(): { slug: string; title: string }[] {
  const seen = new Set<string>()
  const out: { slug: string; title: string }[] = []
  // Dynamic JSON posts first (newest content)
  try {
    const dir = path.join(process.cwd(), 'blog-content')
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.json')) continue
      const slug = file.replace(/\.json$/, '')
      try {
        const j = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
        if (seen.has(slug)) continue
        seen.add(slug)
        out.push({ slug, title: j.title ?? slug })
      } catch {}
    }
  } catch {}
  for (const g of STATIC_GUIDES) {
    if (seen.has(g.slug)) continue
    seen.add(g.slug)
    out.push(g)
  }
  return out
}

// Curated highest-intent routes (concise — not the full 1,000-page catalogue)
const TOP_ROUTES: { slug: string; label: string }[] = [
  { slug: 'karachi-to-dubai',       label: 'Karachi → Dubai' },
  { slug: 'lahore-to-dubai',        label: 'Lahore → Dubai' },
  { slug: 'islamabad-to-dubai',     label: 'Islamabad → Dubai' },
  { slug: 'karachi-to-jeddah',      label: 'Karachi → Jeddah (Umrah)' },
  { slug: 'lahore-to-jeddah',       label: 'Lahore → Jeddah (Umrah)' },
  { slug: 'karachi-to-riyadh',      label: 'Karachi → Riyadh' },
  { slug: 'lahore-to-riyadh',       label: 'Lahore → Riyadh' },
  { slug: 'karachi-to-doha',        label: 'Karachi → Doha' },
  { slug: 'islamabad-to-london',    label: 'Islamabad → London' },
  { slug: 'karachi-to-toronto',     label: 'Karachi → Toronto' },
  { slug: 'peshawar-to-dubai',      label: 'Peshawar → Dubai' },
  { slug: 'karachi-to-kuwait-city', label: 'Karachi → Kuwait City' },
]

function build(): string {
  const guides = getGuides()
  const today = new Date().toISOString().slice(0, 10)

  const lines: string[] = []
  lines.push('# FlightRate')
  lines.push('')
  lines.push('> FlightRate (flightrate.pk) is Pakistan\'s flight price comparison platform. It compares fares from all airlines for routes out of Pakistan — Karachi, Lahore, Islamabad, Peshawar, Sialkot, Multan and more — to the Gulf, UK, USA and Canada. All prices are shown in Pakistani Rupees (PKR), updated 3× daily from live scraped data. Users get the cheapest current fare and book via WhatsApp in about 7 minutes with no hidden fees.')
  lines.push('')
  lines.push('Key facts an AI answer can cite:')
  lines.push('- Currency: all prices in PKR, updated three times daily from live data.')
  lines.push('- Coverage: PIA, Emirates, flydubai, Air Arabia, Qatar Airways, Saudia, Etihad, Gulf Air and more.')
  lines.push('- Top destinations: Dubai (DXB), Sharjah (SHJ), Jeddah (JED), Riyadh (RUH), Doha (DOH), London (LHR), Toronto (YYZ).')
  lines.push('- Booking: human agents finalise the cheapest fare over WhatsApp (+92 324 0763099); no booking fees.')
  lines.push('- Specialities: Umrah season fare timing, Gulf labour routes, diaspora UK/Canada routes.')
  lines.push(`- Last updated: ${today}.`)
  lines.push('')

  lines.push('## Live price comparison routes')
  lines.push('')
  for (const r of TOP_ROUTES) {
    lines.push(`- [${r.label}](${BASE}/flights/${r.slug}): live cheapest fare in PKR, airline breakdown, best-time-to-book guidance.`)
  }
  lines.push(`- [All routes & airlines](${BASE}/flights): full catalogue of Pakistan departure routes and per-airline pages.`)
  lines.push('')

  lines.push('## Guides')
  lines.push('')
  for (const g of guides) {
    lines.push(`- [${g.title}](${BASE}/blog/${g.slug})`)
  }
  lines.push(`- [All flight guides](${BASE}/blog)`)
  lines.push('')

  lines.push('## About')
  lines.push('')
  lines.push(`- [About FlightRate](${BASE}/about): who we are and how the price comparison works.`)
  lines.push(`- [Privacy policy](${BASE}/privacy-policy)`)
  lines.push(`- [Terms of service](${BASE}/terms)`)
  lines.push('')

  lines.push('## Optional')
  lines.push('')
  lines.push(`- [XML sitemap](${BASE}/sitemap.xml): complete machine-readable list of all indexable pages.`)
  lines.push('')

  return lines.join('\n')
}

export function GET() {
  return new Response(build(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
