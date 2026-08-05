# AI 주제별 학습 흐름 재구성 계획

## 1. 이 계획이 해결하는 문제

`AI 시스템 공통 관점`은 AI 전체 계보가 아니라, 서로 다른 시스템을 `입력 → 상태 → 계산 → 경계 → 검증`으로 분해하는 방법 글이다. 다음의 실제 문제는 각 목표 분야 안에서 풀어야 한다.

- 글은 많지만 어느 글부터 읽어야 하는지 명시되지 않은 주제가 있다.
- 글 하나가 너무 많은 독립 질문을 품고 있는 경우와, 여러 글이 같은 설명을 반복하는 경우가 공존한다.
- 현재 연구를 설명하는 글과 오래된 원리 글이 같은 레벨로 보이면 필수 순서로 오해된다.
- 논문·회사 리서치는 근거이지 모두 필수 선행 학습이 아니다.
- 본문 품질 감사가 진입 component 파일만 보면 여러 section 파일로 나뉜 깊은 글을 오류로 판정한다.

## 2. 항상 적용할 작성 계약

모든 목표 경로는 다음 다섯 층으로 제한한다.

1. **지금의 목표**: 최근 논문·회사 리서치·실제 제품이 무엇을 바꾸었는지 시작점으로 삼는다.
2. **핵심 글**: 기술 이름이 아니라 독립적인 판단 문제를 하나씩 풀도록 배치한다.
3. **필요할 때만 내려가는 기반**: 현재 글의 수식·실패 경계를 설명하는 최소 수학·과학·공학에서 끊는다.
4. **최소 논문과 선택 근거**: 현재 mechanism의 변하지 않는 계약을 만든 canonical paper 하나는 뼈대로 보이고, 추가 논문·회사 글·모델 카드는 claim과 evidence를 확인할 때만 연다.
5. **구현·검증**: 코드, runtime trace, metric, failure injection 중 하나 이상으로 본문의 이해를 닫는다.

각 본문은 `쉬운 상황 → 정확한 용어 → 데이터/토큰 실행 순서 → 수식과 한글 항 설명 → 실패 경계 → 근거 → 능력 검증`을 따른다. 본문을 쓰기 전에는 비공개 전이 문제를 만들고, 작성된 글만으로 해답의 판단 근거에 도달할 수 있는지 검사한다.

## 3. 글을 유지하거나 합치는 기준

### 독립 아티클로 유지

- 읽고 나면 다른 글과 구분되는 판단·구현 능력이 생긴다.
- 두 개 이상의 목표 경로에서 재사용되는 핵심 개념이다.
- 독립적인 실행 trace, 수식, 실패 모드, 실험을 가진다.
- 자주 바뀌는 모델·런타임·규격의 경계를 안정적인 원리 글과 분리해야 한다.

### 큰 흐름에 흡수하거나 선택 참고로 내림

- 용어 정의나 제품 목록만 있고 독립 문제가 없다.
- 다른 글의 도입부·표·fact sheet를 반복한다.
- 다음 글을 반드시 같이 읽어야만 의미가 생긴다.
- 동일한 mechanism을 회사·모델 이름만 바꾸어 설명한다.

역사 하향의 상한을 추가로 둔다. **한 하위 주제당 필수 canonical paper는 원칙적으로 하나다.** 핵심 글이 다른 결정적 근거를 직접 사용할 때만 선택 source spine을 추가한다. Robot AI의 기존 원문 경로는 삭제하지 않지만, 다른 목표 경로 공백이 닫힐 때까지 신규 확장을 동결한다.

흡수할 때는 기존 slug를 바로 삭제하지 않는다. 요약 진입점이나 redirect를 유지하고, 어느 핵심 글에 흡수됐는지 나타낸 뒤 링크·검색 사용량을 확인해 제거한다.

## 4. 현재 인벤토리에서 발견한 공백

