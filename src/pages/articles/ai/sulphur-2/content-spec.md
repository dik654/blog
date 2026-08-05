# Sulphur 2 derivative checkpoint article specification

## Reader question

공식 모델 카드가 매우 짧고 공식 추론도 아직 준비 중인 파생 모델에서,
무엇을 현재 사실로 말할 수 있고 무엇을 LTX-2.3 상속 또는 검증 전 주장으로
남겨야 하는가?

## Pinned source boundary

Checked snapshot: `2026-07-31`.

The owner-authored Hugging Face model card proves only:

- `base_model: Lightricks/LTX-2.3`,
- text-to-video and image-to-video support is claimed,
- compatibility with other LTX-2.3 formats is claimed,
- dev BF16 or FP8-mixed files and a provided distill LoRA are recommended,
- the card warns not to combine its LoRA path and full-model path,
- a prompt enhancer package contains a GGUF and an MMPROJ for LM Studio,
- prompt enhancer input can include text and an image,
- the card does not name the prompt enhancer's base model,
- official inference is `coming soon`,
- better setup and training instructions are also promised for later.

The Hugging Face page also renders platform-generated `Use this model`
integrations and repository artifact metadata. At the checked snapshot this
surface shows `qwen35` and `9B params`, which is consistent with the prompt
enhancer artifact, but the owner-authored card does not name the exact enhancer
base checkpoint. Do not treat generated Diffusers/llama snippets as the
owner-maintained Sulphur video inference workflow.

The card does not establish:

- a complete training recipe,
- which modules were updated,
- whether `full fine-tune` has a precise reproducible meaning,
- 125,000 clips, 500GB, duration, FPS, optimizer, loss, or compute,
- a verified quality improvement over LTX-2.3,
- an official inference workflow at the checked snapshot.

Third-party pages may be listed only as claims to verify. They must not be used
to upgrade these unknowns into model facts.

## Narrative spine

1. Begin with a prose source hierarchy and the release gate: official inference
   is not yet published.
2. Distinguish the owner-authored card from Hugging Face generated integration
   hints before showing any workflow.
3. Inherit architecture and runtime concepts from the LTX-2.3 article rather
   than restating them as Sulphur-specific.
4. Inventory only the package and combination statements the card actually
   makes.
5. Keep full-model, LoRA, distill artifact, and prompt enhancer identities
   separate in the run manifest.
6. Turn all quality and training claims into proposed controlled comparisons.
7. End with a stop rule: no training-data story without first-party evidence.

## Visual proof

### Evidence route

Build a responsive `StepViz` with:

1. pin owner card snapshot,
2. inherit the versioned LTX-2.3 runtime,
3. record the exact derivative package,
4. run a paired local comparison,
5. publish only claims below the evidence ceiling.

The Viz must show which owner produced each artifact and prevent a generated
platform snippet from being promoted to official inference.

### Claim ledger

Keep the responsive DOM claim ledger with four views:

1. card-verified,
2. inherited from LTX-2.3,
3. pending or unknown,
4. proposed local evidence.

Every row must display:

- the claim,
- its evidence owner,
- what can be concluded,
- what remains unproved.

The lab must show `official inference: coming soon` without requiring a click.
No view may imply that a community workflow is official.

## Formula contract

Use one paired-delta equation:

`Delta_m(c) = m(y_sulphur; c) - m(y_upstream; c)`

The Korean annotation and FormulaNote must explain that subtraction only
isolates checkpoint delta when every condition in `c` is identical. It is a
local effect under one manifest, not a universal quality score.

## Hidden transfer checks

1. A tutorial says the prompt enhancer is Qwen-based. What does the official
   card actually prove?
2. A result uses a community ComfyUI graph. Can it be called the official
   Sulphur inference path?
3. A third-party post gives a dataset size and calls the model a full
   fine-tune. Which evidence is still required?
4. A workflow applies both the derivative full-model path and its alternative
   LoRA path. Which card warning has been violated?

## Stop rule

Stop at the official card and inherited LTX-2.3 contract. Do not reconstruct a
training history from filenames, marketing pages, or community articles. Move
on when the learner can build a source-labelled experiment that compares the
upstream baseline and derivative without calling any unverified workflow,
dataset, or quality claim official.
