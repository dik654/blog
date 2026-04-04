import ProofAggViz from './viz/ProofAggViz';
import CodePanel from '@/components/ui/code-panel';
import {
  PROOF_GEN_CODE, proofGenAnnotations,
  AGGREGATION_CODE, aggregationAnnotations,
  SETUP_CODE, setupAnnotations,
} from './ProofPipelineData';

export default function ProofPipeline() {
  return (
    <section id="proof-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 생성 파이프라인</h2>
      <div className="not-prose mb-8"><ProofAggViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Scroll zkEVM은 <strong>Chunk → Batch → Bundle</strong> 3단계 증명 집계를 사용합니다.<br />
          KZG 커밋먼트 + SHPLONK 개구 증명으로 각 Chunk를 증명하고,
          여러 Chunk를 Batch로 집계한 뒤, 최종 Bundle을 L1에 제출합니다.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-3">Setup & 키 생성</h3>
        <CodePanel title="KZG 파라미터 + Proving Key" code={SETUP_CODE}
          annotations={setupAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">증명 생성</h3>
        <CodePanel title="SuperCircuit 빌드 → SNARK 생성" code={PROOF_GEN_CODE}
          annotations={proofGenAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">집계 전략</h3>
        <CodePanel title="Chunk → Batch → Bundle" code={AGGREGATION_CODE}
          annotations={aggregationAnnotations} />
      </div>
    </section>
  );
}
