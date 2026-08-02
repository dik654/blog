# ARIMA causal reconstruction receipt

Date: 2026-07-29  
Article: `/lab/blog/ai/arima`  
Scope: transformation, differencing, intervention modeling, candidate
selection, residual diagnosis, rolling-origin release evidence, two interactive
learning surfaces, responsive behavior, and minimum-foundation handoffs

## Why this article was selected

The mastery triage initially scored `arima` at 66. The article named
stationarity, differencing, ACF, PACF, AIC, and residuals, but it did not teach
one reproducible decision process. A reader could memorize `ARIMA(p,d,q)`
without being able to decide whether growing variance should be transformed
before differencing, whether a permanent level shift was a unit root, or
whether a low-AICc model was safe for a 24-step production horizon.

The reconstruction uses one private transfer case:

> Monthly demand has increasing variance, 12-month seasonality, a permanent
> policy level shift, residual autocorrelation, and a 24-month production
> horizon. A low-AICc candidate wins at one step but loses to seasonal naive
> over months 13-24. Which transformations and interventions are justified,
> what evidence rejects the model, and why is a one-step win not a release
> decision?

This problem is not printed as an exercise. It is an authoring gate: the
article and its interactive surfaces must provide enough causal information to
solve it without an external ARIMA cookbook.

After reconstruction, the mastery triage scores the article at 100. All
measured question, capability, source, formula-note, Viz, causal-interaction,
internal-link, and prose-depth checks are enabled. The score is triage rather
than release proof; source review, equation review, browser QA, and production
identity are separate gates.

## Primary evidence and ownership

The article uses the following primary educational source:

- Forecasting: Principles and Practice, transformations:
  `https://otexts.com/fpp3/transformations.html`
- Forecasting: Principles and Practice, stationarity and differencing:
  `https://otexts.com/fpp3/stationarity.html`
- Forecasting: Principles and Practice, non-seasonal ARIMA:
  `https://otexts.com/fpp3/non-seasonal-arima.html`
- Forecasting: Principles and Practice, ARIMA modeling:
  `https://otexts.com/fpp3/arima-r.html`
- Forecasting: Principles and Practice, residual diagnostics:
  `https://otexts.com/fpp3/diagnostics.html`
- Forecasting: Principles and Practice, rolling-origin evaluation:
  `https://otexts.com/fpp3/tscv.html`
- Forecasting: Principles and Practice, seasonal ARIMA:
  `https://otexts.com/fpp3/seasonal-arima.html`
- Forecasting: Principles and Practice, intervention variables:
  `https://otexts.com/fpp3/useful-predictors.html`
- Forecasting: Principles and Practice, dynamic regression:
  `https://otexts.com/fpp3/dynamic.html`
- Forecasting: Principles and Practice, dynamic-regression forecasting:
  `https://otexts.com/fpp3/forecasting.html`
- Forecasting: Principles and Practice, log-scale bias adjustment:
  `https://otexts.com/fpp2/transformations.html`

Source claims are intentionally narrow:

- transformation is considered before differencing when variance grows with
  level;
- seasonal and ordinary differences solve different repeated structure;
- ACF and PACF provide candidate clues rather than a unique order oracle;
- AICc screens in-fold candidates and is not itself a one-step or 24-step
  release metric;
- residual autocorrelation is checked after fitting;
- rolling origins preserve the production-time information boundary;
- interventions represent known events without pretending that every break is
  a unit root.

The article's exact six-stage release lab, four authored signal scenarios,
candidate fixtures, and final go/hold rules are editorial teaching devices.
They are not attributed to FPP3 as a universal certification standard.

## Narrative reconstruction

The old glossary-like sequence was replaced with a production decision chain:

1. define the forecast horizon, decision cadence, baseline, and loss before
   looking at candidate models;
2. inspect level-dependent variance and transform before differencing when the
   data contract allows it;
3. remove known seasonality first, then add the minimum ordinary difference
   still needed;
4. distinguish a permanent level shift from stochastic persistence and encode
   known events with fold-local intervention variables;
5. use ACF and PACF as candidate evidence, then screen a small set with
   in-fold likelihood criteria;
6. reject candidates whose residuals retain correlation, changing variance,
   or unresolved breaks;
7. compare the intended multi-step horizon against a baseline across rolling
   origins;
8. release only when accuracy, interval coverage, diagnostics, and operational
   cost all support the same decision.

