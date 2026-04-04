import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '자연어 프롬프트의 문제',
    body: '구조 없는 평문 지시 → LLM이 역할·입력·규칙 경계를 추측해야 함\n같은 프롬프트도 실행마다 다른 형식, 다른 범위의 출력',
  },
  {
    label: 'XML 태그로 구조화',
    body: '<instructions>, <context>, <output_format> 등으로 영역 구분\n역할·입력·출력·규칙이 태그로 명확히 분리 → 안정적이고 파싱 가능한 출력',
  },
  {
    label: '왜 XML인가?',
    body: 'JSON — 따옴표·이스케이프 문제로 자연어 혼용 어려움\nMarkdown — 계층 표현이 약하고 중첩 불가\nXML — 중첩 가능 + 사람이 읽기 쉬움 + LLM 학습 데이터에 풍부',
  },
  {
    label: 'LLM의 XML 태그 인식',
    body: 'Anthropic 공식 권장 — Claude가 XML 태그에 특히 잘 반응\nGPT·Gemini도 XML 구조를 정확히 파싱\n프롬프트의 구조적 단서(structural cue)로 작동',
  },
];

export const FORMATS = [
  { label: '평문', color: '#f59e0b', quality: 0.3 },
  { label: 'Markdown', color: '#f59e0b', quality: 0.55 },
  { label: 'JSON', color: '#10b981', quality: 0.65 },
  { label: 'XML', color: '#6366f1', quality: 0.9 },
];
