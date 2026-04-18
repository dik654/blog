import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: '시퀀스를 평탄(flat) 피처로 — GBM에 바로 넣을 수 있는 형태',
    body: 'GBM(LightGBM, XGBoost)은 고정 길이 행 벡터를 입력받는다.\n가변 길이 시퀀스를 통계·패턴 피처로 압축하면 기존 파이프라인에 그대로 결합 가능.',
  },
  {
    label: '기본 통계 집계 — 평균, 표준편차, 최빈값, 카운트',
    body: '시퀀스 내 수치형 필드: mean, std, min, max, median.\n범주형 필드: mode(최빈값), nunique(고유값 수), count.\n"최근 N개"로 윈도우를 제한하면 최신 추세를 더 잘 반영.',
  },
  {
    label: '최근 N개 윈도우 통계 — 시간 감쇠 반영',
    body: '전체 시퀀스 평균 vs 최근 5개 평균 → 추세 변화를 포착.\n"최근 3개 패스의 x 좌표 평균"이 "전체 평균"보다 다음 패스 예측에 더 유효.\n지수 가중 이동 평균(EWMA)으로 최신에 가중치를 더 줄 수도 있다.',
  },
  {
    label: 'n-gram 패턴 피처 — 이벤트 연속 조합의 빈도',
    body: 'bigram: (패스→패스), (패스→드리블), (드리블→슛) 등 연속 2개 조합.\ntrigram: 3개 조합. 각 조합의 발생 횟수·비율을 피처로 만든다.\n"드리블→슛" 빈도가 높은 선수는 돌파형, "패스→패스" 빈도가 높으면 빌드업형.',
  },
  {
    label: '전환 확률 행렬 — 이벤트 간 조건부 확률',
    body: 'P(슛|드리블) = 드리블 다음에 슛이 나올 확률.\n전환 확률 행렬의 각 셀이 하나의 피처 → NxN개 피처 생성.\n대각선이 높으면 "반복 패턴", 비대각선이 높으면 "전환이 잦은 패턴".',
  },
  {
    label: '통합 파이프라인 — 집계 피처를 기존 테이블에 조인',
    body: '① 시퀀스별 집계 피처 생성 (통계 + n-gram + 전환확률)\n② 원본 단일-행 피처와 LEFT JOIN\n③ GBM에 입력 → 시퀀스 정보가 flat feature로 활용됨.',
  },
];

export const COLORS = {
  stat: '#3b82f6',
  window: '#10b981',
  ngram: '#f59e0b',
  transition: '#8b5cf6',
  pipeline: '#6366f1',
  accent: '#ef4444',
};
