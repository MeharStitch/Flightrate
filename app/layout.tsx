import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',        // prevent invisible text during font load (CLS fix)
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default:  'Cheap Flights from Pakistan — Compare All Airlines | FlightRate',
    template: '%s | FlightRate',
  },
  description: 'Find cheapest flights from Karachi, Lahore, Islamabad to Dubai, Riyadh, Doha & more. Compare all airlines in PKR. Book via WhatsApp in 7 minutes.',
  keywords: [
    'cheap flights Pakistan', 'Pakistan to Dubai flights', 'Karachi to Dubai flight',
    'Islamabad to Dubai flights', 'Lahore to Riyadh flights', 'Pakistan Gulf flights',
    'PIA flights', 'Emirates Pakistan', 'cheap airline tickets Pakistan',
    'flight booking Pakistan WhatsApp', 'Pakistan Saudi Arabia flights',
    'Karachi Dubai ticket price PKR', 'cheap Pakistan flights PKR',
  ],
  authors: [{ name: 'FlightRate', url: 'https://www.flightrate.pk' }],
  metadataBase: new URL('https://www.flightrate.pk'),
  openGraph: {
    type:        'website',
    siteName:    'FlightRate',
    title:       'Cheap Flights from Pakistan — Compare All Airlines | FlightRate',
    description: 'Compare all airlines. PKR prices. Book via WhatsApp in 7 minutes.',
    url:         'https://www.flightrate.pk',
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'FlightRate — Cheap Flights from Pakistan in PKR' }],
  },
  twitter: {
    card:        'summary',
    title:       'Cheap Flights from Pakistan | FlightRate',
    description: 'Compare fares from Karachi, Lahore, Islamabad to Gulf. Book via WhatsApp.',
  },
  icons: {
    icon:  [{ url: '/icon', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
}

const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.flightrate.pk/#organization',
      name: 'FlightRate',
      url: 'https://www.flightrate.pk',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.flightrate.pk/opengraph-image',
        width: 1200,
        height: 630,
      },
      description: "Pakistan's flight price comparison platform. Compare all airlines in PKR and book via WhatsApp in 7 minutes. No hidden fees.",
      areaServed: 'PK',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['English', 'Urdu'],
      },
      makesOffer: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Flight Price Comparison & Booking',
          description: 'Compare Pakistan to Gulf, UK, and USA flight prices in PKR. Book via WhatsApp.',
        },
      },
      sameAs: [
        'https://wa.me/923240763099',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://www.flightrate.pk/#website',
      url: 'https://www.flightrate.pk',
      name: 'FlightRate',
      description: 'Compare cheap flights from Pakistan in PKR. Book via WhatsApp in 7 minutes.',
      publisher: { '@id': 'https://www.flightrate.pk/#organization' },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://www.flightrate.pk/search?from={from}&to={to}',
        },
        'query-input': 'required name=from',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        {/* Preconnect to external origins used on every page */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.gstatic.com" />
        {/* wa.me redirect — warms up for the WhatsApp CTA */}
        <link rel="dns-prefetch" href="https://wa.me" />
      </head>
      <body className={plusJakarta.className}>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  )
}
