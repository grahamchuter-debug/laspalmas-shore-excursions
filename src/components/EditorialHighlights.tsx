import Link from "next/link";
import { subjectImages } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

const HIGHLIGHTS = [
  {
    title: "Why Galicia Feels Different",
    description: "Atlantic weather, Celtic roots and a pace of life that sets this region apart from the rest of Spain.",
    href: "/guides/lacoruna-old-town-guide",
    imageKey: "galicia-landscape",
    readTime: "6 min read",
  },
  {
    title: "The World's Oldest Working Lighthouse",
    description: "Two thousand years of Roman engineering still guiding ships on the edge of the Atlantic.",
    href: "/guides/tower-of-hercules-guide",
    imageKey: "hercules",
    readTime: "5 min read",
  },
  {
    title: "Following the Camino",
    description: "What cruise passengers can experience of the world's most famous pilgrimage — even in a single day.",
    href: "/guides/camino-de-santiago-cruise-passengers-guide",
    imageKey: "pilgrimage",
    readTime: "7 min read",
  },
  {
    title: "Galicia's Incredible Seafood",
    description: "From pulpo a la gallega to percebes — why this coast produces some of Europe's finest seafood.",
    href: "/guides/best-seafood-lacoruna-guide",
    imageKey: "food",
    readTime: "5 min read",
  },
  {
    title: "Hidden Corners Beyond Santiago",
    description: "Granite villages, coastal drives and the quieter Galicia most cruise passengers never see.",
    href: "/guides/one-day-in-lacoruna",
    imageKey: "fishing",
    readTime: "8 min read",
  },
] as const;

export function EditorialHighlights() {
  return (
    <section className="section-padding bg-forest-50/50 border-y border-forest-100/60">
      <div className="container-wide">
        <p className="section-eyebrow text-forest-700">Editorial highlights</p>
        <h2 className="section-title mt-2">Stories worth lingering over</h2>
        <p className="section-subtitle">
          Short reads to spark curiosity — because the best port days begin long before you choose an excursion.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {HIGHLIGHTS.map((item, i) => {
            const image = subjectImages[item.imageKey];
            const tall = i === 0 || i === 4;
            return (
              <Link
                key={item.title}
                href={item.href}
                className={`editorial-highlight-card ${tall ? "sm:row-span-2" : ""}`}
                style={tall ? { minHeight: "100%" } : undefined}
              >
                <ResponsiveImage
                  image={image}
                  role="card"
                  decorative
                  imgClassName="editorial-highlight-image"
                />
                <div className="editorial-highlight-content" style={tall ? { minHeight: "280px" } : undefined}>
                  <span className="text-xs font-medium uppercase tracking-wider text-sandstone-300">{item.readTime}</span>
                  <h3 className="mt-2 font-display text-lg font-semibold leading-snug sm:text-xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/75 line-clamp-3">{item.description}</p>
                  <span className="mt-4 text-sm font-semibold text-sandstone-300">Read story →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export { HIGHLIGHTS };
