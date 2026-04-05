import CodePanel from '@/components/ui/code-panel';
import STARKPipelineViz from './viz/STARKPipelineViz';
import { PROVE_CODE, PROVE_ANNOTATIONS, VERIFY_CODE, VERIFY_ANNOTATIONS } from './UniSTARKData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function UniSTARK({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="uni-stark" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'uni-stark 증명 시스템'}</h2>
      <div className="not-prose mb-8"><STARKPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>uni-stark</strong>는 Plonky3의 단변수(univariate) STARK 프레임워크입니다.<br />
          AIR 제약조건을 다항식으로 변환하고 FRI 프로토콜로 효율적으로 증명합니다.<br />
          투명 셋업(trusted setup 없음)으로 강력한 보안을 제공합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('p3-stark-config', codeRefs['p3-stark-config'])} />
            <span className="text-[10px] text-muted-foreground self-center">config.rs</span>
          </div>
        )}

        <h3>증명 생성 (prove)</h3>
        <CodePanel title="5단계 STARK 증명 파이프라인" code={PROVE_CODE}
          annotations={PROVE_ANNOTATIONS} />

        <h3>검증 (verify)</h3>
        <CodePanel title="Fiat-Shamir 재현 + 제약 검증" code={VERIFY_CODE}
          annotations={VERIFY_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-8 mb-3">STARK 5단계 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// STARK prove pipeline

// Phase 1: Trace commitment
// - AIR execution trace M: matrix[rows × cols]
// - M의 각 column을 polynomial로 interpolate
// - Evaluation domain에서 평가 (LDE extension)
// - Merkle tree commitment
// - Root를 transcript에 추가

// Phase 2: Constraint polynomial
// - AIR constraints → polynomial C(X)
// - C(X) = AIR_poly(M) / Z_H(X)
// - Z_H: vanishing polynomial on trace domain
// - C(X) should be low-degree if constraints hold

// Phase 3: FRI low-degree test
// - C(X)의 degree 검증
// - Folding iterations (log N 단계)
// - Each round: commitment + challenge

// Phase 4: Opening proofs
// - Random query points
// - Merkle path + claimed values
// - Consistency between trace and constraint

// Phase 5: Final checks
// - Last FRI folding value
// - Should be constant (degree 0)
// - Verifier 재검증

// Complexity
// - Prover: O(n log n) (FFTs)
// - Verifier: O(log² n)
// - Proof size: O(log² n × λ)  where λ = security

// Plonky3의 최적화
// - Polynomial batching
// - DEEP-ALI variant
// - Multi-threading
// - SIMD vector operations`}</pre>

      </div>
    </section>
  );
}
