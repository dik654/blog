import OrchestrationOverviewViz from './viz/OrchestrationOverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에이전틱 AI 오케스트레이션 개요</h2>
      <OrchestrationOverviewViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">Multi-Agent 시스템의 등장 배경</h3>
        <p>
          단일 LLM 대화로 복잡한 작업 수행 시 발생하는 문제:<br />
          <strong>컨텍스트 오염</strong> — 탐색·계획·실행이 같은 context window에 쌓임<br />
          <strong>토큰 비용 폭증</strong> — 복잡 작업일수록 매 턴마다 전체 context 전송<br />
          <strong>집중력 분산</strong> — 하나의 모델이 여러 역할을 동시에 수행 (검색자·계획자·실행자)
        </p>
        <p>
          <strong>Multi-Agent 해결책</strong>:<br />
          - 메인 대화(coordinator)는 사용자와 소통<br />
          - 서브 에이전트(worker)가 특정 작업만 격리 실행<br />
          - 각 worker는 독립 context window 보유<br />
          - 결과만 메인으로 반환 → 컨텍스트 오염 없음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Agent Tool의 역할</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">AgentToolInput</p>
            <ul className="text-sm space-y-1 list-none pl-0">
              <li><code>description</code> — 3-5 word 요약</li>
              <li><code>prompt</code> — sub-agent 실제 작업 지시</li>
              <li><code>subagent_type</code> — <code>"Explore"</code> | <code>"Plan"</code> | <code>"general-purpose"</code> 등</li>
              <li><code>model</code> — override (opus/sonnet/haiku)</li>
              <li><code>isolation</code> — <code>"worktree"</code> 등</li>
            </ul>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">AgentToolOutput</p>
            <ul className="text-sm space-y-1 list-none pl-0">
              <li><code>result</code> — sub-agent의 최종 응답</li>
              <li><code>tool_calls</code> — sub-agent가 호출한 도구 로그</li>
              <li><code>tokens_used</code> — 소비 토큰 수</li>
            </ul>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-2">호출 흐름</p>
          <ol className="text-sm space-y-1 list-decimal pl-4">
            <li>Main agent가 <code>Agent</code> tool 호출</li>
            <li>새 Session 생성 (별도 context)</li>
            <li>Worker에 특정 system prompt 주입</li>
            <li>Worker가 자체 loop 실행 (이 안에서 다른 도구 사용)</li>
            <li>최종 결과만 Main에 반환</li>
          </ol>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Sub-agent 유형 (실제 Claude Code)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Type</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
                <th className="border border-border px-3 py-2 text-left">도구</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>general-purpose</code></td>
                <td className="border border-border px-3 py-2">복합 multi-step 작업, 검색·연구</td>
                <td className="border border-border px-3 py-2">* (all)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Explore</code></td>
                <td className="border border-border px-3 py-2">파일 패턴·키워드 탐색, 코드베이스 답변</td>
                <td className="border border-border px-3 py-2">Read, Grep, Glob 위주</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>Plan</code></td>
                <td className="border border-border px-3 py-2">구현 계획 수립, 아키텍처 결정</td>
                <td className="border border-border px-3 py-2">Read/Grep + 분석</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>claude-code-guide</code></td>
                <td className="border border-border px-3 py-2">Claude Code 기능 질문 답변</td>
                <td className="border border-border px-3 py-2">Glob, Grep, Read, WebFetch</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>statusline-setup</code></td>
                <td className="border border-border px-3 py-2">statusline 설정 전용 유틸</td>
                <td className="border border-border px-3 py-2">Read, Edit 만</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Orchestration의 실제 효과</h3>
        <p className="text-sm text-muted-foreground mb-3">시나리오: "로그인 버그 수정" 요청</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">Single-agent (비효율)</p>
            <ol className="text-sm space-y-1 list-decimal pl-4">
              <li>사용자: "로그인이 안 돼요"</li>
              <li>Main: 전체 codebase 검색 → context <strong>10K</strong></li>
              <li>Main: <code>auth.rs</code> 읽기 → context <strong>30K</strong></li>
              <li>Main: tests 읽기 → context <strong>50K</strong></li>
              <li>Main: 버그 분석 → context <strong>60K</strong></li>
              <li>Main: 수정 → context <strong>70K</strong></li>
            </ol>
            <p className="text-sm mt-2 text-red-600 dark:text-red-400">토큰 비용 높음, context 포화</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">Multi-agent (claw)</p>
            <ol className="text-sm space-y-1 list-decimal pl-4">
              <li>사용자: "로그인이 안 돼요"</li>
              <li><code>Explore</code> agent 호출 → 별도 session에서 Grep/Read 실행 → Main context: <strong>500</strong></li>
              <li><code>Plan</code> agent 호출 → "line 142에 <code>?</code> operator 추가" → Main context: <strong>300</strong></li>
              <li>Main이 <code>Edit</code> 도구로 직접 수정</li>
              <li>Main이 <code>Bash</code>로 테스트 실행</li>
            </ol>
            <p className="text-sm mt-2 text-green-600 dark:text-green-400">총 Main context: 2-3K tokens (30x 절감)</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Session Isolation 구조</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code>spawn_worker</code> — Worker Session 생성</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">완전 분리 (새로 생성)</p>
              <ul className="list-none pl-0 space-y-1">
                <li><code>session_id</code> — 새 UUID (parent와 분리)</li>
                <li><code>messages</code> — system prompt + user prompt만 포함, parent 대화 이력 복사 안 함</li>
                <li><code>tool_registry</code> — <code>filter_tools(agent_type)</code>로 제한된 도구 셋</li>
                <li><code>token_usage</code> — 0에서 시작</li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-xs text-muted-foreground uppercase tracking-wide">공유 (parent 참조)</p>
              <ul className="list-none pl-0 space-y-1">
                <li><code>parent_id</code> — 추적용 (로깅만)</li>
                <li><code>workdir</code> — 파일 시스템만 공유</li>
                <li><code>permission_mode</code> — 동일 권한 모드</li>
              </ul>
            </div>
          </div>
          <p className="text-sm mt-3 text-muted-foreground">핵심: messages는 빈 slate로 시작 → parent의 대화 이력 접근 불가, 주어진 prompt만 보고 판단</p>
        </div>
        <p>
          <strong>격리 경계</strong>:<br />
          - <strong>messages</strong>: 완전 분리 — worker는 자기 prompt만 봄<br />
          - <strong>tool_registry</strong>: agent_type에 따라 필터링 — write 도구 차단 가능<br />
          - <strong>workdir/permission_mode</strong>: 공유 — 같은 파일시스템에서 작업<br />
          - <strong>token_usage</strong>: 독립 — worker 비용이 parent 쿼터에 합산되지만 별도 추적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">결과 반환 흐름</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">AgentToolOutput</p>
            <ul className="text-sm space-y-1 list-none pl-0">
              <li><code>content</code> — 최종 assistant message blocks (Main context에 삽입)</li>
              <li><code>metadata</code> — 로깅/모니터링용 (대화에는 노출되지 않음)</li>
            </ul>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">WorkerMetadata</p>
            <ul className="text-sm space-y-1 list-none pl-0">
              <li><code>session_id</code> — Worker 세션 식별자</li>
              <li><code>tool_calls_count</code> — worker가 사용한 도구 횟수</li>
              <li><code>total_tokens</code> — 소비 토큰 수</li>
              <li><code>wall_time_ms</code> — 실행 시간(ms)</li>
              <li><code>terminated_reason</code> — <code>Completed</code> | <code>BudgetExceeded</code> | <code>Error</code></li>
            </ul>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-2">Main 관점에서 보이는 것</p>
          <p className="text-sm">
            Worker 완료 시 <code>role: "tool"</code> 메시지로 최종 content만 전달<br />
            예: <code>"auth.rs:142에 null check 누락 확인. ..."</code><br />
            metadata는 별도 telemetry 파이프라인으로 흘러가 비용/성능 분석에 사용
          </p>
        </div>
        <p>
          Main은 worker의 내부 과정(어떤 파일을 읽었는지, 몇 번 grep 했는지)을 <strong>전혀 모름</strong><br />
          오직 최종 content 블록만 보고 다음 행동 결정 — information hiding 원칙<br />
          metadata는 별도 telemetry 파이프라인으로 흘러가 비용·성능 분석에 사용
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Context isolation의 힘</p>
          <p>
            <strong>Worker는 "사용 후 버리기"</strong>:<br />
            - Worker session 종료 시 모든 context 폐기<br />
            - 결과 summary만 Main에 반환<br />
            - Worker가 50K token 읽어도 Main에는 500 token 영향
          </p>
          <p className="mt-2">
            <strong>트레이드오프</strong>:<br />
            ✗ Worker 호출 자체에 overhead (별도 API call)<br />
            ✗ Worker는 Main의 context를 모름 (context 전달 필요)<br />
            ✓ Main 대화가 길어질수록 절감 효과 급증<br />
            ✓ 병렬 처리 가능 (여러 worker 동시 실행)
          </p>
          <p className="mt-2">
            <strong>OS 비유</strong>: Main = shell, Worker = 서브셸(<code>$(cmd)</code>)<br />
            서브셸의 변수 변경이 부모에게 영향 없음 — stdout만 부모에게 전달<br />
            claw의 multi-agent도 동일 — worker의 "변수"(context)는 부모에 새지 않음
          </p>
        </div>

      </div>
    </section>
  );
}
