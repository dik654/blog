import PoSValidatorViz from './viz/PoSValidatorViz';
import PoSFlowViz from './viz/PoSFlowViz';

export default function ProofOfStake() {
  return (
    <section id="pos">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">Proof of Stake</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          검증자가 토큰을 스테이킹하여 블록 생성에 참여 &mdash; Ethereum 2.0이 대표적.
        </p>
      </div>
      <div className="not-prose mb-8"><PoSValidatorViz /></div>
      <div className="not-prose"><PoSFlowViz /></div>
    </section>
  );
}