2026-07-21 최초 audit 기준으로 AI 글은 258개였고 저자 설계 경로가 없는 주제가 다수였다. 아래 표는 재구성 시작 시점의 기준선이며, 최신 할당 수와 backlog는 `knowledge/authoring/runs/2026-07-21-learning-flow-audit.json`에서 계속 갱신한다.

| 주제 | 현재 글 | 명시 경로 | 일차 판단 |
|---|---:|---:|---|
| 지식 시스템 | 2 | 0 | 글은 깊지만 ingestion·IR·retrieval·provenance의 학습 순서가 없다. |
| LLM 서빙 | 10 | 0 | 총 47만 byte 이상의 본문이 있으나 평면 목록으로 보인다. |
| 음성·오디오 | 1 | 0 | 종합 글은 유지하되 representation·ASR·duplex runtime을 독립 문제로 확장한다. |
| 월드 모델 | 1 | 0 | 종합 글은 유지하고 representation, action dynamics, planning evidence를 분리한다. |
| 시계열 | 3 | 0 | 고전 3글은 충분히 깊지만 현재 forecasting foundation model과 평가 글이 없다. |
| 에이전트 | 12 | 1 metadata | 프롬프트·프로토콜·하네스·제품 사례가 같은 수준에 섞여 있다. |
| DL 구현 (Rust) | 3 | 0 | autodiff → layer → sequence 순서만 명시하면 된다. |
| 실전 ML | 33 | 1 | 8개 하위 주제별 핵심 순서가 필요하다. |
| 오픈 이미지·비디오 | 26 | 5 | 현재 지도는 있지만 모델 가족 글을 필수와 선택 실험으로 다시 나눈다. |

수식 audit는 진입 파일의 relative import를 따라가도록 수정했다. 이전의 `formula gap 0`은 진입 파일 밖 section의 수식을 보지 못한 결과였다. 새 audit는 AI를 포함한 전체 corpus에서 한글 `FormulaNote`가 바로 따르지 않는 수식 묶음을 실제 backlog로 다시 드러낸다.

## 5. 주제별 재구성

### 00. 읽는 방법

- **유지**: `AI 시스템 읽는 법: 입력·메모리·계산·전달·피드백` 하나만 둔다.
- **경계**: 이 글은 목표 메뉴, 전체 계보, 필수 순서가 아니다.
- **완료 조건**: 읽은 뒤 목표 분야로 이동하고, 공통 다섯 질문을 적용할 수 있다.

### 01-A. 언어·지식

#### LLM 아키텍처·Post-training·해석

- 기존 current-first 경로를 유지한다. Dense, KV/context, MoE, hybrid는 독립 구조 변화로서 각각 유지한다.
- `LLM Architecture Gallery`는 모델 표가 아니라 다섯 구조 변화를 선택하는 진입 글로만 쓴다.
- 최신 모델은 기존 실행 계약을 바꾸지 않으면 새 필수 글로 추가하지 않는다.
- Qwen 한국어 일관성 글은 `ai-agents` 핵심 경로에서 제거하고 multilingual output control의 SFT·RL·runtime 사례로 재배치한다.

#### LLM 서빙

현재 SLO에서 시작해 기존 글을 두 경로로 묶는다.

1. **엔진 내부**: Disaggregated Serving 판단 → vLLM 전체 → PagedAttention → Scheduler → Speculative Decoding → VLM Serving.
2. **운영 제어면**: Serving Ops → Deployment → Kubernetes GPU Fleet → Gateway → Observability.

두 경로를 억지로 하나로 잇지 않는다. 전자는 token·KV·batch 실행, 후자는 replica·rollout·SLO·실패 복구를 다룬다.

