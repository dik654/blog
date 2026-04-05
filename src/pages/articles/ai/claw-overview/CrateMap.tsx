import CrateGraphViz from './viz/CrateGraphViz';

export default function CrateMap() {
  return (
    <section id="crate-map" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">9개 크레이트 맵 — Cargo Workspace 해부</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CrateGraphViz />

        {/* ── 의존성 방향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">의존성 방향 — 단방향 DAG</h3>
        <p>
          9개 크레이트는 <strong>단방향 의존성 그래프(DAG)</strong>로 구성<br />
          순환 의존 금지 — Cargo가 빌드 타임에 강제<br />
          최하위는 <code>mock-anthropic-service</code>(외부 의존 없음), 최상위는 <code>rusty-claude-cli</code>(모든 코어 크레이트 사용)
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`rusty-claude-cli  ──→  runtime ──┬──→ tools ──→ api
                                 ├──→ commands
                                 ├──→ plugins
                                 └──→ telemetry

compat-harness (독립) ──→ runtime
mock-anthropic-service (독립, 테스트 전용)`}</pre>
        <p>
          <code>runtime</code>이 중앙 허브 — tools, api, commands, plugins, telemetry를 모두 소유<br />
          CLI는 runtime을 감싼 프레젠테이션 계층일 뿐, 비즈니스 로직 없음<br />
          <code>compat-harness</code>는 원본 Claude Code 매니페스트를 파싱하여 runtime 호환성을 검증 — runtime에 의존하되 역으로 의존받지 않음
        </p>

        {/* ── runtime 크레이트 해부 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">runtime — 37 모듈 상세</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`rust/crates/runtime/src/
├── lib.rs                       # 크레이트 진입점 — pub use 재export
├── conversation.rs              # 대화 상태 머신 (Session, Message)
├── conversation_runtime.rs      # 에이전트 루프 오케스트레이터
├── tool_dispatch.rs             # execute_tool() 40개 분기
├── session_control.rs           # 세션 생명주기 + fork/compact
├── session_store.rs             # Arc<Mutex<HashMap>> 세션 저장소
├── permission_enforcer.rs       # Allow/Deny/Prompt 판정
├── permission_policy.rs         # 규칙 기반 정책 엔진
├── worker_boot.rs               # 8단계 워커 부트 상태 머신
├── trust_resolver.rs            # 경로 기반 신뢰 판정
├── hooks.rs                     # Pre/Post Tool 훅 러너
├── mcp_lifecycle.rs             # MCP 11단계 상태 머신
├── mcp_stdio.rs                 # JSON-RPC stdio 프로세스 관리
├── mcp_tool_registry.rs         # MCP 도구 브릿지
├── compact.rs                   # 세션 컴팩션 (689 LOC)
├── summary_compression.rs       # 2차 압축 레이어
├── policy_engine.rs             # 레인 정책 평가
├── recovery.rs                  # 복구 레시피
├── stale_branch.rs              # 브랜치 신선도 관리
├── task_registry.rs             # 하위 태스크 CRUD
├── team_cron.rs                 # 팀 & 크론 레지스트리
├── config_loader.rs             # 3단계 설정 캐스케이드
├── bootstrap.rs                 # 12단계 시작 시퀀스
├── oauth.rs                     # OAuth 2.0 + PKCE
├── prompt_cache.rs              # 토큰 절약 캐시
├── observe.rs                   # 화면 텍스트 기반 상태 추론
├── misdelivery.rs               # 프롬프트 오배송 탐지
├── sse.rs                       # SSE 파서
├── usage_tracker.rs             # 토큰·비용 추정
├── session_tracer.rs            # SessionTracer & TelemetrySink
└── ... (그 외 7개 보조 모듈)`}</pre>
        <p>
          총 37개 모듈, 약 24K LOC — <strong>runtime 크레이트가 전체 LOC의 약 44%</strong> 차지<br />
          모듈 네이밍 규칙: snake_case 파일명이 곧 public 모듈명 (Rust 관례)<br />
          <code>lib.rs</code>는 <code>pub use self::conversation::Session;</code> 식으로 재export만 수행 — 실제 구현은 각 모듈 파일에 분산
        </p>
        <p>
          <strong>모듈 분류 4가지</strong>:<br />
          1. <strong>대화 코어</strong> — conversation, conversation_runtime, tool_dispatch (에이전트 루프)<br />
          2. <strong>상태 관리</strong> — session_control, session_store, compact, summary_compression (세션 수명)<br />
          3. <strong>보안</strong> — permission_enforcer, permission_policy, hooks, trust_resolver (게이팅)<br />
          4. <strong>외부 통합</strong> — mcp_*, oauth, sse, prompt_cache (프로토콜 어댑터)
        </p>

        {/* ── tools 크레이트 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">tools — 도구 구현체 모음</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`rust/crates/tools/src/
├── lib.rs                 # 도구 트레이트 정의
├── bash.rs                # Bash 실행기 (sandbox 포함, ~2K LOC)
├── file_ops.rs            # Read/Write/Edit 연산
├── file_search.rs         # Glob/Grep 검색
├── mcp_bridge.rs          # MCP 프로토콜 브릿지
├── lsp_bridge.rs          # LSP 클라이언트 브릿지
├── powershell.rs          # Windows PowerShell 실행
├── notebook.rs            # .ipynb 편집
└── web.rs                 # WebFetch/WebSearch`}</pre>
        <p>
          약 7K LOC — 도구 구현체만 보유, 디스패치 로직은 runtime이 소유<br />
          각 도구는 <code>ToolExecutor</code> 트레이트를 구현:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub trait ToolExecutor: Send + Sync {
    fn name(&self) -> &'static str;
    fn spec(&self) -> ToolSpec;
    fn execute(&self, input: Value) -> Result<ToolOutput>;
    // Send + Sync — 멀티스레드 안전 (전역 레지스트리에서 Arc로 공유)
}`}</pre>
        <p>
          <code>Send + Sync</code> 바운드가 핵심 — 모든 도구는 스레드 간 안전하게 공유 가능<br />
          MCP 브릿지는 stdio 서브프로세스와 통신, LSP 브릿지는 언어 서버와 통신 — 둘 다 도구 형태로 노출하여 LLM이 동일한 방식으로 호출
        </p>

        {/* ── api 크레이트 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">api — 멀티 프로바이더 추상화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`rust/crates/api/src/
├── lib.rs               # ProviderClient 트레이트
├── anthropic.rs         # Anthropic Messages API
├── openai_compat.rs     # OpenAI 호환 (xAI, Azure OpenAI 등 공용)
├── streaming.rs         # SSE 스트리밍 파서
├── retry.rs             # 지수 백오프 재시도
└── token_count.rs       # tiktoken-rs 기반 토큰 카운트`}</pre>
        <p>
          <code>ProviderClient</code> 트레이트로 3개 프로바이더를 통합:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub trait ProviderClient: Send + Sync {
    fn send_message(&self, req: MessageRequest) -> Result<Stream<Chunk>>;
    fn count_tokens(&self, text: &str) -> usize;
    fn model_info(&self) -> ModelInfo;
}

// 구현체:
// AnthropicClient   — native Messages API + OAuth
// OpenAICompatClient — OpenAI/xAI/Azure 공용 (포맷 변환 레이어)`}</pre>
        <p>
          <strong>설계 판단</strong>: OpenAI와 xAI를 분리하지 않고 <code>OpenAICompatClient</code> 하나로 통합<br />
          이유 — xAI는 OpenAI 호환 API를 제공하므로 endpoint URL만 다르고 포맷은 동일<br />
          Azure OpenAI도 같은 클라이언트 재사용 — 오직 인증 헤더만 다름
        </p>

        {/* ── 나머지 크레이트 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">주변 크레이트 4개</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">크레이트</th>
                <th className="border border-border px-3 py-2 text-left">LOC</th>
                <th className="border border-border px-3 py-2 text-left">역할</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>commands</code></td>
                <td className="border border-border px-3 py-2">~4.3K</td>
                <td className="border border-border px-3 py-2">슬래시 명령 레지스트리 — /compact, /clear, /plan 등</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>plugins</code></td>
                <td className="border border-border px-3 py-2">~3.4K</td>
                <td className="border border-border px-3 py-2">플러그인 시스템 — 서브프로세스 격리 + 매니페스트 파싱</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>telemetry</code></td>
                <td className="border border-border px-3 py-2">~2K</td>
                <td className="border border-border px-3 py-2">SessionTracer, UsageTracker, TelemetrySink</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>rusty-claude-cli</code></td>
                <td className="border border-border px-3 py-2">~10K</td>
                <td className="border border-border px-3 py-2">CLI 진입점, REPL 루프, 마크다운→ANSI 렌더링</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>compat-harness</code></td>
                <td className="border border-border px-3 py-2">~1.5K</td>
                <td className="border border-border px-3 py-2">업스트림 매니페스트 추출 → 호환성 스냅샷 생성</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>mock-anthropic-service</code></td>
                <td className="border border-border px-3 py-2">~2.5K</td>
                <td className="border border-border px-3 py-2">결정론적 API 서비스 — 12개 시나리오 재현</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: runtime 중심 아키텍처의 장단점</p>
          <p>
            <strong>장점</strong>:<br />
            1. 내부 API 변경 시 runtime만 수정하면 상위 계층 전파 최소화<br />
            2. 테스트 표면이 runtime 하나에 집중 — mock-anthropic-service로 전체 로직 검증 가능<br />
            3. CLI, 웹 UI, TUI 등 다양한 프론트엔드를 같은 runtime 위에 올릴 수 있음
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            1. runtime 크레이트가 24K LOC로 비대 — 부분 빌드/테스트가 느려짐<br />
            2. 세부 서브시스템(권한·컴팩션·MCP) 간 내부 의존이 많아 리팩토링 난이도 ↑<br />
            3. 한 모듈 수정 시 runtime 전체 재컴파일 발생
          </p>
        </div>

      </div>
    </section>
  );
}
