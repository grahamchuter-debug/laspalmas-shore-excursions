import type { HotelPage } from "./types";

export const hotels: HotelPage[] = [
  {
    slug: "cruise-port-hotels",
    title: "Hotels Near Civitavecchia Cruise Port",
    seoTitle: "Hotels Near Civitavecchia Cruise Port — Embarkation Guide",
    metaDescription: "Hotels near Civitavecchia cruise port for calm embarkation — port town stays versus Rome overnight compared.",
    category: "Location",
    tagline: "Sleep near the ship or in Rome — embarkation morning made simple.",
    overview: "Civitavecchia town hotels offer 5–15 minute terminal transfers. Rome centre hotels reward you with Trevi and Trastevere the night before a 60–75 minute morning port transfer.",
    body: [
      "Port-adjacent hotels suit early sailings and passengers who want minimal embarkation stress. Rome hotels suit those arriving a day early for sightseeing.",
      "Peak Mediterranean season fills both — book when you confirm your cruise.",
      "Many properties store luggage if rooms are not ready on arrival from FCO.",
    ],
    areas: [
      { name: "Civitavecchia harbour", description: "Closest to terminals — quiet port town evening.", bestFor: "Shortest embarkation transfer" },
      { name: "Rome Centro Storico", description: "Pantheon, Trevi and Trastevere walkable.", bestFor: "Pre-cruise sightseeing" },
      { name: "Rome Prati", description: "Near Vatican — good for Vatican-focused pre-cruise day.", bestFor: "Vatican priority" },
    ],
    picks: [
      { name: "Harbour hotel Civitavecchia", description: "Walk or short taxi to terminal.", distance: "5–15 min to terminal" },
      { name: "Centro Storico boutique", description: "Icon Rome evening before sailing.", distance: "60–75 min to port" },
      { name: "Prati Vatican-area stay", description: "Vatican day before embarkation.", distance: "65–80 min to port" },
    ],
    tips: ["Confirm terminal transfer night before", "Book early for April–October", "Ask about early check-in"],
    faqs: [
      { question: "Civitavecchia or Rome night before?", answer: "Civitavecchia for easiest embarkation; Rome for sightseeing with morning transfer." },
      { question: "How early reach terminal?", answer: "Start of your cruise line check-in window — often late morning." },
    ],
    relatedHotelSlugs: ["best-hotels-before-cruise", "one-night-before-cruise", "family-hotels"],
    featured: true,
  },
  {
    slug: "best-hotels-before-cruise",
    title: "Best Hotels Before Your Civitavecchia Cruise",
    seoTitle: "Best Pre-Cruise Hotels — Rome & Civitavecchia",
    metaDescription: "Best hotels before a Civitavecchia cruise — Rome centre, port town and strategy for smooth embarkation.",
    category: "Planning",
    tagline: "One night in the right place removes most embarkation-day stress.",
    overview: "Pre-cruise hotel strategy balances sightseeing appetite with embarkation logistics. Rome centre maximises culture; Civitavecchia maximises sleep.",
    body: [
      "Classic pattern: FCO to Rome hotel, evening Trastevere dinner, morning private transfer to port.",
      "Avoid same-day flight plus embarkation — Mediterranean delays happen.",
      "Two nights in Rome unlock Colosseum day one and Vatican day two before sailing.",
    ],
    areas: [
      { name: "Rome historic centre", description: "Maximum sightseeing.", bestFor: "First-time visitors" },
      { name: "Civitavecchia port", description: "Maximum embarkation ease.", bestFor: "Late arrivals" },
      { name: "FCO airport", description: "Late flight logistics only.", bestFor: "Very late arrivals" },
    ],
    picks: [
      { name: "Centro Storico base", description: "Walk to Pantheon and Trevi.", distance: "60–75 min to port" },
      { name: "Port town hotel", description: "Short embarkation morning.", distance: "5–15 min to terminal" },
    ],
    tips: ["Book refundable flights if uncertain", "Pre-book port transfer", "Confirm terminal name"],
    faqs: [
      { question: "Minimum nights before cruise?", answer: "One night strongly recommended; two for unhurried Rome." },
      { question: "Best Rome area?", answer: "Centro Storico or Prati for walkable icons." },
    ],
    relatedHotelSlugs: ["one-night-before-cruise", "two-days-before-cruise", "cruise-port-hotels"],
    featured: true,
  },
  {
    slug: "best-hotels-after-cruise",
    title: "Best Hotels After Your Civitavecchia Cruise",
    seoTitle: "Post-Cruise Hotels — Rome Extensions & FCO",
    metaDescription: "Where to stay after disembarking at Civitavecchia — Rome extensions, airport hotels and late-flight strategies.",
    category: "Planning",
    tagline: "Disembarked — extend Rome or head toward your flight smartly.",
    overview: "After disembarkation, choose Rome centre for evening flights, day rooms for freshen-up, or FCO hotels for early next-day departures.",
    body: [
      "Rome centre plus luggage storage transforms six spare hours into a real afternoon.",
      "FCO airport hotels suit 06:00 flights — avoid crossing Rome at rush hour.",
      "Pre-book disembarkation transfer before you sail.",
    ],
    areas: [
      { name: "Rome centro", description: "Bonus sightseeing day.", bestFor: "Evening flights" },
      { name: "FCO airport", description: "Early next-day flight.", bestFor: "Morning departures" },
      { name: "Civitavecchia town", description: "Late disembarkation stopover.", bestFor: "Next-day local transfer" },
    ],
    picks: [
      { name: "Centro day room or hotel", description: "Explore before evening FCO transfer.", distance: "60–75 min to FCO" },
      { name: "Airport hotel FCO", description: "Short hop to terminals.", distance: "5 min to FCO" },
    ],
    tips: ["Store luggage for Rome time", "Keep 3-hour airport buffer", "Book day room ahead on Sundays"],
    faqs: [
      { question: "Rome after disembarkation?", answer: "Yes with 6+ spare hours — store bags and transfer to centro." },
      { question: "One night after cruise?", answer: "Rome centre if sightseeing; FCO if flying early next morning." },
    ],
    relatedHotelSlugs: ["day-rooms", "airport-hotels", "best-hotels-before-cruise"],
  },
  {
    slug: "family-hotels",
    title: "Family Hotels Before a Civitavecchia Cruise",
    seoTitle: "Family Hotels — Rome & Civitavecchia Pre-Cruise",
    metaDescription: "Family-friendly hotels before Civitavecchia cruise — apartments, pools and private transfers with children.",
    category: "Family",
    tagline: "Space, cots and calm transfers — Rome with kids before you sail.",
    overview: "Families benefit from Rome apartments or family rooms near Prati, private minivan transfers and port hotels for short embarkation mornings with toddlers.",
    body: [
      "Apartments offer kitchens and washing — useful before a cabin.",
      "Private FCO pickup with car seats beats train with jet-lagged children.",
      "Colosseum and gelato tours work pre-cruise; skip packed Vatican with toddlers.",
    ],
    areas: [
      { name: "Trastevere apartments", description: "Space and character.", bestFor: "Families with teens" },
      { name: "Prati family hotels", description: "Near Vatican, quieter streets.", bestFor: "Mixed-age groups" },
      { name: "Civitavecchia port", description: "Short embarkation.", bestFor: "Young children, early sail" },
    ],
    picks: [
      { name: "Two-bedroom apartment", description: "Kitchen and living space.", distance: "60–75 min to port" },
      { name: "Port hotel with family room", description: "Minimal embarkation morning.", distance: "10 min to terminal" },
    ],
    tips: ["Request cots at booking", "Pre-book minivan transfers", "Pack embarkation day snacks"],
    faqs: [
      { question: "Rome or port with kids?", answer: "Rome for gentle sightseeing day; port for easiest embarkation." },
      { question: "Apartments available?", answer: "Yes in Trastevere and Prati — book early for peak season." },
    ],
    relatedHotelSlugs: ["best-hotels-before-cruise", "cruise-port-hotels", "private-transfers"],
  },
  {
    slug: "luxury-hotels",
    title: "Luxury Hotels Before a Civitavecchia Cruise",
    seoTitle: "Luxury Pre-Cruise Hotels in Rome",
    metaDescription: "Five-star Rome hotels before Civitavecchia cruise — concierge transfers and premium pre-sail stays.",
    category: "Luxury",
    tagline: "Start in style — Rome's finest before you reach Civitavecchia.",
    overview: "Luxury pre-cruise stays centre on Via Veneto, Spanish Steps and Villa Borghese five-stars with concierge FCO pickup and morning port transfers.",
    body: [
      "Concierges arrange skip-the-line Vatican or private Colosseum before embarkation day.",
      "Pair with luxury Rome shore excursion for consistent premium service.",
      "Spa recovery after transatlantic flights is underrated.",
    ],
    areas: [
      { name: "Via Veneto", description: "Classic five-star corridor.", bestFor: "Honeymoons" },
      { name: "Spanish Steps", description: "Designer shopping access.", bestFor: "Couples" },
      { name: "Villa Borghese", description: "Quiet luxury near parks.", bestFor: "Relaxed elegance" },
    ],
    picks: [
      { name: "Five-star Via Veneto", description: "Butler service and rooftop dining.", distance: "65–80 min to port" },
      { name: "Boutique near Pantheon", description: "Intimate luxury centro.", distance: "60–75 min to port" },
    ],
    tips: ["Book restaurants via concierge", "Arrange port transfer night before", "Confirm late checkout if needed"],
    faqs: [
      { question: "Concierge port transfer?", answer: "Arranged at fixed quotes — confirm Civitavecchia terminal details." },
      { question: "Two luxury nights?", answer: "Ideal — day one ancient Rome, day two Vatican without port-day pressure." },
    ],
    relatedHotelSlugs: ["luxury-rome", "two-days-before-cruise", "private-transfers"],
    featured: true,
  },
  {
    slug: "airport-hotels",
    title: "Airport Hotels for Civitavecchia Cruises",
    seoTitle: "FCO Airport Hotels — Civitavecchia Cruise Embarkation",
    metaDescription: "Fiumicino airport hotels before Civitavecchia cruise — when they make sense versus Rome centre.",
    category: "Airport",
    tagline: "Late arrival solution — not a substitute for Rome sightseeing.",
    overview: "FCO airport hotels suit late-night landings and dawn port transfers without entering Rome traffic. Sacrifice sightseeing for logistics.",
    body: [
      "Pattern: land 22:00, sleep airside, 08:00 private transfer to Civitavecchia for afternoon sailing.",
      "If landing before 18:00, choose Rome centre or Civitavecchia instead.",
      "Morning port transfer 60–75 minutes — pre-book private.",
    ],
    areas: [
      { name: "FCO terminal hotels", description: "Walk to check-in next morning.", bestFor: "Early flights home" },
      { name: "FCO nearby hotels", description: "Shuttle to terminals.", bestFor: "Late arrivals" },
    ],
    picks: [
      { name: "Airport terminal hotel", description: "Minimal morning logistics.", distance: "60–75 min to port" },
    ],
    tips: ["Only if no Rome time available", "Pre-book port transfer", "Confirm shuttle hours"],
    faqs: [
      { question: "When use airport hotel?", answer: "Late arrivals or very early next-day flight — not for sightseeing." },
      { question: "Port transfer time?", answer: "About 60–75 minutes by private car." },
    ],
    relatedHotelSlugs: ["fiumicino-airport-to-cruise-port", "one-night-before-cruise", "best-hotels-before-cruise"],
  },
  {
    slug: "one-night-before-cruise",
    title: "One Night Before Your Civitavecchia Cruise",
    seoTitle: "One Night Before Civitavecchia Cruise — Hotel Guide",
    metaDescription: "Why one pre-cruise night near Rome or Civitavecchia matters — hotel picks and transfer planning.",
    category: "Planning",
    tagline: "The best insurance against missing your ship.",
    overview: "One night early eliminates same-day flight risk and gives you a Rome evening or calm Civitavecchia embarkation morning.",
    body: [
      "Fly FCO, transfer to hotel, enjoy Rome dinner or early sleep in port town.",
      "Morning private transfer to terminal at check-in opening.",
      "Hotel cost is trivial versus rebooking a missed cruise.",
    ],
    areas: [
      { name: "Rome centro", description: "Bonus sightseeing evening.", bestFor: "First-time visitors" },
      { name: "Civitavecchia", description: "Shortest embarkation.", bestFor: "Practical travellers" },
    ],
    picks: [
      { name: "Centro hotel", description: "Trevi walk after check-in.", distance: "60–75 min to port AM" },
      { name: "Port hotel", description: "10-minute terminal taxi.", distance: "5–15 min to terminal" },
    ],
    tips: ["Book refundable flights when possible", "Pre-book AM port transfer", "Confirm terminal 24h ahead"],
    faqs: [
      { question: "Rome or Civitavecchia?", answer: "Rome for experience; Civitavecchia for proximity." },
      { question: "When leave hotel?", answer: "Start of cruise line check-in window." },
    ],
    relatedHotelSlugs: ["two-days-before-cruise", "best-hotels-before-cruise", "cruise-port-hotels"],
    featured: true,
  },
  {
    slug: "where-to-stay-neighbourhoods",
    title: "Where to Stay in Rome Before Your Cruise",
    seoTitle: "Rome Neighbourhoods Before Civitavecchia Cruise",
    metaDescription: "Compare Rome neighbourhoods for pre-cruise stays — Centro, Trastevere, Prati and Vatican area.",
    category: "Location",
    tagline: "Match your neighbourhood to your pre-cruise priorities.",
    overview: "Centro Storico for icons, Trastevere for atmosphere, Prati for Vatican — all 60–75 minutes from Civitavecchia on embarkation morning.",
    body: [
      "Centro puts Pantheon and Trevi on your doorstep. Trastevere offers evening dining character. Prati suits Vatican-first pre-cruise days.",
      "Avoid staying far from centre unless purely airport logistics.",
      "Private morning transfer beats taxi hail on embarkation day.",
    ],
    areas: [
      { name: "Centro Storico", description: "Pantheon, Trevi, Navona.", bestFor: "First-timers" },
      { name: "Trastevere", description: "Village feel, trattorias.", bestFor: "Food lovers" },
      { name: "Prati", description: "Vatican proximity.", bestFor: "Vatican pre-cruise day" },
    ],
    picks: [
      { name: "Pantheon-area hotel", description: "Central icon access.", distance: "60–75 min to port" },
      { name: "Trastevere apartment", description: "Evening atmosphere.", distance: "65–80 min to port" },
    ],
    tips: ["Book centro early for peak season", "Check lift access with luggage", "Pre-book port transfer"],
    faqs: [
      { question: "Best area for first-timers?", answer: "Centro Storico — walkable icons and easy orientation." },
      { question: "Trastevere for families?", answer: "Yes — apartments and restaurants suit mixed-age groups." },
    ],
    relatedHotelSlugs: ["best-hotels-before-cruise", "cruise-port-hotels", "family-hotels"],
  },
];

export function getHotelBySlug(slug: string) {
  return hotels.find((h) => h.slug === slug);
}

export function getAllHotelSlugs() {
  return hotels.map((h) => h.slug);
}

export function getFeaturedHotels() {
  return hotels.filter((h) => h.featured);
}
