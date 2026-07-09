#!/usr/bin/env node
/**
 * Generates Kotor-specific content data files from structured definitions.
 * Run: node scripts/generate-kotor-data.mjs
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
  "Cruise ships dock at the Port of Kotor, within walking distance of the UNESCO-listed Old Town. Allow 5–10 minutes on foot to the Sea Gate or 2–3 minutes by taxi. The Bay of Kotor arrival is one of Europe's most spectacular — plan to be on deck. Confirm your all-aboard time and keep a 60–90 minute buffer before departure.";

const GT = `[
      { method: "Walk from cruise port", detail: "Flat waterfront route along the harbour to the Sea Gate — Old Town's main entrance.", time: "5–10 min", cost: "Free" },
      { method: "Taxi from port", detail: "Metered taxis at the terminal rank — fastest in heat or with limited mobility.", time: "2–3 min", cost: "€3–6" },
      { method: "Shore excursion", detail: "Coach, minivan or walking tour with guide and return timed to all-aboard.", time: "Door-to-door", cost: "Tour price" },
    ]`;

const PORT_LOGISTICS =
  "Cruise ships dock at the Port of Kotor, within walking distance of the UNESCO-listed Old Town. Allow 5–10 minutes on foot to the Sea Gate or 2–3 minutes by taxi. The Bay of Kotor arrival is one of Europe's most spectacular — plan to be on deck. Confirm your all-aboard time and keep a 60–90 minute buffer before departure.";

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
    `${cfg.optionA} vs ${cfg.optionB} — Kotor Cruise Passengers`;
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
    faqs: [${faq(cfg.q1 ?? "Is this relevant on a Kotor port day?", cfg.a1 ?? "Yes — Kotor sits on most Adriatic and Eastern Mediterranean itineraries from April through October.")}, ${faq(cfg.q2 ?? "Where can I plan other ports?", cfg.a2 ?? "See our Mediterranean cruise planning hub for Dubrovnik, Corfu and multi-port itineraries.")}]${recs},
    relatedSlugs: [${cfg.rel.map((s) => `"${s}"`).join(", ")}],
    imageKey: "${cfg.img}",
    hubPath: "/plan-your-cruise-holiday",
  }`;
}

// ─── HIGHLIGHTS (18+ AttractionPage guides) ───────────────────────────────────

const attractions = [
  {
    slug: "kotor-old-town-guide",
    name: "Kotor Old Town",
    title: "Kotor Old Town Guide from Cruise Port",
    seoTitle: "Kotor Old Town Guide — UNESCO Walled City from Cruise Port",
    meta: "Explore Kotor's UNESCO Old Town from the cruise port — Sea Gate, St Tryphon Cathedral, marble squares and realistic timings for cruise passengers.",
    tagline: "Venetian walls, baroque palaces and mountain-backed lanes — the Adriatic's most dramatic walled city.",
    overview:
      "Kotor Old Town is a UNESCO World Heritage site at the innermost point of the Bay of Kotor — a compact maze of stone lanes, churches and piazzas framed by near-vertical mountains. From the cruise port it is a 5–10 minute walk to the Sea Gate.",
    body2:
      "Enter via the Sea Gate on the waterfront — the main cruise-passenger entrance. The Arms Square (Trg od Oružja) opens inside with cafés and the Clock Tower; St Tryphon Cathedral sits two minutes deeper. Most passengers cover the core in 2–3 hours before optional fortress climbs or bay excursions.",
    body3:
      "Summer crowds peak 11:00–15:00 when multiple ships are in port. Morning arrivals should walk Old Town first, then fortress or Perast. Cats are everywhere — part of Kotor's charm and a favourite photo subject.",
    distance: "400 m / 5–10 min walk from Port of Kotor",
    travel: "5–10 minutes walking; 2–3 minutes by taxi",
    timeNeeded: "Allow 2–4 hours on foot",
    highlights: ["Sea Gate and waterfront ramparts", "St Tryphon Cathedral Romanesque interior", "Arms Square and Clock Tower", "Maritime Museum and Pima Palace"],
    tips: ["Start at the Sea Gate before fortress queues build", "Wear grippy shoes — polished limestone gets slippery", "Carry cash for small cafés and cathedral donations"],
    faqs: [
      ["Can I walk from the cruise port to Old Town?", "Yes — follow the harbour promenade to the Sea Gate. Allow 5–10 minutes each way; flat and straightforward."],
      ["How much walking is involved?", "Expect 2–4 km on cobbles and occasional steps in side lanes — compact but uneven underfoot."],
    ],
    related: ["kotor-fortress-guide", "best-restaurants-kotor-old-town", "one-day-in-kotor"],
    excursion: "old-town-walking-tour",
  },
  {
    slug: "kotor-fortress-guide",
    name: "San Giovanni Fortress",
    title: "Kotor Fortress Climb Guide from Cruise Port",
    seoTitle: "Kotor Fortress (San Giovanni) Climb — Cruise Port Guide & Timings",
    meta: "Climb Kotor's San Giovanni Fortress from the cruise port — 1,350 steps, rampart views, ticket tips and return-to-ship planning for cruise passengers.",
    tagline: "1,350 steps to the fortress of St John — the Bay of Kotor spread below like a fjord.",
    overview:
      "The San Giovanni (St John's) Fortress climbs the mountain behind Kotor Old Town — roughly 1,350 stone steps to ramparts with views over the entire bay. For active cruise passengers this is the signature Kotor experience after the Old Town stroll.",
    body2:
      "The trail starts behind St Tryphon Cathedral inside the walls — buy tickets at the entrance kiosk. Allow 60–90 minutes up and 30–45 minutes down at a moderate pace with photo stops. Minimal shade and full sun exposure make early morning starts essential in July and August.",
    body3:
      "Not suitable for severe mobility limitations, heart conditions or young children on a hot day. Combine with Old Town walking the same half-day — fortress first while legs are fresh, then coffee on Arms Square below.",
    distance: "400 m walk to Sea Gate, then steps from Old Town",
    travel: "5–10 min walk to trailhead inside walls",
    timeNeeded: "Allow 1.5–2.5 hours for the climb and descent",
    highlights: ["Church of Our Lady of Remedy midway", "San Giovanni ramparts panorama", "Bay of Kotor fjord views", "Old Town roofscape from above"],
    tips: ["Start before 09:00 in peak season", "Bring at least 1 litre of water per person", "Wear trainers with grip — not sandals"],
    faqs: [
      ["Can I climb the fortress on a short port call?", "Tight on calls under 6 usable hours — allow 2+ hours for climb plus Old Town. See our should-I-climb comparison."],
      ["Is the fortress included on shore excursions?", "Many walking and highlights tours include tickets and paced ascent — worth it when unsure of fitness."],
    ],
    related: ["kotor-old-town-guide", "one-day-in-kotor", "should-i-climb-the-fortress"],
    excursion: "fortress-climb-tour",
  },
  {
    slug: "our-lady-of-the-rocks-guide",
    name: "Our Lady of the Rocks",
    title: "Our Lady of the Rocks Guide from Kotor Cruise Port",
    seoTitle: "Our Lady of the Rocks from Kotor Cruise Port — Island Church & Boat Trip",
    meta: "Visit Our Lady of the Rocks (Gospa od Škrpjela) from Kotor cruise port — boat from Perast, baroque church, island legend and cruise-timed planning.",
    tagline: "An artificial island built by fishermen — baroque church rising from the Bay of Kotor.",
    overview:
      "Our Lady of the Rocks is a man-made islet off Perast with a baroque church and museum — one of Montenegro's most iconic images. Cruise passengers typically reach it by boat from Perast on a combined Perast and bay excursion.",
    body2:
      "The legend tells of sailors who found an icon on a rock and pledged to build a church on every safe return. The island grew over centuries with stones and sunken ships. Interior frescoes and a votive tapestry embroidered by a local woman over 25 years are highlights.",
    body3:
      "Allow 20–30 minutes on the island plus a 5-minute boat crossing each way from Perast. Most shore excursions sequence Perast waterfront, island visit and optional swim stop — not realistic to combine with fortress climb on standard calls.",
    distance: "Perast 20 km / 30–40 min drive from Kotor port",
    travel: "30–40 min coach or minivan to Perast, then 5 min boat",
    timeNeeded: "Allow 3–4 hours including Perast and transfers",
    highlights: ["Baroque church interior and altar", "Votive tapestry museum", "Perast bell towers from the water", "Bay of Kotor boat approach"],
    tips: ["Book a combined Perast and island tour for simplest timing", "Modest dress required inside the church", "Boats pause briefly — have camera ready"],
    faqs: [
      ["Can I visit Our Lady of the Rocks independently?", "Reach Perast by taxi (€25–35 each way) then buy boat tickets at the pier — excursions handle sequencing more reliably."],
      ["Our Lady of the Rocks or Blue Cave?", "Island church for history and scenery; Blue Cave for swimming and geology. See our comparison guide."],
    ],
    related: ["perast-guide", "blue-cave-guide", "kotor-perast-our-lady-of-the-rocks"],
    excursion: "kotor-perast-our-lady-of-the-rocks",
  },
  {
    slug: "perast-guide",
    name: "Perast",
    title: "Perast Guide from Kotor Cruise Port",
    seoTitle: "Perast from Kotor Cruise Port — Baroque Bay Town & Boat Trips",
    meta: "Visit Perast from Kotor cruise port — UNESCO baroque waterfront, bell towers, boat to Our Lady of the Rocks and realistic port-day timing.",
    tagline: "Sixteen baroque palaces and two islands — the Bay of Kotor's most elegant village.",
    overview:
      "Perast is a tiny baroque town on the bay 20 km from Kotor — sixteen churches and palaces along a single waterfront promenade facing two islets. Cruise passengers visit on bay cruises, coach excursions or private tours.",
    body2:
      "Stroll the waterfront from St Nicholas Church to the maritime museum in 45–60 minutes. Boat departures to Our Lady of the Rocks run frequently in season — combine both on a half-day excursion. Perast has excellent seafood restaurants but sit-down lunch eats into fortress or Old Town time on standard calls.",
    body3:
      "The Kotor–Perast road is scenic but narrow — coach excursions beat self-driving. Morning departures from the port beat afternoon bay traffic when multiple ships share the day.",
    distance: "20 km / 30–40 min from Port of Kotor",
    travel: "30–40 minutes by road each way",
    timeNeeded: "Allow 2–3 hours including waterfront walk and island boat",
    highlights: ["St Nicholas Church bell tower views", "Baroque palaces along the waterfront", "Boat to Our Lady of the Rocks", "Maritime museum and Bujović Palace"],
    tips: ["Climb St Nicholas tower if time allows — best Perast panorama", "Book boat tickets through your excursion for coordinated return", "Perast suits photography lovers and relaxed pacing"],
    faqs: [
      ["Perast on a first visit to Kotor?", "Excellent as a half-day anchor — pairs with Old Town morning or afternoon on 8+ hour calls."],
      ["Can I do Perast and fortress same day?", "Tight — choose one as your main excursion anchor unless your call exceeds 9 usable hours."],
    ],
    related: ["our-lady-of-the-rocks-guide", "blue-cave-vs-perast", "perast-bay-cruise"],
    excursion: "perast-bay-cruise",
  },
  {
    slug: "blue-cave-guide",
    name: "Blue Cave",
    title: "Blue Cave Boat Trip Guide from Kotor Cruise Port",
    seoTitle: "Blue Cave (Plava Špilja) from Kotor Cruise Port — Boat Trip Guide",
    meta: "Visit the Blue Cave near Herceg Novi from Kotor cruise port — boat trips, swimming, timing and what to expect on a Montenegro port day.",
    tagline: "Luminous blue water inside a coastal cavern — Montenegro's most photogenic swim stop.",
    overview:
      "The Blue Cave (Plava špilja) on Luštica peninsula near Herceg Novi glows with ethereal blue light when sunlight refracts through an underwater opening. Cruise passengers reach it on dedicated speedboat excursions from Kotor or Tivat.",
    body2:
      "Boat trips take 45–60 minutes each way from Kotor harbour depending on sea state, plus 15–20 minutes inside the cave. Swimmers enter the water from the boat — life jackets provided. Weather and sea conditions can cancel or shorten trips without notice.",
    body3:
      "Blue Cave excursions are half-day water adventures — do not combine with fortress climb and Perast on standard 8-hour calls. Best for passengers who have walked Old Town before or prefer Adriatic water over mountain steps.",
    distance: "Boat departure from Kotor or short transfer to marina",
    travel: "45–90 min on water depending on route and conditions",
    timeNeeded: "Allow 3–4 hours total for standard boat trips",
    highlights: ["Blue light phenomenon inside the cave", "Swimming in crystal-clear Adriatic water", "Coastal scenery along Luštica peninsula", "Speedboat thrill through the bay"],
    tips: ["Bring swimwear, towel and dry bag for electronics", "Sea conditions matter — flexible attitude helps", "Waterproof phone case for cave photos"],
    faqs: [
      ["Is the Blue Cave worth it on a first Kotor visit?", "After Old Town — or instead of Perast if you prioritise swimming over baroque heritage."],
      ["Blue Cave or Our Lady of the Rocks?", "Different experiences — see our blue-cave-vs-perast comparison."],
    ],
    related: ["blue-cave-vs-perast", "perast-guide", "best-things-to-do-cruise-ship"],
    excursion: "blue-cave-boat-trip",
  },
  {
    slug: "lovcen-national-park-guide",
    name: "Lovćen National Park",
    title: "Lovćen National Park Guide from Kotor Cruise Port",
    seoTitle: "Lovćen National Park from Kotor Cruise Port — Njegoš Mausoleum & Views",
    meta: "Visit Lovćen National Park from Kotor cruise port — Njegoš Mausoleum, serpentine road, bay panoramas and realistic cruise-timed planning.",
    tagline: "Switchback road and mountain mausoleum — all of Montenegro visible from Lovćen.",
    overview:
      "Lovćen National Park rises above Kotor via the famous Kotor Serpentine — 25 hairpin bends climbing to the Njegoš Mausoleum at 1,657 metres. On clear days the view spans the entire Bay of Kotor, Lake Skadar and Albania.",
    body2:
      "The drive from Kotor port takes 45–60 minutes each way on winding mountain roads. Allow 45–60 minutes at the mausoleum — 461 steps to the summit viewpoint (or lift available). Cooler temperatures than sea level make this a refreshing summer escape.",
    body3:
      "Lovćen is a full half-day or longer — not combinable with Perast, Blue Cave and fortress on one standard call. Choose Lovćen when mountain scenery and Njegoš heritage matter more than Old Town depth.",
    distance: "25 km / 45–60 min drive from Kotor port",
    travel: "45–60 minutes each way via Kotor Serpentine",
    timeNeeded: "Allow 4–5 hours including drive and mausoleum",
    highlights: ["Njegoš Mausoleum granite chapel", "360-degree Montenegro panorama", "Kotor Serpentine hairpin photography", "Cool mountain air above the bay"],
    tips: ["Clear weather essential — clouds obscure the view", "Motion sickness sufferers should medicate before the serpentine", "Warm layer — summit is breezy even in August"],
    faqs: [
      ["Lovćen on a standard port day?", "Yes on 8+ hour calls as your single anchor excursion — not alongside Perast and fortress."],
      ["Is Lovćen suitable for limited mobility?", "Mausoleum has a lift option; serpentine drive still involves mountain road. Private tours offer best pacing."],
    ],
    related: ["one-day-in-kotor", "kotor-highlights", "best-things-to-do-cruise-ship"],
    excursion: "lovcen-national-park",
  },
  {
    slug: "one-day-in-kotor",
    name: "One Day in Kotor",
    title: "One Day in Kotor from a Cruise Ship",
    seoTitle: "One Day in Kotor — Cruise Ship Itinerary & Hour-by-Hour Plan",
    meta: "How to spend one day in Kotor on a cruise — Old Town, fortress, Perast and bay trips with realistic hour-by-hour timing from the port.",
    tagline: "Gangway to all-aboard — the perfect Kotor port day sequenced hour by hour.",
    overview:
      "One day in Kotor from a cruise ship typically delivers 7–9 usable hours ashore. The classic dilemma: stay in the UNESCO Old Town and fortress, or escape to Perast and Our Lady of the Rocks on the bay.",
    body2:
      "Standard 8-hour plan: disembark 08:00, Old Town walk 08:30–10:30, fortress climb 10:30–12:30, lunch on Arms Square 12:30–13:30, free time or Maritime Museum 13:30–15:00, return to ship 15:30 with buffer before 17:00 all-aboard.",
    body3:
      "Alternative bay plan: morning Perast and island excursion 08:30–12:30, Old Town stroll 13:00–15:00, early return. Do not attempt fortress, Perast and Lovćen on one standard call — pick one anchor beyond Old Town.",
    distance: "All itineraries start at Port of Kotor",
    travel: "Walking, taxi or excursion coach depending on plan",
    timeNeeded: "Full port day — 7–9 usable hours typical",
    highlights: ["Morning Old Town before crowds", "Fortress OR Perast as afternoon anchor", "60–90 minute return buffer"],
    tips: ["Check how many ships share your port day", "Book excursions before sailing in peak season", "Use our cruise planner for a personalised sequence"],
    faqs: [
      ["Old Town and fortress in one day?", "Yes — the standard Kotor combination on 7+ hour calls."],
      ["Old Town, fortress and Perast?", "Only on 10+ hour calls with strict time discipline or a highlights tour."],
    ],
    related: ["kotor-old-town-guide", "kotor-fortress-guide", "perast-guide"],
    excursion: "kotor-highlights",
  },
  {
    slug: "best-things-to-do-cruise-ship",
    name: "Best Things to Do in Kotor",
    title: "Best Things to Do in Kotor on a Cruise Ship",
    seoTitle: "Best Things to Do in Kotor from a Cruise Ship — Ranked for Port Days",
    meta: "The best things to do in Kotor on a cruise ship — Old Town, fortress, Perast, Blue Cave and Lovćen ranked for different call lengths.",
    tagline: "Every Kotor highlight ranked for cruise passengers — matched to your hours ashore.",
    overview:
      "Kotor rewards almost every type of cruiser: history lovers in the Old Town, active travellers on the fortress steps, romantics on Perast boat trips and adventurers in the Blue Cave. Your call length determines how many you can fit.",
    body2:
      "Tier 1 (any call): Old Town walk from the Sea Gate — free, walkable, essential. Tier 2 (6+ hours): fortress climb or guided walking tour. Tier 3 (7+ hours): Perast and Our Lady of the Rocks. Tier 4 (8+ hours): Lovćen or Blue Cave as dedicated half-day trips.",
    body3:
      "Food and wine tours, private yachts and family-paced routes fill gaps for repeat visitors or special interests. See our first-timer comparison for excursion picks matched to experience level.",
    distance: "Varies by activity — Old Town 5–10 min walk",
    travel: "Walking for Old Town; excursions for bay and mountain",
    timeNeeded: "2 hours (Old Town) to 5 hours (Lovćen)",
    highlights: ["Old Town UNESCO core", "San Giovanni Fortress views", "Perast and Our Lady of the Rocks", "Blue Cave swim adventure"],
    tips: ["Match ambition to your all-aboard time", "Book bay trips when weather forecast is calm", "Morning fortress beats afternoon heat"],
    faqs: [
      ["Top pick for first-timers?", "Kotor, Perast and Our Lady of the Rocks — our Editor's Choice excursion."],
      ["Best free activity?", "Walking Old Town and the harbour ramparts near the Sea Gate."],
    ],
    related: ["one-day-in-kotor", "kotor-for-first-time-visitors", "best-excursion-first-time-visitors"],
    excursion: "kotor-highlights",
  },
  {
    slug: "is-kotor-walkable",
    name: "Kotor Walkability",
    title: "Is Kotor Walkable from the Cruise Port?",
    seoTitle: "Is Kotor Walkable from the Cruise Port? — Distances & Practical Guide",
    meta: "Is Kotor walkable from the cruise port? Sea Gate distances, Old Town cobbles, fortress steps and when you need a taxi or tour.",
    tagline: "Yes — Kotor is one of the Mediterranean's most walkable cruise ports.",
    overview:
      "Kotor is exceptionally walkable from the cruise port. The Sea Gate and Old Town core sit 400 metres along a flat harbour promenade — no bus or taxi required for the essential experience.",
    body2:
      "Inside the walls, expect cobbles and occasional steps but compact distances — Arms Square to St Tryphon is two minutes. The fortress trail is a strenuous walk (1,350 steps) not a stroll. Perast, Lovćen and Blue Cave require road or boat transfers.",
    body3:
      "Taxis from the port to Sea Gate cost €3–6 and suit heat, rain or mobility needs. For bay and mountain sights, walking is not practical — book excursions or taxis with agreed return times.",
    distance: "Old Town 400 m; Perast 20 km; Lovćen 25 km",
    travel: "5–10 min walk to Old Town; drives for out-of-town sights",
    timeNeeded: "Old Town 2–4 hours on foot",
    highlights: ["Flat port-to-Sea Gate promenade", "Compact Old Town lanes", "Fortress trail — active walk not casual"],
    tips: ["Walking beats taxi for Old Town in normal weather", "Wear grippy shoes on wet limestone", "Pre-book taxi for return if climbing fortress in heat"],
    faqs: [
      ["Can I walk everywhere in Kotor?", "Old Town yes — Perast, Lovćen and Blue Cave need transport."],
      ["Is Kotor walkable with a stroller?", "Old Town cobbles are challenging — carrier or sturdy stroller with lockable wheels."],
    ],
    related: ["kotor-old-town-guide", "independent-kotor-guide", "kotor-cruise-port-guide"],
    excursion: "old-town-walking-tour",
  },
  {
    slug: "what-to-wear-montenegro",
    name: "What to Wear in Montenegro",
    title: "What to Wear in Montenegro on a Cruise Port Day",
    seoTitle: "What to Wear in Montenegro — Kotor Cruise Passenger Packing Guide",
    meta: "What to wear in Montenegro on a Kotor cruise port day — fortress climb shoes, church modesty, swim trips and mountain layers.",
    tagline: "Grip, modesty and layers — Montenegro packs coast, mountain and church in one port day.",
    overview:
      "Montenegro cruise port days can span fortress climbs, baroque churches, speedboat caves and mountain mausoleums. Packing smart means grippy shoes, modest church layers and swim gear if your plan includes the bay.",
    body2:
      "Fortress climb: trainers with grip, hat, sunscreen, 1 litre water minimum. Churches (St Tryphon, Our Lady of the Rocks): shoulders and knees covered — carry a light scarf. Blue Cave trips: swimwear under clothes, dry bag, non-slip deck shoes.",
    body3:
      "Lovćen and mountain excursions need a warm layer — 10°C cooler than sea level is common. Old Town evenings can be breezy on the water. Euro cash for small vendors; cards work in most restaurants.",
    distance: "N/A — packing guide",
    travel: "N/A",
    timeNeeded: "N/A",
    highlights: ["Grippy shoes for fortress and cobbles", "Modest layer for churches", "Swim gear for cave and bay trips"],
    tips: ["Avoid white trousers on wet limestone", "Pack a foldable rain jacket in shoulder season", "Sunglasses essential on water and fortress"],
    faqs: [
      ["Sandals for the fortress?", "Not recommended — polished steps are steep and slippery when dry or wet."],
      ["Dress code for Our Lady of the Rocks?", "Shoulders and knees covered inside the church — scarves often available at entrance."],
    ],
    related: ["kotor-fortress-guide", "blue-cave-guide", "our-lady-of-the-rocks-guide"],
    excursion: "kotor-highlights",
  },
  {
    slug: "best-restaurants-kotor-old-town",
    name: "Kotor Old Town Restaurants",
    title: "Best Restaurants in Kotor Old Town",
    seoTitle: "Best Restaurants in Kotor Old Town — Cruise Passenger Guide",
    meta: "Best restaurants in Kotor Old Town for cruise passengers — seafood, Njeguški pršut, timing tips and where to eat on a short port day.",
    tagline: "Fresh Adriatic seafood and mountain ham — where to eat inside the walls.",
    overview:
      "Kotor Old Town restaurants cluster around Arms Square and side lanes toward the River Gate. Cruise passengers with limited time should prioritise lunch near the Sea Gate for easy return to the ship.",
    body2:
      "Standout dishes: black risotto, grilled branzino, Njeguški pršut (smoked ham from Lovćen villages), local cheeses and Vranac red wine. Konoba-style taverns offer better value than waterfront tables on Arms Square — worth the extra two-minute walk.",
    body3:
      "Allow 60–90 minutes for sit-down lunch on a port day. Food and wine tours handle reservations and pacing — ideal when you also want fortress or Perast the same day without queueing for tables.",
    distance: "Inside Old Town — 5–10 min walk from port",
    travel: "On foot within walls",
    timeNeeded: "60–90 minutes for lunch",
    highlights: ["Adriatic seafood and black risotto", "Njeguški pršut and local cheese plates", "Arms Square people-watching cafés", "Konoba side-street atmosphere"],
    tips: ["Reserve in peak season if touring Old Town midday", "Ask about catch-of-the-day pricing", "Espresso on the square is fast; lunch is not"],
    faqs: [
      ["Best area for a quick lunch?", "Side lanes off Arms Square — faster service than prime waterfront tables."],
      ["Food tour or independent lunch?", "Food tours suit wine lovers and tight schedules; independent works if Old Town is your only anchor."],
    ],
    related: ["kotor-old-town-guide", "food-wine-tour", "one-day-in-kotor"],
    excursion: "food-wine-tour",
  },
  {
    slug: "kotor-cruise-tips",
    name: "Kotor Cruise Tips",
    title: "Kotor Cruise Tips — Practical Advice for Port Day",
    seoTitle: "Kotor Cruise Tips — Port Day Advice for First-Time Visitors",
    meta: "Essential Kotor cruise tips — tendering, crowds, currency, fortress timing, bay trips and return-to-ship buffers for cruise passengers.",
    tagline: "Be on deck for arrival, start early, keep your buffer — Kotor done right.",
    overview:
      "Kotor is a highlight of Adriatic cruising — but port days go wrong when passengers underestimate fortress time, miss tender changes or cut return buffers too fine. These tips come from real cruise-timed planning.",
    body2:
      "Arrival: be on an upper deck 30–60 minutes before docking — the Bay of Kotor sail-in rivals Norwegian fjords. Ashore: start Old Town or excursions early when two ships share the day. Currency: euro; carry small notes for taxis and church donations.",
    body3:
      "Tender ports: confirm on your cruise app the night before — tendering adds 20–30 minutes each way. All-aboard: be at the port 60–90 minutes early; fortress descents and Perast road traffic can delay you. Download offline maps — Wi-Fi at the terminal is patchy.",
    distance: "N/A — practical tips",
    travel: "N/A",
    timeNeeded: "N/A",
    highlights: ["Spectacular bay arrival — be on deck", "60–90 minute return buffer", "Euro cash for taxis and tips"],
    tips: ["Check tender vs docked on your app nightly", "Buy fortress tickets early in the day", "Book bay excursions when seas are forecast calm"],
    faqs: [
      ["How early should I return to the ship?", "60–90 minutes before all-aboard — more if tendering or coming from Perast."],
      ["Is Kotor safe for cruise passengers?", "Yes — Old Town is compact and well policed. Watch belongings in crowded squares."],
    ],
    related: ["kotor-cruise-port-guide", "one-day-in-kotor", "is-kotor-walkable"],
    excursion: "short-port-call-kotor",
  },
  {
    slug: "kotor-cruise-port-guide",
    name: "Port of Kotor",
    title: "Kotor Cruise Port Guide",
    seoTitle: "Kotor Cruise Port Guide — Terminal, Walking Routes & Tender Tips",
    meta: "Complete Kotor cruise port guide — where ships dock, walking to Old Town, tender operations, taxis and return-to-ship timing.",
    tagline: "Dock or tender at the foot of the walls — Europe's most dramatic cruise arrival.",
    overview:
      "The Port of Kotor sits at the southeastern corner of the Bay of Kotor, directly below the Old Town walls. Most ships dock at the main berth; occasional tendering applies when multiple large vessels share the bay.",
    body2:
      "From the gangway, walk the harbour promenade clockwise to the Sea Gate — 5–10 minutes on foot. Taxi ranks sit outside the terminal building for Perast, Lovćen and fortress drop-offs if you prefer not to walk. Excursion coaches meet at the terminal exit with line flags.",
    body3:
      "Facilities include toilets, a small tourist information desk and souvenir stalls. ATMs are available but can run empty on busy days — withdraw euros on the ship. Montenegrin is the official language; English is widely spoken in tourist areas.",
    distance: "Old Town Sea Gate 400 m from main berth",
    travel: "5–10 min walk; 2–3 min taxi",
    timeNeeded: "N/A — port logistics",
    highlights: ["Walkable Sea Gate access", "Taxi rank at terminal exit", "Bay of Kotor sail-in spectacle"],
    tips: ["Confirm docked vs tender each evening", "Meet excursions at terminal exit, not on the ship", "Harbour walk is flat and scenic in all weather"],
    faqs: [
      ["Where do cruise ships dock in Kotor?", "At the Port of Kotor commercial berth, 400 metres from the Sea Gate."],
      ["Do ships tender in Kotor?", "Occasionally when berths are full — adds 20–30 minutes each way. Check your cruise app."],
    ],
    related: ["is-kotor-walkable", "kotor-cruise-tips", "kotor-old-town-guide"],
    excursion: "old-town-walking-tour",
  },
  {
    slug: "bay-of-kotor-guide",
    name: "Bay of Kotor",
    title: "Bay of Kotor Cruise Guide",
    seoTitle: "Bay of Kotor — Boka Kotorska Guide for Cruise Passengers",
    meta: "Explore the Bay of Kotor (Boka Kotorska) on a cruise port day — Perast, Risan, Herceg Novi and boat trips from Kotor.",
    tagline: "Europe's southernmost fjord — baroque towns and navy-blue water in every direction.",
    overview:
      "The Bay of Kotor (Boka Kotorska) is a submerged river canyon — a winding inlet framed by mountains with medieval towns at every bend. Your ship sails the full length on arrival and departure; ashore, bay cruises reach Perast, Risan mosaics and Blue Cave.",
    body2:
      "Key stops: Perast and Our Lady of the Rocks (baroque heritage), Risan Roman mosaics (quieter alternative), Herceg Novi gateway (Blue Cave departures), Tivat Porto Montenegro (yacht spotting). Most cruise excursions focus on Perast and the inner bay.",
    body3:
      "Bay boat trips suit passengers who want water perspectives of the walls and mountains without the fortress climb. Morning departures beat afternoon chop when sea breezes pick up.",
    distance: "Bay surrounds Kotor — Perast 20 km by road",
    travel: "Boat or coastal road depending on excursion",
    timeNeeded: "Half-day for Perast loop; full day for extended bay cruise",
    highlights: ["Sail-in through the bay mouths", "Perast twin bell towers from water", "Mountain reflections on calm mornings", "Speedboat to Blue Cave from outer bay"],
    tips: ["Calm mornings best for small boats", "Bring layers — bay breezes pick up afternoon", "Wide-angle lens for mountain-and-water shots"],
    faqs: [
      ["Do I need a tour to see the bay?", "The sail-in is free and spectacular; Perast and caves need boat or road transfer."],
      ["Bay cruise or fortress?", "Bay for relaxed scenery; fortress for active views over Old Town. See comparisons."],
    ],
    related: ["perast-guide", "our-lady-of-the-rocks-guide", "blue-cave-guide"],
    excursion: "perast-bay-cruise",
  },
  {
    slug: "st-tryphon-cathedral-guide",
    name: "St Tryphon Cathedral",
    title: "St Tryphon Cathedral Guide — Kotor Old Town",
    seoTitle: "St Tryphon Cathedral Kotor — Romanesque Jewel from Cruise Port",
    meta: "Visit St Tryphon Cathedral in Kotor Old Town — Romanesque architecture, saints' relics and timing tips for cruise passengers.",
    tagline: "Romanesque twin towers — Kotor's patron saint since the 12th century.",
    overview:
      "St Tryphon Cathedral dominates Kotor's main square — a Romanesque church rebuilt after earthquakes, housing the relics of Saint Tryphon. It is the essential cultural stop on any Old Town walk from the cruise port.",
    body2:
      "Interior highlights include carved stone columns, a painted crucifix from the 14th century and silver reliquaries. The small admission fee supports restoration — allow 20–30 minutes inside. Twin towers are asymmetric after repeated earthquake repairs — a detail guides love to explain.",
    body3:
      "Combine with Arms Square coffee and the fortress trailhead behind the cathedral. Modest dress required — shoulders covered. Mass times can restrict tourist access briefly; mornings before 11:00 suit cruise schedules.",
    distance: "Inside Old Town — 5–10 min walk from port",
    travel: "On foot from Sea Gate",
    timeNeeded: "20–30 minutes inside",
    highlights: ["Romanesque interior columns and frescoes", "Saint Tryphon relics", "Asymmetric twin towers", "Square setting in Old Town heart"],
    tips: ["Carry a scarf for modesty", "Small euro note for admission", "Photography usually allowed without flash"],
    faqs: [
      ["Is St Tryphon worth it on a short call?", "Yes — 20 minutes well spent and central to any Old Town route."],
      ["Cathedral before or after fortress?", "Before — the trail starts behind the cathedral; tickets sold at the fortress entrance."],
    ],
    related: ["kotor-old-town-guide", "kotor-fortress-guide", "best-restaurants-kotor-old-town"],
    excursion: "old-town-walking-tour",
  },
  {
    slug: "montenegro-food-wine-guide",
    name: "Montenegrin Food & Wine",
    title: "Montenegrin Food & Wine Guide — Kotor Cruise Port",
    seoTitle: "Montenegrin Food & Wine — Kotor Cruise Port Tasting Guide",
    meta: "Montenegrin food and wine on a Kotor cruise port day — Njeguški pršut, Vranac wine, seafood and food tour options.",
    tagline: "Mountain ham, lake carp and Adriatic fish — Montenegro's compact culinary map.",
    overview:
      "Montenegrin cuisine blends Adriatic seafood, mountain smoked meats and Ottoman-influenced pastries — remarkable variety for a country of 600,000 people. Kotor Old Town restaurants and food tours showcase the best on a port day.",
    body2:
      "Must-try: Njeguški pršut (air-dried ham from Lovćen villages), Kotor-style fish soup, grilled orada, cicvara (cornmeal and cheese), and Vranac or Krstač wines from Plantaze vineyards near Lake Skadar.",
    body3:
      "Food and wine tours visit cellars or konobas outside the walls when time allows — otherwise a focused Old Town tasting lunch fits between fortress and ship. Share dietary needs when booking.",
    distance: "Old Town tastings on foot; wineries 30–60 min drive",
    travel: "Walking or excursion transport",
    timeNeeded: "90 minutes for lunch; 3–4 hours for food tours",
    highlights: ["Njeguški pršut and cheese boards", "Vranac red wine tastings", "Adriatic seafood risotto and grill", "Kotor fish soup"],
    tips: ["Book food tours ahead in peak season", "Vranac pairs well with grilled lamb", "Pace wine if climbing fortress same day"],
    faqs: [
      ["Food tour on a 6-hour call?", "Tight — choose a quick konoba lunch instead of a full tasting route."],
      ["Vegetarian options?", "Cheese, grilled vegetables and pastries — inform guides for best routing."],
    ],
    related: ["best-restaurants-kotor-old-town", "food-wine-tour", "lovcen-national-park-guide"],
    excursion: "food-wine-tour",
  },
  {
    slug: "kotor-maritime-museum-guide",
    name: "Kotor Maritime Museum",
    title: "Kotor Maritime Museum Guide from Cruise Port",
    seoTitle: "Kotor Maritime Museum — Boka Navy Heritage from Cruise Port",
    meta: "Visit the Kotor Maritime Museum in the Old Town — Boka Navy history, ship models and fitting it into your cruise port day.",
    tagline: "Three centuries of Boka Navy pride — ship models in a baroque palace.",
    overview:
      "The Maritime Museum occupies the Grgurina Palace on Arms Square — tracing Kotor's naval heritage from merchant republic to modern yachting. A rewarding 45-minute stop for history lovers between cathedral and fortress.",
    body2:
      "Exhibits include model ships, naval uniforms, portraits of Boka captains and weapons from the region's defensive past. English captions throughout. Air-conditioned — a welcome break in summer heat.",
    body3:
      "Pairs with St Tryphon and a shorter fortress ascent if you skip the summit. Less essential on calls under 6 hours when Old Town and fortress compete for time.",
    distance: "Arms Square — 5–10 min walk from port",
    travel: "On foot inside Old Town",
    timeNeeded: "45–60 minutes",
    highlights: ["Boka Navy ship models", "Grgurina Palace baroque interior", "Naval portraits and maps", "Cool break from summer heat"],
    tips: ["Buy combined tickets if offered with other museums", "Quietest before 11:00", "Good rainy-day anchor inside walls"],
    faqs: [
      ["Maritime Museum or fortress?", "Fortress for views; museum for naval history — choose one on short calls."],
      ["Is it air-conditioned?", "Yes — one of the best cooled stops in Old Town."],
    ],
    related: ["kotor-old-town-guide", "perast-guide", "kotor-for-first-time-visitors"],
    excursion: "old-town-walking-tour",
  },
  {
    slug: "kotor-cats-guide",
    name: "Cats of Kotor",
    title: "Cats of Kotor — The Famous Feline Old Town",
    seoTitle: "Cats of Kotor — Guide for Cruise Passengers",
    meta: "Kotor's famous cats — where to find them in the Old Town, the Cat Museum and photo tips for cruise passengers.",
    tagline: "Kotor has more cats than cars inside the walls — a living tradition.",
    overview:
      "Kotor is known as the City of Cats — felines lounge on limestone steps, shop doorways and fortress trails. Sailors once left cats to control rodents; today they are cherished mascots with a dedicated museum and souvenir industry.",
    body2:
      "The Cat Museum near St Tryphon displays feline art and maritime cat history — quirky 15-minute stop. Cats gather near Arms Square cafés and the Sea Gate — respectful photos welcome; avoid feeding unfamiliar animals.",
    body3:
      "Cat lovers still need a sightseeing anchor — combine the museum with Old Town walk and optional fortress. Merchandise supports local cat welfare charities in some shops.",
    distance: "Throughout Old Town",
    travel: "On foot",
    timeNeeded: "15 min museum; cats encountered throughout your walk",
    highlights: ["Cat Museum oddities", "Sea Gate lounging cats", "Fortress trail feline companions", "Cat-themed souvenirs"],
    tips: ["Ask before petting — most are friendly but independent", "Small change for Cat Museum admission", "Instagram gold on Arms Square steps"],
    faqs: [
      ["Is there really a Cat Museum?", "Yes — small, charming, near the cathedral."],
      ["Cats on the fortress trail?", "Often — they navigate the steps better than humans."],
    ],
    related: ["kotor-old-town-guide", "kotor-for-families", "best-things-to-do-cruise-ship"],
    excursion: "family-kotor",
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
    slug: "kotor-for-first-time-visitors",
    title: "Kotor for First-Time Visitors",
    seoTitle: "Kotor for First-Time Cruise Visitors — What to See on a Port Day",
    meta: "First time in Kotor on a cruise? Choose between Old Town, fortress and bay excursions with realistic port timing from the cruise terminal.",
    tagline: "One port day inside the walls — where first-timers should start.",
    overview:
      "First-time Kotor callers face a happy problem: the Old Town is walkable from the ship, but the fortress, Perast and Blue Cave all compete for hours. Your call length and fitness pick the right anchor.",
    body1:
      "Standard 8–10 hour calls suit Old Town plus fortress, or our Editor's Choice Perast and Our Lady of the Rocks excursion. Short calls under 6 usable hours: focus on Old Town on foot — still extraordinary without the climb.",
    body2:
      "First-timers should book bay excursions or fortress tours before sailing in July and August. Multi-ship days fill the fortress trail and Perast boats by mid-morning.",
    body3:
      "Do not attempt fortress, Perast and Lovćen independently on one standard call — pick one anchor beyond Old Town and keep a 60–90 minute return buffer to the port.",
    highlights: ["Perast excursion for standard calls", "Old Town + fortress for active days", "Book early in peak season"],
    tips: ["Be on deck for the bay sail-in", "Keep 60–90 minute return buffer", "Read blue-cave-vs-perast if torn between water trips"],
    faqs: [
      ["Fortress or Perast for first-timers?", "Fortress for iconic views over Old Town; Perast for baroque bay scenery and island church. Editor's Choice combines Perast highlights."],
      ["Can first-timers go independent?", "Yes for Old Town — fortress and bay trips benefit from guided timing."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Kotor, Perast & Our Lady of the Rocks", desc: "Bay scenery, island church and UNESCO town sequenced with expert timing.", href: "/shore-excursions/kotor-perast-our-lady-of-the-rocks" },
      { cat: "best-short-port", title: "Old Town Walking Tour", desc: "Essential Sea Gate route when hours are tight.", href: "/shore-excursions/old-town-walking-tour" },
      { cat: "best-value", title: "Best excursions ranked", desc: "Our first-timer comparison guide.", href: "/compare/best-excursion-first-time-visitors" },
    ],
    related: ["independent-kotor-guide", "blue-cave-vs-perast", "one-day-in-kotor"],
    imageKey: "city",
  },
  {
    slug: "kotor-for-families",
    title: "Kotor for Families on a Cruise",
    seoTitle: "Family-Friendly Kotor Shore Excursions from Cruise Port",
    meta: "Kotor with kids from a cruise ship — paced Old Town walks, bay boat trips, cats and family tours with reliable return timing from the port.",
    tagline: "Cats, boat rides and short walks — family Kotor without meltdowns.",
    overview:
      "Families need realistic pacing, toilet breaks and shade — not a 1,350-step fortress march in full sun with toddlers. Kotor delivers with cat spotting, gentle Old Town lanes and bay boat trips with swimming.",
    body1:
      "The fortress involves steep steps and minimal shade — challenging for under-eights. Family tours use shorter Old Town routes, cat museum stops and Perast boat trips instead of full summit ascents.",
    body2:
      "Perast boat rides suit school-age children — short crossing, island church and waterfront ice cream. Toddlers do better with Old Town stroller walks (cobbles permitting) and harbour promenade rather than mountain drives.",
    body3:
      "Private vehicles at each stop help naps and toilet timing versus uncertain buses. Share children's ages when booking — group family tours suit school-age kids; private tours adapt for mixed ages.",
    highlights: ["Cat Museum and Old Town cats", "Perast boat ride without long climbs", "Harbour promenade flat walking"],
    tips: ["Pack snacks, sun hats and water", "Avoid full fortress circuit with toddlers", "Book private for groups of four plus"],
    faqs: [
      ["Is Kotor good for kids on a cruise?", "Yes — compact Old Town, boat trips and cats beat long mountain transfers for most ages."],
      ["Fortress with young children?", "Long and hot for under-fives — choose family-kotor or Perast boat instead."],
    ],
    recommendations: [
      { cat: "best-families", title: "Family Kotor Excursion", desc: "Paced routing with bay boat or Old Town focus.", href: "/shore-excursions/family-kotor" },
      { cat: "best-coastal", title: "Perast Bay Cruise", desc: "Boat, island church and waterfront stroll.", href: "/shore-excursions/perast-bay-cruise" },
      { cat: "best-luxury", title: "Private Kotor Tour", desc: "Custom stops and vehicle at each site.", href: "/shore-excursions/private-kotor-tour" },
    ],
    related: ["kotor-for-first-time-visitors", "kotor-cats-guide", "family-kotor"],
    imageKey: "family",
  },
  {
    slug: "independent-kotor-guide",
    title: "Independent Kotor Guide — DIY from the Cruise Port",
    seoTitle: "Independent Kotor Guide — Walking Route, Restaurants & Timings",
    meta: "Explore Kotor independently from the cruise port — walking route, Old Town, fortress, restaurants, taxis, souvenirs and return-to-ship advice.",
    tagline: "Sea Gate to fortress trail — the complete DIY Kotor port day.",
    overview:
      "Kotor is one of the Mediterranean's best ports for independent exploration. The Old Town sits 400 metres from the gangway — no shuttle bus required. This guide gives you the walking route, timings, food stops and taxi prices to manage your own day confidently.",
    body1:
      "Walking route: leave terminal, follow harbour clockwise to Sea Gate (5–10 min). Enter walls, Arms Square, St Tryphon Cathedral, cat museum optional, fortress trail if fit. Return via same gate or River Gate loop. Allow 3–4 hours for Old Town and fortress; 2 hours for Old Town only.",
    body2:
      "Coffee: Arm's Square cafés charge premium for views — side lanes toward St Luke's Square are quieter and cheaper. Lunch: konoba in Dobrota side street (5 min outside Sea Gate) or Njeguški pršut plate in Old Town. Ice cream: multiple vendors on Arms Square.",
    body3:
      "Taxis: port to Sea Gate €3–6; port to Perast €25–35 each way — agree price or insist on meter. Return advice: be back at terminal 60–90 minutes before all-aboard; fortress descent and Perast traffic can add 30 minutes. Souvenirs: pršut, local wine, cat-themed gifts — compare prices outside Sea Gate stalls.",
    highlights: ["Flat 400 m port-to-Sea Gate walk", "Fortress tickets at trailhead behind cathedral", "Taxi €3–6 port to Old Town", "60–90 min return buffer essential"],
    tips: ["Withdraw euros on ship before busy ATM days", "Download offline Google Maps of Old Town lanes", "Pre-book return taxi if going to Perast independently"],
    faqs: [
      ["Can I visit Kotor without any excursion?", "Absolutely — Old Town and fortress are self-managed. Bay trips need boat tickets or taxis to Perast."],
      ["How much cash for a DIY day?", "€40–60 plus lunch covers taxis, fortress ticket (€8–10) and snacks."],
    ],
    recommendations: [
      { cat: "best-independent", title: "Can you visit without an excursion?", desc: "Honest comparison of DIY vs guided.", href: "/compare/can-you-visit-kotor-without-excursion" },
      { cat: "editors-choice", title: "Kotor Highlights", desc: "When you want fortress and bay handled.", href: "/shore-excursions/kotor-highlights" },
      { cat: "best-value", title: "DIY vs guided", desc: "Trade-offs for your call length.", href: "/compare/diy-vs-guided" },
    ],
    related: ["is-kotor-walkable", "diy-vs-guided", "kotor-cruise-tips"],
    imageKey: "old-town",
  },
  {
    slug: "kotor-for-history-lovers",
    title: "Kotor for History Lovers",
    seoTitle: "Kotor History Shore Excursions — Maritime Republic & Venetian Walls",
    meta: "History-focused Kotor from the cruise port — Venetian walls, maritime museum, St Tryphon and Boka Navy heritage for cruise passengers.",
    tagline: "From merchant republic to naval power — layered history in limestone.",
    overview:
      "Kotor's history spans Illyrian settlements, Venetian maritime rule, Napoleonic interludes and Yugoslav naval heritage. A port day can cover surprising depth when you prioritise museums and guided context over generic photo stops.",
    body1:
      "Old Town walking tours sequence St Tryphon Cathedral, Maritime Museum, Pima and Drago palaces with stories of the Boka Navy and Venetian trade. Fortress climbs add military engineering context above the ramparts.",
    body2:
      "Perast reveals baroque seafaring wealth — sixteen palaces for a town of 300 residents at its peak. Our Lady of the Rocks tells votive island legend tied to sailor safe returns.",
    body3:
      "Avoid generic photo-walks if history is your priority — choose old-town-walking-tour or fortress-climb-tour with a licensed historian guide rather than unstructured wandering.",
    highlights: ["Venetian walls and Sea Gate", "Maritime Museum Boka Navy", "St Tryphon Romanesque heritage", "Perast baroque seafaring town"],
    tips: ["Maritime Museum before midday heat", "Fortress for military perspective", "Perast museum for deeper naval context"],
    faqs: [
      ["Which sight on a short call?", "St Tryphon and Maritime Museum — fortress if you have 4+ extra hours."],
      ["Is Lovćen worth it for history?", "Njegoš mausoleum adds Petar II Njegoš context — allow half a day."],
    ],
    recommendations: [
      { cat: "best-historic", title: "Old Town Walking Tour", desc: "Venetian heritage, cathedral and palace context.", href: "/shore-excursions/old-town-walking-tour" },
      { cat: "editors-choice", title: "Kotor, Perast & Our Lady of the Rocks", desc: "Baroque bay history with island church.", href: "/shore-excursions/kotor-perast-our-lady-of-the-rocks" },
      { cat: "best-historic", title: "Fortress Climb Tour", desc: "Ramparts with historian guide.", href: "/shore-excursions/fortress-climb-tour" },
    ],
    related: ["kotor-maritime-museum-guide", "st-tryphon-cathedral-guide", "perast-guide"],
    imageKey: "history",
  },
  {
    slug: "independent-vs-cruise-line-excursions",
    title: "Independent vs Cruise Line Excursions in Kotor",
    seoTitle: "Independent vs Cruise Line Kotor Excursions — Which to Choose?",
    meta: "Ship tours vs independent Kotor shore excursions — return-to-ship guarantees, pricing and when DIY Old Town walks win at the port.",
    tagline: "Ship guarantee or smaller groups — how to choose at Kotor's walkable port.",
    overview:
      "Kotor rewards independent exploration — Old Town is 400 metres from the gangway. Ship excursions still matter for Perast boat timing, fortress pacing and Lovćen mountain roads on tight schedules.",
    body1:
      "Cruise line coaches carry 40–50 passengers with fixed pacing. Independent small-group tours (8–16) often include fortress tickets, earlier boat departures and 20–40% lower prices with more guide interaction.",
    body2:
      "Ship tours guarantee the vessel waits if their excursion runs late — not if you separate from the group. Reputable independents track all-aboard with 60–90 minute buffers but will not delay departure if you miss the meeting point.",
    body3:
      "DIY shines for Old Town: walk to Sea Gate (5–10 minutes), explore lanes, lunch on Arms Square, return 90 minutes before all-aboard. Do not DIY Perast on a tight call without agreed taxi return — road timing catches passengers out.",
    highlights: ["Old Town excellent for independent walks", "Bay trips benefit from guided boat timing", "Ship guarantee vs smaller groups trade-off"],
    tips: ["Read operator reviews for ship-tracking policy", "Buy fortress tickets at opening", "Keep ship excursion if anxious about Perast timing"],
    faqs: [
      ["Will the ship wait for independent tours?", "No — only ship-sponsored excursions carry the delay guarantee. Follow meeting times strictly."],
      ["Can I walk from the ship without any tour?", "Yes — 5–10 minutes to Old Town. Fortress and bay need tickets or transfers."],
    ],
    recommendations: [
      { cat: "best-independent", title: "Independent Kotor Guide", desc: "DIY route with timings from the port.", href: "/guides/independent-kotor-guide" },
      { cat: "editors-choice", title: "Kotor, Perast & Our Lady of the Rocks", desc: "When you want the bay handled.", href: "/shore-excursions/kotor-perast-our-lady-of-the-rocks" },
      { cat: "best-value", title: "Compare DIY vs guided", desc: "Honest trade-offs for your call length.", href: "/compare/diy-vs-guided" },
    ],
    related: ["kotor-for-first-time-visitors", "diy-vs-guided", "can-you-visit-kotor-without-excursion"],
    imageKey: "old-town",
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

// ─── EXCURSIONS (12 ExcursionPage entries) ─────────────────────────────────────

const excursions = [
  {
    slug: "kotor-perast-our-lady-of-the-rocks",
    title: "Kotor, Perast & Our Lady of the Rocks",
    seoTitle: "Kotor, Perast & Our Lady of the Rocks Shore Excursion",
    meta: "Editor's Choice — Kotor Old Town, Perast waterfront and boat to Our Lady of the Rocks on one cruise-timed excursion from the port.",
    category: "Bay cruise",
    tagline: "Editor's Choice — baroque Perast, island church and Old Town in one relaxed port day.",
    duration: "5–6 hours",
    pace: "Relaxed",
    bestFor: "First-time visitors wanting bay scenery without the fortress climb",
    overview:
      "Our Editor's Choice for Kotor combines UNESCO Old Town, baroque Perast and the boat trip to Our Lady of the Rocks — the essential Bay of Kotor experience without the strenuous fortress steps.",
    body1:
      "Morning departures walk Kotor Old Town with St Tryphon and Arms Square context, then coach to Perast along the scenic bay road. Afternoon boat crossing to Our Lady of the Rocks with church and museum visit.",
    body2:
      "Guides sequence boat departures and road timing so afternoon traffic does not consume your return buffer. Optional short Perast waterfront lunch when ship schedules allow.",
    body3:
      "Relaxed pace suits most fitness levels — no 1,350-step climb. On calls under 6 usable hours, choose old-town-walking-tour or short-port-call-kotor instead.",
    highlights: ["Kotor Old Town walking tour", "Perast baroque waterfront", "Boat to Our Lady of the Rocks", "Bay of Kotor scenic drive"],
    included: ["Licensed guide", "Coach or minivan transport", "Boat tickets to island", "Return timed to ship"],
    tips: ["Book before sailing in peak season", "Modest dress for church visit", "Camera ready on boat approach"],
    faqs: [
      ["Does this include the fortress?", "No — bay focus. Choose fortress-climb-tour or kotor-highlights for ramparts."],
      ["Best excursion for first-timers?", "Yes — our top pick for balanced scenery, history and relaxed pacing."],
    ],
    related: ["perast-bay-cruise", "kotor-highlights", "old-town-walking-tour"],
    featured: true,
  },
  {
    slug: "kotor-highlights",
    title: "Kotor Highlights Shore Excursion",
    seoTitle: "Kotor Highlights Shore Excursion from Cruise Port",
    meta: "Walk Kotor Old Town, climb San Giovanni Fortress and explore the bay on one cruise-timed highlights tour with return-to-ship confidence.",
    category: "Highlights",
    tagline: "Old Town, fortress summit and bay views — Kotor's essential trio on a single port day.",
    duration: "6–7 hours",
    pace: "Moderate",
    bestFor: "Active first-time visitors with a standard 8–10 hour port call",
    overview:
      "Kotor Highlights sequences Old Town heritage, the San Giovanni Fortress climb and bay viewpoints for passengers who want the headline sights in one organised day.",
    body1:
      "Early Old Town walk through Sea Gate, St Tryphon and Maritime Museum before fortress queues build. Guided fortress ascent with paced rest stops and summit panorama over the bay.",
    body2:
      "Afternoon bay viewpoint or short coastal drive when time allows — operators adjust for your ship's departure. Tickets and transfers handled so you focus on the experience.",
    body3:
      "Active day requiring reasonable fitness. On calls under 7 usable hours, switch to Old Town only or Perast excursion instead.",
    highlights: ["Old Town UNESCO walking tour", "San Giovanni Fortress summit", "Bay of Kotor panoramas", "Door-to-door port transfer"],
    included: ["Licensed guide", "Fortress entrance ticket", "Coach or minivan transport", "Return timed to ship"],
    tips: ["Wear trainers — not sandals", "Bring 1 litre water per person", "Sunscreen essential on fortress"],
    faqs: [
      ["Too much for a 7-hour call?", "Tight — choose fortress-climb-tour or Perast excursion on shorter calls."],
      ["Highlights or Editor's Choice Perast?", "Highlights for fortress; Perast tour for bay and island church without the climb."],
    ],
    related: ["fortress-climb-tour", "old-town-walking-tour", "kotor-perast-our-lady-of-the-rocks"],
    featured: true,
  },
  {
    slug: "old-town-walking-tour",
    title: "Old Town Walking Tour",
    seoTitle: "Kotor Old Town Walking Shore Excursion from Cruise Port",
    meta: "Guided Kotor Old Town walking tour from the cruise port — St Tryphon, Maritime Museum, Sea Gate and cruise-timed return.",
    category: "Old Town",
    tagline: "UNESCO lanes and cathedral — the essential Kotor walk with expert context.",
    duration: "2.5–3 hours",
    pace: "Moderate",
    bestFor: "Short port calls, limited mobility and passengers skipping the fortress",
    overview:
      "The Old Town walking tour covers Kotor's UNESCO core — Sea Gate, Arms Square, St Tryphon Cathedral and hidden lanes — without the fortress climb or bay transfers.",
    body1:
      "Meet at the terminal and walk to Sea Gate with harbour context. Guided route through cathedral, maritime museum option and baroque palaces with Boka Navy stories.",
    body2:
      "Ideal when your call is under 7 hours or fortress fitness is not your priority. Plenty of free time for coffee and souvenirs before return.",
    body3:
      "Combine with independent fortress climb only if you have 4+ additional hours and strong legs — otherwise book fortress-climb-tour for paced ascent.",
    highlights: ["Sea Gate and waterfront walls", "St Tryphon Cathedral", "Arms Square and Clock Tower", "Maritime Museum option"],
    included: ["Licensed guide", "Walking tour of Old Town", "Return timed to ship"],
    tips: ["Best value on short port calls", "Wear grippy shoes on cobbles", "Carry cash for cathedral admission"],
    faqs: [
      ["Walking tour or independent?", "Tour adds history and pacing; independent works if you have our DIY guide."],
      ["Includes fortress?", "No — add fortress-climb-tour or self-climb if hours allow."],
    ],
    related: ["fortress-climb-tour", "short-port-call-kotor", "kotor-highlights"],
    featured: true,
  },
  {
    slug: "fortress-climb-tour",
    title: "Fortress Climb Tour",
    seoTitle: "Kotor Fortress Climb Shore Excursion from Cruise Port",
    meta: "Climb San Giovanni Fortress from Kotor cruise port — guided ascent, tickets and cruise-timed return for active passengers.",
    category: "Fortress",
    tagline: "1,350 steps with a guide — summit views over the Bay of Kotor.",
    duration: "3–4 hours",
    pace: "Active",
    bestFor: "Active travellers who want the fortress as their anchor sight",
    overview:
      "The fortress climb is Kotor's signature active experience — 1,350 stone steps to San Giovanni ramparts with bay panoramas. This tour includes tickets, paced guide and Old Town orientation.",
    body1:
      "Start early to beat heat and crowds. Guide sets rest pace at Church of Our Lady of Remedy midway. Summit time for photos over Old Town and the fjord-like bay.",
    body2:
      "Descent to Arms Square for optional coffee. Not suitable for severe mobility limitations, heart conditions or very young children in summer heat.",
    body3:
      "Do not combine with Lovćen or Blue Cave on standard calls — fortress alone fills a half-day with Old Town context.",
    highlights: ["Guided fortress ascent", "San Giovanni rampart panorama", "Church of Our Lady of Remedy", "Old Town orientation"],
    included: ["Licensed guide", "Fortress entrance ticket", "Paced climb and descent", "Return timed to ship"],
    tips: ["Start before 09:00 when possible", "Minimum 1 litre water per person", "See should-I-climb comparison if unsure"],
    faqs: [
      ["Can anyone do this climb?", "Reasonable fitness required — 1,350 steps in sun. Choose Old Town tour if unsure."],
      ["Fortress tour or highlights?", "Fortress-only if ramparts are your must-do; highlights adds more Old Town depth."],
    ],
    related: ["kotor-highlights", "old-town-walking-tour", "should-i-climb-the-fortress"],
    featured: true,
  },
  {
    slug: "blue-cave-boat-trip",
    title: "Blue Cave Boat Trip",
    seoTitle: "Blue Cave Boat Shore Excursion from Kotor Cruise Port",
    meta: "Speedboat to the Blue Cave (Plava Špilja) from Kotor cruise port — swimming, coastal scenery and cruise-timed return.",
    category: "Boat trip",
    tagline: "Luminous blue cavern swimming — Montenegro's Adriatic adventure.",
    duration: "4–5 hours",
    pace: "Moderate",
    bestFor: "Swimmers and photographers who want Adriatic water over fortress steps",
    overview:
      "The Blue Cave boat trip speeds across the bay to Luštica peninsula — swimming in the ethereal blue-lit cavern and coastal scenery along the way.",
    body1:
      "Depart from Kotor harbour or marina transfer. Life jackets and swim stops included when sea conditions allow. Weather-dependent — operators monitor forecasts.",
    body2:
      "Half-day water focus — not combinable with fortress and Perast on standard 8-hour calls. Bring swimwear, towel and dry bag.",
    body3:
      "Best for repeat Kotor visitors or passengers who prefer boats to baroque towns. First-timers often choose Perast excursion instead.",
    highlights: ["Speedboat across Bay of Kotor", "Blue Cave swim stop", "Coastal Luštica scenery", "Small-group boat experience"],
    included: ["Boat trip ticket", "Life jackets", "Guide or skipper", "Return timed to ship"],
    tips: ["Check weather day before", "Waterproof phone case essential", "Read blue-cave-vs-perast comparison"],
    faqs: [
      ["Cancelled if rough seas?", "Yes — safety first. Have backup Old Town plan."],
      ["Blue Cave or Perast?", "Cave for swimming; Perast for history. See our comparison."],
    ],
    related: ["perast-bay-cruise", "kotor-perast-our-lady-of-the-rocks", "blue-cave-guide"],
    featured: true,
  },
  {
    slug: "perast-bay-cruise",
    title: "Perast Bay Cruise",
    seoTitle: "Perast Bay Cruise Shore Excursion from Kotor",
    meta: "Perast waterfront, Our Lady of the Rocks boat trip and Bay of Kotor cruise from Kotor port — relaxed half-day excursion.",
    category: "Bay cruise",
    tagline: "Baroque Perast and island church — classic bay cruise pacing.",
    duration: "4–5 hours",
    pace: "Relaxed",
    bestFor: "Passengers wanting Perast and the island without extended Old Town walking",
    overview:
      "Perast Bay Cruise focuses on the inner bay — scenic drive, Perast waterfront stroll and boat to Our Lady of the Rocks — with lighter Old Town time than our Editor's Choice combo.",
    body1:
      "Coach along the bay road with commentary on Risan, Morinj and naval history. Perast free time for bell tower or museum before island boat.",
    body2:
      "Suits passengers who have walked Kotor independently before or plan a quick Sea Gate photo stop only. Relaxed pacing with swimming optional in season.",
    body3:
      "Editor's Choice kotor-perast-our-lady-of-the-rocks adds fuller Old Town context — choose that for first-timers.",
    highlights: ["Scenic bay coastal drive", "Perast baroque waterfront", "Our Lady of the Rocks boat", "Relaxed half-day pacing"],
    included: ["Licensed guide", "Coach transport", "Boat to island", "Return timed to ship"],
    tips: ["Morning departures beat afternoon chop", "Cash for Perast café stops", "Modest church dress"],
    faqs: [
      ["Difference from Editor's Choice?", "Less Old Town walking — more bay focus from the start."],
      ["Suitable for limited mobility?", "Perast waterfront is flat; boat has steps — inform operator when booking."],
    ],
    related: ["kotor-perast-our-lady-of-the-rocks", "blue-cave-boat-trip", "perast-guide"],
  },
  {
    slug: "lovcen-national-park",
    title: "Lovćen National Park Excursion",
    seoTitle: "Lovćen National Park Shore Excursion from Kotor Cruise Port",
    meta: "Visit Lovćen National Park and Njegoš Mausoleum from Kotor cruise port — serpentine road, mountain views and cruise-timed return.",
    category: "Mountains",
    tagline: "Kotor Serpentine to Njegoš — all of Montenegro from 1,657 metres.",
    duration: "5–6 hours",
    pace: "Moderate",
    bestFor: "Mountain scenery lovers on 8+ hour port calls",
    overview:
      "Lovćen National Park rises above Kotor via 25 hairpin bends to the Njegoš Mausoleum — panoramic views over the bay, Lake Skadar and beyond on clear days.",
    body1:
      "Scenic drive up the Kotor Serpentine with photo stops. Mausoleum visit — granite chapel and summit viewpoint. Cooler mountain air a welcome break from coastal heat.",
    body2:
      "Full half-day anchor — not combinable with Perast or fortress on standard calls. Clear weather essential; clouds obscure the famous panorama.",
    body3:
      "Motion sickness sufferers should prepare for the serpentine. Private tours offer best pacing and photo stops.",
    highlights: ["Kotor Serpentine hairpins", "Njegoš Mausoleum visit", "360-degree Montenegro views", "Mountain air and photography"],
    included: ["Licensed guide", "Coach or minivan", "Mausoleum entrance", "Return timed to ship"],
    tips: ["Check weather forecast", "Warm layer for summit", "Not for short port calls"],
    faqs: [
      ["Lovćen or fortress?", "Fortress for Kotor-overlook; Lovćen for all-Montenegro panorama and Njegoš heritage."],
      ["Minimum call length?", "8 usable hours — this is your single anchor excursion."],
    ],
    related: ["kotor-highlights", "private-kotor-tour", "lovcen-national-park-guide"],
  },
  {
    slug: "food-wine-tour",
    title: "Kotor Food & Wine Tour",
    seoTitle: "Kotor Food & Wine Shore Excursion from Cruise Port",
    meta: "Montenegrin food and wine tasting from Kotor cruise port — Njeguški pršut, seafood, Vranac wine and konoba lunch timed to your ship.",
    category: "Food & wine",
    tagline: "Pršut, fresh fish and Vranac — taste Montenegro on a port day.",
    duration: "4–5 hours",
    pace: "Relaxed",
    bestFor: "Food and wine lovers who want culinary focus over fortress steps",
    overview:
      "The food and wine tour samples Montenegro's compact cuisine — smoked ham from Lovćen villages, Adriatic seafood, local cheeses and Vranac wine in Old Town konobas or nearby cellars.",
    body1:
      "Guided tastings with stories linking Boka cuisine to Venetian and Ottoman influences. Sit-down lunch or multiple small plates depending on operator.",
    body2:
      "Pairs with short Old Town walk — not with fortress climb same day unless you have 9+ hours. Inform dietary requirements when booking.",
    body3:
      "Wine portions moderate for safe return — operators pace tastings responsibly. Vegetarian options available with advance notice.",
    highlights: ["Njeguški pršut and cheese tasting", "Adriatic seafood or risotto", "Vranac wine samples", "Old Town konoba atmosphere"],
    included: ["Licensed guide", "Food and wine tastings", "Lunch or substantial bites", "Return timed to ship"],
    tips: ["Eat light breakfast on ship", "Share dietary needs at booking", "Cash tip for exceptional service"],
    faqs: [
      ["Food tour on 6-hour call?", "Tight — quick konoba lunch independently may suit better."],
      ["Includes fortress?", "No — culinary focus. Combine only on very long calls."],
    ],
    related: ["old-town-walking-tour", "montenegro-food-wine-guide", "best-restaurants-kotor-old-town"],
  },
  {
    slug: "private-kotor-tour",
    title: "Private Kotor Tour",
    seoTitle: "Private Kotor Shore Excursion — Custom Port Day from Cruise Terminal",
    meta: "Private Kotor tour from cruise port — your vehicle, your guide, fortress, Perast or Lovćen with strongest return-to-ship confidence.",
    category: "Private",
    tagline: "Your party, your route — fortress, Perast or Lovćen at your pace.",
    duration: "Flexible — 4–8 hours",
    pace: "Relaxed",
    bestFor: "Families, couples and groups wanting custom routing and vehicle at each stop",
    overview:
      "Private Kotor tours meet you at the terminal with a dedicated vehicle and guide — build routes around fortress, Perast, Lovćen or food stops with direct ship tracking.",
    body1:
      "Families of four often pay similar per-head to large coach tours but gain flexibility on rest stops, boat timing and lunch length. Specify must-sees at booking.",
    body2:
      "Strongest option for limited mobility — vehicle drops at Sea Gate, Perast waterfront and mausoleum lift. Stroller-friendly Old Town routing available.",
    body3:
      "Premium pricing reflects exclusivity — best value for 4–8 guests sharing vehicle cost.",
    highlights: ["Terminal meet-and-greet", "Custom itinerary", "Private vehicle throughout", "Direct ship departure tracking"],
    included: ["Private guide", "Dedicated vehicle", "Flexible stops", "Return timed to ship"],
    tips: ["Agree must-sees in writing when booking", "Confirm ticket inclusions", "Share children's ages for pacing"],
    faqs: [
      ["Private vs group tour?", "See our private-tour-vs-group-tour comparison for trade-offs."],
      ["Can we do fortress and Perast?", "On 9+ hour calls yes — guide sets realistic sequence."],
    ],
    related: ["kotor-highlights", "family-kotor", "luxury-private-yacht"],
  },
  {
    slug: "family-kotor",
    title: "Family Kotor Excursion",
    seoTitle: "Family-Friendly Kotor Shore Excursion from Cruise Port",
    meta: "Family Kotor shore excursion — paced Old Town, cats, bay boat trip and child-friendly stops with reliable return from the cruise port.",
    category: "Family",
    tagline: "Cats, boats and short walks — Kotor paced for children.",
    duration: "4–5 hours",
    pace: "Relaxed",
    bestFor: "Families with school-age children on standard port calls",
    overview:
      "Family Kotor skips the full fortress climb in favour of cat spotting, gentle Old Town lanes, optional Cat Museum and Perast boat ride with ice cream stops.",
    body1:
      "Guides know toilet locations, shade stops and ice cream breaks. Perast boat suits children — short crossing and island church without strenuous walking.",
    body2:
      "Toddlers do better with harbour promenade and Old Town than mountain drives. Share ages when booking for nap-friendly routing.",
    body3:
      "Private upgrade available for mixed-age groups needing stroller access or flexible timing.",
    highlights: ["Cat Museum and Old Town cats", "Gentle Old Town route", "Perast boat option", "Ice cream and shade breaks"],
    included: ["Family-experienced guide", "Transport as per itinerary", "Boat tickets if Perast route", "Return timed to ship"],
    tips: ["Pack snacks and sun hats", "Sturdy stroller for cobbles", "Swimwear if summer boat route"],
    faqs: [
      ["Fortress with kids?", "Only with teens fit for heat and steps — we route around it for younger children."],
      ["Ages best suited?", "School-age and up love boat and cats; toddlers need shorter routes."],
    ],
    related: ["perast-bay-cruise", "kotor-for-families", "old-town-walking-tour"],
  },
  {
    slug: "short-port-call-kotor",
    title: "Short Port Call Kotor Tour",
    seoTitle: "Short Port Call Kotor Shore Excursion — Under 6 Hours Ashore",
    meta: "Kotor shore excursion for short port calls — essential Old Town walk, Sea Gate and cathedral with maximum return-to-ship confidence.",
    category: "Short port",
    tagline: "Tight schedule, zero waste — essential Kotor in under four hours ashore.",
    duration: "2.5–3.5 hours",
    pace: "Moderate",
    bestFor: "Calls with under 6 usable hours or late arrivals",
    overview:
      "Short port call Kotor maximises UNESCO Old Town in minimal time — Sea Gate, Arms Square, St Tryphon and harbour ramparts without fortress or bay transfers.",
    body1:
      "Meet at terminal exit immediately on disembarkation. Fast-paced guided walk with photo stops at key squares. Built-in return margin for tendering and all-aboard.",
    body2:
      "No time for Perast, Lovćen or fortress summit — honest pacing prevents missed ships. Quick espresso on Arms Square optional if schedule allows.",
    body3:
      "If your call lengthens unexpectedly, upgrade to full old-town-walking-tour or independent fortress climb at your own risk — we recommend sticking to the short itinerary.",
    highlights: ["Immediate terminal pickup", "Sea Gate and cathedral", "Maximum return buffer", "Essential Kotor only"],
    included: ["Licensed guide", "Short Old Town route", "Conservative return timing"],
    tips: ["Wear comfortable shoes", "Skip shopping unless time confirmed", "Check tender schedule night before"],
    faqs: [
      ["Can we add fortress?", "Not safely on sub-6-hour calls — choose standard old-town-walking-tour if hours allow."],
      ["Tender port?", "Yes — itinerary includes extra tender margin."],
    ],
    related: ["old-town-walking-tour", "kotor-cruise-tips", "is-kotor-walkable"],
  },
  {
    slug: "luxury-private-yacht",
    title: "Luxury Private Yacht Charter",
    seoTitle: "Luxury Private Yacht Shore Excursion from Kotor Cruise Port",
    meta: "Private yacht charter from Kotor cruise port — Bay of Kotor cruise, swimming, Perast and Our Lady of the Rocks with premium service.",
    category: "Luxury",
    tagline: "Your yacht, your bay — Perast, caves and swim stops in VIP style.",
    duration: "4–6 hours",
    pace: "Relaxed",
    bestFor: "Couples and small groups wanting premium bay experience",
    overview:
      "Luxury private yacht charters sail the Bay of Kotor with skipper, refreshments and custom routing — Perast, Our Lady of the Rocks, hidden coves and swim stops inaccessible to coaches.",
    body1:
      "Meet at Kotor marina or harbour transfer. Premium vessels with shade, towels and cold drinks. Route tailored to your interests and ship schedule.",
    body2:
      "Ultimate way to see the bay without coach convoys or fortress steps. Sunset departures suit late ship sailings when available.",
    body3:
      "Premium pricing — book early in peak season. Weather-dependent like all boat experiences.",
    highlights: ["Private yacht and skipper", "Custom bay routing", "Swim stops and refreshments", "Perast and island from the water"],
    included: ["Private yacht charter", "Skipper and fuel", "Refreshments on board", "Return timed to ship"],
    tips: ["Book weeks ahead in July", "Bring swimwear and sunscreen", "Confirm marina meeting point"],
    faqs: [
      ["Yacht or standard bay cruise?", "Yacht for privacy and flexibility; coach tours for value."],
      ["Minimum group size?", "Often priced per yacht — couples welcome on smaller vessels."],
    ],
    related: ["private-kotor-tour", "perast-bay-cruise", "blue-cave-boat-trip"],
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

// ─── COMPARISONS (5 versus + 1 guide) ────────────────────────────────────────

const comparisons = [
  versus({
    slug: "blue-cave-vs-perast",
    optionA: "Blue Cave Boat Trip",
    optionB: "Perast & Our Lady of the Rocks",
    summary:
      "On a standard Kotor port day choose between Adriatic adventure — swimming in the luminous Blue Cave — or baroque heritage at Perast and the island church. Both are half-day water experiences with different character.",
    verdict:
      "Choose Perast and Our Lady of the Rocks for first-time Kotor — UNESCO baroque town, island church and bay scenery with cultural depth. Choose the Blue Cave when you want swimming, speedboats and geological wonder over history. Repeat visitors who have walked Old Town often pick the cave.",
    overview: [
      "Blue Cave: speedboat from Kotor, 45–90 min on water, weather dependent, swimming focus, minimal walking.",
      "Perast: 30–40 min drive, baroque waterfront, 5 min boat to island church, museum and heritage focus.",
      "Combining both needs 10+ hour calls — otherwise one bay anchor per day.",
    ],
    table: [
      { category: "Transfer from port", optionA: "Harbour boat departure", optionB: "30–40 min coach to Perast" },
      { category: "Time needed", optionA: "3–4 hours total", optionB: "3–4 hours total" },
      { category: "Swimming", optionA: "Yes — cave swim stop", optionB: "Optional; church and stroll focus" },
      { category: "Best for", optionA: "Swimmers, adventure, repeat visitors", optionB: "First-timers, history, photography" },
      { category: "Weather risk", optionA: "High — sea state can cancel", optionB: "Low — road and short boat" },
    ],
    faqs: [
      ["Can I do both on one port day?", "Only on 10+ hour calls — otherwise pick one bay excursion."],
      ["Which is our Editor's Choice?", "Perast and Our Lady of the Rocks — best first-timer bay experience."],
    ],
    related: ["blue-cave-guide", "perast-guide", "kotor-perast-our-lady-of-the-rocks"],
    imageKey: "boat",
  }),
  versus({
    slug: "should-i-climb-the-fortress",
    optionA: "Climb San Giovanni Fortress",
    optionB: "Skip the Fortress",
    summary:
      "The Kotor fortress offers the bay's best views but demands 1,350 steps in full sun. On a standard port day the climb is worth it for active travellers; others should invest time in Old Town depth or Perast instead.",
    verdict:
      "Climb if you have reasonable fitness, 2+ spare hours and morning shade — the panorama is unforgettable. Skip if you have limited mobility, young children, a short call or heat sensitivity — Old Town and Perast deliver plenty without the steps.",
    overview: [
      "Climb: 1,350 steps, 60–90 min up, 30–45 min down, €8–10 ticket, full sun, iconic photos.",
      "Skip: more time for cathedral, museums, konoba lunch or Perast excursion.",
      "Guided climbs pace rest stops — worth it if unsure of fitness.",
    ],
    table: [
      { category: "Physical effort", optionA: "Active — steep steps", optionB: "Moderate — Old Town cobbles only" },
      { category: "Time required", optionA: "2–2.5 hours total", optionB: "Freed for other sights" },
      { category: "Best views", optionA: "Bay panorama from ramparts", optionB: "Harbour level and Perast boat" },
      { category: "Best for", optionA: "Fit active travellers", optionB: "Families, short calls, heat-sensitive" },
      { category: "Return confidence", optionA: "High if started early", optionB: "Higher — more schedule margin" },
    ],
    faqs: [
      ["Fortress on a 6-hour call?", "Tight — Old Town only unless you are very fit and start immediately."],
      ["Fortress or Perast?", "Different experiences — fortress for views over Kotor; Perast for bay baroque."],
    ],
    related: ["kotor-fortress-guide", "fortress-climb-tour", "kotor-for-families"],
    imageKey: "fortress",
  }),
  versus({
    slug: "diy-vs-guided",
    optionA: "DIY Kotor",
    optionB: "Guided Shore Excursion",
    summary:
      "DIY Old Town walks from the cruise port cost little and carry high return confidence. DIY Perast adds taxi timing risk. Guided excursions cost more but bundle boat tickets, historian guides and ship-aware timing.",
    verdict:
      "Choose DIY for Old Town and optional fortress if you are a confident walker and will return 90 minutes before all-aboard. Choose guided for Perast boats, Lovćen drives, Blue Cave weather calls and first-time callers who want zero logistics stress.",
    overview: [
      "DIY: walk to Sea Gate (free), fortress ticket €8–10, lunch €15–25 — €30–50 plus food. You manage timing.",
      "Guided: minivan from terminal, boat tickets, historian guide, 60–90 minute buffers. Operators track departure.",
      "DIY saves €40–80 per person for Old Town days; guided saves costly Perast timing mistakes.",
    ],
    table: [
      { category: "Cost per person", optionA: "€30–55 plus food", optionB: "€70–130+ all-in" },
      { category: "Return confidence", optionA: "High for Old Town only", optionB: "High for all routes" },
      { category: "Perast timing", optionA: "Taxi coordination needed", optionB: "Handled by operator" },
      { category: "Best for", optionA: "Experienced cruisers, Old Town focus", optionB: "Bay trips, first-timers, families" },
    ],
    faqs: [
      ["Is DIY Old Town safe?", "Yes — compact and walkable. Pre-book taxi if climbing fortress in heat."],
      ["Best sight for DIY?", "Old Town walk — fortress self-climb if fit."],
    ],
    related: ["independent-kotor-guide", "can-you-visit-kotor-without-excursion", "kotor-for-first-time-visitors"],
    imageKey: "old-town",
  }),
  versus({
    slug: "private-tour-vs-group-tour",
    optionA: "Private Tour",
    optionB: "Group Shore Excursion",
    summary:
      "Private Kotor tours offer custom routing, vehicle at each stop and flexible pacing. Group excursions cost less per person and suit solo travellers — but follow fixed coach schedules.",
    verdict:
      "Choose private for families of four plus, mixed mobility needs, honeymoon trips or when you want fortress AND Perast on a long call. Choose group for value, solo travel and standard Perast or highlights routes where itinerary fits.",
    overview: [
      "Private: dedicated vehicle, custom stops, €300–600+ per group typical, best 4–8 guests.",
      "Group: 8–40 passengers, fixed route, €70–120 per person, social and economical for solos.",
      "Both reputable options track all-aboard — private offers more margin control.",
    ],
    table: [
      { category: "Cost for couple", optionA: "Higher total, flexible value", optionB: "€140–240 typical" },
      { category: "Itinerary", optionA: "Fully custom", optionB: "Fixed route" },
      { category: "Pacing", optionA: "Your speed", optionB: "Group consensus" },
      { category: "Best for", optionA: "Families, luxury, mixed interests", optionB: "Solos, couples on budget, standard routes" },
    ],
    faqs: [
      ["Is private worth the cost?", "Often yes for 4+ sharing vehicle — similar per-head to premium group tours."],
      ["Group tour quality in Kotor?", "Good operators run excellent small groups — read reviews for ship tracking."],
    ],
    related: ["private-kotor-tour", "kotor-highlights", "kotor-for-families"],
    imageKey: "private",
  }),
  comparisonGuide({
    slug: "best-excursion-first-time-visitors",
    title: "Best Kotor Excursions for First-Time Visitors",
    seoTitle: "Best Kotor Shore Excursions for First-Timers — Cruise Port",
    meta: "Ranked Kotor shore excursions for first-time cruise passengers — Perast, highlights, Old Town and private options.",
    summary:
      "First-timers need one clear anchor, reliable boat or fortress timing and an operator who understands all-aboard — these excursions deliver consistently from the Port of Kotor.",
    verdict: "Book before sailing in peak season. Morning departures protect afternoon return margins when fortress trails and Perast boats fill up.",
    overview: [
      "Kotor, Perast & Our Lady of the Rocks is our Editor's Choice for balanced bay scenery and heritage.",
      "Kotor Highlights suits active passengers wanting Old Town and fortress on one day.",
      "Old Town walking tour fits short calls and those skipping the climb.",
      "Private tours suit mixed groups wanting flexible pacing.",
    ],
    guideItems: [
      { name: "Kotor, Perast & Our Lady of the Rocks", slug: "kotor-perast-our-lady-of-the-rocks", href: "/shore-excursions/kotor-perast-our-lady-of-the-rocks", reason: "Editor's pick — bay scenery, island church and Old Town sequenced with expert timing.", topExcursion: "Kotor, Perast & Our Lady of the Rocks", returnConfidence: "High on 7+ hour calls", walkingDifficulty: "Easy to moderate — no fortress climb" },
      { name: "Kotor Highlights", slug: "kotor-highlights", href: "/shore-excursions/kotor-highlights", reason: "When you want Old Town and fortress summit on one active day.", topExcursion: "Kotor Highlights Shore Excursion", returnConfidence: "High on 8+ hour calls", walkingDifficulty: "Active — fortress steps" },
      { name: "Old Town Walking Tour", slug: "old-town-walking-tour", href: "/shore-excursions/old-town-walking-tour", reason: "Best when your call is short or fortress walking is too demanding.", topExcursion: "Old Town Walking Tour", returnConfidence: "Very high", walkingDifficulty: "Moderate — cobbled lanes" },
      { name: "Fortress Climb Tour", slug: "fortress-climb-tour", href: "/shore-excursions/fortress-climb-tour", reason: "When the rampart panorama is your non-negotiable must-do.", topExcursion: "Fortress Climb Tour", returnConfidence: "High if started early", walkingDifficulty: "Active — 1,350 steps" },
      { name: "Private Kotor Tour", slug: "private-kotor-tour", href: "/shore-excursions/private-kotor-tour", reason: "Custom routing for families and mixed interests with strongest flexibility.", topExcursion: "Private Kotor Tour", returnConfidence: "Very high", walkingDifficulty: "Flexible" },
    ],
    faqs: [
      ["One excursion for first-timers?", "Kotor, Perast & Our Lady of the Rocks on standard calls — Old Town only on short calls."],
      ["Fortress or Perast first?", "Perast for relaxed heritage; fortress for views over Old Town. Editor's Choice covers Perast."],
    ],
    related: ["kotor-for-first-time-visitors", "should-i-climb-the-fortress", "kotor-perast-our-lady-of-the-rocks"],
    imageKey: "highlights",
  }),
  comparisonGuide({
    slug: "can-you-visit-kotor-without-excursion",
    title: "Can You Visit Kotor Without a Shore Excursion?",
    seoTitle: "Visit Kotor Without a Shore Excursion — DIY Cruise Port Guide",
    meta: "Can you visit Kotor without a shore excursion? Yes — walking routes, fortress tickets, taxi prices and what needs a tour.",
    summary:
      "Kotor is one of the Mediterranean's best ports for independent exploration — Old Town is 400 metres from the gangway. Bay and mountain sights need more planning.",
    verdict: "Walk Old Town and climb the fortress independently on most calls. Book a tour or taxi for Perast, Lovćen and Blue Cave — or accept that DIY bay days need tight taxi coordination.",
    overview: [
      "Old Town: 5–10 min walk from port — free, essential, highly walkable.",
      "Fortress: self-climb with ticket at trailhead — €8–10, allow 2+ hours.",
      "Perast: taxi €25–35 each way or excursion — boat timing is the challenge.",
      "Lovćen and Blue Cave: strongly recommend organised tours.",
    ],
    guideItems: [
      { name: "Old Town DIY Walk", slug: "independent-kotor-guide", href: "/guides/independent-kotor-guide", reason: "Sea Gate to cathedral — the essential free experience from the port.", topExcursion: "Old Town Walking Tour (optional guide)", returnConfidence: "Very high", walkingDifficulty: "Moderate cobbles" },
      { name: "Fortress Self-Climb", slug: "kotor-fortress-guide", href: "/guides/kotor-fortress-guide", reason: "Buy tickets at trailhead — no tour required if fit and time-aware.", topExcursion: "Fortress Climb Tour (for pacing)", returnConfidence: "High if early start", walkingDifficulty: "Active — 1,350 steps" },
      { name: "Perast Independent", slug: "perast-guide", href: "/guides/perast-guide", reason: "Possible by taxi but boat and return timing need discipline.", topExcursion: "Kotor, Perast & Our Lady of the Rocks", returnConfidence: "Moderate DIY — high guided", walkingDifficulty: "Easy at Perast" },
      { name: "Guided Bay Trip", slug: "kotor-perast-our-lady-of-the-rocks", href: "/shore-excursions/kotor-perast-our-lady-of-the-rocks", reason: "When you want Perast without taxi logistics stress.", topExcursion: "Editor's Choice bay excursion", returnConfidence: "High", walkingDifficulty: "Easy to moderate" },
    ],
    faqs: [
      ["Will the ship wait if I go independent?", "No — only ship excursions carry delay guarantee. Keep 60–90 minute buffer."],
      ["How much cash for DIY day?", "€40–60 plus lunch covers fortress, taxi and snacks."],
    ],
    related: ["independent-kotor-guide", "diy-vs-guided", "is-kotor-walkable"],
    imageKey: "old-town",
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
    return \`\${comp.optionA} vs \${comp.optionB}\`;
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
  transfers: PlannerLink[];
  stay: PlannerLink[];
  logistics: PlannerLink[];
  dayPlan: { time: string; text: string }[];
}

export const INTEREST_OPTIONS = [
  { id: "history", label: "History & heritage" },
  { id: "fortress", label: "Fortress climb" },
  { id: "viewpoints", label: "Viewpoints & panoramas" },
  { id: "bay", label: "Bay of Kotor & Perast" },
  { id: "islands", label: "Island churches & boat trips" },
  { id: "food", label: "Food & wine" },
  { id: "boat", label: "Boat trips & Blue Cave" },
  { id: "family", label: "Family-friendly" },
  { id: "old-town", label: "Old Town & culture" },
  { id: "photography", label: "Photography" },
  { id: "mountains", label: "Mountains & Lovćen" },
];

const INTEREST_TO_EXCURSION: Record<string, string[]> = {
  history: ["old-town-walking-tour", "kotor-perast-our-lady-of-the-rocks", "kotor-highlights"],
  fortress: ["fortress-climb-tour", "kotor-highlights", "old-town-walking-tour"],
  viewpoints: ["fortress-climb-tour", "lovcen-national-park", "kotor-highlights"],
  bay: ["kotor-perast-our-lady-of-the-rocks", "perast-bay-cruise", "luxury-private-yacht"],
  islands: ["kotor-perast-our-lady-of-the-rocks", "perast-bay-cruise", "blue-cave-boat-trip"],
  food: ["food-wine-tour", "old-town-walking-tour", "kotor-highlights"],
  boat: ["blue-cave-boat-trip", "perast-bay-cruise", "luxury-private-yacht"],
  family: ["family-kotor", "perast-bay-cruise", "old-town-walking-tour"],
  "old-town": ["old-town-walking-tour", "short-port-call-kotor", "kotor-highlights"],
  photography: ["fortress-climb-tour", "kotor-perast-our-lady-of-the-rocks", "blue-cave-boat-trip"],
  mountains: ["lovcen-national-park", "private-kotor-tour", "kotor-highlights"],
};

const ITINERARY_THEMES: Record<
  string,
  { headline: string; slugs: string[]; summary: string }
> = {
  "editors-choice": {
    headline: "Editor's Choice — Perast • Our Lady of the Rocks • Old Town",
    slugs: ["kotor-perast-our-lady-of-the-rocks", "kotor-highlights", "old-town-walking-tour"],
    summary: "The essential Kotor trio — baroque bay, island church and UNESCO Old Town sequenced with expert timing.",
  },
  "best-historic": {
    headline: "Historic Kotor",
    slugs: ["old-town-walking-tour", "kotor-perast-our-lady-of-the-rocks", "fortress-climb-tour"],
    summary: "Venetian walls, maritime heritage and baroque Perast without rushing.",
  },
  "best-view": {
    headline: "Best Viewpoints",
    slugs: ["fortress-climb-tour", "lovcen-national-park", "kotor-highlights"],
    summary: "Fortress ramparts, Njegoš mausoleum and bay panoramas.",
  },
  "best-coastal": {
    headline: "Bay of Kotor",
    slugs: ["kotor-perast-our-lady-of-the-rocks", "perast-bay-cruise", "blue-cave-boat-trip"],
    summary: "Perast, island church and Blue Cave — Adriatic water over mountain steps.",
  },
  "best-food": {
    headline: "Food & Wine",
    slugs: ["food-wine-tour", "old-town-walking-tour", "kotor-highlights"],
    summary: "Njeguški pršut, Adriatic seafood and Vranac wine fitted to your port hours.",
  },
  "best-independent": {
    headline: "Independent Explorer",
    slugs: ["old-town-walking-tour", "short-port-call-kotor", "fortress-climb-tour"],
    summary: "Walk to Sea Gate, explore lanes and manage your own return buffer to the port.",
  },
  "best-families": {
    headline: "Family Day",
    slugs: ["family-kotor", "perast-bay-cruise", "old-town-walking-tour"],
    summary: "Cats, gentle walks and bay boat trips paced for children.",
  },
};

function excursionLink(slug: string, why: string): PlannerLink | null {
  const e = excursions.find((x) => x.slug === slug);
  if (!e) return null;
  return { label: e.title, href: \`/shore-excursions/\${slug}\`, why };
}

function usableHours(input: PlannerInput): number {
  if (input.arrivalTime && input.departureTime) {
    const [aH, aM] = input.arrivalTime.split(":").map(Number);
    const [dH, dM] = input.departureTime.split(":").map(Number);
    const arrivalMins = aH * 60 + aM;
    const departMins = dH * 60 + dM;
    const raw = (departMins - arrivalMins) / 60;
    return Math.max(0, raw - 1.5);
  }
  const map = { short: 5, standard: 7.5, long: 10 };
  return map[input.timeframe];
}

function pickTheme(input: PlannerInput): keyof typeof ITINERARY_THEMES {
  const { interests, children, style, mobility, timeframe } = input;
  const active = interests.length ? interests : ["old-town", "history"];

  if (children > 0 || active.includes("family")) return "best-families";
  if (style === "diy" || (active.includes("old-town") && style !== "guided")) return "best-independent";
  if (active.includes("food")) return "best-food";
  if (active.includes("boat") || active.includes("bay") || active.includes("islands")) return "best-coastal";
  if (active.includes("viewpoints") || active.includes("photography")) return "best-view";
  if (active.includes("mountains")) return "best-view";
  if (active.includes("fortress") || active.includes("history")) return "best-historic";
  if (timeframe === "short" || usableHours(input) < 6) return "best-independent";
  if (mobility === "limited") return "best-coastal";
  return "editors-choice";
}

export function generateKotorPlan(input: PlannerInput): PlannerResult {
  const { timeframe, arrivalTime, departureTime, adults, children, interests, mobility, budget, style } = input;
  const party = adults + children;
  const hasKids = children > 0;
  const hours = usableHours(input);

  const themeKey = pickTheme(input);
  const theme = ITINERARY_THEMES[themeKey];

  const excSlugs: string[] = [];
  const pushSlug = (s: string) => {
    if (s && !excSlugs.includes(s)) excSlugs.push(s);
  };

  for (const s of theme.slugs) pushSlug(s);

  const activeInterests = interests.length ? interests : ["old-town", "history"];
  for (const interest of activeInterests) {
    for (const s of INTEREST_TO_EXCURSION[interest] ?? []) pushSlug(s);
  }
  if (hasKids) pushSlug("family-kotor");
  if (mobility === "limited") pushSlug("private-kotor-tour");
  if (style === "diy") pushSlug("old-town-walking-tour");
  if (budget === "premium") pushSlug("private-kotor-tour");
  if (timeframe === "short" || hours < 6) pushSlug("short-port-call-kotor");

  const reasonMap: Record<string, string> = {
    "kotor-perast-our-lady-of-the-rocks": "Editor's Choice — Perast, island church and Old Town on one relaxed day.",
    "kotor-highlights": "Old Town, fortress summit and bay views sequenced for active passengers.",
    "old-town-walking-tour": "Sea Gate and cathedral — best anchor for any call length.",
    "fortress-climb-tour": "1,350 steps to San Giovanni — Kotor's signature panorama.",
    "perast-bay-cruise": "Baroque Perast and Our Lady of the Rocks by boat.",
    "blue-cave-boat-trip": "Swim in the luminous Blue Cave on the outer bay.",
    "food-wine-tour": "Njeguški pršut, seafood and Vranac wine tastings.",
    "family-kotor": "Paced routing with cats, boats and short walks for children.",
    "private-kotor-tour": mobility === "limited" ? "Private vehicle at each stop — essential for easy access." : "Flexible routing for your group.",
    "lovcen-national-park": "Njegoš Mausoleum and serpentine views over all Montenegro.",
    "short-port-call-kotor": "Essential Old Town when hours are tight.",
    "luxury-private-yacht": "Private yacht through the Bay of Kotor.",
  };

  const excursionLinks = excSlugs
    .slice(0, 5)
    .map((s) => excursionLink(s, reasonMap[s] ?? "A strong match for your Kotor port day."))
    .filter((x): x is PlannerLink => x !== null);

  const transfers: PlannerLink[] = [
    {
      label: "Kotor Cruise Port Guide",
      href: "/cruise-port-guide",
      why: "Port layout, walking to Sea Gate, tender tips and taxi prices.",
    },
  ];
  if (party >= 3 || hasKids || mobility === "limited" || budget === "premium") {
    transfers.push({
      label: "Private Kotor Tour",
      href: "/shore-excursions/private-kotor-tour",
      why: "Strongest return-to-ship confidence for your group when bay traffic builds.",
    });
  }

  const logistics: PlannerLink[] = [
    { label: "Ship Schedules", href: "/ship-schedules/kotor", why: "See how many ships share your port day." },
    {
      label: "First-Time Kotor Guide",
      href: "/guides/kotor-for-first-time-visitors",
      why: "Choose your anchor sight when hours are tight.",
    },
    {
      label: "DIY vs Guided",
      href: "/compare/diy-vs-guided",
      why: "When independent Old Town walks beat organised tours.",
    },
  ];

  const topExc = excursionLinks[0]?.label ?? theme.headline;
  const dayPlan: { time: string; text: string }[] = [];

  const arriveLabel = arrivalTime ?? (timeframe === "short" ? "08:00" : timeframe === "long" ? "07:00" : "07:30");
  const departLabel = departureTime ?? (timeframe === "short" ? "14:00" : timeframe === "long" ? "18:00" : "17:00");

  dayPlan.push({
    time: "On arrival",
    text: \`Disembark at Port of Kotor (\${arriveLabel}). Be on deck for the bay sail-in if you arrived early. Meet your excursion at the terminal exit, or walk to Sea Gate (5–10 min) for an independent start.\`,
  });

  if (themeKey === "best-coastal") {
    dayPlan.push({
      time: "Morning",
      text: \`Depart for Perast and bay boat — \${topExc}. Morning boats beat afternoon chop.\`,
    });
    dayPlan.push({
      time: "Midday",
      text: "Our Lady of the Rocks church visit and Perast waterfront stroll — allow 2+ hours on the bay.",
    });
    dayPlan.push({
      time: "Afternoon",
      text: "Return coach to Kotor — quick Sea Gate photo stop only unless departure is 18:00 or later.",
    });
  } else if (themeKey === "best-food") {
    dayPlan.push({ time: "Morning", text: "Old Town walk to St Tryphon and Arms Square before lunch crowds." });
    dayPlan.push({ time: "Midday", text: "Konoba lunch with pršut and Vranac — allow 90 minutes seated." });
    dayPlan.push({ time: "Afternoon", text: "Coffee on the square and souvenir browsing before walking back to port." });
  } else if (themeKey === "best-independent") {
    dayPlan.push({ time: "Morning", text: "Walk to Sea Gate — St Tryphon, Arms Square and Maritime Museum at your pace." });
    dayPlan.push({ time: "Midday", text: "Lunch in a side-lane konoba — black risotto or grilled branzino." });
    dayPlan.push({ time: "Afternoon", text: "Optional fortress climb if fit, or harbour rampart walk — return 90 minutes before all-aboard." });
  } else if (themeKey === "best-view") {
    dayPlan.push({ time: "Morning", text: "Fortress climb or Lovćen drive first for best light and cooler temperatures." });
    dayPlan.push({ time: "Midday", text: "Descent to Old Town — short lunch near Arms Square." });
    dayPlan.push({ time: "Afternoon", text: "Maritime Museum or cathedral if legs allow — otherwise harbour photos." });
  } else if (hasKids) {
    dayPlan.push({ time: "Morning", text: "Cat Museum and gentle Old Town lanes — short distances for children." });
    dayPlan.push({ time: "Midday", text: "Perast boat ride or harbour promenade ice cream." });
    dayPlan.push({ time: "Afternoon", text: "Early return to ship — avoid fortress climb with toddlers." });
  } else {
    dayPlan.push({
      time: "Morning",
      text: \`Old Town or bay anchor first: \${topExc}. Early starts beat fortress and Perast crowds.\`,
    });
    dayPlan.push({ time: "Midday", text: "Arms Square lunch and St Tryphon cathedral if not visited morning." });
    dayPlan.push({ time: "Afternoon", text: "Free time in Old Town lanes or quick fortress if hours allow." });
  }

  dayPlan.push({
    time: "Return buffer",
    text: \`Be back at Port of Kotor 60–90 minutes before all-aboard (\${departLabel} sailing). Perast road traffic and fortress descent can add 20–30 minutes in peak season.\`,
  });

  const interestLabels = activeInterests
    .map((i) => INTEREST_OPTIONS.find((o) => o.id === i)?.label ?? i)
    .join(", ")
    .toLowerCase();

  return {
    headline: theme.headline,
    summary: \`\${theme.summary} A \${timeframe} Kotor port day (~\${hours.toFixed(1)} usable hours) for \${party} guest\${party === 1 ? "" : "s"} interested in \${interestLabels}.\`,
    excursions: excursionLinks,
    transfers,
    stay: [],
    logistics,
    dayPlan,
  };
}

/** @deprecated Use generateKotorPlan */
export const generateDubrovnikPlan = generateKotorPlan;
/** @deprecated Use generateKotorPlan */
export const generateCorfuPlan = generateKotorPlan;
`,
);

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
  { id: "editors-choice", label: "Editor's Choice", shortLabel: "Editor's Choice", description: "Our top pick after comparing options for Kotor cruise passengers." },
  { id: "best-historic", label: "Best Historic Experience", shortLabel: "Historic", description: "Venetian walls, maritime heritage and baroque Perast without rushing." },
  { id: "best-independent", label: "Best Independent Experience", shortLabel: "Independent", description: "The smartest DIY approach when you prefer to explore from the cruise port." },
  { id: "best-coastal", label: "Best Coastal Experience", shortLabel: "Coastal", description: "Perast, Our Lady of the Rocks and Bay of Kotor cruises timed to your ship." },
  { id: "best-view", label: "Best Viewpoints", shortLabel: "Viewpoints", description: "Fortress ramparts, Lovćen mausoleum and bay panorama photography." },
  { id: "best-families", label: "Best for Families", shortLabel: "Families", description: "Paced for children and mixed-age groups with reliable return timing." },
  { id: "best-photography", label: "Best for Photography", shortLabel: "Photography", description: "Fortress outlooks, bay reflections and baroque waterfront angles." },
  { id: "best-food", label: "Best Food & Wine Experience", shortLabel: "Food & Wine", description: "Njeguški pršut, Adriatic seafood and Vranac tastings that fit a cruise schedule." },
  { id: "best-luxury", label: "Best Luxury Experience", shortLabel: "Luxury", description: "Private yachts, premium vehicles and exclusive bay access from the port." },
  { id: "hidden-gem", label: "Hidden Gem", shortLabel: "Hidden Gem", description: "A rewarding alternative away from the busiest fortress trail queues." },
  { id: "best-value", label: "Best Value", shortLabel: "Best Value", description: "Strong sightseeing per euro when budget matters as much as timing." },
  { id: "best-short-port", label: "Best for Short Port Calls", shortLabel: "Short Port", description: "Realistic when your ship is in Kotor for under seven usable hours." },
];

export function getEditorialLabel(id: EditorialCategory): string {
  return EDITORIAL_CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
`,
);

