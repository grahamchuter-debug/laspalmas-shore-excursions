import Link from "next/link";
import type { EditorialRecommendation } from "@/data/types";
import { getEditorialLabel } from "@/data/editorial";

export function EditorialRecommendations({
  recommendations,
  title = "Editorial recommendations",
}: {
  recommendations: EditorialRecommendation[];
  title?: string;
}) {
  if (!recommendations.length) return null;
  return (
    <section className="mt-10">
      <h2 className="section-title text-2xl mb-6">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {recommendations.map((rec) => (
          <Link key={rec.href + rec.title} href={rec.href} className="card-accent group block p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-maple-600">
              {getEditorialLabel(rec.category)}
            </p>
            <h3 className="mt-1 font-display text-base font-bold text-gray-900 group-hover:text-coastal-800">
              {rec.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{rec.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