- **런타임 네 글 재구성·완료**: PagedAttention은 `model shape → KV bytes/token → logical/physical block ledger`, Scheduler는 `ready state → token·KV budget → one-step plan`, Speculative Decoding은 `draft/target probability → acceptance·recovery → committed prefix`, VLM Serving은 `media trust boundary → processor·encoder cache → decoder admission`만 각각 소유한다.
- **공통 전이 문제**: 32-layer GQA, 8 KV head, head width 128, BF16, 16-token block, 12 GiB pool을 사용해 128 KiB/token, 2 MiB/block, 6,144 block, 1 GiB/8K prompt를 계산한다. 1,024-token scheduler step, K=4·acceptance 0.75와 576×4096 BF16 media embedding도 같은 request fixture에서 이어진다.
- **정확성 교정**: Speculative acceptance를 `min(1, p_target/q_draft)`로 바로잡고 보편적인 `2~3x` 문구를 제거했다. Prefix hash와 chunked prefill을 분리하고, `phase가 없다`는 표현을 scheduler accounting에만 한정했다.
- **역사 절단**: PagedAttention과 Orca를 최소 engine 바닥으로 두며 더 오래된 virtual memory·queueing·rejection sampling 계보는 실제 failure가 요구할 때만 연다.
- **제어 평면 다섯 글 재구성·완료**: Serving Ops는 target SLO와 ownership map, Deployment는 immutable revision·probe·warmup·canary·rollback, GPU Fleet는 desired·allocatable·ready capacity와 device lease, Gateway는 auth·capability·quota·health·cost에 따른 route evidence, Observability는 cross-layer evidence와 bounded recovery만 각각 소유한다.
- **공통 장애 전이 문제**: desired 8, compatible allocatable GPU 6, Ready 5, warmup 1, Pending 2, 800 req/min, startup 240초, TTFT만 악화되는 canary를 사용한다. 독자는 3,200 cold-start arrival, 현재 ready capacity 5, 평균 fallback 비용 0.0026달러와 30% 증가를 계산하고 decode kernel보다 admission·queue·readiness를 먼저 조사해야 한다.
- **현재 기능 경계**: Kubernetes DRA는 1.35 stable이지만 보편 배포로 쓰지 않고 device-plugin path와 병기한다. MIG isolation과 time-slicing multiplexing을 구분하고, LiteLLM alias를 semantic compatibility로 확대하지 않으며, OpenTelemetry GenAI attribute와 vLLM metric 이름은 version-sensitive evidence로 표시한다.

#### 지식 시스템

- **진입 재구성·완료**: Knowledge Compiler는 Source·Structure·Meaning·Retrieval·Maintenance의 다섯 계약을 고르는 18분 hub로 줄였다.
- **독립 판단 단위·완료**: Source Ingestion은 원문 identity·parser routing·structure recovery·source coordinate를, Knowledge IR은 Claim·Scope·Evidence·Transformation과 revision impact를, RAG Pipeline은 dependency-aware routing·hybrid retrieval·evidence coverage packing·runtime trace를 각각 소유한다.
- **중복 방지 판단**: Figure anchor는 ingestion, claim-evidence relation은 IR, 실제 query의 candidate·prompt snapshot은 RAG, longitudinal source promotion은 Watcher에만 둔다.
- **신규·완료**: `Research watcher → Work/Version/Event identity → five-contract delta → current replacement/foundation gate → targeted invalidation`을 독립 운영 글로 작성했다.
- **실제 운영 보강**: daily discovery queue에서 재수집 창 밖 후보를 삭제하지 않고 `not-refreshed`로 보존하며, source 실패·재등장·편집 상태를 순수 함수 fixture로 검증한다.
- **경로**: `Knowledge Compiler → Source Ingestion → Knowledge IR → RAG Pipeline → Research Watcher`로 읽는다. 운영에서는 Watcher가 먼저 source event를 발견할 수 있지만 학습은 한 source의 구조·근거를 먼저 완성한다.
- **역사 절단**: 필수 하향은 RAG 2020에서 멈추고, 그보다 오래된 정보 검색 계보는 현재 failure를 설명할 때만 연다.

#### 음성·오디오

