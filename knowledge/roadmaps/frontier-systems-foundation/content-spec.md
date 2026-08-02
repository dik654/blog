# AI systems from scratch learning path content spec

## Goal
- GPU HPC, knowledge compiler, robot AI, post-training, MoE streaming을 처음 접한 독자가 서로 다른 유행어가 아니라 하나의 시스템 흐름으로 설명할 수 있게 한다.
- 독자는 각 트랙을 마친 뒤 하드웨어와 소프트웨어 경계를 구분하고, 자신에게 필요한 구성과 다음 실습을 판단할 수 있어야 한다.

## Learner starting point
- Go, Rust, LLM, 분산 시스템, GPU에 관심이 있지만 로봇 제어와 네트워크 하드웨어는 익숙하지 않다.
- 긴 이론보다 먼저 전체 지도를 보고, 움직이는 그림으로 데이터 흐름을 확인한 뒤 세부 원리를 내려가길 원한다.
- 최종 목표는 용어 암기가 아니라 시스템 설계와 구현 방향 판단이다.

## Curriculum rule
- 섹션 이름은 강사의 분류가 아니라 독자가 실제로 던질 질문으로 쓴다.
- 첫 화면에서 전체 경로와 도착점을 보여준다.
- 정의보다 먼저 움직이는 데이터, 토큰, 패킷, 센서 신호를 보여준다.
- 모든 시각화는 입력 상태, 전이, 출력 상태, 병목을 최소 한 번씩 드러낸다.
- 특정 제품의 최신 숫자는 출처 시점을 표시한다. 일반 원리와 구현 사례를 분리한다.

## Source anchors
| Area | Primary source | Why it matters |
|---|---|---|
| GPUDirect RDMA | NVIDIA CUDA GPUDirect RDMA docs | GPU memory와 peer device 사이의 DMA 경계 |
| NCCL / RoCE | NVIDIA NCCL networking troubleshooting | RoCE v2 GID, RDMA transport의 실제 소프트웨어 경계 |
| Kubernetes GPU | Kubernetes device plugin docs, NVIDIA GPU Operator docs | Kubernetes가 GPU와 RDMA를 직접 구현하지 않는다는 경계 |
| ROS 2 | ROS 2 nodes and interface docs | node, topic, service, action의 역할 구분 |
| Robot learning | Isaac Lab, LeRobot official docs | vectorized simulation, imitation/RL, sim-to-real 학습 흐름 |
| RLVR | DeepSeek-R1 paper and reproducibility literature | outcome verifier, rollout, policy update, 한계 |
| MoE streaming | `JustVugg/colibri` repository and model config | dense resident weights, routed expert streaming, cache, prefetch |

## Full-scope map
| Track | Foundation to add | Core mechanism | Operations and failures | Depth |
|---|---|---|---|---|
| Common map | latency vs bandwidth, memory hierarchy, batch/parallelism, feedback loop | five-track dependency graph | choose-next-track decision | deep |
| GPU HPC | CPU/GPU, node, scale-up/out, collective communication | NVLink, NCCL, RDMA, RoCEv2, InfiniBand, scheduler | PFC/ECN, topology, oversubscription, observability, MIG boundary | deep |
| Knowledge compiler | parser vs model, document structure, provenance | normalized document, Knowledge IR, concept graph, renderer | OCR/STT errors, prompt injection, language drift, incremental updates | deep |
| Robot AI | coordinate frame, state/action, open/closed loop | ROS 2 graph, perception-planning-control, simulation and policy | latency, calibration, sim-to-real gap, safety, hardware boundary | deep |
| Post-training | pre-training, SFT, preference, policy/reward | rollout, verifier, advantage, policy update | reward hacking, verifier gap, collapse, overfitting | deep |
| MoE streaming | dense vs sparse, quantization, memory hierarchy | routing, working set, LRU, async prefetch | random-read ceiling, cache miss, thermal, exactness, throughput | deep |

