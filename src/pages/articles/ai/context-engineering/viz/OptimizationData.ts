import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '① 토큰 예산 분배',
    body: '200K 윈도우를 시스템·도구·히스토리·출력에 비율 배분.',
  },
  {
    label: '② 우선순위 결정',
    body: '중요도 기반으로 시스템 규칙 > RAG > 오래된 히스토리 순서 배치.',
  },
  {
    label: '③ 압축 전략',
    body: '토큰 한도 접근 시 요약·중복 제거·축약으로 자동 압축.',
  },
  {
    label: '④ 컨텍스트 윈도우 시각화',
    body: '최종 컨텍스트 배치 구조와 "Lost in the Middle" 현상.',
  },
];

export const BUDGET = [
  { label: 'System', pct: 30, color: '#6366f1' },
  { label: 'Tools', pct: 20, color: '#f59e0b' },
  { label: 'History', pct: 30, color: '#6366f1' },
  { label: 'User+Out', pct: 20, color: '#10b981' },
];
