import ContextViz from './viz/ContextViz';
import TopologyCompareViz from './viz/TopologyCompareViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BFT 합의 프로토콜 진화</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          25년간 BFT 합의 프로토콜의 <strong>점진적 진화</strong>.<br />
          PBFT(1999) → HotStuff(2019) → Autobahn(2024).<br />
          각 세대 특정 한계 해결.
        </p>

        <TopologyCompareViz />

        {/* ── BFT 진화 3단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BFT 프로토콜 계보</h3>
        <div className="grid gap-3 sm:grid-cols-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Stage 1: Feasibility (1999-2010)</p>
            <p className="text-sm text-muted-foreground mb-1">"BFT가 실무에서 가능한가?"</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>PBFT (1999) — 최초 실용적 BFT</li>
              <li>Zyzzyva (2007) — speculative execution</li>
              <li>UpRight (2009) — Byzantine + crash</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">핵심 metric: 가능성</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Stage 2: Scalability (2014-2020)</p>
            <p className="text-sm text-muted-foreground mb-1">"BFT를 blockchain 규모로 확장"</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>Tendermint (2014) — blockchain 맞춤</li>
              <li>LibraBFT/HotStuff (2019) — <code className="text-xs">O(n)</code> linear</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">핵심 metric: validator 수</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Stage 3: Throughput (2021-현재)</p>
            <p className="text-sm text-muted-foreground mb-1">"초고 throughput BFT"</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>Narwhal (2021) — DAG mempool</li>
              <li>Bullshark (2022) — DAG consensus</li>
              <li>Jolteon (2022) — 2-chain commit</li>
              <li>Mysticeti (2024) — uncertified DAG</li>
              <li>Autobahn (2024) — hybrid pipeline</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">핵심 metric: TPS</p>
          </div>
        </div>

        <div className="overflow-x-auto not-prose mb-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">프로토콜</th>
                <th className="border border-border px-3 py-2 text-left">TPS</th>
                <th className="border border-border px-3 py-2 text-left">Validators</th>
                <th className="border border-border px-3 py-2 text-left">Latency</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['PBFT (1999)', '10K', '~20', '3δ'],
                ['Tendermint (2014)', '10K', '~100-200', '3-4δ'],
                ['HotStuff (2019)', '20K', '~100-300', '3δ (chained)'],
                ['Jolteon (2022)', '30K', '~100-300', '4δ (fast 2δ)'],
                ['Mysticeti (2024)', '160K', '~100-500', '390ms e2e'],
                ['Autobahn (2024)', '100K', '~100-500', '1-3δ adaptive'],
              ].map(([proto, tps, vals, lat]) => (
                <tr key={proto}>
                  <td className="border border-border px-3 py-2 font-medium">{proto}</td>
                  <td className="border border-border px-3 py-2">{tps}</td>
                  <td className="border border-border px-3 py-2">{vals}</td>
                  <td className="border border-border px-3 py-2">{lat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="leading-7">
          진화 3단계: <strong>feasibility → scalability → throughput</strong>.<br />
          각 단계 25년간 validator 5배, TPS 15배 증가.<br />
          2024년 현재 DAG-based + hybrid가 주류.
        </p>

        {/* ── 비교 dimension ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BFT 비교 dimensions</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">1. Communication Complexity</p>
            <p className="text-sm">PBFT: <code className="text-xs">O(n²)</code> normal / <code className="text-xs">O(n³)</code> VC — HotStuff: <code className="text-xs">O(n)</code> both — DAG-BFT: <code className="text-xs">O(n²)</code> amortized parallel</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">2. Latency (commit)</p>
            <p className="text-sm">PBFT: 3δ — HotStuff chained: 3δ — HotStuff-2: 4δ — Mysticeti: 390ms</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">3. Responsiveness</p>
            <p className="text-sm">PBFT: normal only — Tendermint: non-responsive — HotStuff-2: fully responsive</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">4. View Change</p>
            <p className="text-sm">PBFT: explicit, expensive — Tendermint: implicit <code className="text-xs">round++</code> — HotStuff: linear</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">5. Leader Selection</p>
            <p className="text-sm">PBFT: round-robin — Tendermint: proposer schedule — DiemBFT: reputation-based</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">6. Network Model</p>
            <p className="text-sm">대부분 partial sync — Ditto: async fallback — Mysticeti: partial sync + async</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">7. Throughput</p>
            <p className="text-sm">전통 BFT: <code className="text-xs">O(1)</code> block/view — DAG-BFT: <code className="text-xs">O(n)</code> blocks/wave</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">8. Fork Resistance</p>
            <p className="text-sm">BFT: absolute (<code className="text-xs">f&lt;n/3</code>) — Nakamoto: probabilistic</p>
          </div>
        </div>

        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">핵심 설계 결정 5가지</p>
          <ol className="text-sm space-y-1 list-decimal pl-4">
            <li>Chain structure — linear vs DAG</li>
            <li>Voting mechanism — direct vs threshold</li>
            <li>Leader selection — rotation vs reputation</li>
            <li>Network assumption — sync / partial / async</li>
            <li>Commit rule — 2-chain vs 3-chain</li>
          </ol>
        </div>
        <p className="leading-7">
          8가지 비교 차원: <strong>complexity, latency, responsiveness, VC, leader, network, throughput, fork</strong>.<br />
          각 프로토콜은 차원별 trade-off 선택.<br />
          완벽한 프로토콜 없음 — 용도별 최적화.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 계속 새 BFT 프로토콜이 등장하나</strong> — 각 프로토콜의 명확한 한계.<br />
          BFT는 "완료된 분야"가 아님 — 각 세대가 이전 한계 해결.<br />
          DAG-BFT (2022-)가 최신 흐름 — throughput 10-100배 향상.<br />
          다음 세대는 async + 1M validator + 100K TPS 목표.
        </p>
      </div>
    </section>
  );
}
