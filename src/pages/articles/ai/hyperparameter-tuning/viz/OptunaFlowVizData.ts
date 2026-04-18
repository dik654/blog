import type { StepDef } from '@/components/ui/step-viz';

export const STEPS: StepDef[] = [
  {
    label: 'Study — 최적화 세션 전체를 관리하는 객체',
    body: 'study = optuna.create_study(direction="minimize")\nstudy가 Trial들을 생성하고, 전체 이력을 Storage(DB)에 저장.\n방향(minimize/maximize)과 sampler(TPE 등), pruner를 지정.',
  },
  {
    label: 'Trial — 한 번의 하이퍼파라미터 평가 단위',
    body: 'objective(trial) 함수 안에서 trial.suggest_float("lr", 1e-5, 1e-1, log=True) 처럼 파라미터를 요청.\ndefine-by-run: 조건부 탐색 가능 — if trial.suggest_categorical("opt", ["Adam","SGD"])=="SGD": trial.suggest_float("momentum", ...).',
  },
  {
    label: 'Objective — 사용자가 정의하는 평가 함수',
    body: '모델 학습 → 검증 점수 반환. return val_loss 또는 return accuracy.\n중간 보고: trial.report(val_loss, epoch) → Pruner가 조기 종료 판단.\n다중 목적: return accuracy, latency → Pareto 최적 탐색.',
  },
  {
    label: 'study.optimize(objective, n_trials=100) 실행 흐름',
    body: 'Sampler(TPE)가 이전 Trial 이력을 분석 → 유망 파라미터 제안 → Objective 평가 → Storage에 기록 → 반복.\nn_jobs=-1로 병렬 실행 가능. RDB Storage(MySQL/PostgreSQL)로 분산 최적화도 지원.',
  },
  {
    label: 'Dashboard & 결과 분석',
    body: 'optuna.visualization.plot_optimization_history — Trial별 성능 추이.\nplot_param_importances — 어떤 파라미터가 성능에 가장 영향을 주는지.\nplot_contour — 2개 파라미터 조합의 성능 등고선.',
  },
];

export const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
