import McpArchViz from './viz/McpArchViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MCP 모듈 전체 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <McpArchViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">MCP란 무엇인가</h3>
        <p>
          MCP(Model Context Protocol)는 <strong>LLM 에이전트와 외부 도구/리소스 간 표준 프로토콜</strong><br />
          Anthropic이 2024년 말 공개 — 에이전트 생태계 표준화 시도<br />
          claw-code는 MCP 클라이언트 역할 — 외부 MCP 서버를 호출하여 도구/리소스 이용
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-1">통신 구조</p>
            <p className="text-sm">claw-code (클라이언트) ←→ MCP Server (외부 프로세스)<br />JSON-RPC 2.0 over stdio</p>
          </div>
          <div className="space-y-2">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3">
              <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300">Tools</p>
              <p className="text-sm">실행 가능한 함수 (DB 쿼리, API 호출 등)</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
              <p className="font-semibold text-sm text-purple-700 dark:text-purple-300">Resources</p>
              <p className="text-sm">읽기 가능한 데이터 (파일, URL 등)</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">MCP 모듈 3개 구성</h3>
        <div className="space-y-2 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-3">
            <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">1</span>
            <div>
              <p className="font-semibold text-sm"><code>McpLifecycleValidator</code></p>
              <p className="text-sm text-muted-foreground">11단계 상태 머신</p>
            </div>
          </div>
          <div className="text-center text-muted-foreground text-lg">↓</div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 flex items-center gap-3">
            <span className="text-xs font-mono bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded">2</span>
            <div>
              <p className="font-semibold text-sm"><code>McpStdioProcess</code></p>
              <p className="text-sm text-muted-foreground">stdio JSON-RPC 프로세스 관리</p>
            </div>
          </div>
          <div className="text-center text-muted-foreground text-lg">↓</div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-3 flex items-center gap-3">
            <span className="text-xs font-mono bg-purple-100 dark:bg-purple-900 px-2 py-0.5 rounded">3</span>
            <div>
              <p className="font-semibold text-sm"><code>McpToolRegistry</code></p>
              <p className="text-sm text-muted-foreground">MCP 도구를 claw-code 도구로 브릿지</p>
            </div>
          </div>
        </div>
        <p>
          <strong>계층 구조</strong>: Lifecycle → Process → Registry<br />
          - <strong>Lifecycle</strong>: 서버 연결 상태 추적 (11단계)<br />
          - <strong>Process</strong>: 서브프로세스 관리 + JSON-RPC 통신<br />
          - <strong>Registry</strong>: MCP 도구 → claw-code 도구 어댑터
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MCP 서버 설정 — settings.json</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-2">postgres</p>
            <p className="text-sm"><code>command</code>: <code>npx</code></p>
            <p className="text-sm"><code>args</code>: <code>-y @modelcontextprotocol/server-postgres</code></p>
            <p className="text-sm"><code>env</code>: <code>DATABASE_URL</code></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300 mb-2">github</p>
            <p className="text-sm"><code>command</code>: <code>docker</code></p>
            <p className="text-sm"><code>args</code>: <code>run -i mcp/github-server</code></p>
            <p className="text-sm"><code>env</code>: <code>GITHUB_TOKEN</code></p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-purple-700 dark:text-purple-300 mb-2">filesystem</p>
            <p className="text-sm"><code>command</code>: <code>node</code></p>
            <p className="text-sm"><code>args</code>: <code>/opt/mcp-servers/fs/index.js</code></p>
            <p className="text-sm"><code>cwd</code>: <code>/home/user/project</code></p>
          </div>
        </div>
        <p>
          <strong>각 서버는 command + args + env로 정의</strong><br />
          <code>npx</code>로 npm 패키지 실행, <code>docker</code>로 컨테이너 실행, <code>node</code>로 직접 스크립트 실행 등 다양<br />
          claw-code는 <strong>명시된 서버를 세션 시작 시 모두 spawn</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">JSON-RPC 2.0 메시지 포맷</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-1">요청 (claw-code → 서버)</p>
            <p className="text-sm font-mono"><code>id</code>: 1, <code>method</code>: <code>"tools/list"</code>, <code>params</code>: {'{}'}</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300 mb-1">응답 (서버 → claw-code)</p>
            <p className="text-sm font-mono"><code>id</code>: 1, <code>result</code>: {'{"tools": [...]}'}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-red-700 dark:text-red-300 mb-1">에러 응답</p>
            <p className="text-sm font-mono"><code>id</code>: 1, <code>error</code>: <code>code</code> -32601, <code>"Method not found"</code></p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-amber-700 dark:text-amber-300 mb-1">알림 (id 없음, 응답 불필요)</p>
            <p className="text-sm font-mono"><code>method</code>: <code>"notifications/progress"</code>, <code>progress</code>: 50</p>
          </div>
        </div>
        <p>
          <strong>4종 메시지</strong>: 요청, 응답, 에러, 알림<br />
          요청과 응답은 <code>id</code>로 매칭 — 병렬 요청 시 응답 구분<br />
          알림(notification): 진행률 업데이트 등 서버 주도 이벤트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 MCP 메서드</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">메서드</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>initialize</code></td>
                <td className="border border-border px-3 py-2">서버 능력 조회, 버전 협상</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>tools/list</code></td>
                <td className="border border-border px-3 py-2">사용 가능한 도구 목록</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>tools/call</code></td>
                <td className="border border-border px-3 py-2">도구 실행 요청</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>resources/list</code></td>
                <td className="border border-border px-3 py-2">리소스 목록</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>resources/read</code></td>
                <td className="border border-border px-3 py-2">리소스 내용 읽기</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>prompts/list</code></td>
                <td className="border border-border px-3 py-2">프롬프트 템플릿 목록</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>sampling/createMessage</code></td>
                <td className="border border-border px-3 py-2">서버가 LLM 호출 요청 (역방향)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">MCP 도구가 claw-code에서 보이는 방식</h3>
        <div className="space-y-3 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-1">MCP 서버 도구 → claw-code 네임스페이스</p>
            <p className="text-sm">원본 도구명 <code>query_users</code> → 등록명 <code>mcp__postgres__query_users</code></p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-emerald-700 dark:text-emerald-300 mb-1">LLM 호출 (일반 도구와 동일)</p>
            <p className="text-sm"><code>name</code>: <code>"mcp__postgres__query_users"</code><br /><code>input</code>: <code>{'{"where": "active = true"}'}</code></p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
            <p className="font-semibold text-sm text-purple-700 dark:text-purple-300 mb-1">claw-code 매핑 과정</p>
            <p className="text-sm">name 파싱 → 서버 <code>"postgres"</code> + 도구 <code>"query_users"</code> → MCP JSON-RPC 호출 → 결과 LLM에 전달</p>
          </div>
        </div>
        <p>
          <strong>네임스페이스 컨벤션</strong>: <code>mcp__{`{server_name}`}__{`{tool_name}`}</code><br />
          두 언더스코어(<code>__</code>) 구분자 — 일반 도구명과 충돌 방지<br />
          LLM 관점에서는 일반 도구와 동일 — MCP는 투명한 확장
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: MCP가 해결하는 문제</p>
          <p>
            LLM 에이전트가 외부 시스템 통합하려면 <strong>N개 에이전트 × M개 통합 = N×M 구현</strong><br />
            MCP 이전: 각 에이전트가 자체 DB 커넥터, API 클라이언트 구현
          </p>
          <p className="mt-2">
            MCP의 가치:<br />
            ✓ <strong>표준화</strong>: 한 번 구현한 MCP 서버가 모든 에이전트에서 작동<br />
            ✓ <strong>격리</strong>: 서버가 별도 프로세스 — 에이전트 코어 보호<br />
            ✓ <strong>언어 무관</strong>: 어떤 언어로도 MCP 서버 작성 가능
          </p>
          <p className="mt-2">
            claw-code가 MCP 지원하는 이유: <strong>기존 생태계 재사용</strong> — 공개 MCP 서버 수십 개 즉시 활용<br />
            단점: stdio 통신 오버헤드 (호출당 ~5ms) — 대화형 에이전트에서는 무시할 수준
          </p>
        </div>

      </div>
    </section>
  );
}
