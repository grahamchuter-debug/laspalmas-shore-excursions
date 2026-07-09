import type { TransferPage } from "./types";

export const transfers: TransferPage[] = [
  {
    slug: "private-transfers",
    title: "Private Cruise Transfers — Civitavecchia & Rome",
    seoTitle: "Private Transfers FCO, Rome & Civitavecchia Cruise Port",
    metaDescription: "Private transfers between Fiumicino airport, Rome hotels and Civitavecchia cruise port — meet-and-greet for embarkation and disembarkation.",
    category: "Private",
    tagline: "Door-to-door comfort — the least stressful way to reach your ship or airport.",
    overview: "Private transfers give you a dedicated vehicle from FCO, Ciampino, central Rome or Civitavecchia terminal with luggage help and fixed pricing — essential on embarkation morning.",
    body: [
      "Civitavecchia lies 60–70 km from FCO and 70 km from central Rome. Private cars take 60–75 minutes; minivans suit families. Drivers should know your terminal and ship name.",
      "On disembarkation, pre-booked pickup avoids the taxi scramble when thousands leave ships simultaneously.",
      "For Rome port-day tours, the same private vehicle keeps your group together with the strongest return-to-ship confidence.",
    ],
    options: [
      { name: "Private car (1–3 guests)", description: "Saloon with meet-and-greet at FCO or terminal.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "Couples and small parties" },
      { name: "Private minivan (4–7 guests)", description: "Spacious van for families with luggage.", duration: "60–80 min", priceEstimate: "€140–220", bestFor: "Families and groups" },
      { name: "Rome to Civitavecchia port", description: "Hotel pickup to terminal on embarkation morning.", duration: "60–75 min", priceEstimate: "€110–170", bestFor: "Pre-cruise Rome stays" },
    ],
    timing: ["Book embarkation transfers for your check-in window opening", "Allow 75 min Rome centre to port in morning traffic", "Confirm terminal and ship name when booking"],
    tips: ["Request child seats in advance", "Keep driver contact on embarkation day", "Pre-book disembarkation pickup before sailing"],
    faqs: [
      { question: "FCO to Civitavecchia how long?", answer: "About 60–75 minutes by private car in normal traffic." },
      { question: "Worth it over shared shuttle?", answer: "For families with luggage and fixed embarkation times — almost always yes." },
    ],
    relatedTransferSlugs: ["shared-transfers", "fiumicino-airport-to-cruise-port", "cruise-port-transfers"],
    featured: true,
  },
  {
    slug: "shared-transfers",
    title: "Shared Transfers to Civitavecchia Cruise Port",
    seoTitle: "Shared Shuttle FCO to Civitavecchia — Budget Cruise Transfers",
    metaDescription: "Shared shuttle transfers between Fiumicino airport, Rome and Civitavecchia cruise port for budget-conscious passengers.",
    category: "Shared",
    tagline: "Lower cost, longer journey — best when you travel light with time buffer.",
    overview: "Shared shuttles pool passengers between FCO, Rome hotels and Civitavecchia — sensible for solo travellers if you allow 90–120 minutes and avoid tight same-day flight connections.",
    body: [
      "Multiple stops add time versus private transfer. Embarkation mornings are busiest — align your shuttle with check-in opening, not final boarding.",
      "Groups of three or more often find private minivan pricing competitive on per-head basis.",
      "Port-day Rome tours use excursion coaches — different from airport shared shuttles.",
    ],
    options: [
      { name: "Shared FCO to port", description: "Pooled van serving airport and cruise terminal.", duration: "90–120 min", priceEstimate: "€25–45 pp", bestFor: "Solo light packers" },
      { name: "Shared Rome hotel to port", description: "Pickup from central hotels on embarkation morning.", duration: "75–100 min", priceEstimate: "€20–35 pp", bestFor: "Budget pre-cruise stays" },
    ],
    timing: ["Allow extra time for multiple stops", "Not ideal with heavy luggage or toddlers", "Book timed slot matching check-in"],
    tips: ["Compare private price for groups", "Travel light", "Confirm pickup address night before"],
    faqs: [
      { question: "Reliable for embarkation?", answer: "Yes with adequate buffer — less reliable than private on same-day flight schedules." },
      { question: "Shared to Rome on port days?", answer: "Use shore excursions for port days — not airport shuttles." },
    ],
    relatedTransferSlugs: ["private-transfers", "fiumicino-airport-to-cruise-port", "cruise-port-transfers"],
  },
  {
    slug: "fiumicino-airport-to-cruise-port",
    title: "Fiumicino Airport to Civitavecchia Cruise Port",
    seoTitle: "FCO to Civitavecchia Cruise Port Transfer Guide",
    metaDescription: "Leonardo da Vinci airport (FCO) to Civitavecchia cruise port — private, shared and train options for embarkation day.",
    category: "Airport",
    tagline: "FCO to your ship — 60–75 minutes by road when planned properly.",
    overview: "Most Rome cruises embark at Civitavecchia, not Rome itself. FCO is 60–70 km from the port — pre-booked transfer is smoothest with luggage.",
    body: [
      "Private transfer: 60–75 minutes meet-and-greet at arrivals to terminal drop.",
      "Train: Leonardo Express to Termini, regional to Civitavecchia — 90–120 minutes plus station walks.",
      "Arrive the day before sailing whenever possible — same-day flight plus embarkation is high risk.",
    ],
    options: [
      { name: "Private car", description: "Direct FCO to cruise terminal.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "Families and groups" },
      { name: "Shared shuttle", description: "Budget pooled service.", duration: "90–120 min", priceEstimate: "€25–45 pp", bestFor: "Solo travellers" },
      { name: "Train via Termini", description: "Leonardo Express plus regional train.", duration: "90–120 min", priceEstimate: "€15–25", bestFor: "Light packers" },
    ],
    timing: ["Allow 3+ hours from landing to terminal on same-day embarkation", "Pre-cruise night strongly recommended", "Confirm terminal 24h ahead"],
    tips: ["Book transfer before flying", "Avoid unlicensed touts at FCO", "Keep cruise documents accessible"],
    faqs: [
      { question: "How far is FCO from Civitavecchia?", answer: "About 60–70 km — 60–75 minutes by road." },
      { question: "Same-day flight and cruise?", answer: "Risky — delays can cost you the ship. Arrive one night early." },
    ],
    relatedTransferSlugs: ["private-transfers", "shared-transfers", "rome-airport-transfers"],
    featured: true,
  },
  {
    slug: "rome-airport-transfers",
    title: "Rome Airport Transfers for Cruise Passengers",
    seoTitle: "Rome Airport Transfers — FCO & Ciampino to Civitavecchia",
    metaDescription: "Compare Fiumicino and Ciampino airport transfers to Civitavecchia cruise port and Rome hotels.",
    category: "Airport",
    tagline: "FCO and Ciampino — know your airport before booking transfers.",
    overview: "Fiumicino (FCO) handles most international flights; Ciampino (CIA) serves many European budget carriers. Both require planned links to Civitavecchia or Rome hotels.",
    body: [
      "FCO to Civitavecchia: 60–75 min private. CIA to Civitavecchia: 75–90 min private.",
      "FCO to Rome hotel: 45–60 min — common for pre-cruise nights before port transfer.",
      "Pre-book licensed operators with cruise-terminal experience.",
    ],
    options: [
      { name: "FCO to Civitavecchia", description: "Main embarkation route.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "International arrivals" },
      { name: "CIA to Civitavecchia", description: "Budget airline arrivals.", duration: "75–90 min", priceEstimate: "€130–190", bestFor: "European flights" },
      { name: "FCO to Rome hotel", description: "Pre-cruise city stay.", duration: "45–60 min", priceEstimate: "€50–80", bestFor: "Night-before-Rome stays" },
    ],
    timing: ["Verify airport code on booking", "CIA is smaller but farther from port", "Build buffer on embarkation morning"],
    tips: ["Fixed fares beat haggling at taxi rank", "Confirm terminal name with driver", "Request child seats early"],
    faqs: [
      { question: "Which airport is closer to the port?", answer: "FCO is slightly closer — both require road transfer." },
      { question: "Taxi from FCO?", answer: "Fixed fares exist — pre-booked private is more reliable on busy mornings." },
    ],
    relatedTransferSlugs: ["fiumicino-airport-to-cruise-port", "private-transfers", "airport-hotels"],
  },
  {
    slug: "cruise-port-transfers",
    title: "Civitavecchia Cruise Port Transfers Hub",
    seoTitle: "Civitavecchia Cruise Port Transfers — Complete Guide",
    metaDescription: "All transfer options at Civitavecchia — Rome day trips, FCO airport links and terminal pickup explained.",
    category: "Port",
    tagline: "Port, Rome and airport — every Civitavecchia transfer in one place.",
    overview: "Civitavecchia's cruise terminals connect to Rome (75–80 min), FCO (60–75 min) and town hotels (5–15 min). Know which transfer type fits your journey stage.",
    body: [
      "Port-day passengers: shore excursion coach pickup at terminal or walk to station for DIY train.",
      "Embarking passengers: FCO/CIA or Rome hotel to terminal — pre-book private for calm morning.",
      "Disembarking passengers: terminal to FCO or Rome with luggage — book before sailing.",
    ],
    options: [
      { name: "Shore excursion pickup", description: "Coach tours to Rome with return timing.", duration: "75 min to Rome", priceEstimate: "Tour price", bestFor: "Port days" },
      { name: "Private port transfer", description: "Airport or hotel to terminal.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "Embarkation" },
      { name: "Regional train", description: "Station 10–15 min walk from terminal.", duration: "80 min to Rome", priceEstimate: "€5–15", bestFor: "DIY port days" },
    ],
    timing: ["Terminal pickup 15 min after disembarkation for tours", "Embarkation: arrive at check-in opening", "Disembarkation: pre-book pickup time"],
    tips: ["Confirm pier-to-terminal shuttle if applicable", "Have all-aboard time on phone for port days", "Terminal name on booking"],
    faqs: [
      { question: "Where do tours pick up?", answer: "At terminal exit or coach park — voucher confirms exact gate." },
      { question: "Train station distance?", answer: "Civitavecchia station is 10–15 minutes walk from most terminals." },
    ],
    relatedTransferSlugs: ["private-transfers", "shared-transfers", "fiumicino-airport-to-cruise-port"],
    featured: true,
  },
  {
    slug: "port-to-airport-transfers",
    title: "Civitavecchia Cruise Port to Fiumicino Airport",
    seoTitle: "Civitavecchia to FCO Airport — Disembarkation Transfers",
    metaDescription: "Transfer from Civitavecchia cruise port to Fiumicino airport after disembarkation — timing and booking tips.",
    category: "Disembarkation",
    tagline: "Ship to plane — the smoothest route after disembarkation.",
    overview: "After disembarkation, pre-booked transfer to FCO avoids taxi queues. Allow 60–75 minutes drive plus 3-hour airport buffer for international flights.",
    body: [
      "Sunday mornings are busiest — thousands disembark simultaneously.",
      "If your flight is evening, store luggage and enjoy Rome before afternoon transfer.",
      "Private transfer pickup at terminal exit at agreed time — have phone contact ready.",
    ],
    options: [
      { name: "Private car to FCO", description: "Direct terminal to airport.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "Most passengers" },
      { name: "Shared shuttle to FCO", description: "Budget option with stops.", duration: "90–120 min", priceEstimate: "€25–45 pp", bestFor: "Solo travellers" },
    ],
    timing: ["Leave Rome or port 3+ hours before international flight", "Morning disembarkation + afternoon flight = Rome day possible", "Pre-book before cruise ends"],
    tips: ["Do not underestimate airport security queues", "Store bags for spare Rome hours", "Confirm pickup point night before"],
    faqs: [
      { question: "How early leave port for FCO?", answer: "Roughly 3 hours before flight plus 60–75 min drive — adjust for traffic." },
      { question: "Late afternoon flight?", answer: "Store luggage, tour Rome, transfer mid-afternoon — popular pattern." },
    ],
    relatedTransferSlugs: ["private-transfers", "fiumicino-airport-to-cruise-port", "late-flight-after-disembarkation"],
  },
  {
    slug: "late-flight-after-disembarkation",
    title: "Late Flight After Civitavecchia Disembarkation",
    seoTitle: "Late Flight After Rome Cruise — Transfer & Planning",
    metaDescription: "Your flight leaves hours after disembarkation — Rome time, luggage storage and FCO transfer planning.",
    category: "Disembarkation",
    tagline: "Six spare hours? Turn disembarkation into a bonus Rome afternoon.",
    overview: "Disembarking at 08:00 with a 20:00 flight enables a full Rome day if you store luggage and pre-book an afternoon FCO transfer.",
    body: [
      "Drop bags at storage, transfer to centro, explore Pantheon/Trevi area, collect bags, reach FCO by 17:00 for 20:00 flight.",
      "Avoid ambitious Vatican or Colosseum queues — centro walking or golf cart tours fit better.",
      "Day rooms available if you want shower and rest mid-day.",
    ],
    options: [
      { name: "Luggage storage + Rome time", description: "Hands-free centro exploration.", duration: "4–5 hours in Rome", priceEstimate: "Storage €5–15", bestFor: "Evening flights" },
      { name: "Pre-booked FCO transfer", description: "Afternoon pickup from Rome or port.", duration: "60–75 min", priceEstimate: "€120–180", bestFor: "Stress-free airport reach" },
    ],
    timing: ["3-hour airport buffer minimum", "Leave Rome centro 3 hours before flight", "Book storage near Termini or port"],
    tips: ["Pre-book everything before cruise ends", "Golf cart tour for efficient sightseeing", "Keep passport in day bag"],
    faqs: [
      { question: "Enough time for Rome?", answer: "4–5 hours sightseeing realistic with evening flight — enough for centro highlights." },
      { question: "Ship luggage storage?", answer: "You disembark fully — use port or Rome storage services." },
    ],
    relatedTransferSlugs: ["port-to-airport-transfers", "private-transfers", "day-rooms"],
  },
];

export function getTransferBySlug(slug: string) {
  return transfers.find((t) => t.slug === slug);
}

export function getAllTransferSlugs() {
  return transfers.map((t) => t.slug);
}

export function getFeaturedTransfers() {
  return transfers.filter((t) => t.featured);
}
