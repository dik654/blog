import CodePanel from '@/components/ui/code-panel';
import BulletproofRecursion from '../components/BulletproofRecursion';
import IPAStepsViz from './viz/IPAStepsViz';
import { CREATE_CODE, VERIFY_CODE } from './InnerProductData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function InnerProduct({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const _onCodeRef = onCodeRef;
  return (
    <section id="inner-product" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '내적 인수 증명 (O(log n))'}</h2>
      <div className="not-prose mb-8">
        <BulletproofRecursion />
      </div>
      <div className="not-prose mb-8">
        <IPAStepsViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Bulletproofs 핵심 — <strong>Inner Product Argument</strong><br />
          벡터 a, b에 대해 ⟨a, b⟩ = c를 O(log n) 크기 증명으로 입증<br />
          매 라운드 절반씩 접어 재귀적으로 크기 축소
        </p>
        {_onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => _onCodeRef('ipa-create', codeRefs['ipa-create'])} />
            <span className="text-[10px] text-muted-foreground self-center">IPA create</span>
            <CodeViewButton onClick={() => _onCodeRef('ipa-struct', codeRefs['ipa-struct'])} />
            <span className="text-[10px] text-muted-foreground self-center">struct</span>
          </div>
        )}

        <h3>InnerProductProof::create (inner_product_proof.rs)</h3>
        <CodePanel
          title="InnerProductProof::create 구현"
          code={CREATE_CODE}
          annotations={[
            { lines: [3, 9], color: 'sky', note: '증명 구조체 (O(log n) 크기)' },
            { lines: [24, 29], color: 'emerald', note: '벡터 절반 분할' },
            { lines: [31, 33], color: 'amber', note: '교차 내적 계산' },
            { lines: [54, 57], color: 'violet', note: '접기 (folding) 연산' },
          ]}
        />

        <h3>검증 (O(n) 스칼라 곱셈)</h3>
        <CodePanel
          title="InnerProductProof 검증"
          code={VERIFY_CODE}
          annotations={[
            { lines: [3, 6], color: 'sky', note: '스칼라 s_i 비트 인코딩' },
            { lines: [10, 10], color: 'emerald', note: 'Pippenger로 O(n/log n) 가능' },
          ]}
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Inner Product Argument 수학</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Inner Product Argument (IPA) — Mathematical Details
//
// Goal:
//   Prover has: vectors a, b in F^n
//   Prover claims: P = <a, G> + <b, H> + c*u
//     where c = <a, b>
//   Prove this WITHOUT revealing a, b
//
// Naive: send a, b → O(n) communication
// Bulletproofs: O(log n) communication via recursion

// The folding trick:
//
//   Split n into two halves: a = (a_L, a_R), b = (b_L, b_R)
//                            G = (G_L, G_R), H = (H_L, H_R)
//
//   Compute cross terms:
//     c_L = <a_L, b_R>
//     c_R = <a_R, b_L>
//     L = <a_L, G_R> + <b_R, H_L> + c_L * u
//     R = <a_R, G_L> + <b_L, H_R> + c_R * u
//
//   Send L, R to verifier
//   Verifier sends challenge x (Fiat-Shamir)
//
//   Compute folded vectors:
//     a' = a_L * x + a_R * x^-1  (length n/2)
//     b' = b_L * x^-1 + b_R * x  (length n/2)
//     G' = G_L * x^-1 + G_R * x
//     H' = H_L * x + H_R * x^-1
//
//   New statement:
//     P' = P + x^2 * L + x^-2 * R
//     Check: P' = <a', G'> + <b', H'> + <a', b'> * u
//
//   Recurse with a', b' (length n/2)

// Recursion terminates at n=1:
//   Prover sends final a, b scalars
//   Verifier checks directly:
//     P_final = a*G' + b*H' + a*b*u

// Proof size:
//   log(n) pairs (L_i, R_i) — each is one group element
//   Final (a, b) — two scalars
//   Total: 2*log(n) + 2 field/group elements
//
//   For n=64: 2*6 + 2 = 14 elements ≈ 448 bytes

// Prover cost:
//   Each round: O(n) scalar mults (folds)
//   Total: O(n) (not O(n log n)) — geometric series
//
// Verifier cost:
//   Must compute P_final's expected value
//   Needs G', H' (folded generators)
//   Can precompute or batch with Pippenger

// Scalar decomposition trick:
//
//   After log(n) folds, the final G' is:
//     G' = sum_i (s_i * G_i) where s_i = product of x_j^±1
//
//   Specifically:
//     s_i = product over bits of i:
//       x_j^+1 if bit j is 1
//       x_j^-1 if bit j is 0
//
//   Can compute all s_i in O(n) time
//   Then sum_i(s_i * G_i) via Pippenger multiexponentiation

// Verifier optimization:
//
//   Naive: recompute G', H' in each round → O(n log n)
//
//   Bulletproofs optimization:
//     Compute final s_i vector once
//     One big multiexp: sum_i(s_i * G_i)
//     Pippenger: O(n / log n) effective scalar mults
//
//   Total verifier: O(n) group ops (1 big multiexp)

// Soundness:
//
//   Security under DL assumption
//   Extractability: witness extractor runs protocol
//     m = n * log(n) times, solves for (a, b)
//   Knowledge soundness: 2log(n) × error
//
//   Standard parameters:
//     128-bit security
//     curve25519 or secp256k1
//     ~48 bytes per group element

// Zero-knowledge variant:
//   Add blinding factor to final response
//   HVZK (Honest-Verifier ZK)
//   Combined with range proof blinding → full ZK

// Implementation: dalek-cryptography/bulletproofs
//
//   src/inner_product_proof.rs:
//     struct InnerProductProof {
//       L_vec: Vec<CompressedRistretto>,
//       R_vec: Vec<CompressedRistretto>,
//       a: Scalar,
//       b: Scalar,
//     }
//
//     impl InnerProductProof {
//       fn create(transcript, G, H, u, a, b, c) -> Self;
//       fn verify(transcript, G, H, u, P, b, c) -> Result<()>;
//     }
//
//   ~500 lines, heavily optimized
//   Uses Ristretto255 (prime-order group)
//   Scalar: 32 bytes, Point: 32 bytes`}
        </pre>
      </div>
    </section>
  );
}
