import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GossiPBFT (Filecoin F3)</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GossiPBFT (Protocol Labs, 2024) — <strong>Filecoin의 F3 (Fast Finality)</strong> 프로토콜.<br />
          기존 EC (Expected Consensus) 위에 PBFT 스타일 투표 layer 추가.<br />
          7.5시간 → 수 분으로 finality 시간 단축.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 필요한가</h3>
        <p className="leading-7">
          Filecoin EC: 확정에 <strong>약 7.5시간</strong> (900 epochs × 30초).<br />
          cross-chain bridges, DeFi 등 빠른 확정 필수.<br />
          F3: EC를 수정하지 않고 확정 레이어만 추가.
        </p>

        {/* ── Filecoin EC의 한계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Filecoin EC의 한계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin Expected Consensus (EC):
//
// 기본 원리:
// - storage power 비례 winner 선택
// - VRF 기반 leader election
// - tipset 기반 (multi-block per epoch)
// - probabilistic finality
//
// Epoch 구조:
// - 30초 per epoch
// - each epoch: 0-20 blocks per tipset
// - expected winners per epoch: ~5
// - storage power weighted

// EC Finality:
// - ~900 epochs = 7.5 hours
// - 확률적 finality (like Bitcoin)
// - reorg probability exponentially decreases
// - 7.5시간 후 거의 0

// 문제점:
// 1. Cross-chain:
//    - 다른 chain에 Filecoin state 전달
//    - 7.5시간 대기 비현실적
//    - bridge protocols 부적합
//
// 2. DeFi:
//    - composability 필요
//    - 즉시 settlement 필수
//    - 7.5시간 대기 UX 파괴
//
// 3. Data marketplace:
//    - payments 확정 시간 길어
//    - provider-client trust 필요

// F3의 목표:
// "EC 수정 없이 finality 가속"
// - 기존 EC는 유지 (compat)
// - F3 layer가 finality 제공
// - EC의 tipset 중 확정된 것 마킹

// 결과:
// - block production: EC (30s per epoch)
// - finalization: F3 (minutes)
// - EC + F3 combined
// - backward compatible

// Protocol Labs 2024:
// - mainnet deployment (phased)
// - audit + formal verification
// - 3x+ finality improvement`}
        </pre>
        <p className="leading-7">
          EC: <strong>7.5시간 finality, storage power weighted</strong>.<br />
          cross-chain/DeFi에 부적합.<br />
          F3: EC 위 finality layer 추가 (수 분).
        </p>

        {/* ── GossiPBFT 설계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">GossiPBFT 설계 원리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GossiPBFT 설계:
//
// 이름 유래:
// - Gossip: 모든 validator가 broadcast
// - PBFT: 3-phase voting 구조
// - "gossip + PBFT hybrid"

// 핵심 아이디어:
// 1. Storage power weighted voting:
//    - 1 node 1 vote 아님
//    - storage power 비례
//    - Filecoin 특성 반영
//
// 2. Gossip-based communication:
//    - leader 없음 (gossip)
//    - 모든 validator equal
//    - DDoS 저항 강함
//
// 3. Multi-phase voting:
//    - QUALITY: 후보 선택
//    - CONVERGE: 수렴
//    - PREPARE: 준비 투표
//    - COMMIT: 확정 투표
//
// 4. EC integration:
//    - EC tipset = F3 input
//    - F3 output = finalized tipset
//    - async finalization

// 다른 BFT와의 차이:
//
// vs PBFT:
// - leader 없음 (gossip)
// - storage power weighted
// - EC 위 layer
//
// vs Tendermint:
// - 4 phases (QUALITY 추가)
// - gossip (no leader)
// - async finalization

// vs HotStuff:
// - no QC aggregation (gossip broadcast)
// - 4 phases (vs 3-4)
// - different safety model

// 참가자:
// - storage providers
// - with registered power
// - 2/3+ power threshold (BFT)

// 목표 성능:
// - finality: ~1-5 minutes
// - 7.5시간 → 수 분
// - 100-1000x improvement

// Development:
// - GossiPBFT: Protocol Labs
// - TLA+ specification
// - formal verification (Stacks)
// - phased rollout 2024-2025`}
        </pre>
        <p className="leading-7">
          GossiPBFT: <strong>storage power weighted + gossip + 4-phase</strong>.<br />
          leader 없음, DDoS 저항.<br />
          EC 위 layer로 finality 100-1000x 향상.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "gossip" 구조를 선택했나</strong> — DDoS 저항 + 탈중앙화.<br />
          leader 기반 BFT: leader 공격 시 halt.<br />
          Gossip: 모든 validator 대등 → single point of failure 없음.<br />
          Filecoin는 DDoS 자주 겪음 → gossip 필수.
        </p>
      </div>
    </section>
  );
}
