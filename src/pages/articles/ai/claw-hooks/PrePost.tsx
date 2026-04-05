import PrePostFlowViz from './viz/PrePostFlowViz';

export default function PrePost() {
  return (
    <section id="pre-post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PreToolUse / PostToolUse 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PrePostFlowViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">도구 호출 흐름 속 훅 위치</h3>
        <p>
          훅 위치는 위 다이어그램 참조 — Permission Enforcer 체크 직후 Pre 훅, 도구 실행 직후 Post 훅<br />
          Pre 훅은 <strong>도구 실행 차단 가능</strong> — abort·deny 시 실행 스킵<br />
          Post 훅은 <strong>경고·로깅만</strong> — 이미 실행됐으므로 되돌릴 수 없음<br />
          Pre는 보안 게이트, Post는 감사 로그 — 역할 분리 명확
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Pre-tool 훅 실제 예시 — rm 차단</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#!/bin/bash
# /opt/claw/hooks/no-rm.sh — rm 명령 차단

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name')

if [[ "$TOOL" == "bash" ]]; then
    CMD=$(echo "$INPUT" | jq -r '.tool_input.command')
    if echo "$CMD" | grep -qE "\\brm\\b"; then
        jq -n --arg cmd "$CMD" '{
            permission: "deny",
            reason: "rm 명령 금지 (회사 정책)"
        }'
        exit 0
    fi
fi

# 해당 없음 → skip
echo '{"permission":"skip"}'`}</pre>
        <p>
          <strong>stdin JSON 파싱</strong>: <code>jq</code> 명령으로 필드 추출<br />
          <code>grep -qE</code>: 정규식 매칭, <code>-q</code>는 silent, <code>-E</code>는 확장 regex<br />
          <strong>해당 없음 → skip</strong>: 다른 훅 또는 기본 Enforcer에 위임
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Post-tool 훅 예시 — git status 경고</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#!/bin/bash
# /opt/claw/hooks/git-dirty.sh — write_file 후 git status 확인

INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name')
WS=$(echo "$INPUT" | jq -r '.workspace_root')

if [[ "$TOOL" == "write_file" || "$TOOL" == "edit_file" ]]; then
    cd "$WS" || exit 0

    CHANGED=$(git status --porcelain | wc -l)
    if [[ $CHANGED -gt 20 ]]; then
        echo "[warning] $CHANGED files modified, consider committing"
    fi
fi

exit 0`}</pre>
        <p>
          <strong>Post 훅은 stdout 출력을 경고로 표시</strong> — JSON 프로토콜 따를 필요 없음<br />
          사용자 터미널에 <code>[warning] ...</code> 표시 — 정보 제공만 수행<br />
          exit code 0 필수 — 0 아니면 로그에 "hook failed" 기록
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Pre 훅 실행 코드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl HookRunner {
    async fn execute_hook(
        &self,
        hook: &HookDefinition,
        event: &str,
        tool: &str,
        input: &Value,
    ) -> HookResponse {
        // 1) JSON 입력 준비
        let payload = json!({
            "event": event,
            "tool_name": tool,
            "tool_input": input,
            "session_id": current_session_id(),
            "workspace_root": workspace_root(),
            "timestamp": Utc::now().to_rfc3339(),
        });

        // 2) 서브프로세스 실행
        let mut child = Command::new("/bin/sh")
            .arg("-c").arg(&hook.command)
            .envs(&hook.env)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(|e| HookResponse::Error(e.to_string()))?;

        // 3) stdin으로 JSON 전송
        let stdin = child.stdin.as_mut().unwrap();
        stdin.write_all(payload.to_string().as_bytes()).await?;
        stdin.shutdown().await?;

        // 4) 타임아웃 적용
        let output = tokio::time::timeout(
            hook.timeout.unwrap_or(self.default_timeout),
            child.wait_with_output(),
        ).await?.map_err(|e| HookResponse::Error(e.to_string()))??;

        // 5) stdout JSON 파싱
        let resp: HookResponseRaw = serde_json::from_slice(&output.stdout)
            .unwrap_or(HookResponseRaw::skip());

        resp.into()
    }
}`}</pre>
        <p>
          <strong>5단계 실행</strong>: JSON 입력 준비 → 프로세스 생성 → stdin 전송 → 타임아웃 → 응답 파싱<br />
          <code>/bin/sh -c</code>: 셸 명령 문자열 실행 — 경로·인자 분리 불필요<br />
          파싱 실패 시 <code>skip</code> 기본값 — 훅 버그가 시스템 차단으로 이어지지 않음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">타임아웃 기본값 &amp; 실패 처리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub const DEFAULT_HOOK_TIMEOUT: Duration = Duration::from_millis(2000);

// 타임아웃 초과 시
if let Err(_) = tokio::time::timeout(timeout, child.wait_with_output()).await {
    // 프로세스 강제 종료
    let _ = child.kill().await;
    log::warn!("hook timeout: {}", hook.command);
    return HookResponse::Error("hook timeout".into());
}`}</pre>
        <p>
          <strong>기본 2초</strong>: 훅은 경량이어야 함 — 무거운 연산 금지<br />
          2초 초과 시 훅 프로세스 강제 종료 + Error 응답<br />
          Error는 <code>skip</code>과 같이 취급 — 다음 훅으로
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 실행 중 세션 차단</h3>
        <p>
          훅이 실행되는 동안 <strong>세션 진행 차단</strong> — LLM 응답이 blocking되지 않도록 빠른 응답 필수<br />
          Pre 훅: 2초 지연 → LLM이 도구 실행 응답 기다리는 동안 추가 지연<br />
          Post 훅: 실행 결과 돌아오기 전 2초 지연<br />
          → 훅이 많으면 체감 응답 속도 저하 — <strong>훅 개수 최소화 권장</strong>
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Pre 훅의 남용 위험</p>
          <p>
            Pre 훅에 복잡한 로직을 넣으면 <strong>매 도구 호출마다 2초 지연</strong><br />
            예: 50턴 대화, 도구 호출 평균 3개 = 150회 훅 실행 = 5분 지연
          </p>
          <p className="mt-2">
            <strong>훅 작성 가이드라인</strong>:<br />
            - Pre 훅은 &lt;500ms 응답 보장<br />
            - 복잡한 판정은 Policy에 표현 (정적)<br />
            - 네트워크 호출 금지 (타임아웃 위험)<br />
            - DB 조회는 캐시 사용 필수
          </p>
          <p className="mt-2">
            <strong>Post 훅은 상대적으로 자유</strong>: 경고만 출력, 지연은 UI에만 영향<br />
            그럼에도 100ms 이내 권장 — 사용자 대기 최소화<br />
            무거운 작업은 훅 내부에서 백그라운드 프로세스 spawn 후 즉시 return
          </p>
        </div>

      </div>
    </section>
  );
}
