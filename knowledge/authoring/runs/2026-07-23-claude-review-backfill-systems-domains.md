# Claude review backfill: systems domains

## Scope and identity

This read-only run accepted 32/32 assigned single-article reviews:

- Animation Production: 6
- ComfyUI Runtime: 8
- Computer Vision: 7
- Document AI: 5, plus optional `olmocr-2`
- Speech/Audio: 5

LLM Serving (11) and On-device (2) were reassigned to another reviewer and are intentionally absent from this ledger.

Every accepted result exposed an explicit `[claude-code:sonnet · L3 · ...]` header. Three `[codex:gpt-5.5 · L3 · ...]` results were retained only as baselines and were not called Claude or counted. The named `ai-researcher` fresh session failed with HTTP 500, and two early route calls failed to connect. In total, 38 executions produced 32 accepted Claude reviews and 6 rejected/failed attempts. No direct Claude CLI was used and no fallback result was promoted.

## Confirmed findings

All confirmed high/medium findings were fixed in the shared worktree and re-read against the current source:

| Severity | Article | Confirmed defect | Current state |
|---|---|---|---|
| High | `animation-production-workflow` | Prose put LoRA before structural control while both visuals taught Prompt → control → LoRA → full. | Fixed: prose and visuals now use the same minimum-intervention order. |
| Medium | `animation-production-workflow` | Temporal finishing was named but absent from the six-stage contract visual. | Fixed: the route and visual now contain seven stages including time representation. |
| Medium | `animation-captioning` | The loss defined `c_i'` but passed unmasked `c_i` to the model. | Fixed: the loss now consumes `c_i'`. |
| Medium | `animation-video-evaluation` | Vector `q(B)-q(A)` was compared to scalar `δ`. | Fixed: the paired delta now uses scalar `S(B)-S(A)`. |
| Medium | `animation-video-evaluation` | Runtime and rights were visual hard gates but were absent from the quality-vector gate formula. | Fixed: quality, runtime budget, and rights are separate gates. |
| Medium | `comfyui-core-graph` | The body promised backward dependency closure, but the visual only showed cache reuse. | Fixed: `TypedDagViz` now traces the target backward and then orders producers. |
| Medium | `object-detection-systems` | Plain JS `"\tau"` strings parsed `\t` as a tab and corrupted KaTeX legends. | Fixed: affected symbols use `String.raw`. |
| Medium | `vision-transformer` | The pre-LN encoder diagram omitted normalization before the MLP. | Fixed: the six-step diagram contains both normalizations. |
| Medium | `cnn` | Plain JS LaTeX strings corrupted `delta` and `star` legend symbols. | Fixed: affected symbols use `String.raw`. |
| Medium | `document-structure-assembly` | Generic `S_ij` notation obscured that the decision applies only to the top candidate. | Fixed: the formula defines `j_i*`, first/second scores, margin, and `decision(i,j_i*)`. |
| Medium | `document-structure-assembly` | TEDS was expanded only after its first body use. | Fixed at the capability check. |
| Medium | `html-table-structure-reconstruction` | The overflow verdict described Q1+Q2 as one new cell of width three. | Fixed: it states the sum of the two newly starting cells. |
| Medium | `olmocr-2` | RLVR appeared before its English expansion. | Fixed in the first rendered step. |
| Medium | `realtime-duplex-voice-systems` | VAD, ASR, and PII were never expanded. | Fixed at each first use. |

Root reported 20 responsive Animation checks, completed focused CNN/Document checks, 4/4 table/olmOCR checks, and 1/1 Speech target check. This reviewer did not run app tests; it re-read the fixed snippets and validated only these report files.

## Provisional items

The Claude workers explicitly lacked live WebFetch/Search for several current sources. These are not confirmed defects:

- Comfy Cloud's exact hosted submit path in `comfyui-workflow-map`.
- PP-DocLayoutV2's six-layer pointer detail and current benchmark wording in `paddleocr-vl`.
- MinerU-Popo arXiv/source claims shared by `document-structure-assembly` and `ocr-runtime-evaluation`.
- Current AniMatrix, LTX-2, and FLUX.2 documentation/repository details.

Repeated MinerU-Popo and current-product limitations were deduplicated into source-verification clusters rather than counted as separate confirmed findings.

## Root official-source verification

The Claude worker marked the `GPT-Realtime-Whisper` label in `speech-recognition-objectives` unverified only because its session lacked live search. Root independently verified the label on OpenAI's official [Advancing voice intelligence with new models in the API](https://openai.com/index/advancing-voice-intelligence-with-new-models-in-the-api/) page dated 2026-05-07. The JSON preserves both the worker limitation and the later official-source resolution.

## Rejected baselines

The rejected Codex baselines were:

- `animation-production-workflow`: `[codex:gpt-5.5 · L3 · $0.0000 · 69339ms]`
- `animation-video-dataset`: `[codex:gpt-5.5 · L3 · $0.0000 · 71846ms]`
- `animation-fps-vfi`: `[codex:gpt-5.5 · L3 · $0.0000 · 56842ms]`

The Codex `animation-video-dataset` duration concern conflicted with the accepted Claude reading of `(N-1)/f` as the last-frame timestamp offset. It was not promoted. The JSON companion contains every accepted header, per-article severity count, failure reason, disposition, and dedup status.
