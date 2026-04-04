import NTTConceptViz from './viz/NTTConceptViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FFT / NTT란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          다항식 곱셈을 O(n2) &rarr; O(n log n)으로 가속.
          <br />
          ZKP는 유한체 위에서 동작하므로 NTT(Number Theoretic Transform) 사용.
        </p>
      </div>
      <div className="not-prose"><NTTConceptViz /></div>
    </section>
  );
}
