import MSMOverviewViz from './viz/MSMOverviewViz';
import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MSM & NTT 개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          ZK 증명 생성 시간의 70~80%를 차지하는 두 핵심 연산. GPU 가속의 최우선 타깃.
        </p>
      </div>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose"><MSMOverviewViz /></div>
    </section>
  );
}
