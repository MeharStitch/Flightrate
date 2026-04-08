import { Suspense } from 'react'
import SearchClient from './SearchClient'

export const metadata = {
  title: 'Flight Search Results — FlightRate',
  description: 'Compare real-time fares from PIA, Emirates, flydubai and more. Book via WhatsApp in 7 minutes.',
}

function SkeletonBar({ w, h = 13 }: { w: number | string; h?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 6,
      background: 'linear-gradient(90deg,#eef2f8 0%,#dde6f4 30%,#c8d8ef 50%,#dde6f4 70%,#eef2f8 100%)',
      backgroundSize: '1200px 100%',
      animation: 'shimmer 1.6s infinite linear',
    }} />
  )
}

function SearchFallback() {
  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB', padding: '100px 24px 40px' }}>
      <style>{`@keyframes shimmer{0%{background-position:-600px 0}100%{background-position:600px 0}}`}</style>
      <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <SkeletonBar w={180} h={16} />
          <SkeletonBar w={120} h={16} />
        </div>
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{ background: 'white', borderRadius: 14, border: '1px solid rgba(0,0,0,0.07)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'flex-start', animationDelay: `${i*80}ms` }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: '#eef2f8', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
              <SkeletonBar w="40%" />
              <SkeletonBar w="60%" />
              <SkeletonBar w="30%" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9, alignItems: 'flex-end', minWidth: 130 }}>
              <SkeletonBar w={90} h={20} />
              <SkeletonBar w={70} />
              <SkeletonBar w={130} h={36} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchClient />
    </Suspense>
  )
}
