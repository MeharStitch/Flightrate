import Link from 'next/link'

const POPULAR_ROUTES = [
  { label: 'Karachi → Dubai',       href: '/flights/karachi-to-dubai' },
  { label: 'Lahore → Dubai',        href: '/flights/lahore-to-dubai' },
  { label: 'Islamabad → Dubai',     href: '/flights/islamabad-to-dubai' },
  { label: 'Karachi → Riyadh',      href: '/flights/karachi-to-riyadh' },
  { label: 'Lahore → Riyadh',       href: '/flights/lahore-to-riyadh' },
  { label: 'Islamabad → Riyadh',    href: '/flights/islamabad-to-riyadh' },
  { label: 'Karachi → Doha',        href: '/flights/karachi-to-doha' },
  { label: 'Lahore → Doha',         href: '/flights/lahore-to-doha' },
  { label: 'Islamabad → Doha',      href: '/flights/islamabad-to-doha' },
  { label: 'Karachi → Jeddah',      href: '/flights/karachi-to-jeddah' },
  { label: 'Peshawar → Dubai',      href: '/flights/peshawar-to-dubai' },
  { label: 'Sialkot → Dubai',       href: '/flights/sialkot-to-dubai' },
  { label: 'Karachi → Kuwait City', href: '/flights/karachi-to-kuwait-city' },
  { label: 'Karachi → Muscat',      href: '/flights/karachi-to-muscat' },
  { label: 'Multan → Riyadh',       href: '/flights/multan-to-riyadh' },
  { label: 'All Routes →',          href: '/flights' },
]

const AIRLINES = [
  'PIA Pakistan','Emirates','flydubai','Air Arabia',
  'Qatar Airways','Serene Air','FlyJinnah','Oman Air','Gulf Air','Kuwait Airways',
]

const PAY_METHODS = [
  { name: 'JazzCash',     color: '#CC0000', text: '#fff', dot: '#CC0000' },
  { name: 'Easypaisa',    color: '#2E9E22', text: '#fff', dot: '#2E9E22' },
  { name: 'HBL',          color: '#1A237E', text: '#fff', dot: '#1A237E' },
  { name: 'Mastercard',   color: '#1F2937', text: '#fff', dot: '#EB001B', dot2: '#F79E1B' },
  { name: 'Visa',         color: '#1A1F71', text: '#fff', dot: '#1A1F71', italic: true },
  { name: 'PayPak',       color: '#8B7224', text: '#fff', dot: '#C8A84B' },
  { name: 'Bank Transfer',color: '#374151', text: '#fff', dot: '#6B7280' },
]

