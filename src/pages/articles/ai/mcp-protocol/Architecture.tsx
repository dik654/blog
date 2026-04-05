import ArchitectureViz from './viz/ArchitectureViz';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Host · Client · Server 아키텍처</h2>
      <div className="not-prose mb-8"><ArchitectureViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Host(LLM 앱) → Client(프로토콜 관리) → Server(도구 제공)의 3계층 구조<br />
          하나의 Host가 여러 Server에 연결 — 각 Server는 격리된 프로세스로 보안 경계 분리
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">MCP 3-Layer Architecture</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MCP Architecture:

// Host (LLM Application):
// - Claude Desktop, Zed, Cursor
// - runs the LLM
// - manages user interaction
// - coordinates multiple servers
// - examples: Claude Desktop, Cline

// Client (Protocol Manager):
// - lives inside Host
// - handles MCP protocol
// - 1:1 with each Server
// - manages connections
// - sends requests, receives responses

// Server (Tool Provider):
// - standalone process
// - exposes tools/resources/prompts
// - isolated from Host (security)
// - stateless or stateful
// - can be local or remote

// Topology:
// Host
// ├── Client 1 ←→ Server 1 (filesystem)
// ├── Client 2 ←→ Server 2 (database)
// └── Client 3 ←→ Server 3 (github)

// Communication flow:
// 1. User: "List my git branches"
// 2. Host: LLM processes request
// 3. LLM: decides to call git tool
// 4. Client: sends MCP request to Server
// 5. Server: executes git branch -a
// 6. Server: returns result
// 7. Client: delivers to Host
// 8. Host: LLM integrates into response
// 9. User: sees result

// Security boundaries:
// - Server isolated (separate process)
// - no direct Host access
// - explicit permissions
// - capability-based access
// - user consent required

// Session management:
// - initialize handshake
// - capability negotiation
// - tool discovery
// - ongoing request/response

// State:
// - Server can maintain state
// - per-session typically
// - resources can be dynamic
// - subscription model for updates

// Multi-server benefits:
// - modular capabilities
// - independent development
// - clear permissions
// - failure isolation
// - composability

// Lifecycle:
// 1. Host starts
// 2. Reads server configs
// 3. Launches each Server
// 4. Establishes MCP connection
// 5. Discovers capabilities
// 6. Ready for LLM calls
// 7. On exit: close connections

// Error handling:
// - connection failures
// - timeout on requests
// - tool errors (graceful)
// - schema validation
// - version mismatches`}
        </pre>
        <p className="leading-7">
          Architecture: <strong>Host ↔ Client ↔ Server (3-layer)</strong>.<br />
          Server = 격리된 프로세스 (security boundary).<br />
          1 Host ↔ many Clients ↔ many Servers (modular).
        </p>
      </div>
    </section>
  );
}
