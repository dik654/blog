# Wan2.2 article reconstruction specification

## Reader question

같은 Wan2.2 이름 아래 있는 A14B MoE와 dense TI2V-5B 중 어떤 경로를
선택해야 하며, 그 선택이 task, active compute, latent compression,
memory와 재현 증거를 어떻게 바꾸는가?

## Pinned source boundary

- Official repository revision:
  `42bf4cfaa384bc21833865abc2f9e6c0e67233dc`
- The official README and checked configs prove:
  - T2V-A14B and I2V-A14B use two approximately 14B noise-regime experts,
    approximately 27B total and approximately 14B active per step.
  - High-noise and low-noise experts switch at the configured regime boundary.
  - TI2V-5B is a different dense path, not a smaller routing configuration of
    A14B.
  - TI2V-5B uses a 4x16x16 VAE stride and 1x2x2 patchification, yielding a
    4x32x32 total grid compression in the documented path.
  - The documented A14B single-GPU path requires at least 80GB VRAM.
  - The documented TI2V-5B offload/dtype/T5-CPU path can target a 24GB 4090.
- Keep vendor runtime and quality statements attached to their exact command,
  resolution, duration, device, and optimization scope.
- Do not transfer A14B routing or LoRA assumptions to TI2V-5B.

## Narrative spine

1. Choose the task contract first: T2V, I2V, or unified TI2V.
2. Compare A14B capacity routing with TI2V-5B compression and accessibility.
3. Follow the denoising trajectory from high noise to low noise and explain why
   one expert is active at a time.
4. Compute the latent grid before discussing the parameter count.
5. Turn hardware claims into a full pipeline budget including text encoder,
   VAE, offload, frame count, resolution, precision, and communication.
6. Close with a manifest that makes two Wan runs comparable.

## Visual proof

Build one responsive DOM decision lab with four stages:

1. task selection,
2. model family,
3. denoising or compression mechanism,
4. runtime evidence.

The lab must:

- show A14B and TI2V-5B as sibling paths, never parent and child;
- update active parameters, condition mode, latent grid, and minimum documented
  hardware when the path changes;
- show high-noise and low-noise experts sequentially, not simultaneously active;
- preserve the difference between a vendor claim and a local measurement;
- use no fixed SVG line diagram or horizontally scrolling comparison table.

## Formula contract

1. Noise-regime switch with Korean in-formula labels.
2. VAE and patch grid transformation with TI2V-specific scope.
3. A memory ledger that is explicitly an accounting identity, not a promised
   peak-VRAM formula.

Every formula is followed by symbol meanings and a sentence explaining why the
operation exists.

## Hidden transfer checks

1. A 24GB workflow loads `Wan2.2-T2V-A14B`. Which assumption failed?
2. An article says Wan2.2 always activates 14B parameters. Why is that false
   for TI2V-5B?
3. Increasing frames doubles a run time despite unchanged checkpoint size.
   Which latent-grid term changed?
4. Two A14B results use different expert switch thresholds. What must be added
   to the manifest before comparing quality?

## Stop rule

Stop at the public inference and configuration contract. Do not infer the
private dataset mixture, expert training schedule, or universal LoRA recipe.
Move on when the learner can choose a task-specific checkpoint, compute the
TI2V latent-grid scale, and explain the memory evidence required for a
reproducible run.
