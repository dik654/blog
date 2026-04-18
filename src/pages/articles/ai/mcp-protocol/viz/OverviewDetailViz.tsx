import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'MCP 등장 배경 — N×M → N+M', body: 'Problem: LLMs need tools/data access\n각 LLM × 각 tool = N×M integrations → 조합 폭발\n\nSolution: MCP (Anthropic, Nov 2024)\n표준 프로토콜로 LLM 쪽 one interface, tool 쪽 one interface\n→ N+M integrations\n\n비유: USB for hardware, HTTP for web, MCP for LLM tools\n\nBefore: OpenAI function calling / Anthropic tool use / Google 각자 format\nAfter: one tool definition → all MCP-compatible LLMs\n\nAdoption: Claude Desktop, Zed, Cursor, Continue.dev\nCore: Host(LLM app) + Client(protocol) + Server(tools)\nPrimitives: Tools(callable) + Resources(readable) + Prompts(templates)\nTransport: stdio(local) + HTTP SSE(remote) + Streamable HTTP(cloud)' },
];
const visuals = [
  { title: 'MCP — N×M → N+M', color: '#6366f1', rows: [
    { label: 'Before', value: 'N LLMs × M tools = N×M 통합 (폭발)' },
    { label: 'After', value: 'N+M integrations (표준 프로토콜)' },
    { label: '비유', value: 'USB for hardware → MCP for LLM tools' },
    { label: 'Adoption', value: 'Claude Desktop, Zed, Cursor' },
    { label: 'Primitives', value: 'Tools + Resources + Prompts' },
  ]},
];
export default function OverviewDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
