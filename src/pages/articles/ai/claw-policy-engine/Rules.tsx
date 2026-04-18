import RulesDslViz from './viz/RulesDslViz';

export default function Rules() {
  return (
    <section id="rules" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PolicyRule &amp; PolicyCondition 선언적 규칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RulesDslViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">PolicyCondition DSL</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">PolicyCondition</code> enum — 12 variants</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">조합 연산자</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 rounded">And(Vec&lt;…&gt;)</code> — 모두 참</li>
                <li><code className="text-xs bg-muted px-1 rounded">Or(Vec&lt;…&gt;)</code> — 하나라도 참</li>
                <li><code className="text-xs bg-muted px-1 rounded">Not(Box&lt;…&gt;)</code> — 부정</li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">상태 조건</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 rounded">StatusIs(LaneStatus)</code></li>
                <li><code className="text-xs bg-muted px-1 rounded">StatusFor &#123; status, at_least &#125;</code> — 지속 시간</li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">빌드 조건</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 rounded">BuildGreen</code></li>
                <li><code className="text-xs bg-muted px-1 rounded">TestsPass &#123; min_coverage &#125;</code></li>
                <li><code className="text-xs bg-muted px-1 rounded">LintClean</code></li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">시간 / 확장</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 rounded">FailureCount &#123; at_least &#125;</code></li>
                <li><code className="text-xs bg-muted px-1 rounded">TimeElapsed &#123; since, at_least &#125;</code></li>
                <li><code className="text-xs bg-muted px-1 rounded">Custom(String)</code> — Lua 스크립트</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <strong>조합 연산자</strong>: And, Or, Not — 복합 조건 표현<br />
          <strong>상태 조건</strong>: StatusIs, StatusFor(지속 시간)<br />
          <strong>빌드 조건</strong>: BuildGreen, TestsPass, LintClean<br />
          <strong>시간 조건</strong>: FailureCount, TimeElapsed
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">선언적 YAML 규칙 파일</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">.claw/policies.yaml</code> — 4개 규칙 예시</p>
          <div className="space-y-3">
            <div className="bg-background border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="shrink-0 text-xs font-mono font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">P100</span>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold">신규 Lane 자동 시작</span> — <code className="text-xs bg-muted px-1 rounded">status_is: Initialized</code> → <code className="text-xs bg-muted px-1 rounded">transition(InProgress)</code>
              </div>
            </div>
            <div className="bg-background border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="shrink-0 text-xs font-mono font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">P90</span>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold">빌드 성공 후 테스트</span> — <code className="text-xs bg-muted px-1 rounded">InProgress &amp;&amp; build_green</code> → <code className="text-xs bg-muted px-1 rounded">transition(Testing)</code>
              </div>
            </div>
            <div className="bg-background border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="shrink-0 text-xs font-mono font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">P90</span>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold">테스트 통과 후 머지 준비</span> — <code className="text-xs bg-muted px-1 rounded">Testing &amp;&amp; tests_pass(80%) &amp;&amp; lint_clean</code> → <code className="text-xs bg-muted px-1 rounded">transition(ReadyToMerge)</code>
              </div>
            </div>
            <div className="bg-background border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="shrink-0 text-xs font-mono font-bold bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded">P50</span>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold">24시간 Stale 폐기</span> — <code className="text-xs bg-muted px-1 rounded">InProgress &amp;&amp; LastActivity &gt; 24h</code> → <code className="text-xs bg-muted px-1 rounded">abandon_lane("stale")</code>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>YAML 기반 선언</strong>: 코드 수정 없이 정책 변경 가능<br />
          각 규칙은 이름 + 우선순위 + 조건 + 동작<br />
          우선순위 내림차순 평가 — 충돌 시 높은 우선순위 이김
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">evaluate() 구현</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">evaluate(&self, ctx: &LaneContext) → Result&lt;bool&gt;</code></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">조합 연산자</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">And</code> — 하위 재귀, false 하나면 즉시 반환 (단락 평가)</li>
                <li><code className="bg-muted px-1 rounded">Or</code> — 하위 재귀, true 하나면 즉시 반환</li>
                <li><code className="bg-muted px-1 rounded">Not</code> — 내부 결과 반전</li>
              </ul>
            </div>
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">상태 비교</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">StatusIs</code> — <code className="bg-muted px-1 rounded">ctx.lane_status == status</code></li>
                <li><code className="bg-muted px-1 rounded">StatusFor</code> — 상태 일치 + 지속 시간 비교</li>
              </ul>
            </div>
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">빌드 · 테스트</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">BuildGreen</code> — <code className="bg-muted px-1 rounded">last_build_status == Green</code></li>
                <li><code className="bg-muted px-1 rounded">TestsPass</code> — pass 확인 + <code className="bg-muted px-1 rounded">min_coverage</code> 검증</li>
                <li><code className="bg-muted px-1 rounded">LintClean</code> — <code className="bg-muted px-1 rounded">lint_warnings == 0</code> (기본값 1로 unknown=실패)</li>
              </ul>
            </div>
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">시간 · 확장</p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">FailureCount</code> — <code className="bg-muted px-1 rounded">ctx.failure_count &gt;= at_least</code></li>
                <li><code className="bg-muted px-1 rounded">TimeElapsed</code> — <code className="bg-muted px-1 rounded">elapsed_since(ref) &gt;= at_least</code></li>
                <li><code className="bg-muted px-1 rounded">Custom</code> — Lua 스크립트 위임</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <strong>재귀적 평가</strong>: And/Or/Not은 하위 조건 재귀 호출<br />
          단락 평가(short-circuit): And에서 false 하나면 즉시 반환<br />
          BuildStatus/TestStatus는 최근 실행 결과 — LaneContext가 추적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Custom 스크립트 평가</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">evaluate_custom_script(script, ctx) → Result&lt;bool&gt;</code></p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">1</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">mlua::Lua::new()</code> — 샌드박스 Lua VM 생성</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">2</span>
              <p className="text-sm text-muted-foreground">LaneContext → Lua 테이블 변환: <code className="text-xs bg-muted px-1 rounded">ctx.status</code>, <code className="text-xs bg-muted px-1 rounded">ctx.failure_count</code>, <code className="text-xs bg-muted px-1 rounded">ctx.coverage</code></p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">3</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">lua.load(script).eval()</code> — 스크립트 실행 후 bool 반환</p>
            </div>
          </div>
          <div className="mt-3 bg-background border rounded-lg p-3">
            <p className="text-xs font-semibold mb-1">YAML 사용 예시</p>
            <p className="text-xs text-muted-foreground">
              <code className="bg-muted px-1 rounded">custom: "ctx.failure_count &gt;= 2 and ctx.coverage &lt; 0.5"</code> → <code className="bg-muted px-1 rounded">notify("quality-review")</code>
            </p>
          </div>
        </div>
        <p>
          <strong>Lua 스크립트</strong>: 복잡한 조건을 런타임에 평가<br />
          <code>mlua</code> crate로 Rust-Lua 인터op — 샌드박스 자동 적용<br />
          내장 조건으로 부족할 때만 사용 — 대부분 DSL로 충분
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">우선순위 기반 정렬</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">sort_rules_by_priority()</code> — 내림차순, 높은 우선순위 먼저</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono font-bold bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded w-12 text-center">100</span>
              <p className="text-sm text-muted-foreground">치명적 상태 전이 — <code className="text-xs bg-muted px-1 rounded">abandon</code></p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono font-bold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded w-12 text-center">90</span>
              <p className="text-sm text-muted-foreground">표준 상태 전이 — Initialized → InProgress → Testing → Merged</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono font-bold bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded w-12 text-center">50</span>
              <p className="text-sm text-muted-foreground">시간 기반 정리 — stale, timeout</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded w-12 text-center">10</span>
              <p className="text-sm text-muted-foreground">알림 · 로깅 — 다른 규칙 방해 안 함</p>
            </div>
          </div>
        </div>
        <p>
          <strong>우선순위 전략</strong>: 숫자가 클수록 우선<br />
          100대: 즉각적 중단 필요한 규칙<br />
          90대: 정상 흐름 전이<br />
          50대: 정리·청소<br />
          10대: 관측·알림 (부수 효과)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">규칙 충돌 감지</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">detect_conflicts() → Vec&lt;RuleConflict&gt;</code></p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">1</span>
              <p className="text-sm text-muted-foreground">모든 규칙 쌍을 O(n^2) 비교</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">2</span>
              <p className="text-sm text-muted-foreground">같은 <code className="text-xs bg-muted px-1 rounded">priority</code> + <code className="text-xs bg-muted px-1 rounded">actions_compatible()</code> false → 충돌 등록</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">3</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">RuleConflict &#123; rule_a, rule_b, reason &#125;</code> 반환 — 시작 시 규칙 파일 검증</p>
            </div>
          </div>
        </div>
        <p>
          <strong>충돌 정의</strong>: 같은 우선순위 + 양립 불가 액션<br />
          예: Lane을 Merged로도 Abandoned로도 전이 불가<br />
          시작 시 충돌 감지 — 규칙 파일 검증의 일부
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: DSL vs 범용 언어의 선택</p>
          <p>
            정책 규칙 표현 3가지 선택지:
          </p>
          <p className="mt-2">
            1. <strong>YAML 선언형 DSL</strong> (claw-code 기본):<br />
            ✓ 쉬운 학습, 안전, 정적 분석 가능<br />
            ✗ 표현력 한계 (복잡한 조건 어려움)
          </p>
          <p className="mt-2">
            2. <strong>임베디드 Lua</strong> (custom 필드):<br />
            ✓ 튜링 완전 표현력<br />
            ✗ 디버깅 복잡, 보안 위험 (샌드박스로 완화)
          </p>
          <p className="mt-2">
            3. <strong>Rust 네이티브</strong>:<br />
            ✓ 최고 성능·안전<br />
            ✗ 규칙 변경 시 재컴파일
          </p>
          <p className="mt-2">
            claw-code는 <strong>1 기본 + 2 탈출구</strong> 조합<br />
            95% 규칙은 YAML로 충분, 5%는 Lua<br />
            가장 흔한 요구사항을 가장 쉽게, 드문 요구사항은 유연하게
          </p>
        </div>

      </div>
    </section>
  );
}
