import { codeRefs } from "./codeRefs";
import VoteHandlingViz from "./viz/VoteHandlingViz";
import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function VoteHandling({ onCodeRef }: Props) {
  return (
    <section id="vote-handling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        투표 처리: tryAddVote → addVote → 임계값 감지
      </h2>
      <div className="not-prose mb-8">
        <VoteHandlingViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── tryAddVote 구현 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          tryAddVote — 3단계 검증 + Evidence
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-semibold mb-3">
              <code>tryAddVote()</code> — 3-stage flow
              (cometbft/consensus/state.go)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">1. Validate</p>
                <p className="text-xs text-muted-foreground">
                  <code>validateVote(vote)</code> — ValidateBasic + height/round
                  체크. 실패 시 즉시 반환
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">
                  2. addVote (Equivocation 감지)
                </p>
                <p className="text-xs text-muted-foreground">
                  <code>addVote(vote, peerID)</code> — VoteSet 추가.{" "}
                  <code>ErrVoteConflictingVotes</code> 시{" "}
                  <code>DuplicateVoteEvidence</code> 생성 →{" "}
                  <code>evpool.AddEvidence()</code>
                </p>
              </div>
              <div className="bg-background rounded px-3 py-2">
                <p className="font-medium text-xs mb-1">3. 2/3+ 임계값 체크</p>
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground/80">3a.</strong>{" "}
                  <code>TwoThirdsMajority()</code> — 특정 블록 2/3+ →{" "}
                  <code>enterCommit()</code>
                  {" "}
                  <strong className="text-foreground/80">3b.</strong>{" "}
                  <code>HasTwoThirdsAny()</code> — 아무 블록 2/3+ →{" "}
                  <code>enterPrecommitWait()</code>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">
                Conflicting Vote → Evidence 생성
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex justify-between text-xs">
                  <span>VoteA</span>
                  <span>기존 투표</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>VoteB</span>
                  <span>새 투표 (다른 BlockID)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>TotalVotingPower</span>
                  <span>
                    <code>cs.Validators.TotalVotingPower()</code>
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>ValidatorPower</span>
                  <span>
                    <code>validator.VotingPower</code>
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">2단계 임계값</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  <strong className="text-foreground/80">
                    HasTwoThirdsAny
                  </strong>{" "}
                  — 2/3+ 투표 수집됨 (block 무관) → timeout 후 nil commit
                  (liveness)
                </li>
                <li>
                  <strong className="text-foreground/80">
                    TwoThirdsMajority
                  </strong>{" "}
                  — 2/3+ 같은 block 투표 → 즉시 상태 전이 (safety + liveness)
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>tryAddVote</code>는 서명을 검증하고 vote set에 투표를 추가한 뒤
          2/3 threshold를 평가한다. 같은 validator의 conflicting vote가
          발견되면 evidence pool에 전달할 입력을 만들며, 특정 block의 2/3와
          어떤 값이든 모인 2/3를 구분해 다음 상태 전이를 결정한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 2단계 임계값</strong> — HasTwoThirdsAny(아무 블록이든
          2/3)와 TwoThirdsMajority(특정 블록 2/3)를 구분한다.
          HasTwoThirdsAny → 타임아웃 스케줄(아직 합의 미달), TwoThirdsMajority →
          즉시 상태 전이.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 이중 투표 방어</strong> — tryAddVote에서
          <code>ErrVoteConflictingVotes</code>를 감지하고, evpool에 보고된 충돌
          vote는 검증·공유·블록 포함 대상이 된다.
          CometBFT는 evidence를 ABCI에 전달하며, 실제 slash·jail·무처리 선택은
          애플리케이션의 책임이다.
        </p>
      </div>
    </section>
  );
}
