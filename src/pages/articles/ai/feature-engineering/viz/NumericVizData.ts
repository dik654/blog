import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  standard: '#6366f1',
  minmax: '#10b981',
  robust: '#f59e0b',
  log: '#ec4899',
  bin: '#3b82f6',
};

export const STEPS: StepDef[] = [
  {
    label: 'StandardScaler: 평균 0, 표준편차 1',
    body: 'z = (x - μ) / σ. 정규분포 가정. 이상치에 민감하지만 가장 범용적.',
  },
  {
    label: 'MinMaxScaler: 0~1 범위 압축',
    body: 'x\' = (x - min) / (max - min). 신경망 입력에 적합. 이상치가 있으면 대부분 값이 한쪽에 몰림.',
  },
  {
    label: 'RobustScaler: 중앙값 & IQR 기반',
    body: 'x\' = (x - median) / IQR. 이상치에 강건. 이상치가 많은 금융·센서 데이터에서 선택.',
  },
  {
    label: 'Log 변환: 치우친 분포 교정',
    body: 'log(1+x)로 오른쪽 꼬리가 긴 분포를 대칭에 가깝게 변환. 소득·가격·조회수 등.',
  },
  {
    label: '구간화(Binning): 연속 → 범주',
    body: '나이 → 10대/20대/30대. 수치 노이즈를 줄이고 비선형 관계를 트리 모델에 더 잘 전달.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
