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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Worker 스폰 시 max tokens 설정
pub struct WorkerConfig {
    pub max_tokens: u64,         // 예: 10,000 tokens
    pub max_turns: u32,          // 예: 20 turns
    pub timeout_ms: u64,         // 예: 120,000 (2 min)
}

// Runtime이 매 turn 후 체크
impl WorkerSession {
    fn check_budget(&self) -> BudgetCheck {
        if self.tokens_used > self.config.max_tokens {
            return BudgetCheck::Exceeded("token cap");
        }
        if self.turn_count > self.config.max_turns {
            return BudgetCheck::Exceeded("turn cap");
        }
        if self.elapsed_ms() > self.config.timeout_ms {
            return BudgetCheck::Exceeded("timeout");
        }
        BudgetCheck::Ok
    }
}

// Exceeded 시 강제 종료
// → partial result (지금까지 진행된 내용) Main에 반환
// → "budget exceeded" 플래그 포함`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guard 2: Tool Allowlist</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 에이전트 타입별 허용 도구 정의
impl AgentType {
    fn allowed_tools(&self) -> Vec<&'static str> {
        match self {
            AgentType::Explore => vec![
                "read_file", "glob_search", "grep_search",
                // No write tools, no bash
            ],
            AgentType::Plan => vec![
                "read_file", "grep_search", "glob_search",
                // Read-only for planning
            ],
            AgentType::StatuslineSetup => vec![
                "read_file", "edit_file",
                // Only config file editing
            ],
            AgentType::General => vec!["*"],  // All tools
        }
    }
}

// Worker session 생성 시 tool registry 필터링
fn spawn_worker(agent_type: AgentType) -> WorkerSession {
    let allowed = agent_type.allowed_tools();
    let tool_registry = global_registry()
        .filter(|t| allowed.contains(&t.name) || allowed.contains(&"*"));

    WorkerSession::new(tool_registry)
}

// Worker가 disallowed tool 호출 시
// → Err("tool not allowed for this agent type")
// → Worker가 대안 도구 재시도`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guard 3: Scope Restriction</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Worker는 Main의 context를 보지 못함
// Agent 도구 호출 시 prompt 필드로 필요 정보 명시

// Main이 호출
agent_tool.execute(AgentInput {
    subagent_type: "Explore",
    description: "auth bugs",
    prompt: r#"
        Search for authentication bugs in the codebase.

        Context:
        - Auth module is at rust/crates/auth/
        - User reported login failures
        - Focus on null checks and error handling

        Return: list of suspicious lines with file:line refs
    "#,
});

// Worker가 받는 system prompt + user prompt만 전달
// Main conversation history 접근 불가

// 효과
// ✓ Worker가 main dialog 의존성 없음
// ✓ Worker 결과가 context-free → 재사용 가능
// ✓ 독립 테스트 가능`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guard 4: Result Validation</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Worker 종료 시 출력 검증
fn validate_worker_output(output: &WorkerOutput) -> Result<()> {
    // 1) Empty output 방지
    if output.result.is_empty() {
        return Err("worker produced empty result");
    }

    // 2) 최소 token 사용량 (suspiciously short = failure)
    if output.tokens_used < 100 {
        return Err("worker exited too early");
    }

    // 3) 명시적 실패 마커 감지
    if output.result.contains("I cannot") ||
       output.result.contains("unable to") {
        return Err("worker refused task");
    }

    // 4) Format 검증 (구조화 출력인 경우)
    if let Some(schema) = output.expected_schema {
        validate_json_schema(&output.result, schema)?;
    }

    Ok(())
}

// 검증 실패 시
// → Main agent에 retry 또는 alternative 안내
// → 무한 재시도 방지 (max_retries = 2)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Guard 5: Depth Limit — 재귀 방지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Session에 depth 추적
pub struct Session {
    pub depth: u8,               // root = 0, worker = parent+1
    pub max_depth: u8,           // claw 기본값: 1
    ...
}

// Agent tool 호출 시 검증
impl AgentTool {
    fn execute(&self, ctx: &ExecutionContext, input: AgentInput) -> Result<ToolOutput> {
        if ctx.session.depth >= ctx.session.max_depth {
            return Err(ToolError::DepthExceeded {
                current: ctx.session.depth,
                max: ctx.session.max_depth,
            });
        }
        // 정상 spawn
        let child = Session::spawn_child(ctx.session, input)?;
        // child.depth = parent.depth + 1
        run_session(child)
    }
}

// 결과
// Main (depth=0) → Worker (depth=1) ... OK
// Main → Worker → sub-worker ... BLOCKED`}</pre>
        <p>
          <strong>무한 재귀 방지의 핵심 장치</strong> — tool filtering과 이중 방어<br />
          depth=1로 제한하면 flat 구조 강제 — tree가 아닌 star topology<br />
          복잡한 workflow가 필요하면 Main이 순차적으로 worker 호출 (재귀 없이)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Partial Result — Budget Exceeded 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Budget 초과 시에도 빈손으로 돌려주지 않음
impl WorkerSession {
    fn finalize_with_budget_exceeded(&self) -> ToolOutput {
        // 지금까지의 assistant message 중 마지막 의미있는 것
        let last_content = self.messages.iter().rev()
            .filter_map(|m| match m {
                Message::Assistant(content) => Some(content),
                _ => None,
            })
            .next()
            .cloned()
            .unwrap_or_else(|| vec![ContentBlock::Text(
                "Worker exited before producing any output".into()
            )]);

        ToolOutput {
            content: last_content,
            is_error: true,
            metadata: WorkerMetadata {
                terminated_reason: TermReason::BudgetExceeded,
                partial: true,
                ..Default::default()
            },
        }
    }
}

// Main이 partial=true를 보면:
// 1) 결과를 그대로 사용할지 판단
// 2) 부족하면 스코프 좁혀서 재호출
// 3) 받은 partial을 다음 worker에 컨텍스트로 전달`}</pre>
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
