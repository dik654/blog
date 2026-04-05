import PluginKindViz from './viz/PluginKindViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PluginKind &amp; 매니페스트 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PluginKindViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">플러그인 시스템이란</h3>
        <p>
          플러그인은 claw-code를 <strong>서브프로세스 격리 방식으로 확장</strong>하는 메커니즘<br />
          역할:<br />
          - 커스텀 도구 추가 (회사 전용 린터, 배포 스크립트)<br />
          - 훅 프로바이더 (복잡한 검증 로직)<br />
          - 컨텍스트 프로바이더 (시스템 프롬프트에 정보 주입)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PluginKind 3종</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum PluginKind {
    ToolProvider,     // 커스텀 도구 제공
    HookProvider,     // Pre/Post 훅 제공
    ContextProvider,  // 컨텍스트 동적 주입
}`}</pre>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Kind</th>
                <th className="border border-border px-3 py-2 text-left">실행 시점</th>
                <th className="border border-border px-3 py-2 text-left">출력 형태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>ToolProvider</code></td>
                <td className="border border-border px-3 py-2">LLM이 도구 호출 시</td>
                <td className="border border-border px-3 py-2">ToolOutput (stdout/stderr/exit_code)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>HookProvider</code></td>
                <td className="border border-border px-3 py-2">도구 호출 전/후</td>
                <td className="border border-border px-3 py-2">HookResponse (allow/deny/prompt/skip)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>ContextProvider</code></td>
                <td className="border border-border px-3 py-2">세션 시작, 매 턴 시작</td>
                <td className="border border-border px-3 py-2">시스템 프롬프트 삽입 텍스트</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">PluginManifest 전체 스키마</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// plugin-manifest.json
{
  "name": "my-plugin",
  "version": "0.2.1",
  "kind": "tool-provider",
  "entrypoint": "./bin/plugin-exe",
  "description": "내부 CI 도구 통합",

  "tools": [...],              // ToolProvider 전용
  "hooks": [...],              // HookProvider 전용
  "context_hints": [...],      // ContextProvider 전용

  "permissions": {
    "required_mode": "ReadOnly",     // 플러그인 실행에 필요한 모드
    "network_access": false,          // 네트워크 필요 여부
    "workspace_write": false          // 워크스페이스 쓰기 필요 여부
  },

  "resource_limits": {
    "timeout_ms": 30000,
    "max_memory_mb": 128,
    "max_cpu_seconds": 10
  }
}`}</pre>
        <p>
          <strong>매니페스트 필수 필드</strong>: name, version, kind, entrypoint<br />
          <code>kind</code>에 따라 추가 필드 요구 — ToolProvider는 tools, HookProvider는 hooks<br />
          <code>permissions</code>·<code>resource_limits</code>: 플러그인이 사용할 자원 상한 선언
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">매니페스트 로딩</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PluginRegistry {
    pub fn load_from_dir(plugin_dir: &Path) -> Result<PluginManifest> {
        let manifest_path = plugin_dir.join("plugin-manifest.json");
        let text = std::fs::read_to_string(&manifest_path)?;

        let manifest: PluginManifest = serde_json::from_str(&text)?;

        // 버전 검증
        if !Version::parse(&manifest.version)?.major >= 0 {
            return Err(anyhow!("invalid version"));
        }

        // entrypoint 존재 확인
        let entrypoint = plugin_dir.join(&manifest.entrypoint);
        if !entrypoint.is_file() {
            return Err(anyhow!("entrypoint not found: {:?}", entrypoint));
        }

        // 실행 권한 확인 (Unix)
        #[cfg(unix)] {
            use std::os::unix::fs::PermissionsExt;
            let perm = std::fs::metadata(&entrypoint)?.permissions();
            if perm.mode() & 0o111 == 0 {
                return Err(anyhow!("entrypoint not executable"));
            }
        }

        Ok(manifest)
    }
}`}</pre>
        <p>
          <strong>4단계 검증</strong>: JSON 파싱 → 버전 → entrypoint 존재 → 실행 권한<br />
          실패 시 즉시 에러 — 불완전한 플러그인은 등록 거부<br />
          semver 파싱으로 버전 형식 강제 — <code>0.2.1</code>, <code>1.0.0-beta.1</code> 등
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ToolProvider 매니페스트 예시</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`{
  "name": "company-linter",
  "version": "0.5.0",
  "kind": "tool-provider",
  "entrypoint": "./bin/lint-wrapper.sh",
  "tools": [
    {
      "name": "lint_check",
      "description": "회사 표준 린터 실행",
      "input_schema": {
        "type": "object",
        "properties": {
          "path": {"type": "string"},
          "strict": {"type": "boolean", "default": false}
        },
        "required": ["path"]
      },
      "required_permission": "ReadOnly"
    },
    {
      "name": "lint_fix",
      "description": "린터 자동 수정",
      "input_schema": {
        "type": "object",
        "properties": {
          "path": {"type": "string"}
        },
        "required": ["path"]
      },
      "required_permission": "WorkspaceWrite"
    }
  ]
}`}</pre>
        <p>
          <strong>한 플러그인이 여러 도구 제공 가능</strong> — <code>tools</code> 배열<br />
          각 도구는 고유 name과 JSON Schema 보유<br />
          <code>required_permission</code>: 도구별 권한 — lint_check는 ReadOnly, lint_fix는 WorkspaceWrite
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ContextProvider 매니페스트 예시</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`{
  "name": "project-context",
  "version": "0.1.0",
  "kind": "context-provider",
  "entrypoint": "./bin/project-ctx.py",
  "context_hints": [
    {
      "trigger": "session_start",
      "description": "프로젝트 개요 주입"
    },
    {
      "trigger": "every_turn",
      "description": "현재 git 브랜치 정보",
      "max_tokens": 100
    }
  ]
}`}</pre>
        <p>
          <strong>trigger 2가지</strong>: <code>session_start</code>(1회), <code>every_turn</code>(매 턴)<br />
          <code>max_tokens</code>: ContextProvider 출력 상한 — 시스템 프롬프트 비대 방지<br />
          출력은 시스템 프롬프트의 특정 섹션에 삽입 — 예: <code>## Project Context</code> 아래
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 플러그인 vs 훅 vs MCP — 3자 비교</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-2 py-1 text-left">특징</th>
                  <th className="border border-border px-2 py-1 text-left">훅</th>
                  <th className="border border-border px-2 py-1 text-left">플러그인</th>
                  <th className="border border-border px-2 py-1 text-left">MCP</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-2 py-1">수명</td>
                  <td className="border border-border px-2 py-1">호출당</td>
                  <td className="border border-border px-2 py-1">호출당</td>
                  <td className="border border-border px-2 py-1">세션 전체</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1">상태 유지</td>
                  <td className="border border-border px-2 py-1">없음</td>
                  <td className="border border-border px-2 py-1">없음</td>
                  <td className="border border-border px-2 py-1">있음 (연결 유지)</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1">프로토콜</td>
                  <td className="border border-border px-2 py-1">JSON stdin/stdout</td>
                  <td className="border border-border px-2 py-1">JSON stdin/stdout</td>
                  <td className="border border-border px-2 py-1">JSON-RPC over stdio</td>
                </tr>
                <tr>
                  <td className="border border-border px-2 py-1">제공</td>
                  <td className="border border-border px-2 py-1">검증만</td>
                  <td className="border border-border px-2 py-1">도구/훅/컨텍스트</td>
                  <td className="border border-border px-2 py-1">도구/리소스</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2">
            <strong>선택 가이드</strong>:<br />
            - 단순 검증·로깅 → 훅<br />
            - 커스텀 도구/컨텍스트, 프로젝트 로컬 → 플러그인<br />
            - 외부 서비스 통합, 장기 세션 → MCP
          </p>
        </div>

      </div>
    </section>
  );
}
