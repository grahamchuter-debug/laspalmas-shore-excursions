import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PhotoHeroBand } from "@/components/PhotoHeroBand";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { excursions } from "@/data/excursions";
import { excursionsHubImage, getExcursionImage } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

export const metadata = buildMetadata({
  title: "Best Las Palmas Shore Excursions — Gran Canaria",
  description:
    "Carefully selected Gran Canaria shore excursions from Las Palmas — Roque Nublo, Bandama Caldera, Maspalomas Dunes, village tours, Canarian food experiences, timed around your ship.",
  path: "/shore-excursions",
  image: excursionsHubImage.src,
  imageAlt: excursionsHubImage.alt,
  keywords: ["Gran Canaria shore excursions", "Las Palmas excursions", "Roque Nublo tour", "Maspalomas Dunes tour"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Shore Excursions", path: "/shore-excursions" },
];

export default function ShoreExcursionsPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Las Palmas Shore Excursions", description: "Shore excursions from Las Palmas cruise port.", path: "/shore-excursions" })]} />
      <PhotoHeroBand
        image={excursionsHubImage}
        eyebrow="When you're ready to explore"
        title="Explore Shore Excursions"
        subtitle="Shore excursions for cruise passengers who already understand why Gran Canaria matters — local guides, honest timing and return-to-ship confidence on every journey."
        compact
      />
      <section className="section-padding">
        <div className="container-wide">
          <Breadcrumbs items={breadcrumbs} />
          <p className="mb-8 max-w-2xl text-base leading-relaxed text-gray-600">
            Each excursion is designed around your port window — never rushed, never oversold. Discover Roque Nublo&apos;s dramatic viewpoints, walk into Bandama Caldera, explore Maspalomas Dunes, or taste Canarian flavours in mountain villages.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {excursions.map((e) => {
              const image = getExcursionImage(e.slug);
              const isEditorsChoice = e.slug === "a-taste-of-gran-canaria";
              return (
                <Link key={e.slug} href={`/shore-excursions/${e.slug}`} className="card-editorial group overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ResponsiveImage
                      image={image}
                      role="card"
                      imgClassName="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-coastal-900/55 via-transparent to-transparent" aria-hidden="true" />
                    <span className="absolute left-3 top-3 pill bg-white/90">{e.category}</span>
                    {isEditorsChoice && (
                      <span className="absolute right-3 top-3 badge-editors-choice bg-white/90">⭐ Editor&apos;s Choice</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{e.title}</h2>
                    <p className="mt-2 text-sm text-gray-600">{e.tagline}</p>
                    <p className="mt-3 text-xs font-medium text-coastal-700">{e.duration} · {e.pace}</p>
                    <span className="mt-3 inline-block text-sm font-semibold text-coastal-700">Discover more →</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}
