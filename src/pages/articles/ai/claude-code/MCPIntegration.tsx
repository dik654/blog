export default function MCPIntegration() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">MCP (Model Context Protocol)</h3>
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 p-5 mb-4">
        <h4 className="text-sm font-bold mb-3">MCP 서버 통합</h4>
        <p className="text-sm mb-3">MCP = 표준화된 도구/리소스 프로토콜. Claude Code가 JSON-RPC를 통해 외부 서비스(DB, API 등)와 상호작용할 수 있게 한다.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">통신 구조</span>
            <p className="text-sm mt-1">Claude Code ←→ MCP Server ←→ 외부 서비스</p>
            <p className="text-xs text-muted-foreground mt-1">JSON-RPC 기반 통신</p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">MCP 서버 예시</span>
            <ul className="text-sm mt-1 space-y-0.5">
              <li>GitHub MCP — PR/이슈 관리</li>
              <li>PostgreSQL MCP — 데이터베이스 쿼리</li>
              <li>Filesystem MCP — 파일 시스템 접근</li>
              <li>Brave Search MCP — 웹 검색</li>
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">settings.json 설정</span>
          <pre className="text-xs mt-2 overflow-x-auto">{`{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "..." }
    }
  }
}`}</pre>
          <p className="text-xs text-muted-foreground mt-2">MCP 서버의 도구가 Claude Code 도구로 등록 → 에이전트가 자연스럽게 외부 서비스와 상호작용</p>
        </div>
      </div>
    </>
  );
}
