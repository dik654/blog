import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff 체인 투표 &amp; 선형 통신</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          HotStuff (Yin et al., PODC 2019) — <strong>PBFT의 O(n²)/O(n³) 병목을 O(n)으로 개선</strong>.<br />
          Threshold Signature + Star topology로 선형 통신 달성.<br />
          Diem(Libra), Aptos가 채택 — 현대 BFT의 기준.
        </p>

        {/* ── HotStuff 혁신 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff 3가지 혁신</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HotStuff의 3가지 혁신:

// 1. Linear view change:
//    - PBFT view change O(n³) → HotStuff O(n)
//    - 핵심: threshold signature로 증거 압축
//    - 2f+1 signature → 1 aggregated signature
//
// 2. Star topology:
//    - PBFT all-to-all → HotStuff star (leader 중심)
//    - leader가 votes 수집, aggregated signature 생성
//    - 각 phase당 O(n) 메시지
//
// 3. Chained voting:
//    - 각 block의 vote가 다음 block의 QC
//    - 파이프라인으로 처리량 극대화
//    - 1 block per view (steady state)

// 기존 BFT 대비:
// PBFT: O(n²) normal, O(n³) view change
// Tendermint: O(n²) normal, O(n²) view change
// HotStuff: O(n) normal, O(n) view change ← 최초 달성!

// 역사:
// - 2018: arXiv paper 공개
// - 2019: PODC conference best paper
// - 2019: Libra(Diem) 채택 (Facebook)
// - 2020: LibraBFT
// - 2021: DiemBFT → Jolteon (2-chain)
// - 2021: Aptos 런칭 (Jolteon 기반)
// - 2022: HotStuff-2 (2-phase)

// 채택 blockchain:
// - Aptos (Jolteon + Ditto)
// - Diem/Libra (archived)
// - Cypherium
// - ThunderCore

// HotStuff 계열 변형:
// - Basic HotStuff (3-phase)
// - Event-Driven HotStuff
// - Chained HotStuff
// - HotStuff-2
// - Jolteon (Aptos)`}
        </pre>
        <p className="leading-7">
          HotStuff = <strong>threshold signature + star topology + chained voting</strong>.<br />
          최초로 O(n) linear view change 달성.<br />
          BFT의 "scalability barrier" 돌파.
        </p>

        {/* ── Threshold Signature ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Threshold Signature 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Threshold Signature란:
// - n개 중 t개 signature 합쳐 1개 aggregated signature
// - aggregated signature 검증 = t개 valid sig 검증
// - BLS12-381 aggregation 흔히 사용
//
// 기본 원리 (BLS aggregation):
// - 각 validator: private key sk_i, public key pk_i
// - signature: σ_i = sk_i × H(m)
// - aggregate: σ = σ_1 + σ_2 + ... + σ_t
// - verify: e(σ, g) == e(H(m), Σ pk_i)
// - single pairing으로 검증
//
// HotStuff에서의 사용:
// 1. leader가 block B 제안
// 2. 각 validator → leader: vote σ_i (BLS signature)
// 3. leader가 2f+1 vote 수집
// 4. aggregate σ = Σ σ_i
// 5. QC (Quorum Certificate) = (B, σ, signers)
// 6. next proposal에 QC 포함 → broadcast
//
// 크기 비교:
// PBFT: 2f+1 individual signatures = (2f+1) × 48 bytes
// HotStuff: 1 aggregated + bitmap = 48 + n/8 bytes
//
// n=100, f=33:
// PBFT: 67 × 48 = 3216 bytes
// HotStuff: 48 + 13 = 61 bytes
// 압축률: 53x

// BLS Signature 속성:
// - Pairing-based cryptography
// - 96-byte signature (BLS12-381)
// - O(1) aggregation
// - verify는 pairing 1회 (비싸지만 합산됨)
// - rogue key attack 방어 필요 (PoP)

// Threshold vs Multi-sig:
// Multi-sig: 각 서명 개별 검증
// Threshold: 단일 aggregated 서명 검증`}
        </pre>
        <p className="leading-7">
          BLS aggregation = <strong>n개 서명 → 1개 집계 서명</strong>.<br />
          signature size O(1), verification O(1) pairing.<br />
          HotStuff의 O(n) complexity 달성 열쇠.
        </p>

        {/* ── Star Topology ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Star Topology (leader-centric)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Star vs All-to-all:
//
// PBFT (all-to-all):
// - 각 replica가 모든 다른 replica에게 broadcast
// - n nodes → O(n²) connections
// - 메시지: n × (n-1) per phase
// - bandwidth: 모든 link 활용
//
// HotStuff (star):
// - leader만 broadcast
// - replicas → leader → replicas
// - n nodes → O(n) connections per phase
// - 메시지: 2(n-1) per phase
// - bandwidth: leader의 uplink 집중

// HotStuff 메시지 흐름 (3-phase):
//
// Phase 1 (Prepare):
//   leader → all: Prepare msg (B) ─ n-1 msgs
//   each → leader: Vote ─ n-1 msgs
//   leader aggregates: prepareQC
//
// Phase 2 (Pre-commit):
//   leader → all: Pre-commit msg (prepareQC) ─ n-1 msgs
//   each → leader: Vote ─ n-1 msgs
//   leader aggregates: precommitQC
//
// Phase 3 (Commit):
//   leader → all: Commit msg (precommitQC) ─ n-1 msgs
//   each → leader: Vote ─ n-1 msgs
//   leader aggregates: commitQC
//
// Phase 4 (Decide):
//   leader → all: Decide msg (commitQC) ─ n-1 msgs
//
// 총: 7(n-1) ≈ O(n) per block

// Trade-off:
// 장점:
// - O(n) communication
// - 단순 토폴로지
// - leader 중심 → 쉬운 추적
//
// 단점:
// - leader 병목 (bandwidth, CPU)
// - leader 공격 시 view change
// - leader uplink 요구 높음

// 최적화:
// - leader rotation 매 view
// - fair distribution of load
// - primary-backup replication`}
        </pre>
        <p className="leading-7">
          Star topology = <strong>leader 중심 broadcast/collect</strong>.<br />
          O(n²) → O(n) 감소 — validator 수 확장성 개선.<br />
          leader 병목은 매 view rotation으로 분산.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 HotStuff가 BFT 연구의 분수령인가</strong> — 최초의 linear-cost BFT.<br />
          2019 이전: BFT는 수백 validator 한계.<br />
          2019 이후: 수천 validator 가능 (이론).<br />
          blockchain 확장성의 이론적 토대 — Aptos, Diem 등이 현실화.
        </p>
      </div>
    </section>
  );
}
