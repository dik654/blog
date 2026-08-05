# Practical ML evidence path reconstruction

## 목표

기존 실전 ML 경로는 다음 순서였다.

`Competition workflow -> Metrics -> CV -> Tracking -> Tuning -> Ensemble`

목록 순서는 대체로 맞았지만 글의 실제 책임은 “대회 팁”, “도구 사용법”, “상위권 기법”으로
흩어져 있었다. 이 milestone에서는 같은 여섯 글을 유지하되 하나의 증거 의존성으로 다시 썼다.

`업무 계약 -> Metric 계약 -> Split 계약 -> Evidence ledger -> Bounded search -> OOF release`

각 글은 하나의 질문만 소유한다.

1. `competition-workflow`: 어떤 예측이 어떤 행동을 바꾸며, release까지 무엇을 고정하는가?
2. `evaluation-metrics`: 오류 비용·처리 용량을 어떤 수치 묶음으로 번역하는가?
3. `cross-validation`: 어떤 split과 fit boundary가 future test를 흉내 내는가?
4. `experiment-tracking`: score를 어떤 입력·출력 계보와 묶어야 다시 검사할 수 있는가?
5. `hyperparameter-tuning`: validation noise와 compute 비용보다 큰 개선만 어떻게 남기는가?
6. `ensemble-methods`: 같은 OOF 행에서 다른 오류를 내는 model만 어떻게 결합·release하는가?

## 재구성을 선택한 이유

기존 아티클을 합치면 도구 목록은 줄지만 책임 경계도 사라진다. 반대로 독립 글을 그대로 두고
연결만 추가하면 독자는 W&B, Optuna, stacking을 별개 기술로 외운다. 따라서 아티클 slug는
유지하고 앞 글의 output artifact가 다음 글의 input이 되게 만들었다.

- Workflow의 output: problem contract, metric bundle, split manifest 초안
- Metric의 output: primary, action, guardrail, probability, slice, uncertainty, policy
- CV의 output: immutable fold manifest와 aligned OOF prediction
- Tracking의 output: dataset/split/code/config/OOF/artifact를 묶은 run claim
- Tuning의 output: noise와 budget을 통과한 반복 검증 후보
- Ensemble의 output: member lineage, weight/meta-model, calibration과 release checksum

이 바닥을 고정하면 최신 model이나 tuning library는 경로를 다시 쓰지 않고 해당 owner 글 위에
delta로 추가할 수 있다.

## 숨은 난도 문제

본문에 답안형 문제를 싣지 않고 다음 fixture를 내부 acceptance로 사용했다.

> 결제 사기 탐지 대회에서 양성률은 0.8%이고 같은 고객이 여러 달 등장한다. Train은 1~5월,
> private test는 6월이다. Public leaderboard는 test의 작은 일부에서 ROC AUC를 계산한다.
> 운영팀은 하루 500건만 검토할 수 있고 false negative 비용은 false positive의 30배다.
> 팀은 random stratified 5-fold AUC 0.982를 얻었고 customer aggregate, target encoding,
> SMOTE, Optuna 2,000 trials와 세 model stacking을 적용했다. Public score는 0.989지만
> 6월 replay precision이 무너졌다. 누출·목적 불일치를 진단하고 metric, split, fit boundary,
> run manifest, search stop과 OOF ensemble을 다시 설계하라.

여섯 글을 읽은 독자가 다음 결론에 도달해야 통과다.

- Stratification은 class ratio만 보존하며 time·customer leakage를 막지 않는다.
- Split은 metric 이름이 아니라 data-generating process와 deployment boundary가 결정한다.
- ROC AUC는 global ranking을 보지만 top-500 행동, 절대 FP 수와 calibration을 대신하지 않는다.
- Target encoding, resampling, feature selection과 calibration은 fold train 안에서 fit한다.
- Public leaderboard는 반복 최적화 target이 아니라 제한된 external audit다.
- Trial을 늘리면 validation noise를 선택할 수 있으므로 noise와 compute stop gate가 필요하다.
- Stacking meta-model은 aligned OOF만 보며 in-sample base prediction을 보지 않는다.
- Model family 이름이 아니라 같은 OOF 행에서의 error correlation과 slice 보완성을 본다.
- Release는 score gain뿐 아니라 calibration, latency, artifact completeness와 fallback을 통과한다.

