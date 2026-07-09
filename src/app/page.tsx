import Link from "next/link";
import { buildMetadata } from "@/lib/seo";
import { ChooseYourGranCanaria } from "@/components/ChooseYourGranCanaria";
import { SpiritOfGranCanaria } from "@/components/SpiritOfGranCanaria";
import { HonestAdvice } from "@/components/HonestAdvice";
import { EditorsChoice } from "@/components/EditorsChoice";
import { ExcursionCategories } from "@/components/ExcursionCategories";
import { CruisePassengerRatings } from "@/components/CruisePassengerRatings";
import { VisitorTypeSelector } from "@/components/VisitorTypeSelector";
import { TrustSignals } from "@/components/TrustSignals";
import { GranCanariaWowCollection } from "@/components/GranCanariaWowCollection";
import { FAQSection } from "@/components/FAQSection";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, faqSchema, travelGuideSchema } from "@/lib/schema";
import { coreSections, getHomepageFaqs } from "@/data/homepage";
import { getFeaturedExcursions } from "@/data/excursions";
import { siteImages, getExcursionImage } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";
import { PreloadImage } from "@/components/PreloadImage";

export const metadata = buildMetadata({
  title: "Las Palmas Shore Excursions — Gran Canaria Cruise Port Guide",
  description:
    "Discover Gran Canaria in a single unforgettable day. Explore Las Palmas shore excursions, independent cruise advice and scenic island experiences for passengers visiting by ship.",
  path: "/",
  keywords: [
    "Gran Canaria cruise excursions",
    "Las Palmas shore excursions",
    "Las Palmas cruise port",
    "Roque Nublo cruise",
    "Maspalomas Dunes",
    "Las Canteras beach",
    "Gran Canaria cruise day",
  ],
});

const SITE_DESCRIPTION =
  "Gran Canaria: A Miniature Continent in a Cruise Day — volcanic landscapes, mountain villages, historic Las Palmas, beaches and Canarian food culture with carefully selected shore excursions.";