## Question ladder
| Order | Learner question | Page or section | Outcome | Next question |
|---|---|---|---|---|
| 1 | 이 많은 주제가 어떻게 연결되지? | systems learning map | five-track dependency map을 설명한다 | 무엇부터 시작하지? |
| 2 | GPU 서버 여러 대면 바로 HPC인가? | GPU HPC | server와 cluster, scale-up/out을 구분한다 | GPU끼리는 어떻게 통신하지? |
| 3 | 100G와 RoCEv2는 같은 말인가? | GPU HPC | bandwidth와 transport를 구분한다 | 누가 자원을 배정하지? |
| 4 | 여러 형식의 기술 콘텐츠를 어떻게 같은 문서로 만들지? | knowledge compiler | parser, IR, renderer 경계를 그린다 | 여러 언어는 어디서 처리하지? |
| 5 | 로봇 AI는 PCB부터 해야 하나? | robot AI | AI, control, embedded, electrical의 경계를 구분한다 | 개인은 어떤 첫 성공을 만들지? |
| 6 | post-training은 고품질 데이터를 더 넣는 것뿐인가? | post-training | SFT, preference, RL을 구분한다 | RLVR은 왜 추론에 효과적인가? |
| 7 | 전체 모델이 RAM에 없는데 추론이 가능한가? | MoE streaming | active weights와 resident weights를 구분한다 | 왜 여전히 느린가? |

## Page 1: Systems learning map
### Core question
- 어디서 시작해 어떤 순서로 내려가야 하는가?

### Sections
1. 다섯 주제는 어떤 공통 구조를 가지는가?
2. 내가 먼저 메워야 할 기초는 무엇인가?
3. 한 트랙을 끝내면 무엇을 판단할 수 있는가?
4. 기존 블로그의 어떤 글과 연결되는가?

### Viz plan
- Dependency map: compute, data, policy, physical system을 노드로 두고 다섯 트랙이 공유하는 기반을 단계별로 밝힌다.
- Track chooser: 목적을 선택하면 필요한 기초와 다음 글이 한 줄 경로로 바뀐다.
- Avoid decorative progress percentages. Completed state is a concrete capability checklist.

## Page 2: GPU HPC from scratch
### Core questions
- GPU 한 대, GPU 서버, HPC 클러스터는 어디서 갈리는가?
- NVLink, 100GbE, RoCEv2, InfiniBand는 각각 어느 구간을 담당하는가?
- Kubernetes, Slurm, NCCL, MPI 중 누가 실제 계산과 배정을 담당하는가?

### Foundation modules
- FLOPs와 bytes: 계산 병목과 통신 병목을 구분한다.
- latency와 bandwidth: 넓은 도로와 출발 지연을 분리한다.
- reduce와 all-reduce: 각 GPU의 gradient 조각이 합쳐지는 과정을 먼저 본다.

### Execution flow
1. 한 GPU에서 kernel이 tensor를 계산한다.
2. 한 노드의 여러 GPU는 PCIe/NVLink/NVSwitch로 scale-up한다.
3. 여러 노드는 NIC와 fabric으로 scale-out한다.
4. NCCL은 topology에 맞는 collective 경로를 선택한다.
5. scheduler는 job과 GPU를 배정하지만 RDMA를 구현하지 않는다.

### Failure modes
- 100G 링크만 보고 RDMA가 된다고 가정한다.
- PFC를 무조건 켜 lossless를 만든다고 생각한다.
- MIG를 multi-node training의 필수 요소로 오해한다.
- link speed만 보고 oversubscription, NUMA, PCIe topology를 무시한다.
- 작은 gradient bucket과 잦은 collective가 latency를 증폭한다.

### Viz plan
- CPU sequential lanes vs GPU SIMT lanes.
- Single server scale-up vs multi-node scale-out.
- TCP copy path vs GPUDirect RDMA path with moving tensor chunks.
- All-reduce ring: gradient chunks circulate and every GPU ends with the same sum.
- Scheduler boundary: Slurm/Kubernetes assigns; CUDA/NCCL/UCX transports and computes.

