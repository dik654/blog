import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MCP가 왜 필요한가</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM과 외부 도구를 연결할 때 — 각 조합마다 별도 통합 코드를 작성하면 N×M 폭발<br />
          MCP는 이 문제를 N+M으로 축소하는 표준 프로토콜 — LLM 세계의 USB
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">MCP 등장 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MCP (Model Context Protocol):
// Announced by Anthropic, Nov 2024

// Problem:
// - LLMs need tools/data access
// - each LLM has own API
// - each tool has own interface
// - N LLMs × M tools = N×M integrations
// - combinatorial explosion

// Solution: MCP
// - standardized protocol
// - LLM 쪽 one interface
// - tool 쪽 one interface
// - N + M integrations (not N × M)

// 비유:
// - USB for hardware
// - HTTP for web
// - MCP for LLM tools

// Before MCP:
// - OpenAI function calling
// - Anthropic tool use
// - Google function calling
// - 각자 format 다름
// - tool 개발자 3배 작업

// After MCP:
// - one tool definition
// - works with all MCP-compatible LLMs
// - reduces integration burden
// - ecosystem effect

// MCP adoption (2024):
// - Anthropic Claude
// - Zed editor
// - Cursor
// - Continue.dev
// - growing list

// Core concepts:
// 1. Host: LLM application
// 2. Client: MCP client in host
// 3. Server: MCP server (provides tools)

// Primitives (3 types):
// - Tools: callable functions
// - Resources: readable data
// - Prompts: reusable templates

// Transport:
// - stdio: local process
// - HTTP SSE: remote streaming
// - Streamable HTTP: cloud

// Benefits:
// ✓ portable tools
// ✓ reduced integration cost
// ✓ ecosystem building
// ✓ open standard
// ✓ vendor neutrality

// Challenges:
// - adoption phase (new)
// - limited tool ecosystem
// - security model evolving
// - discovery mechanism`}
        </pre>
        <p className="leading-7">
          MCP = <strong>LLM의 USB standard (Anthropic 2024)</strong>.<br />
          N×M → N+M integration 간소화.<br />
          3 primitives: Tools, Resources, Prompts.
        </p>
      </div>
    </section>
  );
}
