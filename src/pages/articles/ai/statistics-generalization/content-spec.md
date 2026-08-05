# Statistics and generalization reconstruction spec

Date: 2026-07-29
Route: `/lab/blog/ai/statistics-generalization`
Track owner: `ai-math-evidence-foundations`

## Article job

이 글은 통계 용어 사전이나 교차검증 사용법 모음이 아니다. LLM, vision, robotics,
Document AI, RL, time-series, serving 평가에서 공통으로 다시 쓰는 판단 문장을 만든다.

> 같은 관측 단위에서 비교한 표본 차이가, 선택에 쓰지 않은 증거에서도 유지되며,
> 내가 배포하려는 모집단과 오류 비용에 대해 의미가 있는가?

독자는 글을 읽고 다음 여섯 결정을 할 수 있어야 한다.

1. 예측하려는 값이 아니라 **평가하려는 양(estimand)** 을 문장으로 고정한다.
2. 파일의 행 수와 독립적인 정보 단위를 구분한다.
3. 같은 사례를 본 두 모델은 paired difference로 비교한다.
4. model selection에 사용한 validation과 최종 audit evidence를 분리한다.
5. point estimate, uncertainty, subgroup harm, calibration과 distribution shift를 따로 본다.
6. 다음 구현 작업을 `evaluation-metrics`, `cross-validation`,
   `experiment-tracking`으로 넘긴다.

## Finite foundation boundary

### Deep ownership

- deployment population과 sample의 차이;
- estimand, observation row, independent/resampling unit;
- train/validation/test를 gradient 여부가 아니라 의사결정 권한으로 구분하는 법;
- 같은 사례에서 두 모델을 비교하는 paired difference;
- cluster/group 단위 resampling의 이유;
- point estimate와 interval/uncertainty의 역할;
- adaptive model selection이 validation estimate를 낙관적으로 만드는 경로;
- calibration과 dataset shift를 별도 evidence clock으로 보는 법;
- 평균 개선, subgroup harm와 배포 claim을 함께 닫는 최소 evidence contract.

### Handoff ownership

- splitter별 구현과 nested cross-validation: `cross-validation`;
- task metric, threshold, calibration implementation: `evaluation-metrics`;
- dataset/split/run lineage와 재현: `experiment-tracking`;
- 확률변수, 기대값, 조건부 확률, entropy: `probability-information-theory`;
- causal effect identification은 이 글의 소유 범위가 아니다.

### Stop rule

통계학의 역사나 모든 가설검정을 과거로 내려가지 않는다. 이 글은 현재 모델 평가에서
estimand, unit, selection boundary, uncertainty와 deployment scope를 결정할 수 있는
최소 지점에서 멈춘다.

## Hidden transfer problem

본문에 아래 문제를 문제 형식으로 노출하지 않는다. 본문과 Viz만 읽은 독자가 해결할 수 있는지
사후 Claude review와 browser interaction test로 확인한다.

```yaml
decision:
  candidate_a_accuracy: 0.910
  candidate_b_accuracy: 0.916
observations:
  rows: 1200
  repeated_entities: 80 users
paired_counts:
  both_correct: 1040
  a_only_correct: 52
  b_only_correct: 59
  both_wrong: 49
selection:
  candidate_b_chosen_after_validation_trials: 40
  final_audit_set_used_during_selection: true
split:
  current: random rows
  leak: same user appears in train and validation
deployment:
  time: next month
  site: new hospital
  device: new device
guardrail:
  rare_subgroup_delta_percentage_points: -8
required_decisions:
  - define deployment estimand and acceptable harm
  - reject 1200 as the independent resampling count
  - compute paired point difference from discordant cells
  - distinguish point difference from uncertainty
  - reject the reused validation score as a final audit claim
  - choose group and forward holdout
  - inspect subgroup and calibration under shift
  - route implementation to metrics, cross-validation and tracking
```

Numeric oracle:

```text
A correct = 1040 + 52 = 1092 = 91.000%
B correct = 1040 + 59 = 1099 = 91.583%
paired delta = (59 - 52) / 1200 = 0.005833 = +0.583 percentage points
discordant rows = 52 + 59 = 111
resampling boundary = 80 users, not 1200 independent rows
```

The article must not turn `80 users` into a universal mathematical effective sample size.
It is the independent/resampling boundary for this fixture when users are the independent
sampling units and repeated rows within each user are dependent.

## Evidence clocks

| Clock | Primary source | Owned claim | Boundary |
| --- | --- | --- | --- |
| selection | Cawley & Talbot, JMLR 2010 | a model-selection criterion can itself be overfit; variance creates selection bias | does not prescribe one universal trial limit |
| nested evaluation | Varma & Simon, BMC 2006 | using cross-validation for both tuning and error estimation can bias the estimate | does not make every nested design automatically valid |
| calibration | Guo et al., ICML 2017 | tested modern neural networks can be poorly calibrated; temperature scaling worked well in their experiments | not a guarantee for every architecture or shifted deployment |
| shifted uncertainty | Ovadia et al., NeurIPS 2019 | uncertainty quality can degrade as dataset shift grows | benchmark study, not proof for every production domain |
| real shift | WILDS, 2020/2021 | real datasets exhibit hospital, time, location and population shifts; OOD performance often trails IID | benchmark taxonomy does not replace local deployment evidence |
| teaching fixture | local paired/selection lab | exact arithmetic and reasoning path only | never empirical evidence for a real model |

