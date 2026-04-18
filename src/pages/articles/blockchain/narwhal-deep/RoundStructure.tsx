import RoundViz from './viz/RoundViz';
import { CitationBlock } from '@/components/ui/citation';
import CodePanel from '@/components/ui/code-panel';

const roundCode = `Narwhal 라운드 기반 DAG:

Round r, Validator i:
  1. 자신의 TX 배치(batch)를 수집
  2. Header 생성:
     header = (round=r, author=i, payload_digests,
               parents=[r-1 라운드 증명서들])
  3. Header를 다른 검증자에게 전파
  4. 2f+1 서명 수집 → Certificate 형성
  5. Certificate를 DAG에 삽입

DAG 구조:
  정점(vertex) = (header, certificate)
  간선(edge) = 이전 라운드 증명서 참조
  → 인과관계 그래프 형성

라운드 진행 조건:
  이전 라운드의 2f+1 증명서 수신 → 다음 라운드 시작
  → 동기 가정 없이 진행 (비동기 안전)`;

export default function RoundStructure() {
  return (
    <section id="round-structure" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">라운드 기반 DAG 구조</h2>
      <div className="not-prose mb-8"><RoundViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Danezis et al., EuroSys 2022 — §3" citeKey={1} type="paper"
          href="https://arxiv.org/abs/2105.11827">
          <p className="italic">
            "Narwhal ensures that every transaction submitted to any honest validator is eventually available to all honest validators."
          </p>
        </CitationBlock>

        <CodePanel title="라운드 구조" code={roundCode}
          annotations={[
            { lines: [3, 9], color: 'sky', note: 'Header 생성 → 서명 수집' },
            { lines: [11, 14], color: 'emerald', note: 'DAG 구조: 정점 + 간선' },
            { lines: [16, 18], color: 'amber', note: '비동기 안전한 진행 조건' },
          ]} />

        {/* ── Round advancement ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Round Advancement 상세</h3>
        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">Advance 규칙</p>
          <p className="text-sm mb-1">상태: <code className="text-xs">current_round</code>, <code className="text-xs">round_certs: {'{ round → [certificates] }'}</code></p>
          <p className="text-sm mb-2">조건: <code className="text-xs">len(round_certs[current_round]) &gt;= 2f+1</code> → <code className="text-xs">current_round++</code> → 새 header 생성 + broadcast</p>
          <p className="text-sm text-muted-foreground">Asynchronous(no timeout): fixed round duration 없음. <code className="text-xs">2f+1</code> cert 받는 즉시 advance. 빠른 validator는 빨리, 느린 validator는 뒤처짐 → state sync로 catching up.</p>
        </div>

        <div className="rounded-lg border p-4 bg-muted/50 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">예시 (<code className="text-xs">n=4, f=1</code>)</p>
          <div className="text-sm space-y-1">
            <p><strong>Round 0</strong>: V1-V4 header 생성, <code className="text-xs">2f+1=3</code> signatures로 각자 certificate</p>
            <p><strong>Round 1 advance</strong>: V1이 V1/V2/V3 cert 수신(3 &gt;= <code className="text-xs">2f+1</code>) → advance. parents = <code className="text-xs">[V1_r0_cert, V2_r0_cert, V3_r0_cert]</code></p>
            <p><strong>Byzantine</strong>: V4가 round 0 안 만들어도 V1/V2/V3의 3 certs로 진행 가능</p>
          </div>
        </div>

        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-1">Garbage Collection</p>
          <p className="text-sm">committed round 이전 state 삭제. round가 L 이상 차이나면 GC. memory bound: <code className="text-xs">O(L * n certs)</code>.</p>
        </div>
        <p className="leading-7">
          Round advance: <strong>2f+1 certs 수집 즉시</strong>.<br />
          no timeout = async-safe.<br />
          fast validator는 빨리, slow는 catching up.
        </p>

        {/* ── Parent Selection ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Parent Selection 규칙</h3>
        <div className="rounded-lg border p-4 not-prose mb-4">
          <p className="font-semibold text-sm mb-2">Rules</p>
          <ol className="text-sm space-y-1 list-decimal pl-4">
            <li>반드시 <code className="text-xs">2f+1</code> cert (minimum quorum)</li>
            <li>모두 round <code className="text-xs">(r-1)</code></li>
            <li>distinct authors (같은 validator 1개만)</li>
            <li>certificates verified</li>
          </ol>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Conservative</p>
            <p className="text-sm">처음 받은 <code className="text-xs">2f+1</code> cert만 선택. 빠른 advance. throughput 최적.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Greedy</p>
            <p className="text-sm">가능한 모든 cert 포함(up to n). slow validator 포용. fairness 향상.</p>
          </div>
          <div className="rounded-lg border p-4 bg-muted/50">
            <p className="font-semibold text-sm mb-1">Balanced (실제 구현)</p>
            <p className="text-sm"><code className="text-xs">2f+1</code> minimum 보장 + 시간 여유 시 추가. 실제 5-10 parents.</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Validity (Byzantine 방어)</p>
            <p className="text-sm">Byzantine가 fake parent 참조 → 수신자 cert verification 실패 → header invalid → signature 수집 불가.</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">효과</p>
            <p className="text-sm">parent 많을수록 DAG 연결성 증가 → causal history 풍부 → Bullshark anchor votes 증가 → commit rate 향상.</p>
          </div>
        </div>
        <p className="leading-7">
          Parent 규칙: <strong>2f+1 certs from round (r-1)</strong>.<br />
          distinct authors, all verified.<br />
          많을수록 DAG 연결성 → commit rate 향상.
        </p>

        {/* ── DAG 특성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">DAG 특성과 Invariants</h3>
        <div className="grid gap-3 sm:grid-cols-2 not-prose mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">DAG Invariants</p>
            <ol className="text-sm space-y-1 list-decimal pl-4">
              <li><strong>Round monotonicity</strong> — parent round &lt; child round (cycle 불가)</li>
              <li><strong>Uniqueness</strong> — <code className="text-xs">(author, round)</code> → 1 certificate. Byzantine 2개 시도 시 첫 번째만 <code className="text-xs">2f+1</code> sig 가능</li>
              <li><strong>Connectivity</strong> — 모든 round r vertex는 <code className="text-xs">(r-1)</code>의 <code className="text-xs">2f+1</code> vertex 참조</li>
              <li><strong>Reliability</strong> — cert 존재 → <code className="text-xs">2f+1</code> signed → <code className="text-xs">f+1</code> 정직 → data available</li>
            </ol>
          </div>
          <div className="rounded-lg border border-destructive/30 p-4">
            <p className="font-semibold text-sm mb-2">Byzantine 공격 4종</p>
            <ul className="text-sm space-y-1 list-disc pl-4">
              <li><strong>Equivocation</strong> — 2 headers → honest가 둘 다 sign 안 함, 1개만 cert 가능</li>
              <li><strong>No propose</strong> — 다른 <code className="text-xs">2f+1</code> cert로 round advance, 그냥 제외</li>
              <li><strong>Invalid parents</strong> — cert verification 실패 → signature 못 얻음</li>
              <li><strong>Censoring</strong> — 다른 validator가 참조하면 무효화</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">공격 저항: reliable broadcast + quorum intersection + DAG causal connectivity</p>
          </div>
        </div>
        <p className="leading-7">
          DAG invariants: <strong>round monotonic, unique, connected, reliable</strong>.<br />
          Byzantine 공격 4종 모두 구조적 방어.<br />
          reliable broadcast primitive가 기반.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "round"이 async-safe 기반인가</strong> — no timing assumption.<br />
          전통 BFT: round = time slot (synchronous).<br />
          Narwhal: round = logical counter (asynchronous).<br />
          "2f+1 certs 모이면 advance" — 네트워크 속도에 adaptive.
        </p>
      </div>
    </section>
  );
}
