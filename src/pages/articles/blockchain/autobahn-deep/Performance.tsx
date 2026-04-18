import { motion } from 'framer-motion';

const C = { ab: '#10b981', hs: '#6366f1', pbft: '#ef4444' };

function PerfViz() {
  const bars = [
    { label: 'PBFT', latency: 30, tps: 40, color: C.pbft },
    { label: 'HotStuff', latency: 60, tps: 70, color: C.hs },
    { label: 'Autobahn', latency: 35, tps: 90, color: C.ab },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">처리량 vs 지연 비교</p>
      <svg viewBox="0 0 420 120" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={15} y={14} fontSize={10} fill="var(--muted-foreground)">처리량 (상대)</text>
        {bars.map((b, i) => (
          <motion.g key={b.label} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
            <text x={15} y={38 + i * 32} fontSize={10} fontWeight={600} fill={b.color}>{b.label}</text>
            <motion.rect x={100} y={25 + i * 32} width={0} height={18} rx={4}
              fill={`${b.color}30`} stroke={b.color} strokeWidth={1}
              animate={{ width: b.tps * 3 }}
              transition={{ delay: i * 0.15, duration: 0.5 }} />
            <motion.text x={100 + b.tps * 3 + 8} y={38 + i * 32} fontSize={10}
              fill={b.color} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: i * 0.15 + 0.5 }}>
              {b.tps}%
            </motion.text>
          </motion.g>
        ))}
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 Autobahn: PBFT급 지연 + HotStuff 이상의 처리량
      </p>
    </div>
  );
}

export default function Performance() {
  return (
    <section id="performance" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">성능 분석</h2>
      <PerfViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Autobahn은 <strong>정상 조건에서 PBFT에 가까운 지연</strong> 달성.<br />
          파이프라인 덕분에 처리량은 HotStuff 초과.<br />
          trade-off: 프로토콜 복잡도 증가, 실전 성능 최적.
        </p>

        {/* ── 측정 결과 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SOSP 2024 측정 결과</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">SOSP 2024 벤치마크 Setup</p>
            <p className="text-sm text-muted-foreground">
              10-100 validators, AWS EC2 multi-region (WAN), BLS12-381, 10 Gbps network
            </p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm mt-2">
              <div className="rounded border p-2">
                <p className="font-medium">Happy path</p>
                <p className="text-muted-foreground">latency: 200-300ms, TPS: 100K+, p99: 400ms, CPU &lt;50%, memory &lt;4GB</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Blip performance</p>
                <p className="text-muted-foreground">blip 100-300ms 시: recovery 100-200ms, throughput drop &lt;10%, full recovery &lt;500ms</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">비교 (100 validators, WAN)</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">프로토콜</th>
                    <th className="border border-border px-3 py-1.5 text-left">Happy latency</th>
                    <th className="border border-border px-3 py-1.5 text-left">TPS</th>
                    <th className="border border-border px-3 py-1.5 text-left">Blip recovery</th>
                    <th className="border border-border px-3 py-1.5 text-left">TPS drop</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5">PBFT</td><td className="border border-border px-3 py-1.5">300ms</td><td className="border border-border px-3 py-1.5">10K</td><td className="border border-border px-3 py-1.5">3s</td><td className="border border-border px-3 py-1.5">50%</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">HotStuff</td><td className="border border-border px-3 py-1.5">500ms</td><td className="border border-border px-3 py-1.5">25K</td><td className="border border-border px-3 py-1.5">1-2s</td><td className="border border-border px-3 py-1.5">30%</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Tendermint</td><td className="border border-border px-3 py-1.5">800ms</td><td className="border border-border px-3 py-1.5">10K</td><td className="border border-border px-3 py-1.5">2-5s</td><td className="border border-border px-3 py-1.5">60%</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Narwhal+Bullshark</td><td className="border border-border px-3 py-1.5">2s</td><td className="border border-border px-3 py-1.5">130K</td><td className="border border-border px-3 py-1.5">200ms</td><td className="border border-border px-3 py-1.5">10%</td></tr>
                  <tr className="font-semibold"><td className="border border-border px-3 py-1.5">Autobahn</td><td className="border border-border px-3 py-1.5">200-300ms</td><td className="border border-border px-3 py-1.5">100K+</td><td className="border border-border px-3 py-1.5">100-200ms</td><td className="border border-border px-3 py-1.5">&lt;10%</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">Scaling &amp; Bandwidth</p>
            <p className="text-sm text-muted-foreground">
              Validators scaling: 10→100K, 50→90K, 100→75K, 200→50K TPS (linear degradation).<br />
              Bandwidth: per validator 1-2 Gbps, aggregate 100-200 Gbps (Narwhal 수준).<br />
              결론: latency ≈ PBFT, throughput ≈ Narwhal, blip ≈ Narwhal → trilemma 해소
            </p>
          </div>
        </div>
        <p className="leading-7">
          Autobahn 성능: <strong>200-300ms latency, 100K+ TPS, 100-200ms blip recovery</strong>.<br />
          모든 metric에서 top 3 — "best overall".<br />
          trilemma(latency/throughput/recovery) 동시 해결.
        </p>

        {/* ── 미래 방향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Autobahn의 미래</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">채택 전망</p>
            <div className="grid gap-2 sm:grid-cols-3 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">2024</p>
                <p className="text-muted-foreground">SOSP publication, prototype 구현, mainnet 없음</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">2025 예상</p>
                <p className="text-muted-foreground">reference implementation, 학술 follow-up, 업계 관심 증가</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">2026+ 예상</p>
                <p className="text-muted-foreground">새 L1 blockchain 후보, Aptos/Sui 대체 검토, production 준비</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Mysticeti vs Autobahn</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Mysticeti (Sui)</p>
                <p className="text-muted-foreground">DAG-based (uncertified), 3-round commit, 390ms e2e, production mainnet (2024), 실무 검증됨. 철학: "DAG 개선"</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Autobahn</p>
                <p className="text-muted-foreground">slot-based (sequential), 2-phase commit, 200-300ms, prototype only (2024), 더 빠르지만 미검증. 철학: "sequential + parallel 결합"</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">예상 시나리오 &amp; 연구 과제</p>
            <p className="text-sm text-muted-foreground">
              Autobahn 채택: 새 L1 (Monad, Solayer), gaming/HFT blockchain.<br />
              Mysticeti 유지: Sui 생태계 굳건, DAG 접근 표준화.<br />
              Hybrid: Autobahn ideas + DAG ("Autobahn on DAG"), Shoal++ 계승.<br />
              연구: validator churn, shard consensus 통합, MEV-resistant ordering, privacy-preserving BFT
            </p>
          </div>
        </div>
        <p className="leading-7">
          Autobahn 전망: <strong>2024 학술 → 2026 production 후보</strong>.<br />
          Mysticeti 대안 또는 보완 역할.<br />
          "sequential + parallel" 결합의 새 패러다임.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Autobahn의 learning</strong> — "scalability trilemma는 깰 수 있다".<br />
          latency, throughput, recovery 셋 다 최적 가능.<br />
          key insight: 각 속성에 맞는 mechanism 분리 (Highway, Lanes, Blip handler).<br />
          미래 BFT 설계의 baseline.
        </p>
      </div>
    </section>
  );
}
