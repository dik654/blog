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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct SessionController {
    pub state: SessionState,
    pub store: Arc<Mutex<SessionStore>>,
    pub persistence: Option<Arc<dyn SessionPersistence>>,
}

pub enum SessionState {
    Initializing,  // 시작 중
    Active,        // 대화 진행
    Paused,        // 일시정지 (사용자 키 입력 대기)
    Compacting,    // 압축 중
    Terminating,   // 종료 중
    Terminated,    // 종료 완료
}`}</pre>
        <p>
          <strong>6가지 상태</strong>: Initializing → Active ⇄ Paused ⇄ Compacting → Terminating → Terminated<br />
          <code>Arc&lt;Mutex&lt;SessionStore&gt;&gt;</code>: 세션 저장소 공유 접근 (멀티스레드 안전)<br />
          <code>Option&lt;dyn SessionPersistence&gt;</code>: 디스크 영속화 (선택 — 메모리 전용 모드도 지원)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">상태 전이 규칙</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 허용된 상태 전이
impl SessionController {
    pub fn transition(&mut self, target: SessionState) -> Result<()> {
        let allowed = match (&self.state, &target) {
            (SessionState::Initializing, SessionState::Active)     => true,
            (SessionState::Active,       SessionState::Paused)     => true,
            (SessionState::Active,       SessionState::Compacting) => true,
            (SessionState::Active,       SessionState::Terminating)=> true,
            (SessionState::Paused,       SessionState::Active)     => true,
            (SessionState::Paused,       SessionState::Terminating)=> true,
            (SessionState::Compacting,   SessionState::Active)     => true,
            (SessionState::Terminating,  SessionState::Terminated) => true,
            _ => false,
        };

        if !allowed {
            return Err(anyhow!("invalid transition: {:?} → {:?}", self.state, target));
        }

        self.state = target;
        self.emit_state_change();
        Ok(())
    }
}`}</pre>
        <p>
          <strong>8개 허용 전이</strong>만 정의 — 나머지는 모두 거부<br />
          불가한 전이 예: Terminated → Active (부활 불가), Compacting → Paused (압축 중 일시정지 금지)<br />
          잘못된 전이 시도 시 <strong>즉시 에러</strong> — 상태 머신 불변성 보장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">pause() &amp; resume() — 일시정지 메커니즘</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl SessionController {
    pub async fn pause(&mut self) -> Result<()> {
        self.transition(SessionState::Paused)?;

        // 진행 중인 API 호출 취소
        if let Some(handle) = self.current_api_call.take() {
            handle.abort();
        }

        // 영속화 (메모리 → 디스크)
        if let Some(p) = &self.persistence {
            p.save(&self.current_session()).await?;
        }
        Ok(())
    }

    pub async fn resume(&mut self) -> Result<()> {
        self.transition(SessionState::Active)?;
        // API 호출을 재개할 필요는 없음 — 사용자가 다음 입력을 하면 자동 재개
        Ok(())
    }
}`}</pre>
        <p>
          <strong>Pause 3단계</strong>: 상태 전이 → API 호출 취소 → 디스크 저장<br />
          <code>handle.abort()</code>: tokio task를 즉시 취소 — 진행 중인 스트리밍 중단<br />
          Pause 중에도 Session은 메모리 유지 — Terminated와 다름
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">영속화 — SessionPersistence 트레이트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`#[async_trait]
pub trait SessionPersistence: Send + Sync {
    async fn save(&self, session: &Session) -> Result<()>;
    async fn load(&self, id: &SessionId) -> Result<Session>;
    async fn list(&self) -> Result<Vec<SessionSummary>>;
    async fn delete(&self, id: &SessionId) -> Result<()>;
}

// 구현체 예시: FilePersistence (JSON on disk)
pub struct FilePersistence {
    base_dir: PathBuf,  // ~/.claw/sessions/
}

#[async_trait]
impl SessionPersistence for FilePersistence {
    async fn save(&self, session: &Session) -> Result<()> {
        let path = self.base_dir.join(format!("{}.json", session.id));
        let json = serde_json::to_vec_pretty(session)?;
        tokio::fs::write(path, json).await?;
        Ok(())
    }
    // ... 나머지 4개 메서드
}`}</pre>
        <p>
          <strong>트레이트 기반 추상화</strong>: FilePersistence(JSON), SqlitePersistence, RedisPersistence 등 구현 가능<br />
          기본 구현은 <strong>FilePersistence</strong> — <code>~/.claw/sessions/&lt;id&gt;.json</code> 형식으로 저장<br />
          JSON 직렬화: <code>serde_json::to_vec_pretty()</code> — 사람이 읽을 수 있는 포맷
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">세션 재개 흐름 — resume-from-disk</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// CLI: claw resume <session-id>
pub async fn resume_from_disk(
    session_id: &SessionId,
    persistence: Arc<dyn SessionPersistence>,
) -> Result<SessionController> {
    // 1) 디스크에서 Session 로드
    let session = persistence.load(session_id).await?;

    // 2) SessionController 재생성
    let mut controller = SessionController {
        state: SessionState::Initializing,
        store: Arc::new(Mutex::new(SessionStore::with(session))),
        persistence: Some(persistence),
    };

    // 3) 워크스페이스 경로 검증
    let ws = &controller.current_session().workspace_root;
    if !ws.is_dir() {
        return Err(anyhow!("workspace not found: {:?}", ws));
    }

    // 4) Initializing → Active 전이
    controller.transition(SessionState::Active)?;
    Ok(controller)
}`}</pre>
        <p>
          <strong>재개 4단계</strong>: 로드 → Controller 생성 → 워크스페이스 검증 → Active 전이<br />
          <strong>워크스페이스 검증 필요 이유</strong>: Session 저장 이후 디렉토리가 삭제·이동됐을 수 있음<br />
          워크스페이스 없으면 <code>read_file</code>/<code>bash</code> 등 모든 도구가 실패 — 사전 차단
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">종료 흐름 — graceful shutdown</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl SessionController {
    pub async fn terminate(&mut self) -> Result<()> {
        self.transition(SessionState::Terminating)?;

        // 1) 진행 중인 도구 호출 완료 대기 (최대 5초)
        tokio::time::timeout(
            Duration::from_secs(5),
            self.wait_for_pending_tools(),
        ).await.ok();

        // 2) 최종 영속화
        if let Some(p) = &self.persistence {
            p.save(&self.current_session()).await?;
        }

        // 3) 텔레메트리 플러시
        self.telemetry.flush().await?;

        // 4) 종료 상태 전이
        self.transition(SessionState::Terminated)?;
        Ok(())
    }
}`}</pre>
        <p>
          <strong>graceful shutdown 4단계</strong>: 도구 완료 대기 → 영속화 → 텔레메트리 플러시 → 전이<br />
          5초 타임아웃: 무한정 기다리지 않음 — CI 환경에서 hang 방지<br />
          텔레메트리 플러시: 세션 메트릭을 로그·원격 서버에 전송
        </p>

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
