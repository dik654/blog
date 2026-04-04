import ValidateBlockViz from './viz/ValidateBlockViz';
import WeightViz from './viz/WeightViz';
import ConsensusProofFlowViz from './viz/ConsensusProofFlowViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function ConsensusProofs({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="consensus-proofs" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 & 저장 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          Lotus 합의 흐름: VRF 선출 → ValidateBlock → 체인 확정<br />
          아래 Viz에서 전체 흐름을 step별로 확인
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">합의 + 증명 흐름</h3>
      <ConsensusProofFlowViz />

      <h3 className="text-lg font-semibold mt-8 mb-3">ValidateBlock() — 블록 검증 6단계</h3>
      <ValidateBlockViz onOpenCode={openCode} />

      <h3 className="text-lg font-semibold mt-8 mb-3">Weight() — 체인 가중치 계산</h3>
      <WeightViz onOpenCode={openCode} />
    </section>
  );
}
