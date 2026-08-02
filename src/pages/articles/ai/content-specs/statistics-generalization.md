# 통계와 일반화 content spec

## Goal
- 독자가 train score를 deployment performance의 증거로 바꾸기 위해 필요한 독립성, split, uncertainty를 설계한다.
- accuracy, calibration, variability, subgroup failure를 하나의 평가 숫자로 축약하지 않는다.

## Hidden mastery problem
> 사용자별 시계열 데이터에서 다음 달 이탈을 예측한다. 같은 사용자의 인접 기록, 전체 기간으로 fit한 normalization, 미래 집계 feature가 있다. Random split 94%, time-group split 76%다. 누수 경로를 찾고 train/validation/test 경계를 다시 설계한다. Accuracy가 같은 두 모델 중 하나는 0.99 확률을 반복해 말하지만 0.8 bin에서 55%만 맞는다. reliability diagram, ECE, Brier를 이용해 배포 결정을 설명하고 여러 seed의 변동성을 보고한다.

## Source and intent ledger
| Source | Adopted claim | Writing intent | Boundary |
|---|---|---|---|
| Deep Learning Book ch. 5, 7 | empirical/generalization error, bias and variance, regularization | optimization과 generalization을 분리 | 고전 U-curve를 모든 deep model의 법칙으로 쓰지 않는다 |
| scikit-learn cross-validation docs | grouped and temporal split preserve dependency boundaries | random split의 낙관적 추정을 진단 | split API를 domain 설계의 대체물로 보지 않는다 |
| scikit-learn calibration docs | reliability curve compares mean confidence with observed frequency; Brier mixes reliability and resolution | accuracy와 probability quality를 분리 | 낮은 Brier를 calibration 단독 증거로 쓰지 않는다 |
| Google Rules of ML | training-serving skew and pipeline leakage are system concerns | feature availability time을 split 안에 포함 | 회사 관행을 보편적 통계 정리로 표현하지 않는다 |

## Full-scope map
| Topic | Depth | Article section | Failure mode |
|---|---|---|---|
| population vs sample risk | deep | `population-sample` | train distribution을 deployment로 동일시 |
| decision-aware splits | deep | `data-splits` | group, time, preprocessing leakage |
| underfit/overfit diagnosis | deep | `overfitting` | capacity 하나만 원인으로 단정 |
| probability calibration | deep | `uncertainty` | accuracy와 confidence reliability 혼동 |
| reproducible experiment | deep | `experiment` | best seed, test reuse, multiple comparison |

## Section intent and proof
1. `population-sample`: empirical risk는 관측 가능하지만 deployment risk는 추정 대상임을 구분한다.
2. `data-splits`: split은 파일을 나누는 행위가 아니라 의사결정과 정보 경계를 나누는 설계임을 보인다.
3. `overfitting`: train/validation trajectory와 여러 seed로 bias/variance 언어의 범위를 제한한다.
4. `uncertainty`: reliability diagram에서 대각선 아래의 과신을 보고 ECE가 binning-dependent임을 설명한다.
5. `experiment`: 평균, spread, sample size, split seed, effect size와 failure slice를 함께 남긴다.

## Viz handoff
- Calibration explorer는 같은 confidence bins에서 calibrated/overconfident accuracy를 전환한다.
- diagonal reference, observed line, ECE를 같은 viewport에 유지한다.
- animation은 line path와 ECE 값만 바꾸며 panel dimensions는 고정한다.

## Coverage gate
- split마다 누가 무엇을 선택하는지 명시되는가?
- preprocessing과 feature time boundary가 split 규칙에 포함되는가?
- ECE와 Brier의 한계가 수식 바로 뒤에 있는가?
- 반복 실험의 평균 외에 spread와 effect size를 요구하는가?
- deployment shift를 모사하는 holdout 전략이 있는가?
