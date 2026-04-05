import BootstrapViz from './viz/BootstrapViz';
import BootTimingViz from './viz/BootTimingViz';

export default function Bootstrap() {
  return (
    <section id="bootstrap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BootstrapPhase — 12단계 시작 시퀀스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <BootstrapViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">12단계 부트스트랩 순서</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub enum BootstrapPhase {
    LoadingConfig,         // 1. ConfigLoader 로드
    ValidatingConfig,      // 2. AppConfig 검증
    InitializingLogger,    // 3. 로거 초기화
    ResolvingWorkspace,    // 4. 워크스페이스 경계 확정
    ComputingTrust,        // 5. TrustResolver 실행
    DiscoveringPlugins,    // 6. 플러그인 발견
    EnablingPlugins,       // 7. 트러스트된 플러그인 활성화
    StartingMcpServers,    // 8. MCP 서버 spawn
    CreatingClient,        // 9. API 클라이언트 생성
    AuthenticatingApi,     // 10. API 인증 (OAuth 또는 key 검증)
    InitializingHooks,     // 11. 훅 러너 초기화
    Ready,                 // 12. 준비 완료
}`}</pre>
        <p>
          <strong>선형 순서</strong>: 각 단계는 이전 단계 완료 전제<br />
          예: 플러그인 발견 전에 워크스페이스 확정 필요 — 프로젝트 로컬 플러그인 위치 결정<br />
          예: MCP 서버 시작 전에 플러그인 활성화 — 플러그인이 MCP 설정 제공 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Bootstrap 구조체</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct Bootstrap {
    phase: BootstrapPhase,
    config: Option<AppConfig>,
    workspace: Option<Workspace>,
    trust: Option<TrustDecision>,
    plugin_registry: Option<PluginRegistry>,
    mcp_registry: Option<McpToolRegistry>,
    client: Option<Box<dyn ProviderClient>>,
    hooks: Option<HookRunner>,
    event_tx: Sender<BootstrapEvent>,
}`}</pre>
        <p>
          각 필드는 해당 단계 완료 시 채워짐<br />
          <code>Option&lt;T&gt;</code>: 단계 미완료 상태 표현<br />
          <code>event_tx</code>: UI에 진행률 전송 — 사용자에게 "로딩 중" 표시
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">run() — 전체 시퀀스 실행</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl Bootstrap {
    pub async fn run(&mut self) -> Result<ConversationRuntime> {
        // 단계 1-2: 설정 로드 & 검증
        self.advance_to(BootstrapPhase::LoadingConfig).await?;
        self.config = Some(ConfigLoader::new().load().await?);

        self.advance_to(BootstrapPhase::ValidatingConfig).await?;
        self.config.as_ref().unwrap().validate()?;

        // 단계 3: 로거
        self.advance_to(BootstrapPhase::InitializingLogger).await?;
        init_logger(self.config.as_ref().unwrap().log_level);

        // 단계 4: 워크스페이스
        self.advance_to(BootstrapPhase::ResolvingWorkspace).await?;
        self.workspace = Some(Workspace::from_cwd()?);

        // 단계 5: 신뢰 결정
        self.advance_to(BootstrapPhase::ComputingTrust).await?;
        self.trust = Some(TrustResolver::resolve(
            &self.workspace.as_ref().unwrap().root
        ).await?);
        if let TrustDecision::Untrusted(reason) = &self.trust.as_ref().unwrap() {
            return Err(anyhow!("workspace untrusted: {}", reason));
        }

        // 단계 6-7: 플러그인
        self.advance_to(BootstrapPhase::DiscoveringPlugins).await?;
        let mut reg = PluginRegistry::new(self.config.as_ref().unwrap().plugin_paths.clone());
        reg.discover().await?;

        self.advance_to(BootstrapPhase::EnablingPlugins).await?;
        for name in &self.config.as_ref().unwrap().trusted_plugins {
            let _ = reg.enable(name).await;
        }
        self.plugin_registry = Some(reg);

        // 단계 8: MCP
        self.advance_to(BootstrapPhase::StartingMcpServers).await?;
        let mut mcp = McpToolRegistry::new();
        for (name, cfg) in &self.config.as_ref().unwrap().mcp_servers {
            mcp.register_server(name.clone(), cfg.clone()).await.ok();
        }
        self.mcp_registry = Some(mcp);

        // 단계 9-10: API 클라이언트
        self.advance_to(BootstrapPhase::CreatingClient).await?;
        self.client = Some(create_client(self.config.as_ref().unwrap())?);

        self.advance_to(BootstrapPhase::AuthenticatingApi).await?;
        self.client.as_ref().unwrap().validate_auth().await?;

        // 단계 11: 훅
        self.advance_to(BootstrapPhase::InitializingHooks).await?;
        self.hooks = Some(HookRunner::from_config(
            &self.config.as_ref().unwrap().hooks
        ));

        // 단계 12: Ready
        self.advance_to(BootstrapPhase::Ready).await?;

        // ConversationRuntime 생성
        Ok(ConversationRuntime::new(
            self.client.take().unwrap(),
            self.workspace.take().unwrap(),
            self.hooks.take().unwrap(),
            self.config.take().unwrap(),
        ))
    }
}`}</pre>
        <p>
          <strong>진행률 이벤트</strong>: 각 단계 시작 시 <code>advance_to()</code>로 UI 갱신<br />
          UI는 "단계 N/12: ..." 형식으로 표시<br />
          각 단계는 독립 가능 — 실패 지점 명확
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 복구 — 부분 기능 작동</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 단계별 실패 처리
match phase {
    BootstrapPhase::StartingMcpServers => {
        // MCP 서버 실패는 경고만 — 나머지 계속
        for (name, cfg) in &servers {
            if let Err(e) = mcp.register_server(name.clone(), cfg.clone()).await {
                log::warn!("MCP server '{}' failed: {}", name, e);
            }
        }
    }
    BootstrapPhase::EnablingPlugins => {
        // 플러그인 활성화 실패도 경고만
        for name in &trusted {
            if let Err(e) = reg.enable(name).await {
                log::warn!("plugin '{}' failed: {}", name, e);
            }
        }
    }
    BootstrapPhase::AuthenticatingApi => {
        // API 인증 실패는 치명적 — 시작 거부
        return Err(e);
    }
    // ...
}`}</pre>
        <p>
          <strong>치명적 vs 비치명적</strong>:<br />
          - 치명적: 설정 로드·검증·워크스페이스·API 인증 실패 → 시작 중단<br />
          - 비치명적: 플러그인·MCP 서버 실패 → 경고 후 계속<br />
          핵심 기능(LLM 호출) 가능하면 부트 성공
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">시작 시간 프로파일링</h3>
        <BootTimingViz />
        <p>
          <strong>주요 병목</strong>: MCP 서버 시작(500-2000ms)<br />
          서버가 5개면 2-10초 소요 — 사용자 체감 지연<br />
          대안: MCP 서버 백그라운드 시작 — Ready 전에도 기본 도구 사용 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 12단계는 선형인가 병렬인가</p>
          <p>
            현재 claw-code는 <strong>선형 12단계</strong> — 단순하고 예측 가능<br />
            하지만 일부 단계는 병렬화 가능:
          </p>
          <p className="mt-2">
            <strong>병렬 후보</strong>:<br />
            - DiscoveringPlugins ∥ StartingMcpServers (독립적)<br />
            - AuthenticatingApi ∥ InitializingHooks (독립적)
          </p>
          <p className="mt-2">
            <strong>병렬화 안 하는 이유</strong>:<br />
            1. 에러 메시지가 명확해짐 — "N단계에서 실패" 로그<br />
            2. 디버깅 용이 — 각 단계 단독 실행 가능<br />
            3. 순서 의존 숨은 버그 방지 — 플러그인이 MCP 설정 추가하는 경우 등
          </p>
          <p className="mt-2">
            최적화 필요하면 병렬화 가능한 구조 — 하지만 현재 &lt;3초 부트는 충분히 빠름<br />
            <strong>명확성 &gt; 최적화</strong> 원칙 — 문제 생기면 그때 최적화
          </p>
        </div>

      </div>
    </section>
  );
}
