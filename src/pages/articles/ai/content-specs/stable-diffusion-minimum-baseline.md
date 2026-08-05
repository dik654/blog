# Stable Diffusion minimum implementation baseline

## Reader contract

This article is an optional implementation baseline, not the first mandatory
step of the current Open Image route.

The reader opens it for one of three bounded reasons:

1. a current workflow still inherits SD1.x or SDXL module boundaries,
2. an Illustrious/SDXL case requires the U-Net and LoRA intervention surface,
3. a DiT/flow model is easier to understand by identifying what changed from
   the older LDM runtime.

The article must return the reader to a current runtime or current model case.
It must not create an endless historical prerequisite chain.

## Finite floor and stop rule

The historical floor is the 2021 Latent Diffusion paper.

- DDPM mathematics is optional just-in-time remediation, not another mandatory
  historical step.
- Earlier autoencoder, U-Net, attention and score-matching papers are not
  prerequisites of this route.
- The current Image route does not include this article by default.
- The Illustrious route may require it because Illustrious directly inherits
  the SDXL runtime and adaptation surface.

The handoff label to deeper mathematics must say "막힐 때만" rather than imply
that every reader should descend again.

## Causal spine

The body should preserve this minimum causal sequence:

```text
prompt
→ text condition
→ compressed latent
→ denoiser prediction
→ solver/scheduler update
→ VAE decode
```

Then it should answer only the differences needed for transfer:

```text
SD1.x / SDXL:
  convolutional U-Net + attention + skip paths

SD3 / SD3.5:
  MMDiT token mixing + rectified-flow trajectory
```

ControlNet, IP-Adapter, inpaint and LoRA remain because they expose where a
workflow intervenes. They must be read as intervention ownership, not as a
catalog of product names.

## Source boundary

Primary evidence:

- Rombach et al., Latent Diffusion Models: latent autoencoder and
  cross-attention conditioning.
- Podell et al., SDXL: larger U-Net, two text encoders and refinement stage.
- Esser et al., SD3: MMDiT and rectified-flow formulation.
- Diffusers pipeline source/docs: current component and runtime contracts.

Do not infer current model quality, recommended parameter values, or licensing
from architecture papers.

## Visual contract

The two existing StepViz scenes may be replaced. Animation is optional; causal
comparison is required.

### Runtime lab

One fixed frame should show:

- condition owner,
- current latent/noise state,
- denoiser input and prediction,
- scheduler/solver update,
- final decode.

Changing the active phase must change explicit evidence, not only highlight a
label. The loop between denoiser and solver must be visible.

### Architecture bridge

One fixed frame should compare:

- U-Net local/skip path,
- self-attention,
- text cross-attention,
- MMDiT joint token update.

The reader must be able to answer why an SDXL LoRA target cannot be copied
blindly to SD3/SD3.5.

### Responsive requirements

- 390px and 1440px must use the same causal model.
- No label may render below 12px effective size.
- No duplicated scene prose and visual stage list.
- No decorative empty field larger than the meaningful diagram.
- Controls must remain at least 44px.
- Mode changes must not shift the comparison frame.
- Korean labels own the explanation; English API/module names may appear as
  secondary identifiers.

## Hidden transfer checks

These questions are not placed in the body as a quiz. They audit whether the
body is deep enough.

1. Given a 1024px SDXL job, derive the 128x128 latent grid and distinguish the
   4x spatial position increase from the possible 16x dense self-attention
   score increase relative to 512px.
2. Given a prompt-following failure, separate text encoding, CFG direction,
   denoiser capacity, scheduler and VAE as candidate owners.
3. Explain why ControlNet, IP-Adapter and inpaint constrain different surfaces.
4. Explain why a U-Net attention LoRA recipe is not automatically a valid
   MMDiT recipe.
5. State when the reader should descend to Diffusion mathematics and when they
   should return to the current Image runtime.

## QA gates

- Exactly ten rendered display equations and ten Korean FormulaNotes remain
  readable unless the content audit justifies a smaller coherent set.
- No raw LaTeX appears.
- Current source claims match primary evidence.
- The optional historical floor is not promoted into the five-step current
  Image path.
- 390/768/1440 have no clipping or document overflow.
- Visual tests measure effective label size and meaningful frame density, not
  only element visibility.
