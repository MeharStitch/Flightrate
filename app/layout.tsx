import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: {
    default:  'FlightRate — Pakistan\'s Smartest Flight Booking',
    template: '%s — FlightRate',
  },
  description: 'Compare all airlines across Pakistan & Gulf. AI-powered fare prediction. Book in 7 minutes via WhatsApp.',
  keywords: ['cheap flights Pakistan', 'PIA flights', 'Emirates Pakistan', 'ISB DXB', 'Pakistan Gulf flights', 'flight booking WhatsApp'],
  authors: [{ name: 'FlightRate', url: 'https://flightrate.pk' }],
  metadataBase: new URL('https://flightrate.pk'),
  openGraph: {
    type:        'website',
    siteName:    'FlightRate',
    title:       'FlightRate — Pakistan\'s Smartest Flight Booking',
    description: 'Compare all airlines across Pakistan & Gulf. Book in 7 minutes via WhatsApp.',
    url:         'https://flightrate.pk',
  },
  twitter: {
    card:        'summary',
    title:       'FlightRate — Pakistan\'s Smartest Flight Booking',
    description: 'Compare fares. AI fare prediction. Book via WhatsApp in 7 minutes.',
  },
  icons: {
    icon:  [{ url: '/icon', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-icon', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={plusJakarta.className}>{children}</body>
    </html>
  )
}
