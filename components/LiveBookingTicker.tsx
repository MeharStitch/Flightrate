'use client'
import { useEffect, useState } from 'react'

const BOOKINGS = [
  { name: 'Ahmed K.',    city: 'Karachi',    route: 'KHI → DXB', min: 2  },
  { name: 'Fatima S.',   city: 'Lahore',     route: 'LHE → RUH', min: 5  },
  { name: 'Usman R.',    city: 'Dubai',      route: 'DXB → ISB', min: 8  },
  { name: 'Sara M.',     city: 'Islamabad',  route: 'ISB → DOH', min: 11 },
  { name: 'Hassan A.',   city: 'Manchester', route: 'MAN → KHI', min: 14 },
  { name: 'Zainab N.',   city: 'Peshawar',   route: 'PEW → DXB', min: 17 },
  { name: 'Bilal Ch.',   city: 'Riyadh',     route: 'RUH → LHE', min: 21 },
  { name: 'Amna K.',     city: 'Sialkot',    route: 'SKT → DXB', min: 24 },
  { name: 'Tariq M.',    city: 'London',     route: 'LHR → KHI', min: 27 },
  { name: 'Rabia T.',    city: 'Multan',     route: 'MUX → RUH', min: 31 },
  { name: 'Imran B.',    city: 'Toronto',    route: 'YYZ → ISB', min: 34 },
  { name: 'Nadia F.',    city: 'Faisalabad', route: 'LYP → DXB', min: 38 },
]

export default function LiveBookingTicker() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % BOOKINGS.length)
        setVisible(true)
      }, 400)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const b = BOOKINGS[idx]

  return (
    <div className="ticker-bar">
      <span className="ticker-dot" />
      <span className="ticker-live">LIVE</span>
      <span className={`ticker-msg ${visible ? 'ticker-in' : 'ticker-out'}`}>
        <strong>{b.name}</strong> from {b.city} just booked&nbsp;
        <span className="ticker-route">{b.route}</span>
        &nbsp;· {b.min} min ago
        <span className="ticker-check">✓</span>
      </span>
    </div>
  )
}
