# Long Video Memory: 시간 Token, 압축과 Streaming content spec

## Goal
- 독자가 장시간 영상을 “더 긴 context” 한 줄로 보지 않고, 시간 sampling, visual token, active memory, 압축, retrieval와 시스템 증가율로 분해해 선택하도록 한다.
- 장시간 이해와 생성을 같은 순위표로 섞지 않고 각 branch의 memory 역할, 실패 조건, 원문 증거와 구현 경계를 재구성한다.

## User intent and scope boundary
- 최신 연구를 top으로 두되 모든 과거 논문으로 무한히 내려가지 않는다.
- 현재 문제를 푸는 최소 바닥은 visual token 장부, KV byte 장부, full/window/tiered memory와 streaming 정보 경계다.
- FlexMem, OmniMem, LongLive, SANA-Video, ISPA와 HorizonRelight는 “추천 모델 목록”이 아니라 서로 다른 실패를 해결하는 사례다.
- 논문 수치에는 model, hardware, benchmark와 memory budget 경계를 붙인다. 일반 성능으로 확대하지 않는다.
- Long-video 전체 생성법, video codec 전체 역사, 모든 sequence-parallel variant는 이 글에서 다루지 않는다.

## Hard internal questions
작성된 본문만 읽고 다음 문제의 풀이 전략에 도달해야 한다.

1. 30분, 2 fps, frame당 256 token인 영상의 visual token 수를 계산하고, 32-layer GQA KV의 byte를 추정할 수 있는가?
2. 최근 32 frame만 필요한 작업과 20분 전 사건을 다시 묻는 작업에 같은 memory policy를 쓰면 왜 실패하는가?
3. Overlap을 둔 sliding window가 chunk seam에는 도움을 주면서도 오래된 identity 회수를 보장하지 않는 이유를 설명할 수 있는가?
4. 질문을 미리 아는 offline retrieval과 질문을 모르는 true streaming memory를 구분할 수 있는가?
5. FlexMem과 OmniMem의 차이를 “둘 다 압축”이 아니라 memory source, modality budget과 selection signal로 설명할 수 있는가?
6. LongLive, SANA-Video와 ISPA가 각각 window/sink, fixed-size state, parametric absorption이라는 다른 위치에서 KV 증가를 다루는 이유를 설명할 수 있는가?
7. 한 long-video sample이 GPU 하나에 안 들어갈 때 data parallelism만 늘려서는 해결되지 않는 이유와 sequence-parallel work unit을 설명할 수 있는가?
8. 평균 accuracy나 VBench 하나 없이도 이해와 생성의 release gate를 설계할 수 있는가?

## Source ledger
| Source | Why chosen | Claim boundary |
|---|---|---|
| FlexMem, arXiv:2603.29252 | Visual KV를 memory source로 보는 이해 branch의 현재 기준 사례 | 단일 3090, 1k+ frame과 benchmark 결과는 논문 조건 안에서만 인용 |
| OmniMem, arXiv:2606.07577 | Audio·visual token 불균형과 modality-aware memory를 다루는 현재 사례 | 2–4%p, 추가 1–2%p는 해당 base model·benchmark·budget 결과 |
| LongLive, NVIDIA Research | Causal frame AR, attention sink, KV-recache와 interactive prompt 전환 | 20.7 FPS, 240초는 1.3B·단일 H100 공식 조건 |
| SANA-Video, NVIDIA Research | Linear-attention cumulative state로 fixed-memory global context를 만드는 사례 | RTX 5090, 해상도와 속도는 공식 설정에 한정 |
| ISPA, arXiv:2607.00712 | KV를 버리는 대신 instance-specific weight로 흡수하는 2026 사례 | 최대 50%는 1.3B–14B 논문 실험 범위 |
| HorizonRelight, NVIDIA Research | Short-clip diffusion의 chunk boundary를 target-domain state 전달로 푸는 조건부 변환 사례 | 일반 무조건부 video generation 전체로 확대하지 않음 |
| Scaling Video Training with Parallelism, NVIDIA Research | 이해와 생성에서 sequence-parallel work unit이 달라지는 시스템 근거 | 연구 blog의 비교를 구현 원리로 쓰고 수치는 연결된 원문 조건을 따른다 |
| LongVILA, arXiv:2408.10188 | Frame encoding과 token sharding을 함께 보는 multimodal SP 기준 | Needle accuracy를 일반 video reasoning 정확도로 쓰지 않는다 |
| Ring Attention, arXiv:2310.01889 | Distributed blockwise attention의 최소 기반 | 모든 video pipeline의 기본 구현이라고 주장하지 않는다 |

## Full-scope map
| Topic | Must cover | Depth | Evidence | Why omission is risky |
|---|---|---|---|---|
| Temporal tokenization | duration, sampled fps, token/frame multiplication | deep | formula + interactive ledger | 영상 길이와 token 길이를 혼동 |
| KV memory | layer, token, KV heads, head dim, bytes | deep | formula + ledger | context 지원과 실제 배포 가능성을 혼동 |
| Memory policy | full, window, recent/compressed/retrieved | deep | 4-step Viz + cases | 압축을 하나의 기법으로 오해 |
| Understanding | old-event recall, order, evidence, audio/visual | deep | FlexMem·OmniMem | 평균 QA만 보고 shortcut을 놓침 |
| Generation | AR KV, linear state, parametric absorption, chunk continuation | deep | LongLive·SANA·ISPA·HorizonRelight | 이해용 memory와 생성용 state를 혼합 |
| Distributed training | inside-sample sharding and topology | medium | NVIDIA SP research + LongVILA | DP만 늘리면 된다고 오해 |
| Release evaluation | quality, evidence, seam, slope, leakage | deep | seven gates | 짧은 demo 점수로 장시간 제품을 출시 |
| Video runtime internals | VAE, temporal module, audio branch | defer | `video-model-runtime` | 이미 별도 글이 소유 |
| Full HPC networking | NVLink, RDMA, NCCL | defer | `gpu-hpc-from-scratch` | cross-category 기반을 중복 |

