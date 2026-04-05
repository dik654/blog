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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// claw-code (클라이언트) ←→ MCP Server (외부 프로세스)
//                    JSON-RPC 2.0 over stdio

// MCP 서버가 제공하는 2가지 주요 기능
1. Tools: 실행 가능한 함수 (DB 쿼리, API 호출 등)
2. Resources: 읽기 가능한 데이터 (파일, URL 등)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">MCP 모듈 3개 구성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// runtime/src/mcp_*.rs
McpLifecycleValidator   // 11단계 상태 머신
  ↓
McpStdioProcess         // stdio JSON-RPC 프로세스 관리
  ↓
McpToolRegistry         // MCP 도구를 claw-code 도구로 브릿지`}</pre>
        <p>
          <strong>계층 구조</strong>: Lifecycle → Process → Registry<br />
          - <strong>Lifecycle</strong>: 서버 연결 상태 추적 (11단계)<br />
          - <strong>Process</strong>: 서브프로세스 관리 + JSON-RPC 통신<br />
          - <strong>Registry</strong>: MCP 도구 → claw-code 도구 어댑터
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MCP 서버 설정 — settings.json</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`{
  "mcp_servers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgres://localhost/mydb"
      }
    },
    "github": {
      "command": "docker",
      "args": ["run", "-i", "mcp/github-server"],
      "env": {
        "GITHUB_TOKEN": "ghp_..."
      }
    },
    "filesystem": {
      "command": "node",
      "args": ["/opt/mcp-servers/fs/index.js"],
      "cwd": "/home/user/project"
    }
  }
}`}</pre>
        <p>
          <strong>각 서버는 command + args + env로 정의</strong><br />
          <code>npx</code>로 npm 패키지 실행, <code>docker</code>로 컨테이너 실행, <code>node</code>로 직접 스크립트 실행 등 다양<br />
          claw-code는 <strong>명시된 서버를 세션 시작 시 모두 spawn</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">JSON-RPC 2.0 메시지 포맷</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 요청 (claw-code → MCP 서버)
{"jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {}}

// 응답 (MCP 서버 → claw-code)
{"jsonrpc": "2.0", "id": 1, "result": {"tools": [...]}}

// 에러 응답
{"jsonrpc": "2.0", "id": 1, "error": {
  "code": -32601, "message": "Method not found"
}}

// 알림 (id 없음, 응답 불필요)
{"jsonrpc": "2.0", "method": "notifications/progress",
 "params": {"progress": 50}}`}</pre>
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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// MCP 서버가 제공한 도구 "query_users"
// → claw-code에서 네임스페이스 포함하여 노출
mcp__postgres__query_users

// LLM은 일반 도구처럼 호출
tool_use {
  name: "mcp__postgres__query_users",
  input: {"where": "active = true"}
}

// claw-code가 매핑:
// name 파싱 → 서버 "postgres" + 도구 "query_users"
// → MCP JSON-RPC 호출 → 결과 받아서 LLM에 전달`}</pre>
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
