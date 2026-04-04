import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '<instructions> — 지시사항 격리',
    body: '지시문을 태그로 감싸서 참조 자료·예시와 명확히 분리\nLLM이 "무엇을 해야 하는지"를 정확히 인식',
  },
  {
    label: '<context> / <document> — 참조 자료 구분',
    body: 'RAG(검색 증강 생성) 결과, 문서, API 응답 등을 태그로 감쌈\n지시문과 참조 자료가 섞이면 LLM이 혼동 → 태그로 경계 설정',
  },
  {
    label: '<examples> — Few-shot 예시',
    body: '<example> 안에 <input>과 <output> 쌍을 배치\n0-shot 대비 정확도 상승 — 패턴 학습의 핵심 도구',
  },
  {
    label: '<output_format> — 출력 형식 정의',
    body: '원하는 출력 스키마를 태그 안에 명시\nJSON 필드, Markdown 구조 등 → 파싱 가능한 일관된 출력',
  },
];

export const TAGS = [
  { tag: 'instructions', color: '#6366f1', desc: '지시사항' },
  { tag: 'context', color: '#10b981', desc: '참조 자료' },
  { tag: 'examples', color: '#f59e0b', desc: 'Few-shot' },
  { tag: 'output_format', color: '#6366f1', desc: '출력 형식' },
];