The text defines Box-Cox at first use, explains the opposite ADF and KPSS null
hypotheses, distinguishes spike, step, and slope/regime changes, and defines
interval coverage as the fraction of rolling origins whose intervals contain
the realized value.

For log-space forecasts it keeps median and mean distinct:

```latex
\widehat y_{h,\mathrm{median}}=\exp(\widehat\mu_h)
```

```latex
\widehat y_{h,\mathrm{mean}}
=\exp\left(\widehat\mu_h+\frac12\widehat\sigma_h^2\right)
```

The second expression is explicitly conditional on a normal log-space
forecast distribution. It is not generalized to every Box-Cox transform.

## Interactive learning decisions

`ARIMAComponentsViz`:

- exposes `phi_1`, `phi_2`, `theta_1`, and the previous innovation as range
  controls;
- recomputes the AR contribution, MA contribution, next difference, and
  reconstructed level;
- starts from a traceable numerical path:
  `4.6 + 0.2 + 0.6 = 5.4`, then `118 + 5.4 = 123.4`;
- changing `phi_1` to `0.2` visibly changes the reconstructed forecast to
  `121.00`;
- formats display values rather than exposing binary floating-point artifacts.

`ARIMAPipelineViz`:

- changes the rolling-origin contract when the horizon changes;
- maps variance, seasonality, trend, and a level shift to distinct treatment
  decisions;
- changes candidate models when the ACF/PACF evidence type changes;
- recomputes the pointwise white-noise guide as
  `1.96 / sqrt(T)` when sample size changes;
- changes the next action when residuals are white, autocorrelated,
  heteroscedastic, or break-contaminated;
- keeps an autocorrelated model on hold even when its one-step score is good;
- keeps a white-residual model on hold at 24 steps when the seasonal-naive
  baseline wins;
- permits a conditional one-step acceptance only for the authored white-noise
  case.

Both surfaces are HTML-first responsive layouts. They avoid fixed-width SVG
diagrams, horizontal scrolling, tiny labels, and decorative animation that
does not change a learner decision. Content-wide animation remains a later
phase, as requested.

## Context Manager and Claude record

The initial current-source pre-audit found substantive problems rather than
being treated as a ceremonial check:

- structural breaks and interventions were missing;
- log-space inverse prediction had no mean/median distinction;
- the ACF/PACF confidence guide was static;
- the controls did not change downstream reasoning;
- fixed SVG scaling made mobile text too small;
- no test proved that residual state alone could reverse a release decision.

Preserved queues:

- current pre-audit:
  `.codex-tmp/claude-arima-current-preaudit-2026-07-29`
- first closure:
  `.codex-tmp/claude-arima-current-closure-2026-07-29`
- bounded final retry:
  `.codex-tmp/claude-arima-current-final-retry-2026-07-29`

Receipt acceptance required all of:

```yaml
http: 200
ok: true
decision.worker: claude-code:sonnet
attempts[0].ok: true
first_non_empty_line: ACCEPT | REVISE
result: substantive
source_hash_before_equals_after: true
```

HTTP 500, empty output, timeout, a non-Claude worker, or a changed source hash
never counted as approval. Calls were bounded to at most two concurrent
workers. Failed broad checks were split into factual, transfer, and mobile Viz
packets rather than retried as one oversized request.

The first closure returned:

1. factual and equation boundaries: `ACCEPT`;
2. transfer: `REVISE`, because Box-Cox, KPSS, and interval coverage needed
   first-use definitions;
3. mobile Viz: `REVISE`, because the test suite needed a same-horizon
   residual-only decision reversal and explicit 360/768 checks.

Those findings were applied. Final exact-hash receipts are:

1. factual and equation boundaries: `ACCEPT`;
2. transfer and first-use definitions: `ACCEPT`;
3. mobile causal Viz and test contract: `ACCEPT`.

## Bounded workflow for 4B and 9B models

Do not ask a small model to rewrite the entire time-series corpus. Compile one
decision-sized packet:

```yaml
packet:
  forecast_contract:
    target: one
    horizon: one
    cadence: one
    baseline: one
    metric: one
  observed_signal:
    variance_pattern: one
    seasonal_period: integer_or_none
    suspected_break: one_or_none
  candidate:
    transform: one
    seasonal_difference: zero_or_one
    ordinary_difference: zero_or_one
    arima_order: one
    intervention: one_or_none
  evidence:
    residual_state: one
    rolling_origin_result: one
    interval_coverage: one
    source_excerpt: one
output:
  next_operation: one
  rejected_shortcut: one
  release_decision: accept | hold | unknown
  reason: one_to_three
  support: source | editorial | unknown
```

