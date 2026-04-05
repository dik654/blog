import ExecutionViz from './viz/ExecutionViz';

export default function ToolExecution() {
  return (
    <section id="tool-execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">플러그인 도구 서브프로세스 실행</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ExecutionViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">LLM → 플러그인 도구 호출 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`LLM 응답: tool_use { name: "lint_check", input: {path: "src/main.rs"} }
    ↓
ConversationRuntime::handle_tool_use()
    ↓
execute_tool("lint_check", input)
    ↓
match name {
    // ... 빌트인 분기 ...
    _ => {
        // 플러그인 도구 매칭 시도
        if let Some(plugin_tool) = global_tool_registry()
            .find_plugin_tool(name) {
            return execute_plugin_tool(plugin_tool, input).await;
        }
        Err("unknown tool")
    }
}`}</pre>
        <p>
          빌트인 40개 매칭 실패 시 <strong>플러그인 도구 폴백</strong><br />
          플러그인 도구 네임스페이스는 빌트인과 동일 — 사용자는 구분 없이 호출<br />
          도구 등록 시 <strong>이름 충돌 검사</strong>로 모호성 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">execute_plugin_tool() 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn execute_plugin_tool(
    plugin_tool: &PluginTool,
    input: Value,
) -> Result<ToolOutput> {
    let plugin = global_plugin_registry().get(&plugin_tool.plugin_name)?;
    let entrypoint = plugin.plugin_dir.join(&plugin.manifest.entrypoint);

    // 1) 서브프로세스 생성
    let mut cmd = tokio::process::Command::new(&entrypoint);
    cmd.arg("--tool").arg(&plugin_tool.name)
       .stdin(Stdio::piped())
       .stdout(Stdio::piped())
       .stderr(Stdio::piped())
       .current_dir(workspace_root());

    // 2) 자원 제한 적용
    #[cfg(unix)]
    apply_rlimits(&mut cmd, &plugin.manifest.resource_limits);

    // 3) 환경 변수 설정
    cmd.env("CLAW_PLUGIN", &plugin_tool.plugin_name)
       .env("CLAW_TOOL", &plugin_tool.name)
       .env("CLAW_WORKSPACE", workspace_root());

    // 4) spawn
    let mut child = cmd.spawn()?;

    // 5) stdin으로 JSON 전송
    let stdin = child.stdin.as_mut().unwrap();
    stdin.write_all(serde_json::to_vec(&input)?.as_slice()).await?;
    stdin.shutdown().await?;

    // 6) 타임아웃 적용
    let timeout = Duration::from_millis(plugin.manifest.resource_limits.timeout_ms);
    let output = tokio::time::timeout(timeout, child.wait_with_output())
        .await.map_err(|_| anyhow!("plugin timeout"))??;

    // 7) 결과 파싱
    parse_plugin_output(output)
}`}</pre>
        <p>
          <strong>7단계 실행</strong>: 프로세스 생성 → rlimit → env → spawn → stdin 전송 → timeout → 결과 파싱<br />
          <code>--tool</code> 플래그로 호출할 도구 이름 전달 — 플러그인이 여러 도구 제공 시 구분<br />
          환경 변수 3개 자동 주입 — 플러그인이 컨텍스트 파악 용이
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">plugin output 프로토콜</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 플러그인의 stdout JSON 응답
{
  "success": true,
  "output": "...",              // 주 출력 (LLM에게 전달)
  "stderr_info": "...",         // 부가 정보 (로깅만)
  "metadata": {                 // 선택: 추가 메타데이터
    "files_checked": 15,
    "warnings": 3
  }
}

// 실패 응답
{
  "success": false,
  "error": "lint failed: undefined variable 'x'",
  "output": ""
}`}</pre>
        <p>
          <strong>표준화된 응답 포맷</strong>: success, output, metadata<br />
          <code>output</code>이 LLM에게 tool_result로 전달 — 주 반환값<br />
          <code>metadata</code>: 플러그인이 추가 정보 제공 — 텔레메트리·감사에 활용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">parse_plugin_output() — 응답 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn parse_plugin_output(output: std::process::Output) -> Result<ToolOutput> {
    // exit code 확인
    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(anyhow!(
            "plugin exited with code {:?}: {}",
            output.status.code(), stderr
        ));
    }

    // stdout JSON 파싱
    let parsed: PluginResponse = serde_json::from_slice(&output.stdout)
        .map_err(|e| anyhow!("plugin output not JSON: {}", e))?;

    if parsed.success {
        Ok(ToolOutput::text(parsed.output))
    } else {
        Err(anyhow!("plugin error: {}", parsed.error.unwrap_or_default()))
    }
}`}</pre>
        <p>
          <strong>2단계 검증</strong>: exit code → JSON 파싱<br />
          exit code 비정상 시 stderr 포함하여 에러 반환 — 디버깅 용이<br />
          JSON 파싱 실패 = 플러그인 버그 — 프로토콜 위반으로 즉시 에러
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">rlimit 적용 (Unix)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#[cfg(unix)]
fn apply_rlimits(cmd: &mut Command, limits: &ResourceLimits) {
    use std::os::unix::process::CommandExt;

    let mem_bytes = (limits.max_memory_mb as u64) * 1024 * 1024;
    let cpu_secs = limits.max_cpu_seconds as u64;

    unsafe {
        cmd.pre_exec(move || {
            // CPU 시간 제한
            libc::setrlimit(libc::RLIMIT_CPU, &libc::rlimit {
                rlim_cur: cpu_secs, rlim_max: cpu_secs,
            });
            // 메모리 제한 (address space)
            libc::setrlimit(libc::RLIMIT_AS, &libc::rlimit {
                rlim_cur: mem_bytes, rlim_max: mem_bytes,
            });
            // 파일 크기 제한 (10MB)
            libc::setrlimit(libc::RLIMIT_FSIZE, &libc::rlimit {
                rlim_cur: 10 * 1024 * 1024, rlim_max: 10 * 1024 * 1024,
            });
            Ok(())
        });
    }
}`}</pre>
        <p>
          <strong>3가지 rlimit 강제</strong>: CPU, 메모리, 파일 크기<br />
          <code>pre_exec</code>는 fork 후 exec 전에 실행 — 자식 프로세스에만 적용<br />
          한계 초과 시 kernel이 SIGKILL 자동 전송 — 플러그인이 "자원 폭주" 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">플러그인 크래시 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 플러그인 크래시 시 시나리오
use std::process::ExitStatus;

match output.status.code() {
    Some(0) => {
        // 정상 종료
    }
    Some(1) => {
        // 일반 에러 — 플러그인이 error 응답 내보냈을 것
    }
    Some(137) => {
        // SIGKILL (rlimit 초과 또는 외부 kill)
        return Err(anyhow!("plugin killed (likely resource limit)"));
    }
    Some(139) => {
        // SIGSEGV (segfault)
        log::error!("plugin segfault: {}", plugin_name);
        return Err(anyhow!("plugin crashed (segfault)"));
    }
    _ => {
        return Err(anyhow!("plugin exited abnormally"));
    }
}`}</pre>
        <p>
          <strong>exit code 해석</strong>:<br />
          - 0: 정상<br />
          - 1: 일반 에러<br />
          - 137(128+9): SIGKILL — rlimit 초과<br />
          - 139(128+11): SIGSEGV — 메모리 오류<br />
          플러그인 버그가 메인 프로세스에 영향 없음 — 서브프로세스 격리의 가치
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 서브프로세스 vs FFI 비교</p>
          <p>
            플러그인 확장 방식 2가지:<br />
            1. <strong>서브프로세스</strong> (claw-code 선택): 별도 프로세스, JSON 프로토콜<br />
            2. <strong>FFI/dylib</strong>: 공유 라이브러리 로드, 함수 호출
          </p>
          <p className="mt-2">
            <strong>서브프로세스 장점</strong>:<br />
            ✓ 언어 무관 (Python, Go, Bash 등)<br />
            ✓ 격리 — 크래시·메모리 누수가 메인에 영향 없음<br />
            ✓ 자원 제한 가능 (rlimit)<br />
            ✓ 보안 — 샌드박스 적용 가능
          </p>
          <p className="mt-2">
            <strong>서브프로세스 단점</strong>:<br />
            ✗ 호출당 오버헤드(~20ms) — fork/exec + JSON 파싱<br />
            ✗ 상태 공유 없음 — 매번 파일/DB로 복원
          </p>
          <p className="mt-2">
            claw-code는 <strong>안전 &gt; 속도</strong> 선택 — 에이전트 도구는 초당 수십 번 호출 안 함<br />
            20ms 오버헤드는 LLM 응답 시간(수 초) 대비 무시할 수준
          </p>
        </div>

      </div>
    </section>
  );
}
