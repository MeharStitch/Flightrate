import type { MetadataRoute } from 'next'
import fs from 'fs'
import path from 'path'
import { getForwardRoutes, getReverseRoutes, getDiasporaRoutes, getReverseDiasporaRoutes, getAllRoutes, parseRouteSlug, getRouteAirlines } from '@/lib/routes'

const BASE = 'https://www.flightrate.pk'

// Read JSON-based blog posts from disk + old static-page blog slugs
function getBlogSlugs(): string[] {
  const slugs = new Set<string>([
    // Old hardcoded static blog pages (app/blog/<slug>/page.tsx)
    'cheapest-month-to-fly-pakistan-to-dubai',
    'dubai-visa-requirements-pakistan',
    'cheapest-airlines-pakistan-gulf',
    'how-to-book-cheap-flights-pakistan',
  ])
  try {
    const dir = path.join(process.cwd(), 'blog-content')
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.json')) slugs.add(file.replace(/\.json$/, ''))
    }
  } catch {}
  return Array.from(slugs)
}

// Top-traffic forward routes get highest priority
const TOP_ROUTES = new Set([
  'karachi-to-dubai', 'lahore-to-dubai', 'islamabad-to-dubai',
  'karachi-to-riyadh', 'lahore-to-riyadh', 'islamabad-to-riyadh',
  'karachi-to-jeddah', 'lahore-to-jeddah', 'islamabad-to-jeddah',
  'karachi-to-doha', 'lahore-to-doha', 'islamabad-to-doha',
  'peshawar-to-dubai', 'sialkot-to-dubai', 'karachi-to-kuwait-city',
])

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                          lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/flights`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/search`,              lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE}/about`,              lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/flights/cheapest-airlines-pakistan-to-dubai`,   lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE}/flights/cheapest-airlines-pakistan-to-riyadh`,  lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE}/flights/cheapest-airlines-pakistan-to-jeddah`,  lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE}/flights/cheapest-airlines-pakistan-to-doha`,    lastModified: now, changeFrequency: 'daily', priority: 0.82 },
    { url: `${BASE}/flights/cheapest-airlines-pakistan-to-london`,  lastModified: now, changeFrequency: 'weekly', priority: 0.82 },
    { url: `${BASE}/flights/cheapest-airlines-pakistan-to-toronto`,    lastModified: now, changeFrequency: 'weekly', priority: 0.80 },
    { url: `${BASE}/flights/cheapest-airlines-pakistan-to-manchester`, lastModified: now, changeFrequency: 'weekly', priority: 0.82 },
    { url: `${BASE}/flights/cheapest-airlines-pakistan-to-birmingham`, lastModified: now, changeFrequency: 'weekly', priority: 0.80 },
    // Blog index
    { url: `${BASE}/blog`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.75 },
    { url: `${BASE}/privacy-policy`,     lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/terms`,              lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

  // Blog posts (auto-discovered from blog-content/*.json + old static dirs)
  const blogPages: MetadataRoute.Sitemap = getBlogSlugs().map(slug => ({
    url:             `${BASE}/blog/${slug}`,
    lastModified:    now,
    changeFrequency: 'monthly' as const,
    priority:        0.78,
  }))

  // Pakistan → Gulf: highest priority (core product)
  const forwardPages: MetadataRoute.Sitemap = getForwardRoutes().map(r => ({
    url:             `${BASE}/flights/${r.slug}`,
    lastModified:    now,
    changeFrequency: 'daily' as const,
    priority:        TOP_ROUTES.has(r.slug) ? 0.9 : 0.8,
  }))

  // Pakistan → UK/Canada/USA: high value, lower competition
  const diasporaPages: MetadataRoute.Sitemap = getDiasporaRoutes().map(r => ({
    url:             `${BASE}/flights/${r.slug}`,
    lastModified:    now,
    changeFrequency: 'weekly' as const,
    priority:        0.8,
  }))

  // Gulf → Pakistan: expat return market
  const reversePages: MetadataRoute.Sitemap = getReverseRoutes().map(r => ({
    url:             `${BASE}/flights/${r.slug}`,
    lastModified:    now,
    changeFrequency: 'daily' as const,
    priority:        0.7,
  }))

  // UK/Canada/USA → Pakistan: diaspora flying home
  const reverseDiasporaPages: MetadataRoute.Sitemap = getReverseDiasporaRoutes().map(r => ({
    url:             `${BASE}/flights/${r.slug}`,
    lastModified:    now,
    changeFrequency: 'weekly' as const,
    priority:        0.75,
  }))

  // Airline-specific route pages (~848 pages targeting "Emirates Karachi to Dubai" etc)
  const AIRLINE_SLUGS: Record<string, string> = {
    'Emirates': 'emirates', 'flydubai': 'flydubai', 'PIA': 'pia',
    'Air Arabia': 'air-arabia', 'Qatar Airways': 'qatar-airways',
    'Saudia': 'saudia', 'Etihad Airways': 'etihad-airways',
    'flynas': 'flynas', 'Kuwait Airways': 'kuwait-airways',
    'Oman Air': 'oman-air', 'Gulf Air': 'gulf-air',
    'Airblue': 'airblue', 'Serene Air': 'serene-air',
    'FlyJinnah': 'flyjinnah', 'Jazeera Airways': 'jazeera-airways',
    'British Airways': 'british-airways', 'Turkish Airlines': 'turkish-airlines',
    'Air Canada': 'air-canada', 'United Airlines': 'united-airlines',
  }
  const airlinePages: MetadataRoute.Sitemap = []
  for (const r of getAllRoutes()) {
    const parsed = parseRouteSlug(r.slug)
    if (!parsed) continue
    const airlines = getRouteAirlines(parsed.from.code, parsed.to.code)
    for (const airlineName of airlines) {
      const slug = AIRLINE_SLUGS[airlineName]
      if (!slug) continue
      // Low priority — these are long-tail and dilute crawl budget if too high.
      // Better to let Google focus on core route pages first.
      airlinePages.push({
        url:             `${BASE}/flights/${r.slug}/${slug}`,
        lastModified:    now,
        changeFrequency: 'monthly' as const,
        priority:        TOP_ROUTES.has(r.slug) ? 0.4 : 0.3,
      })
    }
  }

  return [...staticPages, ...blogPages, ...forwardPages, ...diasporaPages, ...reverseDiasporaPages, ...reversePages, ...airlinePages]
}