The rendered source note must name the clock/date and supported boundary. It must not say that a
single paper proves a universal deployment rule.

## Narrative order

### 1. The claim comes first

Question:

> “B가 A보다 좋다”에서 좋다는 말은 누구에게, 언제, 어떤 비용으로 좋다는 뜻인가?

Start from a deployment decision, not a statistics glossary. Define:

- population: the future cases the decision covers;
- sample: the observed cases;
- estimand: the quantity the evaluation wants to estimate;
- estimate: the number computed from the sample.

Required formula, split over responsive lines if necessary:

```latex
\underbrace{R_{\mathrm{deploy}}(\theta)}_{\text{미래 위험}}
=
\underbrace{\mathbb E_{Z\sim P_{\mathrm{deploy}}}}_{\text{배포 모집단에서 평균}}
\left[
\underbrace{\ell(f_\theta(Z))}_{\text{한 독립 단위의 손실}}
\right]
```

Operation note:

- `Z` is one deployment unit, not automatically one table row;
- expectation averages by the target population;
- loss encodes the decision cost;
- a changed population or loss creates a different estimand.

### 2. Rows are not automatically independent evidence

Walk from 1,200 event rows to 80 users. Explain dependence with a concrete story: repeated events
from one user share device, behavior and environment. Randomly splitting rows lets the model see
the same entity on both sides.

Required fixture formula:

```latex
\underbrace{N_{\mathrm{row}}}_{\text{기록 수}}=1200,
\qquad
\underbrace{G}_{\text{독립 사용자 수}}=80
```

Never write `N_eff = 80` without the fixture assumption. The actionable conclusion is:

```latex
\text{resampling unit}
=
\underbrace{g\in\{1,\ldots,80\}}_{\text{사용자 단위}}
```

Handoff: group/time splitter implementation belongs to `cross-validation`.

### 3. Compare the same cases as pairs

Show the four paired cells before giving an average score. Shared wins/losses establish the
baseline; discordant cells determine the accuracy difference.

Required formula:

```latex
\underbrace{\widehat{\Delta}}_{\text{B와 A의 표본 차이}}
=
\frac{
\underbrace{n_{\text{B만 정답}}-n_{\text{A만 정답}}}_{\text{서로 다르게 판단한 행의 순차이}}
}{
\underbrace{N}_{\text{같은 평가 행}}
}
=\frac{59-52}{1200}
=0.00583
```

State that this is a point estimate, not proof. Since rows are clustered, uncertainty must be
formed by resampling users and recomputing the paired difference. Do not present two independent
accuracy intervals as the primary comparison.

### 4. Selection consumes evidence

Explain roles as information flow:

- train may change parameters;
- validation may change model/hyperparameters/thresholds and therefore participates in selection;
- untouched audit/test may authorize the final claim once.

Required formula pair:

```latex
\widehat{\theta}
=
\underbrace{\arg\min_{\theta\in\Theta}\widehat R_{\mathrm{val}}(\theta)}_{\text{validation으로 후보 선택}}
```

```latex
\underbrace{\widehat R_{\mathrm{audit}}(\widehat\theta)}_{\text{선택에 쓰지 않은 마지막 추정}}
```

Explain why 40 noisy looks increase the chance of selecting luck. Do not invent a correction
factor or universal acceptable trial count.

### 5. Uncertainty is a procedure contract

Explain point estimate, standard error/spread and interval in plain Korean. The confidence
interval describes the long-run coverage of a procedure under assumptions; it is not a universal
posterior probability that a fixed parameter lies inside the observed interval.

For a teaching cluster bootstrap:

1. resample 80 users with replacement;
2. keep each selected user's rows together;
3. recompute the paired delta;
4. repeat and take declared quantiles;
5. report the bootstrap variant and assumptions.

Optional compact formula:

```latex
\widehat{CI}_{95\%}
=
\left[
\underbrace{Q_{0.025}(\widehat\Delta^{*})}_{\text{재표본 차이의 아래 경계}},
\underbrace{Q_{0.975}(\widehat\Delta^{*})}_{\text{재표본 차이의 위 경계}}
\right]
```

Do not fabricate a numeric interval because no 80-user allocation is supplied by the fixture.

### 6. Same-distribution success is not deployment success

Use the new-hospital/new-device/next-month case. Separate:

- discrimination or task score;
- probability calibration;
- subgroup/worst-slice harm;
- time/site/device shift;
- operational latency/cost if relevant.

Keep ECE and Brier definitions brief and route detailed metric selection to
`evaluation-metrics`. The old fixed reliability chart may be removed. If retained, it must be
visibly labeled “교육용 모양” and must not show fabricated empirical confidence.

