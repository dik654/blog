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
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">1. Client → Primary</p>
              <p className="text-xs font-mono">⟨REQUEST, <code>o</code>, <code>t</code>, <code>c</code>⟩<sub>σc</sub></p>
              <ul className="text-sm space-y-0.5 mt-2 list-disc list-inside">
                <li><code>o</code>: operation (명령)</li>
                <li><code>t</code>: timestamp</li>
                <li><code>c</code>: client id, <code>σc</code>: client 서명</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">2. Primary 검증</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>client signature 확인</li>
                <li>timestamp 중복 확인 (replay 방지)</li>
                <li>client의 last request보다 큰 <code>t</code></li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">3. Primary가 n 할당 & 전송</p>
              <p className="text-sm"><code>n = last_assigned_n + 1</code>, <code>h &lt; n &lt;= H</code> (watermarks)</p>
              <p className="text-xs font-mono mt-1">⟨⟨PRE-PREPARE, <code>v</code>, <code>n</code>, <code>d</code>⟩<sub>σp</sub>, <code>m</code>⟩</p>
              <p className="text-xs text-muted-foreground mt-1"><code>d</code> = digest(m), SHA-256</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">4. Replica 검증</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li><code>σp</code> 유효 (primary signature)</li>
                <li><code>v</code> == current view</li>
                <li><code>h &lt; n &lt;= H</code> (watermarks)</li>
                <li>같은 <code>(v, n)</code>으로 다른 <code>d</code> 받은 적 없음</li>
                <li>통과 → log 기록, PREPARE 진입</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Byzantine primary 방어 + replay 방지 — sequence number 부여는 primary, 검증은 모두가</p>
        </div>
        <p className="leading-7">
          Pre-prepare = <strong>primary가 sequence number 할당</strong>.<br />
          같은 (v, n)에 다른 d 불가 — primary의 주요 책임.<br />
          client 서명 확인으로 replay attack 방지.
        </p>

        {/* ── Prepare 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Phase 2: Prepare</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">Replica broadcast</p>
              <p className="text-sm">Pre-prepare 검증 통과 시:</p>
              <p className="text-xs font-mono mt-1">⟨PREPARE, <code>v</code>, <code>n</code>, <code>d</code>, <code>i</code>⟩<sub>σi</sub></p>
              <p className="text-sm mt-2">각 Replica가 <code>2f</code>개 PREPARE (+ 자신) = 총 <code>2f+1</code> matching <code>(v, n, d)</code> 수집</p>
            </div>
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm mb-2"><code>prepared(m, v, n)</code> predicate</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>request <code>m</code> with digest <code>d</code></li>
                <li>PRE-PREPARE <code>⟨v, n, d⟩</code> by primary</li>
                <li><code>2f</code> PREPARE from <code>j ≠ primary</code></li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">→ 같은 <code>(v, n)</code>에 대해 primary가 2개 m 제안 불가</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">"prepared" 의미 & 왜 <code>2f+1</code></p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>정직 노드 <code>f+1</code>명 이상이 <code>m</code>을 봤음</li>
              <li>"이 view에서 이 n에 대한 유일한 값" — but 아직 execute 안 함</li>
              <li>quorum intersection: <code>|Q1 ∩ Q2| ≥ f+1</code> → 정직 1명 겹침 → 두 다른 prepared 값 불가</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Prepare = <strong>2f+1 replica가 같은 제안 동의</strong>.<br />
          quorum intersection으로 두 다른 값 prepared 불가.<br />
          but execute 전 — view change 시 prepared 값은 bridge로 사용.
        </p>

        {/* ── Commit 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Phase 3: Commit</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">COMMIT broadcast & 수집</p>
              <p className="text-sm"><code>prepared(m, v, n)</code> 확인 후:</p>
              <p className="text-xs font-mono mt-1">⟨COMMIT, <code>v</code>, <code>n</code>, <code>d</code>, <code>i</code>⟩<sub>σi</sub></p>
              <p className="text-sm mt-2"><code>2f+1</code> matching COMMIT 수집 → <code>committed-local</code></p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">Replica 행동 & Client 확정</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><code>committed-local</code> 성립 + <code>n' &lt; n</code> 모두 execute 완료</li>
                <li>request <code>m</code> 실행</li>
                <li>⟨REPLY, <code>v</code>, <code>t</code>, <code>c</code>, <code>i</code>, <code>r</code>⟩ → client</li>
                <li>Client: <code>f+1</code> matching reply → 확정</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="font-semibold text-sm mb-2">왜 Commit 단계 필요? (2-phase 실패 시나리오)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>A가 prepared → execute, 나머지는 메시지 drop으로 prepared 안 됨</li>
              <li>view change → new primary는 A의 prepared 모름</li>
              <li>다른 값 propose → <strong>safety 위반</strong></li>
            </ul>
            <p className="text-sm mt-2"><strong>3-phase 해결:</strong> COMMIT <code>2f+1</code> = 최소 <code>f+1</code> 정직 노드가 prepared 목격. view change 시 최소 1명이 new primary에 전달.</p>
          </div>
        </div>
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
