import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { defi: '#6366f1', l1: '#10b981', storage: '#f59e0b', social: '#ef4444' };

function UseCaseViz() {
  const cases = [
    { use: 'DeFi / 결제', proto: 'BFT (즉시 확정)', color: C.defi },
    { use: '대규모 L1', proto: 'Avalanche / DAG', color: C.l1 },
    { use: '스토리지', proto: 'EC + F3', color: C.storage },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">용도별 권장 합의</p>
      <svg viewBox="0 0 420 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {cases.map((c, i) => (
          <motion.g key={c.use} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring' }}>
            <ModuleBox x={10 + i * 138} y={10} w={120} h={42}
              label={c.use} sub={c.proto} color={c.color} />
          </motion.g>
        ))}
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 은탄환은 없다 — 요구사항에 맞는 프로토콜 선택이 핵심
      </p>
    </div>
  );
}

export default function UseCases() {
  return (
    <section id="use-cases" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">용도별 선택 가이드</h2>
      <UseCaseViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          즉시 확정 필요 DeFi: <strong>Tendermint, HotStuff 계열 BFT</strong>.<br />
          대규모 노드 필요 L1: <strong>Avalanche, DAG 기반</strong>.<br />
          스토리지 체인: EC + F3 (블록 생산 + 빠른 확정).<br />
          현대 블록체인은 여러 합의 결합 하이브리드로 진화 중.
        </p>

        {/* ── Use Case 세부 가이드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Use Case별 프로토콜 선택 가이드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Use Case별 권장 합의:

// 1. 고액 금융 거래 (Settlement layer):
//    - 요구: instant finality, deterministic safety
//    - 추천: Tendermint, HotStuff
//    - 예: Cosmos Hub, Osmosis, dYdX
//    - 이유: rollback 불가 + 즉시 확정
//
// 2. 범용 DeFi (DEX, lending):
//    - 요구: 중간 latency, 높은 TPS
//    - 추천: Jolteon, Mysticeti
//    - 예: Aptos, Sui
//    - 이유: high throughput + fast finality
//
// 3. 게이밍 & 실시간 앱:
//    - 요구: sub-second latency
//    - 추천: Mysticeti, Autobahn, Solana
//    - 예: Sui gaming ecosystem
//    - 이유: 사용자 경험
//
// 4. 대규모 L1 (open chain):
//    - 요구: 많은 validators, decentralization
//    - 추천: Avalanche, Ethereum
//    - 예: Avalanche, Ethereum 2.0
//    - 이유: 탈중앙화 강화
//
// 5. 스토리지 / 파일 시스템:
//    - 요구: storage power based, 빠른 settlement
//    - 추천: EC + F3 (GossiPBFT)
//    - 예: Filecoin
//    - 이유: storage-specific optimization
//
// 6. Payment network:
//    - 요구: global reach, censorship resistance
//    - 추천: Bitcoin (Nakamoto)
//    - 예: Bitcoin Lightning
//    - 이유: censorship resistance
//
// 7. Permissioned enterprise:
//    - 요구: known validators, high performance
//    - 추천: PBFT, IBFT
//    - 예: Hyperledger Fabric
//    - 이유: controlled environment
//
// 8. Cross-chain bridges:
//    - 요구: deterministic finality
//    - 추천: Tendermint, HotStuff
//    - 예: Cosmos IBC, Wormhole
//    - 이유: bridge safety
//
// 9. NFT / identity:
//    - 요구: low cost, moderate speed
//    - 추천: Jolteon, Snowman
//    - 예: Aptos NFTs, Avalanche
//    - 이유: cost + UX balance
//
// 10. Privacy chains:
//     - 요구: validator anonymity
//     - 추천: MPC + BFT hybrid
//     - 예: Penumbra, Aleo
//     - 이유: privacy + consensus`}
        </pre>
        <p className="leading-7">
          용도 10가지 분류: <strong>각 use case별 최적 프로토콜</strong>.<br />
          금융 = BFT, 게이밍 = DAG, permissionless = Nakamoto.<br />
          "은탄환 없음" — 요구사항 매칭.
        </p>

        {/* ── 선택 의사결정 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">선택 의사결정 Tree</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 합의 프로토콜 선택 의사결정 tree:

Q1: Open membership 필요?
    ├─ YES → Q2
    └─ NO → PBFT, IBFT (permissioned)

Q2: Instant finality 필요?
    ├─ YES → Q3
    └─ NO → Nakamoto (Bitcoin), Avalanche

Q3: Validator 수 얼마?
    ├─ 10-100 → Q4
    ├─ 100-500 → DAG-BFT (Mysticeti, Bullshark)
    └─ 1000+ → Avalanche, Ethereum committee sampling

Q4: Throughput 요구?
    ├─ 10K TPS: Tendermint, HotStuff
    ├─ 50K TPS: Jolteon, HotStuff-2
    └─ 100K+ TPS: Mysticeti, Autobahn

Q5: Async-safe 필요?
    ├─ YES → Ditto, Tusk
    └─ NO → Bullshark, Mysticeti

Q6: Object model 있나?
    ├─ YES → Sui (Mysticeti + Fast Path)
    └─ NO → Aptos (DiemBFT v4)

Q7: Storage power based?
    ├─ YES → F3 (GossiPBFT)
    └─ NO → stake-based

// 실제 예시 적용:
//
// "나는 cosmos-style appchain을 만들고 싶다":
// Q1: Open → YES
// Q2: Instant → YES (즉시 finality)
// Q3: Validators ~100 → Q4
// Q4: ~10K TPS → Tendermint/CometBFT ✓
//
// "나는 고성능 L1 (100K+ TPS)를 만들고 싶다":
// Q1: Open → YES
// Q2: Instant → YES
// Q3: 100-500 → DAG-BFT
// Q4: 100K+ → Mysticeti ✓
// Q6: Object model 있나 → YES/NO 선택
//
// "나는 decentralized storage chain":
// Q7: Storage power → F3 ✓

// 2025-2026 트렌드:
// - DAG-BFT 주류화
// - hybrid consensus (Autobahn 스타일)
// - async-safe 일반화
// - privacy-preserving 합의
// - cross-chain shared security`}
        </pre>
        <p className="leading-7">
          선택 tree: <strong>membership → finality → validators → throughput → model</strong>.<br />
          실제 사례별 추천: Cosmos = Tendermint, Sui = Mysticeti, Filecoin = F3.<br />
          2025+ 트렌드: DAG-BFT + hybrid + async-safe.
        </p>

        {/* ── 미래 방향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">합의 프로토콜의 미래 (2025-2030)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 합의 프로토콜 미래:

// 1. DAG-BFT 주류화:
//    - Mysticeti, Autobahn 계승
//    - 1M+ TPS 목표
//    - low latency (< 100ms)
//
// 2. Async-safe 일반화:
//    - DDoS 저항 필수
//    - HoneyBadger 계열 부활
//    - randomized common coin
//
// 3. Shared security:
//    - Interchain (Cosmos)
//    - EigenLayer (Ethereum)
//    - validator set sharing
//    - multi-chain consensus
//
// 4. Privacy-preserving BFT:
//    - ZK integration
//    - validator anonymity
//    - confidential TXs
//    - Penumbra, Aleo, Namada
//
// 5. MEV-resistant ordering:
//    - fair ordering (Themis)
//    - encrypted mempool (Shutter)
//    - proposer-builder separation (PBS)
//
// 6. Committee sampling:
//    - 1M+ validators
//    - VRF-based committee
//    - Ethereum 2.0 model
//    - rotating participation
//
// 7. Consensus as a service:
//    - Celestia (DA layer)
//    - Eigenlayer AVS
//    - modular blockchain
//    - separate consensus from execution
//
// 8. Quantum-resistant:
//    - post-quantum signatures
//    - lattice-based crypto
//    - 2030+ 예상

// 연구 활발 기관:
// - MystenLabs (Sui, Mysticeti)
// - Aptos Labs (Jolteon)
// - Protocol Labs (Filecoin F3)
// - Ethereum Foundation (Casper, single-slot)
// - UC Berkeley (Autobahn)
// - Stanford (HotStuff family)
// - VMware Research

// 2030 예측:
// - consensus = commodity
// - any chain can pick protocol
// - modular architecture
// - 1M+ TPS standard
// - sub-100ms latency
// - async-safe default`}
        </pre>
        <p className="leading-7">
          미래: <strong>DAG-BFT + async-safe + privacy + modular</strong>.<br />
          2030: 1M+ TPS, sub-100ms latency 표준 예상.<br />
          consensus가 "commodity" — modular blockchain 시대.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 합의 프로토콜 선택의 최종 원칙</strong> — 완벽 없음.<br />
          Trade-off는 blockchain의 본질 (Scalability Trilemma).<br />
          "내 앱이 무엇 포기할 수 있나?" 가 선택 출발점.<br />
          금융: latency 포기 안 됨, 게이밍: safety 일부 OK, 탈중앙: TPS 포기.
        </p>
      </div>
    </section>
  );
}
