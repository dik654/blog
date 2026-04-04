import SafetyLivenessViz from './viz/SafetyLivenessViz';

export default function SafetyLiveness() {
  return (
    <section id="safety-liveness" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안전성 vs 활성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Safety — 잘못된 결정 금지. Liveness — 결국 결정 도달.
          <br />
          FLP 불가능성: 비동기에서 둘 다 보장 불가. BFT는 부분 동기로 우회.
        </p>
      </div>
      <div className="not-prose"><SafetyLivenessViz /></div>
    </section>
  );
}
