import CascadeViz from './viz/CascadeViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ConfigLoader &amp; 3단계 캐스케이드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CascadeViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">3단계 설정 캐스케이드</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 not-prose">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">우선순위 1 (최저)</div>
            <div className="font-semibold text-sm mb-1">시스템 기본값</div>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">/etc/claw/config.json</code>
            <div className="text-xs text-muted-foreground mt-1">관리자 설정</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">우선순위 2</div>
            <div className="font-semibold text-sm mb-1">사용자 전역</div>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">~/.claw/config.json</code>
            <div className="text-xs text-muted-foreground mt-1">홈 디렉토리</div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">우선순위 3 (최고)</div>
            <div className="font-semibold text-sm mb-1">프로젝트 로컬</div>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">.claw/config.json</code>
            <div className="text-xs text-muted-foreground mt-1">워크스페이스</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2 not-prose">
          병합 결과: 프로젝트 &gt; 사용자 &gt; 시스템 — 같은 키가 여러 파일에 있으면 하위 레벨이 이김
        </p>
        <p>
          <strong>3단계 오버라이드</strong>: 시스템 &lt; 사용자 &lt; 프로젝트<br />
          병합은 deep-merge — 중첩 객체도 재귀적으로 병합<br />
          배열은 덮어쓰기 — <code>plugins: [...]</code> 같은 필드는 치환
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">AppConfig 구조</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 not-prose">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="font-semibold text-sm mb-2 text-blue-700 dark:text-blue-300">프로바이더</div>
            <ul className="text-sm space-y-1">
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">provider: String</code> — <code className="text-xs">"anthropic"</code> | <code className="text-xs">"openai"</code> | <code className="text-xs">"xai"</code></li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">api_key: Option&lt;String&gt;</code></li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">model: String</code> — <code className="text-xs">"claude-opus-4-6"</code> 등</li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">base_url: Option&lt;Url&gt;</code></li>
            </ul>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="font-semibold text-sm mb-2 text-green-700 dark:text-green-300">권한</div>
            <ul className="text-sm space-y-1">
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">permission_mode: PermissionMode</code></li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">trusted_plugins: HashSet&lt;String&gt;</code></li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">trusted_mcp_servers: HashSet&lt;String&gt;</code></li>
            </ul>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="font-semibold text-sm mb-2 text-amber-700 dark:text-amber-300">동작</div>
            <ul className="text-sm space-y-1">
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">compact_config: CompactionConfig</code></li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">max_tool_chain_length: usize</code> — 기본 25</li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">temperature: f32</code> — 기본 1.0</li>
            </ul>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <div className="font-semibold text-sm mb-2 text-purple-700 dark:text-purple-300">훅 / 플러그인 / MCP</div>
            <ul className="text-sm space-y-1">
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">hooks: HookConfig</code></li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">plugin_paths: Vec&lt;PathBuf&gt;</code></li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">mcp_servers: HashMap&lt;String, McpServerConfig&gt;</code></li>
            </ul>
          </div>
          <div className="bg-gray-50 dark:bg-gray-950/30 border border-gray-200 dark:border-gray-800 rounded-lg p-4 sm:col-span-2">
            <div className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">로깅 / 텔레메트리</div>
            <ul className="text-sm space-y-1">
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">log_level: LogLevel</code></li>
              <li><code className="text-xs bg-muted px-1 py-0.5 rounded">telemetry_sink: Option&lt;TelemetrySink&gt;</code></li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">ConfigLoader 구현</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3">ConfigLoader 4단계 로드 흐름</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">초기화</div>
              <div className="text-sm">경로 3개 등록: <code className="text-xs bg-muted px-1 py-0.5 rounded">/etc/claw/config.json</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">~/.claw/config.json</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">.claw/config.json</code></div>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">순회 병합</div>
              <div className="text-sm">각 경로를 순회하며 <code className="text-xs bg-muted px-1 py-0.5 rounded">deep_merge(merged, layer)</code> 호출. 파일 없으면 스킵</div>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">환경 변수</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">apply_env_overrides(&mut merged)</code> — 최우선 오버라이드</div>
            </div>
            <div className="bg-background border border-border rounded p-3">
              <div className="text-xs font-mono text-muted-foreground mb-1">역직렬화</div>
              <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">serde_json::from_value(merged)</code> — 최종 <code className="text-xs">AppConfig</code> 생성</div>
            </div>
          </div>
        </div>
        <p>
          <strong>4단계 로드</strong>: 시스템 → 사용자 → 프로젝트 → 환경 변수<br />
          파일 없으면 스킵 — 프로젝트 로컬 설정 없어도 문제없음<br />
          환경 변수가 최우선 — CI/도커 환경에서 동적 오버라이드
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">deep_merge — 재귀 병합</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">fn deep_merge(base, overlay) -&gt; Value</code></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded p-3">
              <div className="text-xs font-semibold text-green-700 dark:text-green-300 mb-1">Object + Object</div>
              <div className="text-sm">재귀 병합 — 각 키를 순회하며 <code className="text-xs bg-muted px-1 py-0.5 rounded">deep_merge(entry, value)</code> 재귀 호출</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-3">
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">그 외 (배열, 원시값)</div>
              <div className="text-sm">오버라이드 — overlay 값으로 치환. 배열은 병합하지 않고 대체</div>
            </div>
          </div>
        </div>
        <p>
          <strong>객체만 재귀 병합, 나머지는 치환</strong><br />
          이유: 배열을 병합하면 순서·중복 처리가 애매함 — 치환이 예측 가능<br />
          사용자가 배열 전체를 커스터마이징 가능 — "확장이 아닌 대체"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">환경 변수 오버라이드</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3">CLAW_* 환경 변수 매핑</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-background border border-border rounded p-2.5 flex items-center gap-2">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-semibold">CLAW_PROVIDER</code>
              <span className="text-muted-foreground text-xs">&rarr;</span>
              <code className="text-xs">config.provider</code>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-center gap-2">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-semibold">CLAW_API_KEY</code>
              <span className="text-muted-foreground text-xs">&rarr;</span>
              <code className="text-xs">config.api_key</code>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-center gap-2">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-semibold">CLAW_MODEL</code>
              <span className="text-muted-foreground text-xs">&rarr;</span>
              <code className="text-xs">config.model</code>
            </div>
            <div className="bg-background border border-border rounded p-2.5 flex items-center gap-2">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-semibold">CLAW_LOG_LEVEL</code>
              <span className="text-muted-foreground text-xs">&rarr;</span>
              <code className="text-xs">config.log_level</code>
            </div>
          </div>
          <div className="mt-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded p-2.5">
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">호환 변수</div>
            <div className="text-sm"><code className="text-xs bg-muted px-1 py-0.5 rounded">ANTHROPIC_API_KEY</code> — provider가 <code className="text-xs">"anthropic"</code>일 때 자동으로 <code className="text-xs">api_key</code>에 매핑</div>
          </div>
        </div>
        <p>
          <strong>CLAW_* 환경 변수</strong>: claw-code 전용 오버라이드<br />
          기존 도구 환경 변수 호환: <code>ANTHROPIC_API_KEY</code>, <code>OPENAI_API_KEY</code><br />
          이미 환경 설정된 사용자가 별도 설정 없이 사용 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">설정 검증</h3>
        <div className="bg-muted/40 border border-border rounded-lg p-4 my-4 not-prose">
          <div className="font-semibold text-sm mb-3"><code className="text-xs bg-muted px-1 py-0.5 rounded">AppConfig::validate()</code> — 5단계 검증</div>
          <div className="space-y-2">
            <div className="bg-background border border-border rounded p-3 flex items-start gap-3">
              <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">1</span>
              <div className="text-sm"><strong>프로바이더 유효성</strong> — <code className="text-xs bg-muted px-1 py-0.5 rounded">"anthropic"</code> | <code className="text-xs">"openai"</code> | <code className="text-xs">"xai"</code> | <code className="text-xs">"azure"</code> 이외 거부</div>
            </div>
            <div className="bg-background border border-border rounded p-3 flex items-start gap-3">
              <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">2</span>
              <div className="text-sm"><strong>API 키 존재</strong> — anthropic 외 프로바이더는 <code className="text-xs bg-muted px-1 py-0.5 rounded">api_key</code> 필수</div>
            </div>
            <div className="bg-background border border-border rounded p-3 flex items-start gap-3">
              <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">3</span>
              <div className="text-sm"><strong>모델명 검증</strong> — 빈 문자열 거부</div>
            </div>
            <div className="bg-background border border-border rounded p-3 flex items-start gap-3">
              <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">4</span>
              <div className="text-sm"><strong>수치 범위</strong> — <code className="text-xs bg-muted px-1 py-0.5 rounded">temperature</code>: 0.0~2.0, <code className="text-xs bg-muted px-1 py-0.5 rounded">max_tool_chain_length</code>: ~100</div>
            </div>
            <div className="bg-background border border-amber-200 dark:border-amber-800 rounded p-3 flex items-start gap-3">
              <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0">5</span>
              <div className="text-sm"><strong>훅 파일 존재</strong> — 절대 경로 훅의 파일 존재 확인. 없으면 <span className="text-amber-600 dark:text-amber-400 font-medium">warn만</span> (거부 아님)</div>
            </div>
          </div>
        </div>
        <p>
          <strong>5단계 검증</strong>: 프로바이더 → API 키 → 모델 → 수치 범위 → 훅 파일<br />
          부트스트랩 시 1회 수행 — 실패 시 시작 거부<br />
          훅 파일 누락은 warn만 — 선택적 기능이므로 비활성화 대신 경고
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 3단계가 "올바른" 숫자인가</p>
          <p>
            설정 캐스케이드 계층 수는 시스템마다 다름:<br />
            - Git: 4단계 (system/global/local/worktree)<br />
            - npm: 4단계 (builtin/global/user/project)<br />
            - Vim: N단계 (.vimrc 재귀)
          </p>
          <p className="mt-2">
            claw-code 3단계 선택 이유:<br />
            ✓ <strong>단순성</strong>: 사용자가 어디에 무엇을 쓸지 명확<br />
            ✓ <strong>개인-팀-조직</strong> 3축 매핑: 프로젝트(팀), 사용자(개인), 시스템(조직)<br />
            ✓ <strong>환경 변수 추가</strong>: 실질적 4단계 — 일회성 오버라이드
          </p>
          <p className="mt-2">
            <strong>작위적 예외</strong>: worktree 같은 서브-프로젝트 계층 없음<br />
            필요하면 프로젝트 설정에 <code>workspace_overrides</code> 배열로 표현 가능<br />
            기본 설계는 <strong>"간단한 것부터"</strong> — 복잡한 요구는 확장으로
          </p>
        </div>

      </div>
    </section>
  );
}
