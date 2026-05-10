// Central route data — used by programmatic SEO pages + sitemap

export interface RouteCity {
  slug: string
  name: string
  code: string
  country: string
  urdu?: string          // Urdu name for Pakistan cities
}

export const PK_CITIES: RouteCity[] = [
  { slug: 'karachi',    name: 'Karachi',    code: 'KHI', country: 'Pakistan', urdu: 'کراچی' },
  { slug: 'lahore',     name: 'Lahore',     code: 'LHE', country: 'Pakistan', urdu: 'لاہور' },
  { slug: 'islamabad',  name: 'Islamabad',  code: 'ISB', country: 'Pakistan', urdu: 'اسلام آباد' },
  { slug: 'peshawar',   name: 'Peshawar',   code: 'PEW', country: 'Pakistan', urdu: 'پشاور' },
  { slug: 'sialkot',    name: 'Sialkot',    code: 'SKT', country: 'Pakistan', urdu: 'سیالکوٹ' },
  { slug: 'multan',     name: 'Multan',     code: 'MUX', country: 'Pakistan', urdu: 'ملتان' },
  { slug: 'faisalabad', name: 'Faisalabad', code: 'LYP', country: 'Pakistan', urdu: 'فیصل آباد' },
  { slug: 'quetta',     name: 'Quetta',     code: 'UET', country: 'Pakistan', urdu: 'کوئٹہ' },
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

// All forward routes (PK → Gulf)
export function getAllRoutes() {
  const routes: { from: RouteCity; to: RouteCity; slug: string }[] = []
  for (const from of PK_CITIES) {
    for (const to of DEST_CITIES) {
      routes.push({ from, to, slug: `${from.slug}-to-${to.slug}` })
    }
  }
  return routes
}

// Parse a route slug → from/to city
export function parseRouteSlug(slug: string): { from: RouteCity; to: RouteCity } | null {
  const all = getAllRoutes()
  const match = all.find(r => r.slug === slug)
  if (!match) return null
  return { from: match.from, to: match.to }
}

// Typical flight durations (minutes) for common routes
export const ROUTE_DURATION: Record<string, number> = {
  'KHI-DXB': 185, 'LHE-DXB': 210, 'ISB-DXB': 210, 'PEW-DXB': 195,
  'KHI-AUH': 200, 'LHE-AUH': 225, 'ISB-AUH': 225,
  'KHI-DOH': 205, 'LHE-DOH': 230, 'ISB-DOH': 230,
  'KHI-RUH': 240, 'LHE-RUH': 260, 'ISB-RUH': 255,
  'KHI-JED': 270, 'LHE-JED': 290, 'ISB-JED': 285,
  'KHI-KWI': 235, 'LHE-KWI': 255, 'ISB-KWI': 250,
  'KHI-MCT': 175, 'LHE-MCT': 200, 'ISB-MCT': 200,
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
  'KHI-KWI': ['Kuwait Airways', 'PIA', 'Jazeera Airways'],
  'KHI-MCT': ['Oman Air', 'PIA'],
}

export function getRouteAirlines(fromCode: string, toCode: string): string[] {
  return ROUTE_AIRLINES[`${fromCode}-${toCode}`] ?? ['PIA', 'Emirates', 'flydubai', 'Air Arabia']
}

export function getRouteDuration(fromCode: string, toCode: string): string {
  const mins = ROUTE_DURATION[`${fromCode}-${toCode}`] ?? 240
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
