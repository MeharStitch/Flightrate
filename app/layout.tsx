import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import WhatsAppFloat from '@/components/WhatsAppFloat'
import './globals.css'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
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
    'Karachi Dubai ticket price PKR', 'سستی پروازیں پاکستان',
  ],
  authors: [{ name: 'FlightRate', url: 'https://www.flightrate.pk' }],
  metadataBase: new URL('https://www.flightrate.pk'),
  openGraph: {
    type:        'website',
    siteName:    'FlightRate',
    title:       'Cheap Flights from Pakistan — Compare All Airlines | FlightRate',
    description: 'Compare all airlines. PKR prices. Book via WhatsApp in 7 minutes.',
    url:         'https://www.flightrate.pk',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={plusJakarta.className}>
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  )
}
