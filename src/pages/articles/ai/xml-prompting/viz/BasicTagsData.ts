import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '<instructions> — 할 일 표시',
    body: '지시문과 참조 자료를 서로 다른 영역으로 표시한다.\n태그는 읽기 단서이며 준수나 권한을 보장하지는 않는다.',
  },
  {
    label: '<context> / <document> — 참조 자료 구분',
    body: 'RAG 결과, 문서, API 응답처럼 답을 만들 때 참고할 데이터를 묶는다.\n출처 ID는 별도 속성이나 필드로 보존한다.',
  },
  {
    label: '<examples> — Few-shot 예시',
    body: '<example> 안에 <input>과 <output> 쌍을 배치한다.\n효과는 task와 model에 따라 달라지므로 평가 fixture로 비교한다.',
  },
  {
    label: '<output_format> — 출력 형식 정의',
    body: '필드 이름과 허용 형식을 명시한다.\n실제 parseability는 parser와 validator가 판정한다.',
  },
];

export const TAGS = [
  { tag: 'instructions', color: '#6366f1', desc: '지시사항' },
  { tag: 'context', color: '#10b981', desc: '참조 자료' },
  { tag: 'examples', color: '#f59e0b', desc: 'Few-shot' },
  { tag: 'output_format', color: '#6366f1', desc: '출력 형식' },
];
