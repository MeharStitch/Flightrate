'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import AirportSearch from '@/components/AirportSearch'
import DatePicker from '@/components/DatePicker'
import type { SearchParams, FlightOffer } from '@/types/flight'
import { buildAffiliateUrl } from '@/lib/travelpayouts'
import React from 'react'

const MARKUP = 7000
// Public Travelpayouts marker — when set, per-flight "Book Online" links show.
const TP_MARKER = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER || ''

function displayPrice(raw: number) {
  return 'PKR ' + (raw + MARKUP).toLocaleString('en-PK')
}

const AIRPORTS: Record<string, string> = {
  ISB: 'Islamabad Intl',     KHI: 'Jinnah Intl',          LHE: 'Allama Iqbal Intl',
  PEW: 'Bacha Khan Intl',    SKT: 'Sialkot Intl',          MUX: 'Multan Intl',
  UET: 'Quetta Intl',        LYP: 'Faisalabad Intl',
  DXB: 'Dubai Intl',         AUH: 'Abu Dhabi Intl',        SHJ: 'Sharjah Intl',
  DOH: 'Hamad Intl',         RUH: 'King Khalid Intl',      JED: 'King Abdulaziz Intl',
  DMM: 'King Fahd Intl',     KWI: 'Kuwait Intl',           BAH: 'Bahrain Intl',
  MCT: 'Muscat Intl',        AAN: 'Al Ain Intl',            MED: 'Prince Mohammad Intl',
  GYD: 'Heydar Aliyev Intl', IST: 'Istanbul Airport',      AMS: 'Amsterdam Schiphol',
  MAN: 'Manchester Airport', BHX: 'Birmingham Airport',    LHR: 'London Heathrow',
  CDG: 'Paris Charles de Gaulle', ORY: 'Paris Orly',       MXP: 'Milan Malpensa',
  LIN: 'Milan Linate',       FCO: 'Rome Fiumicino',        MAD: 'Madrid Barajas',
  BCN: 'Barcelona El Prat',  FRA: 'Frankfurt Airport',     MUC: 'Munich Airport',
  JFK: 'New York JFK',       ORD: "Chicago O'Hare",        YYZ: 'Toronto Pearson',
}

function cityName(code: string) {
  const name = AIRPORTS[code.toUpperCase()]
  return name ? `${name} (${code.toUpperCase()})` : code.toUpperCase()
}

/* ── Demo outbound flights ── */
const DEMO_OUT: FlightOffer[] = [
  { id:'f1', airline:'PIA Pakistan International', airlineCode:'PK', airlineColor:'#006E3F',
    flightNo:'PK-211', dep:'08:30', depCode:'ISB', arr:'11:05', arrCode:'DXB',
    dur:'2h 35m', stops:0, stopTxt:'Non-stop', bag:'23kg', meal:true,
    price:'PKR 45,200', priceRaw:45200, priceTotal:'', priceFor:'',
    aircraft:'Boeing 777', fareType:'Economy', badge:'best', badgeTxt:'Best Pick' },
  { id:'f2', airline:'Flydubai', airlineCode:'FZ', airlineColor:'#E31E37',
    flightNo:'FZ-312', dep:'14:15', depCode:'ISB', arr:'17:25', arrCode:'DXB',
    dur:'3h 10m', stops:0, stopTxt:'Non-stop', bag:'20kg', meal:false,
    price:'PKR 36,800', priceRaw:36800, priceTotal:'', priceFor:'',
    aircraft:'Boeing 737', fareType:'Economy', badge:'cheap', badgeTxt:'Lowest Fare' },
  { id:'f3', airline:'Serene Air', airlineCode:'ER', airlineColor:'#1a4480',
    flightNo:'ER-501', dep:'06:00', depCode:'ISB', arr:'09:15', arrCode:'DXB',
    dur:'3h 15m', stops:0, stopTxt:'Non-stop', bag:'20kg', meal:false,
    price:'PKR 38,400', priceRaw:38400, priceTotal:'', priceFor:'',
    aircraft:'Boeing 737', fareType:'Economy', badge:undefined, badgeTxt:undefined },
  { id:'f4', airline:'Air Arabia', airlineCode:'G9', airlineColor:'#C8102E',
    flightNo:'G9-214', dep:'10:30', depCode:'ISB', arr:'13:40', arrCode:'DXB',
    dur:'3h 10m', stops:0, stopTxt:'Non-stop', bag:'20kg', meal:false,
    price:'PKR 41,500', priceRaw:41500, priceTotal:'', priceFor:'',
    aircraft:'Airbus A320', fareType:'Economy', badge:undefined, badgeTxt:undefined },
  { id:'f5', airline:'Emirates', airlineCode:'EK', airlineColor:'#C8102E',
    flightNo:'EK-623', dep:'21:45', depCode:'ISB', arr:'00:35', arrCode:'DXB',
    dur:'2h 50m', stops:0, stopTxt:'Non-stop', bag:'30kg', meal:true,
    price:'PKR 62,500', priceRaw:62500, priceTotal:'', priceFor:'',
    aircraft:'Boeing 777', fareType:'Economy', badge:undefined, badgeTxt:undefined },
  { id:'f6', airline:'Qatar Airways', airlineCode:'QR', airlineColor:'#5C0632',
    flightNo:'QR-629', dep:'09:45', depCode:'ISB', arr:'15:30', arrCode:'DXB',
    dur:'5h 45m', stops:1, stopTxt:'1 Stop · DOH', bag:'30kg', meal:true,
    price:'PKR 55,000', priceRaw:55000, priceTotal:'', priceFor:'',
    aircraft:'Boeing 787', fareType:'Economy', badge:undefined, badgeTxt:undefined },
]

