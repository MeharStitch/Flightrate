interface HistoryPoint { date: string; minPrice: number }

interface Props {
  history: HistoryPoint[]
  markup?: number
}

function formatPKR(n: number) {
  return 'PKR ' + Math.round(n).toLocaleString('en-PK')
}

export default function PriceInsight({ history, markup = 7000 }: Props) {
  if (!history || history.length < 7) return null

  const pts = [...history]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(p => ({ ...p, minPrice: p.minPrice + markup }))

  const prices = pts.map(p => p.minPrice)
  const avg    = prices.reduce((s, p) => s + p, 0) / prices.length
  const min    = Math.min(...prices)
  const max    = Math.max(...prices)
  const now    = prices[prices.length - 1]

  // % above/below average
  const diff    = now - avg
  const diffPct = Math.round(Math.abs(diff / avg) * 100)

  // Day-of-week cheapest (0=Sun…6=Sat)
  const byDay: Record<number, number[]> = {}
  pts.forEach(p => {
    const dow = new Date(p.date).getDay()
    byDay[dow] = byDay[dow] || []
    byDay[dow].push(p.minPrice)
  })
  const dayAvgs = Object.entries(byDay).map(([d, ps]) => ({
    day: Number(d),
    avg: ps.reduce((s, p) => s + p, 0) / ps.length,
  }))
  dayAvgs.sort((a, b) => a.avg - b.avg)
  const cheapestDay = dayAvgs[0]
  const DAY_NAMES   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  // Verdict
  let verdict: string, color: string, emoji: string
  if (now <= avg * 0.97) {
    verdict = `Prices are ${diffPct}% below average — good time to book`
    color   = '#10B981'
    emoji   = '✅'
  } else if (now >= avg * 1.05) {
    verdict = `Prices are ${diffPct}% above average — consider waiting`
    color   = '#EF4444'
    emoji   = '⚠️'
  } else {
    verdict = 'Prices are near average — no urgent pressure'
    color   = '#F59E0B'
    emoji   = '→'
  }

  return (
    <div className="pi-wrap">
      <div className="pi-title">Best Time to Book</div>

      <div className="pi-verdict" style={{ color }}>
        <span className="pi-emoji">{emoji}</span>
        <span>{verdict}</span>
      </div>

      <div className="pi-stats">
        <div className="pi-stat">
          <span className="pi-stat-label">30-day avg</span>
          <span className="pi-stat-val">{formatPKR(avg)}</span>
        </div>
        <div className="pi-stat">
          <span className="pi-stat-label">Lowest seen</span>
          <span className="pi-stat-val" style={{ color: '#10B981' }}>{formatPKR(min)}</span>
        </div>
        <div className="pi-stat">
          <span className="pi-stat-label">Highest seen</span>
          <span className="pi-stat-val" style={{ color: '#EF4444' }}>{formatPKR(max)}</span>
        </div>
        {cheapestDay && (
          <div className="pi-stat">
            <span className="pi-stat-label">Cheapest day</span>
            <span className="pi-stat-val">{DAY_NAMES[cheapestDay.day]}</span>
          </div>
        )}
      </div>
    </div>
  )
}
