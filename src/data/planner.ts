import { excursions } from "./excursions";

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
  const m = value.match(/^(d{1,2}):(d{2})$/);
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
