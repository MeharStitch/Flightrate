import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import type { RouteData } from './google-flights'

const MAX_HISTORY_DAYS = 30

// R2 is S3-compatible — point the SDK at Cloudflare's endpoint
function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID
  if (!accountId) throw new Error('R2_ACCOUNT_ID env var not set')
  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     process.env.R2_ACCESS_KEY_ID     ?? '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
    },
  })
}

const BUCKET = process.env.R2_BUCKET_NAME ?? 'flightrate-prices'

async function r2Get(key: string): Promise<unknown | null> {
  try {
    const r2  = getR2Client()
    const res = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: key }))
    const body = await res.Body?.transformToString()
    return body ? JSON.parse(body) : null
  } catch {
    return null
  }
}

async function r2Put(key: string, data: unknown): Promise<void> {
  const r2 = getR2Client()
  await r2.send(new PutObjectCommand({
    Bucket:      BUCKET,
    Key:         key,
    Body:        JSON.stringify(data),
    ContentType: 'application/json',
  }))
}

// Load existing route data to preserve price history
export async function loadRouteData(from: string, to: string): Promise<RouteData | null> {
  return r2Get(`prices/${from}-${to}.json`) as Promise<RouteData | null>
}

// Save route price data to R2
export async function saveRouteData(data: RouteData): Promise<void> {
  const key = `prices/${data.fromCode}-${data.toCode}.json`

  const existing = await loadRouteData(data.fromCode, data.toCode)

  const today   = new Date().toISOString().split('T')[0]
  const history = (existing as RouteData | null)?.history ?? []

  const historyUpdated = [
    { date: today, minPrice: data.minPrice },
    ...history.filter((h: { date: string }) => h.date !== today),
  ].slice(0, MAX_HISTORY_DAYS)

  await r2Put(key, { ...data, history: historyUpdated })

  console.log(`  ✓ Saved ${data.fromCode}-${data.toCode}: PKR ${data.minPrice.toLocaleString()}`)
}

// Save scrape run summary
export async function saveSummary(summary: {
  runAt:   string
  total:   number
  success: number
  failed:  number
  routes:  string[]
}): Promise<void> {
  await r2Put('scrape-summary.json', summary)
}
