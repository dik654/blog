# AI foundations · batch shape, perceptron, Diffusion closure run

Date: 2026-07-29 KST

## Why this batch

The static learning-flow audit marked every AI foundations article clean, but it only proved metadata, links, formula-note presence and Viz existence. A real 768px Playwright run exposed a readable-width failure in the five-stage neural-network overview. The private mastery gate also required a transposed-weight bug that passes for one sample but fails for a batch, while the public article only warned that libraries may store weights in a different direction.

This batch therefore treats the public render and the hardest private transfer problem as release evidence. It does not add history or another paper.

## Private transfer problem

A reader should be able to:

1. Trace `X[B,2]` through two affine layers under the article's `[in,out]` calculation convention.
2. Reconcile that convention with PyTorch's stored weight `[out,in]` and `y=xA^T+b`.
3. Explain why `W @ x` can work for a single vector while the same order fails for `X[B,d]`.
4. Compute the article's complete two-layer numeric forward pass.
5. Choose model-output and target shapes for regression, binary, multiclass and multilabel tasks.

The problem and answer are authoring QA only. The public article contains the premises, mechanism, counterexample and verification controls rather than a pasted exercise.

## Source and intent

| Source | Retained contract | Public transformation |
|---|---|---|
| Deep Learning Book, ch. 6 | Feedforward networks are function compositions with task-specific output units | Keep the layer-composition spine and hand off activation, loss and backward details to their own articles |
| PyTorch `Linear` 2.13 docs | Input `(*, in_features)`, output `(*, out_features)`, stored weight `[out,in]`, operation `xA^T+b` | Turn a storage-vs-computation convention into a sample/batch debugger |
| PyTorch `BCEWithLogitsLoss` 2.13 docs | Input and target have the same shape; sigmoid and BCE are combined stably | Show `[B,1]` binary and `[B,C]` multilabel output-target contracts |
| PyTorch `CrossEntropyLoss` 2.13 docs | Multiclass logits `[B,C]`; class-index target `[B]` by default | Separate multiclass from multilabel even though model-output shapes can match |

Official references:

- https://docs.pytorch.org/docs/stable/generated/torch.nn.Linear.html
- https://docs.pytorch.org/docs/stable/generated/torch.nn.BCEWithLogitsLoss.html
- https://docs.pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html
- https://www.deeplearningbook.org/contents/mlp.html

## Initial evidence

- `tests/foundation-viz-tablet-layout.spec.ts`
  - 768px overview stages stayed on one line.
  - First, hidden and output stages measured `106.97–106.98px`, below the `108px` readability floor.
- The common visual-system test was stale:
  - `minimumSurfaces: 7` was asserted as an exact count even though Diffusion now renders 12 valid surfaces.
- After allowing an actual minimum, the visual contract found two 10.5px inline-code labels in the new neural-network debugger.
- The previous public text named alternate weight storage but did not demonstrate why a single-sample success fails to generalize to a batch.
- The previous numeric trace showed `[2,3]` and `-0.5` but did not display the complete matrix arithmetic.
- The previous output-head rows omitted target shapes.

## Changes

- Renamed the foundation route label from the generic English `BOTTOM-UP LEARNING PATH` to `기초 계산 경로 · 한 번의 UPDATE`.
- Reduced arrow tracks in `NNCompositionViz` so all five stages remain on one readable 768px line.
- Added `BatchShapeDebugger`:
  - sample and batch segmented modes;
  - fragile `W @ x` order and batch-safe `X @ W^T`;
  - explicit inner-dimension failure;
  - real KaTeX formulas and Korean operation reasons;
  - stacked mobile and two-column tablet/desktop layouts.
- Expanded the numeric forward trace to show every multiplication and addition that produces `[2,3]` and `-0.5`.
- Added target shape and dtype intent to regression, binary, multiclass and multilabel output contracts.
- Added sample/batch modes to the five-stage composition Viz. The default trace now preserves `B` from `[B,2]` through `[B,3]` to `[B,2]`.
- Added the explicit equivalence `W_math[d,h] = W_store^T[d,h]` and `Z=XW_math+b=XW_store^T+b`. A Claude retry caught and closed a KaTeX subscript bug in the FormulaNote labels by changing `W_math` to `W_{\mathrm{math}}`.
- Extended the capability checklist and official source notes.
- Updated the article content spec with the private mastery gate, source intent and responsive thresholds.
- Corrected the common Viz test to enforce at least the declared minimum while still requiring one fullscreen tool per actual Viz.
- Added a dedicated `ai-math-foundations` route contract. It is no longer a generic article list: readers select one of four calculation lenses, solve the current blocker and return to the named AI target.
- Replaced the perceptron's easy one-update example with a two-update case:
  - `x=[-1,1]`, `y=1`, `η=0.1`;
  - score `-0.6 → -0.3 → 0`;
  - all three `w,b` states;
  - three `score=0` boundaries redrawn in the same coordinates.
