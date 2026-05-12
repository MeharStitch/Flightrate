// Runs after every production build — submits all URLs to IndexNow
// Bing + DuckDuckGo + Yandex all receive the ping automatically

const BASE = 'https://www.flightrate.pk'
const KEY  = '58a04c9f51424aa39bab1b12b45375d0'

const PK_SLUGS   = ['karachi','lahore','islamabad','peshawar','sialkot','multan','faisalabad','quetta']
const DEST_SLUGS = ['dubai','abu-dhabi','sharjah','riyadh','jeddah','madinah','dammam','doha','kuwait-city','muscat','manama']

const urls = [
  `${BASE}/`,
  `${BASE}/flights`,
  `${BASE}/search`,
  ...PK_SLUGS.flatMap(from =>
    DEST_SLUGS.map(to => `${BASE}/flights/${from}-to-${to}`)
  ),
]

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host:        'www.flightrate.pk',
    key:         KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList:     urls,
  }),
})

console.log(`IndexNow → ${res.status} (${urls.length} URLs submitted)`)
