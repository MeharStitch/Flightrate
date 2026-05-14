import type { MetadataRoute } from 'next'
import { getForwardRoutes, getReverseRoutes, getDiasporaRoutes, getReverseDiasporaRoutes } from '@/lib/routes'

const BASE = 'https://www.flightrate.pk'

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
    { url: `${BASE}/privacy-policy`,     lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/terms`,              lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
  ]

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

  return [...staticPages, ...forwardPages, ...diasporaPages, ...reverseDiasporaPages, ...reversePages]
}
