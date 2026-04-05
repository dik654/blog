import ContextViz from './viz/ContextViz';
import SystemModelViz from './viz/SystemModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">분산 시스템 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          블록체인의 이론적 토대 — 분산 시스템의 통신 모델, 한계, 해결책.
        </p>
      </div>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose"><SystemModelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">분산 시스템 모델 구분</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Distributed System Models
//
// 1. Timing Model (시간 모델)
//
// Synchronous:
//   - 메시지 지연 상한 known
//   - Clock drift 상한 known
//   - 가장 강력한 가정
//   - 현실: 거의 불가능
//
// Asynchronous:
//   - 메시지 지연 상한 없음
//   - 언제 도착할지 모름
//   - 가장 약한 가정
//   - FLP impossibility
//
// Partial Synchronous:
//   - 대부분 sync, 가끔 async
//   - 또는 GST (Global Stabilization Time) 이후 sync
//   - 현실적 중간
//   - 대부분 BFT 프로토콜의 가정

// 2. Failure Model (장애 모델)
//
// Crash Failure (Fail-Stop):
//   - 노드가 멈추거나 메시지 손실
//   - 악의적 행동 없음
//   - Tolerance: f < n/2 (majority)
//   - 예: Paxos, Raft
//
// Byzantine Failure:
//   - 임의의 악의적 행동 가능
//   - 거짓말, 메시지 변조, 음모
//   - Tolerance: f < n/3
//   - 예: PBFT, Tendermint, HotStuff
//
// Omission Failure:
//   - 메시지를 보내지 않음
//   - Crash의 부분 집합

// 3. Network Model
//
// Reliable Channels:
//   - 메시지 결국 전달됨
//   - Lossy → lossless 변환 가능
//
// Authenticated Channels:
//   - 발신자 확인 가능
//   - Digital signature 필수

// 핵심 정리:
//
// FLP (1985):
//   Async + even 1 crash → no deterministic consensus
//
// CAP (2000):
//   Consistency, Availability, Partition-tolerance
//   → 2개만 선택 가능
//
// Byzantine Generals (1982):
//   f Byzantine faults → need n ≥ 3f+1

// 블록체인 매핑:
//
//   Bitcoin:
//     - Partial sync
//     - Byzantine (PoW)
//     - Probabilistic finality
//
//   Ethereum 2.0:
//     - Partial sync
//     - Byzantine (PoS Casper FFG)
//     - Deterministic finality (2 epochs)
//
//   Tendermint/Cosmos:
//     - Partial sync
//     - Byzantine BFT
//     - Instant finality`}
        </pre>
      </div>
    </section>
  );
}
