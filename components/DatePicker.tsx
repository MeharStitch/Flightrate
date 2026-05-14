'use client'
import { useState, useRef, useEffect } from 'react'

interface Props {
  value: string        // YYYY-MM-DD
  onChange: (v: string) => void
  min?: string         // YYYY-MM-DD
  label?: string
}

const DAYS   = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December']

function parseYMD(s: string): [number, number, number] {
  const [y, m, d] = s.split('-').map(Number)
  return [y, m - 1, d]  // month is 0-indexed
}

function toYMD(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function fmt(s: string): string {
  if (!s) return ''
  const [y, m, d] = parseYMD(s)
  return `${String(d).padStart(2, '0')} ${MONTHS[m].slice(0, 3)} ${y}`
}

export default function DatePicker({ value, onChange, min, label }: Props) {
  const today = new Date()
  const todayStr = toYMD(today.getFullYear(), today.getMonth(), today.getDate())
  const minStr = min ?? todayStr

  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // View state — which month grid is showing
  const initDate = value ? parseYMD(value) : parseYMD(minStr)
  const [viewYear,  setViewYear]  = useState(initDate[0])
  const [viewMonth, setViewMonth] = useState(initDate[1])

  // Sync view when value changes externally
  useEffect(() => {
    if (value) {
      const [y, m] = parseYMD(value)
      setViewYear(y); setViewMonth(m)
    }
  }, [value])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function select(y: number, m: number, d: number) {
    const s = toYMD(y, m, d)
    if (s < minStr) return
    onChange(s)
    setOpen(false)
  }

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrev  = new Date(viewYear, viewMonth, 0).getDate()

  const cells: { y: number; m: number; d: number; curr: boolean }[] = []
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ y: viewMonth === 0 ? viewYear - 1 : viewYear, m: viewMonth === 0 ? 11 : viewMonth - 1, d: daysInPrev - i, curr: false })
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ y: viewYear, m: viewMonth, d, curr: true })
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++)
    cells.push({ y: viewMonth === 11 ? viewYear + 1 : viewYear, m: viewMonth === 11 ? 0 : viewMonth + 1, d, curr: false })

  return (
    <div className="dp-root" ref={ref}>
      {label && <span className="srp-date-label">{label}</span>}
      <button type="button" className="dp-trigger" onClick={() => setOpen(o => !o)}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
        <span className="dp-trigger-text">{value ? fmt(value) : 'Select date'}</span>
      </button>

      {open && (
        <div className="dp-popup">
          {/* Header */}
          <div className="dp-header">
            <button type="button" className="dp-nav" onClick={prevMonth}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <span className="dp-month-label">{MONTHS[viewMonth]} {viewYear}</span>
            <button type="button" className="dp-nav" onClick={nextMonth}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>

          {/* Day names */}
          <div className="dp-weekdays">
            {DAYS.map(d => <span key={d} className="dp-wd">{d}</span>)}
          </div>

          {/* Date grid */}
          <div className="dp-grid">
            {cells.map((c, i) => {
              const cStr   = toYMD(c.y, c.m, c.d)
              const isSelected = cStr === value
              const isToday    = cStr === todayStr
              const isPast     = cStr < minStr
              const isOther    = !c.curr
              return (
                <button
                  key={i}
                  type="button"
                  disabled={isPast}
                  onClick={() => select(c.y, c.m, c.d)}
                  className={[
                    'dp-day',
                    isSelected ? 'dp-selected' : '',
                    isToday && !isSelected ? 'dp-today' : '',
                    isPast ? 'dp-past' : '',
                    isOther ? 'dp-other' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {c.d}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="dp-footer">
            <button type="button" className="dp-foot-btn" onClick={() => { onChange(''); setOpen(false) }}>Clear</button>
            <button type="button" className="dp-foot-btn dp-foot-today" onClick={() => { onChange(todayStr); setOpen(false) }}>Today</button>
          </div>
        </div>
      )}
    </div>
  )
}
