# LTX-2.3 2D animation adaptation implementation case

## 1. Reader contract

This article answers one bounded question:

> A current LTX-2.3 runtime repeats a 2D animation failure. What is the
> smallest reproducible T2V LoRA experiment that can test whether a weight
> update fixes that failure without hiding regressions?

The article is not another animation production map. The generic
`animation-production-workflow` article owns shot contracts, intervention
ladders, dataset/caption/adaptation/temporal/evaluation responsibilities and
the final production release gate. This article inherits one already bounded
failure and executes one concrete current trainer loop.

## 2. Author intent and provenance

The old article mixed LTX, Wan, Humo, Seedance, AniMatrix and MiMo into a model
list. That did not establish an executable relationship among the names and
left unsupported numeric advice such as "20–100 clips" and a rank sweep.

The replacement uses only:

- the current official Lightricks LTX-2 repository and trainer documents,
- the pinned repository revision recorded in the local source snapshot,
- the official `t2v_lora.yaml` and `t2v_lora_low_vram.yaml`,
- the LTX-2 Community License,
- the existing generic animation production contract as the upstream
  decision boundary.

No training result is claimed. The 576×576×49 low-VRAM profile is presented as
an official example configuration useful for a smoke test, not as a universal
quality, speed or memory guarantee.

## 3. Finite learning route

1. **Inherit one failure.** Start with a fixed shot contract and an earliest
   repeated failure from the generic production article.
2. **Freeze the current artifact graph.** Pin LTX-2.3 checkpoint, Gemma text
   encoder, trainer source revision, config, license and output root.
3. **Build an auditable manifest.** Keep media path, caption, source group,
   shot identity, rights record and split outside the official minimum columns.
   Explain that group/time split is an evaluation safeguard added by this
   article, not a trainer requirement.
4. **Precompute the correct tensors.** Scene split and captioning happen before
   `process_dataset.py`; the latter caches video/audio latents and text
   conditions. Extra reference or mask columns belong only to modes that use
   them.
5. **Run the smallest LoRA profile.** Explain rank/alpha, target projection
   patterns, generated video/audio branches, batch/accumulation, precision and
   low-memory quantization as a starting configuration.
6. **Compare paired evidence.** Base and LoRA use the same prompt, seed,
   dimensions, frame rate, inference steps, guidance and STG. Compare the
   target failure and a retention set separately.
7. **Stop or escalate.** Stop when the target improves and hard retention,
   runtime and rights gates remain open. If not, diagnose data/caption/target
   mismatch before increasing rank or moving to full fine-tuning.

Do not descend through every diffusion paper. The prerequisite floor is the
current LTX-2.3 version/pipeline article and the video runtime article. Open
math foundations only when the sequence or LoRA formulas are the blocker.

## 4. Causal sections

### 01 — One failure becomes one experiment

- Restate the inherited example as a bounded fixture, such as line/identity
  drift in a short T2V animation shot.
- Clarify that the article demonstrates a decision procedure, not a completed
  benchmark result.
- Terms before first use: LoRA, manifest, precompute, paired validation,
  retention set.

### 02 — The manifest owns identity before tensors exist

- Official minimum metadata columns: `video`, `audio`, `caption`, plus
  mode-specific `reference_video` and `reference_audio`.
- Article-added fields: `source_group`, `shot_id`, `rights_record`,
  `split`.
- Explain why clip-level random splitting can leak adjacent shots from the
  same source into train and validation.
- Keep the raw manifest hash and the preprocessed output root together.

### 03 — Resolution and frames become transformer work

Show the official sequence-length relation with multiplication between the
spatial and temporal latent counts:

```latex
N_{\text{seq}}
=
\underbrace{\frac{H}{32}\cdot\frac{W}{32}}_{\text{한 시점의 공간 latent}}
\cdot
\underbrace{\left(\frac{F-1}{8}+1\right)}_{\text{시간 latent 수}}
```

- 576×576×49 gives `18 × 18 × 7 = 2268`.
- 576×576×89 gives `18 × 18 × 12 = 3888`.
- Width and height must be divisible by 32.
- Frame count must satisfy the documented temporal form, for example
  `F % 8 == 1`.
- Multiple resolution buckets require `optimization.batch_size: 1`; do not
  invent a universal GPU-memory prediction from token count alone.

### 04 — LoRA changes selected projections, not the whole base

Show two formulas with Korean semantic annotations:

