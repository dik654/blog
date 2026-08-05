# LLM Layer Readout reconstruction content spec

Date: 2026-07-29
Route: `/lab/blog/ai/llm-interpretability-readouts`
Track: `llm-interpretability`

## Article job

이 글은 해석 도구 이름을 나열하지 않는다. 독자가 내부 신호를 보았을 때 아래 네 질문을
분리하게 한다.

1. 원 모델에서 실제로 관찰한 tensor는 무엇인가?
2. 어떤 추가 map으로 사람이 읽을 수 있는 vocabulary 좌표를 만들었는가?
3. 그 readout은 현재 prompt의 실제 출력 원인을 어디까지 말하는가?
4. 다음 주장을 위해 어떤 intervention과 control이 필요한가?

읽힌 token을 곧바로 “모델의 생각”이라고 부르지 않는다. Attention, Logit Lens, Tuned
Lens와 J-lens를 모두 후보 생성 도구로 놓고, 원 모델의 matched intervention에서 주장을
닫는다.

## Ownership and finite stop rule

Deep coverage:

- residual stream의 정확한 순차 update;
- attention weight, weighted value, head output과 logit contribution의 차이;
- final model distribution과 intermediate readout distribution의 차이;
- Logit Lens, Tuned Lens, J-lens의 map, 학습/평균 방식과 허용 주장;
- readout에서 controlled causal evidence로 올라가는 판단 절차.

Brief handoff only:

- J-space와 2026년 global-workspace 실험;
- SAE dictionary와 feature label;
- activation patching, ablation, backup path와 self-repair;
- complete circuit reconstruction.

Those belong to `llm-interpretability-frontier`, `sparse-autoencoder` and
`llm-circuit-analysis`. Interpretability history stops at the residual-stream
and QK/OV framework needed to understand the current measurement. Earlier XAI
history is not a prerequisite.

## Hidden transfer problem

```yaml
prompt: "The capital of France is"
observations:
  attention:
    head_attends_to_france: high
  logit_lens:
    middle_layer_top_token: Paris
  tuned_lens:
    earlier_layer_top_token: Paris
  j_lens:
    ranked_tokens: [France, Paris]
interventions:
  layer_early:
    swap: France_to_Italy
    output_change: none
  layer_late:
    swap: France_to_Italy
    output_change: Paris_to_Rome
required_decisions:
  - name_the_observable_for_each_method
  - reject_hidden_sentence_and_attention_cause_claims
  - interpret_no_effect_without_claiming_representation_absence
  - distinguish_single_intervention_from_controlled_mechanism
  - select_next_measurement_and_article
```

본문에 문제 문장을 그대로 노출하지 않는다. 본문과 Viz만 읽은 독자가 이 증거를 분류할 수
있는지 브라우저 상태 전환과 read-only review로 확인한다.

## Evidence clocks and claim ownership

| Clock | Primary source | Owned claim |
| --- | --- | --- |
| architecture floor | Transformer Circuits, 2021 | residual stream and QK/OV measurement boundary |
| attention debate | Jain & Wallace, 2019; Wiegreffe & Pinter, 2019 | attention is not automatically an explanation; claim depends on definition and protocol |
| predictive readout | Tuned Lens, 2023 | layer-wise affine translators fit the final output distribution |
| tuned-lens causal fidelity | Tuned Lens, Section 4.1 and Figure 8 | Pythia-410M layer 18 CBE directions: tuned-lens influence versus model influence, Spearman rho 0.89; bounded to that reported setting |
| current readout | Jacobian Lens, 2026 | corpus-averaged downstream Jacobian and vocabulary-disposed readout |
| teaching fixture | local interactive states | reasoning direction only, never empirical confidence or model benchmark |

## Full-scope map

