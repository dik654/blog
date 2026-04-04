import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '3가지 프리미티브(primitive)',
    body: 'MCP Server가 노출하는 3종류의 기능 단위\nTools — LLM이 호출하는 함수\nResources — LLM이 읽는 데이터\nPrompts — 재사용 가능한 프롬프트 템플릿',
  },
  {
    label: 'Tools — LLM이 호출하는 함수',
    body: '계산기, DB 쿼리, API 호출 등 "행동"\nLLM이 필요할 때 선택적으로 호출 → 결과를 컨텍스트에 추가\n각 Tool은 이름 + 설명 + JSON Schema 파라미터로 정의',
  },
  {
    label: 'Resources — LLM이 읽는 데이터',
    body: '파일 내용, DB 레코드, API 응답 등 "정보"\nURI로 식별 — file:///logs/app.log, db://users/123\nMIME 타입 명시로 구조 파악 가능',
  },
  {
    label: 'Prompts — 재사용 프롬프트 템플릿',
    body: '자주 쓰는 지시문을 Server가 미리 정의\n사용자가 선택하면 LLM 컨텍스트에 삽입\n예: "코드 리뷰 해줘" → 리뷰 가이드라인 포함 프롬프트 자동 생성',
  },
];

export const PRIMITIVES = [
  { label: 'Tools', icon: '⚡', desc: '함수 호출', color: '#6366f1', y: 30 },
  { label: 'Resources', icon: '📄', desc: '데이터 읽기', color: '#10b981', y: 90 },
  { label: 'Prompts', icon: '💬', desc: '템플릿', color: '#f59e0b', y: 150 },
];

/** Concrete JSON examples shown when each primitive is active */
export const PRIM_EXAMPLES: Record<number, string[]> = {
  1: [
    '{"name":"query_db","inputSchema":',
    '  {"type":"object","properties":',
    '    {"sql":{"type":"string"}}}}',
  ],
  2: [
    'URI: file:///var/log/app.log',
    'MIME: text/plain',
    '→ LLM이 파일 내용을 직접 읽음',
  ],
  3: [
    '{"name":"code-review",',
    '  "arguments":[{"name":"lang","required":true}],',
    '  "messages":[{role:"user",content:"리뷰..."}]}',
  ],
};
