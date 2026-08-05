# LLM readouts reconstruction receipt

Date: 2026-07-29
Route: `/lab/blog/ai/llm-interpretability-readouts`

## Why this article was selected

The AI mastery audit scored this article 76, the lowest remaining causal
prerequisite in the interpretability track. The score reflected a practical
reading problem rather than missing terminology:

- attention, Logit Lens, Tuned Lens and J-lens outputs could all be mistaken for
  the model's actual thought or final probability;
- the old pre-norm block formula could be read as parallel attention and MLP
  updates even though the MLP normally reads the attention-updated residual;
- the J-lens expression did not reproduce the primary source's reusable direct
  readout;
- synthetic confidence bars looked like measurements;
- a null patch result had no backup-path or self-repair guard;
- one successful patch could be overextended into a complete mechanism;
- the route had no interactive evidence escalation or explicit next experiment.

The reconstruction therefore treats every interpretability output as:

`observable → added map → allowed claim → forbidden claim → next intervention`.

## Hidden transfer problem

```yaml
prompt_family: country_to_capital
observations:
  attention:
    source: France
    weight: high
  logit_lens:
    middle_layer_top_token: Paris
  tuned_lens:
    earlier_layer_prediction: Paris
  j_lens:
    high_ranked_directions:
      - France
      - Paris
interventions:
  early_france_to_italy_swap:
    output_effect: none
  later_france_to_italy_swap:
    output_change: Paris_to_Rome
required_decisions:
  - name the tensor and added map for every observation
  - reject "the model thought Paris"
  - reject "attention caused the answer"
  - interpret a null effect without claiming representation absence
  - bound one output-changing intervention to causal relevance
  - choose controls before claiming a mechanism
  - select the next experiment and article
```

The case remains private. The article gives the reader the reasoning structure
needed to solve it without printing the answer as an exercise.

## Evidence clocks

| Clock | Observable | Added map | Maximum safe claim |
| --- | --- | --- | --- |
| attention | routing weights | value and output projections | candidate information route |
| Logit Lens | intermediate residual | identity, final norm, unembedding | token direction directly readable in final coordinates |
| Tuned Lens | intermediate residual | learned affine translator | information can predict the final distribution through this probe |
| J-lens | intermediate residual | corpus-averaged downstream Jacobian | vocabulary-disposed influence tendency in the averaged context range |
| intervention | counterfactual output change | chosen patch or ablation | causal relevance in the tested condition |
| controlled replication | repeated intervention and controls | matched controls and holdout prompts | bounded mechanism component in the tested distribution |

The original model distribution is written as `p_model`. A lens-created
diagnostic distribution is written as `q`. They are never treated as the same
probability.

## Minimum-paper stop rule

This article owns the observation contract for attention and vocabulary
readouts. It reads five primary-source boundaries deeply enough to decide what
each output supports:

- Transformer Circuits for the residual stream and QK/OV split;
- Jain and Wallace for counterexamples to naive attention explanation;
- Wiegreffe and Pinter for the definition and protocol boundary;
- Tuned Lens for the affine translator and distillation objective;
- Jacobian Lens for the averaged downstream map and direct readout.

It deliberately stops before:

- a full catalog of probes and lens variants;
- SAE training and feature dictionaries;
- activation patching implementation details;
- complete circuit discovery;
- claims about hidden chain of thought.

Those have independent questions and routes. This keeps the foundation finite.

## Reasoning sequence

### 1. Fix the observation address

The article starts with layer, token position, component and pre/post-residual
location. A bare phrase such as "layer 12 activation" is rejected because it
cannot be reproduced.

### 2. Restore sequential pre-norm execution

The attention update is added first. The MLP then normalizes and reads that
updated state. This prevents the reader from assigning both components the same
input state when the inspected model executes them sequentially.

### 3. Separate routing from transported content

Attention weights say how values are mixed. The value projection determines
what is transported, and the output projection determines which residual
direction is written. A target-versus-contrast logit margin then gives a
decision-specific direct contribution, while still excluding downstream
indirect effects.

### 4. Separate the final model output from a diagnostic lens

`p_model` runs every remaining layer. `q_l^T` replaces those layers with a
chosen map. Normalization, unembedding and softmax do not make `q` the model's
actual next-token probability.

### 5. Give each lens its exact ownership boundary

- Logit Lens uses the identity map and exposes coordinate mismatch.
- Tuned Lens learns a general affine map `A_l r + b_l`. The official
  implementation may parameterize the map around identity, but a literal
  extra `+r` is not required when `A_l` already denotes a general affine map.
- J-lens averages downstream Jacobians across prompts and source/target
  positions, then maps the activation into a reusable vocabulary readout. The
  average is not prompt-specific attribution.

### 6. Escalate evidence without skipping null results

A no-effect result means necessity was not established for that patch. It may
also reflect the wrong location, weak patch fidelity, a backup path or
downstream self-repair. One output-changing intervention supports bounded
causal relevance, not sufficiency, uniqueness or a complete mechanism.

### 7. Require controls before a mechanism claim

The article names same-norm random directions, reverse swaps, unrelated tasks,
clean/corrupted pairs and held-out prompts. The conclusion still remains a
mechanism component within the tested range.

## Interactive contracts

### Attention contribution fixture

Three one-dimensional cases isolate weight and value:

- case A: weights `(0.8, 0.2)`, values `(1, 0)`, output `0.8`;
- case B: weights `(0.2, 0.8)`, values `(4, 0)`, output `0.8`;
- case C: weights `(0.8, 0.2)`, values `(0, 2)`, output `0.4`.

