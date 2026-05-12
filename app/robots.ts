import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.flightrate.pk/sitemap.xml',
    host:    'https://www.flightrate.pk',
  }
}
