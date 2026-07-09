interface Rating {
  label: string;
  stars: number;
}

const RATINGS: Rating[] = [
  { label: "Walking Around Port", stars: 4 },
  { label: "Historic Interest", stars: 4 },
  { label: "Scenery", stars: 5 },
  { label: "Beaches", stars: 5 },
  { label: "Food & Wine", stars: 4 },
  { label: "Families", stars: 4 },
  { label: "Independent Exploring", stars: 4 },
  { label: "Adventure", stars: 4 },
  { label: "Shopping", stars: 3 },
  { label: "Photography", stars: 5 },
];

function StarRow({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-500" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? "opacity-100" : "opacity-25"} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

export function CruisePassengerRatings() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide">
        <p className="section-eyebrow">Cruise passenger snapshot</p>
        <h2 className="section-title mt-2">How Las Palmas scores for cruise passengers</h2>
        <p className="section-subtitle">
          An honest at-a-glance view of what Gran Canaria delivers — based on port logistics, island variety and real passenger experience.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {RATINGS.map((r) => (
            <div key={r.label} className="card-feature flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-gray-800">{r.label}</span>
              <StarRow count={r.stars} />
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Las Palmas offers strong independent exploring and one of Europe&apos;s best urban beaches — but Gran Canaria&apos;s
          volcanic landscapes, mountain villages and dunes reward passengers who venture beyond the city on an excursion.
        </p>
      </div>
    </section>
  );
}
