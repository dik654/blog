import CodePanel from '@/components/ui/code-panel';
import KZG10FlowViz from './viz/KZG10FlowViz';
import {
  SETUP_CODE, SETUP_ANNOTATIONS,
  COMMIT_CODE, COMMIT_ANNOTATIONS,
} from './KZG10Data';

export default function KZG10({ title }: { title?: string }) {
  return (
    <section id="kzg10" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'KZG10 구현 상세'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>KZG10</strong>(Kate-Zaverucha-Goldberg, 2010)은 가장 기본적인 페어링 기반
          다항식 커밋먼트 스킴입니다. O(1) 크기의 증명과 O(1) 검증 시간이 핵심 장점이며,
          trusted setup이 필요합니다.
        </p>
      </div>

      <KZG10FlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Trusted Setup (SRS 생성)</h3>
        <CodePanel title="setup() — powers of beta 계산" code={SETUP_CODE}
          annotations={SETUP_ANNOTATIONS} />

        <h3>커밋 & Hiding 메커니즘</h3>
        <CodePanel title="commit() — MSM + hiding" code={COMMIT_CODE}
          annotations={COMMIT_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">KZG10 수식</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// KZG Polynomial Commitment Scheme
//
// Setup (Trusted):
//   τ ← random secret (toxic waste)
//   SRS = (G, τ·G, τ²·G, ..., τ^d·G, H, τ·H)
//   (G, H: elliptic curve generators)
//   → τ는 삭제되어야 함!
//
// Commit:
//   p(x) = c_0 + c_1·x + c_2·x² + ... + c_d·x^d
//   C = p(τ)·G = c_0·G + c_1·(τG) + ... + c_d·(τ^d·G)
//
//   (Multi-Scalar Multiplication, MSM)
//
// Open at point z:
//   Claim: p(z) = v
//   Quotient polynomial:
//     q(x) = (p(x) - v) / (x - z)
//
//   Proof π = q(τ)·G
//
// Verify:
//   e(C - v·G, H) == e(π, τ·H - z·H)
//
//   Bilinear pairing check

// 수학적 원리:
//
// p(x) - v ≡ 0 when x = z
// ⟹ (x - z) | p(x) - v
// ⟹ p(x) - v = (x - z) · q(x)
//
// 양변에 x = τ 대입:
//   p(τ) - v = (τ - z) · q(τ)
//
// Pairing로 EC points에서 검증:
//   e(C - v·G, H) = e(q(τ)·G · (τ-z), H)
//                 = e(q(τ)·G, (τ-z)·H)
//                 = e(π, τ·H - z·H)  ✓

// 장단점:
//
// 장점:
//   - Constant proof size (48~96 bytes)
//   - O(1) verification
//   - Batch verification 가능
//
// 단점:
//   - Trusted setup 필수
//   - Pairing 필요 (BN254, BLS12-381)
//   - Post-quantum NOT secure
//   - SRS 크기 = poly 차수에 비례

// 사용:
//   - PLONK (core primitive)
//   - Sonic, Marlin
//   - Ethereum EIP-4844 (blobs)
//   - Dfinity, Mina, Aztec`}
        </pre>
      </div>
    </section>
  );
}
