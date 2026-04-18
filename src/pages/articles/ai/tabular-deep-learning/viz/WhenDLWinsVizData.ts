import type { StepDef } from '@/components/ui/step-viz';

export const COLORS = {
  gbm: '#22c55e',
  dl: '#6366f1',
  both: '#f59e0b',
  data: '#3b82f6',
  warn: '#ef4444',
  neutral: '#64748b',
};

export const STEPS: StepDef[] = [
  {
    label: '판단 플로차트 — GBM vs DL 선택 기준',
    body: '실무에서 가장 중요한 질문 4가지로 의사결정.\n데이터 크기 → 멀티모달 여부 → 범주형 카디널리티 → 사전학습 데이터 유무.\n대부분의 Kaggle 테이블 대회에서는 GBM이 여전히 1순위.',
  },
  {
    label: '데이터 크기 vs 모델 성능 — 교차점',
    body: '소규모(~10K): GBM 압도적. DL은 과적합 위험.\n중규모(10K~100K): GBM 우세, DL 접근.\n대규모(100K+): DL이 GBM에 근접 또는 추월 — 파라미터 용량 활용.\nShwartz-Ziv & Armon (2022): 100K 이상에서 DL 승률 급상승.',
  },
  {
    label: '실전 전략 — 앙상블과 하이브리드',
    body: 'GBM + DL 앙상블: 상호 보완적 오차 패턴으로 단독 대비 1~3% 성능 향상.\nDL을 피처 추출기로 사용 → 임베딩을 GBM 입력으로 전달.\n엔티티 임베딩 → LightGBM: 고카디널리티 범주형의 실전 최강 조합.',
  },
  {
    label: '최종 정리 — 테이블 DL의 현재와 미래',
    body: '현재: "DL이 항상 최선은 아니다" — 데이터·도메인 조건부 선택.\n미래: TabPFN, TabR 등 in-context learning 기반 모델 등장.\n핵심 메시지: 모델보다 피처 엔지니어링과 검증 전략이 더 중요.',
  },
];
