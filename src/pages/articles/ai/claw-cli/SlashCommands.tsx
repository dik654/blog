import SlashCommandViz from './viz/SlashCommandViz';

export default function SlashCommands() {
  return (
    <section id="slash-commands" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">슬래시 명령 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SlashCommandViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">슬래시 명령 목록</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">명령</th>
                <th className="border border-border px-3 py-2 text-left">역할</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2"><code>/help</code></td><td className="border border-border px-3 py-2">도움말 표시</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/exit, /quit</code></td><td className="border border-border px-3 py-2">세션 종료</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/clear</code></td><td className="border border-border px-3 py-2">화면 지우기 (세션 유지)</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/compact</code></td><td className="border border-border px-3 py-2">수동 컴팩션</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/fork</code></td><td className="border border-border px-3 py-2">현재 세션 포크</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/status</code></td><td className="border border-border px-3 py-2">세션 상태·토큰·비용 표시</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/mode &lt;m&gt;</code></td><td className="border border-border px-3 py-2">권한 모드 변경</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/plan</code></td><td className="border border-border px-3 py-2">Plan 모드 진입</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/mcp</code></td><td className="border border-border px-3 py-2">MCP 서버 관리</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/plugin</code></td><td className="border border-border px-3 py-2">플러그인 관리</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/config</code></td><td className="border border-border px-3 py-2">설정 표시·편집</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/cost</code></td><td className="border border-border px-3 py-2">누적 비용 표시</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SlashCommand 트레이트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#[async_trait]
pub trait SlashCommand: Send + Sync {
    fn name(&self) -> &'static str;
    fn aliases(&self) -> &'static [&'static str] { &[] }
    fn description(&self) -> &'static str;

    async fn execute(
        &self,
        args: &[&str],
        runtime: &mut ConversationRuntime,
    ) -> Result<SlashResult>;
}

pub enum SlashResult {
    Continue,  // REPL 계속
    Exit,      // REPL 종료
}`}</pre>
        <p>
          각 명령이 <code>SlashCommand</code> 트레이트 구현<br />
          <code>aliases</code>: 줄임말 지원 — <code>/q</code> = <code>/quit</code><br />
          <code>Continue</code>/<code>Exit</code>만 반환 — 다른 상태 변경은 runtime 수정으로
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">handle_slash_command() — 디스패처</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn handle_slash_command(
    input: &str,
    runtime: &mut ConversationRuntime,
) -> SlashResult {
    // 입력 파싱
    let parts: Vec<&str> = input.trim_start_matches('/').split_whitespace().collect();
    let cmd_name = parts[0];
    let args = &parts[1..];

    // 레지스트리 조회
    let registry = global_slash_registry();
    let command = registry.find(cmd_name);

    match command {
        Some(cmd) => {
            match cmd.execute(args, runtime).await {
                Ok(result) => result,
                Err(e) => {
                    eprintln!("Error: {}", e);
                    SlashResult::Continue
                }
            }
        }
        None => {
            eprintln!("Unknown command: /{}. Type /help for list.", cmd_name);
            SlashResult::Continue
        }
    }
}`}</pre>
        <p>
          <strong>3단계</strong>: 파싱 → 조회 → 실행<br />
          알 수 없는 명령은 에러 메시지 + 세션 계속 — 사용자 실수 방지<br />
          실행 에러도 계속 — 명령 실패가 세션 종료로 이어지지 않음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">구현 예시 — /compact</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct CompactCommand;

#[async_trait]
impl SlashCommand for CompactCommand {
    fn name(&self) -> &'static str { "compact" }

