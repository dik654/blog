import FLPViz from './viz/FLPViz';

export default function FLP() {
  return (
    <section id="flp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FLP 불가능성 정리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Fischer, Lynch, Paterson(1985) — 비동기 시스템에서 단 하나의 crash fault로도 결정적 합의 불가능.
        </p>
      </div>
      <div className="not-prose"><FLPViz /></div>
    </section>
  );
}
