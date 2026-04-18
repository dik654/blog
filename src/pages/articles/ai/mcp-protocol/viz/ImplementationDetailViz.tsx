import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'MCP Server 구현 — TypeScript/Python SDK', body: '1. Server 생성: new Server({name, version}, {capabilities: {tools, resources}})\n2. Tool handler 등록: setRequestHandler(ListToolsRequestSchema, ...)\n→ name + description + inputSchema (JSON Schema)\n3. Tool 호출 처리: CallToolRequestSchema → arguments 추출 → 실행 → content 반환\n4. Resource 등록: uri + name + mimeType\n5. Transport 시작: new StdioServerTransport() → server.connect(transport)\n\nPython SDK: @server.list_tools() + @server.call_tool() 데코레이터 방식\n\nClaude Desktop 설치: claude_desktop_config.json에 mcpServers 추가\n{command: "node", args: ["path/to/server.js"]}\n\nTesting: @modelcontextprotocol/inspector (GUI), CLI tools, unit tests\nBest: input 검증, typed content, 에러 핸들링, logging, versioning' },
];
const visuals = [
  { title: 'MCP Server 구현 단계', color: '#6366f1', rows: [
    { label: '1. Create', value: 'new Server({name, version, capabilities})' },
    { label: '2. List Tools', value: 'name + description + inputSchema' },
    { label: '3. Call Tool', value: 'arguments 추출 → 실행 → 반환' },
    { label: '4. Resources', value: 'uri + name + mimeType 등록' },
    { label: '5. Transport', value: 'StdioServerTransport → connect' },
    { label: 'Install', value: 'claude_desktop_config.json 등록' },
  ]},
];
export default function ImplementationDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
