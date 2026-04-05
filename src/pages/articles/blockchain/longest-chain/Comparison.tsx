import { motion } from 'framer-motion';

const C = { lc: '#10b981', bft: '#6366f1' };

function CompareViz() {
  const rows = [
    { metric: '최종성', lc: '확률적 (k confirm)', bft: '결정론적 (즉시)' },
    { metric: '참여자 수', lc: '무제한', bft: '수십~수백' },
    { metric: '네트워크 파티션', lc: '체인 계속 성장', bft: '합의 정지' },
    { metric: '안전성 위협', lc: '51% 공격', bft: '1/3+ 악의적' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">최장 체인 vs BFT</p>
      <svg viewBox="0 0 420 130" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={80} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">항목</text>
        <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.lc}>최장 체인</text>
        <text x={370} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bft}>BFT</text>
        <line x1={10} y1={22} x2={410} y2={22} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.metric} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <text x={80} y={40 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.metric}</text>
            <text x={240} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.lc}>{r.lc}</text>
            <text x={370} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.bft}>{r.bft}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BFT와의 비교</h2>
      <CompareViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          두 합의 철학의 <strong>근본적 차이</strong>.<br />
          Nakamoto: liveness + open + probabilistic. BFT: safety + permissioned + deterministic.<br />
          현대 블록체인은 둘 결합 추세.
        </p>

        {/* ── 설계 철학 차이 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">설계 철학 차이</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Nakamoto Longest Chain:
//
// 철학: "정직 다수 + 시간 = 합의"
// - 사전 멤버십 없음
// - 누구나 계산력으로 참여
// - block propose = 해시 성공
// - fork는 시간이 해결
//
// 장점:
// - 완전 decentralized (permissionless)
// - Sybil 저항 (경제적 비용)
// - 간단한 fork choice
// - Censorship resistance 강함
// - Network partition에 강함
//
// 단점:
// - 긴 finality 시간
// - 에너지 비효율 (PoW)
// - 낮은 TPS (Bitcoin 7 TPS)
// - Probabilistic guarantee
// - 51% 공격 가능 (해시파워 집중)

// BFT (PBFT, HotStuff, Tendermint):
//
// 철학: "투표 + 즉시 = 합의"
// - 사전 validator 등록 필요
// - leader 제안, quorum 투표
// - 2/3+ 동의 시 commit
// - view change로 leader 교체
//
// 장점:
// - 즉시 finality (초 단위)
// - 에너지 효율
// - 높은 TPS (10,000+)
// - Deterministic guarantee
// - 검증 간단 (서명)
//
// 단점:
// - validator 제한 (수백)
// - centralization 경향
// - partition에 취약 (halt)
// - 1/3+ 악의적이면 safety 깨짐
// - view change 복잡

// 선택 기준:
// - 공개·안전·느림: Bitcoin (longest chain)
// - 허가·중앙·빠름: Hyperledger (PBFT)
// - 공개·빠름·복잡: Ethereum 2.0 (hybrid)
// - 공개·매우빠름: Sui (DAG-BFT)`}
        </pre>
        <p className="leading-7">
          Nakamoto = <strong>decentralized + slow</strong>, BFT = <strong>centralized + fast</strong>.<br />
          Trade-off의 양극 — 블록체인 사용처에 따라 선택.<br />
          Ethereum 2.0이 둘 결합한 대표 사례.
        </p>

        {/* ── 공격 모델 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">공격 모델 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Nakamoto 공격:
//
// 1. 51% 공격 (majority attack)
//    - 해시파워 > 50% 필요
//    - double-spend 가능
//    - reorg 유도
//    - 비용: 대규모 ASIC + 전력
//
// 2. Selfish mining
//    - 25%+ 해시파워로 이득
//    - block 감추기 전략
//    - 정직 miner 고아 유발
//
// 3. Eclipse attack
//    - peer 고립
//    - 가짜 view 주입
//    - small-budget 가능
//
// 4. Sybil attack
//    - PoW로 완화 (비용 부과)
//    - but 네트워크 계층엔 취약

// BFT 공격:
//
// 1. 1/3+ Byzantine
//    - safety 파괴
//    - 두 conflicting block finalize
//    - slashing으로 경제적 억제
//
// 2. Long-range attack (PoS)
//    - 과거 validator key로 alt chain
//    - weak subjectivity로 완화
//    - 정기 checkpoint 필요
//
// 3. Nothing-at-stake
//    - validator가 여러 체인 지원
//    - slashing으로 해결
//
// 4. Denial of Service
//    - leader 공격
//    - view change 강제
//    - liveness 파괴 (safety는 유지)

// 공통 공격:
// - Bribery (뇌물)
// - Collusion (담합)
// - Network partition
// - Smart contract bug

// 경제적 보안:
// - Bitcoin: 해시파워 비용
// - Ethereum PoS: slashing stake
// - 둘 다 경제적 공격 비용 > 이익 설계`}
        </pre>
        <p className="leading-7">
          공격 모델도 상반 — Nakamoto는 <strong>해시파워</strong>, BFT는 <strong>stake 지분</strong>.<br />
          51% vs 33%+ 임계값.<br />
          slashing (stake 몰수)가 PoS의 핵심 억제 메커니즘.
        </p>

        {/* ── 현대 블록체인 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">현대 블록체인의 선택</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 각 블록체인의 합의 알고리즘 선택:

// Pure Longest Chain (Nakamoto):
// - Bitcoin, Litecoin, Dogecoin
// - Bitcoin Cash, Bitcoin SV
// - PoW + longest chain

// Hybrid (longest chain + BFT finality):
// - Ethereum 2.0: LMD-GHOST + Casper FFG
// - Filecoin: EC + F3 (GossiPBFT)
// - Polkadot: BABE + GRANDPA
// - Cardano: Ouroboros Praos (확률적)

// Pure BFT:
// - Cosmos (Tendermint/CometBFT)
// - Near Protocol (Doomslug BFT)
// - Algorand (BFT + VRF)
// - BNB Chain (PBFT 변형)

// DAG-based BFT:
// - Sui (Mysticeti)
// - Aptos (Jolteon)
// - IOTA (Coordicide)
// - Fantom (Lachesis)

// VRF-based (random leader):
// - Algorand: VRF per round
// - Cardano: VRF for slot
// - Dfinity: VRF committee

// Avalanche (metastable):
// - Avalanche (Snowman)
// - probabilistic BFT

// 선택 기준 (2024 기준):
// 1. TPS 요구: 10K+ → DAG-BFT
// 2. Finality: instant → BFT/DAG
// 3. Decentralization: extreme → Nakamoto
// 4. Energy: green → PoS BFT
// 5. Validator 수: 1000+ → hybrid
// 6. Permissionless: yes → PoS BFT or PoW

// 트렌드:
// - PoW → PoS 대전환 (Ethereum 2022)
// - Longest chain → hybrid → DAG-BFT
// - 높은 TPS + instant finality가 표준
// - Bitcoin만 순수 Nakamoto 유지`}
        </pre>
        <p className="leading-7">
          트렌드: <strong>순수 Nakamoto → 하이브리드 → DAG-BFT</strong>.<br />
          TPS + instant finality 요구 증가.<br />
          Bitcoin만 Nakamoto 유지 — "store of value"로 특화.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Nakamoto가 BFT 넘어선 것</strong> — open membership.<br />
          BFT는 validator 리스트 고정, Nakamoto는 누구나 참여 가능.<br />
          이것이 Bitcoin의 혁신 — 중앙 등록 없는 전 세계적 합의.<br />
          현대 PoS BFT는 stake로 open membership + BFT safety 결합.
        </p>
      </div>
    </section>
  );
}
