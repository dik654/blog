# Donut (2021) canonical source content spec

## Goal
- 독자가 OCR-free를 "글자를 읽지 않는다"가 아니라 "외부 OCR의 text·box를 downstream model의 필수 입력 계약으로 두지 않는다"로 설명한다.
- Document image가 Swin patch embeddings, autoregressive BART tokens, reversible field grammar를 거쳐 JSON이 되는 실행 순서를 재구성한다.
- Classification·IE·DocVQA 증거를 서로 섞지 않고, resolution·OCR engine·private data·pseudo label의 한계까지 읽는다.

## Ownership
| Article | Owns | Does not own |
|---|---|---|
| `ocr-document-ai-map` | 2026 page parser -> assembler -> verifier -> RAG release map | Donut의 2021 OCR-free source mechanism |
| `paper-donut-2021` | OCR-free boundary, Swin/BART sequence generation, field grammar, pseudo-OCR pretraining, source evidence | Cross-page document assembly, production provenance design |
| `document-structure-assembly` | Typed page blocks에서 cross-page relation과 document tree를 조립 | Raw page image에서 token sequence를 생성 |
| `ocr-runtime-evaluation` | Golden set, verifier, review queue와 release evidence | Donut paper의 training objective와 benchmark reconstruction |

## Source anchors
| Area | Primary source address | Why |
|---|---|---|
| Problem | Sections 1 and 2.1 | OCR compute, language/domain inflexibility, error propagation |
| Architecture | Section 2.2, Figure 3 | image -> Swin embeddings -> BART tokens -> JSON |
| Output grammar | Section 2.2, Appendix Figure E | START/END field tokens and malformed-field loss |
| Pretraining | Section 2.3, Figure 4 | reading-order objective, IIT-CDIP pseudo labels, SynthDoG |
| Metrics | Section 3.1 | exact field F1 versus TED-based structural accuracy |
| Evidence | Tables 1-3, Figures 6-9 | classification, IE, DocVQA, resolution and OCR-engine scope |
| Reproduction | Section 3.2, Appendix A.5-A.6 | model shape, data, compute, resolution and small-resource setup |

## Section plan
1. Remove the OCR contract
   - conventional OCR pipeline and Donut end-to-end path.
   - OCR-free does not mean text-free, label-free, or provenance-complete.
   - Viz: switch pipeline; expose intermediate artifact, error propagation and retained evidence.
2. Execute image-to-structure generation
   - `x -> E(x)={z_i} -> D(prompt,y_<t,z) -> y -> parse(y)`.
   - Swin patch hierarchy and first four multilingual BART layers.
   - teacher forcing at train time and autoregressive token feedback at inference.
3. Make JSON a token grammar
   - `[START_field] value [END_field]`.
   - missing end token loses the field; it is not silently repaired.
   - Viz: classification, IE and VQA sequences; valid/malformed parse states.
4. Pretrain reading before understanding
   - pseudo-OCR next-token objective.
   - 11M IIT-CDIP labels from CLOVA OCR plus 2M SynthDoG across four languages.
   - source-label dependence remains even when inference is OCR-free.
5. Read evidence by task and metric
   - Table 1 classification latency/accuracy with P40 and selected OCR APIs.
   - Table 2 IE F1/TED and task-specific resolution.
   - Table 3 DocVQA negative result and handwritten slice.
   - Figure 7-9 resolution, pretraining and OCR-engine analyses.
   - Viz: select receipt; show winner, non-winner and scope before interpretation.
6. Limits and current handoff
   - tiny text and resolution/compute trade-off.
   - private datasets and OCR-derived pseudo labels.
   - cross-attention localization is an auxiliary indicator, not proof.
   - modern page block provenance and cross-page assembly remain a separate system concern.

## Display equations

```latex
\begin{aligned}
p_\theta(y\mid x,p)
&=\prod_{t=1}^{m}p_\theta(y_t\mid y_{<t},E(x),p)\\
\mathcal L_{\mathrm{NTP}}
&=-\sum_{t=1}^{m}\log p_\theta(y_t^\star\mid y_{<t}^\star,E(x),p)
\end{aligned}
```

Explain in Korean why image evidence, task prompt and previous token are all conditioned, and why teacher forcing uses ground-truth prefix only during training.

```latex
\operatorname{TEDAcc}(pr,gt)=
\max\left(0,1-\frac{\operatorname{TED}(pr,gt)}
{\operatorname{TED}(\varnothing,gt)}\right)
```

Explain why the empty-tree distance normalizes document size and why this metric complements rather than replaces exact field F1.

## Authoring-only transfer problem
Do not publish this verbatim.

> A receipt system gets exact field F1 0 for one menu item because one character is wrong, but its JSON group hierarchy is almost correct. A second system gets all strings right but attaches one price to the wrong item. Decide what field F1 and TED accuracy each can and cannot reveal. Then explain whether replacing OCR with Donut alone solves the release problem when the product must cite page coordinates and join a table across pages.

The article is sufficient only if the reader can derive:
1. Exact field F1 penalizes a one-character miss as a failed field and ignores hierarchy.
2. TED accuracy measures edit distance in the predicted tree and can expose grouping differences.
3. Neither metric alone proves provenance, calibration, cross-page consistency or production fitness.
4. Donut removes the external OCR input boundary at inference but does not automatically emit production block provenance.
5. Page parsing and document assembly remain separate failure owners.

## Viz contract
- DOM/CSS layout; no fixed-width SVG text.
- Prose before every Viz.
- `min-width: 0`, breakable tokens and 390 px no overflow.
- Every visible label at least 12 px.
- Blue = image/structure, emerald = accepted parse/evidence, amber = uncertain/scope, red = failed field only.
- No decorative arrows spanning the viewport and no nested cards.
- Motion only on user interaction; respect reduced motion.

## Stop rule
Stop at the first architecture that established OCR-free image-to-structured-token generation. Do not descend through the full OCR history. Move forward to current page parsers, typed block provenance and cross-page assembly when the question changes from source mechanism to production evidence.
