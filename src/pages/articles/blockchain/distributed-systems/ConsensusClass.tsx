import ConsensusClassViz from './viz/ConsensusClassViz';

export default function ConsensusClass() {
  return (
    <section id="consensus-class" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 알고리즘 분류</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          장애 모델(CFT vs BFT)과 최종성 유형(결정적 vs 확률적)으로 분류.
        </p>
      </div>
      <div className="not-prose"><ConsensusClassViz /></div>
    </section>
  );
}
