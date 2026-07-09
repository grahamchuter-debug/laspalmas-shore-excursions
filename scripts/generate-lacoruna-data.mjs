#!/usr/bin/env node
/**
 * Generates La Coruña-specific content data files from structured definitions.
 * Run: node scripts/generate-lacoruna-data.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DATA = join(import.meta.dirname, "..", "src/data");
mkdirSync(join(DATA, "imported-schedules"), { recursive: true });

function w(name, content) {
  writeFileSync(join(DATA, name), content, "utf8");
  console.log("wrote", name);
}

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

const PORT_BASE =
  "Cruise ships dock at Muelle de Transatlánticos, La Coruña's main cruise terminal on the Atlantic waterfront. María Pita Square and the historic centre lie 10–15 minutes on foot along a flat promenade. Santiago de Compostela is roughly 75 km inland — typically 1–1.25 hours each way by coach. Confirm your all-aboard time and keep a 60–90 minute buffer before departure.";

const GT = `[
      { method: "Walk from cruise terminal", detail: "Flat waterfront promenade to María Pita Square and the Old Town — signed, scenic route.", time: "10–15 min", cost: "Free" },
      { method: "Taxi from terminal", detail: "Metered taxis at the terminal rank — to city centre, Tower of Hercules or coach meeting points.", time: "5–10 min to centre", cost: "€5–10" },
      { method: "Shore excursion coach", detail: "Licensed operator with guide — Santiago, coastal drives or city tours timed to all-aboard.", time: "Door-to-door", cost: "Tour price" },
    ]`;

const PORT_LOGISTICS =
  "Cruise ships dock at Muelle de Transatlánticos, La Coruña's main cruise terminal on the Atlantic waterfront. María Pita Square and the historic centre lie 10–15 minutes on foot along a flat promenade. Santiago de Compostela is roughly 75 km inland — typically 1–1.25 hours each way by coach. Confirm your all-aboard time and keep a 60–90 minute buffer before departure.";

function faq(q, a) {
  return `{ question: "${esc(q)}", answer: "${esc(a)}" }`;
}

function rec(cat, title, desc, href) {
  return `{ category: "${cat}", title: "${esc(title)}", description: "${esc(desc)}", href: "${href}" }`;
}

function attraction(cfg) {
  return `  {
    slug: "${cfg.slug}",
    title: "${esc(cfg.title)}",
    seoTitle: "${esc(cfg.seoTitle)}",
    metaDescription: "${esc(cfg.meta)}",
    attractionName: "${esc(cfg.name)}",
    tagline: "${esc(cfg.tagline)}",
    overview: "${esc(cfg.overview)}",
    body: [
      "${esc(PORT_BASE)}",
      "${esc(cfg.body2)}",
      "${esc(cfg.body3)}",
    ],
    distanceFromPort: "${esc(cfg.distance)}",
    travelTime: "${esc(cfg.travel)}",
    timeNeeded: "${esc(cfg.timeNeeded)}",
    gettingThere: ${GT},
    highlights: [${cfg.highlights.map((h) => `"${esc(h)}"`).join(", ")}],
    tips: [${cfg.tips.map((t) => `"${esc(t)}"`).join(", ")}],
    faqs: [${cfg.faqs.map(([q, a]) => faq(q, a)).join(", ")}],
    relatedAttractionSlugs: [${cfg.related.map((r) => `"${r}"`).join(", ")}],
    relatedExcursionSlug: "${cfg.excursion}",
  }`;
}

function guide(cfg) {
  const recs = cfg.recommendations?.length
    ? `,\n    recommendations: [\n      ${cfg.recommendations.map((r) => rec(r.cat, r.title, r.desc, r.href)).join(",\n      ")}\n    ]`
    : "";
  return `  {
    slug: "${cfg.slug}",
    title: "${esc(cfg.title)}",
    seoTitle: "${esc(cfg.seoTitle)}",
    metaDescription: "${esc(cfg.meta)}",
    tagline: "${esc(cfg.tagline)}",
    overview: "${esc(cfg.overview)}",
    body: [
      "${esc(cfg.body1)}",
      "${esc(cfg.body2)}",
      "${esc(cfg.body3)}",
    ],
    highlights: [${cfg.highlights.map((h) => `"${esc(h)}"`).join(", ")}],
    tips: [${cfg.tips.map((t) => `"${esc(t)}"`).join(", ")}],
    faqs: [${cfg.faqs.map(([q, a]) => faq(q, a)).join(", ")}]${recs},
    relatedSlugs: [${cfg.related.map((r) => `"${r}"`).join(", ")}],
    imageKey: "${cfg.imageKey}",
    hubPath: "/guides",
  }`;
}

function excursion(cfg) {
  const featured = cfg.featured ? ",\n    featured: true" : "";
  return `  {
    slug: "${cfg.slug}",
    title: "${esc(cfg.title)}",
    seoTitle: "${esc(cfg.seoTitle)}",
    metaDescription: "${esc(cfg.meta)}",
    category: "${esc(cfg.category)}",
    tagline: "${esc(cfg.tagline)}",
    duration: "${esc(cfg.duration)}",
    pace: "${cfg.pace}",
    bestFor: "${esc(cfg.bestFor)}",
    overview: "${esc(cfg.overview)}",
    body: [
      "${esc(cfg.body1)}",
      "${esc(cfg.body2)}",
      "${esc(cfg.body3)}",
    ],
    highlights: [${cfg.highlights.map((h) => `"${esc(h)}"`).join(", ")}],
    included: [${cfg.included.map((i) => `"${esc(i)}"`).join(", ")}],
    portLogistics: PORT_LOGISTICS,
    tips: [${cfg.tips.map((t) => `"${esc(t)}"`).join(", ")}],
    faqs: [${cfg.faqs.map(([q, a]) => faq(q, a)).join(", ")}],
    relatedExcursionSlugs: [${cfg.related.map((r) => `"${r}"`).join(", ")}]${featured},
  }`;
}

function versus(cfg) {
  const seo =
    cfg.seoTitle ??
    `${cfg.optionA} vs ${cfg.optionB} — La Coruña Cruise Passengers`;
  return `  {
    slug: "${cfg.slug}",
    title: "${esc(cfg.optionA)} vs ${esc(cfg.optionB)}",
    seoTitle: "${esc(seo)}",
    metaDescription: "${esc(cfg.summary)}",
    kind: "versus",
    optionA: "${esc(cfg.optionA)}",
    optionB: "${esc(cfg.optionB)}",
    summary: "${esc(cfg.summary)}",
    verdict: "${esc(cfg.verdict)}",
    overview: [${cfg.overview.map((o) => `"${esc(o)}"`).join(", ")}],
    comparisonTable: [${cfg.table.map((r) => `{ category: "${esc(r.category)}", optionA: "${esc(r.optionA)}", optionB: "${esc(r.optionB)}" }`).join(", ")}],
    faqs: [${cfg.faqs.map(([q, a]) => faq(q, a)).join(", ")}],
    relatedSlugs: [${cfg.related.map((r) => `"${r}"`).join(", ")}],
    imageKey: "${cfg.imageKey}",
  }`;
}

function comparisonGuide(cfg) {
  return `  {
    slug: "${cfg.slug}",
    title: "${esc(cfg.title)}",
    seoTitle: "${esc(cfg.seoTitle)}",
    metaDescription: "${esc(cfg.meta)}",
    kind: "guide",
    summary: "${esc(cfg.summary)}",
    verdict: "${esc(cfg.verdict)}",
    overview: [${cfg.overview.map((o) => `"${esc(o)}"`).join(", ")}],
    guideItems: [${cfg.guideItems.map((g) => `{
        name: "${esc(g.name)}",
        slug: "${g.slug}",
        href: "${g.href}",
        reason: "${esc(g.reason)}",
        topExcursion: "${esc(g.topExcursion)}",
        returnConfidence: "${esc(g.returnConfidence)}",
        walkingDifficulty: "${esc(g.walkingDifficulty)}",
      }`).join(", ")}],
    faqs: [${cfg.faqs.map(([q, a]) => faq(q, a)).join(", ")}],
    relatedSlugs: [${cfg.related.map((r) => `"${r}"`).join(", ")}],
    imageKey: "${cfg.imageKey}",
  }`;
}

function planningPage(cfg) {
  const recs = cfg.recs?.length
    ? `,\n    recommendations: [\n      ${cfg.recs.map((r) => rec(r.c, r.t, r.d, r.h)).join(",\n      ")}\n    ]`
    : "";
  return `  {
    slug: "${cfg.s}",
    title: "${esc(cfg.title)}",
    seoTitle: "${esc(cfg.seo)}",
    metaDescription: "${esc(cfg.meta)}",
    tagline: "${esc(cfg.tag)}",
    overview: "${esc(cfg.ov)}",
    body: ["${esc(cfg.b1)}", "${esc(cfg.b2)}", "${esc(cfg.b3)}"],
    highlights: [${cfg.hi.map((x) => `"${esc(x)}"`).join(", ")}],
    tips: [${cfg.ti.map((x) => `"${esc(x)}"`).join(", ")}],
    faqs: [${faq(cfg.q1 ?? "Is this relevant on a La Coruña port day?", cfg.a1 ?? "Yes — La Coruña sits on Atlantic Spain and Northern Spain cruise itineraries from April through October.")}, ${faq(cfg.q2 ?? "Where can I plan other ports?", cfg.a2 ?? "See our cruise planning hub for Bilbao, Lisbon, Bordeaux and multi-port Atlantic itineraries.")}]${recs},
    relatedSlugs: [${cfg.rel.map((s) => `"${s}"`).join(", ")}],
    imageKey: "${cfg.img}",
    hubPath: "/plan-your-cruise-holiday",
  }`;
}

// ─── HIGHLIGHTS (AttractionPage guides) ─────────────────────────────────────

const attractions = [
  {
    slug: "tower-of-hercules-guide",
    name: "Tower of Hercules",
    title: "Tower of Hercules Guide from La Coruna Cruise Port",
    seoTitle: "Tower of Hercules from La Coruna Cruise Port — Roman Lighthouse Guide",
    meta: "Visit the Tower of Hercules from La Coruna cruise port with practical walking and taxi advice, ticket strategy and coastal viewpoints.",
    tagline: "A still-working Roman lighthouse on Atlantic cliffs — Galicia's signature landmark.",
    overview:
      "The Tower of Hercules is La Coruna's defining monument: a Roman lighthouse, modernised over centuries, still guiding ships into the Atlantic harbour. It sits on a windswept headland north-west of the old centre and rewards cruise passengers with big-ocean views and clear city orientation.",
    body2:
      "From the cruise terminal, most passengers either walk the promenade in 35-45 minutes or take a short taxi ride. If weather is clear, climb to the lantern for a full sweep over Orzan Bay, the Atlantic seafront and the harbour where your ship is berthed.",
    body3:
      "This is one of the best first-hour stops on a long call because coach traffic is low early and light is clean for photos. On wet or windy days, keep a flexible plan and prioritise the surrounding sculpture park and coastal paths if tower access is limited.",
    distance: "3.2 km from terminal",
    travel: "10-15 min taxi or 35-45 min coastal walk",
    timeNeeded: "75-120 minutes",
    highlights: ["UNESCO World Heritage Roman lighthouse", "Atlantic cliff viewpoints", "Coastal sculpture park", "Classic skyline photography"],
    tips: ["Pre-book timed entry in peak summer", "Bring a light layer even on warm days", "Combine with old town on foot for an efficient loop"],
    faqs: [
      ["Can cruise passengers climb the tower?", "Yes when weather and capacity allow; timed slots can sell out on busy ship days."],
      ["Is it walkable from the ship?", "Yes for active walkers, with a scenic but exposed route along the promenade."],
    ],
    related: ["atlantic-promenade-guide", "lacoruna-old-town-guide", "can-you-walk-around-lacoruna"],
    excursion: "tower-of-hercules-tour",
  },
  {
    slug: "maria-pita-square-guide",
    name: "Maria Pita Square",
    title: "Maria Pita Square Guide for Cruise Visitors",
    seoTitle: "Maria Pita Square from La Coruna Port — History, Cafes and Walking Route",
    meta: "How to visit Maria Pita Square from La Coruna cruise terminal, with city hall highlights, cafe stops and onward routes into the old town.",
    tagline: "La Coruna's civic heart — broad arcades, city hall and easy orientation from the port.",
    overview:
      "Maria Pita Square is the natural first stop for independent cruise passengers. The broad plaza, elegant arcades and grand city hall create a calm introduction to La Coruna, and nearly every key walking route radiates from here.",
    body2:
      "You can walk from the terminal in about 10-15 minutes on a flat waterfront route. Around the square you will find coffee bars, pastry shops and practical services, making it ideal for regrouping before deciding between old town lanes, Tower of Hercules or a taxi to beach districts.",
    body3:
      "If your port call is short, this area delivers a satisfying Atlantic-Spain atmosphere without committing to long transfers. If your call is long, use Maria Pita as your anchor point and loop outward to the old town walls, San Anton and the promenade.",
    distance: "1.1 km from terminal",
    travel: "10-15 min walk",
    timeNeeded: "30-60 minutes",
    highlights: ["City hall facade", "Arcaded architecture", "Easy access from cruise quay", "Excellent coffee stop zone"],
    tips: ["Arrive early before day-tour groups", "Use this square as your return waypoint", "Carry small cash for quick cafe stops"],
    faqs: [
      ["Is Maria Pita Square close to the cruise port?", "Yes, it is among the closest headline sights and very easy on foot."],
      ["Can I combine Maria Pita with old town in one walk?", "Absolutely, the old town lanes begin only a few minutes away."],
    ],
    related: ["lacoruna-old-town-guide", "castle-of-san-anton-guide", "independent-lacoruna-guide"],
    excursion: "lacoruna-walking-tour",
  },
  {
    slug: "santiago-de-compostela-guide",
    name: "Santiago de Compostela",
    title: "Santiago de Compostela Guide from La Coruna Cruise Port",
    seoTitle: "Santiago de Compostela from La Coruna Cruise Port — Day Trip Timing Guide",
    meta: "Plan Santiago de Compostela from La Coruna cruise port with realistic coach times, cathedral priorities and return-to-ship strategy.",
    tagline: "Galicia's pilgrimage capital — cathedral grandeur and medieval lanes in a well-paced day trip.",
    overview:
      "Santiago de Compostela is the most popular excursion from La Coruna for first-time Galicia visitors. The cathedral, UNESCO old quarter and Camino atmosphere create a very different experience from the coastal port city.",
    body2:
      "Expect roughly 1 to 1.25 hours each way by coach depending on traffic. Well-run tours sequence drop-off near the old quarter, guided orientation, cathedral time and controlled free time before regrouping for return.",
    body3:
      "Independent travel is possible but needs strict time discipline and rail coordination. For most cruise passengers, a dedicated shore excursion offers the strongest balance of depth and return confidence.",
    distance: "75 km inland",
    travel: "1-1.25 hours each way by coach",
    timeNeeded: "5.5-7.5 hours door-to-door",
    highlights: ["Cathedral facade and square", "Pilgrim atmosphere", "Granite medieval streets", "Galician lunch options"],
    tips: ["Wear non-slip shoes for polished stone", "Book cathedral-related options early", "Keep a 90-minute return buffer"],
    faqs: [
      ["Is Santiago worth it on a cruise day?", "Yes on standard or long calls; it is Galicia's highest-impact cultural excursion."],
      ["Can I do Santiago and full La Coruna old town in one day?", "Only briefly; choose one main anchor and avoid overpacking."],
    ],
    related: ["camino-de-santiago-cruise-passengers-guide", "should-i-visit-santiago-de-compostela", "half-day-santiago-tour"],
    excursion: "santiago-de-compostela-highlights-tour",
  },
  {
    slug: "galician-food-guide",
    name: "Galician Cuisine",
    title: "Galician Food Guide for La Coruna Cruise Passengers",
    seoTitle: "Galician Food in La Coruna — Cruise Passenger Guide to What to Order",
    meta: "What to eat in La Coruna on a cruise day, from octopus and empanada to market seafood and practical lunch timing near the port.",
    tagline: "Atlantic flavours done simply — seafood, produce and honest cooking.",
    overview:
      "Galician food is one of the strongest reasons to explore La Coruna independently. Even on short calls, you can sample authentic regional dishes without a long transfer.",
    body2:
      "Priority classics include pulpo a feira, Galician empanada, razor clams, percebes when available, and tarta de Santiago for dessert. Menus del dia are often excellent value if timed before peak lunch queues.",
    body3:
      "If seafood is central to your day, reserve a table before leaving the ship on busy weekends. Keep your meal location near Maria Pita, old town or the marina so you avoid an anxious return.",
    distance: "City centre dining 10-20 min from terminal",
    travel: "Walkable dining districts",
    timeNeeded: "60-120 minutes",
    highlights: ["Pulpo a feira", "Galician empanada", "Atlantic shellfish", "Tarta de Santiago"],
    tips: ["Lunch service often starts around 13:00", "Ask for local daily catches", "Leave time for coffee and a short stroll"],
    faqs: [
      ["Is La Coruna good for seafood?", "Excellent, with broad quality from casual taverns to premium dining rooms."],
      ["Can I eat well without booking ahead?", "Usually yes on weekdays, but reservations help on multi-ship summer days."],
    ],
    related: ["best-seafood-lacoruna-guide", "galicia-wine-guide", "one-day-in-lacoruna"],
    excursion: "galician-food-wine-tour",
  },
  {
    slug: "best-seafood-lacoruna-guide",
    name: "Best Seafood in La Coruna",
    title: "Best Seafood in La Coruna on a Cruise Day",
    seoTitle: "Best Seafood in La Coruna — Cruise Port Dining Guide",
    meta: "Find the best seafood experiences in La Coruna near the cruise port, with practical ordering advice and timing for ship return.",
    tagline: "From oyster counters to market fish houses — an Atlantic seafood city done right.",
    overview:
      "La Coruna sits on one of Europe's great seafood coasts. Cruise visitors can enjoy a serious meal without leaving town, provided they plan timing and restaurant location.",
    body2:
      "Look for local shellfish, hake, monkfish, clams and seasonal specialties. If you prefer a lighter stop, market bars offer smaller portions and faster service than formal restaurants.",
    body3:
      "For maximum confidence, choose venues within a 20-minute walk or 10-minute taxi of the terminal. If weather turns wet, old town and Maria Pita arcades keep the plan comfortable.",
    distance: "1-3 km dining zones",
    travel: "Walk or short taxi",
    timeNeeded: "75-150 minutes",
    highlights: ["Fresh shellfish variety", "Traditional fish taverns", "Market-counter dining", "Excellent local white wines"],
    tips: ["Check market catches first, then choose venue", "Keep your final coffee near return route", "Ask for half portions to sample more"],
    faqs: [
      ["Do I need reservations for good seafood?", "Recommended on Fridays, weekends and heavy cruise days."],
      ["Is seafood expensive in La Coruna?", "Range is wide; you can eat well at mid prices with smart ordering."],
    ],
    related: ["galician-food-guide", "galicia-wine-guide", "independent-lacoruna-guide"],
    excursion: "galician-food-wine-tour",
  },
  {
    slug: "best-beaches-near-lacoruna-guide",
    name: "Best Beaches near La Coruna",
    title: "Best Beaches near La Coruna for Cruise Visitors",
    seoTitle: "Best Beaches near La Coruna Cruise Port — Orzan, Riazor and Beyond",
    meta: "Discover the best beaches near La Coruna cruise port including Orzan and Riazor, with weather notes, swim safety and realistic timing.",
    tagline: "Atlantic city beaches with dramatic surf, wide promenades and changing weather.",
    overview:
      "La Coruna's urban beaches are easy to include on a cruise day and work well as a low-stress complement to old town sightseeing.",
    body2:
      "Orzan and Riazor are the main city strands, linked by broad seafront paths. Conditions can shift quickly on the Atlantic coast, so check flags and lifeguard guidance before entering the water.",
    body3:
      "If swimming is secondary, treat the beach zone as a scenic walk with coffee stops and skyline views. Wind can be stronger than expected even in summer.",
    distance: "2-4 km from terminal",
    travel: "10-15 min taxi or 30-40 min walk",
    timeNeeded: "60-150 minutes",
    highlights: ["Orzan beach atmosphere", "Riazor promenade", "Atlantic surf culture", "Excellent sunset viewpoints"],
    tips: ["Bring a wind layer", "Swim only in marked safe zones", "Keep sand time flexible on cloudy days"],
    faqs: [
      ["Are La Coruna beaches swimmable?", "Yes in season, but Atlantic conditions are cooler and rougher than Mediterranean beaches."],
      ["Can I reach beaches without a tour?", "Yes, taxis and promenades make access straightforward."],
    ],
    related: ["atlantic-promenade-guide", "one-day-in-lacoruna", "coastal-scenery-drive"],
    excursion: "coastal-scenery-drive",
  },
  {
    slug: "camino-de-santiago-cruise-passengers-guide",
    name: "Camino de Santiago for Cruise Passengers",
    title: "Camino de Santiago Guide for Cruise Passengers",
    seoTitle: "Camino de Santiago on a Cruise Day — La Coruna to Santiago Guide",
    meta: "Can cruise passengers experience the Camino spirit from La Coruna? Practical options, symbolism and realistic day-planning advice.",
    tagline: "A pilgrimage tradition adapted to cruise-day realities.",
    overview:
      "Cruise passengers cannot complete a full Camino route in one port day, but they can still connect with the pilgrimage tradition through Santiago visits, short symbolic walks and cathedral-focused experiences.",
    body2:
      "Many guided tours frame Santiago through pilgrimage history, Camino routes and key ritual spaces. Independent travellers can add a short intentional walk in Santiago before visiting the cathedral quarter.",
    body3:
      "Set expectations clearly: this is cultural immersion, not route completion. If Camino heritage is your core interest, choose a pilgrimage-themed excursion with expert commentary.",
    distance: "75 km to Santiago contexts",
    travel: "1-1.25 hours each way",
    timeNeeded: "5.5-7.5 hours",
    highlights: ["Pilgrimage context in Santiago", "Cathedral heritage", "Symbolic short walk options", "Faith and history interpretation"],
    tips: ["Choose tour commentary depth over shopping stops", "Wear modest practical clothing", "Allow generous return buffer"],
    faqs: [
      ["Can I do part of the Camino on a cruise day?", "You can experience elements and symbolism, but not a full route section with completion formalities."],
      ["Best tour type for Camino interest?", "Pilgrimage-themed Santiago tours with cathedral and route interpretation."],
    ],
    related: ["santiago-de-compostela-guide", "santiago-pilgrimage-tour", "is-santiago-worth-the-journey"],
    excursion: "santiago-pilgrimage-tour",
  },
  {
    slug: "lacoruna-old-town-guide",
    name: "La Coruna Old Town",
    title: "La Coruna Old Town Guide from Cruise Port",
    seoTitle: "La Coruna Old Town from Cruise Port — Historic Walking Guide",
    meta: "Explore La Coruna's old town from the cruise terminal with practical walking routes, key squares, churches and return timing.",
    tagline: "Granite lanes, arcades and Atlantic history a short walk from your ship.",
    overview:
      "La Coruna's old town is ideal for independent visitors who want culture without long transfers. The area combines medieval traces, civic buildings, sea-facing viewpoints and excellent cafe density.",
    body2:
      "Start at Maria Pita and move into old lanes toward churches, viewpoints and quiet squares. Keep your pace steady rather than rushed; this district rewards observation more than checklist speed.",
    body3:
      "On wet-weather calls, arcades and compact street patterns help maintain a comfortable plan. Pair old town with San Anton or a short panoramic drive if mobility is limited.",
    distance: "0.8-1.8 km from terminal",
    travel: "10-25 min walk",
    timeNeeded: "90-180 minutes",
    highlights: ["Historic granite streets", "Sea walls and viewpoints", "Traditional squares", "Cafes and pastry stops"],
    tips: ["Wear supportive shoes on uneven surfaces", "Carry offline map for lane navigation", "Stop for coffee before climbing to viewpoints"],
    faqs: [
      ["Is old town walkable for cruise passengers?", "Yes, very walkable for most travellers with moderate mobility."],
      ["Can I do old town without a guide?", "Yes, but guided tours add local stories and architecture context."],
    ],
    related: ["maria-pita-square-guide", "castle-of-san-anton-guide", "can-you-walk-around-lacoruna"],
    excursion: "lacoruna-walking-tour",
  },
  {
    slug: "castle-of-san-anton-guide",
    name: "Castle of San Anton",
    title: "Castle of San Anton Guide for La Coruna Cruise Visitors",
    seoTitle: "Castle of San Anton from La Coruna Cruise Port — Maritime Fortress Guide",
    meta: "Visit the Castle of San Anton from La Coruna cruise port with walking directions, museum expectations and timing tips.",
    tagline: "A harbour fortress turned museum — compact, atmospheric and easy to pair with old town.",
    overview:
      "The Castle of San Anton occupies a strategic harbour point and offers a concise historical stop near central La Coruna. For cruise passengers, it is a practical add-on between Maria Pita and waterfront walks.",
    body2:
      "Inside, expect regional archaeology and maritime context rather than a large blockbuster museum. The value lies in setting, architecture and perspective over harbour approaches.",
    body3:
      "This site is particularly useful on shorter calls because it sits close to your natural walking loop. If museum content is a lower priority, enjoy the exterior and continue toward old town lanes.",
    distance: "1.6 km from terminal",
    travel: "15-20 min walk or 8 min taxi",
    timeNeeded: "45-90 minutes",
    highlights: ["Harbour-fortress architecture", "Compact museum content", "Excellent photo point", "Easy old-town pairing"],
    tips: ["Check opening hours for your call date", "Pair with Maria Pita in one loop", "Carry a light layer in windy weather"],
    faqs: [
      ["Is Castle of San Anton worth visiting?", "Yes if you enjoy maritime history and compact fortress sites."],
      ["How long should I allow?", "About an hour is enough for most cruise visitors."],
    ],
    related: ["lacoruna-old-town-guide", "maria-pita-square-guide", "half-day-lacoruna-tour"],
    excursion: "half-day-lacoruna-tour",
  },
  {
    slug: "atlantic-promenade-guide",
    name: "Atlantic Promenade",
    title: "Atlantic Promenade Guide in La Coruna",
    seoTitle: "La Coruna Atlantic Promenade — Best Walks from Cruise Port",
    meta: "Walk La Coruna's Atlantic promenade from the cruise terminal with route options, distances and weather-smart planning tips.",
    tagline: "One of Europe's great urban seafront walks — ocean, art and city rhythm.",
    overview:
      "La Coruna's promenade connects major highlights in a single scenic arc, making it one of the best self-guided frameworks for a cruise day.",
    body2:
      "You can segment the route: terminal to Maria Pita, then onward to old town viewpoints, beaches or the Tower of Hercules. Frequent benches and cafes make it flexible for mixed mobility groups.",
    body3:
      "On clear days, this route is a photography gift. On windy or wet days, shorten the seafront segment and use taxis for larger transitions while keeping the spirit of the walk.",
    distance: "Variable 2-8 km loops",
    travel: "Fully walkable with optional taxi hops",
    timeNeeded: "60-240 minutes",
    highlights: ["Continuous sea views", "Public art and landmarks", "Flexible loop design", "Excellent independent route"],
    tips: ["Check wind forecast before committing long loop", "Use cafes as anchor checkpoints", "Keep enough time for ship return walk"],
    faqs: [
      ["Is the promenade suitable for first-time visitors?", "Yes, it is the easiest way to structure an independent day."],
      ["Can I walk from the terminal to Tower of Hercules?", "Yes, many cruise passengers do this in good weather."],
    ],
    related: ["tower-of-hercules-guide", "best-beaches-near-lacoruna-guide", "can-you-walk-around-lacoruna"],
    excursion: "panoramic-lacoruna-tour",
  },
  {
    slug: "galicia-wine-guide",
    name: "Galicia Wine Guide",
    title: "Galicia Wine Guide for La Coruna Cruise Passengers",
    seoTitle: "Galicia Wine Guide from La Coruna — Albarino and Regional Pairings",
    meta: "Learn what wines to taste in La Coruna on a cruise day, including Albarino-style profiles and food pairing advice.",
    tagline: "Fresh Atlantic whites and balanced reds that match Galicia's seafood culture.",
    overview:
      "Galician wine is an easy way to deepen your La Coruna day without adding travel time. Many city restaurants carry strong regional lists with knowledgeable staff.",
    body2:
      "Ask for crisp coastal whites with seafood and lighter reds with grilled meats or richer fish dishes. Tastings can be built into lunch or dedicated food-and-wine tours.",
    body3:
      "If you have mobility limits, a seated wine-and-food session near Maria Pita delivers high cultural value with low physical load and strong schedule reliability.",
    distance: "Central venues 10-20 min from terminal",
    travel: "Walk or short taxi",
    timeNeeded: "60-150 minutes",
    highlights: ["Atlantic white wine styles", "Food pairing culture", "Professional local service", "Accessible central tasting options"],
    tips: ["Book tastings ahead on weekends", "Ask for by-the-glass flight options", "Keep lunch reservations near return route"],
    faqs: [
      ["Can I do a wine experience without leaving La Coruna city?", "Yes, central venues offer excellent regional coverage."],
      ["Is wine tasting practical on a port day?", "Very practical when scheduled as part of a central lunch stop."],
    ],
    related: ["galician-food-guide", "best-seafood-lacoruna-guide", "galician-food-wine-tour"],
    excursion: "galician-food-wine-tour",
  },
  {
    slug: "can-you-walk-around-lacoruna",
    name: "Can You Walk Around La Coruna?",
    title: "Can You Walk Around La Coruna from the Cruise Port?",
    seoTitle: "Can You Walk Around La Coruna? Cruise Passenger Walking Reality Guide",
    meta: "A realistic answer to whether cruise passengers can walk around La Coruna independently, with route ideas and timing limits.",
    tagline: "Yes, you can walk a lot of La Coruna — if you plan your loop honestly.",
    overview:
      "La Coruna is among the more walkable Atlantic cruise calls for city highlights. The terminal sits close to Maria Pita and old town, and the promenade links major districts with straightforward navigation.",
    body2:
      "Most passengers can comfortably cover a Maria Pita plus old town loop and still add either Castle of San Anton or a partial seafront walk. Reaching Tower of Hercules on foot is feasible for active travellers with weather cooperation.",
    body3:
      "If conditions are windy or time is short, mix walking with a short taxi segment. This hybrid approach keeps independence while protecting your return margin.",
    distance: "Core walkable zone within 1-3 km",
    travel: "Primarily on foot",
    timeNeeded: "Half to full port day",
    highlights: ["Flat terminal-to-centre route", "Old town and civic core nearby", "Promenade links major areas", "Easy taxi backup"],
    tips: ["Use a loop plan, not random wandering", "Track turnaround time by mid-afternoon", "Switch to taxi if weather worsens"],
    faqs: [
      ["Do I need a shore excursion to enjoy La Coruna?", "No, many passengers enjoy an independent day successfully."],
      ["Is La Coruna better walked or toured?", "First-timers can do either; tours add context, independent plans add flexibility."],
    ],
    related: ["independent-lacoruna-guide", "lacoruna-old-town-guide", "walking-tour-vs-panoramic-tour"],
    excursion: "lacoruna-walking-tour",
  },
  {
    slug: "best-lacoruna-shore-excursions",
    name: "Best La Coruna Shore Excursions",
    title: "Best La Coruna Shore Excursions Ranked",
    seoTitle: "Best La Coruna Shore Excursions — Honest Ranking for Cruise Passengers",
    meta: "Our editorial ranking of the best La Coruna shore excursions including Santiago, city highlights, food and private options.",
    tagline: "The shortlist that balances impact, logistics and return confidence.",
    overview:
      "La Coruna offers two strong archetypes: city-based independent exploration and Santiago-focused guided days. The best excursion depends on call length, interests and walking tolerance.",
    body2:
      "First-time visitors on standard calls usually gain the most from either a Santiago highlights tour or a balanced Best of La Coruna city route. Repeat visitors may prefer food-and-wine, coastal drives or private custom days.",
    body3:
      "Use this ranking with your actual arrival/departure times, not headline tour descriptions. Return confidence is as important as attraction list length.",
    distance: "Varies by tour",
    travel: "Coach, walking and optional private vehicle",
    timeNeeded: "4-8 hours",
    highlights: ["Santiago as top cultural impact", "Strong city-only alternatives", "Reliable half-day options", "Private custom planning"],
    tips: ["Choose one primary anchor", "Avoid overloading short calls", "Book featured tours before sailing"],
    faqs: [
      ["What is the best La Coruna excursion for first-time visitors?", "Usually Santiago highlights or Best of La Coruna depending on your interest in inland transfer time."],
      ["Are private tours worth it?", "Yes for mixed mobility groups and custom priorities."],
    ],
    related: ["best-excursion-first-time-visitors", "one-day-in-lacoruna", "stay-in-lacoruna-or-take-excursion"],
    excursion: "best-of-lacoruna-tour",
  },
  {
    slug: "what-to-do-lacoruna-one-day",
    name: "What to Do in La Coruna in One Day",
    title: "What to Do in La Coruna in One Day from a Cruise Ship",
    seoTitle: "What to Do in La Coruna in One Day — Cruise Port Itinerary Guide",
    meta: "One-day La Coruna cruise itinerary ideas for independent visitors and excursion passengers, with practical timing and return buffers.",
    tagline: "A one-day plan that feels complete, not rushed.",
    overview:
      "One day in La Coruna can be deeply rewarding if you pick a clear theme: old town and seafront, food-centric city immersion, or Santiago as a major inland day trip.",
    body2:
      "For city-focused days, start at Maria Pita, continue through old town, add Castle of San Anton, then choose either Tower of Hercules or beach promenade depending on weather and energy.",
    body3:
      "For excursion-focused days, Santiago becomes the anchor and La Coruna time is limited to a short walk near the terminal before departure. Build buffer generously and avoid final-hour experiments.",
    distance: "City core mostly within 1-4 km",
    travel: "Walk with optional taxis",
    timeNeeded: "Full port day",
    highlights: ["Theme-based planning", "Flexible weather backup", "Strong independent and guided options", "Reliable return planning"],
    tips: ["Commit to one anchor by 09:30", "Schedule lunch near your route", "Aim to be near port 90 minutes before all-aboard"],
    faqs: [
      ["Can I do Santiago and still see La Coruna properly?", "Only lightly. For depth in both, you need a longer stay than one cruise call."],
      ["Best one-day plan for walking lovers?", "Old town plus promenade plus Tower of Hercules in good weather."],
    ],
    related: ["one-day-in-lacoruna", "independent-lacoruna-guide", "best-lacoruna-shore-excursions"],
    excursion: "one-day-in-lacoruna",
  },
];

w(
  "highlights.ts",
  `import type { AttractionPage } from "./types";

export const highlights: AttractionPage[] = [
${attractions.map(attraction).join(",\n")}
];

export function getHighlightBySlug(slug: string): AttractionPage | undefined {
  return highlights.find((p) => p.slug === slug);
}

export function getAllHighlightSlugs(): string[] {
  return highlights.map((p) => p.slug);
}
`,
);

// ─── EXPERIENCES (audience GuidePage guides) ─────────────────────────────────

const experiences = [
  {
    slug: "independent-lacoruna-guide",
    title: "Independent La Coruna Guide for Cruise Passengers",
    seoTitle: "Independent La Coruna Cruise Guide — Walks, Taxis, Food and Return Timing",
    meta: "The comprehensive independent La Coruna cruise guide: terminal route, old town, Tower, beaches, seafood, coffee, shopping, taxi prices and return advice.",
    tagline: "A full self-guided blueprint from gangway to all-aboard.",
    overview:
      "La Coruna is one of the easiest Northern Spain ports for confident independent exploration. This guide gives you a realistic self-guided framework from the cruise terminal to core landmarks and back with safety margin.",
    body1:
      "Start by walking from the terminal to Maria Pita Square (10-15 minutes). Continue into old town lanes for architecture and views, then decide your long-leg anchor: Tower of Hercules, Castle of San Anton, beach promenade, or a seafood-focused midday loop.",
    body2:
      "Taxi guidance: central rides are often around EUR 5-10, Tower of Hercules around EUR 10-15 depending traffic. Keep a note of terminal name Muelle de Transatlanticos and your ship departure time. Distances are short, but weather shifts can slow walkers.",
    body3:
      "Food and coffee strategy: reserve seafood for lunch near old town or marina, then finish with Galician coffee and pastry near Maria Pita for an easy return. Shopping works best in the central commercial grid rather than forcing distant malls.",
    highlights: ["Terminal to Maria Pita walk", "Old town and fortress options", "Tower and beach route choices", "Taxi pricing and return confidence"],
    tips: ["Carry a rain layer even in summer", "Set a turnaround alarm midday", "Target 60-90 minute final return buffer"],
    faqs: [
      ["Can I do La Coruna independently without stress?", "Yes, with a loop plan and conservative return timing."],
      ["How much are taxis in La Coruna?", "Typical central hops are modest; expect roughly EUR 5-15 depending distance."],
    ],
    recommendations: [
      { cat: "best-independent", title: "Can You Walk Around La Coruna?", desc: "Independent walking reality check.", href: "/guides/can-you-walk-around-lacoruna" },
      { cat: "best-food", title: "Galician Food Guide", desc: "What to order and where to stop.", href: "/guides/galician-food-guide" },
      { cat: "best-value", title: "Half-Day La Coruna Tour", desc: "Guided fallback if weather turns.", href: "/shore-excursions/half-day-lacoruna-tour" },
    ],
    related: ["one-day-in-lacoruna", "lacoruna-cruise-port-guide", "can-you-explore-lacoruna-independently"],
    imageKey: "independent",
  },
  {
    slug: "one-day-in-lacoruna",
    title: "One Day in La Coruna on a Cruise",
    seoTitle: "One Day in La Coruna — Cruise Port Itinerary Options",
    meta: "One day in La Coruna cruise itinerary options: city loop, Santiago excursion path and weather-safe alternatives.",
    tagline: "Turn one port call into a coherent Atlantic Spain day.",
    overview:
      "One day in La Coruna rewards clear decision-making. Pick one major anchor by morning: stay in city for depth, or go inland to Santiago for pilgrimage heritage.",
    body1:
      "City-first plan: Maria Pita, old town, Castle of San Anton, seafood lunch, then Tower of Hercules or beach promenade depending wind and time. This keeps transfer risk low and gives a full coastal-Galician character day.",
    body2:
      "Santiago-first plan: depart early on excursion, complete cathedral and old quarter loop, return with buffer, then enjoy a short terminal-area promenade if time remains.",
    body3:
      "Rain and wind fallback: shorten exposed promenade segments, add museum or food-and-wine stops, and switch to taxis for longer transitions.",
    highlights: ["Two reliable itinerary frameworks", "Weather-adjusted alternatives", "Strong return-to-ship discipline"],
    tips: ["Do not try both deep city and deep Santiago on one call", "Use Maria Pita as waypoint", "Return to ship area early"],
    faqs: [
      ["What is the best one-day La Coruna plan?", "For most first-timers: either full city immersion or dedicated Santiago, not both deeply."],
      ["Can I improvise on arrival?", "You can, but a pre-selected anchor dramatically improves the day."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Best of La Coruna Tour", desc: "Balanced city highlights with guide context.", href: "/shore-excursions/best-of-lacoruna-tour" },
      { cat: "best-historic", title: "Santiago Highlights Tour", desc: "Inland culture anchor for first visits.", href: "/shore-excursions/santiago-de-compostela-highlights-tour" },
      { cat: "best-independent", title: "Independent La Coruna Guide", desc: "Self-guided full blueprint.", href: "/guides/independent-lacoruna-guide" },
    ],
    related: ["what-to-do-lacoruna-one-day", "best-excursion-first-time-visitors", "stay-in-lacoruna-or-take-excursion"],
    imageKey: "itinerary",
  },
  {
    slug: "lacoruna-for-first-time-visitors",
    title: "La Coruna for First-Time Visitors",
    seoTitle: "La Coruna for First-Time Cruise Visitors — What to Prioritise",
    meta: "First time in La Coruna on a cruise? Compare city highlights versus Santiago excursion and build a realistic port day.",
    tagline: "First call made simple: choose city depth or Santiago impact.",
    overview:
      "First-time visitors often hesitate between staying in La Coruna and heading to Santiago. Both are good; the right choice depends on your appetite for transfers versus walkable coastal city texture.",
    body1:
      "If you value minimal logistics and strong flexibility, stay in La Coruna: Maria Pita, old town, Tower, seafood and promenade create an excellent first-day profile.",
    body2:
      "If pilgrimage heritage and cathedral architecture are your top priority, choose Santiago and commit to that anchor with an early departure tour.",
    body3:
      "Avoid overpromising your day. A focused plan delivers better memories than racing between inland and coastal highlights.",
    highlights: ["Clear first-timer choice framework", "Transfer reality explained", "Independent and guided options"],
    tips: ["Select one anchor before disembarking", "Book featured excursions in advance", "Use comparison pages before sailing"],
    faqs: [
      ["Should first-timers go to Santiago?", "Yes if cathedral heritage is a top goal and your call length supports it."],
      ["Is staying in La Coruna enough for a first visit?", "Absolutely, especially for travellers who enjoy walkable city days."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Santiago de Compostela Highlights Tour", desc: "Best cultural impact for first-timers.", href: "/shore-excursions/santiago-de-compostela-highlights-tour" },
      { cat: "best-view", title: "Tower of Hercules Tour", desc: "Atlantic landmark focus in-city.", href: "/shore-excursions/tower-of-hercules-tour" },
      { cat: "best-value", title: "Best Excursion for First-Time Visitors", desc: "Comparison guide before booking.", href: "/compare/best-excursion-first-time-visitors" },
    ],
    related: ["best-lacoruna-shore-excursions", "is-santiago-worth-the-journey", "can-you-explore-lacoruna-independently"],
    imageKey: "first-time",
  },
  {
    slug: "lacoruna-cruise-port-guide",
    title: "La Coruna Cruise Port Guide",
    seoTitle: "La Coruna Cruise Port Guide — Terminal, Walkability and Transfers",
    meta: "Detailed La Coruna cruise port guide covering terminal logistics, walking routes, taxis and excursion timing.",
    tagline: "Terminal reality, transfer options and timing confidence for your Galicia call.",
    overview:
      "La Coruna's cruise terminal location is a major advantage: close to central attractions and easy for independent travellers. The main challenge is weather exposure on longer walks.",
    body1:
      "From gangway to Maria Pita is typically 10-15 minutes on foot. Taxis queue near the terminal and are useful for Tower of Hercules, beach districts or tight-weather adjustments.",
    body2:
      "Santiago excursions require early coach departures and disciplined regrouping. Reliable operators keep a clear all-aboard buffer and avoid overlong free-time blocks.",
    body3:
      "Keep your final hour close to the waterfront core. Even short city segments can feel longer in rain or wind, and ship boarding windows are strict.",
    highlights: ["Central docking advantage", "Fast access to old town", "Simple taxi logistics", "Strong guided and DIY flexibility"],
    tips: ["Save terminal location in map app", "Carry ship card and photo ID at all times", "Leave inland trips to vetted operators"],
    faqs: [
      ["Is La Coruna cruise terminal near city centre?", "Yes, very close compared with many Atlantic ports."],
      ["Can I rely on taxis in port?", "Yes, generally reliable for city transfers and weather backup."],
    ],
    recommendations: [
      { cat: "best-short-port", title: "Half-Day La Coruna Tour", desc: "Efficient on shorter calls.", href: "/shore-excursions/half-day-lacoruna-tour" },
      { cat: "best-independent", title: "Independent La Coruna Guide", desc: "DIY terminal-to-city framework.", href: "/guides/independent-lacoruna-guide" },
      { cat: "best-historic", title: "Santiago Highlights", desc: "Inland flagship excursion.", href: "/shore-excursions/santiago-de-compostela-highlights-tour" },
    ],
    related: ["independent-lacoruna-guide", "port-guide", "one-day-in-lacoruna"],
    imageKey: "port",
  },
  {
    slug: "lacoruna-for-families",
    title: "La Coruna for Families on a Cruise",
    seoTitle: "Family-Friendly La Coruna Cruise Day Guide",
    meta: "Plan a family-friendly La Coruna cruise day with practical routes, beach options, easy meals and lower-stress excursion choices.",
    tagline: "Family pacing that still captures Galicia's highlights.",
    overview:
      "La Coruna works well for families because distances are manageable and attractions can be mixed between walking, open-air viewpoints and food stops.",
    body1:
      "Families often do best with a city-first plan: Maria Pita, old town lanes, snack break, then either a panoramic drive or beach segment depending weather and ages.",
    body2:
      "Santiago is possible for families with older children and good coach tolerance, but long transfers and dense historic streets can tire younger travellers.",
    body3:
      "Keep plans modular. If energy drops, switch to a shorter loop and finish with a relaxed seafood lunch or hot chocolate near the waterfront.",
    highlights: ["Walkable core for mixed ages", "Flexible weather alternatives", "Beach and promenade options"],
    tips: ["Pack layers and snacks", "Use toilets at larger cafe stops", "Avoid overlong inland transfers with very young kids"],
    faqs: [
      ["Is La Coruna good for kids?", "Yes, especially for families who prefer flexible city days."],
      ["Should families do Santiago?", "Best for older children; younger families may enjoy a city-based day more."],
    ],
    recommendations: [
      { cat: "best-families", title: "Family La Coruna Tour", desc: "Paced city highlights for mixed ages.", href: "/shore-excursions/family-lacoruna-tour" },
      { cat: "best-coastal", title: "Coastal Scenery Drive", desc: "Low-walking panoramic alternative.", href: "/shore-excursions/coastal-scenery-drive" },
      { cat: "best-food", title: "Galician Food Guide", desc: "Family-friendly local dishes.", href: "/guides/galician-food-guide" },
    ],
    related: ["family-lacoruna-tour", "one-day-in-lacoruna", "best-beaches-near-lacoruna-guide"],
    imageKey: "family",
  },
  {
    slug: "santiago-day-trip-from-lacoruna",
    title: "Santiago Day Trip from La Coruna",
    seoTitle: "Santiago Day Trip from La Coruna Cruise Port — Practical Guide",
    meta: "Plan a smooth Santiago day trip from La Coruna cruise port with timing windows, pacing and return-to-ship confidence.",
    tagline: "How to do Santiago well without missing your ship.",
    overview:
      "A Santiago day trip from La Coruna is highly rewarding when timed properly. The key is disciplined sequencing rather than trying to see everything in the old quarter.",
    body1:
      "Prioritise cathedral zone orientation first, then focused free time for side lanes, lunch or pilgrimage moments. Build regrouping points that reduce stress in busy squares.",
    body2:
      "Coach transfer time is predictable but not guaranteed; weather and event closures can slow access near the historic centre.",
    body3:
      "Choose tour operators that communicate return protocol clearly and track all-aboard times actively.",
    highlights: ["Reliable transfer expectations", "Cathedral-quarter focus", "Strong return strategy"],
    tips: ["Start early", "Keep one fixed meetup point", "Skip fringe sights if time tightens"],
    faqs: [
      ["Is there enough time for Santiago from La Coruna?", "Yes on most standard calls when using a focused plan."],
      ["Should I go independently by train?", "Possible but less forgiving if timings drift; tours are safer for cruise schedules."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Santiago de Compostela Highlights Tour", desc: "Most reliable first-time structure.", href: "/shore-excursions/santiago-de-compostela-highlights-tour" },
      { cat: "best-historic", title: "Santiago Pilgrimage Tour", desc: "Faith-and-history interpretation focus.", href: "/shore-excursions/santiago-pilgrimage-tour" },
      { cat: "best-value", title: "Half-Day Santiago Tour", desc: "Shorter version when call is tighter.", href: "/shore-excursions/half-day-santiago-tour" },
    ],
    related: ["santiago-de-compostela-guide", "is-santiago-worth-the-journey", "should-i-visit-santiago-de-compostela"],
    imageKey: "santiago",
  },
];

w(
  "experiences.ts",
  `import type { GuidePage } from "./types";

export const experiencePages: GuidePage[] = [
${experiences.map(guide).join(",\n")}
];

export function getExperienceBySlug(slug: string): GuidePage | undefined {
  return experiencePages.find((p) => p.slug === slug);
}

/** @deprecated Use getExperienceBySlug */
export const getExperiencePageBySlug = getExperienceBySlug;

