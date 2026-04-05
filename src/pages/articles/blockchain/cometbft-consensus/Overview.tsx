import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 엔진 전체 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CometBFT 합의의 핵심은 receiveRoutine 하나의 goroutine입니다.<br />
          이 아티클에서는 for-select 루프부터 enterCommit까지 전체 코드를 추적합니다.
        </p>

        {/* ── consensus package ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">consensus 패키지 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/consensus/ 패키지
consensus/
├── state.go            // State struct + receiveRoutine
├── reactor.go          // ConsensusReactor (P2P gossip)
├── msgs.go             // ConsensusMessage 타입
├── common_test.go
├── byzantine_test.go
├── replay.go           // WAL replay logic
├── replay_file.go
├── wal.go              // Write-Ahead Log
├── wal_generator.go
├── types/
│   ├── height_vote_set.go   // height별 vote 추적
│   ├── peer_round_state.go  // peer별 round state
│   └── reactor.go           // reactor 인터페이스
└── stat.go             // 통계

// 핵심 타입:
// 1. State (cs): 합의 상태 머신
//    - RoundState (현재 Height/Round)
//    - peerStates (각 peer 상태)
//    - internalMsgQueue (local events)
//    - peerMsgQueue (P2P events)
//    - timeoutTicker (timeouts)
//
// 2. ConsensusReactor: P2P 연결
//    - Reactor interface 구현
//    - channel별 message handler
//    - peer별 broadcast goroutine

// 작동 모델:
// receiveRoutine: single-threaded event loop
// - timeout, 이벤트, msg를 single goroutine에서 처리
// - 락 없이 결정적 상태 전이

// WAL (Write-Ahead Log):
// - 모든 consensus event 저장
// - 크래시 후 replay로 복구
// - "이미 서명한 vote" 재현 → 이중 서명 방지`}
        </pre>
        <p className="leading-7">
          consensus 패키지는 <strong>single-goroutine event loop</strong>.<br />
          receiveRoutine이 모든 event 직렬화 → 락 없이 결정적 전이.<br />
          WAL로 크래시 복구 + 이중 서명 방지.
        </p>
      </div>
    </section>
  );
}
