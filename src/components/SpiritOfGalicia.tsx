import Link from "next/link";
import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const PILLARS = [
  {
    title: "Atlantic by Nature",
    subtitle: "Powerful coastline. Ocean weather. Fishing heritage.",
    items: ["Lighthouses standing against the open Atlantic", "Seafood landed that very morning", "Green hills and rugged headlands", "Morning mist over the promenade"],
    href: "/guides/atlantic-promenade-guide",
    cta: "Explore the Atlantic coast",
    imageKey: "fishing",
  },
  {
    title: "Ancient by History",
    subtitle: "Romans. Pilgrimage. Medieval streets.",
    items: ["Tower of Hercules — the world's oldest working lighthouse", "Santiago de Compostela and the Camino", "Granite arcades and historic port streets", "Centuries of Atlantic maritime heritage"],
    href: "/guides/tower-of-hercules-guide",
    cta: "Walk through history",
    imageKey: "castle",
  },
  {
    title: "Warm by Character",
    subtitle: "Family-run cafés. Local wine. Slow travel.",
    items: ["Traditional markets and neighbourhood tabernas", "Albariño wine from nearby valleys", "Unhurried Galician hospitality", "A pace that rewards curiosity"],
    href: "/guides/galician-food-guide",
    cta: "Taste Galician life",
    imageKey: "market",
  },
] as const;

export function SpiritOfGalicia() {
  return (
    <section className="section-padding bg-coastal-900 text-white">
      <div className="container-wide">
        <div className="max-w-3xl">
          <p className="section-eyebrow text-coastal-200">The Spirit of Galicia</p>
          <h2 className="mt-2 font-display text-3xl font-semibold leading-tight sm:text-4xl">
            A region shaped by the Atlantic, ancient paths and an unhurried way of life
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
            Celtic traditions linger in the music and folklore. Roman engineers built lighthouses that still guide ships today. Pilgrims have walked here for a thousand years. This is not the Spain of postcards — it is something quieter, greener and far more interesting.
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
