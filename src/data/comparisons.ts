import type { Comparison, ComparisonGuideItem, FAQ } from "./types";

export const comparisons: Comparison[] = [
  {
    slug: "las-palmas-or-island-tour",
    title: "Stay in Las Palmas City vs Take an Island Tour",
    seoTitle: "Stay in Las Palmas City vs Take an Island Tour — Las Palmas Cruise Passengers",
    metaDescription: "City-stay plans maximise walkability, beach access and independent flexibility; island tours maximise volcanic scenery, villages and Gran Canaria's miniature-continent promise with longer coach transfers.",
    kind: "versus",
    optionA: "Stay in Las Palmas City",
    optionB: "Take an Island Tour",
    summary: "City-stay plans maximise walkability, beach access and independent flexibility; island tours maximise volcanic scenery, villages and Gran Canaria's miniature-continent promise with longer coach transfers.",
    verdict: "Choose city-stay for Las Canteras, Vegueta and low-transfer independence. Choose island tour for Roque Nublo, dunes, caldera and highland drama.",
    overview: ["Las Palmas city day: walkable beach, historic quarter and food.", "Island day: volcanic landscapes, villages and dramatic viewpoints.", "Transfer tolerance and scenery appetite are the deciding factors."],
    comparisonTable: [{ category: "Transfer time", optionA: "Minimal (taxi/walk)", optionB: "45-90 min each way by coach" }, { category: "Scenery impact", optionA: "Urban beach and colonial city", optionB: "Volcanic highlands, dunes or caldera" }, { category: "Flexibility", optionA: "High", optionB: "Moderate (tour schedule)" }, { category: "Return confidence", optionA: "Very high", optionB: "High with good operator" }],
    faqs: [{ question: "What is safer for short calls?", answer: "Staying in Las Palmas city is safer when usable hours are limited." }, { question: "What is better for first-timers?", answer: "A Taste of Gran Canaria if you want island breadth; city day if you prefer independence." }],
    relatedSlugs: ["best-gran-canaria-shore-excursion-first-time-visitors", "one-day-in-gran-canaria-from-cruise-ship", "can-you-explore-las-palmas-independently"],
    imageKey: "compare",
  },
  {
    slug: "is-roque-nublo-worth-it-from-cruise-ship",
    title: "Is Roque Nublo Worth It from a Cruise Ship?",
    seoTitle: "Is Roque Nublo Worth It from Las Palmas Cruise Port?",
    metaDescription: "Honest evaluation of whether Roque Nublo justifies the transfer and walk from Las Palmas cruise port on a port day.",
    kind: "guide",
    summary: "For scenery-first travellers on standard or long calls, yes — Roque Nublo is Gran Canaria's most memorable natural sight and worth the coach time and moderate walk.",
    verdict: "Worth it when scenery is your top priority and you have 6+ usable hours. Less compelling on short calls or for passengers preferring city and beach.",
    overview: ["Transfer is 45-60 minutes each way — predictable but significant.", "Experience intensity is high for landscape and photography interests.", "Bandama or city day remain strong alternatives with less commitment."],
    guideItems: [{
        name: "Gran Canaria and Roque Nublo",
        slug: "gran-canaria-and-roque-nublo",
        href: "/shore-excursions/gran-canaria-and-roque-nublo",
        reason: "Dedicated Roque Nublo excursion.",
        topExcursion: "Editor's Choice secondary",
        returnConfidence: "High",
        walkingDifficulty: "Moderate to active",
      }, {
        name: "A Taste of Gran Canaria",
        slug: "a-taste-of-gran-canaria",
        href: "/shore-excursions/a-taste-of-gran-canaria",
        reason: "Broader island day with less walking.",
        topExcursion: "Editor's Choice primary",
        returnConfidence: "High",
        walkingDifficulty: "Moderate",
      }, {
        name: "Bandama Caldera Tour",
        slug: "bandama-caldera-tour",
        href: "/shore-excursions/bandama-caldera-tour",
        reason: "Closer volcanic alternative.",
        topExcursion: "Volcanic focus",
        returnConfidence: "High",
        walkingDifficulty: "Moderate",
      }],
    faqs: [{ question: "Will I feel rushed at Roque Nublo?", answer: "Well-run tours allow adequate viewpoint time; independent travel is harder to pace." }, { question: "What if clouds cover the peak?", answer: "Highland scenery still impresses; views may be partial." }],
    relatedSlugs: ["roque-nublo-from-cruise-ship", "las-palmas-or-island-tour", "bandama-caldera-or-maspalomas-dunes"],
    imageKey: "galicia-landscape",
  },
  {
    slug: "best-gran-canaria-shore-excursion-first-time-visitors",
    title: "Best Gran Canaria Shore Excursion for First-Time Visitors",
    seoTitle: "Best Gran Canaria Shore Excursion for First-Time Cruise Visitors",
    metaDescription: "Compare top Gran Canaria shore excursions for first-time visitors by pace, scenery, food and return confidence from Las Palmas port.",
    kind: "guide",
    summary: "First-time visitors should choose between island breadth (A Taste of Gran Canaria) and mountain drama (Roque Nublo) rather than trying to do everything.",
    verdict: "A Taste of Gran Canaria is top for balanced first visits. Gran Canaria and Roque Nublo is top for scenery purists. Half-Day Las Palmas suits city-first short calls.",
    overview: ["Editor's Choice primary: A Taste of Gran Canaria.", "Editor's Choice secondary: Gran Canaria and Roque Nublo.", "City and short-call alternatives remain strong."],
    guideItems: [{
        name: "A Taste of Gran Canaria",
        slug: "a-taste-of-gran-canaria",
        href: "/shore-excursions/a-taste-of-gran-canaria",
        reason: "Best all-round island introduction.",
        topExcursion: "Editor's Choice",
        returnConfidence: "High",
        walkingDifficulty: "Moderate",
      }, {
        name: "Gran Canaria and Roque Nublo",
        slug: "gran-canaria-and-roque-nublo",
        href: "/shore-excursions/gran-canaria-and-roque-nublo",
        reason: "Best mountain scenery.",
        topExcursion: "Editor's Choice secondary",
        returnConfidence: "High",
        walkingDifficulty: "Active",
      }, {
        name: "Half-Day Las Palmas",
        slug: "half-day-las-palmas-tour",
        href: "/shore-excursions/half-day-las-palmas-tour",
        reason: "Best city-first option.",
        topExcursion: "City focus",
        returnConfidence: "Very high",
        walkingDifficulty: "Moderate",
      }, {
        name: "Family Gran Canaria Tour",
        slug: "family-gran-canaria-tour",
        href: "/shore-excursions/family-gran-canaria-tour",
        reason: "Best for mixed-age groups.",
        topExcursion: "Family",
        returnConfidence: "High",
        walkingDifficulty: "Low to moderate",
      }],
    faqs: [{ question: "Which tour should first-timers pick?", answer: "Most choose A Taste of Gran Canaria or Roque Nublo depending scenery vs breadth preference." }, { question: "Can I decide on arrival day?", answer: "Possible, but featured options may sell out on popular sailings." }],
    relatedSlugs: ["las-palmas-for-first-time-visitors", "best-las-palmas-shore-excursions", "one-day-in-gran-canaria"],
    imageKey: "highlights",
  },
  {
    slug: "can-you-explore-las-palmas-independently",
    title: "Can You Explore Las Palmas Independently?",
    seoTitle: "Can You Explore Las Palmas Independently from Cruise Port?",
    metaDescription: "Independent exploration reality guide for Las Palmas cruise passengers, including walkability, taxis, buses and timing safeguards.",
    kind: "guide",
    summary: "Yes, Las Palmas city is highly workable independently for most cruise passengers — Las Canteras is walkable, Vegueta is a short taxi away, and island highlights need organised tours.",
    verdict: "Independent is excellent for city-focused days. Choose guided island excursions for Roque Nublo, dunes or caldera when scenery is the priority.",
    overview: ["Terminal location supports independent city exploration.", "Las Canteras promenade links easily from port.", "Taxis and buses offer fast backup for Vegueta and Triana."],
    guideItems: [{
        name: "Independent Las Palmas Guide",
        slug: "independent-las-palmas-guide",
        href: "/guides/independent-las-palmas-guide",
        reason: "Complete DIY city structure.",
        topExcursion: "DIY plan",
        returnConfidence: "High",
        walkingDifficulty: "Variable",
      }, {
        name: "Las Canteras Beach Guide",
        slug: "las-canteras-beach-from-cruise-port",
        href: "/guides/las-canteras-beach-from-cruise-port",
        reason: "Walkable beach from port.",
        topExcursion: "Beach day",
        returnConfidence: "Very high",
        walkingDifficulty: "Low",
      }, {
        name: "A Taste of Gran Canaria",
        slug: "a-taste-of-gran-canaria",
        href: "/shore-excursions/a-taste-of-gran-canaria",
        reason: "Guided island fallback.",
        topExcursion: "Island guided",
        returnConfidence: "High",
        walkingDifficulty: "Moderate",
      }],
    faqs: [{ question: "Is independent Las Palmas safe and practical?", answer: "Yes, with normal urban awareness and return-time discipline." }, { question: "Should I pre-book anything for independent day?", answer: "Taxi numbers and restaurant reservations help on multi-ship days." }],
    relatedSlugs: ["independent-las-palmas-guide", "las-palmas-or-island-tour", "half-day-las-palmas-tour"],
    imageKey: "old-town",
  },
  {
    slug: "bandama-caldera-or-maspalomas-dunes",
    title: "Bandama Caldera vs Maspalomas Dunes",
    seoTitle: "Bandama Caldera vs Maspalomas Dunes — Las Palmas Cruise Passengers",
    metaDescription: "Bandama offers closer volcanic intimacy 30-40 minutes from port; Maspalomas delivers unique desert-Atlantic scenery 50-70 minutes away.",
    kind: "versus",
    optionA: "Bandama Caldera",
    optionB: "Maspalomas Dunes",
    summary: "Bandama offers closer volcanic intimacy 30-40 minutes from port; Maspalomas delivers unique desert-Atlantic scenery 50-70 minutes away.",
    verdict: "Choose Bandama for shorter transfer and crater geology. Choose Maspalomas for surreal dune landscapes and photography.",
    overview: ["Bandama: closer, volcanic, crater-focused.", "Maspalomas: farther, unique, desert-coast drama.", "Both beat generic beach stops for scenery value."],
    comparisonTable: [{ category: "Transfer time", optionA: "30-40 min each way", optionB: "50-70 min each way" }, { category: "Landscape type", optionA: "Volcanic crater", optionB: "Desert dunes and Atlantic" }, { category: "Walking demand", optionA: "Moderate (crater paths)", optionB: "Moderate (sand walking)" }, { category: "Best for", optionA: "Geology and green interior", optionB: "Photography and unique scenery" }],
    faqs: [{ question: "Can I do both on one port day?", answer: "Not realistically — choose one as your island anchor." }, { question: "Which is better on a short call?", answer: "Bandama due to shorter transfer time." }],
    relatedSlugs: ["bandama-caldera-guide", "maspalomas-dunes-from-las-palmas-cruise-port", "is-roque-nublo-worth-it-from-cruise-ship"],
    imageKey: "coast",
  },
  {
    slug: "best-beaches-near-las-palmas-cruise-port",
    title: "Best Beaches Near Las Palmas Cruise Port",
    seoTitle: "Best Beaches Near Las Palmas Cruise Port — Comparison Guide",
    metaDescription: "Compare the best beaches accessible from Las Palmas cruise port including Las Canteras, southern resorts and practical timing advice.",
    kind: "guide",
    summary: "Las Canteras is the clear winner for cruise passengers — walkable, authentic and reef-protected. Southern beaches require long transfers better suited to dedicated dune or resort excursions.",
    verdict: "Las Canteras for independent city-beach days. Maspalomas area for combined dune-beach excursions. Skip long southern transfers for beach alone.",
    overview: ["Las Canteras: walkable urban beach, best independent option.", "Maspalomas/Playa del Inglés: excursion-only, combine with dunes.", "Port-proximate beats resort transfer for beach-only goals."],
    guideItems: [{
        name: "Las Canteras Beach Guide",
        slug: "las-canteras-beach-from-cruise-port",
        href: "/guides/las-canteras-beach-from-cruise-port",
        reason: "Best walkable beach from port.",
        topExcursion: "Independent or beach day tour",
        returnConfidence: "Very high",
        walkingDifficulty: "Low",
      }, {
        name: "Las Canteras Beach Day",
        slug: "las-canteras-beach-day",
        href: "/shore-excursions/las-canteras-beach-day",
        reason: "Structured beach excursion.",
        topExcursion: "Beach focus",
        returnConfidence: "Very high",
        walkingDifficulty: "Low",
      }, {
        name: "Maspalomas Dunes Tour",
        slug: "maspalomas-dunes-tour",
        href: "/shore-excursions/maspalomas-dunes-tour",
        reason: "Dune-beach combination.",
        topExcursion: "Southern excursion",
        returnConfidence: "High",
        walkingDifficulty: "Moderate",
      }],
    faqs: [{ question: "Is Las Canteras the best beach for cruise passengers?", answer: "Yes — proximity, quality and urban authenticity make it the default choice." }, { question: "Are southern resort beaches worth the transfer?", answer: "Only as part of a dune or island excursion, not for beach alone." }],
    relatedSlugs: ["las-canteras-beach-from-cruise-port", "maspalomas-dunes-from-las-palmas-cruise-port", "las-palmas-or-island-tour"],
    imageKey: "beach",
  },
  {
    slug: "one-day-in-gran-canaria-from-cruise-ship",
    title: "One Day in Gran Canaria from a Cruise Ship",
    seoTitle: "One Day in Gran Canaria from Cruise Ship — Compare Best Plans",
    metaDescription: "Compare realistic one-day Gran Canaria plans for cruise passengers: city immersion, island excursion and hybrid options from Las Palmas port.",
    kind: "guide",
    summary: "One day in Gran Canaria works best when you choose a clear anchor — city, island highlights or food — and build around weather and return confidence.",
    verdict: "City immersion wins for flexibility. Island excursion wins for scenery impact. Hybrid plans should stay conservative.",
    overview: ["Plan A: Full Las Palmas city day.", "Plan B: Island excursion anchor (A Taste or Roque Nublo).", "Plan C: Half-day tour plus independent food or beach focus."],
    guideItems: [{
        name: "A Taste of Gran Canaria",
        slug: "a-taste-of-gran-canaria",
        href: "/shore-excursions/a-taste-of-gran-canaria",
        reason: "Balanced island structure.",
        topExcursion: "Editor's Choice",
        returnConfidence: "High",
        walkingDifficulty: "Moderate",
      }, {
        name: "Half-Day Las Palmas",
        slug: "half-day-las-palmas-tour",
        href: "/shore-excursions/half-day-las-palmas-tour",
        reason: "Efficient city orientation.",
        topExcursion: "City guided",
        returnConfidence: "Very high",
        walkingDifficulty: "Moderate",
      }, {
        name: "Independent Las Palmas Guide",
        slug: "independent-las-palmas-guide",
        href: "/guides/independent-las-palmas-guide",
        reason: "DIY city framework.",
        topExcursion: "Independent",
        returnConfidence: "High",
        walkingDifficulty: "Variable",
      }, {
        name: "One Day in Gran Canaria",
        slug: "one-day-in-gran-canaria",
        href: "/guides/one-day-in-gran-canaria",
        reason: "Full itinerary guide.",
        topExcursion: "Planning guide",
        returnConfidence: "High",
        walkingDifficulty: "Variable",
      }],
    faqs: [{ question: "Can I do city and island deeply in one day?", answer: "No — choose one primary anchor for a satisfying day." }, { question: "What is safest in poor weather?", answer: "City plans with Mercado del Puerto and museum stops." }],
    relatedSlugs: ["one-day-in-gran-canaria", "las-palmas-or-island-tour", "best-gran-canaria-shore-excursion-first-time-visitors"],
    imageKey: "highlights",
  }
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

export function getComparisonDisplayTitle(comp: Comparison): string {
  if (comp.kind === "versus" && comp.optionA && comp.optionB) {
    return comp.optionA + " vs " + comp.optionB;
  }
  return comp.title;
}
