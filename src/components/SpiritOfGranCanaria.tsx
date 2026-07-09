import Link from "next/link";
import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const PILLARS = [
  {
    title: "Volcanic by Nature",
    subtitle: "Craters. Monoliths. Pine forests on lava.",
    items: [
      "Bandama Caldera — a volcanic bowl you can walk into",
      "Roque Nublo rising above the clouds",
      "Mountain roads through ancient lava flows",
      "Viewpoints that reveal the island's dramatic geology",
    ],
    href: "/guides/bandama-caldera-guide",
    cta: "Explore volcanic landscapes",
    imageKey: "volcano",
  },
  {
    title: "Atlantic by Character",
    subtitle: "Island culture. Colonial streets. Ocean light.",
    items: [
      "Vegueta — one of the oldest cities in the Canary Islands",
      "Triana's pedestrian shopping and café culture",
      "Las Canteras beach and reef-protected swimming",
      "Canarian hospitality with its own distinct rhythm",
    ],
    href: "/guides/vegueta-walking-guide",
    cta: "Discover historic Las Palmas",
    imageKey: "old-town",
  },
  {
    title: "Varied by Design",
    subtitle: "Beaches. Dunes. Villages. All in one day.",
    items: [
      "Maspalomas Dunes — desert-like sandscapes by the Atlantic",
      "Mountain villages with coffee and local produce",
      "Green valleys between volcanic peaks",
      "A miniature continent in a single cruise call",
    ],
    href: "/guides/maspalomas-dunes-from-las-palmas-cruise-port",
    cta: "See the island's variety",
    imageKey: "dunes",
  },
] as const;

export function SpiritOfGranCanaria() {
  return (
    <section className="section-padding bg-coastal-900 text-white">
      <div className="container-wide">
        <div className="max-w-3xl">
          <p className="section-eyebrow text-coastal-200">The Spirit of Gran Canaria</p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            A miniature continent waiting beyond the cruise terminal
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
            Gran Canaria earns its nickname honestly. Within a relatively small island, landscapes shift from
            volcanic craters and pine-clad peaks to colonial old quarters, green valleys, golden dunes and
            Atlantic beaches. Within one cruise day, passengers can experience volcanic viewpoints, whitewashed
            villages, historic streets, dunes and local Canarian food culture — if they choose wisely.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PILLARS.map((pillar) => {
            const image = subjectImages[pillar.imageKey];
            return (
              <div key={pillar.title} className="gateway-pillar flex flex-col">
                <div className="relative -mx-2 -mt-2 mb-5 aspect-[16/9] overflow-hidden rounded-xl sm:mx-0 sm:mt-0">
                  <ResponsiveImage
                    image={image}
                    role="card"
                    imgClassName="h-full w-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-coastal-900/80 to-transparent" aria-hidden="true" />
                </div>
                <h3 className="font-display text-xl font-semibold text-white">{pillar.title}</h3>
                <p className="mt-1 text-sm text-sandstone-300">{pillar.subtitle}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-white/75">
                  {pillar.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-forest-100 mt-0.5" aria-hidden="true">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={pillar.href}
                  className="mt-6 inline-flex text-sm font-semibold text-sandstone-300 hover:text-white transition-colors"
                >
                  {pillar.cta} →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