export function getAllExperienceSlugs(): string[] {
  return experiencePages.map((p) => p.slug);
}
`,
);

// ─── EXCURSIONS ───────────────────────────────────────────────────────────────

const excursions = [
  {
    slug: "santiago-de-compostela-highlights-tour",
    title: "Santiago de Compostela Highlights Tour",
    seoTitle: "Santiago de Compostela Highlights Shore Excursion from La Coruna",
    meta: "Featured La Coruna shore excursion to Santiago de Compostela with cathedral quarter focus and ship-timed return.",
    category: "Historic Cities",
    tagline: "Featured: Galicia's most iconic inland city in one focused cruise day.",
    duration: "6.5-7.5 hours",
    pace: "Moderate",
    bestFor: "First-time visitors prioritising cathedral heritage and medieval atmosphere",
    overview:
      "The flagship inland excursion from La Coruna: round-trip to Santiago with guided orientation, cathedral-square focus and controlled free time.",
    body1:
      "Depart from the cruise terminal with a direct coach transfer and context briefing en route.",
    body2:
      "Explore Santiago's granite old quarter with a guide before independent time for lunch or pilgrimage landmarks.",
    body3:
      "Return with a structured buffer that protects your all-aboard margin.",
    highlights: ["Santiago cathedral district", "Guided old-quarter orientation", "Balanced free time", "Cruise-timed return"],
    included: ["Round-trip coach", "Licensed guide", "Port pickup/drop-off", "Return timing management"],
    tips: ["Wear non-slip shoes", "Keep meeting point photos", "Do not overextend during free time"],
    faqs: [
      ["Is this tour suitable for first-timers?", "Yes, it is our top cultural recommendation on standard calls."],
      ["How long is coach travel each way?", "Typically around 1 to 1.25 hours each direction."],
    ],
    related: ["best-of-lacoruna-tour", "half-day-santiago-tour", "santiago-pilgrimage-tour"],
    featured: true,
  },
  {
    slug: "best-of-lacoruna-tour",
    title: "Best of La Coruna Tour",
    seoTitle: "Best of La Coruna Shore Excursion — Featured City Highlights",
    meta: "Featured city-focused La Coruna shore excursion covering Maria Pita, old town, Tower of Hercules and coastal viewpoints.",
    category: "Historic Cities",
    tagline: "Featured: the best city-only balance for cruise visitors.",
    duration: "4.5-5.5 hours",
    pace: "Moderate",
    bestFor: "Passengers wanting depth in La Coruna without inland transfers",
    overview:
      "A structured city highlights itinerary combining civic core, old town textures, Atlantic viewpoints and practical return confidence.",
    body1:
      "Begin near the terminal and orient around Maria Pita before moving through old-town sections.",
    body2:
      "Continue to Tower of Hercules zone or panoramic viewpoints depending operational conditions.",
    body3:
      "Finish with buffer and optional central refreshment stop before port return.",
    highlights: ["Maria Pita and old town", "Tower of Hercules context", "Coastal viewpoints", "No long coach transfer"],
    included: ["Guide", "Local transport segments", "Walking orientation", "Timed return"],
    tips: ["Ideal for mixed-interest groups", "Carry layer for windy viewpoints", "Great first-port choice"],
    faqs: [
      ["Is this better than Santiago for short calls?", "Usually yes because it avoids long inland transfers."],
      ["Does it include enough walking?", "Moderate walking with manageable breaks and transport support."],
    ],
    related: ["santiago-de-compostela-highlights-tour", "lacoruna-walking-tour", "panoramic-lacoruna-tour"],
    featured: true,
  },
  {
    slug: "tower-of-hercules-tour",
    title: "Tower of Hercules Tour",
    seoTitle: "Tower of Hercules Shore Tour from La Coruna Port",
    meta: "Dedicated Tower of Hercules shore tour with coastal interpretation and scenic Atlantic viewpoints.",
    category: "Walking Tours",
    tagline: "Roman lighthouse focus with coastal storytelling.",
    duration: "3-4 hours",
    pace: "Moderate",
    bestFor: "Travellers prioritising landmark photography and maritime history",
    overview:
      "A focused excursion to La Coruna's UNESCO Roman lighthouse with interpretation of Atlantic navigation and local history.",
    body1: "Transfer or guided walk to the headland and lighthouse precinct.",
    body2: "Time for viewpoints, photos and contextual commentary.",
    body3: "Return via scenic route with optional central stop.",
    highlights: ["UNESCO lighthouse", "Clifftop views", "Maritime heritage", "Photo-rich route"],
    included: ["Guide", "Transport support if included", "Port return"],
    tips: ["Weather can change quickly", "Bring secure footwear", "Check tower access conditions"],
    faqs: [
      ["Is entry to the tower guaranteed?", "Subject to opening and capacity, but the surrounding site is always worthwhile."],
      ["Can limited-mobility passengers join?", "Yes with adapted pacing and transport emphasis."],
    ],
    related: ["lacoruna-walking-tour", "panoramic-lacoruna-tour", "half-day-lacoruna-tour"],
  },
  {
    slug: "lacoruna-walking-tour",
    title: "La Coruna Walking Tour",
    seoTitle: "La Coruna Walking Tour from Cruise Port — Old Town and Waterfront",
    meta: "Guided La Coruna walking excursion for cruise passengers covering old town, Maria Pita and waterfront highlights.",
    category: "Walking Tours",
    tagline: "Best route for travellers who want the city on foot.",
    duration: "3.5-4.5 hours",
    pace: "Active",
    bestFor: "Visitors who enjoy architecture, local stories and flexible stops",
    overview: "A walking-first city immersion linking civic core, old lanes and key waterfront sections.",
    body1: "Meet near port and begin with Maria Pita orientation and local context.",
    body2: "Continue through historic streets, viewpoints and practical local stops.",
    body3: "Return on a direct route with optional coffee break near terminal area.",
    highlights: ["Detailed city storytelling", "Historic walking flow", "No heavy coach time", "Flexible local pace"],
    included: ["Licensed guide", "Walking route planning", "Port-oriented finish"],
    tips: ["Wear good shoes", "Carry water and layer", "Ask guide for independent follow-up recommendations"],
    faqs: [
      ["Is this too much walking for a port day?", "Active but manageable for most travellers with moderate fitness."],
      ["Can I leave early if needed?", "Usually yes due to central routing near taxi access points."],
    ],
    related: ["best-of-lacoruna-tour", "panoramic-lacoruna-tour", "family-lacoruna-tour"],
  },
  {
    slug: "galician-food-wine-tour",
    title: "Galician Food and Wine Tour",
    seoTitle: "Galician Food and Wine Shore Excursion in La Coruna",
    meta: "Taste-focused La Coruna excursion featuring Galician cuisine, seafood culture and regional wines.",
    category: "Food & Wine",
    tagline: "An Atlantic flavour journey made for cruise schedules.",
    duration: "4-5 hours",
    pace: "Relaxed",
    bestFor: "Food-focused travellers and repeat cruisers wanting local depth",
    overview: "A curated culinary route through La Coruna's food identity, from seafood staples to wine pairings.",
    body1: "Start with market or tavern orientation and local ingredient context.",
    body2: "Sample representative dishes with paired regional wines.",
    body3: "Return with practical shopping tips for edible souvenirs.",
    highlights: ["Galician classics", "Regional wine pairings", "Local market insights", "Comfortable pacing"],
    included: ["Guide", "Selected tastings", "Wine samples", "Port return coordination"],
    tips: ["Share dietary needs at booking", "Eat a light breakfast", "Keep hydration steady"],
    faqs: [
      ["Is this tour suitable for non-drinkers?", "Yes, food remains the core and alternatives are usually available."],
      ["Will I get enough for lunch?", "Most tours provide substantial tasting volume."],
    ],
    related: ["best-seafood-lacoruna-guide", "galicia-wine-guide", "best-of-lacoruna-tour"],
  },
  {
    slug: "coastal-scenery-drive",
    title: "Coastal Scenery Drive",
    seoTitle: "La Coruna Coastal Scenery Drive Shore Excursion",
    meta: "Panoramic Atlantic coastline drive from La Coruna cruise port with scenic stops and low walking demand.",
    category: "Coastal Scenery",
    tagline: "Big Atlantic views with minimal effort.",
    duration: "3.5-4.5 hours",
    pace: "Relaxed",
    bestFor: "Passengers preferring viewpoints over long city walks",
    overview: "A vehicle-led scenic loop highlighting La Coruna's coastal character and city-sea relationship.",
    body1: "Comfortable transport between principal coastal viewpoints.",
    body2: "Short photo stops with guide commentary on maritime history.",
    body3: "Return through city panoramas and terminal-adjacent roads.",
    highlights: ["Atlantic panoramas", "Low walking requirement", "Weather-adaptive routing", "Great for mixed mobility"],
    included: ["Transport", "Guide", "Photo stops", "Timed return"],
    tips: ["Bring jacket for exposed stops", "Keep camera ready", "Ideal backup in wet weather"],
    faqs: [
      ["Is this suitable for limited mobility?", "Yes, among the most accessible excursion styles in port."],
      ["Does it include old town walking?", "Usually brief only; this is primarily a scenic drive."],
    ],
    related: ["panoramic-lacoruna-tour", "family-lacoruna-tour", "best-beaches-near-lacoruna-guide"],
  },
  {
    slug: "santiago-pilgrimage-tour",
    title: "Santiago Pilgrimage Tour",
    seoTitle: "Santiago Pilgrimage Shore Tour from La Coruna",
    meta: "Pilgrimage-focused Santiago shore excursion for cruise passengers interested in Camino heritage and cathedral context.",
    category: "Pilgrimage Tours",
    tagline: "A faith-and-history lens on Santiago.",
    duration: "6.5-7.5 hours",
    pace: "Moderate",
    bestFor: "Travellers interested in Camino traditions and sacred heritage",
    overview: "An interpretation-rich Santiago day with emphasis on pilgrimage history rather than broad sightseeing volume.",
    body1: "Transfer inland with Camino context briefing.",
    body2: "Guided cathedral-quarter focus and symbolic route elements.",
    body3: "Measured free time before organised return to port.",
    highlights: ["Pilgrimage storytelling", "Cathedral context", "Camino-focused interpretation", "Reliable ship return"],
    included: ["Coach transport", "Specialist guide", "Port transfers"],
    tips: ["Respect quiet zones", "Carry lightweight rain layer", "Stay close to group timings"],
    faqs: [
      ["Do I need to be religious to enjoy this tour?", "No, it is valuable for history and culture as well."],
      ["Is this different from standard Santiago highlights?", "Yes, with stronger Camino and pilgrimage framing."],
    ],
    related: ["santiago-de-compostela-highlights-tour", "half-day-santiago-tour", "private-galicia-tour"],
  },
  {
    slug: "private-galicia-tour",
    title: "Private Galicia Tour",
    seoTitle: "Private Galicia Shore Excursion from La Coruna",
    meta: "Custom private Galicia shore excursion from La Coruna for tailored pacing, mixed mobility and priority interests.",
    category: "Private Tours",
    tagline: "A bespoke day built around your priorities.",
    duration: "Flexible 5-8 hours",
    pace: "Relaxed",
    bestFor: "Families, mixed-mobility groups and travellers wanting custom sequencing",
    overview: "Private touring gives maximum control over pace, content and weather adjustments on your La Coruna call.",
    body1: "Design your day around city highlights, Santiago focus, food priorities or coastal scenery.",
    body2: "Guide and driver coordinate route changes in real time based on conditions.",
    body3: "Return protocols are conservative and tailored to your ship timetable.",
    highlights: ["Custom itinerary", "Flexible pace", "Private vehicle comfort", "High return confidence"],
    included: ["Private guide", "Dedicated vehicle", "Custom planning", "Port pickup/drop-off"],
    tips: ["Share priorities before sailing", "Set non-negotiable stops early", "Use private format for mixed needs"],
    faqs: [
      ["Can private tours include Santiago?", "Yes, if your call length supports inland transfer time."],
      ["Are private tours worth the premium?", "Often yes for groups wanting flexibility and comfort."],
    ],
    related: ["best-of-lacoruna-tour", "santiago-de-compostela-highlights-tour", "family-lacoruna-tour"],
  },
  {
    slug: "half-day-lacoruna-tour",
    title: "Half-Day La Coruna Tour",
    seoTitle: "Half-Day La Coruna Shore Excursion for Short Port Calls",
    meta: "Efficient half-day La Coruna excursion for short calls, covering core city highlights with strong return margin.",
    category: "Half-Day Tours",
    tagline: "Smart city essentials when hours are limited.",
    duration: "3.5-4.5 hours",
    pace: "Moderate",
    bestFor: "Short calls and passengers wanting low transfer risk",
    overview: "A concise city circuit that captures core identity without overextending the schedule.",
    body1: "Cover Maria Pita, old town perspectives and selected coastal or fortress points.",
    body2: "Limit transitions and keep the route compact.",
    body3: "Return early enough to avoid final-hour stress.",
    highlights: ["City essentials", "No inland transfer", "High schedule reliability", "Great short-call option"],
    included: ["Guide", "Compact route planning", "Port-aligned timing"],
    tips: ["Ideal in uncertain weather", "Pair with independent lunch after tour", "Book early on heavy ship days"],
    faqs: [
      ["Is half-day enough for La Coruna?", "Enough for a meaningful introduction and low-stress port day."],
      ["Can I add independent time afterward?", "Yes, often with time for lunch or waterfront stroll."],
    ],
    related: ["half-day-santiago-tour", "best-of-lacoruna-tour", "lacoruna-walking-tour"],
  },
  {
    slug: "half-day-santiago-tour",
    title: "Half-Day Santiago Tour",
    seoTitle: "Half-Day Santiago Shore Excursion from La Coruna",
    meta: "Compressed Santiago excursion from La Coruna for tighter calls, focused on cathedral quarter essentials.",
    category: "Half-Day Tours",
    tagline: "Santiago essentials in a compressed format.",
    duration: "5-6 hours",
    pace: "Active",
    bestFor: "Passengers with tighter call windows still prioritising Santiago",
    overview: "A faster Santiago option that prioritises headline landmarks and disciplined timing.",
    body1: "Early departure and direct transfer to minimise wasted time.",
    body2: "Focused old-quarter orientation with reduced free time.",
    body3: "Prompt return sequence to protect all-aboard margin.",
    highlights: ["Cathedral-quarter essentials", "Fast transfer pacing", "Useful for tighter calls"],
    included: ["Round-trip coach", "Guide", "Time-managed stop plan"],
    tips: ["Keep expectations focused", "Stay near guide during transitions", "Avoid long lunch stops"],
    faqs: [
      ["Is this too rushed?", "It is brisk but practical when call length is constrained."],
      ["Better than city-only tour on short calls?", "Depends on priorities; choose city if you dislike time pressure."],
    ],
    related: ["santiago-de-compostela-highlights-tour", "santiago-pilgrimage-tour", "half-day-lacoruna-tour"],
  },
  {
    slug: "panoramic-lacoruna-tour",
    title: "Panoramic La Coruna Tour",
    seoTitle: "Panoramic La Coruna Shore Tour — Scenic City Overview",
    meta: "Panoramic La Coruna excursion with comfortable transport, key viewpoints and light walking requirements.",
    category: "Coastal Scenery",
    tagline: "A scenic overview with low physical strain.",
    duration: "3-4 hours",
    pace: "Relaxed",
    bestFor: "Passengers preferring broad orientation and easy comfort",
    overview: "A city panorama tour that introduces La Coruna's geography, coast and major districts with minimal walking.",
    body1: "Vehicle-led orientation through central and coastal routes.",
    body2: "Strategic photo stops at major viewpoints.",
    body3: "Return with optional short terminal-area stroll.",
    highlights: ["Low-walking comfort", "Excellent orientation", "Weather-flexible routing"],
    included: ["Transport", "Guide", "Photo stops", "Port return"],
    tips: ["Great first excursion for day-one orientation", "Bring lightweight jacket", "Pair with independent lunch"],
    faqs: [
      ["How is this different from walking tour?", "Less walking, broader city coverage from a vehicle perspective."],
      ["Suitable for seniors?", "Yes, commonly chosen by travellers seeking a gentler pace."],
    ],
    related: ["lacoruna-walking-tour", "coastal-scenery-drive", "family-lacoruna-tour"],
  },
  {
    slug: "family-lacoruna-tour",
    title: "Family La Coruna Tour",
    seoTitle: "Family-Friendly La Coruna Shore Excursion",
    meta: "Family-focused La Coruna excursion with flexible pacing, scenic stops and child-friendly planning from cruise port.",
    category: "Walking Tours",
    tagline: "A practical family day without overloading the schedule.",
    duration: "4-5 hours",
    pace: "Relaxed",
    bestFor: "Families with children or mixed-age groups",
    overview: "A family-calibrated route blending short walks, viewpoint stops and food breaks.",
    body1: "Start with easy city orientation and open-space stops.",
    body2: "Mix light history with coastal scenery and snack timing.",
    body3: "Return before fatigue peaks and all-aboard pressure builds.",
    highlights: ["Family pacing", "Flexible route design", "Low stress logistics", "Weather backup options"],
    included: ["Guide", "Family-friendly timing", "Transport support as needed"],
    tips: ["Share child ages at booking", "Pack snacks and layers", "Keep itinerary modular"],
    faqs: [
      ["Can strollers work on this tour?", "Usually yes on most segments, with occasional uneven surfaces."],
      ["Is this better than Santiago for younger kids?", "Often yes due to shorter transfer time and more flexibility."],
    ],
    related: ["best-of-lacoruna-tour", "coastal-scenery-drive", "half-day-lacoruna-tour"],
  },
];

w(
  "excursions.ts",
  `import type { ExcursionPage } from "./types";

