import JolteonViz from './viz/JolteonViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const pathCode = `Jolteon 이중 경로:

Fast Path (낙관적, 2단계):
  리더 → Propose(B)
  모든 노드 → Vote(B)
  리더가 n-f 투표 수집 → QC(B) 형성
  → 2단계 완료, 4 message delays
  조건: 모든 정직 노드가 동의해야 함

Slow Path (HotStuff 3단계):
  리더 장애 또는 일부 비동의 시 fallback
  Prepare → Pre-Commit → Commit
  → 7 message delays
  O(n) View Change 유지

전환 규칙:
  Fast path QC 실패 → 자동으로 slow path
  Slow path 완료 후 → 다음 view에서 fast 재시도`;

export default function Jolteon() {
  return (
    <section id="jolteon" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Jolteon</h2>
      <div className="not-prose mb-8"><JolteonViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Gelashvili et al., FC 2022 — Jolteon" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2106.10362">
          <p className="italic">
            "Jolteon combines the linear view-change of HotStuff with the optimistic responsiveness of PBFT."
          </p>
        </CitationBlock>

        <CodePanel title="Jolteon 이중 경로" code={pathCode}
          annotations={[
            { lines: [3, 8], color: 'emerald', note: 'Fast: 2단계, 4 delays' },
            { lines: [10, 14], color: 'sky', note: 'Slow: 3단계 HotStuff' },
            { lines: [16, 18], color: 'amber', note: '자동 전환 규칙' },
          ]} />

        {/* ── Jolteon 프로토콜 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Jolteon 프로토콜 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Jolteon 핵심 아이디어:
// - 2-chain commit (HotStuff 3-chain 대비)
// - TC (timeout certificate) for view change
// - Fast path + Slow path

// View v (Fast Path):
//
// 1. Leader propose:
//    leader → all: Propose(B_v, B_v.qc = QC(B_(v-1)))
//
// 2. Replicas vote:
//    if B_v.qc.view == v-1 (consecutive):
//        vote(B_v) → leader
//    else if B_v has TC:
//        if proposal safety check:
//            vote(B_v) → leader
//
// 3. Leader aggregates:
//    2f+1 votes → QC(B_v)
//    broadcast QC(B_v)
//
// 4. Replicas update:
//    lockedQC = QC(B_v) if consecutive
//    commit B_(v-1) if 2-chain: QC(B_v) + QC(B_(v-1))

// 2-chain commit rule:
// commit(B) iff exists B' such that:
//   - QC(B), QC(B') exist
//   - B ← B' (parent)
//   - B.view + 1 == B'.view (consecutive)
// → B committed

// Slow Path (view change):
//
// 1. Replica가 timeout (view v):
//    send Timeout(v, highQC, highTC) → new leader
//
// 2. New leader 수집:
//    2f+1 Timeout messages
//    form TC(v) (aggregated)
//    max highQC 계산
//
// 3. New proposal:
//    B_(v+1) = Block(qc=max_highQC, tc=TC(v))
//    broadcast
//
// 4. Replicas verify:
//    check TC validity
//    check proposal safety
//    → vote

// Safety 보장:
// - 2-chain commit + TC → 3-chain 역할
// - TC가 view v의 "종료" 증명
// - max highQC로 이전 locked state 전달`}
        </pre>
        <p className="leading-7">
          Jolteon = <strong>2-chain + TC</strong>.<br />
          HotStuff의 3-chain 대비 1 view 단축.<br />
          TC가 view change safety 역할 (HotStuff-2와 동일 아이디어).
        </p>

        {/* ── Fast vs Slow Path ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fast Path vs Slow Path</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Fast Path (happy case):
//
// 조건:
// - honest leader
// - GST passed
// - all replicas receive propose timely
//
// 흐름:
// View v-1: B_(v-1) proposed + QC formed
// View v:   B_v proposed with QC(B_(v-1))
//           2f+1 vote → QC(B_v) formed
//           → B_(v-1) committed (2-chain)
//
// Latency:
// - 2 views × 2δ = 4δ per commit
// - 1 block per 2δ (steady state)
//
// Communication:
// - propose: leader → all (O(n))
// - vote: all → leader (O(n))
// - QC broadcast: leader → all (O(n))
// - Total: O(n) per view

// Slow Path (sad case):
//
// 조건:
// - leader failed / Byzantine
// - network partition
// - message delay
//
// 흐름:
// 1. Timeout detected
// 2. send Timeout(v, highQC)
// 3. new leader collects 2f+1
// 4. form TC(v)
// 5. new proposal with TC
// 6. continue normal consensus
//
// Latency:
// - Timeout period (timeout_v)
// - 1 round for TC formation
// - subsequent views normal
// - total: timeout + δ + 2δ per commit
//
// Communication:
// - Timeout: each → new leader (O(n))
// - TC formation: leader (O(1) work)
// - Propose with TC: leader → all (O(n))
// - Total: O(n)

// Automatic fallback:
// - Fast path 실패 시 자동 timeout
// - 전환 overhead 최소
// - 연속 실패 시 exponential timeout

// 낙관적 효과:
// - 대부분의 경우 fast path
// - Latency: 2δ per commit (optimistic)
// - Worst case: timeout + 3δ (pessimistic)`}
        </pre>
        <p className="leading-7">
          Fast path: <strong>2δ per commit (happy case)</strong>.<br />
          Slow path: TC formation + timeout 포함 (sad case).<br />
          자동 fallback — 별도 관리 불필요.
        </p>

        {/* ── Ditto 확장 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Ditto: Async Fallback 추가</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Ditto (Baudet-Danezis-Spiegelman 2022):
// - Jolteon + async fallback
// - 3-mode protocol

// 3 modes:
//
// Mode 1: Jolteon fast path
// - partial sync optimistic
// - 2δ per commit
// - normal operation
//
// Mode 2: Jolteon slow path
// - partial sync with TC
// - timeout + 3δ
// - leader 장애 복구
//
// Mode 3: Async DAG (Narwhal-based)
// - fully async
// - no timing assumption
// - liveness under any condition
// - higher latency but always progress

// Transition 규칙:
// - Mode 1 → 2: timeout
// - Mode 2 → 3: 연속 timeout (GST 못 도달)
// - Mode 3 → 1: 네트워크 안정화 감지

// Async Mode 이점:
// - asynchronous liveness (FLP 우회)
// - DDoS 공격에도 진행
// - long-lived 시스템 강건성

// Async Mode 단점:
// - 높은 latency (DAG 기반)
// - 복잡한 구현
// - 성능 저하 (mode 2 대비)

// 실제 사용:
// - Ditto는 학술 연구 (2022)
// - Aptos DiemBFT v4에 부분 반영
// - Mysticeti (Sui) 영향

// Ditto의 기여:
// - "어떤 네트워크 상황에서도 liveness"
// - 기존 BFT는 GST 필요
// - Ditto는 async-safe
// - BFT의 새 강건성 기준`}
        </pre>
        <p className="leading-7">
          Ditto = <strong>Jolteon + DAG async fallback</strong>.<br />
          3 mode: optimistic → partial sync → async.<br />
          async-safe liveness — DDoS에도 진행.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Jolteon의 2-chain이 안전한가</strong> — TC의 역할.<br />
          HotStuff 3-chain의 Pre-commit = Jolteon의 TC.<br />
          TC가 "이 view가 종료됐고 max highQC가 유효함" 증명.<br />
          이론적으로 HotStuff-2와 동일 원리 (different formulation).
        </p>
      </div>
    </section>
  );
}
