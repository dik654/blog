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
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">1. Primary 침묵</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>replica가 client request forward</li>
                <li>T timeout 내 PRE-PREPARE 없음</li>
                <li>view change 시작</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">2. 잘못된 PRE-PREPARE</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>valid PRE-PREPARE 안 보냄</li>
                <li>다른 digest로 두 번 보냄 (equivocation)</li>
                <li>서명 검증 실패</li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">3. Timeout (exponential backoff)</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>1st: T = 1s, 2nd: T = 2s</li>
                <li>k-th: <code>T = 2^(k-1) * T_base</code></li>
                <li>GST 이후 반드시 안정화</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">VIEW-CHANGE 메시지</p>
            <p className="text-xs font-mono mb-2">⟨VIEW-CHANGE, <code>v+1</code>, <code>n</code>, <code>C</code>, <code>P</code>, <code>i</code>⟩<sub>σi</sub></p>
            <div className="grid gap-2 sm:grid-cols-2">
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li><code>v+1</code>: 새 view number</li>
                <li><code>n</code>: last stable checkpoint sequence</li>
                <li><code>C</code>: 2f+1 CHECKPOINT 증명</li>
              </ul>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li><code>P</code>: prepared proofs since n</li>
                <li><code>C</code> = 어디까지 안정적이었는지</li>
                <li><code>P</code> = 그 이후 prepared 상태 증명</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="leading-7">
          View change = <strong>primary 의심 시 투표</strong>.<br />
          timeout은 exponential backoff — GST 후 반드시 수렴.<br />
          C, P는 이전 상태 증명 — safety 유지 열쇠.
        </p>

        {/* ── NEW-VIEW 프로토콜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">NEW-VIEW 프로토콜</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">New Primary의 역할 (<code>p' = (v+1) mod n</code>)</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>2f+1</code> VIEW-CHANGE 수집: <code>V</code> = VIEW-CHANGE 집합</li>
              <li>re-propose 할 requests 계산: <code>O</code> = PRE-PREPARE 집합 (prepared 값 재제안, 없으면 <code>null</code>)</li>
              <li>NEW-VIEW broadcast: ⟨NEW-VIEW, <code>v+1</code>, <code>V</code>, <code>O</code>⟩<sub>σp'</sub></li>
            </ol>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">Replica 검증 & 행동</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li><code>V</code>가 valid (2f+1 VIEW-CHANGE)</li>
                <li><code>O</code>가 <code>V</code>로부터 올바르게 유도</li>
                <li><code>O</code>의 각 PRE-PREPARE → log 기록 → PREPARE broadcast</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <p className="font-semibold text-sm mb-2">핵심 invariant</p>
              <ul className="text-sm space-y-0.5 list-disc list-inside">
                <li>이전 view의 prepared 값 = 반드시 재제안</li>
                <li><code>null</code> = "이 n에 prepared 없음"</li>
                <li>같은 n에 다른 값 propose 불가</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">O(n³) 비용 분석</p>
            <ul className="text-sm space-y-0.5 list-disc list-inside">
              <li>2f+1 VIEW-CHANGE (각 O(n) 메시지) × O(n) prepared proof = O(n²)</li>
              <li>NEW-VIEW가 전체 V 포함 → broadcast to n → <strong>O(n³)</strong></li>
              <li>HotStuff 개선: threshold signature + automatic rotation → O(n)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          NEW-VIEW = <strong>new primary가 이전 prepared 상태 복원</strong>.<br />
          O (PRE-PREPARE set)를 V (VIEW-CHANGE set)에서 유도 — safety 증거.<br />
          이 프로토콜이 O(n³) 병목 — HotStuff가 threshold signature로 해결.
        </p>

        {/* ── Safety 증명 sketch ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">View Change Safety 증명 sketch</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">가정</p>
            <p className="text-sm">view <code>v</code>에서 <code>m</code>이 <code>n</code>에서 committed → <code>2f+1</code> COMMIT → 최소 <code>f+1</code> 정직 노드가 COMMIT</p>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">겹침 분석 (Quorum Intersection)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>COMMIT quorum <code>C = 2f+1</code>, VIEW-CHANGE quorum <code>VC = 2f+1</code></li>
              <li><code>|C ∩ VC| ≥ 2f+1 + 2f+1 - (3f+1) = f+1</code></li>
              <li>겹친 <code>f+1</code>에 정직 1명 이상</li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">정직 노드 j의 역할 (C ∩ VC)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>j는 COMMIT for <code>(v, n, d)</code> 했음</li>
              <li>j는 VIEW-CHANGE at <code>v+1</code> 보냄 — <code>P</code>에 "prepared for <code>(v, n, d)</code>" 증명 포함</li>
              <li>new primary <code>p'</code>가 <code>2f+1</code> VIEW-CHANGE 받으면 → NEW-VIEW의 <code>O</code>에 <code>(v+1, n, d)</code> 포함</li>
            </ul>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm mb-2">결론</p>
            <p className="text-sm"><code>m</code>이 <code>n</code>에서 committed → view <code>v+1</code>에서도 <code>n</code>에 <code>m</code>이 propose됨 → <strong>safety 유지</strong></p>
            <p className="text-xs text-muted-foreground mt-1">엄밀한 증명은 MIT CSAIL 2001 paper. 핵심은 quorum intersection argument.</p>
          </div>
        </div>
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
