# GPU HPC 바닥부터 content spec

## Goal
- 독자가 GPU 서버를 여러 대 보유한 상태와 하나의 분산 계산을 수행하는 HPC 상태를 계산·통신·스케줄링 계약으로 구분한다.
- 두 노드 학습 작업이 자원 할당, rendezvous, rank/GPU 결합, NCCL communicator와 transport 선택, collective 검증을 거쳐야 실제 HPC 작업이 된다는 실행 경로를 증명한다.

## Source anchors
| Area | Official source | Why it matters |
|---|---|---|
| Worker launch | PyTorch `torchrun` documentation | `RANK`, `LOCAL_RANK`, `WORLD_SIZE`, rendezvous와 한 process/한 GPU 결합의 현재 계약 |
| Collective | NVIDIA NCCL user guide | communicator를 먼저 만들고 모든 rank가 collective에 참여해야 하는 이유 |
| Runtime evidence | NVIDIA NCCL logging guide | `INIT`, `NET`, `GRAPH`, `TUNING` log로 transport와 topology 선택을 증명하는 방법 |
| Fabric diagnosis | NVIDIA NCCL networking troubleshooting | link, HCA, GPU-memory RDMA, latency와 error counter를 아래에서 위로 검증하는 순서 |
| GPU memory path | NVIDIA GPUDirect RDMA documentation | GPU memory와 peer device DMA 사이의 driver·memory registration 경계 |

## Full-scope map
| Topic | Must cover | Depth | Source anchor | Notes |
|---|---|---|---|---|
| GPU server vs HPC | 장비 수가 아니라 하나의 계산과 collective 참여가 경계 | deep | NCCL usage | 첫 오해를 끊는다 |
| Scale-up vs scale-out | NVLink/PCIe와 RDMA fabric의 물리 경계 | deep | GPUDirect RDMA | network 글은 connector 세대 비교를 담당 |
| All-reduce | gradient가 왜 매 step 합쳐져야 하고 어떤 byte 비용을 만드는가 | deep | NCCL collectives | ring 식과 overlap trade-off 포함 |
| RoCEv2 | 100GbE line rate, RDMA semantics, congestion control을 분리 | deep | NCCL networking | 100G switch만 사면 된다는 오해를 막는다 |
| Stack ownership | application, collective, transport, device, fabric, scheduler 책임 | deep | NCCL + Kubernetes | scheduler가 data plane은 아님 |
| Two-node launch | allocation부터 receipt까지 실제 순서와 실패 분기 | deep | torchrun + NCCL logging | 기존 글에서 빠졌던 실행 다리 |
| MIG | 공유 격리와 큰 collective 효율의 선택 | brief | NVIDIA MIG concepts | 별도 운영 글로 확장 가능 |
| Fabric procurement | cable, optic, oversubscription, switch SKU | defer | `hw-network` | 이 글의 실행 흐름을 흐리지 않는다 |
| Kubernetes fleet lifecycle | device plugin, quota, autoscaling, warm capacity | defer | `k8s-gpu-fleet` | control-plane 글에 위임 |

## Reader prerequisites
- bit와 byte: 8 bit가 1 byte이며 link rate와 payload byte rate를 변환할 때 필요하다.
- process: 같은 프로그램을 실행하지만 독립된 memory를 가진 worker 하나다.
- gradient: model weight를 어느 방향으로 바꿔야 loss가 줄어드는지 나타내는 값이다.
- NIC: server memory와 network packet 사이를 연결하는 장치다.

## Section 1: GPU server에서 HPC까지 -- 무엇이 하나의 계산을 만드는가?
- Concept: GPU 개수보다 parallel decomposition과 collective가 HPC의 경계다.
- Execution flow:
  1. 한 GPU가 같은 kernel을 많은 data 조각에 적용한다.
  2. 한 node의 GPU가 PCIe/NVLink/NVSwitch topology로 묶인다.
  3. 여러 node가 NIC와 fabric을 통해 process group을 만든다.
  4. all-reduce 뒤 모든 rank가 같은 gradient를 갖는다.
- Design insight: 장비 inventory와 계산 graph를 구분해야 유휴 GPU 모음을 HPC라고 잘못 부르지 않는다.
- Edge cases/failure modes:
  - application이 분산 실행을 지원하지 않음: node가 많아도 독립 job일 뿐이다.
  - collective 한 rank 누락: 나머지 rank도 완료할 수 없다.
- Viz plan:
  - Step 0: CPU core와 GPU lane의 병렬 폭을 읽는다.
  - Step 1: 한 node 안 topology를 읽는다.
  - Step 2: NIC와 fabric을 건너는 scale-out을 읽는다.
  - Step 3: rank별 gradient가 동일 합으로 바뀌는 invariant를 읽는다.

## Section 2: Network data path -- 100G와 RoCEv2는 왜 다른가?
- Concept: link rate, transport semantics, GPU memory path, congestion control은 서로 다른 층이다.
- Key variables/fields:
  - `100 Gbit/s`: 물리 link의 이론상 bit rate.
  - `12.5 GB/s`: 8로 나눈 byte-rate 상한이며 application throughput 보장은 아니다.
  - ECN: queue가 넘치기 전에 congestion을 알리는 mark.
  - PFC: 특정 priority traffic을 잠시 멈추는 hop-level 제어.
