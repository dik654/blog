import PermissionMatrixViz from './viz/PermissionMatrixViz';
import PermissionDecisionViz from './viz/PermissionDecisionViz';

export default function PermissionGating() {
  return (
    <section id="permission-gating" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도구별 권한 게이팅</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PermissionMatrixViz />

        {/* ── PermissionMode 3단계 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PermissionMode — 3단계 권한 모드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum PermissionMode {
    ReadOnly,          // 읽기만 허용 — 파일 변경·실행 불가
    WorkspaceWrite,    // 워크스페이스 내 쓰기 허용 — 임의 명령은 Prompt
    DangerFullAccess,  // 모든 작업 허용 — Prompt 없이 즉시 실행
}`}</pre>
        <p>
          <strong>ReadOnly</strong>: 탐색·이해 단계 — 사용자가 코드베이스를 읽기만 원할 때<br />
          <strong>WorkspaceWrite</strong>: 일반 작업 모드 — 파일 편집 허용, 임의 명령은 사용자 확인<br />
          <strong>DangerFullAccess</strong>: CI/자동화 모드 — 모든 확인 스킵, 신뢰된 환경 전제
        </p>
        <p>
          기본 모드는 <strong>WorkspaceWrite</strong> — 대부분의 개발 워크플로우에 적합<br />
          CLI 플래그 <code>--dangerously-skip-permissions</code>로 <strong>DangerFullAccess</strong> 전환<br />
          <code>--read-only</code> 플래그로 <strong>ReadOnly</strong> 전환
        </p>

        {/* ── 도구-모드 매트릭스 ── */}
      </div>
      <PermissionDecisionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">도구 × 모드 매트릭스</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">도구</th>
                <th className="border border-border px-3 py-2 text-center">ReadOnly</th>
                <th className="border border-border px-3 py-2 text-center">WorkspaceWrite</th>
                <th className="border border-border px-3 py-2 text-center">DangerFullAccess</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>read_file</code>, <code>glob_search</code>, <code>grep_search</code></td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>write_file</code>, <code>edit_file</code></td>
                <td className="border border-border px-3 py-2 text-center text-red-600">Deny</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>bash</code>, <code>PowerShell</code></td>
                <td className="border border-border px-3 py-2 text-center text-red-600">Deny</td>
                <td className="border border-border px-3 py-2 text-center text-amber-600">Prompt</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>WebFetch</code>, <code>WebSearch</code></td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>TaskCreate</code>, <code>TaskStop</code></td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>MCP</code>, <code>McpAuth</code></td>
                <td className="border border-border px-3 py-2 text-center text-amber-600">Prompt*</td>
                <td className="border border-border px-3 py-2 text-center text-amber-600">Prompt*</td>
                <td className="border border-border px-3 py-2 text-center">Allow</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          * MCP 서버가 "trusted" 리스트에 있으면 Prompt 생략 — <code>settings.json</code>의 <code>trusted_mcp_servers</code>로 설정
        </p>

        {/* ── 게이트 판정 로직 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">PermissionEnforcer::check() 내부</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PermissionEnforcer {
    pub fn check(&self, tool_name: &str, input: &Value) -> EnforcementResult {
        // 1) 도구 스펙 조회
        let spec = self.registry.get_spec(tool_name)?;

        // 2) 모드-권한 비교
        let required = spec.required_permission;    // 도구가 요구하는 최소 권한
        let current  = self.mode;                    // 현재 세션 권한 모드

        if current >= required {
            return EnforcementResult::Allow;
        }

        // 3) 차액 판정 — Prompt로 승격 가능한가?
        if self.can_prompt() && required == PermissionMode::DangerFullAccess {
            let msg = format!("Run: {}?", summarize_input(input));
            return EnforcementResult::Prompt(msg);
        }

        // 4) 차액 거부
        EnforcementResult::Deny(format!(
            "{} requires {:?} mode (current: {:?})",
            tool_name, required, current
        ))
    }
}`}</pre>
        <p>
          <strong>비교 연산자</strong>: <code>PermissionMode</code>에 <code>PartialOrd</code> 구현 —
          ReadOnly &lt; WorkspaceWrite &lt; DangerFullAccess<br />
          <code>current &gt;= required</code>가 참이면 즉시 Allow<br />
          차이가 있으면 Prompt 가능 여부 판단 — 사용자 승인으로 임시 승격 허용
        </p>

        {/* ── 경로 기반 게이팅 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">경로 기반 세밀 게이팅 — 파일 I/O 전용</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn check_file_path(&self, tool: &str, path: &Path) -> EnforcementResult {
    // 1) 워크스페이스 경계 검증
    if !path.starts_with(&self.workspace_root) {
        return EnforcementResult::Deny(
            format!("path outside workspace: {:?}", path)
        );
    }

    // 2) 블랙리스트 검증 — .env, .git/ 등
    if self.blacklist.matches(path) {
        return EnforcementResult::Deny(
            format!("protected path: {:?}", path)
        );
    }

    // 3) 심링크 이스케이프 검증
    let canonical = path.canonicalize()?;
    if !canonical.starts_with(&self.workspace_root) {
        return EnforcementResult::Deny(
            "symlink escape detected".into()
        );
    }

    EnforcementResult::Allow
}`}</pre>
        <p>
          <strong>3단계 경로 검증</strong>: 워크스페이스 경계 → 블랙리스트 → 심링크 이스케이프<br />
          <code>canonicalize()</code>는 심링크를 실제 경로로 해석 — 공격자가 <code>workspace/link → /etc/passwd</code> 심링크로 우회 시도를 차단<br />
          블랙리스트 기본값: <code>.env</code>, <code>.git/</code>, <code>node_modules/</code>, <code>*.pem</code>, <code>*.key</code>
        </p>

        {/* ── bash 명령 의도 분류 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">bash 명령 의도 분류 — CommandIntent</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum CommandIntent {
    Read,           // ls, cat, grep, find — 파일 시스템 읽기
    Write,          // mv, cp, mkdir, touch — 파일 시스템 쓰기
    Destructive,    // rm, shred, dd — 복구 불가 명령
    Network,        // curl, wget, ssh, nc — 네트워크 통신
    Execute,        // ./script.sh, python, node — 임의 실행
    Package,        // apt, pip, npm, cargo — 패키지 관리
    System,         // systemctl, reboot, shutdown — 시스템 제어
    Unknown,        // 분류 불가
}

fn classify(cmd: &str) -> CommandIntent {
    let first_word = cmd.split_whitespace().next().unwrap_or("");
    match first_word {
        "ls" | "cat" | "grep" | "find" | "head" | "tail" => CommandIntent::Read,
        "rm" | "shred" | "dd" | "mkfs" => CommandIntent::Destructive,
        "curl" | "wget" | "ssh" | "nc" | "netcat" => CommandIntent::Network,
        "sudo" | "su" | "systemctl" | "reboot" => CommandIntent::System,
        // ... 추가 패턴
        _ => CommandIntent::Unknown,
    }
}`}</pre>
        <p>
          <strong>8가지 의도 분류</strong>: Read, Write, Destructive, Network, Execute, Package, System, Unknown<br />
          분류 기준은 <strong>첫 단어 매칭</strong> — 간단하고 빠름, 복잡한 파이프 체인은 Unknown으로 분류<br />
          Destructive 분류 시 <strong>이중 Prompt</strong>: 사용자에게 한 번 더 확인 요구 — <code>rm -rf /</code> 같은 사고 방지
        </p>

        {/* ── 훅 오버라이드 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">훅 기반 권한 오버라이드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Pre-tool 훅이 permission 결정을 오버라이드 가능
{
  "hooks": {
    "PreToolUse": [{
      "command": "/opt/claw/hooks/check-bash.sh",
      "matcher": {"tool": "bash"}
    }]
  }
}

// 훅 스크립트가 JSON으로 응답:
{"permission": "deny", "reason": "rm -rf not allowed"}
{"permission": "allow"}
{"permission": "prompt", "message": "확인 필요: {cmd}"}`}</pre>
        <p>
          사용자는 <code>settings.json</code>의 hooks 설정으로 도구 실행 전 자체 검증 삽입 가능<br />
          훅은 JSON 프로토콜로 <code>permission</code> 필드를 반환 — allow/deny/prompt 3중 하나<br />
          <strong>기본 Enforcer 판정 &gt; 훅 판정</strong> 순서 — Enforcer가 먼저 Deny하면 훅 호출 안 됨
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 3단계 모드인가 — 이항/5단계 대안과 비교</p>
          <p>
            <strong>이항(Allow/Deny)의 문제</strong>:<br />
            - "읽기는 허용하되 쓰기는 확인"이라는 중간 상태 표현 불가<br />
            - 개발 워크플로우에서 가장 흔한 경우가 바로 이 중간 상태<br />
            - 결과: Prompt 없이 모든 작업 허용하거나, 매번 모든 작업에 Prompt 표시 → 사용자 피로도 ↑
          </p>
          <p className="mt-2">
            <strong>5단계(예: ReadOnly/SafeWrite/FullWrite/Shell/Root)의 문제</strong>:<br />
            - 사용자가 매번 "어떤 모드인지" 기억해야 함 → 인지 부담 ↑<br />
            - 모드 간 차이가 미묘 → 실수로 과잉 권한 부여 위험<br />
            - 구현 복잡도 ↑ — 도구마다 5개 모드와의 매트릭스 유지
          </p>
          <p className="mt-2">
            <strong>3단계 모드가 최적점</strong>:<br />
            탐색(ReadOnly) → 개발(WorkspaceWrite) → 자동화(DangerFullAccess)<br />
            → 사용자의 멘탈 모델과 정확히 일치<br />
            WorkspaceWrite + Prompt 승격이 "세밀 제어"를 동시에 제공 — 단순성과 유연성의 균형
          </p>
        </div>

      </div>
    </section>
  );
}
