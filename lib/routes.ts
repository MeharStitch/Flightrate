// Central route data — used by programmatic SEO pages + sitemap

export interface RouteCity {
  slug: string
  name: string
  code: string
  country: string
}

export const PK_CITIES: RouteCity[] = [
  { slug: 'karachi',    name: 'Karachi',    code: 'KHI', country: 'Pakistan' },
  { slug: 'lahore',     name: 'Lahore',     code: 'LHE', country: 'Pakistan' },
  { slug: 'islamabad',  name: 'Islamabad',  code: 'ISB', country: 'Pakistan' },
  { slug: 'peshawar',   name: 'Peshawar',   code: 'PEW', country: 'Pakistan' },
  { slug: 'sialkot',    name: 'Sialkot',    code: 'SKT', country: 'Pakistan' },
  { slug: 'multan',     name: 'Multan',     code: 'MUX', country: 'Pakistan' },
  { slug: 'faisalabad', name: 'Faisalabad', code: 'LYP', country: 'Pakistan' },
  { slug: 'quetta',     name: 'Quetta',     code: 'UET', country: 'Pakistan' },
]

export const DEST_CITIES: RouteCity[] = [
  { slug: 'dubai',       name: 'Dubai',       code: 'DXB', country: 'UAE' },
  { slug: 'abu-dhabi',   name: 'Abu Dhabi',   code: 'AUH', country: 'UAE' },
  { slug: 'sharjah',     name: 'Sharjah',     code: 'SHJ', country: 'UAE' },
  { slug: 'doha',        name: 'Doha',        code: 'DOH', country: 'Qatar' },
  { slug: 'riyadh',      name: 'Riyadh',      code: 'RUH', country: 'Saudi Arabia' },
  { slug: 'jeddah',      name: 'Jeddah',      code: 'JED', country: 'Saudi Arabia' },
  { slug: 'dammam',      name: 'Dammam',      code: 'DMM', country: 'Saudi Arabia' },
  { slug: 'madinah',     name: 'Madinah',     code: 'MED', country: 'Saudi Arabia' },
  { slug: 'kuwait-city', name: 'Kuwait City', code: 'KWI', country: 'Kuwait' },
  { slug: 'muscat',      name: 'Muscat',      code: 'MCT', country: 'Oman' },
  { slug: 'bahrain',     name: 'Bahrain',     code: 'BAH', country: 'Bahrain' },
]

// Diaspora destinations — only paired with KHI/LHE/ISB (high-traffic only)
export const DIASPORA_CITIES: RouteCity[] = [
  { slug: 'manchester', name: 'Manchester', code: 'MAN', country: 'UK' },
  { slug: 'london',     name: 'London',     code: 'LHR', country: 'UK' },
  { slug: 'birmingham', name: 'Birmingham', code: 'BHX', country: 'UK' },
  { slug: 'toronto',    name: 'Toronto',    code: 'YYZ', country: 'Canada' },
  { slug: 'new-york',   name: 'New York',   code: 'JFK', country: 'USA' },
  { slug: 'chicago',    name: 'Chicago',    code: 'ORD', country: 'USA' },
]

const DIASPORA_PK = PK_CITIES.filter(c => ['KHI', 'LHE', 'ISB'].includes(c.code))

// Pakistan → Gulf (88 routes)
export function getForwardRoutes() {
  const routes: { from: RouteCity; to: RouteCity; slug: string }[] = []
  for (const from of PK_CITIES) {
    for (const to of DEST_CITIES) {
      routes.push({ from, to, slug: `${from.slug}-to-${to.slug}` })
    }
  }
  return routes
}

// Gulf → Pakistan (88 routes — expat return market)
export function getReverseRoutes() {
  const routes: { from: RouteCity; to: RouteCity; slug: string }[] = []
  for (const from of DEST_CITIES) {
    for (const to of PK_CITIES) {
      routes.push({ from, to, slug: `${from.slug}-to-${to.slug}` })
    }
  }
  return routes
}

