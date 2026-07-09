import Link from "next/link";
import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const CATEGORIES = [
  {
    slug: "best-overall",
    title: "Best Overall",
    description: "The all-round island introduction — scenery, villages, food culture and volcanic landscapes in one day.",
    href: "/shore-excursions/a-taste-of-gran-canaria",
    imageKey: "island",
    emoji: "⭐",
  },
  {
    slug: "best-scenic",
    title: "Best Scenic Island Tour",
    description: "Roque Nublo, mountain roads and dramatic viewpoints — Gran Canaria at its most photogenic.",
    href: "/shore-excursions/gran-canaria-and-roque-nublo",
    imageKey: "roque-nublo",
    emoji: "🏔",
  },
  {
    slug: "best-food",
    title: "Best Food & Wine",
    description: "Canarian tapas, highland coffee, island wines and market-to-table experiences.",
    href: "/shore-excursions/canarian-food-wine-tour",
    imageKey: "food",
    emoji: "🍷",
  },
  {
    slug: "best-beach",
    title: "Best Beach Day",
    description: "Las Canteras urban beach and Maspalomas Dunes — Atlantic swimming and golden sandscapes.",
    href: "/shore-excursions/las-canteras-beach-day",
    imageKey: "beach",
    emoji: "🏖",
  },
  {
    slug: "best-families",
    title: "Best for Families",
    description: "Flexible pacing, beach options and low-stress island touring for mixed-age groups.",
    href: "/shore-excursions/family-gran-canaria-tour",
    imageKey: "family",
    emoji: "👨‍👩‍👧",
  },
  {
    slug: "best-independent",
    title: "Best for Independent Explorers",
    description: "Vegueta, Triana, Las Canteras and Santa Catalina — a strong self-guided Las Palmas day.",
    href: "/guides/independent-las-palmas-guide",
    imageKey: "old-town",
    emoji: "🚶",
  },
  {
    slug: "best-private",
    title: "Best Private Tour",
    description: "Custom island routes with your own vehicle, guide and pace — volcanoes, villages and views.",
    href: "/shore-excursions/private-gran-canaria-tour",
    imageKey: "private",
    emoji: "🚗",
  },
  {
    slug: "best-short",
    title: "Best Short Port Call",
    description: "Efficient city highlights when usable hours are limited — no long inland transfers.",
    href: "/shore-excursions/half-day-las-palmas-tour",
    imageKey: "port",
    emoji: "⏱",
  },
];

export function ExcursionCategories() {
  return (
    <section className="section-padding bg-coastal-50">
      <div className="container-wide">
        <p className="section-eyebrow">Excursion categories</p>
        <h2 className="section-title mt-2">Find the right Gran Canaria experience for your day</h2>
        <p className="section-subtitle">
          Whether you want volcanic drama, beach relaxation, village culture or a private island tour —
          start with the category that matches your priorities.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const image = subjectImages[cat.imageKey] ?? subjectImages["island"];
            return (
              <Link
                key={cat.slug}
                href={cat.href}
                className="card-editorial group flex h-full flex-col overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ResponsiveImage
                    image={image}
                    role="card"
                    imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coastal-900/60 via-transparent to-transparent" aria-hidden="true" />
                  <span className="absolute left-3 top-3 text-xl" aria-hidden="true">{cat.emoji}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{cat.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{cat.description}</p>
                  <span className="mt-4 text-sm font-semibold text-coastal-700">Discover more →</span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-8 text-center">
          <Link href="/shore-excursions" className="btn-primary">Explore Shore Excursions</Link>
        </div>
      </div>
    </section>
  );
}
