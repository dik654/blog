# Practical competition evidence path

## Reader goal

독자는 leaderboard 점수를 올리는 팁을 외우는 대신 다음 순서로 판단할 수 있어야 한다.

1. Prediction이 어떤 업무 행동을 바꾸는지 정의한다.
2. 그 행동의 오류 비용을 metric과 threshold 계약으로 번역한다.
3. 실제 test/production 생성 과정을 모사하는 split을 선택한다.
4. Data, code, config, seed, OOF prediction과 artifact를 한 run evidence로 묶는다.
5. Validation noise보다 큰 개선만 tuning 결과로 채택한다.
6. OOF에서 오류 상관이 다른 model만 ensemble하고 release evidence를 남긴다.

## Hidden hard problem

> 결제 사기 탐지 대회가 있다. 양성률은 0.8%이며 같은 고객이 여러 달에 걸쳐 등장한다. Train은
> 1~5월, private test는 6월이다. Public leaderboard는 private test의 작은 일부이며 ROC AUC를
> 사용한다. 실제 운영은 하루 검토 가능 건수가 500건뿐이고 false negative 비용이 false positive보다
> 30배 크다. 팀은 random stratified 5-fold에서 AUC 0.982를 얻었고, customer aggregate,
> target encoding, SMOTE, Optuna 2,000 trials, 세 model stacking을 적용했다. Public score는
> 0.989지만 6월 replay에서는 precision이 무너졌다. 어떤 부분이 누출 또는 목적 불일치인지 찾고,
> split·metric bundle·fit boundary·run manifest·search stop gate·OOF ensemble을 다시 설계하라.

본문만으로 독자는 다음을 밝혀야 한다.

- Class ratio를 보존하는 것만으로 time와 customer leakage가 사라지지 않는다.
- Split은 metric이 아니라 data-generating process와 deployment boundary가 결정한다.
- ROC AUC가 ranking 전체를 보더라도 top-500 precision, recall, calibration과 비용을 대신하지 않는다.
- Target encoding, resampling, feature selection과 calibration은 fold train 안에서 fit해야 한다.
- Public leaderboard는 반복 최적화 target이 아니라 제한된 external audit다.
- Trial 수를 늘리는 것은 validation noise를 학습하는 search가 될 수 있다.
- Stacking meta-model은 OOF prediction만 보며, final test prediction은 fold model 또는 refit policy로 만든다.

## Path architecture

### 1. `competition-workflow`

Role: 목표에서 시작하는 전체 map.

- Problem contract: unit, target timestamp, prediction cutoff, action, cost, capacity.
- Evidence order: metric → split → baseline → tracked experiment → search → ensemble → final audit.
- First-day artifacts: schema/profile, duplicate/group/time map, baseline, first OOF ledger.
- Stop condition: split가 현실을 모사하지 못하면 model iteration을 시작하지 않는다.

### 2. `evaluation-metrics`

Role: 업무 행동을 수치 계약으로 번역.

- Regression: MAE와 RMSE의 error weighting, RMSLE의 domain precondition.
- Classification: confusion matrix, precision/recall, F-beta, ROC AUC, average precision, log loss.
- Ranking: top-k and NDCG intuition; a global ranking metric does not encode capacity by itself.
- Calibration: probability meaning, Brier/log loss, threshold selection on independent evidence.
- Metric bundle: primary, guardrail, slice, uncertainty and threshold policy.

### 3. `cross-validation`

Role: future test를 흉내 내는 evidence generator.

- IID, stratified, group, time and group+time decision.
- Split before preprocessing; all learned transforms fit inside each fold.
- Nested boundary for tuning, calibration and threshold selection.
- Fold mean alone is insufficient: spread, worst fold, slice and OOF predictions.
- Public leaderboard is not another validation fold.

### 4. `experiment-tracking`

Role: score를 재현 가능한 claim으로 변환.

- Immutable run identity: dataset digest, split manifest, code revision, environment, config and seed policy.
- Metrics by fold/slice plus OOF prediction artifact.
- Model/checkpoint, feature schema, logs and failure note.
- W&B and MLflow are storage/query implementations; tracking contract is tool-independent.
- Data versioning and lineage are first-class, not a text note.

