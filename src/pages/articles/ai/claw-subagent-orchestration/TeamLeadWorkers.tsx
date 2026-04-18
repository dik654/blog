import TeamLeadFlowViz from './viz/TeamLeadFlowViz';

export default function TeamLeadWorkers() {
  return (
    <section id="team-lead-workers" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">팀리드 코디네이터 & 워커 구조</h2>
      <TeamLeadFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Team Lead의 책임</h3>
        <p>
          <strong>Team Lead (Coordinator)</strong>: 사용자 요청을 분해·분배·취합하는 메인 에이전트<br />
          - 태스크 분석: 병렬 vs 순차 판단<br />
          - 워커 선택: 적합한 sub-agent type 결정<br />
          - 결과 취합: 여러 워커 출력을 종합하여 최종 응답 생성<br />
          <strong>Agent 도구</strong>를 통해 sub-agent 스폰
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Parallel Spawning</h3>
        <p className="text-sm text-muted-foreground mb-3">Main agent 응답에서 <code>tool_use</code> 블록 3개를 동시에 포함 → Runtime이 병렬 spawn</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Worker 1 — <code>Explore</code></p>
            <p className="text-sm"><code>description</code>: auth files search</p>
            <p className="text-sm text-muted-foreground">"Find all files in auth/ module..."</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Worker 2 — <code>Explore</code></p>
            <p className="text-sm"><code>description</code>: test coverage scan</p>
            <p className="text-sm text-muted-foreground">"Find existing tests for authentication..."</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Worker 3 — <code>Plan</code></p>
            <p className="text-sm"><code>description</code>: refactor design</p>
            <p className="text-sm text-muted-foreground">"Design refactoring plan..."</p>
          </div>
        </div>
        <p className="text-sm">
          각 Worker는 독립 session + API call로 실행<br />
          모두 완료되면 <code>tool_result</code> x 3 취합 → Main에 전달
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Main vs Worker 차이점</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">속성</th>
                <th className="border border-border px-3 py-2 text-left">Main (Team Lead)</th>
                <th className="border border-border px-3 py-2 text-left">Worker (Sub-agent)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Context window</td>
                <td className="border border-border px-3 py-2">누적 유지</td>
                <td className="border border-border px-3 py-2">매 호출 독립</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">수명</td>
                <td className="border border-border px-3 py-2">세션 전체</td>
                <td className="border border-border px-3 py-2">단일 task 수행</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">사용자 접근</td>
                <td className="border border-border px-3 py-2">Yes (대화)</td>
                <td className="border border-border px-3 py-2">No (격리)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">도구 접근</td>
                <td className="border border-border px-3 py-2">전체 + Agent</td>
                <td className="border border-border px-3 py-2">타입별 제한</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">중첩 Agent 호출</td>
                <td className="border border-border px-3 py-2">Yes</td>
                <td className="border border-border px-3 py-2">No (방지)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">결과 집계 전략</h3>
        <p className="text-sm mb-3">3개 worker 완료 후 <code>tool_result</code> 블록 3개가 한꺼번에 Main context에 삽입</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">toolu_01 결과</p>
            <p className="text-sm text-muted-foreground">auth files: <code>login.rs</code>, <code>session.rs</code>, ...</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">toolu_02 결과</p>
            <p className="text-sm text-muted-foreground">tests found: 4 tests, 2 skipped ...</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">toolu_03 결과</p>
            <p className="text-sm text-muted-foreground">refactor plan: 1) extract trait ...</p>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-2">집계 패턴 3가지</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="font-medium">Merge</p>
              <p className="text-muted-foreground">세 결과를 병합하여 하나의 plan 생성</p>
            </div>
            <div>
              <p className="font-medium">Cross-validate</p>
              <p className="text-muted-foreground">서로 모순 확인 (Explore 결과가 Plan에 반영됐나)</p>
            </div>
            <div>
              <p className="font-medium">Select-best</p>
              <p className="text-muted-foreground">가장 신뢰도 높은 worker 결과만 채택</p>
            </div>
          </div>
        </div>
        <p>
          <strong>집계는 Main의 책임</strong> — worker들은 서로 통신하지 않음<br />
          Main이 통신 hub 역할 — "message passing without shared state"<br />
          이 구조는 Erlang/Actor model의 mailbox 패턴과 동일
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Prompt Engineering: Main → Worker</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3">WorkerPrompt 구조 (best practice)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <ul className="list-none pl-0 space-y-2">
              <li><code>objective</code> — Worker가 달성할 구체적 목표 (1-2 sentences)</li>
              <li><code>relevant_context</code> — Main context에서 필요한 정보만 추출하여 포함</li>
              <li><code>prior_attempts</code> — 이미 시도하거나 배제한 접근 (중복 방지)</li>
            </ul>
            <ul className="list-none pl-0 space-y-2">
              <li><code>expected_output_format</code> — 결과 형식 명시 (JSON, markdown, file list 등)</li>
              <li><code>response_budget_hint</code> — 응답 길이 제한 (예: "keep under 300 words")</li>
            </ul>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-2">예시</p>
          <div className="text-sm space-y-2">
            <p><strong>objective</strong>: "Find the auth bug causing login failures"</p>
            <p><strong>relevant_context</strong>: User reports 500 errors after password change. Auth module is at <code>rust/crates/auth/</code>. Session timeout was recently changed to 30min.</p>
            <p><strong>prior_attempts</strong>: "Checked rate limiting — not the cause", "Tested with new accounts — same issue"</p>
            <p><strong>expected_output_format</strong>: <code>file:line</code> references + 1-sentence hypothesis each</p>
            <p><strong>response_budget_hint</strong>: 5 most suspicious locations, 200 words total</p>
          </div>
        </div>
        <p>
          <strong>Prompt 품질이 결과 품질을 결정</strong>:<br />
          - 목표가 모호하면 worker가 drift (sec 4. Guardrails 참조)<br />
          - Context 누락 시 worker가 잘못된 가정으로 추론<br />
          - Format 명시 없으면 Main이 파싱 어려움
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Worker 실패 처리</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3">WorkerFailure 유형</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>BudgetExceeded</code></p>
              <p className="text-xs text-muted-foreground">token/turn/time cap</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>ToolError</code></p>
              <p className="text-xs text-muted-foreground">권한, 파일 없음</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>MalformedOutput</code></p>
              <p className="text-xs text-muted-foreground">format 불일치</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>InternalRefusal</code></p>
              <p className="text-xs text-muted-foreground">worker 태스크 거부</p>
            </div>
            <div className="bg-background border border-border rounded px-3 py-2">
              <p className="font-medium"><code>Timeout</code></p>
              <p className="text-xs text-muted-foreground">시간 초과</p>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3">Main의 재시도 전략</p>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-medium shrink-0"><code>BudgetExceeded</code></span>
              <span className="text-muted-foreground">→ 스코프 좁혀서 재호출 ("focus only on the 3 most critical files")</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium shrink-0"><code>ToolError</code> (permission)</span>
              <span className="text-muted-foreground">→ 다른 agent type 사용 (더 많은 권한)</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium shrink-0"><code>MalformedOutput</code></span>
              <span className="text-muted-foreground">→ 더 엄격한 format 지정하여 재호출</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium shrink-0"><code>InternalRefusal</code></span>
              <span className="text-muted-foreground">→ Main이 직접 처리 (worker 대신)</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium shrink-0"><code>Timeout</code></span>
              <span className="text-muted-foreground">→ <code>max_turns</code> 줄여서 재호출</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">무한 재시도 방지: Main context에 <code>retry_count</code> 추적 (hard cap 2회)</p>
        </div>
        <p>
          <strong>실패가 normal case</strong> — worker 실패율은 보통 5-15%<br />
          Main이 failure 메시지를 context에 넣고 다음 action 결정 — LLM이 판단<br />
          재시도 횟수는 hard cap 필요 (보통 2회) — LLM은 동일 실수 반복 경향
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Worker의 Agent 호출 금지</p>
          <p>
            <strong>No recursion</strong>: Worker는 Agent 도구 사용 불가<br />
            - 이유 1: 재귀적 spawning → 토큰 비용 폭증<br />
            - 이유 2: 감독 구조 유지 (Main만 워커 관리)<br />
            - 이유 3: 무한 루프 방지
          </p>
          <p className="mt-2">
            <strong>런타임 강제</strong>: Worker session의 tool registry에서 Agent 도구 제거<br />
            Worker가 Agent 호출 시도 시 &quot;unknown tool&quot; 에러 반환
          </p>
          <p className="mt-2">
            <strong>예외</strong>: <code>general-purpose</code> worker는 Agent 호출이 <em>기술적으로</em> 가능<br />
            하지만 claw의 system prompt가 "do not spawn sub-agents"로 명시 억제<br />
            → prompt engineering이 soft guardrail, tool filtering이 hard guardrail
          </p>
        </div>

      </div>
    </section>
  );
}
