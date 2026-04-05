import { codeRefs } from './codeRefs';
import RoundStateViz from './viz/RoundStateViz';
import type { CodeRef } from '@/components/code/types';

export default function RoundState({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="round-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">라운드 상태 머신 추적</h2>
      <div className="not-prose mb-8">
        <RoundStateViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── RoundState 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">RoundState 전체 필드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/consensus/types/round_state.go
type RoundState struct {
    Height int64                  // 현재 높이
    Round  int32                  // 현재 라운드
    Step   RoundStepType          // 현재 단계

    StartTime time.Time           // round 시작 시각
    CommitTime time.Time          // 마지막 commit 시각
    Validators *ValidatorSet      // 현재 validators

    // Proposal 관련
    Proposal *Proposal            // 현재 라운드 proposal
    ProposalBlock *Block          // proposal block
    ProposalBlockParts *PartSet   // 블록 파트 수집

    // Lock (safety 보장)
    LockedRound int32             // lock된 round
    LockedBlock *Block            // locked block
    LockedBlockParts *PartSet

    // ValidBlock (liveness 보조)
    ValidRound int32              // 가장 최근 polka round
    ValidBlock *Block             // polka 달성한 block
    ValidBlockParts *PartSet

    // Votes 집계
    Votes *HeightVoteSet          // 모든 round의 vote 집계
    CommitRound int32             // +2/3 precommit 달성 round

    // LastCommit (이전 블록)
    LastCommit *VoteSet           // 이전 블록의 commit
    LastValidators *ValidatorSet  // 이전 블록 validators

    // Triggered timeouts
    TriggeredTimeoutPrecommit bool
}

// 필드 역할:
// - Height/Round/Step: 상태 머신 위치
// - Proposal*: 현재 라운드 proposal 정보
// - Locked*: safety 보장 (이미 약속한 block)
// - Valid*: liveness 보조 (재사용 가능 block)
// - Votes: 모든 round 투표 누적
// - LastCommit: 이전 높이 투표 집계`}
        </pre>
        <p className="leading-7">
          RoundState는 <strong>~15 필드 상태 머신</strong>.<br />
          Locked(safety) + Valid(liveness) 분리 — BFT의 trade-off 구현.<br />
          각 필드가 Tendermint 논문의 state variable과 대응.
        </p>

        {/* ── enterPrevote ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">enterPrevote — Prevote 생성 로직</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/consensus/state.go: defaultDoPrevote
func (cs *State) defaultDoPrevote(height int64, round int32) {
    // 1. Lock 확인
    if cs.LockedBlock != nil {
        // Lock된 block과 proposal이 일치?
        if cs.ProposalBlock.HashesTo(cs.LockedBlock.Hash()) {
            // 일치 → prevote locked
            cs.signAddVote(Prevote, cs.LockedBlock.Hash())
            return
        }

        // 일치 안 함 → prevote nil
        cs.signAddVote(Prevote, nil)
        return
    }

    // 2. Proposal 검증
    if cs.ProposalBlock == nil {
        // proposal 없음 → prevote nil
        cs.signAddVote(Prevote, nil)
        return
    }

    // 3. ValidateBasic
    if err := cs.ProposalBlock.ValidateBasic(); err != nil {
        // 잘못된 block → prevote nil
        cs.signAddVote(Prevote, nil)
        return
    }

    // 4. App 검증 (ProcessProposal ABCI 호출)
    resp, err := cs.blockExec.ProcessProposal(cs.ProposalBlock)
    if err != nil || resp.Status != ACCEPT {
        cs.signAddVote(Prevote, nil)
        return
    }

    // 5. 모든 검증 통과 → prevote block
    cs.signAddVote(Prevote, cs.ProposalBlock.Hash())
}

// 핵심 규칙:
// - LockedBlock != nil → LockedBlock에만 prevote 가능
// - Proposal ∉ LockedBlock → prevote nil
// - Invalid proposal → prevote nil
// - Valid proposal → prevote block hash`}
        </pre>
        <p className="leading-7">
          <code>defaultDoPrevote</code>가 <strong>BFT safety 규칙</strong>.<br />
          LockedBlock과 proposal 비교 → 일치만 prevote.<br />
          ProcessProposal (ABCI)로 app-level validation.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 LockedBlock — 안전성의 핵심</strong> — 2/3+ polka 블록에 Lock 설정.<br />
          잠긴 후 다른 블록 prevote 불가 → 두 블록 동시 확정 원천 차단.
        </p>
        <p className="text-sm mt-3 border-l-2 border-sky-500/50 pl-3">
          <strong>💡 ValidBlock — liveness 보조</strong> — Polka를 본 블록을 ValidBlock에 저장.<br />
          다음 라운드 제안자가 ValidBlock을 재사용 → 불필요한 재전송 방지.
        </p>
      </div>
    </section>
  );
}
