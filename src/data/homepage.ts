import type { FAQ, VisitorType, ExperienceCard } from "./types";

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
