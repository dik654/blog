import PippengerViz from './viz/PippengerViz';

export default function Pippenger() {
  return (
    <section id="pippenger" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pippenger MSM 알고리즘</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          스칼라를 윈도우 분할 &rarr; 버킷 누적 &rarr; 삼각 축소. O(n / log n).
        </p>
      </div>
      <div className="not-prose"><PippengerViz /></div>
    </section>
  );
}