w(
  "homepage.ts",
  `import type { FAQ, VisitorType, ExperienceCard } from "./types";

export const visitorTypes: VisitorType[] = [
  {
    id: "port-day",
    label: "I'm visiting Kotor for the day on a cruise",
    shortLabel: "Port day",
    description: "You're calling at Kotor for the day. Find shore excursions, planning guides and a realistic port-day itinerary from the Port of Kotor.",
    href: "/shore-excursions",
    cta: "Plan my port day",
  },
  {
    id: "first-time",
    label: "It's my first time in Kotor",
    shortLabel: "First visit",
    description: "Fortress or Perast? Our first-timer guides and comparison pages help you choose confidently.",
    href: "/guides/kotor-for-first-time-visitors",
    cta: "First-timer guide",
  },
  {
    id: "independent",
    label: "I prefer to explore independently",
    shortLabel: "Independent",
    description: "Walk to the Sea Gate, explore Old Town lanes, manage your own return — when DIY beats a ship tour.",
    href: "/guides/independent-kotor-guide",
    cta: "Independent guide",
  },
  {
    id: "planner",
    label: "I want a personalised itinerary",
    shortLabel: "Custom plan",
    description: "Tell us your hours ashore, interests and budget — get a tailored Kotor plan with return-to-ship timing.",
    href: "/cruise-planner",
    cta: "Use the planner",
  },
];

export interface HomeSection {
  slug: string;
  number: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}

export const experienceCards: ExperienceCard[] = [
  {
    slug: "medieval-history",
    title: "Medieval History",
    description: "Venetian walls, St Tryphon Cathedral and maritime museums — UNESCO Kotor from the cruise port.",
    href: "/guides/kotor-old-town-guide",
    cta: "Explore Old Town",
    imageKey: "medieval",
  },
  {
    slug: "bay-cruises",
    title: "Bay Cruises",
    description: "Perast baroque waterfront, Our Lady of the Rocks and fjord-like Bay of Kotor boat trips.",
    href: "/guides/perast-guide",
    cta: "Explore the bay",
    imageKey: "bay",
  },
  {
    slug: "blue-cave",
    title: "Blue Cave",
    description: "Speedboat to Plava Špilja — luminous blue swimming and Adriatic coastal adventure.",
    href: "/guides/blue-cave-guide",
    cta: "Explore Blue Cave",
    imageKey: "blue-cave",
  },
  {
    slug: "scenic-mountains",
    title: "Scenic Mountains",
    description: "Lovćen National Park, Kotor Serpentine hairpins and Njegoš Mausoleum panoramas.",
    href: "/guides/lovcen-national-park-guide",
    cta: "Explore mountains",
    imageKey: "mountains",
  },
  {
    slug: "food-wine",
    title: "Food & Wine",
    description: "Njeguški pršut, Adriatic seafood and Vranac wine — Montenegrin flavours in the Old Town.",
    href: "/guides/montenegro-food-wine-guide",
    cta: "Taste Montenegro",
    imageKey: "food",
  },
  {
    slug: "private-touring",
    title: "Private Touring",
    description: "Private vehicles and yachts — custom fortress, Perast or Lovćen routing at your pace.",
    href: "/shore-excursions/private-kotor-tour",
    cta: "Go private",
    imageKey: "private",
  },
];

export const coreSections: HomeSection[] = [
  { slug: "shore-excursions", number: "01", title: "Shore Excursions", description: "Perast, fortress, Old Town and Blue Cave — cruise-timed from Port of Kotor.", href: "/shore-excursions", cta: "Browse excursions" },
  { slug: "guides", number: "02", title: "Kotor Planning Guides", description: "Authority guides for Old Town, fortress, bay trips, food and every type of passenger.", href: "/guides", cta: "Read guides" },
  { slug: "cruise-port-guide", number: "03", title: "Kotor Cruise Port Guide", description: "Port layout, walking to Sea Gate, tender operations and practical arrival advice.", href: "/cruise-port-guide", cta: "Port guide" },
  { slug: "cruise-planner", number: "04", title: "Kotor Cruise Planner", description: "Answer a few questions — get a tailored itinerary with return-to-ship confidence.", href: "/cruise-planner", cta: "Start planning" },
  { slug: "compare", number: "05", title: "Compare Options", description: "Blue Cave vs Perast, fortress climb, DIY vs guided — honest comparisons.", href: "/compare/blue-cave-vs-perast", cta: "Compare options" },
  { slug: "ship-schedules", number: "06", title: "Cruise Ship Schedules", description: "See which ships call at Kotor and plan around published arrival and departure times.", href: "/ship-schedules/kotor", cta: "View schedules" },
  { slug: "one-day", number: "07", title: "One Day in Kotor", description: "Hour-by-hour sample itineraries from gangway to all-aboard.", href: "/guides/one-day-in-kotor", cta: "One-day guide" },
  { slug: "faq", number: "08", title: "FAQ", description: "Kotor cruise port questions answered — timing, taxis, excursions and return buffers.", href: "/faq", cta: "Read FAQs" },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "How far is Kotor Old Town from the cruise port?",
      answer: "About 400 metres — 5–10 minutes on foot to the Sea Gate or 2–3 minutes by taxi.",
    },
    {
      question: "Can I climb the fortress on a Kotor port day?",
      answer: "Yes on calls of 6+ usable hours. Allow 2–2.5 hours for the climb plus Old Town time, with a 60–90 minute return buffer.",
    },
    {
      question: "Should I book a shore excursion or explore independently?",
      answer: "Old Town is excellent for independent walks. Perast, Lovćen and Blue Cave benefit from pre-booked tours — see our DIY vs guided comparison.",
    },
    {
      question: "What is the best Kotor excursion for first-timers?",
      answer: "Kotor, Perast & Our Lady of the Rocks on 7+ hour calls — or a focused Old Town walk on shorter calls. See our first-timer guide.",
    },
    {
      question: "Where do cruise ships dock in Kotor?",
      answer: "At the Port of Kotor, walking distance to the Old Town. Some vessels tender when berths are full — confirm on your cruise app.",
    },
  ];
}
`,
);

