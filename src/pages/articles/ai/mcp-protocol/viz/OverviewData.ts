import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'N×M 통합 문제',
    body: 'LLM 3종 × 외부 도구 5종 = 15개 커넥터 필요\n도구가 하나 추가될 때마다 모든 LLM에 별도 통합 코드 작성',
  },
  {
    label: 'USB 비유 — 표준 인터페이스',
    body: 'USB 이전 — 프린터·마우스·키보드 각각 다른 포트\nUSB 이후 — 하나의 규격으로 모든 장치 연결\nMCP = LLM 세계의 USB',
  },
  {
    label: 'N+M으로 축소',
    body: 'MCP가 중간 계층 역할 — 각 LLM은 MCP만 구현, 각 도구도 MCP만 구현\nN×M → N+M으로 통합 비용 급감',
  },
  {
    label: 'MCP = LLM의 표준 프로토콜',
    body: 'Anthropic이 2024년 공개한 오픈 표준\nLLM이 외부 세계(도구·데이터·서비스)와 소통하는 단일 프로토콜',
  },
];

export const LLMS = [
  { label: 'Claude', x: 40 },
  { label: 'GPT', x: 110 },
  { label: 'Gemini', x: 180 },
];

export const TOOLS = [
  { label: 'GitHub', x: 280 },
  { label: 'DB', x: 340 },
  { label: 'Slack', x: 400 },
];
