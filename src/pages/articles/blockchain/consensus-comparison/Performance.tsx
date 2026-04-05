import { motion } from 'framer-motion';

const C = {
  pbft: '#ef4444', hs: '#6366f1', tm: '#10b981',
  nb: '#0ea5e9', avax: '#f59e0b', nak: '#8b5cf6',
};

function PerfTable() {
  const rows = [
    { proto: 'PBFT', msg: 'O(n²)', latency: '2 RTT', tps: '중', color: C.pbft },
    { proto: 'HotStuff', msg: 'O(n)', latency: '3 RTT', tps: '중', color: C.hs },
    { proto: 'Tendermint', msg: 'O(n²)', latency: '2 RTT', tps: '중', color: C.tm },
    { proto: 'Bullshark', msg: 'O(n)', latency: '2-3 RTT', tps: '높음', color: C.nb },
    { proto: 'Avalanche', msg: 'O(k log n)', latency: '~1s', tps: '높음', color: C.avax },
    { proto: 'Nakamoto', msg: 'O(n)', latency: '~60분', tps: '낮음', color: C.nak },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">성능 비교표</p>
      <svg viewBox="0 0 420 180" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={55} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">프로토콜</text>
        <text x={155} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">통신</text>
        <text x={255} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">지연</text>
        <text x={355} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">처리량</text>
        <line x1={10} y1={20} x2={410} y2={20} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.proto} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
            <text x={55} y={36 + i * 24} textAnchor="middle" fontSize={10} fontWeight={600} fill={r.color}>{r.proto}</text>
            <text x={155} y={36 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.msg}</text>
            <text x={255} y={36 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.latency}</text>
            <text x={355} y={36 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.tps}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function Performance() {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">성능 비교</h2>
      <PerfTable />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DAG 기반(Bullshark)과 Avalanche가 <strong>처리량 우위</strong>.<br />
          Nakamoto 합의는 지연이 길지만 참여자 수 제한 없음.<br />
          RTT = Round Trip Time. 지연은 네트워크 조건에 의존.
        </p>

        {/* ── 세부 수치 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">세부 수치 비교 (2024 기준)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 2024 실측 수치:

// PBFT:
// - message: O(n²) + O(n³) VC
// - latency: 3δ (~300ms WAN)
// - TPS: 1K-10K
// - validators: ~20 실용

// Tendermint/CometBFT:
// - message: O(n²)
// - latency: 3-4δ (400-800ms)
// - TPS: 10K-20K
// - validators: 100-200

// HotStuff (chained):
// - message: O(n)
// - latency: 3δ (300-500ms)
// - TPS: 20K-30K
// - validators: ~100-300

// HotStuff-2 / Jolteon:
// - message: O(n)
// - latency: 2δ (200-400ms)
// - TPS: 30K-50K
// - validators: ~100

// Narwhal+Bullshark:
// - message: O(n) + DAG
// - latency: 2-3 rounds (2s WAN)
// - TPS: 100K-130K
// - validators: 10-100

// Mysticeti:
// - message: O(n) uncertified
// - latency: 390ms e2e WAN
// - TPS: 160K+
// - validators: ~100

// Autobahn (prototype):
// - message: O(n)
// - latency: 200-300ms
// - TPS: 100K+
// - validators: 100

// Avalanche (Snowman):
// - message: O(k log n)
// - latency: ~1s (β rounds)
// - TPS: 4500 X-Chain
// - validators: ~1500

// Nakamoto (Bitcoin):
// - message: O(n) gossip
// - latency: 60min (k=6)
// - TPS: 7
// - miners: 수천+

// Nakamoto (Ethereum PoW era):
// - message: O(n) gossip
// - latency: 3-5min (k=12)
// - TPS: 15
// - miners: 수만

// 성능 랭킹 (TPS):
// 1. Mysticeti: 160K+
// 2. Bullshark: 130K+
// 3. Autobahn: 100K+
// 4. HotStuff-2: 30-50K
// 5. HotStuff: 20-30K
// 6. Tendermint: 10-20K
// 7. PBFT: 1-10K
// 8. Avalanche: 4.5K
// 9. Ethereum: 15
// 10. Bitcoin: 7

// 성능 랭킹 (latency):
// 1. Autobahn: 200-300ms
// 2. Mysticeti: 390ms
// 3. HotStuff-2: 200-400ms
// 4. PBFT: 300ms
// 5. Tendermint: 400-800ms
// 6. Avalanche: 1s
// 7. Bullshark: 2s
// 8. Ethereum: 12s (block) / 12min (final)
// 9. Bitcoin: 60min`}
        </pre>
        <p className="leading-7">
          2024 TPS 챔피언: <strong>Mysticeti (160K+)</strong>.<br />
          Latency 챔피언: <strong>Autobahn (200-300ms)</strong>.<br />
          DAG-BFT가 throughput 우위, hybrid가 latency 우위.
        </p>

        {/* ── Scaling 분석 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator Scaling 분석</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Validator 수에 따른 성능:

// PBFT (n²):
// n=10: 100 msg/request
// n=50: 2500 msg
// n=100: 10K msg
// n=200: 40K msg
// n=500: 250K msg (bandwidth 폭발)
// → 실무: n≤100

// HotStuff (n):
// n=10: 10 msg/request
// n=100: 100 msg
// n=1000: 1K msg
// n=10000: 10K msg
// → 이론: n=1000+ 가능
// → 실무: n≤300 (leader bottleneck)

// Bullshark (DAG):
// n=10: 10 vertices/round (parallel)
// n=100: 100 vertices
// n=1000: 1000 vertices
// → DAG scales linearly
// → 실무: n≤100 (signature verification)

// Avalanche (k log n):
// n=100: 66 msg/node (k=20)
// n=1000: 100 msg
// n=10000: 130 msg
// → excellent scaling
// → 실무: n=1500+

// Nakamoto:
// n=수천: OK
// n=수만: OK
// n=수백만: OK (light clients)
// → no validator limit
// → miners 참여 자유

// 실무 배포 (2024):
// - Cosmos Hub: 180 validators (Tendermint)
// - Ethereum 2.0: 1M+ validators (committee 32 per slot)
// - Solana: ~1800 validators
// - Avalanche: ~1500 validators
// - Sui: ~100 validators (Mysticeti)
// - Aptos: ~100 validators (Jolteon)
// - Bitcoin: 15000+ miners

// 결론:
// - 수백만 validators: Ethereum 2.0 (committee sampling)
// - 수천 validators: Avalanche, Solana
// - 수백 validators: DAG-BFT (Sui, Aptos)
// - 수십 validators: PBFT`}
        </pre>
        <p className="leading-7">
          Validator 수 한계: <strong>프로토콜별 명확</strong>.<br />
          PBFT n≤100, HotStuff n≤300, DAG n≤100, Avalanche n≥1500.<br />
          Ethereum 2.0은 committee sampling으로 1M+ 지원.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "절대 최고" 프로토콜 없나</strong> — trade-off 본질.<br />
          throughput ↑ → complexity ↑ → latency 측정 어려움.<br />
          validators ↑ → communication ↑ → TPS ↓.<br />
          각 블록체인은 자신의 "용도"에 맞게 최적화 선택.
        </p>
      </div>
    </section>
  );
}
