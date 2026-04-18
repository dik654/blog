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
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Avalanche vs BFT 속성 비교</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">속성</th>
                    <th className="border border-border px-3 py-1.5 text-left">Avalanche</th>
                    <th className="border border-border px-3 py-1.5 text-left">BFT (PBFT/HotStuff)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5">Safety</td><td className="border border-border px-3 py-1.5">probabilistic (~10^-10)</td><td className="border border-border px-3 py-1.5">deterministic (f&lt;n/3이면 P=0)</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Communication</td><td className="border border-border px-3 py-1.5"><code>O(k log n)</code></td><td className="border border-border px-3 py-1.5"><code>O(n2)</code> 또는 <code>O(n)</code></td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Latency</td><td className="border border-border px-3 py-1.5">~1s (beta rounds x RTT)</td><td className="border border-border px-3 py-1.5">200-500ms (3-4 RTT)</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Throughput</td><td className="border border-border px-3 py-1.5">4500 TPS (X-Chain)</td><td className="border border-border px-3 py-1.5">10K-100K+ TPS</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Validators</td><td className="border border-border px-3 py-1.5">수천+</td><td className="border border-border px-3 py-1.5">수백</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Byzantine tolerance</td><td className="border border-border px-3 py-1.5">up to n/2 (tuning)</td><td className="border border-border px-3 py-1.5">n/3 strict</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Energy</td><td className="border border-border px-3 py-1.5">low</td><td className="border border-border px-3 py-1.5">low</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">적합 용도</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Avalanche (probabilistic + scalable)</p>
                <p className="text-muted-foreground">social networks, gaming, low-stake payments, high validator count</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">BFT (deterministic + bounded)</p>
                <p className="text-muted-foreground">financial settlement, cross-border transfers, regulatory compliance, institutional use</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Avalanche 강점: <strong>scalability (1000+ validators)</strong>.<br />
          BFT 강점: <strong>deterministic safety</strong>.<br />
          용도별 선택: 금융 = BFT, P2P = Avalanche.
        </p>

        {/* ── Avalanche 실무 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Avalanche의 실무 사용</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">3-Chain Architecture</p>
            <div className="grid gap-2 sm:grid-cols-3 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">X-Chain (eXchange)</p>
                <p className="text-muted-foreground">Avalanche DAG consensus, UTXO-based, asset creation/transfer, 4500+ TPS</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">C-Chain (Contract)</p>
                <p className="text-muted-foreground">Snowman consensus, EVM compatible, smart contracts, DeFi ecosystem</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">P-Chain (Platform)</p>
                <p className="text-muted-foreground">Snowman consensus, staking/validators, subnet management</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Subnet Architecture</p>
            <p className="text-sm text-muted-foreground">
              독립 chain, custom consensus, custom VM, permissioned/permissionless, horizontal sharding.<br />
              예: DeFi Kingdoms (gaming), Shrapnel (gaming), Dexalot (exchange), enterprise subnets
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Performance &amp; Tokenomics (2024)</p>
            <p className="text-sm">
              ~1500 validators, 4500 TPS (X-Chain), 100-500 TPS (C-Chain), subsecond finality, $250M+ TVL.<br />
              AVAX token: 2000 AVAX stake minimum, ~7-11% APR, burned fees (deflationary)
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">경쟁 포지션 &amp; 미래</p>
            <p className="text-sm text-muted-foreground">
              장점: mature ecosystem, EVM compatibility, subnet flexibility, multi-chain architecture.<br />
              한계: probabilistic finality 우려, validator 요구 높음 ($70K+), ecosystem 작음 (vs Ethereum).<br />
              미래: Avalanche 9000 (2024-2025), subnet fees 감소, interchain messaging, L1 chains 분사
            </p>
          </div>
        </div>
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
