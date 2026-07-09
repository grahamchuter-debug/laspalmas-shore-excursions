interface TimelineItem {
  time: string;
  title: string;
  description: string;
  highlight?: boolean;
}

const TIMELINE: TimelineItem[] = [
  {
    time: "30 min before",
    title: "Be on your balcony or top deck",
    description: "The approach to Las Palmas reveals Gran Canaria's volcanic profile — watch for the city climbing the hills above the Atlantic.",
    highlight: true,
  },
  {
    time: "Approach",
    title: "Las Canteras beach comes into view",
    description: "One of Europe's great urban beaches stretches along the waterfront — a sign you're arriving somewhere genuinely interesting.",
    highlight: true,
  },
  {
    time: "Arrival",
    title: "Santa Catalina and the cruise terminal",
    description: "Ships dock near Santa Catalina Park. Vegueta old town is a short taxi or bus ride; Las Canteras beach is walkable.",
  },
  {
    time: "Morning",
    title: "Best light for island tours",
    description: "If you're heading inland to Roque Nublo or Bandama, depart early — morning light and cooler temperatures make for better viewpoints.",
  },
  {
    time: "Lunch",
    title: "Canarian flavours",
    description: "Papas arrugadas with mojo, fresh fish tapas and island wines — Vegueta, Triana and Santa Catalina all offer excellent options.",
  },
  {
    time: "Departure",
    title: "Sail away with the island behind you",
    description: "Evening departures offer a second view of Gran Canaria's volcanic silhouette against the Atlantic sky.",
    highlight: true,
  },
];

export function ArrivalTimeline() {
  return (
    <section className="section-padding bg-coastal-50">
      <div className="container-wide">
        <p className="section-eyebrow">Before you leave the ship</p>
        <h2 className="section-title mt-2">Don&apos;t miss the Las Palmas arrival</h2>
        <p className="section-subtitle">
          Gran Canaria reveals itself from the sea. Here&apos;s where to stand and what to watch for.
        </p>

        <div className="mt-10 relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-coastal-200 hidden sm:block" aria-hidden="true" />
          <div className="space-y-6">
            {TIMELINE.map((item) => (
              <div key={item.title} className="relative sm:pl-12">
                <div
                  className={`hidden sm:block absolute left-2.5 top-5 h-3 w-3 rounded-full border-2 border-white ${
                    item.highlight ? "bg-maple-500 ring-2 ring-maple-500/30" : "bg-coastal-400"
                  }`}
                  aria-hidden="true"
                />
                <div className={`card-feature ${item.highlight ? "border-maple-500/20 bg-gradient-to-br from-maple-500/5 to-white" : ""}`}>
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="pill-accent text-xs font-semibold">{item.time}</span>
                    <h3 className="font-display text-lg font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500 text-center">
          Tip: Port-side or starboard depends on your approach direction — ask the cruise director the evening before for the best viewing side.
        </p>
      </div>
    </section>
  );
}
