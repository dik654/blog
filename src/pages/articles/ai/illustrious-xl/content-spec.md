# Illustrious XL v1.1 article reconstruction specification

## Reader question

공식 카드가 짧은 파생 모델을 읽을 때 SDXL에서 상속한 사실, Illustrious
XL v1.1이 실제로 공개한 변경점, 커뮤니티 워크플로에서 검증해야 할 가설을
어떻게 구분하는가?

## Pinned source boundary

- Current model card snapshot:
  `OnomaAIResearch/Illustrious-XL-v1.1`
- The card states:
  - continued from v1.0,
  - tuned hyperparameters for stabilization,
  - slightly better character understanding,
  - knowledge cutoff 2024-07,
  - slight color, anatomy, and saturation differences,
  - ELO 1617 versus 1571 over 400 collected sample responses,
  - SDXL license.
- The card does not publish a complete dataset, caption schema, optimizer
  recipe, trainable-module list, tag benchmark, LoRA compatibility matrix, or
  merge recipe.
- SDXL architecture and LoRA mathematics may be taught as inherited background,
  but must not be presented as v1.1-specific discoveries.
- Tag prompting, negative prompting, LoRA stacking, and checkpoint merging are
  workflow hypotheses to test, not facts proved by the v1.1 card.

## Narrative spine

1. Start with the evidence problem: the derivative card is much thinner than
   the inherited SDXL system.
2. Establish the SDXL runtime contract once, then stop repeating general
   diffusion theory.
3. Isolate the v1.0 to v1.1 delta and explain what its ELO statement can and
   cannot prove.
4. Turn tag, natural-language, LoRA, and merge claims into controlled
   experiments with fixed seeds and a source-labelled manifest.
5. Teach regression checks for character identity, anatomy, color, saturation,
   composition, and non-character prompts.
6. End with the smallest sufficient intervention: prompt first, then one
   adapter, and only then a checkpoint-level change.

## Visual proof

Build one DOM evidence lab with three selectable layers:

1. inherited from SDXL,
2. stated by the v1.1 card,
3. requires local experiment.

Every claim shown in the lab must carry a visible source class. The layout must
use readable prose and short evidence strips, not tiny boxes or line diagrams.
At 390, 768, and 1440 CSS pixels:

- controls are at least 44px high,
- no internal or document horizontal scroll exists,
- long model identifiers wrap,
- the 400-sample ELO scope remains visible beside the ELO numbers,
- no layer is represented by color alone.

## Required experiment ledger

For every comparison preserve:

- exact checkpoint and revision,
- prompt representation: natural language or tags,
- negative prompt,
- seed, resolution, steps, sampler, scheduler, CFG, VAE,
- each adapter name, source, trigger, and strength,
- any merge recipe,
- output grid and rater protocol.

The body must explain why changing several of these at once prevents attributing
an improvement to v1.1.

## Hidden transfer checks

1. A v1.1 sample looks better after adding two LoRAs and a different VAE. What
   can be attributed to the checkpoint?
2. The published ELO is higher. Why does that not prove every anatomy prompt or
   every tag schema improved?
3. A guide calls a tag convention “official Illustrious v1.1 behavior.” Which
   source evidence is missing?
4. A full fine-tune loses photographic prompts. Which inherited capability and
   regression set should have been protected?

## Stop rule

Stop below SDXL implementation internals already covered by the Stable
Diffusion baseline article. Do not invent a v1.1 training recipe from community
customs. Move on when the learner can label every statement as inherited,
card-stated, or locally tested and can design a controlled comparison that
isolates the checkpoint delta.