| Topic | Must cover | Depth | Risk if omitted |
| --- | --- | --- | --- |
| observable schema | layer, token position, component, pre/post state, tensor shape | deep | “layer activation” becomes ambiguous |
| block order | attention update followed by MLP update in a pre-norm decoder | deep | parallel-update misconception |
| attention | routing coefficient, value content, output projection, residual/downstream path | deep | high weight becomes causal importance |
| logits | final distribution versus readout distribution | deep | lens probability becomes model probability |
| tokenization | token piece, space prefix, byte/Unicode, multi-token concept | brief | top token becomes whole concept |
| Logit Lens | identity map plus final norm/unembedding | deep | early-layer coordinate mismatch hidden |
| Tuned Lens | learned affine translator with distillation target | deep | good prediction becomes native mechanism |
| J-lens | averaged Jacobian map, expectation axes, local-linear and distribution boundary | deep | average sensitivity becomes prompt attribution |
| intervention ladder | readout, no effect, effect, matched controls and holdout | deep | single edit becomes complete circuit |
| feature/circuit handoff | SAE and causal circuit ownership | brief | article expands without a stop rule |

## Reader prerequisites

- residual connection: block output을 기존 state에 더하는 구조;
- matrix projection: vector를 다른 coordinate/readout space로 옮기는 연산;
- softmax: 상대 logit을 합이 1인 표시 분포로 바꾸는 연산;
- Jacobian: 작은 입력 변화가 출력 vector를 어느 방향으로 바꾸는지 나타내는 국소 선형 map.

독자가 여기서 막히면 `transformer-architecture`, `linear-algebra-tensors`와
`probability-information-theory`로 내려간다. 선행 글을 전부 완독해야만 현재 글을 시작하게
하지 않는다.

## Section 1: Observable ledger -- 어느 tensor를 읽는가

- Concept: hidden state, component activation, update, logit과 selected token을 서로 다른
  artifact로 기록한다.
- Exact state flow:
  1. `r_{l,t}` enters attention normalization.
  2. attention writes `a_{l,t}` and forms `r^{attn}_{l,t}`.
  3. MLP reads that updated state and writes `m_{l,t}`.
  4. `r_{l+1,t}` becomes the next shared residual state.
- Required formulas:
  - `r_l^attn = r_l + Attn_l(Norm(r_l))`
  - `r_{l+1} = r_l^attn + MLP_l(Norm(r_l^attn))`
- Formula note: explain why the second sublayer reads the already updated state and why a residual
  observation does not assign authorship to one component.
- Failure boundary: architectures differ; the article states the chosen pre-norm decoder convention
  and tells the reader to inspect the target model.

## Section 2: Attention contract -- where, what and effect

- Concept: attention weight is a routing coefficient, not the carried vector or downstream logit
  effect.
- Required formulas:
  - `y_t^h = W_O^h sum_j a^h_{t,j} W_V^h r_j`
  - `Delta margin^h = (w_y - w_y')^T y_t^h`
- Operation reasons:
  - softmax produces comparable routing shares over allowed keys;
  - value projection determines what a source carries;
  - output projection writes into the residual stream;
  - logit-margin projection asks about one target-vs-contrast decision, not total semantics.
- Viz:
  - two attention patterns with different weights but identical projected contribution;
  - a third counterfactual where the same weight carries a different value and changes the margin;
  - selected state changes weight, value, projected contribution and allowed claim;
  - no generic score bar or decorative arrow.
- Claim boundary: attention patterns can locate routing hypotheses and support a protocol-specific
  explanation, but require values, outputs and intervention for causal language.

## Section 3: Output contract -- model probability or diagnostic readout

- Concept: only the final model path produces the actual next-token distribution for the current
  forward pass.
- Required formula:
  - `p_model(v|x) = softmax(W_U Norm(r_L))_v`
  - `q_l^T(v|x) = softmax(W_U Norm(T_l(r_l)))_v`
- Operation reasons:
  - norm matches the scale/geometry expected by the output head;
  - unembedding turns residual directions into vocabulary logits;
  - softmax creates a ranking distribution;
  - replacing downstream layers with `T_l` makes `q` a diagnostic readout, not the model's actual
    current next-token probability.
