import TwoPhaseViz from './viz/TwoPhaseViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const tcCode = `HotStuff-2 핵심: timeout-certificate (TC)

기존 HotStuff:
  Prepare → Pre-Commit → Commit
  Pre-Commit = "투표의 투표" (QC의 QC)
  → View Change 시 안전성 보장 역할

HotStuff-2:
  Prepare → Commit (2단계)
  TC = 2f+1 노드의 timeout 메시지 집합
  → View Change 시 TC가 Pre-Commit 역할 대체

TC의 역할:
  - 노드가 view v에서 타임아웃 시 (view, highQC) 전송
  - 2f+1 timeout 수집 → TC 형성
  - 새 리더가 TC 검증 → 안전하게 새 view 시작
  - Pre-Commit 없이도 Safety 보장`;

export default function TwoPhase() {
  return (
    <section id="two-phase" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2단계 프로토콜</h2>
      <div className="not-prose mb-8"><TwoPhaseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Malkhi & Nayak, 2023 — HotStuff-2" citeKey={1} type="paper"
          href="https://eprint.iacr.org/2023/397">
          <p className="italic">
            "We show that in the steady state, two phases suffice for a BFT SMR protocol with linear communication complexity."
          </p>
        </CitationBlock>

        <CodePanel title="timeout-certificate (TC)" code={tcCode}
          annotations={[
            { lines: [3, 6], color: 'sky', note: 'HotStuff: Pre-Commit 필요' },
            { lines: [8, 11], color: 'emerald', note: 'HotStuff-2: TC로 대체' },
            { lines: [13, 18], color: 'amber', note: 'TC 메커니즘 상세' },
          ]} />

        {/* ── TC 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Timeout Certificate 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Timeout message:
// struct Timeout {
//     view: int,         // 만료된 view
//     highQC: QC,        // 자신이 본 가장 높은 QC
//     sender: Node,
//     signature: Sig,
// }

// Timeout Certificate:
// struct TC {
//     view: int,               // 해당 view
//     high_qc_view: int,       // max highQC.view
//     signatures: AggSig,      // 2f+1 timeout signatures
// }

// TC 생성 과정:
// 1. Replica가 view v timeout 감지:
//    - leader로부터 PREPARE 안 옴
//    - 또는 2f+1 vote 모으는 데 실패
//
// 2. Replica → new leader: Timeout(v, my_highQC)
//    - highQC: 자신이 벌써 받은 가장 높은 QC
//
// 3. New leader 수집:
//    - 2f+1 Timeout messages from distinct replicas
//    - 각 timeout의 highQC 중 max 선택
//    - max_highQC = argmax(t.highQC.view for t in timeouts)
//
// 4. Aggregated TC:
//    - BLS aggregation of 2f+1 signatures
//    - TC = (view=v, high_qc_view=max, sig=agg)
//    - size: O(1) in signatures

// TC의 safety 의미:
// - 2f+1 중 f+1은 정직 노드
// - 정직 노드의 highQC >= 이전 committed QC
// - max_highQC >= 모든 committed block의 QC
// - → new leader는 max_highQC 존중 proposal

// TC vs NewView:
// HotStuff NewView: 개별 highQC 전달 (n messages)
// HotStuff-2 TC: aggregated certificate (1 object)
// 둘 다 O(n) 메시지이지만 TC는 증거 압축`}
        </pre>
        <p className="leading-7">
          TC = <strong>2f+1 timeout messages의 aggregated certificate</strong>.<br />
          max highQC 포함 — 이전 committed block 존중 증거.<br />
          aggregated → verification 효율 + bandwidth 절약.
        </p>

        {/* ── 2-phase 프로토콜 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2-Phase 프로토콜 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// HotStuff-2 프로토콜 (view v):
//
// Preliminary:
// - leader = proposer(v) (round-robin)
// - leader는 자신의 highQC, highTC 보유

// Phase 1: Prepare
// 1. leader가 block 생성:
//    B = Block(parent=highQC.block, qc=highQC, tc=highTC)
//    - highTC: 필요 시 (view change 후)
// 2. leader → all: Propose(B)
// 3. replicas 검증:
//    - B.qc.view == v-1 OR B.tc exists
//    - if B.tc: verify TC, B.qc.view >= TC.high_qc_view
//    - lock condition 검증
// 4. replicas → leader: Vote(B) = sign(B.hash)
// 5. leader 수집:
//    - 2f+1 votes
//    - aggregates → prepareQC
//    - prepareQC = QC(B, view=v, signers=2f+1)

// Phase 2: Commit
// 6. leader → all: CommitMsg(prepareQC)
// 7. replicas 검증:
//    - prepareQC.view == v
//    - prepareQC.block matches Phase 1 B
//    - set lock to prepareQC
// 8. replicas → leader: Vote(prepareQC)
// 9. leader 수집:
//    - 2f+1 votes on prepareQC
//    - aggregates → commitQC
//    - → B committed!

// Decide:
// 10. leader → all: DecideMsg(commitQC)
// 11. replicas execute B

// Latency:
// - Phase 1: 2δ (propose + vote)
// - Phase 2: 2δ (commit + vote)
// - Total: 4δ

// Chained HotStuff-2:
// - each view produces 1 block
// - consecutive blocks form 2-chain
// - B committed when B' with QC of B exists
// - steady state: 1 block per 2δ`}
        </pre>
        <p className="leading-7">
          HotStuff-2 2-phase: <strong>Prepare → Commit</strong>.<br />
          Pre-commit 제거, 각 phase는 propose + 2f+1 vote.<br />
          latency 4δ per block (Basic HotStuff 7δ → 4δ).
        </p>

        {/* ── Safety 증명 sketch ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Safety 증명 sketch (TC가 왜 충분한가)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Claim: HotStuff-2 safety with TC

// 가정:
// view v1에서 B1 committed (2-chain)
// - QC(B1), QC(B1') exist
// - B1 ← B1' (parent)
// - B1.view + 1 == B1'.view
//
// view v2 > v1에서 B2 committed (B2 ≠ B1)
// 목표: 모순 도출

// v1과 v2 사이 view change 발생:
// - view v1' in [v1, v2]
// - TC(v1') formed with 2f+1 timeouts

// 핵심 observation:
// TC(v1').high_qc_view >= v1
// 이유:
// - B1 committed in v1 → 2f+1 prepare voted
// - 2f+1 replica가 prepareQC(B1, v1) 보유
// - TC(v1')에 2f+1 timeout 참여
// - 교차 (intersection) f+1 이상
// - f+1 중 정직 1명 이상
// - 정직 replica는 자신의 highQC 정직 보고
// - 따라서 max highQC >= QC(B1, v1)

// v2 leader가 new proposal:
// - B2.qc 또는 B2.tc 중 하나
// - case 1: B2.qc.view >= v1
// - case 2: B2.tc.high_qc_view >= v1

// 정직 replica가 B2에 vote 조건:
// - lock 규칙: B2의 chain이 lockedQC 존중
// - lockedQC >= QC(B1)
// - B2 chain이 B1 포함해야

// B2 ≠ B1 but B2 chain이 B1 include 해야?
// - 모순 (B2는 B1의 ancestor 또는 descendant여야)
// - B2가 B1 descendant이면 OK (commit 가능)
// - B2가 B1과 conflicting하면 vote 불가

// 결론:
// - committed B1과 conflicting B2 commit 불가
// - safety 보장

// 엄밀한 증명: HotStuff-2 paper §5`}
        </pre>
        <p className="leading-7">
          TC safety 핵심: <strong>TC.high_qc_view ≥ committed QC.view</strong>.<br />
          2f+1 timeout 중 정직 1명이 committed QC 포함.<br />
          new leader는 TC 기반 proposal → 이전 commit 존중.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 TC가 Pre-commit 대체 가능한가</strong> — view 종료 증명.<br />
          Pre-commit: "이 block이 locked"를 증명.<br />
          TC: "이 view가 진행 불가"를 증명 + max highQC 전달.<br />
          둘 다 view change 시 safety 증거 역할 — TC가 더 일반적.
        </p>
      </div>
    </section>
  );
}
