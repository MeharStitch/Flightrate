const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z" transform="translate(1,1)"/>
      </svg>
    ),
    title: '24/7 Customer Support',
    desc: 'Our agents are available round the clock via WhatsApp to help you book, modify or cancel your flight.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
    title: 'Refunds Within 48 Hours',
    desc: 'Eligible refunds are processed and returned to your original payment method within 48 hours — no runaround.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: 'Secure Transaction Guaranteed',
    desc: 'Every booking is verified by our team before confirmation. Pay via EasyPaisa, JazzCash, card or bank — fully secured.',
  },
]

export default function TrustFeatures() {
  return (
    <section className="trust-section reveal">
      <div className="trust-grid">
        {FEATURES.map((f, i) => (
          <div key={i} className="trust-card">
            <div className="trust-icon">{f.icon}</div>
            <h4 className="trust-title">{f.title}</h4>
            <p className="trust-desc">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
