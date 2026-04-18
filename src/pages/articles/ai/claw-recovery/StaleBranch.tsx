import StaleBranchViz from './viz/StaleBranchViz';

export default function StaleBranch() {
  return (
    <section id="stale-branch" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StaleBranch — 브랜치 신선도 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <StaleBranchViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Stale Branch란</h3>
        <p>
          Stale Branch: <strong>오래된 브랜치</strong> — 활동 없이 시간이 경과하여 가치가 감소한 상태<br />
          방치 시 문제:<br />
          - target 브랜치와 drift 발생 → merge 어려움 ↑<br />
          - 저장소 저장소 오염 (브랜치 100개+)<br />
          - 리소스 낭비 (CI 재실행, 메모리)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">StaleBranchDetector 구조</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">StaleBranchDetector</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>no_activity_threshold</code></p>
                <p className="text-xs text-muted-foreground mt-1">Duration -- 무활동 한계 (7일)</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>drift_threshold_commits</code></p>
                <p className="text-xs text-muted-foreground mt-1">usize -- target 대비 뒤처진 커밋 수 한계 (100)</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>failure_threshold</code></p>
                <p className="text-xs text-muted-foreground mt-1">u32 -- 누적 실패 횟수 한계 (5회)</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">StaleReason</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs px-2 py-1 rounded-md font-mono">NoActivity</span>
              <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs px-2 py-1 rounded-md font-mono">LargeDrift</span>
              <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-md font-mono">TooManyFailures</span>
              <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-300 text-xs px-2 py-1 rounded-md font-mono">ExplicitlyAbandoned</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">3가지 stale 탐지 기준</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">StaleBranchDetector::check(lane) → Option&lt;StaleReason&gt;</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-semibold text-sm">무활동 시간 체크</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>Utc::now() - lane.last_activity</code> &gt; <code>no_activity_threshold</code> → NoActivity</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-semibold text-sm">target과의 drift 체크</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>git_client::commits_behind(&lane.branch, "main")</code> &gt; <code>drift_threshold_commits</code> → LargeDrift</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="font-semibold text-sm">누적 실패 횟수</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>lane.failure_count</code> &gt;= <code>failure_threshold</code> → TooManyFailures</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">하나라도 해당하면 즉시 반환 -- 순서대로 우선순위 판정</p>
        </div>
        <p>
          <strong>3가지 판정 기준</strong>: 시간, drift, 실패 횟수<br />
          하나라도 해당하면 stale 판정 — 보수적 접근<br />
          임계값은 프로젝트별 조정 — 빠른 변화 프로젝트는 낮은 threshold
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">stale 브랜치 처리 액션</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">StaleAction</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">RefreshBranch</p>
                <p className="text-[11px] text-muted-foreground">rebase로 신선화</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">NotifyOwner</p>
                <p className="text-[11px] text-muted-foreground">사용자 알림</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">AbandonLane</p>
                <p className="text-[11px] text-muted-foreground">완전 폐기</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">ArchiveBranch</p>
                <p className="text-[11px] text-muted-foreground">태그 백업 후 삭제</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">default_action() -- 기본 매핑</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 bg-background rounded-md border p-2.5 text-xs">
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded font-mono shrink-0">NoActivity &lt;14일</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">NotifyOwner</span>
                <span className="text-muted-foreground">"7일 이상 활동 없음"</span>
              </div>
              <div className="flex items-center gap-2 bg-background rounded-md border p-2.5 text-xs">
                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded font-mono shrink-0">NoActivity 14일+</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">AbandonLane</span>
              </div>
              <div className="flex items-center gap-2 bg-background rounded-md border p-2.5 text-xs">
                <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded font-mono shrink-0">LargeDrift</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">RefreshBranch</span>
                <span className="text-muted-foreground">rebase onto main</span>
              </div>
              <div className="flex items-center gap-2 bg-background rounded-md border p-2.5 text-xs">
                <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-0.5 rounded font-mono shrink-0">TooManyFailures</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">AbandonLane</span>
              </div>
              <div className="flex items-center gap-2 bg-background rounded-md border p-2.5 text-xs">
                <span className="bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded font-mono shrink-0">Abandoned</span>
                <span className="text-muted-foreground">→</span>
                <span className="font-semibold">ArchiveBranch</span>
                <span className="text-muted-foreground">abandoned/YYYYMMDD</span>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>기본 정책</strong>:<br />
          - 7일 무활동 → 알림<br />
          - 14일+ 무활동 → 폐기<br />
          - drift 큼 → rebase 시도<br />
          - 실패 5회+ → 폐기<br />
          - 폐기 → 태그 백업 후 브랜치 삭제
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">refresh — rebase로 신선화</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">refresh_stale_branch(branch, target) → Result&lt;RefreshOutcome&gt;</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-semibold text-sm">target 최신화</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>git_client::fetch(target)</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-semibold text-sm">rebase 시도</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>git_client::try_rebase(branch, target)</code></p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 p-3 text-center">
              <p className="text-xs font-mono font-semibold text-green-700 dark:text-green-300">Clean</p>
              <p className="text-[11px] text-muted-foreground mt-1">자동 rebase 성공</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800 p-3 text-center">
              <p className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-300">NeedsLLMHelp</p>
              <p className="text-[11px] text-muted-foreground mt-1">충돌 발생 → LLM 위임</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 p-3 text-center">
              <p className="text-xs font-mono font-semibold text-red-700 dark:text-red-300">Failed</p>
              <p className="text-[11px] text-muted-foreground mt-1">rebase 자체 실패</p>
            </div>
          </div>
        </div>
        <p>
          <strong>3가지 결과</strong>: Clean, NeedsLLMHelp, Failed<br />
          Clean: 자동 rebase로 신선화 완료<br />
          NeedsLLMHelp: 충돌 발생 → Recovery 레시피로 에스컬레이션<br />
          Failed: rebase 시도 자체 실패 (권한 문제 등)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">아카이브 — ArchiveBranch</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">archive_branch(branch, tag) → Result&lt;()&gt;</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-semibold text-sm">태그 생성</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>git_client::create_tag(tag, branch)</code> -- 현재 커밋을 가리키는 태그</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-semibold text-sm">태그 푸시</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>git_client::push_tag(tag)</code> -- 원격에 태그 보존</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="font-semibold text-sm">브랜치 삭제</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>delete_branch</code> + <code>push_delete_remote_branch</code> -- 로컬 · 원격 모두 제거</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>태그 백업 후 삭제</strong>: 완전 삭제 대신 태그로 보존<br />
          태그는 나중에 복구 가능 — 실수 방지<br />
          태그 이름에 날짜 포함 — <code>abandoned/20260405</code> 형식
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주기적 스캔 — stale_scan_loop</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">stale_scan_loop(engine, detector) -- 1시간 주기 무한 루프</p>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-semibold text-sm">3600초 대기</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>tokio::time::sleep</code> -- PolicyEngine 평가(30초)와 별도 주기</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-semibold text-sm">전체 Lane 수집</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>engine.lock().lanes.values().cloned().collect()</code> -- lock 범위 최소화</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="font-semibold text-sm">각 Lane 검사 + 액션 실행</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>detector.check(&lane)</code> → stale이면 <code>default_action</code> → <code>apply_stale_action</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>1시간 주기 스캔</strong>: PolicyEngine 평가(30초)와 별도<br />
          stale 탐지는 느린 변화 — 고주기 체크 불필요<br />
          모든 Lane 스캔 후 stale인 것만 처리
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 브랜치 관리의 심리적 요소</p>
          <p>
            자동 브랜치 삭제는 <strong>심리적 저항</strong>이 큼:<br />
            - "혹시 나중에 필요할 수도"<br />
            - "작업한 내용 사라질까 두려움"
          </p>
          <p className="mt-2">
            claw-code의 대응:<br />
            ✓ <strong>단계적 처리</strong>: 알림 → 폐기 → 아카이브<br />
            ✓ <strong>태그 백업</strong>: 절대 완전 삭제 안 함<br />
            ✓ <strong>명시적 사용자 확인</strong>: 14일+ 폐기 전 알림
          </p>
          <p className="mt-2">
            이 정책이 제공하는 것: <strong>심리적 안전 + 저장소 정리</strong><br />
            사용자는 "필요하면 복구 가능"이라고 안심<br />
            저장소는 활동적인 브랜치만 유지 — 탐색·머지 용이
          </p>
          <p className="mt-2">
            트레이드오프: 태그가 쌓이면 태그 오염 — <strong>오래된 태그 정리</strong> 추가 정책 필요<br />
            claw-code는 현재 이를 수동 관리 — 향후 자동화 로드맵
          </p>
        </div>

      </div>
    </section>
  );
}
