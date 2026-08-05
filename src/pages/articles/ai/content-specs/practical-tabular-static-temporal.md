# Practical tabular: static and temporal reconstruction

## Why this milestone exists

The current four articles preserve useful model details but expose them as two short galleries:

- `Gradient Boosting -> TabNet / FT-Transformer`
- `Lag / rolling / cyclic -> event Transformer`

That order omits the evidence contract that makes the transition legitimate. A reader can name algorithms
without being able to decide:

1. whether a row was legal at prediction time,
2. whether a stronger model beat a baseline under the same split and budget,
3. whether order was really lost by flat aggregation,
4. whether a foundation model, a task-trained neural model, or a boosted tree fits the release constraints.

The rewrite keeps every public article URL but turns each article into an independent question with explicit
handoffs.

## Route design

### Static tabular

1. `eda-workflow` - fix row, target, cutoff and hidden dependence.
2. `feature-engineering` - create fold-safe, point-in-time features.
3. `evaluation-metrics` - define the decision score and guardrails.
4. `gradient-boosting` - establish the strong tree baseline and its OOF evidence.
5. `tabular-deep-learning` - escalate only when representation reuse, multimodality, pretraining or the
   measured error slices justify it.

### Temporal tabular

1. `eda-workflow` - identify entity, event time, availability time, cutoff and horizon.
2. `time-features` - replay legal lag, window and calendar features as of every prediction row.
3. `cross-validation` - reproduce deployment time order, gap and label latency.
4. `sequence-modeling-tabular` - preserve event order only after flat temporal baselines expose an order loss.

## Article contracts

### `gradient-boosting`

**Question:** How do we build a strong tabular baseline whose gain is attributable to sequential residual
correction rather than leakage or unequal tuning?

Sections:

- strong baseline before model choice,
- residual correction and functional gradient,
- XGBoost leaf objective and split gain,
- XGBoost / LightGBM / CatBoost as mechanisms, not a winner table,
- fold-safe early stopping and calibration handoff,
- release evidence and stop rule.

Viz:

- residual lab: the learner changes boosting rounds and sees predictions, residuals and loss change;
- system choice lab: row count, categorical share and sparsity change candidate and caveat.

### `tabular-deep-learning`

**Question:** What evidence justifies paying for a neural or pretrained tabular model after a strong tree
baseline?

Sections:

- same split, metric and budget gate,
- scalar/category feature tokenization,
- FT-Transformer feature interaction,
- TabNet as a historical selective-attention design,
- TabPFN pretraining over synthetic datasets and in-context prediction,
- 2026 boundary: TabPFN-3 is a current candidate, not a universal replacement,
- OOF, latency, calibration and deployment release gate.

Viz:

- escalation lab: data size, modality, reuse and latency change the benchmark set, never an automatic winner;
- feature token lab: raw heterogeneous cells become comparable vectors;
- prior-dataset lab: pretraining across datasets is separated from inference on a new table.

### `time-features`

**Question:** At prediction time `t`, which historic facts and aggregates actually existed?

Sections:

- entity row, event time, availability time, cutoff and label horizon,
- strict lag and half-open rolling window,
- point-in-time/as-of join with latency,
- periodic encodings and their model-dependent value,
- forward validation, gap, irregular spacing and label latency,
- replay evidence and feature manifest.

Viz:

- cutoff lab: cutoff and ingestion delay change which events are legal;
- half-open window lab: window size changes included events and the computed mean.

### `sequence-modeling-tabular`

**Question:** When do fixed columns destroy information that an event model must preserve?

Sections:

- define entity, episode, observation window and target event,
- last-value/count/rolling/n-gram baselines before a neural model,
- two sequences with identical aggregates but different order,
- event token = type + numeric values + time delta + position,
- padding, truncation and mask contract,
- RNN/TCN/Transformer choice by evidence and latency,
- temporal OOF and release gate.

Viz:

- order-loss lab: two sequences share counts but produce different next-action evidence;
- sequence input lab: maximum length changes truncation, padding and attention mask.

## Formula rules

- Every display formula uses `String.raw`.
- Every display formula is followed immediately by a Korean meaning and symbol ledger.
- Long objectives are split into aligned rows and named intermediate terms.
- Formula annotation text explains operations in Korean; no unexplained English underbraces.
- Mobile formula scale must remain at least `0.80`; if not, split the formula again.

## Visual rules

- No fixed-coordinate SVG in the new wrappers.
- Use responsive CSS grids, stable min/max tracks and semantic icons.
- Color must encode state together with icon, label and border; color alone is not evidence.
- Controls change explanatory copy, numeric values and verdicts, not merely tint.
- At 390, 768 and 1440 px: document overflow `0`, internal default scroll `0`, text overlap `0`.

## Self-authored hard questions

The milestone is not complete unless the rewritten prose gives enough insight to solve these without adding the
answers as quiz content:

1. A transaction occurred at 10:01, was ingested at 10:07, and a prediction was emitted at 10:05. Decide
   whether the transaction can enter a historical training row and specify the join condition that prevents
   offline/online skew.
2. Derive why squared-error boosting fits residuals, then explain why a general differentiable loss requires
   the negative gradient instead.
3. Given XGBoost and a tabular foundation model with different tuning and inference budgets, design a fair OOF
   comparison and a stop rule that does not select on one noisy validation score.
4. Two user histories contain the same event counts and mean amount but have reverse event order. Show which
   aggregate baseline cannot distinguish them and what representation preserves the missing information.
5. A rolling feature uses `[t-7d, t]`, while the label begins at `t`. Explain the leakage and rewrite the window
   and validation gap using half-open intervals and label latency.
6. A neural model improves average AUROC but worsens calibration, p95 latency and a rare-device slice. Decide
   whether it can replace the tree baseline and what artifacts must be released.

## Primary evidence ledger

- Friedman, *Greedy Function Approximation: A Gradient Boosting Machine*.
- Chen and Guestrin, *XGBoost: A Scalable Tree Boosting System*.
- Ke et al., *LightGBM: A Highly Efficient Gradient Boosting Decision Tree*.
- Prokhorenkova et al., *CatBoost: unbiased boosting with categorical features*.
- Arik and Pfister, *TabNet: Attentive Interpretable Tabular Learning*.
- Gorishniy et al., *Revisiting Deep Learning Models for Tabular Data*.
- Grinsztajn et al., *Why do tree-based models still outperform deep learning on typical tabular data?*
- Erickson et al., *TabArena: A Living Benchmark for Machine Learning on Tabular Data*.
- Hollmann et al., *Accurate predictions on small data with a tabular foundation model*.
- Grinsztajn et al., *TabPFN-3: Technical Report*.
- scikit-learn official `TimeSeriesSplit` and time-related feature engineering documentation.
- Feast official point-in-time join documentation.

Model selection gates, release manifests and the exact route composition are labeled as this curriculum's
engineering synthesis rather than universal standards.
