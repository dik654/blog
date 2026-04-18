import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  raw: '#6366f1',
  feat: '#10b981',
  model: '#f59e0b',
  score: '#ec4899',
  accent: '#3b82f6',
};

export const STEPS: StepDef[] = [
  {
    label: '원본 데이터 → 모델: 기본 성능',
    body: '원본 피처만 넣으면 모델이 패턴을 제대로 잡지 못한다. 대회 기준 보통 하위 50%.',
  },
  {
    label: '피처 엔지니어링 후 → 같은 모델, 다른 성능',
    body: '피처를 가공해서 넣으면 동일 모델로도 상위 10% 성능이 나온다. 모델 선택보다 피처가 순위를 결정.',
  },
  {
    label: '80/20 법칙: 시간 배분',
    body: '실전에서 전체 작업 시간의 80%를 피처 엔지니어링에 투자한다. 모델 튜닝은 나머지 20%.',
  },
  {
    label: '피처 엔지니어링 6대 전략',
    body: '수치형 변환 · 범주형 인코딩 · 인터랙션 · 집계 · 선택 · 도메인 지식 — 이 6가지가 핵심.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
