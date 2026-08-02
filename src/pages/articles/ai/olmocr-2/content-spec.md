# olmOCR 2 article contract

## Reader contract

- Starts from a counterexample: a lower edit distance can be less correct than a higher edit distance.
- Reconstructs `real page seed -> semantic HTML -> rendered page -> Markdown target + binary tests -> SFT -> RLVR -> checkpoint soup`.
- Separates the six paper-defined unit-test families from the two auxiliary output-format rewards.
- Reads the first-release-to-olmOCR-2 development ladder before attributing the full `+14.2` gain to RLVR.
- Separates three time boundaries:
  - the October 2025 paper result,
  - the October 2025 Ai2 release claims,
  - the current official repository toolkit.
- Ends at the page-parser contract and hands cross-page assembly, release verification, and general RLVR foundations to their own articles.

## Private transfer problem

A two-column scientific page contains a floating caption, a formula with multiple equivalent LaTeX serializations, a table, a repeated footer, and document metadata. Two OCR outputs are given:

- Output A has a larger character edit distance but preserves uninterrupted body reading order, renders the formula correctly, preserves relative table-cell order, removes the footer, emits metadata, and terminates.
- Output B is closer character-by-character but inserts the caption between dependent body paragraphs, renders a wrong formula, flattens one table relation, repeats the footer, omits metadata, and fails to emit EOS.

Using only the article:

1. Explain why edit distance can rank B above A while practical correctness ranks A above B.
2. Map each failure to one of the six paper-defined unit-test families or one of the two auxiliary rewards.
3. In a separate Figure 4-style example unrelated to Output B, compute the page test reward when four of six binary tests pass.
4. Explain why the same unit-test framework can be used for training and evaluation without reusing the same documents or test cases, and name the remaining coverage risk.
5. Read the `68.2 -> 72.8 -> 75.8 -> 78.5 -> 78.5 -> 82.4` ladder without claiming that RLVR alone caused the full `+14.2`.
6. Decide what belongs to page parsing, cross-page assembly, and production release gating.

The article passes only if a reader can solve this without outside explanation.

## Source boundary

### Primary paper

- Allen Institute for AI, *olmOCR 2: Unit Test Rewards for Document OCR* (`arXiv:2510.19817`).
- Direct claims include:
  - Qwen2.5-VL-7B base,
  - six unit-test types,
  - `2,186` synthetic pages and `30,381` test cases,
  - `267,962` SFT pages from more than `100,000` PDFs,
  - one RL epoch, `28` completions per document, `8 x H100`,
  - unit-test pass fraction plus separate EOS and metadata rewards,
  - KL coefficient `beta = 0.01`,
  - six random seeds and checkpoint weight averaging,
  - Table 3 development ladder and category scores.

### Official release

- Ai2 release post supplies release framing, downloadable artifacts, the extra hard-page mixture, and vendor-reported throughput/cost.
- Throughput and cost are labeled Ai2-reported measurements rather than universal hardware-independent facts.

### Current toolkit

- The official `allenai/olmocr` repository supplies current commands, runtime integrations, hardware floor, and multi-node work-queue behavior.
- Current repository facts never overwrite the paper-era training recipe.

### Editorial synthesis

- Page-level verifier design for a reader's own domain, review routing, provenance packets, and cross-page assembly are production guidance, not claims that the paper implemented those exact gates.
- The article must state this boundary where those recommendations appear.

## Narrative contract

1. **Why the usual score can lie**
   - Floating-caption reading-order tie.
   - Equivalent LaTeX strings versus rendered formula correctness.
2. **What the model actually emits**
   - Page raster and metadata in.
   - Ordered Markdown/YAML-style document response out.
   - “End-to-end” does not remove PDF rendering, metadata, retries, or verification.
3. **What a verifier can observe**
   - Text presence.
   - Text absence.
   - Natural reading order.
   - Table accuracy.
   - Math formula accuracy through KaTeX rendering.
   - Baseline robustness.
4. **How synthetic truth is manufactured**
   - difficult real page seed,
   - layout analysis,
   - semantic HTML generation,
   - render-and-refine loop,
   - Markdown and tests derived from the same HTML semantics.
5. **How the reward trains the model**
   - page reward formula,
   - `4 / 6 = 0.67`,
   - EOS and metadata as separate signals,
   - GRPO/RLVR recipe and checkpoint soup.
