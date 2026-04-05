import { codeRefs } from './codeRefs';
import VoteHandlingViz from './viz/VoteHandlingViz';
import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function VoteHandling({ onCodeRef }: Props) {
  return (
    <section id="vote-handling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">투표 처리: tryAddVote → addVote → 임계값 감지</h2>
      <div className="not-prose mb-8">
        <VoteHandlingViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── tryAddVote 구현 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">tryAddVote — 3단계 검증 + Evidence</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/consensus/state.go
func (cs *State) tryAddVote(vote *Vote, peerID p2p.ID) (bool, error) {
    // 1. ValidateBasic + height/round 체크
    if err := cs.validateVote(vote); err != nil {
        return false, err  // invalid vote
    }

    // 2. addVote: Equivocation 감지 + VoteSet 추가
    added, err := cs.addVote(vote, peerID)

    if err != nil {
        // Conflicting vote detected!
        if errors.Is(err, ErrVoteConflictingVotes) {
            // DuplicateVoteEvidence 생성
            evidence := &DuplicateVoteEvidence{
                VoteA: existing,
                VoteB: vote,
                TotalVotingPower: cs.Validators.TotalVotingPower(),
                ValidatorPower: validator.VotingPower,
                Timestamp: cs.state.LastBlockTime,
            }
            cs.evpool.AddEvidence(evidence)
            return false, err
        }
        return added, err
    }

    // 3. 2/3+ 임계값 체크 (2단계)
    if precommits := cs.Votes.Precommits(vote.Round); precommits != nil {
        // 3a. +2/3 precommit for specific block → commit
        if blockID, ok := precommits.TwoThirdsMajority(); ok && !blockID.IsZero() {
            cs.enterCommit(vote.Height, vote.Round)
            return added, nil
        }
        // 3b. +2/3 ANY precommit → timeout 대기
        if precommits.HasTwoThirdsAny() {
            cs.enterPrecommitWait(vote.Height, vote.Round)
            return added, nil
        }
    }

    return added, nil
}

// 2단계 임계값:
// - HasTwoThirdsAny: "2/3+ 투표 수집됨" (block 무관)
//   → timeout 후 nil commit (liveness)
// - TwoThirdsMajority: "2/3+ 같은 block 투표"
//   → 즉시 상태 전이 (safety + liveness)`}
        </pre>
        <p className="leading-7">
          tryAddVote의 <strong>3-stage flow</strong>: validate → addVote → threshold.<br />
          Conflicting vote → DuplicateVoteEvidence 자동 생성.<br />
          2/3+ threshold 2가지로 safety/liveness 구분.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 2단계 임계값</strong> — HasTwoThirdsAny(아무 블록이든 2/3)와 TwoThirdsMajority(특정 블록 2/3) 구분.<br />
          HasTwoThirdsAny → 타임아웃 스케줄(아직 합의 미달), TwoThirdsMajority → 즉시 상태 전이.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 이중 투표 방어</strong> — tryAddVote에서 ErrVoteConflictingVotes 감지.<br />
          evpool.ReportConflictingVotes로 증거 수집 → 다음 블록에 포함하여 슬래싱 트리거.
        </p>
      </div>
    </section>
  );
}
