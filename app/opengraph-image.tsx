import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'FlightRate — Cheap Flights from Pakistan in PKR'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #003F88 0%, #0055BB 60%, #0066CC 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: 'white',
          padding: '60px',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '14px',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32,
          }}>
            ✈
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-1px' }}>
            Flight<span style={{ fontStyle: 'italic' }}>Rate</span>
          </span>
        </div>

        {/* Headline */}
        <div style={{
          fontSize: 44, fontWeight: 700, textAlign: 'center',
          lineHeight: 1.2, marginBottom: 20,
          maxWidth: 900,
        }}>
          Cheap Flights from Pakistan in PKR
        </div>

        {/* Sub */}
        <div style={{
          fontSize: 26, opacity: 0.82, textAlign: 'center',
          marginBottom: 40, maxWidth: 800,
        }}>
          Compare all airlines · Book via WhatsApp in 7 minutes · No hidden fees
        </div>

        {/* Route pills */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['KHI → DXB', 'LHE → DXB', 'ISB → DXB', 'KHI → RUH', 'KHI → DOH'].map(r => (
            <div key={r} style={{
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '24px',
              padding: '8px 20px',
              fontSize: 20,
              fontWeight: 600,
            }}>
              {r}
            </div>
          ))}
        </div>

        {/* URL watermark */}
        <div style={{
          position: 'absolute', bottom: 32, right: 48,
          fontSize: 18, opacity: 0.5, fontWeight: 500,
        }}>
          flightrate.pk
        </div>
      </div>
    ),
    { ...size }
  )
}
