import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use | FlightRate',
  description: 'FlightRate terms of use — rules and conditions for using our flight search and booking service.',
  alternates: { canonical: 'https://www.flightrate.pk/terms' },
}

export default function Terms() {
  return (
    <div className="legal-page">
      <nav className="route-breadcrumb">
        <Link href="/">Home</Link><span>›</span>
        <span>Terms of Use</span>
      </nav>

      <h1>Terms of Use</h1>
      <p className="legal-updated">Last updated: May 2026</p>

      <section>
        <h2>1. Acceptance of Terms</h2>
        <p>By using FlightRate (<strong>flightrate.pk</strong>), you agree to these Terms of Use. If you do not agree, please do not use our service.</p>
      </section>

      <section>
        <h2>2. Service Description</h2>
        <p>FlightRate is a flight fare comparison and booking assistance platform. We display flight prices from third-party sources and connect users with our human booking agents via WhatsApp. We are <strong>not</strong> an airline or a licensed travel agent — we facilitate the booking process.</p>
      </section>

      <section>
        <h2>3. Price Accuracy</h2>
        <ul>
          <li>All fares displayed on FlightRate are sourced from third-party flight data providers and are <strong>estimates only</strong></li>
          <li>Prices include an estimated tax and fee buffer but may not reflect the final ticketed price</li>
          <li>Fares are subject to availability and can change at any time without notice</li>
          <li><strong>Always confirm the exact price with our WhatsApp agent before making any payment</strong></li>
        </ul>
      </section>

      <section>
        <h2>4. Booking Process</h2>
        <ul>
          <li>FlightRate facilitates bookings via WhatsApp with human agents</li>
          <li>A booking is only confirmed once the agent provides written confirmation and payment is received</li>
          <li>FlightRate is not responsible for airline schedule changes, cancellations, or delays</li>
          <li>Refund and cancellation policies are governed by the respective airline&apos;s terms</li>
        </ul>
      </section>

      <section>
        <h2>5. User Responsibilities</h2>
        <ul>
          <li>Provide accurate passenger information when booking</li>
          <li>Ensure your travel documents (passport, visa) are valid for your destination</li>
          <li>Verify all booking details before confirming payment</li>
          <li>Do not use this service for any unlawful purpose</li>
        </ul>
      </section>

      <section>
        <h2>6. Limitation of Liability</h2>
        <p>FlightRate provides flight information on an &quot;as is&quot; basis. We are not liable for:</p>
        <ul>
          <li>Inaccurate or outdated flight prices from third-party sources</li>
          <li>Airline cancellations, delays, or changes</li>
          <li>Any losses arising from reliance on information displayed on our platform</li>
        </ul>
      </section>

      <section>
        <h2>7. Intellectual Property</h2>
        <p>All content on FlightRate, including design, logos, and text, is the property of FlightRate. You may not reproduce or distribute our content without written permission.</p>
      </section>

      <section>
        <h2>8. Changes to Terms</h2>
        <p>We reserve the right to update these terms at any time. Continued use of FlightRate after changes constitutes acceptance of the updated terms.</p>
      </section>

      <section>
        <h2>9. Governing Law</h2>
        <p>These terms are governed by the laws of Pakistan. Any disputes shall be subject to the jurisdiction of courts in Pakistan.</p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>Questions about these terms? Contact us on WhatsApp: <a href="https://wa.me/923240763099">+92 324 076 3099</a></p>
      </section>
    </div>
  )
}
