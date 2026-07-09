import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LaspalmasCruisePlanner } from "@/components/LaspalmasCruisePlanner";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { siteImages } from "@/lib/images";

const path = "/cruise-planner";
const description =
  "Build a personalised Gran Canaria cruise plan. Enter your arrival and departure times, party size, interests, mobility, budget and travel style — get tailored excursions, guides and a realistic day plan.";

export const metadata = buildMetadata({
  title: "Las Palmas Cruise Planner",
  description,
  path,
  keywords: ["Las Palmas cruise planner", "Gran Canaria cruise day plan", "Las Palmas port day itinerary"],
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "Las Palmas Cruise Planner", path },
];

export default function CruisePlannerPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "Las Palmas Cruise Planner", description, path })]} />
      <PageHero
        title="Las Palmas Cruise Planner"
        subtitle="Tell us your ship's hours ashore, who is travelling and what you enjoy — get editorial itinerary recommendations from Editor's Choice island tours to Vegueta walks, Canarian food experiences and independent Las Palmas days."
        imageSrc={siteImages.hero.src}
        imageAlt={siteImages.hero.alt}
        compact
      />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <Breadcrumbs items={breadcrumbs} />
          <LaspalmasCruisePlanner />
          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}
