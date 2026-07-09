import Link from "next/link";

export function GranCanariaWowCollection() {
  return (
    <section className="section-padding bg-white border-y border-coastal-100">
      <div className="container-wide max-w-4xl">
        <div className="card-signature p-8 sm:p-10">
          <span className="badge-signature">
            <span aria-hidden="true">✦</span> In preparation — Wow Collection
          </span>
          <h2 className="mt-4 font-display text-2xl font-semibold text-gray-900 sm:text-3xl">
            Gran Canaria in a Day: Volcanoes, Villages &amp; Views
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            A future premium small-group island highlights tour — volcanic viewpoints, whitewashed villages and
            dramatic scenery at a pace that respects your port window. We&apos;re seeking the right local supplier
            to make this signature experience available.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            In the meantime,{" "}
            <Link href="/shore-excursions/a-taste-of-gran-canaria" className="text-coastal-700 font-medium hover:underline">
              A Taste of Gran Canaria
            </Link>
            {" "}and{" "}
            <Link href="/shore-excursions/gran-canaria-and-roque-nublo" className="text-coastal-700 font-medium hover:underline">
              Gran Canaria and Roque Nublo
            </Link>
            {" "}are our current Editor&apos;s Choice recommendations.
          </p>
        </div>
      </div>
    </section>
  );
}
