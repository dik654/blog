# AI article beginner-entry narrative audit

Date: 2026-08-01 KST
Scope: 305 registered AI article routes
Browser receipt: `.codex-tmp/beginner-entry-narrative-audit-2026-08-01.json`

## Why this audit exists

`QuestionLead` is useful only after the reader can understand the question. A route entry must not begin by testing terms that the page has not introduced. The required first-screen order is:

1. a familiar scene or task,
2. the minimum nouns needed to name what happened,
3. a question that separates the important concepts,
4. the deeper model, equation, paper, and implementation detail.

This is not a rule that every article must begin with an elementary analogy. A later article may rely on prerequisites that are visible in its learning-path rail. The strictest check applies to the first article of each path.

## Audit result

- 305 routes loaded successfully in the local browser.
- The current snapshot finds 293 routes with a `QuestionLead` and 177 questions without same-section framing. This is a broad structural detector, not 177 confirmed defects; custom article shells and already familiar questions still require manual judgment.
- Unsupported first-path entries fell from 50 to 14 after Waves B1 through D. The detector is used to narrow review scope, while the focused browser test is the completion oracle for each rewritten route.
- 56 routes were found as the first article in at least one learning path across the two audit snapshots and therefore received manual triage. Two Agent Runtime routes became visible after the current learning-path data changed during the audit.
- Wave A completed six high-impact route entries: `animation-production-workflow`, `moe-ssd-streaming`, `reasoning-post-training-frontier`, `robot-ai-top-down`, `dit-flow-matching-evaluation`, and `knowledge-compiler`.
- Wave B1 completed six runtime entries: `agent-runtime-current-first`, `agent-frameworks`, `compression-pipeline`, `llm-disaggregated-serving`, `llm-serving-ops`, and `on-device-llm-runtime`.
- Wave B2 completed seven model-understanding and RL entries: `llm-interpretability-frontier`, `qwen-korean-consistency`, `rl-decision-system-contracts`, `rl-mdp-bellman`, `rl-pomdp-state-estimation`, `rl-ppo-continuous-control`, and `vision-representation-encoders-current`.
- Wave C completed the remaining 17 short bridges after `animation-production-workflow` had already been fixed in Wave A. The rewritten entries introduce the missing unit, input/output contract, or product responsibility without removing the existing diagnostic question.

## Manual triage of the 56 path entries

### Keep the current question-led opening

The question already supplies a familiar situation and does not require unexplained specialist vocabulary.

`calculus-computational-graphs`, `comfyui-workflow-map`, `deep-learning-overview`, `generative-theory`, `image-classification-pipeline`, `image-rag-defect-retrieval`, `linear-algebra-tensors`, `multimodal-foundation-models-current`, `prompt-engineering`, `sentence-embeddings`, `time-series-anomaly-detection`, `time-series-forecasting-evaluation`, `video-understanding`, `vision-system-contracts`

### Add a short plain-language bridge — complete

The first question is useful, but one unit, workflow noun, product family, or evaluation term should be introduced first.

`animation-production-workflow`, `audio-representation-neural-codecs`, `competition-workflow`, `eda-workflow`, `llm-architecture-gallery`, `lora-finetuning`, `native-speech-generation`, `object-detection-systems`, `ocr-document-ai-map`, `open-image-video-models`, `optimization-geometry`, `speech-audio-models`, `speech-recognition-objectives`, `stable-diffusion-open-models`, `tokenizer`, `training-pipeline`, `vision-promptable-segmentation-tracking`, `world-model-physical-ai`

Completed: all 18. `animation-production-workflow` was completed in Wave A; the other 17 were completed in Wave C.

### Introduce prerequisites before asking the question

The current question assumes architecture, runtime, reinforcement-learning, or systems vocabulary. These are the main remediation queue.

Completed: `moe-ssd-streaming`, `reasoning-post-training-frontier`, `robot-ai-top-down`, `dit-flow-matching-evaluation`, `knowledge-compiler`, `agent-runtime-current-first`, `agent-frameworks`, `compression-pipeline`, `llm-disaggregated-serving`, `llm-serving-ops`, `on-device-llm-runtime`, `llm-interpretability-frontier`, `qwen-korean-consistency`, `rl-decision-system-contracts`, `rl-mdp-bellman`, `rl-pomdp-state-estimation`, `rl-ppo-continuous-control`, `vision-representation-encoders-current`

Pending from this manually confirmed prerequisite-first set: none.

### Preserve as specialist or source-reading routes

These pages are codebase contracts or primary-paper reconstructions. They should be entered through a visible prerequisite route instead of pretending that every page is an absolute beginner page.

Completed: `claw-config`, `claw-overview`, `claw-permissions`, `claw-task-team`, `claw-worker-boot`, `paper-word2vec-2013`

These pages now use a compact specialist entry contract. It states what the article assumes, links each assumption to the route that owns the explanation, and only then presents the source-reading question. This preserves the depth and independent purpose of the article without making a new reader infer an invisible prerequisite chain.

## Remediation waves

1. **Wave A, current frontier hubs — complete:** fixed the six high-impact entries listed above.
2. **Wave B1, runtime contracts — complete:** fixed Agent Runtime, framework ownership, compression, disaggregated serving, serving operations, and on-device release.
3. **Wave B2, model understanding and RL contracts — complete:** fixed interpretability, Korean consistency, the four RL entries, and current representation encoders.
4. **Wave C, short bridges — complete:** added only the missing unit or task definition to the 17 remaining otherwise sound openings and preserved their existing questions.
5. **Wave D, specialist route labels — complete:** made prerequisite ownership explicit for five Claw source-reading pages and the Word2Vec paper reconstruction rather than adding repetitive elementary prose.

## Acceptance contract

- A first-path article never requires an unexplained acronym in its first question.
- The familiar opening does not replace the technical content; it gives the nouns that make the technical content readable.
- The first interactive Viz appears only after its input, output, and reading task have been stated.
- Later path articles may assume earlier concepts, but the dependency must be visible in the learning rail or an explicit handoff.
- Browser checks cover 360, 390, 768, and 1440 pixel widths, visible text of at least 12 px, 44 px interactive controls, no horizontal overflow, no clipped text, and no console errors.

## Validation status

Wave B1 passed the 15-route beginner-entry regression locally and in production. Wave B2 passed the expanded 22-route regression locally and in production. Wave C passed the expanded 39-route regression locally and in production. Its 17 entry sections also passed 68 local and 68 production measurements across 360/390/768/1440 with no document overflow, clipped text, sub-12px visible text, sub-44px controls, KaTeX errors, or console errors. The first pass found 11px formula-step numbers in the architecture gallery and 9–10px detector labels; both Viz components were raised to 12px and then remeasured at zero failures. Wave D passed 6/6 prerequisite-ownership tests locally and in production, plus 24 local and 24 production entry measurements across 360/390/768/1440 with zero overflow, clipped text, sub-12px text, or console failures. Its first source-page scan also raised the Task control-plane labels and code excerpt from 9–11px to 12px. Receipts are in `.codex-tmp/beginner-entry-wave-b1-2026-08-01/`, `.codex-tmp/beginner-entry-wave-b2-2026-08-01/`, `.codex-tmp/beginner-entry-wave-c-2026-08-01/`, and `.codex-tmp/specialist-entry-wave-d-2026-08-01/`. Claude cross-validation remains deferred until 2026-08-01 18:00 KST under `cm-blog-claude-ai-learning-closure-retry.timer`.
