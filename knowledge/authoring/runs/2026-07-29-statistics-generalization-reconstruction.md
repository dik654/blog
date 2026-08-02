# Statistics and generalization reconstruction receipt

Date: 2026-07-29  
Article: `statistics-generalization`  
Scope: article narrative, formulas, paired comparison lab, evidence claim lab,
responsive behavior, primary-source boundaries, and reproducible review packets

## Why this article was reconstructed

The old article introduced familiar statistical terms, but it did not close the
decision that a learner actually has to make:

> Does a higher score justify a claim about future deployment?

That gap matters because the same observed score can support very different
sentences depending on:

1. the deployment population and estimand;
2. the independent sampling and resampling unit;
3. whether two models saw the same cases;
4. how often validation evidence was consumed during selection;
5. whether the evaluation crosses the same time, site, device, and subgroup
   boundaries as deployment.

The article was therefore changed from a catalogue of terms into one evidence
pipeline. It begins with the desired deployment claim, descends only to the
minimum statistical foundations needed to limit that claim, and hands
implementation details to the articles that own them.

## Hidden transfer problem

This problem was used as an authoring test, not inserted as an end-of-article
exercise:

```text
Model A accuracy: 91.000%
Model B accuracy: 91.583%
Evaluation rows: 1,200
Independent users: 80
Paired outcomes:
  both correct: 1,040
  A only correct: 52
  B only correct: 59
  both wrong: 49
Selection:
  B was selected after 40 trials on the same validation split
Split:
  random rows, so repeated rows from one user can cross the boundary
Deployment:
  next month, a new hospital, and a new device
Guardrail:
  overall accuracy improves, but a rare subgroup drops by 8 percentage points
```

The article is deep enough only if a learner can infer all of the following:

- The target estimand must name the future population and loss.
- `1,200` is the metric denominator, but `80` is the candidate independent
  resampling count.
- The paired point difference is
  `(59 - 52) / 1200 = 7 / 1200 = +0.583 percentage points`.
- This point difference does not create a confidence interval.
- Random-row splitting does not support a new-user claim.
- Forty adaptive validation trials consume that validation evidence.
- A new hospital, device, and month require a future-site/group audit.
- The rare subgroup regression prevents a universal deployment claim.
- Calibration must be remeasured under the deployment population rather than
  treated as a permanent property of the model.
- The next implementation owners are evaluation metrics, cross-validation, and
  experiment tracking.

This transfer problem determined article depth. It did not determine a single
memorized answer or a synthetic numeric confidence interval.

## Narrative derivation

### 1. Start from the claim

The first section asks who, when, and under which loss “B is better” is meant
to describe. Population, estimand, independent unit, and decision cost are
introduced together because separating them into dictionary entries hides
their causal dependency.

### 2. Separate row count from evidence count

The second section makes the `1,200 rows / 80 users` distinction explicit.
This is the minimum bridge from elementary statistics to group leakage,
cluster-aware uncertainty, repeated measurements, document chunks, video
frames, and augmented samples.

### 3. Preserve the paired experiment

The third section follows the four paired outcomes. Common successes and
common failures describe shared performance, while the two off-diagonal cells
determine the observed difference. This prevents a learner from comparing two
aggregate accuracies as if they came from independent experiments.

### 4. Make selection consume evidence

The fourth section gives Train, Validation, and Untouched audit different
authority. Validation is not clean merely because it receives no gradient.
Human or automated choices based on its score still make it part of the
selection loop.

### 5. Treat uncertainty as a procedure

The fifth section does not invent a confidence interval from aggregate counts.
It shows the group bootstrap execution order and explicitly says that
user-level paired outcomes are required to compute the interval. It also
separates a point estimate, uncertainty, and practical usefulness.

### 6. Move the evaluation clock to deployment

The sixth section crosses user, time, site, device, and error-cost boundaries.
Calibration is defined conditionally on a measured population. The rare
subgroup regression is treated as a guardrail failure rather than averaged
away.

### 7. Let evidence change the permitted sentence

The final lab holds the numeric score fixed while the split, selection audit,
and guardrail evidence change. Its output is not a new score. It changes:

- the claim status;
- the sentence that is allowed;
- the sentence that is forbidden;
- the largest remaining alternative explanation;
- the next measurement and implementation route.

The strongest state still forbids “universally superior.”

## Source and intent ledger

