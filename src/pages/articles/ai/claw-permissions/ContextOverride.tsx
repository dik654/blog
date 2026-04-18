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
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">ContextOverride 구조체</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">mode: Option&lt;PermissionMode&gt;</code>
                <p className="text-muted-foreground mt-1">임시 모드 (None이면 현재 유지)</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">allow_tools: HashSet&lt;String&gt;</code>
                <p className="text-muted-foreground mt-1">항상 허용할 도구 목록</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">deny_tools: HashSet&lt;String&gt;</code>
                <p className="text-muted-foreground mt-1">항상 거부할 도구 목록</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">scope: OverrideScope</code>
                <p className="text-muted-foreground mt-1">적용 범위 (아래 참조)</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">OverrideScope</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono font-medium">Once</code>
                <p className="text-muted-foreground mt-1">1회 호출 후 자동 제거</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono font-medium">Session</code>
                <p className="text-muted-foreground mt-1">현재 세션 동안 유지</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono font-medium">Persistent</code>
                <p className="text-muted-foreground mt-1">재시작 후에도 유지 (Policy에 병합)</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Override 적용 순서</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-background px-1.5 py-0.5 rounded">check()</code> — Override 적용 흐름</div>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-muted-foreground font-mono shrink-0">0</span>
              <div><code>override_stack.top()</code>에서 최상위 Override 확인</div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-red-600 font-mono shrink-0">1</span>
              <div><code>deny_tools</code>에 포함 → 즉시 <span className="text-red-600 font-medium">Deny</span> 반환</div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-green-600 font-mono shrink-0">2</span>
              <div><code>allow_tools</code>에 포함 → 즉시 <span className="text-green-600 font-medium">Allow</span> 반환</div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-amber-600 font-mono shrink-0">3</span>
              <div><code>mode</code> 임시 상승 → <code>check_inner()</code> 호출 후 원래 모드 복구</div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="text-muted-foreground font-mono shrink-0">4</span>
              <div>Override 없으면 기본 <code>check_inner()</code>로 폴백</div>
            </div>
          </div>
        </div>
        <p>
          <strong>override_stack</strong>: 중첩 오버라이드 지원 — LIFO 스택<br />
          <code>top()</code>의 오버라이드가 현재 유효 — 여러 계층 중 최상위 적용<br />
          모드 임시 상승 후 <strong>반드시 복구</strong> — finally 패턴으로 누수 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">스코프별 Override 생성</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm">Once</span>
              <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">1회용</span>
            </div>
            <p className="text-sm"><code className="text-xs bg-background px-1.5 py-0.5 rounded">push_override()</code>로 <code className="text-xs bg-background px-1.5 py-0.5 rounded">bash</code>를 allow_tools에 추가 → 다음 <code className="text-xs bg-background px-1.5 py-0.5 rounded">check()</code> 후 자동 pop</p>
            <p className="text-xs text-muted-foreground mt-1">사용자가 특정 Prompt에 "Yes" 한 번 응답한 경우</p>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm">Session</span>
              <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">세션 전체</span>
            </div>
            <p className="text-sm"><code className="text-xs bg-background px-1.5 py-0.5 rounded">mode: DangerFullAccess</code>로 세션 내 전체 승격 → 세션 종료 시 제거</p>
            <p className="text-xs text-muted-foreground mt-1"><code className="bg-background px-1 py-0.5 rounded">/allow-all</code> 슬래시 명령으로 활성화</p>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-semibold text-sm">Persistent</span>
              <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded border border-border">영구 저장</span>
            </div>
            <p className="text-sm"><code className="text-xs bg-background px-1.5 py-0.5 rounded">persist_override()</code>로 <code className="text-xs bg-background px-1.5 py-0.5 rounded">trusted_plugin_tool</code>을 allow → Policy 파일에 병합, 재시작 후에도 적용</p>
            <p className="text-xs text-muted-foreground mt-1">"Always" 응답 시 자동 Policy 업데이트</p>
          </div>
        </div>
        <p>
          <strong>Once 사용 사례</strong>: 사용자가 특정 Prompt에 "Yes" 한 번 응답<br />
          <strong>Session 사용 사례</strong>: <code>/allow-all</code> 슬래시 명령 — 세션 내 전체 승격<br />
          <strong>Persistent 사용 사례</strong>: "Always" 응답 시 Policy 업데이트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 연동 — 커스텀 권한 판정</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">훅 설정 (settings.json)</div>
            <div className="flex flex-col gap-1.5 text-sm">
              <span><code className="text-xs bg-background px-1.5 py-0.5 rounded">PreToolUse</code> 이벤트에 훅 등록</span>
              <span><code className="text-xs bg-background px-1.5 py-0.5 rounded">command</code>: 실행할 스크립트 경로</span>
              <span><code className="text-xs bg-background px-1.5 py-0.5 rounded">matcher</code>: 대상 도구 필터 (<code>{"\"tool\": \"*\""}</code> = 전체)</span>
              <span><code className="text-xs bg-background px-1.5 py-0.5 rounded">timeout_ms</code>: 응답 제한 시간 (초과 시 skip)</span>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">훅 응답 4종 (stdout JSON)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <span className="text-green-600 font-medium">allow</span> — 도구 실행 허용
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <span className="text-red-600 font-medium">deny</span> + <code>reason</code> — 실행 거부
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <span className="text-amber-600 font-medium">prompt</span> + <code>message</code> — 사용자 확인
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <span className="text-muted-foreground font-medium">skip</span> — 판정 거부, 기본 enforcer로 폴백
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>훅 응답 4종</strong>: allow, deny, prompt, skip<br />
          <code>skip</code>은 "훅이 판정 거부" — 기본 PermissionEnforcer로 폴백<br />
          timeout_ms: 훅이 느려 전체 시스템 지연 방지 — 초과 시 <code>skip</code> 처리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 실행 통합</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-background px-1.5 py-0.5 rounded">check_with_hooks()</code> — 3단계 병합</div>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono shrink-0">1</span>
              <div>
                <span className="font-medium">기본 Enforcer 판정</span>
                <p className="text-muted-foreground mt-0.5">Deny면 훅 스킵 — <strong>Deny는 뒤집을 수 없음</strong></p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono shrink-0">2</span>
              <div>
                <span className="font-medium">Pre-tool 훅 실행</span>
                <p className="text-muted-foreground mt-0.5"><code>hooks.run_pre_tool(tool, input)</code> 비동기 호출</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono shrink-0">3</span>
              <div>
                <span className="font-medium">결과 병합</span>
                <div className="flex flex-col gap-1 mt-1 text-muted-foreground">
                  <span><code>Override(action)</code> → 훅 결정 우선</span>
                  <span><code>Skip</code> → 기본 판정 유지</span>
                  <span><code>Error</code> → 경고 로그 + 기본 판정 폴백</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>핵심 보안 원칙</strong>: "Deny는 훅이 뒤집을 수 없음"<br />
          기본 Enforcer가 Deny하면 훅은 스킵 — 훅이 보안 약화 수단이 되는 것을 방지<br />
          훅은 <strong>Allow → Prompt/Deny 강화만 가능</strong>, 반대 방향은 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 훅 사용 예시 — 감사 로깅</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-2">감사 로깅 훅 (<code className="text-xs bg-background px-1 py-0.5 rounded">audit-log.sh</code>)</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">1</span>
              <span>stdin에서 JSON 수신 → <code>tool_name</code>, <code>timestamp</code> 추출</span>
            </div>
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">2</span>
              <span><code>/var/log/claw/audit.jsonl</code>에 줄 단위 JSON 기록</span>
            </div>
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">3</span>
              <span><code>{'\'{"permission":"skip"}\''}</code> 출력 — 판정은 기본 Enforcer에 위임</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">감사 전용: 판정하지 않고 로깅만 수행. <code>jsonl</code> 포맷으로 대용량 처리 적합</p>
        </div>
        <p>
          <strong>감사 전용 훅</strong>: 판정은 skip, 로깅만 수행<br />
          보안팀이 감사 로그를 별도 분석 — claw-code 자체는 수정 불필요<br />
          <code>jsonl</code> 포맷: 줄 단위 JSON — 대용량 로그 처리에 적합
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 훅 사용 예시 — 시간대 제한</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-2">시간대 제한 훅 (<code className="text-xs bg-background px-1 py-0.5 rounded">business-hours.sh</code>)</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">1</span>
              <span>현재 시간 확인 — 09:00~18:00 업무 시간 범위 판별</span>
            </div>
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border">
              <span className="text-red-600 font-mono shrink-0">2</span>
              <span>업무 시간 외 + 도구가 <code>bash</code> 또는 <code>write_file</code>이면 → <span className="text-red-600 font-medium">Deny</span> ("업무 시간 외 위험 작업 금지")</span>
            </div>
            <div className="flex items-start gap-2 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">3</span>
              <span>업무 시간 내이거나 다른 도구면 → <code>skip</code> (기본 판정 위임)</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">동적 조건(시간, 환경, 네트워크 등)은 Policy로 표현 불가 — 훅의 존재 이유</p>
        </div>
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