    fn description(&self) -> &'static str {
        "현재 세션을 즉시 컴팩션"
    }

    async fn execute(
        &self,
        _args: &[&str],
        runtime: &mut ConversationRuntime,
    ) -> Result<SlashResult> {
        let before = runtime.session.messages.len();

        let result = compact_session(&runtime.session, &runtime.compact_config)?;
        runtime.session = result.compacted_session;

        let after = runtime.session.messages.len();
        println!("Compacted: {} messages → {} (removed {})",
            before, after, result.removed_count);

        Ok(SlashResult::Continue)
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">구현 예시 — /status</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct StatusCommand;

#[async_trait]
impl SlashCommand for StatusCommand {
    fn name(&self) -> &'static str { "status" }

    async fn execute(
        &self,
        _args: &[&str],
        runtime: &mut ConversationRuntime,
    ) -> Result<SlashResult> {
        let session = &runtime.session;
        let usage = &session.token_usage;

        println!("\\n╭── Session Status ──╮");
        println!("│ ID:       {}", session.id);
        println!("│ Messages: {}", session.messages.len());
        println!("│ Duration: {:?}", Utc::now() - session.started_at);
        println!("│");
        println!("│ Tokens:");
        println!("│   Input:  {} ({})",
            usage.input_tokens, human_number(usage.input_tokens));
        println!("│   Output: {}", human_number(usage.output_tokens));
        println!("│   Cached: {} ({} saved)",
            usage.cache_read_tokens, usage.cache_hit_savings());
        println!("│");
        println!("│ Cost: $\\{:.4}\\", usage.total_cost_usd());
        println!("╰────────────────────╯\\n");

        Ok(SlashResult::Continue)
    }
}`}</pre>
        <p>
          <strong>Unicode 박스 출력</strong>: 상태 정보를 시각적으로 그룹화<br />
          사람이 읽기 쉬운 숫자 형식 (<code>human_number</code>) — "1.5M" 같은<br />
          비용 USD 표시 — 사용자 투명성 확보
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">커스텀 슬래시 명령 — 프로젝트 로컬</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// .claw/slash-commands/my-command.sh
#!/bin/bash
# 이 파일이 있으면 /my-command 명령으로 사용 가능
# stdin: 인자 JSON, stdout: 출력

ARGS=$(cat | jq -r '.args[] | @sh')
echo "Custom command executed with: $ARGS"

// 사용
> /my-command hello world
Custom command executed with: 'hello' 'world'`}</pre>
        <p>
          <strong>파일 기반 커스텀 명령</strong>: <code>.claw/slash-commands/</code>에 스크립트 배치<br />
          파일명이 곧 명령명 — <code>my-command.sh</code> → <code>/my-command</code><br />
          프로젝트별 워크플로우 자동화 — "팀 공용 명령" 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">슬래시 명령 자동완성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// rustyline completer 통합
struct SlashCompleter {
    commands: Vec<String>,
}

impl Completer for SlashCompleter {
    type Candidate = Pair;

    fn complete(
        &self,
        line: &str,
        pos: usize,
        _ctx: &Context<'_>,
    ) -> Result<(usize, Vec<Pair>)> {
        if !line.starts_with('/') { return Ok((pos, vec![])); }

        let prefix = &line[1..pos];
        let matches: Vec<Pair> = self.commands.iter()
            .filter(|c| c.starts_with(prefix))
            .map(|c| Pair {
                display: format!("/{}", c),
                replacement: format!("/{}", c),
            })
            .collect();

        Ok((0, matches))
    }
}`}</pre>
        <p>
          <strong>Tab 누르면 자동완성</strong>: <code>/com</code> + Tab → <code>/compact</code><br />
          rustyline의 Completer 트레이트 구현 — 표준 API<br />
          사용자 학습 곡선 단축 — 명령 외우지 않아도 사용 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 슬래시 명령의 범용성</p>
          <p>
            슬래시 명령은 Discord, Slack, 많은 채팅 앱의 표준 패턴<br />
            사용자 친숙성이 높아 <strong>학습 부담 적음</strong>
          </p>
          <p className="mt-2">
            대안들과 비교:<br />
            - <strong>별도 CLI</strong>: <code>claw compact</code> — REPL에서 나가야 함<br />
            - <strong>함수 호출</strong>: LLM이 도구로 호출 — 의도치 않은 동작 위험<br />
            - <strong>키바인딩</strong>: Ctrl+K 등 — 기억하기 어려움
          </p>
          <p className="mt-2">
            <strong>슬래시 명령이 이긴 이유</strong>:<br />
            ✓ REPL 맥락 유지<br />
            ✓ 명시적 사용자 의도 (LLM 대신 직접 제어)<br />
            ✓ 자동완성으로 탐색 용이<br />
            ✓ 커스텀 확장 간단 (스크립트 파일)
          </p>
        </div>

      </div>
    </section>
  );
}
