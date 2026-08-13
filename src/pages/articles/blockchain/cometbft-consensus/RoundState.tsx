import { codeRefs } from "./codeRefs";
import RoundStateViz from "./viz/RoundStateViz";
import type { CodeRef } from "@/components/code/types";

export default function RoundState({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="round-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">라운드 상태 머신 추적</h2>
      <div className="not-prose mb-8">
        <RoundStateViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── RoundState 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          RoundState 전체 필드
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              <code>RoundState</code> — cometbft/consensus/types/round_state.go
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg border border-blue-500/30 p-3">
                <p className="font-semibold text-xs text-blue-400 mb-2">
                  상태 머신 위치
                </p>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <code>Height</code>
                    <span className="text-muted-foreground">
                      <code>int64</code> — 현재 높이
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>Round</code>
                    <span className="text-muted-foreground">
                      <code>int32</code> — 현재 라운드
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>Step</code>
                    <span className="text-muted-foreground">
                      <code>RoundStepType</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>StartTime</code>
                    <span className="text-muted-foreground">
                      <code>time.Time</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>CommitTime</code>
                    <span className="text-muted-foreground">
                      <code>time.Time</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>Validators</code>
                    <span className="text-muted-foreground">
                      <code>*ValidatorSet</code>
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-green-500/30 p-3">
                <p className="font-semibold text-xs text-green-400 mb-2">
                  Proposal 관련
                </p>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <code>Proposal</code>
                    <span className="text-muted-foreground">
                      <code>*Proposal</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>ProposalBlock</code>
                    <span className="text-muted-foreground">
                      <code>*Block</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>ProposalBlockParts</code>
                    <span className="text-muted-foreground">
                      <code>*PartSet</code>
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-red-500/30 p-3">
                <p className="font-semibold text-xs text-red-400 mb-2">
                  Lock (safety 보장)
                </p>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <code>LockedRound</code>
                    <span className="text-muted-foreground">
                      <code>int32</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>LockedBlock</code>
                    <span className="text-muted-foreground">
                      <code>*Block</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>LockedBlockParts</code>
                    <span className="text-muted-foreground">
                      <code>*PartSet</code>
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  이미 약속한 block
                </p>
              </div>

              <div className="rounded-lg border border-orange-500/30 p-3">
                <p className="font-semibold text-xs text-orange-400 mb-2">
                  ValidBlock (liveness 보조)
                </p>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <code>ValidRound</code>
                    <span className="text-muted-foreground">
                      <code>int32</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>ValidBlock</code>
                    <span className="text-muted-foreground">
                      <code>*Block</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>ValidBlockParts</code>
                    <span className="text-muted-foreground">
                      <code>*PartSet</code>
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  재사용 가능 polka block
                </p>
              </div>

              <div className="rounded-lg border border-purple-500/30 p-3">
                <p className="font-semibold text-xs text-purple-400 mb-2">
                  Votes 집계
                </p>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <code>Votes</code>
                    <span className="text-muted-foreground">
                      <code>*HeightVoteSet</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>CommitRound</code>
                    <span className="text-muted-foreground">
                      <code>int32</code>
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  모든 round 투표 누적
                </p>
              </div>

              <div className="rounded-lg border border-border/60 p-3">
                <p className="font-semibold text-xs mb-2">
                  LastCommit (이전 블록)
                </p>
                <div className="space-y-0.5">
                  <div className="flex justify-between text-xs">
                    <code>LastCommit</code>
                    <span className="text-muted-foreground">
                      <code>*VoteSet</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>LastValidators</code>
                    <span className="text-muted-foreground">
                      <code>*ValidatorSet</code>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <code>TriggeredTimeoutPrecommit</code>
                    <span className="text-muted-foreground">
                      <code>bool</code>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          RoundState는 현재 height·round·step뿐 아니라 proposal, vote set,
          locked block과 valid block을 함께 보관하는 consensus state machine이다.
          Locked 상태가 safety를 지키는 동안 Valid 상태는 다음 round에서 이미
          검증한 block을 재사용해 liveness를 돕는다.
        </p>

        {/* ── enterPrevote ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          enterPrevote — Prevote 생성 로직
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              <code>defaultDoPrevote()</code> — 5단계 BFT safety 규칙
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. Lock 확인</p>
                <p className="text-xs text-muted-foreground">
                  <code>LockedBlock != nil</code> + proposal 일치? → prevote
                  locked. 불일치 → prevote nil
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">2. Proposal 존재</p>
                <p className="text-xs text-muted-foreground">
                  <code>ProposalBlock == nil</code> → prevote nil
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. ValidateBasic</p>
                <p className="text-xs text-muted-foreground">
                  잘못된 block → prevote nil
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">4. App 검증</p>
                <p className="text-xs text-muted-foreground">
                  <code>ProcessProposal</code> ABCI 호출 → ACCEPT 아니면 nil
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">5. 통과</p>
                <p className="text-xs text-muted-foreground">
                  <code>signAddVote(Prevote, block.Hash())</code>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-2">핵심 규칙</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center text-muted-foreground">
              <div className="bg-background rounded px-2 py-1.5">
                LockedBlock != nil → LockedBlock에만 prevote 가능
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                Proposal 불일치 → prevote nil
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                Invalid proposal → prevote nil
              </div>
              <div className="bg-background rounded px-2 py-1.5">
                Valid proposal → prevote block hash
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>defaultDoPrevote</code>는 lock이 있으면 그 block과 proposal의
          관계를 먼저 확인하고, lock이 없으면 <code>ProcessProposal</code>을
          통해 application-level 검증을 거친다. 이 조건을 통과한 block에만
          prevote하는 것이 BFT safety를 유지하는 핵심이다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 LockedBlock — 안전성의 핵심</strong> — 2/3+ polka 블록에
          lock을 설정한 뒤, 정당한 unlock 조건이 생기기 전까지 상충하는 block에
          투표하지 않아 두 값의 동시 commit을 막는다.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 ValidBlock — liveness 보조</strong> — Polka를 본 블록을
          ValidBlock에 저장하면 다음 round의 proposer가 이를 재사용할 수 있어,
          새 block을 만들고 다시 전파하는 비용을 줄일 수 있다.
        </p>
      </div>
    </section>
  );
}
