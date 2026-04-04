import PoWMiningViz from './viz/PoWMiningViz';
import PoWFlowViz from './viz/PoWFlowViz';

export default function ProofOfWork() {
  return (
    <section id="pow">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Proof of Work</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          채굴자가 해시 퍼즐을 풀어 블록 생성 &mdash; Bitcoin이 대표적 PoW 체인.
        </p>
      </div>
      <div className="not-prose mb-8"><PoWMiningViz /></div>
      <div className="not-prose"><PoWFlowViz /></div>
    </section>
  );
}
