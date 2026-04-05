import HookProtocolViz from './viz/HookProtocolViz';

export default function ShellExecution() {
  return (
    <section id="shell-execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">셸 프로세스 실행 &amp; JSON 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <HookProtocolViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">훅 실행 모델 — subprocess</h3>
        <p>
          훅은 <strong>claw-code 메인 프로세스와 별도 서브프로세스</strong>에서 실행<br />
          격리 이점:<br />
          - 훅 버그/크래시가 메인 프로세스에 영향 없음<br />
          - 훅이 무한 루프에 빠져도 타임아웃으로 kill<br />
          - 훅별 환경 변수·작업 디렉토리 독립 설정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">JSON 프로토콜 상세 명세</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# stdin에 전송되는 입력 JSON (한 줄)
{
  "event": "PreToolUse" | "PostToolUse" | "UserPromptSubmit",
  "tool_name": "<도구 이름>",            # PreToolUse/PostToolUse만
  "tool_input": { ... },                  # 도구 입력 (원본 JSON)
  "tool_output": { ... },                 # PostToolUse만
  "session_id": "<세션 UUID>",
  "workspace_root": "<절대 경로>",
  "timestamp": "<ISO 8601 UTC>",
  "user_prompt": "<사용자 메시지>",      # UserPromptSubmit만
}

# stdout에서 받는 응답 JSON (한 줄)
{
  "permission": "allow" | "deny" | "prompt" | "skip",
  "reason": "<string>",           # deny/prompt 시 권장
  "message": "<string>",          # prompt 시 사용자에게 표시
  "modified_input": { ... },      # 선택: 입력 수정 (UserPromptSubmit)
}`}</pre>
        <p>
          <strong>단일 JSON 객체 입출력</strong>: 여러 줄 안 됨 — 스트리밍 없음<br />
          stdin으로 입력 전송 후 EOF(shutdown) — 훅은 EOF 보고 응답 생성<br />
          stdout 첫 줄이 응답 JSON — 나머지 출력은 로그로 기록
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">환경 변수 자동 주입</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 훅 프로세스에 자동 설정되는 환경 변수
CLAW_SESSION_ID      = "sess_abc123"
CLAW_WORKSPACE       = "/home/user/project"
CLAW_TOOL_NAME       = "bash"
CLAW_EVENT           = "PreToolUse"
CLAW_VERSION         = "0.3.2"
CLAW_USER_HOME       = "/home/user"
CLAW_PERMISSION_MODE = "WorkspaceWrite"`}</pre>
        <p>
          <strong>편의 변수 제공</strong>: stdin JSON을 파싱하지 않고도 기본 정보 사용 가능<br />
          bash 훅에서 <code>$CLAW_TOOL_NAME</code> 참조 — <code>jq</code> 없이 간단 분기<br />
          stdin JSON이 <strong>진실의 원천</strong>, 환경 변수는 편의 복제
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">JSON 파싱 실패 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 훅 출력이 JSON 아닐 때
let stdout = String::from_utf8_lossy(&output.stdout);
let trimmed = stdout.trim();

// 빈 출력 → skip
if trimmed.is_empty() {
    return HookResponse::Skip;
}

// JSON 파싱 시도
match serde_json::from_str::<HookResponseRaw>(trimmed) {
    Ok(r) => r.into(),
    Err(e) => {
        log::warn!("hook JSON parse failed: {}, stdout: {:?}", e, trimmed);

        // 관용적 파싱: 첫 줄만
        if let Some(first_line) = trimmed.lines().next() {
            if let Ok(r) = serde_json::from_str::<HookResponseRaw>(first_line) {
                return r.into();
            }
        }

        HookResponse::Skip  // 최종 폴백
    }
}`}</pre>
        <p>
          <strong>관용적 파싱 단계</strong>:<br />
          1. 전체 stdout JSON 파싱<br />
          2. 실패 시 첫 줄만 파싱<br />
          3. 여전히 실패 시 <code>skip</code> 폴백<br />
          훅 버그가 시스템 차단으로 이어지지 않도록 설계
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 개발 도우미 — CLAW_DEBUG 모드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 환경 변수 CLAW_HOOK_DEBUG=1 설정 시
if std::env::var("CLAW_HOOK_DEBUG").is_ok() {
    log::info!("=== hook input ===\\n{}", serde_json::to_string_pretty(&payload)?);
    log::info!("=== hook command ===\\n{}", hook.command);

    let output = ...;

    log::info!("=== hook stdout ===\\n{}", String::from_utf8_lossy(&output.stdout));
    log::info!("=== hook stderr ===\\n{}", String::from_utf8_lossy(&output.stderr));
    log::info!("=== hook response ===\\n{:?}", resp);
}`}</pre>
        <p>
          <strong>디버그 모드</strong>: 훅 입출력 전체를 로그에 기록<br />
          훅 개발·디버깅 시 활성화 — 프로덕션에서는 끔<br />
          로그에 <strong>전체 JSON</strong> 포함 — 민감 데이터 주의
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 실행 성능 프로파일링</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`let start = Instant::now();
let response = execute_hook(hook, ...).await;
let duration = start.elapsed();

// 통계 수집
hook_metrics.record(HookExecMetric {
    hook_name: hook.command.clone(),
    event,
    duration_ms: duration.as_millis() as u64,
    response_type: response.kind(),
});

// 느린 훅 경고
if duration > Duration::from_millis(500) {
    log::warn!("slow hook ({}ms): {}", duration.as_millis(), hook.command);
}`}</pre>
        <p>
          <strong>500ms 초과 경고</strong>: 느린 훅은 사용자 경험 저하<br />
          누적 통계로 "가장 느린 훅 top 5" 리포트 가능<br />
          메트릭은 텔레메트리로 전송 — 조직 단위 훅 최적화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">프로세스 정리 — Drop 구현</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// tokio::process::Child는 기본적으로 Drop 시 kill
// 하지만 명시적 cleanup이 더 안전
impl Drop for HookRunner {
    fn drop(&mut self) {
        // 실행 중인 모든 훅 프로세스 종료
        for handle in self.running_hooks.drain(..) {
            handle.abort();
        }
    }
}`}</pre>
        <p>
          Rust <code>Drop</code> 트레이트로 자원 정리 보장<br />
          HookRunner 소멸 시 모든 훅 프로세스 강제 종료<br />
          세션 종료 시 <strong>좀비 훅 프로세스</strong> 방지
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: JSON vs 구조화된 프로토콜 선택</p>
          <p>
            훅 프로토콜 후보:<br />
            1. <strong>JSON</strong>: 언어 무관, 표준, 도구 많음<br />
            2. <strong>Protobuf/MessagePack</strong>: 바이너리, 작음, 빠름<br />
            3. <strong>환경 변수만</strong>: 간단, 하지만 복잡한 입력 불가<br />
            4. <strong>CLI 인자</strong>: 간단, 하지만 긴 입력 불가
          </p>
          <p className="mt-2">
            claw-code는 <strong>JSON stdin/stdout</strong> 선택 — 이유:<br />
            - Shell에서 <code>jq</code>로 쉽게 파싱<br />
            - 모든 주요 언어에 JSON 라이브러리 존재<br />
            - 디버깅 용이 (사람이 읽을 수 있음)<br />
            - 프로토콜 확장성 — 새 필드 추가 시 기존 훅 호환
          </p>
          <p className="mt-2">
            성능 희생(JSON 파싱 오버헤드)은 훅 실행 전체 비용 대비 무시할 수준 — 올바른 트레이드오프
          </p>
        </div>

      </div>
    </section>
  );
}
