import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'SparseGPT: 대규모 LLM을 한 번에 프루닝',
    body: 'Frantar & Alistarh (2023): 재학습 없이 calibration 데이터(128 샘플)만으로 프루닝.\n핵심 아이디어 — 행 단위로 Hessian 역행렬을 이용해 최적 마스크 계산.\nGPT-175B를 단일 GPU에서 4시간 만에 50% 프루닝.',
  },
  {
    label: 'SparseGPT 동작: 열 단위 순차 프루닝',
    body: '1) 보정 데이터로 Hessian(H = XᵀX) 계산\n2) 각 열(column)을 순서대로 처리: 프루닝 vs 유지 결정\n3) 프루닝된 가중치의 오차를 남은 가중치에 보상(compensation)\n→ 전체 출력 변화 최소화.',
  },
  {
    label: 'Wanda: 활성화 × 가중치 기반 프루닝',
    body: 'Sun et al. (2024): Hessian 계산 불필요 — |w| × ||x||₂ 스코어로 판단.\n직관: 가중치가 크더라도 해당 입력이 항상 0이면 기여도 0.\n계산 비용: SparseGPT 대비 10~100배 빠름 (행렬곱 없음).',
  },
  {
    label: '50% 희소성에서도 성능 유지',
    body: 'LLaMA-7B 기준: Dense PPL 5.68 → SparseGPT 50% PPL 6.55 → Wanda 50% PPL 6.72.\n2:4 구조적 희소성: SparseGPT PPL 7.15, Wanda PPL 7.26.\nA100 GPU의 2:4 희소 텐서 코어로 실제 1.5~2× 속도 향상.',
  },
];

export const COLORS = {
  sparse: '#3b82f6',
  hessian: '#8b5cf6',
  wanda: '#10b981',
  pruned: '#ef4444',
  perf: '#f59e0b',
};