Recommended passes:

1. define the production forecast contract;
2. decide transformation before differencing;
3. distinguish seasonal and ordinary differencing;
4. classify spike, step, and slope/regime change;
5. build only a small candidate set from correlation evidence;
6. screen with AICc without calling it release proof;
7. diagnose residuals;
8. compare the actual horizon with a baseline;
9. check interval coverage;
10. issue a bounded release decision.

The 4B model extracts one field set and must answer `unknown` when evidence is
absent. The 9B reviewer receives that packet plus two counterexamples:

- low AICc with autocorrelated residuals;
- white residuals with a 24-step seasonal-naive loss.

It checks operation order, source ownership, leakage, and unjustified release
claims. Deterministic code checks slugs, formula rendering, numerical control
transitions, viewport overflow, control size, and source hashes. The
orchestrator alone merges sections, runs browser QA, and deploys.

## Current source identity

```text
4f5dea61521e0fc8dc53ec1d6e6ab5badfdfc53e4a89ed47cab0a76123964a52  src/pages/articles/ai/arima/content-spec.md
3472e2cc67a29cfa4102cc29b81ca64742a2fd616f2566cd94738ad9cb29bc6f  src/pages/articles/ai/arima/Overview.tsx
49c0b72d3c5f816ecf9fbb0b1a8033fed595bd925fb578cc32155aefb9322f65  src/pages/articles/ai/arima/Components.tsx
5d1fc0d111629ddaf028588037734b532f64c3532dcfbe5b1420a034407fa224  src/pages/articles/ai/arima/Modeling.tsx
c87e342482a5a7a5741f4070cdad901aa3536d8131f39ca1eaecd4797e3bdecc  src/pages/articles/ai/arima/Applications.tsx
ba966aa5bef91736d283b7d0125a21d435d09e7c822c1eab5560136ac0158396  src/pages/articles/ai/arima/viz/ARIMAComponentsViz.tsx
6fe042a3e9e8f36d8460f8ee3292238a105868e2a7bff67eea2b9b6141bf7e93  src/pages/articles/ai/arima/viz/ARIMAPipelineViz.tsx
f2f91e7ec2019883a2b794d4cef84a293115e543e5b1340145e1bfcc450872e8  tests/timeseries-learning-path-quality.spec.ts
4d98fbe7667f4bbb0e986d57fd436aac6cddfdd286b09463a5c844b38b348ac6  tests/ai-formula-viz-corpus-p3.spec.ts
```

## Verification before deployment

- selected-file ESLint: pass;
- TypeScript type check: pass;
- focused local Playwright: 5/5 pass;
- formula-corpus local Playwright: 2/2 pass;
- full time-series path before the final two causal assertions: 16/16 pass;
- all 11 interactive scenes inspected at 360, 390, 768, and 1440 px;
- horizontal document and stage overflow: zero;
- minimum interactive text size: 12 px;
- minimum control target: 44 px;
- browser console errors: zero;
- mastery score: 66 to 100;
- remaining weak article reference: `vllm-serving`.

## Production closure

- production build: 8,779 modules, pass;
- existing large-chunk advisory only;
- `cm-blog.service`: active from `2026-07-29 16:57:09 KST`;
- public article: HTTP 200;
- public ARIMA JavaScript: `arima--grZawOo.js`, HTTP 200;
- public entry JavaScript: `index-Cxjs6cyH.js`, HTTP 200;
- public CSS: `index-CAXAyZ6K.css`, HTTP 200;
- local and public `index.html` SHA-256:
  `8051b6c374aaeb349342fad09d2f364fbd5dc51b1eccc652311433670dc28b6d`;
- public focused ARIMA Playwright: 5/5 pass;
- public annotated-formula Playwright: 2/2 pass;
- public full time-series learning path: 18/18 pass;
- public responsive coverage: 360, 390, 768, and 1440 px;
- public horizontal overflow: zero;
- public browser console and page errors: zero;
- public mobile screenshot:
  `.codex-tmp/arima-public-mobile-2026-07-29.png`.
