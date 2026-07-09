import Link from "next/link";
import { getExcursionImage } from "@/lib/images";
import { ResponsiveImage } from "@/components/ResponsiveImage";

export function EditorsChoice() {
  const primaryImage = getExcursionImage("a-taste-of-gran-canaria");
  const secondaryImage = getExcursionImage("gran-canaria-and-roque-nublo");

  return (
    <section className="section-padding section-signature-hero">
      <div className="container-wide relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="badge-editors-choice">
              <span aria-hidden="true">⭐</span> Editor&apos;s Choice
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight sm:text-4xl">
              A Taste of Gran Canaria
            </h2>
            <p className="mt-4 text-lg text-white/85 leading-relaxed">
              The best all-round introduction to the island — scenery, volcanic landscapes, villages, food culture,
              coffee and local produce in one carefully paced day.
            </p>
            <ul className="mt-6 space-y-3 text-white/80">
              <li className="flex items-center gap-3"><span className="text-autumn-400">✓</span> Volcanic landscapes and valley scenery</li>
              <li className="flex items-center gap-3"><span className="text-autumn-400">✓</span> Mountain villages and local produce</li>
              <li className="flex items-center gap-3"><span className="text-autumn-400">✓</span> Canarian food culture and coffee</li>
              <li className="flex items-center gap-3"><span className="text-autumn-400">✓</span> Ideal for first-time visitors</li>
              <li className="flex items-center gap-3"><span className="text-autumn-400">✓</span> Return-to-ship confidence built in</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shore-excursions/a-taste-of-gran-canaria" className="btn-accent">
                Discover the tour
              </Link>
              <Link href="/compare/best-gran-canaria-shore-excursion-first-time-visitors" className="btn-secondary border-white/30 bg-white/10 text-white hover:bg-white/20">
                Why this tour
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/70">
              Prefer dramatic mountain scenery? Our alternative Editor&apos;s Choice is{" "}
              <Link href="/shore-excursions/gran-canaria-and-roque-nublo" className="underline hover:text-white">
                Gran Canaria and Roque Nublo
              </Link>
              {" "}— best for viewpoints, mountains and volcanic drama.
            </p>
          </div>
          <div className="card-signature overflow-hidden p-0">
            <div className="relative aspect-[16/10]">
              <ResponsiveImage
                image={primaryImage}
                role="card"
                imgClassName="h-full w-full object-cover"
              />
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                The single best introduction to Gran Canaria&apos;s variety — villages, volcanic scenery, food culture
                and local produce in one cruise-timed day. Ideal for first-time visitors with 7+ usable hours ashore.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-2 border-t border-white/10 pt-12">
          <div className="card-signature overflow-hidden p-0 order-2 lg:order-1">
            <div className="relative aspect-[16/10]">
              <ResponsiveImage
                image={secondaryImage}
                role="card"
                imgClassName="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <span className="badge-editors-choice">
              <span aria-hidden="true">⭐</span> Alternative Editor&apos;s Choice
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-white">
              Gran Canaria and Roque Nublo
            </h3>
            <p className="mt-3 text-white/80 leading-relaxed">
              Best for passengers who prioritise scenery, mountains and dramatic viewpoints. Roque Nublo is
              Gran Canaria&apos;s defining natural landmark — a basalt monolith rising above pine forests with
              island-spanning panoramas.
            </p>
            <Link href="/shore-excursions/gran-canaria-and-roque-nublo" className="btn-accent mt-6 inline-flex text-sm">
              Discover Roque Nublo tour
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
