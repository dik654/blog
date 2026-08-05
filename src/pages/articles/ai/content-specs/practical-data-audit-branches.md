# Practical data audit and intervention branches

## Reader goal

독자는 데이터를 받자마자 차트를 그리는 대신 다음 순서로 판단할 수 있어야 한다.

1. 한 행, 예측 시점, target 확정 시점과 실제 행동을 먼저 고정한다.
2. Schema, 단위, sentinel, duplicate, group, time와 label 품질을 audit한다.
3. Prediction cutoff와 split 경계로 feature availability를 판정한다.
4. Missingness와 distribution shift를 단순 결측률이 아니라 생성 과정의 변화로 읽는다.
5. 공통 audit가 끝난 뒤에만 feature 설계, augmentation, rare-event 대응 중 필요한 분기를 연다.
6. 모든 학습형 변환은 fold train에서만 fit하고 OOF evidence와 untouched test로 닫는다.

## Hidden hard problem

> 공장 설비 고장 예측 데이터가 있다. 한 행은 센서 측정처럼 보이지만 같은 설비의 10분 window를
> 1분 간격으로 잘라 만든 중첩 표본이다. `failure_24h` label은 실제 고장 뒤 48시간이 지나야
> 확정된다. Train은 1~5월, 운영 replay는 6월이며 양성률은 0.7%다. 온도는 섭씨와 화씨가 섞여
> 있고 `-999`가 결측 sentinel인데 정상 음수값도 존재한다. `last_service_date`, 전체 기간의
> 설비별 평균, validation month까지 포함한 rolling mean이 feature에 들어 있다. 고장 직전에는
> 센서가 꺼져 missingness가 증가한다. 이미지 점검 사진에는 좌우 방향이 결함 위치 label의 일부인데
> horizontal flip을 적용했고, SMOTE는 split 전에 전체 데이터에 적용했다. 운영팀은 하루 120건만
> 점검할 수 있고 missed failure 비용은 false alarm보다 40배 크다. 무엇을 먼저 중단하고,
> data contract, split, feature cutoff, augmentation target, resampling, calibration과 threshold를
> 어떻게 다시 설계해야 하는가?

본문만으로 독자는 다음을 밝혀야 한다.

- 중첩 window와 같은 설비가 fold를 넘으면 행 수가 많아도 독립 표본이 아니다.
- Label availability가 prediction cutoff보다 뒤라면 feature와 target 생성의 시간 경계를 따로 둬야 한다.
- `-999`를 일괄 결측으로 바꾸기 전에 column별 domain과 unit을 확인해야 한다.
- Missingness가 고장 상태와 수집 장치에 의존할 수 있으므로 결측률만으로 MCAR/MAR/MNAR를 확정할 수 없다.
- 전체 기간 aggregate, target encoding, imputation, scaling, feature selection은 fold 밖에서 fit하면 누출된다.
- Flip은 classification label을 보존할 수 있어도 결함 위치 label에는 target 변환이 필요하거나 금지될 수 있다.
- SMOTE와 class weighting은 학습 신호 개입이고 threshold와 capacity는 의사결정 개입이다.
- Resampling 뒤의 artificial prevalence로 calibration과 precision을 해석하면 안 된다.

## Information architecture

### Root: `eda-workflow`

Title: `데이터 감사: 모델보다 먼저 예측 계약을 검증한다`

Owns:

- Row unit, prediction cutoff, target availability, action and population.
- Schema/type/unit/sentinel audit and immutable raw snapshot.
- Duplicate, near duplicate, group and time dependence.
- Missingness observation, mechanism hypotheses and collection shift.
- Leakage map and split/metric handoff.
- Versioned audit artifacts and stop gates.

Does not own:

- Exhaustive feature recipes.
- Image augmentation catalog.
- Rare-event loss or threshold optimization.

### Branch: `feature-engineering`

Title: `피처 설계: cutoff 이전 사실을 학습 신호로 바꾼다`

Owns:

- Fit/transform boundary.
- Numeric/categorical transformations and unknown-category policy.
- Point-in-time correct aggregates and target encoding.
- Interaction claims and denominator/domain checks.
- Fold/seed stability, ablation and OOF selection evidence.

Prerequisite: Data audit root.

### Branch: `data-augmentation`