| Source | Claim allowed in this article | Claim deliberately rejected |
|---|---|---|
| Cawley and Talbot, JMLR 2010 | A model-selection criterion can itself be overfit, and selection variance can create optimistic bias. | Forty trials always cause one fixed amount of inflation. |
| Varma and Simon, BMC Bioinformatics 2006 | Reusing a cross-validation loop for both tuning and error estimation can bias the estimate; nested evaluation separates roles. | Every nested design is automatically unbiased for every deployment target. |
| Guo et al., ICML 2017 | Modern neural networks tested in the study can be poorly calibrated; temperature scaling performed well in those experiments. | One calibration method or score is guaranteed under every architecture and shift. |
| Ovadia et al., NeurIPS 2019 | Predictive uncertainty and calibration quality can degrade as dataset shift grows in the evaluated benchmarks. | Every production shift has the same degradation curve. |
| WILDS, 2020/2021 | Real datasets contain hospital, time, location, and population shifts, and IID evaluation does not cover them automatically. | A WILDS benchmark result replaces local deployment evidence. |

Local snapshots are stored in
`.codex-tmp/statistics-generalization-sources-2026-07-29/`. The unusable
reCAPTCHA snapshot for Varma and Simon was not treated as evidence; a readable
BMC primary page was captured as `varma-simon-2006-bmc.html`.

## Formula contract

Every displayed expression follows three rules:

1. prose introduces the question before the expression;
2. Korean `underbrace` labels explain why each operation exists;
3. a `FormulaNote` explains the execution order and every symbol.

Long formula groups stay one column while the persistent sidebar constrains the
article. Multiple columns begin only at the extra-wide breakpoint. This avoids
the 768px failure where formula containers fell to 190px and MathFit scaled
important expressions to `0.74`.

The article never prints raw `\theta`, `\frac`, or `\underbrace` source text in
the rendered body.

## Viz decisions

### Paired outcome lab

The matrix is the computation, not decoration. Its three modes expose:

- aggregate score calculation;
- the off-diagonal paired difference;
- the user-group resampling boundary.

The last mode refuses to fabricate a numeric confidence interval from
insufficient aggregate data.

### Evidence claim lab

The controls represent real experimental decisions:

- random rows, grouped users, or future site and grouped users;
- reused validation or untouched audit;
- overall average only or subgroup and calibration checks.

Changing a control changes the semantic claim contract, not merely color.
Controls are at least 44px high. Native `fieldset/legend` rendering was
replaced by explicit accessible groups because it created heavy gray bands on
stacked mobile layouts. Desktop-only minimum heights are not applied to the
stacked mobile and tablet layouts.

## Rejected approaches

- Do not use an arbitrary reliability diagram with a hard-coded ECE. It looks
  like model evidence even when it is only a teaching fixture.
- Do not generate a confidence interval from the four aggregate cells. The
  required user-level cluster distribution is absent.
- Do not put all formulas into two or three columns at the `sm` breakpoint.
  The sidebar makes the middle viewport narrower than a phone content column.
- Do not interpret `95% confidence` as a posterior probability that this fixed
  interval contains the parameter.
- Do not say that a non-significant or wide interval proves no effect.
- Do not let the strongest lab state claim universal superiority.
- Do not duplicate the implementation detail owned by cross-validation,
  evaluation metrics, and experiment tracking.

## Bounded 4B and 9B workflow

Small models should not receive the whole blog, all five papers, screenshots,
and code in one context. Use bounded packets with deterministic checks between
passes.

### Packet schema

```yaml
packet:
  target_question: one decision the learner must make
  article_slice: one or two adjacent sections
  primary_source_excerpt: one claim family
  fixture: only the numbers needed for that decision
  forbidden_inference: one or two overclaims
output:
  verdict: supported | contradicted | unknown
  learner_decision: one sentence
  evidence_boundary: one sentence
  missing_information: list
  next_owner: article slug or none
```

### Recommended passes

1. **Target pass**  
   Input only the deployment scenario and the target-population section.
   Require population, estimand, loss, and independent unit.

2. **Arithmetic pass**  
   Input the four paired cells. Require exact totals and
   `(59 - 52) / 1200`.

3. **Dependence pass**  
   Add `80 users`. Require the group as the resampling boundary and reject a
   row-independent interval.

4. **Selection pass**  
   Add the 40-trial validation loop and the Cawley/Varma excerpt. Require a
   distinction between selection and audit evidence.