## Narrative design
1. 25분 뒤 다시 꺼낸 컵이라는 질문으로 “무엇을 기억해야 하는가”를 먼저 만든다.
2. 길이를 visual token과 KV byte로 바꿔 비용을 체감한다.
3. Full, window, tiered policy를 비교해 해결책이 질문에 따라 갈리는 이유를 만든다.
4. 이해 branch에서 evidence recall과 streaming leakage를 다룬다.
5. 생성 branch에서 identity, state와 chunk seam을 다룬다.
6. 한 sample이 GPU 하나를 넘을 때 시간축을 나누는 시스템 경계로 이동한다.
7. 일곱 release gate로 내용과 구현을 닫고, 현재 실패와 맞는 원문 하나만 고르게 한다.

## Formula contract
### Visual token ledger
- Formula: `N_v = T f_s n_f`
- 반드시 설명할 연산 이유: 시간 위치마다 공간 token 집합이 생기므로 세 값을 곱한다.
- 반드시 설명할 손실: `f_s` 감소는 시간 세부 손실, `n_f` 감소는 공간 세부 손실이다.

### KV byte ledger
- Formula: `M_KV = 2 L N_a H_kv d_h b`
- 반드시 설명할 연산 이유: K와 V 두 배열, 모든 layer, 모든 active token, KV width, byte를 곱한다.
- 반드시 설명할 설계 연결: GQA는 `H_kv`, cache quantization은 `b`, memory policy는 `N_a`를 줄인다.

### Tiered active memory
- Formula: `N_a = N_recent + N_compressed + N_retrieved`
- 반드시 설명할 연산 이유: 서로 다른 역할의 memory가 같은 현재 입력에 합류한다.
- 반드시 설명할 실패: 중복 token과 압축 전에 버린 정보는 별도 검산이 필요하다.

모든 display 수식 바로 아래에 한글 `FormulaNote`를 둔다. raw LaTeX가 본문에 노출되어서는 안 된다.

## Prose-to-viz handoff
### LongVideoMemoryFlowViz
- Step 0: raw 30 fps → temporal sampling/tubelet → frame당 visual token. 시간과 공간 압축을 분리한다.
- Step 1: 겹치는 네 chunk를 보여 주고 overlap이 인접 seam만 줄인다는 경계를 표시한다.
- Step 2: recent, compressed, retrieved memory를 서로 다른 역할과 색으로 분리한다.
- Step 3: understanding의 evidence gate와 generation의 continuity gate를 나란히 보인다.

### TemporalTokenBudgetLab
- Controls: 1/10/30분, 1/2/4 fps, 64/256/576 token per frame, full/window/tiered policy.
- Output: sampled frames, total tokens, active tokens, 32-layer toy KV, dense attention pair upper bound.
- State invariant: input을 바꾸면 raw numeric `data-*`와 표시 값이 함께 갱신된다.
- Boundary copy: 교육용 장부이며 실제 model card와 profiler 값으로 교체해야 한다.

## Evaluation contract
- Mobile 390×844, tablet 768×1024, desktop 1440×900에서 document와 Viz horizontal overflow가 1px 이하다.
- Control의 최소 touch size는 44px이다.
- 모든 display formula에 `FormulaNote`가 1:1로 붙고 `.katex-error`와 raw LaTeX가 없다.
- 기본 장부는 10분 × 2 fps × 256 = 307,200 token이다.
- 30분으로 바꾸면 921,600 token이 되고 full policy의 active token과 KV가 증가한다.
- StepViz는 네 scene을 모두 keyboard/button으로 전환할 수 있다.
- Source link는 primary source로 직접 연결된다.
- Article learning path는 current multimodal contract 뒤, representation/objective branch 전에 배치된다.

## Intent log for smaller-model reproduction
- 먼저 누락된 연구 축을 registry와 track에서 찾았다. “Video runtime” 글은 짧은 clip 실행 구조를 소유하지만 long context·memory·streaming 증가율을 소유하지 않았다.
- 모델 목록을 늘리는 대신 공통 invariant인 `time → tokens → active memory → failure gate`를 뼈대로 선택했다.
- 각 논문은 이 뼈대의 한 선택지를 증명하는 사례로만 배치했다. 원문 수치는 별도 boundary 필드에 잠갔다.
- 수식은 상징 설명에서 멈추지 않고 곱셈·덧셈을 쓰는 이유와 어느 설계 knob가 어느 항을 바꾸는지 적었다.
- Viz는 장식이 아니라 독자가 policy를 바꾸고 memory 증가를 직접 확인하는 계산 장부와 실행 순서로 만들었다.
- 최종 검증은 내용 존재가 아니라 계산값, 상호작용, 수식 pairing, overflow, source href와 learning-path 연결을 검사한다.

## Coverage recheck
| Scope item | Covered by | Remaining gap |
|---|---|---|
| Token·KV 장부 | token-budget + lab | 실제 제품별 profiler 수치는 model-specific 글에서 추가 |
| Memory policy | memory-regimes + flow Viz | compression algorithm 구현은 선택 논문 글로 defer |
| Understanding | FlexMem·OmniMem | benchmark별 세부 표는 원문으로 defer |
| Generation | LongLive·SANA·ISPA·HorizonRelight | 모델별 code path는 별도 paper/runtime 글 후보 |
| Distributed training | training-runtime | kernel·collective 구현은 GPU/HPC 글로 defer |
| Release gate | evaluation-release | 제품 dataset schema는 사용 사례별 구현에서 추가 |
