# olmOCR 2 source-first reconstruction receipt

Date: 2026-07-29
Article: `/lab/blog/ai/olmocr-2`
Scope: article prose, equations, interactive visualizations, metadata, and
responsive behavior

## Why this article was selected

The mastery audit scored the previous article at 36. It named the model and
some headline results, but it did not give the reader a causal path from
"OCR output looks plausible" to "the document contract is objectively
testable." It also did not provide enough evidence to distinguish:

1. string similarity from semantic correctness;
2. a paper claim from an Ai2 release-page claim;
3. the October 2025 training recipe from the current repository interface;
4. the six document tests from unrelated counts such as six training seeds.

The reconstruction therefore targets one transfer problem:

> Given an OCR output that looks fluent but moves a caption, breaks a formula,
> or changes a table cell, can the reader define a verifier, calculate the
> resulting reward, explain how synthetic pages make that verifier possible,
> and state what the paper still does not prove?

After the rewrite, `scripts/audit-ai-mastery-coverage.mjs` scores the article
at 100 with a prose depth of 4,401 and all measured learning-contract checks
enabled.

## Primary evidence and time boundaries

Primary sources:

- Paper: `https://arxiv.org/abs/2510.19817`
- Ai2 release: `https://allenai.org/blog/olmocr-2`
- Current official repository: `https://github.com/allenai/olmocr`

Local evidence copies:

- `tmp/pdfs/olmocr2/olmocr2.pdf`
- `tmp/pdfs/olmocr2/olmocr2.txt`
- `tmp/sources/olmocr2/ai2-release.html`
- `tmp/sources/olmocr2/README.current.md`

The article labels evidence by owner and date. The paper and release describe
the October 2025 system; the repository section describes the interface visible
on 2026-07-29. Current installation requirements are not projected backward
into the paper, and paper measurements are not presented as independent
benchmarks.

One source ambiguity was preserved instead of silently repaired. The paper
prose describes the first olmOCR release as roughly six months earlier, while
its own development table labels the releases February 2025 and October 2025.
The article now attributes the wording to the authors and avoids calculating a
false exact interval. The visualization uses `FIRST RELEASE -> OLMOCR 2`
instead of a six-month label.

## Source-grounded claims

The article exposes these claim families:

- six document-level tests:
  Text Presence, Text Absence, Natural Reading Order, Table Accuracy,
  Math Formula Accuracy through KaTeX, and Baseline Robustness;
- failure cases where low edit distance still misses a floating caption or a
  rendered formula;
- the synthetic pipeline:
  real page, layout analysis, semantic HTML, render/refine, Markdown and tests;
- 2,186 synthetic pages and 30,381 generated tests;
- an SFT mix of 267,962 pages from more than 100,000 PDFs, including 9,828
  archive pages;
- the release page's additional 20,000 difficult handwritten and typewritten
  pages;
- one RL epoch, 28 completions per document, eight H100 GPUs, `beta = 0.01`,
  six seeds, and model soup;
- test-pass fraction as the principal verifier reward, with EOS and metadata
  rewards kept as separately disclosed auxiliary signals;
- the reported development ladder:
  68.2, 72.8, 75.8, 78.5, 78.5, and 82.4;
- the reported observation that a trainer change did not improve olmOCR 2's
  score while slightly improving Qwen in the comparison;
- current README paths for remote, local, vLLM, and S3 multi-node execution;
- the current local-run floor of at least 12 GB VRAM and 30 GB disk, with the
  README-tested RTX 4090, L40S, A100, and H100 devices.

The article explicitly does not invent undisclosed reward-combination weights.
It also does not turn Ai2's own benchmark report into a vendor-neutral result.

## Narrative decisions

The old fact-sheet shape was replaced by a dependency chain:

1. define why edit distance is the wrong target;
2. turn document meaning into an executable verifier contract;
3. create pages whose structure and tests are known;
4. use pass fraction as RLVR feedback;
5. inspect the ablation ladder to see which ingredients mattered;
6. mark the evidence boundary;
7. connect the paper to the current toolkit without merging their dates.

Every interactive scene follows a question instead of appearing immediately
under a heading. Each scene changes the state that the adjacent prose asks the
reader to predict:

- `CorrectnessMetricLab` contrasts fluent-looking output with structural
  correctness;
- `RewardLedgerLab` lets the reader change individual document-test outcomes
  and observe `4/6`, `5/6`, and `6/6`;
- `DevelopmentLadderLab` reveals the reported additions and score changes as a
  causal ladder rather than a static comparison table.

The article ends each major concept with a misconception, capability check, or
stop rule. These are not trivia questions inserted into the prose. They are
private transfer checks used to decide whether the prose contains enough
information for a new case.

## Equation and mobile-layout decision

The reward definition is rendered as two equations:

```latex
p_j(y)=\mathbf{1}[t_j(y)=\mathrm{pass}]
```

```latex
R_{\text{tests}}(y;T)=\frac{1}{|T|}\sum_{j=1}^{|T|}p_j(y)
```

