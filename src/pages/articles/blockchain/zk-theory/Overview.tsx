import ZKPropertyViz from './viz/ZKPropertyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">완전성 · 건전성 · 영지식성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          영지식 증명(Zero-Knowledge Proof, ZKP) — 비밀을 공개하지 않고 "나는 이 사실을 안다"를 증명하는 암호학적 프로토콜.
          <br />
          세 가지 성질을 동시에 만족해야 유효한 ZKP다.
        </p>
      </div>
      <div className="not-prose"><ZKPropertyViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ZKP 3대 성질 정식 정의</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Zero-Knowledge Proof Properties
//
// 1. Completeness (완전성)
//    정직한 Prover + 정직한 Verifier
//    → 참 명제는 항상 승인됨
//
//    For all (x, w) ∈ R:
//        Pr[Verifier(x, π) = ACCEPT] ≥ 1 - negl
//
//    where π = Prover(x, w)
//
// 2. Soundness (건전성)
//    거짓 명제는 (거의) 승인받을 수 없음
//
//    For all x ∉ L, all adversary P*:
//        Pr[Verifier(x, π*) = ACCEPT] ≤ ε
//
//    ε = soundness error (예: 2^-128)
//
// 3. Zero-Knowledge (영지식성)
//    Verifier는 "x가 참"이라는 사실 외에
//    어떤 정보도 얻지 못함
//
//    Formal: Simulator S 존재
//        Real: Transcript(Prover, Verifier)
//        Ideal: S(x) 만 사용
//        ↓
//        두 분포 구별 불가능

// Variants:
//   Perfect ZK: 두 분포 완전히 같음
//   Statistical ZK: 통계적으로 가까움
//   Computational ZK: 계산적으로 구별 불가

// Historical milestones:
//   1985 Goldwasser-Micali-Rackoff: ZK 정의
//   1986 Fiat-Shamir: 비대화형 변환
//   1988 Blum-Feldman-Micali: NIZK
//   2012 Groth-Sahai: efficient SNARK
//   2013 Pinocchio: 첫 실용 SNARK
//   2016 Groth16: 최소 proof size
//   2019 PLONK: universal setup
//   2020 Halo: recursion, no trusted setup
//   2021 STARKs commercial: StarkWare, Risc0

// Hard Problems (보안 기반):
//   - Discrete Log (DH, Schnorr)
//   - Computational DH, DDH
//   - Knowledge of Exponent
//   - Bilinear pairings (BLS, Groth16)
//   - Lattice assumptions (Post-quantum)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">ZKP 사용 사례</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ZKP Applications
//
// 1. Privacy-preserving Blockchains
//    Zcash (Sprout/Sapling/Orchard):
//      - Shielded transactions
//      - Groth16 / Halo2
//    Monero: Bulletproofs
//    Aztec Network: private ZK-rollup
//
// 2. ZK-Rollups (L2 Scaling)
//    zkSync, Starknet, Polygon zkEVM, Scroll
//    - Batch 거래 → single proof
//    - L1 gas 비용 대폭 감소
//    - 초당 수천~수만 TPS
//
// 3. Identity & Credentials
//    - Anonymous credentials
//    - Age verification (나이만 증명)
//    - KYC without revealing identity
//    - Worldcoin (Iris recognition)
//
// 4. Voting
//    - Election integrity
//    - Anonymous ballots
//    - Vocdoni, ZKVote
//
// 5. Verifiable Computation
//    - Cloud outsourcing
//    - ML model verification (zkML)
//    - Game integrity
//
// 6. Cross-chain Bridges
//    - Light client proofs
//    - Succinct verification

// 주요 Application Stack:
//   Circom + snarkjs (Groth16/PLONK)
//   Cairo (StarkWare)
//   Halo2 (zcash, Ethereum Foundation)
//   Arkworks (Rust, 연구용)
//   Noir (Aztec, DSL)
//   Leo (Aleo)

// 산업 동향:
//   $5B+ 투자 (2022-2024)
//   수백 개 ZK 프로젝트
//   Ethereum rollup 지배
//   AI + ZK (zkML) 급부상`}
        </pre>
      </div>
    </section>
  );
}
