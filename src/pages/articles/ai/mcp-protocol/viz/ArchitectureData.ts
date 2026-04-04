import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Host — 사용자와 LLM이 만나는 지점',
    body: 'Claude Desktop, VS Code, IDE 플러그인 등\nLLM과 대화하는 앱 자체 — 여러 MCP Client를 관리',
  },
  {
    label: 'Client — 프로토콜 관리자',
    body: 'Host 내부에서 Server와 1:1 연결을 유지하는 모듈\nJSON-RPC 메시지를 주고받고, capability 협상(negotiation) 수행',
  },
  {
    label: 'Server — 도구·데이터 제공자',
    body: '외부 서비스를 MCP 인터페이스로 감싸는 독립 프로세스\nDB 서버, 파일시스템, GitHub API, Slack 등 — 각각 별도 Server',
  },
  {
    label: '1:N 관계 — 하나의 Host, 여러 Server',
    body: 'Host → Client A → GitHub Server\nHost → Client B → DB Server\nHost → Client C → Slack Server\n각 Server는 격리된 프로세스 — 보안 경계(security boundary) 분리',
  },
];

export const NODES = [
  { id: 'host', label: 'Host', sub: 'Claude Desktop', color: '#6366f1', x: 60, y: 95 },
  { id: 'client', label: 'Client', sub: '프로토콜 관리', color: '#10b981', x: 200, y: 95 },
  { id: 'srv1', label: 'Server A', sub: 'GitHub', color: '#f59e0b', x: 340, y: 40 },
  { id: 'srv2', label: 'Server B', sub: 'DB', color: '#f59e0b', x: 340, y: 95 },
  { id: 'srv3', label: 'Server C', sub: 'Slack', color: '#f59e0b', x: 340, y: 150 },
];