/* ── Generate demo return flights (reversed route, slightly different times/prices) ── */
function makeReturnDemo(fromCode: string, toCode: string): FlightOffer[] {
  const deps = ['07:30', '13:00', '19:45', '09:10', '16:30', '22:15']
  const arrs = ['11:05', '16:35', '23:20', '12:45', '20:05', '01:50']
  const durs = ['2h 35m', '3h 35m', '3h 35m', '3h 35m', '3h 35m', '3h 35m']
  return DEMO_OUT.map((f, i) => ({
    ...f,
    id:      `r${i + 1}`,
    depCode: fromCode,
    arrCode: toCode,
    dep:     deps[i] ?? '10:00',
    arr:     arrs[i] ?? '13:30',
    dur:     durs[i] ?? '3h 30m',
    priceRaw: Math.round(f.priceRaw * (0.92 + Math.random() * 0.16)),
    badge:   i === 1 ? 'cheap' : i === 0 ? 'best' : undefined,
    badgeTxt: i === 1 ? 'Lowest Return' : i === 0 ? 'Best Pick' : undefined,
  }))
}

/* ── WhatsApp messages ── */
function fmtDate(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-PK', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  })
}
const LINE = '━━━━━━━━━━━━━━━━━━━━'
const classLabel: Record<string, string> = {
  ECONOMY: 'Economy', BUSINESS: 'Business Class',
  FIRST: 'First Class', PREMIUM_ECONOMY: 'Premium Economy',
}

function bookOneWayWA(f: FlightOffer, p: SearchParams) {
  const price = (f.priceRaw + MARKUP).toLocaleString('en-PK')
  const total = ((f.priceRaw + MARKUP) * p.adults).toLocaleString('en-PK')
  const cls   = classLabel[p.travelClass] ?? p.travelClass
  const stops = f.stops === 0 ? 'Non-stop ✅' : f.stopTxt

  const msg = [
    `✈️ *FLIGHT BOOKING — FlightRate.pk*`,
    LINE,
    ``,
    `🛫 *${f.airline}*`,
    `    Flight *${f.flightNo}* · ${f.aircraft ?? 'Commercial'}`,
    ``,
    `📍 *${f.depCode}  →  ${f.arrCode}*`,
    `    ${AIRPORTS[f.depCode] ?? f.depCode} → ${AIRPORTS[f.arrCode] ?? f.arrCode}`,
    ``,
    `🗓  *${fmtDate(p.date)}*`,
    `⏰  Departs *${f.dep}*  →  Arrives *${f.arr}*`,
    `⏱  Duration: ${f.dur}  ·  ${stops}`,
    `🧳  Baggage: ${f.bag}${f.meal ? '  ·  🍽 Meal included' : ''}`,
    ``,
    LINE,
    `💺  *${cls}*  ·  👥 ${p.adults} Adult${p.adults > 1 ? 's' : ''}`,
    `💰  *PKR ${price}* /person (est. incl. taxes)`,
    p.adults > 1 ? `💵  *Total: PKR ${total}*` : ``,
    LINE,
    ``,
    `Hi, I'd like to book this flight. Please confirm availability and final price. 🙏`,
  ].filter(l => l !== undefined).join('\n')

  window.open('https://wa.me/923240763099?text=' + encodeURIComponent(msg), '_blank')
}

