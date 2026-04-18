import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '1단계: 데이터 구조 파악 — shape, dtypes, head()',
    body: '행/열 수, 피처 타입(수치·범주·날짜), 메모리 사용량 확인\n"90개 피처 × 300,000행" 같은 전체 규모를 먼저 잡는다',
  },
  {
    label: '2단계: 타겟 변수 분석 — 예측 대상의 분포와 특성',
    body: '회귀: 히스토그램으로 치우침(skewness) 확인, 로그 변환 필요성 판단\n분류: 클래스 비율 확인, 불균형 여부 진단',
  },
  {
    label: '3단계: 피처 분포 확인 — 각 변수의 형태 파악',
    body: '수치형: 히스토그램 + boxplot으로 이상치·분포 형태 확인\n범주형: value_counts()로 카디널리티와 빈도 분포 확인',
  },
  {
    label: '4단계: 관계 탐색 — 피처 간, 피처-타겟 간 상관',
    body: '상관 행렬(heatmap)로 강한 상관 피처 쌍 식별\n산점도·boxplot으로 타겟과의 관계 시각화',
  },
  {
    label: '5단계: 결측·이상치 진단 — 데이터 품질 점검',
    body: '결측 비율 > 50% 피처 → 제거 후보\n결측 패턴(MCAR/MAR/MNAR) 식별 → 대체 전략 결정',
  },
  {
    label: '6단계: 가설 수립 → 피처 아이디어 도출',
    body: '발견한 패턴에서 "왜?"를 묻고, 파생 피처 아이디어로 연결\n예: "주문량과 지연 상관 높음" → 주문량 래그·롤링 평균 피처 생성',
  },
];

export const COLORS = {
  structure: '#6366f1',
  target: '#ef4444',
  feature: '#3b82f6',
  relation: '#10b981',
  quality: '#f59e0b',
  hypothesis: '#8b5cf6',
};
