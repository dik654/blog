import { codeRefs } from "./codeRefs";
import ReceiveRoutineViz from "./viz/ReceiveRoutineViz";
import type { CodeRef } from "@/components/code/types";

export default function ReceiveRoutine({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="receive-routine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        receiveRoutine & handleMsg 디스패치
      </h2>
      <div className="not-prose mb-8">
        <ReceiveRoutineViz
          onOpenCode={(key) => onCodeRef(key, codeRefs[key])}
        />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── receiveRoutine 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          receiveRoutine — single-threaded event loop
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              <code>receiveRoutine</code> — 3가지 이벤트 소스
              (cometbft/consensus/state.go)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. Local messages</p>
                <p className="text-xs text-muted-foreground">
                  <code>internalMsgQueue</code> — 내가 발생시킨 vote/proposal
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  → <code>handleMsg(mi)</code>
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. P2P messages</p>
                <p className="text-xs text-muted-foreground">
                  <code>peerMsgQueue</code> — 다른 peer로부터
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  → <code>handleMsg(mi)</code>
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. Timeout 이벤트</p>
                <p className="text-xs text-muted-foreground">
                  <code>timeoutTicker.Chan()</code>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  → <code>handleTimeout(ti, rs)</code>
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">종료 시그널</p>
                <p className="text-xs text-muted-foreground">
                  <code>cs.Quit()</code> → return
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              주요 합의 입력을 한 goroutine에서 직렬화해 상태 전이 순서를 명확히
              한다. 프로세스 전체의 동시성이나 모든 lock을 없애는 설계는 아니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                <code>handleMsg</code> — WAL 기록 후 dispatch
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                1. <code>cs.wal.Write(mi)</code> — fsync로 디스크에 기록
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                2. 메시지 타입별 dispatch:
              </p>
              <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                <div className="bg-background/50 rounded px-2 py-1">
                  <code>*ProposalMessage</code> → <code>setProposal()</code>
                </div>
                <div className="bg-background/50 rounded px-2 py-1">
                  <code>*VoteMessage</code> → <code>tryAddVote()</code>
                </div>
                <div className="bg-background/50 rounded px-2 py-1">
                  <code>*BlockPartMessage</code> →{" "}
                  <code>addProposalBlockPart()</code>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Crash Recovery</p>
              <div className="grid grid-cols-1 gap-1 text-sm text-muted-foreground">
                <div className="bg-background/50 rounded px-2 py-1 text-xs">
                  1. 노드 재시작
                </div>
                <div className="bg-background/50 rounded px-2 py-1 text-xs">
                  2. WAL replay — <code>handleMsg</code> 다시 수행
                </div>
                <div className="bg-background/50 rounded px-2 py-1 text-xs">
                  3. 같은 상태 도달
                </div>
                <div className="bg-background/50 rounded px-2 py-1 text-xs">
                  4. 재구성한 상태에서 합의 진행 재개
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>receiveRoutine</code>은 local message, peer message, timeout을 한
          goroutine의 event loop로 모은다. 상태 전이를 직렬화하고 event를 처리
          전에 WAL에 기록하기 때문에 crash 후 같은 순서로 replay할 수 있다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 직렬화의 범위</strong> — 채널 선택으로 peer·local·timeout
          입력의 상태 전이 순서를 하나의 진입점에 모은다. 다만
          WAL replay는 중단 직전 흐름을 복원하지만, validator 이중 서명 안전성은
          영속 서명 상태와 단일 키 운영까지 포함한다.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 handleMsg 디스패치</strong> — ProposalMessage →
          setProposal, VoteMessage → tryAddVote로 전달한다.
          BlockPartMessage는 파트 조립 완성 시 enterPrevote로 즉시 전이.
        </p>
      </div>
    </section>
  );
}
