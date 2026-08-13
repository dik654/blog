import ContextViz from "./viz/ContextViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Consensus state machine은 proposal·prevote·precommit을 round마다 진행한다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          CometBFT는 proposal·vote·timeout 이벤트를 height/round/step 상태
          머신에 반영한다.
          <code>receiveRoutine</code>은 주요 상태 전이를 직렬화하는
          진입점이지만, 네트워크·타임·WAL·애플리케이션 호출까지 프로세스 전체가
          하나의 goroutine으로 돌아간다는 뜻은 아니다.
        </p>

        {/* ── consensus package ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          consensus 패키지 구조
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              cometbft/consensus/ 패키지
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">state.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  State struct + receiveRoutine
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">reactor.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ConsensusReactor (P2P gossip)
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">msgs.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ConsensusMessage 타입
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">replay.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  WAL replay logic
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">wal.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Write-Ahead Log
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">stat.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">통계</p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">types/height_vote_set.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  height별 vote 추적
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">types/peer_round_state.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  peer별 round state
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <code className="text-xs">types/reactor.go</code>
                <p className="text-xs text-muted-foreground mt-0.5">
                  reactor 인터페이스
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                핵심 타입 1: <code>State</code> (cs) — 합의 상태 머신
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <code>RoundState</code> — 현재 Height/Round
                </li>
                <li>
                  <code>peerStates</code> — 각 peer 상태
                </li>
                <li>
                  <code>internalMsgQueue</code> — local events
                </li>
                <li>
                  <code>peerMsgQueue</code> — P2P events
                </li>
                <li>
                  <code>timeoutTicker</code> — timeouts
                </li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                핵심 타입 2: <code>ConsensusReactor</code> — P2P 연결
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Reactor interface 구현</li>
                <li>channel별 message handler</li>
                <li>peer별 broadcast goroutine</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                작동 모델: receiveRoutine
              </p>
              <p className="text-sm text-muted-foreground">
                합의 상태 전이의 주요 입력을 한 루프에서 직렬화해 event
                ordering을 명확하게 한다. 공유 컴포넌트와 백그라운드 작업까지
                lock이 불필요하다는 의미는 아니다.
              </p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                WAL (Write-Ahead Log)
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>모든 consensus event 저장</li>
                <li>크래시 후 replay로 복구</li>
                <li>중단 전 이벤트를 replay해 합의 진행 복구</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          consensus 패키지는 <strong>상태 전이 직렬화</strong>를 통해 합의
          순서를 명확히 하며,
          WAL은 중단 후 replay를 위한 내구성 장치이고, 이중 서명 방지는 서명자의
          영속 상태·투표 규칙·운영 구성과 함께 보아야 한다.
        </p>
      </div>
    </section>
  );
}
