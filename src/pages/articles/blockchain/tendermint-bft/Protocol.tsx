import ProtocolViz from './viz/ProtocolViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const roundCode = `Tendermint 라운드 구조:

Height H, Round R:
  1. Propose (proposer = validators[H+R % n])
     → 블록 B를 제안 (타임아웃: TimeoutPropose)

  2. Prevote
     → 유효한 제안 수신 시 Prevote(B)
     → 타임아웃 또는 무효 시 Prevote(nil)

  3. Precommit
     → +2/3 Prevote(B) 수신 = Polka → Precommit(B)
     → +2/3 Prevote(nil) → Precommit(nil)

  4. 결과
     → +2/3 Precommit(B) → Commit(B) → Height+1
     → 그 외 → Round+1 (자동 진행)`;

export default function Protocol() {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프로토콜 흐름</h2>
      <div className="not-prose mb-8"><ProtocolViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Buchman, Kwon, Milosevic — 2018 arXiv" citeKey={1} type="paper"
          href="https://arxiv.org/abs/1807.04938">
          <p className="italic">
            "Tendermint is the first BFT consensus protocol deployed at scale in a blockchain setting."
          </p>
        </CitationBlock>

        <CodePanel title="라운드 구조" code={roundCode}
          annotations={[
            { lines: [4, 5], color: 'sky', note: 'Propose: 결정론적 제안자' },
            { lines: [7, 9], color: 'emerald', note: 'Prevote: 유효성 확인' },
            { lines: [11, 13], color: 'amber', note: 'Precommit: Polka 기반 잠금' },
            { lines: [15, 17], color: 'violet', note: '결과: Commit 또는 Round+1' },
          ]} />

        {/* ── Propose Step ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 1: Propose</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Propose Step 상세:
//
// 1. Proposer 선정:
//    proposer(H, R) = validators sorted by accum
//    accum은 round마다 voting_power 증감
//    (다음 round proposer: 다른 validator)
//
// 2. Proposer가 block 생성:
//    block.header = {
//        height: H,
//        timestamp: now,
//        last_block_id: previous block hash,
//        validators_hash: ...,
//        proposer_address: self,
//    }
//    block.txs = mempool에서 가져옴
//    block.last_commit = H-1의 precommits
//
// 3. Proposal 서명:
//    signed_proposal = sign(Proposal {
//        height: H, round: R,
//        block_id: hash(block),
//        pol_round: lockedRound (-1 if none),
//    })
//
// 4. POL (Proof of Lock) round:
//    - 이전에 locked block 재제안 시
//    - pol_round = lockedRound
//    - 나머지는 -1
//
// 5. Proposer → all validators:
//    gossip Proposal + block
//
// 6. Timeout:
//    TimeoutPropose = 3s (default)
//    timeout 시 prevote(nil)

// 다른 validators 수신 시:
// - proposer가 correct 검증
// - proposal signature 검증
// - block validity 검증 (app via ABCI)
// - pol_round 검증 (locking 규칙)

// 유효성 확인 실패 시 → prevote(nil)
// 유효성 확인 성공 + not locked → prevote(B)
// locked + lockedValue == B → prevote(B)
// locked + different B → prevote(lockedValue)`}
        </pre>
        <p className="leading-7">
          Propose = <strong>proposer가 block 생성 + gossip</strong>.<br />
          proposer는 deterministic — accum 기반 weighted round-robin.<br />
          POL round는 locking 메커니즘의 핵심 (다음 섹션).
        </p>

        {/* ── Prevote Step ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 2: Prevote</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prevote Step 상세:
//
// 1. Validator가 proposal 받은 후:
//    - if valid + not locked: prevote(B)
//    - if locked on B: prevote(B)
//    - if locked on B' ≠ B: prevote(lockedValue)
//      (단, proposal의 pol_round가 lockedRound보다
//       크면 unlock 후 prevote(B))
//    - if invalid or timeout: prevote(nil)
//
// 2. Prevote 메시지:
//    signed_vote = sign(Vote {
//        type: Prevote,
//        height: H, round: R,
//        block_id: B (or nil),
//    })
//
// 3. Gossip to all validators
//
// 4. 각 validator가 수집:
//    - track prevotes per (H, R, block_id)
//    - 2/3+ prevote for same B → "polka"
//    - 2/3+ prevote(nil) → "nil polka"
//    - 아무 polka 없으면 → mixed
//
// 5. Timeout:
//    TimeoutPrevote = 1s (default)
//    2/3+ prevotes 수신 후 timeout 시작
//    (polka 기다림 or nil polka 기다림)
//
// 6. 전이:
//    - 2/3+ prevote(B) → enterPrecommit with B
//    - 2/3+ prevote(nil) → enterPrecommit with nil
//    - timeout (mixed votes) → enterPrecommit with nil

// Polka 의미:
// polka = 2/3+ prevote for same block
// "polka dance" 메타포 (동그랗게 춤추듯)
// safety: locking의 기준
// liveness: precommit 진행 가능 신호

// 2/3+ voting power:
// n validators with stakes s_1, ..., s_n
// S = Σ s_i (total stake)
// threshold = ceil(2S/3) + 1
// 또는 > 2S/3 (strictly greater)

// 실제 Cosmos:
// voting_power = stake / 10^6 (precision)
// 2/3+ = effective BFT threshold`}
        </pre>
        <p className="leading-7">
          Prevote = <strong>block validity + locking 반영</strong>.<br />
          2/3+ 같은 B prevote = "polka" (locking 기준).<br />
          timeout 후 precommit 진입 — polka 여부에 따라 다른 precommit.
        </p>

        {/* ── Precommit Step ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 3: Precommit + Commit</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Precommit Step 상세:
//
// 1. Validator가 enterPrecommit 진입:
//    - polka(B) 확인됨 → precommit(B) + lock(B, R)
//    - polka(nil) → precommit(nil) + unlock
//    - 2/3+ prevote but mixed → precommit(nil)
//
// 2. Precommit 메시지:
//    signed_vote = sign(Vote {
//        type: Precommit,
//        height: H, round: R,
//        block_id: B (or nil),
//    })
//
// 3. Gossip to all
//
// 4. Commit 조건:
//    2/3+ precommit(B) for same B → commit
//    → enterCommit with B
//
// 5. Commit Step:
//    - apply block B to state machine (ABCI)
//    - update validator set
//    - increment height
//    - reset round to 0
//    - enter new height's propose step
//
// 6. Timeout:
//    TimeoutPrecommit = 1s (default)
//    2/3+ precommits 수신 후 timeout
//    commit 안 되면 round++

// Round 증가 조건:
// - 2/3+ precommit but < 2/3 for any single B
// - mixed precommits (some B, some nil, some other)
// - timeout 발생
// → round += 1, 새 proposer, 재시작

// Exponential backoff (timeout):
// TimeoutPropose(R) = 3s + R * 500ms
// TimeoutPrevote(R) = 1s + R * 500ms
// TimeoutPrecommit(R) = 1s + R * 500ms
// round 증가할수록 timeout 길어짐 (liveness)

// Block finality:
// - commit 즉시 block은 finalized
// - revert 불가 (BFT safety)
// - instant finality (1-3초)

// 실제 지연 (4 messages):
// 1. Propose (propagation): ~200ms
// 2. Prevote (aggregation): ~500ms
// 3. Precommit (aggregation): ~500ms
// 4. Commit (storage): ~200ms
// 총: ~1.4-2초 per block`}
        </pre>
        <p className="leading-7">
          Precommit = <strong>2/3+ prevote 확인 후 commit 의사 표명</strong>.<br />
          2/3+ precommit → block finalized (revert 불가).<br />
          timeout/mixed → round++, 새 proposer 재시도.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 4 step인가 (PBFT 3-phase보다 많음)</strong> — propose와 commit 분리.<br />
          PBFT의 pre-prepare = propose + prevote (대략), PBFT commit = precommit + commit.<br />
          Tendermint는 각 단계를 명시적 구분 — blockchain 맥락에서 명확성 증대.
        </p>
      </div>
    </section>
  );
}
