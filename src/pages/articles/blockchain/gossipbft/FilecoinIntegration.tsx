import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { ec: '#f59e0b', f3: '#6366f1', ok: '#10b981' };

function IntegrationViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">EC + F3 통합 구조</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <ModuleBox x={20} y={10} w={120} h={35}
          label="EC (블록 생산)" sub="30초/에폭" color={C.ec} />
        <motion.line x1={140} y1={27} x2={170} y2={27}
          stroke={C.ok} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 }} />
        <ModuleBox x={175} y={10} w={120} h={35}
          label="F3 (확정)" sub="수 분" color={C.f3} />
        <motion.line x1={295} y1={27} x2={320} y2={27}
          stroke={C.ok} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.4 }} />
        <ModuleBox x={325} y={10} w={80} h={35}
          label="확정 체인" sub="되돌릴 수 없음" color={C.ok} />
        <motion.text x={210} y={70} textAnchor="middle" fontSize={11}
          fill={C.f3} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          💡 EC가 생산한 tipset을 F3가 확정 → 확정 이전 체인은 reorg 가능
        </motion.text>
      </svg>
    </div>
  );
}

export default function FilecoinIntegration() {
  return (
    <section id="filecoin-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin 통합</h2>
      <IntegrationViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          EC는 기존대로 30초마다 tipset 생산 (변경 없음).<br />
          F3는 EC 생산 tipset 중 <strong>2/3+ power 동의한 것 확정</strong>.<br />
          확정 이전 체인 reorg 불가 → 빠른 확정성 달성.
        </p>

        {/* ── EC + F3 통합 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EC + F3 통합 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin 2-layer consensus:

// Layer 1: EC (Expected Consensus)
// - block production (30s per epoch)
// - storage power weighted leader election
// - probabilistic finality (~7.5h)
// - tipset structure
// - backward compat (모든 기존 node)

// Layer 2: F3 (Fast Finality via GossiPBFT)
// - finalization layer
// - 4-phase voting
// - 2/3+ power threshold
// - EC tipset 중 finalized 선택
// - ~2-5 minutes finality

// 상호 작용:
// EC produces: t1, t2, t3, t4, ...
// F3 finalizes: t1 → (2 min later)
//               t2 → (2 min later)
//               ...
//
// Latency:
// - EC: 30s per tipset
// - F3: 2-5 min per finalization
// - catch-up: batch finalization possible

// Rollback rules:
// - finalized tipset: CANNOT rollback
// - unfinalized tipset: MAY rollback (EC reorg)
// - finalization은 one-way

// Cross-chain use:
// - finalized tipset만 trust
// - bridge contracts: wait for F3
// - ~2 min bridge confirmation
// - vs 7.5h EC finality: 100x faster

// Backward compatibility:
// - 기존 node는 EC만 실행 가능
// - upgrade node는 EC + F3
// - gradual rollout
// - consensus 변경 없음

// Deployment phases (2024-2025):
// Phase 1: testnet
// Phase 2: mainnet shadow (실행 but not enforced)
// Phase 3: mainnet active
// Phase 4: cross-chain bridges integrate

// Storage provider 참여:
// - opt-in F3 voting
// - power 비례 vote weight
// - gas 보상 (future)
// - 기존 mining 유지`}
        </pre>
        <p className="leading-7">
          EC + F3: <strong>EC가 생산, F3가 확정</strong>.<br />
          finalized tipset은 revert 불가.<br />
          cross-chain: 7.5h → 2-5min (100x faster).
        </p>

        {/* ── F3 영향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">F3의 Filecoin 생태계 영향</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// F3 영향:

// 1. Cross-chain bridges:
//    - 기존: 7.5시간 대기 → 2분
//    - Axelar, Wormhole 등 bridge
//    - FIL/ETH atomic swaps
//    - FVM (Filecoin Virtual Machine) DeFi
//
// 2. DeFi:
//    - Filecoin DeFi 가능
//    - FVM (EVM compat) + fast finality
//    - lending, DEX, stablecoin
//    - composability 달성
//
// 3. Data economy:
//    - payments 확정 빨라짐
//    - provider-client 거래 신뢰도
//    - deal finalization instant
//
// 4. Light clients:
//    - finality proofs 빠름
//    - mobile wallets 가능
//    - simplified SPV

// 5. Indexers / Explorers:
//    - 확정된 state 빠르게 반영
//    - real-time analytics
//    - better UX

// 도전과제:
//
// 1. Byzantine storage power:
//    - 33% power 공격 어려움
//    - storage cost high
//    - economic security 강함
//
// 2. Adoption:
//    - validators opt-in
//    - 초기 low participation
//    - incentives 필요
//
// 3. Complexity:
//    - 2-layer consensus
//    - upgrade coordination
//    - backward compat 유지

// 기대 효과 (2025-):
// - Filecoin L2 가능
// - Cross-chain FIL 이동 빠름
// - DeFi TVL 증가
// - 기업 adoption (data + fast finality)

// Protocol Labs 투자:
// - 연구 (2022-2024)
// - TLA+ verification
// - implementation (Go)
// - security audit
// - phased rollout

// 다른 chain 비교:
// - Ethereum: Casper FFG (~13 min finality)
// - Cosmos: Tendermint (~6s instant)
// - Polkadot: GRANDPA (~1 min)
// - Filecoin: EC + F3 (~2-5 min)

// F3는 PBFT-inspired but gossip-based:
// - unique design
// - storage power native
// - Filecoin 특성 최적화`}
        </pre>
        <p className="leading-7">
          F3 영향: <strong>cross-chain, DeFi, data economy 활성화</strong>.<br />
          7.5h → 2-5min finality → bridge/DeFi 가능.<br />
          2024-2025 phased rollout.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 F3는 EC 대체 안 하고 layering인가</strong> — backward compatibility.<br />
          EC: 3+ 년간 production, 검증된 코드.<br />
          EC 대체 = 대대적 upgrade, 복잡도.<br />
          F3 layering = 점진적 + 안전 + existing node 호환.<br />
          blockchain upgrade의 pragmatic 접근.
        </p>
      </div>
    </section>
  );
}
