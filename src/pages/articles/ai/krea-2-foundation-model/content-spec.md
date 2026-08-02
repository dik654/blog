# Krea 2: Foundation Model, Training, RAW/Turbo content spec

## Goal
- 독자가 Krea 2를 “미감이 좋은 새 모델”이 아니라 넓은 style distribution을 만들고, post-training으로 그 안을 탐색 가능하게 만든 foundation model system으로 재구성하게 한다.
- RAW와 Turbo를 품질 등급이 아니라 서로 다른 학습·실행 artifact로 판정하게 한다.

## Scope boundary
- 현재 공개된 data principle, single-stream transformer, Qwen3-VL feature aggregation, resolution curriculum, post-training, RAW/Turbo와 license를 다룬다.
- Krea 서비스 전체의 realtime canvas, style reference와 prompt expander를 core public weight에 내장된 기능처럼 쓰지 않는다.
- Krea가 공개한 training infrastructure 전체는 결과를 만든 scale evidence로만 짚고 HPC 구현은 `gpu-hpc-from-scratch`로 넘긴다.
- 보고서의 15–20% 8-bit speedup은 해당 training setup의 관찰로 한정한다.
- Pretraining의 no-AI-image 선택은 image source의 경계이고, synthetic caption과 RL rollout은 각각 supervision text·post-training sample의 경계다.

## Hard internal questions
작성된 본문만 읽고 다음 문제의 풀이 전략에 도달해야 한다.

1. Style LoRA를 학습하고 2K preview를 빠르게 제공하려면 RAW와 Turbo 중 어느 artifact를 어느 단계에 써야 하며 왜 그런가?
2. Turbo에 RAW 권장값인 52 step과 CFG 3.5를 복사하는 것이 잘못인 이유를 distillation과 inference distribution으로 설명할 수 있는가?
3. Diffusion inference가 prefill-only이고 KV cache를 쓰지 않는다면 GQA 채택 이유를 LLM decoding과 똑같이 설명하면 왜 틀리는가?
4. Krea 2가 architecture ablation에서 hybrid stream이 조금 좋았는데도 final single stream을 고른 이유를 simplicity·kernel ecosystem·quality 차이로 설명할 수 있는가?
5. 256→512→1024 curriculum이 “해상도만 키우는 것”이 아니라 capability와 FLOP 배분인 이유를 설명할 수 있는가?
6. AI-generated image를 pretraining mix에서 제거한 선택과 RL에서 synthetic rollout을 쓰는 선택이 모순이 아닌 이유를 stage별 signal로 나눌 수 있는가?
7. Prompt-specific rubric reward와 artifact reward를 함께 두지 않으면 어떤 reward hacking이 생기는가?
8. Repository가 Apache-2.0로 보이더라도 model weights의 commercial 조건을 따로 확인해야 하는 이유를 설명할 수 있는가?

## Primary source ledger
| Source | Why chosen | Claim boundary |
|---|---|---|
| Krea 2 technical report | data, architecture ablation, training, post-training, distributed infra | 회사 자체 평가를 보편 순위로 확대하지 않음 |
| Official Krea 2 repository | RAW/Turbo artifact, exact recommended inference settings, fine-tuning handoff | README default flag와 variant-specific recommendation을 혼동하지 않음 |
| Official prompting guide | natural-language prompt, quoted visible text, Turbo 2K | prompt expander를 core weight의 내장 module로 쓰지 않음 |
| Official Krea 2 licensing page | model community license and commercial boundary | repository code의 Apache license를 weight license로 확대하지 않음 |

## Full-scope map
| Topic | Depth | Evidence | Failure if omitted |
|---|---|---|---|
| Creative exploration goal | deep | narrow-default vs broad distribution | “best aesthetic” 순위로 축약 |
| Data curation/captioning | deep | no synthetic pretrain, OCR-enriched captions | architecture만으로 style breadth 설명 |
| Architecture | deep | GQA prefill compute, gated attention, hybrid-vs-single final-component ablations | KV cache 이유를 복사하거나 LLM 부품 이름만 나열 |
| Text feature aggregation | medium | multi-layer + bidirectional layers | Qwen3-VL 마지막 state만 쓴다고 오해 |
| Curriculum | deep | 256→512→1024, precision shift | resolution을 단순 output size로 오해 |
| Post-training | deep | SFT→preference→rubric reward+artifact reward RL | aesthetics 하나로 품질 최적화하거나 reward-hacking 여지와 style coverage를 함께 축소 |
| RAW/Turbo | deep | exact steps/CFG/mu/resolution | variant 계약을 섞어 실패 |
| License | medium | code vs weight | 상업 배포 조건 누락 |
| Full cluster implementation | defer | GPU/HPC link | model article가 인프라 글을 복제 |
| Generic DiT/flow math | defer | generation foundation link | 최소 기반 아래로 무한 확장 |

