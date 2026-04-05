import BashPipelineViz from './viz/BashPipelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bash 실행 흐름 &amp; 샌드박스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <BashPipelineViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Bash 도구의 위험성</h3>
        <p>
          <code>bash</code>는 claw-code에서 가장 <strong>위험한 도구</strong><br />
          임의 쉘 명령을 실행 — 파일 삭제, 네트워크 접근, 시스템 조작 모두 가능<br />
          <code>DangerFullAccess</code> 권한 요구 — 기본 모드에서 항상 Prompt 발생
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 위험 예시
User:  "임시 파일 정리해줘"
Agent: bash("rm -rf /tmp")      // 의도: 임시 디렉토리 정리
       → 실제: /tmp 전체 삭제, 다른 프로세스 영향

User:  "로그 확인해줘"
Agent: bash("cat /var/log/*")   // 의도: 로그 읽기
       → 실제: /etc/shadow 같은 파일도 접근 가능 (sudo 시)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">BashCommandInput 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct BashCommandInput {
    pub command: String,                    // 실행할 명령
    pub timeout: Option<u64>,               // 밀리초 (기본 120000 = 2분)
    pub description: Option<String>,        // 사용자에게 표시할 설명
    pub run_in_background: bool,            // 백그라운드 실행 여부
    pub working_directory: Option<PathBuf>, // 실행 디렉토리 (기본: workspace)
}`}</pre>
        <p>
          <strong>5개 필드</strong>: command(필수) + 4개 선택<br />
          <code>description</code>은 LLM이 "이 명령이 무엇을 하는지" 사용자에게 설명 — Prompt UI에 표시<br />
          <code>run_in_background</code>: 장시간 실행 명령(서버 등)은 백그라운드로 — stdout 파일로 리다이렉션
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실행 파이프라인 전체 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`execute_bash(input) 흐름:

1. 입력 파싱          BashCommandInput 역직렬화
2. 6단계 검증         (다음 섹션)
   a. Empty check      빈 명령 거부
   b. Length check     10KB 초과 거부
   c. Banned patterns  금지 패턴 매칭
   d. CommandIntent    Destructive 감지 → Prompt
   e. Path validation  작업 디렉토리 검증
   f. Resource limits  rlimit 적용
3. 샌드박스 결정      bubblewrap 가능 여부 확인
4. 서브프로세스 실행   tokio::process::Command
5. 타임아웃 감시       tokio::time::timeout
6. 출력 절단           stdout 8KB, stderr 4KB 상한
7. 결과 반환           ToolOutput { stdout, stderr, exit_code }`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">기본 실행 코드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub async fn execute_bash(input: Value) -> Result<ToolOutput> {
    let cmd: BashCommandInput = serde_json::from_value(input)?;

    // 검증 (6단계)
    BashValidator::new(&cmd).validate()?;

    // 샌드박스 래핑
    let (program, args) = if Sandbox::is_available() {
        Sandbox::wrap_command("/bin/bash", &["-c", &cmd.command])
    } else {
        ("/bin/bash".into(), vec!["-c".into(), cmd.command.clone()])
    };

    // 실행
    let mut child = tokio::process::Command::new(&program)
        .args(&args)
        .current_dir(cmd.working_directory.as_deref().unwrap_or(workspace_root()))
        .stdout(Stdio::piped()).stderr(Stdio::piped())
        .spawn()?;

    // 타임아웃 적용
    let timeout = Duration::from_millis(cmd.timeout.unwrap_or(120_000));
    let output = tokio::time::timeout(timeout, child.wait_with_output())
        .await.map_err(|_| anyhow!("bash timeout after {:?}", timeout))??;

    Ok(ToolOutput {
        stdout: truncate(&String::from_utf8_lossy(&output.stdout), 8192),
        stderr: truncate(&String::from_utf8_lossy(&output.stderr), 4096),
        exit_code: output.status.code().unwrap_or(-1),
    })
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">출력 절단 — truncate</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn truncate(text: &str, max_bytes: usize) -> String {
    if text.len() <= max_bytes {
        return text.to_string();
    }
    let truncated = &text[..max_bytes];
    format!(
        "{}\\n\\n[... truncated, {} bytes total ...]",
        truncated,
        text.len()
    )
}`}</pre>
        <p>
          <strong>절단 한계</strong>: stdout 8KB, stderr 4KB<br />
          이유: LLM 컨텍스트에 들어가는 토큰 수 제한 — 10MB 로그가 대화를 오염시키는 것 방지<br />
          사용자가 전체 출력 필요 시 <code>head</code>, <code>tail</code>, 파일 리다이렉션 사용 권장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">백그라운드 실행 — run_in_background</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`if cmd.run_in_background {
    // stdout/stderr를 파일로 리다이렉션
    let log_path = workspace_root()
        .join(".claw").join("bg-logs").join(format!("{}.log", uuid::Uuid::new_v4()));
    let log_file = File::create(&log_path)?;

    let child = tokio::process::Command::new("/bin/bash")
        .args(&["-c", &cmd.command])
        .stdout(log_file.try_clone()?)
        .stderr(log_file)
        .spawn()?;

    // PID 반환, 종료 대기 없음
    return Ok(ToolOutput::background(child.id(), log_path));
}`}</pre>
        <p>
          <strong>백그라운드 실행 사용 사례</strong>: <code>npm run dev</code>, <code>cargo watch</code>, 테스트 서버 등<br />
          PID와 로그 파일 경로 반환 — 사용자가 후속 명령으로 로그 확인 가능<br />
          세션 종료 시 백그라운드 프로세스는 <strong>자동 종료</strong> (tokio Child가 Drop 시 kill)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: bash vs 전용 도구의 트레이드오프</p>
          <p>
            다른 에이전트 프레임워크는 bash를 금지하고 <strong>전용 도구만</strong> 제공<br />
            - <code>git_commit</code>, <code>npm_install</code>, <code>test_run</code> 같은 한정 도구<br />
            - 장점: 안전, 입력 검증 가능<br />
            - 단점: 표현력 부족 — 복합 파이프(<code>grep | sort | uniq</code>) 불가
          </p>
          <p className="mt-2">
            claw-code의 선택: <strong>bash 유지 + 다층 검증</strong><br />
            - 6단계 검증 + 샌드박스 + Prompt로 위험 최소화<br />
            - 대신 사용자가 bash를 쓸지 말지 선택 가능 (<code>--read-only</code>, Policy 규칙)<br />
            - LLM이 복합 작업을 한 명령으로 표현할 수 있어 효율 ↑
          </p>
          <p className="mt-2">
            이 선택은 "성인 사용자 가정" 철학 — "도구를 뺏기보다 안전 가드 제공"
          </p>
        </div>

      </div>
    </section>
  );
}
