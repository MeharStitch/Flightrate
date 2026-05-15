import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dubai Visa Requirements for Pakistani Passport Holders 2026 | FlightRate',
  description: 'Complete guide: Dubai visa for Pakistanis — types, cost in PKR, required documents, processing time, and how to apply. Updated 2026.',
  keywords: [
    'dubai visa requirements for pakistanis',
    'uae visa pakistan 2026',
    'dubai tourist visa pakistan cost pkr',
    'how to apply dubai visa from pakistan',
    'dubai visa processing time pakistan',
    'uae visit visa pakistan documents',
    'dubai visa fee in pakistani rupees',
  ],
  alternates: { canonical: 'https://www.flightrate.pk/blog/dubai-visa-requirements-pakistan' },
  openGraph: {
    title: 'Dubai Visa for Pakistanis 2026 — Cost, Documents & How to Apply',
    description: 'Everything Pakistani travellers need to know about UAE visa requirements, costs in PKR, and application process.',
    url: 'https://www.flightrate.pk/blog/dubai-visa-requirements-pakistan',
    type: 'article',
  },
}

const VISA_TYPES = [
  { type: '30-Day Tourist Visa',   fee: 'USD 90–120 (~PKR 25,000–33,000)', processing: '2–5 working days', validity: '60 days from issue', stay: '30 days',  notes: 'Most common for short trips' },
  { type: '60-Day Tourist Visa',   fee: 'USD 170–200 (~PKR 47,000–55,000)', processing: '3–5 working days', validity: '60 days from issue', stay: '60 days',  notes: 'Good for extended family visits' },
  { type: '90-Day Visit Visa',     fee: 'USD 250–300 (~PKR 69,000–83,000)', processing: '5–7 working days', validity: '6 months from issue', stay: '90 days', notes: 'Best for long-term visitors' },
  { type: 'Transit Visa (48h)',    fee: 'USD 25–40 (~PKR 7,000–11,000)',    processing: '24–48 hours',       validity: '14 days from issue', stay: '48 hours', notes: 'Only if transiting via Dubai' },
  { type: 'Multiple Entry 30-Day', fee: 'USD 150–180 (~PKR 41,000–50,000)', processing: '3–5 working days', validity: '1 year from issue', stay: '30 days per entry', notes: 'Best for frequent travellers' },
]

const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Article',
      headline: 'Dubai Visa Requirements for Pakistani Passport Holders 2026',
      datePublished: '2026-05-15',
      dateModified: new Date().toISOString().split('T')[0],
      author: { '@type': 'Organization', name: 'FlightRate', url: 'https://www.flightrate.pk' },
      publisher: { '@type': 'Organization', name: 'FlightRate', url: 'https://www.flightrate.pk' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Do Pakistanis need a visa for Dubai?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Pakistani passport holders require a UAE visa to enter Dubai. There is no visa on arrival for Pakistanis. You must apply through a UAE-registered travel agent, an airline, or directly via the ICP Smart Services portal.' } },
        { '@type': 'Question', name: 'How much does a Dubai visa cost for Pakistanis in PKR?', acceptedAnswer: { '@type': 'Answer', text: 'A 30-day Dubai tourist visa costs approximately PKR 25,000–33,000 (USD 90–120) through a travel agent. Processing fees vary by agent and urgency. FlightRate can assist with visa arrangements via WhatsApp.' } },
        { '@type': 'Question', name: 'How long does Dubai visa processing take for Pakistanis?', acceptedAnswer: { '@type': 'Answer', text: 'Standard processing takes 2–5 working days. Express processing (24–48 hours) is available at higher cost. Apply at least 1 week before travel, ideally 2 weeks ahead.' } },
        { '@type': 'Question', name: 'Can I apply for a Dubai visa without a sponsor?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. You can apply for a tourist visa through a UAE-registered travel agency or through Emirates/flydubai airlines without a personal sponsor in the UAE. A hotel booking or itinerary is typically required.' } },
        { '@type': 'Question', name: 'What documents are needed for a Dubai visa from Pakistan?', acceptedAnswer: { '@type': 'Answer', text: 'Required: original passport (valid 6+ months), passport-sized photo with white background, confirmed flight booking, hotel reservation or host NOC letter, bank statement (last 3 months). Some agents also request an employment letter.' } },
      ],
    },
  ],
}