5. **Shift pass**  
   Add next month, new hospital, and new device plus the Ovadia/WILDS excerpt.
   Require a bounded future-site/group claim.

6. **Guardrail pass**  
   Add the rare subgroup regression and calibration excerpt. Require rejection
   of the universal average-only claim.

7. **Narrative pass**  
   Join only the accepted learner decisions in causal order. Remove quiz
   wording and preserve the insights needed to solve the hidden problem.

8. **Formula pass**  
   Render each displayed expression, check Korean operation labels, and verify
   that the prose and `FormulaNote` explain the same execution order.

9. **Viz pass**  
   For every control state, compare semantic text attributes and visible claim
   copy. Reject a Viz whose only state change is color or motion.

10. **Deterministic browser pass**  
    Check 390, 768, and 1440px widths, formula scale, document overflow,
    control dimensions, and direct-scroll offset.

### Model-size guidance

For a 4B model, keep one claim family and at most one source excerpt per packet.
Require `unknown` rather than asking it to bridge missing evidence.

For a 9B model, two adjacent claim families can be combined, but arithmetic,
source attribution, and browser geometry should still be checked by scripts.
Neither model size should be trusted to infer a primary source that was not
included in its packet.

## Verification evidence

- TypeScript project build: passed.
- ESLint on the article, Viz, and contract test: passed.
- `git diff --check` on the bounded change set: passed.
- Playwright contract: 8 passed.
- Narrative audit: 3 viewport checks, 0 errors, 0 warnings.
- Viz audit: 3 viewport checks, 0 errors, 0 warnings.
- Mastery heuristic: 100, with all eight checks present.
- Captures and geometry:
  `.codex-tmp/statistics-generalization-postedit-2026-07-29/`.
- Final geometry:
  - 390px: document 390/390, formula minimum scale 1.00, controls at
    least 44px;
  - 768px: document 753/768, formula minimum scale 1.00, paired 2-column
    and claim 3-column groups aligned;
  - 1440px: document 1425/1440, formula minimum scale 0.97, controls at
    least 44px;
  - all three direct-scroll checks keep the claim lab below the 57px sticky
    header, and the icon-only buttons expose both `aria-label` and `title`.
- Pre-edit Claude audit:
  `.codex-tmp/claude-statistics-gap-preaudit-2026-07-29/`.
- Post-edit Claude audit:
  `.codex-tmp/claude-statistics-postedit-2026-07-29/`.
- Strict final Claude receipts:
  - factual source boundaries: `statistics-factual-delta-final`, attempt 7,
    `ACCEPT`;
  - hidden transfer reasoning: `transfer-reasoning-micro`, attempt 8,
    `ACCEPT`;
  - responsive 390px: `responsive-mobile-micro`, attempt 3, `ACCEPT`;
  - responsive 768px: `responsive-tablet-micro`, attempt 4, `ACCEPT`;
  - responsive 1440px: `responsive-desktop-micro`, attempt 2, `ACCEPT`;
  - historical recovery consistency: `historical-postfix-compact`, attempt 5,
    `ACCEPT`.

Every receipt above is HTTP 200, top-level `.ok=true`, selected worker
`claude-code:sonnet`, first attempt `.ok=true`, exact first non-empty
`ACCEPT`, substantive, and source-hash stable. Empty code-143 responses,
responses with prose before `ACCEPT`, and `REVISE` responses were preserved as
invalid evidence rather than counted as successful reviews. Their findings led
to narrower retries or explicit corrections before the final receipts.

## Deployment closure

- Production command: `npm run build:tsc`
- Build result: 8,766 modules transformed; production bundle completed.
- Service: `cm-blog.service` restarted and active.
- Public route:
  `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/statistics-generalization`
- Public response: HTTP/2 200.
- Public main bundle: `assets/index-RRBLleoa.js`.
- Public article chunk:
  `statistics-generalization-Bm9qCGtI.js`; SHA-256
  `ac72c13fd238619a0e7778f2f839a1dbd72bdd5ddd97b3bfe8fb4905f700a341`,
  byte-identical to the local production artifact.
- Public Playwright contract: 8 passed.

Automated scores are selection aids, not proof of pedagogical correctness.
Primary-source review, hidden-transfer reasoning, screenshot inspection, and
strict-valid Claude receipts are separate gates.
