// Pure SVG — no library, no bundle weight, server component safe
interface HistoryPoint { date: string; minPrice: number }

interface Props {
  history: HistoryPoint[]
  fromCity: string
  toCity: string
  markup?: number
}

function formatPKR(n: number) {
  return 'PKR ' + Math.round(n).toLocaleString('en-PK')
}

function shortDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })
}

export default function PriceGraph({ history, fromCity, toCity, markup = 7000 }: Props) {
  if (!history || history.length < 2) return null

  // Sort oldest → newest, take last 30
  const pts = [...history]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30)
    .map(p => ({ ...p, minPrice: p.minPrice + markup }))

  const prices  = pts.map(p => p.minPrice)
  const minP    = Math.min(...prices)
  const maxP    = Math.max(...prices)
  const range   = maxP - minP || 1

  // SVG canvas
  const W = 600, H = 140, PAD = { t: 16, r: 16, b: 32, l: 16 }
  const gW = W - PAD.l - PAD.r
  const gH = H - PAD.t - PAD.b

  // Map data → SVG coords
  const coords = pts.map((p, i) => ({
    x: PAD.l + (i / (pts.length - 1)) * gW,
    y: PAD.t + gH - ((p.minPrice - minP) / range) * gH,
    ...p,
  }))

  const polyline = coords.map(c => `${c.x},${c.y}`).join(' ')
  const fillPath = [
    `M ${coords[0].x},${PAD.t + gH}`,
    ...coords.map(c => `L ${c.x},${c.y}`),
    `L ${coords[coords.length - 1].x},${PAD.t + gH}`,
    'Z',
  ].join(' ')

  // Show label every ~6 points
  const labelEvery = Math.max(1, Math.floor(pts.length / 5))
  const last = coords[coords.length - 1]
  const today = last.minPrice

  // 7-day trend
  const recent7 = pts.slice(-7)
  const trend = recent7.length >= 2
    ? recent7[recent7.length - 1].minPrice - recent7[0].minPrice
    : 0
  const trendText = trend > 2000
    ? '↑ Rising — book soon'
    : trend < -2000
    ? '↓ Falling — wait a bit'
    : '→ Stable'
  const trendColor = trend > 2000 ? '#EF4444' : trend < -2000 ? '#10B981' : '#F59E0B'

  return (
    <div className="pg-wrap">
      <div className="pg-header">
        <div>
          <span className="pg-title">30-Day Price Trend</span>
          <span className="pg-route">{fromCity} → {toCity}</span>
        </div>
        <div className="pg-trend" style={{ color: trendColor }}>{trendText}</div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="pg-svg"
        role="img"
        aria-label={`Price history graph for ${fromCity} to ${toCity} flights. Current price ${formatPKR(today)}.`}
      >
        <defs>
          <linearGradient id="pg-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#003F88" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#003F88" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Fill area */}
        <path d={fillPath} fill="url(#pg-grad)" />

        {/* Line */}
        <polyline
          points={polyline}
          fill="none"
          stroke="#003F88"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Date labels on x-axis */}
        {coords.map((c, i) => i % labelEvery === 0 && (
          <text key={i} x={c.x} y={H - 4} textAnchor="middle" fontSize="9" fill="#9CA3AF">
            {shortDate(c.date)}
          </text>
        ))}

        {/* Today dot + label */}
        <circle cx={last.x} cy={last.y} r="4" fill="#003F88" />
        <text x={last.x} y={last.y - 8} textAnchor="end" fontSize="10" fill="#003F88" fontWeight="600">
          {formatPKR(today)}
        </text>

        {/* Min label */}
        {minP !== today && (() => {
          const minPt = coords.find(c => c.minPrice === minP)!
          return (
            <>
              <circle cx={minPt.x} cy={minPt.y} r="3" fill="#10B981" />
              <text x={minPt.x} y={minPt.y - 6} textAnchor="middle" fontSize="9" fill="#10B981">
                {formatPKR(minP)}
              </text>
            </>
          )
        })()}
      </svg>

      <div className="pg-footer">
        <span>Low: <strong>{formatPKR(minP)}</strong></span>
        <span>High: <strong>{formatPKR(maxP)}</strong></span>
        <span className="pg-source">Data updated daily · flightrate.pk</span>
      </div>
    </div>
  )
}