w(
  "schedules.ts",
  `import type { ScheduleEntry, ShipSchedulePort } from "./types";
import {
  filterEntriesByMonth,
  filterEntriesByYear,
  getMonthsWithEntries,
  type ScheduleYear,
} from "@/lib/schedule-utils";
import kotorSchedule from "./imported-schedules/kotor.json";

const SCHEDULE_FAQS = [
  {
    question: "How accurate are Kotor cruise ship schedules?",
    answer:
      "Schedules are compiled from published timetables and updated periodically. Times and berths can change — confirm with your cruise line before booking excursions.",
  },
  {
    question: "How far is Old Town from the cruise port?",
    answer:
      "About 400 metres — 5–10 minutes on foot to the Sea Gate. Allow extra time when multiple ships share the bay.",
  },
  {
    question: "Can I climb the fortress on a short port call?",
    answer:
      "Calls under 6 usable hours are tight — choose Old Town only or a short walking tour. Standard 8–11 hour calls suit fortress and bay excursions.",
  },
];

const SCHEDULE_TIPS = [
  "Check how many ships share your port day before booking fortress or bay excursions",
  "Start fortress climbs before 10:00 on multi-ship days",
  "Allow 60–90 minute return buffer from Perast to the port",
  "Be on deck for the Bay of Kotor sail-in — it is spectacular",
];

export const schedulePorts: ShipSchedulePort[] = [
  {
    slug: "kotor",
    name: "Kotor",
    country: "Montenegro",
    seoTitle: "Kotor Cruise Ship Schedule 2026",
    metaDescription:
      "Kotor cruise ship schedule — see which ships call at the Port of Kotor and plan shore excursions around published arrival and departure times.",
    intro:
      "Kotor is a highlight of Adriatic and Eastern Mediterranean itineraries. Check scheduled arrivals and departures before booking fortress, Perast or Blue Cave excursions.",
    description: "Montenegro's fjord-like bay cruise gateway — UNESCO Old Town at the port.",
    scheduleOverview:
      "Peak cruise traffic April through October, with heaviest calls June to September on Adriatic itineraries.",
    planningTips: SCHEDULE_TIPS,
    faqs: SCHEDULE_FAQS,
  },
];

const scheduleData: Record<string, ScheduleEntry[]> = {
  kotor: kotorSchedule as ScheduleEntry[],
};

export function getSchedulePortBySlug(slug: string): ShipSchedulePort | undefined {
  return schedulePorts.find((p) => p.slug === slug);
}

export function getAllSchedulePortSlugs(): string[] {
  return schedulePorts.map((p) => p.slug);
}

export function getScheduleEntries(slug: string): ScheduleEntry[] {
  return scheduleData[slug] ?? [];
}

export function getScheduleEntryCount(slug: string): number {
  return getScheduleEntries(slug).length;
}

export function getScheduleEntriesForYear(slug: string, year: ScheduleYear): ScheduleEntry[] {
  return filterEntriesByYear(getScheduleEntries(slug), year);
}

export function getScheduleEntriesForMonth(slug: string, monthKey: string): ScheduleEntry[] {
  return filterEntriesByMonth(getScheduleEntries(slug), monthKey);
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
  title: "Kotor Cruise Port Guide",
  subtitle: "Port of Kotor terminal, walking to Old Town, tender operations and return-to-ship timing for cruise passengers.",
  terminals: [
    {
      name: "Port of Kotor Main Berth",
      quay: "Commercial cruise berth below Old Town walls",
      usedBy: "Most large ships — MSC, Celebrity, Norwegian, Viking and others on Adriatic itineraries",
      cityAccess: "5–10 min walk to Sea Gate; taxis at terminal exit; excursion coaches at gangway",
    },
    {
      name: "Tender operations",
      quay: "Anchorage in the Bay of Kotor",
      usedBy: "Occasional overflow when berths are full or for very large vessels",
      cityAccess: "Tender to port area then walk to Old Town — add 20–30 minutes to your planning each way",
    },
    {
      name: "Perast boat piers",
      quay: "Small-boat departures — not cruise berth",
      usedBy: "Our Lady of the Rocks boats — reach via excursion or taxi to Perast from Kotor",
      cityAccess: "30–40 min drive from Kotor port to Perast for bay excursions",
    },
  ] as Terminal[],
  sections: [
    {
      heading: "Where cruise ships dock in Kotor",
      paragraphs: [
        "Cruise ships dock at the Port of Kotor at the southeastern end of the Bay of Kotor, directly below the UNESCO Old Town walls. Unlike ports where heritage sits an hour inland, Kotor's medieval core is genuinely walkable from the gangway.",
        "The Bay of Kotor arrival — sailing past Herceg Novi, Perast and the narrow Verige Strait — is one of Europe's most spectacular cruise approaches. Plan to be on an upper deck 30–60 minutes before docking.",
        "Kotor appears on Adriatic, Greek Isles and Eastern Mediterranean itineraries from April through October, with heaviest traffic June to September.",
      ],
    },
    {
      heading: "Getting from the port to Kotor Old Town",
      paragraphs: [
        "The Sea Gate is 400 metres from the main berth — roughly 5–10 minutes on foot along the flat harbour promenade, or 2–3 minutes by taxi (€3–6).",
        "Excursion coaches and minivans meet passengers at the terminal exit with line flags or name boards. For Perast, Lovćen and Blue Cave you need organised transport — walking is not practical.",
        "The fortress trail starts inside the walls behind St Tryphon Cathedral — buy tickets at the kiosk, not at the cruise terminal.",
      ],
    },
    {
      heading: "Facilities and practicalities",
      paragraphs: [
        "The terminal offers toilets, seating and a tourist information desk. ATMs exist but can run empty on busy multi-ship days — withdraw euros on the ship if needed.",
        "Currency is the euro. Montenegrin is the official language; English is widely spoken in tourist areas. Download offline maps — terminal Wi-Fi is unreliable.",
        "Kotor is compact and generally safe. Watch polished limestone when wet and belongings in crowded Arms Square when multiple ships are in port.",
      ],
    },
    {
      heading: "Return-to-ship timing",
      paragraphs: [
        "Confirm all-aboard time — usually 30–60 minutes before departure. Keep a 60–90 minute buffer beyond your expected travel time, especially returning from Perast when road traffic builds.",
        "Independent walkers should be at the port 90 minutes before all-aboard. Ship excursions carry delay guarantees; reputable independent operators track departure but will not wait if you separate from the group.",
        "Tender operations require an earlier return — allow extra margin to queue for the tender boat back to your ship.",
      ],
    },
  ] as PortGuideSection[],
  faqs: [
    {
      question: "How far is Kotor Old Town from the cruise port?",
      answer: "About 400 metres — 5–10 minutes on foot to the Sea Gate or 2–3 minutes by taxi.",
    },
    {
      question: "Can I walk from the cruise ship to Kotor Old Town?",
      answer: "Yes — follow the harbour promenade clockwise to the Sea Gate. Flat, scenic and straightforward.",
    },
    {
      question: "Do cruise ships tender in Kotor?",
      answer: "Occasionally when berths are full. Tendering adds 20–30 minutes each way — confirm on your cruise app the evening before.",
    },
    {
      question: "How much time do I need to return from Perast?",
      answer: "Allow 30–40 minutes drive from Perast to the port plus a 60–90 minute buffer before all-aboard. Afternoon bay traffic can add time.",
    },
  ] as FAQ[],
};

export const terminals = portGuideContent.terminals;
export const portGuideSections = portGuideContent.sections;
export const portGuideFaqs = portGuideContent.faqs;
`,
);

