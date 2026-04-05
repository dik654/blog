import ProveViz from './viz/ProveViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Prove({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="prove" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증명 생성 (Prover)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          h(x) = (a(x)·b(x) - c(x)) / t(x) — QAP 만족 확인이 증명의 첫 단계
          <br />
          나머지가 0이 아니면 witness가 잘못된 것 — Option::None 즉시 반환
          <br />
          블라인딩 팩터 r, s를 매번 새로 생성 — 같은 witness여도 다른 증명
        </p>
        <p className="leading-7">
          A = [α]₁ + Σwⱼ[aⱼ(τ)]₁ + r[δ]₁ — 지식계수 + QAP + 블라인딩
          <br />
          B = [β]₂ + Σwⱼ[bⱼ(τ)]₂ + s[δ]₂ — G2 위에서 동일 구조
          <br />
          C = private기여 + h기여 + sA + rB' - rsδ — 세 항의 결합
        </p>
      </div>
      <div className="not-prose mb-8">
        <ProveViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          witness[j]=0인 변수는 MSM에서 건너뜀 — 스칼라 곱 비용이 가장 크므로 0 체크가 효과적
          <br />
          C의 블라인딩 sA+rB'-rsδ: 전개하면 교차항 rsδ가 소거되어 검증 방정식이 정확히 성립
          <br />
          B를 G1(B')과 G2(B) 두 곳에서 계산 — C에 r·B'이 필요해서 G1 버전도 유지
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Prover 수식 유도 및 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Groth16 Prover — Full Proof Construction
//
// Input:
//   ProvingKey (from trusted setup)
//   Witness w (including public inputs)
//
// Output: proof (A, B, C) — 3 group elements

// Step 1: Compute polynomial h(x)
//
//   A(x) = sum_j w_j * a_j(x)
//   B(x) = sum_j w_j * b_j(x)
//   C(x) = sum_j w_j * c_j(x)
//
//   p(x) = A(x) * B(x) - C(x)
//
//   Must be divisible by t(x):
//     h(x) = p(x) / t(x)
//
//   Computation:
//     1. FFT: transform witness into eval form
//     2. Compute A, B, C on larger domain (blowup factor 2+)
//     3. Pointwise: eval_A * eval_B - eval_C = eval_p
//     4. Divide by eval_t (inverse vanishing poly)
//     5. Inverse FFT: back to coefficients of h(x)
//
//   Cost: 3-4 FFTs + pointwise ops
//   Size: h has degree < m-1

// Step 2: Sample random blinding factors
//
//   r, s <- F_p  (fresh randomness per proof)
//   These provide zero-knowledge and re-randomization

// Step 3: Compute A (G1)
//
//   A = [alpha]_1 + sum_j w_j * [a_j(tau)]_1 + r * [delta]_1
//
//   Pseudocode:
//     A = pk.alpha_g1.clone()
//     for j in 0..n:
//       if w[j] != 0:
//         A += pk.a_query[j] * w[j]
//     A += pk.delta_g1 * r

// Step 4: Compute B (both G1 and G2)
//
//   B_2 = [beta]_2 + sum_j w_j * [b_j(tau)]_2 + s * [delta]_2
//   B_1 = [beta]_1 + sum_j w_j * [b_j(tau)]_1 + s * [delta]_1
//   (B_1 only used for computing C)

// Step 5: Compute C (G1)
//
//   C = sum_{j in private} w_j * L[j]      // private input contribution
//     + sum_i h_i * H[i]                   // quotient contribution
//     + s * A + r * B_1 - r * s * [delta]_1  // blinding

// Why this specific form?
//
//   Verification check:
//     e(A, B_2) = e(alpha, beta) * e(IC_sum, gamma_2) * e(C, delta_2)
//
//   Expand A and B_2:
//     e(A, B_2) = e(alpha + sum(w_j a_j(tau)) + r*delta, beta + sum(w_j b_j(tau)) + s*delta)
//
//   Multiply out (using bilinearity):
//     = e(alpha, beta) * [cross-terms] * e(stuff, delta)
//
//   The cross-terms split into:
//     - public terms → IC_sum * gamma
//     - private terms → part of C
//     - h * t(tau) terms → part of C (accounts for QAP identity)
//     - blinding terms → sA + rB_1 - rs*delta terms
//
//   When verifier checks pairing equation:
//     LHS - RHS = (polynomial ID) * t(tau) + blinding cancellation
//   Both vanish if QAP holds, so proof passes

// Prover cost breakdown (for m-constraint circuit):
//
//   H polynomial computation: O(m log m) via FFT
//   Multi-scalar multiplications:
//     A: O(n) group ops (G1)
//     B_1: O(n) group ops (G1)
//     B_2: O(n) group ops (G2, more expensive)
//     C: O(n + m) group ops (G1)
//   Total: O(n + m) MSMs, typically ~n log n total time
//
//   For m=1M:
//     FFT: ~1-2 seconds
//     MSMs: ~2-3 seconds
//     Total: ~3-5 seconds (CPU)
//     With GPU: ~0.3-0.5 seconds

// Memory usage:
//
//   Witness: O(n) field elements
//   FFT working memory: O(m) elements x blowup
//   Proving key: O(m) G1 + O(1) G2 elements
//   Total: 500 MB - 10 GB for production circuits

// Batch provers:
//   Bellperson (Rust): proves Filecoin windows
//   ark-groth16 (Rust): Arkworks backend
//   snarkjs (JS): web/node proving
//   rapidsnark (C++): fastest single-threaded
//   Nano-gpu-snark (CUDA): GPU-accelerated

// Security requirements:
//   - r, s MUST be fresh per proof
//   - Toxic waste from setup MUST be destroyed
//   - Witness must correspond to valid circuit execution
//   - Random number generator must be cryptographic`}
        </pre>
      </div>
    </section>
  );
}