Opposite attention maps can produce the same projected contribution, and the
same attention map can produce a different contribution. The fixture is
explicitly labeled as synthetic.

### Readout claim lab

The reader controls:

- method: Attention, Logit Lens, Tuned Lens or J-lens;
- evidence: readout only, no effect, one effect, or controlled replication.

Every state changes:

- the allowed claim;
- the forbidden claim;
- the current interpretation;
- the next measurement;
- the next article.

The layout uses full-width evidence rows rather than nested cards. All controls
are at least 44px, the two input panels stack on mobile, and direct scrolling
places the lab below the sticky header.

## Source correction found during review

The first post-edit factual review rejected one source note. Transformer
Circuits 2021 supports the residual-stream and QK/OV claims but is not the
origin of Logit Lens. The note was split:

- Transformer Circuits now owns only residual stream and QK/OV;
- the Tuned Lens note states that it builds on Nostalgebraist's Logit Lens.

The corrected source hash was then reviewed again.

## 4B reproduction packet

```yaml
article_job:
  distinguish:
    - observable
    - added_map
    - diagnostic_output
    - causal_effect
source_spans:
  - one_pre_norm_equation
  - one_attention_contribution_equation
  - one_lens_definition
  - one_primary_source_boundary
required_schema:
  observable:
    tensor: ""
    address: {layer: "", position: "", component: ""}
  map:
    formula: ""
    learned_or_averaged: ""
  allowed_claim: ""
  forbidden_claim: ""
  falsifier_or_next_measurement: ""
unknown_policy: "write unknown instead of inferring a missing source claim"
```

Give the 4B model only one method and one counterexample at a time. For example,
give cases A and B and ask whether different attention weights imply different
projected outputs. Do not ask it to judge the entire interpretability article.

## 9B reproduction packet

Add:

- all four method definitions;
- the private France/Paris transfer case;
- the six evidence clocks;
- two null-effect alternatives: backup path and self-repair;
- one output-changing intervention;
- the responsive interaction state table;
- primary-source claim ownership.

Ask the 9B model to produce:

1. a claim ledger;
2. a causal section order;
3. one hidden transfer solution;
4. allowed and forbidden language for every method/evidence pair;
5. the next control and route for every state;
6. one source-attribution audit;
7. a finite stop rule.

The 9B reviewer must reject any draft that treats decodability as use, a null
effect as absence, or a single effect as a complete mechanism.

## Claude collaboration

The pre-edit reviews were diagnostics and correctly returned `REVISE`. They
found the sequential block issue, incorrect J-lens expression, empirical-looking
confidence bars, missing no-effect guards and 40px controls. One suggested that
Tuned Lens always needed a literal identity term; this was rejected after
checking the paper equation and official implementation separately.

Post-edit validation used Context Manager only:

| Scope | Receipt | Final verdict |
| --- | --- | --- |
| equations, primary-source boundaries | `.codex-tmp/claude-readouts-postedit-2026-07-29/results/facts.raw.json` | ACCEPT |
| private transfer, interaction and responsive UI | `.codex-tmp/claude-readouts-postedit-2026-07-29/results/transfer.retry.raw.json` | ACCEPT |

The first factual pass returned `REVISE` for the Logit Lens source
misattribution and was fixed. A broad transfer retry returned `ok=false` and was
not counted. The narrow retry passed.

Both final receipts returned HTTP 200, `ok=true`,
`decision.worker=claude-code:sonnet`, first-attempt success, a substantive
answer beginning with `ACCEPT`, and stable source hashes.

## Verification

- selected ESLint: pass;
- `npx tsc --noEmit`: pass;
- local learning contract: `7/7` pass;
- mobile, tablet and desktop overflow checks: pass;
- direct sticky-scroll geometry: target top about `80px`, header bottom `57px`;
- controls: at least `44px`;
- raw `\theta` and `\operatorname` residue: absent;
- synthetic `34%`, `58%`, `83%` confidence values: absent;
- mastery score: `76 → 100`;
- prose depth: `3,496`;
- formula notes: `6`;
- internal route links: `7`;
- local causal Viz: `3`.

## Production closure

- production build: Vite `8,765 modules`, `18.16s`, pass;
- `cm-blog.service`: restarted and active;
- built chunk:
  `dist/assets/llm-interpretability-readouts-DhSz2jq8.js`,
  `38,946 bytes`;
- public chunk: HTTP `200`, immutable;
- built, local-service and public index SHA-256:
  `3b628fdbd24bbb7f64a47c3642e17954e12d029c871b6c36c6cba788600bf940`;
- built and local-served chunk SHA-256:
  `947e31baa7839d8ddee5985d857c1dc6e957a1937f77870da010d2c42a4f722c`;
- public learning contract: `7/7` pass;
- public mobile width: `clientWidth = scrollWidth = 390`;
- public claim-lab width: `358px`;
- public direct-scroll claim-lab top: `80.125px`;
- public raw LaTeX residue: `false`;
- public mobile no-effect state screenshot: inspected;
- public route:
  `https://heru.ragdoll-bigeye.ts.net/lab/blog/ai/llm-interpretability-readouts`.

The post-deployment AI learning-flow audit remains release-clean:

- registered routes: `299`;
- release blockers: `0`;
- review needed: `0`;
- enrichment backlog: `69`;
- formula gaps: `0`;
- table-first pages: `0`;
- missing prerequisite metadata: `25`;
- local connection backlog: `49`;
- global continuity coverage: `299`;
- learning-path metadata assignments: `277`.