const PORT_LOGISTICS =
  "${esc(PORT_LOGISTICS)}";

export const excursions: ExcursionPage[] = [
${excursions.map(excursion).join(",\n")}
];

export function getExcursionBySlug(slug: string): ExcursionPage | undefined {
  return excursions.find((p) => p.slug === slug);
}

export function getAllExcursionSlugs(): string[] {
  return excursions.map((p) => p.slug);
}

export function getFeaturedExcursions(): ExcursionPage[] {
  return excursions.filter((p) => p.featured);
}

`,
);

// ─── COMPARISONS ──────────────────────────────────────────────────────────────

const comparisons = [
  comparisonGuide({
    slug: "should-i-visit-santiago-de-compostela",
    title: "Should I Visit Santiago de Compostela from La Coruna?",
    seoTitle: "Should You Visit Santiago from La Coruna Cruise Port?",
    meta: "Compare whether Santiago de Compostela is worth doing from La Coruna on a cruise day based on timing, interests and walking profile.",
    summary:
      "Santiago is one of Spain's most rewarding heritage cities, but it requires a clear commitment to coach transfers and a cathedral-quarter focus.",
    verdict:
      "Choose Santiago when pilgrimage heritage and medieval architecture are top priorities; stay in La Coruna when you prefer walkable flexibility and lower transfer risk.",
    overview: [
      "Santiago delivers higher singular cultural impact.",
      "La Coruna delivers lower stress and more independent flexibility.",
      "Standard calls can support either well if you choose one anchor.",
    ],
    guideItems: [
      { name: "Santiago Highlights", slug: "santiago-de-compostela-highlights-tour", href: "/shore-excursions/santiago-de-compostela-highlights-tour", reason: "Best first-time Santiago structure.", topExcursion: "Featured inland choice", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Best of La Coruna", slug: "best-of-lacoruna-tour", href: "/shore-excursions/best-of-lacoruna-tour", reason: "Top city-only alternative.", topExcursion: "Featured city choice", returnConfidence: "Very high", walkingDifficulty: "Moderate" },
      { name: "Independent Guide", slug: "independent-lacoruna-guide", href: "/guides/independent-lacoruna-guide", reason: "DIY flexibility without inland transfer.", topExcursion: "Independent day", returnConfidence: "High", walkingDifficulty: "Variable" },
    ],
    faqs: [
      ["Is Santiago too far for a cruise day?", "No, distance is manageable with planned coach timing."],
      ["What if weather is poor?", "Santiago still works, but city-stay plans may feel easier in heavy rain."],
    ],
    related: ["is-santiago-worth-the-journey", "stay-in-lacoruna-or-take-excursion", "best-excursion-first-time-visitors"],
    imageKey: "santiago",
  }),
  versus({
    slug: "stay-in-lacoruna-or-take-excursion",
    optionA: "Stay in La Coruna",
    optionB: "Take an Excursion to Santiago",
    summary:
      "City-stay plans maximise flexibility and low stress; Santiago excursions maximise headline cultural impact with longer transfers.",
    verdict:
      "Choose city-stay for easy independence and weather adaptability. Choose Santiago excursion for cathedral heritage and Camino atmosphere.",
    overview: [
      "La Coruna city day: walkable and modular.",
      "Santiago day: stronger single cultural anchor.",
      "Transfer tolerance is the deciding factor.",
    ],
    table: [
      { category: "Transfer time", optionA: "Minimal", optionB: "~2-2.5 hours total coach" },
      { category: "Cultural impact", optionA: "Distributed city texture", optionB: "High cathedral concentration" },
      { category: "Flexibility", optionA: "High", optionB: "Moderate" },
      { category: "Return confidence", optionA: "Very high", optionB: "High with good operator" },
    ],
    faqs: [
      ["What is safer for short calls?", "Staying in La Coruna is safer when usable hours are limited."],
      ["What is better for first-timers to Galicia?", "Often Santiago, if transfer time is acceptable to you."],
    ],
    related: ["should-i-visit-santiago-de-compostela", "one-day-in-lacoruna", "best-lacoruna-shore-excursions"],
    imageKey: "comparison",
  }),
  comparisonGuide({
    slug: "is-santiago-worth-the-journey",
    title: "Is Santiago Worth the Journey from La Coruna?",
    seoTitle: "Is Santiago Worth the Journey? La Coruna Cruise Comparison",
    meta: "An honest evaluation of whether Santiago justifies the inland transfer from La Coruna cruise port.",
    summary:
      "For most culture-driven first-time visitors, yes. The cathedral quarter's historical and emotional weight often becomes the day's highlight.",
    verdict:
      "Worth the journey when your call is standard/long and you value heritage. Less compelling if you want a relaxed, low-transfer day.",
    overview: [
      "Transfer cost is predictable and manageable.",
      "Experience intensity is high for history and pilgrimage interests.",
      "Alternative city-only day remains excellent for slower travel style.",
    ],
    guideItems: [
      { name: "Santiago Highlights", slug: "santiago-de-compostela-highlights-tour", href: "/shore-excursions/santiago-de-compostela-highlights-tour", reason: "Best all-round Santiago option.", topExcursion: "Featured", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Santiago Pilgrimage", slug: "santiago-pilgrimage-tour", href: "/shore-excursions/santiago-pilgrimage-tour", reason: "Best for Camino context.", topExcursion: "Pilgrimage focus", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Half-Day Santiago", slug: "half-day-santiago-tour", href: "/shore-excursions/half-day-santiago-tour", reason: "For tighter calls.", topExcursion: "Compressed option", returnConfidence: "Moderate to high", walkingDifficulty: "Moderate" },
    ],
    faqs: [
      ["Will I feel rushed in Santiago?", "Somewhat on shorter formats; full highlights tours feel better paced."],
      ["Can I still see La Coruna on the same day?", "Only briefly before/after excursion windows."],
    ],
    related: ["should-i-visit-santiago-de-compostela", "stay-in-lacoruna-or-take-excursion", "one-day-in-lacoruna"],
    imageKey: "journey",
  }),
  comparisonGuide({
    slug: "best-excursion-first-time-visitors",
    title: "Best La Coruna Excursion for First-Time Visitors",
    seoTitle: "Best La Coruna Excursion for First-Time Cruise Visitors",
    meta: "Compare top La Coruna shore excursions for first-time visitors by pace, cultural depth and return confidence.",
    summary:
      "First-time visitors should choose between Santiago impact and city-depth balance rather than trying to do everything.",
    verdict:
      "Santiago Highlights is top for heritage-first travellers. Best of La Coruna is top for low-transfer city immersion.",
    overview: [
      "Featured inland: Santiago Highlights.",
      "Featured city: Best of La Coruna.",
      "Half-day and family options remain strong alternatives.",
    ],
    guideItems: [
      { name: "Santiago Highlights", slug: "santiago-de-compostela-highlights-tour", href: "/shore-excursions/santiago-de-compostela-highlights-tour", reason: "Highest cultural impact.", topExcursion: "Featured", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Best of La Coruna", slug: "best-of-lacoruna-tour", href: "/shore-excursions/best-of-lacoruna-tour", reason: "Best city-first profile.", topExcursion: "Featured", returnConfidence: "Very high", walkingDifficulty: "Moderate" },
      { name: "Half-Day La Coruna", slug: "half-day-lacoruna-tour", href: "/shore-excursions/half-day-lacoruna-tour", reason: "Best for tighter calls.", topExcursion: "Short-port option", returnConfidence: "Very high", walkingDifficulty: "Low to moderate" },
      { name: "Family Tour", slug: "family-lacoruna-tour", href: "/shore-excursions/family-lacoruna-tour", reason: "Best mixed-age pacing.", topExcursion: "Family", returnConfidence: "High", walkingDifficulty: "Low" },
    ],
    faqs: [
      ["Which tour should first-timers pick?", "Most choose Santiago Highlights or Best of La Coruna depending transfer preference."],
      ["Can I choose on arrival day?", "Possible, but best options may sell out on popular sailings."],
    ],
    related: ["lacoruna-for-first-time-visitors", "best-lacoruna-shore-excursions", "one-day-in-lacoruna"],
    imageKey: "first-time",
  }),
  comparisonGuide({
    slug: "can-you-explore-lacoruna-independently",
    title: "Can You Explore La Coruna Independently?",
    seoTitle: "Can You Explore La Coruna Independently from Cruise Port?",
    meta: "Independent exploration reality guide for La Coruna cruise passengers, including walkability, taxis and timing safeguards.",
    summary:
      "Yes, La Coruna is highly workable independently for most cruise passengers, especially in good weather and with a defined loop.",
    verdict:
      "Independent is excellent for city-focused days. Choose guided options for Santiago transfers or if you prefer zero logistics friction.",
    overview: [
      "Terminal location supports independent exploration.",
      "Promenade links major highlights.",
      "Taxis offer fast weather and time backup.",
    ],
    guideItems: [
      { name: "Independent Guide", slug: "independent-lacoruna-guide", href: "/guides/independent-lacoruna-guide", reason: "Complete DIY structure.", topExcursion: "DIY plan", returnConfidence: "High", walkingDifficulty: "Variable" },
      { name: "Can You Walk Around?", slug: "can-you-walk-around-lacoruna", href: "/guides/can-you-walk-around-lacoruna", reason: "Walkability truth check.", topExcursion: "Walking day", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Best of La Coruna", slug: "best-of-lacoruna-tour", href: "/shore-excursions/best-of-lacoruna-tour", reason: "Guided fallback with context.", topExcursion: "City guided", returnConfidence: "Very high", walkingDifficulty: "Moderate" },
    ],
    faqs: [
      ["Is independent La Coruna safe and practical?", "Yes, with normal urban awareness and return-time discipline."],
      ["Should I pre-book anything for independent day?", "Seafood reservations and tower slots are helpful in peak months."],
    ],
    related: ["independent-lacoruna-guide", "can-you-walk-around-lacoruna", "walking-tour-vs-panoramic-tour"],
    imageKey: "independent",
  }),
  versus({
    slug: "walking-tour-vs-panoramic-tour",
    optionA: "La Coruna Walking Tour",
    optionB: "Panoramic La Coruna Tour",
    summary:
      "Walking tours deliver richer street-level detail; panoramic tours deliver broader coverage with less physical demand.",
    verdict:
      "Choose walking if you enjoy active exploration and local texture. Choose panoramic for comfort, orientation and lower exertion.",
    overview: [
      "Walking: deeper immersion.",
      "Panoramic: easier mobility profile.",
      "Both can fit short calls with disciplined timing.",
    ],
    table: [
      { category: "Physical demand", optionA: "Moderate active", optionB: "Low" },
      { category: "Detail level", optionA: "High street-level", optionB: "Broad overview" },
      { category: "Weather exposure", optionA: "Higher", optionB: "Lower" },
      { category: "Best for", optionA: "Active visitors", optionB: "Comfort-focused travellers" },
    ],
    faqs: [
      ["Which is better for first-time visitors?", "Both work; choose based on your walking comfort and weather tolerance."],
      ["Can I combine both?", "Usually unnecessary on one call; pick one and add independent time."],
    ],
    related: ["lacoruna-walking-tour", "panoramic-lacoruna-tour", "can-you-explore-lacoruna-independently"],
    imageKey: "walking-vs-panoramic",
  }),
  comparisonGuide({
    slug: "one-day-in-lacoruna",
    title: "One Day in La Coruna — Comparison Guide",
    seoTitle: "One Day in La Coruna — Compare Best Port-Day Plans",
    meta: "Compare realistic one-day La Coruna plans for cruise passengers: city immersion, Santiago transfer and hybrid options.",
    summary:
      "One day in La Coruna works best when you choose a clear anchor and build around weather and return confidence.",
    verdict:
      "City immersion wins for flexibility. Santiago wins for singular heritage impact. Hybrid plans should stay conservative.",
    overview: [
      "Plan A: Full city immersion.",
      "Plan B: Santiago excursion anchor.",
      "Plan C: Half-day tour plus independent food focus.",
    ],
    guideItems: [
      { name: "Best of La Coruna", slug: "best-of-lacoruna-tour", href: "/shore-excursions/best-of-lacoruna-tour", reason: "Balanced city structure.", topExcursion: "Featured city", returnConfidence: "Very high", walkingDifficulty: "Moderate" },
      { name: "Santiago Highlights", slug: "santiago-de-compostela-highlights-tour", href: "/shore-excursions/santiago-de-compostela-highlights-tour", reason: "Inland heritage anchor.", topExcursion: "Featured inland", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Half-Day La Coruna", slug: "half-day-lacoruna-tour", href: "/shore-excursions/half-day-lacoruna-tour", reason: "Short-call efficient route.", topExcursion: "Half-day city", returnConfidence: "Very high", walkingDifficulty: "Low to moderate" },
      { name: "Independent Guide", slug: "independent-lacoruna-guide", href: "/guides/independent-lacoruna-guide", reason: "DIY framework with flexibility.", topExcursion: "Independent", returnConfidence: "High", walkingDifficulty: "Variable" },
    ],
    faqs: [
      ["Can I do a hybrid city plus Santiago day?", "Only lightly; do not attempt depth in both on one call."],
      ["What is safest in poor weather?", "City-based plans with taxi support and shorter exposed segments."],
    ],
    related: ["what-to-do-lacoruna-one-day", "stay-in-lacoruna-or-take-excursion", "best-excursion-first-time-visitors"],
    imageKey: "one-day",
  }),
];

w(
  "comparisons.ts",
  `import type { Comparison, ComparisonGuideItem, FAQ } from "./types";

