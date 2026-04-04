import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '의미 있는 태그 이름',
    body: '태그 이름 자체가 LLM에게 의미적 단서를 제공한다.',
  },
  {
    label: '닫는 태그 필수',
    body: '여는 태그 + 닫는 태그 쌍이 경계 인식의 핵심 단서다.',
  },
  {
    label: '태그 깊이 3단계 이내',
    body: '4단계 이상은 LLM이 구조를 놓칠 확률이 급증한다.',
  },
  {
    label: '전체 프롬프트 템플릿',
    body: 'role → rules → output_format → examples 구조를 템플릿으로 재사용한다.',
  },
];
