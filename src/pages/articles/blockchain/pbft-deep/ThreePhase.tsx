import ThreePhaseViz from './viz/ThreePhaseViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const msgCode = `PBFT 메시지 구조 (각 단계별):

PRE-PREPARE: ⟨PRE-PREPARE, v, n, d⟩_σp
  v = view 번호, n = 시퀀스 번호
  d = 요청 다이제스트, σp = Primary 서명

PREPARE: ⟨PREPARE, v, n, d, i⟩_σi
  i = replica 번호
  2f+1 PREPARE 수집 → prepared(m, v, n) = true

COMMIT: ⟨COMMIT, v, n, D(m), i⟩_σi
  2f+1 COMMIT 수집 → committed-local
  → 요청 실행 → Reply 전송`;

export default function ThreePhase() {
  return (
    <section id="three-phase" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3단계 프로토콜</h2>
      <div className="not-prose mb-8"><ThreePhaseViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Castro & Liskov, OSDI 1999 — §4.2" citeKey={1} type="paper"
          href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
          <p className="italic">
            "The three-phase protocol ensures that non-faulty replicas agree on a total order for the requests within a view."
          </p>
        </CitationBlock>

        <CodePanel title="PBFT 메시지 구조" code={msgCode}
          annotations={[
            { lines: [3, 5], color: 'sky', note: 'Pre-prepare: 리더가 순서 제안' },
            { lines: [7, 9], color: 'emerald', note: 'Prepare: 전체 합의 O(n²)' },
            { lines: [11, 13], color: 'amber', note: 'Commit: 최종 확정' },
          ]} />

        {/* ── Pre-prepare 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Phase 1: Pre-prepare</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PBFT Pre-prepare 상세:
//
// 1. Client → Primary:
//    ⟨REQUEST, o, t, c⟩_σc
//    - o: operation (명령)
//    - t: timestamp
//    - c: client id
//    - σc: client signature
//
// 2. Primary 검증:
//    - client signature 확인
//    - timestamp 중복 확인 (replay 방지)
//    - client의 last request보다 큰 t
//
// 3. Primary가 n 할당:
//    - n = last_assigned_n + 1
//    - h < n <= H (watermarks 범위)
//    - 하나의 n에 하나의 request만 binding
//
// 4. Primary → all replicas:
//    ⟨⟨PRE-PREPARE, v, n, d⟩_σp, m⟩
//    - d = digest(m) (SHA-256)
//    - m = original request
//
// 5. Replica 검증:
//    - σp 유효 (primary signature)
//    - v == current view
//    - h < n <= H (watermarks)
//    - 같은 (v, n)으로 다른 d 받은 적 없음
//    - d matches digest(m)
//
// 6. Replica 받아들이면:
//    - log에 PRE-PREPARE 기록
//    - PREPARE 단계로 진입

// 왜 이렇게 복잡한가:
// - Byzantine primary 방어
// - replay attack 방지
// - sequence number 부여 권한 = primary
//   but 부여 후엔 모두가 검증`}
        </pre>
        <p className="leading-7">
          Pre-prepare = <strong>primary가 sequence number 할당</strong>.<br />
          같은 (v, n)에 다른 d 불가 — primary의 주요 책임.<br />
          client 서명 확인으로 replay attack 방지.
        </p>

        {/* ── Prepare 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Phase 2: Prepare</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PBFT Prepare 상세:
//
// 1. Replica i가 Pre-prepare 받으면:
//    - 검증 통과 시 broadcast:
//      ⟨PREPARE, v, n, d, i⟩_σi
//    - 자신의 log에도 기록
//
// 2. 각 Replica가 PREPARE 수집:
//    - 2f개 PREPARE from others (다른 replica들)
//    - 자신의 PRE-PREPARE 또는 PREPARE
//    - 총 2f+1 matching (v, n, d)
//
// 3. prepared(m, v, n) predicate:
//    prepared(m, v, n) := ∃ log entries such that
//      - request m with digest d
//      - PRE-PREPARE ⟨v, n, d⟩ by primary
//      - 2f PREPARE ⟨v, n, d, j⟩ from j ≠ primary
//    → 같은 (v, n)에 대해 primary가 2개 m 제안 불가
//
// 4. "prepared" 의미:
//    - 정직 노드 중 f+1명 이상이 m을 봤음
//    - 이 값이 "이 view에서 이 n에 대한 유일한 값"
//    - but 아직 execute 안 함 (view change 가능)
//
// 5. 왜 2f+1?
//    - intersection argument
//    - 두 다른 prepared 값 불가
//    - 증명: quorum Q1, Q2 둘 다 2f+1
//      |Q1 ∩ Q2| >= f+1
//      정직 1명 이상 겹침
//      정직 노드는 2개 다른 PREPARE 불가

// Prepare 정족수 확인 (의사코드):
// match_count = 0
// for msg in log:
//     if msg.type == PREPARE
//     and msg.v == v and msg.n == n
//     and msg.d == d:
//         match_count += 1
// if match_count >= 2f+1:
//     prepared(m, v, n) = True
//     broadcast COMMIT`}
        </pre>
        <p className="leading-7">
          Prepare = <strong>2f+1 replica가 같은 제안 동의</strong>.<br />
          quorum intersection으로 두 다른 값 prepared 불가.<br />
          but execute 전 — view change 시 prepared 값은 bridge로 사용.
        </p>

        {/* ── Commit 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Phase 3: Commit</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PBFT Commit 상세:
//
// 1. Replica i가 prepared(m, v, n) 확인 후:
//    broadcast ⟨COMMIT, v, n, d, i⟩_σi
//
// 2. 각 Replica가 COMMIT 수집:
//    - 2f+1 matching COMMIT (v, n, d)
//    - 자신의 것 포함 가능
//
// 3. committed-local(m, v, n) predicate:
//    committed-local(m, v, n) := prepared(m, v, n)
//      ∧ 2f+1 COMMIT ⟨v, n, d, i⟩ in log
//
// 4. Replica 행동:
//    - committed-local 성립 시
//    - 단, n' < n 인 모든 n'도 execute 완료 후
//    - request m 실행
//    - ⟨REPLY, v, t, c, i, r⟩_σi → client
//      r = operation result
//
// 5. Client:
//    - f+1 matching reply 수집
//    - 같은 r이 f+1개 → 확정
//    - f+1 중에는 정직 1명 이상

// 왜 Commit 단계 필요?
//
// Gedanken experiment:
// 2-phase만 쓴다면 (Prepare로 execute):
// - A가 prepared → execute
// - 나머지는 아직 prepared 안 됨 (메시지 drop)
// - view change 발생
// - new primary는 A의 prepared 모름 (A에게만 있음)
// - 다른 값 propose → safety 위반!
//
// 3-phase 해결:
// - COMMIT 2f+1 = 최소 f+1 정직 노드가 prepared 봄
// - view change 시 f+1 중 최소 1명이 new primary에 전달
// - new primary가 이전 값 존중 강제

// 핵심: COMMIT은 "f+1 정직 노드가 이 값 봤다"의 증거
// view change 시 이 증거가 safety 보장`}
        </pre>
        <p className="leading-7">
          Commit = <strong>prepared 상태를 durable하게 기록</strong>.<br />
          2f+1 COMMIT → f+1 정직 노드가 prepared 목격.<br />
          view change 시 이 증거가 safety 보장 — 2-phase 단축 불가 이유.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">통신 복잡도 분석</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Pre-prepare</p>
            <p className="text-sm">1 → n-1 = O(n)</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Prepare</p>
            <p className="text-sm">n × (n-1) = O(n²)</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Commit</p>
            <p className="text-sm">n × (n-1) = O(n²)</p>
          </div>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 O(n²)이 실무 한계인가</strong> — n=100일 때 20,000 메시지/request.<br />
          n=1000 → 2,000,000 메시지/request. 네트워크 대역폭 폭발.<br />
          HotStuff가 O(n)으로 개선 — leader가 signature 수집 후 broadcast (threshold signature).
        </p>
      </div>
    </section>
  );
}
