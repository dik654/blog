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

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 3단계 집계인가</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// 이론적 문제: L1 제출 비용
// - Halo2 proof 크기: ~400KB (single chunk)
// - L1 verify gas: ~500K gas per proof
// - 각 블록마다 제출 시: 비현실적 비용

// 해결책: 계층적 집계

// Layer 1: Chunk (수 블록)
// - 일반 SNARK proof
// - 크기: 400KB, verify cost 500K gas
// - 10-100 블록 포함

// Layer 2: Batch (여러 chunks)
// - Chunks를 recursive proof로 집계
// - 크기: 400KB (고정), verify cost 500K gas
// - 같은 verify cost로 더 많은 tx 검증

// Layer 3: Bundle (여러 batches)
// - 최종 L1 제출 단위
// - 크기: 400KB (여전히 고정!)
// - Gas amortization 극대화

// 효과
// - 1 bundle = 수백 batches = 수천 chunks
// - 수만 transactions를 500K gas로 L1 제출
// - Per-tx cost ~$0.005 (L1 gas 20 gwei 기준)

// Recursive SNARK의 힘
// - 증명의 증명 생성 가능
// - Trade-off: prover 비용 증가
// - 하지만 L1 cost 절감이 훨씬 큼`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: KZG + SHPLONK 선택</p>
          <p>
            <strong>KZG commitment</strong>: Trusted setup 필요, proof 작음 (48 bytes)<br />
            <strong>SHPLONK</strong>: Multi-point opening 최적화 — 여러 점 한번에 증명<br />
            대안 <strong>FRI</strong>(STARK): No trusted setup, proof 큼 (수십 KB)<br />
            Scroll은 <strong>proof 크기 우선</strong> → KZG 선택
          </p>
        </div>

      </div>
    </section>
  );
}
