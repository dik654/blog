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
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">2024 실측 수치</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">프로토콜</th>
                    <th className="border border-border px-3 py-1.5 text-left">통신</th>
                    <th className="border border-border px-3 py-1.5 text-left">Latency</th>
                    <th className="border border-border px-3 py-1.5 text-left">TPS</th>
                    <th className="border border-border px-3 py-1.5 text-left">Validators</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5">PBFT</td><td className="border border-border px-3 py-1.5">O(n2)+O(n3) VC</td><td className="border border-border px-3 py-1.5">~300ms</td><td className="border border-border px-3 py-1.5">1K-10K</td><td className="border border-border px-3 py-1.5">~20</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Tendermint</td><td className="border border-border px-3 py-1.5">O(n2)</td><td className="border border-border px-3 py-1.5">400-800ms</td><td className="border border-border px-3 py-1.5">10K-20K</td><td className="border border-border px-3 py-1.5">100-200</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">HotStuff</td><td className="border border-border px-3 py-1.5">O(n)</td><td className="border border-border px-3 py-1.5">300-500ms</td><td className="border border-border px-3 py-1.5">20K-30K</td><td className="border border-border px-3 py-1.5">100-300</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">HotStuff-2/Jolteon</td><td className="border border-border px-3 py-1.5">O(n)</td><td className="border border-border px-3 py-1.5">200-400ms</td><td className="border border-border px-3 py-1.5">30K-50K</td><td className="border border-border px-3 py-1.5">~100</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Narwhal+Bullshark</td><td className="border border-border px-3 py-1.5">O(n)+DAG</td><td className="border border-border px-3 py-1.5">2s WAN</td><td className="border border-border px-3 py-1.5">100K-130K</td><td className="border border-border px-3 py-1.5">10-100</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Mysticeti</td><td className="border border-border px-3 py-1.5">O(n) uncertified</td><td className="border border-border px-3 py-1.5">390ms</td><td className="border border-border px-3 py-1.5">160K+</td><td className="border border-border px-3 py-1.5">~100</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Autobahn</td><td className="border border-border px-3 py-1.5">O(n)</td><td className="border border-border px-3 py-1.5">200-300ms</td><td className="border border-border px-3 py-1.5">100K+</td><td className="border border-border px-3 py-1.5">100</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Avalanche</td><td className="border border-border px-3 py-1.5">O(k log n)</td><td className="border border-border px-3 py-1.5">~1s</td><td className="border border-border px-3 py-1.5">4.5K</td><td className="border border-border px-3 py-1.5">~1500</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Bitcoin</td><td className="border border-border px-3 py-1.5">O(n) gossip</td><td className="border border-border px-3 py-1.5">60min</td><td className="border border-border px-3 py-1.5">7</td><td className="border border-border px-3 py-1.5">수천+</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4">
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">TPS 랭킹</p>
                <p className="text-muted-foreground">1. Mysticeti 160K+ / 2. Bullshark 130K+ / 3. Autobahn 100K+ / 4. HotStuff-2 30-50K / 5. Tendermint 10-20K / 6. Avalanche 4.5K / 7. Bitcoin 7</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Latency 랭킹</p>
                <p className="text-muted-foreground">1. Autobahn 200-300ms / 2. Mysticeti 390ms / 3. HotStuff-2 200-400ms / 4. PBFT 300ms / 5. Tendermint 400-800ms / 6. Avalanche 1s / 7. Bitcoin 60min</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          2024 TPS 챔피언: <strong>Mysticeti (160K+)</strong>.<br />
          Latency 챔피언: <strong>Autobahn (200-300ms)</strong>.<br />
          DAG-BFT가 throughput 우위, hybrid가 latency 우위.
        </p>

        {/* ── Scaling 분석 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator Scaling 분석</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Validator 수에 따른 메시지 량</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">프로토콜</th>
                    <th className="border border-border px-3 py-1.5 text-left">n=10</th>
                    <th className="border border-border px-3 py-1.5 text-left">n=100</th>
                    <th className="border border-border px-3 py-1.5 text-left">n=1000</th>
                    <th className="border border-border px-3 py-1.5 text-left">실무 한계</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5">PBFT (n2)</td><td className="border border-border px-3 py-1.5">100 msg</td><td className="border border-border px-3 py-1.5">10K msg</td><td className="border border-border px-3 py-1.5">1M msg</td><td className="border border-border px-3 py-1.5">n &le; 100</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">HotStuff (n)</td><td className="border border-border px-3 py-1.5">10 msg</td><td className="border border-border px-3 py-1.5">100 msg</td><td className="border border-border px-3 py-1.5">1K msg</td><td className="border border-border px-3 py-1.5">n &le; 300</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Bullshark (DAG)</td><td className="border border-border px-3 py-1.5">10 vtx</td><td className="border border-border px-3 py-1.5">100 vtx</td><td className="border border-border px-3 py-1.5">1000 vtx</td><td className="border border-border px-3 py-1.5">n &le; 100</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Avalanche (k log n)</td><td className="border border-border px-3 py-1.5">46 msg</td><td className="border border-border px-3 py-1.5">66 msg</td><td className="border border-border px-3 py-1.5">100 msg</td><td className="border border-border px-3 py-1.5">n = 1500+</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Nakamoto</td><td className="border border-border px-3 py-1.5" colSpan={3}>제한 없음 (light clients)</td><td className="border border-border px-3 py-1.5">수백만</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">실무 배포 (2024)</p>
            <p className="text-sm text-muted-foreground">
              Cosmos Hub: 180 (Tendermint) / Ethereum 2.0: 1M+ (committee 32/slot) / Solana: ~1800 / Avalanche: ~1500 / Sui: ~100 (Mysticeti) / Aptos: ~100 (Jolteon) / Bitcoin: 15000+ miners
            </p>
            <p className="text-sm mt-1">
              수백만: Ethereum 2.0 (committee sampling) / 수천: Avalanche, Solana / 수백: DAG-BFT / 수십: PBFT
            </p>
          </div>
        </div>
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
