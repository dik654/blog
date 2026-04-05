import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { blue: '#0ea5e9', red: '#ef4444' };

function SnowballViz() {
  const counters = [
    { label: 'Blue 신뢰도', value: 7, max: 10, color: C.blue },
    { label: 'Red 신뢰도', value: 3, max: 10, color: C.red },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Snowball: 누적 신뢰도 카운터</p>
      <svg viewBox="0 0 420 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {counters.map((c, i) => (
          <motion.g key={c.label} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.2 }}>
            <text x={30} y={25 + i * 35} fontSize={10} fontWeight={600} fill={c.color}>{c.label}</text>
            <rect x={140} y={13 + i * 35} width={200} height={16} rx={4}
              fill="var(--border)" opacity={0.3} />
            <motion.rect x={140} y={13 + i * 35} width={0} height={16} rx={4}
              fill={`${c.color}40`} stroke={c.color} strokeWidth={1}
              animate={{ width: (c.value / c.max) * 200 }}
              transition={{ delay: i * 0.2, duration: 0.5 }} />
            <motion.text x={145 + (c.value / c.max) * 200} y={25 + i * 35}
              fontSize={10} fill={c.color}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.2 + 0.5 }}>
              {c.value}
            </motion.text>
          </motion.g>
        ))}
        <motion.text x={210} y={72} textAnchor="middle" fontSize={11}
          fill={C.blue} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          💡 Blue(7) {'>'} Red(3) → Blue가 최종 선택
        </motion.text>
      </svg>
    </div>
  );
}

export default function Snowball() {
  return (
    <section id="snowball" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Snowball: 신뢰도 카운터</h2>
      <SnowballViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Snowball = <strong>Snowflake + 누적 confidence counters</strong>.<br />
          매 라운드 α+ 응답 → 해당 값 카운터 증가.<br />
          일시적 선호 변화에도 누적 카운터 유지.
        </p>

        {/* ── Snowball Algorithm ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Snowball Algorithm 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Snowball Algorithm:

// State per node:
// - pref: current preference
// - consecutive: consecutive same rounds (Snowflake-like)
// - confidence: {0: cnt_0, 1: cnt_1}  # cumulative
// - decided: bool

// Parameters:
// - k, α, β as in Snowflake

fn snowball_round(self):
    sample = random.sample(all_nodes, k)
    responses = [n.query_preference() for n in sample]

    count_0 = sum(r == 0 for r in responses)
    count_1 = sum(r == 1 for r in responses)

    winner = None
    if count_0 >= alpha:
        winner = 0
    elif count_1 >= alpha:
        winner = 1

    if winner is not None:
        # Update cumulative confidence
        self.confidence[winner] += 1

        # Update preference if confidence higher
        if self.confidence[winner] > self.confidence[self.pref]:
            self.pref = winner

        # Consecutive logic (like Snowflake)
        if winner == self.last_winner:
            self.consecutive += 1
        else:
            self.consecutive = 1
            self.last_winner = winner

        # Decision
        if self.consecutive >= beta:
            self.decided = True
            return self.pref
    else:
        self.consecutive = 0

// 핵심 차이 (vs Snowflake):
// - confidence counter 누적
// - 선호는 confidence 높은 쪽
// - consecutive는 decision gate
// - robust to noise

// Scenario:
// R1: Blue wins (Blue conf=1)
// R2: Red wins (Red conf=1, but Blue still 1=1 → no change yet)
//     wait, Blue conf > Red conf 아님 → switch to Red
// R3-R10: Blue wins (Blue conf=9, Red conf=1)
//     → stay on Blue
// R11-R20: Blue consecutively wins
//     → decide on Blue

// Advantages over Snowflake:
// - persistent memory (confidence)
// - harder for Byzantine to flip
// - converges faster in practice
// - better metastability breaking`}
        </pre>
        <p className="leading-7">
          Snowball: <strong>confidence counter 누적 + consecutive gate</strong>.<br />
          선호는 confidence 높은 쪽 — 일시 변동에 강함.<br />
          Byzantine "flip attack" 저항 강화.
        </p>

        {/* ── Avalanche vs Snowman ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Avalanche (DAG) vs Snowman (Chain)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Avalanche (DAG version):
//
// - TX = DAG vertex
// - each TX references multiple parents
// - Snowball on TX level
// - multiple TXs processed parallel
// - complex conflict resolution
//
// Use case: Avalanche X-Chain (exchange)
// - high throughput
// - UTXO-based
// - 4500+ TPS

// Snowman (Linear chain):
//
// - chain of blocks (like Bitcoin/Ethereum)
// - Snowball on block level
// - sequential
// - simpler for smart contracts
// - EVM compatible
//
// Use case: Avalanche C-Chain (contracts)
// - EVM execution
// - DeFi applications
// - DApp deployment

// Why Snowman for C-Chain?
// - EVM expects linear blocks
// - smart contract execution sequential
// - simpler integration
// - 4500 TPS still

// Why Avalanche for X-Chain?
// - UTXO parallelizable
// - DAG natural fit
// - higher throughput
// - simple TXs (transfers)

// 선택 기준:
// - EVM compat: Snowman
// - UTXO + TPS: Avalanche DAG
// - simple ledger: Avalanche
// - complex logic: Snowman

// 성능 (mainnet):
// X-Chain: 4500 TPS
// C-Chain: 100-500 TPS (EVM bound)
// P-Chain: low (governance)
// Subnets: custom

// Subnet architecture:
// - independent chains
// - custom consensus
// - custom VMs (EVM, WASM, etc.)
// - scaling via horizontal sharding`}
        </pre>
        <p className="leading-7">
          Avalanche (DAG): TX level, X-Chain, 4500 TPS.<br />
          Snowman (Chain): block level, C-Chain (EVM).<br />
          Subnet architecture로 horizontal scaling.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Snowball이 BFT보다 좋은 경우가 있나</strong> — scalability.<br />
          BFT: 수백 validators 한계.<br />
          Snowball: 수천+ validators (O(k log n) 통신).<br />
          단, safety는 probabilistic → 용도별 선택.<br />
          금융: BFT, 일반 payment: Snowball OK.
        </p>
      </div>
    </section>
  );
}
