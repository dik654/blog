import TaskStatusViz from './viz/TaskStatusViz';

export default function Registry() {
  return (
    <section id="registry" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TaskRegistry — 인메모리 태스크 CRUD</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TaskStatusViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">TaskRegistry 구조</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 not-prose my-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">TaskRegistry</p>
            <p className="text-sm"><code>tasks: RwLock&lt;HashMap&lt;TaskId, TaskEntry&gt;&gt;</code></p>
            <p className="text-sm"><code>next_seq: AtomicU64</code> — 순차 ID 생성</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">TaskEntry</p>
            <p className="text-sm"><code>packet: TaskPacket</code> — 작업 명세</p>
            <p className="text-sm"><code>status: TaskStatus</code> — 현재 상태</p>
            <p className="text-sm"><code>status_history</code> — 전이 기록</p>
            <p className="text-sm"><code>worker</code> / <code>output</code></p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">StatusTransition</p>
            <p className="text-sm"><code>from</code> → <code>to</code> — 상태 전이</p>
            <p className="text-sm"><code>timestamp: DateTime&lt;Utc&gt;</code></p>
            <p className="text-sm"><code>reason: Option&lt;String&gt;</code></p>
          </div>
        </div>
        <p>
          <strong>RwLock&lt;HashMap&gt;</strong>: 여러 리더 동시 읽기, 쓰기 배타<br />
          <code>status_history</code>: 모든 상태 전이 기록 — 감사 추적<br />
          전역 싱글턴으로 관리 — <code>global_task_registry()</code>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CRUD 메서드 — create</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-lg border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground mb-3">TaskRegistry::create() — 4단계</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">1</span>
              <div>
                <strong>ID 생성</strong> — <code>next_seq.fetch_add(1, SeqCst)</code> → <code>task_00000001</code> 형식
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">2</span>
              <div>
                <strong>검증</strong> — <code>packet.validate()</code> 필수 필드·일관성
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">3</span>
              <div>
                <strong>순환 체크</strong> — <code>check_cyclic_deps()</code> DFS로 cycle 검사
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded px-3 py-2 border border-border">
              <span className="text-muted-foreground font-mono shrink-0">4</span>
              <div>
                <strong>저장</strong> — <code>TaskEntry</code> 생성 (status: <code>Pending</code>, worker: None) → HashMap insert
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>4단계 생성</strong>: ID 생성 → 검증 → 순환 체크 → 저장<br />
          순환 의존 탐지: DFS로 cycle 검사 — 생성 시점에 차단<br />
          생성 즉시 Pending 상태 — 할당 대기
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">get / list / update</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 not-prose my-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">get(id)</p>
            <p className="text-sm"><code>tasks.read().await.get(id).cloned()</code></p>
            <p className="text-sm text-muted-foreground mt-1">읽기 잠금 → 단일 task 조회</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">list(filter)</p>
            <p className="text-sm"><code>tasks.values().filter(|t| filter.matches(t))</code></p>
            <p className="text-sm text-muted-foreground mt-1">읽기 잠금 → 필터 매칭 다건 조회</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">update_status(id, new_status)</p>
            <p className="text-sm"><code>is_valid_transition()</code> 체크 후 상태 전이</p>
            <p className="text-sm text-muted-foreground mt-1">쓰기 잠금 → <code>status_history</code>에 전이 기록 push</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">TaskFilter — 조건부 조회</h3>
        <div className="not-prose my-4 space-y-3">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">TaskFilter 필드 (모두 Option — None이면 무시)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              <span><code>status</code></span>
              <span><code>team</code></span>
              <span><code>worker</code></span>
              <span><code>tag</code></span>
              <span><code>priority_min</code></span>
              <span><code>created_after</code></span>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">matches() 로직</p>
            <p className="text-sm">각 필드가 <code>Some</code>이면 해당 조건 체크 — 전부 AND 결합</p>
            <p className="text-sm text-muted-foreground mt-1">예: <code>worker: Some(my_id)</code> + <code>status: Some(InProgress)</code> → "나에게 할당된 진행 중 task"</p>
          </div>
        </div>
        <p>
          <strong>AND 조합 필터</strong>: 모든 필드가 매칭해야 반환<br />
          None 필드는 무시 — 지정한 조건만 체크<br />
          복잡한 조회는 filter 여러 번 + 결합 (OR 필요하면 union)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">assign() — 워커 할당</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose my-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">assign(id, worker)</p>
            <p className="text-sm">가드: <code>worker.is_some()</code> → "already assigned" 에러</p>
            <p className="text-sm">가드: <code>status != Pending</code> → "not in Pending" 에러</p>
            <p className="text-sm mt-1">통과 시 <code>Pending → Assigned</code> 전이 + worker 설정</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">find_next_unassigned(team)</p>
            <p className="text-sm">필터: <code>status == Pending</code> + <code>worker.is_none()</code></p>
            <p className="text-sm">팀 지정 시 해당 팀만 필터</p>
            <p className="text-sm mt-1">우선순위 정렬 → 가장 높은 Pending task 반환</p>
          </div>
        </div>
        <p>
          <strong>assign</strong>: Pending → Assigned 전이<br />
          <code>find_next_unassigned</code>: 우선순위 높은 Pending task 반환 — Worker의 "다음 할 일" 조회
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">영속화 — 선택적 디스크 저장</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 not-prose my-4">
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">save_to_disk(path)</p>
            <p className="text-sm">읽기 잠금 → 전체 task를 <code>Vec&lt;TaskEntry&gt;</code>로 수집</p>
            <p className="text-sm"><code>serde_json::to_string_pretty()</code> → JSON 직렬화</p>
            <p className="text-sm"><code>tokio::fs::write()</code> → 디스크 기록</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <p className="text-xs font-semibold text-muted-foreground mb-2">load_from_disk(path)</p>
            <p className="text-sm"><code>tokio::fs::read_to_string()</code> → JSON 읽기</p>
            <p className="text-sm"><code>serde_json::from_str()</code> → 역직렬화</p>
            <p className="text-sm">새 registry 생성 후 HashMap에 전체 insert</p>
          </div>
        </div>
        <p>
          <strong>인메모리 기본 + 선택적 영속화</strong>: 성능 우선<br />
          저장 경로: <code>.claw/tasks.json</code><br />
          프로세스 재시작 시 복원 — 자동 로드 옵션
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 왜 DB 아닌 메모리인가</p>
          <p>
            TaskRegistry는 Postgres/SQLite 같은 DB 사용 가능<br />
            claw-code가 <strong>인메모리 HashMap 선택</strong>한 이유:
          </p>
          <p className="mt-2">
            ✓ <strong>단순성</strong>: DB 드라이버·스키마·마이그레이션 불필요<br />
            ✓ <strong>속도</strong>: 메모리 접근 &lt; 1μs vs DB 쿼리 &gt; 1ms<br />
            ✓ <strong>일관성</strong>: 단일 프로세스 = 단일 진실의 원천<br />
            ✓ <strong>테스트 용이</strong>: 외부 의존성 없이 빠른 테스트
          </p>
          <p className="mt-2">
            <strong>한계</strong>:<br />
            ✗ 수백만 task 못 담음 (메모리 제한)<br />
            ✗ 여러 claw-code 인스턴스 공유 불가<br />
            ✗ 크래시 시 미저장 데이터 손실
          </p>
          <p className="mt-2">
            현재 사용 사례는 <strong>단일 세션 내 task 수십~수백 개</strong> — 인메모리 충분<br />
            규모 확장 필요 시 TaskRegistry 트레이트 구현으로 SQLite/Postgres 전환 가능 — <strong>확장 가능한 단순성</strong>
          </p>
        </div>

      </div>
    </section>
  );
}