## 원문 근거와 주장 범위

2026-07-23에 다음 공식 문서를 다시 열어 현재 범위를 확인했다.

- [scikit-learn · Metrics and scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)
  - 현재 문서는 prediction과 decision making을 분리하고 task의 ultimate goal에서 scoring을
    고르도록 설명한다.
  - MAE, RMSE, precision, recall, F-beta, AP, NDCG, log loss와 Brier 정의를 확인했다.
- [scikit-learn · Probability calibration](https://scikit-learn.org/stable/modules/calibration.html)
  - reliability curve와 calibration 절차의 근거다.
- [scikit-learn · Cross-validation](https://scikit-learn.org/stable/modules/cross_validation.html)
  - K-fold, stratified, group와 time-aware split의 공식 범위다.
- [scikit-learn · Common pitfalls](https://scikit-learn.org/stable/common_pitfalls.html)
  - split-before-preprocessing, test에 fit하지 않기와 Pipeline의 leakage 방지 근거다.
- [MLflow · Tracking](https://mlflow.org/docs/latest/ml/tracking/)
  - run, parameter, metric와 artifact 저장·비교 범위다.
- [MLflow · Dataset](https://mlflow.org/docs/latest/dataset/)
  - dataset name, digest, schema, profile, source와 `mlflow.log_input` 범위다.
- [W&B · Experiments](https://docs.wandb.ai/guides/track/)
  - run, config, metric와 artifact tracking의 공식 범위다.
- [Optuna documentation](https://optuna.readthedocs.io/en/stable/)
  - study, trial, sampler, pruner와 multi-objective API의 공식 범위다.
- scikit-learn `StackingClassifier`, `VotingClassifier`
  - cross-validated prediction을 이용한 final estimator와 soft voting의 구현 범위다.

공식 문서가 직접 보장하지 않는 항목은 글 안에서 engineering synthesis 또는 heuristic으로
표시했다.

- 네 계약의 실무 순서
- immutable split manifest와 dirty diff required field
- 1.5× noise margin과 36 GPU-hour budget
- diversity-adjusted signal, 4 bp, 25 ms, calibration gap 5%p
- evidence freeze와 release invariant

이 숫자는 독자가 tradeoff를 움직여 보기 위한 예시이며 보편 통계 임계값이 아니다.

## 아티클별 구현 판단

### Workflow

- Model보다 prediction cutoff, action, cost와 capacity를 먼저 썼다.
- 첫날 산출물을 `problem contract -> schema/leakage ledger -> metric bundle -> split manifest`로
  정리했다.
- Fold, OOF, near duplicate와 noise margin을 첫 사용 전에 설명했다.
- Baseline을 낮은 점수가 아니라 end-to-end 측정 장치로 정의했다.
- 한 iteration은 가설, 예상 slice, 변경, evidence와 결정을 하나씩만 가진다.
- Tracking, tuning과 ensemble로 가는 명시적 handoff를 추가했다.

### Metrics

- MAE와 RMSE를 “어느 것이 좋나”가 아니라 큰 오류 비용으로 구분했다.
- FPR이 전체 음성 수로 정규화되어 낮은 비율도 큰 절대 FP가 될 수 있음을 설명했다.
- AP는 relevant 위치의 precision을 모은 뒤 정답 수로 평균한다고 바로잡았다.
- DCG/NDCG를 두 줄 KaTeX, 한국어 underbrace와 FormulaNote로 추가했다.
- Calibration model과 threshold도 별도 evidence에서 선택하게 했다.
- Brier score와 reliability curve를 첫 사용 전에 정의했다.

### Cross-validation

- IID, stratified, group, time와 group+time을 “새로움의 축”으로 나눴다.
- Split 뒤에도 모든 learned transform을 fold train 안에서 fit하도록 했다.
- Selection과 evaluation을 같은 validation에 반복하는 문제와 nested boundary를 설명했다.
- Fold mean, spread, worst slice와 OOF artifact를 함께 보존한다.
- Public leaderboard를 또 하나의 fold가 아닌 제한된 audit로 두었다.

### Tracking

- Run identity에 dataset digest, split digest, code, environment, config와 seed policy를 묶었다.
- Seed 고정과 재현성을 같게 보지 않고 seed 17·29·43 반복 범위 예시를 넣었다.
- Dataset/split version diff를 별도 시각 band로 추가했다.
- Scalar score보다 OOF, feature schema, model, log와 release artifact를 우선했다.
- Autologging의 범위를 integration마다 audit하고 빠진 값은 명시적으로 기록하게 했다.

### Tuning

- Search space를 parameter 문법이 아니라 mechanism과 resource constraint로 설명했다.
- Random sanity phase 뒤에 adaptive sampler를 사용한다.
- Pruning에서 warmup, late improvement, unstable curve와 fold ordering 위험을 다뤘다.
- Stop 식을 Viz와 동일하게 `G = observed delta - lambda * repeated noise`와 별도 compute
  hard constraint로 수정했다.
- Trial 수가 커질수록 untouched audit가 필요하다는 선택 편향 신호를 Viz에 넣었다.
- Pareto 후보와 hard latency/memory budget을 가중합 하나로 숨기지 않았다.

### Ensemble

- Probability average와 rank average의 정보 보존 차이를 분리했다.
- Candidate와 current ensemble도 같은 행의 두 OOF error vector로 상관을 계산한다고 명시했다.
- Error correlation 범위를 -100%~100%로 열었다.
- Stacking은 base OOF 생성, row alignment, meta fit, fold-test aggregation 순서로 고정했다.
- Calibration gap, latency와 diversity를 동시에 release gate에 넣었다.
- 모바일에서 10.5px까지 축소되던 weighted probability 식을 두 줄로 바꿔 16px로 복구했다.

## Viz 시스템

공유 파일 `practical-strategy/viz/CompetitionEvidenceLabs.tsx`에 여덟 Lab을 두었다.

1. `CompetitionContractLab`: data shape에 따라 필요한 evidence order가 바뀐다.
2. `MetricDecisionLab`: prevalence, FN cost와 review capacity가 rank/action/probability metric을 바꾼다.
3. `SplitContractLab`: IID/group/time/group+time policy와 leakage 판정을 바꾼다.
4. `EvidenceLedgerLab`: 빠진 field마다 재검증 불가능한 원인이 달라진다.
5. `SearchGateLab`: observed delta, noise, compute와 trial count가 stop 결정을 바꾼다.
6. `PruningEvidenceLab`: fast/late/unstable curve와 step이 hold/continue/prune을 바꾼다.
7. `ParetoBudgetLab`: latency·memory budget이 feasible Pareto 후보를 바꾼다.
8. `EnsembleGateLab`: lift, error correlation, latency와 calibration이 release 후보를 바꾼다.

초기 `SplitContractLab`은 무관한 축에 빨간 “위험”을 보이면서 현재 목적은 초록 “사용
가능”으로 표시했다. 이를 다음 상태로 분리했다.

- 요구 축 충족: `통과`
- Time prediction에서 기존 고객 반복을 의도적으로 허용: `기존 고객 허용`
- 현재 contract가 평가하지 않는 축: `계약 밖`
- 반복 고객이 있는데 IID를 가정: `IID 가정 위반`, `생성 과정 재검토`
- Group+time strict fixture에서 validation 고객의 과거 행: `학습 제외`

`99` sentinel로 첫 valid index를 찾던 구현도 `findIndex`와 명시적 축 검사로 교체했다.

## 수식 규칙

- 모든 display formula는 `String.raw`와 `MathFormula`를 사용한다.
- 의미가 있는 term은 수식 안에 한국어 `underbrace`로 표시한다.
- 모든 display formula 바로 뒤에 `FormulaNote`가 있고 `data-formula-pair`로 검증한다.
- FormulaNote는 기호 뜻뿐 아니라 왜 절댓값, 제곱, 곱, log, 할인, 정규화를 쓰는지 설명한다.
- 390px에서 raw LaTeX, horizontal scroll과 clip이 없어야 한다.
- 최종 390px의 최소 렌더 글자 크기는 약 12.1px이며 weighted ensemble 식은 16px다.

## Context Manager · Claude 검증 기록

첫 줄이 `[claude-code:sonnet`인 결과만 formal audit로 채택했다.

### 폐기한 시도

- 네 묶음 병렬 요청: 7분 동안 반환이 없어 실행 종료. 결과 0건으로 기록했다.
- 두 묶음 재시도:
  - split/tracking: 180,544ms 뒤 code 143 timeout
  - workflow/metric: 300초 무응답 timeout
- `worker=claude-code` 결과:
  - `[claude-code · L1 · $0.0000 · 58675ms]`
  - model identity가 header에 없어 formal Sonnet audit에서는 제외했다.

500, timeout, headerless와 model identity 없는 응답을 성공으로 바꾸지 않았다.

### 채택한 실제 Sonnet 감사

- Metrics: `[claude-code:sonnet · L1 · $0.0000 · 112401ms]`
  - AP 평균 단계, Brier·OOF·guardrail 설명, F-beta 연산 이유, ROC FPR 분모와 NDCG 깊이를 보강했다.
  - 공유 Viz 경로 결합 지적은 series-level shared lab이라는 spec에 따라 기각했다.
- Workflow: `[claude-code:sonnet · L1 · $0.0000 · 108140ms]`
  - 첫날 artifact 순서, calibration fit boundary, fold·near duplicate·noise와 뒤 글 handoff를 보강했다.
  - Overview 한 편에 stacking 세부를 중복하라는 해석은 전체 6-step path acceptance에 따라 기각했다.
- Cross-validation/Split: `[claude-code:sonnet · L1 · $0.0000 · 115253ms]`
  - 관련 없는 위험과 초록 결론의 모순, K-fold/holdout 라벨, audit 미정의를 수정했다.
- Tracking: `[claude-code:sonnet · L1 · $0.0000 · 99551ms]`
  - Ledger field별 실패 원인, OOF·guardrail 정의, seed 허용 범위와 source boundary를 추가했다.
  - Split Lab 재삽입은 앞 단계와의 중복이라 기각하고 dataset/split diff band를 추가했다.
- Tuning: `[claude-code:sonnet · L1 · $0.0000 · 76564ms]`
  - Formula/Viz 불일치, 자동 채택 표현, trial 선택 편향, pruning과 Pareto Viz 누락을 수정했다.
- Ensemble: `[claude-code:sonnet · L1 · $0.0000 · 117440ms]`
  - Calibration gate, pairwise 대상, 음의 correlation과 heuristic 경계를 수정했다.
- Shared Viz/Test: `[claude-code:sonnet · L1 · $0.0000 · 135163ms]`
  - Ensemble test label 불일치, split sentinel 결합, ReactNode type와 실패 분기 test를 수정했다.

## 작은 모델용 재현 IR

4B/9B 모델에 전체 블로그와 대화를 한 번에 넣지 않는다. 먼저 다음 IR을 고정한다.

```yaml
path:
  goal: "future test를 예측하는 재현 가능한 ML release"
  order:
    - problem_contract
    - metric_contract
    - split_contract
    - evidence_ledger
    - bounded_search
    - oof_release
article:
  owns: "one decision question"
  receives: "previous step artifact"
  outputs: "next step input artifact"
  stops_before: "next article's responsibility"
section:
  question: "what can fail?"
  easy_example: "one concrete row/customer/month"
  mechanism: [input, learned_transform, boundary, output]
  failure: "counterexample"
  decision: "adopt / inspect / stop"
source:
  kind: primary_official
  supported_claim: exact
  unsupported_extension: explicit
viz:
  control: reader_change
  state: visible_result
  causal_reason: why_result_changed
  failure_branch: required
formula:
  operation_reason: required
  korean_annotation: required
  immediate_note: required
quality_gate:
  hidden_problem_solved: true
  jargon_defined_before_use: true
  source_scope_match: true
  formula_pair_complete: true
  mobile_min_font_px: 12
  horizontal_overflow: false
```

작업은 다음처럼 좁힌다.

1. **Route**: 목표와 필요한 artifact dependency만 만든다.
2. **Challenge**: 독자가 풀어야 할 숨은 난도 fixture를 먼저 만든다.
3. **Extract**: 공식 원문 하나에서 claim, scope, version과 금지된 일반화를 뽑는다.
4. **Draft one owner**: 한 article만 `질문 -> 쉬운 예 -> mechanism -> failure -> decision`으로 쓴다.
5. **Jargon pass**: 처음 등장하는 약어와 전문 용어를 쉬운 뜻과 기술 정의로 설명한다.
6. **Formula pass**: 판단을 압축할 때만 쓰고 연산 이유와 한국어 주석을 붙인다.
7. **Viz pass**: 정상 상태뿐 아니라 실패 상태에서 결론이 실제로 바뀌게 한다.
8. **Challenge replay**: 본문 밖 지식이 필요하면 그 지식의 owner만 보강한다.
9. **Deterministic QA**: route, metadata, formula pair, overflow, font, keyboard, interaction을 검사한다.
10. **Independent audit**: 파일 하나씩 reviewer에게 주고 factual/semantic finding만 반영한다.

작은 모델의 주요 실패는 순서를 “도구 목록”으로 바꾸는 것, metric과 split의 책임을 섞는 것,
최고 score를 evidence로 오해하는 것, 공식 API 문서를 저자 heuristic의 근거처럼 쓰는 것이다.
`owns`, `receives`, `outputs`, `stops_before`를 생성 전에 채우면 범위를 좁힐 수 있다.

## 검증

- `npx tsc --noEmit`: PASS
- Target ESLint: PASS
- `git diff --check`: PASS
- `npm run build`: PASS, 9,189 modules
- Local Playwright: 20/20
- Production Playwright: 20/20
- Viewport: 390x844, 768x1024, 1440x900
- Six route HTTP: 200
- Raw LaTeX: 0
- Unpaired display formula: 0
- Document/article/lab horizontal overflow: 0
- Interactive failure branches:
  - IID assumption failure
  - incomplete evidence ledger
  - search noise and compute stop
  - pruning hold/prune/continue
  - Pareto budget exclusion
  - ensemble calibration rejection
- Local screenshot: mobile four deep articles and desktop workflow/tracking inspected
- Claude formal audit: 7 accepted, all actionable findings dispositioned

## 운영 배포

- `cm-blog.service`: 2026-07-23 22:59:53 KST 재시작, active
- 운영 경로:
  - `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai?sub=ai-practical-strategy`
  - `/competition-workflow`
  - `/evaluation-metrics`
  - `/cross-validation`
  - `/experiment-tracking`
  - `/hyperparameter-tuning`
  - `/ensemble-methods`

이 기록은 Practical ML competition/evidence path milestone의 release evidence다. 전체 실전 ML의
data, training, tabular, CV, embedding, compression과 LLM adaptation 경로가 모두 끝났다는 뜻은
아니다. 다음 owner는 `ai-practical-data`의 직선형 EDA/feature/augmentation/imbalance 경로를
data audit root와 독립 intervention branch로 재구성하는 작업이다.
