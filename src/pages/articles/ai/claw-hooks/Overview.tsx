import HookRunnerViz from './viz/HookRunnerViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HookRunner 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <HookRunnerViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">훅 시스템 개요</h3>
        <p>
          훅(hook)은 <strong>도구 실행 전후에 삽입되는 사용자 정의 스크립트</strong><br />
          목적:<br />
          - 보안 검증 확장 (기본 Enforcer로 부족한 정책)<br />
          - 감사 로깅 (외부 시스템에 이력 전송)<br />
          - 자동화 (특정 도구 호출 시 사전 작업)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">HookRunner 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct HookRunner {
    pre_tool_hooks: Vec<HookDefinition>,
    post_tool_hooks: Vec<HookDefinition>,
    user_prompt_hooks: Vec<HookDefinition>,
    default_timeout: Duration,
}

pub struct HookDefinition {
    pub command: String,            // 실행할 셸 명령 또는 스크립트 경로
    pub matcher: HookMatcher,       // 이 훅이 적용되는 조건
    pub timeout: Option<Duration>,
    pub env: HashMap<String, String>,  // 추가 환경 변수
}

pub enum HookMatcher {
    Always,                          // 모든 호출
    Tool(String),                    // 특정 도구
    ToolPattern(String),             // 글롭 패턴
    BashCommand(String),             // bash 명령 패턴
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 3종류</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">훅 종류</th>
                <th className="border border-border px-3 py-2 text-left">실행 시점</th>
                <th className="border border-border px-3 py-2 text-left">영향</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>PreToolUse</code></td>
                <td className="border border-border px-3 py-2">도구 실행 전</td>
                <td className="border border-border px-3 py-2">Allow/Deny/Prompt 판정 + abort 가능</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>PostToolUse</code></td>
                <td className="border border-border px-3 py-2">도구 실행 후</td>
                <td className="border border-border px-3 py-2">경고·로깅만 (차단 불가)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>UserPromptSubmit</code></td>
                <td className="border border-border px-3 py-2">사용자 입력 제출 시</td>
                <td className="border border-border px-3 py-2">입력 수정·거부 가능</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">settings.json 설정 예시</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`{
  "hooks": {
    "PreToolUse": [
      {
        "command": "/opt/claw/hooks/check-bash.sh",
        "matcher": {"tool": "bash"},
        "timeout_ms": 2000
      },
      {
        "command": "/opt/claw/hooks/audit-log.sh",
        "matcher": {"always": true},
        "timeout_ms": 500
      }
    ],
    "PostToolUse": [
      {
        "command": "/opt/claw/hooks/git-check.sh",
        "matcher": {"tool_pattern": "write_*|edit_*"}
      }
    ],
    "UserPromptSubmit": [
      {
        "command": "/opt/claw/hooks/sanitize.sh",
        "matcher": {"always": true}
      }
    ]
  }
}`}</pre>
        <p>
          <strong>여러 훅 등록 가능</strong>: 배열로 정의, 순서대로 실행<br />
          <code>matcher</code>: 이 훅이 어느 도구에 적용되는지 지정<br />
          <code>timeout_ms</code>: 훅 실행 상한 — 초과 시 스킵
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">JSON 프로토콜 — 훅 스크립트 인터페이스</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# 훅 스크립트가 받는 입력 (stdin JSON)
{
  "event": "PreToolUse",
  "tool_name": "bash",
  "tool_input": {"command": "cargo test"},
  "session_id": "sess_abc123",
  "workspace_root": "/home/user/project",
  "timestamp": "2026-04-05T10:30:00Z"
}

# 훅 스크립트가 출력하는 응답 (stdout JSON)
{"permission": "allow"}
{"permission": "deny", "reason": "테스트 금지"}
{"permission": "prompt", "message": "확인 필요"}
{"permission": "skip"}  # 훅 판정 안 함, 기본 Enforcer 사용`}</pre>
        <p>
          <strong>stdin/stdout JSON 프로토콜</strong>: 언어 무관 — bash, python, ruby 등 어떤 언어로도 작성 가능<br />
          <code>event</code> 필드로 이벤트 종류 구분 — 같은 훅이 여러 이벤트 처리 가능<br />
          <code>skip</code> 응답: 훅이 의도적으로 판정 거부 — 기본 엔진으로 폴백
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 실행 순서 — 파이프라인</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl HookRunner {
    pub async fn run_pre_tool(
        &self,
        tool: &str,
        input: &Value,
    ) -> HookOutcome {
        // 매칭되는 모든 훅을 순서대로 실행
        for hook in &self.pre_tool_hooks {
            if !hook.matcher.matches(tool, input) { continue; }

            match self.execute_hook(hook, "PreToolUse", tool, input).await {
                HookResponse::Deny(r)   => return HookOutcome::Deny(r),
                HookResponse::Prompt(m) => return HookOutcome::Prompt(m),
                HookResponse::Allow     => return HookOutcome::Allow,
                HookResponse::Skip      => continue,  // 다음 훅으로
                HookResponse::Error(_)  => continue,  // 에러는 skip 취급
            }
        }
        HookOutcome::NoDecision  // 모든 훅이 skip 또는 매칭 실패
    }
}`}</pre>
        <p>
          <strong>first-decision wins</strong>: 첫 판정 내린 훅이 최종 결정<br />
          <code>Skip</code>, <code>Error</code>는 다음 훅으로 — 연쇄 진행<br />
          <code>NoDecision</code>: 기본 Enforcer가 단독으로 판정
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 훅의 사용 사례 4가지</p>
          <p>
            1. <strong>감사 로그</strong>: 모든 도구 호출을 SIEM으로 전송<br />
            2. <strong>커스텀 검증</strong>: "이 bash 명령이 회사 정책에 맞는가" 확인<br />
            3. <strong>자동 사전 작업</strong>: write_file 전에 git pull 실행<br />
            4. <strong>학습 로그</strong>: LLM이 어떤 도구를 언제 호출하는지 분석
          </p>
          <p className="mt-2">
            훅은 <strong>"claw-code 코어를 건드리지 않고 확장"</strong>하는 수단<br />
            코어는 안정적으로 유지, 조직별 요구사항은 훅으로 구현<br />
            이것이 "핵심은 작게, 확장은 풍부하게" 원칙의 실현
          </p>
        </div>

      </div>
    </section>
  );
}
