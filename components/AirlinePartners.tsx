const AIRLINES = [
  { code: 'EK', name: 'Emirates',       color: '#D4001A' },
  { code: 'SV', name: 'Saudia',         color: '#006400' },
  { code: 'QR', name: 'Qatar Airways',  color: '#5C0632' },
  { code: 'EY', name: 'Etihad',         color: '#BD8B13' },
  { code: 'GF', name: 'Gulf Air',       color: '#B8860B' },
  { code: 'WY', name: 'Oman Air',       color: '#C8102E' },
  { code: 'PC', name: 'Pegasus',        color: '#FF6600' },
  { code: 'PK', name: 'PIA',            color: '#006E3F' },
  { code: 'FZ', name: 'flydubai',       color: '#E31E37' },
  { code: 'G9', name: 'Air Arabia',     color: '#E31837' },
  { code: 'ER', name: 'Serene Air',     color: '#1B3A6B' },
  { code: '9P', name: 'FlyJinnah',      color: '#C8102E' },
  { code: 'KU', name: 'Kuwait Airways', color: '#006E3F' },
  { code: 'GF', name: 'Gulf Air',       color: '#B8860B' },
]

export default function AirlinePartners() {
  // Duplicate for seamless loop
  const doubled = [...AIRLINES, ...AIRLINES]

  return (
    <section className="partners-section reveal">
      <div className="partners-inner">
        <div className="partners-header">
          <div>
            <h3 className="partners-title">Featured Partners</h3>
            <p className="partners-sub">Pakistan · Gulf · International</p>
          </div>
        </div>
      </div>

      <div className="partners-track-wrap">
        <div className="partners-fade-left" />
        <div className="partners-fade-right" />
        <div className="partners-track">
          {doubled.map((a, i) => (
            <div key={i} className="partner-chip">
              <span
                className="partner-badge"
                style={{ background: a.color }}
              >
                {a.code}
              </span>
              <span className="partner-name">{a.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
