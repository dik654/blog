# Time-series forecasting evaluation content spec

## 1. Reader outcome

The reader can define a real forecasting task at a precise forecast origin, prevent temporal leakage, compare simple and pretrained models on repeated rolling origins, and decide whether a current time-series foundation model is compatible with the target, covariates and uncertainty contract.

This article owns one decision: **is the apparent improvement deployable evidence, or an artifact of task definition, leakage, one-origin luck, metric choice or model-interface mismatch?**

ARIMA, time features and LSTM remain separate mechanism articles. This article is the current-first bridge that tells the reader when and why to open them.

## 2. Private transfer problem

Do not print this problem verbatim in the article. Use it as the completion audit.

> A retailer forecasts the next 24 hourly sales values for 200 stores. The dataset contains promotion schedules, actual end-of-hour inventory, weather observations and store IDs. A team builds all 168-hour windows, normalizes every series with full-dataset mean and standard deviation, randomly splits the windows, and reports one final-origin MAE. A foundation model beats seasonal naïve MAE by 15%. Its nominal 90% interval covers only 61% of actual values. The team wants to deploy it. Decide what is invalid, redesign the evaluation, select permissible covariates and baselines, choose which current foundation-model interface to test, and define a release gate.

### Expected reasoning

1. Define origin `t`, context available at or before `t`, horizon `H=24`, target `y[t+1:t+24]`, retraining cadence and business decision.
2. Promotion schedule is a known-future covariate. Realized inventory and realized weather after `t` are unavailable unless explicitly replaced by forecasts or plans available at `t`.
3. Split the raw timeline before window generation; fit normalization, imputation, feature statistics and model selection on each training fold only.
4. Use multiple rolling origins with the same 24-step horizon and deployment-like refit/update cadence. Keep the last untouched period for final confirmation.
5. Include last-value, seasonal-naïve and a fitted statistical/local baseline. A foundation model must beat the strongest cheap baseline by task family, not only global mean.
6. Compute MASE denominator on training history only. Report horizon-wise error, weighted business error and probabilistic calibration/interval coverage.
7. Reject the current evidence: the random-window split and global normalization leak future information, one origin is unstable, and 61% coverage violates the 90% uncertainty contract.
8. Match interface rather than brand: Chronos-2 is a candidate for covariate-informed/multivariate zero-shot; TimesFM 2.5 can be tested with XReg and quantile head; Moirai 2.0 treats variables independently and therefore does not model cross-store/cross-variate dependence directly.
9. Audit pretraining overlap, model version, latency, memory and fallback. Zero-shot removes target training, not target evaluation.
10. Release only if all leakage tests pass, critical store/horizon slices improve, coverage is calibrated, and runtime budget is met.

## 3. Source and claim ledger

| Source | Use | Boundary |
|---|---|---|
| Google Research TimesFM repository, current through 2026-07-02 | TimesFM 2.5 interface: 200M, 16K context, up to 1K horizon, optional continuous quantile head, XReg | Open research release, not an officially supported universal product |
| Amazon Science, Chronos-2 official article | zero-shot univariate, multivariate and covariate-informed forecasting through in-context learning | Vendor evidence; local distribution and calibration still require evaluation |
| Moirai 2.0, arXiv:2511.11698 | decoder-only, single patch, quantile loss, multi-token prediction, efficiency and explicit lack of cross-variate forecasting | Paper reports benchmark results; no universal superiority claim |
| GIFT-Eval, arXiv:2410.10393 | diverse domain/frequency/horizon/variate benchmark, non-leaking pretraining set, MASE/CRPS and leakage evidence | Public benchmark does not replace deployment-distribution backtesting |
| Forecasting: Principles and Practice 3e, time-series cross-validation | rolling forecasting origin and multi-step evaluation | Educational reference; adapt origin cadence to the actual business process |
| Hyndman & Koehler, Another look at measures of forecast accuracy | MASE definition and scale-free comparison | MASE still needs slice and business-cost interpretation |
| Google Research, TimesFM in-context fine-tuning (2025) | related historical/context examples and separator tokens without target fine-tuning | Relevant examples must be selected without future leakage |

