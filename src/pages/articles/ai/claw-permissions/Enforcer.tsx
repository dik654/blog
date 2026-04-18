import EnforcerViz from './viz/EnforcerViz';

export default function Enforcer() {
  return (
    <section id="enforcer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PermissionEnforcer — 런타임 강제</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <EnforcerViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">PermissionEnforcer의 위치</h3>
        <p>
          <code>PermissionEnforcer</code>는 권한 시스템의 <strong>유일한 게이트</strong><br />
          모든 도구 호출은 <code>execute_tool()</code> 직전에 <code>enforcer.check()</code>를 통과<br />
          우회 불가 — enforcer를 건너뛰고 도구를 실행하는 경로가 구조적으로 없음
        </p>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">PermissionEnforcer 구조체</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">mode: PermissionMode</code>
                <p className="text-muted-foreground mt-1">현재 권한 모드</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">policy: PermissionPolicy</code>
                <p className="text-muted-foreground mt-1">규칙 기반 정책</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">prompt_handler: Arc&lt;dyn PromptHandler&gt;</code>
                <p className="text-muted-foreground mt-1">사용자 Y/N 입력 인터페이스</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">workspace_root: PathBuf</code>
                <p className="text-muted-foreground mt-1">워크스페이스 경계 기준 경로</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border sm:col-span-2">
                <code className="font-mono">blacklist: PathBlacklist</code>
                <p className="text-muted-foreground mt-1">차단 경로 목록 (.env, .pem 등)</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">EnforcementResult</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-background rounded px-3 py-2 text-xs border border-border text-center">
                <span className="text-green-600 font-medium">Allow</span>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border text-center">
                <span className="text-red-600 font-medium">Deny(String)</span>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border text-center">
                <span className="text-amber-600 font-medium">Prompt(String)</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">check() — 5단계 판정</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-background px-1.5 py-0.5 rounded">check()</code> — 5단계 판정 흐름</div>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono font-medium shrink-0">1</span>
              <div>
                <span className="font-medium">Policy 평가</span> (가장 세밀)
                <p className="text-muted-foreground mt-0.5"><code>policy.evaluate(ctx)</code> → Deny/Allow/Prompt 즉시 반환</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono font-medium shrink-0">2</span>
              <div>
                <span className="font-medium">Mode 비교</span>
                <p className="text-muted-foreground mt-0.5"><code>self.mode &gt;= required_permission</code> — 도구 스펙에 명시된 최소 권한과 비교</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono font-medium shrink-0">3</span>
              <div>
                <span className="font-medium">경로 검증</span> (파일 I/O 도구만)
                <p className="text-muted-foreground mt-0.5"><code>check_path(path)</code> — 워크스페이스 경계, 블랙리스트, 심링크 이스케이프 검사</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono font-medium shrink-0">4</span>
              <div>
                <span className="font-medium">명령 의도 분류</span> (bash 도구만)
                <p className="text-muted-foreground mt-0.5"><code>CommandIntent::classify(cmd)</code> — Destructive면 Prompt로 전환</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono font-medium shrink-0">5</span>
              <div>
                <span className="font-medium">차액 판정</span>
                <p className="text-muted-foreground mt-0.5">모드 부족 시 — Prompt 가능하면 Prompt, 아니면 Deny</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>판정 순서</strong>: Policy → Mode → 경로 → 명령 의도 → 차액<br />
          Policy가 가장 먼저 — 사용자 규칙이 기본 모드보다 우선<br />
          경로/명령 검증은 <strong>mode가 통과한 후</strong> 추가 방어층 역할
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PromptHandler — 사용자 확인 인터페이스</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">PromptHandler 트레이트</div>
            <p className="text-sm"><code className="text-xs bg-background px-1.5 py-0.5 rounded">prompt(message, options)</code> 메서드 — 사용자에게 확인 요청 후 응답 대기</p>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">remember: bool</code>
                <p className="text-muted-foreground mt-1">"이번만/항상" 옵션 제공 여부</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border">
                <code className="font-mono">timeout: Duration</code>
                <p className="text-muted-foreground mt-1">응답 제한 시간 (기본 60초)</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">PromptResponse 4종</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded px-3 py-2 text-xs border border-border text-center">
                <span className="text-green-600 font-medium">Yes</span>
                <p className="text-muted-foreground mt-1">1회만 허용</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border text-center">
                <span className="text-red-600 font-medium">No</span>
                <p className="text-muted-foreground mt-1">거부</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border text-center">
                <span className="text-green-600 font-medium">YesRemember</span>
                <p className="text-muted-foreground mt-1">Policy에 추가</p>
              </div>
              <div className="bg-background rounded px-3 py-2 text-xs border border-border text-center">
                <span className="text-muted-foreground font-medium">Timeout</span>
                <p className="text-muted-foreground mt-1">Deny 처리</p>
              </div>
            </div>
          </div>
          <div className="bg-muted/60 rounded-lg border border-border p-4">
            <div className="font-semibold text-sm mb-2">CliPromptHandler (CLI 구현체)</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>터미널에 <code className="bg-background px-1 py-0.5 rounded">[y] Yes, [n] No, [a] Always</code> 표시</p>
              <p>stdin에서 응답 읽기 — timeout 초과 시 자동 Deny</p>
              <p><code className="bg-background px-1 py-0.5 rounded">a/A</code> 입력 → YesRemember → 동적으로 Policy에 Allow 규칙 추가</p>
            </div>
          </div>
        </div>
        <p>
          <strong>3가지 옵션</strong>: Yes(1회만), No(거부), Always(Policy에 추가)<br />
          "Always" 선택 시 <strong>동적으로 Policy에 Allow 규칙 추가</strong> — 재확인 불필요<br />
          Timeout(기본 60초): 사용자 부재 시 안전하게 Deny — 의도치 않은 실행 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">경로 검증 — check_path()</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-background px-1.5 py-0.5 rounded">check_path()</code> — 4단계 경로 검증</div>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono font-medium shrink-0">1</span>
              <div>
                <span className="font-medium">절대 경로화</span>
                <p className="text-muted-foreground mt-0.5">상대 경로면 <code>workspace_root.join(path)</code>로 변환</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono font-medium shrink-0">2</span>
              <div>
                <span className="font-medium">워크스페이스 경계</span>
                <p className="text-muted-foreground mt-0.5"><code>starts_with(workspace_root)</code> 실패 → Deny ("outside workspace")</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono font-medium shrink-0">3</span>
              <div>
                <span className="font-medium">블랙리스트</span>
                <p className="text-muted-foreground mt-0.5"><code>blacklist.matches()</code> 일치 → Deny ("blacklisted path")</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border text-xs">
              <span className="font-mono font-medium shrink-0">4</span>
              <div>
                <span className="font-medium">심링크 이스케이프</span>
                <p className="text-muted-foreground mt-0.5"><code>canonicalize()</code>로 실제 경로 추적 — 워크스페이스 밖이면 Deny</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">심링크 이스케이프가 가장 교묘한 우회 — 공격자가 <code className="bg-background px-1 py-0.5 rounded">workspace/x → /etc/passwd</code> 설정 가능</p>
        </div>
        <p>
          <strong>4단계 경로 검증</strong>: 절대 경로화 → 워크스페이스 → 블랙리스트 → 심링크<br />
          <code>canonicalize()</code>는 심링크를 따라가 실제 경로 반환 — OS 레벨 시스템 콜<br />
          심링크 이스케이프는 <strong>가장 교묘한 우회 경로</strong> — 공격자가 <code>workspace/x → /etc/passwd</code> 설정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">permission_log에 판정 기록</h3>
        <div className="not-prose bg-muted/60 rounded-lg border border-border p-4 my-4">
          <div className="font-semibold text-sm mb-3">PermDecision — 감사 로그 구조체</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
            <div className="bg-background rounded px-3 py-2 text-xs border border-border">
              <code className="font-mono">timestamp</code>
              <p className="text-muted-foreground mt-1">판정 시각 (UTC)</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-xs border border-border">
              <code className="font-mono">tool</code>
              <p className="text-muted-foreground mt-1">호출된 도구 이름</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-xs border border-border">
              <code className="font-mono">result</code>
              <p className="text-muted-foreground mt-1">Allow/Deny/Prompt</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-xs border border-border">
              <code className="font-mono">reason</code>
              <p className="text-muted-foreground mt-1">판정 사유 문자열</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-xs border border-border sm:col-span-2">
              <code className="font-mono">prompt_response</code>
              <p className="text-muted-foreground mt-1">Prompt 결과 (Yes/No/YesRemember/Timeout)</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground"><code className="bg-background px-1 py-0.5 rounded">session.permission_log.push()</code>로 모든 판정 기록 — CI에서 분석하여 정책 개선 힌트 획득</p>
        </div>
        <p>
          <strong>감사 로그(audit trail)</strong>: 모든 권한 판정이 Session에 기록<br />
          나중에 "왜 이 작업이 차단됐나?" 질문에 답할 수 있음<br />
          CI 환경에서 <code>permission_log</code>를 분석하여 정책 개선 힌트 획득 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 단일 게이트의 보안 이점</p>
          <p>
            "모든 도구 호출이 하나의 함수를 거침"이 보안 감사의 핵심<br />
            - 코드 리뷰 시 <code>check()</code> 하나만 깊게 검토하면 전체 커버<br />
            - 새 도구 추가 시 <strong>우회 불가</strong> — 반드시 enforcer 거쳐야 호출 가능<br />
            - 감사 로그가 단일 소스 — permission_log만 보면 전체 행위 이력 파악
          </p>
          <p className="mt-2">
            반대 극(분산 게이트): 각 도구가 자체 검증 구현<br />
            - 코드 리뷰 복잡도 O(N) — N개 도구 각각 검토<br />
            - 누락 위험 — 새 도구가 검증 빠뜨릴 수 있음<br />
            - 일관성 부족 — 도구마다 에러 메시지·로그 포맷 다름
          </p>
        </div>

      </div>
    </section>
  );
}
