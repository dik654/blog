# DeepAR (2017) canonical source content spec

## Goal
- 독자가 local model 하나씩 fit하는 방식과 related series 전체를 공유하는 global probabilistic model의 차이를 설명한다.
- Conditioning range의 관측값, prediction range의 ancestral samples, likelihood parameter와 scale correction을 한 실행 trace로 계산한다.
- Paper evidence, calibration, cold-start·missing observation·hyperparameter limitations를 분리하고 현재 rolling backtest로 인계한다.

## Ownership
| Article | Owns | Does not own |
|---|---|---|
| `time-series-forecasting-evaluation` | Current TSFM interface, information availability, leakage-free rolling backtest and release gate | DeepAR source mechanism |
| `paper-deepar-2017` | Global autoregressive distribution, likelihood, item scaling, velocity sampling, sample-path quantiles and source evidence | LSTM gate derivation, current TSFM bake-off |
| `lstm-timeseries` | Recurrent state and LSTM gate mechanics, windowed training baseline | Global probabilistic source evidence |
| `arima` | Local statistical baseline and residual diagnosis | Cross-series parameter sharing |

## Source anchors
| Area | Primary source address | Why |
|---|---|---|
| Research question | Abstract and Section 1 | Many related series, probabilistic output, little-history items |
| Execution | Figure 2 and Equation 1 | Teacher-forced training versus ancestral prediction |
| Likelihood | Section 3.1 | Gaussian and negative-binomial parameters |
| Objective | Equation 2 | Direct log-likelihood optimization |
| Scale | Section 3.3 | `nu_i`, likelihood rescaling and velocity sampling |
| Evidence | Table 1, Table 2, Figures 4-5 | Relative risk, point accuracy, correlation/calibration |
| Reproduction | Supplementary Table 3 | Dataset cadence, window, model and runtime |
| Limits | Section 3.2, Supplementary missing observations | Scheduled sampling, cold-start and unreported missing-data experiment |

## Section plan
1. One global model, many related series
   - local versus global ownership.
   - static item feature and known covariates.
   - Viz: choose series history and inspect shared parameters versus item-specific state.
2. From history to joint future samples
   - `h_it = h(h_i,t-1, z_i,t-1, x_it;Theta)`.
   - factorized conditional likelihood.
   - observed teacher forcing in conditioning/training; sampled feedback in prediction.
   - Viz: step through one training and one prediction trace.
3. Match likelihood to target support
   - Gaussian for real values; negative binomial for positive counts.
   - `Var[z]=mu+mu^2 alpha`.
   - do not claim untested likelihoods were evaluated.
4. Handle power-law scale
   - input division, output parameter rescaling, `nu_i` heuristic.
   - sample training windows proportional to `nu_i`.
   - Viz: compare low/high velocity and see normalized input and sampling exposure.
5. Evidence and joint calibration
   - Table 1 relative 0.5/0.9 risk by dataset/span.
   - Table 2 electricity/traffic.
   - Figure 5 preserves temporal correlation through sample paths.
   - Viz: choose receipt, display exact scope and negative evidence.
6. Limits and current handoff
   - zero-padding for new series, no dedicated cold-start benchmark.
   - missing observation method proposed but experiment omitted.
   - scale heuristic can fail with missing data or large within-item variance.
   - scheduled sampling no significant gain and slower convergence.
   - single train/test process and hyperparameter-overfit warning.
   - hand off to current rolling-origin evaluation.

## Display equations

```latex
\begin{aligned}
h_{i,t}&=h(h_{i,t-1},z_{i,t-1},x_{i,t};\Theta)\\
Q_\Theta(z_{i,t_0:T}\mid z_{i,1:t_0-1},x_{i,1:T})
&=\prod_{t=t_0}^{T}\ell(z_{i,t}\mid\theta(h_{i,t}))
\end{aligned}
```

```latex
\begin{aligned}
\nu_i&=1+\frac1{t_0}\sum_{t=1}^{t_0}z_{i,t}\\
z'_{i,t}&=z_{i,t}/\nu_i\\
\mu_{i,t}&=\nu_i\operatorname{softplus}(o_{\mu,i,t})\\
\alpha_{i,t}&=\operatorname{softplus}(o_{\alpha,i,t})/\sqrt{\nu_i}\\
P(i)&=\nu_i/\sum_j\nu_j
\end{aligned}
```

```latex
\operatorname{Var}[z]=\mu+\mu^2\alpha
```

Every display formula needs Korean operation labels and a nearby FormulaNote explaining why each transform exists.

## Authoring-only transfer problem
Do not publish verbatim.

> 100,000 products have a power-law sales distribution. A new product has two non-zero weeks, while a high-velocity product has a mean of 2,000 and bursty variance. Inventory policy needs the 0.9-quantile of the sum over the next 12 weeks, and three weeks are missing because the product was out of stock. Explain which parameters are global, which state is item-specific, how `nu_i` changes input and likelihood, why independent marginal quantiles cannot replace correlated sample paths, and which paper claim cannot justify the missing-data release.

The article is sufficient only if the reader can derive:
1. Shared RNN/likelihood parameters transfer patterns, while item history, hidden state and features remain conditional inputs.
2. Scale normalization protects network operating range and is inverted in the output distribution.
3. Velocity sampling changes training exposure and is not an unbiased business default.
4. A quantile of a horizon sum must be computed from summed sample paths to retain time correlation.
5. The paper proposes missing-value imputation/exclusion but explicitly omits experimental evidence.

## Viz contract
- DOM/CSS only for text and controls; no fixed-width SVG labels.
- Prose before each Viz.
- Stable dimensions and 12 px minimum labels at 390/768/1440.
- Blue = shared model/state path, emerald = accepted/calibrated evidence, amber = assumption/heuristic, red = unsupported release.
- Fixture values must be labeled as educational fixtures.
- No decorative animation; user-controlled step transitions only.

## Stop rule
Stop at DeepAR as the first required global probabilistic recurrent source. Do not descend through every RNN forecasting paper. Move upward to leakage-free rolling evaluation and current pretrained models once global sharing, likelihood, scale, sample paths and evidence boundaries are understood.
