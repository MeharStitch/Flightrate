// All routes to scrape — tiered by traffic priority

export interface ScrapeRoute {
  from: string  // IATA code
  to: string
  fromCity: string
  toCity: string
  tier: 1 | 2 | 3  // 1=3x/day, 2=1x/day, 3=every 3 days
}

export const SCRAPE_ROUTES: ScrapeRoute[] = [
  // ── TIER 1: Top routes (high booking volume) ──────────────────────
  { from: 'KHI', to: 'DXB', fromCity: 'Karachi',   toCity: 'Dubai',       tier: 1 },
  { from: 'LHE', to: 'DXB', fromCity: 'Lahore',    toCity: 'Dubai',       tier: 1 },
  { from: 'ISB', to: 'DXB', fromCity: 'Islamabad', toCity: 'Dubai',       tier: 1 },
  { from: 'KHI', to: 'RUH', fromCity: 'Karachi',   toCity: 'Riyadh',      tier: 1 },
  { from: 'LHE', to: 'RUH', fromCity: 'Lahore',    toCity: 'Riyadh',      tier: 1 },
  { from: 'ISB', to: 'RUH', fromCity: 'Islamabad', toCity: 'Riyadh',      tier: 1 },
  { from: 'KHI', to: 'JED', fromCity: 'Karachi',   toCity: 'Jeddah',      tier: 1 },
  { from: 'LHE', to: 'JED', fromCity: 'Lahore',    toCity: 'Jeddah',      tier: 1 },
  { from: 'KHI', to: 'DOH', fromCity: 'Karachi',   toCity: 'Doha',        tier: 1 },
  { from: 'LHE', to: 'DOH', fromCity: 'Lahore',    toCity: 'Doha',        tier: 1 },
  { from: 'ISB', to: 'DOH', fromCity: 'Islamabad', toCity: 'Doha',        tier: 1 },
  { from: 'PEW', to: 'DXB', fromCity: 'Peshawar',  toCity: 'Dubai',       tier: 1 },
  { from: 'SKT', to: 'DXB', fromCity: 'Sialkot',   toCity: 'Dubai',       tier: 1 },
  { from: 'MUX', to: 'RUH', fromCity: 'Multan',    toCity: 'Riyadh',      tier: 1 },
  { from: 'KHI', to: 'KWI', fromCity: 'Karachi',   toCity: 'Kuwait City', tier: 1 },

  // ── TIER 2: Medium routes ─────────────────────────────────────────
  { from: 'ISB', to: 'JED', fromCity: 'Islamabad', toCity: 'Jeddah',      tier: 2 },
  { from: 'KHI', to: 'AUH', fromCity: 'Karachi',   toCity: 'Abu Dhabi',   tier: 2 },
  { from: 'LHE', to: 'AUH', fromCity: 'Lahore',    toCity: 'Abu Dhabi',   tier: 2 },
  { from: 'ISB', to: 'AUH', fromCity: 'Islamabad', toCity: 'Abu Dhabi',   tier: 2 },
  { from: 'KHI', to: 'SHJ', fromCity: 'Karachi',   toCity: 'Sharjah',     tier: 2 },
  { from: 'LHE', to: 'SHJ', fromCity: 'Lahore',    toCity: 'Sharjah',     tier: 2 },
  { from: 'ISB', to: 'SHJ', fromCity: 'Islamabad', toCity: 'Sharjah',     tier: 2 },
  { from: 'KHI', to: 'MCT', fromCity: 'Karachi',   toCity: 'Muscat',      tier: 2 },
  { from: 'LHE', to: 'MCT', fromCity: 'Lahore',    toCity: 'Muscat',      tier: 2 },
  { from: 'KHI', to: 'BAH', fromCity: 'Karachi',   toCity: 'Manama',      tier: 2 },
  { from: 'KHI', to: 'DMM', fromCity: 'Karachi',   toCity: 'Dammam',      tier: 2 },
  { from: 'LHE', to: 'DMM', fromCity: 'Lahore',    toCity: 'Dammam',      tier: 2 },
  { from: 'KHI', to: 'MED', fromCity: 'Karachi',   toCity: 'Madinah',     tier: 2 },
  { from: 'LHE', to: 'MED', fromCity: 'Lahore',    toCity: 'Madinah',     tier: 2 },
  { from: 'PEW', to: 'RUH', fromCity: 'Peshawar',  toCity: 'Riyadh',      tier: 2 },
  { from: 'MUX', to: 'DXB', fromCity: 'Multan',    toCity: 'Dubai',       tier: 2 },
  { from: 'LYP', to: 'DXB', fromCity: 'Faisalabad',toCity: 'Dubai',       tier: 2 },

  // ── TIER 3: Long-tail routes ──────────────────────────────────────
  { from: 'ISB', to: 'MCT', fromCity: 'Islamabad', toCity: 'Muscat',      tier: 3 },
  { from: 'ISB', to: 'KWI', fromCity: 'Islamabad', toCity: 'Kuwait City', tier: 3 },
  { from: 'ISB', to: 'BAH', fromCity: 'Islamabad', toCity: 'Manama',      tier: 3 },
  { from: 'ISB', to: 'DMM', fromCity: 'Islamabad', toCity: 'Dammam',      tier: 3 },
  { from: 'ISB', to: 'MED', fromCity: 'Islamabad', toCity: 'Madinah',     tier: 3 },
  { from: 'PEW', to: 'JED', fromCity: 'Peshawar',  toCity: 'Jeddah',      tier: 3 },
  { from: 'PEW', to: 'DOH', fromCity: 'Peshawar',  toCity: 'Doha',        tier: 3 },
  { from: 'PEW', to: 'AUH', fromCity: 'Peshawar',  toCity: 'Abu Dhabi',   tier: 3 },
  { from: 'PEW', to: 'KWI', fromCity: 'Peshawar',  toCity: 'Kuwait City', tier: 3 },
  { from: 'PEW', to: 'MCT', fromCity: 'Peshawar',  toCity: 'Muscat',      tier: 3 },
  { from: 'PEW', to: 'SHJ', fromCity: 'Peshawar',  toCity: 'Sharjah',     tier: 3 },
  { from: 'PEW', to: 'MED', fromCity: 'Peshawar',  toCity: 'Madinah',     tier: 3 },
  { from: 'PEW', to: 'DMM', fromCity: 'Peshawar',  toCity: 'Dammam',      tier: 3 },
  { from: 'PEW', to: 'BAH', fromCity: 'Peshawar',  toCity: 'Manama',      tier: 3 },
  { from: 'SKT', to: 'RUH', fromCity: 'Sialkot',   toCity: 'Riyadh',      tier: 3 },
  { from: 'SKT', to: 'JED', fromCity: 'Sialkot',   toCity: 'Jeddah',      tier: 3 },
  { from: 'SKT', to: 'DOH', fromCity: 'Sialkot',   toCity: 'Doha',        tier: 3 },
  { from: 'SKT', to: 'AUH', fromCity: 'Sialkot',   toCity: 'Abu Dhabi',   tier: 3 },
  { from: 'SKT', to: 'SHJ', fromCity: 'Sialkot',   toCity: 'Sharjah',     tier: 3 },
  { from: 'SKT', to: 'KWI', fromCity: 'Sialkot',   toCity: 'Kuwait City', tier: 3 },
  { from: 'SKT', to: 'MCT', fromCity: 'Sialkot',   toCity: 'Muscat',      tier: 3 },
  { from: 'SKT', to: 'BAH', fromCity: 'Sialkot',   toCity: 'Manama',      tier: 3 },
  { from: 'SKT', to: 'DMM', fromCity: 'Sialkot',   toCity: 'Dammam',      tier: 3 },
  { from: 'SKT', to: 'MED', fromCity: 'Sialkot',   toCity: 'Madinah',     tier: 3 },
  { from: 'MUX', to: 'JED', fromCity: 'Multan',    toCity: 'Jeddah',      tier: 3 },
  { from: 'MUX', to: 'DOH', fromCity: 'Multan',    toCity: 'Doha',        tier: 3 },
  { from: 'MUX', to: 'AUH', fromCity: 'Multan',    toCity: 'Abu Dhabi',   tier: 3 },
  { from: 'MUX', to: 'SHJ', fromCity: 'Multan',    toCity: 'Sharjah',     tier: 3 },
  { from: 'MUX', to: 'KWI', fromCity: 'Multan',    toCity: 'Kuwait City', tier: 3 },
  { from: 'MUX', to: 'MCT', fromCity: 'Multan',    toCity: 'Muscat',      tier: 3 },
  { from: 'MUX', to: 'BAH', fromCity: 'Multan',    toCity: 'Manama',      tier: 3 },
  { from: 'MUX', to: 'DMM', fromCity: 'Multan',    toCity: 'Dammam',      tier: 3 },
  { from: 'MUX', to: 'MED', fromCity: 'Multan',    toCity: 'Madinah',     tier: 3 },
  { from: 'LYP', to: 'RUH', fromCity: 'Faisalabad',toCity: 'Riyadh',      tier: 3 },
  { from: 'LYP', to: 'JED', fromCity: 'Faisalabad',toCity: 'Jeddah',      tier: 3 },
  { from: 'LYP', to: 'DOH', fromCity: 'Faisalabad',toCity: 'Doha',        tier: 3 },
  { from: 'LYP', to: 'AUH', fromCity: 'Faisalabad',toCity: 'Abu Dhabi',   tier: 3 },
  { from: 'LYP', to: 'SHJ', fromCity: 'Faisalabad',toCity: 'Sharjah',     tier: 3 },
  { from: 'LYP', to: 'KWI', fromCity: 'Faisalabad',toCity: 'Kuwait City', tier: 3 },
  { from: 'LYP', to: 'MCT', fromCity: 'Faisalabad',toCity: 'Muscat',      tier: 3 },
  { from: 'LYP', to: 'BAH', fromCity: 'Faisalabad',toCity: 'Manama',      tier: 3 },
  { from: 'LYP', to: 'DMM', fromCity: 'Faisalabad',toCity: 'Dammam',      tier: 3 },
  { from: 'LYP', to: 'MED', fromCity: 'Faisalabad',toCity: 'Madinah',     tier: 3 },
  { from: 'UET', to: 'DXB', fromCity: 'Quetta',    toCity: 'Dubai',       tier: 3 },
  { from: 'UET', to: 'RUH', fromCity: 'Quetta',    toCity: 'Riyadh',      tier: 3 },
  { from: 'UET', to: 'JED', fromCity: 'Quetta',    toCity: 'Jeddah',      tier: 3 },
  { from: 'UET', to: 'DOH', fromCity: 'Quetta',    toCity: 'Doha',        tier: 3 },
  { from: 'UET', to: 'AUH', fromCity: 'Quetta',    toCity: 'Abu Dhabi',   tier: 3 },
  { from: 'UET', to: 'SHJ', fromCity: 'Quetta',    toCity: 'Sharjah',     tier: 3 },
  { from: 'UET', to: 'KWI', fromCity: 'Quetta',    toCity: 'Kuwait City', tier: 3 },
  { from: 'UET', to: 'MCT', fromCity: 'Quetta',    toCity: 'Muscat',      tier: 3 },
  { from: 'UET', to: 'BAH', fromCity: 'Quetta',    toCity: 'Manama',      tier: 3 },
  { from: 'UET', to: 'DMM', fromCity: 'Quetta',    toCity: 'Dammam',      tier: 3 },
  { from: 'UET', to: 'MED', fromCity: 'Quetta',    toCity: 'Madinah',     tier: 3 },
]

// Get routes to scrape based on current hour (tier-based schedule)
export function getRoutesForRun(runType: 'full' | 'top'): ScrapeRoute[] {
  if (runType === 'top') return SCRAPE_ROUTES.filter(r => r.tier === 1)
  return SCRAPE_ROUTES
}