```latex
\Delta W=
\underbrace{B}_{\text{출력 방향}}
\underbrace{A}_{\text{입력 압축}},
\qquad
\operatorname{rank}(\Delta W)\le
\underbrace{r}_{\text{LoRA 표현 폭}}
```

```latex
B_{\text{eff}}
=
\underbrace{B_{\text{gpu}}}_{\text{GPU 한 번의 sample}}
\cdot
\underbrace{G_{\text{acc}}}_{\text{누적 횟수}}
\cdot
\underbrace{N_{\text{gpu}}}_{\text{GPU 수}}
```

- Official standard example: rank 32, alpha 32, AdamW, bf16,
  576×576×89 validation.
- Official low-memory example: rank 16, alpha 16, AdamW8bit, INT8 Quanto,
  8-bit text encoder, 576×576×49 validation.
- The low-memory example is described for approximately 32 GB GPUs by the
  current trainer material; keep the approximation and configuration scope.
- Explain that short target patterns `to_q`, `to_k`, `to_v`, `to_out.0`
  match the documented attention modules across video/audio/cross-modal
  blocks. Do not imply that these four names identify only one modality.
- Generated video/audio branches are part of the example training strategy.

### 05 — Paired validation decides release

Define per-axis change:

```latex
\Delta_k=
\underbrace{s_k(\text{LoRA})}_{\text{적응 후 같은 조건}}
-
\underbrace{s_k(\text{base})}_{\text{적응 전 기준}}
```

- Hold prompt, seed 42, dimensions, 25 FPS, 30 inference steps,
  guidance 4.0 and STG settings constant in the example.
- State explicitly that trainer validation is simplified and production
  inference should be checked with the official pipeline.
- Separate the target axis from retention axes. A sample gallery cannot hide
  identity, motion, audio or runtime regression.
- Release bundle: base/checkpoint/config/source revision, manifest and
  precompute hashes, adapter checkpoint, paired evidence, failure ledger,
  license decision.
- The Community License defines adapted/fine-tuned weights as derivatives and
  requires a paid commercial-use license for entities with annual revenue at
  least USD 10 million. Summarize rather than give legal advice.

## 5. Visual contracts

### `LtxTrainingRunLab`

Six stable semantic slots:

`version → manifest → precompute → train → validate → release`

Controls:

- smoke profile: 576×576×49,
- standard example profile: 576×576×89,
- stage selector with at least 44 px hit targets.

Every stage changes visible owner, input, artifact, invariant and evidence.
Profile changes must update sequence length and relevant config facts as text,
not color alone. Use responsive HTML/CSS, no miniature SVG. The lab has a
stable bounded height at 390, 768 and 1440 and does not require internal
scrolling.

### `LtxPairedEvaluationLab`

Base and LoRA columns retain the same geometry. A failure fixture selector
changes target/retention scores, the causal diagnosis and the release verdict.
The reader must be able to see:

- same prompt/seed/runtime contract,
- target-axis improvement,
- retention regressions that block release,
- the next smallest correction.

No decorative chart. The state transition must teach why a visually appealing
single output is not sufficient evidence.

## 6. Internal transfer problems

These are authoring checks, not body quiz copy.

1. A team changes from 49 to 89 frames but keeps every other visible setting.
   Can the reader calculate 2268 versus 3888 sequence tokens and explain why
   wall time cannot be inferred from that ratio alone?
2. Training improves line stability but identity retention falls below its
   hard gate. Can the reader block release even when the average score rises?
3. A manifest randomly splits adjacent clips from the same episode. Can the
   reader identify source-group leakage and rebuild the split?
4. A user claims the 32 GB example proves all 32 GB GPUs can run it. Can the
   reader point to quantization/offload/configuration assumptions and reject
   the universal claim?
5. A company with USD 12 million annual revenue wants to redistribute the
   adapter. Can the reader find that the adapter is a derivative and flag the
   paid commercial-license boundary for legal review?
6. A failed LoRA run immediately triggers a full fine-tune. Can the reader
   inspect data, captions, target-module coverage and paired evidence first?

The article is deep enough only when its prose and labs provide every premise
needed to solve all six.

## 7. Source floor

- Lightricks LTX-2 repository at pinned revision
  `9377758131b1ffde4b7f766804590a6617bf2ab9`.
- Official trainer Quick Start.
- Official Dataset Preparation.
- Official Configuration Reference.
- Official `t2v_lora.yaml`.
- Official `t2v_lora_low_vram.yaml`.
- LTX-2 Community License dated January 5, 2026.

Current claims must show the verified revision and date. If upstream changes,
re-run the source audit before changing the article.
