import { motion } from 'framer-motion';
import { ActionBox, ModuleBox } from '@/components/viz/boxes';

const C = { fast: '#10b981', consensus: '#6366f1' };

function FastPathViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Fast Path vs Consensus Path</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <ModuleBox x={20} y={10} w={100} h={32}
          label="소유 객체 TX" sub="단일 소유자" color={C.fast} />
        <motion.line x1={120} y1={26} x2={180} y2={26}
          stroke={C.fast} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 }} />
        <ActionBox x={185} y={10} w={90} h={32}
          label="Fast Path" sub="합의 우회" color={C.fast} />
        <motion.line x1={275} y1={26} x2={320} y2={26}
          stroke={C.fast} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.4 }} />
        <ModuleBox x={325} y={10} w={80} h={32}
          label="즉시 확정" sub="~100ms" color={C.fast} />

        <ModuleBox x={20} y={58} w={100} h={32}
          label="공유 객체 TX" sub="다수 접근" color={C.consensus} />
        <motion.line x1={120} y1={74} x2={180} y2={74}
          stroke={C.consensus} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 }} />
        <ActionBox x={185} y={58} w={90} h={32}
          label="Consensus" sub="순서 결정" color={C.consensus} />
        <motion.line x1={275} y1={74} x2={320} y2={74}
          stroke={C.consensus} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 }} />
        <ModuleBox x={325} y={58} w={80} h={32}
          label="2R 확정" sub="~390ms" color={C.consensus} />
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 Sui TX의 대부분은 소유 객체 → fast path로 처리
      </p>
    </div>
  );
}

