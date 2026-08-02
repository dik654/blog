# A Mathematical Framework for Transformer Circuits (2021) content spec

## Goal
- 독자가 attention map 한 장을 설명으로 오해하지 않고, residual stream의 선형 경로를 따라 QK circuit은 “어디를 읽는가”, OV circuit은 “읽은 것을 logit에 어떻게 쓰는가”를 계산한다.
- zero-, one-, two-layer attention-only toy model의 표현력 계단과 induction head의 K-composition을 재구성하되, 이를 현대 대형 Transformer 전체의 완전한 회로도라고 과장하지 않는다.

## Ownership
| Article | Owns | Does not own |
|---|---|---|
| `llm-interpretability-readouts` | activation, attention weight, logit/lens의 관찰 계약 | weight-level QK/OV factorization |
| `paper-transformer-circuits-2021` | virtual weights, QK/OV circuits, path expansion, head composition, induction evidence | SAE, activation patching, 2025 attribution graph |
| `sparse-autoencoder` | dense activation의 sparse feature dictionary | attention-only weight algebra |
| `llm-circuit-analysis` | patching, attribution, ablation과 causal control | 2021 toy-model reverse engineering 전체 |

## Source anchors
| Area | Primary source | Why |
|---|---|---|
| Residual stream | Elhage et al. (2021), “Virtual Weights…” | component 사이의 암묵적 연결 |
| QK / OV | “Attention Heads as Information Movement” | 선택과 쓰기를 분리 |
| Layer ladder | zero/one/two-layer sections | bigram -> skip-trigram -> composition |
| Induction | “Induction Heads” | K-composition 기반 in-context algorithm |
| Evidence | random repeated token experiment, term-importance analysis | 자연어 패턴 암기가 아닌 mechanism 근거 |
| Limits | model simplifications, discussion | attention-only toy model의 주장 범위 |

## Section plan
1. Residual stream and virtual weights
   - `x_\ell=x_0+\sum_{j<\ell}\Delta x_j`
   - later read matrix and earlier write matrix multiply into `W_I^{(2)}W_O^{(1)}`.
   - Viz: earlier component의 write direction과 later component의 read direction을 선택해 coupling strength를 비교한다.
2. One head, two circuits
   - `A^h=softmax*(x^T W_{QK}^h x)`
   - head output `(A^h \otimes W_{OV}^h)x`.
   - token-space `W_E^T W_{QK}W_E` and `W_UW_{OV}W_E`.
   - Viz: 같은 attention pattern에 OV를 바꾸거나 같은 OV에 QK를 바꿔 “어디”와 “무엇”을 분리한다.
3. Expressivity ladder
   - zero layer: bigram.
   - one layer: bigram + skip-trigram.
   - two layer: Q/K/V composition.
4. Induction mechanism
   - previous-token head shifts key-side information.
   - induction head matches current token to previous occurrence and copies the following token.
   - Viz: `[a][b] ... [a] -> [b]` trace with previous-token and induction phases.
5. Evidence, limitations and handoff
   - repeated random-token evidence.
   - V-composition higher-order terms were small in the studied two-layer model.
   - no MLP, bias, explicit LayerNorm; toy scale.
   - readouts -> source paper -> SAE/circuit intervention route.

## Authoring-only transfer problem
The public article must not print this verbatim.

> A head attends strongly from token `A` to an earlier token `A`, but ablating the preceding-token head destroys the copied next token. Explain why the attention map alone misattributes the mechanism. Identify the QK path, OV path, K-composition, expected copied logit and one causal test in the original model.

The article is sufficient only if the reader can derive:
1. Attention weight says where information is selected, not which logit receives it.
2. OV determines the write effect after selection.
3. The previous-token head can matter through a later head's key even when its own visible output looks unimportant.
4. K-composition shifts the key-side match by one token.
5. Weight algebra is a mechanism hypothesis; intervention is the next evidence rung.

## Viz contract
- DOM layout first; no wide SVG text.
- `min-w-0`, `break-words`, 390 px no overflow.
- Minimum visible label 12 px.
- Ink, blue, emerald and amber have semantic roles; no decorative gradient.
- Prose and formula precede every interactive lab.

## Stop rule
Residual virtual weights, QK/OV separation, the layer expressivity ladder and induction-head K-composition can be explained from one token trace. Do not descend into every pre-Transformer circuit paper. Move forward to SAE or causal intervention when the question changes from weight algebra to feature discovery or causal validation.
