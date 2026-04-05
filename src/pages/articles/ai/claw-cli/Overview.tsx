import ReplLoopViz from './viz/ReplLoopViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CLI 진입점 &amp; REPL 루프</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ReplLoopViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">rusty-claude-cli 크레이트</h3>
        <p>
          <code>rusty-claude-cli</code>는 claw-code의 <strong>CLI 진입점</strong><br />
          ~10K LOC — 가장 큰 주변 크레이트<br />
          역할: 인자 파싱, REPL 루프, 터미널 렌더링, 슬래시 명령, 프로젝트 초기화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">main() 진입점</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#[tokio::main]
async fn main() -> Result<()> {
    // 1) CLI 인자 파싱
    let args = CliArgs::parse();

    // 2) 로깅 초기화
    init_logger(args.log_level());

    // 3) 서브명령 분기
    match args.command {
        Command::Run => run_repl(args).await,
        Command::Resume { session_id } => resume_session(&session_id, args).await,
        Command::ListSessions => list_sessions(),
        Command::Init => init_project(args).await,
        Command::Config { action } => handle_config(action).await,
        Command::Version => { println!("claw {}", env!("CARGO_PKG_VERSION")); Ok(()) },
    }
}`}</pre>
        <p>
          <strong>6가지 서브명령</strong>: run, resume, list-sessions, init, config, version<br />
          기본은 <code>run</code> — <code>claw</code>만 입력하면 REPL 시작<br />
          <code>tokio::main</code>: 비동기 런타임 — async 함수를 main으로 사용 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CliArgs 정의 — clap 사용</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#[derive(Parser)]
#[command(name = "claw", version, about = "Claw Code CLI")]
pub struct CliArgs {
    #[command(subcommand)]
    pub command: Command,

    #[arg(long)]
    pub read_only: bool,

    #[arg(long = "dangerously-skip-permissions")]
    pub skip_permissions: bool,

    #[arg(long)]
    pub model: Option<String>,

    #[arg(long)]
    pub provider: Option<String>,

    #[arg(long, short)]
    pub verbose: bool,
}

#[derive(Subcommand)]
pub enum Command {
    Run,
    Resume { session_id: String },
    ListSessions,
    Init,
    Config { #[command(subcommand)] action: ConfigAction },
    Version,
}`}</pre>
        <p>
          <strong>clap derive</strong>: 선언적 CLI 파싱<br />
          <code>--long</code>, <code>-s</code> short 플래그 자동 지원<br />
          <code>--help</code> 자동 생성 — 각 필드 주석이 도움말 메시지로
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">REPL 루프</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn run_repl(args: CliArgs) -> Result<()> {
    // 부트스트랩
    let mut runtime = Bootstrap::new().run().await?;

    // 환영 메시지
    print_welcome(&runtime);

    // REPL 루프
    loop {
        // 프롬프트 표시
        print!("\\n> ");
        std::io::stdout().flush()?;

        // 입력 읽기
        let input = read_user_input().await?;
        let trimmed = input.trim();

        if trimmed.is_empty() { continue; }

        // 슬래시 명령 처리
        if trimmed.starts_with('/') {
            match handle_slash_command(trimmed, &mut runtime).await {
                SlashResult::Continue => continue,
                SlashResult::Exit => break,
            }
        }

        // 턴 실행
        if let Err(e) = runtime.run_turn(input).await {
            eprintln!("Error: {}", e);
        }
    }

    // 종료 절차
    runtime.shutdown().await?;
    Ok(())
}`}</pre>
        <p>
          <strong>무한 루프 + break</strong>: 사용자가 <code>/exit</code> 또는 Ctrl+D 시 종료<br />
          슬래시 명령과 일반 입력 분기 — <code>/</code>로 시작하면 명령<br />
          에러 발생해도 세션 계속 — <code>eprintln!</code>로 표시 후 다음 입력 대기
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">멀티라인 입력</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn read_user_input() -> Result<String> {
    use rustyline::DefaultEditor;

    let mut editor = DefaultEditor::new()?;

    // 첫 줄 읽기
    let line = editor.readline("> ")?;

    // \`\`\`로 시작하면 멀티라인 모드
    if line.trim() == "\`\`\`" {
        let mut lines = Vec::new();
        loop {
            let next = editor.readline("... ")?;
            if next.trim() == "\`\`\`" { break; }
            lines.push(next);
        }
        return Ok(lines.join("\\n"));
    }

    Ok(line)
}`}</pre>
        <p>
          <code>rustyline</code>: 편집 가능한 CLI 입력 — 화살표 키, Ctrl+R 히스토리 등<br />
          멀티라인 입력: <code>```</code>로 시작 → <code>```</code>로 종료<br />
          코드 블록 붙여넣기에 유용 — 에러 메시지 여러 줄 전달
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">환영 메시지</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn print_welcome(runtime: &ConversationRuntime) {
    println!("\\n╭─ claw v{} ─╮", env!("CARGO_PKG_VERSION"));
    println!("│ Model: {}", runtime.config.model);
    println!("│ Mode:  {:?}", runtime.config.permission_mode);
    println!("│ Workspace: {}", runtime.workspace.name);
    println!("╰{}╯\\n", "─".repeat(20));

    println!("Type /help for commands, /exit to quit.");
}`}</pre>
        <p>
          <strong>상태 표시</strong>: 모델, 권한 모드, 워크스페이스 정보<br />
          Unicode 박스 문자로 시각적 구분 — 세션 경계 명확<br />
          첫 안내: <code>/help</code>, <code>/exit</code> 힌트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">종료 시그널 처리 — Ctrl+C, Ctrl+D</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 입력 읽기 중 Ctrl+C → 진행 중인 도구 중단
// 입력 읽기 중 Ctrl+D → 세션 종료

async fn read_user_input() -> Result<String> {
    let line = editor.readline("> ");
    match line {
        Ok(l) => Ok(l),
        Err(ReadlineError::Interrupted) => {
            // Ctrl+C: 현재 작업 중단, 세션 유지
            println!("^C");
            Err(anyhow!("interrupted"))
        }
        Err(ReadlineError::Eof) => {
            // Ctrl+D: 세션 종료
            println!("^D");
            Err(anyhow!("eof"))
        }
        Err(e) => Err(e.into()),
    }
}`}</pre>
        <p>
          <strong>Ctrl+C</strong>: 현재 턴 중단, REPL은 계속<br />
          <strong>Ctrl+D</strong>: 세션 종료, graceful shutdown<br />
          bash와 동일한 키바인딩 — 사용자 근육 기억 재사용
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: CLI-first 설계 철학</p>
          <p>
            claw-code는 GUI·웹 UI 없이 <strong>CLI만 제공</strong><br />
            이 선택의 근거:
          </p>
          <p className="mt-2">
            1. <strong>개발자 타겟</strong>: 대상 사용자가 터미널 환경에 익숙<br />
            2. <strong>SSH·tmux 호환</strong>: 원격 서버에서도 동일 경험<br />
            3. <strong>자동화 친화</strong>: 스크립트·파이프로 통합 용이<br />
            4. <strong>가벼움</strong>: 웹 UI 대비 리소스 1/100
          </p>
          <p className="mt-2">
            <strong>CLI의 한계</strong>: 이미지 표시, 인라인 diff 등 시각적 피드백 부족<br />
            claw-code의 대응: ANSI 렌더링 최대한 활용 (다음 섹션)<br />
            필요시 외부 웹 뷰어에 데이터 내보내기 지원 로드맵
          </p>
        </div>

      </div>
    </section>
  );
}
