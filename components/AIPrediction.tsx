'use client'

function wa(msg: string) {
  window.open('https://wa.me/923001234567?text=' + encodeURIComponent('Hi FlightRate! ' + msg), '_blank')
}

export default function AIPrediction() {
  return (
    <section className="section" id="predict">
      <div className="section-label">AI Engine</div>
      <h2 className="section-title reveal">Price Prediction</h2>
      <p className="section-sub reveal">Data-driven insights to help you book at the perfect time</p>

      <div className="pred-grid reveal">
        {/* Left: recommendation card */}
        <div className="pred-card">
          <h3>✨ Should You Book Now?</h3>
          <div className="ai-badge">🤖 AI Confidence: 87%</div>

          <div className="meter-bar">
            <div className="meter-dot" />
          </div>
          <div className="meter-lbls"><span>LOW</span><span>AVERAGE</span><span>HIGH</span></div>

          <div className="pred-status">✓ Great Time to Book</div>
          <p className="pred-detail">
            Current fare is <strong>22% below</strong> the 30-day average for ISB→DXB.
            Prices typically rise 15% in the next 5 days.
          </p>

          <div className="ipills">
            <div className="ipill">📅 Book 18–25 days ahead</div>
            <div className="ipill">🌅 Morning flights cheapest</div>
            <div className="ipill">📆 Tuesday is lowest day</div>
          </div>

          <button className="btn-v" onClick={() => wa('I want to book ISB to DXB — saw the AI recommendation')}>
            Book Now via WhatsApp →
          </button>
        </div>

        {/* Right: chart */}
        <div className="chart-card">
          <h3>30-Day Price History — ISB → DXB</h3>
          <p className="csub">Violet = actual price · Dashed = 30-day average</p>
          <div className="chart-area">
            <svg width="100%" height="100%" viewBox="0 0 400 160" preserveAspectRatio="none">
              {/* average dashed line */}
              <line x1="0" y1="80" x2="400" y2="80" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="6,4" opacity="0.6" />
              {/* cheap window highlight */}
              <rect x="200" y="95" width="85" height="65" fill="rgba(16,185,129,0.10)" rx="4" />
              {/* price line */}
              <polyline
                fill="none" stroke="#003F88" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                points="0,60 20,65 40,72 60,56 80,76 100,86 120,92 140,82 160,96 180,102 200,112 220,106 240,116 260,109 280,113 300,101 320,96 340,91 360,86 380,81 400,76"
              />
              {/* current price dot */}
              <circle cx="400" cy="76" r="5" fill="white" stroke="#003F88" strokeWidth="2.5" />
              {/* labels */}
              <text x="4" y="22" fontSize="9" fill="#D1D5DB" fontFamily="Plus Jakarta Sans, sans-serif">PKR 70k</text>
              <text x="4" y="84" fontSize="9" fill="#D1D5DB" fontFamily="Plus Jakarta Sans, sans-serif">PKR 50k</text>
              <text x="4" y="148" fontSize="9" fill="#D1D5DB" fontFamily="Plus Jakarta Sans, sans-serif">PKR 30k</text>
              <text x="204" y="92" fontSize="8" fill="#10B981" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">Best window</text>
              <text x="358" y="72" fontSize="9" fill="#003F88" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">Today</text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