export default function Footer() {
  const cols = [
    { title: 'Product', links: ['Search Flights','Price Tracker','Fare Alerts','Route Insights','AI Prediction'] },
    { title: 'Routes',  links: ['ISB → DXB','KHI → DMM','LHE → RUH','ISB → KWI','All Routes'] },
    { title: 'Company', links: [] },
  ]

  return (
    <footer>
      <div className="foot-top">
        {/* Brand column */}
        <div>
          <a href="#" className="foot-logo">
            <div className="foot-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="white"/>
              </svg>
            </div>
            <span className="foot-logo-text">Flight<em>Rate</em></span>
          </a>

          <p className="foot-tag">
            Pakistan&apos;s smartest flight booking platform.<br />
            Compare all airlines, track prices, and book<br />in 7 minutes via WhatsApp.
          </p>

          <a href="https://wa.me/923240763099" className="btn-wa-foot" target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>

          <a
            href="https://www.instagram.com/flightrate.pk/"
            className="btn-ig-foot"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow FlightRate on Instagram"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.42.56.22.96.48 1.38.9.42.42.68.82.9 1.38.17.42.37 1.06.42 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.42 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.17-1.06.37-2.23.42-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.42a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.17-.42-.37-1.06-.42-2.23C2.2 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.42-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.17 1.06-.37 2.23-.42C8.42 2.2 8.8 2.2 12 2.2zm0 1.62c-3.15 0-3.52.01-4.76.07-.9.04-1.38.19-1.7.32-.43.16-.74.36-1.06.68-.32.32-.52.63-.68 1.06-.13.32-.28.8-.32 1.7-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.04.9.19 1.38.32 1.7.16.43.36.74.68 1.06.32.32.63.52 1.06.68.32.13.8.28 1.7.32 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c.9-.04 1.38-.19 1.7-.32.43-.16.74-.36 1.06-.68.32-.32.52-.63.68-1.06.13-.32.28-.8.32-1.7.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.04-.9-.19-1.38-.32-1.7a2.85 2.85 0 0 0-.68-1.06 2.85 2.85 0 0 0-1.06-.68c-.32-.13-.8-.28-1.7-.32-1.24-.06-1.61-.07-4.76-.07zm0 2.76a5.42 5.42 0 1 1 0 10.84 5.42 5.42 0 0 1 0-10.84zm0 8.94a3.52 3.52 0 1 0 0-7.04 3.52 3.52 0 0 0 0 7.04zm6.9-9.15a1.27 1.27 0 1 1-2.53 0 1.27 1.27 0 0 1 2.53 0z"/>
            </svg>
            Follow on Instagram
          </a>
        </div>

        {/* Popular routes column */}
        <div className="foot-col">
          <h5>Popular Routes</h5>
          <ul>
            {POPULAR_ROUTES.map(r => (
              <li key={r.href}>
                <Link href={r.href}>{r.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company column */}
        <div className="foot-col">
          <h5>Company</h5>
          <ul>
            <li><a href="/#about">About Us</a></li>
            <li><a href="/#how-it-works">How It Works</a></li>
            <li><a href="https://wa.me/923240763099" target="_blank" rel="noopener">Contact</a></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms of Use</Link></li>
          </ul>
        </div>
      </div>

      <hr className="foot-divider" />

      {/* Airlines */}
      <div className="foot-airlines-strip">
        <div className="foot-airlines-lbl">Airlines We Search</div>
        <div className="foot-al-row">
          {AIRLINES.map(a => (
            <div key={a} className="foot-al-chip">✈ {a}</div>
          ))}
        </div>
      </div>

      {/* Payment trust badges */}
      <div className="foot-trust-strip">
        <div className="foot-trust-lbl">
          <span className="foot-trust-secure-icon">🔒</span>
          Trusted &amp; Secure Payments
        </div>
        <div className="foot-pay-row">
          {PAY_METHODS.map(p => (
            <div
              key={p.name}
              className="foot-pay-badge"
              style={{ background: p.color, color: p.text }}
            >
              {p.dot2 ? (
                /* Mastercard double-dot */
                <span style={{ display:'flex', alignItems:'center', gap:'1px' }}>
                  <span className="foot-pay-dot" style={{ background: p.dot }} />
                  <span className="foot-pay-dot" style={{ background: p.dot2, marginLeft:'-4px' }} />
                </span>
              ) : (
                <span className="foot-pay-dot" style={{ background: p.dot, opacity: 0.85 }} />
              )}
              <span style={p.italic ? { fontStyle:'italic', letterSpacing:'0.02em' } : undefined}>
                {p.name}
              </span>
            </div>
          ))}

          {/* SSL badge */}
          <div className="foot-pay-badge foot-pay-ssl">
            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
              <rect x="1" y="4.5" width="8" height="7" rx="1.5" fill="#003F88"/>
              <path d="M3 4.5V3a2 2 0 0 1 4 0v1.5" stroke="#003F88" strokeWidth="1.3" fill="none"/>
              <circle cx="5" cy="8" r="1.2" fill="white"/>
            </svg>
            SSL Secured
          </div>
        </div>
      </div>

      <hr className="foot-divider" />

      <div className="foot-bottom">
        <p>© 2026 FlightRate · flightrate.pk · Made for Pakistani Travelers ✈</p>
        <div className="foot-links">
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms">Terms of Use</Link>
          <a href="https://wa.me/923240763099" target="_blank" rel="noopener">Contact</a>
          <a href="https://www.instagram.com/flightrate.pk/" target="_blank" rel="noopener noreferrer">Instagram</a>
        </div>
      </div>
    </footer>
  )
}