- Execution flow:
  1. Socket path는 host memory와 kernel stack을 지난다.
  2. CPU와 driver가 memory region과 queue를 준비한다.
  3. GPUDirect RDMA data path가 host copy를 줄인다.
  4. ECN/PFC와 sender rate control이 queue를 안정시킨다.
- Edge cases/failure modes:
  - RDMA plugin 또는 HCA 경로 실패: socket fallback으로 job은 돌지만 성능이 무너질 수 있다.
  - PFC 과용: pause propagation과 head-of-line blocking.
- Viz plan:
  - 고정 SVG 대신 mobile에서 수직, desktop에서 수평으로 재배열되는 pipeline.
  - data path와 control path를 같은 선으로 섞지 않는다.

## Section 3: Stack ownership -- 어느 층의 문제인지 어떻게 가르는가?
- Concept: application, NCCL, transport, driver/device, fabric, scheduler의 책임을 분리한다.
- Execution flow:
  1. application이 tensor와 collective 호출을 만든다.
  2. NCCL이 topology에 맞는 algorithm/protocol을 고른다.
  3. transport와 driver가 device path를 연다.
  4. NIC가 DMA하고 fabric이 packet을 전달한다.
  5. scheduler는 이 전체가 시작할 resource를 함께 배정한다.
- Design insight: `job pending`, `init hang`, `slow all-reduce`는 서로 다른 층의 증상이다.
- Viz plan:
  - 선택한 층만 강조하고 그 층의 입력, 책임, 남겨야 할 증거를 함께 보여준다.

## Section 4: Two-node job trace -- 실제 작업은 어떤 순서로 살아나는가?
- Concept: 두 node × 네 GPU 작업을 하나의 검증 가능한 receipt로 만든다.
- Key variables/fields:
  - `WORLD_SIZE=8`: collective에 참여해야 할 전체 worker 수.
  - `RANK=0..7`: worker group 안에서의 전역 식별자.
  - `LOCAL_RANK=0..3`: 각 node 안에서 process를 GPU에 결합하는 번호.
  - rendezvous endpoint: 같은 job의 worker가 membership을 교환하는 만남 지점.
- Execution flow:
  1. scheduler가 두 node와 GPU 8개를 gang으로 확보한다.
  2. 두 node의 worker가 같은 rendezvous id/endpoint에 모인다.
  3. 각 process가 `LOCAL_RANK`와 같은 GPU 하나에 결합한다.
  4. NCCL communicator가 완성되고 실제 network transport를 선택한다.
  5. all-reduce 결과, transport log와 throughput을 한 receipt로 남긴다.
- Edge cases/failure modes:
  - rank 7 누락: world size가 완성되지 않아 init/collective가 기다린다.
  - `NET/Socket`: correctness는 통과할 수 있지만 의도한 RDMA 경로의 성능 증거는 실패다.
  - 두 process가 같은 local GPU에 결합: memory 충돌, hang 또는 잘못된 성능 비교.
- Viz plan:
  - Scenario toggle: 정상 / Socket fallback / Rank 누락.
  - Step 0: gang allocation의 슬롯 수.
  - Step 1: rendezvous membership.
  - Step 2: rank와 local GPU binding.
  - Step 3: transport selection evidence.
  - Step 4: pass/warn/fail receipt.

## Hard transfer problems
1. 두 node × 네 GPU, `WORLD_SIZE=8` 작업에서 rank 7이 시작되지 않았다. 왜 나머지 GPU 사용률이 0%에 가깝고 network도 조용한지, scheduler와 rendezvous 관점에서 설명할 수 있어야 한다.
2. all-reduce correctness는 통과하지만 NCCL log가 `NET/Socket`이고 scaling efficiency가 급락한다. 100GbE link가 있다는 사실만으로 왜 합격이 아니며, 어느 층에서 어떤 증거를 더 확인해야 하는지 말할 수 있어야 한다.
3. GPU 8개와 gradient tensor 크기 `S`가 주어졌을 때 ring all-reduce의 GPU당 통신량을 `2(N-1)S/N`로 근사하고, effective bandwidth로 나눠 숨길 수 없는 통신 시간의 하한을 계산할 수 있어야 한다.
4. 작은 inference tenant 8개와 하나의 대형 training job 중 어느 쪽에 MIG를 검토할지, isolation과 collective topology의 trade-off로 판단할 수 있어야 한다.

## Cross-section narrative
- “GPU가 빠르다”에서 시작해 “여러 GPU가 같은 답을 가져야 한다”로 이동하고, 그 답을 옮기는 data path와 각 software layer를 차례로 연다.
- 마지막 two-node trace는 앞의 개념을 실제 시작 순서와 증거로 다시 묶는다. 독자는 제품명 목록이 아니라 실패 지점을 역추적할 수 있어야 한다.

## Coverage recheck
| Scope item | Covered by section | Gap | Fix |
|---|---|---|---|
| GPU server/HPC boundary | Section 1 | none | execution invariant 유지 |
| Scale-up/out | Section 1 | none | responsive topology Viz |
| NCCL collective | Section 1, 4 | none | rank completeness를 실행 흐름에 연결 |
| RoCEv2 | Section 2 | none | link와 transport를 분리 |
| Scheduler boundary | Section 3, 4 | none | gang allocation과 data plane 분리 |
| Actual launch/receipt | Section 4 | existing article missing | new prose + scenario Viz |
| Procurement detail | `hw-network` | intentionally deferred | internal link 유지 |
