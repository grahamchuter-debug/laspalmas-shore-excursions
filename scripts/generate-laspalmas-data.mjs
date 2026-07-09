#!/usr/bin/env node
/**
 * Generates Las Palmas de Gran Canaria content data files from structured definitions.
 * Run: node scripts/generate-laspalmas-data.mjs
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
  "Cruise ships dock at Muelle Santa Catalina in Las Palmas de Gran Canaria, the island's main cruise terminal near Santa Catalina park and the city waterfront. Vegueta historic quarter and Triana shopping district are roughly 15-20 minutes by taxi or local bus. Island highlights like Roque Nublo, Maspalomas dunes and Bandama caldera require organised coach transfers — typically 45-90 minutes each way depending on destination. Confirm your all-aboard time and keep a 60-90 minute buffer before departure.";

const GT = `[
      { method: "Walk from cruise terminal", detail: "Flat waterfront route toward Santa Catalina park, Las Canteras promenade and city bus stops.", time: "10-20 min", cost: "Free" },
      { method: "Taxi from terminal", detail: "Metered taxis at the terminal rank — to Vegueta, Triana, Las Canteras or coach meeting points.", time: "10-20 min to centre", cost: "EUR 8-15" },
      { method: "Local bus", detail: "Global bus network from near terminal — useful for Las Canteras beach and central districts.", time: "15-30 min", cost: "EUR 1.40-3" },
      { method: "Shore excursion coach", detail: "Licensed operator with guide — island tours to Roque Nublo, dunes, caldera or city highlights timed to all-aboard.", time: "Door-to-door", cost: "Tour price" },
    ]`;

const PORT_LOGISTICS =
  "Cruise ships dock at Muelle Santa Catalina in Las Palmas de Gran Canaria, the island's main cruise terminal near Santa Catalina park and the city waterfront. Vegueta historic quarter and Triana shopping district are roughly 15-20 minutes by taxi or local bus. Island highlights like Roque Nublo, Maspalomas dunes and Bandama caldera require organised coach transfers — typically 45-90 minutes each way depending on destination. Confirm your all-aboard time and keep a 60-90 minute buffer before departure.";

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
    `${cfg.optionA} vs ${cfg.optionB} — Las Palmas Cruise Passengers`;
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
    faqs: [${faq(cfg.q1 ?? "Is this relevant on a Las Palmas port day?", cfg.a1 ?? "Yes — Gran Canaria sits on Atlantic and Canary Islands cruise itineraries year-round with strong winter sun appeal.")}, ${faq(cfg.q2 ?? "Where can I plan other ports?", cfg.a2 ?? "See our cruise planning hub for Tenerife, Lanzarote, Madeira and multi-port Atlantic itineraries.")}]${recs},
    relatedSlugs: [${cfg.rel.map((s) => `"${s}"`).join(", ")}],
    imageKey: "${cfg.img}",
    hubPath: "/plan-your-cruise-holiday",
  }`;
}

// ─── HIGHLIGHTS (AttractionPage guides) ─────────────────────────────────────

const attractions = [
  {
    slug: "roque-nublo-from-cruise-ship",
    name: "Roque Nublo",
    title: "Roque Nublo from Las Palmas Cruise Port",
    seoTitle: "Roque Nublo from Las Palmas Cruise Port — Gran Canaria Mountain Guide",
    meta: "Visit Roque Nublo from Las Palmas cruise port with realistic coach times, walking advice and return-to-ship strategy for Gran Canaria's iconic volcanic monolith.",
    tagline: "Gran Canaria's sacred volcanic sentinel — dramatic highland scenery above the clouds.",
    overview:
      "Roque Nublo is Gran Canaria's defining natural landmark: an 80-metre basalt monolith rising from a high-altitude plateau at roughly 1,800 metres. For cruise passengers it represents the island at its most dramatic — volcanic, Atlantic and utterly unlike a generic beach port.",
    body2:
      "From Muelle Santa Catalina, expect roughly 45-60 minutes each way by coach to the Roque Nublo parking area, then a 30-45 minute walk on a well-maintained trail with moderate incline. On clear days the views sweep across pine forests, neighbouring peaks and, occasionally, Tenerife's Teide on the horizon.",
    body3:
      "This is best handled as a dedicated shore excursion rather than independent travel. Weather at altitude can differ sharply from the coast — carry layers, secure footwear and water. Most operators build conservative return buffers; confirm your all-aboard time before booking.",
    distance: "45 km inland to trailhead",
    travel: "45-60 min each way by coach plus 30-45 min walk",
    timeNeeded: "4-5.5 hours door-to-door",
    highlights: ["Iconic volcanic monolith", "High-altitude pine forest scenery", "Panoramic island views", "UNESCO Biosphere Reserve landscape"],
    tips: ["Wear layers — altitude is cooler than the port", "Non-slip shoes essential on volcanic paths", "Book a dedicated excursion for return confidence"],
    faqs: [
      ["Is Roque Nublo worth it from a cruise ship?", "Yes on standard or long calls if scenery is your priority — it is Gran Canaria's most memorable natural sight."],
      ["Can I reach Roque Nublo independently?", "Technically possible by bus and taxi but impractical on a cruise day; organised tours are strongly recommended."],
    ],
    related: ["bandama-caldera-guide", "maspalomas-dunes-from-las-palmas-cruise-port", "is-roque-nublo-worth-it-from-cruise-ship"],
    excursion: "gran-canaria-and-roque-nublo",
  },
  {
    slug: "bandama-caldera-guide",
    name: "Bandama Caldera",
    title: "Bandama Caldera Guide from Las Palmas Cruise Port",
    seoTitle: "Bandama Caldera from Las Palmas Cruise Port — Volcanic Crater Guide",
    meta: "Explore Bandama caldera from Las Palmas cruise port with transfer times, crater-floor walking advice and volcanic landscape context.",
    tagline: "A vast volcanic crater at the island's green heart — geology you can walk into.",
    overview:
      "Bandama is one of Gran Canaria's most accessible volcanic wonders: a massive caldera with a fertile crater floor planted with vines and palms, rim viewpoints and a sense of standing inside the island's geological past.",
    body2:
      "The caldera sits roughly 20 km south of Las Palmas city — typically 30-40 minutes by coach or taxi from the cruise terminal. Most shore excursions combine the rim viewpoint with a short descent or crater-floor orientation. The landscape shifts from urban coast to green volcanic interior within minutes.",
    body3:
      "Bandama pairs well with a city morning or as part of a broader island highlights route. It demands less altitude walking than Roque Nublo and suits passengers who want volcanic drama without a full mountain day.",
    distance: "20 km from terminal",
    travel: "30-40 min by coach or taxi",
    timeNeeded: "2-3 hours on site",
    highlights: ["Volcanic crater rim views", "Crater-floor agriculture and vines", "Accessible volcanic geology", "Green interior landscape contrast"],
    tips: ["Combine with Vegueta for a city-plus-volcano day", "Bring sun protection on exposed rim paths", "Ideal for moderate fitness levels"],
    faqs: [
      ["How does Bandama compare to Roque Nublo?", "Bandama is closer, lower and easier; Roque Nublo is higher and more dramatic."],
      ["Is the crater floor walkable?", "Yes on maintained paths, though some sections are steep — check mobility requirements with your operator."],
    ],
    related: ["roque-nublo-from-cruise-ship", "maspalomas-dunes-from-las-palmas-cruise-port", "bandama-caldera-or-maspalomas-dunes"],
    excursion: "bandama-caldera-tour",
  },
  {
    slug: "vegueta-walking-guide",
    name: "Vegueta Historic Quarter",
    title: "Vegueta Walking Guide from Las Palmas Cruise Port",
    seoTitle: "Vegueta Walking Guide — Historic Las Palmas from Cruise Port",
    meta: "Walk Vegueta from Las Palmas cruise port with cathedral priorities, colonial architecture, tapas stops and practical taxi or bus advice.",
    tagline: "Gran Canaria's colonial soul — cobbled lanes, cathedral grandeur and Atlantic history.",
    overview:
      "Vegueta is the historic heart of Las Palmas: a UNESCO-listed quarter of cobbled streets, the Cathedral of Santa Ana, Casa de Colón and balconied houses that tell the story of Atlantic trade and Canary Islands identity.",
    body2:
      "From Muelle Santa Catalina, Vegueta is roughly 15-20 minutes by taxi (EUR 8-12) or 25-35 minutes by bus. The quarter is compact and walkable once you arrive. Start at the cathedral square, explore the Colón house museum if time allows, then drift through side lanes toward Triana for shopping and cafés.",
    body3:
      "Vegueta works as a half-day anchor for independent passengers or as the core of a guided city tour. Sunday mornings can feel quieter; weekday lunch hours bring local life to plaza terraces.",
    distance: "4 km from terminal",
    travel: "15-20 min taxi or 25-35 min bus",
    timeNeeded: "2-3 hours",
    highlights: ["Cathedral of Santa Ana", "Casa de Colón", "Colonial balconied architecture", "Historic plazas and tapas bars"],
    tips: ["Start at cathedral square for orientation", "Combine with Triana across the ravine", "Wear comfortable shoes on cobbles"],
    faqs: [
      ["Is Vegueta walkable from the cruise port?", "Not directly — you need a taxi or bus, but the quarter itself is very walkable."],
      ["How much time does Vegueta need?", "Allow 2-3 hours for a satisfying visit including a café or tapas stop."],
    ],
    related: ["canarian-food-guide", "las-canteras-beach-from-cruise-port", "independent-las-palmas-guide"],
    excursion: "vegueta-historic-las-palmas-tour",
  },
  {
    slug: "las-canteras-beach-from-cruise-port",
    name: "Las Canteras Beach",
    title: "Las Canteras Beach from Las Palmas Cruise Port",
    seoTitle: "Las Canteras Beach from Las Palmas Cruise Port — Urban Beach Guide",
    meta: "Visit Las Canteras beach from Las Palmas cruise port with walking routes, promenade stops, swimming advice and return timing.",
    tagline: "One of Europe's great urban beaches — golden sand, reef-protected swimming and city energy.",
    overview:
      "Playa de Las Canteras is Las Palmas' living room: a 3 km crescent of golden sand backed by a lively promenade of restaurants, cafés and local life. For cruise passengers it offers an authentic Canarian city-beach experience without leaving town.",
    body2:
      "From the cruise terminal, Las Canteras is roughly 15-25 minutes on foot along the waterfront or 5-10 minutes by taxi. The natural reef (La Barra) creates calm swimming zones. The promenade (Paseo de Las Canteras) is ideal for a relaxed lunch with Atlantic views.",
    body3:
      "This is not a generic resort beach — it is a working city strand where locals surf, swim and meet. On short port calls, even a 90-minute promenade walk and coffee stop delivers strong value. On longer calls, combine with Vegueta for a full city day.",
    distance: "2 km from terminal",
    travel: "15-25 min walk or 5-10 min taxi",
    timeNeeded: "1.5-4 hours",
    highlights: ["Reef-protected swimming", "3 km urban promenade", "Local restaurants and cafés", "Sunset and photography opportunities"],
    tips: ["Walk the promenade even if you do not swim", "Reserve lunch on busy ship days", "Combine with Santa Catalina park near the terminal"],
    faqs: [
      ["Can I walk to Las Canteras from the cruise ship?", "Yes — a pleasant 15-25 minute waterfront walk for most passengers."],
      ["Is Las Canteras safe for swimming?", "Yes in designated zones; the reef creates calmer water than open Atlantic beaches."],
    ],
    related: ["best-beaches-near-las-palmas-cruise-port", "vegueta-walking-guide", "independent-las-palmas-guide"],
    excursion: "las-canteras-beach-day",
  },
  {
    slug: "maspalomas-dunes-from-las-palmas-cruise-port",
    name: "Maspalomas Dunes",
    title: "Maspalomas Dunes from Las Palmas Cruise Port",
    seoTitle: "Maspalomas Dunes from Las Palmas Cruise Port — Desert Beach Guide",
    meta: "Visit Maspalomas dunes from Las Palmas cruise port with coach transfer times, walking routes and comparison with city-based alternatives.",
    tagline: "Sahara-like dunes meeting the Atlantic — Gran Canaria's most surreal landscape.",
    overview:
      "The Maspalomas Dunes are a protected natural reserve where golden sand formations roll down to the ocean, creating a desert-meets-Atlantic landscape found nowhere else in Europe. They sit at the island's southern tip, far from the cruise port but worth the journey for scenery-first travellers.",
    body2:
      "From Muelle Santa Catalina, expect roughly 50-70 minutes each way by coach to the dunes area. Most excursions include walking time on the sand, viewpoints and sometimes a stop in nearby Playa del Inglés or the lighthouse zone. The landscape is exposed — sun protection and water are essential.",
    body3:
      "Maspalomas competes with Roque Nublo and Bandama for your single island anchor. Choose dunes for unique coastal desert scenery; choose Roque Nublo for mountain drama; choose Bandama for volcanic intimacy closer to the city.",
    distance: "55 km to dunes area",
    travel: "50-70 min each way by coach",
    timeNeeded: "4-5.5 hours door-to-door",
    highlights: ["Protected dune reserve", "Desert-Atlantic landscape contrast", "Photography and walking trails", "Southern coast character"],
    tips: ["Wear closed shoes — sand gets hot", "Bring water and sun protection", "Book a dedicated excursion for timing confidence"],
    faqs: [
      ["Is Maspalomas worth the transfer from Las Palmas port?", "Yes for scenery lovers on standard or long calls; less ideal on short port days."],
      ["Can I visit Maspalomas independently?", "Possible by bus but slow and risky for cruise timing — tours are safer."],
    ],
    related: ["roque-nublo-from-cruise-ship", "bandama-caldera-guide", "bandama-caldera-or-maspalomas-dunes"],
    excursion: "maspalomas-dunes-tour",
  },
  {
    slug: "canarian-food-guide",
    name: "Canarian Cuisine",
    title: "Canarian Food Guide for Las Palmas Cruise Passengers",
    seoTitle: "Canarian Food in Las Palmas — Cruise Passenger Guide to What to Order",
    meta: "What to eat in Las Palmas on a cruise day, from papas arrugadas and mojo to fresh fish, local coffee and practical lunch timing near the port.",
    tagline: "Volcanic soil, Atlantic catch and island pride on every plate.",
    overview:
      "Canarian food is one of the strongest reasons to explore Las Palmas beyond the beach. The island's cuisine blends Spanish tradition with African and Latin American influences, centred on local potatoes, mojo sauces, fresh fish and excellent coffee.",
    body2:
      "Priority dishes include papas arrugadas con mojo (wrinkled potatoes with sauce), sancocho (salted fish stew), fresh grilled cherne or vieja, gofio and bienmesabe for dessert. Tapas routes through Vegueta and Triana offer excellent value. Mercado del Puerto near the waterfront is ideal for a market lunch.",
    body3:
      "Canarian coffee culture is strong — look for local roasters in Triana and near Las Canteras. Wine from Gran Canaria's highland vineyards pairs well with cheese and grilled fish. Reserve lunch on multi-ship days.",
    distance: "City centre dining 10-20 min from terminal",
    travel: "Walkable or short taxi to dining districts",
    timeNeeded: "60-120 minutes",
    highlights: ["Papas arrugadas and mojo sauces", "Fresh Atlantic fish", "Mercado del Puerto", "Canarian coffee and wine"],
    tips: ["Try both red and green mojo", "Mercado del Puerto is ideal for casual lunch", "Leave time for coffee in Triana"],
    faqs: [
      ["Is Las Palmas good for food-focused port days?", "Excellent — one of the strongest food ports in the Canary Islands."],
      ["Where should I eat near the cruise terminal?", "Mercado del Puerto, Las Canteras promenade and Triana are all practical."],
    ],
    related: ["vegueta-walking-guide", "independent-las-palmas-guide", "one-day-in-gran-canaria"],
    excursion: "canarian-food-wine-tour",
  },
  {
    slug: "what-to-wear-in-gran-canaria",
    name: "What to Wear in Gran Canaria",
    title: "What to Wear in Gran Canaria on a Cruise Day",
    seoTitle: "What to Wear in Gran Canaria — Cruise Port Clothing Guide",
    meta: "Practical clothing advice for Gran Canaria cruise passengers covering coast, mountains, dunes and city walking in variable Atlantic conditions.",
    tagline: "Layers, sun protection and sensible shoes — the island has more climates than you expect.",
    overview:
      "Gran Canaria is marketed as eternal spring, but cruise passengers quickly discover microclimates: warm coast, cool highlands, windy dunes and cobbled city lanes. Packing smartly makes the difference between comfort and regret.",
    body2:
      "Coast and city: light layers, sun hat, comfortable walking shoes for Vegueta cobbles. Mountain (Roque Nublo, Bandama): add a fleece or light jacket, non-slip hiking shoes, wind layer. Dunes: closed shoes (sand gets hot), sun protection, light cover-up for wind.",
    body3:
      "Even in winter, UV is strong. Even in summer, highland excursions need warmth. One versatile daypack with layers beats a single beach outfit for Gran Canaria's miniature-continent geography.",
    distance: "N/A — packing guide",
    travel: "N/A",
    timeNeeded: "N/A",
    highlights: ["Layer strategy for microclimates", "Footwear by activity type", "Sun and wind protection", "City vs mountain vs dune packing"],
    tips: ["Pack a light rain layer year-round", "Non-slip shoes for volcanic paths", "Bring a daypack for island excursions"],
    faqs: [
      ["Do I need warm clothes in Gran Canaria?", "Yes for highland excursions — Roque Nublo can be 10-15°C cooler than the port."],
      ["Are sandals OK for a cruise port day?", "Fine for Las Canteras and city flat walking; not for Roque Nublo or dune trails."],
    ],
    related: ["roque-nublo-from-cruise-ship", "maspalomas-dunes-from-las-palmas-cruise-port", "one-day-in-gran-canaria"],
    excursion: "scenic-island-highlights-tour",
  },
  {
    slug: "best-las-palmas-shore-excursions",
    name: "Best Las Palmas Shore Excursions",
    title: "Best Las Palmas Shore Excursions — Editor's Ranking",
    seoTitle: "Best Las Palmas Shore Excursions — Editor's Guide for Cruise Passengers",
    meta: "Our editorial ranking of the best Las Palmas and Gran Canaria shore excursions including island highlights, city tours, food and private options.",
    tagline: "Editor-tested excursions ranked by impact, logistics and return confidence.",
    overview:
      "Gran Canaria offers more variety per port day than almost any cruise call in Europe. This guide ranks the strongest shore excursions by passenger type, call length and interest — from volcanic highlands to colonial streets and Atlantic beaches.",
    body2:
      "Editor's Choice primary: A Taste of Gran Canaria — the best all-round introduction combining scenery, villages, food culture and volcanic landscapes. Editor's Choice secondary: Gran Canaria and Roque Nublo — for passengers who want maximum mountain drama.",
    body3:
      "City-focused alternatives include Vegueta Historic Tour and Half-Day Las Palmas. Short-call saviours include Short Port Call Tour. Private Gran Canaria Tour suits mixed groups wanting custom pacing.",
    distance: "Varies by excursion",
    travel: "City tours 15-30 min; island tours 45-90 min each way",
    timeNeeded: "3-7.5 hours depending on tour",
    highlights: ["Editor's Choice rankings", "Excursion matching by call length", "Return confidence ratings", "Interest-based recommendations"],
    tips: ["Book Editor's Choice tours early on popular sailings", "Match excursion to call length not wish list", "Keep one weather-flexible backup"],
    faqs: [
      ["What is the single best Las Palmas shore excursion?", "A Taste of Gran Canaria for first-timers wanting island breadth; Roque Nublo for scenery purists."],
      ["Can I do two major excursions in one port day?", "No — choose one anchor and add light independent time if energy allows."],
    ],
    related: ["best-things-to-do-las-palmas-cruise", "best-gran-canaria-shore-excursion-first-time-visitors", "gran-canaria-cruise-excursions"],
    excursion: "a-taste-of-gran-canaria",
  },
  {
    slug: "best-things-to-do-las-palmas-cruise",
    name: "Best Things to Do in Las Palmas on a Cruise",
    title: "Best Things to Do in Las Palmas on a Cruise Day",
    seoTitle: "Best Things to Do in Las Palmas on a Cruise Day — Complete Guide",
    meta: "The best things to do in Las Palmas on a cruise day: city, island, food, beaches and volcanic landscapes with honest timing advice.",
    tagline: "Gran Canaria in one day — choose your anchor and build around it.",
    overview:
      "Las Palmas is not a single-experience port. You can walk a world-class urban beach, explore a UNESCO colonial quarter, drive into volcanic highlands or cross desert dunes — all in one call if you plan ruthlessly. Most passengers should pick one major theme.",
    body2:
      "City day: Vegueta, Triana, Las Canteras, Mercado del Puerto and Santa Catalina park. Island day: Roque Nublo, Bandama, mountain villages or Maspalomas dunes via shore excursion. Food day: market lunch, tapas in Vegueta, Canarian coffee in Triana.",
    body3:
      "Theme-based planning beats checklist tourism. Commit to one anchor by 09:30, schedule lunch near your route, and aim to be near Muelle Santa Catalina 60-90 minutes before all-aboard.",
    distance: "Varies by activity",
    travel: "City walkable; island requires coach",
    timeNeeded: "Full port day",
    highlights: ["Theme-based planning", "City vs island decision framework", "Food and beach options", "Return-to-ship discipline"],
    tips: ["Commit to one anchor by 09:30", "Schedule lunch near your route", "Aim near port 90 minutes before all-aboard"],
    faqs: [
      ["Can I see the city and the mountains in one day?", "Only with a well-structured excursion — not independently with depth in both."],
      ["What is the best thing to do on a short port call?", "Half-Day Las Palmas or independent Las Canteras plus Vegueta taxi loop."],
    ],
    related: ["one-day-in-gran-canaria", "independent-las-palmas-guide", "best-las-palmas-shore-excursions"],
    excursion: "a-taste-of-gran-canaria",
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
    slug: "independent-las-palmas-guide",
    title: "Independent Las Palmas Guide for Cruise Passengers",
    seoTitle: "Independent Las Palmas Cruise Guide — Walks, Taxis, Food and Return Timing",
    meta: "The comprehensive independent Las Palmas cruise guide: dock location, walk/taxi/bus, Vegueta, Triana, Las Canteras, Santa Catalina, markets, cafés, tapas, shopping, taxi expectations and return advice.",
    tagline: "A full self-guided blueprint from gangway to all-aboard.",
    overview:
      "Las Palmas is one of the most rewarding Canary Islands ports for confident independent exploration. This guide gives you a realistic self-guided framework from Muelle Santa Catalina to core landmarks and back with safety margin.",
    body1:
      "Start by walking from the terminal toward Santa Catalina park and the Las Canteras waterfront (15-20 minutes). For Vegueta and Triana, take a taxi (EUR 8-12, 15-20 minutes) or Global bus. The historic quarter is compact once you arrive — begin at the cathedral square, explore Casa de Colón, then cross to Triana for shopping and coffee.",
    body2:
      "Taxi guidance: central rides EUR 8-15, Las Canteras EUR 5-10 from terminal. Buses are cheap (EUR 1.40-3) but require route familiarity — line 1 connects port area to Las Canteras. Keep a note of Muelle Santa Catalina and your ship departure time. Distances are manageable but hills and cobbles in Vegueta slow some walkers.",
    body3:
      "Food and coffee strategy: Mercado del Puerto for market lunch near the waterfront, tapas in Vegueta plazas for atmosphere, Canarian coffee roasters in Triana. Shopping works best in Triana's pedestrian Calle Mayor rather than distant malls. Return via Las Canteras promenade for an easy walk back to the terminal zone.",
    highlights: ["Terminal to Las Canteras walk", "Vegueta and Triana taxi/bus access", "Mercado del Puerto lunch option", "Taxi pricing and return confidence"],
    tips: ["Carry sun protection even in winter", "Set a turnaround alarm midday", "Target 60-90 minute final return buffer"],
    faqs: [
      ["Can I do Las Palmas independently without stress?", "Yes, with a loop plan and conservative return timing."],
      ["How much are taxis in Las Palmas?", "Typical central hops EUR 8-15 depending distance and traffic."],
    ],
    recommendations: [
      { cat: "best-independent", title: "Can You Explore Las Palmas Independently?", desc: "Independent exploration reality check.", href: "/compare/can-you-explore-las-palmas-independently" },
      { cat: "best-food", title: "Canarian Food Guide", desc: "What to order and where to stop.", href: "/guides/canarian-food-guide" },
      { cat: "best-value", title: "Half-Day Las Palmas Tour", desc: "Guided fallback if timing feels tight.", href: "/shore-excursions/half-day-las-palmas-tour" },
    ],
    related: ["one-day-in-gran-canaria", "las-palmas-cruise-port-guide", "can-you-explore-las-palmas-independently"],
    imageKey: "old-town",
  },
  {
    slug: "one-day-in-gran-canaria",
    title: "One Day in Gran Canaria on a Cruise",
    seoTitle: "One Day in Gran Canaria — Cruise Port Itinerary Options",
    meta: "One day in Gran Canaria cruise itinerary options: city loop, island excursion path and weather-safe alternatives from Las Palmas port.",
    tagline: "Turn one port call into a coherent miniature-continent day.",
    overview:
      "One day in Gran Canaria rewards clear decision-making. Pick one major anchor by morning: stay in Las Palmas for city depth, or join an island excursion for volcanic highlands, dunes or caldera scenery.",
    body1:
      "City-first plan: Las Canteras promenade walk, taxi to Vegueta, cathedral and Casa de Colón, tapas lunch, Triana coffee and shopping, return via waterfront. This keeps transfer risk low and delivers strong Canarian urban character.",
    body2:
      "Island-first plan: depart early on A Taste of Gran Canaria or Roque Nublo excursion, experience mountain villages and volcanic landscapes, return with buffer. Alternatively, Maspalomas dunes for desert-Atlantic drama or Bandama for closer volcanic intimacy.",
    body3:
      "Rain and wind fallback: shorten exposed beach time, add Mercado del Puerto or museum stops, switch to taxis for Vegueta access. Highland excursions can run in cloud — views may vary but landscape still impresses.",
    highlights: ["Two reliable itinerary frameworks", "Weather-adjusted alternatives", "Strong return-to-ship discipline"],
    tips: ["Do not try deep city and deep island on one call", "Use Las Canteras as city waypoint", "Return to ship area early"],
    faqs: [
      ["What is the best one-day Gran Canaria plan?", "For most first-timers: either full city immersion or a dedicated island excursion, not both deeply."],
      ["Can I improvise on arrival?", "You can, but a pre-selected anchor dramatically improves the day."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "A Taste of Gran Canaria", desc: "Balanced island introduction with guide context.", href: "/shore-excursions/a-taste-of-gran-canaria" },
      { cat: "best-view", title: "Gran Canaria and Roque Nublo", desc: "Mountain scenery anchor for first visits.", href: "/shore-excursions/gran-canaria-and-roque-nublo" },
      { cat: "best-independent", title: "Independent Las Palmas Guide", desc: "Self-guided full city blueprint.", href: "/guides/independent-las-palmas-guide" },
    ],
    related: ["one-day-in-gran-canaria-from-cruise-ship", "best-gran-canaria-shore-excursion-first-time-visitors", "las-palmas-or-island-tour"],
    imageKey: "highlights",
  },
  {
    slug: "las-palmas-for-first-time-visitors",
    title: "Las Palmas for First-Time Visitors",
    seoTitle: "Las Palmas for First-Time Cruise Visitors — What to Prioritise",
    meta: "First time in Las Palmas on a cruise? Compare city highlights versus island excursions and build a realistic Gran Canaria port day.",
    tagline: "First call made simple: choose city depth or island drama.",
    overview:
      "First-time visitors often hesitate between staying in Las Palmas and heading into Gran Canaria's interior. Both are excellent; the right choice depends on your appetite for coach transfers versus walkable city texture and beach access.",
    body1:
      "If you value minimal logistics and strong flexibility, stay in Las Palmas: Las Canteras, Vegueta, Triana, Mercado del Puerto and Santa Catalina create an excellent first-day profile without leaving the city.",
    body2:
      "If you want Gran Canaria's headline scenery — volcanic peaks, desert dunes, mountain villages — book A Taste of Gran Canaria or the Roque Nublo excursion. These deliver the miniature-continent promise that distinguishes this port from generic beach stops.",
    body3:
      "Short calls favour Half-Day Las Palmas or independent Las Canteras plus one taxi destination. Long calls open private touring and combined food experiences.",
    highlights: ["City vs island decision guide", "First-timer excursion rankings", "Short-call alternatives", "Return confidence advice"],
    tips: ["Do not over-research — pick one anchor", "Book featured excursions early", "Read the port logistics section before deciding"],
    faqs: [
      ["Is Las Palmas good for first-time Canary Islands visitors?", "Excellent — it showcases city, beach, food and access to interior landscapes."],
      ["City or island for a first visit?", "City if you prefer independence; island excursion if scenery is your top priority."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Best Excursion for First-Timers", desc: "Comparison guide for decision support.", href: "/compare/best-gran-canaria-shore-excursion-first-time-visitors" },
      { cat: "best-independent", title: "Independent Las Palmas Guide", desc: "Full DIY city framework.", href: "/guides/independent-las-palmas-guide" },
      { cat: "best-view", title: "Is Roque Nublo Worth It?", desc: "Mountain excursion evaluation.", href: "/compare/is-roque-nublo-worth-it-from-cruise-ship" },
    ],
    related: ["best-gran-canaria-shore-excursion-first-time-visitors", "las-palmas-or-island-tour", "best-las-palmas-shore-excursions"],
    imageKey: "cruise-port",
  },
  {
    slug: "las-palmas-cruise-port-guide",
    title: "Las Palmas Cruise Port Guide",
    seoTitle: "Las Palmas Cruise Port Guide — Terminal, Access and Timing",
    meta: "Complete Las Palmas cruise port guide covering Muelle Santa Catalina terminal, taxi and bus access, Vegueta transfers and return-to-ship strategy.",
    tagline: "Everything you need to know about docking in Gran Canaria's capital.",
    overview:
      "Las Palmas de Gran Canaria receives cruise ships at Muelle Santa Catalina, a well-equipped terminal near Santa Catalina park with straightforward access to the city waterfront, Las Canteras beach and transport links to Vegueta and island excursion coaches.",
    body1:
      "The terminal offers basic services, taxi ranks and excursion coach staging. Santa Catalina park adjacent to the quay is a useful orientation landmark. Las Canteras beach is walkable in 15-25 minutes; Vegueta requires taxi (15-20 min) or bus.",
    body2:
      "Island excursions depart from designated coach areas — confirm meeting point and departure time with your operator. Traffic on GC-1 motorway can affect southern routes (Maspalomas); highland routes (Roque Nublo) depend on weather at altitude.",
    body3:
      "Return strategy: aim to be back in the terminal area 60-90 minutes before all-aboard. Even on independent days, keep final stops near Las Canteras or Santa Catalina for an easy walk back.",
    highlights: ["Muelle Santa Catalina layout", "Walk/taxi/bus access matrix", "Excursion coach staging", "Return-to-ship timing"],
    tips: ["Screenshot terminal location on arrival", "Confirm excursion meeting point before leaving ship", "Keep ship card and photo ID accessible"],
    faqs: [
      ["Where do cruise ships dock in Las Palmas?", "At Muelle Santa Catalina, near Santa Catalina park and the Las Canteras waterfront."],
      ["Is the Las Palmas cruise port walkable?", "Las Canteras yes; Vegueta and island highlights require taxi, bus or excursion."],
    ],
    recommendations: [
      { cat: "best-independent", title: "Independent Las Palmas Guide", desc: "Self-guided routes from the terminal.", href: "/guides/independent-las-palmas-guide" },
      { cat: "best-value", title: "Cruise Port Guide Page", desc: "Extended terminal and logistics detail.", href: "/cruise-port-guide" },
      { cat: "editors-choice", title: "One Day in Gran Canaria", desc: "Itinerary frameworks from the port.", href: "/guides/one-day-in-gran-canaria" },
    ],
    related: ["independent-las-palmas-guide", "port-guide", "one-day-in-gran-canaria"],
    imageKey: "cruise-port",
  },
  {
    slug: "las-palmas-for-families",
    title: "Las Palmas for Families on a Cruise",
    seoTitle: "Las Palmas for Families — Cruise Port Guide with Kids",
    meta: "Family-friendly Las Palmas cruise guide covering beach days, easy city routes, family excursions and pacing advice for mixed-age groups.",
    tagline: "Gran Canaria works brilliantly for families — if you pace it right.",
    overview:
      "Las Palmas offers family-friendly options without defaulting to a generic beach day. Las Canteras provides safe swimming and promenade space, Vegueta offers manageable history, and dedicated family excursions handle island logistics with kid-appropriate pacing.",
    body1:
      "Best family city loop: Las Canteras beach and promenade (2-3 hours), taxi to Vegueta for cathedral square and ice cream, return via Mercado del Puerto for casual lunch. Avoid over-ambitious highland walking with young children.",
    body2:
      "Family Gran Canaria Tour is designed for mixed-age groups with flexible stops, shorter walks and engaging commentary. Las Canteras Beach Day excursion suits families wanting structured beach time with return confidence.",
    body3:
      "Rain plan: Mercado del Puerto, Casa de Colón museum, Triana café stop. Sun plan: Las Canteras morning, shaded Vegueta afternoon. Always build extra return buffer with children.",
    highlights: ["Las Canteras family beach profile", "Family excursion options", "Rain and sun backup plans", "Pacing for mixed-age groups"],
    tips: ["Prioritise Las Canteras for easy logistics", "Book family excursion for island ambitions", "Carry snacks and water always"],
    faqs: [
      ["Is Las Palmas good for children?", "Yes — beach, parks and compact historic quarter suit families well."],
      ["Can children do Roque Nublo?", "Older children with moderate fitness yes; young children may find the walk and altitude challenging."],
    ],
    recommendations: [
      { cat: "best-families", title: "Family Gran Canaria Tour", desc: "Structured family island day.", href: "/shore-excursions/family-gran-canaria-tour" },
      { cat: "best-coastal", title: "Las Canteras Beach Day", desc: "Beach-focused family option.", href: "/shore-excursions/las-canteras-beach-day" },
      { cat: "best-independent", title: "Independent Las Palmas Guide", desc: "DIY family city loop.", href: "/guides/independent-las-palmas-guide" },
    ],
    related: ["las-canteras-beach-from-cruise-port", "family-gran-canaria-tour", "one-day-in-gran-canaria"],
    imageKey: "beach",
  },
  {
    slug: "gran-canaria-cruise-excursions",
    title: "Gran Canaria Cruise Excursions — Overview Guide",
    seoTitle: "Gran Canaria Cruise Excursions — Complete Overview for Las Palmas Passengers",
    meta: "Overview of Gran Canaria cruise excursions from Las Palmas port: island tours, city highlights, food, beaches, private options and how to choose.",
    tagline: "Every excursion category explained — so you choose once and choose well.",
    overview:
      "Gran Canaria's excursion menu is unusually broad for a cruise port. This overview organises every major category — island highlights, volcanic landscapes, city history, food and wine, beaches, private touring and short-call options — so you can match product to passenger type and call length.",
    body1:
      "Island highlights: A Taste of Gran Canaria (Editor's Choice), Gran Canaria and Roque Nublo, Scenic Island Highlights Tour, Maspalomas Dunes Tour, Bandama Caldera Tour. City: Vegueta Historic Tour, Half-Day Las Palmas. Food: Canarian Food and Wine Tour.",
    body2:
      "Special formats: Private Gran Canaria Tour for custom pacing, Family Gran Canaria Tour for mixed-age groups, Las Canteras Beach Day for coastal focus, Short Port Call Tour for tight windows.",
    body3:
      "Selection principle: one anchor per port day. Match call length to excursion duration. Book Editor's Choice products early on popular sailings. Use comparison guides when torn between city and island.",
    highlights: ["Full excursion category map", "Editor's Choice identification", "Call-length matching guide", "Comparison guide links"],
    tips: ["Read best-las-palmas-shore-excursions for rankings", "Use compare pages for city vs island", "Book early on multi-ship days"],
    faqs: [
      ["How many excursions should I book for one port day?", "One — Gran Canaria rewards depth over volume."],
      ["What is the most popular Gran Canaria excursion?", "A Taste of Gran Canaria for breadth; Roque Nublo for scenery purists."],
    ],
    recommendations: [
      { cat: "editors-choice", title: "Best Las Palmas Shore Excursions", desc: "Editor's ranked list.", href: "/guides/best-las-palmas-shore-excursions" },
      { cat: "best-value", title: "Las Palmas or Island Tour?", desc: "City vs island comparison.", href: "/compare/las-palmas-or-island-tour" },
      { cat: "best-short-port", title: "Short Port Call Tour", desc: "Tight window option.", href: "/shore-excursions/short-port-call-tour" },
    ],
    related: ["best-las-palmas-shore-excursions", "best-gran-canaria-shore-excursion-first-time-visitors", "a-taste-of-gran-canaria"],
    imageKey: "highlights",
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
    slug: "a-taste-of-gran-canaria",
    title: "A Taste of Gran Canaria",
    seoTitle: "A Taste of Gran Canaria Shore Excursion from Las Palmas — Editor's Choice",
    meta: "Featured Editor's Choice Las Palmas shore excursion combining volcanic landscapes, mountain villages, food culture, coffee and local produce across Gran Canaria.",
    category: "Island Highlights",
    tagline: "Editor's Choice: Gran Canaria's miniature continent in one curated cruise day.",
    duration: "6-7.5 hours",
    pace: "Moderate",
    bestFor: "First-time visitors wanting the broadest island introduction with food and scenery",
    overview:
      "Our top overall pick for Las Palmas cruise passengers: a balanced Gran Canaria day weaving volcanic viewpoints, traditional villages, local produce stops, coffee culture and Canarian food without overcommitting to a single extreme landscape.",
    body1:
      "Depart from Muelle Santa Catalina with a direct coach route into Gran Canaria's varied interior — the island's famous microclimates unfold within minutes of leaving the coast.",
    body2:
      "Stops typically include scenic viewpoints, a mountain village walk, a produce or coffee tasting element and time for a traditional lunch or tapas sequence. Commentary connects landscape to Canarian identity beyond beach-resort clichés.",
    body3:
      "Return with a structured buffer that protects your all-aboard margin. This tour is designed for passengers who want to understand why Gran Canaria is called a miniature continent.",
    highlights: ["Volcanic and green landscapes", "Traditional village visit", "Canarian food and coffee culture", "Balanced pacing with cruise-timed return"],
    included: ["Round-trip coach", "Licensed guide", "Port pickup/drop-off", "Selected tastings", "Return timing management"],
    tips: ["Wear layers for altitude changes", "Bring sun protection", "Best single excursion for first-timers"],
    faqs: [
      ["Why is this Editor's Choice?", "It balances scenery, culture, food and logistics better than any single-theme alternative."],
      ["How does it compare to Roque Nublo tour?", "Broader and less demanding; Roque Nublo is more focused on one dramatic peak."],
    ],
    related: ["gran-canaria-and-roque-nublo", "scenic-island-highlights-tour", "canarian-food-wine-tour"],
    featured: true,
  },
  {
    slug: "gran-canaria-and-roque-nublo",
    title: "Gran Canaria and Roque Nublo",
    seoTitle: "Gran Canaria and Roque Nublo Shore Excursion from Las Palmas",
    meta: "Featured secondary Editor's Choice excursion to Roque Nublo with mountain scenery, dramatic viewpoints and Gran Canaria highland landscapes from Las Palmas cruise port.",
    category: "Volcanic Landscapes",
    tagline: "Editor's Choice secondary: Gran Canaria's iconic volcanic sentinel and highland drama.",
    duration: "6-7 hours",
    pace: "Active",
    bestFor: "Scenery-first travellers with moderate fitness and standard or long port calls",
    overview:
      "The definitive mountain excursion from Las Palmas: coach transfer to Roque Nublo trailhead, guided walk to viewpoints near the monolith, and highland scenery across pine forests and volcanic peaks.",
    body1:
      "Early departure from the cruise terminal maximises clear-view windows at altitude. En-route commentary covers Gran Canaria's geological formation and highland ecology.",
    body2:
      "The Roque Nublo walk (30-45 minutes each way on maintained paths) rewards with sweeping island views. Weather at 1,800 metres can differ sharply from the port — operators carry contingency plans.",
    body3:
      "Conservative return timing protects your all-aboard window. This is Gran Canaria at its most photogenic and physically engaging.",
    highlights: ["Roque Nublo monolith viewpoints", "High-altitude pine forest", "Panoramic island vistas", "UNESCO Biosphere Reserve landscape"],
    included: ["Round-trip coach", "Licensed guide", "Port pickup/drop-off", "Return timing management"],
    tips: ["Non-slip shoes essential", "Bring warm layer for altitude", "Not ideal for limited mobility"],
    faqs: [
      ["Is the Roque Nublo walk difficult?", "Moderate — maintained trail with incline; reasonable fitness required."],
      ["What if cloud covers the peak?", "Highland scenery still impresses; operators may adjust routing."],
    ],
    related: ["a-taste-of-gran-canaria", "bandama-caldera-tour", "scenic-island-highlights-tour"],
    featured: true,
  },
  {
    slug: "maspalomas-dunes-tour",
    title: "Maspalomas Dunes Tour",
    seoTitle: "Maspalomas Dunes Shore Excursion from Las Palmas Cruise Port",
    meta: "Maspalomas dunes shore excursion from Las Palmas with desert-Atlantic landscape, dune walking and southern coast scenery.",
    category: "Coastal Scenery",
    tagline: "Sahara meets Atlantic — Gran Canaria's most surreal coastal landscape.",
    duration: "5-6.5 hours",
    pace: "Moderate",
    bestFor: "Photography enthusiasts and passengers wanting unique desert-dune scenery",
    overview:
      "A dedicated southern Gran Canaria excursion to the Maspalomas Dunes Natural Reserve: golden sand formations, Atlantic backdrop and a landscape unlike any other European cruise port offering.",
    body1:
      "Coach transfer from Muelle Santa Catalina to the dunes area (50-70 minutes each way) with commentary on Gran Canaria's south-coast development and protected landscapes.",
    body2:
      "Guided walking time on the dunes with photo stops and optional lighthouse or Playa del Inglés orientation. Exposed terrain — sun protection and water essential.",
    body3:
      "Return with buffer time. Best on standard or long calls where transfer investment pays off in unique scenery.",
    highlights: ["Protected dune reserve", "Desert-Atlantic contrast", "Photography opportunities", "Southern coast character"],
    included: ["Round-trip coach", "Licensed guide", "Port pickup/drop-off", "Return timing management"],
    tips: ["Closed shoes — sand gets hot", "Bring water and sun protection", "Compare with Bandama if transfer time is a concern"],
    faqs: [
      ["Is Maspalomas worth the long transfer?", "Yes for scenery lovers; Bandama is closer if time is tight."],
      ["Can I swim at Maspalomas?", "Some tours include beach time nearby; confirm when booking."],
    ],
    related: ["bandama-caldera-tour", "las-canteras-beach-day", "scenic-island-highlights-tour"],
  },
  {
    slug: "bandama-caldera-tour",
    title: "Bandama Caldera Tour",
    seoTitle: "Bandama Caldera Shore Excursion from Las Palmas Cruise Port",
    meta: "Bandama volcanic caldera shore excursion from Las Palmas with crater views, green interior landscapes and accessible geology.",
    category: "Volcanic Landscapes",
    tagline: "Walk into a volcano — intimate geology close to the city.",
    duration: "4-5 hours",
    pace: "Moderate",
    bestFor: "Passengers wanting volcanic drama without full mountain-day commitment",
    overview:
      "A focused excursion to Bandama caldera: rim viewpoints, crater-floor orientation and the green volcanic interior that contrasts sharply with Las Palmas' urban coast.",
    body1:
      "Shorter transfer than Maspalomas or Roque Nublo (30-40 minutes each way) makes this practical on standard calls.",
    body2:
      "Guided time at the caldera rim and optional crater descent. Commentary covers Gran Canaria's volcanic formation and agricultural traditions in the crater floor.",
    body3:
      "Return with conservative buffer. Pairs well with afternoon city time if your call is long.",
    highlights: ["Volcanic crater rim views", "Crater-floor agriculture", "Accessible volcanic geology", "Shorter transfer than southern highlights"],
    included: ["Round-trip coach", "Licensed guide", "Port pickup/drop-off", "Return timing management"],
    tips: ["Good middle-ground between city and Roque Nublo", "Sun protection on exposed rim", "Check mobility requirements for crater descent"],
    faqs: [
      ["Bandama or Maspalomas?", "Bandama is closer and more volcanic; Maspalomas is more unique desert-coast scenery."],
      ["Is this suitable for limited mobility?", "Rim viewpoints yes; crater descent may be challenging."],
    ],
    related: ["maspalomas-dunes-tour", "gran-canaria-and-roque-nublo", "a-taste-of-gran-canaria"],
  },
  {
    slug: "private-gran-canaria-tour",
    title: "Private Gran Canaria Tour",
    seoTitle: "Private Gran Canaria Shore Excursion from Las Palmas",
    meta: "Custom private Gran Canaria shore excursion from Las Palmas for tailored pacing, mixed mobility and priority interests.",
    category: "Private Tours",
    tagline: "Your island, your pace — bespoke Gran Canaria touring.",
    duration: "Flexible 5-8 hours",
    pace: "Relaxed",
    bestFor: "Families, mixed-mobility groups and travellers wanting custom sequencing",
    overview:
      "Private touring gives maximum control over pace, content and weather adjustments on your Las Palmas call. Design around Roque Nublo, Bandama, villages, food stops or city highlights.",
    body1:
      "Pre-sail consultation shapes your itinerary. Guide and driver coordinate route changes in real time based on conditions and group energy.",
    body2:
      "Options include highland scenery, caldera viewpoints, village walks, wine or coffee tastings and Vegueta city time — in whatever combination your call length supports.",
    body3:
      "Return protocols are conservative and tailored to your ship timetable. The premium buys flexibility and comfort.",
    highlights: ["Custom itinerary", "Flexible pace", "Private vehicle comfort", "High return confidence"],
    included: ["Private guide", "Dedicated vehicle", "Custom planning", "Port pickup/drop-off"],
    tips: ["Share priorities before sailing", "Set non-negotiable stops early", "Ideal for mixed mobility within group"],
    faqs: [
      ["Can private tours include Roque Nublo?", "Yes on standard or long calls with appropriate fitness levels."],
      ["Are private tours worth the premium?", "Often yes for groups wanting flexibility and comfort."],
    ],
    related: ["a-taste-of-gran-canaria", "gran-canaria-and-roque-nublo", "family-gran-canaria-tour"],
  },
  {
    slug: "vegueta-historic-las-palmas-tour",
    title: "Vegueta Historic Las Palmas Tour",
    seoTitle: "Vegueta Historic Las Palmas Shore Excursion from Cruise Port",
    meta: "Guided Vegueta historic quarter shore excursion covering cathedral, Casa de Colón, colonial architecture and Triana from Las Palmas cruise port.",
    category: "Historic Cities",
    tagline: "Colonial Gran Canaria on foot — cathedral, Columbus and cobbled lanes.",
    duration: "3.5-4.5 hours",
    pace: "Moderate",
    bestFor: "History enthusiasts wanting focused city heritage without island transfers",
    overview:
      "A walking-first city tour through Vegueta and Triana: cathedral square, Casa de Colón, colonial architecture and the Atlantic trading history that shaped the Canary Islands.",
    body1:
      "Taxi or coach transfer from Muelle Santa Catalina to Vegueta (15-20 minutes), then guided walking through the historic quarter.",
    body2:
      "Cathedral exterior and interior if timing allows, Casa de Colón museum context, balconied streets and plaza stops. Cross to Triana for market and shopping orientation.",
    body3:
      "Return via taxi or direct port routing. No long coach transfers — ideal for passengers preferring city depth over island scenery.",
    highlights: ["Cathedral of Santa Ana", "Casa de Colón", "Colonial architecture", "Triana market and shopping"],
    included: ["Licensed guide", "Transport to historic quarter", "Walking orientation", "Timed return"],
    tips: ["Wear comfortable shoes for cobbles", "Ideal for history-first passengers", "Combine with food stop in Vegueta"],
    faqs: [
      ["Is this better than independent Vegueta visit?", "Guide adds historical depth and efficient routing; independent works too with our guide page."],
      ["Does it include Las Canteras?", "Usually not — this is a historic quarter focus."],
    ],
    related: ["half-day-las-palmas-tour", "canarian-food-wine-tour", "independent-las-palmas-guide"],
  },
  {
    slug: "canarian-food-wine-tour",
    title: "Canarian Food and Wine Tour",
    seoTitle: "Canarian Food and Wine Shore Excursion in Las Palmas",
    meta: "Taste-focused Las Palmas excursion featuring Canarian cuisine, local wines, market visits and coffee culture for cruise passengers.",
    category: "Food & Wine",
    tagline: "Volcanic soil flavours and Atlantic catch — a Canarian culinary journey.",
    duration: "4-5 hours",
    pace: "Relaxed",
    bestFor: "Food-focused travellers and repeat cruisers wanting local depth",
    overview:
      "A curated culinary route through Las Palmas' food identity: market stops, traditional dishes, Canarian wine and coffee culture timed for cruise schedules.",
    body1:
      "Start with Mercado del Puerto or Vegueta market orientation and local ingredient context.",
    body2:
      "Sample papas arrugadas, mojo sauces, fresh fish and regional wines at selected venues. Coffee stop at a local roaster in Triana.",
    body3:
      "Return with practical tips for edible souvenirs and restaurant recommendations. Comfortable pacing throughout.",
    highlights: ["Canarian classics and mojo", "Regional wine pairings", "Market and coffee culture", "Comfortable pacing"],
    included: ["Guide", "Selected tastings", "Wine samples", "Port return coordination"],
    tips: ["Share dietary needs at booking", "Eat a light breakfast", "Reserve ahead on multi-ship days"],
    faqs: [
      ["Is this tour suitable for non-drinkers?", "Yes, food remains the core and alternatives are usually available."],
      ["Will I get enough for lunch?", "Most tours provide substantial tasting volume."],
    ],
    related: ["a-taste-of-gran-canaria", "vegueta-historic-las-palmas-tour", "canarian-food-guide"],
  },
  {
    slug: "family-gran-canaria-tour",
    title: "Family Gran Canaria Tour",
    seoTitle: "Family Gran Canaria Shore Excursion from Las Palmas",
    meta: "Family-friendly Gran Canaria shore excursion with flexible pacing, shorter walks and engaging stops for mixed-age cruise groups.",
    category: "Family Tours",
    tagline: "Island discovery designed for families — flexible, fun and ship-safe.",
    duration: "5-6.5 hours",
    pace: "Relaxed",
    bestFor: "Families with children wanting island exposure without extreme walking",
    overview:
      "A family-paced Gran Canaria day with shorter walks, engaging stops, flexible timing and kid-friendly commentary. Avoids demanding highland trails while still showcasing island variety.",
    body1:
      "Coach route selected for scenic interest with manageable stop durations. Commentary pitched for mixed-age engagement.",
    body2:
      "Stops may include a viewpoint, village walk, beach or dune orientation and a food stop suitable for children. No Roque Nublo-level hiking.",
    body3:
      "Extra return buffer built in for family pacing. Restroom and snack stops planned throughout.",
    highlights: ["Family-appropriate pacing", "Flexible stop durations", "Engaging commentary", "Extra return buffer"],
    included: ["Round-trip coach", "Family-experienced guide", "Port pickup/drop-off", "Return timing management"],
    tips: ["Bring snacks and water for children", "Sun protection essential", "Better than highland tours for young kids"],
    faqs: [
      ["What age is this suitable for?", "Generally 5+ with adult supervision; toddlers may find coach time long."],
      ["Does it include beach time?", "Some departures include a beach or coastal stop — confirm when booking."],
    ],
    related: ["las-canteras-beach-day", "a-taste-of-gran-canaria", "half-day-las-palmas-tour"],
  },
  {
    slug: "half-day-las-palmas-tour",
    title: "Half-Day Las Palmas Tour",
    seoTitle: "Half-Day Las Palmas Shore Excursion — City Highlights from Cruise Port",
    meta: "Efficient half-day Las Palmas shore excursion covering Vegueta, Las Canteras and city highlights for cruise passengers with limited time.",
    category: "Historic Cities",
    tagline: "Maximum city value in minimum time — ideal for cautious planners.",
    duration: "3.5-4.5 hours",
    pace: "Moderate",
    bestFor: "Passengers wanting guided city orientation with strong return confidence",
    overview:
      "A compressed city highlights tour: Vegueta historic quarter, Las Canteras promenade and key orientation points — structured for passengers who want guide context without a full-day commitment.",
    body1:
      "Efficient routing from Muelle Santa Catalina through the city's two strongest zones: historic Vegueta and beachfront Las Canteras.",
    body2:
      "Guided commentary on Canarian history, architecture and daily life. Photo stops and optional café break.",
    body3:
      "Early return with generous buffer. Leaves afternoon free for independent exploration or ship relaxation.",
    highlights: ["Vegueta and Las Canteras in one tour", "Efficient city routing", "Strong return confidence", "Guide context without full-day commitment"],
    included: ["Licensed guide", "Transport between districts", "Walking orientation", "Timed return"],
    tips: ["Ideal for first-time city visitors", "Pairs with independent afternoon", "Good fallback in uncertain weather"],
    faqs: [
      ["Is half-day enough for Las Palmas?", "Yes for orientation; independent time adds depth."],
      ["Does it include island scenery?", "No — this is city-only. Choose an island tour for highland or dune landscapes."],
    ],
    related: ["vegueta-historic-las-palmas-tour", "short-port-call-tour", "independent-las-palmas-guide"],
  },
  {
    slug: "scenic-island-highlights-tour",
    title: "Scenic Island Highlights Tour",
    seoTitle: "Scenic Gran Canaria Island Highlights Shore Excursion from Las Palmas",
    meta: "Panoramic Gran Canaria island highlights tour from Las Palmas with multiple scenic stops, villages and volcanic viewpoints.",
    category: "Island Highlights",
    tagline: "Gran Canaria's greatest hits — scenery, villages and viewpoints in one drive.",
    duration: "6-7 hours",
    pace: "Moderate",
    bestFor: "Passengers wanting broad island coverage without the Roque Nublo walk commitment",
    overview:
      "A vehicle-led island loop hitting Gran Canaria's scenic highlights: viewpoints, traditional villages and volcanic landscapes with minimal walking demand compared to Roque Nublo-focused tours.",
    body1:
      "Coach route through varied terrain showcasing the island's microclimates — coast to green interior to volcanic zones.",
    body2:
      "Multiple photo stops with guide commentary. Village walk optional at selected stops. Less demanding than dedicated Roque Nublo excursion.",
    body3:
      "Return with structured buffer. Good for passengers who want island breadth with moderate physical demand.",
    highlights: ["Multiple scenic viewpoints", "Village stops", "Volcanic landscape variety", "Lower walking demand than Roque Nublo"],
    included: ["Round-trip coach", "Licensed guide", "Port pickup/drop-off", "Return timing management"],
    tips: ["Bring camera and layers", "Good alternative if Roque Nublo walk feels too demanding", "Book early on popular sailings"],
    faqs: [
      ["How does this differ from A Taste of Gran Canaria?", "More scenery-focused, less food emphasis; similar breadth."],
      ["Is walking minimal?", "Mostly yes — short stops rather than extended trails."],
    ],
    related: ["a-taste-of-gran-canaria", "gran-canaria-and-roque-nublo", "bandama-caldera-tour"],
  },
  {
    slug: "las-canteras-beach-day",
    title: "Las Canteras Beach Day",
    seoTitle: "Las Canteras Beach Day Shore Excursion from Las Palmas Cruise Port",
    meta: "Las Canteras beach day excursion with promenade time, swimming option and relaxed coastal pacing from Las Palmas cruise port.",
    category: "Coastal Scenery",
    tagline: "Europe's great urban beach — structured relaxation with return confidence.",
    duration: "3.5-5 hours",
    pace: "Relaxed",
    bestFor: "Beach lovers wanting structured coastal time without island transfers",
    overview:
      "A beach-focused excursion at Playa de Las Canteras: promenade time, optional swimming in reef-protected zones, lunch recommendations and relaxed pacing with ship-timed return.",
    body1:
      "Transfer or guided walk from Muelle Santa Catalina to Las Canteras (15-25 minutes walk or short taxi).",
    body2:
      "Free time on the promenade and beach with guide availability for restaurant recommendations and orientation. Reef-protected swimming zones flagged.",
    body3:
      "Conservative return timing. Ideal for passengers who prioritise beach over highland or historic touring.",
    highlights: ["Las Canteras promenade and beach", "Reef-protected swimming", "Urban beach atmosphere", "Relaxed pacing"],
    included: ["Guide", "Beach orientation", "Port return coordination"],
    tips: ["Bring swimwear and towel", "Reserve promenade lunch on busy days", "Not a resort beach — authentic city strand"],
    faqs: [
      ["Is this just a beach with no guide value?", "Guide provides orientation, safety context and return coordination — valuable on first visit."],
      ["Can I do this independently?", "Yes — Las Canteras is walkable from port; this adds structure and return discipline."],
    ],
    related: ["half-day-las-palmas-tour", "family-gran-canaria-tour", "best-beaches-near-las-palmas-cruise-port"],
  },
  {
    slug: "short-port-call-tour",
    title: "Short Port Call Tour",
    seoTitle: "Short Port Call Las Palmas Shore Excursion — Quick City Highlights",
    meta: "Short port call Las Palmas shore excursion designed for tight arrival-departure windows with maximum city impact and return confidence.",
    category: "Half-Day Tours",
    tagline: "Tight window, strong impression — Las Palmas essentials without risk.",
    duration: "2.5-3.5 hours",
    pace: "Moderate",
    bestFor: "Passengers on short port calls or late arrivals needing efficient city exposure",
    overview:
      "Designed for the tightest Las Palmas calls: a fast, focused city orientation covering one historic zone and Las Canteras waterfront with maximum return confidence.",
    body1:
      "Immediate departure from terminal with pre-planned routing — no wasted transfer time.",
    body2:
      "Quick Vegueta orientation or Las Canteras promenade walk depending departure timing. Guide commentary compressed to highest-value facts.",
    body3:
      "Generous return buffer relative to tour length. The safest guided option when usable hours are limited.",
    highlights: ["Optimised for short calls", "Single high-value anchor", "Maximum return confidence", "No island transfers"],
    included: ["Licensed guide", "Efficient transport", "Port pickup/drop-off", "Conservative return timing"],
    tips: ["Best guided option for late arrivals", "Skip island tours on short calls", "Independent Las Canteras walk also works"],
    faqs: [
      ["What counts as a short port call?", "Typically under 6 usable hours after embarkation and return buffer."],
      ["Can I still see Roque Nublo on a short call?", "Not recommended — city focus is safer."],
    ],
    related: ["half-day-las-palmas-tour", "las-canteras-beach-day", "independent-las-palmas-guide"],
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
  versus({
    slug: "las-palmas-or-island-tour",
    optionA: "Stay in Las Palmas City",
    optionB: "Take an Island Tour",
    summary:
      "City-stay plans maximise walkability, beach access and independent flexibility; island tours maximise volcanic scenery, villages and Gran Canaria's miniature-continent promise with longer coach transfers.",
    verdict:
      "Choose city-stay for Las Canteras, Vegueta and low-transfer independence. Choose island tour for Roque Nublo, dunes, caldera and highland drama.",
    overview: [
      "Las Palmas city day: walkable beach, historic quarter and food.",
      "Island day: volcanic landscapes, villages and dramatic viewpoints.",
      "Transfer tolerance and scenery appetite are the deciding factors.",
    ],
    table: [
      { category: "Transfer time", optionA: "Minimal (taxi/walk)", optionB: "45-90 min each way by coach" },
      { category: "Scenery impact", optionA: "Urban beach and colonial city", optionB: "Volcanic highlands, dunes or caldera" },
      { category: "Flexibility", optionA: "High", optionB: "Moderate (tour schedule)" },
      { category: "Return confidence", optionA: "Very high", optionB: "High with good operator" },
    ],
    faqs: [
      ["What is safer for short calls?", "Staying in Las Palmas city is safer when usable hours are limited."],
      ["What is better for first-timers?", "A Taste of Gran Canaria if you want island breadth; city day if you prefer independence."],
    ],
    related: ["best-gran-canaria-shore-excursion-first-time-visitors", "one-day-in-gran-canaria-from-cruise-ship", "can-you-explore-las-palmas-independently"],
    imageKey: "compare",
  }),
  comparisonGuide({
    slug: "is-roque-nublo-worth-it-from-cruise-ship",
    title: "Is Roque Nublo Worth It from a Cruise Ship?",
    seoTitle: "Is Roque Nublo Worth It from Las Palmas Cruise Port?",
    meta: "Honest evaluation of whether Roque Nublo justifies the transfer and walk from Las Palmas cruise port on a port day.",
    summary:
      "For scenery-first travellers on standard or long calls, yes — Roque Nublo is Gran Canaria's most memorable natural sight and worth the coach time and moderate walk.",
    verdict:
      "Worth it when scenery is your top priority and you have 6+ usable hours. Less compelling on short calls or for passengers preferring city and beach.",
    overview: [
      "Transfer is 45-60 minutes each way — predictable but significant.",
      "Experience intensity is high for landscape and photography interests.",
      "Bandama or city day remain strong alternatives with less commitment.",
    ],
    guideItems: [
      { name: "Gran Canaria and Roque Nublo", slug: "gran-canaria-and-roque-nublo", href: "/shore-excursions/gran-canaria-and-roque-nublo", reason: "Dedicated Roque Nublo excursion.", topExcursion: "Editor's Choice secondary", returnConfidence: "High", walkingDifficulty: "Moderate to active" },
      { name: "A Taste of Gran Canaria", slug: "a-taste-of-gran-canaria", href: "/shore-excursions/a-taste-of-gran-canaria", reason: "Broader island day with less walking.", topExcursion: "Editor's Choice primary", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Bandama Caldera Tour", slug: "bandama-caldera-tour", href: "/shore-excursions/bandama-caldera-tour", reason: "Closer volcanic alternative.", topExcursion: "Volcanic focus", returnConfidence: "High", walkingDifficulty: "Moderate" },
    ],
    faqs: [
      ["Will I feel rushed at Roque Nublo?", "Well-run tours allow adequate viewpoint time; independent travel is harder to pace."],
      ["What if clouds cover the peak?", "Highland scenery still impresses; views may be partial."],
    ],
    related: ["roque-nublo-from-cruise-ship", "las-palmas-or-island-tour", "bandama-caldera-or-maspalomas-dunes"],
    imageKey: "galicia-landscape",
  }),
  comparisonGuide({
    slug: "best-gran-canaria-shore-excursion-first-time-visitors",
    title: "Best Gran Canaria Shore Excursion for First-Time Visitors",
    seoTitle: "Best Gran Canaria Shore Excursion for First-Time Cruise Visitors",
    meta: "Compare top Gran Canaria shore excursions for first-time visitors by pace, scenery, food and return confidence from Las Palmas port.",
    summary:
      "First-time visitors should choose between island breadth (A Taste of Gran Canaria) and mountain drama (Roque Nublo) rather than trying to do everything.",
    verdict:
      "A Taste of Gran Canaria is top for balanced first visits. Gran Canaria and Roque Nublo is top for scenery purists. Half-Day Las Palmas suits city-first short calls.",
    overview: [
      "Editor's Choice primary: A Taste of Gran Canaria.",
      "Editor's Choice secondary: Gran Canaria and Roque Nublo.",
      "City and short-call alternatives remain strong.",
    ],
    guideItems: [
      { name: "A Taste of Gran Canaria", slug: "a-taste-of-gran-canaria", href: "/shore-excursions/a-taste-of-gran-canaria", reason: "Best all-round island introduction.", topExcursion: "Editor's Choice", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Gran Canaria and Roque Nublo", slug: "gran-canaria-and-roque-nublo", href: "/shore-excursions/gran-canaria-and-roque-nublo", reason: "Best mountain scenery.", topExcursion: "Editor's Choice secondary", returnConfidence: "High", walkingDifficulty: "Active" },
      { name: "Half-Day Las Palmas", slug: "half-day-las-palmas-tour", href: "/shore-excursions/half-day-las-palmas-tour", reason: "Best city-first option.", topExcursion: "City focus", returnConfidence: "Very high", walkingDifficulty: "Moderate" },
      { name: "Family Gran Canaria Tour", slug: "family-gran-canaria-tour", href: "/shore-excursions/family-gran-canaria-tour", reason: "Best for mixed-age groups.", topExcursion: "Family", returnConfidence: "High", walkingDifficulty: "Low to moderate" },
    ],
    faqs: [
      ["Which tour should first-timers pick?", "Most choose A Taste of Gran Canaria or Roque Nublo depending scenery vs breadth preference."],
      ["Can I decide on arrival day?", "Possible, but featured options may sell out on popular sailings."],
    ],
    related: ["las-palmas-for-first-time-visitors", "best-las-palmas-shore-excursions", "one-day-in-gran-canaria"],
    imageKey: "highlights",
  }),
  comparisonGuide({
    slug: "can-you-explore-las-palmas-independently",
    title: "Can You Explore Las Palmas Independently?",
    seoTitle: "Can You Explore Las Palmas Independently from Cruise Port?",
    meta: "Independent exploration reality guide for Las Palmas cruise passengers, including walkability, taxis, buses and timing safeguards.",
    summary:
      "Yes, Las Palmas city is highly workable independently for most cruise passengers — Las Canteras is walkable, Vegueta is a short taxi away, and island highlights need organised tours.",
    verdict:
      "Independent is excellent for city-focused days. Choose guided island excursions for Roque Nublo, dunes or caldera when scenery is the priority.",
    overview: [
      "Terminal location supports independent city exploration.",
      "Las Canteras promenade links easily from port.",
      "Taxis and buses offer fast backup for Vegueta and Triana.",
    ],
    guideItems: [
      { name: "Independent Las Palmas Guide", slug: "independent-las-palmas-guide", href: "/guides/independent-las-palmas-guide", reason: "Complete DIY city structure.", topExcursion: "DIY plan", returnConfidence: "High", walkingDifficulty: "Variable" },
      { name: "Las Canteras Beach Guide", slug: "las-canteras-beach-from-cruise-port", href: "/guides/las-canteras-beach-from-cruise-port", reason: "Walkable beach from port.", topExcursion: "Beach day", returnConfidence: "Very high", walkingDifficulty: "Low" },
      { name: "A Taste of Gran Canaria", slug: "a-taste-of-gran-canaria", href: "/shore-excursions/a-taste-of-gran-canaria", reason: "Guided island fallback.", topExcursion: "Island guided", returnConfidence: "High", walkingDifficulty: "Moderate" },
    ],
    faqs: [
      ["Is independent Las Palmas safe and practical?", "Yes, with normal urban awareness and return-time discipline."],
      ["Should I pre-book anything for independent day?", "Taxi numbers and restaurant reservations help on multi-ship days."],
    ],
    related: ["independent-las-palmas-guide", "las-palmas-or-island-tour", "half-day-las-palmas-tour"],
    imageKey: "old-town",
  }),
  versus({
    slug: "bandama-caldera-or-maspalomas-dunes",
    optionA: "Bandama Caldera",
    optionB: "Maspalomas Dunes",
    summary:
      "Bandama offers closer volcanic intimacy 30-40 minutes from port; Maspalomas delivers unique desert-Atlantic scenery 50-70 minutes away.",
    verdict:
      "Choose Bandama for shorter transfer and crater geology. Choose Maspalomas for surreal dune landscapes and photography.",
    overview: [
      "Bandama: closer, volcanic, crater-focused.",
      "Maspalomas: farther, unique, desert-coast drama.",
      "Both beat generic beach stops for scenery value.",
    ],
    table: [
      { category: "Transfer time", optionA: "30-40 min each way", optionB: "50-70 min each way" },
      { category: "Landscape type", optionA: "Volcanic crater", optionB: "Desert dunes and Atlantic" },
      { category: "Walking demand", optionA: "Moderate (crater paths)", optionB: "Moderate (sand walking)" },
      { category: "Best for", optionA: "Geology and green interior", optionB: "Photography and unique scenery" },
    ],
    faqs: [
      ["Can I do both on one port day?", "Not realistically — choose one as your island anchor."],
      ["Which is better on a short call?", "Bandama due to shorter transfer time."],
    ],
    related: ["bandama-caldera-guide", "maspalomas-dunes-from-las-palmas-cruise-port", "is-roque-nublo-worth-it-from-cruise-ship"],
    imageKey: "coast",
  }),
  comparisonGuide({
    slug: "best-beaches-near-las-palmas-cruise-port",
    title: "Best Beaches Near Las Palmas Cruise Port",
    seoTitle: "Best Beaches Near Las Palmas Cruise Port — Comparison Guide",
    meta: "Compare the best beaches accessible from Las Palmas cruise port including Las Canteras, southern resorts and practical timing advice.",
    summary:
      "Las Canteras is the clear winner for cruise passengers — walkable, authentic and reef-protected. Southern beaches require long transfers better suited to dedicated dune or resort excursions.",
    verdict:
      "Las Canteras for independent city-beach days. Maspalomas area for combined dune-beach excursions. Skip long southern transfers for beach alone.",
    overview: [
      "Las Canteras: walkable urban beach, best independent option.",
      "Maspalomas/Playa del Inglés: excursion-only, combine with dunes.",
      "Port-proximate beats resort transfer for beach-only goals.",
    ],
    guideItems: [
      { name: "Las Canteras Beach Guide", slug: "las-canteras-beach-from-cruise-port", href: "/guides/las-canteras-beach-from-cruise-port", reason: "Best walkable beach from port.", topExcursion: "Independent or beach day tour", returnConfidence: "Very high", walkingDifficulty: "Low" },
      { name: "Las Canteras Beach Day", slug: "las-canteras-beach-day", href: "/shore-excursions/las-canteras-beach-day", reason: "Structured beach excursion.", topExcursion: "Beach focus", returnConfidence: "Very high", walkingDifficulty: "Low" },
      { name: "Maspalomas Dunes Tour", slug: "maspalomas-dunes-tour", href: "/shore-excursions/maspalomas-dunes-tour", reason: "Dune-beach combination.", topExcursion: "Southern excursion", returnConfidence: "High", walkingDifficulty: "Moderate" },
    ],
    faqs: [
      ["Is Las Canteras the best beach for cruise passengers?", "Yes — proximity, quality and urban authenticity make it the default choice."],
      ["Are southern resort beaches worth the transfer?", "Only as part of a dune or island excursion, not for beach alone."],
    ],
    related: ["las-canteras-beach-from-cruise-port", "maspalomas-dunes-from-las-palmas-cruise-port", "las-palmas-or-island-tour"],
    imageKey: "beach",
  }),
  comparisonGuide({
    slug: "one-day-in-gran-canaria-from-cruise-ship",
    title: "One Day in Gran Canaria from a Cruise Ship",
    seoTitle: "One Day in Gran Canaria from Cruise Ship — Compare Best Plans",
    meta: "Compare realistic one-day Gran Canaria plans for cruise passengers: city immersion, island excursion and hybrid options from Las Palmas port.",
    summary:
      "One day in Gran Canaria works best when you choose a clear anchor — city, island highlights or food — and build around weather and return confidence.",
    verdict:
      "City immersion wins for flexibility. Island excursion wins for scenery impact. Hybrid plans should stay conservative.",
    overview: [
      "Plan A: Full Las Palmas city day.",
      "Plan B: Island excursion anchor (A Taste or Roque Nublo).",
      "Plan C: Half-day tour plus independent food or beach focus.",
    ],
    guideItems: [
      { name: "A Taste of Gran Canaria", slug: "a-taste-of-gran-canaria", href: "/shore-excursions/a-taste-of-gran-canaria", reason: "Balanced island structure.", topExcursion: "Editor's Choice", returnConfidence: "High", walkingDifficulty: "Moderate" },
      { name: "Half-Day Las Palmas", slug: "half-day-las-palmas-tour", href: "/shore-excursions/half-day-las-palmas-tour", reason: "Efficient city orientation.", topExcursion: "City guided", returnConfidence: "Very high", walkingDifficulty: "Moderate" },
      { name: "Independent Las Palmas Guide", slug: "independent-las-palmas-guide", href: "/guides/independent-las-palmas-guide", reason: "DIY city framework.", topExcursion: "Independent", returnConfidence: "High", walkingDifficulty: "Variable" },
      { name: "One Day in Gran Canaria", slug: "one-day-in-gran-canaria", href: "/guides/one-day-in-gran-canaria", reason: "Full itinerary guide.", topExcursion: "Planning guide", returnConfidence: "High", walkingDifficulty: "Variable" },
    ],
    faqs: [
      ["Can I do city and island deeply in one day?", "No — choose one primary anchor for a satisfying day."],
      ["What is safest in poor weather?", "City plans with Mercado del Puerto and museum stops."],
    ],
    related: ["one-day-in-gran-canaria", "las-palmas-or-island-tour", "best-gran-canaria-shore-excursion-first-time-visitors"],
    imageKey: "highlights",
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

export function getComparisonGuideItems(slug: string): ComparisonGuideItem[] {
  const c = getComparisonBySlug(slug);
  return c?.guideItems ?? [];
}

export function getComparisonFaqs(slug: string): FAQ[] {
  const c = getComparisonBySlug(slug);
  return c?.faqs ?? [];
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
  { id: "vegueta", label: "Vegueta & historic Las Palmas" },
  { id: "volcanic", label: "Volcanic landscapes & caldera" },
  { id: "food-wine", label: "Canarian food and wine" },
  { id: "beach", label: "Las Canteras & coastal beaches" },
  { id: "island", label: "Island scenic tour" },
  { id: "mountains", label: "Roque Nublo & highlands" },
  { id: "walking", label: "Walking-focused exploration" },
] as const;

const THEMES = {
  city: {
    headline: "Walkable Las Palmas city day",
    summary: "Stay in Las Palmas for Las Canteras, Vegueta, Triana and maximum flexibility with low transfer risk.",
    top: ["half-day-las-palmas-tour", "vegueta-historic-las-palmas-tour", "las-canteras-beach-day"],
  },
  island: {
    headline: "Gran Canaria island scenery day",
    summary: "Head into Gran Canaria's interior for volcanic landscapes, villages and dramatic viewpoints.",
    top: ["a-taste-of-gran-canaria", "gran-canaria-and-roque-nublo", "scenic-island-highlights-tour"],
  },
  culinary: {
    headline: "Canarian flavour day",
    summary: "Use your call for papas arrugadas, local wines, market dining and Canarian coffee culture.",
    top: ["canarian-food-wine-tour", "a-taste-of-gran-canaria", "vegueta-historic-las-palmas-tour"],
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
  if (set.has("island") || set.has("volcanic") || set.has("mountains")) return "island";
  if (set.has("food-wine")) return "culinary";
  return "city";
}

function excursionLink(slug: string): PlannerLink | null {
  const ex = excursions.find((e) => e.slug === slug);
  if (!ex) return null;
  return { label: ex.title, href: "/shore-excursions/" + ex.slug, why: ex.tagline };
}

export function generateLaspalmasPlan(input: PlannerInput): PlannerResult {
  const hours = calcHours(input);
  const themeKey = pickTheme(input.interests);
  const theme = THEMES[themeKey];
  const party = input.adults + input.children;

  const excursionCandidates = theme.top
    .map(excursionLink)
    .filter((x): x is PlannerLink => Boolean(x));

  const transfers: PlannerLink[] = [
    { label: "Terminal to Las Canteras", href: "/guides/las-canteras-beach-from-cruise-port", why: "15-25 min walk on a flat waterfront route from Muelle Santa Catalina." },
    { label: "Terminal to Vegueta", href: "/guides/vegueta-walking-guide", why: "Roughly 15-20 min taxi or 25-35 min bus to the historic quarter." },
    { label: "Las Palmas to Roque Nublo", href: "/guides/roque-nublo-from-cruise-ship", why: "Around 45-60 min each way by coach — plan for standard or long port calls." },
  ];

  const logistics: PlannerLink[] = [
    { label: "Cruise port guide", href: "/cruise-port-guide", why: "Confirm all-aboard time and terminal layout before leaving the ship." },
    { label: "Independent Las Palmas guide", href: "/guides/independent-las-palmas-guide", why: "Self-guided route with walking distances, taxi prices and return-to-ship advice." },
    { label: "Las Palmas or island tour?", href: "/compare/las-palmas-or-island-tour", why: "Honest comparison when you must choose between city and island." },
    { label: "One day in Gran Canaria", href: "/guides/one-day-in-gran-canaria", why: "Hour-by-hour sample itinerary for your port window." },
  ];

  const dayPlan: { time: string; text: string }[] = [];

  if (themeKey === "island") {
    dayPlan.push({ time: "Morning", text: "Depart early on island excursion — A Taste of Gran Canaria or Roque Nublo — before coach traffic builds." });
    dayPlan.push({ time: "Midday", text: "Scenic stops, village walk or caldera viewpoint with guided commentary and controlled free time." });
    dayPlan.push({ time: "Afternoon", text: "Return to Las Palmas with conservative buffer; optional short Las Canteras walk if time remains." });
  } else if (themeKey === "culinary") {
    dayPlan.push({ time: "Morning", text: "Mercado del Puerto or Vegueta market orientation with coffee and light Canarian snacks." });
    dayPlan.push({ time: "Midday", text: "Main food and wine experience — papas arrugadas, fresh fish and regional wine at a pre-selected venue." });
    dayPlan.push({ time: "Afternoon", text: "Triana coffee roaster stop, then early return toward port via Las Canteras promenade." });
  } else {
    dayPlan.push({ time: "Morning", text: "Walk terminal to Las Canteras, then taxi to Vegueta for cathedral and colonial quarter before peak foot traffic." });
    dayPlan.push({ time: "Midday", text: "Tapas lunch in Vegueta or Mercado del Puerto, plus Triana shopping if time allows." });
    dayPlan.push({ time: "Afternoon", text: "Return via Las Canteras promenade for coffee and flexible beach time close to the ship." });
  }

  dayPlan.push({
    time: "Return buffer",
    text: "Be back near Muelle Santa Catalina 60-90 minutes before all-aboard to absorb traffic, queues or weather delays.",
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
      " Las Palmas port day (~" +
      hours.toFixed(1) +
      " usable hours) for " +
      party +
      " guest" +
      (party === 1 ? "" : "s") +
      " interested in " +
      (interestText || "classic Gran Canaria highlights") +
      ".",
    excursions: excursionCandidates,
    transfers,
    stay: [],
    logistics,
    dayPlan,
  };
}
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
  { id: "editors-choice", label: "Editor's Choice", shortLabel: "Editor's Choice", description: "Top overall pick after balancing impact, logistics and return confidence for Las Palmas cruise passengers." },
  { id: "best-historic", label: "Best Historic Experience", shortLabel: "Historic", description: "Vegueta colonial quarter, Casa de Colón and Atlantic trading heritage." },
  { id: "best-independent", label: "Best Independent Experience", shortLabel: "Independent", description: "Self-guided plans that work well from Las Palmas cruise terminal." },
  { id: "best-coastal", label: "Best Coastal Experience", shortLabel: "Coastal", description: "Las Canteras urban beach, Maspalomas dunes and Atlantic coastline." },
  { id: "best-view", label: "Best Viewpoints", shortLabel: "Viewpoints", description: "Roque Nublo, Bandama caldera and highland panoramas." },
  { id: "best-families", label: "Best for Families", shortLabel: "Families", description: "Pacing and route design suitable for children and mixed-age groups." },
  { id: "best-photography", label: "Best for Photography", shortLabel: "Photography", description: "Volcanic landscapes, dunes, colonial architecture and Atlantic light." },
  { id: "best-food", label: "Best Food & Wine Experience", shortLabel: "Food & Wine", description: "Canarian cuisine, local wines, market dining and coffee culture." },
  { id: "best-luxury", label: "Best Luxury Experience", shortLabel: "Luxury", description: "Private Gran Canaria touring with custom pace and comfort." },
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
    label: "I am visiting Las Palmas for the day on a cruise",
    shortLabel: "Port day",
    description: "Find shore excursions, independent routes and realistic logistics from Las Palmas cruise terminal.",
    href: "/shore-excursions",
    cta: "Plan my port day",
  },
  {
    id: "first-time",
    label: "It is my first time in Gran Canaria",
    shortLabel: "First visit",
    description: "Decide between city immersion and island touring with honest timing advice.",
    href: "/guides/las-palmas-for-first-time-visitors",
    cta: "First-timer guide",
  },
  {
    id: "independent",
    label: "I prefer to explore independently",
    shortLabel: "Independent",
    description: "Self-guided city loops, Las Canteras walks, taxi options and Canarian food planning.",
    href: "/guides/independent-las-palmas-guide",
    cta: "Independent route",
  },
  {
    id: "families",
    label: "I am travelling with family",
    shortLabel: "Families",
    description: "Family pacing, beach-friendly choices and flexible weather alternatives.",
    href: "/guides/las-palmas-for-families",
    cta: "Family guide",
  },
];

export const experienceCards: ExperienceCard[] = [
  {
    slug: "volcanoes",
    title: "Volcanoes",
    description: "Bandama caldera, Roque Nublo and Gran Canaria's volcanic heart.",
    href: "/guides/bandama-caldera-guide",
    cta: "Explore volcanoes",
    imageKey: "galicia-landscape",
  },
  {
    slug: "mountain-villages",
    title: "Mountain Villages",
    description: "Traditional Canarian villages in pine forests and highland scenery.",
    href: "/shore-excursions/a-taste-of-gran-canaria",
    cta: "Explore villages",
    imageKey: "highlights",
  },
  {
    slug: "beaches-dunes",
    title: "Beaches & Dunes",
    description: "Las Canteras urban beach and Maspalomas desert dunes.",
    href: "/guides/las-canteras-beach-from-cruise-port",
    cta: "Explore beaches",
    imageKey: "beach",
  },
  {
    slug: "historic-las-palmas",
    title: "Historic Las Palmas",
    description: "Vegueta colonial quarter, cathedral and Casa de Colón.",
    href: "/guides/vegueta-walking-guide",
    cta: "Explore history",
    imageKey: "old-town",
  },
  {
    slug: "food-coffee-wine",
    title: "Food, Coffee & Wine",
    description: "Canarian cuisine, market dining, local coffee and island wines.",
    href: "/guides/canarian-food-guide",
    cta: "Food & wine guide",
    imageKey: "food",
  },
  {
    slug: "private-island-tours",
    title: "Private Island Tours",
    description: "Custom private itineraries for comfort and flexibility across Gran Canaria.",
    href: "/shore-excursions/private-gran-canaria-tour",
    cta: "Go private",
    imageKey: "photography",
  },
];

export const coreSections: HomeSection[] = [
  { slug: "shore-excursions", number: "01", title: "Shore Excursions", description: "Roque Nublo, island highlights, Vegueta, food & wine and dunes — cruise-timed from Las Palmas.", href: "/shore-excursions", cta: "Browse excursions" },
  { slug: "guides", number: "02", title: "Gran Canaria Planning Guides", description: "Authority guides for volcanic landscapes, beaches, food, independent routes and every passenger type.", href: "/guides", cta: "Read guides" },
  { slug: "cruise-port-guide", number: "03", title: "Las Palmas Cruise Port Guide", description: "Terminal layout, Las Canteras access, taxi costs and practical arrival advice.", href: "/cruise-port-guide", cta: "Port guide" },
  { slug: "cruise-planner", number: "04", title: "Las Palmas Cruise Planner", description: "Answer a few questions — get a tailored itinerary with return-to-ship confidence.", href: "/cruise-planner", cta: "Start planning" },
  { slug: "compare", number: "05", title: "Compare Options", description: "Las Palmas vs island tour, Roque Nublo worth it, Bandama vs dunes — honest comparisons.", href: "/compare/las-palmas-or-island-tour", cta: "Compare options" },
  { slug: "ship-schedules", number: "06", title: "Cruise Ship Schedules", description: "See which ships call at Las Palmas and plan around published arrival and departure times.", href: "/ship-schedules/laspalmas", cta: "View schedules" },
  { slug: "one-day", number: "07", title: "One Day in Gran Canaria", description: "Hour-by-hour sample itineraries from gangway to all-aboard.", href: "/guides/one-day-in-gran-canaria", cta: "One-day guide" },
  { slug: "faq", number: "08", title: "FAQ", description: "Las Palmas cruise port questions answered — timing, taxis, island tours and return buffers.", href: "/faq", cta: "Read FAQs" },
];

export function getHomepageFaqs(): FAQ[] {
  return [
    {
      question: "Where do cruise ships dock in Las Palmas?",
      answer: "At Muelle Santa Catalina, near Santa Catalina park and the Las Canteras waterfront.",
    },
    {
      question: "Is Las Palmas walkable from the cruise terminal?",
      answer: "Las Canteras beach yes — 15-25 minutes on foot. Vegueta historic quarter needs a taxi or bus.",
    },
    {
      question: "Is Gran Canaria worth leaving the city for on a cruise day?",
      answer: "Yes on standard or long calls — Roque Nublo, Bandama and Maspalomas deliver landscapes unlike any other cruise port.",
    },
    {
      question: "What is the best first excursion from Las Palmas?",
      answer: "Most first-timers choose A Taste of Gran Canaria for breadth or Gran Canaria and Roque Nublo for mountain scenery.",
    },
    {
      question: "Can I explore Las Palmas without a ship excursion?",
      answer: "Yes, the city is highly independent-friendly with Las Canteras walkable and Vegueta a short taxi ride away.",
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
import laspalmasSchedule from "./imported-schedules/laspalmas.json";

const SCHEDULE_FAQS = [
  {
    question: "How accurate are Las Palmas cruise schedules?",
    answer:
      "Schedules are compiled from published data and updated periodically. Arrival times and berth assignments can change, so always verify with your cruise line.",
  },
  {
    question: "When is peak cruise season in Las Palmas?",
    answer:
      "Las Palmas receives calls year-round with strong winter sun appeal; busiest traffic typically October through April on Atlantic and Canary Islands itineraries.",
  },
  {
    question: "Can I plan an island tour on any call length?",
    answer:
      "Island tours work best on standard or long calls. Tight calls benefit from city-focused options like Half-Day Las Palmas or Short Port Call Tour.",
  },
];

const SCHEDULE_TIPS = [
  "Check multi-ship days before locking excursion bookings",
  "Book Roque Nublo and A Taste of Gran Canaria early on high-traffic dates",
  "Keep 60-90 minute return buffer before all-aboard",
  "Highland weather can differ from coast — pack layers for island excursions",
];

export const schedulePorts: ShipSchedulePort[] = [
  {
    slug: "laspalmas",
    name: "Las Palmas de Gran Canaria",
    country: "Spain",
    seoTitle: "Las Palmas Cruise Ship Schedule 2026",
    metaDescription:
      "Las Palmas de Gran Canaria cruise ship schedule with arrival/departure planning tips for city highlights and island excursions.",
    intro:
      "Las Palmas is a major Canary Islands cruise hub with excellent city access, Las Canteras beach and strong island excursion potential across volcanic and dune landscapes.",
    description: "Canary Islands capital with urban beach, colonial heritage and miniature-continent island touring.",
    scheduleOverview:
      "Cruise traffic peaks across Atlantic repositioning and Canary Islands itineraries, with year-round calls benefiting from reliable winter weather.",
    planningTips: SCHEDULE_TIPS,
    faqs: SCHEDULE_FAQS,
  },
];

const schedulesByPort: Record<string, ScheduleEntry[]> = {
  laspalmas: (laspalmasSchedule as ScheduleEntry[]) ?? [],
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
  title: "Las Palmas Cruise Port Guide",
  subtitle: "Terminal location, Las Canteras access, Vegueta transfers, island excursion staging and return-to-ship strategy for Las Palmas cruise passengers.",
  terminals: [
    {
      name: "Muelle Santa Catalina",
      quay: "Main cruise terminal at Las Palmas de Gran Canaria waterfront",
      usedBy: "Most mainstream and premium ships calling at Gran Canaria",
      cityAccess: "15-25 min walk to Las Canteras; 15-20 min taxi to Vegueta; excursion coaches at terminal zone",
    },
    {
      name: "Santa Catalina Park",
      quay: "Waterfront park adjacent to cruise terminal",
      usedBy: "Independent cruise visitors orienting from terminal",
      cityAccess: "Immediate green space, cafés and Las Canteras promenade access",
    },
    {
      name: "Excursion coach staging",
      quay: "Designated pickup points near cruise terminal",
      usedBy: "Island tour and city shore excursion operators",
      cityAccess: "Direct boarding with ship-time aligned departures to Roque Nublo, dunes and city routes",
    },
  ] as Terminal[],
  sections: [
    {
      heading: "Terminal and first steps",
      paragraphs: [
        "Las Palmas' terminal at Muelle Santa Catalina puts you within walking distance of Las Canteras beach and Santa Catalina park. This is one of the stronger city-beach cruise port locations in the Canary Islands.",
        "Keep your ship card and photo ID with you. Decide early whether your day is city-focused (walkable) or island-focused (excursion coach required).",
        "Independent travellers should screenshot terminal location and all-aboard time before leaving the quay.",
      ],
    },
    {
      heading: "Getting around the city",
      paragraphs: [
        "Walking works for Las Canteras promenade and Santa Catalina park from the terminal.",
        "Taxis (EUR 8-15) and Global buses reach Vegueta, Triana and Mercado del Puerto efficiently.",
        "The historic quarter has cobbled lanes — comfortable shoes help. Las Canteras offers reef-protected swimming.",
      ],
    },
    {
      heading: "Island tour transfer reality",
      paragraphs: [
        "Roque Nublo sits roughly 45 km inland — typically 45-60 minutes each way by coach plus a 30-45 minute walk at altitude.",
        "Maspalomas dunes are 55 km south — 50-70 minutes each way. Bandama caldera is closer at 20 km — 30-40 minutes each way.",
        "A well-paced island excursion delivers meaningful scenery time, but avoid trying to add deep city touring on the same day.",
      ],
    },
    {
      heading: "Return to ship strategy",
      paragraphs: [
        "Target return to terminal area 60-90 minutes before all-aboard.",
        "Island excursions should build conservative buffers; city independent days still need discipline near end of call.",
        "On independent days, keep final stops near Las Canteras or Santa Catalina for an easy walk back to Muelle Santa Catalina.",
      ],
    },
  ] as PortGuideSection[],
  faqs: [
    {
      question: "How far is Las Canteras beach from the cruise terminal?",
      answer: "Usually around 15-25 minutes on foot via a pleasant waterfront route.",
    },
    {
      question: "Can I walk to Vegueta from the cruise ship?",
      answer: "It is possible but not recommended — taxi or bus is faster and more comfortable.",
    },
    {
      question: "How long should I allow returning from Roque Nublo?",
      answer: "At least 45-60 minutes coach travel plus a conservative 60-90 minute all-aboard buffer.",
    },
    {
      question: "Is Las Palmas suitable for independent port days?",
      answer: "Yes, especially for city and beach focus. Island highlights require organised excursions.",
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
    question: "Where do cruise ships dock in Las Palmas?",
    answer:
      "At Muelle Santa Catalina, near Santa Catalina park with easy access to Las Canteras beach on foot.",
  },
  {
    question: "Is Las Palmas a walkable cruise port?",
    answer:
      "Partially. Las Canteras is walkable from the terminal; Vegueta and island highlights need taxi, bus or excursion.",
  },
  {
    question: "How far is Roque Nublo from Las Palmas cruise port?",
    answer:
      "About 45 km inland, typically 45-60 minutes each way by coach depending traffic and route.",
  },
  {
    question: "What is the best first excursion in Las Palmas?",
    answer:
      "For island breadth, A Taste of Gran Canaria. For mountain scenery, Gran Canaria and Roque Nublo. For city focus, Half-Day Las Palmas.",
  },
  {
    question: "Can I explore Las Palmas independently instead of booking a tour?",
    answer:
      "Yes for the city — Las Canteras, Vegueta via taxi and Triana are all practical. Island highlights need organised tours.",
  },
  {
    question: "Is Roque Nublo worth visiting on a port day?",
    answer:
      "Yes on standard or long calls if scenery is your priority — it is Gran Canaria's most dramatic natural landmark.",
  },
  {
    question: "Are Las Palmas beaches practical on a cruise call?",
    answer:
      "Las Canteras absolutely — walkable and excellent. Southern resort beaches need long transfers unless part of a dune excursion.",
  },
  {
    question: "How much should I budget for taxis in Las Palmas?",
    answer:
      "Short central rides EUR 8-15; Las Canteras from terminal EUR 5-10; Vegueta EUR 8-12 depending traffic.",
  },
  {
    question: "Is Las Palmas suitable for families?",
    answer:
      "Very suitable — Las Canteras beach, manageable city distances and family excursion options work well for mixed-age groups.",
  },
  {
    question: "How early should I return to the ship?",
    answer:
      "Aim to be back near Muelle Santa Catalina 60-90 minutes before all-aboard, especially after island excursions.",
  },
  {
    question: "What should I eat in Las Palmas on a cruise day?",
    answer:
      "Prioritise papas arrugadas with mojo, fresh Atlantic fish, gofio and Canarian wine if timing allows.",
  },
  {
    question: "Is weather a major factor in Las Palmas planning?",
    answer:
      "Coast is reliably mild; highland excursions can be cooler and cloudier — pack layers for Roque Nublo and Bandama.",
  },
  {
    question: "Can I do the city and a full island tour in one day?",
    answer:
      "Not with depth in both. Choose one primary anchor — city or island — for a satisfying port day.",
  },
  {
    question: "Are private tours useful in Las Palmas?",
    answer:
      "Yes for mixed mobility, family groups and travellers wanting custom pace across city and island highlights.",
  },
  {
    question: "What are the strongest categories of Las Palmas shore excursions?",
    answer:
      "Island highlights, volcanic landscapes, historic city tours, food and wine, beach days, private tours and short port call options.",
  },
];

export function getAllFaqs(): FAQ[] {
  return [...getHomepageFaqs(), ...extraFaqs];
}
`,
);

// ─── CRUISE PLANNING HUB PAGES ──────────────────────────────────────────────

const CANARY_BASE =
  "These pages help Las Palmas cruise passengers plan nearby Canary Islands and Atlantic ports with realistic transfer expectations and honest pacing guidance.";

const cruisePlanning = [
  {
    s: "canary-islands-cruise-planner",
    title: "Canary Islands Cruise Planner",
    seo: "Canary Islands Cruise Planner for Las Palmas Passengers",
    meta: "Multi-port planning hub connecting Las Palmas with Tenerife, Lanzarote, Madeira and Atlantic cruise calls.",
    tag: "Plan your wider itinerary, not just one port day.",
    ov: "A practical hub for cruise passengers combining Las Palmas with other Canary Islands and Atlantic calls.",
    b1: CANARY_BASE,
    b2: "Use this hub to sequence high-effort island days and relaxed city days across your itinerary so you avoid fatigue stacking.",
    b3: "Where external authority sites exist, we link directly so you can plan each stop with local depth.",
    hi: ["Cross-port planning", "Transfer realism", "Fatigue-aware sequencing"],
    ti: ["Balance island tours with walkable days", "Book priority excursions early", "Keep weather contingencies"],
    recs: [
      { c: "editors-choice", t: "Canary Islands Cruise Ports", d: "Compare Atlantic island calls in one view.", h: "/plan-your-cruise-holiday/canary-islands-cruise-ports" },
      { c: "best-value", t: "Spain Cruise Guide", d: "Nationwide planning approach for cruise itineraries.", h: "/plan-your-cruise-holiday/spain-cruise-guide" },
    ],
    rel: ["canary-islands-cruise-ports", "spain-cruise-guide", "tenerife-shore-excursions"],
    img: "highlights",
  },
  {
    s: "tenerife-shore-excursions",
    title: "Tenerife Shore Excursions",
    seo: "Tenerife Shore Excursions — Canary Islands Planning",
    meta: "Tenerife planning resource for cruise passengers continuing through Canary Islands itineraries from Las Palmas.",
    tag: "Teide, beaches and southern resorts — the next island south.",
    ov: "If your itinerary includes Tenerife as well as Las Palmas, use this page to compare excursion profiles and pacing between the two islands.",
    b1: CANARY_BASE,
    b2: "Tenerife offers Teide National Park and southern resort beaches — a different profile from Las Palmas' city-beach-volcano combination.",
    b3: "External resource: https://tenerifeshoreexcursions.com",
    hi: ["Teide and southern Tenerife context", "Useful for multi-port planning"],
    ti: ["Compare walking demands across islands", "Pre-plan Teide days carefully", "Use external specialist guides"],
    recs: [
      { c: "best-independent", t: "Tenerife Shore Excursions", d: "External planning authority.", h: "https://tenerifeshoreexcursions.com" },
    ],
    rel: ["canary-islands-cruise-ports", "canary-islands-cruise-planner", "spain-cruise-guide"],
    img: "galicia-landscape",
  },
  {
    s: "lanzarote-shore-excursions",
    title: "Lanzarote Shore Excursions",
    seo: "Lanzarote Shore Excursions — Canary Islands Planning",
    meta: "Lanzarote cruise planning reference for passengers combining eastern Canary Islands ports on one itinerary.",
    tag: "Volcanic Timanfaya landscapes and César Manrique heritage.",
    ov: "Lanzarote appears on many Canary Islands loops alongside Las Palmas. Use this page to plan pacing between the two islands.",
    b1: CANARY_BASE,
    b2: "Lanzarote leans toward volcanic national park experiences and Manrique architecture, while Las Palmas offers city depth and highland pine forests.",
    b3: "External reference: https://lanzaroteshoreexcursions.com",
    hi: ["Volcanic island contrast", "External planning link"],
    ti: ["Avoid two intensive volcanic days in a row", "Sequence active and relaxed ports", "Use local authority guidance"],
    recs: [
      { c: "best-view", t: "Lanzarote Shore Excursions", d: "External Lanzarote planning resource.", h: "https://lanzaroteshoreexcursions.com" },
    ],
    rel: ["canary-islands-cruise-planner", "canary-islands-cruise-ports", "spain-cruise-guide"],
    img: "coast",
  },
  {
    s: "canary-islands-cruise-ports",
    title: "Canary Islands Cruise Ports",
    seo: "Canary Islands Cruise Ports — Planning Hub",
    meta: "Canary Islands cruise planning hub connecting Las Palmas with Tenerife, Lanzarote and wider Atlantic routes.",
    tag: "Compare Canary Islands ports with honest logistics.",
    ov: "This hub helps you compare walkability, transfer patterns and headline experiences across Canary Islands cruise calls.",
    b1: CANARY_BASE,
    b2: "Las Palmas stands out for capital-city depth, Las Canteras beach and access to Roque Nublo highlands within one port day.",
    b3: "Use the linked guides to avoid overloading consecutive excursion-heavy days.",
    hi: ["Port-to-port comparison", "Transfer realism", "Energy-aware itinerary design"],
    ti: ["Alternate active and relaxed ports", "Pre-book flagship excursions", "Protect return buffers"],
    recs: [
      { c: "best-value", t: "Tenerife Shore Excursions", d: "External Tenerife planning reference.", h: "https://tenerifeshoreexcursions.com" },
      { c: "best-independent", t: "Independent Las Palmas Guide", d: "Strong DIY day template.", h: "/guides/independent-las-palmas-guide" },
    ],
    rel: ["tenerife-shore-excursions", "spain-cruise-guide", "canary-islands-cruise-planner"],
    img: "highlights",
  },
  {
    s: "madeira-cruise-port",
    title: "Madeira Cruise Port",
    seo: "Madeira Cruise Port Guide — Atlantic Planning",
    meta: "Madeira cruise planning page for travellers combining Portuguese Atlantic and Canary Islands ports on one itinerary.",
    tag: "Lush levada walks and Funchal — the Atlantic garden island.",
    ov: "Madeira and Las Palmas often appear on the same Atlantic repositioning routes. Use this page to plan pacing between them.",
    b1: CANARY_BASE,
    b2: "Madeira offers levada walks and lush subtropical scenery, while Las Palmas delivers volcanic highlands and desert dunes — contrasting Atlantic experiences.",
    b3: "Compare transfer intensity before finalising excursion bookings.",
    hi: ["Atlantic island contrast", "Different excursion profiles", "Stronger itinerary balance"],
    ti: ["Avoid two long coach days in a row", "Choose one flagship excursion per port", "Keep weather in mind"],
    recs: [
      { c: "best-historic", t: "Spain Cruise Guide", d: "Country-wide planning framework.", h: "/plan-your-cruise-holiday/spain-cruise-guide" },
    ],
    rel: ["spain-cruise-guide", "canary-islands-cruise-planner", "canary-islands-cruise-ports"],
    img: "coast",
  },
  {
    s: "cadiz-shore-excursions",
    title: "Cadiz Shore Excursions",
    seo: "Cadiz Shore Excursions — Atlantic Spain Planning",
    meta: "Cadiz cruise planning page for travellers combining mainland Spanish and Canary Islands ports on one itinerary.",
    tag: "Andalusian heritage complement to Gran Canaria's Atlantic island character.",
    ov: "Cadiz and Las Palmas offer contrasting Spanish cruise experiences. Use this page to plan pacing between mainland and island calls.",
    b1: CANARY_BASE,
    b2: "Cadiz often leans toward Andalusian heritage, while Las Palmas focuses on volcanic landscapes, colonial city texture and Canarian food culture.",
    b3: "Compare transfer intensity and excursion style before finalising bookings.",
    hi: ["Mainland vs island Spain contrast", "Different excursion profiles", "Stronger itinerary balance"],
    ti: ["Avoid two long inland days in a row", "Choose one flagship excursion per port", "Keep heat and weather in mind"],
    recs: [
      { c: "best-historic", t: "Spain Cruise Guide", d: "Country-wide planning framework.", h: "/plan-your-cruise-holiday/spain-cruise-guide" },
    ],
    rel: ["spain-cruise-guide", "canary-islands-cruise-planner", "madeira-cruise-port"],
    img: "old-town",
  },
  {
    s: "spain-cruise-guide",
    title: "Spain Cruise Guide",
    seo: "Spain Cruise Guide for Multi-Port Itineraries",
    meta: "Spain cruise planning guide connecting Las Palmas with mainland Iberian port-call strategy and excursion pacing.",
    tag: "Build a smarter Spain itinerary port by port.",
    ov: "A practical Spain-wide cruise planning guide to balance island excursions, mainland heritage days and culinary priorities.",
    b1: CANARY_BASE,
    b2: "Use Las Palmas for volcanic island and city options, then calibrate effort across Cadiz, mainland Atlantic ports and beyond.",
    b3: "When in doubt, choose fewer high-value anchors rather than overpacked daily schedules.",
    hi: ["Nationwide planning lens", "Pacing strategy", "Excursion prioritisation"],
    ti: ["Alternate intense and relaxed days", "Plan around weather and transfer time", "Keep contingency blocks"],
    recs: [
      { c: "editors-choice", t: "Canary Islands Cruise Ports", d: "Regional comparison hub.", h: "/plan-your-cruise-holiday/canary-islands-cruise-ports" },
      { c: "best-independent", t: "Independent Las Palmas Guide", d: "Model for self-guided island capital calls.", h: "/guides/independent-las-palmas-guide" },
    ],
    rel: ["canary-islands-cruise-planner", "canary-islands-cruise-ports", "cadiz-shore-excursions"],
    img: "highlights",
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
    title: "Canary Islands Cruise Planner",
    href: "https://canaryislandscruiseplanner.com",
    description: "Cross-port itinerary tools for Canary Islands and Atlantic cruise routes.",
  },
  {
    title: "Tenerife Shore Excursions",
    href: "https://tenerifeshoreexcursions.com",
    description: "External planning authority for Tenerife cruise calls.",
  },
  {
    title: "Lanzarote Shore Excursions",
    href: "https://lanzaroteshoreexcursions.com",
    description: "External Lanzarote planning reference for Canary Islands itineraries.",
  },
  {
    title: "Madeira Cruise Port",
    href: "https://madeiracruiseport.com",
    description: "Atlantic garden island planning context for repositioning routes.",
  },
  {
    title: "Cadiz Shore Excursions",
    href: "https://cadizshoreexcursions.com",
    description: "Mainland Spain counterpart for itinerary balancing.",
  },
  {
    title: "Spain Cruise Guide",
    href: "https://spaincruiseguide.com",
    description: "Multi-port Spain planning framework for cruise travellers.",
  },
];
`,
);

w("imported-schedules/laspalmas.json", "[]\n");

console.log("Las Palmas data generation complete.");
