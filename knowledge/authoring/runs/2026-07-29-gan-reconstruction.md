# GAN reconstruction receipt

Date: 2026-07-29
Route: `/lab/blog/ai/gan`

## Why this article was selected

The current AI mastery audit scored GAN 76, the lowest remaining causal
prerequisite in the generative-model track. The score exposed a larger learning
gap:

- the route named GAN losses but did not give the reader a diagnosis procedure;
- minimax saturation, support separation and mode collapse were easy to merge
  into one vague "unstable training" problem;
- WGAN and WGAN-GP appeared as variants rather than repairs to a specific signal
  contract;
- the handoff to Diffusion sounded chronological instead of causal;
- old fixed SVG scenes were small, visually dated and no longer imported;
- the route had no interactive decision state that could test transfer.

The article therefore had to explain not only how GAN trains, but when its
gradient contract fails, what each repair changes, and when a different
generative contract is worth its cost.

## Hidden transfer problem

```yaml
observations:
  real_modes: 4
  generated_modes: 1
  support_overlap: low
  discriminator_fake_score: 0.02
  discriminator_loss: near_zero
  samples: sharp_but_repetitive
requirements:
  coverage: high
  training_stability: high
  sampling:
    - one_forward
    - iterative_allowed
required_decisions:
  - separate minimax saturation from mode collapse
  - use non_saturating only as the first signal repair
  - measure precision and recall instead of sharpness alone
  - state what a Wasserstein critic changes and does not guarantee
  - decide whether fixed denoising targets justify iterative sampling
  - choose the next article and required evidence
```

This case is not printed as an exercise in the article. The prose and Viz must
give enough causal structure for a reader to solve it independently.

## Evidence clocks

The reconstruction keeps four claim clocks separate.

| Clock | Authority | Owned claim |
| --- | --- | --- |
| canonical GAN | Goodfellow et al., 2014 | minimax game, non-saturating heuristic, ideal discriminator |
| signal geometry | WGAN, 2017 | Wasserstein critic and 1-Lipschitz requirement |
| practical regularization | WGAN-GP, 2017 | sampled input-gradient penalty |
| next contract | DDPM, 2020 | fixed noising target and iterative reverse process |

Interactive values are labeled as a teaching fixture. They communicate
direction and trade-offs, not benchmark results.

## Minimum-paper stop rule

The route reads GAN, WGAN and WGAN-GP deeply enough to explain the signal
transition. DDPM is used only to establish the next contract.

The following are deliberately deferred:

- the full catalog of GAN architectures;
- optimal transport proofs;
- modern sampler, DiT and Flow Matching details;
- production image-runtime optimization.

Those questions have their own routes. This prevents a foundation article from
recursing indefinitely into every historical prerequisite.

## Reasoning sequence

### 1. Follow the gradient before naming model families

The opening path is:

`z → G(z) → D(G(z)) → input gradient through D → G parameters`.

It distinguishes freezing discriminator parameters from detaching the
discriminator input. This makes the ownership boundary visible before the
reader sees alternating optimizer code.

### 2. Separate the two generator objectives

The original minimax objective and the paper's non-saturating heuristic are
labeled separately. The article explains why the logarithm creates a large
penalty, why the non-saturating form improves the early logit-gradient signal,
and why this does not itself restore missing modes.

### 3. Separate theorem conditions from actual training

The ideal discriminator expression belongs to an optimal-discriminator
argument. Actual alternating updates usually operate away from that condition.
The WGAN section is similarly bounded: a locally Lipschitz generator makes the
Wasserstein distance continuous and differentiable almost everywhere under the
paper's assumptions, but it does not guarantee a useful update at every step.

### 4. Make failures independently diagnosable

The article distinguishes:

- sharpness or fidelity;
- distribution coverage;
- discriminator saturation;
- oscillation;
- artifact exploitation.

This is why a one-mode output can look sharp while recall remains poor.

### 5. Explain each repair by the operation it performs

The WGAN-GP formula is followed by a Korean operation note:

- sample an interpolation point;
- differentiate the critic with respect to that input;
- measure the gradient with an L2 norm;
- subtract the target slope of one;
- square deviations in both directions;
- scale the local penalty by lambda.

The text also states that this sampled soft penalty is not a proof of a global
1-Lipschitz property and does not automatically eliminate mode collapse.

### 6. Turn the Diffusion handoff into a contract decision

GAN learns a moving comparison function. DDPM supplies a known corruption
process and trains a denoising target at sampled noise states. That stabilizes
the target structure but generation repeatedly evaluates the denoiser.

The conclusion is therefore conditional:

- strict one-forward latency keeps the reader in GAN repair and evaluation;
- high coverage and stability requirements with iterative sampling allowed
  open the Diffusion route;
