import CAPViz from './viz/CAPViz';

export default function CAP() {
  return (
    <section id="cap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CAP 정리 & PACELC</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Brewer(2000) — 분산 시스템은 C, A, P 중 최대 2가지만 동시 보장. 네트워크 분할은 불가피 &rarr; C vs A 선택.
        </p>
      </div>
      <div className="not-prose"><CAPViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CAP 정리와 PACELC</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CAP Theorem (Brewer 2000)
//
// 3가지 속성:
//
// C - Consistency (일관성)
//    모든 노드가 같은 데이터 반환
//    Linearizability
//
// A - Availability (가용성)
//    모든 요청이 응답 받음
//    (정답 아니어도)
//
// P - Partition Tolerance (분할 내성)
//    네트워크 분할 시에도 동작
//
// 정리:
//   "P가 발생하면 C와 A 모두 만족 불가"
//   → 2개만 선택 가능
//
// 현실:
//   Partition은 발생 → P는 필수
//   → CP 또는 AP 선택

// 분류:
//
// CP (Consistency + Partition tolerance):
//   - 일관성 우선
//   - Partition 시 일부 unavailable
//   - 예: HBase, MongoDB (single master), etcd
//   - 은행, 결제 시스템
//
// AP (Availability + Partition tolerance):
//   - 가용성 우선
//   - Partition 시 stale data 반환 가능
//   - Eventually consistent
//   - 예: Cassandra, DynamoDB, Riak
//   - SNS, 캐시

// PACELC (Abadi 2012):
//   "P가 발생하면 A와 C 중 선택"
//   "Else (정상) L과 C 중 선택"
//
//   L = Latency
//
//   PA/EL: Cassandra, DynamoDB
//   PC/EC: HBase, BigTable
//   PA/EC: MongoDB (config)
//   PC/EL: drop by default

// 블록체인과 CAP:
//
// Bitcoin:
//   AP (eventual consistency)
//   Chain fork → 가용
//   Final confirmation 후 C
//
// Ethereum 2.0 PoS:
//   CP with finality
//   Finality 후 consistent
//   Unfinalized: AP-like
//
// Tendermint:
//   CP (consistency)
//   2/3+ votes로 instant finality
//   Network partition → halt (no fork)

// 실무 Trade-offs:
//   Strong consistency: latency ↑
//   High availability: consistency ↓
//   Low latency: availability trade-off
//
// → CRDT, conflict-free replicated data types
// → Vector clocks, causal consistency
// → Quorum systems (R + W > N)`}
        </pre>
      </div>
    </section>
  );
}
