# ARIMA reconstruction content spec

Date: 2026-07-29

## Article job

This article is the minimum statistical forecasting baseline in the
`ai-timeseries-forecasting` path. A beginner should leave able to calculate one
ARIMA step, diagnose why a candidate failed, and reject ARIMA when the deployment
horizon does not support it.

It does not own:

- the full rolling-backtest implementation contract;
- state-space/Kalman derivations;
- exhaustive automatic order search;
- foundation-model architecture.

Those remain in their linked articles.

## Hidden transfer problem

The article must be sufficient to solve this without printing it as an exercise:

> A monthly demand series has a 12-month pattern, variation that grows with its
> level, a permanent level shift after a policy change, autocorrelated residuals,
> and a production horizon of 24 months. A low-AICc SARIMA candidate wins
> one-step fit diagnostics but loses to seasonal-naive at months 13–24. Decide
> the transformation, differencing order, structural-break treatment, candidate
> search, residual checks, backtest, and release decision without future leakage.

Required insight:

1. stabilise changing variance with log/Box-Cox before differencing;
2. inspect one seasonal difference before adding an ordinary difference;
3. do not treat a permanent level shift as a unit root;
4. encode a known intervention, or fit a post-break window when the regime
   changed; learn that choice inside every fold;
5. use ACF/PACF only to propose small neighbouring candidates;
6. use AICc only to screen comparable in-fold candidates;
7. diagnose residual autocorrelation and interval assumptions separately;
8. score the actual 24-step horizon at rolling origins against seasonal-naive;
9. reject the candidate when the operational horizon loses, even if one-step
   diagnostics look good.

## Narrative

1. Why ARIMA is still the first serious baseline.
2. What stationarity, differencing and inverse transformation mean.
3. Calculate I, AR, MA and reintegration with numbers.
4. Propose candidates from ACF/PACF without pretending to identify truth.
5. Screen comparable candidates with AICc.
6. Diagnose residual signal with plots and Ljung-Box.
7. Separate outlier, level shift and regime change.
8. Validate the exact production horizon with fold-local selection.
9. Extend only when SARIMA or regression with ARIMA errors is justified.

## Visual contract

### `ARIMAPipelineViz`

- HTML-first and responsive; no fixed-width diagram text.
- Toggle variance growth, seasonality, trend and level shift.
- The recommended treatment must change with the toggles.
- ACF/PACF bars must share a visible zero axis.
- The approximate white-noise reference band is computed as
  `1.96 / sqrt(n)` and centred on zero.
- Changing sample size must change the band.
- Residual issue and forecast horizon must change the release decision.
- AICc is never shown as sufficient release evidence.

### `ARIMAComponentsViz`

- Changing AR and MA coefficients changes the numeric forecast.
- The display must expose AR contribution, MA contribution, predicted
  difference and reintegrated level.
- All controls are at least 44px and all text is at least 12px.
- No horizontal scroll at 360, 390, 768 or 1440px.

## Equation contract

Every displayed equation needs Korean annotations and a nearby explanation:

- weak stationarity;
- log inverse median versus mean under a log-normal assumption;
- ARIMA equation;
- reintegration;
- approximate ACF/PACF white-noise band;
- AICc;
- Ljung-Box;
- SARIMA notation;
- regression with ARIMA errors;
- step intervention.

## Source ownership

- Hyndman & Athanasopoulos, FPP3 stationarity/differencing:
  variance transformation, seasonal-first differencing, minimum differencing.
- FPP3 non-seasonal ARIMA:
  core ARIMA equation and parameter meanings.
- FPP3 ARIMA modelling:
  ACF/PACF, AICc search, residual diagnostics and characteristic roots.
- FPP3 residual diagnostics:
  Ljung-Box statistic, multiple-lag caveat, lag heuristic.
- FPP3 time-series cross-validation:
  rolling origin and multi-step scoring.
- FPP3 seasonal ARIMA:
  `(p,d,q)(P,D,Q)_s`.
- FPP3 dynamic regression and forecasting:
  regression with ARIMA errors and future predictor availability.
- FPP3 useful predictors:
  spike, step and slope-change intervention variables.
- Dickey & Fuller (1979):
  unit-root test origin.
- Hurvich & Tsai (1989):
  small-sample information criterion.
- Ljung & Box (1978):
  portmanteau statistic.

## 4B / 9B handoff packet

### 4B

Preserve only:

- question of the section;
- one concrete numeric example;
- one equation with symbol meanings;
- one failure boundary;
- one next-link.

Never infer a structural-break treatment from differencing alone.

### 9B

Additionally verify:

- transformed and original scale are not mixed;
- seasonal and ordinary differencing are ordered and minimal;
- AICc candidates use comparable data and likelihood conventions;
- Ljung-Box degrees of freedom account for fitted AR/MA terms;
- all model-selection work is fold-local;
- the release horizon matches the scored horizon;
- intervention values and future regressors are actually available at origin.

## Acceptance

- Mastery audit score is 100.
- No raw LaTeX, KaTeX error, formula overflow or document overflow.
- Causal Viz state changes are covered by Playwright.
- Current-source Claude reviews separately cover factual boundaries,
  transfer sufficiency and responsive/interactions.
- Only strict Context Manager receipts with a true Claude worker and stable
  source hashes count.
