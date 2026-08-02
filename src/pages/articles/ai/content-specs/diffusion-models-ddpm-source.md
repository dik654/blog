# Diffusion Models · DDPM source reconstruction content spec

## Goal
- 독자가 DDPM을 “noise를 지우는 모델”로만 외우지 않고, tractable posterior에서 noise-prediction objective와 Algorithm 2가 어떻게 나오는지 계산한다.
- 기존 `diffusion-models` 글 안에서 DDPM 2020의 연구 질문·수식·실험 영수증을 소유하고, DiT·Flow Matching은 다음 글로 넘긴다.

## Source anchors
| Area | Source | Why it matters |
|---|---|---|
| Forward posterior | Ho et al. (2020), Eq. 6–7 | Gaussian KL을 closed form으로 계산할 수 있는 이유 |
| Reverse parameterization | Eq. 8–12 | posterior mean 대신 noise를 예측해도 되는 연결 |
| Objective | Eq. 14, Table 2 | `L_simple`이 true VLB의 단순 별칭이 아니라 의도적 reweighting이라는 증거 |
| Sampling | Algorithm 2 | 정확한 one-step update와 마지막 step의 `z=0` |
| Reproduction | Section 4, Appendix B | T, beta schedule, U-Net, normalization, attention, EMA, dropout |
| Evidence | Table 1–2 | sample quality, likelihood와 ablation의 claim boundary |

## Full-scope map
| Topic | Must cover | Depth | Notes |
|---|---|---|---|
| Closed-form noising | `q(x_t|x_0)`와 alpha product | deep | 기존 forward explorer 재사용 |
| Exact posterior | `q(x_{t-1}|x_t,x_0)`, mean, variance | deep | 새 posterior lab |
| Noise target | free label, x0 reconstruction | deep | 기존 training explorer 보강 |
| VLB vs `L_simple` | weighting을 버린 이유와 trade-off | deep | static table 대신 evidence toggle |
| Algorithm 2 | exact update, fixed variance, t=1 branch | deep | 새 one-step sampler lab |
| 2020 recipe | T=1000, linear beta, U-Net details | brief | universal best practice로 일반화 금지 |
| Evidence | CIFAR-10 IS/FID, Table 2 | deep | train-set FID와 test-set FID 구분 |
| Modern diffusion | latent, DiT, flow, solver | defer | 기존 다음 글 handoff 유지 |

## Reader prerequisites
- 정규분포: 평균 주위에 noise가 퍼지는 분포다.
- 조건부확률: `x_t`와 `x_0`를 알 때 직전 상태의 분포를 좁힌다.
- KL divergence: 두 분포가 얼마나 다른지 재는 비대칭 거리다.
- MSE: 예측 noise와 실제 noise의 좌표별 차이를 제곱해 합한다.

## Section 1: Forward process -- 왜 posterior가 핵심인가
- Concept: 여러 step noising을 한 번에 샘플링하고, `x_t,x_0`에서 `x_{t-1}` posterior를 정확히 계산한다.
- Key variables:
  - `beta_t`: step t에서 새로 넣는 variance.
  - `alpha_t=1-beta_t`: 직전 signal을 남기는 비율.
  - `bar alpha_t`: 시작 signal이 t까지 남은 누적 비율.
  - `mu_tilde, beta_tilde`: exact forward posterior의 mean과 variance.
- Execution flow:
  1. `x_0`와 t를 고른다.
  2. closed form으로 `x_t`를 만든다.
  3. `x_t,x_0`가 주어졌을 때 두 관측의 precision을 결합해 `x_{t-1}` posterior를 만든다.
- Viz plan:
  - t slider와 signal/noise 비율.
  - `x_t` evidence와 `x_0` anchor가 posterior mean에 주는 두 가중치를 동시에 표시.
  - posterior variance가 `beta_t`보다 작아지는 이유를 숫자로 검산.

## Section 2: Objective -- 왜 noise MSE인가
- Concept: Gaussian KL이 reverse mean MSE가 되고, mean parameterization을 noise prediction으로 바꾸면 weighted noise MSE가 된다.
- Design insight:
  - 논문 `L_simple`은 exact VLB의 timestep weight를 버려 작은-noise 항의 지배를 줄인다.
  - 따라서 `L_simple`은 “같은 목적함수의 편한 표기”가 아니라 sample quality를 위한 reweighting이다.
- Failure modes:
  - sample quality 개선을 likelihood 개선으로 일반화하면 안 된다.
  - modern learned variance나 v-prediction을 2020 원 논문의 설정으로 소급하면 안 된다.
- Viz plan:
  - `VLB/codelength`와 `L_simple/sample` 토글.
  - 같은 epsilon error가 timestep weight에 따라 다르게 기여하는 모습을 표시.

## Section 3: Algorithm 2 -- 한 step에서 실제로 무엇을 계산하나
- Concept: model이 epsilon을 예측하고 schedule coefficient로 reverse mean을 만든 뒤 fixed variance noise를 더한다.
- Execution flow:
  1. `epsilon_theta(x_t,t)`를 예측한다.
  2. `beta_t/sqrt(1-bar alpha_t)`만큼 빼 clean direction을 만든다.
  3. `1/sqrt(alpha_t)`로 rescale한다.
  4. t>1이면 `sigma_t z`, t=1이면 z=0을 적용한다.
- Viz plan:
  - t, epsilon prediction, z slider.
  - mean correction, stochastic term, final `x_{t-1}`를 별도 band로 표시.
  - t=1 선택 시 stochastic term이 0이 되는 branch를 강조.

## Section 4: Evidence -- 무엇이 입증됐고 무엇이 남았나
- Evidence receipts:
  - CIFAR-10: IS 9.46±0.11, train-set FID 3.17, test-set FID 5.24.
  - Table 2: exact VLB + fixed isotropic variance는 IS 7.67±0.13/FID 13.51, `L_simple`은 IS 9.46±0.11/FID 3.17.
  - Exact VLB는 더 좋은 codelength/NLL을 보였고 `L_simple`은 더 좋은 samples를 보였다.
- Claim boundary:
  - T=1000과 linear beta는 실험 recipe이며 sweep으로 최적임을 증명한 값이 아니다.
  - FID 3.17은 training set 기준이다.
- Stop rule:
  - posterior, reweighted objective, exact Algorithm 2와 evidence boundary를 설명하면 DDPM 바닥은 끝이다.

## Private transfer check
- 새 데이터가 likelihood는 개선하지만 FID가 악화됐다. 본문만 읽고 `L`과 `L_simple`의 weighting, variance choice, sampling branch 가운데 무엇을 먼저 분리 실험할지 설계할 수 있어야 한다.

## Coverage recheck
| Scope item | Covered by | Gap | Fix |
|---|---|---|---|
| Exact posterior | Training section | none | formula + lab |
| Objective trade-off | Training/evidence | none | source receipt |
| Exact sampler | Sampling | none | formula + lab |
| Reproduction values | Evidence | none | compact receipt |
| Modern lineage | Existing modern section | none | next-article link |
