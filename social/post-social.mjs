/**
 * FlightRate Social Media Auto-Poster
 * Posts next queued item to Facebook Page + Instagram Business
 * Runs via GitHub Actions cron — do not run manually in production
 *
 * Required env vars:
 *   FB_PAGE_ID            — Facebook Page numeric ID
 *   FB_PAGE_ACCESS_TOKEN  — Long-lived Page Access Token (refresh every 50 days)
 *   IG_USER_ID            — Instagram Business Account ID (numeric)
 *   QUEUE_FILE            — path to posts-queue.json (default: social/posts-queue.json)
 */

import fs   from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const FB_PAGE_ID           = process.env.FB_PAGE_ID
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN
const IG_USER_ID           = process.env.IG_USER_ID
const QUEUE_FILE           = process.env.QUEUE_FILE
  ?? path.join(__dirname, 'posts-queue.json')

// ─── Validate env ─────────────────────────────────────────────────────────────
function validateEnv() {
  const missing = []
  if (!FB_PAGE_ID)           missing.push('FB_PAGE_ID')
  if (!FB_PAGE_ACCESS_TOKEN) missing.push('FB_PAGE_ACCESS_TOKEN')
  if (!IG_USER_ID)           missing.push('IG_USER_ID')
  if (missing.length) {
    console.error(`❌ Missing env vars: ${missing.join(', ')}`)
    process.exit(1)
  }
}

// ─── Queue helpers ────────────────────────────────────────────────────────────
function readQueue() {
  const raw = fs.readFileSync(QUEUE_FILE, 'utf8')
  return JSON.parse(raw)
}

function writeQueue(queue) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2) + '\n', 'utf8')
}

function getNextPost(queue) {
  return queue.find(p => !p.posted_fb || !p.posted_ig) ?? null
}

// ─── Facebook posting ─────────────────────────────────────────────────────────
async function postToFacebook(post) {
  console.log(`  📘 Posting to Facebook...`)

  const body = new URLSearchParams({
    message:      `${post.caption}\n\n${post.link}`,
    access_token: FB_PAGE_ACCESS_TOKEN,
  })

  // If image_url provided, post as photo (better reach)
  if (post.image_url) {
    body.append('url',     post.image_url)
    body.append('caption', `${post.caption}\n\n${post.link}`)

    const res  = await fetch(`https://graph.facebook.com/v19.0/${FB_PAGE_ID}/photos`, {
      method:  'POST',
      body,
    })
    const data = await res.json()

    if (data.error) throw new Error(`FB photo error: ${data.error.message}`)
    console.log(`  ✓ Facebook photo posted — ID: ${data.id}`)
    return data.id
  }

  // Fallback: link post
  body.append('link', post.link)
  const res  = await fetch(`https://graph.facebook.com/v19.0/${FB_PAGE_ID}/feed`, {
    method: 'POST',
    body,
  })
  const data = await res.json()
  if (data.error) throw new Error(`FB feed error: ${data.error.message}`)
  console.log(`  ✓ Facebook link posted — ID: ${data.id}`)
  return data.id
}

// ─── Instagram posting (2-step: create container → publish) ──────────────────
async function postToInstagram(post) {
  console.log(`  📸 Posting to Instagram...`)

  if (!post.image_url) {
    console.log(`  ⚠ No image_url — skipping Instagram (requires image)`)
    return null
  }

  // Step 1: Create media container
  const containerRes = await fetch(
    `https://graph.facebook.com/v19.0/${IG_USER_ID}/media`, {
      method: 'POST',
      body:   new URLSearchParams({
        image_url:    post.image_url,
        caption:      `${post.caption}\n\n${post.link}`,
        access_token: FB_PAGE_ACCESS_TOKEN,
      }),
    }
  )
  const container = await containerRes.json()
  if (container.error) throw new Error(`IG container error: ${container.error.message}`)

  console.log(`  ↳ Container created: ${container.id}`)

  // Step 2: Wait 3s then publish
  await new Promise(r => setTimeout(r, 3000))

  const publishRes = await fetch(
    `https://graph.facebook.com/v19.0/${IG_USER_ID}/media_publish`, {
      method: 'POST',
      body:   new URLSearchParams({
        creation_id:  container.id,
        access_token: FB_PAGE_ACCESS_TOKEN,
      }),
    }
  )
  const publish = await publishRes.json()
  if (publish.error) throw new Error(`IG publish error: ${publish.error.message}`)

  console.log(`  ✓ Instagram posted — ID: ${publish.id}`)
  return publish.id
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  validateEnv()

  const queue = readQueue()
  const post  = getNextPost(queue)

  if (!post) {
    console.log('✅ Queue empty — all posts published. Add more to posts-queue.json.')
    process.exit(0)
  }

  console.log(`\n📤 Posting: [${post.id}] ${post.notes ?? post.caption.slice(0, 50)}`)

  let fbOk = post.posted_fb
  let igOk = post.posted_ig

  // Post to Facebook
  if (!post.posted_fb) {
    try {
      await postToFacebook(post)
      fbOk = true
    } catch (err) {
      console.error(`  ✗ Facebook failed: ${err.message}`)
    }
  } else {
    console.log(`  ✓ Facebook already posted — skipping`)
  }

  // Post to Instagram
  if (!post.posted_ig) {
    try {
      await postToInstagram(post)
      igOk = true
    } catch (err) {
      console.error(`  ✗ Instagram failed: ${err.message}`)
    }
  } else {
    console.log(`  ✓ Instagram already posted — skipping`)
  }

  // Update queue
  const idx = queue.findIndex(p => p.id === post.id)
  queue[idx].posted_fb = fbOk
  queue[idx].posted_ig = igOk
  if (fbOk && igOk) {
    queue[idx].posted_at = new Date().toISOString()
    console.log(`\n✅ Post #${post.id} fully published at ${queue[idx].posted_at}`)
  } else {
    console.log(`\n⚠ Post #${post.id} partially published — will retry failed platform tomorrow`)
  }

  writeQueue(queue)

  // Exit 1 if both failed (triggers GitHub Actions failure alert)
  if (!fbOk && !igOk) process.exit(1)
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
