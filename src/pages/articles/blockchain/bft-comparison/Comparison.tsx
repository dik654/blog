import BFTComparisonViz from './viz/BFTComparisonViz';
import { CELL, TABLE_ROWS, TRADEOFFS } from './ComparisonData';

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">종합 비교</h2>
      <div className="not-prose mb-8"><BFTComparisonViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PBFT → HotStuff → Autobahn → Casper FFG의 종합 비교.<br />
          각 프로토콜의 <strong>trade-off</strong> 명확화.<br />
          용도별 최적 선택 가이드.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>속성</th>
                <th className={`${CELL} text-left`}>PBFT</th>
                <th className={`${CELL} text-left`}>HotStuff</th>
                <th className={`${CELL} text-left`}>Autobahn</th>
                <th className={`${CELL} text-left`}>Casper FFG</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(r => (
                <tr key={r.attr}>
                  <td className={`${CELL} font-medium`}>{r.attr}</td>
                  <td className={CELL}>{r.pbft}</td>
                  <td className={CELL}>{r.hotstuff}</td>
                  <td className={CELL}>{r.autobahn}</td>
                  <td className={CELL}>{r.casper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">트레이드오프 요약</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {TRADEOFFS.map(t => (
            <div key={t.title} className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">{t.title}</p>
              <p className="text-sm">{t.body}</p>
            </div>
          ))}
        </div>

        {/* ── 3축 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3축 비교: Latency / Throughput / Robustness</h3>
        <div className="overflow-x-auto not-prose mb-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">프로토콜</th>
                <th className="border border-border px-3 py-2 text-left">Latency</th>
                <th className="border border-border px-3 py-2 text-left">Throughput</th>
                <th className="border border-border px-3 py-2 text-left">Robustness</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['PBFT', '3δ', '1K-10K TPS', 'slow (VC 복잡)'],
                ['Tendermint', '3-4δ', '10K-20K TPS', 'medium (round++)'],
                ['HotStuff', '3δ (chained)', '20K-30K TPS', 'medium (linear VC)'],
                ['Jolteon', '2δ fast / 4δ slow', '30K+ TPS', 'medium-fast'],
                ['Mysticeti', '390ms e2e', '160K+ TPS', 'fast'],
                ['Autobahn', '2-3δ', '100K+ TPS', 'fast (explicit blip)'],
              ].map(([proto, lat, tps, rob]) => (
                <tr key={proto}>
                  <td className="border border-border px-3 py-2 font-medium">{proto}</td>
                  <td className="border border-border px-3 py-2">{lat}</td>
                  <td className="border border-border px-3 py-2">{tps}</td>
                  <td className="border border-border px-3 py-2">{rob}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">일반 Trade-off</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>latency ↓ → validators ↓</li>
              <li>throughput ↑ → complexity ↑</li>
              <li>robustness ↑ → bandwidth ↑</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">선택 가이드</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li><strong>L1 blockchain</strong>: Mysticeti, Jolteon, Autobahn</li>
              <li><strong>Appchain</strong>: Tendermint/CometBFT</li>
              <li><strong>Permissioned</strong>: PBFT, IBFT</li>
              <li><strong>High-throughput</strong>: DAG-BFT</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          3축: <strong>Latency / Throughput / Robustness</strong>.<br />
          trade-off 명확 — "완벽" 없음.<br />
          용도별 최적 선택 (L1/appchain/permissioned).
        </p>

        {/* ── 미래 방향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BFT 미래 방향 (2025-)</h3>
        <div className="grid gap-3 sm:grid-cols-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Async-safe BFT</p>
            <p className="text-sm">GST 없이 liveness 보장. Ditto, HoneyBadger BFT 계승. DDoS 저항 강화.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">DAG + Sequential Hybrid</p>
            <p className="text-sm">Autobahn 확장. Mysticeti 개선. 각 tier 최적 프로토콜.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Optimistic BFT</p>
            <p className="text-sm">happy path 극적 단순화. rollback + challenge 메커니즘. optimistic rollup 영향.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Scalable Committees</p>
            <p className="text-sm">10,000+ validators. committee sampling(VRF). shard-based consensus.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Privacy-preserving BFT</p>
            <p className="text-sm">ZK proof 통합. validator 익명성. confidential TX.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">MEV-resistant BFT</p>
            <p className="text-sm">fair ordering. encrypted mempool. proposer-builder separation.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">주요 연구 기관</p>
            <p className="text-sm">MystenLabs(Mysticeti), Aptos Labs(Jolteon), UC Berkeley(Autobahn), Protocol Labs(F3/GossiPBFT), Ethereum Foundation(Casper)</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">예상 트렌드 (2026+)</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li>L1 BFT — DAG-hybrid 표준화</li>
              <li>L2 consensus — optimistic BFT</li>
              <li>Appchain — CometBFT 유지</li>
              <li>Interchain — shared security BFT</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          미래: <strong>async-safe + DAG-hybrid + scalability</strong>.<br />
          10K+ validators + 100K+ TPS + async liveness 목표.<br />
          2025-2026 새 L1 설계의 핵심 과제.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 BFT 선택의 현실적 기준</strong> — 이론보다 성숙도.<br />
          HotStuff-2가 이론 최적이지만 mainnet 없음.<br />
          Jolteon/Mysticeti는 실무 검증 완료.<br />
          {'실제 선택: 이론 성능 80% + 검증된 구현 > 이론 100% + 미검증.'}
        </p>
      </div>
    </section>
  );
}
