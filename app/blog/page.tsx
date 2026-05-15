import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pakistan Flight Guides & Tips — Save Money on Every Booking | FlightRate',
  description: 'Expert guides on flying from Pakistan: cheapest months, visa requirements, airline comparisons, baggage tips. All prices in PKR. Updated regularly.',
  alternates: { canonical: 'https://www.flightrate.pk/blog' },
}

const POSTS = [
  {
    slug: 'cheapest-month-to-fly-pakistan-to-dubai',
    title: 'Cheapest Month to Fly from Pakistan to Dubai (2026 Price Data)',
    excerpt: 'Based on 30 days of daily price scraping, we reveal exactly which month offers the lowest Pakistan–Dubai fares — and when to avoid booking.',
    tag: 'Price Guide',
    date: '2026-05-15',
  },
  {
    slug: 'dubai-visa-requirements-pakistan',
    title: 'Dubai Visa Requirements for Pakistani Passport Holders (2026)',
    excerpt: 'Step-by-step guide to getting a UAE tourist or visit visa from Pakistan. Costs, processing time, required documents, and how to apply.',
    tag: 'Visa Guide',
    date: '2026-05-15',
  },
  {
    slug: 'cheapest-airlines-pakistan-gulf',
    title: 'Cheapest Airlines Flying from Pakistan to Gulf Countries (Ranked)',
    excerpt: 'We compare PIA, Emirates, flydubai, Air Arabia, Qatar Airways, Saudia and more across all Gulf routes to find who really offers the best value.',
    tag: 'Airline Guide',
    date: '2026-05-15',
  },
  {
    slug: 'how-to-book-cheap-flights-pakistan',
    title: 'How to Book Cheap Flights from Pakistan: 9 Proven Tips',
    excerpt: 'Exact strategies Pakistani travellers use to save PKR 10,000–30,000 per booking. Includes best booking windows, airline tricks, and WhatsApp booking guide.',
    tag: 'Booking Tips',
    date: '2026-05-15',
  },
]

export default function BlogIndex() {
  return (
    <div className="blog-index">
      <div className="blog-index-inner">
        <nav className="route-breadcrumb">
          <Link href="/">Home</Link><span>›</span><span>Guides</span>
        </nav>
        <h1 className="blog-index-h1">Pakistan Flight Guides</h1>
        <p className="blog-index-sub">Data-driven guides to help you fly smarter from Pakistan — all prices in PKR.</p>
        <div className="blog-grid">
          {POSTS.map(p => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="blog-card">
              <span className="blog-tag">{p.tag}</span>
              <h2 className="blog-card-title">{p.title}</h2>
              <p className="blog-card-excerpt">{p.excerpt}</p>
              <span className="blog-card-cta">Read guide →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
