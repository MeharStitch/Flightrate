'use client'
import { useState, useRef, useEffect } from 'react'

interface Airport {
  code: string
  name: string
  city: string
  country: string
  flag: string
}

const ALL_AIRPORTS: Airport[] = [
  // Pakistan
  { code: 'ISB', name: 'Islamabad International', city: 'Islamabad', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'LHE', name: 'Allama Iqbal International', city: 'Lahore', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'KHI', name: 'Jinnah International', city: 'Karachi', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'PEW', name: 'Bacha Khan International', city: 'Peshawar', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'SKT', name: 'Sialkot International', city: 'Sialkot', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'MUX', name: 'Multan International', city: 'Multan', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'LYP', name: 'Faisalabad International', city: 'Faisalabad', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'UET', name: 'Quetta International', city: 'Quetta', country: 'Pakistan', flag: '🇵🇰' },
  { code: 'GWD', name: 'Gwadar International', city: 'Gwadar', country: 'Pakistan', flag: '🇵🇰' },
  // UAE
  { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE', flag: '🇦🇪' },
  { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'UAE', flag: '🇦🇪' },
  { code: 'SHJ', name: 'Sharjah International', city: 'Sharjah', country: 'UAE', flag: '🇦🇪' },
  { code: 'DWC', name: 'Al Maktoum International', city: 'Dubai South', country: 'UAE', flag: '🇦🇪' },
  // Saudi Arabia
  { code: 'RUH', name: 'King Khalid International', city: 'Riyadh', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'JED', name: 'King Abdulaziz International', city: 'Jeddah', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'MED', name: 'Prince Mohammad Bin Abdulaziz', city: 'Madinah', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'DMM', name: 'King Fahd International', city: 'Dammam', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'TIF', name: 'Taif Regional', city: 'Taif', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AHB', name: 'Abha Regional', city: 'Abha', country: 'Saudi Arabia', flag: '🇸🇦' },
  // Kuwait
  { code: 'KWI', name: 'Kuwait International', city: 'Kuwait City', country: 'Kuwait', flag: '🇰🇼' },
  // Bahrain
  { code: 'BAH', name: 'Bahrain International', city: 'Manama', country: 'Bahrain', flag: '🇧🇭' },
  // Qatar
  { code: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar', flag: '🇶🇦' },
  // Oman
  { code: 'MCT', name: 'Muscat International', city: 'Muscat', country: 'Oman', flag: '🇴🇲' },
  { code: 'SLL', name: 'Salalah Airport', city: 'Salalah', country: 'Oman', flag: '🇴🇲' },
  // UK
  { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK', flag: '🇬🇧' },
  { code: 'LGW', name: 'Gatwick Airport', city: 'London', country: 'UK', flag: '🇬🇧' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'UK', flag: '🇬🇧' },
  { code: 'BHX', name: 'Birmingham Airport', city: 'Birmingham', country: 'UK', flag: '🇬🇧' },
  // Europe
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France', flag: '🇫🇷' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', flag: '🇩🇪' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands', flag: '🇳🇱' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷' },
  { code: 'SAW', name: 'Sabiha Gokcen', city: 'Istanbul', country: 'Turkey', flag: '🇹🇷' },
  // South Asia
  { code: 'DEL', name: 'Indira Gandhi International', city: 'Delhi', country: 'India', flag: '🇮🇳' },
  { code: 'BOM', name: 'Chhatrapati Shivaji', city: 'Mumbai', country: 'India', flag: '🇮🇳' },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', country: 'India', flag: '🇮🇳' },
  { code: 'BLR', name: 'Kempegowda International', city: 'Bangalore', country: 'India', flag: '🇮🇳' },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', country: 'India', flag: '🇮🇳' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose', city: 'Kolkata', country: 'India', flag: '🇮🇳' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel', city: 'Ahmedabad', country: 'India', flag: '🇮🇳' },
  { code: 'TRV', name: 'Trivandrum International', city: 'Trivandrum', country: 'India', flag: '🇮🇳' },
  { code: 'COK', name: 'Cochin International', city: 'Kochi', country: 'India', flag: '🇮🇳' },
  { code: 'CMB', name: 'Bandaranaike International', city: 'Colombo', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: 'PNH', name: 'Phnom Penh International', city: 'Phnom Penh', country: 'Cambodia', flag: '🇰🇭' },
  { code: 'REP', name: 'Siem Reap International', city: 'Siem Reap', country: 'Cambodia', flag: '🇰🇭' },
  { code: 'KOS', name: 'Sihanoukville International', city: 'Sihanoukville', country: 'Cambodia', flag: '🇰🇭' },
  { code: 'DAC', name: 'Hazrat Shahjalal International', city: 'Dhaka', country: 'Bangladesh', flag: '🇧🇩' },
  { code: 'CGP', name: 'Shah Amanat International', city: 'Chittagong', country: 'Bangladesh', flag: '🇧🇩' },
  { code: 'KTM', name: 'Tribhuvan International', city: 'Kathmandu', country: 'Nepal', flag: '🇳🇵' },
  // Southeast Asia
  { code: 'KUL', name: 'Kuala Lumpur International', city: 'Kuala Lumpur', country: 'Malaysia', flag: '🇲🇾' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭' },
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { code: 'CGK', name: 'Soekarno-Hatta International', city: 'Jakarta', country: 'Indonesia', flag: '🇮🇩' },
  { code: 'MNL', name: 'Ninoy Aquino International', city: 'Manila', country: 'Philippines', flag: '🇵🇭' },
  // East Asia
  { code: 'PEK', name: 'Beijing Capital', city: 'Beijing', country: 'China', flag: '🇨🇳' },
  { code: 'PVG', name: 'Shanghai Pudong', city: 'Shanghai', country: 'China', flag: '🇨🇳' },
  { code: 'CAN', name: 'Guangzhou Baiyun', city: 'Guangzhou', country: 'China', flag: '🇨🇳' },
  { code: 'HKG', name: 'Hong Kong International', city: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo', country: 'Japan', flag: '🇯🇵' },
  { code: 'ICN', name: 'Incheon International', city: 'Seoul', country: 'South Korea', flag: '🇰🇷' },
  // Americas
  { code: 'JFK', name: 'John F. Kennedy International', city: 'New York', country: 'USA', flag: '🇺🇸' },
  { code: 'ORD', name: "O'Hare International", city: 'Chicago', country: 'USA', flag: '🇺🇸' },
  { code: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA', flag: '🇺🇸' },
  { code: 'IAD', name: 'Dulles International', city: 'Washington DC', country: 'USA', flag: '🇺🇸' },
  { code: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada', flag: '🇨🇦' },
  // Central Asia & Other
  { code: 'TAS', name: 'Tashkent International', city: 'Tashkent', country: 'Uzbekistan', flag: '🇺🇿' },
  { code: 'KBL', name: 'Hamid Karzai International', city: 'Kabul', country: 'Afghanistan', flag: '🇦🇫' },
  { code: 'IKA', name: 'Imam Khomeini International', city: 'Tehran', country: 'Iran', flag: '🇮🇷' },
  { code: 'NBO', name: 'Jomo Kenyatta International', city: 'Nairobi', country: 'Kenya', flag: '🇰🇪' },
  { code: 'ADD', name: 'Addis Ababa Bole', city: 'Addis Ababa', country: 'Ethiopia', flag: '🇪🇹' },
  { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt', flag: '🇪🇬' },
]

interface Props {
  label: string
  placeholder: string
  defaultValue?: string
  value?: string        // IATA code — controlled from parent (swap support)
  onChange?: (code: string) => void
}

function findByCode(code: string): Airport | null {
  return ALL_AIRPORTS.find(a => a.code === code) ?? null
}

export default function AirportSearch({ label, placeholder, defaultValue = '', value, onChange }: Props) {
  const initialAirport = value
    ? findByCode(value)
    : defaultValue
      ? ALL_AIRPORTS.find(a =>
          a.code === defaultValue ||
          a.city === defaultValue.split(' ')[0]
        ) ?? null
      : null

  const [query, setQuery]       = useState(defaultValue)
  const [focused, setFocused]   = useState(false)
  const [selected, setSelected] = useState<Airport | null>(initialAirport)

  // Sync when parent swaps value (controlled mode)
  useEffect(() => {
    if (!value) return
    const airport = findByCode(value)
    if (airport && airport.code !== selected?.code) {
      setSelected(airport)
      setQuery(`${airport.city} (${airport.code})`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  // Fire onChange with initial value
  useEffect(() => {
    if (initialAirport) onChange?.(initialAirport.code)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const ref     = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = query.length >= 1
    ? ALL_AIRPORTS.filter(a =>
        a.code.toLowerCase().includes(query.toLowerCase()) ||
        a.city.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.country.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : []

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setFocused(false)
        // Restore display if user typed but didn't pick
        if (focused && !selected) setQuery('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [focused, selected])

  const pick = (airport: Airport) => {
    setSelected(airport)
    setQuery(`${airport.city} (${airport.code})`)
    setFocused(false)
    onChange?.(airport.code)
  }

  const handleFocus = () => {
    setFocused(true)
    if (selected) {
      setQuery('')
      setSelected(null)
    }
  }

  const showDropdown = focused && filtered.length > 0

  return (
    <div className="ap-wrap" ref={ref}>
      <span className="sf-label">{label}</span>
      <div className={`ap-field ${focused ? 'ap-focused' : ''} ${selected ? 'ap-selected' : ''}`}>
        {selected && !focused && (
          <div className="ap-selected-display">
            <div className="ap-selected-info">
              <span className="ap-code">{selected.code}</span>
              <span className="ap-city">{selected.city}</span>
            </div>
          </div>
        )}
        <input
          ref={inputRef}
          type="text"
          className="ap-input"
          placeholder={selected && !focused ? '' : placeholder}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={handleFocus}
          autoComplete="off"
          style={{ opacity: selected && !focused ? 0 : 1, position: selected && !focused ? 'absolute' : 'relative' }}
        />
      </div>

      {showDropdown && (
        <div className="ap-dropdown">
          {filtered.map(airport => (
            <div key={airport.code} className="ap-option" onMouseDown={() => pick(airport)}>
              <div className="ap-opt-info">
                <div className="ap-opt-top">
                  <span className="ap-opt-flag">{airport.flag}</span>
                  <span className="ap-opt-code">{airport.code}</span>
                  <span className="ap-opt-city">{airport.city}</span>
                </div>
                <span className="ap-opt-name">{airport.name}</span>
              </div>
              <span className="ap-opt-country">{airport.country}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