// Pakistan → UK/Canada/USA diaspora (18 routes: KHI/LHE/ISB only)
export function getDiasporaRoutes() {
  const routes: { from: RouteCity; to: RouteCity; slug: string }[] = []
  for (const from of DIASPORA_PK) {
    for (const to of DIASPORA_CITIES) {
      routes.push({ from, to, slug: `${from.slug}-to-${to.slug}` })
    }
  }
  return routes
}

// UK/Canada/USA → Pakistan (return legs — diaspora flying home)
export function getReverseDiasporaRoutes() {
  const routes: { from: RouteCity; to: RouteCity; slug: string }[] = []
  for (const from of DIASPORA_CITIES) {
    for (const to of DIASPORA_PK) {
      routes.push({ from, to, slug: `${from.slug}-to-${to.slug}` })
    }
  }
  return routes
}

// All routes combined for static page generation
export function getAllRoutes() {
  return [...getForwardRoutes(), ...getReverseRoutes(), ...getDiasporaRoutes(), ...getReverseDiasporaRoutes()]
}

// Parse a route slug → from/to city
export function parseRouteSlug(slug: string): { from: RouteCity; to: RouteCity } | null {
  const match = getAllRoutes().find(r => r.slug === slug)
  return match ? { from: match.from, to: match.to } : null
}

// Typical flight durations (minutes)
export const ROUTE_DURATION: Record<string, number> = {
  // Pakistan → Gulf
  'KHI-DXB': 185, 'LHE-DXB': 210, 'ISB-DXB': 210, 'PEW-DXB': 195,
  'KHI-AUH': 200, 'LHE-AUH': 225, 'ISB-AUH': 225,
  'KHI-DOH': 205, 'LHE-DOH': 230, 'ISB-DOH': 230,
  'KHI-RUH': 240, 'LHE-RUH': 260, 'ISB-RUH': 255,
  'KHI-JED': 270, 'LHE-JED': 290, 'ISB-JED': 285,
  'KHI-KWI': 235, 'LHE-KWI': 255, 'ISB-KWI': 250,
  'KHI-MCT': 175, 'LHE-MCT': 200, 'ISB-MCT': 200,
  'KHI-SHJ': 190, 'LHE-SHJ': 215, 'ISB-SHJ': 215,
  'KHI-BAH': 220, 'LHE-BAH': 245, 'ISB-BAH': 245,
  'KHI-DMM': 235, 'LHE-DMM': 255, 'ISB-DMM': 255,
  'KHI-MED': 255, 'LHE-MED': 275, 'ISB-MED': 275,
  'MUX-MED': 265, 'PEW-MED': 270, 'SKT-MED': 270, 'LYP-MED': 265, 'UET-MED': 260,
  // Gulf → Pakistan (same duration, reversed)
  'DXB-KHI': 185, 'DXB-LHE': 210, 'DXB-ISB': 210, 'DXB-PEW': 195,
  'DXB-MUX': 210, 'DXB-SKT': 215, 'DXB-LYP': 220, 'DXB-UET': 200,
  'RUH-KHI': 240, 'RUH-LHE': 260, 'RUH-ISB': 255,
  'JED-KHI': 270, 'JED-LHE': 290, 'JED-ISB': 285,
  'DOH-KHI': 205, 'DOH-LHE': 230, 'DOH-ISB': 230,
  'AUH-KHI': 200, 'AUH-LHE': 225, 'AUH-ISB': 225,
  'SHJ-KHI': 190, 'SHJ-LHE': 215, 'SHJ-ISB': 215,
  'KWI-KHI': 235, 'MCT-KHI': 175, 'MCT-LHE': 200,
  'BAH-KHI': 220, 'DMM-KHI': 235, 'DMM-LHE': 255,
  'MED-KHI': 255, 'MED-LHE': 275,
  // Pakistan → Diaspora
  'KHI-MAN': 570, 'LHE-MAN': 600, 'ISB-MAN': 585,
  'KHI-LHR': 510, 'LHE-LHR': 540, 'ISB-LHR': 495,
  'KHI-BHX': 525, 'LHE-BHX': 510, 'ISB-BHX': 480,
  'KHI-JFK': 960, 'LHE-JFK': 990, 'ISB-JFK': 975,
  'KHI-YYZ': 1020,'LHE-YYZ': 1050,'ISB-YYZ': 1035,
  'KHI-ORD': 1020,'LHE-ORD': 1050,'ISB-ORD': 1020,
  // Reverse diaspora (same durations, getRouteDuration does reverse lookup)
  'MAN-KHI': 570, 'MAN-LHE': 600, 'MAN-ISB': 585,
  'LHR-KHI': 510, 'LHR-LHE': 540, 'LHR-ISB': 495,
  'BHX-KHI': 525, 'BHX-LHE': 510, 'BHX-ISB': 480,
  'JFK-KHI': 960, 'JFK-LHE': 990, 'JFK-ISB': 975,
  'YYZ-KHI': 1020,'YYZ-LHE': 1050,'YYZ-ISB': 1035,
  'ORD-KHI': 1020,'ORD-LHE': 1050,'ORD-ISB': 1020,
}

