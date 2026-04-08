const BAR_DAYS = [
  {l:'Sun',h:55,c:'var(--vb)'},{l:'Mon',h:45,c:'var(--vb)'},
  {l:'Tue',h:30,c:'var(--a)'},{l:'Wed',h:32,c:'var(--a)'},
  {l:'Thu',h:60,c:'var(--vb)'},{l:'Fri',h:80,c:'var(--cl)'},
  {l:'Sat',h:70,c:'var(--cl)'},
]

const MONTHS = [
  {m:'J',t:'cheap'},{m:'F',t:'cheap'},{m:'M',t:'avg'},{m:'A',t:'avg'},
  {m:'M',t:'exp'},{m:'J',t:'exp'},{m:'J',t:'exp'},{m:'A',t:'avg'},
  {m:'S',t:'cheap'},{m:'O',t:'avg'},{m:'N',t:'avg'},{m:'D',t:'exp'},
]

export default function RouteInsights() {
  return (
    <section className="section section-alt">
      <div className="section-label">Route Analytics</div>
      <h2 className="section-title reveal">Know Your Route — ISB → DXB</h2>
      <p className="section-sub reveal">Deep behaviour analysis from 24 months of price data</p>

      <div className="insights-grid">
        {/* Best Day */}
        <div className="ic-card reveal d1">
          <div className="ic-title">Best Day to Book</div>
          <div className="bars">
            {BAR_DAYS.map(b => (
              <div key={b.l} className="bari">
                <div className="barf" style={{height:`${b.h}%`,background:b.c,minHeight:4}} />
                <div className="bar-lbl">{b.l}</div>
              </div>
            ))}
          </div>
          <p className="ic-note">Tuesday &amp; Wednesday flights are <strong style={{color:'var(--a)'}}>18% cheaper</strong> on average.</p>
        </div>

        {/* Best Time */}
        <div className="ic-card reveal d2">
          <div className="ic-title">Best Departure Time</div>
          <div className="tpills">
            <div className="tpill low"><div className="tp-icon">🌅</div><div className="tp-lbl">Morning</div><div className="tp-sub">Cheapest</div></div>
            <div className="tpill mid"><div className="tp-icon">☀️</div><div className="tp-lbl">Afternoon</div><div className="tp-sub">Average</div></div>
            <div className="tpill high"><div className="tp-icon">🌙</div><div className="tp-lbl">Evening</div><div className="tp-sub">Priciest</div></div>
          </div>
          <p className="ic-note">Morning departures save an avg of <strong style={{color:'var(--e)'}}>PKR 4,200</strong> per ticket.</p>
        </div>

        {/* Best Month */}
        <div className="ic-card reveal d1">
          <div className="ic-title">Best Month to Fly</div>
          <div className="mstrip">
            {MONTHS.map((m,i) => <div key={i} className={`mc ${m.t}`}>{m.m}</div>)}
          </div>
          <p className="ic-note"><strong style={{color:'var(--e)'}}>February &amp; September</strong> are cheapest. Avoid Dec–Jan for best fares.</p>
        </div>

        {/* Booking Window */}
        <div className="ic-card reveal d2">
          <div className="ic-title">Advance Booking Window</div>
          <div className="tl-bar"><div className="tl-sweet" /></div>
          <div className="tl-lbls">
            <span>Today</span><span>2 wks</span><span>1 month</span><span>2 months</span>
          </div>
          <p className="ic-note">Sweet spot: <strong style={{color:'var(--e)'}}>18–25 days before departure.</strong> Too early or too late costs 20–30% more.</p>
        </div>
      </div>
    </section>
  )
}
