import Link from "next/link";

export function HonestAdvice() {
  return (
    <section className="section-padding bg-white">
      <div className="container-wide max-w-4xl">
        <p className="section-eyebrow">Honest advice</p>
        <h2 className="section-title mt-2">Do You Need a Shore Excursion in Las Palmas?</h2>
        <p className="section-subtitle">Answer honestly — no, not always. We help you choose the day that suits you.</p>

        <div className="mt-10 space-y-8">
          <div className="card-feature">
            <h3 className="font-display text-xl font-bold text-gray-900">For a relaxed day, Las Palmas works brilliantly on your own</h3>
            <p className="mt-3 text-gray-700 leading-relaxed">
              If you want a low-stress port day without long coach transfers, independent exploration is genuinely excellent:
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-gray-700">
              <li className="flex items-center gap-2"><span className="text-coastal-600">✓</span> Vegueta and Triana historic quarters</li>
              <li className="flex items-center gap-2"><span className="text-coastal-600">✓</span> Las Canteras beach — walkable from port</li>
              <li className="flex items-center gap-2"><span className="text-coastal-600">✓</span> Santa Catalina markets and cafés</li>
              <li className="flex items-center gap-2"><span className="text-coastal-600">✓</span> Taxi or bus to old town (€5–10)</li>
              <li className="flex items-center gap-2"><span className="text-coastal-600">✓</span> Tapas, shopping and promenade strolls</li>
              <li className="flex items-center gap-2"><span className="text-coastal-600">✓</span> High return-to-ship confidence</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              On a standard 8-hour call, a self-guided Las Palmas day is enough for many visitors. We say that because it&apos;s true.
            </p>
          </div>

          <div className="card-accent">
            <h3 className="font-display text-xl font-bold text-gray-900">But book an excursion if you want Gran Canaria&apos;s real variety</h3>
            <p className="mt-3 text-gray-700 leading-relaxed">
              The island&apos;s headline experiences lie beyond the city. An excursion unlocks landscapes you simply cannot reach on foot from the port:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2"><span className="text-maple-600 mt-0.5">→</span> <span><strong>Bandama Caldera</strong> — walk into a volcanic crater</span></li>
              <li className="flex items-start gap-2"><span className="text-maple-600 mt-0.5">→</span> <span><strong>Roque Nublo</strong> — Gran Canaria&apos;s iconic mountain monolith</span></li>
              <li className="flex items-start gap-2"><span className="text-maple-600 mt-0.5">→</span> <span><strong>Teror, Arucas, Agaete</strong> — mountain villages and valley scenery</span></li>
              <li className="flex items-start gap-2"><span className="text-maple-600 mt-0.5">→</span> <span><strong>Maspalomas Dunes</strong> — golden sandscapes by the Atlantic</span></li>
              <li className="flex items-start gap-2"><span className="text-maple-600 mt-0.5">→</span> <span><strong>Coffee plantations, wine and food</strong> — highland produce experiences</span></li>
              <li className="flex items-start gap-2"><span className="text-maple-600 mt-0.5">→</span> <span><strong>Mountain scenery</strong> — pine forests, viewpoints and dramatic roads</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/compare/can-you-explore-las-palmas-independently" className="btn-secondary text-sm">Can I explore independently?</Link>
          <Link href="/compare/las-palmas-or-island-tour" className="btn-secondary text-sm">Las Palmas or island tour?</Link>
          <Link href="/guides/independent-las-palmas-guide" className="btn-secondary text-sm">Independent Las Palmas guide</Link>
        </div>
      </div>
    </section>
  );
}