function bookRoundTripWA(
  out: FlightOffer, ret: FlightOffer,
  p: SearchParams, retDate: string
) {
  const outPrice = (out.priceRaw + MARKUP).toLocaleString('en-PK')
  const retPrice = (ret.priceRaw + MARKUP).toLocaleString('en-PK')
  const total    = ((out.priceRaw + ret.priceRaw + MARKUP * 2) * p.adults).toLocaleString('en-PK')
  const cls      = classLabel[p.travelClass] ?? p.travelClass

  const msg = [
    `✈️ *ROUND TRIP BOOKING — FlightRate.pk*`,
    LINE,
    ``,
    `*🛫 OUTBOUND FLIGHT*`,
    `🛫 *${out.airline}*  ·  ${out.flightNo}`,
    `📍 *${out.depCode}  →  ${out.arrCode}*`,
    `🗓  *${fmtDate(p.date)}*`,
    `⏰  ${out.dep} → ${out.arr}  ·  ${out.dur}${out.stops === 0 ? '  ·  Non-stop ✅' : `  ·  ${out.stopTxt}`}`,
    `💰  *PKR ${outPrice}* /person`,
    ``,
    LINE,
    ``,
    `*🛬 RETURN FLIGHT*`,
    `🛫 *${ret.airline}*  ·  ${ret.flightNo}`,
    `📍 *${ret.depCode}  →  ${ret.arrCode}*`,
    `🗓  *${fmtDate(retDate)}*`,
    `⏰  ${ret.dep} → ${ret.arr}  ·  ${ret.dur}${ret.stops === 0 ? '  ·  Non-stop ✅' : `  ·  ${ret.stopTxt}`}`,
    `💰  *PKR ${retPrice}* /person`,
    ``,
    LINE,
    `💺  *${cls}*  ·  👥 ${p.adults} Adult${p.adults > 1 ? 's' : ''}`,
    `💵  *Total est: PKR ${total}*`,
    LINE,
    ``,
    `Hi, I'd like to book this round trip. Please confirm availability and final price. 🙏`,
  ].join('\n')

  window.open('https://wa.me/923240763099?text=' + encodeURIComponent(msg), '_blank')
}

/* ── Skeleton ── */
function Skeleton({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="srp-card srp-skeleton" style={style}>
      <div className="srp-card-row" style={{ padding: '16px 20px' }}>
        <div className="skel skel-logo" />
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:9 }}>
          <div className="skel skel-line w60" />
          <div className="skel skel-line" style={{ width:'55%' }} />
          <div className="skel skel-line" style={{ width:'35%', marginTop:4 }} />
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:9, alignItems:'flex-end', minWidth:130 }}>
          <div className="skel skel-line" style={{ width:90, height:20 }} />
          <div className="skel skel-line" style={{ width:70 }} />
          <div className="skel skel-btn" style={{ width:130 }} />
        </div>
      </div>
    </div>
  )
}

/* ── Flight card ── */
interface CardProps {
  f:          FlightOffer
  expanded:   boolean
  onExpand:   () => void
  cta:        React.ReactNode   // primary action button
  adults:     number
}

