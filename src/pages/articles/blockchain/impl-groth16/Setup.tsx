import SetupViz from './viz/SetupViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Setup({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="setup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Trusted Setup (CRS 생성)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          τ, α, β, γ, δ — 다섯 개의 랜덤 스칼라 (toxic waste)
          <br />
          이 값을 아는 자는 가짜 증명을 만들 수 있음 — setup 후 반드시 삭제
          <br />
          실제 프로덕션은 MPC 세레모니로 어떤 단일 참여자도 전체 값을 알 수 없도록 보장
        </p>
        <p className="leading-7">
          QAP 다항식을 비밀 τ에서 평가 → 커브 포인트로 인코딩
          <br />
          공개 변수는 /γ로 나누어 IC (검증키), 비공개 변수는 /δ로 나누어 L (증명키)
          <br />
          e(α,β) 사전 계산을 검증키에 저장 — 검증 시 페어링 1개 절약
        </p>
      </div>
      <div className="not-prose mb-8">
        <SetupViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Rust의 소유권 시스템 — toxic waste는 함수 로컬 변수로, 함수 종료 시 스택에서 자동 소멸
          <br />
          γ와 δ로 공개/비공개를 분리하는 이유: 검증 방정식에서 각각 독립적으로 소거되어 구조 보장
          <br />
          h_query 크기 = m-1 (제약 수 - 1) — h(x)의 차수가 최대 m-2이므로
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CRS 구조 및 MPC 세레모니</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Groth16 Trusted Setup — Detailed CRS Structure
//
// Random trapdoor (toxic waste):
//   tau, alpha, beta, gamma, delta in F_p
//
// Structured Reference String (CRS / proving key):
//
//   ProvingKey = {
//     [alpha]_1,             // G1 point
//     [beta]_1,              // G1 point
//     [beta]_2,              // G2 point
//     [delta]_1,             // G1 point
//     [delta]_2,             // G2 point
//
//     // Powers of tau in G1:
//     [tau^0]_1, [tau^1]_1, ..., [tau^{m-1}]_1,
//
//     // For public inputs (gamma-normalized):
//     IC[j] = [(beta * a_j(tau) + alpha * b_j(tau) + c_j(tau)) / gamma]_1
//       for j in public_input_indices
//
//     // For private inputs (delta-normalized):
//     L[j] = [(beta * a_j(tau) + alpha * b_j(tau) + c_j(tau)) / delta]_1
//       for j in private_input_indices
//
//     // For h(tau) terms:
//     H[i] = [tau^i * t(tau) / delta]_1
//       for i in 0..m-2
//   }
//
//   VerifyingKey = {
//     [alpha]_1, [beta]_2,            // for e(alpha, beta)
//     [gamma]_2,                      // for IC check
//     [delta]_2,                      // for C check
//     IC[0], IC[1], ..., IC[l]        // public input generators
//   }

// Why split into alpha, beta, gamma, delta?
//
//   alpha, beta: "knowledge" factors
//     Prevent prover from using arbitrary A, B
//     Must be linked via e(A,B) = e(alpha, beta) * ...
//
//   gamma: separates public inputs
//     Can't mix public and private terms
//     Forces linearity over public inputs
//
//   delta: separates private + quotient terms
//     Groups private witness contributions
//     Prevents cross-contamination with public part

// Soundness relies on:
//   q-PKE (knowledge of exponent) assumption
//   Discrete log hardness
//   Bilinear group security

// MPC Ceremony (phase 2):
//
//   Problem: anyone who knows (tau, alpha, beta, delta)
//            can forge proofs!
//   Solution: multi-party computation
//
//   Each participant contributes randomness:
//     Start with CRS = public init
//     Participant i picks own r_i
//     Updates: CRS_i = CRS_{i-1} * r_i (homomorphically)
//     Publishes updated CRS
//
//   Final CRS = product of all contributions
//   As long as ONE participant is honest:
//     Their r_i remains secret
//     Final randomness unknown to any single party
//
// Historical ceremonies:
//   Zcash Sapling (MPC Phase 2): ~90 contributors
//   Filecoin Phase 2: hundreds
//   Ethereum KZG ceremony (2022-2023): 140,000+ contributions

// Phase 1 vs Phase 2:
//
//   Phase 1 (Powers of Tau):
//     Universal for any circuit <= N gates
//     [tau^0]_1, [tau^1]_1, ..., [tau^N]_1
//     [alpha * tau^k]_1, [beta * tau^k]_1
//     Reusable across projects
//
//   Phase 2 (Circuit-specific):
//     Uses phase 1 output
//     Specialized for ONE circuit
//     Computes IC, L, H query vectors
//     Must run per circuit

// Attack mitigations:
//   - Randomness from physical sources (dice, hardware RNG)
//   - Public attestations of destruction
//   - Air-gapped machines
//   - Livestream commitments

// Setup cost (computation):
//
//   For m-constraint circuit:
//     Compute m values of a_j(tau), b_j(tau), c_j(tau)
//     O(m) group operations
//
//   Prover key size: O(m) group elements
//     m = 10^6: ~100 MB
//     m = 10^8: ~10 GB
//
//   Verifier key size: O(l) where l = public inputs
//     Typically ~1 KB

// Alternative: universal setup
//
//   Plonk, Sonic, Marlin use UNIVERSAL trusted setup
//   Run ceremony ONCE, reuse for any circuit
//   Size: O(max circuit size)
//   Trade-off: slightly larger proofs, slower verification`}
        </pre>
      </div>
    </section>
  );
}