// Airlines typically serving a route
export const ROUTE_AIRLINES: Record<string, string[]> = {
  'KHI-DXB': ['Emirates', 'flydubai', 'PIA', 'Air Arabia', 'Airblue'],
  'LHE-DXB': ['Emirates', 'flydubai', 'PIA', 'Air Arabia', 'FlyJinnah'],
  'ISB-DXB': ['Emirates', 'flydubai', 'PIA', 'Air Arabia', 'Serene Air'],
  'KHI-DOH': ['Qatar Airways', 'PIA'],
  'LHE-DOH': ['Qatar Airways', 'PIA'],
  'ISB-DOH': ['Qatar Airways', 'PIA'],
  'KHI-RUH': ['Saudia', 'PIA', 'flynas'],
  'LHE-RUH': ['Saudia', 'PIA', 'flynas'],
  'ISB-RUH': ['Saudia', 'PIA', 'flynas'],
  'KHI-JED': ['Saudia', 'PIA', 'flynas'],
  'LHE-JED': ['Saudia', 'PIA', 'flynas'],
  'ISB-JED': ['Saudia', 'PIA', 'flynas'],
  'MUX-JED': ['Saudia', 'PIA'],
  'PEW-JED': ['Saudia', 'PIA'],
  // Madinah routes (Umrah/Hajj pilgrimage)
  'KHI-MED': ['Saudia', 'PIA', 'flynas'],
  'LHE-MED': ['Saudia', 'PIA', 'flynas'],
  'ISB-MED': ['Saudia', 'PIA', 'flynas'],
  'MUX-MED': ['Saudia', 'PIA'],
  'PEW-MED': ['Saudia', 'PIA'],
  'SKT-MED': ['Saudia', 'PIA'],
  'LYP-MED': ['Saudia', 'PIA'],
  // Dammam routes
  'KHI-DMM': ['Saudia', 'PIA', 'flynas'],
  'LHE-DMM': ['Saudia', 'PIA', 'flynas'],
  'ISB-DMM': ['Saudia', 'PIA'],
  // Bahrain routes
  'KHI-BAH': ['Gulf Air', 'PIA'],
  'LHE-BAH': ['Gulf Air', 'PIA'],
  // Muscat routes
  'LHE-MCT': ['Oman Air', 'PIA'],
  'ISB-MCT': ['Oman Air', 'PIA'],
  // Kuwait extra cities
  'LHE-KWI': ['Kuwait Airways', 'PIA', 'Jazeera Airways'],
  'ISB-KWI': ['Kuwait Airways', 'PIA'],
  'KHI-KWI': ['Kuwait Airways', 'PIA', 'Jazeera Airways'],
  'KHI-MCT': ['Oman Air', 'PIA'],
  // Diaspora → UK
  'KHI-MAN': ['PIA', 'Qatar Airways', 'Emirates', 'Turkish Airlines'],
  'LHE-MAN': ['PIA', 'Qatar Airways', 'Emirates', 'Turkish Airlines'],
  'ISB-MAN': ['PIA', 'Qatar Airways', 'Emirates', 'British Airways'],
  'KHI-LHR': ['PIA', 'British Airways', 'Qatar Airways', 'Emirates'],
  'LHE-LHR': ['PIA', 'British Airways', 'Qatar Airways', 'Emirates'],
  'ISB-LHR': ['PIA', 'British Airways', 'Qatar Airways', 'Emirates'],
  'KHI-BHX': ['PIA', 'Qatar Airways', 'Emirates', 'Turkish Airlines'],
  'LHE-BHX': ['PIA', 'Qatar Airways', 'Emirates', 'Turkish Airlines'],
  'ISB-BHX': ['PIA', 'Qatar Airways', 'Emirates', 'Turkish Airlines'],
  // Diaspora → USA/Canada
  'KHI-JFK': ['Qatar Airways', 'Emirates', 'Turkish Airlines', 'British Airways'],
  'LHE-JFK': ['Qatar Airways', 'Emirates', 'Turkish Airlines', 'British Airways'],
  'ISB-JFK': ['Qatar Airways', 'Emirates', 'Turkish Airlines', 'British Airways'],
  'KHI-YYZ': ['Qatar Airways', 'Emirates', 'Turkish Airlines', 'Air Canada'],
  'LHE-YYZ': ['Qatar Airways', 'Emirates', 'Turkish Airlines', 'Air Canada'],
  'ISB-YYZ': ['Qatar Airways', 'Emirates', 'Turkish Airlines', 'Air Canada'],
  'KHI-ORD': ['Qatar Airways', 'Emirates', 'Turkish Airlines', 'United Airlines'],
  'LHE-ORD': ['Qatar Airways', 'Emirates', 'Turkish Airlines', 'United Airlines'],
  'ISB-ORD': ['Qatar Airways', 'Emirates', 'Turkish Airlines', 'United Airlines'],
}

