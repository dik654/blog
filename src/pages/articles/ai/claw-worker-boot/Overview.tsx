import WorkerStateViz from './viz/WorkerStateViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">WorkerStatus 상태 머신</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <WorkerStateViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Worker란 무엇인가</h3>
        <p>
          Worker = claw-code가 관리하는 <strong>외부 LLM 에이전트 세션</strong><br />
          예: 서브에이전트(Task 도구로 생성), 병렬 작업 프로세스<br />
          각 Worker는 자체 터미널·프로세스·상태를 가진 독립 단위
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">WorkerStatus — 8단계 상태</h3>
        <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">0</div>
            <div className="font-semibold text-sm"><code>Idle</code></div>
            <div className="text-xs text-muted-foreground mt-1">유휴 — 작업 대기</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">1</div>
            <div className="font-semibold text-sm"><code>Launching</code></div>
            <div className="text-xs text-muted-foreground mt-1">프로세스 시작 중</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">2</div>
            <div className="font-semibold text-sm"><code>TrustResolving</code></div>
            <div className="text-xs text-muted-foreground mt-1">신뢰 결정 중 (TrustResolver)</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">3</div>
            <div className="font-semibold text-sm"><code>Ready</code></div>
            <div className="text-xs text-muted-foreground mt-1">작업 가능</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">4</div>
            <div className="font-semibold text-sm"><code>Working</code></div>
            <div className="text-xs text-muted-foreground mt-1">작업 수행 중</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">5</div>
            <div className="font-semibold text-sm"><code>WaitingInput</code></div>
            <div className="text-xs text-muted-foreground mt-1">사용자 입력 대기</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">6</div>
            <div className="font-semibold text-sm"><code>Completed</code></div>
            <div className="text-xs text-muted-foreground mt-1">작업 완료</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="text-xs font-mono text-muted-foreground mb-1">7</div>
            <div className="font-semibold text-sm"><code>Failed</code></div>
            <div className="text-xs text-muted-foreground mt-1">실패</div>
          </div>
        </div>
        <p>
          <strong>8단계 선형 흐름</strong>: Idle → Launching → TrustResolving → Ready → Working → {`(WaitingInput ↔ Working)`} → Completed/Failed<br />
          각 상태는 명확한 전이 규칙 — 임의 전이 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">상태 전이 강제</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>Worker::transition()</code> — 허용된 10개 전이</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs">Idle</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-xs">Launching</code>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs">Launching</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-xs">TrustResolving</code>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs">Launching</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-xs text-red-500">Failed</code>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs">TrustResolving</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-xs">Ready</code>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs">TrustResolving</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-xs text-red-500">Failed</code>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs">Ready</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-xs">Working</code>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs">Working</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-xs">WaitingInput</code>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs">WaitingInput</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-xs">Working</code>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs">Working</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-xs text-green-600">Completed</code>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded px-3 py-2">
              <code className="text-xs">Working</code>
              <span className="text-muted-foreground">→</span>
              <code className="text-xs text-red-500">Failed</code>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-3">
            불허 전이 시 <code>anyhow!("invalid transition")</code> 반환 — 전이 후 <code>emit_event(WorkerEvent::StatusChange)</code> 발생
          </div>
        </div>
        <p>
          <strong>10개 허용 전이</strong>만 정의 — 나머지는 거부<br />
          Ready → Failed는 불가 — 작업 시작 전 실패는 TrustResolving 단계에서 발생<br />
          Completed, Failed는 최종 상태 — 이후 전이 없음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Worker 구조체</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>pub struct Worker</code></div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">id: WorkerId</code>
              <span className="text-xs text-muted-foreground">고유 식별자</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">status: WorkerStatus</code>
              <span className="text-xs text-muted-foreground">현재 상태 (8단계 enum)</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">pid: Option&lt;u32&gt;</code>
              <span className="text-xs text-muted-foreground">OS 프로세스 ID — Launching부터 채워짐</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">terminal: Option&lt;TerminalHandle&gt;</code>
              <span className="text-xs text-muted-foreground">pty 기반 가상 터미널 — 화면 출력 캡처·입력 전송</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">trust: Option&lt;TrustDecision&gt;</code>
              <span className="text-xs text-muted-foreground">신뢰 판정 결과</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">current_task: Option&lt;Task&gt;</code>
              <span className="text-xs text-muted-foreground">현재 수행 중인 작업</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">started_at: DateTime&lt;Utc&gt;</code>
              <span className="text-xs text-muted-foreground">Worker 생성 시각</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">event_log: Vec&lt;WorkerEvent&gt;</code>
              <span className="text-xs text-muted-foreground">상태 전이·오류·사용자 입력 이력</span>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Worker 생성 흐름</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>spawn_worker(task: Task) → Result&lt;WorkerId&gt;</code></div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">1</span>
              <div>
                <div className="font-medium">Launching 전이</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>worker.transition(WorkerStatus::Launching)</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">2</span>
              <div>
                <div className="font-medium">pty 생성 및 프로세스 시작</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>launch_process(&task.config)</code> → <code>(terminal, pid)</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border-l-2 border-amber-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-amber-600 dark:text-amber-400 shrink-0">3</span>
              <div>
                <div className="font-medium">TrustResolving 전이</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>worker.transition(WorkerStatus::TrustResolving)</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border-l-2 border-amber-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-amber-600 dark:text-amber-400 shrink-0">4</span>
              <div>
                <div className="font-medium">TrustResolver 호출 — 불신 시 Failed 전이</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>TrustResolver::resolve(&task.workspace)</code> → <code>is_trusted()</code> 검사</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-950/30 border-l-2 border-green-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-green-600 dark:text-green-400 shrink-0">5</span>
              <div>
                <div className="font-medium">Ready 전이</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>worker.transition(WorkerStatus::Ready)</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-950/30 border-l-2 border-green-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-green-600 dark:text-green-400 shrink-0">6</span>
              <div>
                <div className="font-medium">레지스트리 등록 — Worker ID 반환</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>global_worker_registry().insert(worker.id, worker)</code></div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>6단계 생성 흐름</strong>: Launching → 프로세스 시작 → TrustResolving → 신뢰 결정 → Ready → 등록<br />
          각 단계 실패 시 Failed로 전이 — 정리 코드가 Drop에서 자동 실행<br />
          Ready 도달까지 약 100-500ms (프로세스 시작 오버헤드 포함)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 명시적 상태 머신의 디버깅 가치</p>
          <p>
            Worker 같은 외부 프로세스 관리는 <strong>암묵적 상태</strong>가 흔함<br />
            - 프로세스가 "시작 중"인지 "대기 중"인지 애매<br />
            - 실패했는데 정리 안 된 상태로 남음<br />
            - "좀비 프로세스" 발생
          </p>
          <p className="mt-2">
            명시적 WorkerStatus enum으로 이 모호성 제거:<br />
            - 모든 상태에 이름 부여 → 로그 추적 가능<br />
            - 허용 전이 강제 → 불가능한 상태 방지<br />
            - 이벤트 발생 → UI 실시간 업데이트
          </p>
          <p className="mt-2">
            8개 상태는 최소 — 더 많이 만들면 복잡, 더 적게 만들면 애매<br />
            경험적 최적점이 8개 — worker 수명의 <strong>각 "관찰 가능한 단계"</strong>를 표현
          </p>
        </div>

      </div>
    </section>
  );
}