export default function HomePage() {
  const faqs = getHomepageFaqs();
  const featured = getFeaturedExcursions().slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([{ name: "Home", path: "/" }]),
          faqSchema(faqs),
          travelGuideSchema({
            title: "Las Palmas Shore Excursions — Gran Canaria Cruise Port",
            description: SITE_DESCRIPTION,
            path: "/",
          }),
        ]}
      />

      <PreloadImage base={siteImages.hero.base} role="hero" />

      {/* 1. Emotional hero */}
      <section className="home-hero">
        <ResponsiveImage
          image={siteImages.hero}
          role="hero"
          priority
          className="absolute inset-0 block h-full w-full"
          imgClassName="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="container-wide relative z-10 w-full px-4 sm:px-6 lg:px-8">
          <p className="section-eyebrow mb-3 text-coastal-100">Gran Canaria: A Miniature Continent in a Cruise Day</p>
          <h1 className="home-hero-heading">
            Discover Gran Canaria in a Single Unforgettable Day
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            Explore carefully selected Las Palmas shore excursions, independent cruise advice and scenic island
            experiences designed for passengers visiting Gran Canaria by ship.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shore-excursions" className="btn-accent">Explore Shore Excursions</Link>
            <Link href="/cruise-planner" className="btn-secondary bg-white/10 text-white border-white/30 hover:bg-white/20">
              Help Me Choose My Gran Canaria Day
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-2"><span aria-hidden="true">🌋</span> Volcanoes</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true">🏘</span> Villages</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true">🏖</span> Beaches</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true">🏛</span> Historic Las Palmas</span>
            <span className="inline-flex items-center gap-2"><span aria-hidden="true">🍷</span> Food &amp; Wine</span>
          </div>
        </div>
      </section>

      {/* 2. Experience chooser */}
      <ChooseYourGranCanaria />

      {/* 3. Spirit of Gran Canaria */}
      <SpiritOfGranCanaria />

      {/* 4. Honest advice */}
      <HonestAdvice />

      {/* 5. Editor's Choice */}
      <EditorsChoice />

      {/* 6. Excursion categories */}
      <ExcursionCategories />

      {/* 7. Cruise passenger snapshot */}
      <CruisePassengerRatings />

      {/* 8. Independent Las Palmas guide CTA */}
      <section className="section-padding bg-coastal-900 text-white">
        <div className="container-wide grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <p className="section-eyebrow text-coastal-200">Independent Las Palmas guide</p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Explore Las Palmas on your own terms
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              Where ships dock, walking and taxi options, Vegueta, Triana, Las Canteras beach, Santa Catalina,
              markets, cafés, tapas, shopping, taxi expectations and return-to-ship advice — everything you
              need for a confident self-guided day.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/guides/independent-las-palmas-guide" className="btn-accent">Read the independent guide</Link>
              <Link href="/compare/can-you-explore-las-palmas-independently" className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20">
                Is independent exploring realistic?
              </Link>
            </div>
          </div>
          <div className="card-feature bg-white/5 border-white/10 text-white">
            <h3 className="font-display text-xl font-bold">Quick independent day framework</h3>
            <ul className="mt-4 space-y-3 text-sm text-white/80">
              <li><strong className="text-white">Morning:</strong> Taxi or bus to Vegueta — cathedral, Casa de Colón, old quarter lanes</li>
              <li><strong className="text-white">Midday:</strong> Tapas lunch in Triana or Santa Catalina market area</li>
              <li><strong className="text-white">Afternoon:</strong> Las Canteras beach promenade and reef-protected swimming</li>
              <li><strong className="text-white">Return:</strong> Taxi back to Muelle Santa Catalina — allow 60–90 min buffer before all-aboard</li>
            </ul>
          </div>
        </div>
      </section>

      <VisitorTypeSelector />

      {/* Featured excursions */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="section-eyebrow">When you&apos;re ready</p>
            <h2 className="section-title mt-2">Shore excursions for your Gran Canaria day</h2>
            <p className="section-subtitle">
              Once you know which experience suits your interests, these cruise-timed tours are designed for
              passengers who already understand why this island matters.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((e) => {
              const image = getExcursionImage(e.slug);
              const isEditorsChoice = e.slug === "a-taste-of-gran-canaria";
              return (
                <Link key={e.slug} href={`/shore-excursions/${e.slug}`} className="card-editorial group overflow-hidden">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <ResponsiveImage
                      image={image}
                      role="card"
                      imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isEditorsChoice && (
                      <span className="absolute left-3 top-3 badge-editors-choice">⭐ Editor&apos;s Choice</span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{e.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{e.tagline}</p>
                    <span className="mt-4 inline-block text-sm font-semibold text-coastal-700">Discover more →</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="mt-8">
            <Link href="/shore-excursions" className="btn-primary">All Shore Excursions</Link>
          </div>
        </div>
      </section>

      {/* 9. Comparison guides */}
      <section className="section-padding bg-coastal-50">
        <div className="container-wide grid gap-6 lg:grid-cols-2">
          <div className="card-feature">
            <h3 className="font-display text-xl font-bold text-gray-900">Las Palmas or island tour?</h3>
            <p className="mt-3 text-gray-700">City immersion versus volcanic landscapes and mountain villages — our comparisons help you choose the day that suits your interests and port window.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/compare/las-palmas-or-island-tour" className="btn-secondary text-sm">Compare options</Link>
              <Link href="/compare/best-gran-canaria-shore-excursion-first-time-visitors" className="btn-secondary text-sm">Best for first-timers</Link>
            </div>
          </div>
          <div className="card-accent">
            <h3 className="font-display text-xl font-bold text-gray-900">Bandama Caldera or Maspalomas Dunes?</h3>
            <p className="mt-3 text-gray-700">Two iconic Gran Canaria experiences with very different character — volcanic crater versus golden Atlantic dunes.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/compare/bandama-caldera-or-maspalomas-dunes" className="btn-secondary text-sm">Compare highlights</Link>
              <Link href="/compare/is-roque-nublo-worth-it-from-cruise-ship" className="btn-secondary text-sm">Is Roque Nublo worth it?</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Future Wow Collection slot */}
      <GranCanariaWowCollection />

      {/* 10. Cruise schedule / planning */}
      <section className="section-padding bg-white">
        <div className="container-wide">
          <p className="section-eyebrow">Plan your port day</p>
          <h2 className="section-title mt-2">Everything you need for an unforgettable Gran Canaria day</h2>
          <p className="section-subtitle">Guides, comparisons, schedules and honest advice — because the best bookings start with genuine understanding.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coreSections.map((s) => (
              <Link key={s.slug} href={s.href} className="nav-card group flex h-full flex-col">
                <span className="font-display text-2xl font-bold text-coastal-200">{s.number}</span>
                <h3 className="mt-1 font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gray-600">{s.description}</p>
                <span className="mt-3 text-sm font-semibold text-coastal-700">{s.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-coastal-900 text-white">
        <div className="container-wide max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">Shape your perfect Gran Canaria day</h2>
          <p className="mt-4 text-white/80 leading-relaxed">Tell us your ship&apos;s hours, interests and travel style — receive a tailored itinerary with the excursions and guides that fit your port window.</p>
          <Link href="/cruise-planner" className="btn-accent mt-8 inline-flex">Plan Your Port Day</Link>
        </div>
      </section>

      {/* 11. FAQs */}
      <section className="section-padding bg-white">
        <div className="container-wide max-w-4xl">
          <FAQSection faqs={faqs} title="Gran Canaria &amp; Las Palmas — FAQs" />
        </div>
      </section>

      {/* 12. Trust signals */}
      <TrustSignals />
    </>
  );
}
