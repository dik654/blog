import TransportViz from './viz/TransportViz';

export default function Transport() {
  return (
    <section id="transport" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">전송 계층: stdio · SSE · Streamable HTTP</h2>
      <div className="not-prose mb-8"><TransportViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MCP는 JSON-RPC 2.0 기반 — 전송 방식만 바꾸면 로컬↔원격 모두 대응<br />
          stdio(로컬), HTTP SSE(원격 스트리밍), Streamable HTTP(클라우드 최적화) 3가지 선택지
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Transport Options</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MCP Transport Layers:

// Protocol: JSON-RPC 2.0
// - standard RPC protocol
// - request/response + notifications
// - batching support
// - error codes

// 1. stdio (Standard Input/Output):
// - local process
// - parent launches child
// - communicate via stdin/stdout
// - simplest, fastest
// - no network overhead
//
// Use cases:
// - local tools on user's machine
// - filesystem access
// - git operations
// - shell commands
//
// Example:
// Host spawns Server process
// stdin ← Host sends requests
// stdout → Server sends responses
// stderr → logging

// 2. HTTP + SSE (Server-Sent Events):
// - remote server
// - HTTP POST for requests
// - SSE for server push
// - one-way streaming
//
// Use cases:
// - cloud services
// - shared tools
// - multi-user environments
// - remote APIs
//
// Flow:
// 1. Client: POST /message (request)
// 2. Server: SSE stream (response)
// 3. Long-lived connection
// 4. Heartbeat keep-alive

// 3. Streamable HTTP (2024+):
// - newer transport
// - bidirectional streaming
// - better for cloud
// - replaces SSE for new deployments
//
// Advantages:
// - single HTTP connection
// - full duplex
// - better error handling
// - simpler clients

// Comparison:
// | Transport        | Speed | Complexity | Use Case    |
// | stdio            | fast  | simple     | local       |
// | HTTP SSE         | slow  | medium     | cloud (old) |
// | Streamable HTTP  | fast  | medium     | cloud (new) |

// Authentication:
// - stdio: process-level (OS)
// - HTTP: OAuth, API keys, bearer tokens
// - TLS for encryption
// - mTLS for cross-service

// Security considerations:
// - stdio: trust boundary = process
// - HTTP: network-level security
// - authentication required
// - authorization per tool

// Deployment patterns:
// - local only (stdio)
// - self-hosted (HTTP)
// - SaaS MCP servers
// - enterprise gateways

// Error handling:
// - JSON-RPC error codes
// - transport-specific errors
// - retry with backoff
// - circuit breakers

// Performance:
// - stdio: <1ms latency
// - HTTP local: 1-5ms
// - HTTP remote: 10-100ms
// - streaming: similar to HTTP

// Standards:
// - JSON-RPC 2.0 specification
// - MCP protocol specification
// - OpenAPI for discovery (future)
// - rate limiting headers`}
        </pre>
        <p className="leading-7">
          Transport: <strong>stdio (local) + HTTP SSE + Streamable HTTP (cloud)</strong>.<br />
          JSON-RPC 2.0 기반, 전송 방식 교체 가능.<br />
          local: stdio, cloud: Streamable HTTP (2024 신규).
        </p>
      </div>
    </section>
  );
}
