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
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Snowball State &amp; Parameters</p>
            <p className="text-sm">
              노드별 상태: <code>pref</code> (current preference), <code>consecutive</code> (연속 동일 라운드 수), <code>confidence</code> (누적 카운터 per value), <code>decided</code> (bool).<br />
              Parameters: <code>k</code>, <code>alpha</code>, <code>beta</code> (Snowflake와 동일)
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">매 라운드 동작</p>
            <ol className="text-sm list-decimal list-inside space-y-1">
              <li>k개 random nodes 샘플링 → 각 preference 질의</li>
              <li><code>count_0</code>/<code>count_1</code> 집계 → <code>&ge; alpha</code>인 쪽이 winner</li>
              <li>winner 있으면: <code>confidence[winner] += 1</code> (누적), confidence 높은 쪽으로 <code>pref</code> 갱신</li>
              <li>winner가 직전과 같으면 <code>consecutive += 1</code>, 다르면 reset to 1</li>
              <li><code>consecutive &ge; beta</code> → <code>decided = True</code></li>
            </ol>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">핵심 차이 (vs Snowflake)</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Confidence counter 누적</p>
                <p className="text-muted-foreground">선호는 confidence 높은 쪽 결정. consecutive는 decision gate 역할. noise에 robust</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Advantages</p>
                <p className="text-muted-foreground">persistent memory, Byzantine flip 어려움, 실제 수렴 빠름, metastability breaking 우수</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">예시 시나리오</p>
            <p className="text-sm text-muted-foreground">
              R1: Blue wins (Blue conf=1). R2: Red wins (Red conf=1 → switch). R3-R10: Blue wins (Blue conf=9, Red conf=1 → stay Blue). R11-R20: Blue consecutive → decide Blue
            </p>
          </div>
        </div>
        <p className="leading-7">
          Snowball: <strong>confidence counter 누적 + consecutive gate</strong>.<br />
          선호는 confidence 높은 쪽 — 일시 변동에 강함.<br />
          Byzantine "flip attack" 저항 강화.
        </p>

        {/* ── Avalanche vs Snowman ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Avalanche (DAG) vs Snowman (Chain)</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Avalanche (DAG) vs Snowman (Chain)</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Avalanche (DAG)</p>
                <p className="text-muted-foreground">TX = DAG vertex, multiple parents 참조, TX level Snowball, parallel 처리. X-Chain (exchange, UTXO), 4500+ TPS</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Snowman (Linear chain)</p>
                <p className="text-muted-foreground">block chain (Bitcoin/Ethereum 유사), block level Snowball, sequential. C-Chain (EVM, DeFi, DApp)</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">선택 기준</p>
            <p className="text-sm text-muted-foreground">
              EVM 호환: Snowman / UTXO + 고TPS: Avalanche DAG / simple ledger: Avalanche / complex logic: Snowman
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Mainnet 성능 &amp; Subnet</p>
            <p className="text-sm">
              X-Chain: 4500 TPS / C-Chain: 100-500 TPS (EVM bound) / P-Chain: low (governance) / Subnets: custom
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Subnet: independent chains, custom consensus, custom VMs (EVM, WASM 등), horizontal sharding으로 scaling
            </p>
          </div>
        </div>
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
