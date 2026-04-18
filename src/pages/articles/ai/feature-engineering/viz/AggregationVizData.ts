import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  group: '#6366f1',
  agg: '#10b981',
  window: '#f59e0b',
  multi: '#ec4899',
  stat: '#3b82f6',
};

export const STEPS: StepDef[] = [
  {
    label: 'GroupBy 기본: 그룹별 통계량',
    body: '사용자별 평균 구매액, 카테고리별 주문 수. 개별 행에 그룹 수준의 정보를 부여.',
  },
  {
    label: '다중 집계: mean, std, count, min, max',
    body: '하나의 GroupBy에 여러 집계 함수를 적용. 그룹의 중심·퍼짐·크기를 동시에 포착.',
  },
  {
    label: 'Window 함수: 시간 순서 집계',
    body: '최근 7일 이동평균, 누적합. 시계열 맥락을 행 단위 피처로 변환.',
  },
  {
    label: '다단계 집계: 그룹의 그룹',
    body: '사용자 → 카테고리 → 통계. 계층적 구조에서 세분화된 패턴 추출.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
