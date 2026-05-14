'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import AirportSearch from './AirportSearch'
import DatePicker from './DatePicker'
import type { SearchParams } from '@/types/flight'

/* ── Count-up hook ── */
function useCountUp(target: number, duration = 1600) {
  const decimals = target % 1 !== 0 ? 1 : 0
  const [count, setCount] = useState(0)
  const nodeRef           = useRef<HTMLSpanElement>(null)
  const started           = useRef(false)

  useEffect(() => {
    const el = nodeRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const t0 = performance.now()
        const tick = (now: number) => {
          const p    = Math.min((now - t0) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          const val  = parseFloat((ease * target).toFixed(decimals))
          setCount(val)
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, duration, decimals])

  return { count, decimals, nodeRef }
}

/* ── Animated stat pill ── */
function StatPill({ icon, label, target }: { icon: string; label: string; target: number }) {
  const { count, decimals, nodeRef } = useCountUp(target)
  const display = target >= 1000
    ? Math.round(count).toLocaleString('en-PK')
    : decimals > 0 ? count.toFixed(1) : String(Math.round(count))
  return (
    <div className="trust-pill">
      <span className="ic">{icon}</span>
      <span ref={nodeRef}>{display}</span>&nbsp;{label}
    </div>
  )
}

const AIRLINES = [
  'PIA Pakistan','Emirates','flydubai','Air Arabia',
  'Qatar Airways','Serene Air','FlyJinnah','Oman Air','Gulf Air','Kuwait Airways'
]

// Default date = 14 days from today
function defaultDate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().split('T')[0]
}

interface Props {
  onSearch?: (params: SearchParams) => void
  isSearching?: boolean
}

export default function Hero({ isSearching = false }: Props) {
  const router = useRouter()
  const [tab, setTab] = useState<'One Way' | 'Round Trip' | 'Multi-City'>('One Way')
  const [from, setFrom] = useState('ISB')
  const [to, setTo] = useState('DXB')
  const [date, setDate] = useState(defaultDate())
  const [returnDate, setReturnDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [travelClass, setTravelClass] = useState<SearchParams['travelClass']>('ECONOMY')

  const [swapping, setSwapping] = useState(false)
  const handleSwap = () => {
    setSwapping(true)
    setFrom(to)
    setTo(from)
    setTimeout(() => setSwapping(false), 400)
  }

  const [btnSearching, setBtnSearching] = useState(false)

  const handleSubmit = () => {
    if (!from || !to || !date || btnSearching) return
    setBtnSearching(true)
    const params = new URLSearchParams({
      from, to, date,
      adults: String(adults),
      class: travelClass,
      ...(tab === 'Round Trip' && returnDate ? { returnDate } : {}),
    })
    // Short delay so user sees the searching state before navigation
    setTimeout(() => router.push(`/search?${params.toString()}`), 600)
  }

  return (
    <section className="hero" id="search-flights">
      <div className="hero-blob blob-v" />
      <div className="hero-blob blob-a" />

      <div className="hero-inner">
        <div className="hero-pill">
          ✈ Pakistan → Gulf &nbsp;·&nbsp; Lowest Fares &nbsp;·&nbsp; Book in 7 Minutes
        </div>

        <h1 className="hero-h1">
          Find the <em>Best Flight.</em><br />Book it Instantly.
        </h1>

        <p className="hero-sub">
          Compare all airlines across Pakistan &amp; Gulf airports.<br />
          AI-powered fare prediction. Human agent confirms on WhatsApp.
        </p>

        <div className="trust-row">
          <StatPill icon="✈" label="Flights Booked" target={14832} />
          <StatPill icon="★" label="/ 5 Rating"    target={4.9} />
          <div className="trust-pill"><span className="ic">🔒</span>100% Secure</div>
          <StatPill icon="⚡" label="Min Booking"   target={7} />
        </div>

        {/* ── Search Card ── */}
        <div className="search-card">
          <div className="trip-tabs">
            {(['One Way','Round Trip','Multi-City'] as const).map(t => (
              <button
                key={t}
                className={`trip-tab${tab===t?' active':''}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Airport row */}
          <div className="search-airports-row">
            <AirportSearch
              label="From"
              placeholder="City or airport code..."
              defaultValue="Islamabad (ISB)"
              value={from}
              onChange={code => setFrom(code)}
            />
            <button className={`swap-btn${swapping ? ' swap-spin' : ''}`} title="Swap airports" onClick={handleSwap}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/>
              </svg>
            </button>
            <AirportSearch
              label="To"
              placeholder="City or airport code..."
              defaultValue="Dubai (DXB)"
              value={to}
              onChange={code => setTo(code)}
            />
          </div>

          {/* Second row */}
          <div className="search-grid-row2">
            <div>
              <span className="sf-label">Departure</span>
              <DatePicker
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={setDate}
              />
            </div>
            {tab === 'Round Trip' && (
              <div>
                <span className="sf-label">Return</span>
                <DatePicker
                  value={returnDate}
                  min={date}
                  onChange={setReturnDate}
                />
              </div>
            )}
            <div>
              <span className="sf-label">Passengers &amp; Class</span>
              <select
                className="sf-select"
                value={`${adults}|${travelClass}`}
                onChange={e => {
                  const [a, c] = e.target.value.split('|')
                  setAdults(parseInt(a))
                  setTravelClass(c as SearchParams['travelClass'])
                }}
              >
                <option value="1|ECONOMY">1 Adult · Economy</option>
                <option value="2|ECONOMY">2 Adults · Economy</option>
                <option value="3|ECONOMY">3 Adults · Economy</option>
                <option value="4|ECONOMY">4 Adults · Economy</option>
                <option value="1|BUSINESS">1 Adult · Business</option>
                <option value="2|BUSINESS">2 Adults · Business</option>
                <option value="1|FIRST">1 Adult · First Class</option>
              </select>
            </div>
          </div>

          <button
            className={`btn-search${btnSearching ? ' btn-search-loading' : ''}`}
            onClick={handleSubmit}
            disabled={isSearching || btnSearching || !from || !to || !date}
          >
            {btnSearching ? (
              <span className="btn-search-inner">
                <span className="btn-spinner" />
                Searching fares…
              </span>
            ) : (
              <span className="btn-search-inner">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                Search Best Fares
              </span>
            )}
          </button>
        </div>

        {/* Quick popular routes */}
        <div className="quick-routes">
          <span className="quick-routes-label">Popular:</span>
          {[
            { label: 'ISB → DXB', from: 'ISB', to: 'DXB' },
            { label: 'KHI → DXB', from: 'KHI', to: 'DXB' },
            { label: 'LHE → RUH', from: 'LHE', to: 'RUH' },
            { label: 'ISB → DOH', from: 'ISB', to: 'DOH' },
            { label: 'KHI → KWI', from: 'KHI', to: 'KWI' },
          ].map(r => (
            <button
              key={r.label}
              className="quick-route-btn"
              onClick={() => { setFrom(r.from); setTo(r.to) }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Airlines we search — below search card */}
        <div className="airline-strip">
          <div className="airline-strip-label">Airlines we search across</div>
          <div className="al-chips-row">
            {AIRLINES.map(a => <div key={a} className="al-chip">{a}</div>)}
          </div>
        </div>

      </div>
    </section>
  )
}
