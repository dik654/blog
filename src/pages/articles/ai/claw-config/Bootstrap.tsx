import BootstrapViz from './viz/BootstrapViz';
import BootTimingViz from './viz/BootTimingViz';

export default function Bootstrap() {
  return (
    <section id="bootstrap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BootstrapPhase — 12단계 시작 시퀀스</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <BootstrapViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">12단계 부트스트랩 순서</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">BootstrapPhase</code> enum</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { n: 1, name: 'LoadingConfig', desc: 'ConfigLoader 로드' },
              { n: 2, name: 'ValidatingConfig', desc: 'AppConfig 검증' },
              { n: 3, name: 'InitializingLogger', desc: '로거 초기화' },
              { n: 4, name: 'ResolvingWorkspace', desc: '워크스페이스 경계 확정' },
              { n: 5, name: 'ComputingTrust', desc: 'TrustResolver 실행' },
              { n: 6, name: 'DiscoveringPlugins', desc: '플러그인 발견' },
              { n: 7, name: 'EnablingPlugins', desc: '트러스트된 플러그인 활성화' },
              { n: 8, name: 'StartingMcpServers', desc: 'MCP 서버 spawn' },
              { n: 9, name: 'CreatingClient', desc: 'API 클라이언트 생성' },
              { n: 10, name: 'AuthenticatingApi', desc: 'OAuth 또는 key 검증' },
              { n: 11, name: 'InitializingHooks', desc: '훅 러너 초기화' },
              { n: 12, name: 'Ready', desc: '준비 완료' },
            ].map(({ n, name, desc }) => (
              <div key={n} className="bg-background border border-border rounded p-2.5 flex items-center gap-2">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">{n}</span>
                <div>
                  <code className="text-xs font-semibold">{name}</code>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p>
          <strong>선형 순서</strong>: 각 단계는 이전 단계 완료 전제<br />
          예: 플러그인 발견 전에 워크스페이스 확정 필요 — 프로젝트 로컬 플러그인 위치 결정<br />
          예: MCP 서버 시작 전에 플러그인 활성화 — 플러그인이 MCP 설정 제공 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Bootstrap 구조체</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">pub struct Bootstrap</code></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">phase: BootstrapPhase</code>
              <div className="text-xs text-muted-foreground mt-0.5">현재 진행 단계</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">config: Option&lt;AppConfig&gt;</code>
              <div className="text-xs text-muted-foreground mt-0.5">단계 1-2 완료 시 채워짐</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">workspace: Option&lt;Workspace&gt;</code>
              <div className="text-xs text-muted-foreground mt-0.5">단계 4 완료 시 채워짐</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">trust: Option&lt;TrustDecision&gt;</code>
              <div className="text-xs text-muted-foreground mt-0.5">단계 5 완료 시 채워짐</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">plugin_registry: Option&lt;PluginRegistry&gt;</code>
              <div className="text-xs text-muted-foreground mt-0.5">단계 6-7 완료 시 채워짐</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">mcp_registry: Option&lt;McpToolRegistry&gt;</code>
              <div className="text-xs text-muted-foreground mt-0.5">단계 8 완료 시 채워짐</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">client: Option&lt;Box&lt;dyn ProviderClient&gt;&gt;</code>
              <div className="text-xs text-muted-foreground mt-0.5">단계 9-10 완료 시 채워짐</div>
            </div>
            <div className="bg-background border border-border rounded p-2.5">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">hooks: Option&lt;HookRunner&gt;</code>
              <div className="text-xs text-muted-foreground mt-0.5">단계 11 완료 시 채워짐</div>
            </div>
            <div className="bg-background border border-blue-200 dark:border-blue-800 rounded p-2.5 sm:col-span-2">
              <code className="text-xs bg-muted px-1 py-0.5 rounded">event_tx: Sender&lt;BootstrapEvent&gt;</code>
              <div className="text-xs text-muted-foreground mt-0.5">UI에 진행률 전송 — "로딩 중" 표시용</div>
            </div>
          </div>
        </div>
        <p>
          각 필드는 해당 단계 완료 시 채워짐<br />
          <code>Option&lt;T&gt;</code>: 단계 미완료 상태 표현<br />
          <code>event_tx</code>: UI에 진행률 전송 — 사용자에게 "로딩 중" 표시
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">run() — 전체 시퀀스 실행</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">Bootstrap::run() -&gt; Result&lt;ConversationRuntime&gt;</code></div>
          <div className="space-y-2">
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">단계 1-2: 설정</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">ConfigLoader::new().load()</code> &rarr; <code className="text-xs bg-muted px-1 py-0.5 rounded">config.validate()</code></div>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">단계 3-4: 초기화</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">init_logger(log_level)</code> &rarr; <code className="text-xs bg-muted px-1 py-0.5 rounded">Workspace::from_cwd()</code></div>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">단계 5: 신뢰 결정</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">TrustResolver::resolve(root)</code> &mdash; <code className="text-xs">Untrusted</code>면 즉시 에러 반환</div>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">단계 6-7: 플러그인</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">PluginRegistry::discover()</code> &rarr; <code className="text-xs bg-muted px-1 py-0.5 rounded">reg.enable(name)</code> (trusted 목록 순회)</div>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">단계 8: MCP</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">McpToolRegistry::register_server()</code> &mdash; 설정된 각 MCP 서버 spawn</div>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">단계 9-10: API</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">create_client(config)</code> &rarr; <code className="text-xs bg-muted px-1 py-0.5 rounded">client.validate_auth()</code></div>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">단계 11-12: 마무리</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">HookRunner::from_config(hooks)</code> &rarr; <code className="text-xs bg-muted px-1 py-0.5 rounded">ConversationRuntime::new(client, workspace, hooks, config)</code></div>
            </div>
          </div>
        </div>
        <p>
          <strong>진행률 이벤트</strong>: 각 단계 시작 시 <code>advance_to()</code>로 UI 갱신<br />
          UI는 "단계 N/12: ..." 형식으로 표시<br />
          각 단계는 독립 가능 — 실패 지점 명확
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실패 복구 — 부분 기능 작동</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 not-prose">
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="font-semibold text-sm mb-2 text-red-700 dark:text-red-300">치명적 실패 (시작 거부)</div>
            <ul className="text-sm space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-red-500 shrink-0">&#x2718;</span>
                <span>설정 로드/검증 실패</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 shrink-0">&#x2718;</span>
                <span>워크스페이스 확인 실패</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 shrink-0">&#x2718;</span>
                <span>API 인증 실패 &mdash; <code className="text-xs bg-muted px-1 py-0.5 rounded">return Err(e)</code></span>
              </li>
            </ul>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="font-semibold text-sm mb-2 text-amber-700 dark:text-amber-300">비치명적 실패 (경고 후 계속)</div>
            <ul className="text-sm space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 shrink-0">&#x26A0;</span>
                <span>MCP 서버 시작 실패 &mdash; <code className="text-xs bg-muted px-1 py-0.5 rounded">log::warn!</code></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 shrink-0">&#x26A0;</span>
                <span>플러그인 활성화 실패 &mdash; <code className="text-xs bg-muted px-1 py-0.5 rounded">log::warn!</code></span>
              </li>
            </ul>
            <div className="text-xs text-muted-foreground mt-2">핵심 기능(LLM 호출) 가능하면 부트 성공</div>
          </div>
        </div>
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
