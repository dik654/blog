import GuardrailsViz from './viz/GuardrailsViz';

export default function Guardrails() {
  return (
    <section id="guardrails" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">가드레일 — 일탈 방지 & 권한 회수</h2>
      <GuardrailsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">일탈(Drift) 이란?</h3>
        <p>
          Sub-agent가 원래 태스크 범위를 벗어나 예상 못한 행동:<br />
          - <strong>Scope creep</strong>: 주어진 작업 외 추가 분석 수행 (토큰 낭비)<br />
          - <strong>Infinite exploration</strong>: 관련 없는 파일까지 재귀 탐색<br />
          - <strong>Tool misuse</strong>: 부여받지 않은 도구 호출 시도<br />
          - <strong>Hallucination spiral</strong>: 잘못된 결과 위에 계속 추론
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guard 1: Token Budget Cap</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3">WorkerConfig — 스폰 시 설정</p>
          <div className="grid grid-cols-3 gap-2 text-sm mb-4">
            <div className="bg-background border border-border rounded px-3 py-2 text-center">
              <p className="font-medium"><code>max_tokens</code></p>
              <p className="text-muted-foreground">예: 10,000</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2 text-center">
              <p className="font-medium"><code>max_turns</code></p>
              <p className="text-muted-foreground">예: 20 turns</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2 text-center">
              <p className="font-medium"><code>timeout_ms</code></p>
              <p className="text-muted-foreground">예: 120,000 (2 min)</p>
            </div>
          </div>
          <p className="font-semibold text-sm mb-2"><code>check_budget</code> — 매 turn 후 체크</p>
          <p className="text-sm">
            <code>tokens_used</code>, <code>turn_count</code>, <code>elapsed_ms</code> 세 가지를 순차 비교<br />
            하나라도 초과 시 <code>BudgetCheck::Exceeded</code> 반환 → 강제 종료<br />
            partial result (지금까지 진행된 내용) + <code>"budget exceeded"</code> 플래그를 Main에 반환
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guard 2: Tool Allowlist</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3">에이전트 타입별 허용 도구</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>Explore</code></p>
              <p className="text-xs text-muted-foreground"><code>read_file</code>, <code>glob_search</code>, <code>grep_search</code></p>
              <p className="text-xs text-red-500 dark:text-red-400">No write, no bash</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>Plan</code></p>
              <p className="text-xs text-muted-foreground"><code>read_file</code>, <code>grep_search</code>, <code>glob_search</code></p>
              <p className="text-xs text-red-500 dark:text-red-400">Read-only</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>StatuslineSetup</code></p>
              <p className="text-xs text-muted-foreground"><code>read_file</code>, <code>edit_file</code></p>
              <p className="text-xs text-amber-500 dark:text-amber-400">Config 편집만</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>General</code></p>
              <p className="text-xs text-muted-foreground"><code>*</code> (All tools)</p>
              <p className="text-xs text-green-500 dark:text-green-400">전체 접근</p>
            </div>
          </div>
          <p className="text-sm mt-3 text-muted-foreground">
            Worker session 생성 시 <code>global_registry()</code>에서 허용 도구만 필터링<br />
            Worker가 disallowed tool 호출 시 → <code>"tool not allowed for this agent type"</code> 에러 → Worker가 대안 도구 재시도
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guard 3: Scope Restriction</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3">Worker는 Main의 context를 보지 못함</p>
          <p className="text-sm mb-3">Agent 도구 호출 시 <code>prompt</code> 필드로 필요 정보만 명시적으로 전달</p>
          <div className="bg-background border border-border rounded px-3 py-3 text-sm mb-3">
            <p className="font-medium mb-1">예시: <code>Explore</code> agent 호출</p>
            <ul className="list-none pl-0 space-y-1 text-muted-foreground">
              <li><strong>목표</strong>: Search for authentication bugs in the codebase</li>
              <li><strong>Context</strong>: Auth module is at <code>rust/crates/auth/</code>, User reported login failures</li>
              <li><strong>Focus</strong>: null checks and error handling</li>
              <li><strong>Return</strong>: list of suspicious lines with <code>file:line</code> refs</li>
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded px-3 py-2 text-center">
              <p className="text-green-700 dark:text-green-300">main dialog 의존성 없음</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded px-3 py-2 text-center">
              <p className="text-green-700 dark:text-green-300">결과 context-free → 재사용 가능</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded px-3 py-2 text-center">
              <p className="text-green-700 dark:text-green-300">독립 테스트 가능</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guard 4: Result Validation</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code>validate_worker_output</code> — Worker 종료 시 출력 검증</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium">1) Empty 방지</p>
              <p className="text-xs text-muted-foreground"><code>result.is_empty()</code> → 빈 출력 거부</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium">2) 최소 사용량</p>
              <p className="text-xs text-muted-foreground"><code>tokens_used &lt; 100</code> → 너무 짧으면 실패</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium">3) 거부 감지</p>
              <p className="text-xs text-muted-foreground">"I cannot", "unable to" 포함 시 거부 판정</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium">4) Format 검증</p>
              <p className="text-xs text-muted-foreground"><code>expected_schema</code> 있으면 JSON schema 검증</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            검증 실패 시 Main agent에 retry 또는 alternative 안내, 무한 재시도 방지 (<code>max_retries = 2</code>)
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guard 5: Depth Limit — 재귀 방지</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3">Session depth 추적</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <ul className="list-none pl-0 space-y-1">
                <li><code>depth</code> — root = 0, worker = parent+1</li>
                <li><code>max_depth</code> — claw 기본값: <strong>1</strong></li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1"><code>AgentTool.execute</code> 검증</p>
              <p className="text-muted-foreground"><code>depth &gt;= max_depth</code> 시 <code>DepthExceeded</code> 에러 반환</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded px-3 py-2 text-center">
              <p className="text-green-700 dark:text-green-300">Main (depth=0) → Worker (depth=1) <strong>OK</strong></p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded px-3 py-2 text-center">
              <p className="text-red-700 dark:text-red-300">Main → Worker → sub-worker <strong>BLOCKED</strong></p>
            </div>
          </div>
        </div>
        <p>
          <strong>무한 재귀 방지의 핵심 장치</strong> — tool filtering과 이중 방어<br />
          depth=1로 제한하면 flat 구조 강제 — tree가 아닌 star topology<br />
          복잡한 workflow가 필요하면 Main이 순차적으로 worker 호출 (재귀 없이)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Partial Result — Budget Exceeded 처리</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code>finalize_with_budget_exceeded</code> — 빈손 반환 방지</p>
          <p className="text-sm mb-3">
            Budget 초과 시 지금까지의 assistant message 중 <strong>마지막 의미있는 것</strong>을 추출<br />
            없으면 <code>"Worker exited before producing any output"</code> 기본 메시지 반환
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium">ToolOutput</p>
              <ul className="list-none pl-0 space-y-1 text-muted-foreground text-xs mt-1">
                <li><code>content</code> — 마지막 assistant message</li>
                <li><code>is_error</code> — <code>true</code></li>
                <li><code>terminated_reason</code> — <code>BudgetExceeded</code></li>
                <li><code>partial</code> — <code>true</code></li>
              </ul>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium">Main의 후속 처리</p>
              <ol className="list-decimal pl-4 text-xs text-muted-foreground space-y-1 mt-1">
                <li>결과를 그대로 사용할지 판단</li>
                <li>부족하면 스코프 좁혀서 재호출</li>
                <li>받은 partial을 다음 worker에 컨텍스트로 전달</li>
              </ol>
            </div>
          </div>
        </div>
        <p>
          <strong>"전부 아니면 무(無)" 피하기</strong> — 중간 결과도 가치 있음<br />
          LLM이 10K 토큰 중 7K를 태스크에 쓰고 3K는 wrap-up에 써야 하는 경우<br />
          → 7K 결과만 있어도 Main이 이어서 작업 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guardrail 계층 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Guard</th>
                <th className="border border-border px-3 py-2 text-left">적용 시점</th>
                <th className="border border-border px-3 py-2 text-left">실패 비용</th>
                <th className="border border-border px-3 py-2 text-left">우회 가능성</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Token Budget</td>
                <td className="border border-border px-3 py-2">매 turn 후</td>
                <td className="border border-border px-3 py-2">높음 (비용 누적)</td>
                <td className="border border-border px-3 py-2">불가 (runtime)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Tool Allowlist</td>
                <td className="border border-border px-3 py-2">도구 호출 시</td>
                <td className="border border-border px-3 py-2">중간 (재시도)</td>
                <td className="border border-border px-3 py-2">불가 (registry)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Scope Restriction</td>
                <td className="border border-border px-3 py-2">spawn 시</td>
                <td className="border border-border px-3 py-2">낮음 (context)</td>
                <td className="border border-border px-3 py-2">prompt 의존</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Result Validation</td>
                <td className="border border-border px-3 py-2">완료 후</td>
                <td className="border border-border px-3 py-2">중간 (재호출)</td>
                <td className="border border-border px-3 py-2">불가 (post-hoc)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Depth Limit</td>
                <td className="border border-border px-3 py-2">spawn 시</td>
                <td className="border border-border px-3 py-2">높음 (무한루프)</td>
                <td className="border border-border px-3 py-2">불가 (runtime)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 일탈의 경제적 비용</p>
          <p>
            <strong>Drift 없이 이상적 worker 실행</strong>: 2K tokens<br />
            <strong>Drift 발생 worker 실행</strong>: 20K+ tokens (10x)<br />
            4-layer guardrails가 없으면 실제 에이전트 비용이 급증
          </p>
          <p className="mt-2">
            <strong>현실적 케이스</strong>:<br />
            - 파일 하나 찾으라 했는데 전체 codebase 스캔 시작<br />
            - 단순 요약 요청에 원본 재인용 루프<br />
            - &quot;관련 파일 3개 찾기&quot; → 30개 반환
          </p>
          <p className="mt-2">
            <strong>제한이 품질을 높임</strong>:<br />
            Token cap이 있으면 worker가 우선순위 정리<br />
            Tool allowlist가 있으면 공격적 스캔 불가<br />
            Scope restriction이 있으면 태스크에 집중
          </p>
        </div>

      </div>
    </section>
  );
}
