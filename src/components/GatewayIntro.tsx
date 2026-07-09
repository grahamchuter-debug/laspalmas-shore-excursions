import Link from "next/link";

export function GatewayIntro() {
  return (
    <section className="gateway-intro-band section-padding">
      <div className="container-wide max-w-4xl text-center">
        <p className="section-eyebrow">Gran Canaria: A Miniature Continent in a Cruise Day</p>
        <h2 className="section-title mt-3">
          More than a beach port — an Atlantic island of extraordinary variety
        </h2>
        <p className="section-subtitle mx-auto mt-5">
          Most cruise passengers expect another sunny stop. Instead, they discover volcanic craters, mountain villages,
          colonial old quarters, golden dunes and one of Europe&apos;s finest urban beaches — all within reach of
          a single port call.
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-600 max-w-2xl mx-auto">
          Explore carefully selected Las Palmas shore excursions, independent cruise advice and scenic island
          experiences designed for passengers visiting Gran Canaria by ship.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shore-excursions" className="btn-primary">Explore Shore Excursions</Link>
          <Link href="/cruise-planner" className="btn-secondary">Help Me Choose My Gran Canaria Day</Link>
        </div>
      </div>
    </section>
  );
}
