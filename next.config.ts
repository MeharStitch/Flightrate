import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Strip X-Powered-By header
  poweredByHeader: false,

  // Serve compressed assets
  compress: true,

  // Modern image formats — avif first (smallest), webp fallback
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        // Airline logos from Google
        protocol: 'https',
        hostname: 'www.gstatic.com',
        pathname: '/flights/airline_logos/**',
      },
    ],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256],
  },

  // Tree-shake heavy packages — reduces JS bundle sent to browser
  experimental: {
    optimizePackageImports: ['@vercel/blob'],
  },

  // Security + performance headers on every response
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'X-Frame-Options',            value: 'DENY' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Long-lived cache for static assets (hashed filenames — safe to cache forever)
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

export default nextConfig