### 7. Claim decision lab

The main interactive Viz is an evidence decision, not a colored glossary.

Controls:

1. evaluation boundary:
   - random rows;
   - user-group holdout;
   - future site + user-group holdout.
2. selection exposure:
   - reused validation;
   - untouched audit.
3. guardrail:
   - average only;
   - subgroup + calibration checked.

For every state, derive:

- independent/resampling unit;
- what evidence was consumed by selection;
- allowed claim;
- forbidden claim;
- largest remaining alternative explanation;
- next measurement and internal article route.

Strongest state still uses bounded wording:

> 이 audit의 future-site/group 조건과 measured slices에서 B의 paired difference를 추정했다.

It must not say:

> B is universally better.

### 8. Close with implementation routes

Visible next links:

- `evaluation-metrics`: choose primary, guardrail, slice and calibration measures;
- `cross-validation`: implement group/time/nested split;
- `experiment-tracking`: preserve dataset, split, trial and audit lineage;
- `probability-information-theory`: descend only when expectation or probability is unclear.

Add a StopRule and capability check that mirrors the hidden transfer decisions.

## Viz design contract

### Paired difference explorer

- CSS layout, not a fixed-coordinate SVG;
- four semantic cells with exact counts;
- segmented modes: total score, paired difference, user resampling;
- selected mode changes the explanation, highlighted cells and next operation;
- no fake confidence bar;
- no nested decorative cards;
- stable height/min-height so state changes do not shift following content;
- 44px minimum controls, visible focus, `aria-pressed`, concise `aria-live` summary;
- use restrained neutral surfaces, emerald for B-only gain, rose for A-only loss, amber for
  unresolved/error boundary;
- transition only opacity/color/position under `motion-safe`, honor reduced motion.

### Evidence claim lab

- full-width bounded tool surface;
- controls stack at 390px and use compact columns at desktop;
- result is separated into observed, allowed, forbidden, next;
- no text smaller than 12px for essential interpretation;
- no horizontal scrolling;
- selected controls and output remain visible after direct anchor scroll.

## Formula rendering contract

- every important displayed equation uses KaTeX source, never raw `\theta`, `\hat`, `\frac`;
- operation explanations appear inside key equations with Korean `\underbrace{...}_{\text{...}}`;
- each display has a nearby `FormulaNote` with symbols, assumptions and non-guarantees;
- split long formulas rather than scaling below `0.86` at 390px;
- browser test reads `[data-math-fit]` `data-math-scale`;
- no formula or annotation exits its parent.

## Responsive and visual acceptance

Viewports: 390×844, 768×900, 1440×1000.

- document horizontal overflow <= 1px;
- Viz controls width and height >= 44px;
- direct-scroll target top is below the sticky header;
- no fixed SVG larger than its container;
- result text does not overlap controls or adjacent sections;
- no generic blue card grid or table-first narrative;
- prose precedes both interactive Viz components;
- mobile screenshot has readable formulas and essential labels;
- public and local DOM produce the same article chunk after deployment.

## Contract tests

1. The article renders paired and claim labs exactly once.
2. The four paired counts produce 91.000%, 91.583% and +0.583pp.
3. `user resampling` states 80 user groups, not 1200 independent rows.
4. Reused validation forbids a final audit claim.
5. Group holdout without future shift remains insufficient for new-hospital deployment.
6. Future-site/group + untouched audit + guardrails yields the strongest bounded claim.
7. Internal links to four owned routes resolve.
8. All essential buttons are at least 44px at three viewports.
9. All display formulas stay at scale >= 0.86 and have local notes.
10. Raw LaTeX, horizontal overflow and console errors are absent.

## 4B extraction packet

```yaml
article: statistics-generalization
invariant: one of
  - estimand_population
  - independent_unit
  - paired_difference
  - selection_audit_boundary
  - uncertainty_procedure
  - shift_guardrail
evidence_slice:
  source_files: 1-3
  formula_or_viz_state: one
expected:
  operation_order: explicit
  allowed_claim: one sentence
  forbidden_claim: one sentence
  handoff: one owner article
browser_oracle:
  viewport: one
  overflow: <= 1
  controls: >= 44
```

The 4B worker extracts and checks one invariant. It does not choose the whole narrative, invent
sources, merge verdicts or declare deployment complete.

## 9B review packet

The 9B reviewer receives all six invariant packets and checks:

1. the estimand stays the same from prose through formula and Viz;
2. row, pair, group and deployment population are never conflated;
3. selection evidence and audit evidence are separate;
4. paired arithmetic is exact;
5. uncertainty claims stay within supplied data and assumptions;
6. calibration, subgroup and shift remain separate evidence clocks;
7. internal ownership avoids duplicating practical articles;
8. mobile/browser evidence and source hashes are current;
9. every accepted Claude receipt passes the strict transport and first-line gate.

The orchestrator alone owns source selection, edits, cross-article ordering, full tests, build,
service restart and public acceptance.
