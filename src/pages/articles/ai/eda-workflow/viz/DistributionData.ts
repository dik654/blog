import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '원본 타겟 분포 — 오른쪽 꼬리가 긴 형태',
    body: 'skewness = 1.8 → 강한 양의 치우침\n대부분 0~10분이지만 가끔 60분+ 극단값이 존재',
  },
  {
    label: '로그 변환 적용 — log1p(y)로 치우침 완화',
    body: 'log1p = log(1+y)로 0값도 안전하게 처리\nskewness 1.8 → 0.3으로 감소, RMSE 최적화에 유리',
  },
  {
    label: '이상치 탐지 — IQR 방법',
    body: 'Q1 - 1.5×IQR 미만 또는 Q3 + 1.5×IQR 초과 = 이상치\n제거 vs 클리핑 vs 유지 — 도메인 지식으로 판단',
  },
  {
    label: '수치형 피처 분포 유형 분류',
    body: '정규형: 표준화(StandardScaler) 적합\n치우침형: 로그/Box-Cox 후 표준화\n이봉형: 두 그룹 존재 → 이진 피처 파생 후보',
  },
];

export const COLORS = {
  original: '#ef4444',
  transformed: '#10b981',
  outlier: '#f59e0b',
  iqr: '#3b82f6',
  bimodal: '#8b5cf6',
};
