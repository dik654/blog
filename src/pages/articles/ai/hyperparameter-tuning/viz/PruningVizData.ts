import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'MedianPruner — 중앙값 기반 조기 종료',
    body: '현재 trial의 중간 결과가 과거 trial들의 같은 epoch 중앙값(median)보다 나쁘면 즉시 종료.\nn_warmup_steps: 초반 몇 epoch는 pruning 건너뛰기.\nn_startup_trials: 처음 몇 trial은 기준선 확보를 위해 전부 완료.',
  },
  {
    label: 'HyperbandPruner — 다단계 리소스 할당',
    body: 'Hyperband 알고리즘: min_resource(최소 epoch) → max_resource(최대 epoch).\n여러 "bracket"(예산 레벨)으로 trial을 분류, 성능이 좋은 trial에 더 많은 리소스 할당.\nSHA(Successive Halving Algorithm) 기반 — 각 단계에서 하위 절반을 탈락.',
  },
  {
    label: 'Pruning 효과 — 3~5배 탐색 효율 향상',
    body: '100 trial 중 약 60~70%가 초반에 종료 → 남은 예산으로 유망한 trial을 더 많이 탐색.\nreport + should_prune 패턴:\nfor epoch in range(100):\n  train(); val = evaluate()\n  trial.report(val, epoch)\n  if trial.should_prune(): raise optuna.TrialPruned()',
  },
  {
    label: '멀티 목적 최적화 — Pareto Front',
    body: 'study = create_study(directions=["maximize", "minimize"])\n예: (정확도 최대화, 추론 시간 최소화) 동시 최적화.\nPareto 최적 해 집합: 어떤 목적도 희생하지 않고는 다른 목적을 개선할 수 없는 해.\nstudy.best_trials로 Pareto front의 모든 해를 조회.',
  },
  {
    label: '결과 시각화 — importance, contour, history',
    body: 'plot_param_importances: fANOVA 기반 — 각 파라미터가 성능 분산의 몇 %를 설명하는지.\nplot_contour: 2D 등고선 — 두 파라미터의 상호작용 확인.\nplot_optimization_history: trial 진행에 따른 best value 수렴 추이.',
  },
];

/** Trial curves for pruning demo (epoch → val_loss) */
export const TRIAL_CURVES = [
  // Good trial — converges
  { color: '#10b981', pruned: false, pts: [0.9, 0.7, 0.55, 0.42, 0.35, 0.30, 0.27, 0.25] },
  // Mediocre — pruned at epoch 4
  { color: '#f59e0b', pruned: true, pts: [0.95, 0.85, 0.78, 0.75] },
  // Bad — pruned at epoch 2
  { color: '#ef4444', pruned: true, pts: [0.98, 0.92] },
  // Another good
  { color: '#3b82f6', pruned: false, pts: [0.88, 0.65, 0.50, 0.40, 0.33, 0.28, 0.26, 0.24] },
  // Mediocre — pruned at epoch 3
  { color: '#8b5cf6', pruned: true, pts: [0.93, 0.80, 0.72] },
];

/** Pareto front points (accuracy, latency_ms) */
export const PARETO_PTS = [
  { acc: 0.95, lat: 120, pareto: true },
  { acc: 0.93, lat: 80, pareto: true },
  { acc: 0.90, lat: 45, pareto: true },
  { acc: 0.88, lat: 30, pareto: true },
  { acc: 0.91, lat: 90, pareto: false },
  { acc: 0.87, lat: 70, pareto: false },
  { acc: 0.85, lat: 100, pareto: false },
  { acc: 0.89, lat: 110, pareto: false },
  { acc: 0.92, lat: 60, pareto: false },
];

/** Importance bars */
export const IMPORTANCE = [
  { name: 'learning_rate', value: 0.42, color: '#10b981' },
  { name: 'num_leaves', value: 0.28, color: '#6366f1' },
  { name: 'min_child_samples', value: 0.15, color: '#f59e0b' },
  { name: 'subsample', value: 0.09, color: '#3b82f6' },
  { name: 'colsample_bytree', value: 0.06, color: '#8b5cf6' },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
