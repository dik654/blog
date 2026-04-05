import PluginArchViz from './viz/PluginArchViz';
import PluginSubprocessViz from './viz/PluginSubprocessViz';
import RegisterFlowViz from './viz/RegisterFlowViz';
import PluginVsMcpViz from './viz/PluginVsMcpViz';

export default function PluginTools() {
  return (
    <section id="plugin-tools" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">플러그인 도구 통합</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PluginArchViz />

        {/* ── 플러그인 vs 빌트인 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">플러그인 도구의 위치</h3>
        <p>
          <code>GlobalToolRegistry</code>는 3계층 구조 — <strong>빌트인 + 플러그인 + MCP(런타임)</strong><br />
          플러그인은 정적 확장 계층 — 프로세스 시작 시 <code>settings.json</code> 파싱 후 고정<br />
          MCP는 동적 확장 계층 — 런타임 중에 서버 추가/제거 가능
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// GlobalToolRegistry 내부 상태
pub struct GlobalToolRegistry {
    builtin: Vec<ToolSpec>,              // 고정 40개 (mvp_tool_specs())
    plugin_tools: Vec<PluginTool>,       // 정적 확장 (settings.json)
    runtime_tools: Vec<RuntimeToolDefinition>, // 동적 확장 (MCP)
    enforcer: Option<PermissionEnforcer>,
}`}</pre>
        <p>
          세 계층의 <strong>수명 차이</strong>가 핵심:<br />
          - 빌트인: 컴파일 타임 결정, 프로세스 종료까지 불변<br />
          - 플러그인: 설정 파싱 시점에 결정, 재시작 전까지 불변<br />
          - MCP: 런타임 이벤트(서버 연결/해제)에 따라 동적 변경
        </p>
      </div>
      <PluginSubprocessViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── PluginManifest ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">PluginManifest 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// plugin-manifest.json (플러그인 루트에 위치)
{
  "name": "my-linter",
  "version": "0.1.0",
  "kind": "tool-provider",
  "entrypoint": "./bin/my-linter",
  "tools": [
    {
      "name": "lint_check",
      "description": "프로젝트 린트 실행 및 결과 반환",
      "input_schema": {
        "type": "object",
        "properties": {
          "path": {"type": "string"}
        },
        "required": ["path"]
      },
      "required_permission": "ReadOnly"
    }
  ]
}`}</pre>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Rust struct 매핑
pub struct PluginManifest {
    pub name: String,
    pub version: String,
    pub kind: PluginKind,       // ToolProvider | HookProvider | ContextProvider
    pub entrypoint: PathBuf,    // 서브프로세스 실행 파일 경로
    pub tools: Vec<ToolSpec>,   // 플러그인이 제공하는 도구 스펙
}

pub enum PluginKind {
    ToolProvider,     // 도구를 제공
    HookProvider,     // Pre/Post 훅 제공
    ContextProvider,  // 시스템 프롬프트에 컨텍스트 추가
}`}</pre>
        <p>
          <code>PluginKind</code>로 플러그인 유형을 명시 — ToolProvider만 도구 레지스트리에 등록<br />
          <code>entrypoint</code>는 서브프로세스로 실행되는 실행 파일 경로 — 언어 무관(Rust, Python, Go, Node.js 등)<br />
          <code>tools</code> 배열이 해당 플러그인이 제공하는 도구 목록
        </p>

        {/* ── 등록 플로우 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">PluginRegistry 등록 플로우</h3>
      </div>
      <RegisterFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// plugins/registry.rs
impl PluginRegistry {
    pub fn register(&mut self, manifest: PluginManifest) -> Result<()> {
        // 1) 이름 충돌 검사
        for tool in &manifest.tools {
            if self.has_tool(&tool.name) {
                return Err(anyhow!("duplicate tool name: {}", tool.name));
            }
        }

        // 2) entrypoint 실행 파일 검증
        if !manifest.entrypoint.is_file() {
            return Err(anyhow!("entrypoint not found: {:?}", manifest.entrypoint));
        }

        // 3) 실행 권한 검증 (Unix)
        #[cfg(unix)] {
            let perm = std::fs::metadata(&manifest.entrypoint)?.permissions();
            if perm.mode() & 0o111 == 0 {
                return Err(anyhow!("entrypoint not executable"));
            }
        }

        // 4) 전역 레지스트리에 추가
        self.plugins.push(Plugin::new(manifest));
        Ok(())
    }
}`}</pre>
        <p>
          <strong>3단계 검증</strong>: 이름 충돌 → 파일 존재 → 실행 권한<br />
          이름 충돌은 <strong>빌트인/다른 플러그인 도구명과 비교</strong> — 모든 도구명이 유일해야 함<br />
          실행 권한 검증은 Unix 한정 — Windows는 <code>.exe</code> 확장자만 확인
        </p>

        {/* ── 서브프로세스 실행 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">플러그인 도구 호출 — 서브프로세스 통신</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`async fn execute_plugin_tool(
    plugin: &Plugin,
    tool_name: &str,
    input: Value,
) -> Result<ToolOutput> {
    // 1) 서브프로세스 spawn
    let mut child = tokio::process::Command::new(&plugin.entrypoint)
        .arg("--tool").arg(tool_name)  // 호출할 도구 이름
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()?;

    // 2) stdin으로 JSON 입력 전송
    let stdin = child.stdin.as_mut().unwrap();
    stdin.write_all(serde_json::to_string(&input)?.as_bytes()).await?;
    stdin.shutdown().await?;  // EOF 전송 → 플러그인 읽기 완료

    // 3) stdout에서 JSON 결과 수신 (타임아웃 30초)
    let output = tokio::time::timeout(
        Duration::from_secs(30),
        child.wait_with_output(),
    ).await??;

    // 4) 종료 코드 검증
    if !output.status.success() {
        return Err(anyhow!(
            "plugin tool failed: {}",
            String::from_utf8_lossy(&output.stderr)
        ));
    }

    // 5) JSON 파싱
    let result: ToolOutput = serde_json::from_slice(&output.stdout)?;
    Ok(result)
}`}</pre>
        <p>
          <strong>stdin/stdout JSON 프로토콜</strong>: 요청은 stdin, 응답은 stdout<br />
          stderr는 에러/로그 전용 — 종료 코드 비정상 시 stderr 내용을 에러 메시지에 포함<br />
          <strong>타임아웃 30초</strong>: MCP(기본 120초)보다 짧음 — 플러그인은 경량 연산 가정
        </p>

        {/* ── 격리 보장 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">서브프로세스 격리 보장</h3>
        <p>
          플러그인은 <strong>별도 프로세스</strong>로 실행되어 claw-code 메인 프로세스와 메모리/파일 디스크립터 격리<br />
          플러그인 크래시해도 메인 프로세스 영향 없음 — <code>execute_plugin_tool()</code>이 에러 반환 후 계속 실행<br />
          <strong>자원 제한</strong>: Unix에서는 <code>setrlimit</code>으로 CPU·메모리 한계 설정 가능 (선택)
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Unix rlimit 적용 예시 (선택 기능)
#[cfg(unix)]
fn apply_rlimits(cmd: &mut Command, limits: &ResourceLimits) {
    use std::os::unix::process::CommandExt;

    unsafe {
        cmd.pre_exec(move || {
            // CPU 시간 제한 (초)
            libc::setrlimit(libc::RLIMIT_CPU, &libc::rlimit {
                rlim_cur: limits.cpu_secs,
                rlim_max: limits.cpu_secs,
            });
            // 메모리 제한 (바이트)
            libc::setrlimit(libc::RLIMIT_AS, &libc::rlimit {
                rlim_cur: limits.mem_bytes,
                rlim_max: limits.mem_bytes,
            });
            Ok(())
        });
    }
}`}</pre>
        <p>
          <code>pre_exec</code>는 fork 후 exec 전에 실행되는 클로저 — 자식 프로세스에만 rlimit 적용<br />
          <code>unsafe</code> 블록: libc 직접 호출 필요 — Rust 표준 라이브러리에 setrlimit 래퍼 없음<br />
          플러그인이 무한 루프·메모리 누수 상황에도 메인 프로세스 보호
        </p>

        {/* ── 플러그인 권한 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">플러그인 도구의 권한 처리</h3>
        <p>
          플러그인 도구도 <strong>PermissionMode</strong> 체계를 따름 — 매니페스트의 <code>required_permission</code> 필드가 최소 권한 지정<br />
          플러그인이 <code>DangerFullAccess</code>를 요구하면 Prompt 모드에서 사용자 확인 필수<br />
          <strong>신뢰된 플러그인</strong>: <code>settings.json</code>의 <code>trusted_plugins</code> 리스트에 등재 시 Prompt 생략
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// settings.json
{
  "plugins": [
    {"path": "/opt/claw/plugins/my-linter", "trusted": true},
    {"path": "/opt/claw/plugins/risky-tool", "trusted": false}
  ]
}`}</pre>

        {/* ── 인사이트 ── */}
      </div>
      <PluginVsMcpViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 플러그인 vs MCP — 언제 무엇을 쓰나</p>
          <p>
            <strong>플러그인이 유리한 경우</strong>:<br />
            - 프로젝트 전용 커스텀 도구 (예: 사내 린터, 배포 스크립트)<br />
            - 수명이 짧은 도구 — 호출당 1회 실행 후 종료<br />
            - 언어 중립 — 실행 파일만 있으면 됨 (Bash 스크립트도 가능)
          </p>
          <p className="mt-2">
            <strong>MCP가 유리한 경우</strong>:<br />
            - 장수명 서버 — DB 연결, API 인증 세션 등 상태 유지<br />
            - 여러 도구를 한 서버에서 제공 — 리소스 공유<br />
            - 표준화된 프로토콜 필요 — 외부 공개/공유 도구
          </p>
          <p className="mt-2">
            <strong>구분 기준</strong>: "호출당 stateless → 플러그인, 연결당 stateful → MCP"<br />
            claw-code는 이 이중 확장 구조로 <strong>간단한 확장(플러그인)과 복잡한 통합(MCP)</strong>을 모두 커버
          </p>
        </div>

      </div>
    </section>
  );
}
