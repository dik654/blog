import PermissionOverrideViz from './viz/PermissionOverrideViz';

export default function PermissionOverride() {
  return (
    <section id="permission-override" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">권한 오버라이드 &amp; 중단 시그널</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PermissionOverrideViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">훅의 권한 오버라이드 범위</h3>
        <p>
          훅은 기본 Permission Enforcer의 판정을 <strong>강화만 가능</strong> (보안 불변성)<br />
          허용 방향:<br />
          ✓ Allow → Deny 강화<br />
          ✓ Allow → Prompt 강화<br />
          ✓ Prompt → Deny 강화<br />
          금지 방향:<br />
          ✗ Deny → Allow (보안 약화)<br />
          ✗ Prompt → Allow (사용자 확인 우회)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">권한 병합 로직</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn merge_decisions(
    base: EnforcementResult,
    hook: HookResponse,
) -> EnforcementResult {
    match (base, hook) {
        // Hook이 허용/스킵 — base 유지
        (b, HookResponse::Allow) | (b, HookResponse::Skip) => b,

        // Hook이 강화 — 엄격한 쪽 선택
        (EnforcementResult::Allow, HookResponse::Deny(r)) =>
            EnforcementResult::Deny(r),
        (EnforcementResult::Allow, HookResponse::Prompt(m)) =>
            EnforcementResult::Prompt(m),
        (EnforcementResult::Prompt(_), HookResponse::Deny(r)) =>
            EnforcementResult::Deny(r),

        // Base가 Deny면 hook으로 뒤집기 불가
        (EnforcementResult::Deny(r), _) =>
            EnforcementResult::Deny(r),

        // Base가 Prompt이고 hook이 Prompt면 더 구체적인 메시지 선택
        (EnforcementResult::Prompt(_), HookResponse::Prompt(m)) =>
            EnforcementResult::Prompt(m),

        // Error는 skip 취급
        (b, HookResponse::Error(_)) => b,
    }
}`}</pre>
        <p>
          <strong>규칙의 핵심</strong>: "Deny는 절대 풀리지 않는다"<br />
          기본 Enforcer Deny → 훅이 Allow 보내도 Deny 유지<br />
          이 불변성이 <strong>훅 시스템의 보안 기반</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">중단 시그널 — Abort</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 훅이 세션 전체를 중단시킬 수 있는 특수 응답
{"permission": "abort", "reason": "중요 보안 위반 감지"}

// HookRunner 처리
match response {
    HookResponse::Abort(reason) => {
        log::error!("hook requested abort: {}", reason);
        self.runtime.emit_event(RuntimeEvent::SessionAbort {
            reason: reason.clone(),
        });
        return Err(anyhow!("session aborted by hook: {}", reason));
    }
    // ... 나머지 처리
}`}</pre>
        <p>
          <strong>Abort는 "Deny보다 강력"</strong>: 현재 도구 차단 + 세션 종료<br />
          사용 사례:<br />
          - 크리티컬 보안 위반 탐지 (크리덴셜 노출 시도)<br />
          - 시스템 이상 감지 (디스크 공간 0, OOM 위험)<br />
          - 정책 위반 누적 (10회 이상 Deny → abort)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">UserPromptSubmit 훅 — 입력 수정</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# /opt/claw/hooks/sanitize-input.sh
# 사용자 메시지에서 민감 정보 자동 삭제

INPUT=$(cat)
MSG=$(echo "$INPUT" | jq -r '.user_prompt')

# 이메일 주소 마스킹
SANITIZED=$(echo "$MSG" | sed -E 's/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}/[EMAIL]/g')

# API 키 패턴 마스킹
SANITIZED=$(echo "$SANITIZED" | sed -E 's/sk-[a-zA-Z0-9]{20,}/[API_KEY]/g')

jq -n --arg new "$SANITIZED" '{
    permission: "allow",
    modified_input: {user_prompt: $new}
}'`}</pre>
        <p>
          <strong>UserPromptSubmit 훅의 고유 능력</strong>: 입력 수정 후 LLM 전달<br />
          <code>modified_input</code>: 원본 입력을 덮어씀 — LLM은 수정된 버전만 봄<br />
          사용 사례: 크리덴셜 마스킹, 민감 정보 제거, 프롬프트 표준화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">중첩 훅과 순서 보장</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// settings.json: 여러 훅 정의
{
  "hooks": {
    "PreToolUse": [
      {"command": "A.sh", "matcher": {"always": true}},
      {"command": "B.sh", "matcher": {"tool": "bash"}},
      {"command": "C.sh", "matcher": {"always": true}}
    ]
  }
}

// bash 도구 호출 시 실행 순서:
// 1. A.sh → skip
// 2. B.sh → allow (bash 매칭)
// 3. C.sh → deny ← 최종 판정

// Pre 훅은 순차 실행, 첫 판정이 최종
// 단, skip/error는 다음 훅으로 넘어감`}</pre>
        <p>
          <strong>순차 실행</strong>: 배열 순서대로 평가<br />
          첫 판정 내린 훅이 <strong>최종 결정권</strong> — skip/error는 다음 훅으로<br />
          여러 훅이 Deny 응답해도 첫 번째만 반영 — <code>reason</code>은 첫 Deny의 것
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 실패 내구성 — 프로덕션 고려사항</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 훅 스크립트 자체가 실행 불가할 때
if !Path::new(&hook.command).exists() {
    log::error!("hook not found: {}", hook.command);

    // fail-safe 모드: 훅 없으면 skip
    return HookResponse::Skip;
}

// fail-closed 모드 (선택적): 훅 실패 시 전체 차단
if self.config.hook_fail_closed {
    return HookResponse::Deny("hook unavailable".into());
}`}</pre>
        <p>
          <strong>2가지 실패 모드</strong>:<br />
          - <strong>fail-safe</strong>(기본): 훅 실패 → skip, 시스템 계속 작동<br />
          - <strong>fail-closed</strong>: 훅 실패 → 도구 차단, 고보안 환경
        </p>
        <p>
          fail-closed는 <strong>보안 크리티컬 시스템</strong>에서 사용 — "감사 로그 없으면 실행 금지"<br />
          기본값은 fail-safe — 일반 개발 환경의 가용성 우선
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 훅 설계의 핵심 트레이드오프</p>
          <p>
            <strong>"훅은 보안을 약화시키지 못한다"</strong> 원칙은 보수적 설계 선택<br />
            이 선택의 결과:
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            - 악의적 훅 설치해도 시스템 약화 불가<br />
            - 훅 리뷰 시 "악용 가능성" 검토 불필요<br />
            - 여러 훅이 함께 작동 시 예측 가능 (엄격한 쪽이 이김)
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            - 특정 상황에서 <strong>훅 기반 화이트리스트</strong> 불가<br />
            - 예: "이 도구는 기본 Deny지만 훅으로 조건부 Allow"는 구현 불가<br />
            - 대안: ContextOverride 사용 또는 기본 모드 변경
          </p>
          <p className="mt-2">
            claw-code는 <strong>명시성을 안전보다 우선</strong>: "화이트리스트 하려면 기본 Allow + 훅 Deny" 방식 요구<br />
            훅 설계가 단순해지고 예측 가능 — 소수의 고급 사용자만 약간 불편
          </p>
        </div>

      </div>
    </section>
  );
}
