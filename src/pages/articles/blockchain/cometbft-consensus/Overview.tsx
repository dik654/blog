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
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">cometbft/consensus/ 패키지</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2"><code className="text-xs">state.go</code><p className="text-xs text-muted-foreground mt-0.5">State struct + receiveRoutine</p></div>
              <div className="bg-background rounded px-3 py-2"><code className="text-xs">reactor.go</code><p className="text-xs text-muted-foreground mt-0.5">ConsensusReactor (P2P gossip)</p></div>
              <div className="bg-background rounded px-3 py-2"><code className="text-xs">msgs.go</code><p className="text-xs text-muted-foreground mt-0.5">ConsensusMessage 타입</p></div>
              <div className="bg-background rounded px-3 py-2"><code className="text-xs">replay.go</code><p className="text-xs text-muted-foreground mt-0.5">WAL replay logic</p></div>
              <div className="bg-background rounded px-3 py-2"><code className="text-xs">wal.go</code><p className="text-xs text-muted-foreground mt-0.5">Write-Ahead Log</p></div>
              <div className="bg-background rounded px-3 py-2"><code className="text-xs">stat.go</code><p className="text-xs text-muted-foreground mt-0.5">통계</p></div>
              <div className="bg-background rounded px-3 py-2"><code className="text-xs">types/height_vote_set.go</code><p className="text-xs text-muted-foreground mt-0.5">height별 vote 추적</p></div>
              <div className="bg-background rounded px-3 py-2"><code className="text-xs">types/peer_round_state.go</code><p className="text-xs text-muted-foreground mt-0.5">peer별 round state</p></div>
              <div className="bg-background rounded px-3 py-2"><code className="text-xs">types/reactor.go</code><p className="text-xs text-muted-foreground mt-0.5">reactor 인터페이스</p></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">핵심 타입 1: <code>State</code> (cs) — 합의 상태 머신</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><code>RoundState</code> — 현재 Height/Round</li>
                <li><code>peerStates</code> — 각 peer 상태</li>
                <li><code>internalMsgQueue</code> — local events</li>
                <li><code>peerMsgQueue</code> — P2P events</li>
                <li><code>timeoutTicker</code> — timeouts</li>
              </ul>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">핵심 타입 2: <code>ConsensusReactor</code> — P2P 연결</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Reactor interface 구현</li>
                <li>channel별 message handler</li>
                <li>peer별 broadcast goroutine</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">작동 모델: receiveRoutine</p>
              <p className="text-sm text-muted-foreground">single-threaded event loop — timeout, 이벤트, msg를 single goroutine에서 처리. 락 없이 결정적 상태 전이</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">WAL (Write-Ahead Log)</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>모든 consensus event 저장</li>
                <li>크래시 후 replay로 복구</li>
                <li>"이미 서명한 vote" 재현 → 이중 서명 방지</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          consensus 패키지는 <strong>single-goroutine event loop</strong>.<br />
          receiveRoutine이 모든 event 직렬화 → 락 없이 결정적 전이.<br />
          WAL로 크래시 복구 + 이중 서명 방지.
        </p>
      </div>
    </section>
  );
}
