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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BFT 프로토콜 3축 평가:

// Axis 1: Latency (commit 시간)
// - PBFT: 3δ
// - Tendermint: 3-4δ
// - HotStuff chained: 3δ
// - HotStuff-2: 4δ
// - Jolteon: 2δ (fast), 4δ (slow)
// - Mysticeti: 390ms e2e
// - Autobahn: 2-3δ

// Axis 2: Throughput (TPS)
// - PBFT: 1K-10K TPS
// - Tendermint: 10K-20K TPS
// - HotStuff: 20K-30K TPS
// - DAG-BFT (Narwhal): 100K+ TPS
// - Mysticeti: 160K+ TPS
// - Autobahn: 100K+ TPS

// Axis 3: Robustness (blip 복구)
// - PBFT: slow (VC 복잡)
// - Tendermint: medium (round++)
// - HotStuff: medium (linear VC)
// - DAG-BFT: fast (parallel)
// - Mysticeti: fast
// - Autobahn: fast (explicit blip handling)

// 일반 trade-off:
// - latency ↓ → validators ↓
// - throughput ↑ → complexity ↑
// - robustness ↑ → bandwidth ↑

// 최적 조합 (2024):
// - 낮은 latency + 고 throughput: Autobahn, Mysticeti
// - 단순성 + 성숙도: Tendermint
// - production + 최적화: Jolteon (Aptos)
// - 이론적 최적: HotStuff-2

// 선택 가이드:
// L1 blockchain: Mysticeti, Jolteon, Autobahn
// Appchain: Tendermint/CometBFT
// Permissioned: PBFT, IBFT
// High-throughput: DAG-BFT
// Learning: PBFT, Tendermint`}
        </pre>
        <p className="leading-7">
          3축: <strong>Latency / Throughput / Robustness</strong>.<br />
          trade-off 명확 — "완벽" 없음.<br />
          용도별 최적 선택 (L1/appchain/permissioned).
        </p>

        {/* ── 미래 방향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BFT 미래 방향 (2025-)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BFT 연구 미래 방향:

// 1. Async-safe BFT:
//    - GST 없이 liveness 보장
//    - Ditto, HoneyBadger BFT 계승
//    - DDoS 저항 강화
//
// 2. DAG + Sequential hybrid:
//    - Autobahn 확장
//    - Mysticeti 개선
//    - 각 tier 최적 프로토콜
//
// 3. Optimistic BFT:
//    - happy path 극적 단순화
//    - rollback + challenge 메커니즘
//    - optimistic rollup 영향
//
// 4. Scalable committees:
//    - 10,000+ validators
//    - committee sampling (VRF)
//    - shard-based consensus
//
// 5. Privacy-preserving BFT:
//    - ZK proof 통합
//    - validator 익명성
//    - confidential TX
//
// 6. MEV-resistant BFT:
//    - fair ordering
//    - encrypted mempool
//    - proposer-builder separation

// 연구 기관:
// - MystenLabs (Mysticeti)
// - Aptos Labs (Jolteon)
// - UC Berkeley (Autobahn)
// - Protocol Labs (F3/GossiPBFT)
// - Ethereum Foundation (Casper)

// 실무 과제:
// - validator churn (동적 membership)
// - economic security (stake)
// - incentive design (liveness 보상)
// - slashing 균형 (ejecting 공격 방어)

// 예상 트렌드 (2026+):
// - L1 BFT: DAG-hybrid 표준화
// - L2 consensus: optimistic BFT
// - appchain: CometBFT 유지
// - interchain: shared security BFT`}
        </pre>
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
