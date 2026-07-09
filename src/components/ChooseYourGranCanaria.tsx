"use client";

import Link from "next/link";
import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const CHOOSE_CARDS = [
  {
    slug: "volcanoes",
    emoji: "🌋",
    title: "Volcanoes & Viewpoints",
    tagline: "Bandama Caldera, Roque Nublo and volcanic landscapes that feel worlds away from the cruise terminal.",
    highlights: [
      "Bandama Caldera crater rim",
      "Roque Nublo — Gran Canaria's iconic monolith",
      "Mountain roads through pine forests",
      "Dramatic Atlantic and island panoramas",
      "Volcanic terrain unlike any Mediterranean port",
    ],
    cta: "Explore volcanic landscapes",
    href: "/guides/bandama-caldera-guide",
    imageKey: "volcano",
    wide: true,
  },
  {
    slug: "villages",
    emoji: "🏘",
    title: "Mountain Villages",
    tagline: "Teror, Arucas, Agaete and whitewashed Canarian villages tucked into green valleys.",
    highlights: [
      "Colonial church squares and balconied streets",
      "Coffee plantations and local produce",
      "Traditional Canarian architecture",
      "Valley scenery and village markets",
      "Authentic island culture beyond the port",
    ],
    cta: "Discover mountain villages",
    href: "/shore-excursions/a-taste-of-gran-canaria",
    imageKey: "village",
    wide: false,
  },
  {
    slug: "beaches",
    emoji: "🏖",
    title: "Beaches & Dunes",
    tagline: "Las Canteras urban beach and the golden Maspalomas dunes — Atlantic swimming and desert-like scenery.",
    highlights: [
      "Las Canteras — one of Europe's great city beaches",
      "Maspalomas Dunes nature reserve",
      "Calm reef-protected swimming",
      "Beach promenade cafés and atmosphere",
      "Easy independent access from port",
    ],
    cta: "Beach & dunes guide",
    href: "/guides/las-canteras-beach-from-cruise-port",
    imageKey: "beach",
    wide: false,
  },
  {
    slug: "historic",
    emoji: "🏛",
    title: "Historic Las Palmas",
    tagline: "Vegueta and Triana — colonial streets, cathedral squares and centuries of Atlantic island history.",
    highlights: [
      "Vegueta UNESCO old quarter",
      "Casa de Colón and cathedral district",
      "Triana shopping and café culture",
      "Walkable from cruise terminal",
      "Perfect for independent explorers",
    ],
    cta: "Historic Las Palmas guide",
    href: "/guides/vegueta-walking-guide",
    imageKey: "old-town",
    wide: false,
  },
  {
    slug: "food",
    emoji: "🍷",
    title: "Food, Coffee & Wine",
    tagline: "Papas arrugadas, mojo sauces, island wines and coffee grown in Gran Canaria's highlands.",
    highlights: [
      "Traditional Canarian tapas and markets",
      "Highland coffee plantation visits",
      "Local wine and cheese tastings",
      "Santa Catalina and Triana dining",
      "Food experiences woven into island tours",
    ],
    cta: "Canarian food guide",
    href: "/guides/canarian-food-guide",
    imageKey: "food",
    wide: false,
  },
  {
    slug: "private",
    emoji: "🚗",
    title: "Private Island Tours",
    tagline: "Your own vehicle, your own pace — custom routes through Gran Canaria's miniature continent.",
    highlights: [
      "Flexible itinerary design",
      "Small-group or private vehicle",
      "Mix volcanoes, villages and viewpoints",
      "Ideal for families and photographers",
      "Return-to-ship confidence built in",
    ],
    cta: "Private tour options",
    href: "/shore-excursions/private-gran-canaria-tour",
    imageKey: "private",
    wide: false,
  },
] as const;

export function ChooseYourGranCanaria() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <p className="section-eyebrow">How Would You Like to Experience Gran Canaria?</p>
        <h2 className="section-title mt-2 max-w-3xl">
          Choose the kind of island day that inspires you
        </h2>
        <p className="section-subtitle">
          Gran Canaria is often called a miniature continent — volcanic craters, mountain villages, historic quarters,
          Atlantic beaches and Canarian food culture all within reach of your cruise ship. Choose your experience
          before you browse excursions.
        </p>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {CHOOSE_CARDS.map((card) => {
            const image = subjectImages[card.imageKey] ?? subjectImages["island"];
            return (
              <Link
                key={card.slug}
                href={card.href}
                className={`card-editorial group flex h-full flex-col overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  card.wide ? "md:col-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden ${card.wide ? "aspect-[21/9]" : "aspect-[16/10]"}`}
                >
                  <ResponsiveImage
                    image={image}
                    role="card"
                    imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-coastal-900/80 via-coastal-900/25 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute left-5 top-5 text-3xl" aria-hidden="true">
                    {card.emoji}
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                    <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                      {card.title}
                    </h3>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <p className="text-base leading-relaxed text-gray-600 italic">
                    &ldquo;{card.tagline}&rdquo;
                  </p>
                  <ul className="mt-5 space-y-2 border-t border-gray-100 pt-5">
                    {card.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="h-1 w-1 shrink-0 rounded-full bg-maple-500" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 text-sm font-semibold tracking-wide text-maple-600 group-hover:text-maple-500">
                    {card.cta} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
