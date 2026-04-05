import OverrideViz from './viz/OverrideViz';

export default function ContextOverride() {
  return (
    <section id="context-override" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨텍스트 오버라이드 &amp; 훅 연동</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <OverrideViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">ContextOverride — 일시적 권한 상승</h3>
        <p>
          특정 도구·호출에 대해서만 일시적으로 권한 모드를 변경하는 메커니즘<br />
          사용 사례:<br />
          - 플러그인 도구는 Prompt 없이 실행 (trusted)<br />
          - 특정 CI 잡은 DangerFullAccess<br />
          - 사용자가 "Always" 응답한 도구는 이후 Prompt 생략
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct ContextOverride {
    pub mode: Option<PermissionMode>,       // 임시 모드
    pub allow_tools: HashSet<String>,       // 항상 허용할 도구
    pub deny_tools: HashSet<String>,        // 항상 거부할 도구
    pub scope: OverrideScope,               // 범위 (Once, Session, Persistent)
}

pub enum OverrideScope {
    Once,        // 1회 호출 후 제거
    Session,     // 현재 세션 동안 유지
    Persistent,  // 재시작 후에도 유지 (Policy에 병합)
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Override 적용 순서</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// PermissionEnforcer::check() 수정
pub fn check(&mut self, tool: &str, input: &Value) -> EnforcementResult {
    // 0) ContextOverride 우선 확인
    if let Some(ov) = &self.override_stack.top() {
        if ov.deny_tools.contains(tool) {
            return EnforcementResult::Deny("override: deny".into());
        }
        if ov.allow_tools.contains(tool) {
            return EnforcementResult::Allow;
        }
        // 모드 임시 상승
        if let Some(temp_mode) = ov.mode {
            let saved = self.mode;
            self.mode = temp_mode;
            let result = self.check_inner(tool, input);
            self.mode = saved;  // 복구
            return result;
        }
    }

    self.check_inner(tool, input)
}`}</pre>
        <p>
          <strong>override_stack</strong>: 중첩 오버라이드 지원 — LIFO 스택<br />
          <code>top()</code>의 오버라이드가 현재 유효 — 여러 계층 중 최상위 적용<br />
          모드 임시 상승 후 <strong>반드시 복구</strong> — finally 패턴으로 누수 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">스코프별 Override 생성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Once: 1회용
enforcer.push_override(ContextOverride {
    allow_tools: ["bash".into()].into(),
    scope: OverrideScope::Once,
    ..Default::default()
});
// 다음 check() 호출 후 자동 pop

// Session: 세션 전체
enforcer.push_override(ContextOverride {
    mode: Some(PermissionMode::DangerFullAccess),
    scope: OverrideScope::Session,
    ..Default::default()
});
// 세션 종료 시 제거

// Persistent: 영구 저장
enforcer.persist_override(ContextOverride {
    allow_tools: ["trusted_plugin_tool".into()].into(),
    scope: OverrideScope::Persistent,
    ..Default::default()
});
// Policy 파일에 병합, 재시작 후에도 적용`}</pre>
        <p>
          <strong>Once 사용 사례</strong>: 사용자가 특정 Prompt에 "Yes" 한 번 응답<br />
          <strong>Session 사용 사례</strong>: <code>/allow-all</code> 슬래시 명령 — 세션 내 전체 승격<br />
          <strong>Persistent 사용 사례</strong>: "Always" 응답 시 Policy 업데이트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 연동 — 커스텀 권한 판정</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// settings.json
{
  "hooks": {
    "PreToolUse": [{
      "command": "/opt/claw/hooks/check-tool.sh",
      "matcher": {"tool": "*"},
      "timeout_ms": 2000
    }]
  }
}

// 훅 스크립트 응답 (stdout JSON)
{"permission": "allow"}
{"permission": "deny", "reason": "보안팀 승인 필요"}
{"permission": "prompt", "message": "확인: {tool_name}"}
{"permission": "skip"}  // 훅이 판정 안 함, 기본 enforcer로 넘김`}</pre>
        <p>
          <strong>훅 응답 4종</strong>: allow, deny, prompt, skip<br />
          <code>skip</code>은 "훅이 판정 거부" — 기본 PermissionEnforcer로 폴백<br />
          timeout_ms: 훅이 느려 전체 시스템 지연 방지 — 초과 시 <code>skip</code> 처리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 실행 통합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PermissionEnforcer {
    pub async fn check_with_hooks(&self, tool: &str, input: &Value) -> EnforcementResult {
        // 1) 기본 Enforcer 판정
        let base = self.check(tool, input);
        if matches!(base, EnforcementResult::Deny(_)) {
            return base;  // Deny는 훅에서 뒤집지 않음 (보안)
        }

        // 2) Pre-tool 훅 실행
        let hook_result = self.hooks.run_pre_tool(tool, input).await;

        // 3) 훅 결과 병합
        match hook_result {
            HookResult::Override(action) => action,  // 훅 결정 우선
            HookResult::Skip             => base,     // 훅 판정 거부 → 기본
            HookResult::Error(e)         => {
                log::warn!("hook failed: {}, falling back to base", e);
                base  // 훅 실패 → 기본
            }
        }
    }
}`}</pre>
        <p>
          <strong>핵심 보안 원칙</strong>: "Deny는 훅이 뒤집을 수 없음"<br />
          기본 Enforcer가 Deny하면 훅은 스킵 — 훅이 보안 약화 수단이 되는 것을 방지<br />
          훅은 <strong>Allow → Prompt/Deny 강화만 가능</strong>, 반대 방향은 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 훅 사용 예시 — 감사 로깅</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# /opt/claw/hooks/audit-log.sh
#!/bin/bash
# stdin에서 JSON 수신
INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name')
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# 감사 로그 기록
echo "{\\"timestamp\\":\\"$TIMESTAMP\\",\\"tool\\":\\"$TOOL\\"}" \\
    >> /var/log/claw/audit.jsonl

# 판정은 기본 Enforcer에 위임
echo '{"permission":"skip"}'`}</pre>
        <p>
          <strong>감사 전용 훅</strong>: 판정은 skip, 로깅만 수행<br />
          보안팀이 감사 로그를 별도 분석 — claw-code 자체는 수정 불필요<br />
          <code>jsonl</code> 포맷: 줄 단위 JSON — 대용량 로그 처리에 적합
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 훅 사용 예시 — 시간대 제한</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# /opt/claw/hooks/business-hours.sh
#!/bin/bash
HOUR=$(date +%H)

# 업무 시간 외에는 bash·write_file 차단
if [[ $HOUR -lt 9 || $HOUR -ge 18 ]]; then
    INPUT=$(cat)
    TOOL=$(echo "$INPUT" | jq -r '.tool_name')
    if [[ "$TOOL" == "bash" || "$TOOL" == "write_file" ]]; then
        echo '{"permission":"deny","reason":"업무 시간 외 위험 작업 금지"}'
        exit 0
    fi
fi

echo '{"permission":"skip"}'`}</pre>
        <p>
          <strong>동적 조건 판정</strong>: 시간·환경·네트워크 상태 등 Policy로 표현 불가한 조건<br />
          이런 요구사항이 훅의 존재 이유 — 정책 정의 언어로는 불충분한 시나리오
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 권한 시스템의 "약화 금지" 원칙</p>
          <p>
            claw-code 권한 시스템의 핵심 보안 불변성:<br />
            <strong>"어떤 확장도 기본 Deny를 Allow로 뒤집을 수 없다"</strong>
          </p>
          <p className="mt-2">
            - 훅은 Allow → Deny만 가능 (Deny → Allow 불가)<br />
            - Override도 mode 상승은 가능하지만 base Deny 우회 불가<br />
            - Plugin tool도 자체 권한 선언 필요 — 매니페스트에 required_permission
          </p>
          <p className="mt-2">
            이 원칙으로 <strong>공격 면적 축소</strong> — 악의적 훅이 침투해도 보안 약화 불가<br />
            훅·플러그인은 "추가 게이트"만 제공 — 기본 게이트는 항상 통과해야 함<br />
            결과: 외부 확장이 많아도 시스템 전체 보안 수준은 <strong>기본 Enforcer로 결정</strong>
          </p>
        </div>

      </div>
    </section>
  );
}
