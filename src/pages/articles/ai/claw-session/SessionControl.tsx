import SessionStateViz from './viz/SessionStateViz';
import LifecycleTransitionsViz from './viz/LifecycleTransitionsViz';
import SessionTimelineViz from './viz/SessionTimelineViz';

export default function SessionControl() {
  return (
    <section id="session-control" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SessionController 라이프사이클</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SessionStateViz />
      </div>
      <LifecycleTransitionsViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">SessionController — 생명주기 관리자</h3>
        <p>
          <code>SessionController</code>는 Session의 <strong>생성·일시정지·재개·종료·영속화</strong>를 담당<br />
          Session이 "데이터 컨테이너"라면, Controller는 "생명주기 상태 머신"
        </p>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-2">SessionController 필드</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="rounded border bg-muted/50 p-2">
                <code className="text-xs">state: SessionState</code>
                <p className="text-[11px] text-muted-foreground mt-1">현재 상태 (6가지)</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <code className="text-xs">store: Arc&lt;Mutex&lt;SessionStore&gt;&gt;</code>
                <p className="text-[11px] text-muted-foreground mt-1">멀티스레드 안전 세션 저장소</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <code className="text-xs">persistence: Option&lt;...&gt;</code>
                <p className="text-[11px] text-muted-foreground mt-1">디스크 영속화 (선택)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            <div className="rounded-lg border bg-card p-2 text-center">
              <p className="text-xs font-semibold text-gray-500">Initializing</p>
              <p className="text-[11px] text-muted-foreground">시작 중</p>
            </div>
            <div className="rounded-lg border-2 border-green-500/50 bg-green-50 dark:bg-green-950/20 p-2 text-center">
              <p className="text-xs font-semibold text-green-700 dark:text-green-400">Active</p>
              <p className="text-[11px] text-muted-foreground">대화 진행</p>
            </div>
            <div className="rounded-lg border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20 p-2 text-center">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Paused</p>
              <p className="text-[11px] text-muted-foreground">일시정지</p>
            </div>
            <div className="rounded-lg border-2 border-blue-500/50 bg-blue-50 dark:bg-blue-950/20 p-2 text-center">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">Compacting</p>
              <p className="text-[11px] text-muted-foreground">압축 중</p>
            </div>
            <div className="rounded-lg border bg-card p-2 text-center">
              <p className="text-xs font-semibold text-orange-600 dark:text-orange-400">Terminating</p>
              <p className="text-[11px] text-muted-foreground">종료 중</p>
            </div>
            <div className="rounded-lg border-2 border-red-500/50 bg-red-50 dark:bg-red-950/20 p-2 text-center">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">Terminated</p>
              <p className="text-[11px] text-muted-foreground">종료 완료</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">상태 전이 규칙</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3"><code className="text-xs">transition(target)</code> — 8개 허용 전이</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
              <div className="flex items-center gap-1.5 rounded bg-muted/50 p-1.5">
                <span className="text-gray-500 shrink-0">Initializing</span><span className="text-muted-foreground">→</span><span className="text-green-600 dark:text-green-400">Active</span>
              </div>
              <div className="flex items-center gap-1.5 rounded bg-muted/50 p-1.5">
                <span className="text-green-600 dark:text-green-400 shrink-0">Active</span><span className="text-muted-foreground">→</span><span className="text-amber-600 dark:text-amber-400">Paused</span>
              </div>
              <div className="flex items-center gap-1.5 rounded bg-muted/50 p-1.5">
                <span className="text-green-600 dark:text-green-400 shrink-0">Active</span><span className="text-muted-foreground">→</span><span className="text-blue-600 dark:text-blue-400">Compacting</span>
              </div>
              <div className="flex items-center gap-1.5 rounded bg-muted/50 p-1.5">
                <span className="text-green-600 dark:text-green-400 shrink-0">Active</span><span className="text-muted-foreground">→</span><span className="text-orange-600 dark:text-orange-400">Terminating</span>
              </div>
              <div className="flex items-center gap-1.5 rounded bg-muted/50 p-1.5">
                <span className="text-amber-600 dark:text-amber-400 shrink-0">Paused</span><span className="text-muted-foreground">→</span><span className="text-green-600 dark:text-green-400">Active</span>
              </div>
              <div className="flex items-center gap-1.5 rounded bg-muted/50 p-1.5">
                <span className="text-amber-600 dark:text-amber-400 shrink-0">Paused</span><span className="text-muted-foreground">→</span><span className="text-orange-600 dark:text-orange-400">Terminating</span>
              </div>
              <div className="flex items-center gap-1.5 rounded bg-muted/50 p-1.5">
                <span className="text-blue-600 dark:text-blue-400 shrink-0">Compacting</span><span className="text-muted-foreground">→</span><span className="text-green-600 dark:text-green-400">Active</span>
              </div>
              <div className="flex items-center gap-1.5 rounded bg-muted/50 p-1.5">
                <span className="text-orange-600 dark:text-orange-400 shrink-0">Terminating</span><span className="text-muted-foreground">→</span><span className="text-red-600 dark:text-red-400">Terminated</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              나머지는 모두 거부. 불가 예: <span className="text-red-600 dark:text-red-400">Terminated</span> → Active (부활 불가), <span className="text-blue-600 dark:text-blue-400">Compacting</span> → Paused (압축 중 정지 금지). 잘못된 전이 시 즉시 에러 — 상태 머신 불변성 보장
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">pause() &amp; resume() — 일시정지 메커니즘</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-2"><code className="text-xs">pause()</code> — 3단계</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">1</span>
                <p className="text-xs"><code className="text-[11px]">transition(Paused)</code> — 상태 전이</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">2</span>
                <p className="text-xs"><code className="text-[11px]">handle.abort()</code> — 진행 중 API 호출 취소</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">3</span>
                <p className="text-xs"><code className="text-[11px]">persistence.save()</code> — 메모리 → 디스크</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Pause 중에도 Session은 메모리 유지 — Terminated와 다름</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-2"><code className="text-xs">resume()</code> — 1단계</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-green-600 dark:text-green-400 shrink-0 mt-0.5">1</span>
                <p className="text-xs"><code className="text-[11px]">transition(Active)</code> — 상태 전이</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">API 호출 재개 불필요 — 사용자 다음 입력 시 자동 재개</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">영속화 — SessionPersistence 트레이트</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-2">SessionPersistence 트레이트 — 4개 메서드</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs font-semibold">save()</code>
                <p className="text-[11px] text-muted-foreground mt-1">세션 → 디스크</p>
              </div>
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs font-semibold">load()</code>
                <p className="text-[11px] text-muted-foreground mt-1">디스크 → 세션</p>
              </div>
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs font-semibold">list()</code>
                <p className="text-[11px] text-muted-foreground mt-1">전체 세션 요약</p>
              </div>
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs font-semibold">delete()</code>
                <p className="text-[11px] text-muted-foreground mt-1">세션 삭제</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-2">기본 구현: FilePersistence</p>
            <div className="flex items-start gap-3">
              <div className="text-xs space-y-1">
                <p>저장 경로: <code className="text-[11px]">~/.claw/sessions/&lt;id&gt;.json</code></p>
                <p>직렬화: <code className="text-[11px]">serde_json::to_vec_pretty()</code> — 사람이 읽을 수 있는 포맷</p>
                <p className="text-muted-foreground">다른 구현체: SqlitePersistence, RedisPersistence 등 가능</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">세션 재개 흐름 — resume-from-disk</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3"><code className="text-xs">resume_from_disk(session_id)</code> — 재개 4단계</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">1</span>
                <div><p className="text-xs font-semibold">디스크에서 Session 로드</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">persistence.load(session_id)</code></p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">2</span>
                <div><p className="text-xs font-semibold">SessionController 재생성</p><p className="text-[11px] text-muted-foreground">state: <code className="text-[11px]">Initializing</code>, store + persistence 설정</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-amber-50 dark:bg-amber-950/30 p-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">3</span>
                <div><p className="text-xs font-semibold">워크스페이스 경로 검증</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">ws.is_dir()</code> — 삭제·이동됐으면 에러. 없으면 모든 도구 실패하므로 사전 차단</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-green-600 dark:text-green-400 shrink-0 mt-0.5">4</span>
                <div><p className="text-xs font-semibold">Initializing → Active 전이</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">transition(SessionState::Active)</code></p></div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">종료 흐름 — graceful shutdown</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3"><code className="text-xs">terminate()</code> — graceful shutdown 4단계</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">1</span>
                <div><p className="text-xs font-semibold">도구 호출 완료 대기</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">timeout(5s, wait_for_pending_tools())</code> — 무한정 대기 방지</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">2</span>
                <div><p className="text-xs font-semibold">최종 영속화</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">persistence.save()</code> — 마지막 상태 디스크에 기록</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 shrink-0 mt-0.5">3</span>
                <div><p className="text-xs font-semibold">텔레메트리 플러시</p><p className="text-[11px] text-muted-foreground">세션 메트릭을 로그·원격 서버에 전송</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-red-600 dark:text-red-400 shrink-0 mt-0.5">4</span>
                <div><p className="text-xs font-semibold">Terminated 전이</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">transition(SessionState::Terminated)</code></p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 명시적 상태 머신의 디버깅 장점</p>
          <p>
            claw-code는 SessionState를 6개 enum variant로 명시 — "암묵적 상태" 금지<br />
            덕분에 로그에서 상태 전이 이력을 추적 가능
          </p>
          <SessionTimelineViz />
          <p className="mt-2">
            버그 리포트 시 이 로그만 있으면 문제 상황 재현 용이<br />
            반대 극(암묵적 상태): "어쩌다 hang 상태에 빠진 세션" — 재현 불가, 디버깅 지옥<br />
            <strong>상태 머신은 LLM 에이전트에서 특히 중요</strong> — LLM 응답 비결정성으로 인한 예외 경로 많음
          </p>
        </div>

      </div>
    </section>
  );
}
