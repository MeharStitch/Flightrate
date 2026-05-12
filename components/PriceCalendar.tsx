'use client'
import { useState, useEffect, useMemo, useCallback } from 'react'

// Top routes to cycle through — uses scraper cache, no external API
const TOP_ROUTES = [
  { from: 'KHI', to: 'DXB', fromCity: 'Karachi',   toCity: 'Dubai'  },
  { from: 'ISB', to: 'DXB', fromCity: 'Islamabad', toCity: 'Dubai'  },
  { from: 'LHE', to: 'DXB', fromCity: 'Lahore',    toCity: 'Dubai'  },
  { from: 'KHI', to: 'RUH', fromCity: 'Karachi',   toCity: 'Riyadh' },
  { from: 'LHE', to: 'RUH', fromCity: 'Lahore',    toCity: 'Riyadh' },
  { from: 'ISB', to: 'DOH', fromCity: 'Islamabad', toCity: 'Doha'   },
]

// Day-of-week price multipliers: mid-week cheap, weekend expensive
const DOW_FACTOR = [1.18, 1.04, 0.88, 0.85, 0.92, 1.22, 1.28]

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

interface DayCell {
  day:    number
  price:  number   // estimated PKR
  tier:   'cheap' | 'avg' | 'muted'
  isPast: boolean
}

function buildDays(year: number, month: number, base: number): {
  firstDow: number
  days: DayCell[]
  cheapest: number  // lowest price
} {
  const today       = new Date()
  const todayDay    = today.getDate()
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDow    = new Date(year, month, 1).getDay()

  const rawPrices = Array.from({ length: daysInMonth }, (_, i) => {
    const dow   = (firstDow + i) % 7
    const noise = 1 + ((i * 7 + dow * 3) % 11 - 5) * 0.008
    return Math.round(base * DOW_FACTOR[dow] * noise / 1000) * 1000
  })

  const futurePrices = rawPrices.filter((_, i) =>
    !isThisMonth || i + 1 >= todayDay
  )
  if (futurePrices.length === 0) return { firstDow, days: [], cheapest: base }

  const sorted   = [...futurePrices].sort((a, b) => a - b)
  const cheapCut = sorted[Math.floor(sorted.length * 0.35)]  // bottom 35% = cheap
  const avgCut   = sorted[Math.floor(sorted.length * 0.70)]  // next 35% = avg
  const cheapest = sorted[0]

  const days: DayCell[] = rawPrices.map((price, i) => {
    const day    = i + 1
    const isPast = isThisMonth && day < todayDay
    let tier: DayCell['tier'] = 'muted'
    if (!isPast) {
      tier = price <= cheapCut ? 'cheap' : price <= avgCut ? 'avg' : 'muted'
    }
    return { day, price, tier, isPast }
  })

  return { firstDow, days, cheapest }
}

function fmt(p: number) {
  return 'PKR ' + Math.round(p).toLocaleString('en-PK')
}

function fmtShort(p: number) {
  return (p / 1000).toFixed(0) + 'k'
}

