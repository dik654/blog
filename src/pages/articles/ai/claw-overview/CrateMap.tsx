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
        <div className="not-prose my-4 border border-border rounded-lg p-4 bg-muted/30">
          <div className="text-sm font-semibold mb-3">의존성 DAG</div>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 font-medium text-xs">rusty-claude-cli</span>
              <span className="text-muted-foreground">→</span>
              <span className="inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium text-xs">runtime</span>
              <span className="text-muted-foreground">→</span>
              <div className="flex flex-wrap gap-1">
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs">tools → api</span>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs">commands</span>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs">plugins</span>
                <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs">telemetry</span>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 border-t border-border/50">
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-medium text-xs">compat-harness</span>
              <span className="text-xs text-muted-foreground">(독립)</span>
              <span className="text-muted-foreground">→</span>
              <span className="inline-block px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium text-xs">runtime</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 font-medium text-xs">mock-anthropic-service</span>
              <span className="text-xs text-muted-foreground">(독립, 테스트 전용)</span>
            </div>
          </div>
        </div>
        <p>
          <code>runtime</code>이 중앙 허브 — tools, api, commands, plugins, telemetry를 모두 소유<br />
          CLI는 runtime을 감싼 프레젠테이션 계층일 뿐, 비즈니스 로직 없음<br />
          <code>compat-harness</code>는 원본 Claude Code 매니페스트를 파싱하여 runtime 호환성을 검증 — runtime에 의존하되 역으로 의존받지 않음
        </p>

        {/* ── runtime 크레이트 해부 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">runtime — 37 모듈 상세</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-950/30 px-4 py-2 border-b border-border">
              <span className="text-sm font-semibold">rust/crates/runtime/src/</span>
              <span className="text-xs text-muted-foreground ml-2">37 모듈, ~24K LOC</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
              {/* 대화 코어 */}
              <div className="bg-background p-3">
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">대화 코어</div>
                <div className="space-y-1 text-xs">
                  <div><code className="bg-muted px-1 py-0.5 rounded">lib.rs</code> — 진입점, pub use 재export</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">conversation.rs</code> — 대화 상태 머신</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">conversation_runtime.rs</code> — 에이전트 루프 오케스트레이터</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">tool_dispatch.rs</code> — execute_tool() 40개 분기</div>
                </div>
              </div>
              {/* 상태 관리 */}
              <div className="bg-background p-3">
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">상태 관리</div>
                <div className="space-y-1 text-xs">
                  <div><code className="bg-muted px-1 py-0.5 rounded">session_control.rs</code> — 세션 생명주기 + fork/compact</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">session_store.rs</code> — Arc&lt;Mutex&lt;HashMap&gt;&gt; 저장소</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">compact.rs</code> — 세션 컴팩션 (689 LOC)</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">summary_compression.rs</code> — 2차 압축 레이어</div>
                </div>
              </div>
              {/* 보안 */}
              <div className="bg-background p-3">
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">보안</div>
                <div className="space-y-1 text-xs">
                  <div><code className="bg-muted px-1 py-0.5 rounded">permission_enforcer.rs</code> — Allow/Deny/Prompt 판정</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">permission_policy.rs</code> — 규칙 기반 정책 엔진</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">hooks.rs</code> — Pre/Post Tool 훅 러너</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">trust_resolver.rs</code> — 경로 기반 신뢰 판정</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">policy_engine.rs</code> — 레인 정책 평가</div>
                </div>
              </div>
              {/* 외부 통합 */}
              <div className="bg-background p-3">
                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">외부 통합</div>
                <div className="space-y-1 text-xs">
                  <div><code className="bg-muted px-1 py-0.5 rounded">mcp_lifecycle.rs</code> — MCP 11단계 상태 머신</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">mcp_stdio.rs</code> — JSON-RPC stdio 프로세스 관리</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">mcp_tool_registry.rs</code> — MCP 도구 브릿지</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">oauth.rs</code> — OAuth 2.0 + PKCE</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">sse.rs</code> — SSE 파서</div>
                </div>
              </div>
              {/* 보조 */}
              <div className="bg-background p-3 sm:col-span-2">
                <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">보조 모듈</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <div><code className="bg-muted px-1 py-0.5 rounded">worker_boot.rs</code> — 8단계 워커 부트</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">bootstrap.rs</code> — 12단계 시작 시퀀스</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">config_loader.rs</code> — 3단계 설정 캐스케이드</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">recovery.rs</code> — 복구 레시피</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">prompt_cache.rs</code> — 토큰 절약 캐시</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">usage_tracker.rs</code> — 토큰/비용 추정</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">observe.rs</code> — 상태 추론</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">misdelivery.rs</code> — 오배송 탐지</div>
                  <div><code className="bg-muted px-1 py-0.5 rounded">session_tracer.rs</code> — 텔레메트리</div>
                  <div className="text-muted-foreground">외 7개 보조 모듈</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 border-b border-border">
              <span className="text-sm font-semibold">rust/crates/tools/src/</span>
              <span className="text-xs text-muted-foreground ml-2">~7K LOC</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border">
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">lib.rs</code> — 도구 트레이트 정의</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">bash.rs</code> — Bash 실행기 (~2K LOC)</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">file_ops.rs</code> — Read/Write/Edit</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">file_search.rs</code> — Glob/Grep 검색</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">mcp_bridge.rs</code> — MCP 브릿지</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">lsp_bridge.rs</code> — LSP 브릿지</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">powershell.rs</code> — PowerShell</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">notebook.rs</code> — .ipynb 편집</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">web.rs</code> — WebFetch/Search</div>
            </div>
          </div>
        </div>
        <p>
          약 7K LOC — 도구 구현체만 보유, 디스패치 로직은 runtime이 소유<br />
          각 도구는 <code>ToolExecutor</code> 트레이트를 구현:
        </p>
        <div className="not-prose my-4 border border-border rounded-lg p-4 bg-muted/30">
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">trait ToolExecutor: Send + Sync</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-start gap-2">
              <code className="text-xs bg-muted px-1 py-0.5 rounded shrink-0">name()</code>
              <span className="text-sm">→ <code className="text-xs bg-muted px-1 py-0.5 rounded">&amp;'static str</code> 도구 이름</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="text-xs bg-muted px-1 py-0.5 rounded shrink-0">spec()</code>
              <span className="text-sm">→ <code className="text-xs bg-muted px-1 py-0.5 rounded">ToolSpec</code> 도구 스펙 (입력 스키마)</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="text-xs bg-muted px-1 py-0.5 rounded shrink-0">execute()</code>
              <span className="text-sm">→ <code className="text-xs bg-muted px-1 py-0.5 rounded">Result&lt;ToolOutput&gt;</code> 실행 결과</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2"><code className="bg-muted px-1 py-0.5 rounded">Send + Sync</code> 바운드 — 전역 레지스트리에서 Arc로 공유, 멀티스레드 안전</p>
        </div>
        <p>
          <code>Send + Sync</code> 바운드가 핵심 — 모든 도구는 스레드 간 안전하게 공유 가능<br />
          MCP 브릿지는 stdio 서브프로세스와 통신, LSP 브릿지는 언어 서버와 통신 — 둘 다 도구 형태로 노출하여 LLM이 동일한 방식으로 호출
        </p>

        {/* ── api 크레이트 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">api — 멀티 프로바이더 추상화</h3>
        <div className="not-prose my-4">
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-2 border-b border-border">
              <span className="text-sm font-semibold">rust/crates/api/src/</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-border">
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">lib.rs</code> — ProviderClient 트레이트</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">anthropic.rs</code> — Messages API</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">openai_compat.rs</code> — OpenAI/xAI/Azure</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">streaming.rs</code> — SSE 파서</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">retry.rs</code> — 지수 백오프 재시도</div>
              <div className="bg-background p-2.5 text-xs"><code className="bg-muted px-1 py-0.5 rounded">token_count.rs</code> — tiktoken-rs 카운트</div>
            </div>
          </div>
        </div>
        <p>
          <code>ProviderClient</code> 트레이트로 3개 프로바이더를 통합:
        </p>
        <div className="not-prose my-4 border border-border rounded-lg p-4 bg-muted/30">
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">trait ProviderClient: Send + Sync</div>
          <div className="space-y-1.5 text-sm">
            <div className="flex items-start gap-2">
              <code className="text-xs bg-muted px-1 py-0.5 rounded shrink-0">send_message()</code>
              <span className="text-sm">→ <code className="text-xs bg-muted px-1 py-0.5 rounded">Result&lt;Stream&lt;Chunk&gt;&gt;</code> SSE 스트림</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="text-xs bg-muted px-1 py-0.5 rounded shrink-0">count_tokens()</code>
              <span className="text-sm">→ <code className="text-xs bg-muted px-1 py-0.5 rounded">usize</code> 토큰 수</span>
            </div>
            <div className="flex items-start gap-2">
              <code className="text-xs bg-muted px-1 py-0.5 rounded shrink-0">model_info()</code>
              <span className="text-sm">→ <code className="text-xs bg-muted px-1 py-0.5 rounded">ModelInfo</code> 모델 메타데이터</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-border/50 space-y-1 text-xs text-muted-foreground">
            <div><code className="bg-muted px-1 py-0.5 rounded">AnthropicClient</code> — native Messages API + OAuth</div>
            <div><code className="bg-muted px-1 py-0.5 rounded">OpenAICompatClient</code> — OpenAI/xAI/Azure 공용 (포맷 변환 레이어)</div>
          </div>
        </div>
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