export function getRouteAirlines(fromCode: string, toCode: string): string[] {
  const key = `${fromCode}-${toCode}`
  const reverse = `${toCode}-${fromCode}`
  return ROUTE_AIRLINES[key] ?? ROUTE_AIRLINES[reverse] ?? ['PIA', 'Emirates', 'flydubai', 'Air Arabia']
}

export function getRouteDuration(fromCode: string, toCode: string): string {
  const mins = ROUTE_DURATION[`${fromCode}-${toCode}`] ?? ROUTE_DURATION[`${toCode}-${fromCode}`] ?? 240
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ─── Baggage allowances by airline ───────────────────────────────────────────
export const BAGGAGE: Record<string, { checkin: string; cabin: string }> = {
  'Emirates':         { checkin: '30 kg', cabin: '7 kg' },
  'Etihad Airways':   { checkin: '23 kg', cabin: '7 kg' },
  'Qatar Airways':    { checkin: '23 kg', cabin: '7 kg' },
  'PIA':              { checkin: '23 kg', cabin: '7 kg' },
  'Saudia':           { checkin: '23 kg', cabin: '7 kg' },
  'Oman Air':         { checkin: '23 kg', cabin: '7 kg' },
  'Kuwait Airways':   { checkin: '23 kg', cabin: '7 kg' },
  'Gulf Air':         { checkin: '23 kg', cabin: '7 kg' },
  'British Airways':  { checkin: '23 kg', cabin: '12 kg' },
  'Air Canada':       { checkin: '23 kg', cabin: '10 kg' },
  'United Airlines':  { checkin: '23 kg', cabin: '9 kg' },
  'Turkish Airlines': { checkin: '20 kg', cabin: '8 kg' },
  'flydubai':         { checkin: '20 kg', cabin: '7 kg' },
  'Air Arabia':       { checkin: '20 kg', cabin: '10 kg' },
  'flynas':           { checkin: '20 kg', cabin: '7 kg' },
  'Airblue':          { checkin: '20 kg', cabin: '7 kg' },
  'Serene Air':       { checkin: '20 kg', cabin: '7 kg' },
  'FlyJinnah':        { checkin: '20 kg', cabin: '7 kg' },
  'Jazeera Airways':  { checkin: '20 kg', cabin: '7 kg' },
}
