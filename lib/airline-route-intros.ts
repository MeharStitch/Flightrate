/**
 * Hand-written, unique intro copy for the airline+route pages that already pull
 * real search impressions (per Google Search Console) but sit on page 2 because
 * the templated body reads as thin/duplicate content.
 *
 * Adding genuinely different prose to these specific pages gives Google a reason
 * to rank them above the generic template — the goal is page 2 → page 1 for the
 * routes that are proven to have demand. Keyed by `${routeSlug}::${airlineSlug}`.
 *
 * Keep each entry factual and specific to that corridor (who flies it, airport,
 * traffic type, fare behaviour). Generic filler defeats the purpose.
 */

export interface AirlineRouteIntro {
  heading:    string
  paragraphs: string[]
}

const INTROS: Record<string, AirlineRouteIntro> = {
  // LHE → MCT, PIA — 66 impressions, top performer
  'lahore-to-muscat::pia': {
    heading: 'PIA Lahore to Muscat: What Travellers Should Know',
    paragraphs: [
      'PIA is one of the few carriers offering a direct Lahore to Muscat service, which is why it stays in demand with the large Pakistani workforce based in Oman. Most passengers on this corridor are returning workers and families visiting relatives, so seats fill fastest around Eid, summer holidays and the end of contract seasons. Booking three to five weeks ahead almost always beats a last-minute walk-up fare.',
      'The flight covers roughly 4 hours nonstop, and PIA economy includes a 30 kg checked allowance on most Gulf fares, which matters to workers carrying goods home. Fares move daily with fuel and demand, so the number you see above is the lowest live base fare we scraped today. Message us before you book and we will confirm the exact all-in PKR price, compare it against Oman Air and Salam Air on the same date, and tell you honestly which is cheaper.',
    ],
  },

  // MED → MUX, PIA — 26 impressions, 2 clicks (strong CTR)
  'madinah-to-multan::pia': {
    heading: 'PIA Madinah to Multan: Return Fares for Pilgrims',
    paragraphs: [
      'The Madinah to Multan route carries mostly Umrah and Hajj pilgrims heading home to southern Punjab, plus families based in Saudi Arabia. PIA runs this sector seasonally and frequency rises sharply during and after the Umrah peak, from Ramadan through the early Hajj window. Because demand is so seasonal, return fares can swing widely week to week, which is exactly why pilgrims search for the price on the day they plan to fly.',
      'Multan airport handles direct Saudi traffic, so many travellers prefer flying straight home rather than connecting through Lahore or Karachi. PIA economy typically allows generous checked baggage on Saudi routes, useful for Zamzam and gifts. The fare above is today\'s lowest live base price. Send us your travel date on WhatsApp and we will confirm the final PKR fare, including taxes, and check whether flynas or Saudia is cheaper for your dates.',
    ],
  },

  // ISB → DMM, PIA — 58 impressions
  'islamabad-to-dammam::pia': {
    heading: 'PIA Islamabad to Dammam: Fares for the Eastern Province',
    paragraphs: [
      'Dammam and the wider Eastern Province host a very large Pakistani labour community, so the Islamabad to Dammam route is dominated by workers travelling on visit and work visas. PIA is a long-standing operator here and is often the first choice for passengers who want a direct, familiar service. Fares are most competitive outside the summer and Eid rush, when worker traffic peaks and prices climb.',
      'Expect around 4 to 4.5 hours of flying time and a standard 30 kg economy checked allowance on most PIA Gulf fares. Prices change every day, so the figure shown is the lowest live base fare from today\'s scrape. Before you commit, WhatsApp us with your date and we will give you the exact all-in PKR price and compare PIA against Saudia and flynas on the same route, no obligation.',
    ],
  },

  // ISB → RUH, flynas — 30 impressions
  'islamabad-to-riyadh::flynas': {
    heading: 'flynas Islamabad to Riyadh: Low-Cost Fares Explained',
    paragraphs: [
      'flynas is Saudi Arabia\'s main low-cost carrier and often shows the cheapest base fare on Islamabad to Riyadh, which is why budget-conscious workers and families search for it by name. The trade-off is that flynas prices baggage and seats separately, so the headline fare is genuinely low but the final cost depends on how many bags you add. For travellers flying light, it can beat PIA and Saudia comfortably.',
      'The route runs around 4.5 hours to the Saudi capital, where a huge Pakistani community lives and works. Because flynas fares are unbundled, the number above reflects the base fare only. This is exactly where buyers get caught out, so message us your date and bag count and we will work out the true all-in PKR price for flynas, then compare it against PIA and Saudia so you can see which is actually cheaper for your trip.',
    ],
  },

  // SKT → BAH, PIA — 23 impressions
  'sialkot-to-bahrain::pia': {
    heading: 'PIA Sialkot to Bahrain: Direct From Central Punjab',
    paragraphs: [
      'Sialkot airport serves a densely populated part of central Punjab with strong ties to Bahrain\'s Pakistani workforce, so a direct Sialkot to Bahrain service saves travellers the long road trip to Lahore or Islamabad. PIA flies this sector for workers and families, and seats tend to tighten around Eid and the summer leave season when contract workers head home.',
      'The flight is relatively short for a Gulf route, and PIA economy generally includes a 30 kg checked allowance, valued by workers carrying goods both ways. Fares shift daily with demand, and the price above is today\'s lowest live base fare. Tell us your travel dates on WhatsApp and we will confirm the final PKR fare with taxes and check Gulf Air on the same route, so you book the genuinely cheapest option.',
    ],
  },

  // LHE → AUH, PIA — 16 impressions
  'lahore-to-abu-dhabi::pia': {
    heading: 'PIA Lahore to Abu Dhabi: Fares and Timing',
    paragraphs: [
      'Abu Dhabi is a major destination for Pakistani professionals and workers, and the Lahore to Abu Dhabi route stays busy year round. PIA competes here with Etihad and FlyJinnah, so prices are more variable than on routes with fewer operators. That competition works in your favour if you check the live price on the day rather than assuming one airline is always cheapest.',
      'Flying time is around 3 hours, and PIA economy typically carries a 30 kg checked allowance on UAE fares. The figure above is the lowest live base fare we scraped today. Because Etihad and FlyJinnah often undercut each other on this corridor, message us your date and we will compare all three in PKR and tell you which gives the best all-in price for your travel day.',
    ],
  },

  // KHI → MCT, PIA — ~35 impressions (prior week)
  'karachi-to-muscat::pia': {
    heading: 'PIA Karachi to Muscat: A Short, Busy Gulf Hop',
    paragraphs: [
      'Karachi to Muscat is one of the shortest international routes from Pakistan and one of the busiest, thanks to the very large Pakistani community working in Oman and decades of trade links between the two port cities. PIA flies it frequently, competing with Oman Air and Salam Air, so fares can vary a lot between carriers on the same day.',
      'The hop is under 2 hours, and PIA economy generally includes a 30 kg checked allowance, helpful for workers moving goods. Prices move daily with demand, and the number above is today\'s lowest live base fare. Send your date on WhatsApp and we will confirm the exact PKR fare and compare PIA against Oman Air and Salam Air, so you only pay the lowest available price.',
    ],
  },

  // LYP → RUH, PIA — "faisalabad to riyadh ticket price"
  'faisalabad-to-riyadh::pia': {
    heading: 'PIA Faisalabad to Riyadh: Fares From the Textile City',
    paragraphs: [
      'Faisalabad sends a steady flow of workers and families to Riyadh, and PIA is the carrier most Faisalabad travellers search for by name on this route. Flying direct from Faisalabad avoids the long road to Lahore or Islamabad, which is why demand holds up year round and rises sharply around Eid and the summer leave season when workers head home.',
      'Riyadh is the largest Pakistani job market in Saudi Arabia, so seats on worker-heavy dates fill early and fares climb with them. PIA economy generally carries a 30 kg checked allowance on Saudi routes, valued by workers moving goods. The price above is today\'s lowest live base fare. WhatsApp us your date and we will confirm the exact all-in PKR fare and compare PIA against Saudia and flynas so you book the cheapest option for your dates.',
    ],
  },

  // LYP → MED, PIA — "faisalabad to madinah flight ticket price pia"
  'faisalabad-to-madinah::pia': {
    heading: 'PIA Faisalabad to Madinah: Umrah Fares Explained',
    paragraphs: [
      'The Faisalabad to Madinah route is driven almost entirely by Umrah and Hajj pilgrims from central Punjab, plus families visiting relatives working in Saudi Arabia. PIA runs this sector seasonally, and both frequency and price move with the pilgrimage calendar — demand peaks through Ramadan and the Umrah season, then eases afterwards.',
      'Because the traffic is so seasonal, fares can swing week to week, which is exactly why pilgrims check the price on the day they plan to travel. PIA economy usually allows generous checked baggage on Saudi routes, useful for Zamzam and gifts on the way home. The figure above is today\'s lowest live base fare. Send us your travel date on WhatsApp and we will confirm the final PKR price and check whether Saudia is cheaper for your dates.',
    ],
  },

  // SKT → JED, PIA — "sialkot to jeddah ticket price pia"
  'sialkot-to-jeddah::pia': {
    heading: 'PIA Sialkot to Jeddah: Direct Umrah Travel From Central Punjab',
    paragraphs: [
      'Sialkot airport serves a densely populated part of central Punjab with strong Umrah and worker traffic to the Jeddah region, the main gateway for pilgrims heading to Makkah. A direct Sialkot to Jeddah service saves travellers the long trip to Lahore or Islamabad, so PIA stays in demand here, especially during the Umrah season and around Hajj.',
      'Fares on this corridor rise steeply in peak pilgrimage months and settle in the off-season, so timing matters more than on year-round business routes. PIA economy generally includes a 30 kg checked allowance on Saudi routes. The price shown is today\'s lowest live base fare. Message us your dates on WhatsApp and we will confirm the exact all-in PKR fare and compare PIA against Saudia and flynas so you pay the lowest available price.',
    ],
  },

  // LHE → DOH, PIA — "lahore to qatar ticket price pia"
  'lahore-to-doha::pia': {
    heading: 'PIA Lahore to Doha: Fares to Qatar',
    paragraphs: [
      'Doha hosts a large Pakistani community, and Lahore to Doha stays busy with workers, professionals and families all year. PIA competes on this route with Qatar Airways, so prices vary more than on routes with a single dominant carrier. That competition helps you, provided you check the live price on your travel day rather than assuming one airline is always cheaper.',
      'Flying time is around 3.5 hours, and PIA economy typically carries a 30 kg checked allowance on Gulf fares. The number above is today\'s lowest live base fare from our scrape. Because Qatar Airways often runs promotions on this corridor, message us your date on WhatsApp and we will compare both carriers in PKR and tell you honestly which gives the best all-in price for your trip.',
    ],
  },

  // ISB → DXB, PIA — "pia islamabad to dubai ticket price today"
  'islamabad-to-dubai::pia': {
    heading: 'PIA Islamabad to Dubai: Fares and Frequency',
    paragraphs: [
      'Islamabad to Dubai is one of the busiest routes from northern Pakistan, and PIA is a long-standing operator that many travellers search for by name. On this corridor PIA competes directly with Emirates, flydubai and Air Arabia, so fares move more than on routes with a single carrier — checking the live price on your travel day usually beats assuming PIA is cheapest.',
      'The flight runs around 3 hours, and PIA economy typically carries a 30 kg checked allowance on UAE fares, valued by workers and families carrying goods. The price above is today\'s lowest live base fare from our scrape. Because Emirates and flydubai frequently undercut each other out of Islamabad, message us your date on WhatsApp and we will compare all of them in PKR and confirm the exact all-in fare — no obligation.',
    ],
  },

  // LHE → DXB, PIA — "pia lahore to dubai ticket price today"
  'lahore-to-dubai::pia': {
    heading: 'PIA Lahore to Dubai: What to Expect on Fares',
    paragraphs: [
      'Lahore to Dubai carries heavy year-round traffic — workers, families, shoppers and passengers connecting onward through Dubai. PIA is a familiar choice here alongside Emirates, flydubai, Air Arabia and FlyJinnah, which keeps the route competitive. That competition works in your favour if you compare live fares rather than booking the first price you see.',
      'Expect roughly 3 hours of flying time and a standard 30 kg PIA economy allowance on most UAE fares. The figure above is today\'s lowest live base fare. Fares from Lahore swing with demand and season, so WhatsApp us your date and we will check PIA against every other airline on the route in PKR and tell you honestly which gives the best all-in price.',
    ],
  },

  // KHI → DXB, PIA — flagship route
  'karachi-to-dubai::pia': {
    heading: 'PIA Karachi to Dubai: Fares on Pakistan\'s Busiest Route',
    paragraphs: [
      'Karachi to Dubai is the single busiest international route from Pakistan, with dozens of daily flights across Emirates, flydubai, Air Arabia, PIA, FlyJinnah and Airblue. PIA remains a familiar, direct option for Karachiites flying for work, family or onward connections. With so many carriers competing, prices on the same day can differ widely — which is exactly why live comparison matters here.',
      'The hop is under 2.5 hours, and PIA economy generally includes a 30 kg checked allowance on UAE fares. The number above is today\'s lowest live base fare from our scrape. Send us your date on WhatsApp and we will line PIA up against every other airline on this route in PKR, then confirm the exact all-in fare so you only pay the lowest available price.',
    ],
  },

  // KHI → DXB, Airblue — "air blue karachi to dubai ticket price in pakistani rupees"
  'karachi-to-dubai::airblue': {
    heading: 'Airblue Karachi to Dubai: Budget Fares Explained',
    paragraphs: [
      'Airblue is a Pakistani carrier that many Karachi travellers look for by name on the Dubai route, often as a lower-cost alternative to the full-service Gulf airlines. On Karachi to Dubai it competes with Emirates, flydubai, Air Arabia and PIA, and its base fares can be among the cheaper direct options depending on the date.',
      'As with most value fares, the headline price covers the base seat — baggage and extras depend on your fare type, so check the allowance before you book. The price above is today\'s lowest live base fare from our scrape. WhatsApp us your date and bag needs and we will confirm the true all-in PKR price for Airblue and compare it against every other airline on the route so you get the genuine cheapest fare.',
    ],
  },

  // LYP → SHJ, Air Arabia — 5 impressions
  'faisalabad-to-sharjah::air-arabia': {
    heading: 'Air Arabia Faisalabad to Sharjah: Budget Travel From the Heart of Punjab',
    paragraphs: [
      'Air Arabia is the low-cost specialist on Faisalabad to Sharjah, a route built around the textile city\'s strong worker and trade links with the UAE. Sharjah sits next to Dubai, so this is a popular and cheaper way into the wider Dubai area for budget travellers who do not mind the short transfer. Air Arabia\'s base fares are among the lowest you will find from Faisalabad.',
      'As a low-cost carrier, Air Arabia charges separately for checked bags and seats, so the headline price is low but your final cost depends on your baggage. The fare above is the base fare from today\'s live scrape. Tell us your date and how many bags you need on WhatsApp, and we will calculate the true all-in PKR price and check it against any PIA or flydubai option on the same dates.',
    ],
  },
}

/**
 * Returns unique intro copy for a proven-demand airline+route page, or null.
 * Falls back to null so the template simply renders without the extra section.
 */
export function getAirlineRouteIntro(
  routeSlug: string,
  airlineSlug: string
): AirlineRouteIntro | null {
  return INTROS[`${routeSlug}::${airlineSlug}`] ?? null
}