- neither family is declared universally superior.

## Interactive contract

`SignalContractLab` exposes two controls:

- support overlap: separated or partially overlapping;
- sampling budget: one forward or iterative allowed.

Those controls change diagnosis, safe first repair, signal contract, cost,
current decision and next article. The default case separates weak minimax
signal from poor mode coverage. Switching to one-forward sampling keeps the
decision in GAN; allowing iterative sampling opens the Diffusion baseline.

The scene uses responsive HTML rather than a fixed-width architecture SVG.
Controls are at least 44px, output rows stack on mobile, and the model decision
is not encoded by color alone.

## Removed visual debt

The obsolete `Overview`, `Training`, `Variants` modules and eleven unreferenced
fixed SVG files under `gan/viz` were removed. They were no longer part of the
route and retained the small-label, fixed-canvas style the reconstruction is
replacing.

## 4B reproduction packet

```yaml
article_job:
  explain:
    - implicit_generator_gradient
    - alternating_parameter_boundaries
    - saturation_vs_mode_collapse
    - wgan_gp_signal_repair
    - conditional_diffusion_handoff
hidden_case:
  modes: {real: 4, generated: 1}
  support_overlap: low
  discriminator_fake_score: 0.02
  sample_quality: sharp_but_repetitive
controls:
  support_overlap:
    - separated
    - some_overlap
  sampling_budget:
    - one_forward
    - iterative_allowed
required_output:
  - diagnosis
  - safe_first_action
  - cost
  - next_article
evidence_labels:
  - canonical_paper
  - repair_paper
  - bridge_paper
  - teaching_fixture
```

Give the small model one counterexample: non-saturating loss can improve the
gradient signal while mode coverage remains 1 of 4. Require it to keep those
claims separate.

## 9B reproduction packet

Add:

- exact theorem assumptions and practical boundaries;
- the WGAN-GP operation decomposition;
- precision and recall as separate evaluation axes;
- one-forward and iterative deployment constraints;
- a falsifier for every proposed repair;
- explicit prerequisite and next-route links;
- primary-source claim ownership.

Ask the model to produce:

1. a claim ledger with evidence clocks;
2. a causal section order;
3. one hidden transfer problem;
4. an interactive state-transition table;
5. one misconception boundary per repair;
6. a conditional handoff rather than a winner.

## Claude collaboration

The first two read-only reviews were useful diagnostics but did not begin with
the required strict verdict token. They are not release evidence. They found
the missing decision Viz, unlabeled non-saturating objective, overbroad WGAN
claim, absent WGAN-GP operation explanation, dead visual files and weak
Diffusion handoff.

After reconstruction, two independent Context Manager reviews met the release
contract:

| Scope | Strict receipt | Verdict |
| --- | --- | --- |
| current facts and paper boundaries | `.codex-tmp/claude-gan-postedit-2026-07-29/facts.raw.json` | ACCEPT |
| hidden transfer, responsive UI and route handoff | `.codex-tmp/claude-gan-postedit-2026-07-29/transfer.raw.json` | ACCEPT |

Both returned HTTP 200, `ok=true`, `claude-code:sonnet`, first-attempt success,
a substantive answer beginning with `ACCEPT`, and stable source hashes.

## Verification

- selected ESLint: pass;
- `npx tsc --noEmit`: pass;
- local GAN learning contract: `5/5` pass;
- direct sticky-anchor geometry: article top `80.15625px`, header bottom `57px`;
- mobile and desktop screenshots: no clipping or horizontal overflow;
- formula residue check: no raw `\frac`, `\nabla` or `\mathbb`;
- controls: at least `44px`;
- mastery score: `76 → 100`, prose depth `2,642`;
- formulas: `9`;
- Korean formula notes: `4`;
- internal route links: `7`;
- causal interactive Viz: present.

## Production closure

- production build: Vite `8,765 modules`, `18.22s`, pass;
- `cm-blog.service`: restarted and active;
- built chunk: `dist/assets/gan-NzKOKRp9.js`, `31,911 bytes`;
- public asset: HTTP `200`, immutable;
- public GAN learning contract: `5/5` pass;
- public mobile width: `clientWidth = scrollWidth = 390`;
- public decision-lab width: `358px`;
- public raw LaTeX residue: `false`;
- public mobile and desktop screenshots: inspected;
- built, local-service and public index SHA-256:
  `12218539eb9cf9ec83265d5886822d032d0467cc49570441a5408db33bb244cc`;
- public route:
  `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/gan`.

The post-deployment AI learning-flow audit remains release-clean:

- registered routes: `299`;
- release blockers: `0`;
- review needed: `0`;
- enrichment backlog: `70 → 69`;
- local connection backlog: `50 → 49`;
- formula gaps: `0`;
- global continuity coverage: `299`.
