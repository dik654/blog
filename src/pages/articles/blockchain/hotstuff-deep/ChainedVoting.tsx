import ChainedVotingViz from './viz/ChainedVotingViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const commitRuleCode = `Chained HotStuff 3-chain Commit Rule:

View v:   리더가 B1 제안 → prepareQC(B1) 생성
View v+1: 리더가 B2 제안 → B2.qc = prepareQC(B1)
           → B1은 pre-committed
View v+2: 리더가 B3 제안 → B3.qc = prepareQC(B2)
           → B2 pre-committed, B1 committed
View v+3: B3 committed → B1 DECIDE (확정)

3-chain rule:
  B1.view + 1 == B2.view
  B2.view + 1 == B3.view
  → B1이 확정됨 (3개 연속 QC 체인)`;

export default function ChainedVoting() {
  return (
    <section id="chained-voting" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체인 투표 (Chained HotStuff)</h2>
      <div className="not-prose mb-8"><ChainedVotingViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Yin et al., PODC 2019 — §5 Chained HotStuff" citeKey={1} type="paper"
          href="https://arxiv.org/abs/1803.05069">
          <p className="italic">
            "Chained HotStuff pipelines the protocol phases across views, achieving a one-block latency in the steady state."
          </p>
        </CitationBlock>

        <CodePanel title="3-chain Commit Rule" code={commitRuleCode}
          annotations={[
            { lines: [3, 4], color: 'sky', note: 'View v: B1 Prepare' },
            { lines: [5, 7], color: 'emerald', note: 'View v+1: B1 Pre-Commit' },
            { lines: [8, 9], color: 'amber', note: 'View v+2~v+3: B1 Commit & Decide' },
            { lines: [11, 14], color: 'violet', note: '3-chain 조건' },
          ]} />

        {/* ── Basic vs Chained ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Basic HotStuff vs Chained HotStuff</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Basic HotStuff (3-phase, 1 block per view):
//
// View v:
//   Phase 1: Prepare (propose)
//     leader → all: msg(PREPARE, B, prepareQC)
//     each → leader: vote
//     leader aggregates: new prepareQC
//
//   Phase 2: Pre-commit
//     leader → all: msg(PRE-COMMIT, prepareQC)
//     each → leader: vote
//     leader aggregates: precommitQC
//
//   Phase 3: Commit
//     leader → all: msg(COMMIT, precommitQC)
//     each → leader: vote
//     leader aggregates: commitQC
//
//   Phase 4: Decide
//     leader → all: msg(DECIDE, commitQC)
//     → execute block B
//
// 결과: 1 block, 4 rounds per view
// Throughput: 낮음 (view 당 1 block)

// Chained HotStuff (pipelined, 1 block per message):
//
// View v:   leader proposes B_v
//           B_v.qc = QC of B_(v-1)
//           "my vote for B_v also acts as prepareQC for B_(v-1)"
//
// View v+1: leader proposes B_(v+1)
//           B_(v+1).qc = QC of B_v
//           "vote for B_(v+1) = precommitQC for B_(v-1)"
//
// View v+2: leader proposes B_(v+2)
//           B_(v+2).qc = QC of B_(v+1)
//           "vote = commitQC for B_(v-1)"
//
// View v+3: B_(v-1) DECIDED!
//
// 결과: 매 view 1 block 생성, 3-view latency로 finalize
// Throughput: 3배 향상

// 핵심 insight:
// "같은 vote가 여러 단계 역할 수행"
// - B_v에 대한 vote = B_(v-1)의 prepareQC 역할
// - 별도 phase 없이 pipeline 효과
// - 매 view 1 QC 생성`}
        </pre>
        <p className="leading-7">
          Chained = <strong>vote 재사용으로 파이프라인</strong>.<br />
          vote(B_v)가 prev block의 다음 QC 단계 역할.<br />
          매 view 1 block propose + 1 commit (steady state).
        </p>

        {/* ── 3-chain 규칙 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">3-chain Commit Rule 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Block structure:
// struct Block {
//     parent: Hash,     // 이전 block hash
//     qc: QC,           // justifying QC
//     view: int,        // block의 view
//     proposer: Node,   // leader
//     payload: [TX],    // transactions
// }
//
// QC structure:
// struct QC {
//     block: Hash,              // voted-for block
//     view: int,
//     signatures: AggSig,       // 2f+1 votes
// }

// 3-chain 조건 (block B commits when):
// ∃ blocks B, B', B'' such that:
//   - B ← B' ← B'' (parent chain)
//   - QC(B) exists (B has a QC)
//   - QC(B') exists
//   - QC(B'') exists
//   - B.view + 1 == B'.view
//   - B'.view + 1 == B''.view
//   → B is committed (finalized)

// 왜 3-chain?
//
// 공격 시나리오 (2-chain 안 되는 이유):
// View v: B 제안, prepareQC(B)
// View v+1: B' 제안, QC(B) 포함
// - 여기서 B 커밋하면?
// - Byzantine leader가 v+2에서 다른 chain 제안 가능
// - B 말고 B* (different from B)
// - B*.view + 1 == B.view 불가 (과거 view)
// - but B*가 "honest view" 가장할 수 있음
// - fork 생성 가능
//
// 3-chain 방어:
// - B commit 전 3 연속 view QC 필요
// - 연속 view에 2f+1 vote → quorum 형성
// - 동시에 다른 chain 3-chain 못 만듬
// - safety 보장

// 연속성 조건 (consecutive views):
// B.view + 1 == B'.view
// - 연속 view에 QC 형성 필수
// - view gap 있으면 3-chain 깨짐
// - leader rotation은 연속 증명
//
// Lock vs Commit:
// Lock (pre-commit): 2-chain 달성
//   - B가 B' 통해 2번 QC → B lock
//   - lock은 safety (view change 시 보존)
// Commit (decide): 3-chain 달성
//   - B lock + B' lock → B commit
//   - final decision, revert 불가`}
        </pre>
        <p className="leading-7">
          3-chain = <strong>연속 view 3개 QC로 commit</strong>.<br />
          2-chain: lock (safety), 3-chain: commit (final).<br />
          consecutive view 조건이 fork 방어 핵심.
        </p>

        {/* ── 성능 분석 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">성능 분석: Latency vs Throughput</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Basic HotStuff:
// - block B commit latency: 4 network delays
//   (propose → prepare → pre-commit → commit)
// - 1 block per 4 delays
// - latency = throughput의 역수

// Chained HotStuff:
// - block B commit latency: 3 network delays
//   (B → B' → B'' 3-chain)
// - 1 block per 1 delay (steady state)
// - latency != throughput의 역수

// 구체적 숫자 (network delay δ):
//
// Basic HotStuff:
// - latency: 4δ
// - throughput: 1/(4δ) blocks/sec
//
// Chained HotStuff:
// - latency: 3δ
// - throughput: 1/δ blocks/sec (3x 향상)
//
// PBFT:
// - latency: 3δ (pre-prepare, prepare, commit)
// - throughput: 1/(3δ)
//
// Tendermint:
// - latency: 3δ (propose, prevote, precommit)
// - throughput: 1/(3δ)

// 왜 Chained HotStuff가 좋은가:
// - 각 view마다 새 block 생성
// - 이전 block의 commit은 background
// - leader 바뀌어도 pipeline 유지
// - 고처리량 + 빠른 finality

// 실제 성능 (Aptos, 2024):
// - block time: 100-300ms
// - finality: ~1s
// - TPS: 10,000+ (under load)
// - validator: ~100

// 한계:
// - 매 view leader rotation 필요
// - leader 실패 시 pipeline break
// - view change도 3-chain에 포함됨`}
        </pre>
        <p className="leading-7">
          Chained HotStuff: <strong>latency 3δ + throughput 1/δ</strong>.<br />
          Basic 대비 3배 처리량.<br />
          매 view 1 block — pipeline 효과 극대화.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 3-chain이 필요한가 (2-chain 부족한 이유)</strong> — view change safety.<br />
          2-chain은 locking에 충분하지만 commit에는 부족.<br />
          view change 시 Byzantine leader가 2-chain block 무시 가능.<br />
          3-chain은 3 연속 QC → 3f+1 중 2f+1의 2f+1 투표 → safety 보장.
        </p>
      </div>
    </section>
  );
}
