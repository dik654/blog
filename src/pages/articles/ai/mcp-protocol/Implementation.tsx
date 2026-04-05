import ImplementationViz from './viz/ImplementationViz';

export default function Implementation() {
  return (
    <section id="implementation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MCP 서버 구현 예시</h2>
      <div className="not-prose mb-8"><ImplementationViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          TypeScript SDK 기준 — 서버 초기화 → 도구 등록 → 핸들링 → 리소스 등록 4단계<br />
          각 도구는 이름 + JSON Schema 파라미터 + async 핸들러로 구성 — LLM이 스키마를 읽고 자동 호출
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">MCP Server Implementation</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MCP Server (TypeScript SDK):

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// 1. Create server
const server = new Server({
  name: "my-mcp-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {},
    resources: {}
  }
});

// 2. Register tool handler
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "get_weather",
    description: "Get current weather",
    inputSchema: {
      type: "object",
      properties: {
        location: { type: "string" }
      },
      required: ["location"]
    }
  }]
}));

// 3. Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "get_weather") {
    const { location } = request.params.arguments;
    const weather = await fetchWeather(location);
    return {
      content: [{
        type: "text",
        text: JSON.stringify(weather)
      }]
    };
  }
  throw new Error("Tool not found");
});

// 4. Register resources
server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [{
    uri: "weather://latest",
    name: "Latest Weather",
    mimeType: "application/json"
  }]
}));

// 5. Start transport
const transport = new StdioServerTransport();
await server.connect(transport);

// Python SDK (similar):
// from mcp.server import Server
// from mcp.types import Tool, TextContent
//
// server = Server("my-server")
//
// @server.list_tools()
// async def list_tools() -> list[Tool]:
//     return [Tool(name="get_weather", ...)]
//
// @server.call_tool()
// async def call_tool(name, arguments):
//     if name == "get_weather":
//         return [TextContent(text=...)]

// Installation (Claude Desktop):
// claude_desktop_config.json:
// {
//   "mcpServers": {
//     "weather": {
//       "command": "node",
//       "args": ["path/to/server.js"]
//     }
//   }
// }

// Testing:
// - @modelcontextprotocol/inspector (GUI)
// - MCP CLI tools
// - unit tests with mock client

// Best practices:
// - validate input with JSON Schema
// - return typed content
// - handle errors gracefully
// - log for debugging
// - document each tool
// - version your server

// Publishing:
// - npm/pypi packages
// - MCP server registry (coming)
// - docker images
// - open source community

// Example servers:
// - filesystem
// - git
// - sqlite
// - brave-search
// - fetch
// - memory
// - github
// - slack
// - postgres`}
        </pre>
        <p className="leading-7">
          Implementation: <strong>Server create + handlers (list/call tools, resources) + transport</strong>.<br />
          TypeScript + Python SDKs 공식 지원.<br />
          Claude Desktop에 config로 등록 → 즉시 사용.
        </p>
      </div>
    </section>
  );
}
