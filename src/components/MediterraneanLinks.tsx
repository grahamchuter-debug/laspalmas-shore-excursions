import Link from "next/link";
import { mediterraneanLinks } from "@/data/cruise-planning";

export function MediterraneanLinks() {
  return (
    <section className="section-padding bg-coastal-50 border-t border-coastal-100">
      <div className="container-wide">
        <p className="section-eyebrow">Northern Spain &amp; Atlantic cruise planning</p>
        <h2 className="section-title mt-2">Plan your wider Spain and Atlantic cruise</h2>
        <p className="section-subtitle">
          La Coruña is often one stop on a Northern Spain or Atlantic itinerary — explore our sister planning resources.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mediterraneanLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="card-feature group"
            >
              <h3 className="font-display text-lg font-bold text-gray-900 group-hover:text-coastal-800">
                {link.title}
                {link.href.startsWith("http") && (
                  <span className="ml-1 text-coastal-400 text-sm" aria-hidden="true">↗</span>
                )}
              </h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{link.description}</p>
            </a>
          ))}
        </div>
        <div className="mt-6">
          <Link href="/guides" className="btn-secondary text-sm">All La Coruña planning guides</Link>
        </div>
      </div>
    </section>
  );
}
