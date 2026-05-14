// All routes to scrape — tiered by traffic priority

export interface ScrapeRoute {
  from: string  // IATA code
  to: string
  fromCity: string
  toCity: string
  tier: 1 | 2 | 3  // 1=top routes, 2=medium, 3=long-tail
}

export const SCRAPE_ROUTES: ScrapeRoute[] = [
  // ── TIER 1: Pakistan → Gulf (high booking volume) ─────────────────
  { from: 'KHI', to: 'DXB', fromCity: 'Karachi',    toCity: 'Dubai',        tier: 1 },
  { from: 'LHE', to: 'DXB', fromCity: 'Lahore',     toCity: 'Dubai',        tier: 1 },
  { from: 'ISB', to: 'DXB', fromCity: 'Islamabad',  toCity: 'Dubai',        tier: 1 },
  { from: 'KHI', to: 'RUH', fromCity: 'Karachi',    toCity: 'Riyadh',       tier: 1 },
  { from: 'LHE', to: 'RUH', fromCity: 'Lahore',     toCity: 'Riyadh',       tier: 1 },
  { from: 'ISB', to: 'RUH', fromCity: 'Islamabad',  toCity: 'Riyadh',       tier: 1 },
  { from: 'KHI', to: 'JED', fromCity: 'Karachi',    toCity: 'Jeddah',       tier: 1 },
  { from: 'LHE', to: 'JED', fromCity: 'Lahore',     toCity: 'Jeddah',       tier: 1 },
  { from: 'KHI', to: 'DOH', fromCity: 'Karachi',    toCity: 'Doha',         tier: 1 },
  { from: 'LHE', to: 'DOH', fromCity: 'Lahore',     toCity: 'Doha',         tier: 1 },
  { from: 'ISB', to: 'DOH', fromCity: 'Islamabad',  toCity: 'Doha',         tier: 1 },
  { from: 'PEW', to: 'DXB', fromCity: 'Peshawar',   toCity: 'Dubai',        tier: 1 },
  { from: 'SKT', to: 'DXB', fromCity: 'Sialkot',    toCity: 'Dubai',        tier: 1 },
  { from: 'MUX', to: 'RUH', fromCity: 'Multan',     toCity: 'Riyadh',       tier: 1 },
  { from: 'KHI', to: 'KWI', fromCity: 'Karachi',    toCity: 'Kuwait City',  tier: 1 },

  // ── TIER 1: Gulf → Pakistan (return legs — expat market) ──────────
  { from: 'DXB', to: 'KHI', fromCity: 'Dubai',      toCity: 'Karachi',      tier: 1 },
  { from: 'DXB', to: 'LHE', fromCity: 'Dubai',      toCity: 'Lahore',       tier: 1 },
  { from: 'DXB', to: 'ISB', fromCity: 'Dubai',      toCity: 'Islamabad',    tier: 1 },
  { from: 'RUH', to: 'KHI', fromCity: 'Riyadh',    toCity: 'Karachi',      tier: 1 },
  { from: 'RUH', to: 'LHE', fromCity: 'Riyadh',    toCity: 'Lahore',       tier: 1 },
  { from: 'RUH', to: 'ISB', fromCity: 'Riyadh',    toCity: 'Islamabad',    tier: 1 },
  { from: 'JED', to: 'KHI', fromCity: 'Jeddah',    toCity: 'Karachi',      tier: 1 },
  { from: 'JED', to: 'LHE', fromCity: 'Jeddah',    toCity: 'Lahore',       tier: 1 },
  { from: 'DOH', to: 'KHI', fromCity: 'Doha',      toCity: 'Karachi',      tier: 1 },
  { from: 'DOH', to: 'LHE', fromCity: 'Doha',      toCity: 'Lahore',       tier: 1 },
  { from: 'DOH', to: 'ISB', fromCity: 'Doha',      toCity: 'Islamabad',    tier: 1 },

  // ── TIER 1: Pakistan → Diaspora (UK / Canada / USA) ──────────────
  { from: 'KHI', to: 'MAN', fromCity: 'Karachi',   toCity: 'Manchester',   tier: 1 },
  { from: 'LHE', to: 'MAN', fromCity: 'Lahore',    toCity: 'Manchester',   tier: 1 },
  { from: 'ISB', to: 'MAN', fromCity: 'Islamabad', toCity: 'Manchester',   tier: 1 },
  { from: 'KHI', to: 'LHR', fromCity: 'Karachi',   toCity: 'London',       tier: 1 },
  { from: 'LHE', to: 'LHR', fromCity: 'Lahore',    toCity: 'London',       tier: 1 },
  { from: 'ISB', to: 'LHR', fromCity: 'Islamabad', toCity: 'London',       tier: 1 },
  { from: 'KHI', to: 'BHX', fromCity: 'Karachi',   toCity: 'Birmingham',   tier: 1 },
  { from: 'LHE', to: 'BHX', fromCity: 'Lahore',    toCity: 'Birmingham',   tier: 1 },
  { from: 'ISB', to: 'BHX', fromCity: 'Islamabad', toCity: 'Birmingham',   tier: 1 },
  { from: 'KHI', to: 'YYZ', fromCity: 'Karachi',   toCity: 'Toronto',      tier: 1 },
  { from: 'LHE', to: 'YYZ', fromCity: 'Lahore',    toCity: 'Toronto',      tier: 1 },
  { from: 'ISB', to: 'YYZ', fromCity: 'Islamabad', toCity: 'Toronto',      tier: 1 },
  { from: 'KHI', to: 'JFK', fromCity: 'Karachi',   toCity: 'New York',     tier: 1 },
  { from: 'LHE', to: 'JFK', fromCity: 'Lahore',    toCity: 'New York',     tier: 1 },
  { from: 'ISB', to: 'JFK', fromCity: 'Islamabad', toCity: 'New York',     tier: 1 },

  // ── TIER 1: Diaspora → Pakistan (return legs) ─────────────────────
  { from: 'MAN', to: 'KHI', fromCity: 'Manchester', toCity: 'Karachi',     tier: 1 },
  { from: 'MAN', to: 'LHE', fromCity: 'Manchester', toCity: 'Lahore',      tier: 1 },
  { from: 'MAN', to: 'ISB', fromCity: 'Manchester', toCity: 'Islamabad',   tier: 1 },
  { from: 'LHR', to: 'KHI', fromCity: 'London',     toCity: 'Karachi',     tier: 1 },
  { from: 'LHR', to: 'LHE', fromCity: 'London',     toCity: 'Lahore',      tier: 1 },
  { from: 'LHR', to: 'ISB', fromCity: 'London',     toCity: 'Islamabad',   tier: 1 },
  { from: 'JFK', to: 'KHI', fromCity: 'New York',   toCity: 'Karachi',     tier: 1 },
  { from: 'JFK', to: 'LHE', fromCity: 'New York',   toCity: 'Lahore',      tier: 1 },
  { from: 'JFK', to: 'ISB', fromCity: 'New York',   toCity: 'Islamabad',   tier: 1 },
  { from: 'YYZ', to: 'KHI', fromCity: 'Toronto',    toCity: 'Karachi',     tier: 1 },
  { from: 'YYZ', to: 'LHE', fromCity: 'Toronto',    toCity: 'Lahore',      tier: 1 },
  { from: 'YYZ', to: 'ISB', fromCity: 'Toronto',    toCity: 'Islamabad',   tier: 1 },

  // ── TIER 2: More diaspora routes ──────────────────────────────────
  { from: 'KHI', to: 'ORD', fromCity: 'Karachi',    toCity: 'Chicago',     tier: 2 },
  { from: 'LHE', to: 'ORD', fromCity: 'Lahore',     toCity: 'Chicago',     tier: 2 },
  { from: 'ISB', to: 'ORD', fromCity: 'Islamabad',  toCity: 'Chicago',     tier: 2 },
  { from: 'BHX', to: 'KHI', fromCity: 'Birmingham', toCity: 'Karachi',     tier: 2 },
  { from: 'BHX', to: 'LHE', fromCity: 'Birmingham', toCity: 'Lahore',      tier: 2 },
  { from: 'BHX', to: 'ISB', fromCity: 'Birmingham', toCity: 'Islamabad',   tier: 2 },
  { from: 'ORD', to: 'KHI', fromCity: 'Chicago',    toCity: 'Karachi',     tier: 2 },
  { from: 'ORD', to: 'LHE', fromCity: 'Chicago',    toCity: 'Lahore',      tier: 2 },
  { from: 'ORD', to: 'ISB', fromCity: 'Chicago',    toCity: 'Islamabad',   tier: 2 },

  // ── TIER 2: Pakistan → Gulf (medium routes) ───────────────────────
  { from: 'ISB', to: 'JED', fromCity: 'Islamabad', toCity: 'Jeddah',       tier: 2 },
  { from: 'KHI', to: 'AUH', fromCity: 'Karachi',   toCity: 'Abu Dhabi',    tier: 2 },
  { from: 'LHE', to: 'AUH', fromCity: 'Lahore',    toCity: 'Abu Dhabi',    tier: 2 },
  { from: 'ISB', to: 'AUH', fromCity: 'Islamabad', toCity: 'Abu Dhabi',    tier: 2 },
  { from: 'KHI', to: 'SHJ', fromCity: 'Karachi',   toCity: 'Sharjah',      tier: 2 },
  { from: 'LHE', to: 'SHJ', fromCity: 'Lahore',    toCity: 'Sharjah',      tier: 2 },
  { from: 'ISB', to: 'SHJ', fromCity: 'Islamabad', toCity: 'Sharjah',      tier: 2 },
  { from: 'KHI', to: 'MCT', fromCity: 'Karachi',   toCity: 'Muscat',       tier: 2 },
  { from: 'LHE', to: 'MCT', fromCity: 'Lahore',    toCity: 'Muscat',       tier: 2 },
  { from: 'KHI', to: 'BAH', fromCity: 'Karachi',   toCity: 'Manama',       tier: 2 },
  { from: 'KHI', to: 'DMM', fromCity: 'Karachi',   toCity: 'Dammam',       tier: 2 },
  { from: 'LHE', to: 'DMM', fromCity: 'Lahore',    toCity: 'Dammam',       tier: 2 },
  { from: 'KHI', to: 'MED', fromCity: 'Karachi',   toCity: 'Madinah',      tier: 2 },
  { from: 'LHE', to: 'MED', fromCity: 'Lahore',    toCity: 'Madinah',      tier: 2 },
  { from: 'PEW', to: 'RUH', fromCity: 'Peshawar',  toCity: 'Riyadh',       tier: 2 },
  { from: 'MUX', to: 'DXB', fromCity: 'Multan',    toCity: 'Dubai',        tier: 2 },
  { from: 'LYP', to: 'DXB', fromCity: 'Faisalabad',toCity: 'Dubai',        tier: 2 },

  // ── TIER 2: Gulf → Pakistan (reverse medium) ──────────────────────
  { from: 'DXB', to: 'PEW', fromCity: 'Dubai',     toCity: 'Peshawar',     tier: 2 },
  { from: 'DXB', to: 'SKT', fromCity: 'Dubai',     toCity: 'Sialkot',      tier: 2 },
  { from: 'DXB', to: 'MUX', fromCity: 'Dubai',     toCity: 'Multan',       tier: 2 },
  { from: 'DXB', to: 'LYP', fromCity: 'Dubai',     toCity: 'Faisalabad',   tier: 2 },
  { from: 'RUH', to: 'MUX', fromCity: 'Riyadh',   toCity: 'Multan',       tier: 2 },
  { from: 'RUH', to: 'PEW', fromCity: 'Riyadh',   toCity: 'Peshawar',     tier: 2 },
  { from: 'JED', to: 'ISB', fromCity: 'Jeddah',   toCity: 'Islamabad',    tier: 2 },
  { from: 'AUH', to: 'KHI', fromCity: 'Abu Dhabi',toCity: 'Karachi',      tier: 2 },
  { from: 'AUH', to: 'LHE', fromCity: 'Abu Dhabi',toCity: 'Lahore',       tier: 2 },
  { from: 'AUH', to: 'ISB', fromCity: 'Abu Dhabi',toCity: 'Islamabad',    tier: 2 },
  { from: 'SHJ', to: 'KHI', fromCity: 'Sharjah',  toCity: 'Karachi',      tier: 2 },
  { from: 'SHJ', to: 'LHE', fromCity: 'Sharjah',  toCity: 'Lahore',       tier: 2 },
  { from: 'SHJ', to: 'ISB', fromCity: 'Sharjah',  toCity: 'Islamabad',    tier: 2 },

  // ── TIER 3: Long-tail Pakistan → Gulf ─────────────────────────────
  { from: 'ISB', to: 'MCT', fromCity: 'Islamabad', toCity: 'Muscat',       tier: 3 },
  { from: 'ISB', to: 'KWI', fromCity: 'Islamabad', toCity: 'Kuwait City',  tier: 3 },
  { from: 'ISB', to: 'BAH', fromCity: 'Islamabad', toCity: 'Manama',       tier: 3 },
  { from: 'ISB', to: 'DMM', fromCity: 'Islamabad', toCity: 'Dammam',       tier: 3 },
  { from: 'ISB', to: 'MED', fromCity: 'Islamabad', toCity: 'Madinah',      tier: 3 },
  { from: 'PEW', to: 'JED', fromCity: 'Peshawar',  toCity: 'Jeddah',       tier: 3 },
  { from: 'PEW', to: 'DOH', fromCity: 'Peshawar',  toCity: 'Doha',         tier: 3 },
  { from: 'PEW', to: 'AUH', fromCity: 'Peshawar',  toCity: 'Abu Dhabi',    tier: 3 },
  { from: 'PEW', to: 'KWI', fromCity: 'Peshawar',  toCity: 'Kuwait City',  tier: 3 },
  { from: 'PEW', to: 'MCT', fromCity: 'Peshawar',  toCity: 'Muscat',       tier: 3 },
  { from: 'PEW', to: 'SHJ', fromCity: 'Peshawar',  toCity: 'Sharjah',      tier: 3 },
  { from: 'PEW', to: 'MED', fromCity: 'Peshawar',  toCity: 'Madinah',      tier: 3 },
  { from: 'PEW', to: 'DMM', fromCity: 'Peshawar',  toCity: 'Dammam',       tier: 3 },
  { from: 'PEW', to: 'BAH', fromCity: 'Peshawar',  toCity: 'Manama',       tier: 3 },
  { from: 'SKT', to: 'RUH', fromCity: 'Sialkot',   toCity: 'Riyadh',       tier: 3 },
  { from: 'SKT', to: 'JED', fromCity: 'Sialkot',   toCity: 'Jeddah',       tier: 3 },
  { from: 'SKT', to: 'DOH', fromCity: 'Sialkot',   toCity: 'Doha',         tier: 3 },
  { from: 'SKT', to: 'AUH', fromCity: 'Sialkot',   toCity: 'Abu Dhabi',    tier: 3 },
  { from: 'SKT', to: 'SHJ', fromCity: 'Sialkot',   toCity: 'Sharjah',      tier: 3 },
  { from: 'SKT', to: 'KWI', fromCity: 'Sialkot',   toCity: 'Kuwait City',  tier: 3 },
  { from: 'SKT', to: 'MCT', fromCity: 'Sialkot',   toCity: 'Muscat',       tier: 3 },
  { from: 'SKT', to: 'BAH', fromCity: 'Sialkot',   toCity: 'Manama',       tier: 3 },
  { from: 'SKT', to: 'DMM', fromCity: 'Sialkot',   toCity: 'Dammam',       tier: 3 },
  { from: 'SKT', to: 'MED', fromCity: 'Sialkot',   toCity: 'Madinah',      tier: 3 },
  { from: 'MUX', to: 'JED', fromCity: 'Multan',    toCity: 'Jeddah',       tier: 3 },
  { from: 'MUX', to: 'DOH', fromCity: 'Multan',    toCity: 'Doha',         tier: 3 },
  { from: 'MUX', to: 'AUH', fromCity: 'Multan',    toCity: 'Abu Dhabi',    tier: 3 },
  { from: 'MUX', to: 'SHJ', fromCity: 'Multan',    toCity: 'Sharjah',      tier: 3 },
  { from: 'MUX', to: 'KWI', fromCity: 'Multan',    toCity: 'Kuwait City',  tier: 3 },
  { from: 'MUX', to: 'MCT', fromCity: 'Multan',    toCity: 'Muscat',       tier: 3 },
  { from: 'MUX', to: 'BAH', fromCity: 'Multan',    toCity: 'Manama',       tier: 3 },
  { from: 'MUX', to: 'DMM', fromCity: 'Multan',    toCity: 'Dammam',       tier: 3 },
  { from: 'MUX', to: 'MED', fromCity: 'Multan',    toCity: 'Madinah',      tier: 3 },
  { from: 'LYP', to: 'RUH', fromCity: 'Faisalabad',toCity: 'Riyadh',       tier: 3 },
  { from: 'LYP', to: 'JED', fromCity: 'Faisalabad',toCity: 'Jeddah',       tier: 3 },
  { from: 'LYP', to: 'DOH', fromCity: 'Faisalabad',toCity: 'Doha',         tier: 3 },
  { from: 'LYP', to: 'AUH', fromCity: 'Faisalabad',toCity: 'Abu Dhabi',    tier: 3 },
  { from: 'LYP', to: 'SHJ', fromCity: 'Faisalabad',toCity: 'Sharjah',      tier: 3 },
  { from: 'LYP', to: 'KWI', fromCity: 'Faisalabad',toCity: 'Kuwait City',  tier: 3 },
  { from: 'LYP', to: 'MCT', fromCity: 'Faisalabad',toCity: 'Muscat',       tier: 3 },
  { from: 'LYP', to: 'BAH', fromCity: 'Faisalabad',toCity: 'Manama',       tier: 3 },
  { from: 'LYP', to: 'DMM', fromCity: 'Faisalabad',toCity: 'Dammam',       tier: 3 },
  { from: 'LYP', to: 'MED', fromCity: 'Faisalabad',toCity: 'Madinah',      tier: 3 },
  { from: 'UET', to: 'DXB', fromCity: 'Quetta',    toCity: 'Dubai',        tier: 3 },
  { from: 'UET', to: 'RUH', fromCity: 'Quetta',    toCity: 'Riyadh',       tier: 3 },
  { from: 'UET', to: 'JED', fromCity: 'Quetta',    toCity: 'Jeddah',       tier: 3 },
  { from: 'UET', to: 'DOH', fromCity: 'Quetta',    toCity: 'Doha',         tier: 3 },
  { from: 'UET', to: 'AUH', fromCity: 'Quetta',    toCity: 'Abu Dhabi',    tier: 3 },
  { from: 'UET', to: 'SHJ', fromCity: 'Quetta',    toCity: 'Sharjah',      tier: 3 },
  { from: 'UET', to: 'KWI', fromCity: 'Quetta',    toCity: 'Kuwait City',  tier: 3 },
  { from: 'UET', to: 'MCT', fromCity: 'Quetta',    toCity: 'Muscat',       tier: 3 },
  { from: 'UET', to: 'BAH', fromCity: 'Quetta',    toCity: 'Manama',       tier: 3 },
  { from: 'UET', to: 'DMM', fromCity: 'Quetta',    toCity: 'Dammam',       tier: 3 },
  { from: 'UET', to: 'MED', fromCity: 'Quetta',    toCity: 'Madinah',      tier: 3 },

  // ── TIER 3: Remaining Gulf → Pakistan reverse ─────────────────────
  { from: 'KWI', to: 'KHI', fromCity: 'Kuwait City',toCity: 'Karachi',     tier: 3 },
  { from: 'MCT', to: 'KHI', fromCity: 'Muscat',    toCity: 'Karachi',      tier: 3 },
  { from: 'MCT', to: 'LHE', fromCity: 'Muscat',    toCity: 'Lahore',       tier: 3 },
  { from: 'BAH', to: 'KHI', fromCity: 'Manama',    toCity: 'Karachi',      tier: 3 },
  { from: 'DMM', to: 'KHI', fromCity: 'Dammam',    toCity: 'Karachi',      tier: 3 },
  { from: 'DMM', to: 'LHE', fromCity: 'Dammam',    toCity: 'Lahore',       tier: 3 },
  { from: 'MED', to: 'KHI', fromCity: 'Madinah',   toCity: 'Karachi',      tier: 3 },
  { from: 'MED', to: 'LHE', fromCity: 'Madinah',   toCity: 'Lahore',       tier: 3 },
]

// Tier 1 routes for frequent refresh runs
export function getTopRoutes(): ScrapeRoute[] {
  return SCRAPE_ROUTES.filter(r => r.tier === 1)
}

// Chunk support for parallel GitHub Actions jobs (A = first half, B = second half)
export function getRoutesForRun(
  runType: 'full' | 'top',
  chunk?: 'a' | 'b'
): ScrapeRoute[] {
  const all = runType === 'top' ? getTopRoutes() : SCRAPE_ROUTES
  if (!chunk) return all
  const mid = Math.ceil(all.length / 2)
  return chunk === 'a' ? all.slice(0, mid) : all.slice(mid)
}