export const comparisons: Comparison[] = [
${comparisons.join(",\n")}
];

export function getComparisonBySlug(slug: string): Comparison | undefined {
  return comparisons.find((c) => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return comparisons.map((c) => c.slug);
}

export function getComparisonDisplayTitle(comp: Comparison): string {
  if (comp.kind === "versus" && comp.optionA && comp.optionB) {
    return comp.optionA + " vs " + comp.optionB;
  }
  return comp.title;
}
`,
);

// ─── PLANNER ─────────────────────────────────────────────────────────────────

w(
  "planner.ts",
  `import { excursions } from "./excursions";

export interface PlannerInput {
  timeframe: "short" | "standard" | "long";
  arrivalTime?: string;
  departureTime?: string;
  adults: number;
  children: number;
  interests: string[];
  mobility: "full" | "some" | "limited";
  budget: "budget" | "mid" | "premium";
  style: "guided" | "mix" | "diy";
}

export interface PlannerLink {
  label: string;
  href: string;
  why: string;
}

export interface PlannerResult {
  headline: string;
  summary: string;
  excursions: PlannerLink[];
  transfers: string[];
  stay: string[];
  logistics: string[];
  dayPlan: { time: string; text: string }[];
}

export const INTEREST_OPTIONS = [
  { id: "old-town", label: "Old Town & city history" },
  { id: "santiago", label: "Santiago de Compostela" },
  { id: "roman-heritage", label: "Roman heritage" },
  { id: "food-wine", label: "Galician food and wine" },
  { id: "coastal", label: "Atlantic coast and viewpoints" },
  { id: "pilgrimage", label: "Pilgrimage and Camino heritage" },
  { id: "walking", label: "Walking-focused exploration" },
] as const;

const THEMES = {
  city: {
    headline: "Walkable Atlantic city day",
    summary: "Stay in La Coruna for maximum flexibility, coastal atmosphere and low transfer risk.",
    top: ["best-of-lacoruna-tour", "lacoruna-walking-tour", "half-day-lacoruna-tour"],
  },
  santiago: {
    headline: "Santiago heritage day",
    summary: "Head inland to Santiago for cathedral heritage and Camino atmosphere.",
    top: ["santiago-de-compostela-highlights-tour", "santiago-pilgrimage-tour", "half-day-santiago-tour"],
  },
  culinary: {
    headline: "Galician flavour day",
    summary: "Use your call for seafood, regional wines and market-driven local culture.",
    top: ["galician-food-wine-tour", "best-of-lacoruna-tour", "private-galicia-tour"],
  },
} as const;

function parseTime(value?: string): number | null {
  if (!value) return null;
  const m = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

function calcHours(input: PlannerInput): number {
  const fallback = input.timeframe === "short" ? 6 : input.timeframe === "standard" ? 8.5 : 10;
  const a = parseTime(input.arrivalTime);
  const d = parseTime(input.departureTime);
  if (a === null || d === null) return fallback;
  let diff = d - a;
  if (diff < 0) diff += 24 * 60;
  const usable = Math.max(4, diff / 60 - 1.25);
  return Math.min(12, usable);
}

function pickTheme(interests: string[]): keyof typeof THEMES {
  const set = new Set(interests);
  if (set.has("santiago") || set.has("pilgrimage")) return "santiago";
  if (set.has("food-wine")) return "culinary";
  return "city";
}

function excursionLink(slug: string): PlannerLink | null {
  const ex = excursions.find((e) => e.slug === slug);
  if (!ex) return null;
  return { label: ex.title, href: "/shore-excursions/" + ex.slug, why: ex.tagline };
}

export function generateLacorunaPlan(input: PlannerInput): PlannerResult {
  const hours = calcHours(input);
  const themeKey = pickTheme(input.interests);
  const theme = THEMES[themeKey];
  const party = input.adults + input.children;

  const excursionCandidates = theme.top
    .map(excursionLink)
    .filter((x): x is PlannerLink => Boolean(x));

  const transfers = [
    "Cruise terminal to Maria Pita: 10-15 min walk on mostly flat route.",
    "Terminal to Tower of Hercules: roughly 10-15 min taxi or longer scenic walk.",
    "La Coruna to Santiago by coach: around 1-1.25 hours each way.",
  ];

  const logistics = [
    "Confirm all-aboard time before leaving the terminal.",
    "Target return to port area 60-90 minutes before all-aboard.",
    "Atlantic weather can shift quickly; keep a rain and wind fallback.",
    "On heavy ship days, pre-book key excursions and seafood lunches.",
  ];

  const dayPlan: { time: string; text: string }[] = [];

  if (themeKey === "santiago") {
    dayPlan.push({ time: "Morning", text: "Depart early for Santiago and start in cathedral quarter before crowds thicken." });
    dayPlan.push({ time: "Midday", text: "Guided orientation and focused free time for lunch or pilgrimage landmarks." });
    dayPlan.push({ time: "Afternoon", text: "Return to La Coruna with conservative buffer; optional short waterfront walk near terminal." });
  } else if (themeKey === "culinary") {
    dayPlan.push({ time: "Morning", text: "Old town and market orientation with light snacks or coffee." });
    dayPlan.push({ time: "Midday", text: "Main seafood and wine experience at a pre-selected central venue." });
    dayPlan.push({ time: "Afternoon", text: "Promenade stroll or panoramic segment, then early return toward port." });
  } else {
    dayPlan.push({ time: "Morning", text: "Walk terminal to Maria Pita, then explore old town before peak foot traffic." });
    dayPlan.push({ time: "Midday", text: "Choose either Tower of Hercules or beach promenade, plus lunch near central core." });
    dayPlan.push({ time: "Afternoon", text: "Flexible coffee and shopping block close to return route." });
  }

  dayPlan.push({
    time: "Return buffer",
    text: "Be back near Muelle de Transatlanticos 60-90 minutes before all-aboard to absorb weather, queues or traffic.",
  });

  const interestText = input.interests
    .map((id) => INTEREST_OPTIONS.find((o) => o.id === id)?.label ?? id)
    .join(", ")
    .toLowerCase();

  return {
    headline: theme.headline,
    summary:
      theme.summary +
      " A " +
      input.timeframe +
      " La Coruna port day (~" +
      hours.toFixed(1) +
      " usable hours) for " +
      party +
      " guest" +
      (party === 1 ? "" : "s") +
      " interested in " +
      (interestText || "classic port highlights") +
      ".",
    excursions: excursionCandidates,
    transfers,
    stay: [],
    logistics,
    dayPlan,
  };
}

/** @deprecated Use generateLacorunaPlan */
export const generateKotorPlan = generateLacorunaPlan;
`,
);

// ─── EDITORIAL ───────────────────────────────────────────────────────────────

w(
  "editorial.ts",
  `import type { EditorialCategory } from "./types";

export interface EditorialCategoryDef {
  id: EditorialCategory;
  label: string;
  shortLabel: string;
  description: string;
}

export const EDITORIAL_CATEGORIES: EditorialCategoryDef[] = [
  { id: "editors-choice", label: "Editor's Choice", shortLabel: "Editor's Choice", description: "Top overall pick after balancing impact, logistics and return confidence for La Coruna cruise passengers." },
  { id: "best-historic", label: "Best Historic Experience", shortLabel: "Historic", description: "Santiago heritage, old town architecture and Galicia's deeper historical layers." },
  { id: "best-independent", label: "Best Independent Experience", shortLabel: "Independent", description: "Self-guided plans that work well from La Coruna's central cruise terminal." },
  { id: "best-coastal", label: "Best Coastal Experience", shortLabel: "Coastal", description: "Atlantic viewpoints, beach promenades and sea-facing scenic routes." },
  { id: "best-view", label: "Best Viewpoints", shortLabel: "Viewpoints", description: "Tower of Hercules and panoramic city-sea angles." },
  { id: "best-families", label: "Best for Families", shortLabel: "Families", description: "Pacing and route design suitable for children and mixed-age groups." },
  { id: "best-photography", label: "Best for Photography", shortLabel: "Photography", description: "Strong light, architecture and coastline composition opportunities." },
  { id: "best-food", label: "Best Food & Wine Experience", shortLabel: "Food & Wine", description: "Seafood, regional wines and market-to-table Galicia experiences." },
  { id: "best-luxury", label: "Best Luxury Experience", shortLabel: "Luxury", description: "Private Galicia touring with custom pace and comfort." },
  { id: "hidden-gem", label: "Hidden Gem", shortLabel: "Hidden Gem", description: "Less-obvious but highly rewarding alternatives on a port day." },
  { id: "best-value", label: "Best Value", shortLabel: "Best Value", description: "Strong overall return in experience quality per euro and per hour." },
  { id: "best-short-port", label: "Best for Short Port Calls", shortLabel: "Short Port", description: "Reliable options for tighter arrival-departure windows." },
];

export function getEditorialLabel(id: EditorialCategory): string {
  return EDITORIAL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
`,
);

// ─── HOMEPAGE ────────────────────────────────────────────────────────────────

w(
  "homepage.ts",
  `import type { FAQ, VisitorType, ExperienceCard } from "./types";

export interface HomeSection {
  slug: string;
  number: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export const visitorTypes: VisitorType[] = [
  {
    id: "port-day",
    label: "I am visiting La Coruna for the day on a cruise",
    shortLabel: "Port day",
    description: "Find shore excursions, independent routes and realistic logistics from La Coruna's cruise terminal.",
    href: "/shore-excursions",
    cta: "Plan my port day",
  },
  {
    id: "first-time",
    label: "It is my first time in La Coruna",
    shortLabel: "First visit",
    description: "Decide between city immersion and Santiago with honest timing advice.",
    href: "/guides/lacoruna-for-first-time-visitors",
    cta: "First-timer guide",
  },
  {
    id: "independent",
    label: "I prefer to explore independently",
    shortLabel: "Independent",
    description: "Self-guided walkable loops, taxi options and seafood-focused planning.",
    href: "/guides/independent-lacoruna-guide",
    cta: "Independent route",
  },
  {
    id: "families",
    label: "I am travelling with family",
    shortLabel: "Families",
    description: "Family pacing, child-friendly choices and flexible weather alternatives.",
    href: "/guides/lacoruna-for-families",
    cta: "Family guide",
  },
];

export const experienceCards: ExperienceCard[] = [
  {
    slug: "roman-heritage",
    title: "Roman Heritage",
    description: "Tower of Hercules and Atlantic-era maritime history.",
    href: "/guides/tower-of-hercules-guide",
    cta: "Explore Roman heritage",
    imageKey: "roman-heritage",
  },
  {
    slug: "santiago",
    title: "Santiago de Compostela",
    description: "Galicia's cathedral city and Camino atmosphere.",
    href: "/guides/santiago-de-compostela-guide",
    cta: "Explore Santiago",
    imageKey: "santiago",
  },
  {
    slug: "atlantic-coast",
    title: "Atlantic Coast",
    description: "Promenade viewpoints, beaches and coastal drives.",
    href: "/guides/atlantic-promenade-guide",
    cta: "Explore the coast",
    imageKey: "coastal",
  },
  {
    slug: "food-wine",
    title: "Galician Food & Wine",
    description: "Seafood culture, market dining and regional wines.",
    href: "/guides/galician-food-guide",
    cta: "Food & wine guide",
    imageKey: "food",
  },
  {
    slug: "walking-tours",
    title: "Historic Walking Tours",
    description: "Old town storytelling and city-scale exploration.",
    href: "/shore-excursions/lacoruna-walking-tour",
    cta: "Walking tours",
    imageKey: "walking",
  },
  {
    slug: "private-tours",
    title: "Private Galicia Tours",
    description: "Custom private itineraries for comfort and flexibility.",
    href: "/shore-excursions/private-galicia-tour",
    cta: "Go private",
    imageKey: "private",
  },
];

export const coreSections: HomeSection[] = [
  { slug: "shore-excursions", number: "01", title: "Shore Excursions", description: "Santiago, Tower of Hercules, food & wine and coastal Galicia — cruise-timed from La Coruña.", href: "/shore-excursions", cta: "Browse excursions" },
  { slug: "guides", number: "02", title: "La Coruña Planning Guides", description: "Authority guides for Santiago, seafood, beaches, Camino heritage and every type of passenger.", href: "/guides", cta: "Read guides" },
  { slug: "cruise-port-guide", number: "03", title: "La Coruña Cruise Port Guide", description: "Terminal layout, walking to María Pita, taxi costs and practical arrival advice.", href: "/cruise-port-guide", cta: "Port guide" },
  { slug: "cruise-planner", number: "04", title: "La Coruña Cruise Planner", description: "Answer a few questions — get a tailored itinerary with return-to-ship confidence.", href: "/cruise-planner", cta: "Start planning" },
  { slug: "compare", number: "05", title: "Compare Options", description: "La Coruña vs Santiago, walking vs panoramic, DIY vs guided — honest comparisons.", href: "/compare/should-i-visit-santiago-de-compostela", cta: "Compare options" },
  { slug: "ship-schedules", number: "06", title: "Cruise Ship Schedules", description: "See which ships call at La Coruña and plan around published arrival and departure times.", href: "/ship-schedules/lacoruna", cta: "View schedules" },
  { slug: "one-day", number: "07", title: "One Day in La Coruña", description: "Hour-by-hour sample itineraries from gangway to all-aboard.", href: "/guides/one-day-in-lacoruna", cta: "One-day guide" },
  { slug: "faq", number: "08", title: "FAQ", description: "La Coruña cruise port questions answered — timing, taxis, Santiago and return buffers.", href: "/faq", cta: "Read FAQs" },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "Where do cruise ships dock in La Coruna?",
      answer: "At Muelle de Transatlanticos on the waterfront, close to Maria Pita Square and the historic core.",
    },
    {
      question: "Is La Coruna walkable from the cruise terminal?",
      answer: "Yes, core highlights like Maria Pita and old town are reachable in about 10-20 minutes on foot.",
    },
    {
      question: "How far is Santiago de Compostela from La Coruna port?",
      answer: "Roughly 75 km inland, usually around 1 to 1.25 hours each way by coach.",
    },
    {
      question: "What is the best first excursion from La Coruna?",
      answer: "Most first-timers choose either Santiago Highlights or Best of La Coruna depending transfer preference.",
    },
    {
      question: "Can I do La Coruna without a ship excursion?",
      answer: "Yes, independent exploration is straightforward with a planned walking loop and conservative return buffer.",
    },
  ];
}
`,
);

// ─── SCHEDULES ───────────────────────────────────────────────────────────────

w(
  "schedules.ts",
  `import type { ScheduleEntry, ShipSchedulePort } from "./types";
import {
  filterEntriesByMonth,
  filterEntriesByYear,
  getMonthsWithEntries,
  type ScheduleYear,
} from "@/lib/schedule-utils";
import lacorunaSchedule from "./imported-schedules/lacoruna.json";

const SCHEDULE_FAQS = [
  {
    question: "How accurate are La Coruna cruise schedules?",
    answer:
      "Schedules are compiled from published data and updated periodically. Arrival times and berth assignments can change, so always verify with your cruise line.",
  },
  {
    question: "When is peak cruise season in La Coruna?",
    answer:
      "Most calls arrive between spring and autumn, with busiest traffic in late spring through early fall.",
  },
  {
    question: "Can I plan Santiago on any call length?",
    answer:
      "Santiago is best on standard or long calls. Tight calls usually benefit from city-focused options in La Coruna.",
  },
];

const SCHEDULE_TIPS = [
  "Check multi-ship days before locking lunch reservations",
  "Book Santiago tours early on high-traffic dates",
  "Keep 60-90 minute return buffer before all-aboard",
  "Use weather-aware backup plans for exposed promenade routes",
];

export const schedulePorts: ShipSchedulePort[] = [
  {
    slug: "lacoruna",
    name: "La Coruna",
    country: "Spain",
    seoTitle: "La Coruna Cruise Ship Schedule 2026",
    metaDescription:
      "La Coruna cruise ship schedule with arrival/departure planning tips for city highlights and Santiago excursions.",
    intro:
      "La Coruna is a key Atlantic Spain cruise call with excellent city walkability and strong inland access to Santiago de Compostela.",
    description: "Galician Atlantic port with easy city access and Santiago day-trip potential.",
    scheduleOverview:
      "Cruise traffic peaks across spring to autumn itineraries in Northern Spain and Atlantic Europe routes.",
    planningTips: SCHEDULE_TIPS,
    faqs: SCHEDULE_FAQS,
  },
];

const schedulesByPort: Record<string, ScheduleEntry[]> = {
  lacoruna: (lacorunaSchedule as ScheduleEntry[]) ?? [],
};

export const scheduleYears: ScheduleYear[] = [2025, 2026, 2027];

export function getScheduleEntries(slug: string): ScheduleEntry[] {
  return schedulesByPort[slug] ?? [];
}

export function getSchedulePort(slug: string): ShipSchedulePort | undefined {
  return schedulePorts.find((p) => p.slug === slug);
}

export function getScheduleEntriesByYear(slug: string, year: number): ScheduleEntry[] {
  return filterEntriesByYear(getScheduleEntries(slug), year);
}

export function getScheduleEntriesByMonth(slug: string, year: number, month: string): ScheduleEntry[] {
  return filterEntriesByMonth(getScheduleEntriesByYear(slug, year), month);
}

export function getVerifiedMonthKeys(slug: string): string[] {
  return getMonthsWithEntries(getScheduleEntries(slug));
}

export function searchSchedulesByShip(query: string): { portSlug: string; entries: ScheduleEntry[] }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const results: { portSlug: string; entries: ScheduleEntry[] }[] = [];
  for (const port of schedulePorts) {
    const matches = getScheduleEntries(port.slug).filter(
      (e) => e.ship.toLowerCase().includes(q) || e.cruiseLine.toLowerCase().includes(q),
    );
    if (matches.length) results.push({ portSlug: port.slug, entries: matches });
  }
  return results;
}

export function getTodayTomorrowEntries(slug: string): { today: ScheduleEntry[]; tomorrow: ScheduleEntry[] } {
  const entries = getScheduleEntries(slug);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return {
    today: entries.filter((e) => e.date === fmt(today)),
    tomorrow: entries.filter((e) => e.date === fmt(tomorrow)),
  };
}
`,
);

// ─── PORT GUIDE ──────────────────────────────────────────────────────────────

w(
  "port-guide.ts",
  `import type { FAQ } from "./types";

export interface Terminal {
  name: string;
  quay: string;
  usedBy: string;
  cityAccess: string;
}

export interface PortGuideSection {
  heading: string;
  paragraphs: string[];
}

export const portGuideContent = {
  title: "La Coruna Cruise Port Guide",
  subtitle: "Terminal location, walkability, Santiago transfers and return-to-ship strategy for La Coruna cruise passengers.",
  terminals: [
    {
      name: "Muelle de Transatlanticos",
      quay: "Main cruise quay on the La Coruna waterfront",
      usedBy: "Most mainstream and premium ships calling at La Coruna",
      cityAccess: "10-15 min walk to Maria Pita and old town; taxis and excursion coaches at terminal zone",
    },
    {
      name: "Waterfront city core",
      quay: "Maria Pita and historic centre approaches",
      usedBy: "Independent cruise visitors walking from terminal",
      cityAccess: "Flat-to-gentle city routes with cafes, arcades and clear wayfinding",
    },
    {
      name: "Excursion coach staging",
      quay: "Designated pickup points near cruise terminal",
      usedBy: "Santiago and Galicia shore excursion operators",
      cityAccess: "Direct boarding with ship-time aligned departures",
    },
  ] as Terminal[],
  sections: [
    {
      heading: "Terminal and first steps",
      paragraphs: [
        "La Coruna's terminal location is one of its biggest advantages. You can step off the ship and reach Maria Pita Square quickly on foot.",
        "Keep your ship card and photo ID with you. If weather looks unstable, decide early whether to rely on walking or switch to short taxi segments.",
        "Independent travellers should screenshot terminal location and all-aboard time before leaving the quay.",
      ],
    },
    {
      heading: "Getting around",
      paragraphs: [
        "Walking works for most central highlights: Maria Pita, old town and parts of the promenade.",
        "Taxis are practical for Tower of Hercules, beach transitions and late-day weather changes.",
        "Santiago excursions are best handled via organised coaches with clear return protocols.",
      ],
    },
    {
      heading: "Santiago transfer reality",
      paragraphs: [
        "Santiago sits roughly 75 km inland, usually around 1 to 1.25 hours each way by coach.",
        "A well-paced excursion still gives meaningful cathedral-quarter time, but avoid trying to add too many side objectives.",
        "If your call is short or weather unstable, city-focused La Coruna plans are often stronger.",
      ],
    },
    {
      heading: "Return to ship strategy",
      paragraphs: [
        "Target return to terminal area 60-90 minutes before all-aboard.",
        "Even in a compact city, rain and wind can slow walking segments and queue times at boarding can vary.",
        "On independent days, keep your final coffee or shopping stop close to the waterfront core.",
      ],
    },
  ] as PortGuideSection[],
  faqs: [
    {
      question: "How far is Maria Pita from the cruise terminal?",
      answer: "Usually around 10-15 minutes on foot via a straightforward waterfront route.",
    },
    {
      question: "Can I walk to Tower of Hercules from the ship?",
      answer: "Yes if weather and fitness allow, though many passengers prefer a short taxi each way.",
    },
    {
      question: "How long should I allow returning from Santiago?",
      answer: "At least 1 to 1.25 hours travel plus a conservative 60-90 minute all-aboard buffer.",
    },
    {
      question: "Is La Coruna suitable for independent port days?",
      answer: "Yes, it is among the more independent-friendly Atlantic cruise ports in Spain.",
    },
  ] as FAQ[],
};

export const terminals = portGuideContent.terminals;
export const portGuideSections = portGuideContent.sections;
export const portGuideFaqs = portGuideContent.faqs;
`,
);

// ─── FAQS ────────────────────────────────────────────────────────────────────

w(
  "faqs.ts",
  `import type { FAQ } from "./types";
import { getHomepageFaqs } from "./homepage";

export const extraFaqs: FAQ[] = [
  {
    question: "Where do cruise ships dock in La Coruna?",
    answer:
      "At Muelle de Transatlanticos on the waterfront, with easy access to Maria Pita and old town on foot.",
  },
  {
    question: "Is La Coruna a walkable cruise port?",
    answer:
      "Yes. Core highlights are close, and many passengers complete a full city day independently with planned loops.",
  },
  {
    question: "How far is Santiago from La Coruna cruise port?",
    answer:
      "About 75 km inland, typically around 1 to 1.25 hours each way by coach depending traffic.",
  },
  {
    question: "What is the best first excursion in La Coruna?",
    answer:
      "For heritage-first travellers, Santiago Highlights. For lower-transfer city depth, Best of La Coruna.",
  },
  {
    question: "Can I explore La Coruna independently instead of booking a tour?",
    answer:
      "Yes. The terminal location supports independent walking loops, with taxis available for longer hops.",
  },
  {
    question: "Is Tower of Hercules worth visiting on a port day?",
    answer:
      "Yes. It is La Coruna's signature landmark and combines well with old town or promenade routes.",
  },
  {
    question: "Are La Coruna beaches practical on a cruise call?",
    answer:
      "Yes as a flexible add-on, especially in good weather and on longer calls.",
  },
  {
    question: "How much should I budget for taxis in La Coruna?",
    answer:
      "Short central rides are usually modest, often around EUR 5-10 with longer city hops somewhat higher.",
  },
  {
    question: "Is La Coruna suitable for families?",
    answer:
      "Very suitable, thanks to manageable distances, open spaces and flexible city-based planning.",
  },
  {
    question: "How early should I return to the ship?",
    answer:
      "Aim to be back near terminal area 60-90 minutes before all-aboard, especially after inland trips.",
  },
  {
    question: "What should I eat in La Coruna on a cruise day?",
    answer:
      "Prioritise Galician seafood, empanada, octopus and a regional wine pairing if timing allows.",
  },
  {
    question: "Is weather a major factor in La Coruna planning?",
    answer:
      "Yes. Atlantic wind and rain can appear quickly, so keep a weather-adaptive backup route.",
  },
  {
    question: "Can I do Santiago and full La Coruna city highlights in one day?",
    answer:
      "Only partially. Most travellers enjoy the day more by choosing one primary anchor.",
  },
  {
    question: "Are private tours useful in La Coruna?",
    answer:
      "Yes for mixed mobility, family groups and travellers wanting custom pace or priorities.",
  },
  {
    question: "What are the strongest categories of La Coruna shore excursions?",
    answer:
      "Historic cities, pilgrimage tours, food and wine, coastal scenery, private tours, half-day tours and walking tours.",
  },
];

export function getAllFaqs(): FAQ[] {
  return [...getHomepageFaqs(), ...extraFaqs];
}
`,
);

// ─── CRUISE PLANNING HUB PAGES ──────────────────────────────────────────────

const MED_BASE =
  "These pages help La Coruna cruise passengers plan nearby Atlantic and Iberian ports with realistic transfer expectations and honest pacing guidance.";

const cruisePlanning = [
  {
    s: "mediterranean-cruise-planner",
    title: "Mediterranean Cruise Planner",
    seo: "Mediterranean Cruise Planner for La Coruna Passengers",
    meta: "Multi-port planning hub connecting La Coruna with major Iberian and Atlantic cruise calls.",
    tag: "Plan your wider itinerary, not just one port day.",
    ov: "A practical hub for cruise passengers combining La Coruna with other Iberian and Atlantic calls.",
    b1: MED_BASE,
    b2: "Use this hub to sequence high-effort ports and low-effort ports across your itinerary so you avoid fatigue stacking.",
    b3: "Where external authority sites exist, we link directly so you can plan each stop with local depth.",
    hi: ["Cross-port planning", "Transfer realism", "Fatigue-aware sequencing"],
    ti: ["Balance inland days with walkable days", "Book priority excursions early", "Keep weather contingencies"],
    recs: [
      { c: "editors-choice", t: "Northern Spain Cruise Ports", d: "Compare Atlantic Spain calls in one view.", h: "/plan-your-cruise-holiday/northern-spain-cruise-ports" },
      { c: "best-value", t: "Spain Cruise Guide", d: "Nationwide planning approach for cruise itineraries.", h: "/plan-your-cruise-holiday/spain-cruise-guide" },
    ],
    rel: ["northern-spain-cruise-ports", "spain-cruise-guide", "lisbon-shore-excursions"],
    img: "planner",
  },
  {
    s: "bilbao-shore-excursions",
    title: "Bilbao Shore Excursions",
    seo: "Bilbao Shore Excursions (External Placeholder)",
    meta: "Bilbao planning resource placeholder for cruise passengers continuing through Northern Spain itineraries.",
    tag: "Bilbao planning reference.",
    ov: "If your itinerary includes Bilbao as well as La Coruna, use this placeholder authority link for local planning depth.",
    b1: MED_BASE,
    b2: "Bilbao offers a different profile from La Coruna: urban Basque culture, museum focus and regional day-trip options.",
    b3: "External resource: https://bilbaoshoreexcursions.com",
    hi: ["Bilbao placeholder authority", "Useful for multi-port planning"],
    ti: ["Compare walking demands across ports", "Pre-plan museum-heavy days", "Use external specialist guides"],
    recs: [
      { c: "best-independent", t: "Bilbao Shore Excursions", d: "External planning authority placeholder.", h: "https://bilbaoshoreexcursions.com" },
    ],
    rel: ["northern-spain-cruise-ports", "mediterranean-cruise-planner", "spain-cruise-guide"],
    img: "city",
  },
  {
    s: "bordeaux-cruise-port",
    title: "Bordeaux Cruise Port",
    seo: "Bordeaux Cruise Port Guide (External)",
    meta: "External Bordeaux cruise planning reference for passengers combining Atlantic France and Northern Spain itineraries.",
    tag: "Atlantic wine-country extension from Spain itineraries.",
    ov: "Bordeaux appears on some Atlantic sailings that also call at Iberian ports. Use this page as an external planning bridge.",
    b1: MED_BASE,
    b2: "Bordeaux differs from La Coruna in river-port logistics and wine-country day-trip structure.",
    b3: "External reference: https://bordeauxcruiseport.com",
    hi: ["River-port logistics", "Wine-focused alternatives", "External planning link"],
    ti: ["Check transfer times from river berths", "Sequence heavy tasting days carefully", "Use local authority guidance"],
    recs: [
      { c: "best-food", t: "Bordeaux Cruise Port", d: "External Bordeaux planning resource.", h: "https://bordeauxcruiseport.com" },
    ],
    rel: ["mediterranean-cruise-planner", "spain-cruise-guide", "lisbon-shore-excursions"],
    img: "wine",
  },
  {
    s: "northern-spain-cruise-ports",
    title: "Northern Spain Cruise Ports",
    seo: "Northern Spain Cruise Ports — Planning Hub",
    meta: "Northern Spain cruise planning hub connecting La Coruna with Bilbao, Cadiz context and wider Iberian routes.",
    tag: "Compare Northern Spain ports with honest logistics.",
    ov: "This hub helps you compare walkability, transfer patterns and headline experiences across Northern Spain cruise calls.",
    b1: MED_BASE,
    b2: "La Coruna stands out for central docking and easy city independence, while other ports may require more transport planning.",
    b3: "Use the linked guides to avoid overloading consecutive excursion-heavy days.",
    hi: ["Port-to-port comparison", "Transfer realism", "Energy-aware itinerary design"],
    ti: ["Alternate active and relaxed ports", "Pre-book flagship excursions", "Protect return buffers"],
    recs: [
      { c: "best-value", t: "Bilbao Shore Excursions", d: "External Bilbao planning reference.", h: "https://bilbaoshoreexcursions.com" },
      { c: "best-independent", t: "La Coruna Independent Guide", d: "Strong DIY day template.", h: "/guides/independent-lacoruna-guide" },
    ],
    rel: ["bilbao-shore-excursions", "spain-cruise-guide", "mediterranean-cruise-planner"],
    img: "north-spain",
  },
  {
    s: "cadiz-shore-excursions",
    title: "Cadiz Shore Excursions",
    seo: "Cadiz Shore Excursions — Atlantic Spain Planning",
    meta: "Cadiz cruise planning page for travellers combining southern and northern Spanish ports on one itinerary.",
    tag: "Southern Spain complement to La Coruna's Atlantic north.",
    ov: "Cadiz and La Coruna offer contrasting Spanish cruise experiences. Use this page to plan pacing between them.",
    b1: MED_BASE,
    b2: "Cadiz often leans toward Andalusian heritage and optional Seville transfers, while La Coruna focuses Atlantic city texture and Santiago access.",
    b3: "Compare transfer intensity before finalising excursion bookings.",
    hi: ["North vs south Spain contrast", "Different transfer profiles", "Stronger itinerary balance"],
    ti: ["Avoid two long inland days in a row", "Choose one flagship excursion per port", "Keep heat and weather in mind"],
    recs: [
      { c: "best-historic", t: "Spain Cruise Guide", d: "Country-wide planning framework.", h: "/plan-your-cruise-holiday/spain-cruise-guide" },
    ],
    rel: ["spain-cruise-guide", "lisbon-shore-excursions", "mediterranean-cruise-planner"],
    img: "cadiz",
  },
  {
    s: "lisbon-shore-excursions",
    title: "Lisbon Shore Excursions",
    seo: "Lisbon Shore Excursions — Iberian Cruise Planning",
    meta: "Lisbon cruise planning page for itineraries that also include La Coruna and other Atlantic Iberian calls.",
    tag: "A major Atlantic capital often paired with Northern Spain ports.",
    ov: "Lisbon's urban scale and hill profile create a very different day from La Coruna's compact walkable core.",
    b1: MED_BASE,
    b2: "Use Lisbon as your high-density urban day and keep La Coruna more relaxed or vice versa depending your travel style.",
    b3: "External Lisbon specialists can add neighbourhood-level detail to your plan.",
    hi: ["Iberian itinerary pairing", "Urban contrast planning", "Energy-aware sequencing"],
    ti: ["Plan for hills in Lisbon", "Use flatter La Coruna day for recovery", "Book must-do sites in advance"],
    recs: [
      { c: "best-value", t: "Mediterranean Cruise Planner", d: "Cross-port planning hub.", h: "/plan-your-cruise-holiday/mediterranean-cruise-planner" },
    ],
    rel: ["spain-cruise-guide", "cadiz-shore-excursions", "mediterranean-cruise-planner"],
    img: "lisbon",
  },
  {
    s: "spain-cruise-guide",
    title: "Spain Cruise Guide",
    seo: "Spain Cruise Guide for Multi-Port Itineraries",
    meta: "Spain cruise planning guide connecting La Coruna with major Iberian port-call strategy and excursion pacing.",
    tag: "Build a smarter Spain itinerary port by port.",
    ov: "A practical Spain-wide cruise planning guide to balance inland excursions, walkable days and culinary priorities.",
    b1: MED_BASE,
    b2: "Use La Coruna for Atlantic-city and Santiago options, then calibrate effort across Bilbao, Cadiz, Lisbon-linked routes and beyond.",
    b3: "When in doubt, choose fewer high-value anchors rather than overpacked daily schedules.",
    hi: ["Nationwide planning lens", "Pacing strategy", "Excursion prioritisation"],
    ti: ["Alternate intense and relaxed days", "Plan around weather and transfer time", "Keep contingency blocks"],
    recs: [
      { c: "editors-choice", t: "Northern Spain Cruise Ports", d: "Regional comparison hub.", h: "/plan-your-cruise-holiday/northern-spain-cruise-ports" },
      { c: "best-independent", t: "La Coruna Independent Guide", d: "Model for self-guided urban calls.", h: "/guides/independent-lacoruna-guide" },
    ],
    rel: ["mediterranean-cruise-planner", "northern-spain-cruise-ports", "cadiz-shore-excursions"],
    img: "spain",
  },
];

w(
  "cruise-planning.ts",
  `import type { GuidePage } from "./types";

export const cruisePlanningPages: GuidePage[] = [
${cruisePlanning.map(planningPage).join(",\n")}
];

export function getCruisePlanningPageBySlug(slug: string): GuidePage | undefined {
  return cruisePlanningPages.find((p) => p.slug === slug);
}

export function getAllCruisePlanningSlugs(): string[] {
  return cruisePlanningPages.map((p) => p.slug);
}

export const mediterraneanLinks = [
  {
    title: "Mediterranean Cruise Planner",
    href: "https://mediterraneancruiseplanner.com",
    description: "Cross-port itinerary tools for Mediterranean and Atlantic-connected cruise routes.",
  },
  {
    title: "Bilbao Shore Excursions",
    href: "https://bilbaoshoreexcursions.com",
    description: "Placeholder external planning authority for Bilbao cruise calls.",
  },
  {
    title: "Bordeaux Cruise Port",
    href: "https://bordeauxcruiseport.com",
    description: "External Bordeaux planning reference for Atlantic cruise itineraries.",
  },
  {
    title: "Cadiz Shore Excursions",
    href: "https://cadizshoreexcursions.com",
    description: "Southern Spain counterpart for itinerary balancing.",
  },
  {
    title: "Lisbon Shore Excursions",
    href: "https://lisbonshoreexcursions.com",
    description: "Iberian capital planning context for Atlantic routes.",
  },
  {
    title: "Spain Cruise Guide",
    href: "https://spaincruiseguide.com",
    description: "Multi-port Spain planning framework for cruise travellers.",
  },
];
`,
);

w("imported-schedules/lacoruna.json", "[]\n");

console.log("La Coruña data generation complete.");
