import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Step 1: 서버 초기화 + capability 선언',
    body: 'McpServer 인스턴스를 생성하고 제공할 capability를 선언한다.',
  },
  {
    label: 'Step 2: 도구 등록',
    body: 'server.tool(name, schema, handler)로 도구 이름, 스키마, 핸들러를 등록한다.',
  },
  {
    label: 'Step 3: 요청 핸들링 흐름',
    body: 'tools/call 요청을 받아 handler를 실행하고 JSON-RPC로 응답한다.',
  },
  {
    label: 'Step 4: 리소스 등록',
    body: 'URI 패턴과 MIME 타입으로 리소스를 등록해 LLM에 데이터를 제공한다.',
  },
];

export const IMPL_BLOCKS = [
  { label: 'McpServer', desc: '초기화', color: '#6366f1', y: 30 },
  { label: '.tool()', desc: '도구 등록', color: '#10b981', y: 70 },
  { label: 'tools/call', desc: '요청 핸들링', color: '#f59e0b', y: 110 },
  { label: '.resource()', desc: '리소스 등록', color: '#6366f1', y: 150 },
];

/** Real JSON-RPC code/message examples for each step */
export const JSON_EXAMPLES: Record<number, string[]> = {
  0: [
    'const server = new McpServer({',
    '  name: "weather-server", version: "1.0.0"',
    '});',
  ],
  1: [
    'server.tool("get_weather",',
    '  { city: z.string() },',
    '  async ({ city }) => ({ text: `${city}: 18°C 맑음` })',
    ');',
  ],
  2: [
    '→ {"jsonrpc":"2.0","method":"tools/call",',
    '   "params":{"name":"get_weather",',
    '     "arguments":{"city":"Seoul"}}}',
    '← {"jsonrpc":"2.0","result":',
    '   {"content":[{"type":"text","text":"Seoul: 18°C 맑음"}]}}',
  ],
  3: [
    'server.resource("logs://app",',
    '  { mimeType: "text/plain" },',
    '  async () => ({ text: readFileSync("/var/log/app.log") })',
    ');',
  ],
};
