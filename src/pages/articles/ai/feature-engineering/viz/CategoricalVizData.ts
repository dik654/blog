import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  label: '#6366f1',
  onehot: '#10b981',
  target: '#f59e0b',
  freq: '#ec4899',
  embed: '#3b82f6',
};

export const STEPS: StepDef[] = [
  {
    label: 'Label Encoding: 순서 부여',
    body: '범주 → 정수 매핑 (서울=0, 부산=1, 대구=2). 순서가 있는 범주(학력, 등급)에 적합.',
  },
  {
    label: 'One-Hot Encoding: 이진 벡터',
    body: '각 범주를 0/1 열로 분리. 범주 수가 적을 때(< 15) 사용. 고차원 폭발 주의.',
  },
  {
    label: 'Target Encoding: 평균 타겟값',
    body: '범주별 타겟 평균으로 치환. 스무딩 필수 — 관측수 적은 범주는 전체 평균에 가중.',
  },
  {
    label: 'Frequency Encoding: 출현 빈도',
    body: '범주를 출현 횟수 또는 비율로 치환. 정보 누수 없음. 동일 빈도 범주 구분 불가가 단점.',
  },
  {
    label: 'Entity Embedding: 저차원 벡터 학습',
    body: '신경망으로 범주를 밀집 벡터로 매핑. 고카디널리티(수천 범주) 처리에 강력. TabNet·DeepFM에서 사용.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
