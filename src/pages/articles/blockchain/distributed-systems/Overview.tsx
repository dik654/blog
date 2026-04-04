import ContextViz from './viz/ContextViz';
import SystemModelViz from './viz/SystemModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">분산 시스템 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          블록체인의 이론적 토대 — 분산 시스템의 통신 모델, 한계, 해결책.
        </p>
      </div>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose"><SystemModelViz /></div>
    </section>
  );
}
