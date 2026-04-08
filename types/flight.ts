export interface SearchParams {
  from: string        // IATA code e.g. "ISB"
  to: string          // IATA code e.g. "DXB"
  date: string        // ISO date e.g. "2025-05-15"
  adults: number
  travelClass: 'ECONOMY' | 'BUSINESS' | 'FIRST' | 'PREMIUM_ECONOMY'
}

export interface FlightOffer {
  id: string
  airline: string
  airlineCode: string
  airlineColor: string
  flightNo: string
  dep: string
  depCode: string
  arr: string
  arrCode: string
  dur: string
  stops: number
  stopTxt: string
  bag: string
  meal: boolean
  price: string
  priceRaw: number
  priceTotal: string
  priceFor: string
  aircraft: string
  fareType: string
  badge?: string
  badgeTxt?: string
  affiliateUrl?: string   // Travelpayouts deep link → Aviasales booking
  waUrl?: string          // WhatsApp pre-filled booking message
}

export interface SearchResult {
  flights: FlightOffer[]
  count: number
  searchedAt: string
  route: string
  date: string
  adults: number
}
