import GreenContractViz from './viz/GreenContractViz';

export default function GreenContract() {
  return (
    <section id="green-contract" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GreenContract — 빌드 품질 게이트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <GreenContractViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">GreenContract란</h3>
        <p>
          GreenContract: Lane 머지 전에 충족해야 할 <strong>품질 기준 정의</strong><br />
          "green"은 CI 파이프라인 전체 통과 상태 — 빌드·테스트·린트 모두 성공<br />
          머지 전 마지막 관문 — 잘못된 코드가 main에 들어가지 않게 방어
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GreenContract 구조</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1"><code className="bg-muted px-1 rounded">GreenContract</code></p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">build_required: bool</code></li>
                <li><code className="bg-muted px-1 rounded">tests_required: bool</code></li>
                <li><code className="bg-muted px-1 rounded">min_test_coverage: Option&lt;f32&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">lint_required: bool</code></li>
                <li><code className="bg-muted px-1 rounded">max_lint_warnings: usize</code></li>
                <li><code className="bg-muted px-1 rounded">custom_checks: Vec&lt;CustomCheck&gt;</code></li>
                <li><code className="bg-muted px-1 rounded">consecutive_green_count: u32</code> — 연속 green 요구</li>
              </ul>
            </div>
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1"><code className="bg-muted px-1 rounded">CustomCheck</code></p>
              <ul className="text-xs space-y-0.5 text-muted-foreground">
                <li><code className="bg-muted px-1 rounded">name: String</code> — 체크 이름</li>
                <li><code className="bg-muted px-1 rounded">command: String</code> — 셸 명령</li>
                <li><code className="bg-muted px-1 rounded">timeout: Duration</code> — 시간 제한</li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <strong>기본 검증 4가지</strong>: build, tests, coverage, lint<br />
          <code>custom_checks</code>: 팀별 추가 검증 (보안 스캔, 성능 벤치마크 등)<br />
          <code>consecutive_green_count</code>: flaky test 대응 — 연속 N회 green 요구
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">verify() — 계약 검증</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">verify(&self, ctx: &LaneContext) → VerifyResult</code></p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">build</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">build_required</code> → <code className="text-xs bg-muted px-1 rounded">BuildStatus::Green</code> 아니면 실패 추가</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">tests</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">tests_required</code> → <code className="text-xs bg-muted px-1 rounded">TestStatus::Pass</code> 아니면 실패 추가</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">coverage</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">min_test_coverage</code> 미달 또는 unknown이면 실패 추가</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">lint</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">lint_warnings &gt; max_lint_warnings</code>이면 실패 추가</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-mono bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">custom</span>
              <p className="text-sm text-muted-foreground">각 <code className="text-xs bg-muted px-1 rounded">CustomCheck</code> 실행 → 실패 시 이름 + 에러 메시지 추가</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">모든 체크 완료 후 실패 목록이 비어 있으면 <code className="bg-muted px-1 rounded">Pass</code>, 아니면 <code className="bg-muted px-1 rounded">Fail(failures)</code> — 첫 실패에서 멈추지 않고 전부 수집</p>
        </div>
        <p>
          <strong>누적 실패 리스트</strong>: 첫 실패에서 멈추지 않고 모든 실패 수집<br />
          사용자에게 "한 번에 모든 문제" 표시 — 여러 번 시도 불필요<br />
          LLM이 에러 목록 보고 한 번에 모두 수정 시도
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">consecutive green — flaky test 대응</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">verify_consecutive(ctx) → bool</code></p>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">consecutive_green_count &lt;= 1</code>이면 즉시 true 반환</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">recent_build_history</code>에서 최근 N개 확인 — 부족하면 false</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">.all(|b| b.status == Green)</code> — N개 전부 green이어야 통과</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded p-2 text-center">
              <p className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">1회 green</p>
              <p className="text-xs text-muted-foreground">flaky 가능성 높음</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-2 text-center">
              <p className="text-xs font-semibold text-green-700 dark:text-green-300">2회 연속</p>
              <p className="text-xs text-muted-foreground">신뢰도 높음</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-2 text-center">
              <p className="text-xs font-semibold text-green-700 dark:text-green-300">3회 연속</p>
              <p className="text-xs text-muted-foreground">거의 확실</p>
            </div>
          </div>
        </div>
        <p>
          <strong>flaky test 방어</strong>: 1회 통과로 판단 금지<br />
          2회 이상 연속 통과 요구 → 우연한 pass 배제<br />
          트레이드오프: 머지 속도 vs 안정성
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">커스텀 체크 실행</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 rounded">run_custom_check(check) → Result&lt;()&gt;</code></p>
          <div className="space-y-3 mb-3">
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">1</span>
              <p className="text-sm text-muted-foreground"><code className="text-xs bg-muted px-1 rounded">tokio::time::timeout</code> + <code className="text-xs bg-muted px-1 rounded">/bin/sh -c</code>로 셸 명령 실행</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">2</span>
              <p className="text-sm text-muted-foreground">exit 0 = 통과, 비정상 exit = 실패 (stderr 포함), timeout 초과 = 실패</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">security scan</p>
              <p className="text-xs text-muted-foreground"><code className="bg-muted px-1 rounded">cargo audit --deny warnings</code></p>
              <p className="text-xs text-muted-foreground">timeout: 60s</p>
            </div>
            <div className="bg-background border rounded-lg p-3">
              <p className="text-xs font-semibold mb-1">no console.log</p>
              <p className="text-xs text-muted-foreground"><code className="bg-muted px-1 rounded">! grep -rn 'console.log' src/</code></p>
              <p className="text-xs text-muted-foreground">timeout: 5s</p>
            </div>
          </div>
        </div>
        <p>
          <strong>임의 셸 명령 지원</strong>: exit 0 = 통과, 비정상 exit = 실패<br />
          timeout 초과 시 실패 취급<br />
          단순 grep으로 "금지된 패턴 검출" 구현 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GreenContract 표시 UI</h3>
        <div className="not-prose bg-muted/50 border rounded-lg p-4 my-4">
          <div className="bg-background border-2 border-green-300 dark:border-green-700 rounded-lg p-4">
            <p className="font-semibold text-sm mb-1">Lane #42: <code className="text-xs bg-muted px-1 rounded">feat/add-auth</code></p>
            <p className="text-xs text-green-600 dark:text-green-400 font-semibold mb-3">Status: ReadyToMerge</p>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground"><span className="text-green-600 dark:text-green-400 font-bold">&#10003;</span> build: green</p>
              <p className="text-xs text-muted-foreground"><span className="text-green-600 dark:text-green-400 font-bold">&#10003;</span> tests: pass (487/487)</p>
              <p className="text-xs text-muted-foreground"><span className="text-green-600 dark:text-green-400 font-bold">&#10003;</span> coverage: 84.2% &ge; 80%</p>
              <p className="text-xs text-muted-foreground"><span className="text-green-600 dark:text-green-400 font-bold">&#10003;</span> lint: 0 warnings</p>
              <p className="text-xs text-muted-foreground"><span className="text-green-600 dark:text-green-400 font-bold">&#10003;</span> security: no issues</p>
              <p className="text-xs text-muted-foreground"><span className="text-green-600 dark:text-green-400 font-bold">&#10003;</span> consecutive: 2/2 green</p>
            </div>
            <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-3">Ready to merge!</p>
          </div>
        </div>
        <p>
          <strong>모든 체크 시각화</strong>: 통과 ✓ / 실패 ✗<br />
          사용자가 상태 한눈에 파악 — 무엇이 통과/실패했는지<br />
          실패 시 구체적 이유 표시 — "coverage 75% &lt; 80%"
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: "Green" 정의의 중요성</p>
          <p>
            팀마다 "green"의 의미가 다름:
          </p>
          <p className="mt-2">
            - <strong>작은 스타트업</strong>: build + tests만 — 빠른 iteration<br />
            - <strong>중간 규모</strong>: + lint + coverage — 품질 관리<br />
            - <strong>대기업</strong>: + security + performance + compliance — 규제 대응<br />
            - <strong>오픈소스</strong>: + multi-OS test + docs 검증 — 호환성
          </p>
          <p className="mt-2">
            GreenContract는 <strong>"우리 팀의 green 정의"</strong>를 명시<br />
            - 코드로 표현 → git 관리 가능<br />
            - 변경 이력 추적 가능<br />
            - 모든 팀원이 같은 기준 적용
          </p>
          <p className="mt-2">
            PolicyEngine과 결합 시 <strong>완전 자동화 파이프라인</strong>:<br />
            "green 조건 만족 시 자동 머지" → 사람이 버튼 누를 필요 없음<br />
            단, GreenContract가 너무 느슨하면 품질 저하 — 신중한 설계 필요
          </p>
        </div>

      </div>
    </section>
  );
}
