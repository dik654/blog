import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';
const steps: StepDef[] = [
  { label: 'Host · Client · Server 3계층 + 통신 흐름', body: 'Host (LLM Application): Claude Desktop, Zed, Cursor — LLM 실행, 사용자 상호작용\nClient (Protocol Manager): Host 내부, MCP 프로토콜 처리, 1:1 Server 연결\nServer (Tool Provider): 독립 프로세스, tools/resources/prompts 제공, 격리(보안)\n\nTopology: Host ├── Client 1 ↔ Server 1 (filesystem)\n              ├── Client 2 ↔ Server 2 (database)\n              └── Client 3 ↔ Server 3 (github)\n\n통신 흐름: User → Host → LLM decides tool → Client sends MCP → Server executes → 반환\n보안: Server = 별도 프로세스 (격리), 명시적 permissions, user consent\nLifecycle: Host starts → reads configs → launches Servers → discovers capabilities → ready' },
];
const visuals = [
  { title: 'Host · Client · Server', color: '#10b981', rows: [
    { label: 'Host', value: 'LLM 앱 (Claude Desktop, Cursor)' },
    { label: 'Client', value: 'Host 내부, 프로토콜 관리, 1:1' },
    { label: 'Server', value: '독립 프로세스, tools 제공, 격리' },
    { label: 'Topology', value: '1 Host ↔ many Clients ↔ many Servers' },
    { label: '보안', value: '프로세스 격리, permissions, consent' },
  ]},
];
export default function ArchitectureDetailViz() { return <SimpleStepViz steps={steps} visuals={visuals} />; }
