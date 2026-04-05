import VerifyViz from './viz/VerifyViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Verify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">검증 (Verifier)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          e(A,B) = e(α,β) · e(IC_sum, [γ]₂) · e(C, [δ]₂)
          <br />
          IC_sum = ic[0] + Σ public[j]·ic[j+1] — 공개 입력으로 MSM 결합
          <br />
          페어링 3개만으로 완료 — 회로 크기와 무관하게 항상 O(1)
        </p>
        <p className="leading-7">
          증명 크기: A(G1, 64B) + B(G2, 128B) + C(G1, 64B) = 256바이트
          <br />
          e(α,β)는 검증키에 사전 계산 — 매 검증마다 Fp12 곱셈 1회로 대체
          <br />
          Ethereum zk-rollup 검증의 사실상 표준 — precompile로 온체인 검증 가능
        </p>
      </div>
      <div className="not-prose mb-8">
        <VerifyViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          input.is_zero() 체크 — 0인 공개 입력은 IC_sum에 기여 안 함, 스칼라 곱 절약
          <br />
          LHS == RHS는 Fp12 (12개 Fp 원소) 비교 — 빠르지만 페어링 자체가 비용의 대부분
          <br />
          증명 변조 감지: A, B, C 중 하나라도 변경하면 페어링 등식이 깨져 즉시 reject
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Verifier 상세 및 온체인 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Groth16 Verifier
//
// Inputs:
//   - VerifyingKey vk (fixed per circuit)
//   - Public inputs [x_0, x_1, ..., x_l]
//   - Proof (A, B, C)
//
// Output: accept / reject

// Verification equation:
//
//   e(A, B) = e(alpha, beta) * e(IC_sum, gamma) * e(C, delta)
//
//   where:
//     IC_sum = IC[0] + sum_{i=1..l} x_i * IC[i]
//
// Equivalently (pairing product = identity):
//
//   e(A, B) * e(-IC_sum, gamma) * e(-C, delta) * e(-alpha, beta) = 1

// Optimization: precomputed e(alpha, beta)
//
//   alpha, beta are fixed in verifying key
//   e(alpha, beta) in Fp12 computed once at setup
//   Stored as "alpha_beta" field in vk
//
//   Saves 1 pairing per verification
//   Reduces from 4 to 3 pairings

// Full verifier algorithm:
//
//   1. Parse proof: (A, B, C)
//      - Validate A, C are in G1 and on curve
//      - Validate B is in G2 and on curve
//      - Check subgroup membership (cofactor clearing)
//
//   2. Compute IC_sum:
//      IC_sum = vk.IC[0]
//      for i in 1..=l:
//        if x_i != 0:
//          IC_sum += x_i * vk.IC[i]
//
//   3. Check pairing equation:
//      LHS = e(A, B)
//      RHS = vk.alpha_beta * e(IC_sum, vk.gamma) * e(C, vk.delta)
//      accept = (LHS == RHS)

// Single pairing check (batching):
//
//   e(A, B) * e(-IC_sum, gamma) * e(-C, delta) = vk.alpha_beta
//
//   Or via product check:
//     e_prod([A, -IC_sum, -C], [B, gamma, delta]) = vk.alpha_beta
//
//   Multi-pairing: single Miller loop + single final exp
//   Saves 2 final exponentiations (~2x faster!)

// Verifier performance:
//
//   Naive (3 separate pairings): ~6 ms on CPU
//   Multi-pairing: ~2 ms on CPU
//   Precompute + multi-pairing: ~1-1.5 ms
//
//   On Ethereum EIP-196/197 precompile:
//     34K gas + 34K*n gas (n = number pairings)
//     Total: ~150K gas per verification
//     At 30 gwei: ~$10 verification cost (mainnet)

// Proof size:
//
//   A: G1 point = 64 bytes (uncompressed) or 32 (compressed)
//   B: G2 point = 128 bytes (uncompressed) or 64 (compressed)
//   C: G1 point = 64 bytes (uncompressed) or 32 (compressed)
//
//   Total: 256 bytes (uncompressed) or 128 bytes (compressed)
//   Usually sent uncompressed for faster verification

// Security considerations:
//
//   1) Subgroup attack:
//      Attacker sends B not in r-torsion subgroup
//      Defense: subgroup check (cofactor multiplication)
//   2) Malleability:
//      Different (A, B, C) can verify same public input
//      Not a Groth16-level issue; app should include nonce
//   3) Toxic waste:
//      If setup randomness leaked, all proofs forgeable
//   4) Public input forgery:
//      Correctly encoded in IC_sum, checked via gamma separation

// On-chain verification (Solidity):
//
//   contract Verifier {
//     struct Proof {
//       G1Point A;
//       G2Point B;
//       G1Point C;
//     }
//     struct VerifyingKey {
//       G1Point alpha_g1;
//       G2Point beta_g2, gamma_g2, delta_g2;
//       G1Point[] IC;
//     }
//
//     function verifyProof(
//       Proof memory proof,
//       uint[] memory input,
//       VerifyingKey memory vk
//     ) public view returns (bool) {
//       // Compute IC_sum
//       G1Point memory IC_sum = vk.IC[0];
//       for (uint i = 0; i < input.length; i++) {
//         IC_sum = Pairing.add(IC_sum,
//           Pairing.mul(vk.IC[i+1], input[i]));
//       }
//
//       // Pairing check
//       return Pairing.check(
//         [proof.A, neg(IC_sum), neg(proof.C), neg(vk.alpha_g1)],
//         [proof.B, vk.gamma_g2, vk.delta_g2, vk.beta_g2]
//       );
//     }
//   }

// Typical production usage:
//   - Zcash Sapling: note spend / output proofs
//   - Tornado Cash: withdrawal proofs (mainnet)
//   - ZK rollups: state transition proofs
//   - Iden3: identity attestations
//   - Filecoin: proof of replication`}
        </pre>
      </div>
    </section>
  );
}
