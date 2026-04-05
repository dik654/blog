import DispatchViz from './viz/DispatchViz';
import Pipeline5StepViz from './viz/Pipeline5StepViz';

export default function Dispatch() {
  return (
    <section id="dispatch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">execute_tool() 디스패치 파이프라인</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <DispatchViz />

        {/* ── 진입점 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ConversationRuntime → execute_tool() 경로</h3>
        <p>
          에이전트 루프는 LLM 응답에서 <code>tool_use</code> 블록을 발견하면 <code>execute_tool()</code>을 호출<br />
          호출 사이트는 단일 — <code>conversation_runtime.rs</code>의 <code>handle_tool_use()</code> 함수<br />
          이 단일 진입점이 모든 도구 실행의 게이트웨이 역할
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// conversation_runtime.rs (발췌)
async fn handle_tool_use(&mut self, block: ToolUseBlock) -> Result<ToolResult> {
    let ToolUseBlock { id, name, input } = block;
    //    ↑ LLM이 보낸 tool_use 블록 — id는 후속 tool_result와 매칭용

    // 1) 권한 게이트
    let check = self.enforcer.check(&name, &input)?;
    match check {
        EnforcementResult::Deny(reason) => return Ok(ToolResult::error(id, reason)),
        EnforcementResult::Prompt(msg)  => {
            if !self.prompt_user(&msg).await? {
                return Ok(ToolResult::error(id, "user denied"));
            }
        }
        EnforcementResult::Allow => {}
    }

    // 2) Pre-hook 실행 (취소 가능)
    if let Some(abort) = self.hooks.pre_tool(&name, &input).await? {
        return Ok(ToolResult::error(id, abort.reason));
    }

    // 3) 디스패치
    let output = execute_tool(&name, input.clone()).await?;

    // 4) Post-hook 실행
    self.hooks.post_tool(&name, &input, &output).await?;

    // 5) 세션 로그 기록
    self.session.log_tool_call(id.clone(), name, input, output.clone());

    Ok(ToolResult::ok(id, output))
}`}</pre>
        <p>
          <strong>5단계 파이프라인</strong>: 권한 → Pre-hook → 디스패치 → Post-hook → 세션 로그<br />
          각 단계는 독립적 — Pre-hook이 abort하면 디스패치 스킵, Post-hook 실패해도 도구 결과는 반환<br />
          <code>id</code> 필드는 tool_use와 tool_result를 매칭하는 상관 관계 키 — LLM이 병렬 도구 호출 결과를 구분할 때 사용
        </p>
      </div>
      <Pipeline5StepViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── match 분기 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">execute_tool() 내부 — 40개 match 분기</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub async fn execute_tool(name: &str, input: Value) -> Result<ToolOutput> {
    match name {
        // 파일 I/O (3개)
        "read_file"   => {
            let p: TextFilePayload = serde_json::from_value(input)?;
            read_file(p).await
        }
        "write_file"  => write_file(input).await,
        "edit_file"   => edit_file(input).await,

        // 검색 (2개)
        "glob_search" => glob_search(input).await,
        "grep_search" => grep_search(input).await,

        // 실행 (4개)
        "bash"       => execute_bash(input).await,
        "PowerShell" => execute_powershell(input).await,
        "REPL"       => execute_repl(input).await,
        "Sleep"      => execute_sleep(input).await,

        // UI (4개)
        "SendUserMessage" => send_user_message(input).await,
        "Config"          => config_tool(input).await,
        "EnterPlanMode"   => enter_plan_mode(input).await,
        "ExitPlanMode"    => exit_plan_mode(input).await,

        // 태스크 (6개)
        "TaskCreate"  => global_task_registry().create(input).await,
        "TaskGet"     => global_task_registry().get(input).await,
        "TaskList"    => global_task_registry().list(input).await,
        "TaskStop"    => global_task_registry().stop(input).await,
        "TaskUpdate"  => global_task_registry().update(input).await,
        "TaskOutput"  => global_task_registry().output(input).await,

        // 팀 (2개), 크론 (3개), 통합 (5개), MCP (4개), LSP (1개), 기타 (6개)
        // ... 총 40개 분기

        _ => Err(anyhow!("unknown tool: {}", name)),
    }
}`}</pre>
        <p>
          <strong>match 분기 구조</strong>: 문자열 패턴 매칭 + 입력 역직렬화 + 도구 함수 호출<br />
          각 분기는 <code>serde_json::from_value::&lt;T&gt;(input)</code>로 타입 안전 변환 — 역직렬화 실패 시 즉시 에러<br />
          unknown tool 분기는 <strong>대화를 종료하지 않음</strong> — LLM에게 에러를 돌려주고 재시도 기회 제공
        </p>

        {/* ── 입력 타입 시스템 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">도구 입력 타입 — struct 매핑</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 각 도구는 전용 입력 struct를 보유
pub struct TextFilePayload {
    pub path: String,          // 절대 경로 (워크스페이스 검증 대상)
    pub offset: Option<usize>, // 시작 줄 번호 (0-indexed)
    pub limit: Option<usize>,  // 읽을 줄 수
}

pub struct BashCommandInput {
    pub command: String,            // 실행할 셸 명령
    pub timeout: Option<u64>,       // 밀리초 단위, 기본 120000 (2분)
    pub description: Option<String>,// 사용자에게 표시할 설명
    pub run_in_background: bool,    // 백그라운드 실행 여부
}

pub struct GrepSearchInput {
    pub pattern: String,                // 정규식
    pub path: Option<String>,           // 검색 디렉토리
    pub output_mode: Option<OutputMode>,// content | files_with_matches | count
    pub head_limit: Option<usize>,      // 최대 결과 수
    pub case_insensitive: bool,         // -i 플래그
    pub line_numbers: bool,             // -n 플래그
    pub multiline: bool,                // -U 플래그 (cross-line)
}`}</pre>
        <p>
          <strong>타입 시스템의 역할</strong>: JSON Schema 역직렬화 시점에 타입 안전성 강제<br />
          <code>Option&lt;T&gt;</code>는 선택 파라미터 — LLM이 생략해도 컴파일 에러 없음<br />
          <code>enum OutputMode</code>는 허용 값 제한 — 잘못된 문자열 전달 시 역직렬화 실패
        </p>
        <p>
          <strong>설계 판단</strong>: JSON Schema → Rust struct 대응 관계를 수동으로 유지<br />
          자동 생성(코드젠)을 쓰지 않는 이유 — 도구가 40개로 고정적이고 수동 관리가 더 명시적<br />
          스키마 변경 시 struct도 함께 수정 — 두 곳 동기화 부담은 있지만 타입 안전성 확보
        </p>

        {/* ── 비동기 디스패치 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">async 디스패치 — tokio 런타임</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 모든 도구 함수는 async fn
async fn execute_bash(input: Value) -> Result<ToolOutput> {
    let cmd: BashCommandInput = serde_json::from_value(input)?;

    // tokio::process::Command — async 프로세스 실행
    let mut child = tokio::process::Command::new("/bin/bash")
        .arg("-c").arg(&cmd.command)
        .stdout(Stdio::piped()).stderr(Stdio::piped())
        .spawn()?;

    // tokio::time::timeout — async 타임아웃
    let timeout = Duration::from_millis(cmd.timeout.unwrap_or(120_000));
    let output = tokio::time::timeout(timeout, child.wait_with_output())
        .await.map_err(|_| anyhow!("bash timeout"))??;

    Ok(ToolOutput::text(String::from_utf8_lossy(&output.stdout).to_string()))
}`}</pre>
        <p>
          <code>async fn</code>은 tokio 런타임에서 협력적 멀티태스킹으로 실행<br />
          <strong>병렬 도구 호출 지원</strong>: LLM이 여러 tool_use 블록을 한 번에 보내면 <code>tokio::join!</code>으로 동시 실행<br />
          예: Read 3개 파일 병렬 호출 시, 순차 대비 3배 빠름 (I/O bound)
        </p>

        {/* ── 병렬 실행 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">병렬 도구 실행</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// conversation_runtime.rs — 병렬 디스패치
async fn handle_tool_uses_parallel(&mut self, blocks: Vec<ToolUseBlock>) -> Vec<ToolResult> {
    let futures: Vec<_> = blocks.into_iter()
        .map(|block| self.handle_tool_use(block))
        .collect();

    // 모든 도구를 동시에 시작, 결과를 순서대로 수집
    futures::future::join_all(futures).await
        .into_iter()
        .map(|r| r.unwrap_or_else(|e| ToolResult::error_raw(e.to_string())))
        .collect()
}`}</pre>
        <p>
          <code>join_all</code>은 모든 future를 동시 실행 후 Vec 순서대로 결과 반환<br />
          <strong>순서 보장</strong>: 결과 순서는 입력 순서와 동일 — tool_use_id로 LLM이 매칭<br />
          <strong>에러 격리</strong>: 한 도구가 실패해도 다른 도구는 계속 실행 — <code>unwrap_or_else</code>로 에러도 결과로 변환
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: match 분기 vs 트레이트 기반 디스패치</p>
          <p>
            <strong>선택지 A — match 분기 (현재 구현)</strong>:<br />
            - 장점: 컴파일러가 모든 분기를 한눈에 볼 수 있음, cold path 최적화 가능<br />
            - 단점: 도구 추가 시 여러 파일 수정 필요 (ToolSpec + execute_tool + struct)
          </p>
          <p className="mt-2">
            <strong>선택지 B — 트레이트 객체 (<code>Box&lt;dyn ToolExecutor&gt;</code>)</strong>:<br />
            - 장점: 도구 추가가 단일 파일로 완결 (impl ToolExecutor 블록만 추가)<br />
            - 단점: 동적 디스패치 오버헤드, 컴파일 타임에 전체 도구 목록 확인 불가
          </p>
          <p className="mt-2">
            claw-code는 <strong>A를 선택</strong> — 도구가 40개로 고정적이고, 컴파일 타임 검증이 런타임 유연성보다
            중요하다는 판단<br />
            실제로 <code>_ =&gt; Err("unknown tool")</code> 분기가 LLM 환각 대응으로도 활용됨
          </p>
        </div>

      </div>
    </section>
  );
}
