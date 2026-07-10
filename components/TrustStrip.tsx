/**
 * Thin credibility band shown near the top of the homepage.
 * All claims are literally true of the system — no invented traveller counts:
 *  - prices scraped 3× daily (see .github/workflows/scrape.yml crons)
 *  - ~1,000 route/airline pages tracked (sitemap)
 *  - fares shown in PKR, all airlines compared
 *  - WhatsApp booking, no hidden fees
 */
const ITEMS: { icon: string; label: string }[] = [
  { icon: '🔄', label: 'Prices updated 3× daily' },
  { icon: '🛫', label: '1,000+ routes tracked' },
  { icon: '🇵🇰', label: 'All airlines in PKR' },
  { icon: '💬', label: 'WhatsApp reply in ~7 min' },
  { icon: '✅', label: 'No hidden fees' },
]

export default function TrustStrip() {
  return (
    <section className="trust-strip" aria-label="Why travellers trust FlightRate">
      <div className="trust-strip-inner">
        {ITEMS.map(item => (
          <div key={item.label} className="trust-strip-item">
            <span className="trust-strip-icon" aria-hidden="true">{item.icon}</span>
            <span className="trust-strip-label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
