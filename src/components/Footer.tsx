import Link from "next/link";
import { SITE } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer-depth mt-auto text-white">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="container-wide grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-display text-xl font-semibold">{SITE.tagline}</div>
            <p className="mt-3 text-sm text-coastal-100/70 leading-relaxed">
              An editorial guide to Gran Canaria for cruise passengers — volcanic landscapes, mountain villages,
              historic Las Palmas, Atlantic beaches and Canarian food culture, with carefully selected shore
              excursions when you&apos;re ready to explore.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-white/90">Explore Gran Canaria</h3>
            <ul className="space-y-1.5 text-sm text-coastal-100/70">
              <li><Link href="/guides/roque-nublo-from-cruise-ship" className="hover:text-white">Roque Nublo</Link></li>
              <li><Link href="/guides/bandama-caldera-guide" className="hover:text-white">Bandama Caldera</Link></li>
              <li><Link href="/guides/vegueta-walking-guide" className="hover:text-white">Vegueta Old Town</Link></li>
              <li><Link href="/guides/las-canteras-beach-from-cruise-port" className="hover:text-white">Las Canteras Beach</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-white/90">Plan your day</h3>
            <ul className="space-y-1.5 text-sm text-coastal-100/70">
              <li><Link href="/cruise-planner" className="hover:text-white">Cruise Planner</Link></li>
              <li><Link href="/shore-excursions" className="hover:text-white">Shore Excursions</Link></li>
              <li><Link href="/guides/independent-las-palmas-guide" className="hover:text-white">Independent Guide</Link></li>
              <li><Link href="/ship-schedules/laspalmas" className="hover:text-white">Ship Schedules</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-medium text-white/90">Honest advice</h3>
            <ul className="space-y-1.5 text-sm text-coastal-100/70">
              <li><Link href="/compare/las-palmas-or-island-tour" className="hover:text-white">Las Palmas or Island Tour?</Link></li>
              <li><Link href="/guides/one-day-in-gran-canaria" className="hover:text-white">One Day in Gran Canaria</Link></li>
              <li><Link href="/cruise-port-guide" className="hover:text-white">Cruise Port Guide</Link></li>
              <li><Link href="/enquire" className="hover:text-white">Get in Touch</Link></li>
            </ul>
          </div>
        </div>
        <div className="container-wide mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs text-coastal-100/60">
          <Link href="/about" className="hover:text-white">About</Link>
          <Link href="/faq" className="hover:text-white">FAQ</Link>
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
          <span className="ml-auto">{SITE.email}</span>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-coastal-300/75">
        &copy; {year} {SITE.name}. Independent Gran Canaria travel resource for cruise passengers — not affiliated with any cruise line.
      </div>
    </footer>
  );
}
