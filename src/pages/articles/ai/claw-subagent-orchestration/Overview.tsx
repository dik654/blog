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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Agent 도구는 "서브 에이전트 스폰" 도구
// rust/crates/tools/src/agent_tool.rs

pub struct AgentToolInput {
    pub description: String,      // 3-5 word 요약
    pub prompt: String,           // sub-agent 실제 작업 지시
    pub subagent_type: String,    // "Explore" | "Plan" | "general-purpose" 등
    pub model: Option<String>,    // override (opus/sonnet/haiku)
    pub isolation: Option<String>, // "worktree" 등
}

pub struct AgentToolOutput {
    pub result: String,           // sub-agent의 최종 응답
    pub tool_calls: Vec<String>,  // sub-agent가 호출한 도구 로그
    pub tokens_used: u64,
}

// 호출 흐름
// Main agent가 "Agent" tool을 호출
//   → 새 Session 생성 (별도 context)
//   → Worker에 특정 system prompt 주입
//   → Worker가 자체 loop 실행 (이 안에서 다른 도구 사용)
//   → 최종 결과만 Main에 반환`}</pre>

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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 시나리오: "로그인 버그 수정" 요청

// Single-agent approach (비효율)
// 1. 사용자: "로그인이 안 돼요"
// 2. Main: 전체 codebase 검색 → context 10K tokens
// 3. Main: auth.rs 읽기 → context 30K tokens
// 4. Main: tests 읽기 → context 50K tokens
// 5. Main: 버그 분석 → context 60K tokens
// 6. Main: 수정 → context 70K tokens
// → 토큰 비용 높음, context 포화

// Multi-agent approach (claw)
// 1. 사용자: "로그인이 안 돼요"
// 2. Main: "Explore agent 호출 → 로그인 관련 파일 찾기"
//    → Worker가 별도 session에서 Grep/Read 실행
//    → 결과: "auth.rs:142에 null check 누락"
//    → Main context: 500 tokens만 소비
// 3. Main: "Plan agent 호출 → 수정 방안"
//    → Worker: "line 142에 ? operator 추가" 반환
//    → Main context: 300 tokens
// 4. Main: Edit 도구로 직접 수정 (worker 불필요)
// 5. Main: Bash로 테스트 실행
// → 총 Main context: 2-3K tokens (30x 절감)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Session Isolation 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Main의 Agent tool 호출 → Worker Session 생성
pub fn spawn_worker(
    parent: &Session,
    agent_type: AgentType,
    prompt: String,
) -> WorkerSession {
    WorkerSession {
        session_id: Uuid::new_v4(),          // 새 ID (parent와 분리)
        parent_id: Some(parent.session_id),  // 추적용 (로깅만)
        messages: vec![                       // parent messages 복사 안 함
            Message::System(agent_type.system_prompt()),
            Message::User(prompt),
        ],
        tool_registry: filter_tools(agent_type),  // 제한된 도구 셋
        token_usage: TokenUsage::zero(),
        workdir: parent.workdir.clone(),     // 파일 시스템만 공유
        permission_mode: parent.permission_mode,
    }
}

// 핵심: messages는 빈 slate로 시작
// → parent의 대화 이력 접근 불가
// → 주어진 prompt만 보고 판단`}</pre>
        <p>
          <strong>격리 경계</strong>:<br />
          - <strong>messages</strong>: 완전 분리 — worker는 자기 prompt만 봄<br />
          - <strong>tool_registry</strong>: agent_type에 따라 필터링 — write 도구 차단 가능<br />
          - <strong>workdir/permission_mode</strong>: 공유 — 같은 파일시스템에서 작업<br />
          - <strong>token_usage</strong>: 독립 — worker 비용이 parent 쿼터에 합산되지만 별도 추적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">결과 반환 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Worker가 완료되면 ToolOutput으로 Main에 주입
pub struct AgentToolOutput {
    pub content: Vec<ContentBlock>,  // 최종 assistant message blocks
    pub metadata: WorkerMetadata,
}

pub struct WorkerMetadata {
    pub session_id: Uuid,
    pub tool_calls_count: u32,       // worker가 사용한 도구 횟수
    pub total_tokens: u64,
    pub wall_time_ms: u64,
    pub terminated_reason: TermReason, // Completed | BudgetExceeded | Error
}

// Main의 context에는 content만 삽입됨
// metadata는 로깅/모니터링용 (대화에는 노출되지 않음)

// Main 관점에서 보이는 것:
// {
//   "role": "tool",
//   "tool_use_id": "toolu_01",
//   "content": "auth.rs:142에 null check 누락 확인. ..."
// }`}</pre>
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
