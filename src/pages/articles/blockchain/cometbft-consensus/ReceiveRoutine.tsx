import { codeRefs } from './codeRefs';
import ReceiveRoutineViz from './viz/ReceiveRoutineViz';
import type { CodeRef } from '@/components/code/types';

export default function ReceiveRoutine({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="receive-routine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">receiveRoutine & handleMsg 디스패치</h2>
      <div className="not-prose mb-8">
        <ReceiveRoutineViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── receiveRoutine 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">receiveRoutine — single-threaded event loop</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/consensus/state.go
func (cs *State) receiveRoutine(maxSteps int) {
    for {
        select {
        // 3가지 이벤트 소스:

        // 1. local messages (내가 발생시킨 vote/proposal)
        case mi := <-cs.internalMsgQueue:
            cs.handleMsg(mi)  // WAL 기록 후 처리

        // 2. P2P messages (다른 peer로부터)
        case mi := <-cs.peerMsgQueue:
            cs.handleMsg(mi)

        // 3. timeout 이벤트
        case ti := <-cs.timeoutTicker.Chan():
            cs.handleTimeout(ti, rs)

        // 종료 시그널
        case <-cs.Quit():
            return
        }
    }
}

// 중요 특성:
// - 단일 goroutine (락 불필요)
// - 메시지 직렬화 (event ordering 보장)
// - 결정적 상태 전이

// WAL 기록:
func (cs *State) handleMsg(mi msgInfo) {
    // 1. WAL에 기록 (fsync)
    cs.wal.Write(mi)

    // 2. 메시지 타입별 dispatch
    switch msg := mi.Msg.(type) {
    case *ProposalMessage:
        cs.setProposal(msg.Proposal)
    case *VoteMessage:
        cs.tryAddVote(msg.Vote, mi.PeerID)
    case *BlockPartMessage:
        cs.addProposalBlockPart(msg, mi.PeerID)
    }
}

// Crash recovery:
// 1. 노드 재시작
// 2. WAL replay (handleMsg 다시 수행)
// 3. 같은 상태 도달
// 4. 이미 서명한 vote 재방송 → 이중 서명 X`}
        </pre>
        <p className="leading-7">
          receiveRoutine이 <strong>3-event-source event loop</strong>.<br />
          internal/peer msg + timeout → single goroutine 처리.<br />
          WAL 기록 후 처리 → crash recovery 안전.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 단일 goroutine 설계</strong> — 락 없이 채널 직렬화로 동시성 버그 원천 차단.<br />
          internalMsgQueue → WriteSync(fsync) → 크래시 후 자신의 서명 복구로 이중 서명 방지.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 handleMsg 디스패치</strong> — ProposalMessage → setProposal, VoteMessage → tryAddVote.<br />
          BlockPartMessage는 파트 조립 완성 시 enterPrevote로 즉시 전이.
        </p>
      </div>
    </section>
  );
}