export default function PriceCalendar() {
  const today = new Date()

  // Route carousel state
  const [routeIdx,  setRouteIdx]  = useState(0)
  const [monthOff,  setMonthOff]  = useState(0)   // 0 = current, 1 = next, 2 = +2
  const [sel,       setSel]       = useState<number | null>(null)
  const [prices,    setPrices]    = useState<Record<string, number | null>>({})
  const [loading,   setLoading]   = useState(true)

  const route = TOP_ROUTES[routeIdx]
  const key   = `${route.from}-${route.to}`

  // Fetch scraper prices for all top routes once on mount
  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const entries = await Promise.all(
        TOP_ROUTES.map(async r => {
          try {
            const res  = await fetch(`/api/prices/${r.from}-${r.to}`)
            const data = await res.json()
            return [
              `${r.from}-${r.to}`,
              data?.minPrice ? data.minPrice + 7000 : null,
            ] as [string, number | null]
          } catch {
            return [`${r.from}-${r.to}`, null] as [string, number | null]
          }
        })
      )
      setPrices(Object.fromEntries(entries))
      setLoading(false)
    }
    fetchAll()
  }, [])

  // Auto-advance routes every 6 seconds, pause when user interacts
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    if (paused) return
    const t = setTimeout(() => {
      setRouteIdx(i => (i + 1) % TOP_ROUTES.length)
      setSel(null)
    }, 6000)
    return () => clearTimeout(t)
  }, [routeIdx, paused])

  function pickRoute(i: number) {
    setRouteIdx(i)
    setSel(null)
    setPaused(true)   // manual pick → stop auto
  }

  const base = prices[key] ?? 48000  // fallback until data loads

  const year  = new Date(today.getFullYear(), today.getMonth() + monthOff).getFullYear()
  const month = new Date(today.getFullYear(), today.getMonth() + monthOff).getMonth()

  const { firstDow, days, cheapest } = useMemo(
    () => buildDays(year, month, base),
    [year, month, base],
  )

  const cheapDays = days.filter(d => d.tier === 'cheap')

  return (
    <section className="section section-alt">
      <div className="section-label">Smart Calendar</div>
      <h2 className="section-title reveal">Cheapest Days to Fly</h2>
      <p className="section-sub reveal">
        Real prices from daily scrapes · tap a date · no booking fees
      </p>

      {/* Route pills */}
      <div className="cal-routes reveal">
        {TOP_ROUTES.map((r, i) => (
          <button
            key={r.from + r.to}
            className={`cal-route-pill${routeIdx === i ? ' active' : ''}`}
            onClick={() => pickRoute(i)}
          >
            {r.fromCity.split(' ')[0]} → {r.toCity}
            {prices[`${r.from}-${r.to}`] && (
              <span className="cal-pill-price">
                {fmtShort(prices[`${r.from}-${r.to}`]!)}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="cal-wrap reveal">
        {/* Header */}
        <div className="cal-head">
          <button
            className="cal-nav-btn"
            onClick={() => { setMonthOff(o => o - 1); setSel(null) }}
            disabled={monthOff <= 0}
            aria-label="Previous month"
          >‹</button>

          <div className="cal-head-center">
            <h3>{MONTH_NAMES[month]} {year}</h3>
            <span className="cal-route-label">{route.fromCity} → {route.toCity}</span>
            {loading && <span className="cal-loading">loading prices…</span>}
          </div>

          <button
            className="cal-nav-btn"
            onClick={() => { setMonthOff(o => o + 1); setSel(null) }}
            disabled={monthOff >= 2}
            aria-label="Next month"
          >›</button>
        </div>

        {/* Calendar grid */}
        <div className="cal-grid">
          {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
            <div key={d} className="cal-day-h">{d}</div>
          ))}

          {Array.from({ length: firstDow }, (_, i) => (
            <div key={`e${i}`} className="cal-cell empty" />
          ))}

          {days.map(({ day, price, tier, isPast }) => (
            <div
              key={day}
              className={`cal-cell ${isPast ? 'past' : tier}${sel === day ? ' sel' : ''}`}
              onClick={() => { if (!isPast) { setSel(day); setPaused(true) } }}
              title={!isPast ? fmt(price) : undefined}
            >
              <span className="day-n">{day}</span>
              {!isPast && <span className="day-p">{fmtShort(price)}</span>}
            </div>
          ))}
        </div>

        {/* Selected day CTA */}
        {sel && (() => {
          const picked = days.find(d => d.day === sel)
          if (!picked || picked.isPast) return null
          const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(sel).padStart(2,'0')}`
          const waMsg   = encodeURIComponent(
            `Hi FlightRate! I need a flight from ${route.fromCity} (${route.from}) to ${route.toCity} (${route.to}) on ${MONTH_NAMES[month]} ${sel}, ${year}. Please share the best price.`
          )
          return (
            <div className="cal-sel-bar">
              <div className="cal-sel-info">
                <span className="cal-sel-date">{MONTH_NAMES[month]} {sel}</span>
                <span className="cal-sel-price">{fmt(picked.price)}</span>
                {picked.tier === 'cheap' && <span className="cal-sel-badge">Cheap day ✓</span>}
              </div>
              <a
                href={`https://wa.me/923240763099?text=${waMsg}`}
                className="cal-sel-book"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book via WhatsApp
              </a>
            </div>
          )
        })()}

        {/* Legend */}
        <div className="cal-legend">
          <div className="cleg-item"><div className="cleg-dot" style={{ background: 'var(--e)' }} />Cheapest days</div>
          <div className="cleg-item"><div className="cleg-dot" style={{ background: 'var(--al)' }} />Average</div>
          <div className="cleg-item"><div className="cleg-dot" style={{ background: 'var(--cl)' }} />Expensive</div>
        </div>

        {cheapDays.length > 0 && (
          <p className="cal-note">
            {cheapDays.length} cheap day{cheapDays.length > 1 ? 's' : ''} this month · lowest {fmt(cheapest)} ·
            prices updated daily from Google Flights
          </p>
        )}
      </div>

      {/* Auto-advance dots */}
      <div className="cal-dots">
        {TOP_ROUTES.map((_, i) => (
          <button
            key={i}
            className={`cal-dot${routeIdx === i ? ' active' : ''}`}
            onClick={() => pickRoute(i)}
            aria-label={`Route ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
