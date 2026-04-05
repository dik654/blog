import VoteSetViz from './viz/VoteSetViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function VoteCommit({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="vote-commit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Vote · VoteSet · 2/3+ 판정</h2>
      <div className="not-prose mb-8">
        <VoteSetViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Vote 구조 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">Vote 구조 — 9 필드</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/types/vote.go
type Vote struct {
    Type             SignedMsgType  // Prevote(1) or Precommit(2)
    Height           int64           // 블록 높이
    Round            int32           // 현재 라운드
    BlockID          BlockID         // 투표 대상 블록
    Timestamp        time.Time       // 서명 시각
    ValidatorAddress Address         // 서명자 주소
    ValidatorIndex   int32           // ValidatorSet 내 인덱스
    Signature        []byte          // Ed25519 서명
    Extension        []byte          // ABCI 2.0+ vote extension
    ExtensionSignature []byte        // extension 서명
}

// Vote 서명 흐름:
// 1. CanonicalVote 생성 (결정적 직렬화)
// 2. Protobuf encode
// 3. Validator의 Ed25519 키로 서명
// 4. 서명 + Vote 본체를 네트워크 방송

// CanonicalVote (서명 대상):
type CanonicalVote struct {
    Type       SignedMsgType
    Height     int64
    Round      int64
    BlockID    *CanonicalBlockID  // 순서 무관
    Timestamp  time.Time
    ChainID    string
}

// Timestamp 역할:
// - 네트워크 시간 동기화
// - byzantine 탐지 (심한 drift)
// - Nakamoto로 불리는 median 시간 계산

// Vote 타입:
// 1. Prevote: 블록 타당성 투표 (1st phase)
// 2. Precommit: 최종 커밋 투표 (2nd phase)
// 3. Proposal: proposer의 블록 제안 서명`}
        </pre>
        <p className="leading-7">
          Vote는 <strong>9 필드 + Ed25519 서명</strong>.<br />
          CanonicalVote로 결정적 직렬화 → 서명 결정성 보장.<br />
          Prevote/Precommit 2가지 타입으로 3-phase commit 구성.
        </p>

        {/* ── VoteSet 2/3+ 판정 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">VoteSet — 2/3+ 집계 & 판정</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// VoteSet: 특정 높이/라운드/타입의 Vote 집계
type VoteSet struct {
    chainID       string
    height        int64
    round         int32
    signedMsgType SignedMsgType

    valSet        *ValidatorSet

    mtx           cmtsync.Mutex
    votesBitArray *bits.BitArray          // validator별 투표 여부
    votes         []*Vote                  // index → Vote
    sum           int64                    // 집계된 voting power
    maj23         *BlockID                 // +2/3 달성 시 BlockID
    votesByBlock  map[string]*blockVotes   // blockKey → votes
    peerMaj23s    map[P2PID]BlockID        // peer별 maj23 알림
}

type blockVotes struct {
    peerMaj23 bool
    bitArray  *bits.BitArray
    votes     []*Vote
    sum       int64
}

// AddVote 동작:
func (v *VoteSet) AddVote(vote *Vote) (bool, error) {
    // 1. 중복 체크 (equivocation 감지)
    if v.votesBitArray.GetIndex(vote.ValidatorIndex) {
        existing := v.votes[vote.ValidatorIndex]
        if existing.BlockID != vote.BlockID {
            return false, ErrEquivocation  // slash 대상!
        }
    }

    // 2. blockKey별 분리 집계
    blockKey := vote.BlockID.Key()
    if v.votesByBlock[blockKey] == nil {
        v.votesByBlock[blockKey] = newBlockVotes(...)
    }
    v.votesByBlock[blockKey].votes[vote.ValidatorIndex] = vote
    v.votesByBlock[blockKey].sum += vote.ValidatorPower

    // 3. 2/3+ 판정
    if v.votesByBlock[blockKey].sum * 3 > v.valSet.TotalVotingPower() * 2 {
        v.maj23 = &vote.BlockID  // maj23 달성!
    }

    return true, nil
}

// 왜 blockKey별 분리 집계?
// 한 라운드에 여러 블록 투표 가능 (byzantine nodes)
// 각 블록별 sum 분리 → 정확한 2/3+ 판정
// 또한 byzantine equivocation 즉시 감지`}
        </pre>
        <p className="leading-7">
          VoteSet이 <strong>blockKey별 분리 집계</strong>.<br />
          byzantine nodes가 여러 블록 투표 가능 → 분리 집계 필수.<br />
          2/3+ 달성 → maj23 → polka/commit 진전.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} votesByBlock 맵을 쓰는 이유</strong> — 같은 라운드에서 여러 블록에 투표가 분산될 수 있다.<br />
          blockKey별로 sum을 분리 집계해야 정확한 2/3+ 판정이 가능하다.<br />
          equivocation(이중 투표)도 이 구조에서 탐지한다.
        </p>
      </div>
    </section>
  );
}
