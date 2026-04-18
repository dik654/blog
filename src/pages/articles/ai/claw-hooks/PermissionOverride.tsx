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
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">merge_decisions(base, hook) 매칭 규칙</div>
            <div className="space-y-2">
              <div className="bg-green-50 dark:bg-green-950/30 rounded p-3 text-sm">
                <div className="font-medium text-xs text-green-700 dark:text-green-300 mb-1">Hook이 Allow / Skip</div>
                <div className="text-muted-foreground text-xs">base 판정 유지 — 훅이 허용하거나 판단을 건너뜀</div>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 rounded p-3 text-sm">
                <div className="font-medium text-xs text-red-700 dark:text-red-300 mb-1">Hook이 강화 (엄격한 쪽 선택)</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  <div className="bg-white dark:bg-neutral-900 rounded px-2 py-1.5 text-xs text-center">Allow + Deny(r) = <strong>Deny</strong></div>
                  <div className="bg-white dark:bg-neutral-900 rounded px-2 py-1.5 text-xs text-center">Allow + Prompt(m) = <strong>Prompt</strong></div>
                  <div className="bg-white dark:bg-neutral-900 rounded px-2 py-1.5 text-xs text-center">Prompt + Deny(r) = <strong>Deny</strong></div>
                </div>
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded p-3 text-sm">
                <div className="font-medium text-xs mb-1">불변 규칙</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div className="bg-white dark:bg-neutral-900 rounded px-2 py-1.5 text-xs">Base가 <strong>Deny</strong> — hook 응답 무관 Deny 유지</div>
                  <div className="bg-white dark:bg-neutral-900 rounded px-2 py-1.5 text-xs">Prompt + Prompt — 훅의 메시지로 교체</div>
                </div>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 text-sm">
                <div className="text-xs"><code className="text-xs">HookResponse::Error</code> — <code className="text-xs">skip</code> 취급, base 유지</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>규칙의 핵심</strong>: "Deny는 절대 풀리지 않는다"<br />
          기본 Enforcer Deny → 훅이 Allow 보내도 Deny 유지<br />
          이 불변성이 <strong>훅 시스템의 보안 기반</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">중단 시그널 — Abort</h3>
        <div className="not-prose my-4">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-3">Abort — Deny보다 강력한 세션 종료</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-sm">
                <div className="font-medium mb-1">훅 응답</div>
                <code className="text-xs">{'{"permission": "abort", "reason": "..."}'}</code>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-sm">
                <div className="font-medium mb-1">HookRunner 처리</div>
                <div className="text-xs text-muted-foreground"><code className="text-xs">log::error</code> 기록 + <code className="text-xs">RuntimeEvent::SessionAbort</code> 방출 + <code className="text-xs">Err</code> 반환</div>
              </div>
            </div>
            <div className="text-sm font-medium mb-2">사용 사례</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-xs">크리티컬 보안 위반 (크리덴셜 노출 시도)</div>
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-xs">시스템 이상 감지 (디스크 0, OOM 위험)</div>
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-xs">정책 위반 누적 (10회+ Deny 후 abort)</div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">UserPromptSubmit 훅 — 입력 수정</h3>
        <div className="not-prose my-4">
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-3">sanitize-input.sh — 민감 정보 자동 마스킹</div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">1</span>
                <div>stdin에서 <code className="text-xs">user_prompt</code> 추출 (<code className="text-xs">jq -r '.user_prompt'</code>)</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">2</span>
                <div>이메일 주소 패턴 <code className="text-xs">sed -E</code>로 <code className="text-xs">[EMAIL]</code>로 치환</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">3</span>
                <div>API 키 패턴 (<code className="text-xs">sk-...</code>) <code className="text-xs">[API_KEY]</code>로 치환</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">out</span>
                <div><code className="text-xs">{'{"permission": "allow", "modified_input": {"user_prompt": "..."}}'}</code> — 수정된 입력으로 LLM 전달</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>UserPromptSubmit 훅의 고유 능력</strong>: 입력 수정 후 LLM 전달<br />
          <code>modified_input</code>: 원본 입력을 덮어씀 — LLM은 수정된 버전만 봄<br />
          사용 사례: 크리덴셜 마스킹, 민감 정보 제거, 프롬프트 표준화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">중첩 훅과 순서 보장</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">bash 도구 호출 시 실행 순서 예시</div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0">1</span>
                <div className="flex-1"><strong>A.sh</strong> <span className="text-xs text-muted-foreground">(always)</span></div>
                <span className="bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-0.5 text-xs font-mono">skip</span>
                <span className="text-xs text-muted-foreground">→ 다음</span>
              </div>
              <div className="flex items-center gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0">2</span>
                <div className="flex-1"><strong>B.sh</strong> <span className="text-xs text-muted-foreground">(tool: bash)</span></div>
                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded px-2 py-0.5 text-xs font-mono">allow</span>
                <span className="text-xs text-muted-foreground">→ 첫 판정! 최종</span>
              </div>
              <div className="flex items-center gap-3 text-sm bg-neutral-50 dark:bg-neutral-900/50 rounded p-3 opacity-50">
                <span className="bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-0.5 text-xs font-mono shrink-0">3</span>
                <div className="flex-1"><strong>C.sh</strong> <span className="text-xs text-muted-foreground">(always)</span></div>
                <span className="text-xs text-muted-foreground">실행 안 됨</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
              first-decision wins: <code className="text-xs">skip</code>/<code className="text-xs">error</code>만 다음 훅으로 넘어감. 첫 판정(allow/deny/prompt)이 최종
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 실패 내구성 — 프로덕션 고려사항</h3>
        <div className="not-prose my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">fail-safe (기본)</div>
              <div className="text-sm mb-2">훅 실패 / 스크립트 미존재 → <code className="text-xs">Skip</code></div>
              <div className="text-xs text-muted-foreground">시스템 계속 작동 — 일반 개발 환경의 가용성 우선</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">fail-closed (선택)</div>
              <div className="text-sm mb-2">훅 실패 → <code className="text-xs">Deny("hook unavailable")</code></div>
              <div className="text-xs text-muted-foreground"><code className="text-xs">hook_fail_closed</code> 설정 — 고보안 환경 전용</div>
            </div>
          </div>
        </div>
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
