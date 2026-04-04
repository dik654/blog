import HADESViz from './viz/HADESViz';

export default function HADES() {
  return (
    <section id="hades" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HADES 설계 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Full round + Partial round 조합 &mdash; 전부 Full이면 585 제약, HADES로 243 제약(58% 절감).
        </p>
      </div>
      <div className="not-prose"><HADESViz /></div>
    </section>
  );
}
