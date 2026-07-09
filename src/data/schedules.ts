import type { ScheduleEntry, ShipSchedulePort } from "./types";
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

export const scheduleYears: ScheduleYear[] = [2026, 2027];

export function getScheduleEntries(slug: string): ScheduleEntry[] {
  return schedulesByPort[slug] ?? [];
}

export function getSchedulePort(slug: string): ShipSchedulePort | undefined {
  return schedulePorts.find((p) => p.slug === slug);
}

export function getSchedulePortBySlug(slug: string): ShipSchedulePort | undefined {
  return getSchedulePort(slug);
}

export function getAllSchedulePortSlugs(): string[] {
  return schedulePorts.map((p) => p.slug);
}

export function getScheduleEntryCount(slug: string): number {
  return getScheduleEntries(slug).length;
}

export function getScheduleEntriesByYear(slug: string, year: number): ScheduleEntry[] {
  return filterEntriesByYear(getScheduleEntries(slug), year);
}

export function getScheduleEntriesForYear(slug: string, year: ScheduleYear): ScheduleEntry[] {
  return getScheduleEntriesByYear(slug, year);
}

export function getScheduleEntriesByMonth(slug: string, year: number, month: string): ScheduleEntry[] {
  return filterEntriesByMonth(getScheduleEntriesByYear(slug, year), month);
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
