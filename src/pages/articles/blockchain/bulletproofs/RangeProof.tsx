import CodePanel from '@/components/ui/code-panel';
import RangeProofAggViz from '../components/RangeProofAggViz';
import { STRUCT_CODE, PROVE_CODE, AGG_CODE } from './RangeProofData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function RangeProof({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const _onCodeRef = onCodeRef;
  return (
    <section id="range-proof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '범위 증명 & 집계 (range_proof)'}</h2>
      <div className="not-prose mb-8"><RangeProofAggViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          범위 증명 — 비밀 값 v가 [0, 2^n) 범위에 있음을 증명<br />
          v의 n비트 분해에 내적 인수 증명 적용<br />
          m개 값 동시 증명하는 <strong>집계(aggregation)</strong>로 크기 절약 가능
        </p>
        {_onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => _onCodeRef('range-proof-struct', codeRefs['range-proof-struct'])} />
            <span className="text-[10px] text-muted-foreground self-center">mod.rs</span>
            <CodeViewButton onClick={() => _onCodeRef('dealer', codeRefs['dealer'])} />
            <span className="text-[10px] text-muted-foreground self-center">dealer.rs</span>
          </div>
        )}

        <h3>RangeProof 구조체</h3>
        <CodePanel
          title="RangeProof 구조체 (Rust)"
          code={STRUCT_CODE}
          annotations={[
            { lines: [4, 5], color: 'sky', note: '비트 커밋 (A, S)' },
            { lines: [8, 10], color: 'emerald', note: '다항식 계수 커밋 (T1, T2)' },
            { lines: [16, 16], color: 'violet', note: 'IPP 증명 (O(log n))' },
            { lines: [19, 20], color: 'amber', note: '증명 크기 계산' },
          ]}
        />

        <h3>prove_multiple 흐름 (MPC Dealer-Party 패턴)</h3>
        <CodePanel
          title="prove_multiple_with_rng 구현"
          code={PROVE_CODE}
          annotations={[
            { lines: [7, 8], color: 'sky', note: '딜러 초기화' },
            { lines: [10, 17], color: 'emerald', note: '비트 커밋 생성' },
            { lines: [19, 21], color: 'amber', note: '도전값 y, z 생성' },
            { lines: [33, 35], color: 'violet', note: 'IPP로 집계 증명' },
          ]}
        />

        <h3>집계 절약 효과</h3>
        <CodePanel
          title="집계 크기 비교 (n=64 비트)"
          code={AGG_CODE}
          annotations={[
            { lines: [5, 10], color: 'emerald', note: 'm 증가에 따른 크기 변화' },
            { lines: [11, 11], color: 'sky', note: 'm=16: 94% 절약' },
          ]}
        />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Range Proof 수학적 구성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bulletproof Range Proof — Construction
//
// Goal:
//   Given commitment V = v*B + γ*B_blinding
//   Prove: 0 <= v < 2^n (value in range)
//   Without revealing v or γ

// Step 1: Bit decomposition
//
//   a_L = (a_{L,0}, a_{L,1}, ..., a_{L,n-1})
//     where a_{L,i} = i-th bit of v
//
//   a_R = a_L - 1^n (vector of 1s subtracted)
//     so a_{R,i} = a_{L,i} - 1
//
//   Inner product check:
//     <a_L, a_R * 2^n> = v (encodes value)
//     a_L ∘ a_R = 0^n (Hadamard, each bit AND complement = 0)
//     a_L - a_R - 1^n = 0 (definition of a_R)
//
//   These three constraints prove:
//     - a_L has 0/1 bits only
//     - bits encode v correctly
//     - v < 2^n (by construction)

// Step 2: Commit to bits
//
//   Prover picks random α, ρ
//   Prover picks random s_L, s_R (blinding vectors)
//
//   A = α*H + <a_L, G> + <a_R, H_bp>
//     (commitment to bit vectors)
//   S = ρ*H + <s_L, G> + <s_R, H_bp>
//     (commitment to blinding)
//
//   Send A, S to verifier

// Step 3: Fiat-Shamir challenges
//
//   y = hash(transcript) → diagonal matrix y^n = (1, y, y^2, ...)
//   z = hash(transcript) → scalar challenge
//
//   These fold the 3 constraints into a single polynomial check

// Step 4: Polynomial construction
//
//   l(X) = a_L - z*1^n + s_L * X
//   r(X) = y^n ∘ (a_R + z*1^n + s_R*X) + z^2 * 2^n
//
//   Define t(X) = <l(X), r(X)>
//     = t_0 + t_1*X + t_2*X^2
//
//   Prove: t_0 encodes v*z^2 + delta(y,z)
//     where delta is a known function of y, z
//
//   Prover commits to t_1, t_2:
//     T_1 = t_1*G + tau_1*H
//     T_2 = t_2*G + tau_2*H

// Step 5: Verifier challenge x
//
//   x = hash(T_1, T_2)
//
//   Prover computes:
//     l = l(x) (n-vector)
//     r = r(x) (n-vector)
//     t_hat = t(x) = <l, r>
//     tau_x = tau_2*x^2 + tau_1*x + z^2*gamma
//     mu = alpha + rho*x

// Step 6: IPA on <l, r> = t_hat
//
//   Standard Inner Product Argument
//   Proves: <l, r> = t_hat
//   Proof size: 2*log(n) elements + 2 scalars

// Step 7: Verifier check
//
//   Check 1: t_hat*G + tau_x*H == z^2*V + delta(y,z)*G + x*T_1 + x^2*T_2
//   Check 2: Verify IPA on P = ... (derived from commitments)
//
//   Total proof size:
//     A, S, T_1, T_2, tau_x, mu, t_hat + IPA proof
//     = 4 points + 3 scalars + 2*log(n) points + 2 scalars
//     = 4 + 2*log(n) points + 5 scalars
//
//   For n=64: 4 + 12 = 16 points + 5 scalars
//            = (16*32) + (5*32) = 672 bytes

// Aggregation (multi-value proofs):
//
//   Prove m values [v_1, ..., v_m] each in [0, 2^n)
//
//   Concatenate bit vectors:
//     a_L (length m*n)
//     a_R (length m*n)
//
//   Single IPA on folded vectors
//
//   Size: 4 + 2*log(m*n) points + 5 scalars
//
//   m=16, n=64: 4 + 2*10 = 24 points = ~800 bytes
//   Per-value cost: 50 bytes (vs 672 for individual)
//   94% savings!

// Verifier batch optimization:
//
//   Multiple independent proofs can be verified together:
//     Multiply each proof by random weight
//     Combine into ONE multiexp
//     Single Pippenger for all proofs
//
//   K proofs → K * amortized_cost
//   vs K separate O(n) verifications
//   → 3-5x speedup typical

// Implementation notes:
//
//   MPC prover structure (dealer/party):
//     Dealer: generates randomness, aggregates
//     Party: holds secret value, commits locally
//     Multi-party aggregation for privacy pools
//
//   dalek bulletproofs:
//     src/range_proof/mod.rs
//     src/range_proof/dealer.rs
//     src/range_proof/party.rs
//     src/range_proof/messages.rs`}
        </pre>
      </div>
    </section>
  );
}
