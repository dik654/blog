import CodePanel from '@/components/ui/code-panel';

export default function MCPIntegration() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">MCP (Model Context Protocol)</h3>
      <CodePanel title="MCP 서버 통합" code={`MCP 서버 통합:

MCP = 표준화된 도구/리소스 프로토콜

Claude Code ←→ MCP Server ←→ 외부 서비스
             JSON-RPC          (DB, API 등)

예시 MCP 서버:
  - GitHub MCP: PR/이슈 관리
  - PostgreSQL MCP: 데이터베이스 쿼리
  - Filesystem MCP: 파일 시스템 접근
  - Brave Search MCP: 웹 검색

설정 (.claude/settings.json):
  {
    "mcpServers": {
      "github": {
        "command": "npx",
        "args": ["@modelcontextprotocol/server-github"],
        "env": { "GITHUB_TOKEN": "..." }
      }
    }
  }

→ MCP 서버의 도구가 Claude Code 도구로 등록
→ 에이전트가 자연스럽게 외부 서비스와 상호작용`} annotations={[
        { lines: [5, 6], color: 'sky', note: 'JSON-RPC 통신 구조' },
        { lines: [8, 12], color: 'emerald', note: 'MCP 서버 예시' },
        { lines: [14, 23], color: 'amber', note: 'settings.json 설정 방법' },
      ]} />
    </>
  );
}
