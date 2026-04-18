import LifecycleViz from './viz/LifecycleViz';

export default function Lifecycle() {
  return (
    <section id="lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PluginLifecycle — 상태 &amp; 헬스체크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <LifecycleViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">PluginLifecycle 상태 머신</h3>
        <div className="not-prose my-4">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded">Discovered</span>
            <span className="text-muted-foreground text-xs">&rarr;</span>
            <span className="inline-flex items-center text-xs font-mono bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 px-2 py-1 rounded">Loaded</span>
            <span className="text-muted-foreground text-xs">&rarr;</span>
            <span className="inline-flex items-center text-xs font-mono bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 px-2 py-1 rounded">Validated</span>
            <span className="text-muted-foreground text-xs">&rarr;</span>
            <span className="inline-flex items-center text-xs font-mono bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700 px-2 py-1 rounded">Enabled</span>
            <span className="text-muted-foreground text-xs">&harr;</span>
            <span className="inline-flex items-center text-xs font-mono bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-2 py-1 rounded">Disabled</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <div className="bg-muted/50 border border-border rounded-lg p-2 text-center">
              <div className="text-xs font-semibold mb-1">Discovered</div>
              <p className="text-xs text-muted-foreground">매니페스트 발견</p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-2 text-center">
              <div className="text-xs font-semibold mb-1">Loaded</div>
              <p className="text-xs text-muted-foreground">파싱 완료</p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-2 text-center">
              <div className="text-xs font-semibold mb-1">Validated</div>
              <p className="text-xs text-muted-foreground">해시·권한 검증</p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-2 text-center">
              <div className="text-xs font-semibold mb-1">Enabled</div>
              <p className="text-xs text-muted-foreground">호출 대기</p>
            </div>
            <div className="bg-muted/50 border border-border rounded-lg p-2 text-center">
              <div className="text-xs font-semibold mb-1">Disabled</div>
              <p className="text-xs text-muted-foreground">비활성화</p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-2 text-center">
              <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Failed</div>
              <p className="text-xs text-muted-foreground">오류 상태</p>
            </div>
          </div>
        </div>
        <p>
          각 단계는 조건 충족 시에만 다음으로 전이 — 불완전한 플러그인은 Failed<br />
          Failed 상태는 재시도 시점까지 유지 — 자동 재시도 없음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">헬스체크 메커니즘</h3>
        <p>
          <code>health_check()</code>는 3단계로 플러그인 건강 상태를 판별.
        </p>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">health_check() 3단계</div>
          <div className="p-4 space-y-2">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold flex items-center justify-center">1</span>
              <div className="text-sm">
                <strong>파일 존재 확인</strong> — <code className="text-xs bg-muted px-1 py-0.5 rounded">plugin_dir.join(entrypoint).is_file()</code>
                <p className="text-xs text-muted-foreground mt-0.5">누락 시 <code className="text-xs">Unhealthy("entrypoint missing")</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold flex items-center justify-center">2</span>
              <div className="text-sm">
                <strong>실행 권한 확인 (Unix)</strong> — <code className="text-xs bg-muted px-1 py-0.5 rounded">mode() & 0o111</code> 검사
                <p className="text-xs text-muted-foreground mt-0.5">실행 비트 없으면 <code className="text-xs">Unhealthy("not executable")</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-bold flex items-center justify-center">3</span>
              <div className="text-sm">
                <strong><code className="text-xs bg-muted px-1 py-0.5 rounded">--health-check</code> 호출</strong> — 서브프로세스 spawn 후 응답 대기
                <p className="text-xs text-muted-foreground mt-0.5">5초 타임아웃, exit 0이면 <code className="text-xs">Healthy</code></p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">주기적 헬스체크</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">health_check_loop() — 백그라운드 태스크</div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-lg font-bold">300s</div>
              <p className="text-xs text-muted-foreground">주기 (5분)</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-xs font-semibold mb-1">Unhealthy 감지 시</div>
              <p className="text-xs text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">auto_disable_unhealthy</code> 옵션이 켜져 있으면 자동 비활성화</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 text-center">
              <div className="text-xs font-semibold mb-1">대상</div>
              <p className="text-xs text-muted-foreground"><code className="text-xs bg-muted px-1 py-0.5 rounded">enabled == true</code>인 플러그인만</p>
            </div>
          </div>
        </div>
        <p>
          너무 빈번하면 CPU 낭비, 너무 느리면 장애 감지 지연 — 5분이 균형점<br />
          사용자 알림: UI 토스트 또는 다음 호출 시 에러 표시
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 복구 — retry_failed()</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">retry_failed() — 수동 재시도 흐름</div>
          <div className="p-4 space-y-2">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center">1</span>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">PluginLifecycle::Failed</code> 상태인 플러그인 이름 수집</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center">2</span>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">load_from_dir</code>로 매니페스트 재로드 시도</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold flex items-center justify-center">3</span>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">enable()</code> 재시도 — 성공 시 recovered 목록에 추가</p>
            </div>
          </div>
        </div>
        <p>
          사용자가 <code>/plugin retry</code> 명령으로 호출<br />
          실패 원인이 해결됐으면 성공 — 예: 누락됐던 실행 파일 복원 후<br />
          재시도 성공한 플러그인 이름을 사용자에게 알림
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">플러그인 업데이트 감지</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">watch_plugin_updates() — 파일시스템 감시</div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold mb-1">감시 라이브러리</div>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">notify</code> crate</p>
              <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">RecursiveMode::Recursive</code>로 전체 검색 경로 감시</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold mb-1">감지 대상</div>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">plugin-manifest.json</code></p>
              <p className="text-xs text-muted-foreground mt-1">파일명 기반 필터링 — 매니페스트만 추적</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold mb-1">변경 시 동작</div>
              <p className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">reload_plugin_at</code></p>
              <p className="text-xs text-muted-foreground mt-1">현재 호출 완료 후 새 버전 적용</p>
            </div>
          </div>
        </div>
        <p>
          매니페스트 변경 시 자동 재로드 — 재시작 없이 플러그인 업데이트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">플러그인 통계 수집</h3>
        <div className="not-prose my-4 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border text-sm font-semibold">PluginStats 구조체</div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold mb-1"><code className="text-xs">total_calls</code></div>
              <p className="text-xs text-muted-foreground">총 호출 횟수</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold mb-1"><code className="text-xs">success_count</code></div>
              <p className="text-xs text-muted-foreground">성공 횟수</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold mb-1"><code className="text-xs">failure_count</code></div>
              <p className="text-xs text-muted-foreground">실패 횟수</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold mb-1"><code className="text-xs">total_duration_ms</code></div>
              <p className="text-xs text-muted-foreground">누적 실행 시간(ms)</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold mb-1"><code className="text-xs">last_error</code></div>
              <p className="text-xs text-muted-foreground">마지막 에러 메시지</p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-xs font-semibold mb-1">파생 지표</div>
              <p className="text-xs text-muted-foreground"><code className="text-xs">avg_duration_ms()</code>, <code className="text-xs">success_rate()</code></p>
            </div>
          </div>
        </div>
        <p>
          <strong>통계 기반 관리</strong>: 사용 빈도·실패율·평균 응답 시간 추적<br />
          실패율 &gt; 10%인 플러그인: UI에 경고 표시<br />
          평균 응답 시간 &gt; 5초: 성능 저하 경고
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 플러그인 생명주기 관리의 철학</p>
          <p>
            claw-code는 플러그인을 <strong>"일등 시민"이 아닌 "확장 메커니즘"</strong>으로 취급<br />
            이 관점이 생명주기 설계에 반영됨:
          </p>
          <p className="mt-2">
            - <strong>자동 활성화 없음</strong>: 사용자 명시 승인 필수<br />
            - <strong>자동 복구 없음</strong>: Failed 상태는 수동 재시도<br />
            - <strong>모니터링 있음</strong>: 헬스체크로 문제 감지<br />
            - <strong>자동 비활성화</strong>: 문제 감지 시 안전하게 격리
          </p>
          <p className="mt-2">
            핵심 원칙: <strong>"문제 있는 플러그인은 빨리 감지하되, 자동 복구는 하지 않는다"</strong><br />
            자동 복구가 또 다른 장애를 유발할 수 있기 때문<br />
            사용자가 문제를 인지하고 직접 해결 — 예측 가능성 우선
          </p>
        </div>

      </div>
    </section>
  );
}
