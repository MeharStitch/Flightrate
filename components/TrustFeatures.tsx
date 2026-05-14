const FEATURES = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: 'No Hidden Fees',
    desc: 'Price shown = price paid. We confirm the exact fare on WhatsApp before you pay a single rupee.',
    badge: '100% Transparent',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: '7-Minute Response',
    desc: 'Our agents respond on WhatsApp within 7 minutes — faster than any online booking portal.',
    badge: 'Avg. 4 min',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: 'Refunds in 48 Hours',
    desc: 'Eligible refunds processed within 48 hours of approval. No chasing required.',
    badge: 'Guaranteed',
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    title: 'Best Price Promise',
    desc: 'Found a lower fare elsewhere? Show us and we\'ll beat it or refund the difference. Simple.',
    badge: 'Price Match',
  },
]

export default function TrustFeatures() {
  return (
    <section className="trust-section">
      <div className="trust-grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="trust-card reveal">
            <div className="trust-card-top">
              <div className="trust-icon">{f.icon}</div>
              <span className="trust-badge">{f.badge}</span>
            </div>
            <h4 className="trust-title">{f.title}</h4>
            <p className="trust-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