- Raised the perceptron private mastery gate from one update to two updates, boundary redraw and convergence-vs-local-correction judgment.
- Reconstructed the Diffusion U-Net skip handoff as a real same-resolution data flow:
  - encoder `E_r [B,C_enc,r,r]`;
  - upsampled decoder `Up(D_{r/2}) [B,C_dec,r,r]`;
  - channel concat `[B,C_dec+C_enc,r,r]`;
  - concrete 64×64 and 32×32 traces plus a compact Korean-annotated KaTeX derivation.
- Added prose-complete LDM compression evidence so the Viz is not carrying the argument:
  - `f=1` pixel identity and 65,536 positions;
  - `f=32` and 1,024× fewer positions;
  - Table 8 VQ/KL R-FID and PSNR receipts with metric directions.
- Defined NFE at first use as denoiser function-evaluation count.
- Changed the U-Net Viz to three responsive compositions: one column on mobile, resolution plus vertical flow on tablet, and one-line data flow on desktop.
- Pinned the foundation-floor/full-map boundary at 360, 390, 768 and 1440px. The exact foundation route contains nine core rows and closed optional sources, but no category-map or research-route UI.

## Verification

Local source build:

- `npx tsc --noEmit`: pass
- targeted ESLint for changed files: pass
- `npm run build`: pass

Playwright:

- foundation route and responsive Viz suite: 21 passed before the perceptron extension
- dedicated two-update perceptron redraw interaction: 1 passed
- final foundation/perceptron/neural/backprop/Diffusion responsive suite: 9 passed
- common visual-system contract at 360, 390, 768 and 1440px after the perceptron extension: 4 passed
- perceptron, neural-network and backprop formula/Viz corpus on 390 and 1440px: 6 passed
- Diffusion formula/Viz corpus on 390 and 1440px: 2 passed
- LDM canonical-source reconstruction contract on 390, 768 and 1440px: 3 passed
- exact foundation-floor boundary at 360, 390, 768 and 1440px: 4 passed
- exact active foundation sidebar ownership at 360, 390, 768 and 1440px: 4 passed
- the common visual contract now waits for `document.fonts.ready`; it retains the 12px threshold instead of measuring a transient 11.85px fallback-font state

Manual visual inspection:

- 390px batch debugger: vertical comparison, no horizontal scroll, formulas remain legible.
- 768px overview: five stages remain one line; the narrow stages exceed 108px after the arrow-track reduction.
- 768px batch debugger: two equal comparison columns, no clipped formula or label.
- 390, 768 and 1440px math foundation route: four lenses, return targets and article rows remain visible without document overflow.
- 390, 768 and 1440px perceptron redraw: the plot, active boundary, Korean status and KaTeX equation remain visible; the desktop layout uses the available width rather than shrinking the plot into a card.
- 390, 768 and 1440px Diffusion U-Net and `f=32` compression lab: no right clipping or inner scroll. The first tablet revision technically fit but split `64` across lines; the final resolution-plus-flow layout removes that visual defect without wasting the whole row.
- The first U-Net formula fit attempt scaled to `0.69` and about `11.2px` on 390px. Splitting upsampling, concat and channel addition into three annotated lines restored the 12px contract.

## Claude collaboration

Context Manager health returned HTTP 200 and strict-valid `ACCEPT`. Five broad
independent audits then returned HTTP wrappers but invalid Claude executions
(`exit 143`, no verdict). They were excluded. Recovery used one question, one or
two files, at most two concurrent calls and a 240-second worker timeout.

Strict-valid closure:

- Neural composition, storage convention and output contracts: initial gaps were
  `REVISE`; integrated batch trace, explicit transpose equivalence and target dtype
  all received post-edit `ACCEPT`.
- Math foundation IA: generic fall-through was `REVISE`; the four-lens
  choose-on-block/return route received `ACCEPT`.
- Perceptron: one-update mastery was `REVISE`; two updates, three scores and three
  redrawn boundaries received post-edit `ACCEPT`.
- Backprop: composition, numeric graph, chain rule, VJP, layer gradients, reverse
  topological traversal, accumulation and finite differences all received
  strict-valid `ACCEPT`.
