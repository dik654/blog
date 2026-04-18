import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  cross: '#6366f1',
  ratio: '#10b981',
  diff: '#f59e0b',
  domain: '#ec4899',
  warn: '#ef4444',
};

export const STEPS: StepDef[] = [
  {
    label: '곱셈 교차(A × B): 두 피처의 결합 효과',
    body: '면적 = 가로 × 세로. 두 변수의 시너지 효과를 하나의 피처로 포착.',
  },
  {
    label: '비율(A / B): 상대적 크기',
    body: '부채비율 = 부채 / 자산. 절대값보다 비율이 더 강한 예측력을 가지는 경우가 많음.',
  },
  {
    label: '차이(A - B): 변화량 포착',
    body: '가격변동 = 현재가 - 이전가. 트렌드나 변화 방향을 직접적으로 표현.',
  },
  {
    label: '도메인 기반 인터랙션',
    body: 'BMI = 체중/신장². 도메인 지식이 있으면 의미 있는 조합을 직접 설계할 수 있다.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
