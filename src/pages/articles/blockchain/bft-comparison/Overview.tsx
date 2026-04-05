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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BFT 진화 3단계:

// Stage 1: Feasibility (1999-2010)
// "BFT가 실무에서 가능한가?"
// - PBFT (1999): 최초 실용적 BFT
// - Zyzzyva (2007): speculative execution
// - UpRight (2009): Byzantine + crash
// - 공통: 학술 수준, production 드묾

// Stage 2: Scalability (2014-2020)
// "BFT를 blockchain 규모로 확장"
// - Tendermint (2014): blockchain 맞춤
// - LibraBFT/HotStuff (2019): O(n) linear
// - 공통: O(n²) 통신 한계 돌파

// Stage 3: Throughput (2021-현재)
// "초고 throughput BFT"
// - Narwhal (2021): DAG mempool
// - Bullshark (2022): DAG consensus
// - Jolteon (2022): 2-chain commit
// - Mysticeti (2024): uncertified DAG
// - Autobahn (2024): hybrid pipeline

// 각 단계 핵심 metric:
// Stage 1: 가능성 (feasibility)
// Stage 2: validator 수 (scalability)
// Stage 3: TPS (throughput)

// 성능 진화:
// PBFT (1999): 10K TPS, f<n/3
// Tendermint (2014): 10K TPS, f<n/3, instant finality
// HotStuff (2019): 20K TPS, O(n), instant finality
// Jolteon (2022): 30K TPS, 2-chain, responsive
// Mysticeti (2024): 160K TPS, DAG, 390ms
// Autobahn (2024): 100K TPS, hybrid, fast recovery

// validator 수 진화:
// PBFT: ~20 (실무)
// Tendermint: ~100-200
// HotStuff: ~100-300
// DAG-BFT: ~100-500

// latency 진화:
// PBFT: 3δ
// HotStuff (basic): 7δ
// HotStuff (chained): 3δ
// HotStuff-2: 4δ
// Jolteon: 4δ (fast path 2δ)
// Mysticeti: 390ms e2e
// Autobahn: 1-3δ adaptive`}
        </pre>
        <p className="leading-7">
          진화 3단계: <strong>feasibility → scalability → throughput</strong>.<br />
          각 단계 25년간 validator 5배, TPS 15배 증가.<br />
          2024년 현재 DAG-based + hybrid가 주류.
        </p>

        {/* ── 비교 dimension ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BFT 비교 dimensions</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BFT 프로토콜 비교 차원:

// 1. Communication complexity:
//    PBFT: O(n²) normal, O(n³) VC
//    Tendermint: O(n²) normal, O(n²) VC
//    HotStuff: O(n) normal, O(n) VC
//    DAG-BFT: O(n²) amortized but parallel

// 2. Latency (to commit):
//    PBFT: 3δ
//    HotStuff: 3δ (chained)
//    HotStuff-2: 4δ
//    Mysticeti: 390ms (absolute)

// 3. Responsiveness:
//    PBFT: normal only
//    Tendermint: non-responsive
//    HotStuff: normal only
//    HotStuff-2: fully responsive

// 4. View Change:
//    PBFT: explicit, expensive
//    Tendermint: implicit (round++)
//    HotStuff: linear
//    HotStuff-2: + TC

// 5. Leader:
//    PBFT: round-robin
//    Tendermint: proposer schedule
//    HotStuff: rotation per view
//    DiemBFT: reputation-based

// 6. Network model:
//    PBFT: partial sync
//    Tendermint: partial sync
//    HotStuff: partial sync
//    Ditto: async fallback
//    Mysticeti: partial sync + async

// 7. Throughput:
//    all traditional: O(1) block per view
//    DAG-BFT: O(n) blocks per wave

// 8. Fork resistance:
//    all BFT: absolute (f<n/3)
//    Nakamoto: probabilistic

// 핵심 설계 결정:
// 1. Chain structure (linear vs DAG)
// 2. Voting mechanism (direct vs threshold)
// 3. Leader selection (rotation vs reputation)
// 4. Network assumption (sync/partial/async)
// 5. Commit rule (2-chain vs 3-chain)`}
        </pre>
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
