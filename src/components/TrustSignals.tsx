import Link from "next/link";

const TRUST_SIGNALS = [
  {
    title: "Return-to-ship confidence",
    description: "Every recommended excursion is timed around realistic all-aboard windows with conservative return buffers.",
  },
  {
    title: "Small group options",
    description: "Where accurate, we highlight small-group and private tours for passengers who prefer intimate pacing.",
  },
  {
    title: "Carefully selected excursions",
    description: "We feature tours that represent Gran Canaria well — not a catalogue of everything available.",
  },
  {
    title: "Honest independent advice",
    description: "We tell you when Las Palmas works brilliantly without a tour, because credibility matters more than conversion.",
  },
  {
    title: "Secure booking",
    description: "Book through established operators with clear cancellation policies and confirmed return protocols.",
  },
  {
    title: "Local expert guides",
    description: "Island tours led by guides who know Gran Canaria's roads, weather patterns and timing realities.",
  },
];

export function TrustSignals() {
  return (
    <section className="section-padding bg-coastal-50">
      <div className="container-wide">
        <p className="section-eyebrow">Why trust this guide</p>
        <h2 className="section-title mt-2">Built for cruise passengers, not tour operators</h2>
        <p className="section-subtitle">
          We exist to help you understand Gran Canaria first — excursions come second, when they genuinely add value.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_SIGNALS.map((signal) => (
            <div key={signal.title} className="card-feature">
              <h3 className="font-display text-lg font-bold text-gray-900">{signal.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{signal.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/about" className="btn-secondary text-sm">About this site</Link>
          <Link href="/enquire" className="btn-secondary text-sm">Get in touch</Link>
        </div>
      </div>
    </section>
  );
}
