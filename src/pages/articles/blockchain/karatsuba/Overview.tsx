import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 Karatsuba인가?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Fp2 곱셈을 4번 &rarr; 3번으로 25% 절감. 타워에서 재귀 적용하면 144 &rarr; 54.
        </p>
      </div>
      <div className="not-prose"><OverviewViz /></div>
    </section>
  );
}
