import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '자연어 프롬프트의 문제',
    body: '긴 평문에서 지시, 자료, 사용자 입력이 이어지면 각 조각의 역할을 추적하기 어렵다.\n문제는 평문 자체가 아니라 경계와 출력 계약이 암묵적이라는 점이다.',
  },
  {
    label: 'XML 태그로 구조화',
    body: '<instructions>, <context>, <output_format>으로 역할을 표시한다.\n모델에는 읽기 단서가 되고 사람에게는 검토 가능한 구조가 된다.',
  },
  {
    label: '형식은 소비자에 맞춰 선택',
    body: 'Markdown은 짧은 문서 구획, XML은 긴 자연어의 명시적 경계, JSON Schema는 타입이 있는 출력에 유리하다.\n세 형식 모두 계층을 표현할 수 있다.',
  },
  {
    label: '구조 단서와 실행 권한 분리',
    body: '작성자는 역할을 표시하고 모델은 출력을 생성하며 parser가 문법을 판정한다.\n태그는 authorization, schema 준수, 정답을 보장하지 않는다.',
  },
];

export const FORMATS = [
  { label: 'Markdown', color: '#f59e0b', fit: '짧은 문서 구획' },
  { label: 'XML', color: '#6366f1', fit: '긴 자연어 경계' },
  { label: 'JSON Schema', color: '#10b981', fit: '타입이 있는 출력' },
];