w(
  "faqs.ts",
  `import type { FAQ } from "./types";
import { getHomepageFaqs } from "./homepage";

export const extraFaqs: FAQ[] = [
  {
    question: "Where do cruise ships dock in Kotor?",
    answer:
      "At the Port of Kotor, walking distance to the Old Town Sea Gate. Some vessels tender when berths are full — check your cruise app.",
  },
  {
    question: "How long does the fortress climb take?",
    answer:
      "Roughly 1,350 steps — 60–90 minutes up and 30–45 minutes down at a moderate pace. Allow 2–2.5 hours total including Old Town access.",
  },
  {
    question: "Can I visit Kotor Old Town without a shore excursion?",
    answer:
      "Yes — walk 5–10 minutes to the Sea Gate. Fortress tickets at the trailhead; Perast needs taxi or tour.",
  },
  {
    question: "What is the best Kotor excursion for first-time visitors?",
    answer:
      "Kotor, Perast & Our Lady of the Rocks on 7+ hour calls — or Old Town walking tour on shorter calls.",
  },
  {
    question: "Should I book excursions through my cruise line?",
    answer:
      "Ship tours guarantee the vessel waits if their excursion is late. Reputable independent operators track all-aboard with buffers — often smaller groups and lower prices.",
  },
  {
    question: "Is a Kotor port day long enough for fortress and Perast?",
    answer:
      "Tight on standard 8-hour calls — choose fortress OR Perast as your second anchor. Highlights tours sequence sights on longer calls.",
  },
  {
    question: "How early should I return to the port from Perast?",
    answer:
      "Allow 30–40 minutes drive plus 60–90 minutes before all-aboard. Book excursions with ship-tracking for safest timing.",
  },
  {
    question: "What currency is used in Kotor?",
    answer:
      "The euro. Cards work in most Old Town establishments; carry cash for taxis, small vendors and church donations.",
  },
  {
    question: "Are Kotor shore excursions suitable for limited mobility?",
    answer:
      "Old Town cobbles and fortress steps are challenging. Perast waterfront, bay boat trips and private tours with vehicle drops work better than fortress climbs.",
  },
  {
    question: "When is peak cruise season in Kotor?",
    answer:
      "April through October, with heaviest ship traffic June to September. Book Perast and fortress excursions before sailing in July and August.",
  },
];

export function getAllFaqs(): FAQ[] {
  return [...getHomepageFaqs(), ...extraFaqs];
}
`,
);

