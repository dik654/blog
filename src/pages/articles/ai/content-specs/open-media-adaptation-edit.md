# Open Media adaptation → edit implementation contract

Updated: 2026-07-30

## Reader contract

This batch closes one conditional route after the shared Open Media production
spine.

```text
replayed workflow
→ parameter response curve
→ smallest sufficient intervention
→ if the intervention is one-off Image control:
   concrete ComfyUI edit implementation
→ otherwise:
   finish with an adaptation brief or choose a model-specific training case
```

`comfyui-edit-models-flux-qwen` remains an independent implementation article
inside the ComfyUI path. It is an optional cross-link from the shared
adaptation endpoint, not a sixth mandatory step for every Image and Video
reader.

## Defects reproduced before editing

1. `open-model-finetuning-theory` says prompt, mask and reference should be tried
   before weight updates but has no link to the article that implements exactly
   that decision.
2. The edit visualization is a five-item vertical StepViz. It changes the
   highlighted outline item, not a manipulated condition or measured outcome.
3. On 390 px the locator capture is very tall and leaves large repeated gaps.
   The sticky site header appearing inside the stitched locator screenshot is a
   capture artifact, but the component's excessive vertical density is real.
4. `ParameterBudgetExplorer` uses a fixed spatial divisor of 16 for both media,
   while the article's own Image example explains an 8x VAE scale. The
   educational profile must name its assumption rather than silently
   contradict the prose.
5. The Qwen section teaches the August 2025 base release but does not identify
   the current open implementation checkpoint, Qwen-Image-Edit-2511, or keep
   the announced Qwen-Image-2.0 status separate.

## Current primary-source boundary

### FLUX.2

- BFL FLUX.2 overview: unified generation/editing, variant roles, fixed versus
  preview endpoints.
- BFL FLUX.2 model overview: `[klein]` 4B and 9B; 4B Apache 2.0, 9B FLUX
  Non-Commercial; approximately 13 GB VRAM is an owner-stated configuration,
  not a universal peak-memory guarantee.
- BFL FLUX.2-dev model card: 32B rectified-flow transformer; non-commercial
  weight license.
- FLUX.1 Kontext is a previous-generation implementation baseline, not the
  current default for a new project.

### Qwen Image editing

- August 2025 base release establishes the teaching invariant: the input image
  enters Qwen2.5-VL for semantic control and a VAE encoder for appearance
  control.
- Qwen-Image-Edit-2509 adds multi-image inputs, stronger identity/product/text
  consistency and native ControlNet conditions.
- The upstream Qwen-Image repository released Qwen-Image-Edit-2511 weights on
  2025-12-23.
- Current ComfyUI documentation has a dedicated 2511 native workflow and names
  its text encoder, optional 4-step acceleration LoRA, diffusion model and VAE
  artifacts.
- Qwen-Image-2.0 was announced on 2026-02-10 as an integrated generation/edit
  direction. Do not silently substitute it for the pinned 2511 local workflow
  until the exact public artifact and runtime contract are captured.

## Prose changes

### Parameter budget

- Name the explorer profiles `SDXL-like Image` and `Wan2.2-VAE-like Video`.
- Image profile: illustrative VAE spatial factor 8.
- Video profile: illustrative temporal factor 4 and VAE spatial factor 16.
- Call the computed quantity `latent positions`, not transformer tokens unless
  patchification is explicitly included.
- State that this is a relative position-step budget and not a VRAM estimate.

### Adaptation endpoint

- Keep the five-step shared path unchanged.
- Add a final `implementation-handoff` section.
- Define the route completion artifact: an adaptation brief with failure,
  smallest intervention, frozen/changed surface, fixtures and rollback.
- Add an optional Image control route to
  `comfyui-edit-models-flux-qwen`.
- Keep model-specific Image and Video training cases optional.

### Edit article

- Current-first title: FLUX.2 and Qwen-Image-Edit-2511.
- Keep Kontext as a previous-generation baseline inside the article.
- Add a compact version ladder so the semantic/appearance concept owner is not
  confused with the current executable checkpoint.
- Add two mathematical bridges only where they change implementation:

```text
img2img start:
z_start = alpha z_source + sigma epsilon

mask-constrained composition:
z_out = m ⊙ z_edit + (1 - m) ⊙ z_source
```

- Every formula requires a Korean underbrace/FormulaNote explanation.

## Replacement visual contract

Replace the StepViz outline with one fixed `EDIT CONTRACT LAB`.

Controls:

- four 44 px minimum mode buttons:
  - latent img2img
  - mask repair
  - instruction edit
  - multi-reference edit
- one edit-strength range

Stable evidence:

- route ledger: source latent, semantic condition, spatial mask, reference count
- fixed three-zone canvas: subject identity, target label, background
- metrics: requested change, identity retention, background retention, spill
  risk
- explicit “relative teaching estimate” boundary

The control changes condition ownership and evidence values. It must not animate
an execution outline. Panel geometry stays stable across modes and at
390/768/1440.

## Hidden transfer checks

The body does not expose these as generic quizzes. They are authoring gates.

1. Given “replace one product label but preserve bottle and background,” choose
   mask/instruction control before LoRA or full tune and explain the condition
   path.
2. Given “same character across 500 unrelated scenes,” explain why a reference
   baseline precedes LoRA and what regression fixtures are required.
3. Given a 1024 px Image preset and an 81-frame Video preset, identify the
   named compression assumptions before comparing position-step budgets.
4. Distinguish Qwen's semantic/appearance architecture invariant from the exact
   current local checkpoint and ComfyUI artifact set.
5. Explain why Qwen-Image-2.0 is a current direction/watch item but not a
   drop-in replacement for a pinned Qwen-Image-Edit-2511 workflow.
6. From any edit-lab state, identify which zones are allowed to change and what
   evidence would reject the result.

## QA gates

- no raw LaTeX
- formula overflow <= 1 px
- document/Viz overflow <= 1 px
- all mode buttons >= 44 px
- fixed lab height does not jump materially between modes
- direct article title and source notes name the 2511 boundary
- adaptation endpoint has the optional edit link
- Image/Video authored production paths remain exactly five steps
- local and public checks at 390, 768 and 1440
- post-edit Claude receipts must be strict-valid and source-hash stable
