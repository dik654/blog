import RegistryLayersViz from './viz/RegistryLayersViz';
import ToolCategoriesViz from './viz/ToolCategoriesViz';
import GlobalRegistry3LayerViz from './viz/GlobalRegistry3LayerViz';
import DispatchMatchViz from './viz/DispatchMatchViz';
import OnceLockRegistriesViz from './viz/OnceLockRegistriesViz';
import PermissionResultViz from './viz/PermissionResultViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">도구 시스템 &amp; 디스패치</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RegistryLayersViz />

        {/* ───────── 1. ToolSpec 구조 ───────── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">1. 도구 스펙 구조 — ToolSpec</h3>
        <p>
          Claw Code의 모든 도구는 <strong>ToolSpec</strong> 하나로 정의된다.<br />
          LLM이 "어떤 도구를 호출할 수 있는가"를 판단하는 유일한 근거가 이 스펙이므로,
          name/description/input_schema 세 필드가 곧 도구의 전부다.
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">필드</p>
            <p className="font-mono text-sm font-semibold">name: <code className="text-xs bg-muted px-1 py-0.5 rounded">&amp;'static str</code></p>
            <p className="text-sm text-muted-foreground mt-1">LLM이 호출하는 이름 (예: <code className="text-xs">"bash"</code>, <code className="text-xs">"read_file"</code>)</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">필드</p>
            <p className="font-mono text-sm font-semibold">description: <code className="text-xs bg-muted px-1 py-0.5 rounded">&amp;'static str</code></p>
            <p className="text-sm text-muted-foreground mt-1">도구 설명 — LLM 프롬프트에 삽입</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">필드</p>
            <p className="font-mono text-sm font-semibold">input_schema: <code className="text-xs bg-muted px-1 py-0.5 rounded">Value</code></p>
            <p className="text-sm text-muted-foreground mt-1">JSON Schema — 파라미터 타입 및 필수 여부 정의</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">필드</p>
            <p className="font-mono text-sm font-semibold">required_permission: <code className="text-xs bg-muted px-1 py-0.5 rounded">PermissionMode</code></p>
            <p className="text-sm text-muted-foreground mt-1">최소 권한 모드 — ReadOnly | WorkspaceWrite | DangerFullAccess</p>
          </div>
        </div>
        <p>
          <code>mvp_tool_specs()</code> 함수가 40개 빌트인 도구 스펙을 <code>Vec&lt;ToolSpec&gt;</code>로 반환한다.<br />
          이 벡터가 LLM에게 전달되는 <code>tools</code> 배열의 원본이며,
          런타임에 플러그인·MCP 도구가 추가되어 최종 도구 목록이 완성된다.
        </p>
        <p>
          <strong>설계 판단</strong>: <code>name</code>이 <code>&amp;'static str</code>인 이유 —
          빌트인 도구 이름은 컴파일 타임에 확정되므로 힙 할당 불필요.
          반면 <code>input_schema</code>는 <code>serde_json::Value</code>로 런타임 유연성 확보.
          JSON Schema 자체가 도구마다 크게 다르기 때문에 정적 타입으로 표현하면 오히려 복잡해진다.
        </p>

        {/* ───────── 2. 40개 도구 카테고리 ───────── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">2. 40개 빌트인 도구 — 카테고리별 분류</h3>
        <p>
          40개 도구는 10개 카테고리로 나뉜다.
          권한 열은 <code>PermissionMode</code> — <strong>R</strong>(ReadOnly),
          <strong>W</strong>(WorkspaceWrite), <strong>D</strong>(DangerFullAccess)로 축약.
        </p>
      </div>
      <ToolCategoriesViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">카테고리</th>
                <th className="border border-border px-3 py-2 text-left">도구</th>
                <th className="border border-border px-3 py-2 text-left">권한</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">파일 I/O</td>
                <td className="border border-border px-3 py-2"><code>read_file</code>, <code>write_file</code>, <code>edit_file</code></td>
                <td className="border border-border px-3 py-2">R / W / W</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">검색</td>
                <td className="border border-border px-3 py-2"><code>glob_search</code>, <code>grep_search</code></td>
                <td className="border border-border px-3 py-2">R</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">실행</td>
                <td className="border border-border px-3 py-2"><code>bash</code>, <code>PowerShell</code>, <code>REPL</code>, <code>Sleep</code></td>
                <td className="border border-border px-3 py-2">D</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">UI</td>
                <td className="border border-border px-3 py-2"><code>SendUserMessage</code>, <code>Config</code>, <code>EnterPlanMode</code>, <code>ExitPlanMode</code></td>
                <td className="border border-border px-3 py-2">R</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">태스크 관리</td>
                <td className="border border-border px-3 py-2"><code>TaskCreate</code> / <code>Get</code> / <code>List</code> / <code>Stop</code> / <code>Update</code> / <code>Output</code></td>
                <td className="border border-border px-3 py-2">R</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">팀</td>
                <td className="border border-border px-3 py-2"><code>TeamCreate</code>, <code>TeamDelete</code></td>
                <td className="border border-border px-3 py-2">W</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">크론</td>
                <td className="border border-border px-3 py-2"><code>CronCreate</code>, <code>CronDelete</code>, <code>CronList</code></td>
                <td className="border border-border px-3 py-2">W</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">통합</td>
                <td className="border border-border px-3 py-2"><code>Agent</code>, <code>ToolSearch</code>, <code>Skill</code>, <code>WebFetch</code>, <code>WebSearch</code></td>
                <td className="border border-border px-3 py-2">varies</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">MCP</td>
                <td className="border border-border px-3 py-2"><code>MCP</code>, <code>ListMcpResources</code>, <code>ReadMcpResource</code>, <code>McpAuth</code></td>
                <td className="border border-border px-3 py-2">varies</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">LSP</td>
                <td className="border border-border px-3 py-2"><code>LSP</code> (symbols, references, diagnostics, definition, hover)</td>
                <td className="border border-border px-3 py-2">R</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-medium">기타</td>
                <td className="border border-border px-3 py-2"><code>NotebookEdit</code>, <code>Brief</code>, <code>StructuredOutput</code>, <code>TodoWrite</code></td>
                <td className="border border-border px-3 py-2">varies</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>패턴</strong>: 검색·읽기 계열은 ReadOnly, 파일 변경·리소스 생성 계열은 WorkspaceWrite,
          임의 코드 실행(bash, PowerShell)은 DangerFullAccess.
          권한 단계가 높을수록 사용자 확인 빈도 증가.
        </p>

        {/* ───────── 3. GlobalToolRegistry 3계층 ───────── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">3. GlobalToolRegistry — 3계층 합성</h3>
      </div>
      <GlobalRegistry3LayerViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          최종 도구 목록 = <strong>빌트인</strong>(<code>mvp_tool_specs()</code> 40개)
          + <strong>플러그인</strong>(<code>plugin_tools</code>)
          + <strong>런타임</strong>(<code>runtime_tools</code>).<br />
          등록 시 이름 충돌 검사가 발생한다 —
          플러그인 도구 이름이 빌트인과 동일하면 <code>Err("duplicate tool name")</code> 반환.
          플러그인끼리 이름이 겹쳐도 동일하게 거부.
          이 검사가 없으면 LLM이 같은 이름의 도구 두 개를 보고 어느 쪽을 호출할지 결정할 수 없다.
        </p>
        <p>
          <strong>설계 판단</strong>: 런타임 도구(MCP)는 프로세스 시작 후에도 추가·제거 가능하지만,
          플러그인은 <code>settings.json</code> 파싱 시점에 고정.
          "플러그인 = 정적 확장, MCP = 동적 확장" 이중 레이어 구조.
        </p>

        {/* ───────── 4. execute_tool() 디스패치 ───────── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">4. execute_tool() — 디스패치 흐름</h3>
        <p>
          LLM 응답에 <code>tool_use</code> 블록이 포함되면 메인 루프가 <code>execute_tool(name, input)</code>을 호출한다.
          내부는 단일 <code>match</code> 문으로 40개 분기를 처리.
        </p>
      </div>
      <DispatchMatchViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          각 분기의 입력은 <code>serde_json::from_value::&lt;T&gt;(input)</code>으로 역직렬화된다.<br />
          <code>BashCommandInput</code>에는 <code>command</code>(필수), <code>timeout</code>(옵션, 밀리초),
          <code>description</code>(옵션, 사용자 표시용) 필드가 존재한다.
          <code>TextFilePayload</code>에는 <code>path</code>(절대 경로), <code>offset</code>(시작 줄),
          <code>limit</code>(읽을 줄 수) — offset/limit이 대용량 파일 부분 읽기를 가능하게 한다.
        </p>
        <p>
          <strong>unknown tool</strong> 분기: LLM이 존재하지 않는 도구를 호출하면 에러 메시지를 반환하되,
          세션을 종료하지 않고 LLM에게 재시도 기회를 준다.
          이는 LLM 환각(hallucination)에 대한 방어 — 잘못된 도구 이름을 한 번 호출해도 대화가 계속된다.
        </p>

        {/* ───────── 5. 전역 레지스트리 패턴 ───────── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">5. 전역 레지스트리 — OnceLock 싱글턴</h3>
      </div>
      <OnceLockRegistriesViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          6개 전역 레지스트리가 동일한 패턴을 따른다:
          <strong>LSP</strong>(언어 서버), <strong>MCP</strong>(모델 컨텍스트 프로토콜),
          <strong>Team</strong>(에이전트 팀), <strong>Cron</strong>(스케줄러),
          <strong>Task</strong>(하위 태스크), <strong>Worker</strong>(병렬 실행).<br />
          <code>OnceLock</code>은 <code>std::sync</code> 제공 — <code>lazy_static!</code> 매크로 없이 표준 라이브러리만으로
          스레드 안전 싱글턴을 구현한다.
          첫 <code>get_or_init()</code> 호출에서만 초기화가 실행되고, 이후 모든 호출은 동일한
          <code>&amp;'static T</code> 참조를 반환하므로 락 경합이 없다.
        </p>
        <p>
          <strong>세션 수명과 레지스트리 수명이 동일</strong>하다는 점이 핵심.
          태스크 레지스트리에 생성된 하위 태스크 상태, MCP 서버 연결 핸들, LSP 클라이언트 인스턴스 등
          모든 상태가 프로세스 종료 시 자연스럽게 해제된다.
          별도 cleanup 로직이 불필요 — "프로세스 = 세션" 모델의 장점.
        </p>

        {/* ───────── 6. 권한 게이팅 ───────── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">6. 권한 게이팅 — PermissionEnforcer</h3>
        <p>
          <code>execute_tool()</code> 진입 직후, 디스패치 전에 <code>PermissionEnforcer</code>가 개입한다.
        </p>
      </div>
      <PermissionResultViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          3단계 결과: <strong>Allow</strong>(즉시 실행), <strong>Deny</strong>(에러 반환),
          <strong>Prompt</strong>(사용자 Y/N 입력 대기).<br />
          ReadOnly 모드에서 <code>write_file</code>을 호출하면 LLM에게 "권한 부족" 에러가 돌아가고,
          LLM은 이를 보고 사용자에게 권한 변경을 제안하거나 다른 접근법을 시도한다.
        </p>
        <p>
          DangerFullAccess 도구(bash, PowerShell)는 기본 모드에서 항상 Prompt를 트리거한다.
          사용자가 <code>--dangerously-skip-permissions</code> 플래그를 사용하면 AllowAll로 전환되어
          모든 Prompt가 Allow로 바뀐다 — CI/CD 자동화 환경에서 사용.
        </p>

        {/* ───────── 7. 인사이트 ───────── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">7. 설계 인사이트</h3>
        <p>
          원본 Claude Code(TypeScript)는 921개 도구 관련 모듈이 존재하지만,
          Claw Code(Rust)는 <strong>40개 핵심 도구</strong>에 집중한다.<br />
          나머지 기능은 MCP 서버(외부 프로세스) 또는 플러그인(<code>settings.json</code>)으로 확장 가능한 구조.
        </p>
        <p>
          <strong>"도구는 많되 코어는 작게"</strong> — 이것이 claw-code 도구 시스템의 핵심 원칙이다.<br />
          빌트인 40개는 LLM 코딩 에이전트의 <em>최소 필수 집합</em>이고,
          GlobalToolRegistry의 3계층 구조가 무한 확장을 보장한다.
          도구를 추가할 때 <code>ToolSpec</code>을 정의하고 <code>execute_tool()</code>에 분기를 추가하면 끝 —
          프레임워크 수준의 보일러플레이트가 없다.
        </p>
        <p>
          비교: LangChain은 도구를 클래스로 정의하고 데코레이터로 감싸야 하지만,
          claw-code는 구조체 + match 분기만으로 완결된다.
          Rust의 타입 시스템이 JSON Schema 역직렬화 시점에 타입 안전성을 강제하므로
          별도 validation 레이어가 불필요하다.
        </p>

      </div>
    </section>
  );
}