- Diffusion opening, forward objective, reverse/DDPM evidence, source labs and
  modern handoff received `ACCEPT`.
- Diffusion conditioning/LDM was `REVISE` because skip data flow and compression
  evidence depended on shallow labels/Viz. Same-resolution concat, `f=1`/`f=32`,
  R-FID/PSNR and NFE received final post-edit `ACCEPT`.
- Foundation route tests were `REVISE` because 360/768 and the floor/full-map
  boundary were not pinned. The final tests explicitly cover both viewports and
  keep core rows, optional sources and full-map UI separate.

All accepted verdicts are source-hash bound. Invalid preamble, 143, 500 or
hash-mismatch attempts are retained as invalid receipts rather than counted as
reviews:

- `.codex-tmp/claude-recovery-all-pending-2026-07-28/ledger.md`
- `.codex-tmp/claude-recovery-all-pending-2026-07-28/machine-summary.json`

Primary Diffusion references:

- https://arxiv.org/abs/1505.04597
- https://openaccess.thecvf.com/content/CVPR2022/papers/Rombach_High-Resolution_Image_Synthesis_With_Latent_Diffusion_Models_CVPR_2022_paper
- https://openaccess.thecvf.com/content/CVPR2022/supplemental/Rombach_High-Resolution_Image_Synthesis_CVPR_2022_supplemental.pdf

## Source hashes before public deployment

- `NetworkImplementation.tsx`: `e030765ffecdb763e1a9d53cc769f0f4e41976ec1fe4bccc25187d9ba0cdabc1`
- `NetworkOverview.tsx`: `64ded92f62215c56b44101da81e08fe621c6e9161bdc6727939171aaf7b17e0e`
- `NumericForward.tsx`: `d4c09c32c15e10d44e6ea572e8e7dc769a636408d8acc85aeb271ae46e68ca47`
- `OutputHeads.tsx`: `aec213093266b54098e0513776974863c9030df73420f9b13200aac0989b05bc`
- `TensorShapes.tsx`: `7704200339f2ee73a548658d5d3bf2d7f241128f12dfd8201015ef4884ee566f`
- `NNCompositionViz.tsx`: `5c6eca113780c3702223f3375c679bf94f7cef7058c02e3d37608e4f945eb7ea`
- `BatchShapeDebugger.tsx`: `84cde59df3a40691bc3f87f21a5a1fc39701b0afa84e67bb0b0afd78397c784e`
- `FoundationLearningPath.tsx`: `8ec03258d0fabd3b2c718575a7124dc20e77ad4b9de68576d10ab9f48a789211`
- `MathFoundationLearningPath.tsx`: `2c3532c9d2900a72e69a76674e532a828d9f382dc6cb3c131f8e2d991c543588`
- `CategoryPage.tsx`: `999b9a573c14c2a4adc3bdff38b1532431d0a1828069754f4f30a8ffee5c22f0`
- `PerceptronLearning.tsx`: `717b3a5133474543516721dd6e246fd74fd2ed58d2a3f47e21cd006efe72414e`
- `PerceptronHandoff.tsx`: `9a28c8eab0a8a8b5603b99d8cda5aad0860b505db33c03bc1d88ebdcf9419c51`
- `perceptron/content-spec.md`: `68dd0b9b38f52ab8d5a08acb8e8ba72784a0563330dfe7ff8bf878a79e786014`
- `ConditioningAndArchitecture.tsx`: `547e8cbb132a9cc155ab54497ef70c84e501d8bea6275ecb33f2f088c5644d77`
- `LDMSourceEvidence.tsx`: `2cdf67a08a6db14cb3fd16af7894d51a01adf7fa2a940f3dee132437799c0411`
- `LDMSourceLabs.tsx`: `25eb00fb3f0771659d43bbfd5290976ee3b0bfbe47d2a7f1a29851f57a94172e`
- `ModernDiffusion.tsx`: `356a8bae73cb45b2f0d47e8616c4dff42db73ef55fa5439cb8c8302348fe7f98`
- `foundation-floor-ux.spec.ts`: `9ae96fbcbd8f6d4c6267c8e456ebe121077f2b45c34b077cb6943259144428a6`
- `sidebar-information-architecture.spec.ts`: `7015f4ce3a4e1a5fc5ec6597fefccff9d1c6fae7a7a691c9d499379284e83459`

## Next priority

After this batch is deployed, use the same private-problem/public-render method on
the next actual failure rather than accepting a green metadata audit. The broad
goal remains active: current target tracks outside this foundation batch still need
article-by-article mastery, source and visual closure.
