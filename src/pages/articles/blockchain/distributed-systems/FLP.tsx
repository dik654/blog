import FLPViz from './viz/FLPViz';

export default function FLP() {
  return (
    <section id="flp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FLP 불가능성 정리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Fischer, Lynch, Paterson(1985) — 비동기 시스템에서 단 하나의 crash fault로도 결정적 합의 불가능.
        </p>
      </div>
      <div className="not-prose"><FLPViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">FLP Impossibility 정리</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// FLP Impossibility Theorem (1985)
// Fischer, Lynch, Paterson
//
// 정리:
//   "In an asynchronous system where at least one
//    process may fail by crashing, there is no
//    deterministic consensus protocol that can
//    guarantee termination."
//
// 요약:
//   Async + 1 crash → no deterministic consensus
//
// 합의의 3 필수 속성:
//   Agreement: 모든 정직한 노드가 같은 값 결정
//   Validity:  결정된 값은 제안된 값 중 하나
//   Termination: 모든 정직한 노드가 언젠가 결정

// 증명 아이디어:
//   1. Bivalent configuration
//      어떤 결과든 가능한 상태
//
//   2. Critical step
//      메시지 도착 순서가 결과 결정
//
//   3. Adversary scheduling
//      메시지를 지연시켜 계속 bivalent 유지
//
//   4. Infinite execution
//      → Termination 위반

// 현실의 해결책:
//
// 1. Synchrony 가정
//    Message timeout 사용
//    예: Raft, Paxos (partial sync)
//
// 2. Randomization
//    Ben-Or protocol
//    Expected termination in O(expected rounds)
//    예: Algorand, Dfinity
//
// 3. Failure Detector
//    "◇P" (eventually perfect)
//    Chandra-Toueg algorithm
//
// 4. Probabilistic termination
//    "eventually with high probability"
//    Bitcoin Nakamoto consensus

// 블록체인 해결 방식:
//
// Bitcoin/PoW:
//   - Probabilistic consensus
//   - Longest chain rule
//   - No deterministic termination
//   - 6 confirmations = "effectively final"
//
// PBFT (Castro-Liskov 1999):
//   - Partial sync assumption
//   - View change mechanism
//   - n ≥ 3f + 1
//   - Deterministic when sync
//
// HotStuff:
//   - Linear view change
//   - Pipelined consensus
//   - Tendermint, Diem 기반

// FLP의 의미:
//   "완벽한 비동기 결정적 합의는 불가"
//   → 실용적 합의는 가정을 필요로 함
//   → 가정을 완화하며 progress 확보
//
// 역설:
//   Bitcoin이 10년 이상 돌아가는 이유
//   = async + random + economic incentives`}
        </pre>
      </div>
    </section>
  );
}
