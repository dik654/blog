# Z-Image article reconstruction specification

## Reader question

Z-Image라는 이름 아래에서 현재 내려받아 실행할 수 있는 것은 무엇이고,
6B S3-DiT 계열의 공통 구조, Base와 Turbo의 실행 차이, 아직 공개되지 않은
Omni-Base와 Edit의 계획을 어떻게 섞지 않고 읽어야 하는가?

## Pinned source boundary

- Official repository revision:
  `26f23eda626ffadda020b04ff79488e1d72004cd`
- The repository README is the public family and release contract.
- The current `src/zimage/pipeline.py` and `transformer.py` T2I path is the
  executable-code contract.
- The README describes a family-level unified stream of text, visual semantic,
  and image VAE tokens. The checked T2I code exposes caption features and image
  VAE latents as the observable inputs. Do not invent a third T2I input module.
- `Z-Image` and `Z-Image-Turbo` have official checkpoint links at the pinned
  revision.
- `Z-Image-Omni-Base` and `Z-Image-Edit` are described by the README, but their
  checkpoint fields say `To be released`. Any run instruction is conditional
  on a future release.
- Vendor latency, leaderboard, VRAM, and quality statements remain vendor
  claims with the stated hardware and evaluation scope.

## Narrative spine

1. Start with one practical decision: high-control Base or fast-preview Turbo.
2. Separate family architecture, current T2I code, and release state.
3. Follow one prompt through text encoding, unified token assembly, denoising,
   solver steps, and VAE decode.
4. Explain that fewer NFE compresses a trajectory; it is not merely a sampler
   setting.
5. Connect Base/Turbo choice to negative prompting, guidance, fine-tuning,
   diversity, and evidence that must be logged.
6. End with a reproducibility manifest and an explicit unavailable-state rule
   for Omni-Base and Edit.

## Required concepts

- **NFE**: one evaluation of the denoising network. Eight NFE is a compute
  contract, not eight arbitrary UI clicks.
- **S3-DiT**: the family-level single-stream design described in the official
  README.
- **Caption feature**: the current T2I code's text-side tensor.
- **Image VAE latent**: the noisy image-side tensor denoised by the transformer.
- **Release state**: announced, checkpoint published, or not yet published.
- **Evidence scope**: architecture description, code-observed behavior, vendor
  benchmark, or locally reproduced run.

## Visual proof

Build a responsive DOM lab rather than a fixed SVG.

The lab has four selectable stages:

1. family contract,
2. current T2I token path,
3. Base versus Turbo,
4. release and evidence.

For each stage show:

- what enters,
- what changes,
- what the source proves,
- what remains unproved,
- a concrete user decision.

The variant view must visibly mark Base and Turbo as available and Omni-Base
and Edit as not yet released at the pinned revision. It must never offer a
download or run action for an unavailable checkpoint.

## Hidden transfer checks

The prose must make these solvable without printing them as generic quizzes:

1. A workflow claims to run Z-Image-Edit today. Which evidence must be rejected
   before discussing image quality?
2. A Turbo run uses 50 denoiser evaluations. Which artifact or configuration
   identity is now suspect?
3. A learner sees three token kinds in the README but two observable input
   branches in the current T2I code. How should the discrepancy be documented?
4. Two users report different VRAM at the same resolution. Which non-denoiser
   components and offload facts must be recorded?

## Stop rule

Stop at the current public T2I pipeline and family release boundary. Do not
descend into unpublished edit training internals, undocumented dataset
mixtures, or third-party quality rankings. Move on when the learner can choose
Base or Turbo and can reject an experiment whose checkpoint, NFE, component
revision, or availability evidence is invalid.
