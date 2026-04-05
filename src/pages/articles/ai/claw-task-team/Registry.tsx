import TaskStatusViz from './viz/TaskStatusViz';

export default function Registry() {
  return (
    <section id="registry" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TaskRegistry — 인메모리 태스크 CRUD</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TaskStatusViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">TaskRegistry 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct TaskRegistry {
    tasks: RwLock<HashMap<TaskId, TaskEntry>>,
    next_seq: AtomicU64,
}

pub struct TaskEntry {
    pub packet: TaskPacket,
    pub status: TaskStatus,
    pub status_history: Vec<StatusTransition>,
    pub worker: Option<WorkerId>,
    pub output: Option<TaskOutput>,
}

pub struct StatusTransition {
    pub from: TaskStatus,
    pub to: TaskStatus,
    pub timestamp: DateTime<Utc>,
    pub reason: Option<String>,
}`}</pre>
        <p>
          <strong>RwLock&lt;HashMap&gt;</strong>: 여러 리더 동시 읽기, 쓰기 배타<br />
          <code>status_history</code>: 모든 상태 전이 기록 — 감사 추적<br />
          전역 싱글턴으로 관리 — <code>global_task_registry()</code>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CRUD 메서드 — create</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TaskRegistry {
    pub async fn create(&self, mut packet: TaskPacket) -> Result<TaskId> {
        // ID 생성 (순차 증가)
        let seq = self.next_seq.fetch_add(1, Ordering::SeqCst);
        let id = TaskId::from(format!("task_{:08x}", seq));
        packet.id = id.clone();

        // 검증
        packet.validate()?;

        // 의존성 순환 체크
        self.check_cyclic_deps(&packet.depends_on, &id)?;

        // 엔트리 생성
        let entry = TaskEntry {
            packet,
            status: TaskStatus::Pending,
            status_history: vec![StatusTransition {
                from: TaskStatus::Pending,
                to: TaskStatus::Pending,
                timestamp: Utc::now(),
                reason: Some("created".into()),
            }],
            worker: None,
            output: None,
        };

        // 저장
        self.tasks.write().await.insert(id.clone(), entry);
        Ok(id)
    }
}`}</pre>
        <p>
          <strong>4단계 생성</strong>: ID 생성 → 검증 → 순환 체크 → 저장<br />
          순환 의존 탐지: DFS로 cycle 검사 — 생성 시점에 차단<br />
          생성 즉시 Pending 상태 — 할당 대기
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">get / list / update</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TaskRegistry {
    pub async fn get(&self, id: &TaskId) -> Option<TaskEntry> {
        self.tasks.read().await.get(id).cloned()
    }

    pub async fn list(&self, filter: TaskFilter) -> Vec<TaskEntry> {
        let tasks = self.tasks.read().await;
        tasks.values()
            .filter(|t| filter.matches(t))
            .cloned()
            .collect()
    }

    pub async fn update_status(
        &self,
        id: &TaskId,
        new_status: TaskStatus,
        reason: Option<String>,
    ) -> Result<()> {
        let mut tasks = self.tasks.write().await;
        let entry = tasks.get_mut(id).ok_or(anyhow!("not found"))?;

        let old_status = entry.status.clone();
        if !is_valid_transition(&old_status, &new_status) {
            return Err(anyhow!("invalid transition"));
        }

        entry.status = new_status.clone();
        entry.status_history.push(StatusTransition {
            from: old_status,
            to: new_status,
            timestamp: Utc::now(),
            reason,
        });

        Ok(())
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">TaskFilter — 조건부 조회</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct TaskFilter {
    pub status: Option<TaskStatus>,
    pub team: Option<TeamId>,
    pub worker: Option<WorkerId>,
    pub tag: Option<String>,
    pub priority_min: Option<Priority>,
    pub created_after: Option<DateTime<Utc>>,
}

impl TaskFilter {
    pub fn matches(&self, entry: &TaskEntry) -> bool {
        if let Some(s) = &self.status { if &entry.status != s { return false; } }
        if let Some(t) = &self.team { if entry.packet.assigned_team.as_ref() != Some(t) { return false; } }
        if let Some(w) = &self.worker { if entry.worker.as_ref() != Some(w) { return false; } }
        if let Some(tag) = &self.tag { if !entry.packet.tags.contains(tag) { return false; } }
        // ... 나머지 필터
        true
    }
}

// 사용 예
let my_in_progress = registry.list(TaskFilter {
    worker: Some(my_worker_id),
    status: Some(TaskStatus::InProgress),
    ..Default::default()
}).await;`}</pre>
        <p>
          <strong>AND 조합 필터</strong>: 모든 필드가 매칭해야 반환<br />
          None 필드는 무시 — 지정한 조건만 체크<br />
          복잡한 조회는 filter 여러 번 + 결합 (OR 필요하면 union)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">assign() — 워커 할당</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TaskRegistry {
    pub async fn assign(&self, id: &TaskId, worker: WorkerId) -> Result<()> {
        let mut tasks = self.tasks.write().await;
        let entry = tasks.get_mut(id).ok_or(anyhow!("not found"))?;

        // 이미 할당됐는지 확인
        if entry.worker.is_some() {
            return Err(anyhow!("already assigned"));
        }

        // 상태 전이
        if entry.status != TaskStatus::Pending {
            return Err(anyhow!("task not in Pending state"));
        }
        entry.status = TaskStatus::Assigned;
        entry.worker = Some(worker);

        Ok(())
    }

    pub async fn find_next_unassigned(&self, team: Option<&TeamId>) -> Option<TaskId> {
        let tasks = self.tasks.read().await;

        // 우선순위 정렬 후 첫 Pending
        let mut candidates: Vec<_> = tasks.values()
            .filter(|t| t.status == TaskStatus::Pending && t.worker.is_none())
            .filter(|t| team.is_none() || t.packet.assigned_team.as_ref() == team)
            .collect();

        candidates.sort_by(|a, b| b.packet.priority.cmp(&a.packet.priority));

        candidates.first().map(|e| e.packet.id.clone())
    }
}`}</pre>
        <p>
          <strong>assign</strong>: Pending → Assigned 전이<br />
          <code>find_next_unassigned</code>: 우선순위 높은 Pending task 반환 — Worker의 "다음 할 일" 조회
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">영속화 — 선택적 디스크 저장</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl TaskRegistry {
    pub async fn save_to_disk(&self, path: &Path) -> Result<()> {
        let tasks = self.tasks.read().await;
        let snapshot: Vec<TaskEntry> = tasks.values().cloned().collect();
        let json = serde_json::to_string_pretty(&snapshot)?;
        tokio::fs::write(path, json).await?;
        Ok(())
    }

    pub async fn load_from_disk(path: &Path) -> Result<Self> {
        let text = tokio::fs::read_to_string(path).await?;
        let snapshot: Vec<TaskEntry> = serde_json::from_str(&text)?;

        let registry = Self::new();
        let mut tasks = registry.tasks.write().await;
        for entry in snapshot {
            tasks.insert(entry.packet.id.clone(), entry);
        }
        drop(tasks);

        Ok(registry)
    }
}`}</pre>
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
