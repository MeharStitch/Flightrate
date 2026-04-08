export default function HowItWorks() {
  const steps = [
    { ic:'🔍', col:'sn-amber', title:'Search & Compare', desc:'We scan PIA, Emirates, flydubai, Air Arabia, Qatar Airways and more — all at once, ranked by price in seconds.', foot:'Takes 3 seconds' },
    { ic:'💬', col:'sn-green', title:'Chat & Confirm in 7 Minutes', desc:'One tap opens WhatsApp. Our travel agent confirms your seat, baggage, and fare in real time — no forms, no confusion.', foot:'Average: 6 min 42 sec' },
    { ic:'🎫', col:'sn-violet', title:'Receive Your E-Ticket', desc:'Your ticket arrives on WhatsApp and email. Pay via EasyPaisa, JazzCash, NayaPay, or bank transfer.', foot:'Zero hidden charges' },
  ]

  return (
    <section className="section section-alt" id="about">
      <div className="section-label">Simple Process</div>
      <h2 className="section-title reveal">Book in 3 Simple Steps</h2>
      <p className="section-sub reveal">Simpler than any airline website. Faster than any travel agent.</p>

      <div className="steps-row">
        {steps.map((s, i) => (
          <div key={s.title} className={`step-card reveal d${i+1}`}>
            <div className={`step-num ${s.col}`}>{s.ic}</div>
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
            <div className="step-foot">{s.foot}</div>
          </div>
        ))}
      </div>

      {/* WhatsApp Chat Preview */}
      <div className="wa-preview reveal">
        <div className="wa-header">
          <div className="wa-av">✈</div>
          <div>
            <h4>FlightRate Agent</h4>
            <p>● Online now</p>
          </div>
        </div>
        <div className="wa-body">
          <div className="bubble sent">ISB→DXB 15 May, 2 adults economy<div className="btime">10:22 AM ✓✓</div></div>
          <div className="bubble recv">Best fare found! PIA PK-211 departs 08:30, arrives 11:05. PKR 45,200/person (non-stop). Confirm? ✓<div className="btime">10:23 AM</div></div>
          <div className="bubble sent">Yes, confirm it! 👍<div className="btime">10:23 AM ✓✓</div></div>
          <div className="bubble recv">🎉 Booked! E-ticket sent to your WhatsApp. Total: PKR 90,400 for 2 adults.<div className="btime">10:28 AM</div></div>
        </div>
        <div className="wa-footer">
          <div className="wa-time-badge">⏱ Total booking time: 6 min 12 sec</div>
        </div>
      </div>
    </section>
  )
}
