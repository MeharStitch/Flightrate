/**
 * FlightRate Daily Blog Post Generator
 * Reads next topic from blog/topics-queue.json
 * Calls Claude API → generates SEO blog post JSON
 * Saves to blog-content/[slug].json
 * Marks topic as done in queue
 *
 * Usage:
 *   node blog/generate-post.mjs              — next topic from queue
 *   node blog/generate-post.mjs --slug=foo   — specific topic by slug
 *
 * Requires: ANTHROPIC_API_KEY env var
 */

import Anthropic from '@anthropic-ai/sdk'
import fs        from 'fs'
import path      from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT      = path.join(__dirname, '..')

const TOPICS_FILE  = path.join(__dirname, 'topics-queue.json')
const CONTENT_DIR  = path.join(ROOT, 'blog-content')

if (!fs.existsSync(CONTENT_DIR)) fs.mkdirSync(CONTENT_DIR, { recursive: true })

// ─── Pick topic ───────────────────────────────────────────────────────────────
function pickTopic(slugOverride) {
  const topics = JSON.parse(fs.readFileSync(TOPICS_FILE, 'utf8'))
  if (slugOverride) {
    const t = topics.find(t => t.slug === slugOverride)
    if (!t) { console.error(`Topic not found: ${slugOverride}`); process.exit(1) }
    return { topics, topic: t }
  }
  const next = topics.find(t => !t.done)
  if (!next) { console.log('✅ All topics done. Add more to topics-queue.json'); process.exit(0) }
  return { topics, topic: next }
}

// ─── Check existing blog slugs for context ────────────────────────────────────
function getExistingBlogSlugs() {
  const staticDir = path.join(ROOT, 'app', 'blog')
  const jsonDir   = CONTENT_DIR
  const slugs = []

  // Static blog dirs
  if (fs.existsSync(staticDir)) {
    fs.readdirSync(staticDir).forEach(f => {
      if (!f.startsWith('[') && f !== 'page.tsx') slugs.push(f)
    })
  }
  // Auto-generated JSON posts
  if (fs.existsSync(jsonDir)) {
    fs.readdirSync(jsonDir)
      .filter(f => f.endsWith('.json'))
      .forEach(f => slugs.push(f.replace('.json', '')))
  }
  return slugs
}

// ─── Generate post via Claude ─────────────────────────────────────────────────
async function generatePost(topic, existingSlugs) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const prompt = `You are an expert travel content writer for FlightRate.pk — a Pakistani flight price comparison service.
Write a comprehensive, SEO-optimized blog post in JSON format for this topic:

TOPIC: ${topic.title}
FOCUS KEYWORD: ${topic.focus_keyword}
ANGLE: ${topic.angle}
TARGET ROUTES (must be internally linked): ${topic.target_routes.join(', ')}

EXISTING BLOG POSTS (do NOT duplicate these topics):
${existingSlugs.join('\n')}

OUTPUT must be valid JSON matching this exact schema (no markdown, no explanation, ONLY the JSON object):
{
  "slug": "${topic.slug}",
  "title": "...",
  "description": "150-160 char meta description with focus keyword",
  "datePublished": "${new Date().toISOString().split('T')[0]}",
  "keywords": ["focus keyword", "4-7 related long-tail keywords"],
  "intro": "2-3 paragraph intro (\\n\\n separated). Hook the reader. Mention PKR prices. Include focus keyword in first sentence.",
  "sections": [
    {
      "h2": "Section heading with keyword variation",
      "content": "2-3 paragraphs of detailed, useful content (\\n\\n separated). Include specific PKR price ranges where relevant. Be specific — mention actual airlines, routes, airports."
    }
  ],
  "faq": [
    { "q": "Question exactly matching how Pakistanis search", "a": "Detailed answer 2-4 sentences. Include specific prices in PKR where possible." }
  ],
  "relatedRoutes": [
    { "label": "City A to City B", "slug": "city-a-to-city-b" }
  ],
  "cta": { "destination": "City Name", "to": "IATA" }
}

REQUIREMENTS:
- Write 5-7 sections (h2 headings), each 150-250 words
- 5 FAQ questions targeting common Pakistani traveller searches
- All prices in PKR (Pakistani Rupees)
- Internal links: include ALL of these as relatedRoutes: ${topic.target_routes.join(', ')}
- Tone: helpful, direct, Pakistani context (Karachi/Lahore/Islamabad readers, expats in Gulf/UK)
- Total word count: 900-1200 words across all sections
- Focus keyword must appear in title, description, intro, and at least 2 section headings
- NO generic travel advice — specific to Pakistani routes, Pakistani travellers, PKR pricing`

  console.log(`\n🤖 Generating: "${topic.title}"`)
  console.log(`   Model: claude-haiku-4-5`)

  const message = await client.messages.create({
    model:      'claude-haiku-4-5',
    max_tokens: 4096,
    messages:   [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text : ''

  // Extract JSON — strip any markdown fences if present
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in Claude response')

  const post = JSON.parse(jsonMatch[0])

  // Validate required fields
  const required = ['slug', 'title', 'description', 'datePublished', 'keywords', 'intro', 'sections', 'faq', 'relatedRoutes', 'cta']
  for (const field of required) {
    if (!post[field]) throw new Error(`Missing field: ${field}`)
  }
  if (post.sections.length < 3) throw new Error('Too few sections')
  if (post.faq.length < 3)      throw new Error('Too few FAQs')

  return post
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not set')
    process.exit(1)
  }

  const slugOverride = process.argv.find(a => a.startsWith('--slug='))?.split('=')[1]
  const { topics, topic } = pickTopic(slugOverride)
  const existingSlugs    = getExistingBlogSlugs()

  // Skip if already generated
  const outFile = path.join(CONTENT_DIR, `${topic.slug}.json`)
  if (fs.existsSync(outFile) && !slugOverride) {
    console.log(`⏭ ${topic.slug} already exists — marking done and skipping`)
  } else {
    const post = await generatePost(topic, existingSlugs)

    fs.writeFileSync(outFile, JSON.stringify(post, null, 2) + '\n', 'utf8')
    console.log(`\n✅ Saved: blog-content/${topic.slug}.json`)
    console.log(`   Title: ${post.title}`)
    console.log(`   Sections: ${post.sections.length} | FAQs: ${post.faq.length} | Routes: ${post.relatedRoutes.length}`)
  }

  // Mark topic done in queue
  const idx = topics.findIndex(t => t.slug === topic.slug)
  topics[idx].done = true
  fs.writeFileSync(TOPICS_FILE, JSON.stringify(topics, null, 2) + '\n', 'utf8')
  console.log(`   Marked done in topics-queue.json`)

  const remaining = topics.filter(t => !t.done).length
  console.log(`   Topics remaining: ${remaining}`)
}

main().catch(err => {
  console.error('Fatal:', err.message)
  process.exit(1)
})
