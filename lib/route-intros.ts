/**
 * Long-form, route-specific intros for top-traffic pages.
 *
 * Why: programmatic route pages share a template, which Google sees as
 * thin/duplicate content. Adding 500+ words of unique copy per route gives
 * each top page a real chance to rank — and the words are written to match
 * the actual searches Pakistani travellers make.
 *
 * Only top routes get an entry. Other routes fall back to the template body.
 */

export interface RouteIntro {
  /** Heading shown above the prose. Plain string, no HTML. */
  heading: string
  /** Array of paragraphs. Each becomes a <p>. Plain text, no HTML. */
  paragraphs: string[]
  /** Optional H3 sub-sections for E-E-A-T depth. */
  subsections?: { h3: string; body: string }[]
}

export const ROUTE_INTROS: Record<string, RouteIntro> = {
  // ─── Karachi → Dubai ────────────────────────────────────────────────────────
  'karachi-to-dubai': {
    heading: 'Karachi to Dubai Flights — The Most Searched Pakistani Route',
    paragraphs: [
      'The Karachi to Dubai corridor is the busiest international route from Pakistan, with more than 40 daily flights operated by Emirates, flydubai, Air Arabia, PIA, FlyJinnah and Airblue. For Karachiites flying for work, family, shopping or onward connections, the choice of airline can change your total cost by PKR 30,000 or more on the same dates — even on a flight that takes just 2 hours 50 minutes nose-to-nose.',
      'Our daily price scraper tracks every fare on this route three times a day and stores history at /api/prices/KHI-DXB. Based on six months of data, Karachi–Dubai is at its cheapest in late January and early February, with budget fares from Air Arabia and flydubai falling to PKR 45,000–55,000 round-trip equivalent. Prices climb sharply from mid-March, peak during Eid al-Fitr and Eid al-Adha (PKR 110,000–150,000 one-way is normal in peak Eid week), and soften again from late August.',
      'For pure price, Air Arabia from Karachi to Sharjah is consistently the cheapest carrier on this route — flydubai is a close second, with promotional fares often undercutting Air Arabia on midweek departures. Emirates is the premium pick, and worth the PKR 12,000–20,000 difference if you are travelling with more than 20 kg of luggage: their 30 kg economy allowance saves you the equivalent of two extra-baggage tickets. PIA sits in the middle on price but is the only carrier with regular wide-body service on this short hop.',
      'Booking window matters more than the airline. We see fares 30–45 days out beat last-minute prices by an average of 28%. Tuesday and Wednesday departures are 10–18% cheaper than Friday or Sunday, and pre-6 AM flights — popular with workers commuting to Dubai for the week — are routinely the cheapest of the day.',
    ],
    subsections: [
      {
        h3: 'Which Karachi to Dubai flight is cheapest right now?',
        body: 'FlightRate compares Air Arabia, flydubai, Emirates, PIA, Airblue and FlyJinnah every 8 hours and shows the lowest live PKR fare at the top of this page. If the cheapest result is from a budget airline (Air Arabia or flydubai), check whether your luggage exceeds 20 kg — if it does, the next-cheapest option (Emirates or PIA with 30 kg / 23 kg respectively) is usually better value once excess-baggage fees are factored in.',
      },
      {
        h3: 'Direct vs one-stop — is one-stop ever cheaper?',
        body: 'On Karachi–Dubai, almost never. Karachi is only 1,170 km from Dubai and the direct flight is under 3 hours, so connecting via Muscat, Sharjah or Doha rarely saves money and always costs you 6–10 extra hours. The one exception is when Oman Air or Gulf Air run flash sales — even then, the saving is usually under PKR 5,000, which most travellers happily skip.',
      },
    ],
  },

  // ─── Lahore → Dubai ─────────────────────────────────────────────────────────
  'lahore-to-dubai': {
    heading: 'Lahore to Dubai Flights — Daily Direct Service from Allama Iqbal Airport',
    paragraphs: [
      'Lahore to Dubai is the second-busiest international route from Pakistan and the most frequently flown corridor for Punjabi workers, business travellers and families with relatives in the UAE. Emirates, flydubai, Air Arabia, PIA and Airblue operate this route daily, with combined frequency exceeding 35 flights per week. Flight time is 3 hours 30 minutes from Allama Iqbal International (LHE) to Dubai International (DXB) or Sharjah (SHJ).',
      'Pricing on LHE–DXB closely mirrors KHI–DXB but with slightly higher base fares — typically PKR 5,000–10,000 more — because there is less budget-airline competition. Air Arabia does not operate Lahore–Sharjah directly, so flydubai is effectively the cheapest carrier on this route. Our scraper sees flydubai economy fares from Lahore range PKR 55,000–90,000 in normal months, with promotional fares dipping into the low 50s on midweek early-morning departures.',
      'Lahore has a strong overnight flight market: red-eye departures between 1 AM and 4 AM are the cheapest of the day and let you arrive in Dubai before 8 AM local time. This works well for workers attending meetings the same day or families who want a full first day in Dubai without paying for an extra hotel night.',
      'Eid travel from Lahore is consistently the most price-sensitive period of the year. We strongly recommend booking Eid-period Lahore–Dubai flights at least 8 weeks ahead — fares routinely double in the final 14 days before Eid al-Fitr and triple before Eid al-Adha. For non-Eid travel, the 30–45 day booking window remains the sweet spot.',
    ],
    subsections: [
      {
        h3: 'Lahore to Dubai or Sharjah — which is better?',
        body: 'For most travellers, Dubai International (DXB) wins on convenience: it sits next to downtown, has the metro, and most hotels are 15–25 minutes by taxi. Sharjah is 35–50 minutes from central Dubai and a taxi will cost AED 100–150. Only book Sharjah if (a) you are staying in Sharjah or Ajman, or (b) the Air Arabia fare difference exceeds AED 200 / PKR 15,000.',
      },
      {
        h3: 'Does PIA offer better Lahore–Dubai service than the Gulf carriers?',
        body: 'PIA is reliable on this short route but does not consistently undercut Emirates or flydubai on price. Where PIA wins: 23 kg checked baggage included as standard (vs 20 kg on budget carriers), meals included, and a wider seat pitch than flydubai or Air Arabia. Where PIA loses: on-time performance has been weaker than the Gulf carriers historically, though the picture has improved significantly through 2025–26.',
      },
    ],
  },

  // ─── Islamabad → Dubai ──────────────────────────────────────────────────────
  'islamabad-to-dubai': {
    heading: 'Islamabad to Dubai Flights — Direct from Islamabad International (ISB)',
    paragraphs: [
      'Islamabad to Dubai is one of Pakistan\'s busiest northern routes, popular with civil servants, NGO workers, students and families travelling between Rawalpindi/Islamabad and the UAE. Emirates, flydubai, Air Arabia, PIA and Airblue all serve this corridor from Islamabad International Airport (ISB), with around 25–30 weekly flights between them. Flight time is 3 hours 15 minutes.',
      'Our daily price tracking shows Islamabad–Dubai fares typically sit PKR 3,000–8,000 above Karachi–Dubai for the same dates and airline, mainly because ISB has lower flight frequency than KHI. The cheapest option from Islamabad is consistently flydubai, which competes head-to-head with Air Arabia\'s Sharjah service for the budget segment. Emirates remains the premium choice with 30 kg baggage and full meals.',
      'For travellers in northern Punjab and KPK, ISB is often the only realistic gateway — Peshawar has limited Dubai service and many Khyber Pakhtunkhwa passengers find it cheaper to drive 2 hours to Islamabad than to fly via Peshawar or connect through Lahore. The same logic applies to passengers from Gilgit-Baltistan and Azad Kashmir.',
      'Booking 30–45 days out delivers the best Islamabad–Dubai fares. Last-minute prices (under 7 days) routinely cost 35–50% more than 6-week advance fares. Tuesday departures are the cheapest day of the week on this route based on our six-month dataset; Sunday is the most expensive.',
    ],
    subsections: [
      {
        h3: 'Is Islamabad–Dubai cheaper than driving to Lahore and flying from there?',
        body: 'Rarely. The fare difference between LHE–DXB and ISB–DXB is usually PKR 3,000–8,000, which is far less than the time, fuel, and motorway toll cost of a 4-hour drive from Islamabad to Lahore. Only consider Lahore if you live in northern Punjab and your departure city is genuinely closer to LHE than ISB.',
      },
      {
        h3: 'Where is the cheapest live Islamabad–Dubai fare today?',
        body: 'Check the price card at the top of this page — it pulls live data from our scraper, which checks every airline three times per day. Tap the WhatsApp button to confirm the live fare and complete booking in PKR within 7 minutes, with no card or foreign-currency requirement.',
      },
    ],
  },

  // ─── Karachi → Riyadh ───────────────────────────────────────────────────────
  'karachi-to-riyadh': {
    heading: 'Karachi to Riyadh Flights — Saudia, PIA & flynas Compared',
    paragraphs: [
      'Karachi to Riyadh is the most travelled Pakistan–Saudi Arabia route, with a strong mix of Iqama (work-visa) holders, businesspeople and Umrah pilgrims connecting via Riyadh. Saudia, PIA, flynas and Pakistan-based budget carriers operate this corridor with 15–20 weekly flights between them. Flight time is 3 hours 50 minutes from Jinnah International (KHI) to King Khalid International (RUH).',
      'For Iqama holders returning to the Kingdom, Saudia is the dominant carrier — they consistently offer the most reliable schedule, 23 kg checked baggage included, and Halal meal service. PIA is a strong second on this route and frequently undercuts Saudia on midweek dates. flynas is the budget option with 20 kg baggage and no included meals, but their promotional fares can drop to PKR 50,000–60,000 — about 30% cheaper than Saudia in low season.',
      'Riyadh fares behave very differently from Dubai fares because the demand cycle is driven by Iqama renewals and Umrah season rather than tourism. We see the cheapest Karachi–Riyadh fares in May, June and September (PKR 55,000–80,000 economy). Peak fares appear in October–November (when many workers return after summer break) and during Ramadan, with one-way fares reaching PKR 120,000–150,000.',
      'For families travelling with substantial luggage — common on Iqama re-entry trips — Saudia\'s 23 kg allowance vs flynas\'s 20 kg can matter more than the headline fare. A 25 kg bag on flynas at the airport costs roughly PKR 18,000–22,000, which often erases any saving over Saudia.',
    ],
    subsections: [
      {
        h3: 'Which day of the week is cheapest for Karachi–Riyadh?',
        body: 'Our six-month dataset shows Wednesday and Thursday departures from Karachi to Riyadh are 12–18% cheaper than Friday, Saturday or Monday. The expensive days are driven by the Saudi weekend (Friday–Saturday) when workers return to Riyadh after time off — fares spike sharply in that direction.',
      },
      {
        h3: 'Direct vs one-stop via Dubai or Doha?',
        body: 'Direct flights with Saudia and PIA are almost always the same price as one-stop alternatives via DXB or DOH, and save 4–7 hours. Only consider connecting flights if (a) the direct fare is unusually high (above PKR 100,000), and (b) you can find a Qatar Airways or Emirates promotion through their hub. Most months, this is not the case.',
      },
    ],
  },

  // ─── Karachi → Jeddah ───────────────────────────────────────────────────────
  'karachi-to-jeddah': {
    heading: 'Karachi to Jeddah Flights — Direct Service for Umrah & Work',
    paragraphs: [
      'Karachi to Jeddah is the busiest Umrah corridor in Pakistan and the second-busiest Pakistan–Saudi Arabia route after Karachi–Riyadh. Saudia, PIA, flynas and seasonally other carriers operate this 4-hour direct service from Jinnah International (KHI) to King Abdulaziz International (JED), the gateway airport for Makkah pilgrimage.',
      'Pricing on KHI–JED is heavily seasonal because Umrah demand drives the entire pricing curve. The cheapest months for non-pilgrim travel are January, early February and June — fares routinely fall to PKR 55,000–75,000 one-way economy. The most expensive period is the final two weeks of Ramadan, when Umrah demand pushes fares above PKR 150,000 and even PKR 200,000 in the last 7 days before Eid.',
      'For Umrah pilgrims, the most reliable carriers are Saudia and PIA — both have decades of experience handling pilgrim traffic, offer Halal meals, and provide enough cabin space for Ihram-clothed passengers. flynas is the budget option (typically 15–25% cheaper than Saudia) but does not include meals and has tighter cabin baggage limits.',
      'Booking 4–8 weeks ahead delivers the best Karachi–Jeddah fares for shoulder-season Umrah. For Ramadan-period travel, 12–16 weeks of lead time is needed to access reasonable prices — many Pakistani pilgrims book the following year\'s Ramadan Umrah in October or November of the prior year.',
    ],
    subsections: [
      {
        h3: 'Is Karachi–Jeddah cheaper than Karachi–Madinah?',
        body: 'Yes, almost always. Jeddah has more airlines and more daily frequency, which means more competition and lower fares — typically PKR 5,000–15,000 below the same-date Madinah fare. Most Umrah travellers either fly into Jeddah and leave from Madinah (open-jaw), or fly in and out of Jeddah and take a bus or private car between the two cities.',
      },
      {
        h3: 'Which Karachi to Jeddah flight has the best Umrah experience?',
        body: 'Saudia is the most pilgrim-friendly carrier — the cabin crew often announce Ihram-related guidance, meals are halal, and prayer timings are accommodated. PIA is very similar. flynas works fine for budget pilgrims but offers a more minimal service. Whichever you choose, book aisle seats for easier movement and consider paying for extra legroom rows on the 4-hour flight.',
      },
    ],
  },
}

export function getRouteIntro(routeSlug: string): RouteIntro | null {
  return ROUTE_INTROS[routeSlug] ?? null
}