Title: `데이터 증강: 변환이 보존해야 할 의미를 먼저 쓴다`

Owns:

- Invariance, equivariance and target synchronization.
- Classification/detection/segmentation/OCR differences.
- Label-preserving versus label-mixing transforms.
- Mixup/CutMix scope and formula.
- Train-only stochastic policy, deterministic evaluation preprocessing and replay.
- Tabular synthesis as a separate, high-risk branch.

Prerequisite: Data audit root and a fixed validation contract.

### Branch: `imbalanced-data`

Title: `희귀 사건 의사결정: 학습 신호와 운영 기준을 분리한다`

Owns:

- Base rate, counts and capacity.
- Precision/recall/AP/top-k and cost slices.
- Resampling inside fold and natural-prevalence validation.
- Class weight/focal loss versus calibration/threshold.
- Independent calibration and threshold evidence.
- Release policy under drift.

Prerequisites: Data audit root and `evaluation-metrics`.

## Formula policy

- Every display formula uses `MathFormula` with `String.raw`.
- Every display formula is followed immediately by one `FormulaNote`.
- Long calculations are split into aligned rows; font shrinking is not the primary solution.
- Korean underbrace labels explain why an operation exists.

Required formulas:

- Missingness indicator and observed rate by slice.
- Point-in-time aggregate with `t_j < t_cut`.
- Out-of-fold target encoding or fit/transform boundary notation.
- Mixup input and target interpolation.
- Precision, recall and alert capacity.
- Expected decision cost under a threshold.

## Visualization system

Create `practical-data/viz/DataEvidenceLabs.tsx`.

1. `DataContractLab`: switch row/group/time assumptions and see which audit gate fails.
2. `MissingnessShiftLab`: compare random-looking, group-linked and event-linked missingness without claiming a mechanism from a plot alone.
3. `FeatureCutoffLab`: move the prediction cutoff and classify source rows as usable, future leakage or fold-fitted state.
4. `AugmentationContractLab`: change task and transform; update image, box/mask/keypoint or reject the transform.
5. `RareEventDecisionLab`: change prevalence, cost and review capacity; separate learning, calibration and policy choices.
6. `ResamplingBoundaryLab`: place resampling before or inside split and show natural versus artificial evaluation prevalence.

Rules:

- No fixed-coordinate SVG and no text below 11 px.
- Responsive grids at 390, 768 and 1440 px.
- One figure frame; no decorative card nesting.
- Controls change causal state, not only color.
- Semantic blue, emerald, amber and rose are used sparingly on a neutral base.
- Stable root data attributes support browser tests.

## Primary and official sources

- scikit-learn, Common pitfalls:
  `https://scikit-learn.org/stable/common_pitfalls.html`
- scikit-learn, Imputation:
  `https://scikit-learn.org/stable/modules/impute.html`
- scikit-learn, Permutation importance:
  `https://scikit-learn.org/stable/modules/permutation_importance.html`
- scikit-learn, Feature selection:
  `https://scikit-learn.org/stable/modules/feature_selection.html`
- scikit-learn, Probability calibration:
  `https://scikit-learn.org/stable/modules/calibration.html`
- imbalanced-learn, Common pitfalls:
  `https://imbalanced-learn.org/stable/common_pitfalls.html`
- Albumentations, Choosing augmentations:
  `https://albumentations.ai/docs/3-basic-usage/choosing-augmentations/`
- Zhang et al., mixup:
  `https://arxiv.org/abs/1710.09412`
- Yun et al., CutMix:
  `https://arxiv.org/abs/1905.04899`

Tool documentation supports APIs and implementation boundaries. Missingness mechanism labels, intervention
selection and release stop rules are hypotheses or engineering synthesis unless a cited source establishes more.

## Acceptance

- The old four-step linear path is removed.
- One root path and three named intervention branches are visible in the sidebar.
- Four article metadata rows include summary, level, time and prerequisites.
- Every article begins with a decision question and ends with an explicit handoff.
- Six responsive labs expose state changes and have deterministic data attributes.
- No display formula lacks an immediate Korean explanation.
- No raw LaTeX or horizontal document overflow at 390, 768 and 1440 px.
- The hidden hard problem differs from public examples and is solvable from the articles.
- Claude review is accepted only with an observed `[claude-code:sonnet` header.