## 4. Required narrative

### 01. Start at the decision time

- Use the question: “At 08:00, what exactly is known before forecasting the next 24 hours?”
- Define forecast origin, context, horizon, target, decision and update cadence.
- Explain that time series is supervised learning with an information boundary.

### 02. Known future is not observed future

- Sort inputs into past target, past observed covariates, known-future covariates, static features and unavailable future observations.
- Interactive contract workbench exposes promotion as allowed and realized inventory/weather as leakage.
- Explain plan-versus-realization version timestamps.

### 03. Split before transform and windows

- Show the invalid pipeline: full transform -> windows -> random split.
- Show the valid fold pipeline: raw temporal split -> fit transform on train -> build causal windows -> forecast.
- Include target-derived rolling features and global scaler leakage.

### 04. Rolling origin mirrors production

- Multiple origins, fixed H=24, expanding or sliding context.
- Refit/update cadence matches production.
- Horizon-wise and store-wise slices.
- One untouched terminal holdout after protocol selection.

### 05. Baselines before foundation models

- last value, seasonal naïve, ARIMA/ETS or local tree/LSTM when justified.
- Foundation model is a candidate, not the baseline definition.
- Cost and failure fallback are part of comparison.

### 06. Point accuracy and uncertainty

- MASE formula with training-only denominator and Korean annotations.
- Quantile pinball loss and interval coverage.
- Explain calibration: nominal 90% should cover near 90% under the evaluated distribution, with slice caveats.

### 07. Read current models by interface

- TimesFM 2.5, Chronos-2, Moirai 2.0 as detailed prose/cards, not a leaderboard table.
- Trace input representation, covariate support, outputs and limitation.
- No claim that a model wins universally.

### 08. Implementation and release gate

- Typed forecast task schema.
- Pseudocode for fold-local transformations and paired candidates.
- Data assertions for timestamp and availability.
- Release gate plus fallback.
- Capability check maps to all ten private-problem insights.

## 5. Formula contract

1. Forecast contract: `f(y_{<=t}, x^{obs}_{<=t}, x^{known}_{t+1:t+H}, s) -> distribution for y_{t+1:t+H}`.
2. Rolling risk: average over origins and horizons, with slice weights.
3. MASE: numerator candidate absolute error, denominator in-sample seasonal naïve error using training history only.
4. Pinball loss for quantile forecast and empirical coverage indicator.

Every display formula must have a directly adjacent `FormulaNote` with Korean explanations for every symbol and for subtraction, average, absolute value, indicator and quantile asymmetry.

## 6. Visual contract

### ForecastContractWorkbench

- Stable 2-column desktop, 1-column mobile.
- Manual variable selection shows availability at forecast origin and whether the feature is allowed.
- Timeline has a clear vertical origin boundary rendered with CSS, not SVG.
- No internal horizontal scroll at 360 px.

### RollingOriginExplorer

- Controls for horizon and origin count.
- CSS grid timelines for train/context and test horizon.
- Same pixel width per time unit within a row; legend outside the plot.
- Results show why one lucky origin differs from mean and worst slice.

### FoundationModelInterfaceCards

- Three prose-first interface cards with input, output, use condition and boundary.
- No score table or “best model” badge.
- Current version/date visible but subordinate to the interface contract.

## 7. Small-model replay packet

Give a 4B-9B writer only:

- reader outcome;
- private retail problem and answer key;
- the seven-source claim ledger;
- four formula contracts;
- three visual contracts;
- exact current model interface facts;
- forbidden claims.

### Forbidden claims

- Random K-fold is acceptable after overlapping windows are generated.
- A known value in the completed dataset was known at forecast time.
- Zero-shot means no local backtest is required.
- One aggregate MAE proves production improvement.
- Nominal quantile labels prove calibration.
- Bigger or newer foundation models always beat seasonal naïve or ARIMA.
- Moirai 2.0 models arbitrary cross-variate dependence.