- **진입 유지**: 현재 종합 글은 waveform에서 realtime conversation까지의 지도로 남긴다.
- **신규 핵심**: `Sampling·STFT·Mel·codec token`, `CTC·Transducer·Seq2Seq ASR`, `TTS·codec LM·native speech-to-speech`, `streaming·barge-in·jitter·latency evaluation`.
- **쉬운 설명 축**: 녹음 파일을 잘라 전달하는 상황에서 시작해 sample과 frame, 음향 token, 회화 turn state machine으로 올라간다.

### 01-B. 인식·생성

#### 생성 모델

- Generative overview, VAE, GAN, Diffusion은 서로 다른 학습 신호와 sampling 경로를 가지므로 유지한다.
- **신규·완료**: `DiT·MMDiT → Flow Matching·Rectified Flow → solver·NFE → few-step distillation → fidelity·coverage·composition·human·runtime gate`를 하나의 현재 판단 글로 작성했다.
- **기존 글 재구성**: `Diffusion Models`의 현대 계보 표는 새 글과 설명이 겹치므로 다섯 설계 계약으로 넘어가는 짧은 handoff로 흡수했다. 기존 slug와 독립 DDPM·U-Net·CFG 기반은 유지한다.
- **경로**: `현재 DiT·Flow·평가 → Diffusion 기초 → ODE·수치 적분 → ViT → VAE`로 내려간다. GAN은 다른 학습 게임, 생성 이론은 네 분포 경로를 비교하는 별도 진입이므로 강제 선행에 넣지 않는다.
- **비교 계약**: VAE, backbone, path·target, solver·NFE, candidate·reranker를 동시에 바꾼 결과는 단일 구조의 효과가 아니라 end-to-end system 비교로 표기한다.
- **역사 절단**: 필수 source spine은 DiT와 Flow Matching의 직접 근거에서 멈추며, 더 오래된 diffusion·ODE 계보는 기존 기반 글에서 필요할 때만 연다.
- 현재 오픈 모델 글은 이 원리 글을 확인하는 runtime 사례로 올라온다.

#### 오픈 이미지·비디오

- **재구성 완료**: 필수 경로를 `제작 목표 → Image 또는 Video runtime → Workflow manifest에서 재합류 → Parameter budget → Adaptation·release`의 여섯 글로 제한했다.
- Image와 Video는 선후 관계가 아니라 형제 branch다. Video는 Image의 condition·latent·denoiser·solver·decode 계약을 상속하고 temporal latent, motion, audio, memory를 추가한다.
- Ideogram 4.0, Krea 2, FLUX.2, Qwen-Image 2.0 발표, Wan2.2와 LTX-2.3은 model fact sheet가 아니라 현재 control surface와 license·runtime 경계를 설명하는 원문 근거로만 올렸다.
- Qwen-Image 2.0의 발표 상태와 공개 weight를 분리하고, Wan Apache 2.0과 LTX-2 Community License의 상업 조건을 별도 계약으로 기록했다.
- 비공개 studio 문제를 한국어 exact text, 제품 identity, 5초 temporal, 24GB fallback, commercial path와 second-machine replay의 여섯 acceptance gate로 닫았다.
- 기존 Stable Diffusion·Z-Image·Illustrious·LTX·Wan 글은 필수 선행이 아니라 특정 checkpoint와 workflow를 검증하는 선택 사례로 유지한다. 2D Animation은 별도 제작 계약 경로로 분리했다.

#### 2D Animation 제작

- **재구성 완료**: 특정 LTX project가 아니라 model-independent shot contract에서 시작한다.
- **경로**: `Production Contract → Dataset Unit → Condition Signal → Adaptation·Control → Temporal Finishing → Evaluation·Release`의 여섯 독립 판단 글로 읽는다.
- **실행 경계**: 학습 순서는 공통 어휘를 만드는 순서다. 실제 제작은 base failure의 가장 이른 소유자에 따라 단계를 건너뛰거나 되돌아간다.
- **핵심 분리**: LoRA와 IC-LoRA, delivery FPS와 authored drawing cadence, VFI와 motion blur, soft ranking score와 hard release gate를 서로 다른 계약으로 유지한다.
- **근거 절단**: LoRA, AnimeInterp, RIFE까지만 최소 mechanism spine으로 두고 AniMatrix·AnimationBench와 LTX 문서는 최신 condition·evaluation·runtime evidence로 제한한다.

