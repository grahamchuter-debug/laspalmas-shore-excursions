import Link from "next/link";
import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const DISCOVER_CARDS = [
  {
    emoji: "⛪",
    title: "Santiago de Compostela",
    description: "The cathedral city at the end of the Camino — granite squares, pilgrim atmosphere and one of Europe's most moving destinations.",
    href: "/guides/santiago-de-compostela-guide",
    imageKey: "santiago",
    cta: "Discover Santiago",
  },
  {
    emoji: "🌊",
    title: "Atlantic Coast",
    description: "Dramatic headlands, ocean promenades and the ever-changing light of Spain's northwestern shoreline.",
    href: "/guides/atlantic-promenade-guide",
    imageKey: "coast",
    cta: "Walk the Atlantic",
  },
  {
    emoji: "🏛",
    title: "Tower of Hercules",
    description: "The world's oldest continuously operating lighthouse — Roman engineering on a wild Atlantic headland.",
    href: "/guides/tower-of-hercules-guide",
    imageKey: "hercules",
    cta: "Visit the lighthouse",
  },
  {
    emoji: "🍷",
    title: "Galician Wine",
    description: "Crisp Albariño from riverside valleys and the quiet pleasure of wine bars in granite-walled cellars.",
    href: "/guides/galicia-wine-guide",
    imageKey: "wine",
    cta: "Explore Galician wine",
  },
  {
    emoji: "🐙",
    title: "Seafood Traditions",
    description: "Pulpo a la gallega, percebes and shellfish straight from the boats — one of Europe's great seafood cultures.",
    href: "/guides/best-seafood-lacoruna-guide",
    imageKey: "food",
    cta: "Taste the Atlantic",
  },
  {
    emoji: "🥾",
    title: "Camino de Santiago",
    description: "Even on a cruise day, you can touch the pilgrimage story that has drawn walkers here for centuries.",
    href: "/guides/camino-de-santiago-cruise-passengers-guide",
    imageKey: "pilgrimage",
    cta: "Follow the Camino",
  },
] as const;

export function DiscoverGalicia() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-eyebrow">Discover Galicia</p>
            <h2 className="section-title mt-2">Six doors into an unforgettable region</h2>
            <p className="section-subtitle">
              Start with what draws you in — each path leads deeper into the landscapes, traditions and stories that make this port day extraordinary.
            </p>
          </div>
          <Link href="/discover-galicia" className="btn-secondary shrink-0 text-sm">
            Explore the full guide
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DISCOVER_CARDS.map((card) => {
            const image = subjectImages[card.imageKey];
            return (
              <Link key={card.title} href={card.href} className="card-editorial group flex h-full flex-col overflow-hidden">
                <div className="discover-card-image">
                  <ResponsiveImage
                    image={image}
                    role="card"
                    imgClassName="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coastal-900/70 via-coastal-900/20 to-transparent" aria-hidden="true" />
                  <span className="absolute left-4 top-4 text-2xl" aria-hidden="true">{card.emoji}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">
                    {card.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{card.description}</p>
                  <span className="mt-4 text-sm font-semibold text-coastal-700">{card.cta} →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { DISCOVER_CARDS };
