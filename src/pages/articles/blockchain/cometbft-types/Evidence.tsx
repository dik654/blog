import EvidenceViz from './viz/EvidenceViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Evidence({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="evidence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Evidence — 비잔틴 증거</h2>
      <div className="not-prose mb-8">
        <EvidenceViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Evidence 타입 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Evidence 종류 — 2가지 비잔틴 행위</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/types/evidence.go
type Evidence interface {
    ABCI() []abci.Misbehavior
    Bytes() []byte
    Hash() []byte
    Height() int64
    String() string
    Time() time.Time
    ValidateBasic() error
}

// 1. DuplicateVoteEvidence (equivocation)
// 같은 (height, round, type)에 2개 다른 block 투표
type DuplicateVoteEvidence struct {
    VoteA            *Vote     // 첫 번째 투표
    VoteB            *Vote     // 두 번째 투표
    TotalVotingPower int64
    ValidatorPower   int64
    Timestamp        time.Time
}

// 검증:
// - VoteA.Height == VoteB.Height
// - VoteA.Round == VoteB.Round
// - VoteA.Type == VoteB.Type
// - VoteA.ValidatorAddress == VoteB.ValidatorAddress
// - VoteA.BlockID != VoteB.BlockID
// - 두 Vote 모두 유효한 서명

// 2. LightClientAttackEvidence
// light client 공격 (conflicting headers)
type LightClientAttackEvidence struct {
    ConflictingBlock *LightBlock         // 공격자 블록
    CommonHeight     int64                // 공통 조상 높이
    ByzantineValidators []*Validator     // byzantine 검증자 목록
    TotalVotingPower int64
    Timestamp        time.Time
}

// 공격 유형:
// - Lunatic: 다른 state 기반 블록 제안
// - Equivocation: conflicting 블록들에 서명
// - Amnesia: 이전 commit 무시하고 재투표

// 탐지 시점:
// - 일반 노드: P2P로 받은 Vote 비교
// - Light client: 2개 full node의 응답 비교`}
        </pre>
        <p className="leading-7">
          Evidence는 <strong>2가지 비잔틴 행위 증거</strong>.<br />
          DuplicateVote (equivocation) + LightClientAttack (reorg 공격).<br />
          Block에 포함되어 영구 기록 → slashing 판단 근거.
        </p>

        {/* ── Evidence Pool & Slashing ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Evidence Lifecycle — 탐지 → Block 포함 → Slash</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Evidence 생명주기:

// 1. 탐지 (P2P 메시지 수신 중)
// - VoteSet.AddVote에서 equivocation 감지
// - DuplicateVoteEvidence 생성
// - EvidencePool에 추가

// 2. Gossip (다른 피어에게 전파)
// - Evidence reactor가 모든 peer에게 방송
// - 누가 먼저 블록에 포함시키는지 경쟁

// 3. Block 포함 (Proposer가 다음 블록에 추가)
func (ms *State) createProposalBlock() *Block {
    evs := ms.evpool.PendingEvidence(10)  // max 10 per block
    block.Evidence = EvidenceData{Evidence: evs}
    return block
}

// 4. Validation (모든 노드)
// - ValidateBlock에서 Evidence 재검증
// - evidence.ValidateBasic()
// - 서명 검증
// - 유효하지 않으면 블록 거부

// 5. ABCI Commit에서 slashing
// - ABCI FinalizeBlock에 Misbehavior 전달
// - Cosmos SDK: slashing module이 stake 차감
// - 보통 5% stake slash + tombstone (영구 제외)

// Slashing 효과:
// - stake 5% loss (Cosmos Hub 기준)
// - validator tombstone (다시는 activate 불가)
// - delegator stake 동시 slash

// Evidence max age:
// - UnbondingPeriod 내 (~21일)
// - 이 기간 지나면 Evidence 거부
// - 이유: unbond 후 stake 없어 slash 불가`}
        </pre>
        <p className="leading-7">
          Evidence lifecycle: <strong>탐지 → gossip → block 포함 → slashing</strong>.<br />
          Block에 최대 10개 Evidence → 모든 노드 동일 slashing.<br />
          UnbondingPeriod(~21일) 이내 Evidence만 유효.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Evidence가 Block에 포함되는 이유</strong> — 비잔틴 행위의 증거를 블록체인에 영구 기록하면 모든 노드가 동일한 슬래싱 판단을 내릴 수 있다.<br />
          off-chain 신고 방식은 합의 없이 불일치가 발생할 수 있어 부적합하다.
        </p>
      </div>
    </section>
  );
}