export default function DubaiVisaPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="blog-post">
        <div className="blog-post-inner">
          <nav className="route-breadcrumb">
            <Link href="/">Home</Link><span>›</span>
            <Link href="/blog">Guides</Link><span>›</span>
            <span>Dubai Visa for Pakistanis</span>
          </nav>

          <span className="blog-tag">Visa Guide</span>
          <h1 className="blog-h1">Dubai Visa Requirements for Pakistani Passport Holders (2026)</h1>
          <p className="blog-meta">Complete guide — costs in PKR, documents, and step-by-step process · Updated May 2026</p>

          <div className="blog-data-callout">
            <strong>Quick answer:</strong> Yes, Pakistanis need a UAE visa. A 30-day tourist visa costs <strong>PKR 25,000–33,000</strong> and takes <strong>2–5 working days</strong> to process. Apply at least 1 week before travel.
          </div>

          <div className="blog-body">
            <h2>Do Pakistanis Need a Visa for Dubai?</h2>
            <p>Yes. Pakistani passport holders require a valid UAE visa to enter Dubai (and all of the UAE). There is no visa on arrival facility for Pakistani nationals. You must arrange your visa before travelling.</p>
            <p>The good news: UAE visas for Pakistanis are straightforward to obtain through a licensed travel agent, through your airline (Emirates and flydubai both offer visa services), or directly via the UAE ICP Smart Services portal.</p>

            <h2>Types of Dubai Visa — Costs in PKR</h2>
            <div className="baggage-table-wrap">
              <table className="baggage-table">
                <thead>
                  <tr><th>Visa Type</th><th>Fee (PKR approx)</th><th>Processing</th><th>Stay</th><th>Best For</th></tr>
                </thead>
                <tbody>
                  {VISA_TYPES.map(v => (
                    <tr key={v.type}>
                      <td><strong>{v.type}</strong></td>
                      <td>{v.fee}</td>
                      <td>{v.processing}</td>
                      <td>{v.stay}</td>
                      <td>{v.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="route-note">Fees are approximate. Exchange rate fluctuations affect PKR cost. PKR amounts based on ~1 USD = PKR 278.</p>

            <h2>Required Documents for Dubai Visa (Pakistan)</h2>
            <ul>
              <li><strong>Passport</strong> — original, valid for at least 6 months from your travel date</li>
              <li><strong>Passport photo</strong> — recent, white background, 35mm × 45mm</li>
              <li><strong>Confirmed flight booking</strong> — return or onward ticket</li>
              <li><strong>Hotel reservation</strong> — or a No Objection Certificate (NOC) from your UAE host</li>
              <li><strong>Bank statement</strong> — last 3 months, showing sufficient funds (typically PKR 50,000+)</li>
              <li><strong>Employment letter</strong> — from employer (some agents require this for employed applicants)</li>
              <li><strong>Business registration</strong> — if self-employed</li>
            </ul>

            <h2>Step-by-Step: How to Apply for Dubai Visa from Pakistan</h2>
            <ol>
              <li><strong>Book your flight first</strong> — many agents require a confirmed booking before processing your visa</li>
              <li><strong>Choose your agent</strong> — use a UAE-registered agency, your airline (Emirates/flydubai), or the ICP portal directly</li>
              <li><strong>Submit documents</strong> — most agents accept scanned copies via WhatsApp or email</li>
              <li><strong>Pay the fee</strong> — typically via bank transfer in PKR or USD</li>
              <li><strong>Receive e-visa</strong> — delivered by email in 2–5 working days. Print and carry with your passport</li>
              <li><strong>At Dubai airport</strong> — present e-visa + passport at immigration. No stamp needed in advance</li>
            </ol>

            <h2>Can I Get a Dubai Visa Through My Airline?</h2>
            <p><strong>Emirates</strong> and <strong>flydubai</strong> both offer UAE visa services for passengers flying their routes. This is often the simplest option — you handle the flight and visa in one place. Qatar Airways and Etihad Airways may also assist with transit visas if you connect via Doha or Abu Dhabi.</p>

            <h2>Dubai Visa — Common Mistakes to Avoid</h2>
            <ul>
              <li>Applying too close to departure — allow at least 1 week, ideally 2 weeks</li>
              <li>Using an unlicensed agent — always verify the agent is UAE-registered</li>
              <li>Overstaying your visa — fines of AED 100/day apply (approx PKR 7,600/day)</li>
              <li>Submitting poor-quality passport photos — must be white background, recent</li>
              <li>Applying without a return ticket — many applications are rejected without confirmed onward travel</li>
            </ul>

            <h2>Frequently Asked Questions</h2>
            <div className="route-faqs">
              {[
                { q: 'Do Pakistanis need a visa for Dubai?', a: 'Yes. Pakistani passport holders require a UAE visa. There is no visa on arrival. Apply through a travel agent, your airline, or the UAE ICP Smart Services portal.' },
                { q: 'How much is a Dubai visa for Pakistanis in PKR?', a: 'A 30-day tourist visa costs approximately PKR 25,000–33,000. 60-day visas cost PKR 47,000–55,000. Prices include agent fees and vary by agency.' },
                { q: 'How long does Dubai visa processing take?', a: 'Standard processing: 2–5 working days. Express (24–48h) available at higher cost. Apply at least 1 week before travel.' },
                { q: 'Can I apply for Dubai visa without a sponsor?', a: 'Yes. Tourist visas can be obtained without a UAE sponsor through a licensed travel agent or via Emirates/flydubai airlines.' },
              ].map((f, i) => (
                <details key={i} className="route-faq">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="blog-cta">
            <h3>Ready to book your Pakistan to Dubai flight?</h3>
            <p>We compare all airlines daily and can assist with visa arrangements via WhatsApp.</p>
            <a href="https://wa.me/923240763099" className="route-wa-btn" target="_blank" rel="noopener">💬 Ask About Visa + Flight</a>
            <Link href="/flights/karachi-to-dubai" className="route-search-btn">See Today&apos;s Fares</Link>
          </div>
        </div>
      </div>
    </>
  )
}