Each symbol has a Korean semantic annotation and a prose `FormulaNote`. The
definition was split because a single long annotated expression either shrank
below a readable size or overflowed a 390 px viewport. The two-line form keeps
the formula at normal text scale and preserves the conceptual order:
individual pass indicators first, their mean second.

The page contains no wide comparison table or preformatted block. Controls use
responsive grids, stable button dimensions, and wrapping labels. The
development ladder names the endpoints by release role instead of by a
disputed elapsed-time calculation.

## Context Manager verification record

Preserved queues:

- pre-audit:
  `.codex-tmp/claude-olmocr2-preaudit-2026-07-29`
- first final audit:
  `.codex-tmp/claude-olmocr2-final-2026-07-29`
- post-fix audit:
  `.codex-tmp/claude-olmocr2-final-postfix-2026-07-29`
- exact current-source closure:
  `.codex-tmp/claude-olmocr2-exact-closure-2026-07-29`

Failure handling:

- a timed-out or empty factual response was rejected and reissued;
- a timed-out responsive review was rejected and reissued;
- a response that discussed facts correctly but did not begin with an exact
  `ACCEPT` or `REVISE` verdict was not counted;
- findings were applied only when the reviewer packet had stable before/after
  source hashes;
- every valid `REVISE` was followed by a new audit of the edited source.

Valid revisions caused the article to:

- make the independent `4/6` reward example explicit;
- distinguish the six tests from six training seeds;
- replace "vendor measurement" with the more precise "Ai2 자체 보고";
- add the 20,000 difficult-page release detail;
- add the current README hardware floor;
- retain the no-score-change trainer observation;
- strengthen the reward-interpretability note;
- remove the unsupported exact six-month timeline label.

The exact closure ran on the current hashes and returned three strict-valid,
stable `ACCEPT` verdicts:

1. factual and evidence boundary;
2. transfer contract after the timeline fix;
3. responsive UI label regression.

## Bounded workflow for 4B and 9B models

A small model should not receive the full paper, repository, article, and
screenshots in one prompt. Use claim-sized packets.

```yaml
packet:
  transfer_question: one behavior the learner must predict
  article_section: one section
  primary_excerpt: one bounded source excerpt
  current_repo_excerpt: optional, never mixed with paper time
  equation: zero or one
  counterexamples: two
output:
  verdict: supported | contradicted | unknown
  source_owner: paper | release | current-repository | editorial
  evidence: exact section or symbol
  missing_link: one sentence
  corrective_edit: one bounded change
```

Recommended passes:

1. metric failure: edit distance versus structural correctness;
2. six verifier definitions;
3. synthetic-page generation and counts;
4. SFT data and archive-page counts;
5. RLVR recipe and reward ownership;
6. ablation ladder;
7. paper limitations and undisclosed details;
8. current repository interface;
9. transfer-question sufficiency;
10. mobile equation and control geometry.

Deterministic checks should then verify route ids, raw LaTeX leakage, viewport
overflow, button clipping, formula scale, interactive state changes, source
hash stability, and the audit score. The model must answer `unknown` when the
packet does not prove a reward weight, runtime guarantee, or independent
benchmark result.

## Current source identity

```text
2cf4977b1cfa68ee11da752db30c4935f2aeafb9e4483567a3446b7275e48bf2  src/pages/articles/ai/olmocr-2/content-spec.md
69451a588812cfd4f1603db9b20a7a1b9e7789e435ab61e8565600ca5dac01fa  src/pages/articles/ai/olmocr-2.tsx
fb228d63dcdac1438ddaec4115c149b7e2dca53a44e5e84539c2d2b68afb0f26  src/pages/articles/ai/olmocr-2/viz/OlmOcrRewardLabs.tsx
e5f86ec5d00d51aa89e61f075b9a32255a292f80e026d7a1f5def88f5e89f779  src/content/ai/articlesOCR.ts
b646c38fc96aa06d9690e253068d7ff98cfdbdde4b3cf013a896e45e48cc6dfb  tests/document-ai-assembly-contract.spec.ts
```

## Verification evidence

Completed before deployment:

- selected-file ESLint: pass;
- `npx tsc --noEmit --pretty false`: pass;
- focused Playwright interaction contract: 3/3 pass at 390, 768, and 1440 px;
- page overflow: zero at mobile and desktop;
- formula scale: 1.00 with no horizontal overflow;
- clipped buttons: none;
- browser console errors: none;
- mastery audit: 36 to 100;
- visual inspection:
  `.codex-tmp/olmocr2-mobile-2026-07-29.png`,
  `.codex-tmp/olmocr2-desktop-2026-07-29.png`,
  `.codex-tmp/olmocr2-ladder-mobile-closure-2026-07-29.png`, and
  `.codex-tmp/olmocr2-formula-mobile-final-2026-07-29.png`.

Deployment closure:

- production build: 8,779 modules transformed, completed without error;
- service restart: `cm-blog.service` active from
  `2026-07-29 15:03:23 KST`;
- public route: HTTP 200 and current `index-axcbAfE5.js` bundle;
- public interaction test: 3/3 pass at 390, 768, and 1440 px;
- public mobile render inspected at
  `.codex-tmp/olmocr2-public-mobile-2026-07-29.png`.
