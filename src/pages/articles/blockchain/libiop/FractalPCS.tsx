import CodePanel from '@/components/ui/code-panel';
import FractalIndexerViz from './viz/FractalIndexerViz';
import { FRACTAL_CODE, VERIFY_CODE } from './FractalPCSData';

export default function FractalPCS() {
  return (
    <section id="fractal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fractal PCS</h2>
      <div className="not-prose mb-8">
        <FractalIndexerViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Fractal</strong>은 홀로그래픽 IOP 기반 프로토콜로,
          <strong>인덱서(Indexer)</strong>를 통한 전처리로
          검증 시간을 O(N)에서 <strong>O(log N)</strong>으로 단축합니다.<br />
          동일한 회로에 대해 인덱스를 재사용할 수 있어
          대규모 시스템에서 효율적입니다.
        </p>
        <h3>인덱서: 행렬 분해</h3>
        <CodePanel title="Fractal 인덱서 구조" code={FRACTAL_CODE}
          annotations={[
            { lines: [4, 5], color: 'sky', note: 'A, B, C 행렬별 인덱서' },
            { lines: [8, 10], color: 'emerald', note: 'row/col/val 다항식 분해' },
            { lines: [13, 15], color: 'amber', note: '오라클 핸들 등록' },
          ]} />
        <h3>O(log N) 검증 시간</h3>
        <CodePanel title="Fractal 검증 매개변수" code={VERIFY_CODE}
          annotations={[
            { lines: [6, 12], color: 'sky', note: '전처리 매개변수 설정' },
            { lines: [14, 16], color: 'emerald', note: '인덱스 재사용 및 IVC' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Holographic IOP 개념</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Holographic IOP (Chiesa et al. 2020)
//
// 기존 IOP 한계:
//   Verifier가 full circuit 알아야 함
//   O(|Circuit|) verification time
//   대규모 회로에서 비효율
//
// Holographic 해결:
//   Circuit을 한 번만 "indexing"
//   Index는 compact representation
//   Verifier는 O(log |C|)만 처리

// Indexer:
//   Setup 단계에서 실행
//   Input: R1CS (A, B, C matrices)
//   Output: indexed oracles
//
//   행렬 분해:
//     A → (row_a, col_a, val_a) polynomials
//     B → (row_b, col_b, val_b) polynomials
//     C → (row_c, col_c, val_c) polynomials
//
//   각 polynomial은 sparse matrix representation
//
// Prover:
//   Index + witness → proof
//
// Verifier:
//   Index + proof → accept/reject
//   O(log |C|) work

// Fractal Benefits:
//
// 1. O(log N) verification
//    대규모 회로에서 critical
//    L1 on-chain verification 가능
//
// 2. Reusable Indexer
//    동일 circuit + 다양한 inputs
//    indexer once, prove many times
//
// 3. Recursive Composition
//    IVC (Incrementally Verifiable Computation)
//    Cycle of curves 불필요
//    더 간단한 recursion
//
// 4. Post-quantum secure
//    FRI 기반 (hash only)
//    Transparent setup

// 구성 요소:
//
//   R1CS → MLE (multilinear extension)
//   Lincheck IOP
//   Sumcheck protocol
//   FRI commitments
//   Merkle tree oracles

// 성능 비교:
//
//   ┌────────────┬────────────┬──────────┐
//   │  System    │  Verify    │ Setup    │
//   ├────────────┼────────────┼──────────┤
//   │ Groth16    │ O(1)       │ Per-circ │
//   │ Marlin     │ O(log²N)   │ Universal│
//   │ Fractal    │ O(log N)   │ Universal│
//   │ STARKs     │ O(log²N)   │ Transparent│
//   └────────────┴────────────┴──────────┘

// Research Impact:
//   - Nova, HyperNova folding schemes 영감
//   - Recursive SNARKs 발전 기반
//   - Proof-carrying data 연구`}
        </pre>
      </div>
    </section>
  );
}