#### 컴퓨터 비전

- CNN, ResNet, CLIP, Deformable DETR는 각각 locality, deep residual feature, cross-modal embedding, sparse detection이라는 독립 질문이 있어 유지한다.
- `Vision Transformer`를 실전 ML 안에서만 숨기지 않고 vision 핵심 경로에 공유한다.
- **신규·완료**: `SAM 3.1 → prompt contract → concept detector → streaming memory와 identity → Object Multiplex → 품질·runtime release gate`를 한 현재 글로 녹였다.
- **분리 유지**: Object query·matching은 Deformable DETR, vision-language alignment는 CLIP, patch backbone은 ViT로 내려가며 같은 설명을 통합 글에서 재작성하지 않는다.
- **역사 절단**: Promptable segmentation 논문 계보는 SAM 1에서 멈춘다. SAM 1·2·3·3.1은 연도 목록이 아니라 직전 단계가 못 푼 실패의 인계로 읽는다.
- **경로**: `SAM 3.1 전체 흐름 → Deformable DETR → CLIP → ViT`. 기존 `Deformable DETR → ViT → ResNet → CNN` 검출 기반 경로는 별도 목표로 유지한다.

#### OCR·Document AI

- `Document AI 지도 → 현재 VLM → 표 구조 복원 → runtime 평가`를 필수 경로로 유지한다.
- 모델별 글은 필수 순서가 아니라 layout·formula·table·reading-order 오류를 검증하는 선택 근거로 둔다.

### 01-C. 행동·예측

#### 에이전트

필수 흐름을 여섯 독립 문제로 재배치한다.

1. Agentic Patterns: model·tool·observation이 어떻게 loop를 만드는가?
2. Context Engineering: 현재 turn에 어떤 상태와 근거를 넣는가?
3. MCP: tool·resource·prompt의 경계 계약은 무엇인가?
4. Harness Engineering: retry·permission·compaction·recovery를 누가 책임지는가?
5. Prompt Injection Containment: 신뢰할 수 없는 입력과 privileged action을 어디서 격리하는가?
6. **신규·완료** Agent Evaluation & Trace: 성공 계약, 최종 state, 반복 신뢰성과 regression을 어떻게 보는가?

Prompt Engineering·XML은 context 설계의 세부 기반, Skills는 하네스 확장, Framework·Claude Code·OpenClaw는 구현 사례, Prompt Injection은 권한 경계의 필수 보안 확장으로 표시한다.

#### 강화학습

- 8개 핵심 글과 21개 선택 논문 경로가 이미 구분되어 있다.
- 기본 경로는 MDP → state estimation → value → policy → PPO → offline → world model → safety에서 끊는다.
- Reasoning RL은 post-training 경로의 현재 응용으로 연결하고 RL 전체의 종착점으로 오해하지 않는다.

#### 월드 모델·피지컬 AI

- **진입 재구성 완료**: 종합 글은 Cosmos 3, Genie 3, V-JEPA 2, direct VLA가 각각 무엇을 예측하고 무엇을 보장하지 않는지 구분하는 현재 지도다.
- **신규 핵심 완료**: `video·latent predictive representation`, `action-conditioned dynamics·controllability`, `rollout·planning·MPC·closed-loop evidence`를 세 독립 판단 글로 분리했다.
- **경로**: `현재 시스템 계약 → 행동에 필요한 잠재 표상 → 좌표·시간이 고정된 행동 동역학 → CEM·MPC와 재관측 release gate`로 읽는다.
- **근거 절단**: 필수 source spine은 V-JEPA 2와 V-JEPA 2-AC에서 멈춘다. 고전 model-based RL 전체나 모든 video-model 계보는 강제 선행으로 내리지 않는다.
- **비교 경계**: 그럴듯한 video를 robot task success로 확대하지 않는다. 시각적 제어 가능성, metric dynamics, planner가 이용할 수 있는 cost, 실제 폐루프 성공률을 서로 다른 증거로 요구한다.

