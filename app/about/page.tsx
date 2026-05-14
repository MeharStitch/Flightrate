import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'About FlightRate — Pakistan Flight Price Comparison',
  description: 'FlightRate compares flight prices from Karachi, Lahore, Islamabad to Dubai, Riyadh, London & more. See live PKR fares and book via WhatsApp in 7 minutes.',
  alternates: { canonical: 'https://www.flightrate.pk/about' },
}

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: 'https://www.flightrate.pk/about',
  name: 'About FlightRate',
  description: 'Pakistan flight price comparison — live PKR fares, book via WhatsApp.',
  publisher: { '@id': 'https://www.flightrate.pk/#organization' },
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <main className="about-page">

        <div className="about-hero">
          <div className="about-label">About Us</div>
          <h1>Pakistan's Flight Price Comparison Platform</h1>
          <p className="about-lead">
            FlightRate scrapes live prices from Google Flights every day — covering 150+ routes from every major Pakistani city to the Gulf, UK, and North America — and displays them in PKR so you know exactly what you're paying before you pick up the phone.
          </p>
        </div>

        <div className="about-grid">

          <section className="about-card">
            <div className="about-card-icon">✈️</div>
            <h2>What We Do</h2>
            <p>
              We compare flights from <strong>Karachi, Lahore, Islamabad, Peshawar, Sialkot, Multan, Faisalabad and Quetta</strong> to destinations across the Gulf, UK, Canada, USA, and Europe. Every price on FlightRate is scraped directly from Google Flights — no estimates, no guesses.
            </p>
            <p>
              Our scraper runs <strong>daily at 2 AM PKT</strong> and stores the lowest available fare for each route. Top routes are refreshed three times a day so the data is always fresh.
            </p>
          </section>

          <section className="about-card">
            <div className="about-card-icon">💬</div>
            <h2>How Booking Works</h2>
            <ol className="about-steps">
              <li><strong>Search your route</strong> — pick your cities, date, and class</li>
              <li><strong>Compare fares</strong> — see all airlines with live PKR prices</li>
              <li><strong>Click "Book via WhatsApp"</strong> — your search details are sent automatically</li>
              <li><strong>Agent confirms in 7 minutes</strong> — exact price, baggage, seat availability</li>
              <li><strong>Pay and fly</strong> — no hidden fees, no online payment risk</li>
            </ol>
          </section>

          <section className="about-card">
            <div className="about-card-icon">📊</div>
            <h2>Our Price Data</h2>
            <p>
              Prices are scraped from Google Flights via automated browser sessions using Playwright. We store <strong>30 days of price history</strong> per route, enabling trend analysis and "best time to book" insights.
            </p>
            <p>
              All fares shown include an estimated tax buffer. The exact final price is always confirmed by our agent on WhatsApp before payment — we never charge more than quoted.
            </p>
          </section>

          <section className="about-card">
            <div className="about-card-icon">🌍</div>
            <h2>Routes We Cover</h2>
            <p>
              Over <strong>150 routes</strong> across three markets:
            </p>
            <ul className="about-list">
              <li><strong>Pakistan → Gulf</strong> — Dubai, Abu Dhabi, Sharjah, Doha, Riyadh, Jeddah, Dammam, Madinah, Kuwait City, Muscat, Bahrain</li>
              <li><strong>Pakistan → UK</strong> — London Heathrow, Manchester, Birmingham</li>
              <li><strong>Pakistan → North America</strong> — Toronto, New York, Chicago</li>
              <li><strong>Gulf → Pakistan</strong> — Return legs for expats flying home</li>
            </ul>
          </section>

          <section className="about-card">
            <div className="about-card-icon">🤝</div>
            <h2>Why WhatsApp?</h2>
            <p>
              Pakistani travelers trust WhatsApp. Our agents are available to answer questions, hold seats, and process bookings quickly — something no automated booking engine can match. We handle group bookings, last-minute changes, and Umrah packages the same way.
            </p>
          </section>

          <section className="about-card">
            <div className="about-card-icon">📞</div>
            <h2>Contact Us</h2>
            <p>
              <strong>WhatsApp:</strong> <a href="https://wa.me/923240763099" target="_blank" rel="noopener noreferrer">+92 324 076 3099</a>
            </p>
            <p>
              <strong>Website:</strong> <a href="https://www.flightrate.pk">www.flightrate.pk</a>
            </p>
            <p style={{ marginTop: '12px' }}>
              Available 7 days a week · Response within 7 minutes during business hours
            </p>
          </section>

        </div>

        <div className="about-cta">
          <h2>Ready to find your cheapest flight?</h2>
          <p>Compare live PKR prices across all airlines — no sign-up required.</p>
          <div className="about-cta-btns">
            <Link href="/search" className="about-btn-primary">Search Flights Now</Link>
            <a href="https://wa.me/923240763099" className="about-btn-wa" target="_blank" rel="noopener noreferrer">
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