- Tokenization boundary: a vocabulary token can be a word piece, whitespace-prefixed piece, byte
  fallback or only one part of a multi-token concept.

## Section 4: Three maps -- identity, learned predictor, averaged sensitivity

### Logit Lens

- `T_l(r)=r`.
- No training; uses the final norm and unembedding directly.
- Allowed claim: a token-aligned direction is directly readable under final output coordinates.
- Failure: early layers may use a different geometry and show biased/noisy tokens.

### Tuned Lens

- `T_l(r)=A_l r+b_l`.
- Translator is fit by distillation to match the final model distribution.
- Allowed claim: an affine probe predicts final-distribution structure from this layer.
- Failure: a predictive probe can skip to the eventual output and does not prove the model uses the
  translator or the same features on the current prompt.

### Jacobian Lens

- `J_l = E_{prompt,t,t'>=t}[partial r_final,t' / partial r_l,t]`.
- `T_l(r)=J_l r`.
- Allowed claim: under the corpus and aggregation recipe, a direction is on average disposed to
  affect present/future vocabulary outputs.
- Failure: the average trades prompt-specific exactness for a reusable map; local linearization,
  corpus shift, aggregation recipe and single-token vocabulary limit remain.
- The article uses the exact readout equation, not only a `delta z` mnemonic.

## Section 5: Readout Claim Lab -- how evidence changes language

The primary Viz has two segmented controls.

Method:

- Attention;
- Logit Lens;
- Tuned Lens;
- J-lens.

Evidence:

- readout only;
- matched intervention, no output effect;
- one intervention changes the output;
- matched random/norm controls and held-out prompts also pass.

Every state changes:

- observed artifact;
- allowed claim;
- forbidden claim;
- interpretation of the evidence;
- next measurement;
- next route.

No-effect means “not shown necessary under this intervention.” It does not prove absence because
backup paths, self-repair, wrong layer/position, probe mismatch and nonlinear effects remain.

One changed output proves bounded causal relevance under the intervention. It does not prove
sufficiency, uniqueness or a complete mechanism. Only controlled replication permits a bounded
mechanism-component claim.

Visual contract:

- responsive HTML, no fixed canvas;
- 44px minimum controls;
- two-column input panel on desktop, stacked on mobile;
- result ledger uses full-width rows rather than nested cards;
- sparse semantic accents with icons and text, never color alone;
- teaching fixture label;
- stable heights for segmented controls;
- selected state is exposed through `data-*` attributes for browser tests.

## Section 6: Handoff -- choose the next experiment

- Attention routing hypothesis: `paper-transformer-circuits-2021`.
- Readout/claim boundary: `llm-interpretability-frontier`.
- Feature direction hypothesis: `sparse-autoencoder`.
- Original-model patch/ablation and controls: `llm-circuit-analysis`.
- Math refresh: `linear-algebra-tensors` and `probability-information-theory`.

The article ends with a `StopRule`: it does not catalog every lens or reproduce all J-space and circuit
experiments.

## Formula contract

Every displayed formula is immediately followed by Korean operation reasoning. Notes must explain:

- why the MLP consumes the post-attention state;
- why softmax weight is not value content;
- why output projection and a contrast logit are needed for a contribution claim;
- why final `p_model` and intermediate `q_l` use different symbols;
- why an affine translator improves prediction without becoming the model's algorithm;
- why the Jacobian is averaged and what prompt specificity is lost.

## Acceptance checks

- direct route and every section anchor land below the sticky header;
- no document horizontal overflow at 390, 768 and 1440px;
- no raw `\frac`, `\partial`, `\mathbb`, `\theta` text;
- every control is at least 44px;
- method and evidence changes alter allowed claim, forbidden claim, next measurement and next route;
- teaching values never appear as empirical confidence;
- final model probability and readout distribution are visibly distinct;
- at least six internal routes are linked with reasons;
- primary source block includes both sides of the attention debate;
- current mastery heuristic reaches 100, but release depends on browser and independent source review;
- Claude facts and transfer closures are strict-valid and source hashes remain stable.
