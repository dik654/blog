import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 F3가 필요한가</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        EC(Expected Consensus)의 확정까지 900 에폭(7.5시간) 대기 문제<br />
        F3는 EC 위에 올리는 확정성 레이어 — 블록 생산은 EC, 확정은 F3
      </p>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── F3 등장 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">F3 등장 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin EC의 Finality 문제:
//
// EC 구조:
// - 30s per epoch
// - probabilistic finality
// - 900 epochs = 7.5 hours
// - Nakamoto-style security

// 900 epochs 근거:
// - reorg 확률 계산
// - ~33% adversarial power 가정
// - probability < 10^-18 after 900
// - Filecoin의 historical 값

// 7.5시간 문제:
// 1. Cross-chain bridges:
//    - Filecoin → Ethereum bridge
//    - 7.5h 대기 필수
//    - DeFi 통합 불가
//
// 2. Payment settlement:
//    - 거래 확정 지연
//    - merchant adoption 어려움
//    - UX 나쁨
//
// 3. FVM DeFi:
//    - composability 제약
//    - DEX trading 느림
//    - lending 어려움
//
// 4. IPC (InterPlanetary Consensus):
//    - subnet checkpointing
//    - 7.5h checkpoint delay
//    - subnet UX 제약

// F3 (Fast Finality) 목표:
// - EC block production 유지
// - 추가 finality layer
// - ~2-5 min finality
// - GossiPBFT 기반

// 설계 원칙:
// 1. Backward compatible
//    - EC 변경 없음
//    - 기존 node 호환
//
// 2. Optional
//    - F3 비활성화도 가능
//    - EC 독립적 작동
//
// 3. Additive security
//    - EC + F3 = 더 강한 보안
//    - 둘 중 하나 실패해도 OK
//
// 4. Storage power based
//    - Filecoin의 native metric
//    - 1 TB = 1 vote weight`}
        </pre>
        <p className="leading-7">
          EC: <strong>7.5h finality → bridge/DeFi 부적합</strong>.<br />
          F3: EC 위 finality layer → 2-5분으로 단축.<br />
          backward compatible, optional, storage-power based.
        </p>

        {/* ── F3 영향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">F3의 Filecoin 생태계 영향</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// F3 활용 영역:

// 1. Cross-chain bridges:
//    - 7.5h → 2-5분
//    - 100-200x faster
//    - Axelar, Chainlink CCIP 통합
//    - FIL/ETH atomic swaps
//
// 2. FVM DeFi:
//    - DEX (Uniswap clones)
//    - Lending protocols
//    - Stablecoin (USD-pegged)
//    - composability unlocked
//
// 3. Payment infrastructure:
//    - merchant payments
//    - recurring billing
//    - microtransactions (storage deals)
//
// 4. IPC Subnets:
//    - parent chain checkpointing
//    - fast subnet-to-mainnet
//    - ~5min checkpoint
//
// 5. Light clients:
//    - fast finality proofs
//    - mobile wallets
//    - SPV clients
//
// 6. Enterprise adoption:
//    - data marketplace
//    - storage contracts
//    - audit trails

// 기존 대비:
// - Bitcoin: 60 min finality
// - Ethereum: 12.8 min (finalized)
// - Cosmos: 6s (instant)
// - Solana: ~13s (probabilistic)
// - Filecoin + F3: 2-5 min (target)

// Rollout timeline:
// - 2023: F3 설계 완료
// - 2024 Q1: devnet
// - 2024 Q2: testnet
// - 2024 H2: mainnet (phased)
// - 2025+: enforced

// Protocol Labs 투자:
// - 연구 2년+ (2022-2024)
// - TLA+ formal verification
// - Coq proofs (partial)
// - 4+ audits
// - go-f3 implementation

// 기술 스택:
// - go-f3: Go reference implementation
// - libp2p: network layer
// - BLS signatures: aggregation
// - HAMT: state storage
// - Lotus integration`}
        </pre>
        <p className="leading-7">
          F3 영향: <strong>cross-chain, DeFi, payments, subnets</strong>.<br />
          7.5h → 2-5분 (100-200x faster).<br />
          2024 testnet → 2025 mainnet enforcement 예상.
        </p>

        {/* ── EC + F3 Hybrid Model ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EC + F3 Hybrid Security Model</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Hybrid Security Model:
//
// EC (Block Production Layer):
// - probabilistic finality
// - 30s blocks
// - 7.5h effective finality
// - Sybil resistance: storage power
//
// F3 (Finality Layer):
// - deterministic finality (BFT)
// - ~2-5 min per decision
// - 2/3+ storage power quorum
// - safety via quorum intersection

// 결합:
// - F3 finalized tipset은 EC에서도 canonical
// - EC reorg는 F3 finalized 이상에서만 가능
// - 둘 다 honest majority 필요 (33-50%)

// Attack scenarios:
//
// Case 1: EC alone (F3 disabled)
// - 기존 behavior
// - 7.5h finality
// - 33% attack 이론적 가능
//
// Case 2: F3 alone (hypothetical)
// - fast finality
// - but block production 없음
// - not usable standalone
//
// Case 3: EC + F3 (production)
// - F3 finalized = strong
// - 이중 안전망
// - 33% attack → F3 halt (not fork)

// Finality assumptions 비교:
// EC: honest > 66% storage power (probabilistic)
// F3: honest > 66% storage power (deterministic)
// 둘 다 같은 quorum threshold

// 공격자 요구:
// - 33% storage power 보유 (FIL pledge)
// - 현실: 수십 미/억 USD 투자
// - Filecoin reward도 잃음
// - slashing risk
// - 경제적 비합리

// 보안 강화 (F3로):
// - finalized tipset revert 불가
// - bridge에 즉시 notification
// - SMPC/MPC applications 가능
// - enterprise adoption 가속`}
        </pre>
        <p className="leading-7">
          Hybrid: <strong>EC (block production) + F3 (finality)</strong>.<br />
          둘 다 33% storage power threshold.<br />
          F3 finalized tipset은 revert 불가 — 경제 공격 인센티브 감소.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "별도 layer"로 F3 설계했나</strong> — 점진적 rollout.<br />
          EC 재작성 = risky + 시간 소요.<br />
          F3 layer = 기존 network 영향 최소 + 점진 enforcement.<br />
          backward compat = Ethereum의 Casper FFG 접근과 유사.
        </p>
      </div>
    </section>
  );
}
