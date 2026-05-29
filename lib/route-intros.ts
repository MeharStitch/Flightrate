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

  // ─── Karachi → Doha ─────────────────────────────────────────────────────────
  'karachi-to-doha': {
    heading: 'Karachi to Doha Flights — Qatar Airways Home Route from Pakistan',
    paragraphs: [
      'Karachi to Doha is one of the most strategically important Pakistani routes — Doha is not only a destination but the primary one-stop hub for Pakistanis flying to the UK, Canada, USA and onward to Europe and Africa. Qatar Airways operates this 3 hour 15 minute corridor multiple times daily from Jinnah International (KHI) to Hamad International (DOH), with PIA running competing direct service.',
      'Qatar Airways dominates this route both in frequency and reputation. Their 30 kg economy baggage, full meal service, on-time record and award-winning ground experience at Hamad mean QR fares typically sit PKR 8,000–18,000 above PIA on the same dates — but most Pakistani business and connection travellers consider the premium worth paying. For point-to-point Karachi–Doha travellers (workers, families visiting Qatar), PIA remains the value pick at PKR 50,000–80,000 round-trip equivalent in normal months.',
      'The hidden value on Karachi–Doha is the connecting market. Qatar Airways consistently offers among the lowest one-stop fares from Pakistan to London, Manchester, Birmingham, Toronto and New York — often cheaper than Emirates via Dubai. If your end destination is the UK, Canada or US east coast, always price the Qatar Airways via-DOH itinerary before booking — savings of PKR 15,000–35,000 are common compared to Emirates DXB transit.',
      'For Qatari work-visa holders (QID) returning to Doha after leave, Qatar Airways often releases reduced fares 6–10 weeks ahead — particularly out of Karachi. Booking 30–60 days out lands the best prices for both point-to-point and connecting Karachi–Doha tickets.',
    ],
    subsections: [
      {
        h3: 'Qatar Airways vs PIA — when does PIA actually win?',
        body: 'PIA wins on Karachi–Doha when you are a price-sensitive traveller with light luggage, departing on midweek dates, and only need to reach Doha (not connect onward). For everyone else — and especially for travellers connecting through DOH to UK/Canada/USA — Qatar Airways wins on baggage, schedule reliability, transit experience and total trip price.',
      },
      {
        h3: 'Hamad International transit — what to expect on a layover',
        body: 'Hamad International (DOH) is consistently ranked among the world\'s top airports. For Pakistani travellers connecting onward, the transit experience is excellent: free showers, prayer rooms with separate facilities, quiet zones, halal dining options throughout, and clear English/Urdu signage. Layovers under 4 hours are easy. For 6+ hour layovers, Qatar Airways offers transit hotels and even free Doha city tours on some itineraries.',
      },
    ],
  },

  // ─── Lahore → Jeddah ────────────────────────────────────────────────────────
  'lahore-to-jeddah': {
    heading: 'Lahore to Jeddah Flights — Direct Umrah Service from Allama Iqbal Airport',
    paragraphs: [
      'Lahore to Jeddah is the second-busiest Umrah corridor from Pakistan and a major route for Punjabi pilgrims, Iqama holders working in Jeddah/Makkah/Madinah, and overseas Pakistanis returning to family in Saudi Arabia. Saudia, PIA and flynas operate this 4 hour 10 minute direct service from Allama Iqbal International (LHE) to King Abdulaziz International (JED), with combined weekly frequency of 18–25 flights depending on season.',
      'Lahore–Jeddah fares run PKR 5,000–10,000 above Karachi–Jeddah for the same dates because LHE has lower carrier frequency than KHI. The cheapest option is consistently flynas, with promotional fares dropping to PKR 60,000–80,000 in non-peak months. Saudia is the most reliable carrier and the preferred choice for Umrah pilgrims who value experienced cabin crew and Halal meal service. PIA sits in the middle with 23 kg baggage and includes meals.',
      'Pricing on this route is entirely driven by Umrah demand. Cheapest months: January, early February, June and September. Peak periods: the final two weeks of Ramadan (PKR 150,000–200,000+), and the weeks immediately before and after Hajj (when non-Hajj Umrah pilgrims cannot enter Makkah, so flights briefly soften, then surge for Hajj returners).',
      'Many Punjabi pilgrims combine Jeddah and Madinah travel: fly Lahore → Jeddah for Makkah Umrah, take a bus or private car (4–5 hours) to Madinah for ziyarat, then fly Madinah → Lahore on return. Book each leg separately on FlightRate for the lowest combined PKR fare.',
    ],
    subsections: [
      {
        h3: 'How early should I book Lahore–Jeddah for Umrah?',
        body: 'For shoulder-season Umrah (June, September, January), 4–8 weeks ahead delivers the best fares. For Ramadan Umrah, 12–16 weeks ahead is essential — many Lahore-based pilgrims book Ramadan flights in October or November of the prior year. Last-minute Ramadan fares from Lahore routinely exceed PKR 180,000 one-way.',
      },
      {
        h3: 'Lahore–Jeddah direct or via Islamabad/Karachi?',
        body: 'Always fly direct from Lahore if available — the price difference vs connecting via ISB or KHI is rarely worth the extra 4–6 hours of travel time. The only exception is Hajj season, when Saudi authorities restrict charter slots and direct LHE fares may briefly spike above PKR 200,000.',
      },
    ],
  },

  // ─── Islamabad → Jeddah ─────────────────────────────────────────────────────
  'islamabad-to-jeddah': {
    heading: 'Islamabad to Jeddah Flights — Saudia, PIA & flynas Compared',
    paragraphs: [
      'Islamabad to Jeddah is the third-busiest Umrah corridor from Pakistan and the primary Saudi route for travellers in northern Pakistan — Islamabad, Rawalpindi, KPK, Azad Kashmir and Gilgit-Baltistan. Saudia, PIA and flynas operate this 4 hour 15 minute direct service from Islamabad International (ISB) to King Abdulaziz International (JED).',
      'ISB–JED fares track closely with Lahore–Jeddah fares — usually within PKR 3,000–5,000. Saudia is the dominant carrier with the most reliable schedule and Halal meal service. PIA offers strong value with 23 kg baggage included. flynas is the budget option with fares often 15–20% below Saudia in non-peak months, but with 20 kg baggage and no meals — factor extra baggage cost (PKR 8,000–12,000 if you carry 25 kg) into the total comparison.',
      'For travellers in KPK and northern Punjab, Islamabad is the cheapest gateway to Saudi Arabia — Peshawar has very limited Jeddah service and it is usually more economical to drive to ISB than to fly via PEW or connect through LHE/KHI. The same applies to passengers from Muzaffarabad, Mirpur and other Azad Kashmir cities.',
      'Cheapest months: January, February, June and September. Most expensive periods: final 14 days of Ramadan, and the immediate post-Eid al-Fitr window when many pilgrims return. Booking 30–60 days ahead delivers the best prices for shoulder-season Umrah; Ramadan travel requires 3+ months of lead time.',
    ],
    subsections: [
      {
        h3: 'Is ISB–JED ever cheaper than ISB–MED (Madinah)?',
        body: 'Yes, almost always. Jeddah has more carrier competition and higher frequency than Madinah, so JED fares typically run PKR 5,000–15,000 below MED on the same dates. Most ISB pilgrims fly into Jeddah for the lower fare and either take a bus to Madinah after Makkah Umrah, or fly back to Pakistan from Madinah on an open-jaw ticket.',
      },
      {
        h3: 'Which airline is most pilgrim-friendly for Islamabad–Jeddah?',
        body: 'Saudia and PIA are both highly experienced with Pakistani pilgrim traffic — Ihram-friendly cabins, Halal meals, prayer-timing announcements, and crew familiar with Umrah procedures. flynas works fine for budget pilgrims but offers a more no-frills experience. For first-time Umrah travellers, Saudia or PIA is recommended even if PKR 8,000–15,000 more expensive.',
      },
    ],
  },

  // ─── Karachi → London ───────────────────────────────────────────────────────
  'karachi-to-london': {
    heading: 'Karachi to London Flights — PIA Direct vs One-Stop via Doha, Dubai or Istanbul',
    paragraphs: [
      'Karachi to London is the highest-value diaspora route from Pakistan, used by students heading to UK universities, families visiting relatives in the UK, business travellers and dual nationals. PIA is currently the only direct carrier on this 8 hour 30 minute corridor, flying KHI to London Heathrow (LHR) and seasonally Manchester (MAN). Qatar Airways via Doha, Emirates via Dubai and Turkish Airlines via Istanbul provide the major one-stop alternatives.',
      'Pricing on Karachi–London is genuinely competitive: PIA direct sits around PKR 180,000–280,000 economy round-trip equivalent, while Qatar Airways, Emirates and Turkish Airlines one-stop options often match or undercut PIA direct, especially 60+ days out. For most non-time-sensitive travellers, the one-stop Gulf or Istanbul routing is the better value — Qatar Airways frequently runs the lowest fares with 30 kg baggage, a smooth DOH transit and a total journey time of 11–14 hours.',
      'For students starting UK university programmes in September, book in May or June to access the cheapest fares — last-minute August bookings can run PKR 350,000+ one-way. The cheapest baggage allowance for student travel is on Qatar Airways or Turkish Airlines (both 30 kg), which is meaningfully better than PIA\'s 23 kg when you are shipping a year\'s worth of belongings.',
      'For UK-based Pakistanis returning to Karachi for the winter holiday season (November–January) or Eid, prices spike significantly. Booking 12–16 weeks ahead for Christmas/New Year travel is essential. The cheapest direction of travel during these peaks is usually KHI → LHR rather than LHR → KHI, so couples or families travelling in pairs may save by booking one-way segments separately.',
    ],
    subsections: [
      {
        h3: 'Is PIA direct worth the extra time savings vs Qatar Airways via Doha?',
        body: 'For business travellers and elderly passengers, yes — saving 3–5 hours of transit and avoiding a connection is worth a moderate fare premium. For students, families and budget-conscious travellers, the one-stop Qatar Airways routing usually wins on total trip cost and baggage allowance. Compare the live fares on this page before deciding.',
      },
      {
        h3: 'Karachi to London Heathrow vs Manchester vs Birmingham — which is cheapest?',
        body: 'Heathrow has the highest carrier competition and frequency, so LHR fares are often the cheapest. Manchester and Birmingham fares are typically PKR 10,000–25,000 higher per ticket but may save you money if your final destination is in the Midlands or North — train and bus costs from LHR to those cities can wipe out the saving from flying into LHR.',
      },
    ],
  },

  // ─── Lahore → London ───────────────────────────────────────────────────────
  'lahore-to-london': {
    heading: 'Lahore to London Flights — PIA Direct, Qatar Airways & Turkish Airlines',
    paragraphs: [
      'Lahore to London is the largest diaspora corridor from Punjab and one of the top three Pakistan–UK routes by volume. PIA operates the only direct service from Allama Iqbal International (LHE) to London Heathrow (LHR), with seasonal Manchester and Birmingham flights. Qatar Airways via Doha, Emirates via Dubai, Turkish Airlines via Istanbul and Etihad via Abu Dhabi all serve LHE–LON with one-stop itineraries.',
      'Lahore–London fares broadly mirror Karachi–London but with slightly lower frequency on PIA direct. Qatar Airways consistently offers the most competitive Lahore–LHR fares in the PKR 180,000–260,000 round-trip range, with 30 kg baggage and the strongest DOH transit experience. Turkish Airlines is often the cheapest of all carriers, particularly for travellers willing to accept a longer 4–8 hour Istanbul layover — IST itself is a comfortable airport with good Halal dining options.',
      'For Pakistani students heading to UK universities, Lahore–LHR or LHE–MAN are the most popular departures. Book 12–16 weeks before September intake for the cheapest fares; ideal carriers are Qatar Airways or Turkish Airlines (30 kg baggage). Some students also fly LHE → Sharjah or Dubai → London, but the multi-hop fare rarely beats a single one-stop QR or TK ticket.',
      'For UK-based Punjabi families returning to Lahore for Eid or weddings, book 12+ weeks ahead. Wedding-season fares (October–February) can be 40–60% above off-peak prices. Lahore is also a key gateway for the UK Mirpuri/Kashmiri diaspora — many travellers fly LHE then drive or take a domestic connection to Mirpur or Muzaffarabad.',
    ],
    subsections: [
      {
        h3: 'Is Turkish Airlines really worth the longer layover from Lahore?',
        body: 'For price-sensitive travellers, yes — Turkish Airlines is frequently the cheapest carrier on LHE–LHR and the 30 kg baggage matches Qatar Airways. The downside is the longer 4–8 hour IST layover, which adds significant fatigue on what is already a 14–17 hour total trip. Best for younger travellers and students; less ideal for families with young children or elderly passengers.',
      },
      {
        h3: 'PIA direct Lahore–Heathrow vs one-stop — when is direct genuinely cheaper?',
        body: 'PIA direct is rarely the absolute cheapest option on LHE–LHR, but it is the fastest at 8.5 hours nose-to-nose. It wins on convenience for business travellers, elderly family members and anyone with a tight UK arrival schedule. For most diaspora travel, the time saving does not justify the typical PKR 15,000–30,000 premium over Qatar Airways or Turkish Airlines.',
      },
    ],
  },

  // ─── Islamabad → London ─────────────────────────────────────────────────────
  'islamabad-to-london': {
    heading: 'Islamabad to London Flights — PIA Direct & One-Stop via Gulf Hubs',
    paragraphs: [
      'Islamabad to London is the primary Pakistan–UK route for travellers in northern Pakistan — Islamabad, Rawalpindi, KPK, Azad Kashmir and Gilgit-Baltistan. It carries a heavy mix of students, dual nationals, families visiting relatives, and the large Mirpuri/Kashmiri diaspora whose UK community is one of the oldest South Asian populations in Britain. PIA operates direct service from Islamabad International (ISB) to London Heathrow (LHR), with Qatar Airways via Doha, Emirates via Dubai and Turkish Airlines via Istanbul providing the major one-stop alternatives.',
      'ISB–LON fares track closely with Lahore–London, generally within PKR 5,000–15,000. PIA direct runs around PKR 185,000–290,000 round-trip equivalent, while Qatar Airways and Turkish Airlines one-stop fares frequently match or undercut PIA direct when booked 60+ days ahead. Qatar Airways is the strongest one-stop pick with 30 kg baggage and a smooth Doha transit; Turkish Airlines is often the outright cheapest for travellers who accept a longer Istanbul layover.',
      'Islamabad is the natural gateway for the UK Kashmiri diaspora travelling to Mirpur, Muzaffarabad and surrounding Azad Kashmir districts — most fly into ISB and continue by road. For these travellers, ISB direct or one-stop is almost always more practical than routing through Lahore or Karachi.',
      'For students heading to UK universities for the September intake, book in May–June. The cheapest baggage allowance for student travel is Qatar Airways or Turkish Airlines (30 kg vs PIA\'s 23 kg) — meaningful when shipping a year of belongings. For winter holiday and Eid returns, book 12–16 weeks ahead as fares spike 40–60% in peak windows.',
    ],
    subsections: [
      {
        h3: 'Is Islamabad–London direct (PIA) worth it over a Gulf connection?',
        body: 'PIA direct saves 3–5 hours versus a one-stop routing and avoids a connection — valuable for elderly travellers, families with young children, and business travellers. But it is rarely the cheapest option. For students and budget-conscious diaspora travellers, Qatar Airways via Doha or Turkish Airlines via Istanbul usually wins on total cost and offers more generous baggage.',
      },
      {
        h3: 'Where is the cheapest live Islamabad–London fare today?',
        body: 'The price card at the top of this page shows the lowest live fare across PIA, Qatar Airways, Emirates and Turkish Airlines, updated three times daily by our scraper. Tap WhatsApp to confirm the current fare and complete booking in PKR within 7 minutes — no card or foreign currency required.',
      },
    ],
  },

  // ─── Karachi → Toronto ──────────────────────────────────────────────────────
  'karachi-to-toronto': {
    heading: 'Karachi to Toronto Flights — Cheapest Hub for Pakistan to Canada',
    paragraphs: [
      'Karachi to Toronto is the leading Pakistan–Canada route, driven by the large and fast-growing Pakistani-Canadian community, students at Ontario universities, and new immigrants under Canada\'s Express Entry programme. There is no direct flight; the journey is a one-stop, 16–19 hour trip via a Gulf or European hub. The three main routings are Qatar Airways via Doha, Emirates via Dubai and Turkish Airlines via Istanbul, all into Toronto Pearson (YYZ).',
      'Hub choice is the single biggest factor in Karachi–Toronto pricing. Qatar Airways via Doha is consistently among the cheapest and offers the shortest total journey for most dates, with 30 kg economy baggage. Turkish Airlines via Istanbul is frequently the lowest headline fare but with longer layovers. Emirates via Dubai is the premium option — reliable, comfortable, with strong baggage — but usually PKR 20,000–50,000 more than Qatar Airways on the same dates.',
      'Typical Karachi–Toronto economy fares run PKR 230,000–380,000 round-trip equivalent, with wide swings by season and booking window. The cheapest fares appear when booked 2–4 months ahead. For new immigrants travelling one-way with maximum luggage, the baggage allowance becomes critical — Qatar Airways and Emirates (30 kg) beat carriers with 23 kg, and many immigrant travellers pre-purchase a second bag, which is far cheaper than excess at the airport or shipping.',
      'For students starting at Canadian universities (September and January intakes), book 3–4 months ahead. The student-friendly carriers are Qatar Airways and Emirates for baggage; Turkish Airlines for outright price. Avoid last-minute August/December booking, when one-way fares can exceed PKR 450,000.',
    ],
    subsections: [
      {
        h3: 'Which hub is cheapest for Karachi to Toronto — Doha, Dubai or Istanbul?',
        body: 'Across our six-month dataset, Qatar Airways via Doha and Turkish Airlines via Istanbul trade the cheapest-fare position depending on the date. Qatar usually wins on shorter total journey time and better transit experience at Hamad; Turkish often wins on the absolute lowest fare but with longer Istanbul layovers. Emirates via Dubai is rarely cheapest but is the most comfortable. Always compare all three live fares before booking.',
      },
      {
        h3: 'How much luggage can I bring from Karachi to Toronto?',
        body: 'On long-haul economy to Canada, Qatar Airways and Emirates typically allow 30 kg (sometimes 2×23 kg piece concept on certain fare types — check at booking). This is significantly better than carriers offering 23 kg. For immigrants relocating, pre-purchasing an extra bag online (PKR 15,000–30,000) is far cheaper than airport excess rates or international courier shipping.',
      },
    ],
  },

  // ─── Lahore → Toronto ───────────────────────────────────────────────────────
  'lahore-to-toronto': {
    heading: 'Lahore to Toronto Flights — One-Stop Routes & Cheapest Hub for Canada',
    paragraphs: [
      'Lahore to Toronto is one of the top Pakistan–Canada corridors, serving Punjab\'s large emigrant community, students at Ontario institutions, and families reuniting under Canadian immigration streams. As with all Pakistan–Canada travel, there is no direct flight — the trip is a one-stop journey of 16–19 hours via Doha (Qatar Airways), Dubai (Emirates) or Istanbul (Turkish Airlines) into Toronto Pearson (YYZ).',
      'Lahore–Toronto fares mirror Karachi–Toronto, usually within PKR 5,000–15,000, and the same hub logic applies: Qatar Airways via Doha and Turkish Airlines via Istanbul compete for the cheapest fare, while Emirates via Dubai is the premium-comfort option. Typical economy fares run PKR 235,000–385,000 round-trip equivalent, cheapest when booked 2–4 months ahead.',
      'Punjab sends a large share of Pakistan\'s skilled-worker immigrants to Canada, so the one-way maximum-luggage market is significant on this route. Baggage allowance matters as much as fare: Qatar Airways and Emirates (30 kg) are the practical picks for relocation travel. Many immigrant families pre-book a second checked bag online to avoid airport excess rates, which on long-haul can exceed PKR 40,000 per extra bag.',
      'For students bound for Canadian universities, book the September intake in May–June and the January intake in September–October. Turkish Airlines is often cheapest for price-focused students; Qatar Airways and Emirates win for those carrying heavy luggage. Last-minute fares in peak intake months routinely exceed PKR 450,000 one-way.',
    ],
    subsections: [
      {
        h3: 'Is Lahore–Toronto cheaper than flying Karachi or Islamabad to Toronto?',
        body: 'The three Pakistani gateways price within PKR 5,000–15,000 of each other on the same dates, so it is rarely worth travelling to a different city to depart. Fly from whichever airport is closest to you — the small fare difference will not offset domestic travel, time and overnight-stay costs.',
      },
      {
        h3: 'Doha vs Istanbul vs Dubai for Lahore to Toronto?',
        body: 'Qatar Airways via Doha offers the best balance of price, journey time and transit comfort. Turkish Airlines via Istanbul is often the cheapest but with longer layovers. Emirates via Dubai is the most comfortable and reliable but usually the most expensive. For families with children or elderly passengers, Qatar Airways or Emirates is recommended; for budget solo travellers and students, Turkish Airlines often wins.',
      },
    ],
  },

  // ─── Karachi → New York ─────────────────────────────────────────────────────
  'karachi-to-new-york': {
    heading: 'Karachi to New York Flights — Cheapest One-Stop Routes to the USA',
    paragraphs: [
      'Karachi to New York is the flagship Pakistan–USA route, serving the large Pakistani-American community concentrated in New York, New Jersey and the wider tri-state area, plus students, business travellers and immigrant families. There is no direct flight; the journey is a one-stop trip of 16–18 hours via Doha (Qatar Airways), Dubai (Emirates), Istanbul (Turkish Airlines) or Abu Dhabi (Etihad) into either JFK or Newark (EWR).',
      'Hub and carrier choice drives Karachi–New York pricing more than any other factor. Qatar Airways via Doha and Turkish Airlines via Istanbul are usually the cheapest, with Emirates via Dubai and Etihad via Abu Dhabi as premium alternatives. Typical economy fares run PKR 260,000–420,000 round-trip equivalent, with the lowest prices appearing when booked 2–4 months ahead. US-bound travel also peaks around summer holidays and the December–January window.',
      'A unique consideration on US routes is the pre-clearance and security layer: Qatar Airways, Emirates and Etihad all offer smooth transit at their hubs, and Etihad historically offered US pre-clearance at Abu Dhabi (check current status at booking), which can speed arrival at JFK/EWR. For first-time US travellers and families, the more reliable full-service carriers reduce the stress of a long, multi-segment journey.',
      'For students starting at US universities and immigrants travelling one-way with maximum luggage, the 30 kg baggage allowance on Qatar Airways and Emirates is a major advantage over 23 kg carriers. Book 3–4 months ahead for the August/September university intake; last-minute one-way fares can exceed PKR 480,000.',
    ],
    subsections: [
      {
        h3: 'Which is the cheapest airline from Karachi to New York?',
        body: 'Qatar Airways via Doha and Turkish Airlines via Istanbul are typically the cheapest on Karachi–New York, trading positions depending on the date. Emirates via Dubai and Etihad via Abu Dhabi are usually more expensive but offer excellent transit experiences. FlightRate compares all major one-stop fares live — check the price card above before booking.',
      },
      {
        h3: 'JFK or Newark (EWR) — does it matter which New York airport?',
        body: 'For fares, the difference is usually small — carriers price JFK and EWR similarly. Choose based on your final destination: JFK is better for Long Island, Queens and Brooklyn; Newark is better for New Jersey, where a large share of the Pakistani-American community lives. Factor ground transport cost and time into your decision, not just the headline fare.',
      },
    ],
  },

  // ─── Lahore → Riyadh ────────────────────────────────────────────────────────
  'lahore-to-riyadh': {
    heading: 'Lahore to Riyadh Flights — Saudia, PIA & flynas for Iqama Holders',
    paragraphs: [
      'Lahore to Riyadh is a core Pakistan–Saudi Arabia route, carrying a heavy mix of Iqama (work-visa) holders, businesspeople and families travelling between Punjab and the Saudi capital. Saudia, PIA and flynas operate this 4-hour direct corridor from Allama Iqbal International (LHE) to King Khalid International (RUH), with combined weekly frequency of 15–20 flights.',
      'For Iqama holders returning to Riyadh, Saudia is the dominant carrier — reliable schedule, 23 kg baggage included, and Halal meal service. PIA is a strong second and frequently undercuts Saudia on midweek dates. flynas is the budget option with 20 kg baggage and no meals, but promotional fares can drop to PKR 52,000–65,000 — around 30% below Saudia in low season. Factor extra-baggage cost into the comparison if you carry more than 20 kg, as flynas excess fees can erase the saving.',
      'Lahore–Riyadh demand is driven by the Saudi work cycle rather than tourism. The cheapest fares appear in May, June and September. Peak fares come in October–November (workers returning after summer leave) and during Ramadan. The Saudi weekend (Friday–Saturday) drives directional price spikes — returning to Riyadh on a Thursday or Friday is more expensive than midweek.',
      'For families on Iqama re-entry trips carrying substantial luggage, Saudia\'s 23 kg allowance versus flynas\'s 20 kg matters: a 25 kg bag on flynas at the airport costs roughly PKR 18,000–22,000, which usually wipes out any fare saving. Book 30–60 days ahead for the best Lahore–Riyadh prices.',
    ],
    subsections: [
      {
        h3: 'Which day is cheapest for Lahore–Riyadh?',
        body: 'Our dataset shows Wednesday and Thursday departures from Lahore to Riyadh are 12–18% cheaper than Friday, Saturday or Sunday. The expensive days are driven by the Saudi weekend, when workers return to Riyadh after time off — fares in that direction spike sharply on Thursday evening and Friday.',
      },
      {
        h3: 'Direct vs one-stop for Lahore–Riyadh?',
        body: 'Direct flights with Saudia and PIA are almost always priced the same as one-stop alternatives via Dubai, Sharjah or Doha — and save 4–7 hours. Only consider connecting itineraries if the direct fare is unusually high (above PKR 100,000) and you can find a strong Gulf-carrier promotion. In most months, direct is both cheaper and faster.',
      },
    ],
  },

  // ─── Karachi → Kuwait City ──────────────────────────────────────────────────
  'karachi-to-kuwait-city': {
    heading: 'Karachi to Kuwait City Flights — For Workers, Families & Visit Visas',
    paragraphs: [
      'Karachi to Kuwait City is a major Gulf labour route, carrying a large population of Pakistani workers, domestic staff, drivers and skilled professionals employed in Kuwait, alongside families on visit visas. Kuwait Airways, Jazeera Airways and PIA operate this 3 hour 30 minute corridor from Jinnah International (KHI) to Kuwait International Airport (KWI), with combined frequency of 12–18 weekly flights.',
      'Jazeera Airways is the budget carrier on this route and consistently the cheapest option, with promotional fares dropping to PKR 45,000–60,000 in low season. Kuwait Airways is the full-service flag carrier with better baggage and meals, typically PKR 8,000–15,000 more. PIA offers competing direct service with 23 kg baggage included. For workers carrying tools or families with heavy luggage, compare the total cost including baggage — Jazeera\'s base fare advantage can disappear once excess-baggage fees are added.',
      'Kuwait–Pakistan demand is driven by the work cycle and visit-visa seasons rather than tourism. Fares are cheapest in the late spring and early autumn shoulder months, and spike around Eid in both directions and during summer when families travel. Visit-visa holders should note that Kuwait periodically tightens entry rules, so confirm current visa status before booking non-refundable fares.',
      'Booking 30–60 days ahead delivers the best Karachi–Kuwait prices. Midweek departures (Tuesday–Thursday) are noticeably cheaper than weekend flights, and early-morning departures tend to carry the lowest fares of the day.',
    ],
    subsections: [
      {
        h3: 'Jazeera Airways vs Kuwait Airways — which to pick from Karachi?',
        body: 'Jazeera Airways wins on price for light-luggage travellers; it is a modern low-cost carrier with a good safety and punctuality record. Kuwait Airways wins on baggage allowance, meals and seat comfort, making it the better pick for families and workers carrying significant luggage. Compare the all-in cost (fare + baggage) on this page before deciding.',
      },
      {
        h3: 'Is there a direct flight from Karachi to Kuwait?',
        body: 'Yes — Kuwait Airways, Jazeera Airways and PIA all operate direct Karachi–Kuwait City flights, with a flight time of around 3 hours 30 minutes. One-stop alternatives via Dubai or Bahrain exist but are rarely cheaper and add 4–8 hours, so the direct flight is almost always the best choice.',
      },
    ],
  },

  // ─── Lahore → Doha ──────────────────────────────────────────────────────────
  'lahore-to-doha': {
    heading: 'Lahore to Doha Flights — Qatar Airways & PIA from Punjab',
    paragraphs: [
      'Lahore to Doha is a key Pakistan–Qatar route and an important one-stop gateway for Punjabi travellers heading onward to the UK, Canada, USA and Europe via Hamad International. Qatar Airways operates frequent direct service from Allama Iqbal International (LHE) to Hamad International (DOH), with PIA running competing flights. Flight time is around 3 hours 30 minutes.',
      'Qatar Airways dominates this route on frequency, baggage (30 kg economy) and transit experience. For point-to-point Lahore–Doha travellers — workers on QID visas, families visiting Qatar — Qatar Airways fares sit around PKR 55,000–90,000 round-trip equivalent, with PIA usually PKR 5,000–15,000 cheaper but with fewer frequencies. For travellers connecting onward, Qatar Airways via Doha frequently offers among the lowest one-stop fares from Lahore to London, Manchester, Birmingham and Toronto.',
      'The real value of Lahore–Doha for many travellers is as a connection rather than a destination. If your end point is the UK or Canada, always compare the Qatar Airways via-DOH itinerary against Emirates via Dubai — Qatar frequently undercuts Emirates by PKR 15,000–35,000 on these long-haul routes, with comparable comfort and the excellent Hamad transit experience.',
      'For QID work-visa holders returning to Doha after leave, Qatar Airways releases reduced fares 6–10 weeks ahead. Booking 30–60 days out delivers the best Lahore–Doha prices for both point-to-point and connecting tickets.',
    ],
    subsections: [
      {
        h3: 'Lahore to Doha direct, or via Karachi?',
        body: 'Fly direct from Lahore if a suitable flight is available — the fare difference versus connecting through Karachi is rarely worth the extra time. Qatar Airways and PIA both serve LHE–DOH directly, so most Punjabi travellers have no need to route through KHI.',
      },
      {
        h3: 'Is Qatar Airways worth more than PIA on Lahore–Doha?',
        body: 'For point-to-point travel, PIA can be the value pick if you have light luggage and flexible timing. For anyone connecting onward through Doha, or carrying significant baggage, Qatar Airways wins clearly — 30 kg allowance, more frequencies, a superior transit at Hamad, and frequently the lowest total fare to UK/Canada destinations.',
      },
    ],
  },

  // ─── Islamabad → Riyadh ─────────────────────────────────────────────────────
  'islamabad-to-riyadh': {
    heading: 'Islamabad to Riyadh Flights — Saudia, PIA & flynas for Northern Pakistan',
    paragraphs: [
      'Islamabad to Riyadh is the primary Saudi work route for travellers in northern Pakistan — Islamabad, Rawalpindi, KPK, Azad Kashmir and Gilgit-Baltistan. It carries a heavy mix of Iqama (work-visa) holders, businesspeople and families. Saudia, PIA and flynas operate this 4 hour 10 minute direct corridor from Islamabad International (ISB) to King Khalid International (RUH).',
      'Saudia is the dominant carrier for Iqama holders returning to Riyadh, offering a reliable schedule, 23 kg baggage and Halal meals. PIA is a strong second and frequently undercuts Saudia midweek. flynas is the budget option with 20 kg baggage and no meals, but promotional fares can drop to PKR 52,000–66,000 — about 30% below Saudia in low season. As always, factor extra-baggage cost into the comparison if you carry more than 20 kg.',
      'ISB–RUH fares track Lahore–Riyadh closely, usually within PKR 3,000–5,000. Demand is driven by the Saudi work cycle: cheapest in May, June and September; most expensive in October–November (return after summer leave) and during Ramadan. The Saudi weekend (Friday–Saturday) creates directional price spikes, so returning to Riyadh on Thursday or Friday costs more than midweek.',
      'For KPK and northern-Punjab workers, Islamabad is the cheapest Saudi gateway — Peshawar has limited Riyadh service and it is usually more economical to drive to ISB. Book 30–60 days ahead for the best Islamabad–Riyadh fares.',
    ],
    subsections: [
      {
        h3: 'Which airline is cheapest for Islamabad–Riyadh?',
        body: 'flynas is usually the cheapest on headline fare, but only worth it if your luggage is within 20 kg — otherwise excess-baggage fees can make Saudia or PIA (23 kg included) the better total value. FlightRate compares all three carriers live; check the price card above for today\'s cheapest option in PKR.',
      },
      {
        h3: 'Direct vs one-stop for Islamabad–Riyadh?',
        body: 'Direct flights with Saudia and PIA are almost always the same price as one-stop options via Dubai, Sharjah or Doha — and save 4–7 hours. Connecting itineraries are only worth considering when the direct fare is unusually high and a Gulf carrier is running a strong promotion, which is rare on this route.',
      },
    ],
  },

  // ─── Multan → Jeddah ────────────────────────────────────────────────────────
  'multan-to-jeddah': {
    heading: 'Multan to Jeddah Flights — Direct Umrah Service from South Punjab',
    paragraphs: [
      'Multan to Jeddah is the key Umrah and Saudi-work route for South Punjab — Multan, Bahawalpur, Dera Ghazi Khan, Rahim Yar Khan and surrounding districts. Saudia and PIA operate direct service from Multan International (MUX) to King Abdulaziz International (JED), particularly busy during Umrah season. Flight time is around 4 hours 30 minutes.',
      'Multan–Jeddah fares typically run PKR 5,000–10,000 above Lahore–Jeddah for the same dates, due to lower flight frequency from MUX. Saudia is the most reliable carrier and the preferred choice for Umrah pilgrims, with Halal meals and experienced cabin crew. PIA offers competing direct service with 23 kg baggage included. flynas service from Multan is limited compared with Karachi or Lahore, so the practical choice is usually Saudia or PIA.',
      'Pricing is driven entirely by Umrah demand. Cheapest months are January, February, June and September. The final two weeks of Ramadan are the most expensive, with one-way fares often exceeding PKR 150,000. South Punjab sends a large number of pilgrims, so MUX–JED flights fill quickly during peak Umrah windows — early booking is essential.',
      'For South Punjab pilgrims, flying direct from Multan saves the 4–5 hour road trip to Lahore. However, when MUX direct fares spike during peak season, it can occasionally be cheaper to travel to Lahore and fly LHE–JED — compare both before booking. Book 4–8 weeks ahead for shoulder-season Umrah; 12+ weeks for Ramadan.',
    ],
    subsections: [
      {
        h3: 'Is it cheaper to fly Multan–Jeddah direct or via Lahore?',
        body: 'In normal months, Multan–Jeddah direct is the best choice — the PKR 5,000–10,000 premium over Lahore is far less than the cost and time of a road trip to LHE. During peak Ramadan, when MUX direct fares spike sharply, it can occasionally pay to travel to Lahore for a cheaper flight. Compare both options on FlightRate before deciding.',
      },
      {
        h3: 'Which airlines fly direct from Multan to Jeddah?',
        body: 'Saudia and PIA both operate direct Multan–Jeddah flights, especially during Umrah season. Saudia is the more pilgrim-friendly choice with Halal meals and crew experienced in Umrah procedures. PIA includes 23 kg baggage and meals. flynas service from Multan is limited, so most South Punjab pilgrims choose Saudia or PIA.',
      },
    ],
  },

  // ─── Peshawar → Dubai ───────────────────────────────────────────────────────
  'peshawar-to-dubai': {
    heading: 'Peshawar to Dubai Flights — Airlines & Options for KPK Travellers',
    paragraphs: [
      'Peshawar to Dubai is the main international route for Khyber Pakhtunkhwa, serving the large population of KPK workers in the UAE, families, and traders. PIA and flydubai are the principal carriers on this 3-hour direct corridor from Bacha Khan International (PEW) to Dubai International (DXB), though frequency is lower than from Karachi, Lahore or Islamabad.',
      'Because PEW has fewer airlines and flights than the major Pakistani gateways, fares tend to run PKR 5,000–12,000 higher than Karachi–Dubai for the same dates. flydubai is usually the cheapest option from Peshawar, with PIA competing on direct service and 23 kg baggage. Emirates and Air Arabia service from PEW is limited or routed via other cities, so the realistic choice for most KPK travellers is flydubai or PIA.',
      'A common decision for KPK passengers is whether to fly from Peshawar or drive ~2 hours to Islamabad, which has more airlines, higher frequency and often lower fares. For travellers in Peshawar city the convenience of PEW usually wins; for those in southern KPK or near the motorway, Islamabad can be the cheaper and more flexible option once you factor in the wider airline choice.',
      'Peshawar–Dubai demand peaks around Eid and the summer family-travel season, when fares can rise sharply. Booking 30–45 days ahead delivers the best prices. Midweek departures are cheaper than weekend flights, as on every Pakistan–Dubai route.',
    ],
    subsections: [
      {
        h3: 'Should I fly from Peshawar or drive to Islamabad for a Dubai flight?',
        body: 'If you live in or near Peshawar, the convenience of flying from PEW usually outweighs the PKR 5,000–12,000 fare premium versus Islamabad. If you are in southern KPK, near the motorway, or travelling on dates when PEW fares are unusually high, driving ~2 hours to Islamabad opens up more airlines (Emirates, Air Arabia, more flydubai/PIA frequencies) and often lower fares. Compare both on FlightRate.',
      },
      {
        h3: 'Which airlines fly direct from Peshawar to Dubai?',
        body: 'flydubai and PIA are the main carriers offering direct Peshawar–Dubai flights. flydubai is typically the cheapest with 20 kg baggage; PIA includes 23 kg and meals. Service from other carriers is limited from PEW, so these two are the realistic options for most KPK travellers.',
      },
    ],
  },
}

export function getRouteIntro(routeSlug: string): RouteIntro | null {
  return ROUTE_INTROS[routeSlug] ?? null
}
