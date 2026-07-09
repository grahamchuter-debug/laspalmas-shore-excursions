import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/lib/site";

const path = "/about";

export const metadata = buildMetadata({
  title: "About Las Palmas Shore Excursions",
  description: "About Las Palmas Shore Excursions — an independent Las Palmas cruise planning authority for port-day passengers visiting Gran Canaria's Atlantic coast.",
  path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "About", path },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), webPageSchema({ title: "About Las Palmas Shore Excursions", description: "About Las Palmas Shore Excursions.", path })]} />
      <PageHero title="About Las Palmas Shore Excursions" subtitle="An independent planning authority built for cruise passengers calling at Las Palmas — one of Spain's most underrated Atlantic port days." compact />
      <section className="section-padding">
        <div className="container-wide max-w-3xl">
          <Breadcrumbs items={breadcrumbs} />
          <div className="prose-body">
            <p>
              {SITE.name} is an independent planning resource for cruise passengers calling at Las Palmas. Whether you have one day ashore at the cruise terminal or want to understand the Las Palmas vs Santiago decision before you sail, our goal is to make your port day simple and confident.
            </p>
            <p>
              We focus on the practical decisions that shape a good Las Palmas cruise day: whether to stay in the city or journey to Santiago de Compostela, how walkable the port really is, when a guided excursion beats independent exploring, and how to build a realistic return-to-ship buffer after a coastal drive or cathedral visit.
            </p>
            <p>
              Our guides are written for real cruise timings, not generic Spain tourism. We highlight Canarian seafood culture, Roman heritage at the Tower of Hercules, pilgrimage history in Santiago and honest editorial comparisons when you must choose one anchor experience. If walking around Las Palmas is genuinely enough for some visitors, we say so. If Santiago is the better option for others, we explain exactly why. Trust before sales.
            </p>
            <p>
              Have a question we haven&apos;t answered? <a href="/enquire">Get in touch</a> and we&apos;ll help you plan.
            </p>
          </div>
          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}
