import HotStuffPipelineViz from './viz/HotStuffPipelineViz';
import HotStuffDetailViz from './viz/HotStuffDetailViz';

export default function HotStuff() {
  return (
    <section id="hotstuff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          PBFT의 O(n²) 통신을 O(n) Star topology로 해결 + 파이프라이닝으로 처리량 향상
        </p>
      </div>
      <div className="not-prose mb-8"><HotStuffDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Chained HotStuff 파이프라인</h3>
        <p className="leading-7">
          매 view에서 하나의 투표로 여러 블록의 진행을 동시 처리 — 3-chain commit rule
        </p>
      </div>
      <div className="not-prose"><HotStuffPipelineViz /></div>
    </section>
  );
}
