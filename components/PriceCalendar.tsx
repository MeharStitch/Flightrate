'use client'
import { useState } from 'react'

const DAYS = [
  {d:1,t:'avg',p:'48k'},{d:2,t:'avg',p:'47k'},{d:3,t:'exp',p:'65k'},{d:4,t:'exp',p:'68k'},
  {d:5,t:'cheap',p:'38k'},{d:6,t:'cheap',p:'39k'},{d:7,t:'cheap',p:'37k'},{d:8,t:'cheap',p:'36k'},
  {d:9,t:'avg',p:'44k'},{d:10,t:'exp',p:'62k'},{d:11,t:'exp',p:'70k'},{d:12,t:'avg',p:'46k'},
  {d:13,t:'cheap',p:'40k'},{d:14,t:'cheap',p:'41k'},{d:15,t:'avg',p:'45k'},{d:16,t:'avg',p:'49k'},
  {d:17,t:'exp',p:'66k'},{d:18,t:'exp',p:'72k'},{d:19,t:'cheap',p:'38k'},{d:20,t:'cheap',p:'37k'},
  {d:21,t:'cheap',p:'35k'},{d:22,t:'avg',p:'48k'},{d:23,t:'avg',p:'50k'},{d:24,t:'exp',p:'67k'},
  {d:25,t:'exp',p:'74k'},{d:26,t:'avg',p:'52k'},{d:27,t:'cheap',p:'42k'},{d:28,t:'cheap',p:'39k'},
  {d:29,t:'avg',p:'47k'},{d:30,t:'avg',p:'51k'},{d:31,t:'exp',p:'64k'},
]

export default function PriceCalendar() {
  const [sel, setSel] = useState(15)

  return (
    <section className="section section-alt">
      <div className="section-label">Smart Calendar</div>
      <h2 className="section-title reveal">Cheapest Days to Fly This Month</h2>
      <p className="section-sub reveal">Tap any date to see available fares instantly</p>

      <div className="cal-wrap reveal">
        <div className="cal-head">
          <button className="cal-nav-btn">‹</button>
          <h3>May 2025 — ISB → DXB</h3>
          <button className="cal-nav-btn">›</button>
        </div>

        <div className="cal-grid">
          {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
            <div key={d} className="cal-day-h">{d}</div>
          ))}
          {/* offset: May 1 2025 is Thursday = 4 empty cells */}
          {[0,1,2,3].map(i => <div key={`e${i}`} className="cal-cell empty" />)}
          {DAYS.map(({d,t,p}) => (
            <div
              key={d}
              className={`cal-cell ${t}${sel===d?' sel':''}`}
              onClick={() => setSel(d)}
            >
              <span className="day-n">{d}</span>
              <span className="day-p">{p}</span>
            </div>
          ))}
        </div>

        <div className="cal-legend">
          {[['var(--e)','Cheapest'],['var(--al)','Average'],['var(--cl)','Expensive']].map(([bg,lbl]) => (
            <div key={lbl} className="cleg-item">
              <div className="cleg-dot" style={{background:bg}} />
              {lbl}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
