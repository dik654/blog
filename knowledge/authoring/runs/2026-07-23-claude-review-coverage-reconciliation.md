# Claude review coverage reconciliation

## 판정 규칙

`knowledge/authoring/runs`의 2026-07-23 기록을 다시 대조했다. 응답 헤더가 정확히 `[claude-code:sonnet`으로 시작할 때만 true-Claude 단건 검토로 인정했다. Codex 헤더, 헤더 없는 응답, timeout, HTTP 500, connector 실패는 검토 내용이 있더라도 Claude coverage에 포함하지 않았다.

## 범위 판정

기존 `2026-07-23-claude-review-backfill-report.json`은 70개 글을 완료 대상으로 명시하지만 개별 응답 헤더를 보존하지 않았다. 이후의 세 identity-audited ledger는 57개 고유 글을 담고 있으며 중복 배정은 없다.

새 ledger 57개는 기존 70개를 대체하는 새 전체 범위가 아니다. 기존 70개 중 56개를 재검증한 묶음에 새 글 `foundation-training-step`이 추가된 구조다. 따라서 현재 의도된 article inventory는 **기존 70개 + 새 글 1개 = 71개**로 판정한다.

| 상태 | 글 수 |
|---|---:|
| 의도된 전체 inventory | 71 |
| 기록된 true-Claude 헤더 확인 | 57 |
| true-Claude 헤더 증거 없음 | 14 |
| 세 ledger 사이 중복 slug | 0 |
| identity-audited 전체 시도 | 75 |
| 거부·실패 시도 | 18 |

11개 route sequencing 검토는 article-level coverage와 별도이며, 누락된 단건 검토를 대신하지 않는다.

## 확인된 57개

### Serving / On-device 13

`efficient-inference-on-device`, `k8s-gpu-fleet`, `litellm-gateway`, `llm-disaggregated-serving`, `llm-serving-ops`, `observability-aiops`, `on-device-llm-runtime`, `serving-deployment`, `vllm-paged-attention`, `vllm-scheduler`, `vllm-serving`, `vllm-spec-decode`, `vllm-vlm-serving`

### Foundations / Models 12

`bert`, `foundation-training-step`, `llm-data-engine`, `lstm`, `reasoning-post-training-frontier`, `rl-decision-system-contracts`, `rl-imitation-offline-learning`, `rl-ppo-continuous-control`, `rl-safe-constrained-learning`, `rnn`, `training-pipeline`, `transformer-architecture`

### Systems / Domains 32

`animation-captioning`, `animation-fps-vfi`, `animation-lora-training`, `animation-production-workflow`, `animation-video-dataset`, `animation-video-evaluation`, `audio-representation-neural-codecs`, `clip-vision-language-model`, `cnn`, `comfyui-core-graph`, `comfyui-custom-nodes-ops`, `comfyui-edit-models-flux-qwen`, `comfyui-ksampler-parameters`, `comfyui-loaders-gguf`, `comfyui-lora-control-conditioning`, `comfyui-upscale-postprocess`, `comfyui-workflow-map`, `deformable-detr`, `document-structure-assembly`, `html-table-structure-reconstruction`, `native-speech-generation`, `object-detection-systems`, `ocr-document-ai-map`, `ocr-runtime-evaluation`, `olmocr-2`, `paddleocr-vl`, `realtime-duplex-voice-systems`, `resnet`, `speech-audio-models`, `speech-recognition-objectives`, `vision-system-contracts`, `vision-transformer`

각 slug의 실제 헤더는 다음 세 원장에 보존되어 있다.

- `2026-07-23-claude-review-backfill-serving-on-device.json`
- `2026-07-23-claude-review-backfill-foundations-models.json`
- `2026-07-23-claude-review-backfill-systems-domains.json`

## 누락된 14개

다음 글은 기존 70개 inventory에는 있지만 세 identity-audited ledger 어디에도 개별 `[claude-code:sonnet...` 헤더가 없다. 과거에 검토했을 가능성과 별개로, 현재 파일 기록만으로는 true-Claude 검토를 증명할 수 없다.

`llm-architecture-dense-transformers`, `llm-architecture-gallery`, `llm-architecture-hybrid-linear`, `llm-architecture-kv-long-context`, `llm-architecture-sparse-moe`, `llm-pretraining-scaling`, `open-r1`, `post-training-rlvr`, `rl-mdp-bellman`, `rl-model-based-world-models`, `rl-policy-gradient-actor-critic`, `rl-pomdp-state-estimation`, `rl-temporal-difference-dqn`, `rlhf`

## 거부된 시도

- Serving / On-device: 헤더 앞에 다른 문장이 나온 2건. 이후 두 글 모두 유효한 Claude 헤더를 다시 받았다.
- Foundations / Models: Codex 9건, headerless timeout 1건. 이후 12개 대상 모두 유효한 Claude 헤더를 받았다.
- Systems / Domains: Codex 3건, HTTP 500 1건, connector 실패 2건. 이후 배정된 32개 대상 모두 유효한 Claude 헤더를 받았다.

총 75회 중 57회만 accepted coverage이며, 18회는 재시도 이력으로만 남긴다.

## 별도 소스 검증

Claude 검토 자체는 완료됐지만 live source 확인이 남은 묶음은 Comfy Cloud submit path, PP-DocLayoutV2 세부 구조, MinerU-Popo 논문, AniMatrix·LTX-2·FLUX.2 최신 제품 자료다. 이는 identity coverage 누락이 아니라 source-verification 후속 작업이다.

`GPT-Realtime-Whisper` 명칭은 root가 OpenAI 공식 페이지에서 별도로 확인했으므로 해결된 항목이다.

## 결론

현재 기록 기준 coverage는 **57/71 (80.28%)**다. 14개에 대해 실제 Sonnet 헤더를 보존한 단건 검토를 추가하기 전에는 “전체 Claude 검증 완료”로 표기하면 안 된다.
