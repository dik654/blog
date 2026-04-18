import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'LightGBM 핵심 탐색 공간',
    body: 'num_leaves(2~256): 트리 복잡도. learning_rate(0.005~0.3, log): 학습 속도.\nmin_child_samples(5~100): 과적합 제어. subsample(0.5~1.0): 배깅 비율.\ncolsample_bytree(0.5~1.0): 피처 서브샘플링. reg_alpha/lambda(1e-8~10): 정규화.',
  },
  {
    label: '신경망 핵심 탐색 공간',
    body: 'lr(1e-5~1e-2, log): 학습률. batch_size(16/32/64/128): 배치 크기.\ndropout(0.0~0.5): 정규화. hidden_size(64~512): 은닉층 크기.\nn_layers(1~4): 층 수. weight_decay(1e-6~1e-2): L2 정규화.',
  },
  {
    label: '범위 설정 가이드: log scale vs uniform',
    body: 'log=True: 학습률, 정규화 계수 등 수십 배 단위로 변하는 파라미터.\nuniform: dropout, subsample 등 [0,1] 범위에서 균등하게 탐색.\ncategorical: optimizer 종류, activation 종류 등 이산 선택.',
  },
  {
    label: '조건부 탐색 공간 (define-by-run)',
    body: 'Optuna의 강점 — 파라미터 A의 값에 따라 파라미터 B의 존재 여부를 결정.\n예: optimizer가 SGD일 때만 momentum 탐색, Adam일 때만 beta1/beta2 탐색.\n트리 구조 탐색 공간을 자연스럽게 표현 가능.',
  },
];

export interface ParamDef {
  name: string;
  range: string;
  type: 'float' | 'int' | 'cat';
  log?: boolean;
  color: string;
}

export const LGBM_PARAMS: ParamDef[] = [
  { name: 'num_leaves', range: '2 ~ 256', type: 'int', color: '#6366f1' },
  { name: 'learning_rate', range: '0.005 ~ 0.3', type: 'float', log: true, color: '#10b981' },
  { name: 'min_child_samples', range: '5 ~ 100', type: 'int', color: '#f59e0b' },
  { name: 'subsample', range: '0.5 ~ 1.0', type: 'float', color: '#3b82f6' },
  { name: 'colsample_bytree', range: '0.5 ~ 1.0', type: 'float', color: '#8b5cf6' },
  { name: 'reg_alpha', range: '1e-8 ~ 10', type: 'float', log: true, color: '#ec4899' },
];

export const NN_PARAMS: ParamDef[] = [
  { name: 'lr', range: '1e-5 ~ 1e-2', type: 'float', log: true, color: '#10b981' },
  { name: 'batch_size', range: '16 / 32 / 64 / 128', type: 'cat', color: '#6366f1' },
  { name: 'dropout', range: '0.0 ~ 0.5', type: 'float', color: '#f59e0b' },
  { name: 'hidden_size', range: '64 ~ 512', type: 'int', color: '#3b82f6' },
  { name: 'n_layers', range: '1 ~ 4', type: 'int', color: '#8b5cf6' },
  { name: 'weight_decay', range: '1e-6 ~ 1e-2', type: 'float', log: true, color: '#ec4899' },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
