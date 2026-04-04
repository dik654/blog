import ContextViz from './viz/ContextViz';
import ConsensusOverviewViz from './viz/ConsensusOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          합의 알고리즘 &mdash; 분산 네트워크에서 모든 노드가 동일 상태에 합의하는 메커니즘.
        </p>
      </div>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose"><ConsensusOverviewViz /></div>
    </section>
  );
}
