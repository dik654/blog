import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import Groth16Viz from './viz/Groth16Viz';

export default function Groth16Verify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="groth16-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Groth16 Verify — 증명 & 검증</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Prover는 오프체인에서 witness를 R1CS → QAP로 변환한 뒤, 증명(A, B, C)을 생성한다.
          <br />
          증명 크기는 192 bytes. 검증 시간은 일정하다(O(1)).
          <CodeViewButton onClick={() => onCodeRef('rg-verifier', codeRefs['rg-verifier'])} />
        </p>
        <p className="leading-7">
          Verifier는 온체인에서 페어링 검증을 수행한다.
          <br />
          <code>e(A,B) == e(α,β) · e(vk_x,γ) · e(C,δ)</code>.
          EVM precompile(0x06, 0x07, 0x08)을 사용해서 약 250,000 gas가 든다.
        </p>
      </div>
      <div className="not-prose"><Groth16Viz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Pairing-based Verification</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Groth16 Proof 구조
struct Proof {
    G1Point A;   // ~48 bytes
    G2Point B;   // ~96 bytes
    G1Point C;   // ~48 bytes
}
// Total: 192 bytes

// Verification equation
// e(A, B) · e(-α, β) · e(-vk_x, γ) · e(-C, δ) = 1

// where:
// α, β, γ, δ : verification key (trusted setup output)
// vk_x       : public input linear combination

// vk_x computation
vk_x = γABC_0 + sum_{i=1..l} public_input_i * γABC_i

// EVM Implementation
function verify(
    Proof proof,
    uint[3] publicInputs
) public view returns (bool) {
    // 1) vk_x 계산
    G1Point vk_x = γABC[0];
    for (uint i = 0; i < publicInputs.length; i++) {
        vk_x = Pairing.addition(vk_x,
                Pairing.scalar_mul(γABC[i+1], publicInputs[i]));
    }

    // 2) Pairing check (4 pairings)
    return Pairing.pairingProd4(
        Pairing.negate(proof.A), proof.B,
        α, β,
        vk_x, γ,
        proof.C, δ
    );
}

// EVM Precompiles 사용
// 0x06: bn256Add       (~150 gas)
// 0x07: bn256ScalarMul (~6,000 gas)
// 0x08: bn256Pairing   (~45K base + 34K per pair)

// Total gas
// - Point additions: ~600 gas
// - Scalar mults: ~18K gas (3 public inputs)
// - Pairing (4 pairs): ~181K gas
// - Misc: ~50K gas
// Total: ~250K gas

// Comparison
// Plonk: ~300K gas (더 복잡한 verifier)
// STARK: ~1M+ gas (더 많은 Merkle/FRI)
// Groth16이 L1에 가장 효율적`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Trusted Setup Ceremony</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Groth16 약점: per-circuit trusted setup
// 각 circuit마다 secret values (toxic waste) 생성
// 그 secrets 유출 시 → 가짜 proof 생성 가능

// Multi-party computation (MPC) ceremony
// Participants 100~1000명
// 각자가 랜덤 기여
// 한 명이라도 정직하면 안전

// Phase 1: Powers of Tau (universal)
// - BN254 curve의 powers 생성
// - 모든 circuit에 공유 가능
// - ZCash, Polygon, RAILGUN 등 재사용

// Phase 2: Per-circuit
// - Circuit-specific 파생
// - RAILGUN은 자체 ceremony (2023)
// - 수십 명 참여

// 검증 방법
// - Beacon (future block hash) 포함
// - 각 기여자의 transcript 공개
// - Verifier가 수학적 integrity 확인

// Groth16의 trusted setup 문제를 해결하려는 시도
// - PLONK: universal setup (circuit-agnostic)
// - Marlin: universal + updatable
// - Plonky2: no setup (FRI-based)

// RAILGUN이 Groth16 선택 이유
// - L1 verify gas 최적 (proof 크기, verify cost)
// - MPC ceremony 참여 가능하면 충분히 안전
// - 단, 새 circuit 추가 시 새 ceremony 필요`}</pre>

      </div>
    </section>
  );
}
