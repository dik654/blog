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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Main agent 응답에서 병렬 Agent 호출
{
  "content": [
    {
      "type": "tool_use",
      "id": "toolu_01",
      "name": "Agent",
      "input": {
        "subagent_type": "Explore",
        "description": "auth files search",
        "prompt": "Find all files in auth/ module..."
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_02",
      "name": "Agent",
      "input": {
        "subagent_type": "Explore",
        "description": "test coverage scan",
        "prompt": "Find existing tests for authentication..."
      }
    },
    {
      "type": "tool_use",
      "id": "toolu_03",
      "name": "Agent",
      "input": {
        "subagent_type": "Plan",
        "description": "refactor design",
        "prompt": "Design refactoring plan..."
      }
    }
  ]
}

// Runtime이 3개 Worker 동시 spawn
// 각 Worker: 독립 session + API call
// 모두 완료되면 tool_result × 3 취합 → Main에 전달`}</pre>

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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 3개 worker가 병렬 spawn 후 Main에 돌아오는 결과
// tool_result 블록 3개가 한꺼번에 assistant message에 삽입

[
  { tool_use_id: "toolu_01", content: "auth files: login.rs, session.rs, ..." },
  { tool_use_id: "toolu_02", content: "tests found: 4 tests, 2 skipped ..." },
  { tool_use_id: "toolu_03", content: "refactor plan: 1) extract trait ..." },
]

// Main agent는 이 3개 결과를 자기 context에서 종합
// 다음 turn에서 자체 reasoning으로 action 결정

// 집계 패턴 3가지:
// 1) Merge: 세 결과를 병합하여 하나의 plan 생성
// 2) Cross-validate: 서로 모순이 있는지 확인 (예: Explore가 말한 파일이 Plan에 반영됐나)
// 3) Select-best: 가장 신뢰도 높은 worker의 결과만 채택`}</pre>
        <p>
          <strong>집계는 Main의 책임</strong> — worker들은 서로 통신하지 않음<br />
          Main이 통신 hub 역할 — "message passing without shared state"<br />
          이 구조는 Erlang/Actor model의 mailbox 패턴과 동일
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Prompt Engineering: Main → Worker</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Main이 Worker에 전달하는 prompt 구조 (best practice)

struct WorkerPrompt {
    /// Worker가 달성할 구체적 목표 (1-2 sentences)
    objective: String,

    /// Main context에서 필요한 정보만 추출하여 포함
    relevant_context: String,

    /// 이미 시도하거나 배제한 접근 (중복 방지)
    prior_attempts: Vec<String>,

    /// 결과 형식 명시 (JSON, markdown, file list 등)
    expected_output_format: String,

    /// 응답 길이 제한
    response_budget_hint: String,  // "keep under 300 words"
}

// 예시
WorkerPrompt {
    objective: "Find the auth bug causing login failures",
    relevant_context: "User reports 500 errors after password change. \\
                       Auth module is at rust/crates/auth/. \\
                       Session timeout was recently changed to 30min.",
    prior_attempts: vec![
        "Checked rate limiting — not the cause",
        "Tested with new accounts — same issue",
    ],
    expected_output_format: "file:line references + 1-sentence hypothesis each",
    response_budget_hint: "5 most suspicious locations, 200 words total",
}`}</pre>
        <p>
          <strong>Prompt 품질이 결과 품질을 결정</strong>:<br />
          - 목표가 모호하면 worker가 drift (sec 4. Guardrails 참조)<br />
          - Context 누락 시 worker가 잘못된 가정으로 추론<br />
          - Format 명시 없으면 Main이 파싱 어려움
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Worker 실패 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Worker가 실패하는 경우들
enum WorkerFailure {
    BudgetExceeded(u64),       // token/turn/time cap
    ToolError(String),         // 도구 호출 실패 (권한, 파일 없음)
    MalformedOutput,           // 기대 format 불일치
    InternalRefusal,           // worker가 태스크 거부
    Timeout,
}

// Main이 받는 tool_result
// content: "WORKER_FAILED: BudgetExceeded(10000 tokens) — partial result: ..."

// Main의 재시도 전략
match failure {
    BudgetExceeded(_) => {
        // 1) 스코프 좁혀서 재호출
        //    "focus only on the 3 most critical files"
    }
    ToolError(err) if err.contains("permission") => {
        // 2) 다른 agent type 사용 (더 많은 권한)
    }
    MalformedOutput => {
        // 3) 더 엄격한 format 지정하여 재호출
    }
    InternalRefusal => {
        // 4) Main이 직접 처리 (worker 대신)
    }
    Timeout => {
        // 5) max_turns 줄여서 재호출
    }
}

// 무한 재시도 방지: Main context에 retry_count 추적`}</pre>
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
