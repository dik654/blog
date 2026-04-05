import HotStuffPipelineViz from './viz/HotStuffPipelineViz';
import HotStuffDetailViz from './viz/HotStuffDetailViz';

export default function HotStuff() {
  return (
    <section id="hotstuff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          HotStuff (Yin et al., 2019) — <strong>PBFT의 O(n²) 통신을 O(n) Star topology</strong>로 해결.<br />
          Threshold signature + 파이프라이닝으로 throughput 동시 향상.<br />
          Libra(Diem) → Aptos의 기반 합의 프로토콜.
        </p>
      </div>
      <div className="not-prose mb-8"><HotStuffDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Chained HotStuff 파이프라인</h3>
        <p className="leading-7">
          매 view에서 하나의 투표로 여러 블록의 진행을 동시 처리 — 3-chain commit rule.
        </p>
      </div>
      <div className="not-prose mb-8"><HotStuffPipelineViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── HotStuff 핵심 혁신 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff의 3가지 혁신</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 혁신 1: Linear View Change (O(n³) → O(n))
//
// PBFT view change:
// - each → all: VIEW-CHANGE + O(n) proofs
// - O(n²) messages × O(n) proof size = O(n³)
//
// HotStuff view change:
// - each → leader: NewView(highQC)
// - highQC: aggregated signature O(1)
// - O(n) messages × O(1) proof = O(n)
//
// 1000x+ 통신 효율 개선

// 혁신 2: Star Topology (O(n²) → O(n))
//
// PBFT: all-to-all broadcast
// - 각 phase당 n × (n-1) messages
// - 모든 link 활용
//
// HotStuff: leader-centric
// - leader broadcasts
// - replicas → leader votes
// - leader aggregates + broadcasts
// - O(n) per phase
//
// Trade-off: leader bandwidth bottleneck
// 해결: rotate leader per view

// 혁신 3: Chained Voting (파이프라이닝)
//
// Basic HotStuff: 1 block per 4 phases
// Chained HotStuff: 1 block per 1 view
// throughput 3x 향상
//
// 핵심 insight:
// "vote for B_v = prepareQC for B_(v-1)"
// "vote for B_(v+1) = precommitQC for B_(v-1)"
// ...
// 매 vote가 여러 역할 수행

// 3-chain commit rule:
// B committed iff B ← B' ← B'' with consecutive views
// → 3 rounds of QC accumulated
// → safety via chained locking`}
        </pre>
        <p className="leading-7">
          3가지 혁신: <strong>linear VC, star topology, chained voting</strong>.<br />
          PBFT의 O(n²)/O(n³) → HotStuff의 O(n)/O(n).<br />
          throughput 3x + validator 10x+ 확장성.
        </p>

        {/* ── Threshold Signature 심층 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Threshold Signature (BLS12-381)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BLS Signature Aggregation:
//
// Setup:
// - G1, G2, GT: elliptic curve groups
// - pairing: e: G1 × G2 → GT
// - hash H: message → G1
// - generator g ∈ G2
//
// KeyGen (per validator):
// - sk ∈ Z_q (random secret)
// - pk = g^sk ∈ G2 (public key)
//
// Sign (per validator):
// - σ = H(m)^sk ∈ G1 (signature)
//
// Verify:
// - e(σ, g) == e(H(m), pk)
// - 1 pairing operation

// Aggregation:
// - σ_agg = σ_1 · σ_2 · ... · σ_k
// - (group multiplication in G1)
// - pk_agg = pk_1 · pk_2 · ... · pk_k
// - Verify aggregated:
//   e(σ_agg, g) == e(H(m), pk_agg)
// - 여전히 1 pairing!

// HotStuff의 QC (Quorum Certificate):
// struct QC {
//     block_hash: Hash,
//     view: int,
//     sig_agg: G1_point,      // 96 bytes (BLS12-381)
//     signers: Bitmap,        // n/8 bytes
// }
// 전체 크기: O(n) in bitmap, O(1) in signature

// 검증 시간:
// - 2f+1 individual signatures: O(n) pairings
// - 1 aggregated signature: O(1) pairing
// - n=100: 67 pairings → 1 pairing
// - 67x 빠른 검증

// 공격 방어:
// - Rogue key attack
//   → Proof-of-Possession (PoP)
// - Small subgroup attack
//   → subgroup membership check
// - 구현 세심 필요

// 실제 블록체인 사용:
// - Ethereum 2.0 (Beacon): BLS12-381
// - Chia: BLS12-381
// - Diem/Aptos: BLS12-381
// - Cosmos: Ed25519 (aggregation 지원 약함)`}
        </pre>
        <p className="leading-7">
          BLS aggregation = <strong>n개 서명 → 1개 서명, n개 검증 → 1 pairing</strong>.<br />
          HotStuff O(n) 달성의 암호학적 기반.<br />
          96 bytes signature (BLS12-381), Ethereum 2.0이 대표 사용자.
        </p>

        {/* ── 실무 적용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff 실무 적용 사례</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HotStuff 적용 프로젝트:
//
// 1. Diem/Libra (2019-2022):
//    - Facebook's blockchain project
//    - LibraBFT (HotStuff 구현)
//    - 2022 종료 (규제 이슈)
//
// 2. Aptos (2022-현재):
//    - Diem 개발자 창립
//    - DiemBFT v4 (Jolteon 기반)
//    - Move language
//    - 100K+ TPS 목표
//
// 3. ThunderCore (2019-):
//    - PaLa + HotStuff
//    - EVM 호환
//    - Asia 시장
//
// 4. Cypherium (2018-):
//    - HotStuff 초기 구현
//    - PoW + BFT hybrid
//
// 5. Concordium (2021-):
//    - HotStuff 변형
//    - 규제 친화적 privacy

// HotStuff 계열 변형:
// - Jolteon: 2-chain commit
// - Ditto: async fallback
// - HotStuff-2: 2-phase + TC
// - Marlin: optimized HotStuff
// - Streamlet: simplified HotStuff

// 성능 벤치마크:
// HotStuff (origin):
// - validators: 128
// - TPS: 25,000
// - latency: ~500ms
// - geography: single region
//
// Jolteon (Aptos):
// - validators: ~100
// - TPS: 100,000+ (with Quorum Store)
// - latency: ~1s
// - geography: global

// HotStuff → DAG-BFT 진화:
// - HotStuff: 1 block per view (sequential)
// - DAG-BFT: multiple blocks per wave (parallel)
// - throughput 10-100x 향상
// - Narwhal/Bullshark, Mysticeti 등`}
        </pre>
        <p className="leading-7">
          HotStuff = <strong>Diem/Aptos 기반, ThunderCore 등 적용</strong>.<br />
          실측 25K+ TPS, Jolteon 변형으로 100K+ 달성.<br />
          DAG-BFT (2022-) 등장 전 최선의 sequential BFT.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 HotStuff가 BFT의 "표준"이 된 이유</strong> — 이론과 실무 결합.<br />
          학술적 완결성 (formal proof) + production-grade 구현 (Libra).<br />
          이후 모든 BFT 프로토콜은 HotStuff와 비교 (baseline).<br />
          DAG-BFT조차 HotStuff concepts (QC, TC) 재사용.
        </p>
      </div>
    </section>
  );
}
