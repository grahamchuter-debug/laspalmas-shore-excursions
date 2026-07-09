import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { comparisons, getComparisonDisplayTitle } from "@/data/comparisons";
import { getComparisonImage } from "@/lib/images";

const path = "/compare";
const description =
  "Honest comparisons for Las Palmas cruise passengers — city vs island tour, Roque Nublo worth it, Bandama vs Maspalomas, DIY vs guided, and the best excursions for first-time visitors.";

export const metadata = buildMetadata({
  title: "Compare Gran Canaria Cruise Options",
  description,
  path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Compare", path },
];

export default function CompareHubPage() {
  const image = getComparisonImage("las-palmas-or-island-tour");
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Compare Gran Canaria Cruise Options", description, path })]} />
      <PageHero title="Compare Gran Canaria Cruise Options" subtitle="Editorial comparisons to help you choose — Las Palmas vs island tour, volcanic vs beach highlights, independent exploring and the best excursions for your traveller type." imageSrc={image.src} imageAlt={image.alt} compact />
      <section className="section-padding">
        <div className="container-wide">
          <Breadcrumbs items={breadcrumbs} />
          <div className="grid gap-4 sm:grid-cols-2">
            {comparisons.map((c) => (
              <Link key={c.slug} href={`/compare/${c.slug}`} className="nav-card group">
                <h2 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{getComparisonDisplayTitle(c)}</h2>
                <p className="mt-2 text-sm text-gray-600">{c.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