## Page 3: Knowledge compiler
### Core questions
- PDF, YouTube, HTML, GitHub을 어떻게 같은 지식 구조로 바꾸는가?
- 최신 LLM이 문서를 잘 읽어도 왜 parser와 IR이 필요한가?
- 여러 언어를 번역 단계 없이 어떻게 처리하며 어디서 품질이 깨지는가?

### Foundation modules
- syntax, structure, semantics, provenance를 구분한다.
- chunk는 임의 글자 수가 아니라 section, timestamp, code symbol 경계로 만든다.
- parser output과 model inference를 분리한다.

### Execution flow
1. Connector가 원본과 metadata를 보존한다.
2. Modality parser가 text, figure, table, code, timestamp를 추출한다.
3. Normalizer가 공통 block schema로 바꾼다.
4. Extractor가 claim, concept, relation, evidence를 Knowledge IR에 기록한다.
5. Validator가 source span과 contradiction을 확인한다.
6. Renderer가 한국어 글, 구현 가이드, mind map 등으로 변환한다.

### Failure modes
- HTML이 바뀔 때마다 agent browser로 전부 읽어 비용이 폭증한다.
- OCR 오류가 의미 추론에서 사실처럼 굳는다.
- 번역된 문장만 저장해 원문 근거를 잃는다.
- prompt injection이 문서 본문에서 instruction으로 승격된다.
- 전체 문서를 한 번에 요약해 appendix, figure, ablation을 잃는다.

### Viz plan
- Four input types become normalized blocks while provenance lines remain attached.
- Language A and B map to the same concept id, then render into output language.
- Rule parser first, agent fallback only on uncertain regions.
- Evidence graph blocks an unsupported claim from reaching the renderer.

## Page 4: Robot AI top-down
### Core questions
- Robot AI, control, embedded, electrical, mechanical은 어떻게 이어지는가?
- 개인 개발자는 하드웨어 없이 어디까지 갈 수 있는가?
- orchard navigation 같은 실제 문제는 perception에서 motor command까지 어떻게 흐르는가?

### Foundation modules
- state, observation, action, policy, reward.
- coordinate frame and transform.
- open-loop vs closed-loop feedback.
- frequency boundary: planning Hz, control Hz, motor loop kHz를 개념적으로 구분한다.

### Execution flow
1. simulator에서 sensor observation을 만든다.
2. ROS 2 topic이 continuous data를 전달한다.
3. perception이 object/segmentation과 confidence를 만든다.
4. planner가 path 또는 end-effector goal을 만든다.
5. controller가 error를 줄이는 command를 반복한다.
6. embedded controller가 motor current/position loop를 닫는다.

### Orchard case
- segmentation으로 traversable region을 얻는다.
- detection으로 tree position을 얻는다.
- calibration을 통해 pixel root point를 ground coordinate로 바꾼다.
- robust fitting으로 row centerline을 추정한다.
- planner가 local path를 만들고 controller가 추종한다.
- occlusion, slope, missing tree, lighting change를 failure set으로 둔다.

### Viz plan
- Robot stack signal loop from camera to motor and encoder back to controller.
- ROS 2 topic/service/action choice with data moving through nodes.
- Orchard frame sequence: pixels to roots to fitted rows to drivable centerline.
- Top-down roadmap with first runnable result at simulation before theory branches.

## Page 5: Post-training and RLVR
### Core questions
- pre-training, SFT, preference learning, RL은 무엇을 각각 바꾸는가?
- RL을 오래 돌린다는 말은 무엇이 늘어나는가?
- verifier가 있으면 왜 사람 평가보다 확장하기 쉬우며, 무엇을 놓치는가?

### Foundation modules
- model as policy, generated sequence as trajectory, reward as scalar signal.
- sampling creates multiple candidate rollouts.
- outcome reward does not directly prove every intermediate thought.

### Execution flow
1. prompt에서 multiple rollouts를 sample한다.
2. deterministic verifier or tests produce rewards.
3. group-relative baseline converts rewards into advantages.
4. higher-advantage token paths become more likely under a bounded policy update.
5. held-out evaluation checks whether the gain generalizes.