### 5. `hyperparameter-tuning`

Role: fixed evidence contract 안에서 bounded search.

- Search space comes from mechanism and resource constraints.
- Baseline and sanity random search before adaptive sampler.
- Same fold manifest across comparable trials.
- Pruning uses intermediate evidence without changing the final objective contract.
- Stop when expected improvement is smaller than repeated-run/fold noise or budget opportunity cost.
- Multi-objective tradeoff keeps quality, latency, memory or fairness visible.

### 6. `ensemble-methods`

Role: independently useful errors만 결합하고 release.

- Average probability only when scales/semantics are compatible; rank averaging discards calibration.
- Diversity is measured on aligned OOF residuals/errors, not model family names.
- Stacking meta-model trains on OOF predictions; no in-sample base predictions.
- Ensemble must beat best single model beyond uncertainty and pass latency/complexity gates.
- Final artifact records members, weights, fold lineage, inference order and fallback.

## Formula policy

Every display formula:

- uses `MathFormula` with `String.raw`;
- includes short Korean `\underbrace{}` annotations inside the formula where it improves parsing;
- is followed immediately by `FormulaNote`;
- fits at 390 px without horizontal scrolling;
- distinguishes score direction and domain preconditions.

Required formulas:

- MAE/RMSE.
- Precision, recall and F-beta.
- Log loss or Brier score for calibrated probability.
- Fold mean and uncertainty/spread.
- Search adoption gate: observed delta minus noise margin and resource penalty.
- Ensemble probability and OOF error correlation.

## Visualization system

Create one shared responsive file:
`practical-strategy/viz/CompetitionEvidenceLabs.tsx`.

Required labs:

1. `CompetitionContractLab`: change hidden-data structure and see the required evidence order.
2. `MetricDecisionLab`: change prevalence, cost ratio and review capacity; distinguish rank, probability and action threshold.
3. `SplitContractLab`: IID/group/time/group+time partitions with visible leakage indicators.
4. `EvidenceLedgerLab`: toggle manifest fields and watch whether a score claim is reproducible.
5. `SearchGateLab`: change trial delta, noise and compute cost; show adopt/continue/stop.
6. `EnsembleGateLab`: change OOF quality and error correlation; show whether diversity is real.

Visual rules:

- No fixed-coordinate SVG and no tiny 7–10 px labels.
- Stable responsive grids at 390, 768 and 1440.
- Controls use icons/segmented buttons/sliders.
- White/black base with semantic blue, emerald, amber and rose used sparingly.
- No nested decorative cards; figure is the frame, internal regions use borders or full-width bands.
- Root data attributes provide deterministic browser tests.

## Primary sources

- scikit-learn, Common pitfalls and recommended practices:
  `https://scikit-learn.org/stable/common_pitfalls.html`
- scikit-learn, Cross-validation:
  `https://scikit-learn.org/stable/modules/cross_validation.html`
- scikit-learn, Metrics and scoring:
  `https://scikit-learn.org/stable/modules/model_evaluation.html`
- scikit-learn, Probability calibration:
  `https://scikit-learn.org/stable/modules/calibration.html`
- Optuna documentation:
  `https://optuna.readthedocs.io/en/stable/`
- MLflow Tracking:
  `https://mlflow.org/docs/latest/ml/tracking/`
- MLflow Dataset Tracking:
  `https://mlflow.org/docs/latest/dataset/`
- W&B Experiments:
  `https://docs.wandb.ai/guides/track/`

Tool documentation supports API and implementation claims only. Workflow stop gates and release invariants are
clearly labeled as this article path's engineering synthesis.

## Acceptance

- Six article metadata rows have summary, level, time and prerequisites.
- Learning path title and questions expose the evidence spine rather than leaderboard tricks.
- Each article starts with a decision question and ends with a handoff.
- Six shared labs render and change output by interaction.
- Every display formula has exactly one immediate FormulaNote.
- No raw LaTeX is visible.
- No horizontal overflow at 390, 768 or 1440 px.
- A hidden fixture different from the public lab can be solved from article contracts.
- Context Manager audits sequence, factual claims, formula semantics and source boundary independently.
