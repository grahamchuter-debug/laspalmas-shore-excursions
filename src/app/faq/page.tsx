import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { FAQSection } from "@/components/FAQSection";
import { PlanningLinks } from "@/components/PlanningLinks";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, webPageSchema } from "@/lib/schema";
import { getAllFaqs } from "@/data/faqs";

const path = "/faq";

export const metadata = buildMetadata({
  title: "Las Palmas Cruise FAQ",
  description: "Frequently asked questions about Las Palmas cruise planning — Port of Las Palmas port, shore excursions, city walls, Old Town walks and getting back to your ship.",
  path,
});

const breadcrumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path },
];

export default function FAQPage() {
  const faqs = getAllFaqs();
  return (
    <>
      <JsonLd data={[breadcrumbSchema(breadcrumbs), faqSchema(faqs), webPageSchema({ title: "Las Palmas Cruise FAQ", description: "Frequently asked questions about Las Palmas cruise planning.", path })]} />
      <PageHero title="Las Palmas Cruise Planning FAQ" subtitle="Answers to the most common questions from Las Palmas cruise passengers." compact />
      <section className="section-padding">
        <div className="container-wide max-w-4xl">
          <FAQSection faqs={faqs} />
          <div className="mt-12">
            <PlanningLinks />
          </div>
        </div>
      </section>
    </>
  );
}
