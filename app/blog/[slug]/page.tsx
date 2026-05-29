/**
 * Auto-generated blog posts — rendered from blog-content/[slug].json
 * Existing static blog dirs (cheapest-month-to-fly-*, etc.) take precedence
 * over this dynamic segment in Next.js App Router.
 */
import type { Metadata }  from 'next'
import { notFound }       from 'next/navigation'
import Link               from 'next/link'
import fs                 from 'fs'
import path               from 'path'

export const revalidate = 86400 // 24h — daily posts don't need hourly refresh

// ─── Types ────────────────────────────────────────────────────────────────────
export interface BlogPost {
  slug:          string
  title:         string
  description:   string
  datePublished: string
  keywords:      string[]
  intro:         string
  sections: {
    h2:      string
    content: string       // plain text paragraphs, \n\n separated
  }[]
  faq: {
    q: string
    a: string
  }[]
  relatedRoutes: {
    label: string   // "Karachi to Dubai"
    slug:  string   // "karachi-to-dubai"
  }[]
  cta: {
    destination: string
    to:          string   // IATA code e.g. "DXB"
  }
}

// ─── Load post from JSON file ─────────────────────────────────────────────────
function loadPost(slug: string): BlogPost | null {
  try {
    const filePath = path.join(process.cwd(), 'blog-content', `${slug}.json`)
    const raw = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(raw) as BlogPost
  } catch {
    return null
  }
}

function getAllSlugs(): string[] {
  try {
    const dir = path.join(process.cwd(), 'blog-content')
    return fs.readdirSync(dir)
      .filter(f => f.endsWith('.json'))
      .map(f => f.replace('.json', ''))
  } catch {
    return []
  }
}

// Old hand-written static blog posts (app/blog/<slug>/page.tsx) — for cross-linking
const STATIC_GUIDES: { slug: string; title: string }[] = [
  { slug: 'cheapest-month-to-fly-pakistan-to-dubai', title: 'Cheapest Month to Fly from Pakistan to Dubai' },
  { slug: 'dubai-visa-requirements-pakistan',        title: 'Dubai Visa Requirements for Pakistanis' },
  { slug: 'cheapest-airlines-pakistan-gulf',         title: 'Cheapest Airlines from Pakistan to Gulf' },
  { slug: 'how-to-book-cheap-flights-pakistan',      title: 'How to Book Cheap Flights from Pakistan' },
]

// Sibling guides for cross-linking — other JSON posts + static guides, minus current
function getSiblingGuides(currentSlug: string, limit = 4): { slug: string; title: string }[] {
  const out: { slug: string; title: string }[] = []
  const seen = new Set<string>([currentSlug])
  try {
    const dir = path.join(process.cwd(), 'blog-content')
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.json')) continue
      const s = file.replace('.json', '')
      if (seen.has(s)) continue
      try {
        const j = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'))
        out.push({ slug: s, title: j.title })
        seen.add(s)
      } catch {}
    }
  } catch {}
  for (const g of STATIC_GUIDES) {
    if (seen.has(g.slug)) continue
    out.push(g)
    seen.add(g.slug)
  }
  return out.slice(0, limit)
}

// ─── Static params — build all auto-blog pages at deploy ─────────────────────
export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = loadPost(slug)
  if (!post) return { title: 'Not Found' }

  const url = `https://www.flightrate.pk/blog/${post.slug}`
  return {
    title:       post.title,
    description: post.description,
    keywords:    post.keywords,
    alternates:  { canonical: url },
    openGraph: {
      title:       post.title,
      description: post.description,
      url,
      type:        'article',
      images:      [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function AutoBlogPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = loadPost(slug)
  if (!post) notFound()

  const url          = `https://www.flightrate.pk/blog/${post.slug}`
  const today        = new Date().toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':         'Article',
        headline:        post.title,
        description:     post.description,
        url,
        datePublished:   post.datePublished,
        dateModified:    post.datePublished,
        image:           { '@type': 'ImageObject', url: 'https://www.flightrate.pk/opengraph-image', width: 1200, height: 630 },
        author:          { '@type': 'Organization', '@id': 'https://www.flightrate.pk/#organization', name: 'FlightRate' },
        publisher:       { '@type': 'Organization', '@id': 'https://www.flightrate.pk/#organization', name: 'FlightRate', logo: { '@type': 'ImageObject', url: 'https://www.flightrate.pk/opengraph-image' } },
      },
      {
        '@type':       'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home',   item: 'https://www.flightrate.pk' },
          { '@type': 'ListItem', position: 2, name: 'Blog',   item: 'https://www.flightrate.pk/blog' },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
      {
        '@type':      'FAQPage',
        mainEntity:   post.faq.map(f => ({
          '@type':         'Question',
          name:            f.q,
          acceptedAnswer:  { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <article className="blog-post">
        <nav className="route-breadcrumb">
          <Link href="/">Home</Link><span>›</span>
          <Link href="/blog">Blog</Link><span>›</span>
          <span>{post.title}</span>
        </nav>

        <header className="blog-post-header">
          <h1>{post.title}</h1>
          <p className="blog-post-meta">
            <time dateTime={post.datePublished}>
              Published {new Date(post.datePublished).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
            </time>
            {' · '}Updated {today}
            {' · '}by <strong>FlightRate</strong>
          </p>
        </header>

        {/* Intro */}
        <div className="blog-post-intro">
          {post.intro.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
        </div>

        {/* Main sections */}
        {post.sections.map((sec, i) => (
          <section key={i} className="blog-post-section">
            <h2>{sec.h2}</h2>
            {sec.content.split('\n\n').map((p, j) => <p key={j}>{p}</p>)}
          </section>
        ))}

        {/* Internal links to route pages */}
        {post.relatedRoutes.length > 0 && (
          <section className="blog-post-section">
            <h2>Check Live Prices</h2>
            <p>FlightRate updates prices 3× daily. Click any route below to see today&apos;s cheapest fare in PKR:</p>
            <div className="route-related">
              {post.relatedRoutes.map(r => (
                <Link key={r.slug} href={`/flights/${r.slug}`} className="route-related-link">
                  ✈ {r.label}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        {post.faq.length > 0 && (
          <section className="blog-post-section">
            <h2>Frequently Asked Questions</h2>
            <div className="route-faqs">
              {post.faq.map((f, i) => (
                <details key={i} className="route-faq">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Cross-link to other guides */}
        {(() => {
          const siblings = getSiblingGuides(post.slug)
          if (!siblings.length) return null
          return (
            <section className="blog-post-section">
              <h2>More Pakistan Flight Guides</h2>
              <div className="route-guides">
                {siblings.map(g => (
                  <Link key={g.slug} href={`/blog/${g.slug}`} className="route-guide-link">
                    <span className="route-guide-arrow">📖</span>
                    <span>{g.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          )
        })()}

        {/* CTA */}
        <div className="route-final-cta">
          <h3>Find the Cheapest Flight to {post.cta.destination}</h3>
          <p>Our agents compare all airlines in PKR and book via WhatsApp in 7 minutes.</p>
          <a
            href={`https://wa.me/923240763099?text=${encodeURIComponent(`Hi FlightRate! I read your article and want to find the best price to ${post.cta.destination}. Please help!`)}`}
            className="route-wa-btn"
            target="_blank"
            rel="noopener"
          >
            💬 Get Best Price on WhatsApp
          </a>
          <Link href="/flights" className="route-search-btn">
            Browse All Routes
          </Link>
        </div>

        {/* Back to blog */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/blog" className="route-related-link">← All Flight Guides</Link>
        </div>
      </article>
    </>
  )
}
