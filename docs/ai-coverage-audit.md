# AI 정본·최신 논문 누락 대조 · 2026-10-04

## 범위

공개 catalog가 반환한 374편의 실제 import closure와 개념 소유 위치를 대조했다. 전체 소스에서 관련 용어·원문·구현 유무를 검색했고 아래 핵심 경로의 본문과 계산은 직접 읽었다. 374편의 모든 문장을 새로 사실 검증했다는 뜻은 아니다.

## 발견한 공백과 처리

| 분야 | 기존 정본 | 확인한 공백과 처리 | 1차 근거 |
|---|---|---|---|
| Attention | flash-attention-io-aware-kernel | FA4 비대칭 자원 병목·exp·TMEM/2CTA 추가. 128MiB의 입력 배수, GiB 시간, SM별 용량과 전체 대역폭 혼용 수정 | [FA4 v1](https://arxiv.org/html/2603.05451v1) |
| Recurrent memory | fast-weight-memory-and-chunkwise-recurrence | erase/write의 서로 다른 축과 untied gate를 기존 delta rule 뒤에 연결 | [GDN2 v1](https://arxiv.org/html/2605.22791v1) |
| MoE | expert-parallelism-moe-systems | 기대 payload·실제 remote·복제·병목 계산. V1 normal/low-latency 분리를 V2.5 공통 EPBuffer와 구별 | [DeepEP 93eb6eb](https://github.com/deepseek-ai/DeepEP/tree/93eb6eb238127e96c6d7a4a625a6dad158348509) |
| RL verification | reward-design-for-verifiable-rl | 자동 verifier가 정확하다는 단정 수정. 오류율·동일 reward group·process oracle 범위 계산 | [VPR v1](https://arxiv.org/abs/2605.10325), [Reasoning Arena](https://arxiv.org/abs/2606.09380) |
| Agent memory/eval | agent-memory-lifecycle | 회상과 후속 행동 성공률의 측정 경계 연결 | [MemoryArena](https://arxiv.org/abs/2602.16313) |
| World model | modern-image-model-stack, visual-representation-tokenizers | action-conditioned rollout·collapse 방지·재계획 정본 없음. 독립 정본 필요 | [LeWM](https://arxiv.org/abs/2603.19312), V-JEPA2 공식 원문 대조 |
| Attention backend | attention-kernel-anatomy-and-backends | Hopper 이상이면 FA3 기본이라는 선택 규칙을 target·dtype·shape·version별 비교로 수정 | 공식 FA4 구현 |
| Serving·long context | disaggregated-prefill-decode-serving, prefix-caching-radix-attention, hybrid-kv-cache-allocation, yarn-rope-extension | KV 전달·재사용·위치 확장 정본 유지. 압축과 정확한 회상 보장을 구분 | 기존 정본의 1차 자료 유지 |
| Multimodal | vision-language-model-architecture, modern-image-model-stack, visual-representation-tokenizers | 입력 modality·표현·행동의 기존 정본 유지. world-model 경로 연결 | 기존 정본과 신규 action rollout 비교 |

## 공개 구현 pin

- Dao-AILab/flash-attention: e9515d5dee6ade134a33d6020d38d01ef0596996, 2026-10-03.
- NVlabs/GatedDeltaNet-2: a5552fe3c67e0ebc7ef1220df68ae8896ec62d56, 2026-08-29.
- deepseek-ai/DeepEP: 93eb6eb238127e96c6d7a4a625a6dad158348509, 2026-09-30.
- 저자 benchmark는 자기보고이며 이 작업에서 GPU 재현은 수행하지 않는다.

## 변경 전후 검산

- FA: Q/K/V 합은 1.5MiB이므로 128MiB는 약 85.33배다. Q/K/V/O 네 배열 합 2MiB를 분모로 삼을 때에만 64배다.
- FA: 32GiB / 2TB/s = 17.18ms. 동일 단위일 때의 하한 비율이며 실제 kernel 시간은 아니다.
- EP: V1의 zero-SM 설명을 최신 API에 일반화하지 않는다. V2.5는 EP dispatch/combine에 SM이 필요함을 명시한다.
- RL: verifier가 낸 점수는 관측치다. 형식 통과와 정답 통과를 분리하고 false acceptance를 별도로 측정한다.

## 최종 구현과 검산

- 기존 4편을 S/B/0–7의 10단계로 고쳤고, 별도 정본 `world-model-latent-planning`을 추가했다. 기존 정본 3곳에 연결·평가 설명을 보완했다.
- 공식 원문 전체 6개 파일과 LICENSE를 저장하고 CodeSidebar에서 commit·원문 행·주석을 확인하도록 했다. 가공한 의사코드를 공식 소스로 표시하지 않았다.
- LeWM은 논문 저자가 연결한 `lucas-maes/le-wm` 8edfeb336732b5f3ce7b8b210d0ba370a09e2cac에 고정했다. planning framework는 `galilai-group/stable-worldmodel` 21446f1ede6d5284e981bd7b47f432b994e6d812이며 논문 발표 당시 revision과 같다는 주장은 하지 않는다.
- Open-R1은 전체 `rewards.py` 5b6ff22b3fb7aa069c54866e517f39dfc3160e09를 별도로 확보했다. 기존 다른 글의 축약 snapshot을 새 근거로 재사용하지 않았다.
- 학습 문제는 기초 6·심화 4씩 총 50개다. 각 답은 계산 결과와 성립 조건을 함께 검사한다. 논문·구현 해설은 문제·아이디어·전제·실험 범위·일반화 경계를 가진 14개이며 MemoryArena 연결 해설을 더했다.
- `/tmp/ai-numeric-audit.py`가 softmax 분자·분모, delta·독립 gate, MiB/GiB·MoE 처리량, verifier 교차표와 rollout 비용을 계산했다. 결과는 `/tmp/ai-numeric-audit.json`에 남겼다.
- Delta chunk의 `(I+L)U=diag(β)V`에는 초기 기억 0·decay 없음이라는 가정을 명시했다. 초기 기억이 있으면 해당 읽기 항도 포함해야 한다.
- FA4 v1의 본문 B200·부록 B100 불일치와 LeWM 일반 MPC 설명·부록 F.1 실행 간격 차이를 본문에 기록했다. 이 글의 숫자 가정이나 논문의 최대 가속비를 장치·현실 환경 전체로 일반화하지 않았다.

기존 graph 26개 정의도 수정했다. ID·kind·domain·aliases·canonicalHref는 유지하면서 IO 점근식, 실수 산술과 bit 동일성, 균등 routing 기대값, shaping의 경계 조건, 연속 reward의 범위와 척도 조정을 정확히 한정했다. 신규 개념은 6개다. 개별 before→after와 공식 근거는 등록 JSON의 fixes에 있다.

## 문장과 화면 검수 기록

- humanize-korean은 10개 조각으로 수행했다. 8개는 자동 gate 통과다. Delta의 2개는 변경 전후가 같아도 `(2,1.8)` 같은 tuple을 각주 `8)`로 오인하는 경고였다. 모든 숫자 token 순서와 괄호식이 동일한지 별도 검사했으며 경고 원문을 지우지 않았다.
- `/tmp/ai-humanize/summary.json`과 각 `review.json`에 자동 결과·오탐 판단·A-8/D-2/C-8/F-5 검토를 남겼다. 문장 윤문 뒤 초기 기억 조건을 명료하게 하는 사실 설명을 추가했으며 숫자 검산과 대조했다.
- 대상 5편 용어 밀집 감사: affectedRoutes 0, findings 0. 월드모델 도식의 정적 스타일 감사 통과.
- 10단계·멈춤 문장 각각 10개, 모든 논문 해설 anchor를 본문과 대조했다. 등록 JSON의 모든 개념 참조는 기존 graph 또는 신규 6개에 존재한다.
- GPU benchmark·모델 학습·로봇 실행을 이 환경에서 재현하지 않았다. 공식 구현 대조와 손계산의 재현 범위를 구분했다.

## 374편 공개 경로 인벤토리

아래 유지 판정은 이번 최신 근거 검수 범위에서 중복 정본을 만들지 않는다는 뜻이다.

| 정본 | 실제 소스 수 | 이번 처리 |
|---|---:|---|
| ai/activation-functions | 3 | retain canonical ownership |
| ai/adam-optimizer | 5 | retain canonical ownership |
| ai/adaptive-hyperparameter-search | 3 | retain canonical ownership |
| ai/adversarial-density-ratios | 3 | retain canonical ownership |
| ai/agent-changelog-evidence | 5 | retain canonical ownership |
| ai/agent-code-mode | 5 | retain canonical ownership |
| ai/agent-control-boundaries | 3 | retain canonical ownership |
| ai/agent-delegation-contracts | 3 | retain canonical ownership |
| ai/agent-devlog-patterns | 5 | retain canonical ownership |
| ai/agent-extension-boundaries | 3 | retain canonical ownership |
| ai/agent-failure-modes-and-recovery | 2 | retain canonical ownership |
| ai/agent-frameworks | 9 | retain canonical ownership |
| ai/agent-loop-foundations | 3 | retain canonical ownership |
| ai/agent-memory-lifecycle | 3 | evidence and connection update |
| ai/agent-plan-replanning | 3 | retain canonical ownership |
| ai/agent-run-contract | 3 | retain canonical ownership |
| ai/agent-sandbox-security | 5 | retain canonical ownership |
| ai/agent-verification | 3 | retain canonical ownership |
| ai/architecture-decision-records | 5 | retain canonical ownership |
| ai/arima | 10 | retain canonical ownership |
| ai/attention-kernel-anatomy-and-backends | 2 | evidence and connection update |
| ai/attention-theory | 10 | retain canonical ownership |
| ai/augmentation-evaluation | 3 | retain canonical ownership |
| ai/autoencoder | 3 | retain canonical ownership |
| ai/autoregressive-generative-models | 3 | retain canonical ownership |
| ai/backprop-optimization | 7 | retain canonical ownership |
| ai/bert | 5 | retain canonical ownership |
| ai/bert-input-packing | 3 | retain canonical ownership |
| ai/bert-mlm-corruption | 3 | retain canonical ownership |
| ai/bert-pretraining-objectives | 3 | retain canonical ownership |
| ai/bert-task-heads | 3 | retain canonical ownership |
| ai/bi-encoder-retrieval | 3 | retain canonical ownership |
| ai/bptt | 5 | retain canonical ownership |
| ai/catboost-ordered-learning | 5 | retain canonical ownership |
| ai/cfg-pushdown-automata | 3 | retain canonical ownership |
| ai/classification-metrics | 3 | retain canonical ownership |
| ai/claude-code | 5 | retain canonical ownership |
| ai/claude-code-checkpointing | 3 | retain canonical ownership |
| ai/claude-code-hooks | 3 | retain canonical ownership |
| ai/claude-code-instructions-memory | 3 | retain canonical ownership |
| ai/claude-code-permissions | 3 | retain canonical ownership |
| ai/claude-code-subagents | 3 | retain canonical ownership |
| ai/claw-api-client | 10 | retain canonical ownership |
| ai/claw-bash | 12 | retain canonical ownership |
| ai/claw-cli | 10 | retain canonical ownership |
| ai/claw-compaction | 12 | retain canonical ownership |
| ai/claw-config | 11 | retain canonical ownership |
| ai/claw-file-ops | 10 | retain canonical ownership |
| ai/claw-hooks | 3 | retain canonical ownership |
| ai/claw-mcp | 3 | retain canonical ownership |
| ai/claw-overview | 13 | retain canonical ownership |
| ai/claw-permissions | 9 | retain canonical ownership |
| ai/claw-plugin | 3 | retain canonical ownership |
| ai/claw-policy-engine | 3 | retain canonical ownership |
| ai/claw-recovery | 10 | retain canonical ownership |
| ai/claw-session | 10 | retain canonical ownership |
| ai/claw-subagent-orchestration | 10 | retain canonical ownership |
| ai/claw-task-team | 9 | retain canonical ownership |
| ai/claw-telemetry | 9 | retain canonical ownership |
| ai/claw-tool-system | 12 | retain canonical ownership |
| ai/claw-worker-boot | 3 | retain canonical ownership |
| ai/cnn | 5 | retain canonical ownership |
| ai/cnn-receptive-fields | 3 | retain canonical ownership |
| ai/cnn-translation-equivariance | 3 | retain canonical ownership |
| ai/code-mode-runtime-contracts | 5 | retain canonical ownership |
| ai/competition-baseline | 3 | retain canonical ownership |
| ai/competition-submission-control | 3 | retain canonical ownership |
| ai/competition-workflow | 3 | retain canonical ownership |
| ai/compression-pipeline | 9 | retain canonical ownership |
| ai/constitutional-ai | 4 | retain canonical ownership |
| ai/context-engineering | 3 | retain canonical ownership |
| ai/context-instruction-boundaries | 3 | retain canonical ownership |
| ai/context-provenance-freshness | 3 | retain canonical ownership |
| ai/context-window-optimization | 4 | retain canonical ownership |
| ai/continual-learning-foundations | 2 | retain canonical ownership |
| ai/continued-pretraining | 3 | retain canonical ownership |
| ai/continuous-batching-step-anatomy | 2 | retain canonical ownership |
| ai/contrastive-evaluation | 3 | retain canonical ownership |
| ai/contrastive-learning | 3 | retain canonical ownership |
| ai/cosine-restart-scheduling | 3 | retain canonical ownership |
| ai/cost-sensitive-thresholding | 3 | retain canonical ownership |
| ai/cross-entropy | 12 | retain canonical ownership |
| ai/cross-review-error-classes | 3 | retain canonical ownership |
| ai/cross-validation | 3 | retain canonical ownership |
| ai/cuda-graph-capture | 6 | retain canonical ownership |
| ai/data-augmentation | 3 | retain canonical ownership |
| ai/deep-learning-overview | 3 | retain canonical ownership |
| ai/deepfake-dataset-governance | 3 | retain canonical ownership |
| ai/deepfake-detection | 3 | retain canonical ownership |
| ai/deepfake-frequency-evidence | 3 | retain canonical ownership |
| ai/deepfake-preprocessing-lineage | 3 | retain canonical ownership |
| ai/deepfake-video-decisions | 3 | retain canonical ownership |
| ai/denoising-masked-autoencoders | 3 | retain canonical ownership |
| ai/depthwise-separable-convolution | 3 | retain canonical ownership |
| ai/dezero-advanced | 19 | retain canonical ownership |
| ai/dezero-autodiff | 19 | retain canonical ownership |
| ai/dezero-nn | 19 | retain canonical ownership |
| ai/differential-attention | 2 | retain canonical ownership |
| ai/diffusion-continuous-time | 4 | retain canonical ownership |
| ai/diffusion-language-models | 2 | retain canonical ownership |
| ai/diffusion-models | 6 | retain canonical ownership |
| ai/diffusion-transformer-architecture | 2 | retain canonical ownership |
| ai/dinov3-self-supervised-backbone | 15 | retain canonical ownership |
| ai/disaggregated-prefill-decode-serving | 2 | retain canonical ownership |
| ai/distributional-semantics | 12 | retain canonical ownership |
| ai/document-parsing-and-table-extraction | 2 | retain canonical ownership |
| ai/domain-data-governance | 3 | retain canonical ownership |
| ai/domain-finetuning | 3 | retain canonical ownership |
| ai/domain-task-finetuning | 3 | retain canonical ownership |
| ai/dpo | 4 | retain canonical ownership |
| ai/dropout-regularization | 3 | retain canonical ownership |
| ai/early-stopping | 3 | retain canonical ownership |
| ai/ecod | 10 | retain canonical ownership |
| ai/eda-workflow | 10 | retain canonical ownership |
| ai/embedding-evaluation | 3 | retain canonical ownership |
| ai/embedding-model-fine-tuning | 2 | retain canonical ownership |
| ai/embedding-serving-contract | 3 | retain canonical ownership |
| ai/engineering-lessons-ledger | 5 | retain canonical ownership |
| ai/ensemble-methods | 11 | retain canonical ownership |
| ai/evaluation-datasets-and-pipelines | 2 | retain canonical ownership |
| ai/evaluation-metrics | 3 | retain canonical ownership |
| ai/experiment-tracking | 3 | retain canonical ownership |
| ai/expert-parallelism-moe-systems | 2 | 10-stage rewrite |
| ai/fast-weight-memory-and-chunkwise-recurrence | 2 | 10-stage rewrite |
| ai/feature-engineering | 13 | retain canonical ownership |
| ai/fft | 9 | retain canonical ownership |
| ai/fine-tuning-tradeoffs-forgetting-and-merging | 2 | retain canonical ownership |
| ai/flash-attention-io-aware-kernel | 2 | 10-stage rewrite |
| ai/fold-local-validation | 3 | retain canonical ownership |
| ai/gan | 5 | retain canonical ownership |
| ai/gan-conditional-evaluation | 3 | retain canonical ownership |
| ai/gan-training-dynamics | 3 | retain canonical ownership |
| ai/gan-wasserstein-critics | 3 | retain canonical ownership |
| ai/gated-activations | 3 | retain canonical ownership |
| ai/generative-identity-diversity | 13 | retain canonical ownership |
| ai/generative-measurement-controls | 13 | retain canonical ownership |
| ai/generative-theory | 3 | retain canonical ownership |
| ai/gradient-boosting | 5 | retain canonical ownership |
| ai/grammar-constrained-generation | 3 | retain canonical ownership |
| ai/grammar-tokenizer-decoding | 3 | retain canonical ownership |
| ai/graphrag-community-and-multihop-search | 2 | retain canonical ownership |
| ai/grouped-validation | 3 | retain canonical ownership |
| ai/gru | 7 | retain canonical ownership |
| ai/harness-failure-ablation | 3 | retain canonical ownership |
| ai/hybrid-kv-cache-allocation | 4 | retain canonical ownership |
| ai/hyper-connections-residual-streams | 2 | retain canonical ownership |
| ai/hyperparameter-tuning | 3 | retain canonical ownership |
| ai/image-augmentation-transforms | 3 | retain canonical ownership |
| ai/image-backbone-scaling | 3 | retain canonical ownership |
| ai/image-classification-pipeline | 3 | retain canonical ownership |
| ai/image-embedding-pipeline | 15 | retain canonical ownership |
| ai/image-probability-decisions | 3 | retain canonical ownership |
| ai/image-text-contrastive-pretraining | 14 | retain canonical ownership |
| ai/image-training-stages | 3 | retain canonical ownership |
| ai/image-video-lora-architecture | 2 | retain canonical ownership |
| ai/imbalance-loss-weighting | 3 | retain canonical ownership |
| ai/imbalance-resampling | 3 | retain canonical ownership |
| ai/imbalanced-classification-evaluation | 3 | retain canonical ownership |
| ai/imbalanced-data | 3 | retain canonical ownership |
| ai/imitation-learning-and-policy-generalization | 2 | retain canonical ownership |
| ai/in-context-lora | 6 | retain canonical ownership |
| ai/incremental-parsing-tree-sitter | 3 | retain canonical ownership |
| ai/inference-cost-and-capacity-planning | 2 | retain canonical ownership |
| ai/inference-failure-absorption | 3 | retain canonical ownership |
| ai/inference-optimization-layers | 2 | retain canonical ownership |
| ai/inference-runtime-anatomy | 2 | retain canonical ownership |
| ai/inference-stack-standard-levels | 3 | retain canonical ownership |
| ai/kimi-k3-architecture | 5 | retain canonical ownership |
| ai/kimi-k3-depth-routing | 5 | retain canonical ownership |
| ai/kimi-k3-latent-moe | 5 | retain canonical ownership |
| ai/kimi-k3-sequence-mixer | 5 | retain canonical ownership |
| ai/knowledge-distillation | 4 | retain canonical ownership |
| ai/knowledge-graph-construction | 2 | retain canonical ownership |
| ai/kto | 4 | retain canonical ownership |
| ai/kv-cache-fundamentals | 8 | retain canonical ownership |
| ai/label-smoothing | 3 | retain canonical ownership |
| ai/latent-diffusion-guidance | 6 | retain canonical ownership |
| ai/latent-variable-generative-models | 3 | retain canonical ownership |
| ai/launch-overhead-and-cpu-gpu-synchronization | 2 | retain canonical ownership |
| ai/learning-curve-tracking | 3 | retain canonical ownership |
| ai/lexical-retrieval-bm25-inverted-index | 2 | retain canonical ownership |
| ai/lightgbm-efficient-trees | 5 | retain canonical ownership |
| ai/linear-attention-and-state-space-models | 2 | retain canonical ownership |
| ai/linear-autoencoder-pca | 3 | retain canonical ownership |
| ai/llm-application-caching | 2 | retain canonical ownership |
| ai/llm-as-a-judge | 2 | retain canonical ownership |
| ai/llm-dataset-engineering-and-cleaning | 2 | retain canonical ownership |
| ai/llm-evaluation-criteria-and-methods | 2 | retain canonical ownership |
| ai/llm-gateway-and-model-routing | 2 | retain canonical ownership |
| ai/llm-guardrails-and-output-validation | 2 | retain canonical ownership |
| ai/llm-harness | 3 | retain canonical ownership |
| ai/llm-monitoring-observability-and-drift | 2 | retain canonical ownership |
| ai/llm-sampling-strategies | 2 | retain canonical ownership |
| ai/llm-serving-capacity | 4 | retain canonical ownership |
| ai/llm-serving-ops | 15 | retain canonical ownership |
| ai/llm-training-stages | 4 | retain canonical ownership |
| ai/lora-finetuning | 13 | retain canonical ownership |
| ai/lr-decay-policies | 3 | retain canonical ownership |
| ai/lr-scheduling | 3 | retain canonical ownership |
| ai/lstm | 9 | retain canonical ownership |
| ai/lstm-timeseries | 10 | retain canonical ownership |
| ai/masked-edit-verb-routing | 13 | retain canonical ownership |
| ai/math-complex-numbers-oscillations | 11 | retain canonical ownership |
| ai/math-differential-equations-numerical-solvers | 8 | retain canonical ownership |
| ai/math-exponents-logarithms | 9 | retain canonical ownership |
| ai/math-functions-composition | 3 | retain canonical ownership |
| ai/math-functions-derivatives-gradients | 4 | retain canonical ownership |
| ai/math-gradient-descent-convergence | 3 | retain canonical ownership |
| ai/math-gradients-jacobians | 3 | retain canonical ownership |
| ai/math-high-dimensional-geometry | 2 | retain canonical ownership |
| ai/math-matrices-svd | 12 | retain canonical ownership |
| ai/math-numerical-precision-stability | 2 | retain canonical ownership |
| ai/math-optimization-convexity | 3 | retain canonical ownership |
| ai/math-optimization-objectives | 3 | retain canonical ownership |
| ai/math-probability-expectation-variance | 3 | retain canonical ownership |
| ai/math-random-variables-expectation | 3 | retain canonical ownership |
| ai/math-variance-sampling | 3 | retain canonical ownership |
| ai/math-vectors-inner-products | 11 | retain canonical ownership |
| ai/mcp-primitives | 3 | retain canonical ownership |
| ai/mcp-protocol | 3 | retain canonical ownership |
| ai/mcp-server-operations | 3 | retain canonical ownership |
| ai/mcp-transports | 3 | retain canonical ownership |
| ai/metric-selection-protocol | 3 | retain canonical ownership |
| ai/mixture-of-experts | 3 | retain canonical ownership |
| ai/mixup-cutmix | 3 | retain canonical ownership |
| ai/model-artifact-registry | 3 | retain canonical ownership |
| ai/model-selection-bias | 3 | retain canonical ownership |
| ai/model-vram-budgeting | 9 | retain canonical ownership |
| ai/modern-image-model-stack | 2 | evidence and connection update |
| ai/moe-routing-and-load-balancing | 2 | retain canonical ownership |
| ai/momentum-optimizer | 5 | retain canonical ownership |
| ai/motif-3-architecture | 4 | retain canonical ownership |
| ai/multi-agent-implementation | 10 | retain canonical ownership |
| ai/multi-component-finetuning-vram | 15 | retain canonical ownership |
| ai/multi-fidelity-pruning | 3 | retain canonical ownership |
| ai/multi-head-latent-attention-mechanics | 2 | retain canonical ownership |
| ai/multi-objective-hpo | 3 | retain canonical ownership |
| ai/multimodal-retrieval-and-visual-grounding | 2 | retain canonical ownership |
| ai/multiview-fusion | 9 | retain canonical ownership |
| ai/negative-result-3d-face-control | 13 | retain canonical ownership |
| ai/neural-network | 11 | retain canonical ownership |
| ai/normalizing-flows | 5 | retain canonical ownership |
| ai/on-policy-distillation | 3 | retain canonical ownership |
| ai/one-cycle-scheduling | 3 | retain canonical ownership |
| ai/one-shot-llm-pruning | 3 | retain canonical ownership |
| ai/onprem-k8s-inference-platform | 13 | retain canonical ownership |
| ai/oof-risk-estimation | 3 | retain canonical ownership |
| ai/open-r1 | 15 | retain canonical ownership |
| ai/openclaw-assistant | 19 | retain canonical ownership |
| ai/optimizers | 5 | retain canonical ownership |
| ai/orpo | 4 | retain canonical ownership |
| ai/own-vs-rent-inference-capacity | 3 | retain canonical ownership |
| ai/paired-experiment-design | 3 | retain canonical ownership |
| ai/parallelism-strategy-and-placement | 2 | retain canonical ownership |
| ai/perceptron | 15 | retain canonical ownership |
| ai/prediction-time-feature-availability | 3 | retain canonical ownership |
| ai/prefill-decode-phase-dynamics | 2 | retain canonical ownership |
| ai/prefix-caching-radix-attention | 2 | retain canonical ownership |
| ai/prompt-engineering | 6 | retain canonical ownership |
| ai/prompt-few-shot | 5 | retain canonical ownership |
| ai/prompt-injection-poisoning-and-data-protection | 2 | retain canonical ownership |
| ai/prompt-reasoning | 5 | retain canonical ownership |
| ai/prompt-structured-output | 5 | retain canonical ownership |
| ai/pruning | 3 | retain canonical ownership |
| ai/pruning-recovery-deployment | 3 | retain canonical ownership |
| ai/ptq-calibration | 3 | retain canonical ownership |
| ai/quantization | 3 | retain canonical ownership |
| ai/quantization-aware-training | 3 | retain canonical ownership |
| ai/quantization-formats-and-granularity | 2 | retain canonical ownership |
| ai/quantized-model-deployment | 3 | retain canonical ownership |
| ai/query-transformation-and-adaptive-retrieval | 2 | retain canonical ownership |
| ai/qwen-korean-consistency | 9 | retain canonical ownership |
| ai/qwen-korean-reasoning-posttraining | 3 | retain canonical ownership |
| ai/qwen36-hybrid-architecture | 4 | retain canonical ownership |
| ai/qwen36-hybrid-runtime | 3 | retain canonical ownership |
| ai/qwen36-long-context-deployment | 4 | retain canonical ownership |
| ai/qwen38-flash-next-architecture | 15 | retain canonical ownership |
| ai/rag-context-assembly-and-evaluation | 2 | retain canonical ownership |
| ai/rag-ingestion-and-chunking | 2 | retain canonical ownership |
| ai/rag-pipeline | 11 | retain canonical ownership |
| ai/ranking-metrics | 3 | retain canonical ownership |
| ai/rate-limiting-and-reliability-patterns | 2 | retain canonical ownership |
| ai/reconstruction-anomaly-detection | 3 | retain canonical ownership |
| ai/rectifier-activations | 3 | retain canonical ownership |
| ai/reference-identity-pose-separation | 13 | retain canonical ownership |
| ai/region-agnostic-inference-routing | 3 | retain canonical ownership |
| ai/regression-metrics | 3 | retain canonical ownership |
| ai/regularization-practice | 3 | retain canonical ownership |
| ai/removal-is-not-inpainting | 13 | retain canonical ownership |
| ai/reproducible-ml-execution | 3 | retain canonical ownership |
| ai/resnet | 12 | retain canonical ownership |
| ai/retrieval-ranking-funnel | 6 | retain canonical ownership |
| ai/reverse-mode-autodiff | 8 | retain canonical ownership |
| ai/reward-design-for-verifiable-rl | 2 | 10-stage rewrite |
| ai/rl-foundations-for-llm-post-training | 2 | retain canonical ownership |
| ai/rlhf | 7 | retain canonical ownership |
| ai/rnn | 8 | retain canonical ownership |
| ai/rnn-language-model | 5 | retain canonical ownership |
| ai/robot-action-representations | 2 | retain canonical ownership |
| ai/roi-resolution-identity-budget | 13 | retain canonical ownership |
| ai/sam3-promptable-concept-segmentation | 15 | retain canonical ownership |
| ai/sandbox-deployment-controls | 5 | retain canonical ownership |
| ai/sandbox-gpu-isolation | 5 | retain canonical ownership |
| ai/sandbox-runtime-isolation | 5 | retain canonical ownership |
| ai/score-based-generative-models | 3 | retain canonical ownership |
| ai/search-based-reasoning-and-test-time-compute | 2 | retain canonical ownership |
| ai/search-space-design | 3 | retain canonical ownership |
| ai/self-distillation | 3 | retain canonical ownership |
| ai/sentence-embeddings | 3 | retain canonical ownership |
| ai/seq2seq | 13 | retain canonical ownership |
| ai/sequence-distillation | 3 | retain canonical ownership |
| ai/sequence-modeling-tabular | 9 | retain canonical ownership |
| ai/serving-benchmark-methodology | 2 | retain canonical ownership |
| ai/serving-latency-metrics-and-slo | 3 | retain canonical ownership |
| ai/serving-memory-admission-and-preemption | 2 | retain canonical ownership |
| ai/simclr-infonce | 3 | retain canonical ownership |
| ai/sionic-eureka | 12 | retain canonical ownership |
| ai/sionic-glm-b300 | 13 | retain canonical ownership |
| ai/skills-anatomy | 11 | retain canonical ownership |
| ai/smoothie-qwen-weight-editing | 3 | retain canonical ownership |
| ai/softmax | 5 | retain canonical ownership |
| ai/sparse-autoencoder | 14 | retain canonical ownership |
| ai/sparse-windowed-attention-patterns | 2 | retain canonical ownership |
| ai/speculative-decoding-variants | 2 | retain canonical ownership |
| ai/spiking-neural-networks | 5 | retain canonical ownership |
| ai/structured-generation-serving | 3 | retain canonical ownership |
| ai/structured-pruning | 6 | retain canonical ownership |
| ai/subword-static-embeddings | 3 | retain canonical ownership |
| ai/supervised-contrastive-learning | 3 | retain canonical ownership |
| ai/supervised-fine-tuning | 12 | retain canonical ownership |
| ai/supervised-learning-loop | 3 | retain canonical ownership |
| ai/synthetic-data-and-data-flywheel | 2 | retain canonical ownership |
| ai/tabular-data-synthesis | 3 | retain canonical ownership |
| ai/tabular-deep-learning | 8 | retain canonical ownership |
| ai/tensor-and-pipeline-parallel-inference | 2 | retain canonical ownership |
| ai/text-unicode-encoding | 10 | retain canonical ownership |
| ai/time-features | 10 | retain canonical ownership |
| ai/tokenizer | 13 | retain canonical ownership |
| ai/tool-calling-lifecycle-and-costs | 2 | retain canonical ownership |
| ai/train-validation-test | 3 | retain canonical ownership |
| ai/training-memory-budget | 2 | retain canonical ownership |
| ai/training-pipeline | 11 | retain canonical ownership |
| ai/transfer-learning-practice | 11 | retain canonical ownership |
| ai/transformer-architecture | 20 | retain canonical ownership |
| ai/triplet-metric-learning | 3 | retain canonical ownership |
| ai/unstructured-pruning | 3 | retain canonical ownership |
| ai/vae | 9 | retain canonical ownership |
| ai/validation-feedback-audit | 3 | retain canonical ownership |
| ai/vector-search-and-ann-indexes | 2 | retain canonical ownership |
| ai/video-clip-sampling | 3 | retain canonical ownership |
| ai/video-convolution-architectures | 3 | retain canonical ownership |
| ai/video-transformers | 3 | retain canonical ownership |
| ai/video-understanding | 3 | retain canonical ownership |
| ai/vision-backbone-selection | 13 | retain canonical ownership |
| ai/vision-language-model-architecture | 2 | retain canonical ownership |
| ai/vision-language-navigation | 2 | retain canonical ownership |
| ai/vision-task-spatial-contracts | 3 | retain canonical ownership |
| ai/vision-transformer | 13 | retain canonical ownership |
| ai/visual-representation-tokenizers | 2 | retain canonical ownership |
| ai/vla-embodiment-gap | 4 | retain canonical ownership |
| ai/vllm-paged-attention | 14 | retain canonical ownership |
| ai/vllm-scheduler | 15 | retain canonical ownership |
| ai/vllm-serving | 12 | retain canonical ownership |
| ai/vllm-spec-decode | 13 | retain canonical ownership |
| ai/walk-forward-validation | 3 | retain canonical ownership |
| ai/warmup-scheduling | 3 | retain canonical ownership |
| ai/weight-decay | 3 | retain canonical ownership |
| ai/weight-only-quantization | 3 | retain canonical ownership |
| ai/word2vec | 5 | retain canonical ownership |
| ai/word2vec-negative-sampling | 3 | retain canonical ownership |
| ai/word2vec-prediction-objectives | 3 | retain canonical ownership |
| ai/xgboost-tree-objective | 5 | retain canonical ownership |
| ai/xml-prompting | 16 | retain canonical ownership |
| ai/yarn-rope-extension | 8 | retain canonical ownership |

## 최종 통합 결과

- AI 심화 5편과 MemoryArena 연결을 포함한 6편의 `audit-learning-contract --strict --require-registration`이 통과했습니다. 등록 module의 LEARNING·CONCEPTS는 최종 JSON과 같습니다.
- `/tmp/ai-browser-final-summary.json`: 8개 경로×390/1440, 16개 화면의 overflow·수식·콘솔 검사 실패 0입니다.
- `/tmp/ai-code-interactions-all.json`: 공식 코드 6개×두 화면에서 실제 열기·닫기 12회가 통과했습니다. 월드모델의 관측 변경과 초기화도 통과했고 frame 높이 변화는 두 화면 모두 0입니다.
- 390px 코드 패널의 실제 코드 영역 높이는 파일에 따라 약 382~436px였습니다. 모바일 코드 표를 문서 밖으로 넘기는 대신 내부에서 가로로 읽을 수 있음을 확인했습니다.
- Memory 연결 글의 기존 SVG에 모바일 viewBox 밖 요소가 남는 문제를 발견해 그 글 전용 `MemoryTraceViz.tsx`로 고쳤습니다. 현재 기록→검사→다음 저장·동작을 보여 주며 4단계×2화면에서 frame·control 변동과 overflow가 모두 0입니다. 공용 기존 SVG는 바꾸지 않았습니다.
- Infra/institutions 11편, GPU 심화 4편과 B300 5편의 strict learning도 최종 통합 상태에서 다시 통과했습니다.
- 전체 tsc의 당시 남은 오류는 별도 crypto 근거 16개의 허용되지 않은 kind='원 논문'이었습니다. 원 등록 자료의 enum 교정을 root에게 전달했습니다. AI 범위의 TypeScript 오류는 없었습니다.
- 신규 world 글과 GPU 두 글을 기존 카테고리 입구에 연결하는 제안은 `/tmp/gpu-ai-reading-path-proposal.json`에 있습니다. 공용 경로 파일은 root가 통합합니다.

## 기준선 대비 확인된 산출물

기준선은 기존 AI 374편의 실제 공개 catalog와 graph 소유 위치입니다. 기존 4편을 심화하고 행동 조건부 rollout·재계획의 정본 1편을 추가했습니다. 연결 3편도 보완했습니다. 학습 문제 50개, 본문 논문·구현 해설 14개와 MemoryArena 해설 1개, 전체 공식 소스 6개가 실제 글에 들어 있습니다. 새 개념은 6개이고 기존 26개 정의의 잘못된 일반화도 고쳤습니다.

위 16개 화면은 심화 5편과 `attention-kernel-anatomy-and-backends`, `agent-memory-lifecycle`, `modern-image-model-stack`입니다. 이전 실패 기록은 삭제하지 않고 최종 통과 기록으로 대체 여부를 명시했습니다. 374편 전체의 모든 주장을 재현 실험했다는 뜻이 아니며 GPU 학습·장치 성능·로봇 실행은 이 환경의 검증 범위 밖입니다.


## 2026-10-04 최종 DoD 보강

- 화면 h2와 catalog TOC를 1–10절로 통일했다. teach-system의 S/B/0…7은 `data-teach-level`에 보존했다. 각 예측 질문을 실제 설명과 대조해 답 절을 고쳤고, 본문의 절 참조도 맞췄다. 예측 horizon이나 scan의 연산 단계 수는 절 번호와 구별해 유지했다.
- GPU4+AI5의 strict learning은 9편 모두 통과했다. `/tmp/gpu-ai-learning-dod.log`
- 9편의 390/1440 화면 18개가 오류 없이 통과했다. `output/playwright/sweep/2026-10-03T20-18-22/summary.json`은 별도 발견한 기존 autoencoder 두 글의 첫 실패 기록도 함께 보존한다. 실패한 두 글은 수정 후 `2026-10-03T20-20-03/summary.json`의 네 화면에서 모두 통과했다.
- 공개 감사 범위의 도구 수정은 `/tmp/audit-scope-fix.md`에 원인·변경·반례 테스트를 기록했다. 신규 4개 및 기존 경로 4개 테스트 총 8개 통과. 본문 closure 영향은 이번 9편에 한정되고 기존 나머지 790편은 바뀌지 않았다.
- 현재 9개 본문 SHA-256 기록: `/tmp/gpu-ai-dod-source-hashes.json`. 본문 내용의 임의 baseline 갱신은 하지 않았으며 최종 topology 판단은 root가 검토한다.
- AI5 mechanism 절마다 같은 수치 사례의 AlgorithmBlock을 추가했다. 각각 softmax 누적, 독립 erase/write 상태 갱신, MoE dispatch/결합, verifier 교차 집계와 group 평균 제거, world model 후보 rollout과 재관측을 입력→연산→출력 순서로 읽는다. 공식 소스 CodeSidebar와 개념 의사코드를 표시로 구별했다.
- 다섯 의사코드를 390/1440에서 각각 확인해 입력·출력 표시와 본문/자식 overflow 0을 확인했다. `/tmp/ai-algorithm-browser.json` (10회). world 및 delta 화면을 직접 확인했다.
- 기존 CPU 수치 재현 스크립트 `/tmp/ai-numeric-audit.py`를 다시 실행해 softmax·GDN2·MoE·검증기·world toy 결과가 모두 같은지 확인했다. 새 GPU 벤치마크나 실제 모델 학습을 실행한 검수는 아니다.
- `npx tsc --noEmit -p tsconfig.app.json --pretty false` 종료 코드 0. `/tmp/gpu-ai-dod-tsc-app.log`. 전체 production build는 root의 통합 검수에서 실행한다.

- 기존 autoencoder 공통 Viz 수정은 일반 sweep 외에도 3경로×4장면×2화면, 실제24개 장면의 console·canvas overflow0을 직접 확인했다. `/tmp/autoencoder-specific.json`, `/tmp/autoencoder-viz-fix.md`.