#### Robot AI

- 현재 19개 핵심 시스템 글과 27개 원문·회사 근거는 유지한다.
- 첫 화면에는 `전체 폐루프 → 인식·상태 → 계획·궤적 → 역학·제어 → 임베디드·구동 → 검증`의 core만 보이고 원문은 각 core의 선택 근거로 접는다.
- 수학·물리는 로봇 전체 선행과제가 아니라 좌표, 상태 추정, feedback, 마찰·피로·전력을 실제로 만날 때 연다.

#### 시계열

- ARIMA, LSTM, ECOD는 유지한다. 세 글은 lag 식, learned state, distribution tail이라는 다른 문제를 풀고 있다.
- **신규·완료**: `시계열 문제 설정·leakage·rolling backtest`, `patch·token·covariate·probabilistic head`, `TimesFM 2.5·Chronos-2·Moirai 2.0을 interface로 읽는 bridge`, `forecasting release gate`를 한 독립 판단 글로 작성했다.
- **경로**: `현재 목표·검증 → 정보 시점·Feature → 통계 기준선 → Learned Memory`로 읽고, ECOD 이상 탐지는 별도 목표 경로로 유지한다.
- 현재 연구 글에서 등장한 새 tokenization·output distribution·covariate만 하단 기반에 델타로 추가한다.

### 02. 필요한 기반

- 딥러닝 핵심 8글과 수학·과학 8글은 기본 뼈대로 유지한다.
- 원 논문은 core 본문 다음의 선택 근거로 유지한다. 1958 이전으로 계속 내려가지 않는다.
- **신규 후보**: numerical precision·floating point·conditioning, discrete optimization·search, basic measurement·units·dimensional analysis. 단, 상위 목표의 수식을 해석하는 데 실제로 필요할 때만 추가한다.
- 모든 display 수식은 의미 단위로 줄을 나누고 각 기호·항의 필요성을 한글로 바로 설명한다.

### 03. 구현·운영

- **DL 구현 (Rust)**: autodiff → tensor·layer·optimizer → recurrent·normalization·embedding의 명시 경로를 추가한다.
- **실전 ML**: data, tabular, pipeline, CV, embedding, compression, LLM adaptation, strategy 각 하위 주제에 독립 학습 경로를 부여한다. 다른 주제의 기반 글을 복제하지 않고 cross-link한다.
- **Agent Ops**: devlog·ADR·lessons는 단일 운영 원칙 글로 유지하고, Claw Code의 core·security·lifecycle·infra·orchestration은 서로 다른 code ownership 경계로 유지한다.

## 6. 작업 순서

### P0-A — 기존 구조의 저비용 교정

1. `AI 전체 지도`를 `AI 시스템 공통 관점`과 `00 읽는 방법`으로 교정한다. **완료**
2. LLM 서빙·DL Rust처럼 기존 글 순서만 고정하면 되는 경로를 먼저 연결한다. **완료**
3. 잘못된 subcategory·learningPath metadata를 바로잡는다. **1차 완료**
4. TopDownResearchTrack에 `implementation`을 추가해 목표가 본문을 지나 구현·검증으로 닫히도록 한다. **완료**

### P0-B — 저자 설계가 필요한 경로 작성