// ─── CRUISE PLANNING (Mediterranean internal linking) ────────────────────────

const MED_BASE =
  "Kotor sits on most Adriatic and Eastern Mediterranean cruise itineraries — often paired with Dubrovnik, Corfu, Venice and Greek ports. Plan each port day using dedicated authority guides rather than generic cruise forums.";

const cruisePlanning = [
  {
    s: "mediterranean-cruise-planner",
    title: "Mediterranean Cruise Planner",
    seo: "Mediterranean Cruise Planner — Port-by-Port Shore Excursion Guides",
    meta: "Plan your Mediterranean cruise holistically — Kotor, Dubrovnik, Corfu, Greek Isles and Western Med authority guides linked for multi-port itineraries.",
    tag: "One itinerary, many ports — link to the right guide at every stop.",
    ov: "Mediterranean cruises string together markedly different ports — walkable Kotor, distant Rome, island Corfu. Our network links authoritative port guides so you plan each day correctly.",
    b1: MED_BASE,
    b2: "Use Kotor for Bay of Kotor and fortress planning; Dubrovnik for walled-city and Lokrum guides; Corfu for Paleokastritsa and Achilleion. Match excursion booking to each port's geography — not one-size-fits-all ship tours.",
    b3: "Book independent excursions per port where walkability and timing favour it — Kotor and Dubrovnik Old Towns reward DIY; Rome and Lovćen need organised transport.",
    hi: ["Port-specific authority guides", "Linked Adriatic neighbours", "Realistic per-port timing"],
    ti: ["Plan each port separately", "Book early for peak July slots", "Keep 60–90 min buffers everywhere"],
    q1: "Is this site only for Kotor?", a1: "Kotor is our focus — we link to Dubrovnik, Corfu and broader Med planning resources.",
    q2: "Where is the main Med planner?", a2: "https://mediterraneancruiseplanner.com — hub for multi-port itinerary tools.",
    rel: ["dubrovnik-shore-excursions", "corfu-shore-excursions", "adriatic-cruise-ports"],
    img: "city",
  },
  {
    s: "dubrovnik-shore-excursions",
    title: "Dubrovnik Shore Excursions — Adriatic Neighbour",
    seo: "Dubrovnik Shore Excursions — Cruise Port Guide (External)",
    meta: "Planning Dubrovnik on the same cruise as Kotor? Authority guide for Gruž port, city walls, Lokrum and Old Town at dubrovnikshoreexcursion.com.",
    tag: "Kotor today, Dubrovnik tomorrow — plan both Adriatic gems correctly.",
    ov: "Dubrovnik and Kotor often appear on the same Adriatic itinerary — but they demand different planning. Dubrovnik's Old Town is 2.5 km from Gruž port; Kotor's is 400 metres from the gangway.",
    b1: MED_BASE,
    b2: "Dubrovnik highlights: city walls circuit, Mount Srđ cable car, Lokrum Island boat and Game of Thrones locations. Allow 10–15 minutes taxi from Gruž to Pile Gate — not walkable from the terminal like Kotor.",
    b3: "Full authority site: https://dubrovnikshoreexcursion.com — shore excursions, comparisons, ship schedules and cruise planner for Gruž port days.",
    hi: ["Gruž port 2.5 km from walls", "City walls and cable car", "Lokrum island boat trips"],
    ti: ["Do not assume Kotor timing fits Dubrovnik", "Pre-book wall tickets in peak season", "Allow longer port transfers"],
    recs: [
      { c: "editors-choice", t: "Dubrovnik Shore Excursions", d: "Full Dubrovnik cruise planning authority.", h: "https://dubrovnikshoreexcursion.com" },
      { c: "best-historic", t: "City Walls Guide", d: "Dubrovnik ramparts from Gruž.", h: "https://dubrovnikshoreexcursion.com/guides/walking-city-walls" },
    ],
    rel: ["corfu-shore-excursions", "adriatic-cruise-ports", "mediterranean-cruise-planner"],
    img: "old-town",
  },
  {
    s: "corfu-shore-excursions",
    title: "Corfu Shore Excursions — Ionian Adriatic",
    seo: "Corfu Shore Excursions — Cruise Port Guide (External)",
    meta: "Calling at Corfu on your Mediterranean cruise? Authority guide for Paleokastritsa, Old Town and Achilleion at corfushoreexcursion.com.",
    tag: "Ionian elegance meets Adriatic drama — Corfu needs its own plan.",
    ov: "Corfu pairs UNESCO Old Town walkability with island drives to Paleokastritsa beaches and Achilleion Palace — different geography from fjord-like Kotor.",
    b1: MED_BASE,
    b2: "Corfu ships dock at Neo Limani — 2 km from Old Town (5–10 min taxi). Highlights: Paleokastritsa coves, Achilleion, Kanoni viewpoint and Liston promenade.",
    b3: "Full authority site: https://corfushoreexcursion.com — excursions, comparisons and port guides for Ionian cruise days.",
    hi: ["Neo Limani cruise terminal", "Paleokastritsa beaches", "Achilleion Palace"],
    ti: ["Allow drive time to Paleokastritsa", "Old Town walkable like Kotor", "Book coaches before peak season"],
    recs: [
      { c: "editors-choice", t: "Corfu Shore Excursions", d: "Full Corfu cruise planning authority.", h: "https://corfushoreexcursion.com" },
      { c: "best-coastal", t: "Paleokastritsa Guide", d: "Turquoise coves from Neo Limani.", h: "https://corfushoreexcursion.com/guides/paleokastritsa-from-cruise-port" },
    ],
    rel: ["dubrovnik-shore-excursions", "adriatic-cruise-ports", "mediterranean-cruise-planner"],
    img: "beach",
  },
  {
    s: "adriatic-cruise-ports",
    title: "Adriatic Cruise Ports Hub",
    seo: "Adriatic Cruise Ports — Kotor, Dubrovnik & Corfu Planning Hub",
    meta: "Compare Adriatic cruise ports Kotor, Dubrovnik and Corfu — walkability, excursions and realistic timing on Eastern Mediterranean itineraries.",
    tag: "The Adriatic's big three port days — how they differ and how to plan each.",
    ov: "Eastern Mediterranean and Adriatic itineraries typically include two or three of Kotor, Dubrovnik and Corfu. Each port rewards different excursion choices — do not repeat the same planning logic.",
    b1: MED_BASE,
    b2: "Kotor: walkable Old Town, fortress climb, Perast bay cruises. Dubrovnik: taxi-dependent walls and cable car, Lokrum boats. Corfu: Old Town walk plus Paleokastritsa drives. Match energy levels across consecutive sea days.",
    b3: "Link to each authority: kotorshoreexcursion.com (this site), dubrovnikshoreexcursion.com, corfushoreexcursion.com — plus https://mediterraneancruiseplanner.com for full-itinerary tools.",
    hi: ["Kotor — fjord arrival, walkable walls", "Dubrovnik — ramparts and cable car", "Corfu — beaches and palaces"],
    ti: ["Plan each port separately", "Vary active and relaxed days", "Book bay trips in calm weather"],
    rel: ["dubrovnik-shore-excursions", "corfu-shore-excursions", "mediterranean-cruise-planner"],
    img: "boat",
  },
  {
    s: "kotor-to-dubrovnik-itinerary",
    title: "Kotor & Dubrovnik on the Same Cruise",
    seo: "Kotor and Dubrovnik Same Cruise — How to Plan Both Port Days",
    meta: "Your cruise visits both Kotor and Dubrovnik — how to plan each port day differently for fortress, walls, Perast and Lokrum.",
    tag: "Two walled UNESCO cities, one week — avoid duplicating the same day twice.",
    ov: "Passengers on Adriatic loops often call at Kotor and Dubrovnik within the same sailing. Both offer walled Old Towns — but Kotor's port is walkable while Dubrovnik needs taxi time from Gruž.",
    b1: MED_BASE,
    b2: "Suggested split: Kotor day for Perast bay cruise OR fortress climb; Dubrovnik day for city walls and cable car OR Lokrum. Doing full highlights at both ports back-to-back exhausts even fit travellers.",
    b3: "Cross-link planning: our Kotor Editor's Choice Perast excursion pairs well before a Dubrovnik walls day — vary water and walking focuses.",
    hi: ["Kotor — bay or fortress anchor", "Dubrovnik — walls or cable car", "Rest day between if possible"],
    ti: ["Do not climb Kotor fortress AND Dubrovnik walls consecutive days unless very fit", "Book both ports before sailing", "Use each city's authority site"],
    recs: [
      { c: "editors-choice", t: "Kotor Perast Excursion", d: "Bay focus on Kotor day.", h: "/shore-excursions/kotor-perast-our-lady-of-the-rocks" },
      { c: "editors-choice", t: "Dubrovnik Highlights", d: "Walls focus on Dubrovnik day.", h: "https://dubrovnikshoreexcursion.com/shore-excursions/dubrovnik-highlights" },
    ],
    rel: ["dubrovnik-shore-excursions", "adriatic-cruise-ports", "one-day-in-kotor"],
    img: "city",
  },
  {
    s: "eastern-mediterranean-port-guide",
    title: "Eastern Mediterranean Cruise Ports",
    seo: "Eastern Mediterranean Cruise Ports — Planning Guide",
    meta: "Eastern Mediterranean cruise ports beyond Kotor — Dubrovnik, Corfu, Santorini, Mykonos and Venice linked for itinerary planning.",
    tag: "Beyond Montenegro — link to the right guide at every Eastern Med stop.",
    ov: "Eastern Mediterranean sailings combine Adriatic gems with Greek islands and sometimes Venice. Each port has distinct transfer realities — Kotor and Corfu Old Towns are walkable; Rome and Florence are not.",
    b1: MED_BASE,
    b2: "Authority partners: Dubrovnik (dubrovnikshoreexcursion.com), Corfu (corfushoreexcursion.com), broader Med hub (mediterraneancruiseplanner.com). Greek island guides vary — confirm walkability per port.",
    b3: "Book key ticketed sights before sailing — Dubrovnik walls, Vatican if Rome appears, and popular Kotor bay excursions in July.",
    hi: ["Adriatic walkable ports", "Greek island tender alerts", "Hub linking all authorities"],
    ti: ["Read each port's dedicated guide", "Never assume Rome timing fits Kotor", "Build rest days into planning"],
    rel: ["mediterranean-cruise-planner", "adriatic-cruise-ports", "dubrovnik-shore-excursions"],
    img: "city",
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
`,
);

w("imported-schedules/kotor.json", "[]\n");

console.log("Kotor data generation complete.");
