import { motion } from 'framer-motion';

const C = { avax: '#ef4444', bft: '#6366f1' };

function CompareViz() {
  const rows = [
    { metric: '합의 유형', avax: '확률적', bft: '결정론적' },
    { metric: '통신 복잡도', avax: 'O(k log n)', bft: 'O(n) ~ O(n²)' },
    { metric: '안전성', avax: '확률적 보장', bft: '결정론적 보장' },
    { metric: '노드 수 확장', avax: '수천+ 가능', bft: '수백 한계' },
    { metric: '최종성', avax: '확률적', bft: '즉시(BFT)' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Avalanche vs 결정론적 BFT</p>
      <svg viewBox="0 0 420 150" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={80} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">항목</text>
        <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.avax}>Avalanche</text>
        <text x={365} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bft}>BFT</text>
        <line x1={10} y1={22} x2={410} y2={22} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.metric} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <text x={80} y={40 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.metric}</text>
            <text x={240} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.avax}>{r.avax}</text>
            <text x={365} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.bft}>{r.bft}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비교 분석</h2>
      <CompareViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Avalanche: <strong>확장성 압도적</strong> — 수천 노드 문제없음.<br />
          trade-off: 안전성이 확률적.<br />
          금융 결제 = BFT, 대규모 P2P = Avalanche 적합.
        </p>

        {/* ── Deep Comparison ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Avalanche vs Classical BFT 심층 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Avalanche vs BFT:

// Safety Model:
// Avalanche: probabilistic
// - P(violation) ≈ e^(-α*β) * ...
// - 10^-10 typical
// - not zero, but astronomically small
//
// BFT (PBFT, HotStuff):
// - deterministic
// - P(violation) = 0 (if f<n/3)
// - absolute guarantee
// - assumes f<n/3 (not always true)

// Communication:
// Avalanche: O(k log n)
// - k=20 sample size
// - per node per round
// - total: O(n * k log n)
//
// BFT: O(n²) all-to-all or O(n) linear
// - all validators exchange
// - quadratic scaling

// Latency:
// Avalanche: β rounds × RTT
// - ~1 second (20 rounds × 50ms)
// - no immediate finality
//
// BFT: O(1) rounds
// - 3-4 round trips
// - 200-500ms (partial sync)

// Throughput:
// Avalanche: 4500 TPS (X-Chain)
// BFT: 10K-100K+ TPS (latest)
// BFT wins at top end

// Scalability (validators):
// Avalanche: thousands
// BFT: hundreds
// Avalanche wins

// Byzantine tolerance:
// Avalanche: up to n/2 (with tuning)
// BFT: n/3 strict
// Avalanche more tolerant

// Fork resistance:
// Avalanche: metastable → no forks
// BFT: absolute no-fork
// Both safe (different mechanism)

// Energy:
// Avalanche: low (no PoW)
// BFT: low
// 둘 다 efficient

// 적합 용도:
// Avalanche (probabilistic + scalable):
// - social networks
// - gaming
// - low-stake payments
// - high validator count
//
// BFT (deterministic + bounded):
// - financial settlement
// - cross-border transfers
// - regulatory compliance
// - institutional use`}
        </pre>
        <p className="leading-7">
          Avalanche 강점: <strong>scalability (1000+ validators)</strong>.<br />
          BFT 강점: <strong>deterministic safety</strong>.<br />
          용도별 선택: 금융 = BFT, P2P = Avalanche.
        </p>

        {/* ── Avalanche 실무 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Avalanche의 실무 사용</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Avalanche blockchain (2020-현재):
//
// 3-chain architecture:
// 1. X-Chain (eXchange):
//    - Avalanche DAG consensus
//    - UTXO-based
//    - asset creation/transfer
//    - 4500+ TPS
//
// 2. C-Chain (Contract):
//    - Snowman consensus
//    - EVM compatible
//    - smart contracts
//    - DeFi ecosystem
//
// 3. P-Chain (Platform):
//    - Snowman consensus
//    - staking, validators
//    - subnet management

// Subnet architecture:
// - 독립 chain
// - custom consensus
// - custom VM
// - permissioned or permissionless
// - horizontal sharding

// Subnet 예:
// - DeFi Kingdoms (gaming)
// - Shrapnel (gaming)
// - Dexalot (exchange)
// - enterprise subnets

// Avalanche Performance (2024):
// - ~1500 validators (mainnet)
// - 4500 TPS (X-Chain)
// - 100-500 TPS (C-Chain, EVM bound)
// - subsecond finality
// - $250M+ TVL

// Tokenomics:
// - AVAX: native token
// - validators: 2000 AVAX stake minimum
// - annual reward: ~7-11% APR
// - burned fees (deflationary)

// 경쟁 포지션:
// - vs Ethereum: higher TPS, lower fees
// - vs Solana: better decentralization
// - vs Cosmos: similar modular approach
// - vs Sui/Aptos: different consensus family

// Avalanche 장점:
// - mature ecosystem
// - EVM compatibility
// - subnet flexibility
// - multi-chain architecture

// 한계:
// - probabilistic finality 우려 (일부)
// - validator 요구 높음 ($70K+ stake)
// - ecosystem 작음 (Ethereum 대비)

// 미래:
// - Avalanche 9000 (2024-2025)
// - subnet fees 감소
// - interchain messaging
// - L1 chains 분사`}
        </pre>
        <p className="leading-7">
          Avalanche: <strong>3-chain + subnet architecture</strong>.<br />
          X-Chain 4500 TPS, C-Chain EVM 호환, P-Chain 관리.<br />
          1500 validators — BFT 대비 5-10x 확장.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Avalanche가 "probabilistic" 불구 성공했나</strong> — 현실적 safety margin.<br />
          10^-10 confidence level = 실제로 불가능.<br />
          BFT의 "절대" safety도 f&lt;n/3 가정 필요.<br />
          Avalanche는 다른 trade-off: scalability 우선, safety 충분.
        </p>
      </div>
    </section>
  );
}
