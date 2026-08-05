# LTX-2.3 article reconstruction specification

## Reader question

LTX-2 논문의 audio-video 구조와 현재 LTX-2.3의 22B checkpoint·two-stage
pipeline을 어떻게 연결하되, 서로 다른 버전의 수치와 공개 범위를 섞지 않고
실행 경로를 고를 수 있는가?

## Pinned source boundary

- Official repository revision:
  `9377758131b1ffde4b7f766804590a6617bf2ab9`
- LTX-2 technical report and `ltx-core` architecture overview describe an
  asymmetric 14B video stream and 5B audio stream with bidirectional
  cross-modal interaction.
- Current LTX-2.3 release artifacts are labelled 22B in the repository.
- The checked public documents do not establish that the current 22B
  checkpoint preserves the exact 14B/5B split. State that boundary explicitly.
- Current package ownership:
  - `ltx-core`: components and model primitives,
  - `ltx-pipelines`: runnable inference graphs,
  - `ltx-trainer`: LoRA, IC-LoRA, and full fine-tuning workflows.
- Current production-quality paths require the spatial upscaler.
- `TI2VidTwoStagesPipeline` performs a lower-resolution first stage, spatial
  latent upsampling, then refinement. Distilled paths use their documented
  distilled artifacts and sigma schedule.
- Full pretraining data and complete large-scale training recipe remain outside
  the public reproduction boundary.

## Narrative spine

1. Pin the version layer before reading any parameter count.
2. Explain separate video/audio latent compression and why they need different
   positional structure.
3. Teach the LTX-2 paper's asymmetric dual-stream mechanism as the inherited
   architecture idea, with the 14B/5B scope label attached.
4. Move to the current LTX-2.3 artifact and package graph without claiming the
   exact same stream split.
5. Follow the recommended two-stage runtime:
   low-resolution generation -> spatial latent upsample -> refinement -> decode.
6. Select training and inference modes from which modality is generated,
   frozen as conditioning, or used as a reference.
7. End with an artifact and pipeline manifest.

## Visual proof

Build one responsive DOM lab with four selectable views:

1. version boundary,
2. latent and dual-stream exchange,
3. current two-stage runtime,
4. mode and evidence ownership.

The version view must keep these on separate rows:

- LTX-2 paper: 14B video + 5B audio,
- LTX-2.3 current artifact: 22B label,
- exact 2.3 stream split: not established by the checked public docs.

The runtime view must show the spatial upscaler as a required stage for the
recommended production path, not as decorative post-processing.

## Formula contract

1. Modality-specific encoding and token-state exchange.
2. Dual-stream update with Korean annotations.
3. Generated/frozen modality loss mask, explaining `is_generated`.

Every display formula has a Korean `FormulaNote` and remains readable without
horizontal scrolling at 390, 768, and 1440 CSS pixels.

## Hidden transfer checks

1. A learner adds 14B and 5B and claims that LTX-2.3 is a 19B checkpoint. Which
   version boundary was lost?
2. A one-stage run is compared with a two-stage run and the improvement is
   attributed only to the checkpoint. Which pipeline artifacts changed?
3. In audio-to-video training, which modality receives noise and loss, and
   which one remains clean conditioning?
4. A distilled run uses the dev checkpoint but no distilled adapter or sigma
   contract. Why is the artifact identity incomplete?

## Stop rule

Stop at the public LTX-2 architecture idea and the current LTX-2.3
package/pipeline/trainer contract. Do not infer the private pretraining mixture
or the exact 2.3 video/audio parameter split. Move on when the learner can pick
a current pipeline, trace both modalities, and attach every result to its
checkpoint, upscaler, adapter, guider, scheduler, and source revision.