6. **Why the final gain has several owners**
   - dynamic temperature,
   - prompt-order bug fix,
   - trainer/YAML/image resize/base model,
   - blank-page bug fix,
   - synthetic data/RLVR/soup.
7. **What the evidence proves and does not prove**
   - benchmark categories and splits,
   - framework alignment versus example separation,
   - verifier coverage gaps,
   - current toolkit boundary.
8. **Where to go next**
   - Document AI map,
   - Donut,
   - RLVR,
   - document assembly,
   - OCR runtime evaluation.

## Formula contract

One display equation is required, rendered as a two-line factorization for mobile readability:

1. `p_j(y) = 1[t_j(y) = pass]`
2. `R_tests(y; T) = (1 / |T|) sum_j p_j(y)`

- It contains Korean underbraces for the binary pass decision, the page test reward, and the mean over equally weighted tests.
- A Korean `FormulaNote` explains why the denominator is present, why the reward is interpretable, and what an unencoded property escapes.
- It must not invent a weighted total reward because the paper passage inspected does not disclose combination weights for the auxiliary EOS and metadata rewards.

## Viz contract

### `CorrectnessMetricLab`

- Segmented controls switch among correct tie, interrupted body order, and rendered-math mismatch.
- Shows a compact source sequence and two candidate outputs.
- Displays an explicitly labeled teaching proxy for edit-distance behavior and a source-grounded verifier verdict.
- Never fabricates the paper's exact edit-distance value unless copied and attributed directly.

### `RewardLedgerLab`

- Six toggles map exactly to the paper's six unit-test families.
- Page reward updates from the pass count.
- EOS and metadata are visually separated as auxiliary format signals.
- A `4 / 6 = 0.67` state is directly reachable and tested.

### `DevelopmentLadderLab`

- Uses a milestone control, not a wide benchmark table.
- Shows `68.2, 72.8, 75.8, 78.5, 78.5, 82.4`.
- Each milestone names the causal intervention and its evidence boundary.
- Blank-page handling is shown as a real correctness fix despite no overall score increase.

### Responsive and design

- No fixed-width SVG.
- No horizontal scroll at 390 px.
- Controls have stable dimensions and visible focus states.
- Color distinguishes input, verifier, reward, and evidence roles; color is never the only signal.
- Text never sits on connector lines and no nested cards are introduced.

## Misconceptions to close

- `End-to-end VLM` does not mean PDF rendering, metadata, batching, retry, and verification disappear.
- Binary unit tests prove only the properties encoded by those tests.
- Sharing a unit-test framework does not mean training and evaluation reuse the same examples, but it can align optimization with the benchmark's coverage.
- `+14.2` is not an isolated RLVR effect.
- Two structural uses of six stay separate: six unit-test families and six random-seed runs. The paper's phrase “six months prior” is preserved only as author wording and is not presented as a calendar interval because its February and October release labels do not produce six months.
- A page parser does not solve cross-page document assembly or production release provenance.

## Small-model packet

### 4B

- Provide the private transfer problem, source excerpts, six test definitions, the single reward equation, the exact development ladder, and a fixed section schema.
- Require every paragraph to carry one provenance label: `paper`, `release`, `current repo`, or `editorial`.
- Forbid model rankings, speculative reward weights, and implementation claims not present in the source packet.
- Generate prose first; generate Viz copy only after the transfer answers are complete.

### 9B

- Add the extracted paper sections for Figures 1-4, the synthetic-data recipe, training details, Table 3, and the current repository snapshot.
- Ask the model to produce a claim ledger before prose:
  - claim,
  - source owner,
  - time boundary,
  - confidence,
  - reader misconception prevented.
- Run a second pass that solves the private transfer problem using only the drafted article and revises any unsupported or unreachable answer.
- Run a final UI pass for Korean formula labels, 390 px overflow, control semantics, and internal handoff links.

## Acceptance

- The private transfer problem is solvable from the article alone.
- Every numerical claim has a source and time boundary.
- The six unit tests and two auxiliary rewards are never conflated.
- The `+14.2` gain is decomposed instead of assigned to one intervention.
- Every display formula has Korean internal annotations and a Korean `FormulaNote`.
- All three labs remain readable and operable at desktop and 390 px.
- The article contains question, primer, misconceptions, internal links, capability check, stop rule, and source notes.
