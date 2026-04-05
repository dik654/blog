import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Narwhal DAG 멤풀 심층</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Narwhal (Danezis et al., EuroSys 2022) — <strong>DAG 기반 reliable mempool</strong>.<br />
          모든 validator가 동시 TX batch 제안 → 병렬 처리량 극대화.<br />
          "availability first, ordering later" 철학.
        </p>

        {/* ── Narwhal의 3가지 혁신 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Narwhal의 3가지 혁신</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Narwhal 3가지 핵심 혁신:

// 1. DAG-based mempool:
//    - 기존 mempool: single-validator local
//    - Narwhal: shared DAG structure
//    - all validators contribute
//    - reliable availability

// 2. Availability vs Ordering 분리:
//    - availability: DAG structure 자체
//    - ordering: 별도 consensus layer (Bullshark)
//    - 각 layer 독립 최적화
//    - reusable across consensus protocols

// 3. Primary-Worker scaling:
//    - Primary: consensus (lightweight)
//    - Worker: data dissemination (heavy)
//    - validator 내부 horizontal scaling
//    - worker 개수 조정 → throughput 조절

// 성능 (Narwhal paper):
// - 10 validators + 4 workers each: 600K TPS
// - mempool throughput (ordering 제외)
// - bandwidth: 8.5 Gbps
// - latency: 2s end-to-end

// 비교:
// Ethereum mempool: ~100 TPS ingestion
// Bitcoin mempool: ~7 TPS
// Narwhal: 600K TPS (with 4 workers)
// 10000x+ improvement

// 사용처:
// - Sui (Narwhal + Bullshark → Mysticeti)
// - Aptos (Quorum Store = Narwhal 변형)
// - Mysten Labs research
// - 다수 L1 projects

// 이론적 기여:
// - "mempool as consensus"
// - reliable broadcast primitives
// - DAG causality 증명
// - BFT throughput 상한 돌파`}
        </pre>
        <p className="leading-7">
          Narwhal = <strong>DAG mempool + availability/ordering 분리 + Primary-Worker</strong>.<br />
          600K TPS (mempool), 기존 대비 10000x.<br />
          Sui, Aptos 등 현대 L1의 기반.
        </p>

        {/* ── Narwhal 핵심 concepts ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Narwhal 핵심 Concepts</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 핵심 용어:

// 1. Batch:
//    - TX 모음 (e.g., 500KB)
//    - worker가 생성
//    - digest로 참조됨
//
// 2. Header:
//    - round에 validator의 propose
//    - payload: batch digest 리스트
//    - parents: 이전 round 2f+1 cert 참조
//
// 3. Certificate:
//    - Header + 2f+1 signatures
//    - header availability 증명
//    - DAG vertex
//
// 4. Round:
//    - asynchronous round number
//    - 2f+1 certs 수신 시 advance
//    - no fixed timeout
//
// 5. DAG:
//    - vertices = certificates
//    - edges = parent references
//    - causal history graph

// Reliable Broadcast Protocol:
// - validator가 data broadcast
// - 2f+1 ack 수집 → reliable delivered
// - delivered 상태: "모든 정직 노드가 결국 수신"
// - Narwhal의 기반 primitive

// Narwhal guarantees:
// 1. Integrity: delivered data = original
// 2. Agreement: all honest receive same
// 3. Termination: eventually delivered
// 4. Efficiency: O(n) total comms per broadcast

// DAG invariants:
// - 각 (author, round) 1 vertex만
// - parents 2f+1 certificates
// - acyclic (round increases)
// - connected (via parents)

// Security assumptions:
// - f < n/3 Byzantine
// - reliable point-to-point channels
// - eventual message delivery
// - asynchronous model

// async-safe!
// - no timing assumption
// - works in any network
// - liveness via reliable broadcast`}
        </pre>
        <p className="leading-7">
          핵심: <strong>Batch → Header → Certificate → DAG</strong>.<br />
          reliable broadcast primitive가 기반.<br />
          async-safe (no timing assumption).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Narwhal이 "availability first"인가</strong> — mempool 관점 전환.<br />
          기존: mempool은 local, consensus에서 TX 유실 가능.<br />
          Narwhal: mempool 자체가 BFT guarantee — TX가 결코 유실 안 됨.<br />
          이것이 consensus 단순화 + throughput 향상 기반.
        </p>
      </div>
    </section>
  );
}
