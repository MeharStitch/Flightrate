import type { MetadataRoute } from 'next'
import { getAllRoutes } from '@/lib/routes'

const BASE = 'https://flightrate.pk'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = getAllRoutes()
  const now    = new Date()

  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,           lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE}/flights`, lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/search`,  lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
  ]

  const route_pages: MetadataRoute.Sitemap = routes.map(r => ({
    url:             `${BASE}/flights/${r.slug}`,
    lastModified:    now,
    changeFrequency: 'daily' as const,
    priority:        0.8,
  }))

  return [...static_pages, ...route_pages]
}