### Failure modes
- bad verifier rewards formatting tricks.
- binary exact match rejects semantically correct alternatives.
- repeated RL narrows diversity or overfits a benchmark.
- language and safety quality regress while math score rises.
- claim that RL always invents new reasoning exceeds available evidence; distinguish elicitation from new capability.

### Viz plan
- Pre-training imitation vs SFT demonstration vs preference pair vs RL rollout.
- Eight rollouts enter a verifier; rewards produce relative advantages and one bounded update.
- Reward hacking path passes a weak checker but fails a stronger test suite.

## Page 6: MoE SSD expert streaming
### Core questions
- 744B total parameters and roughly 40B active parameters can coexist how?
- active parameters are not the same as weights resident in RAM; why?
- cache and prefetch reduce waiting, but why does disk remain the limit?

### Foundation modules
- dense FFN vs routed experts.
- quantized weight size estimate.
- capacity, working set, bandwidth, locality.

### Execution flow
1. dense weights stay resident.
2. router selects top-k experts for the current layer.
3. runtime checks per-layer cache.
4. cache miss schedules asynchronous random reads.
5. expert matmul consumes the loaded weights.
6. LRU/pinned hot tier updates locality statistics.
7. next-layer prediction may prefetch likely experts but cannot make wrong reads free.

### Failure modes
- sequential SSD headline bandwidth is used for random expert reads.
- active FLOPs is confused with model storage or memory traffic.
- speculation increases unique expert loads on a cold cache.
- low RAM causes cache churn or swap writes.
- proof-of-concept latency is marketed as interactive chat throughput.

### Viz plan
- Dense model reads every block; MoE router lights only top-k experts.
- VRAM/RAM/SSD tiers with expert blocks moving on cache hit and miss.
- Cold cache timeline vs warm cache timeline; overlap compute and read.
- Throughput equation shows bytes per token divided by effective random-read bandwidth.

## Common article UX
| Need | Implementation | Completion test |
|---|---|---|
| Know where I am | breadcrumb, track badge, level, estimated time | visible before first section |
| Know prerequisites | compact prerequisite links | no prerequisite hidden in prose |
| Navigate long article | desktop sticky TOC plus mobile collapsible TOC | all h2/h3 reachable at 390px |
| See reading movement | thin reading progress under header | no content shift |
| Continue learning | previous/next within the learning path | correct cross-category links |
| Understand a scene | step label, body, previous/next, play/pause only where animation helps | keyboard and reduced-motion safe |
| Avoid dead ends | related existing articles and concrete next action | every page ends with one decision or experiment |

## Coverage recheck
| Scope item | Planned page | Gap | Fix |
|---|---|---|---|
| HPC definition through production boundary | GPU HPC | none | use cross-node collective as recurring example |
| RoCE hardware/software split | GPU HPC | none | render layered boundary, not a component list |
| AI crawler rule vs agent tradeoff | Knowledge compiler | none | uncertainty-based fallback scene |
| multilingual semantic handling | Knowledge compiler | partial risk | preserve source language and concept id in IR |
| orchard navigation | Robot AI | none | add calibration and failure cases omitted from conversation |
| personal top-down roadmap | Robot AI | none | first simulator success precedes control theory |
| post-training basics | Post-training | none | separate SFT, preference, RL behavior |
| why deeper RL may help | Post-training | none | explain exploration and verifier limits, avoid universal claim |
| RLVR | Post-training | none | verifier, advantage, update, evaluation loop |
| 744B/25GB claim | MoE streaming | none | label as Colibri implementation case, date and author-reported speed |
| site navigation and mobile UX | common UI | none | global article layout plus learning map |

## Final QA gates
- `bun run build` succeeds.
- New pages contain no blank SVG and no horizontal page overflow at 1440x900, 768x1024, 390x844.
- Every specialized term is expanded on first use.
- Every numeric case study is either derived on screen or linked to a dated primary source.
- A reader can move from the learning map through all five tracks and back without using browser history.
- Reduced-motion preference removes nonessential continuous animation.