function FlightCard({ f, expanded, onExpand, cta, adults }: CardProps) {
  return (
    <div
      className="srp-card"
      style={{ cursor: 'pointer' }}
      onClick={onExpand}
    >
      {f.badge && (
        <div className={`srp-card-badge ${f.badge === 'cheap' ? 'badge-green' : 'badge-blue'}`}>
          {f.badgeTxt}
        </div>
      )}

      <div className="srp-card-row">
        {/* Airline logo */}
        <div className="srp-logo" style={{ background: f.airlineCode ? '#fff' : f.airlineColor }}>
          {f.airlineCode ? (
            <img
              src={`https://www.gstatic.com/flights/airline_logos/70px/${f.airlineCode}.png`}
              alt={f.airline} width={40} height={40}
              style={{ objectFit:'contain', width:'100%', height:'100%' }}
              onError={e => {
                const el = e.currentTarget
                el.style.display = 'none'
                if (el.parentElement) {
                  el.parentElement.style.background = f.airlineColor
                  el.parentElement.textContent = f.airlineCode
                }
              }}
            />
          ) : f.airlineCode}
        </div>

        {/* Flight info */}
        <div className="srp-flight-info">
          <div className="srp-airline-header">
            <span className="srp-airline-name">{f.airline}</span>
            <span className="srp-flight-num">{f.flightNo}</span>
            {f.aircraft && <span className="srp-aircraft-tag">{f.aircraft}</span>}
          </div>
          <div className="srp-route">
            <div className="srp-ep">
              <span className="srp-time">{f.dep}</span>
              <span className="srp-iata">{f.depCode}</span>
              <span className="srp-city">{AIRPORTS[f.depCode] ?? ''}</span>
            </div>
            <div className="srp-mid">
              <span className="srp-dur">{f.dur}</span>
              <div className="srp-line-row">
                <div className="srp-dot-s" />
                <div className="srp-rule" />
                <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--v)">
                  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
                <div className="srp-rule" />
                <div className="srp-dot-s" />
              </div>
              <div className="srp-tags">
                <span className={`srp-tag ${f.stops === 0 ? 'tag-green' : 'tag-amber'}`}>{f.stopTxt}</span>
                <span className="srp-tag tag-grey">🧳 {f.bag}</span>
                {f.meal && <span className="srp-tag tag-grey">🍽 Meal</span>}
              </div>
            </div>
            <div className="srp-ep srp-ep-right">
              <span className="srp-time">{f.arr}</span>
              <span className="srp-iata">{f.arrCode}</span>
              <span className="srp-city">{AIRPORTS[f.arrCode] ?? ''}</span>
            </div>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="srp-price-col">
          <div className="srp-price">{displayPrice(f.priceRaw)}</div>
          <div className="srp-per">per person (est. incl. taxes)</div>
          {adults > 1 && (
            <div className="srp-total">
              Total: PKR {((f.priceRaw + MARKUP) * adults).toLocaleString('en-PK')}
            </div>
          )}
          <div onClick={e => e.stopPropagation()}>{cta}</div>
        </div>
      </div>

      <div className="srp-card-foot">
        <span className="srp-validity">✓ Base fare · Taxes estimated · Confirm on WhatsApp</span>
        <span className="srp-details-toggle">{expanded ? 'Hide details ↑' : 'Tap for details ↓'}</span>
      </div>

      {expanded && (
        <div className="srp-expanded" onClick={e => e.stopPropagation()} style={{ cursor:'default' }}>
          <div className="srp-exp-grid">
            {[
              ['Flight No.', f.flightNo],
              ['Baggage',   `${f.bag} checked`],
              ['Meal',      f.meal ? 'Included' : 'Not included'],
              ['Aircraft',  f.aircraft || '—'],
              ['Cabin',     f.fareType],
              ['Stops',     f.stopTxt],
            ].map(([k, v]) => (
              <div key={k} className="srp-exp-item">
                <span className="srp-exp-key">{k}</span>
                <span className="srp-exp-val">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main component ── */
export default function SearchClient() {
  const url    = useSearchParams()
  const router = useRouter()

  const [from,       setFrom]       = useState(url.get('from')       || 'ISB')
  const [to,         setTo]         = useState(url.get('to')         || 'DXB')
  const [date,       setDate]       = useState(url.get('date')       || new Date().toISOString().split('T')[0])
  const [returnDate, setReturnDate] = useState(url.get('returnDate') || '')
  const adults      = parseInt(url.get('adults') || '1')
  const travelClass = (url.get('class') || 'ECONOMY') as SearchParams['travelClass']
  const isRoundTrip = !!returnDate

  /* Round trip step: 'outbound' | 'return' */
  const [step,             setStep]             = useState<'outbound'|'return'>('outbound')
  const [selectedOutbound, setSelectedOutbound] = useState<FlightOffer | null>(null)

  /* Flight data */
  const [flights,       setFlights]       = useState<FlightOffer[]>(DEMO_OUT)
  const [returnFlights, setReturnFlights] = useState<FlightOffer[]>([])
  const [isLoading,     setIsLoading]     = useState(true)
  const [returnLoading, setReturnLoading] = useState(false)
  const [apiError,      setApiError]      = useState<string | null>(null)
  const [dataSource,    setDataSource]    = useState<'duffel'|'demo'>('demo')

  /* UI state */
  const [sort,           setSort]           = useState('Cheapest')
  const [stopFilters,    setStopFilters]    = useState<string[]>([])
  const [airlineFilters, setAirlineFilters] = useState<string[]>([])
  const [expanded,       setExpanded]       = useState<string | null>(null)
  const [sidebarOpen,    setSidebarOpen]    = useState(false)

  /* Reset round trip state when search changes */
  useEffect(() => {
    setStep('outbound')
    setSelectedOutbound(null)
    setExpanded(null)
  }, [from, to, date, returnDate])

  /* Fetch outbound flights */
  useEffect(() => {
    setIsLoading(true)
    setApiError(null)
    const params = new URLSearchParams({ from, to, date, adults: String(adults) })
    fetch(`/api/flights/search?${params}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setFlights(data.flights?.length ? data.flights : DEMO_OUT)
        setDataSource(data.source ?? 'demo')
      })
      .catch(err => {
        setApiError(err.message)
        setFlights(DEMO_OUT)
        setDataSource('demo')
      })
      .finally(() => setIsLoading(false))
  }, [from, to, date, adults])

  /* Fetch return flights when round trip */
  useEffect(() => {
    if (!isRoundTrip || !returnDate) { setReturnFlights([]); return }
    setReturnLoading(true)
    const params = new URLSearchParams({ from: to, to: from, date: returnDate, adults: String(adults) })
    fetch(`/api/flights/search?${params}`)
      .then(r => r.json())
      .then(data => {
        setReturnFlights(data.flights?.length ? data.flights : makeReturnDemo(to, from))
      })
      .catch(() => setReturnFlights(makeReturnDemo(to, from)))
      .finally(() => setReturnLoading(false))
  }, [isRoundTrip, returnDate, to, from, adults])

  const sp: SearchParams = { from, to, date, adults, travelClass }

  /* Filter + sort helper */
  function applyFilters(list: FlightOffer[]) {
    const stopOnly = stopFilters.filter(s => !s.startsWith('dep:'))
    const depTime  = stopFilters.filter(s => s.startsWith('dep:'))
    return [...list]
      .filter(f => {
        if (stopOnly.length > 0) {
          const lbl = f.stops === 0 ? 'Non-stop' : f.stops === 1 ? '1 Stop' : '2+ Stops'
          if (!stopOnly.includes(lbl)) return false
        }
        if (airlineFilters.length > 0 && !airlineFilters.includes(f.airline)) return false
        if (depTime.length > 0) {
          const hour = parseInt(f.dep?.split(':')[0] ?? '0', 10)
          const ok = depTime.some(d => {
            if (d === 'dep:Early Morning') return hour >= 0  && hour < 6
            if (d === 'dep:Morning')       return hour >= 6  && hour < 12
            if (d === 'dep:Afternoon')     return hour >= 12 && hour < 18
            if (d === 'dep:Evening')       return hour >= 18 && hour < 24
            return false
          })
          if (!ok) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sort === 'Cheapest') return a.priceRaw - b.priceRaw
        if (sort === 'Fastest') {
          const toMin = (d: string) => { const m = d.match(/(\d+)h\s*(\d+)?m?/); return m ? +m[1]*60 + +(m[2]||0) : 999 }
          return toMin(a.dur) - toMin(b.dur)
        }
        return (a.priceRaw + a.stops*5000) - (b.priceRaw + b.stops*5000)
      })
  }

  const sortedOut    = useMemo(() => applyFilters(flights),       [flights, stopFilters, airlineFilters, sort])
  const sortedReturn = useMemo(() => applyFilters(returnFlights), [returnFlights, stopFilters, airlineFilters, sort])
  const activeList   = step === 'return' ? sortedReturn : sortedOut
  const allAirlines  = [...new Set((step === 'return' ? returnFlights : flights).map(f => f.airline))]

  function toggleStr(arr: string[], val: string, set: (v: string[]) => void) {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  function handleSearch() {
    const p = new URLSearchParams({ from, to, date, adults: String(adults), class: travelClass })
    if (returnDate) p.set('returnDate', returnDate)
    router.push(`/search?${p.toString()}`)
  }

  const activeFilterCount = stopFilters.length + airlineFilters.length
  const displayDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' })
    : ''
  const displayReturnDate = returnDate
    ? new Date(returnDate + 'T12:00:00').toLocaleDateString('en-PK', { day:'numeric', month:'short', year:'numeric' })
    : ''
  const classLabel: Record<string,string> = {
    ECONOMY:'Economy', BUSINESS:'Business', FIRST:'First', PREMIUM_ECONOMY:'Premium',
  }

  const showingLoading = step === 'outbound' ? isLoading : returnLoading

  return (
    <>
      <Navbar />
      <div className="srp">

        {/* ── Compact search bar ── */}
        <div className="srp-topbar">
          <div className="srp-topbar-inner">
            <div className="srp-ap-wrap">
              <AirportSearch label="From" placeholder="From…" defaultValue={from} onChange={setFrom} />
            </div>
            <button className="srp-swap-btn" onClick={() => { const t = from; setFrom(to); setTo(t) }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/>
              </svg>
            </button>
            <div className="srp-ap-wrap">
              <AirportSearch label="To" placeholder="To…" defaultValue={to} onChange={setTo} />
            </div>
            <DatePicker
              label={isRoundTrip ? 'Depart' : 'Date'}
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={setDate}
            />
            {isRoundTrip && (
              <DatePicker
                label="Return"
                value={returnDate}
                min={date}
                onChange={setReturnDate}
              />
            )}
            <button className="srp-search-btn" onClick={handleSearch}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* ── Round trip step indicator ── */}
        {isRoundTrip && (
          <div className="srp-steps">
            <div className={`srp-step ${step === 'outbound' ? 'srp-step-active' : 'srp-step-done'}`}>
              <span className="srp-step-num">{step === 'outbound' ? '1' : '✓'}</span>
              <span className="srp-step-label">
                Outbound · {cityName(from)} → {cityName(to)}
                <em>{displayDate}</em>
              </span>
            </div>
            <div className="srp-step-arrow">›</div>
            <div className={`srp-step ${step === 'return' ? 'srp-step-active' : 'srp-step-pending'}`}>
              <span className="srp-step-num">2</span>
              <span className="srp-step-label">
                Return · {cityName(to)} → {cityName(from)}
                <em>{displayReturnDate}</em>
              </span>
            </div>
          </div>
        )}

        {/* ── Selected outbound sticky bar (step 2) ── */}
        {isRoundTrip && step === 'return' && selectedOutbound && (
          <div className="srp-selected-bar">
            <div className="srp-selected-info">
              <span className="srp-selected-label">✓ Outbound selected</span>
              <span className="srp-selected-flight">
                {selectedOutbound.airline} {selectedOutbound.flightNo} ·
                {selectedOutbound.dep} → {selectedOutbound.arr} ·
                {displayPrice(selectedOutbound.priceRaw)}/person
              </span>
            </div>
            <button
              className="srp-change-btn"
              onClick={() => { setStep('outbound'); setSelectedOutbound(null) }}
            >
              Change
            </button>
          </div>
        )}

        {/* ── Summary bar ── */}
        <div className="srp-summary-bar">
          <span className="srp-route-pill">
            ✈ {cityName(from)} → {cityName(to)}
            {isRoundTrip && ` ↩ ${cityName(to)} → ${cityName(from)}`}
          </span>
          <span className="srp-meta-dot">·</span>
          <span className="srp-meta">{displayDate}{isRoundTrip && ` – ${displayReturnDate}`}</span>
          <span className="srp-meta-dot">·</span>
          <span className="srp-meta">{adults} Adult{adults > 1 ? 's' : ''}</span>
          <span className="srp-count-badge">
            {activeList.length} {step === 'return' ? 'return' : 'outbound'} flights
          </span>
        </div>

        {/* ── Layout ── */}
        <div className="srp-layout">

          {/* Sidebar */}
          <aside className={`srp-sidebar${sidebarOpen ? ' srp-sidebar-open' : ''}`}>
            <div className="srp-sidebar-head">
              <span className="srp-sidebar-title">Filters</span>
              {activeFilterCount > 0 && (
                <button className="srp-clear" onClick={() => { setStopFilters([]); setAirlineFilters([]) }}>
                  Clear all
                </button>
              )}
            </div>
            <div className="srp-filter-group">
              <div className="srp-filter-group-title">Stops</div>
              {['Non-stop', '1 Stop', '2+ Stops'].map(s => (
                <label key={s} className="srp-check-row">
                  <input type="checkbox" checked={stopFilters.includes(s)}
                    onChange={() => toggleStr(stopFilters, s, setStopFilters)} />
                  <span>{s}</span>
                </label>
              ))}
            </div>
            <div className="srp-filter-group">
              <div className="srp-filter-group-title">Departure Time</div>
              {['Early Morning','Morning','Afternoon','Evening'].map(label => (
                <label key={label} className="srp-check-row">
                  <input type="checkbox" checked={stopFilters.includes(`dep:${label}`)}
                    onChange={() => toggleStr(stopFilters, `dep:${label}`, setStopFilters)} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <div className="srp-filter-group">
              <div className="srp-filter-group-title">Airlines</div>
              {allAirlines.map(a => (
                <label key={a} className="srp-check-row">
                  <input type="checkbox" checked={airlineFilters.includes(a)}
                    onChange={() => toggleStr(airlineFilters, a, setAirlineFilters)} />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </aside>

          {sidebarOpen && (
            <div className="srp-sidebar-overlay" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Results */}
          <div className="srp-results">

            {showingLoading && (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                <div className="srp-skeleton-header">
                  <div className="skel skel-line" style={{ width:180, height:16 }} />
                  <div className="skel skel-line" style={{ width:120, height:16 }} />
                </div>
                {[0,1,2,3,4].map(i => <Skeleton key={i} style={{ animationDelay:`${i*0.08}s` }} />)}
              </div>
            )}

            {!showingLoading && (<>
              <div className="srp-controls">
                <button
                  className={`srp-filter-btn${activeFilterCount > 0 ? ' has-filters' : ''}`}
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                  </svg>
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
                <div className="srp-sort-tabs">
                  {['Cheapest','Fastest','Best Value'].map(s => (
                    <button key={s} className={`srp-sort-tab${sort===s?' active':''}`} onClick={() => setSort(s)}>{s}</button>
                  ))}
                </div>
              </div>

              {activeList.length === 0 ? (
                <div className="srp-empty">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <p>No flights match your filters.</p>
                  <button onClick={() => { setStopFilters([]); setAirlineFilters([]) }}>Clear filters</button>
                </div>
              ) : (<>
                <div className="srp-disclaimer">
                  ⚠️ Please confirm exact price via WhatsApp before booking.
                </div>

                {activeList.map((f, i) => {
                  /* CTA button depends on mode */
                  let cta: React.ReactNode

                  if (!isRoundTrip) {
                    /* One-way: WhatsApp (primary) + optional Book Online affiliate */
                    cta = (
                      <>
                        <button className="srp-btn-wa" onClick={() => bookOneWayWA(f, sp)}>
                          <WaIcon /> Book via WhatsApp
                        </button>
                        {TP_MARKER && (
                          <a
                            className="srp-btn-online"
                            href={buildAffiliateUrl({ origin: f.depCode, destination: f.arrCode, date, adults: 1, marker: TP_MARKER })}
                            target="_blank"
                            rel="noopener nofollow sponsored"
                          >
                            🌐 Book Online
                          </a>
                        )}
                      </>
                    )
                  } else if (step === 'outbound') {
                    /* Round trip step 1: select outbound */
                    cta = (
                      <button
                        className="srp-btn-select"
                        onClick={() => {
                          setSelectedOutbound(f)
                          setStep('return')
                          setExpanded(null)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        Select →
                      </button>
                    )
                  } else {
                    /* Round trip step 2: book both */
                    cta = (
                      <button
                        className="srp-btn-wa srp-btn-rt"
                        onClick={() => selectedOutbound && bookRoundTripWA(selectedOutbound, f, sp, returnDate)}
                      >
                        <WaIcon /> Book Round Trip
                      </button>
                    )
                  }

                  return (
                    <FlightCard
                      key={f.id}
                      f={f}
                      expanded={expanded === f.id}
                      onExpand={() => setExpanded(expanded === f.id ? null : f.id)}
                      cta={cta}
                      adults={adults}
                    />
                  )
                })}
              </>)}
            </>)}
          </div>
        </div>
      </div>
    </>
  )
}

function WaIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}