1. Agent, Knowledge System, Speech, World Model, Time Series의 신규 learningPath를 작성한다. **완료**
2. 오픈 모델·실전 ML·Claw Code 하위 주제의 순서를 부여하고 필수·선택 근거를 나눈다. **완료**
3. P0-B는 메타데이터 수정이 아니라 소규모 커리큘럼 저작으로 계산한다.

### P1 — 기존 글로 설명할 수 없는 핵심 공백

1. Agent Evaluation & Trace **완료**
2. Time-series problem setup·backtest·foundation models **완료**
3. Knowledge provenance·evaluation·automatic research watcher **완료**
4. Vision foundation model·promptable segmentation·video tracking **완료**
5. Flow Matching·DiT와 생성 평가 **완료**

### P2 — 종합 글을 독립 판단 단위로 확장

1. Speech representation·ASR·native generation·duplex runtime **완료**
2. World representation·action dynamics·planning evidence **완료**
3. Knowledge ingestion·IR·retrieval packing **완료**
4. Open-model family 글의 필수·선택 실험 재분류 **완료**
5. 2D Animation production contract·dataset·condition·adaptation·temporal·release **완료**
6. ComfyUI execution contract·typed DAG·component loading·sampling·conditioning·edit·postprocess·dependency release **완료**
7. vLLM physical KV ledger·one-step scheduler plan·verified token commit·multimodal admission **완료**
8. LLM Serving ownership map·rollback-ready release·GPU capacity lease·route evidence·verified recovery **완료**
9. Agent Prompt Injection source·authority·lineage·capability·누적 data flow·approval·commit·evidence containment **완료**

### P3 — corpus-wide 표현·시각 품질

1. import closure audit에서 드러난 수식 묶음에 한글 항 설명을 추가한다.
2. Viz를 장식이 아니라 오해 하나를 제거하는 상태 변화로 재작성한다.
3. 360·390·768·1440px에서 글자 최소 크기, 수식 넘침, scene 잘림, 내부 scroll을 검사한다.
4. animation은 정적 서사와 자동 테스트가 완료된 글에만 추가하며 reduced-motion 대안을 유지한다.

## 7. 한 배치의 완료 조건

- 시작 글, 핵심 순서, 필요할 때 내려갈 기반, 선택 근거, 구현 다음 단계가 보인다.
- 모든 핵심 글은 하나의 독립 판단 문제를 풀고, 중복 설명이 없다.
- 원문 claim, source, 작성 의도, 적용 범위, 실패 경계가 보존된다.
- 비공개 전이 문제를 본문만으로 풀 수 있고, capability check가 그 판단을 검증한다.
- KaTeX는 raw `\theta`로 보이지 않고, display 수식은 한글 항 설명을 갖는다.
- 반응형 월드에서 문서·scene·수식의 가로 넘침이 0이고, 독자가 핵심 흐름을 보기 위해 카드 내부를 스크롤하지 않는다.
- production build, 집중 Playwright, 공개 URL 회귀 검사가 통과한다.

## 8. 4B·9B 모델로 재실행하는 방법

4B worker는 한 글만 받고 다음 JSON을 낸다.

```json
{
  "reader_question": "이 글 하나가 해결하는 판단",
  "keep_or_absorb": "keep | absorb | evidence",
  "entry_state": "읽기 전에 아는 것",
  "exit_capability": "읽고 나서 할 수 있는 것",
  "strict_prerequisites": [],
  "claims": [{ "claim": "", "evidence": "", "boundary": "" }],
  "equations": [{ "latex": "", "korean_terms": [] }],
  "visual_misconception": "Viz가 제거할 오해 하나"
}
```

9B reviewer는 한 하위 주제의 packet을 받고 `current → core → foundation → evidence → implementation`을 합성한다. 중복 질문, 허구 선행지식, source 승격 오류, 무한 역사 하향을 검사한다. 상위 orchestrator만 전체 순서, 공통 notation, responsive UI, 브라우저 QA, 배포를 담당한다.

모든 작업은 `observed → inferred → decided → changed → verified`를 JSON ledger에 남긴다.
