import ViewChangeViz from './viz/ViewChangeViz';
import { CitationBlock } from '@/components/ui/citation';

export default function ViewChange() {
  return (
    <section id="view-change" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">View Change (리더 교체)</h2>
      <div className="not-prose mb-8"><ViewChangeViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Castro & Liskov, OSDI 1999 — §4.4" citeKey={2} type="paper"
          href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
          <p className="italic">
            "View changes provide liveness by allowing the system to make progress when the primary fails."
          </p>
        </CitationBlock>

        {/* ── View Change 트리거 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">View Change 트리거 조건</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// View change는 언제 발생?
//
// 1. Primary 침묵:
//    - replica가 client request 받음
//    - primary에 forward
//    - T timeout 내 PRE-PREPARE 없음
//    - view change 시작
//
// 2. 잘못된 PRE-PREPARE:
//    - primary가 valid PRE-PREPARE 안 보냄
//    - 다른 digest로 두 번 보냄 (equivocation)
//    - 서명 검증 실패
//
// 3. Timeout 확장 (exponential backoff):
//    - 1st view change: T = 1s
//    - 2nd view change: T = 2s
//    - k-th: T = 2^(k-1) * T_base
//    - GST 이후엔 반드시 안정화
//
// View change 메시지:
// ⟨VIEW-CHANGE, v+1, n, C, P, i⟩_σi
// - v+1: 새 view number
// - n: last stable checkpoint sequence
// - C: set of 2f+1 CHECKPOINT messages
//      (checkpoint 증명)
// - P: set of "prepared" proofs since n
//      P = {Pm} where Pm = {PRE-PREPARE, 2f PREPAREs}
// - i: sender id
// - σi: signature

// 왜 C, P 포함?
// - C: 어디까지 안정적이었는지 증명
// - P: 그 이후 prepared 상태 증명
// - new primary가 이전 상태 복원 가능

// Replica 행동:
// 1. view change 시작 → 자신의 VIEW-CHANGE broadcast
// 2. 새 view에서 어떤 request도 accept 안 함
// 3. 2f+1 VIEW-CHANGE 수집 대기
// 4. new primary는 NEW-VIEW 준비`}
        </pre>
        <p className="leading-7">
          View change = <strong>primary 의심 시 투표</strong>.<br />
          timeout은 exponential backoff — GST 후 반드시 수렴.<br />
          C, P는 이전 상태 증명 — safety 유지 열쇠.
        </p>

        {/* ── NEW-VIEW 프로토콜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">NEW-VIEW 프로토콜</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// New Primary의 역할:
//
// p' = (v+1) mod n  (결정적 rotation)
//
// 1. p'가 2f+1 VIEW-CHANGE 수집:
//    V = {VIEW-CHANGE messages from 2f+1 replicas}
//
// 2. p'가 re-propose 할 requests 계산:
//    O = "requests to reprocess"
//    for n in (min_s, max_s]:
//        if ∃ Pm in V such that max view of m with n:
//            include PRE-PREPARE(v+1, n, d)
//        else:
//            include PRE-PREPARE(v+1, n, null)
//
//    min_s = min of all stable checkpoints in V
//    max_s = max n in any PRE-PREPARE in V
//
// 3. p'가 NEW-VIEW broadcast:
//    ⟨NEW-VIEW, v+1, V, O⟩_σp'
//
// 4. Replica가 NEW-VIEW 검증:
//    - V가 valid (2f+1 VIEW-CHANGE)
//    - O가 V로부터 올바르게 유도
//    - 모든 PRE-PREPARE의 σp' 유효
//
// 5. Replica가 O의 PRE-PREPARE 각각에 대해:
//    - log에 기록
//    - 바로 PREPARE broadcast
//    - 새 view 시작

// 핵심 invariant:
// - 이전 view에서 prepared 된 값은 반드시 재제안
// - null은 "이 n에 대해 prepared 없음" 표시
// - 같은 n에 다른 값 propose 불가

// O(n³) 비용 분석:
// - 2f+1 VIEW-CHANGE (각각 O(n) 메시지)
// - VIEW-CHANGE에 O(n) prepared proof
// - NEW-VIEW가 전체 V 포함 → O(n²)
// - broadcast to n → O(n³)
//
// HotStuff 개선:
// - aggregation (threshold signature)
// - NEW-VIEW 대신 automatic rotation
// - O(n) 감소`}
        </pre>
        <p className="leading-7">
          NEW-VIEW = <strong>new primary가 이전 prepared 상태 복원</strong>.<br />
          O (PRE-PREPARE set)를 V (VIEW-CHANGE set)에서 유도 — safety 증거.<br />
          이 프로토콜이 O(n³) 병목 — HotStuff가 threshold signature로 해결.
        </p>

        {/* ── Safety 증명 sketch ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">View Change Safety 증명 sketch</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Safety 증명: view change 후에도 committed 값 불변

// 가정:
// view v에서 m이 committed at n
// → 2f+1 COMMIT for (v, n, d=digest(m))
// → 최소 f+1 정직 노드가 m을 COMMIT

// view change to v+1:
// - 2f+1 VIEW-CHANGE 필요
// - f+1+f = 2f+1 중 최소 f+1 정직
// - 정직 2f+1 전체 중 2f+1 subset이므로
//   최소 (2f+1 - f) = f+1 정직

// 겹침 분석:
// - COMMIT quorum C = 2f+1
// - VIEW-CHANGE quorum VC = 2f+1
// - 둘 다 n = 3f+1 중에서
// - |C ∩ VC| >= |C| + |VC| - n = 2f+1 + 2f+1 - 3f-1 = f+1
// - 겹친 f+1에 정직 1명 이상

// 정직 노드 j가 C ∩ VC에 포함:
// - j는 COMMIT for (v, n, d) 했음
// - j는 VIEW-CHANGE at v+1 보냄
// - j의 VIEW-CHANGE에 P가 포함
// - P에 "prepared for (v, n, d)" 증명 있음

// new primary p'가 NEW-VIEW 생성:
// - p'는 2f+1 VIEW-CHANGE 받음
// - 그 중 j의 것 포함 가능
// - j가 포함되지 않아도, 2f+1 중 f+1은 정직
// - 정직 노드는 prepared 정보 숨길 인센티브 없음
// - → NEW-VIEW의 O에 (v+1, n, d) PRE-PREPARE 포함

// 결론:
// - m이 n에서 committed → view v+1에서도 n에 m이 propose됨
// - safety 유지

// 주의: 엄밀한 증명은 더 복잡 (MIT CSAIL 2001 paper)
// 핵심은 quorum intersection argument`}
        </pre>
        <p className="leading-7">
          Safety 증명의 핵심: <strong>quorum intersection</strong>.<br />
          COMMIT quorum과 VIEW-CHANGE quorum이 f+1 이상 겹침.<br />
          겹친 정직 노드가 이전 값을 new primary에 전달.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">View Change 과정</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">1. 타임아웃 감지</p>
            <p className="text-sm">
              Backup이 일정 시간 내 진행 없으면 Primary 장애로 판단.<br />
              VIEW-CHANGE 메시지를 전체 브로드캐스트
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">2. 새 Primary 선출</p>
            <p className="text-sm">
              v+1 = (v+1) mod n 으로 결정론적 교체.<br />
              2f+1 VIEW-CHANGE 수집 → NEW-VIEW 전송
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">3. 상태 복구</p>
            <p className="text-sm">
              이전 view의 prepared 상태를 새 view로 이월.<br />
              Safety 유지: 이미 committed된 값은 변경 불가
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">비용: O(n³)</p>
            <p className="text-sm">
              2f+1개의 VIEW-CHANGE 메시지, 각각에 O(n) 준비 증거 포함.<br />
              HotStuff가 이를 O(n)으로 개선
            </p>
          </div>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 PBFT view change가 O(n³)인가</strong> — 재귀적 증거 포함.<br />
          각 VIEW-CHANGE에 O(n) prepared proofs, NEW-VIEW에 모든 VIEW-CHANGE 포함, broadcast to n.<br />
          HotStuff는 BLS aggregation으로 각 단계 O(n) → 총 O(n).
        </p>
      </div>
    </section>
  );
}
