/**
 * Maps a flight route to relevant blog guides for internal linking.
 *
 * Why: route pages are the highest-authority pages on the site (most are in
 * the sitemap at priority 0.8-0.9 and get the most crawl attention). Linking
 * them to blog posts passes that authority to the guides — which otherwise
 * sit deep in the site with few inbound links. It also keeps users on-site.
 *
 * Relevance is by destination, so a Dubai route shows Dubai guides, a Jeddah
 * route shows Umrah guides, etc. Every route also gets the two evergreen
 * guides that apply universally.
 */

export interface Guide {
  slug:  string
  title: string
}

// Evergreen guides relevant to every Pakistani departure
const UNIVERSAL: Guide[] = [
  { slug: 'how-to-book-cheap-flights-pakistan', title: 'How to Book Cheap Flights from Pakistan: 9 Proven Tips' },
  { slug: 'cheapest-airlines-pakistan-gulf',    title: 'Cheapest Airlines from Pakistan to Gulf Countries (Ranked)' },
]

// Destination IATA → guides specific to that destination
const BY_DEST: Record<string, Guide[]> = {
  // Dubai / Sharjah
  DXB: [
    { slug: 'cheapest-month-to-fly-pakistan-to-dubai', title: 'Cheapest Month to Fly from Pakistan to Dubai (2026 Price Data)' },
    { slug: 'emirates-baggage-allowance-pakistan-routes', title: 'Emirates Baggage Allowance from Pakistan (Economy, Business & Extra Bags)' },
    { slug: 'flydubai-vs-air-arabia-pakistan', title: 'flydubai vs Air Arabia from Pakistan — Which Budget Airline Is Cheaper?' },
    { slug: 'dubai-visa-requirements-pakistan', title: 'Dubai Visa Requirements for Pakistani Passport Holders (2026)' },
  ],
  SHJ: [
    { slug: 'flydubai-vs-air-arabia-pakistan', title: 'flydubai vs Air Arabia from Pakistan — Which Budget Airline Is Cheaper?' },
    { slug: 'cheapest-month-to-fly-pakistan-to-dubai', title: 'Cheapest Month to Fly from Pakistan to Dubai (2026 Price Data)' },
    { slug: 'dubai-visa-requirements-pakistan', title: 'Dubai Visa Requirements for Pakistani Passport Holders (2026)' },
  ],

  // Umrah destinations
  JED: [
    { slug: 'umrah-flights-pakistan-cheapest-season', title: 'Cheapest Time to Book Umrah Flights from Pakistan (Month-by-Month)' },
  ],
  MED: [
    { slug: 'umrah-flights-pakistan-cheapest-season', title: 'Cheapest Time to Book Umrah Flights from Pakistan (Month-by-Month)' },
  ],
}

/**
 * Returns up to `limit` blog guides relevant to a route's destination.
 * Destination-specific guides come first, then universal evergreens.
 */
export function getRelatedGuides(toCode: string, limit = 4): Guide[] {
  const specific = BY_DEST[toCode.toUpperCase()] ?? []
  const merged: Guide[] = []
  const seen = new Set<string>()
  for (const g of [...specific, ...UNIVERSAL]) {
    if (seen.has(g.slug)) continue
    seen.add(g.slug)
    merged.push(g)
    if (merged.length >= limit) break
  }
  return merged
}
