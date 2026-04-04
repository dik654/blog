import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '예시 개수에 따른 성능 변화',
    body: '0→1-shot에서 급상승, 3-shot에서 안정, 5-shot 이후 수확 체감',
  },
  {
    label: '좋은 예시 vs 나쁜 예시',
    body: '다양한 카테고리 + 엣지케이스 포함이 핵심, 같은 패턴 반복은 역효과',
  },
  {
    label: '예시 순서의 영향: Recency Bias',
    body: 'LLM은 마지막 예시에 편향 — 가장 대표적인 예시를 끝에 배치',
  },
  {
    label: 'Few-shot 설계 원칙 요약',
    body: '다양성 + 엣지케이스 + 순서 배치 + 최소 충분(3개) 원칙',
  },
];

export const SHOT_BARS = [
  { label: '0-shot', value: 45, color: '#6366f180' },
  { label: '1-shot', value: 65, color: '#f59e0b' },
  { label: '3-shot', value: 85, color: '#10b981' },
  { label: '5-shot', value: 88, color: '#6366f1' },
];
