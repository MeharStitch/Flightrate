import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | FlightRate',
  description: 'FlightRate privacy policy — how we collect, use, and protect your information.',
  alternates: { canonical: 'https://flightrate.pk/privacy-policy' },
}

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <nav className="route-breadcrumb">
        <Link href="/">Home</Link><span>›</span>
        <span>Privacy Policy</span>
      </nav>

      <h1>Privacy Policy</h1>
      <p className="legal-updated">Last updated: May 2026</p>

      <section>
        <h2>1. Who We Are</h2>
        <p>FlightRate (<strong>flightrate.pk</strong>) is a Pakistan-based flight search and booking assistance service. We help users compare flight fares and connect them with our booking agents via WhatsApp.</p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <ul>
          <li><strong>Search data:</strong> Origin, destination, travel dates, and passenger count entered in our search form.</li>
          <li><strong>WhatsApp messages:</strong> When you contact us via WhatsApp, we receive your phone number and message content to assist with your booking.</li>
          <li><strong>Usage data:</strong> Anonymous analytics data such as pages visited and browser type, collected via standard web analytics tools.</li>
        </ul>
      </section>

      <section>
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To search and display flight options relevant to your query</li>
          <li>To assist you with flight bookings via WhatsApp</li>
          <li>To improve our service and website experience</li>
          <li>We do <strong>not</strong> sell your personal data to third parties</li>
        </ul>
      </section>

      <section>
        <h2>4. Data Sharing</h2>
        <p>We share data only with:</p>
        <ul>
          <li><strong>Flight data providers</strong> (SerpAPI, Duffel) — to fetch live flight information based on your search</li>
          <li><strong>WhatsApp (Meta)</strong> — when you initiate contact via WhatsApp button</li>
          <li><strong>Vercel</strong> — our hosting provider, which may log request metadata</li>
        </ul>
      </section>

      <section>
        <h2>5. Cookies</h2>
        <p>FlightRate uses minimal cookies necessary for the website to function. We do not use advertising or tracking cookies. You can disable cookies in your browser settings.</p>
      </section>

      <section>
        <h2>6. Data Retention</h2>
        <p>WhatsApp conversations are retained for up to 90 days for customer service purposes. Search data is not stored on our servers beyond the duration of your session.</p>
      </section>

      <section>
        <h2>7. Your Rights</h2>
        <p>You have the right to request access to, correction of, or deletion of your personal data. Contact us via WhatsApp at <a href="https://wa.me/923240763099">+92 324 076 3099</a>.</p>
      </section>

      <section>
        <h2>8. Security</h2>
        <p>Our website uses HTTPS encryption. We take reasonable measures to protect your data, but no internet transmission is 100% secure.</p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>For privacy-related questions, contact us on WhatsApp: <a href="https://wa.me/923240763099">+92 324 076 3099</a> or email: <a href="mailto:info@flightrate.pk">info@flightrate.pk</a></p>
      </section>
    </div>
  )
}