export default function FastPath() {
  return (
    <section id="fast-path" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fast Path</h2>
      <FastPathViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Sui는 객체 모델 사용 — 소유 객체는 소유자만 수정 가능 → 충돌 없음.<br />
          충돌 없으면 순서 합의 불필요 → 즉시 실행 + 확정.<br />
          공유 객체(DEX, AMM 등)만 Mysticeti 합의 통과.
        </p>

        {/* ── Fast Path Protocol ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fast Path Protocol 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sui Fast Path (Owned Object TX):

// Step 1: TX Submission
// user signs TX referencing owned objects
// TX broadcasted to Sui validators

// Step 2: Validator Pre-check
// for each validator:
//     - check TX signature (owner)
//     - check object ownership (owner matches)
//     - check object version (not double-spent)
//     - if valid, sign TX
//     - return signature to user (or gateway)

// Step 3: Quorum Collection
// user (or gateway) collects 2f+1 signatures
// form TX Certificate:
// - TX + 2f+1 validator signatures
// - proves 2f+1 validators committed to this TX
// - irreversible (BFT safety)

// Step 4: Finality
// TX Certificate = "finalized"
// latency: 2 round-trips (user → validator → user)
// typical: ~100ms

// Step 5: Effects Broadcast
// validators execute TX
// update local state
// broadcast effects (optional)

// Why consensus not needed:
// - owned object = single owner
// - only owner signs TXs using this object
// - no concurrent modification
// - no ordering ambiguity
// - 2f+1 signature quorum = BFT safety

// Comparison:
// traditional BFT: consensus → ~400ms
// Sui Fast Path: quorum sig → ~100ms
// 4x faster

// Sui statistics (production):
// - 80-90% TXs = owned object only
// - 10-20% TXs = shared objects
// - average TX latency: ~150ms

// Double-spend prevention:
// - object version tracking
// - validator stores owned object state
// - signing checks version consistency
// - equivocation: slashable offense`}
        </pre>
        <p className="leading-7">
          Fast Path: <strong>2f+1 validator signatures → finality (no consensus)</strong>.<br />
          2 round-trips = ~100ms (4x faster than consensus).<br />
          double-spend: version tracking + equivocation slashing.
        </p>

        {/* ── Shared Object via Mysticeti ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Shared Objects via Mysticeti Consensus</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Shared Object TX flow (via Mysticeti):

// Step 1: TX Submission
// user signs TX referencing shared object(s)
// TX broadcasted to validators

// Step 2: Consensus Input
// validators include TX in their next block
// block broadcasted (uncertified DAG)
// DAG 성장

// Step 3: Mysticeti Commit
// - 3-round commit rule
// - anchor + references
// - entire causal history committed
// - TX gets a "consensus position" (order)

// Step 4: Ordered Execution
// validators execute TXs in consensus order
// state transitions applied
// shared object state updated

// Step 5: Effects
// execution results published
// TX finality after commit

// Latency:
// - DAG propagation: 1δ
// - 3 rounds commit: 3δ
// - execution: <10ms
// - total: ~390ms (WAN)

// Concurrency:
// - many shared TXs per block
// - ordered by consensus
// - executed sequentially (per shared object)
// - independent objects parallel

// 예시: DEX swap
// - shared object: liquidity pool
// - multiple users trading
// - 모든 TX Mysticeti consensus
// - deterministic order
// - atomic execution

// 비교 (Mysticeti vs Ethereum):
// Ethereum:
// - every TX consensus (12s)
// - no separation owned/shared
// - global ordering always
//
// Sui:
// - owned TXs: 100ms (fast path)
// - shared TXs: 390ms (Mysticeti)
// - avg: 150ms
// - 80x faster average`}
        </pre>
        <p className="leading-7">
          Shared objects: <strong>Mysticeti consensus → 3-round commit → 390ms</strong>.<br />
          ordered execution per shared object.<br />
          Sui 평균 150ms (80% fast + 20% consensus).
        </p>

        {/* ── Fast Path Impact ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fast Path의 실무 임팩트</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Fast Path의 실무 혜택:

// 1. Lower average latency:
//    - 80% TXs: 100ms
//    - 20% TXs: 390ms
//    - weighted avg: 158ms
//    - vs Ethereum 12s: 76x improvement

// 2. Higher throughput:
//    - Fast path TXs: no consensus bottleneck
//    - parallel execution (different owners)
//    - 100K+ TPS achievable

// 3. Better UX:
//    - wallet TX: ~100ms confirmation
//    - NFT transfer: instant
//    - coin payment: 근실시간

// 4. Scalability:
//    - consensus bottleneck 감소
//    - owned objects 무제한 scaling
//    - shared objects 병목 (limited)

// 5. Gas efficiency:
//    - fast path TXs: cheaper (no consensus cost)
//    - shared TXs: standard cost
//    - user cost 감소

// Use cases:
// - Fast Path:
//   - Coin transfer
//   - NFT mint/transfer
//   - Individual game state
//   - Wallet operations
//
// - Consensus:
//   - DEX trades (shared pool)
//   - Lending protocols
//   - DAO voting
//   - Auction systems

// Architectural implication:
// - dApp developers choose object type
// - owned = fast + cheap
// - shared = ordered + consensus
// - design-time optimization

// 비교:
// Ethereum: single lane (consensus only)
// Sui: dual lane (fast + consensus)
// = parallelism by object model

// Sui 2024 stats:
// - 160K+ TPS
// - 390ms e2e (shared)
// - 100ms (owned)
// - 100+ validators`}
        </pre>
        <p className="leading-7">
          Fast Path 혜택: <strong>avg 158ms (Ethereum 12s의 1/76)</strong>.<br />
          wallet, NFT, coin 등 대부분 TX fast path.<br />
          DEX, lending 등만 consensus 필요.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Ethereum은 Fast Path 못 쓰나</strong> — object model 부재.<br />
          Ethereum: account-based, global state, 모든 TX ordering 필요.<br />
          Sui: object-based, owned objects는 독립 → fast path 가능.<br />
          language + VM 레벨 차이 (Solidity vs Move).
        </p>
      </div>
    </section>
  );
}