## Narrative
1. “한 장의 polished default”와 “넓은 창작 탐색”의 차이에서 시작한다.
2. 넓은 분포를 만드는 data curation과 caption signal을 본다.
3. LLM에서 가져온 부품이 diffusion에서 어떤 이유로 채택됐는지 ablation 질문으로 읽는다.
4. Resolution curriculum과 precision을 capability·FLOP 배분으로 연결한다.
5. SFT, preference optimization과 RL reward가 rare style coverage는 보존하면서 사용자 요구를 찾기 쉽게 만들고 reward-hacking 여지만 좁히는지 본다.
6. RAW에서 학습하고 Turbo에서 실행하는 artifact handoff를 정확한 setting으로 닫는다.
7. Diversity, prompt constraints, artifact, LoRA transfer, runtime과 license gate로 채택한다.

## Formula contract
### CFG
- `s=0`이면 unconditional branch를 만들지 않고 `v=v_c`
- `s>0`이면 공개 sampler 구현 그대로 `v=v_c+s(v_c-v_u)`
- 빼는 이유: condition이 추가한 방향만 분리한다.
- `s`를 곱하는 이유: prompt adherence를 얼마나 증폭할지 정한다.
- `s`는 scale이면서 unconditional encoding·model pass를 실행할지 고르는 분기다.
- RAW는 두 model pass의 CFG를 쓰지만 Turbo 공식 경로는 CFG 0으로 unconditional 계산을 생략한다.

### Resolution curriculum
- `D_256 -> D_512 -> D_1024`, `C_total=C_256+C_512+C_1024`
- 더하는 이유: 전체 training budget이 서로 다른 resolution stage에 나뉘기 때문이다.
- 낮은 resolution에 FLOP를 더 주는 이유: 기본 alignment와 structure를 싼 token budget에서 먼저 학습한다.

모든 display 수식 바로 아래에 한국어 `FormulaNote`를 1:1로 둔다.

## Prose-to-viz handoff
### Krea2LifecycleViz
- Scene 0: broad real-image data와 OCR/metadata caption이 style coverage를 만든다.
- Scene 1: Qwen3-VL multi-layer features → single stream GQA/gated attention/SwiGLU → VAE latent를 보여 준다.
- Scene 2: 256→512→1024 curriculum과 8-bit→bf16 precision 경계를 보여 준다.
- Scene 3: SFT → preference → rubric/artifact reward RL로 distribution을 좁힌다.
- Scene 4: RAW 52 step·CFG 3.5에서 LoRA를 학습하고 Turbo 8 step·CFG 0·mu 1.15에서 실행하는 handoff를 보여 준다.
- 두 artifact를 좌우 품질 등급으로 두지 않고 train lane과 serve lane으로 배치한다.
- Step 장면은 안정된 높이의 원리 trace로 닫고, 바로 아래 독립 Contract lab에서 RAW/Turbo, LoRA·Train/Inference, steps·CFG·mu·resolution을 바꿔 잘못된 조합의 구체적 위반을 계산한다.
- 데스크톱에서는 다섯 stage의 하위 계약을 동시에 보이고, 현재 milestone의 근거·관측·실패 신호를 11px 이상으로 강조한다.

## Evaluation contract
- 390×844, 768×1024, 1440×900에서 document/Viz horizontal overflow가 1px 이하다.
- StepViz 다섯 장면을 전환할 수 있다.
- 장면 전환에 따라 조작 실험실이나 재생 control의 위치가 크게 이동하지 않는다.
- display formula 2개와 FormulaNote 2개가 1:1이다.
- RAW 52/3.5/up-to-1K와 Turbo 8/0/1.15/1K–2K 조건이 본문과 Viz에 일치한다.
- “TRAIN on RAW, RUN on Turbo”가 artifact handoff로 설명된다.
- code license와 weight license가 분리된다.
- learning path는 common runtime → Krea case → adaptation/workflow로 이어진다.

## Intent log for smaller-model reproduction
- 모델의 모든 연구 항목을 나열하지 않고 `distribution breadth → model block → training curriculum → post-training → artifact handoff`를 중심 invariant로 골랐다.
- GQA, SwiGLU, RMSNorm 같은 이름은 정의 목록이 아니라 Krea가 stability·efficiency·simplicity 기준으로 채택한 이유에 연결했다.
- 공개 config로 총 parameter 수를 역산할 수 있어도 official report와 repository가 명시하지 않은 값은 모델 규모 사실로 쓰지 않는다.
- 보고서의 training infra는 전체 글을 잠식하지 않도록 source evidence와 HPC 링크로 경계를 세웠다.
- 독자가 가장 많이 틀릴 RAW/Turbo 설정 혼합을 마지막 Viz와 검증 문제의 중심으로 두었다.
