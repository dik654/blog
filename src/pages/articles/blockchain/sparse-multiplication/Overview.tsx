import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sparse 곱셈이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Miller Loop의 line function은 Fp12의 12슬롯 중 3개만 non-zero.
          이 희소 구조를 활용하면 곱셈당 54 &rarr; 18 Fp곱 (3배 절감).
        </p>
      </div>
      <div className="not-prose"><OverviewViz /></div>
    </section>
  );
}
