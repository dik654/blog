import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '패턴 발견 → 가설 수립: "왜?"를 묻는다',
    body: 'EDA에서 발견한 상관, 분포, 패턴에 대해 인과적 가설을 세운다\n"주문량이 높을 때 지연이 길다" → "로봇이 포화되기 때문인가?"',
  },
  {
    label: '시각화 검증 — 가설을 그래프로 확인',
    body: '가설: "로봇 < 5대일 때 지연 급증" → boxplot으로 로봇 수 구간별 지연 비교\n가설이 맞으면 → 피처 아이디어로 연결',
  },
  {
    label: '피처 아이디어 도출 — EDA의 최종 산출물',
    body: '검증된 가설마다 파생 피처를 설계:\n구간화(binning), 인터랙션(곱), 래그(시차), 비율(A/B) 등',
  },
  {
    label: 'EDA 체크리스트 — 빠뜨린 것이 없는지 확인',
    body: '✓ 타겟 분포 확인, ✓ 피처별 분포, ✓ 상관 행렬\n✓ 결측 패턴, ✓ 이상치, ✓ 범주형 카디널리티\n✓ 시간 패턴(시계열), ✓ 가설 최소 3개, ✓ 피처 아이디어 목록',
  },
];

export const COLORS = {
  finding: '#3b82f6',
  hypothesis: '#f59e0b',
  feature: '#10b981',
  check: '#8b5cf6',
};
