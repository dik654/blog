# 05. 블로그 공백 분석 — LLM 서빙 주제 T1~T10 (2026-11-03)

대상 저장소는 `/Users/dylan/code/projects/blog`이고, 읽기만 했다. 수정하지 않았고 git 조작도 하지 않았다.
근거 문서는 같은 폴더의 00~04다.

## 0. 읽은 판본과 주의점

- **`ai/*` 글**: 관련 파일에 미커밋 변경이 없다(`git status` 확인). 작업 트리가 곧 HEAD(`64850e64`, 2026-11-02)다.
- **미커밋 변경이 있는 글**: `hw/modded-rtx4090-moe-serving/*`(20개 파일)와 `hw/network/*`(Interconnect·RDMA·InfiniBand 등)는 다른 세션이 고치는 중이다. 이 두 묶음은 작업 트리를 읽었다. `ReleaseGate.tsx`만 HEAD와 대조했다(§2 C1). 이 두 묶음을 고치려면 그 세션과 먼저 조율해야 한다.
- **route key와 파일 경로가 다르다**: 아래 세 글은 route key가 `gpu/...`인데 파일은 `src/pages/articles/hw/` 아래에 있다. 카탈로그는 `src/content/gpu/articlesHw.ts`다.
  - `gpu/modded-rtx4090-moe-serving`
  - `gpu/gpu-collective-network`
  - `gpu/rdma-roce`

  `gpu/rdma-roce`와 `gpu/gpu-collective-network`는 10줄짜리 래퍼다. 실제 본문은 `hw/network/RDMA.tsx`와 `hw/network/InfiniBand.tsx`에 있다.
- **블로그 전체 grep 결과**: 다음 키워드는 본문에 한 번도 나오지 않는다(`codebase/`와 json 제외).

  | 키워드 | 상태 |
  |---|---|
  | `AgentPerf`, `P25`, `LMCache`, `pplx`, `allgather_reducescatter`, `EULA`, `KV 복제`, `decode context parallel`, `RTX PRO 6000` | 본문에 없음 |
  | `DCP` | `hw/ai-infrastructure-study/data.ts`에 한 번 나오지만 PyTorch Distributed Checkpoint를 가리킨다. 이 문서의 DCP(decode context parallel)와 다르다 |

## 1. 커버리지 매트릭스

판정 기준은 다음과 같다.

| 판정 | 뜻 |
|---|---|
| FULL | 메커니즘과 수치가 모두 있다 |
| PARTIAL | 메커니즘이나 수치 중 일부만 있다. 또는 dense·NVLink 사례만 있다 |
| SENTENCE | 한두 문장의 언급뿐이다 |
| NONE | 다루지 않는다 |
| CONTRADICTED | 근거와 어긋나는 서술이 있다 |

### 1.1 요약 (주제 × 판정)

| 주제 | 종합 | 가장 가까운 정본 | 핵심 공백 |
|---|---|---|---|
| T1 decode 대역폭 한계 | **PARTIAL** | `ai/model-vram-budgeting#moe-vram-serving-tradeoff` | ÷TP, ÷대역폭→tok/s 상한, 1T/32B 수치, **batch에서 expert 합집합이 커지는 효과**(§2 C3) |
| T2 TP 통신 횟수·PCIe | **PARTIAL** | `ai/tensor-and-pipeline-parallel-inference#decode-impact` | 메커니즘(α×2×L)은 FULL이지만 dense 70B·NVLink 사례뿐이다. PCIe α, 61층→122회, P2P on/off(65 대 44), NCCL·NUMA·CPU(Turin 대 Genoa) 효과는 NONE |
| T3 PP activation 전송량 | **FULL**(dense) / MoE 수치 NONE | `#pipeline-parallel`, `parallelism-strategy#placement` 후보 B | hidden 7168 기준 14 KiB/token, Gbps 환산, MLX batch=1 사례 |
| T4 EP all-to-all | **PARTIAL** | `ai/expert-parallelism-moe-systems` | DeepEP normal의 NVLink 필수 조건, pplx 제거, allgather_reducescatter fallback, PCIe+RoCE wide-EP가 비현실적인 이유, EP가 이득인 batch 조건 |
| T5 총 처리량 대 요청당 속도 | **PARTIAL** | `ai/serving-latency-metrics-and-slo#throughput`, `ai/serving-benchmark-methodology#load` | 메커니즘(1/8/32 → 50/286/640 tok/s)은 있다. AA-AgentPerf 방법(P25·P95 TTFT·최대 동시 에이전트), 티어 수치, "SLO를 지키는 처리량"을 에이전트에 적용하는 부분은 NONE |
| T6 MLA KV의 TP 복제와 DCP | **PARTIAL**(대조군만) / 핵심은 **NONE** | `ai/kv-cache-fundamentals#parallel-budget`(SENTENCE), `ai/multi-head-latent-attention-mechanics`(576 원소 FULL) | MLA KV가 TP rank마다 복제된다는 점, DCP, 70 KB/token, 19만 대 362만 토큰 |
| T7 장문 에이전트 KV·캐시 | **PARTIAL**(메커니즘 조각) / 수치 NONE | `ai/prefix-caching-radix-attention#eviction`, `ai/serving-memory-admission-and-preemption#long-context-isolation` | 입력:출력 100~448:1, 적중률 94~99%, 98%→17% 붕괴, LMCache 호스트 오프로드 |
| T8 자체 호스팅 대 API 경제성 | **PARTIAL**(강함) | `ai/own-vs-rent-inference-capacity#unit-mismatch`, `#what-moves-it` | 역산형 손익분기(최대 capex), 입력·캐시 단가가 지배하는 에이전트 API 비용 계산 |
| T9 PCIe 전용 Blackwell 구성 | **PARTIAL**(일반론) / PRO 6000 고유 내용 NONE / 4090 라이선스 **CONTRADICTED**(작업 트리) | `hw/network/Interconnect`, `hw/network/RDMA`, `hw/server-cpu-lineup-comparison/MemoryChannels` | ConnectX-8 내장 스위치, PRO 6000 RDMA 미문서화, GeForce EULA §2.7·2.8 |
| T10 아키텍처 매트릭스 | **NONE**(종합) | 조각만 흩어져 있다 | dense·MoE+GQA·MoE+MLA·MoE+하이브리드·SWA를 한 표에서 VRAM·바이트·KV·병렬화·네트워크로 비교하는 글 |

### 1.2 상세 (주제별 근거 위치)

#### T1. decode는 메모리 대역폭에 묶인다

- `ai/model-vram-budgeting#moe-vram-serving-tradeoff`(`MoeVramServingTradeoff.tsx`) — **PARTIAL**
  - "Decode 한 step이 다시 읽는 weight bytes는 dense에서는 total parameter에, MoE에서는 router가 고른 active parameter에 비례합니다."
  - 식은 `bytes_moe = P_active·B`이고, 80B/3B 예시로 "약 26배"를 보인다. capacity와 bandwidth의 대비가 있다.
  - 빠진 것은 ÷TP, ÷GPU 대역폭으로 구하는 tok/s 상한, batch 조건(§2 C3)이다.
- `ai/mixture-of-experts#system-cost` — **PARTIAL**
  - "weight memory는 total parameter에 가깝고 token별 expert FFN multiply-add는 active expert에 가깝습니다."
  - FLOP 장부만 있고 대역폭 장부는 없다.
- `ai/tensor-and-pipeline-parallel-inference#pipeline-parallel`·`#decode-impact` — **PARTIAL**(dense)
  - "70B FP16 을 PP 8 로 두면 stage 마다 17.5 GB 를 읽어 3.35 TB/s 에서 5.2 ms".
  - 블로그에서 유일하게 "바이트 ÷ TP ÷ 대역폭"을 실제 숫자로 계산한 곳이다. dense만 다룬다.
- `ai/prefill-decode-phase-dynamics#arithmetic-intensity` — **PARTIAL**
  - KG 개념 `decode-memory-bound-regime`의 canonical이다.
  - 연산 강도 개념만 있고 MoE 사례는 없다.
- `gpu/modded-rtx4090-moe-serving` CapacityMod — **SENTENCE**
  - "decode 때 가중치를 읽는 속도는 메모리 대역폭 문제라 용량 증가만으로 빨라지지 않는다."

#### T2. TP 통신 횟수와 PCIe

- `ai/tensor-and-pipeline-parallel-inference#tensor-parallel`·`#collectives`·`#decode-impact` — 메커니즘은 **FULL**, PCIe·MoE는 **NONE**
  - "80 layer × layer마다 2회 × 회마다 5μs = 800μs".
  - 경계 n = αB를 다룬다. "decode 의 1 MB all-reduce 는 latency 영역".
  - 노드를 넘는 TP는 α 15 μs로 계산한다. 단 사례가 NVLink 900 GB/s와 IB뿐이다.
- `ai/parallelism-strategy-and-placement#fabric-tiers`·`#placement` — 노드를 넘는 TP가 나쁜 이유는 **FULL**
  - 후보 A TP16: "통신 8.4 ms + weight 2.6 ms = TPOT 11 ms".
  - PCIe 계층 행은 없다.
- `gpu/rdma-roce`·`gpu/gpu-collective-network`(`hw/network/Interconnect.tsx`, 작업 트리) — **PARTIAL**
  - PIX/PXB/PHB/SYS 거리표를 설명한다.
  - "ACS, IOMMU와 virtualization policy도 P2P routing에 관여합니다."
  - `nvidia-smi topo -p2p`를 다룬다. P2P on/off가 처리량에 주는 효과 수치는 없다.
- `gpu/modded-rtx4090-moe-serving` NvlinkGapQuantified — **PARTIAL**
  - 4090에는 P2P가 없고 호스트 staging을 쓴다. 31.5 GB/s 계산이 있다.
- 없는 것(**NONE**):
  - 61층이면 토큰당 122회 동기화라는 계산.
  - P2P on 65 / off 44 tok/s.
  - Turin 65 / Genoa 32 tok/s.
  - NCCL 설정: `NCCL_P2P_LEVEL`, 토폴로지 XML, `uvm_disable_hmm`.

#### T3. PP activation 전송량

- `ai/tensor-and-pipeline-parallel-inference#pipeline-parallel` — **FULL**(dense)
  - prefill 33.6 MB와 decode의 직렬 stage 지연을 다룬다.
  - "한 요청의 속도는 PP 로 빨라지지 않습니다"(L236).
- `ai/parallelism-strategy-and-placement#placement` 후보 B — **FULL**
  - "node 경계는 stage 당 activation 1 MB 한 번", "통신 1.1 ms + 경계 0.035 ms".
  - "한 요청의 latency 는 줄지 않고 microbatch 가 찰 때만 이득".
- 빠진 것:
  - MoE 수치: 7168×2 B = 14,336 B/token, 2,000 tok/s면 0.23 Gbps.
  - MLX PP4 14.49 대 TP4 14.82가 batch=1 조건이라는 반례.

#### T4. EP all-to-all

- `ai/expert-parallelism-moe-systems`(#all-to-all, #bottleneck, #locality, #comparison, #limits) — **PARTIAL**
  - 바이트 장부 2mkdb, 56 MiB ÷ 50 GB/s = 1.174 ms, hot expert 1.75배를 다룬다.
  - DeepEP V2.5 EPBuffer가 나오고 "zero-SM RDMA EP is not supported"를 인용한다.
  - 빠진 것:
    - DeepEP normal 모드의 NVLink 필수 조건(#216, #584).
    - pplx 제거.
    - `allgather_reducescatter` fallback과 그 트래픽이 DP 크기에 비례한다는 점.
    - llm-d wide-EP 검증 장비가 H200/B200/GB200뿐이라는 점.
    - EP가 이득을 내는 batch 조건: wide-EP 2.2k tok/s/GPU는 rank당 256 동시, 요청당 8.6 tok/s에서 나온 값이다.
- `gpu/modded-rtx4090-moe-serving` MoeCommunicationSensitivity·EngineeringRecovery — **PARTIAL**
  - "MoE expert가 여러 장에 남아 있다면 PP로 바꿔도 EP dispatch는 사라지지 않는다. 따라서 'PCIe면 무조건 PP'라는 기본값을 두지 않는다."
- `ai/mixture-of-experts#system-cost` — **PARTIAL**(식 `B ≳ 2mkdb`)

#### T5. 총 처리량 대 요청당 속도

- `ai/serving-latency-metrics-and-slo#throughput`(8절) — **PARTIAL**(메커니즘 FULL)
  - 동시 1/8/32에서 간격 20/28/50 ms, 서버 50/286/640 tok/s. 수치는 가정이다.
- `ai/serving-benchmark-methodology#load` — **PARTIAL**
  - "SLO를 마지막으로 만족하는 지점… 그 양이 goodput."
  - offered-load sweep 의사코드가 있다. SLO 예시는 "P99 ITL ≤ 80 ms"인데, 이는 12.5 tok/s로 에이전트 기준에 미달한다(§2 C5).
- `ai/own-vs-rent-inference-capacity#unit-mismatch` — **SENTENCE**
  - "사용자당 초당 50토큰… 0.56달러, 125토큰… 약 4달러".
- 없는 것(**NONE**):
  - AA-AgentPerf: P25 출력 속도, P95 TTFT, 지수 증가 뒤 이진 탐색으로 찾는 최대 동시 에이전트.
  - 티어: 20/10s, 60/5s, 180/3s.
  - 결과: H200×8 11, B300×8 144, GB300 1,840/32.
  - "900 tok/s @100 = 요청당 9 tok/s" 사례.

#### T6. MLA KV의 TP 복제와 DCP

- `ai/kv-cache-fundamentals#parallel-budget`(21절) — **SENTENCE**
  - "KV head보다 GPU가 많아 일부 head를 복제하는 구현이라면 전체 byte를 GPU 수로 단순히 나누면 틀립니다."
  - GQA 일반론이다. MLA에서 latent 1개가 전 rank에 복제된다는 언급은 없다.
- `ai/hybrid-attention-serving` KVCache.tsx L131 — **SENTENCE**
  - "Tensor parallel에서는… rank에 배치되거나 복제된 실제 head 수를 사용합니다."
- `ai/multi-head-latent-attention-mechanics#problem`·`#decoupled-rope`·`#weight-absorption` — 576 원소는 **FULL**
  - DeepSeek-V2 기준이다. 61층 합계(70 KB)와 TP 배치는 없다.
- `ai/tensor-and-pipeline-parallel-inference#sequence-context-parallel` — **SENTENCE**
  - "decode 에서는… KV 를 나눠 둔 채 부분 attention 결과만 모으는 쪽이 보통입니다."
  - DCP의 아이디어인데 이름이 없다.
- 대조군은 있다.
  - `ai/kv-cache-quantization#small-case`: FP8로 2배, FULL.
  - `ai/linear-attention-and-state-space-models#recurrent-state`: 고정 state, FULL.
  - `ai/qwen36-hybrid-runtime#hybrid-runtime`: 길이 비례 KV와 요청당 고정 state, FULL. 단 "TP/PP shard를 제외한 logical decomposition"이라고 명시한다.
  - `ai/hybrid-attention-serving#capacity-sliding`(Gemma 실측 1.36배)과 `ai/sliding-window-kv-and-attention-sinks`: FULL.
- 핵심 주장인 "MLA는 TP로 KV가 줄지 않는다 → DCP·FP8 KV가 필수"는 **NONE**이다.

#### T7. 장문 에이전트 워크로드

- `ai/prefix-caching-radix-attention#eviction` — **PARTIAL**
  - "X1,Y1,X2,Y2,X3,Y3 순서로 번갈아 실행하면 매번 앞 계열의 기록을 밀어내어 hit은 0".
  - 적중률 붕괴의 축소판이다. 실측 수치는 없다.
- `#cache-pricing` — **PARTIAL**
  - 캐시 읽기 0.1배, 쓰기 1.25배, 1회 재사용 1.35배 대 2배.
- `ai/serving-memory-admission-and-preemption#long-context-isolation` — **PARTIAL**
  - "128K 요청 셋이 짧은 대화 자리의 89%를 가져갑니다."
- `#preemption-modes`·`#recovery-cost` — **PARTIAL**
  - swap(CPU) 대 recompute를 다룬다. 계층형 KV 오프로드(LMCache)는 없다.
- `ai/disaggregated-prefill-decode-serving#paper-mooncake` — **SENTENCE**
  - CPU 메모리 분산 저장소.
- 없는 것(**NONE**): 100~448:1, 94~99%, 98.85%→16.78%(동시 15→20), Copilot 턴 경계 55%, 세션당 KV 3.8 GB/100K.

#### T8. 자체 호스팅 대 API

- `ai/own-vs-rent-inference-capacity#two-rentals`·`#unit-mismatch`·`#what-moves-it` — **PARTIAL**(강함)
  - 손익분기 가동률 식(예 55%)이 있다.
  - "API 가격표는 입력과 출력과 캐시 읽기의 단가가 각각 다르고…"를 다룬다.
  - "전력은 토큰당 원가의 5에서 15퍼센트"는 근거와 일치한다. 근거는 150→250원/kWh에서 약 10%다.
- `ai/inference-cost-and-capacity-planning#cost`·`#efficiency`·`#tier-mix` — **PARTIAL**
  - "평균 utilization 이 40 % 면… 2.5 배"를 다룬다.
  - 405B BF16을 16장으로 계산한 부분은 근거와 정합한다.
- 없는 것: 최대 capex 역산표(근거 00 §4), 100:1·448:1 부하에서 출력 1M당 API 실비용.

#### T9. PCIe 전용 Blackwell 하드웨어

- `hw/network/Interconnect.tsx`(작업 트리) — **PARTIAL**
  - "두 GPU가 같은 PCIe switch 아래 있으면 peer transaction이 그 switch에서…".
- `hw/network/RDMA.tsx` "GPUDirect RDMA도 topology가 조건이다" — **PARTIAL**
- `hw/server-cpu-lineup-comparison/MemoryChannels.tsx` — **PARTIAL**
  - "12채널과 8채널은 같은 속도 등급에서 1.5배". GPU 서빙과 연결되지 않는다.
- `hw/b300-switchless-network` Topology·Ports — ConnectX-8을 B300 맥락에서만 다룬다. **SENTENCE**
- `gpu/modded-rtx4090-moe-serving` ReleaseGate(작업 트리) — **CONTRADICTED**(§2 C1)
- 없는 것(**NONE**):
  - RTX PRO 6000 자체(전 블로그 0회).
  - ConnectX-8 내장 Gen6 스위치와 GPU 2장당 NIC 1개 비율.
  - PRO 6000의 P2P·GPUDirect RDMA가 문서화되지 않았다는 점.
  - `NCCL_NET_GDR_READ=1`.
  - GeForce EULA.

#### T10. 아키텍처 매트릭스

종합하는 글은 **NONE**이다. 조각은 다음 글에 흩어져 있다.

- dense 대 MoE 바이트: `model-vram-budgeting`.
- MHA/GQA/MQA/MLA 형태: `kv-cache-fundamentals`, `hybrid-attention-serving#kv-shape`·`#mla-vs-gqa`.
- KDA+MLA 스케줄: `kimi-k3-architecture`, `kimi-k3-sequence-mixer`. "23개의 3 KDA + 1 MLA block 뒤에 마지막 MLA 하나"는 69+24=93층이라 근거 01 §7과 일치한다.
- Qwen3.6 하이브리드: `qwen36-*`.
- SWA: `sliding-window-kv-and-attention-sinks`(gpt-oss).
- TP head 나누어떨어짐: `parallelism-strategy#procedure` L303 "head 수가 TP 로 나뉘어야 합니다". **SENTENCE**다.
- 아키텍처별 병렬화 선택(EP가 의미 있는 조건, DCP 필요성)과 네트워크 요구는 **NONE**이다.

## 2. 상충하거나 낡은 서술

### C1. [CONTRADICTED, 작업 트리 미커밋] 4090 출시 게이트에 라이선스 단계가 없다

- 위치: `src/pages/articles/hw/modded-rtx4090-moe-serving/ReleaseGate.tsx:24`(route `gpu/modded-rtx4090-moe-serving`)
- 원문: "Multi-tenant 여부나 '비공식 카드'라는 이름만으로 자동 탈락시키지 않는다. 목표 SLO와 지원 위험을 함께 통과시킨다."
- HEAD판은 오히려 이 용도를 제한했다. 쓸 수 있는 경우를 "… 약간의 처리량 손실을 감수할 수 있는 워크로드"로 한정했고, "Multi-tenant SLA가 있는 프로덕션 서빙이나 …"를 그 범위 밖에 두었다. 작업 트리에서 이 제한이 풀렸다.
- 근거 03 §D와 00 §1-3:
  - GeForce 드라이버 라이선스 §2.8: "not licensed for datacenter deployment".
  - §2.7: commercial hosting services 금지.
  - 개조 48GB 카드도 같은 드라이버를 쓰므로 적용된다(해석).
  - 1T MoE 한 복제본에 48GB 카드 16장이 필요하다(G-4).
  - 결론은 상용 서빙 제외다.
- 고칠 방향: 게이트 순서를 "라이선스·용도 → 용량 → 경로 → SLO"로 바꾼다. 이 파일은 다른 세션이 수정 중이므로 그 세션과 조율한다.

### C2. [부분 상충, 규칙화] "NVLink 없는 node면 TP 대신 PP"

- 위치: `ai/parallelism-strategy-and-placement.tsx:294`·`:304`(의사코드 note), `:322`(vLLM 문서 인용)
- 원문 L304: "NVLink 없는 node 면 TP 를 줄이고 PP 를 올립니다."
- vLLM 문서를 옮긴 것 자체는 맞다. 그러나 의사코드 규칙으로 굳히면 근거와 어긋난다.
  - 단일 PCIe 노드 8×PRO 6000에서 실제로 동작한 구성은 TP8(+DCP8)이다. P2P를 켜면 65 tok/s, 끄면 44다(근거 01 1-B).
  - "PP가 TP만큼 빠르다"는 MLX 결과는 batch=1에서만 나왔다(01 §2).
  - 04 §5-2는 TP8과 TP4×PP2를 비교 실험으로 권한다.
- 블로그 안에서도 `gpu/modded-rtx4090-moe-serving` EngineeringRecovery가 "'PCIe면 무조건 PP'라는 기본값을 두지 않는다"고 써서 서로 맞지 않는다.

### C3. [불완전, 조건 누락] "MoE는 router가 고른 expert path만 다시 읽음"

- 위치: `ai/model-vram-budgeting/MoeVramServingTradeoff.tsx:17`·`:23`·`:28`
- batch=1에서만 맞다. batch B에서 한 층이 읽는 expert 수의 기대값은 E·(1−(1−k/E)^B)다.
- K2.5(E=384, k=8)에 넣으면 다음과 같다(계산값).

  | B | 읽는 expert 수 | 비율 |
  |---|---|---|
  | 16 | 약 110 | 29% |
  | 64 | 약 284 | 74% |
  | 128 | 약 358 | 93% |

- 동시성을 높이면 step당 expert 읽기량은 거의 전체 가중치가 된다. 대신 그 양이 B개 토큰에 나뉜다.
- 따라서 "32B처럼 decode한다"는 말은 **단일 스트림 지연**에만 성립한다. 처리량을 정하는 쪽은 결국 전체 가중치 읽기와 expert GEMM 효율이다. EP가 큰 batch에서 이득인 이유(T4)도 여기서 나온다.

### C4. [블로그 내부 모순] MLA가 "읽을 때마다 up-projection"을 한다는 서술

- 위치: `ai/hybrid-attention-serving/KVFundamentals.tsx:452`, `:474`(`#mla-vs-gqa`)
  - L452: "MLA는 … 읽을 때마다 up-projection 행렬곱을 거쳐야 합니다."
  - L474: "up-projection이 decode step에 tensor core 연산을 더하므로 …".
- 같은 블로그의 다른 글은 반대로 말한다.
  - `ai/multi-head-latent-attention-mechanics#weight-absorption`(L245): absorption 뒤에는 캐시에서 latent 576 원소만 읽는다.
  - `ai/kv-cache-fundamentals#mla-vs-gqa`(19절): "MLA는 매번 전체 K/V를 펼치지 않아도 됩니다."
- 정확한 메커니즘은 다음과 같다.
  - absorption 뒤 decode는 query를 latent 공간으로 접는다.
  - 그 결과 KV head 하나(576차원)를 모든 query head가 공유하는 MQA 모양이 된다.
  - 그래서 KV 바이트당 연산이 head 수만큼 커진다.
  - 결론("bandwidth 절감이 자동으로 같은 배수로 오지 않는다")은 유지되고, 이유만 고치면 된다.
- 이 "KV head가 1개"라는 그림이 T6(TP로 나눌 수 없어 복제됨)의 직접 원인이다. 함께 고치면 좋다.

### C5. [낡은 기준값, 경미] 예시 SLO가 에이전트 기준에 미달한다

- 위치: `ai/serving-benchmark-methodology.tsx:286` 예시 SLO "P95 TTFT ≤ 1.5 s, P99 ITL ≤ 80 ms"
- 위치: `ai/serving-latency-metrics-and-slo` 14절 "간격의 P99≤80ms"
- 예시로는 문제가 없다. 다만 80 ms는 12.5 tok/s로, MLPerf R1 Server 기준과 같다. 근거 02 §1.2·§6은 이 값이 AA Tier 1(P25 ≥ 20 tok/s)과 시장 최저가 공급자보다 느려 에이전트 SLO로는 부적합하다고 본다.
- 고칠 방향: 각주 한 줄로 "에이전트 기준은 N3 참조"를 붙인다.

### C6. [보강 필요, 상충은 아님] DeepEP를 다루면서 NVLink 조건을 빠뜨렸다

- 위치: `ai/expert-parallelism-moe-systems#comparison`
- DeepEP V2.5 API를 소개하지만 "NVLink for intranode", normal 모드에 NVLink가 필수라는 조건(#216), 8×PCIe에서 init이 실패한 보고(#584 OPEN)가 없다.
- 이대로면 PCIe 노드 독자가 DeepEP를 선택지로 오해할 수 있다.

### 근거와 정합함을 확인한 서술 (수정 불필요)

- `ai/own-vs-rent-inference-capacity#what-moves-it`: 전력 5~15%, 가동률이 결정 변수.
- `ai/inference-cost-and-capacity-planning#tier-mix`: 405B BF16이 H100 8장에 들어가지 않아 16장.
- `ai/kimi-k3-architecture`: 69 KDA + 24 MLA = 93층.
- `ai/multi-head-latent-attention-mechanics`: 512+64 = 576. DeepSeek-V3·K2.5 config와 같은 차원이다. 01 §6에서 hidden 7168과 61층을 확인했다.

## 3. 편집 계획

원칙은 두 가지다.

- 부분 커버된 것은 기존 정본 절을 보강한다.
- 아키텍처 교차 종합처럼 정본이 없는 학습 단위만 새 글로 만든다.

수치에는 계약서 §2.2.1의 주장 등급을 붙인다.

| 등급 | 해당 근거 |
|---|---|
| 공식 artifact | config, 모델카드, 제품 페이지 |
| 독립 평가 | AA-AgentPerf |
| 현장 경험 | rtx6kpro 위키, 디스코드 기반. environment fingerprint 일부 누락 |
| 추정 | 이 문서의 [EST] |

### 3.1 기존 글 보강 (절 단위)

| # | 위치 | 추가 내용 |
|---|---|---|
| A1 | `ai/model-vram-budgeting#moe-vram-serving-tradeoff` | ① 식을 `bytes/GPU/token = P_active·b ÷ TP`와 `t ≥ bytes/BW_GPU`로 확장한다. ② K2.5 실례: routed INT4 약 11 GB, 그리고 BF16인 attention·shared expert·lm_head 약 20 GB를 더해 약 30 GB/token[EST]. ÷8은 약 3.9 GB, ÷1.6 TB/s는 약 2.4 ms이므로 단일 스트림 상한은 약 400 tok/s[EST]다. 실측 65~101 tok/s와의 차이는 T2로 넘긴다. ③ C3의 batch 합집합 식과 표를 넣는다. "capacity는 1T, 단일 스트림 bandwidth는 약 32B" 대비를 그대로 쓴다 |
| A2 | `ai/tensor-and-pipeline-parallel-inference#decode-impact` | NVLink 70B 사례 옆에 "PCIe 노드 + MoE 61층" 열을 둔다. 토큰당 all-reduce는 2×61 = 122회다. 실측 기준점(현장 경험)은 P2P on 65 / off 44 tok/s, 즉 15.4 / 22.7 ms/token이다. 차이 7.3 ms ÷ 122를 계산하면 P2P를 끌 때 collective당 약 60 μs가 늘어난다[EST, 전부 통신 탓으로 가정]. Turin 65 / Genoa 32는 통제된 A/B가 아니라는 표시와 함께 쓴다. DCP를 켜면 층마다 attention collective가 하나 더 붙는다는 점(90→65)도 언급한다. vLLM 코드로 재확인이 필요하다 |
| A3 | `ai/tensor-and-pipeline-parallel-inference#pipeline-parallel` | MoE decode 전송량은 7168×2 B = 14 KiB/token/경계다. 2,000 tok/s면 28.7 MB/s, 약 0.23 Gbps다. 그래서 노드를 넘는 PP는 100GbE로도 대역폭이 충분하지만, 늘어나는 것은 용량(VRAM)이지 속도가 아니다. MLX PP4 14.49 대 TP4 14.82가 batch=1이라는 반례를 한 줄 붙인다 |
| A4 | `ai/parallelism-strategy-and-placement#procedure` | 의사코드에 PCIe 분기를 추가한다(C2 해소). "모델이 PCIe 한 노드에 들어가면 노드 안 TP + P2P 검증(+MLA면 DCP), PP는 노드를 넘을 때만"으로 쓰고, "TP8 대 TP4×PP2를 실측 비교"를 덧붙인다. `g_min`의 KV 예산 K에 "MLA는 TP rank마다 복제"를 반영한다 |
| A5 | `ai/parallelism-strategy-and-placement#fabric-tiers` | TermBreakdown에 행 두 개를 추가한다. PCIe Gen5 x16(약 63 GB/s/방향 raw, PIX 대 SYS 경로 차이)과 400G RoCE다. replica를 노드에 맞추는 원칙(00 §5)과 연결한다 |
| A6 | `ai/expert-parallelism-moe-systems#comparison`·`#limits` | all2all 백엔드 매트릭스(04 §1 L53~58)를 넣는다(C6). DeepEP normal은 NVLink 필수, LL은 NVSHMEM/IBGDA, pplx는 제거, `allgather_reducescatter`는 DP 크기에 비례해 트래픽이 는다. wide-EP 검증 장비는 H200/B200/GB200뿐이다. "EP가 이득인 조건": wide-EP 2.2k tok/s/GPU는 rank당 256 동시, 요청당 8.6 tok/s였다. C3의 합집합 효과로 큰 batch에서 expert GEMM이 채워질 때만 이득이다 |
| A7 | `ai/kv-cache-fundamentals#parallel-budget` | GQA 문장 다음에 MLA 한 단락을 둔다. latent KV는 head 1개 모양이라 TP로 나뉘지 않고 rank마다 복제된다. 61×576×2 B = 70,272 B ≈ 68.6 KiB/token. N2로 링크한다 |
| A8 | `ai/tensor-and-pipeline-parallel-inference#sequence-context-parallel` | 이미 있는 "decode에서는 KV를 나눠 둔 채 부분 attention 결과만 모으는 쪽" 문장에 이름(decode context parallel, DCP)과 N2 링크를 붙인다 |
| A9 | `ai/hybrid-attention-serving#mla-vs-gqa`(KVFundamentals L444~) | C4대로 absorption 메커니즘을 바로잡는다. "읽을 때마다 up-projection"을 "query를 latent로 접어 576차원 공유 KV head 하나를 읽는 MQA형 계산, 바이트당 연산이 head 수만큼 증가"로 바꾼다. MLA mechanics 글로 링크한다 |
| A10 | `ai/serving-latency-metrics-and-slo#throughput` | 가정 표 아래에 실측 앵커를 둔다(현장 경험). 8×PRO 6000, K2.5, 동시 100×40K에서 P2P off 약 900 tok/s(요청당 약 9), P2P on 약 600(요청당 약 6). K2.6 DCP8 32K C64는 742, 요청당 11.6. "고동시성 최적값과 저지연 최적값의 설정이 반대"(P2P on/off)라는 점을 한 줄 쓴다 |
| A11 | `ai/serving-benchmark-methodology#load` | 에이전트 부하는 trace 재생과 "최대 동시 에이전트"를 지표로 쓴다는 단락을 넣고 N3로 링크한다. C5 각주를 붙인다 |
| A12 | `ai/prefix-caching-radix-attention#eviction` | X/Y 교대 축소판 뒤에 실측을 둔다. 동시 15→20에서 적중률 98.85%→16.78%, 속도 30.08→16.96 tok/s/req(arXiv 2605.26297, Qwen3.6-27B/H100). Copilot 턴 경계는 55%다. N3로 링크한다 |
| A13 | `ai/serving-memory-admission-and-preemption#preemption-modes` 또는 `#long-context-isolation` | swap 다음 단계로 계층형 KV 오프로드(LMCache, 호스트 DRAM)를 소개한다. 세션당 KV는 K2.5 FP8 100K에서 약 3.8 GB(Mooncake)이고, 70 KB×100K÷2 ≈ 3.5 GB와 교차 검증된다. 1.5 TB 호스트 RAM 사이징 근거로 쓴다 |
| A14 | `ai/own-vs-rent-inference-capacity#unit-mismatch` | 에이전트 부하에서 출력 1M당 API 실비용을 계산한다(30:1·90%, 100:1·95%). 역산표 "API와 같아지는 최대 시스템 가격"(00 §4)을 넣는다. "캐시 적중 입력을 자체 비용 0으로 둔 것은 자체 호스팅에 낙관적"이라는 한계를 명시한다 |
| A15 | `ai/inference-cost-and-capacity-planning#capacity` | 분모는 피크 tok/s가 아니라 SLO를 지키는 처리량이라는 점(근거 00 §1-2)을 한 줄 넣고 N3로 링크한다 |
| A16 | `gpu/modded-rtx4090-moe-serving` ReleaseGate | C1. 게이트 첫 단계에 라이선스와 용도를 둔다(EULA §2.7·§2.8). 1T 규모 사이징에는 48GB 카드 16장, 2노드가 필요하다는 줄을 추가한다. **다른 세션 작업 중, 조율 필요** |
| A17 | `hw/network/Interconnect`(P2P 절) 또는 `hw/network/RDMA` "GPUDirect RDMA도 topology가 조건이다" | PRO 6000 사례: NVLink 없음, P2P와 GPUDirect RDMA는 공식 문서에 명시 없음. 확인 명령은 `ib_write_bw --use_cuda`, PCIe에서는 `NCCL_NET_GDR_READ=1`을 명시한다. N4로 링크한다. **작업 트리 수정 중, 조율 필요** |
| A18 | `ai/kimi-k3-architecture`(또는 `kimi-k3-sequence-mixer`) | 서빙 함의 두 줄. ① KV는 MLA 24층에만 쌓이고 KDA 69층은 시퀀스당 고정 state다. ② 공식 MXFP4 1,561 GB는 PRO 6000 16장, TP16/DCP16이 필요하다. 단일 시퀀스 56~155 tok/s다. Gated MLA의 latent 차원은 미확인이라 토큰당 KB는 계산하지 않는다 |
| A19 | `ai/qwen36-hybrid-runtime#hybrid-runtime` | "TP/PP shard 제외" 가정 옆에 TP에서 DeltaNet state가 head 축으로 나뉘는지 여부를 둔다. 미확인이므로 코드 확인이 필요하다. N1로 링크한다 |

### 3.2 새 글 제안 (우선순위순)

#### N2. `ai/mla-kv-replication-and-decode-context-parallel` (최우선)

- **제목안**: "MLA KV는 GPU를 늘려도 줄지 않습니다: TP 복제와 decode context parallel"
- **범위**:
  - GQA는 KV head를 TP rank에 나눈다(H_KV ≥ TP까지). MLA는 576차원 latent 하나라 rank마다 같은 KV가 통째로 있다.
  - 그래서 8장을 써도 KV 용량은 한 장 몫이다.
  - 수치: 61×576×2 B ≈ 70 KB/token. 8×96 GB에서 가중치 595 GB를 빼면 장당 KV 풀은 약 14~16 GB다.
  - BF16·DCP1은 약 19만 토큰(200K 에이전트 약 1개)이다. FP8·DCP8은 3,621,504 토큰(약 18개)이다. 19배는 DCP 8배 × FP8 2배에 grain 차이를 더한 값으로 검산한다.
  - DCP는 시퀀스 축으로 KV를 나누고, 층마다 부분 attention의 LSE를 병합하는 collective가 추가된다.
  - 대가: 단일 스트림이 90에서 65 tok/s로 떨어진다. 출력 drift 버그 #41623이 OPEN이다. DCP 없이 150K에서는 6~7 tok/s로 붕괴한다.
  - 하이브리드(KDA·DeltaNet: KV는 full-attention 층만, 시퀀스당 고정 state)와 SWA(창 밖 block 회수 여부가 runtime에 따라 다름)를 대조한다.
- **절 개요**:
  - S. 8장인데 KV는 1장 몫인 이유
  - B. 입력: 모델 config·TP·DCP·KV dtype / 출력: 토큰 용량과 동시 에이전트 수
  - 0. 작은 수치 사례: 4 head GQA, TP4 대 MLA, TP4
  - 1. 그림: rank별 KV 배치
  - 2. 왜 MLA는 쪼갤 수 없나(absorption → MQA형)
  - 3. 이름: TP 복제, DCP, FP8 KV
  - 4. K2.5 한 요청 추적: 70 KB×200K = 14 GB
  - 5·6. 원문: vLLM `supports_dcp`(TRITON_MLA), PR #34795, rtx6kpro 표
  - 7. 한계: drift 버그, 단일 스트림 손실, 하이브리드·SWA의 다른 해법
  - 복습
- **Viz**: rank × 시퀀스 블록 격자. TP만 썼을 때 8칸 복제, DCP8에서 8칸 분할. 단계 재생형이다.
- **링크**:
  - 받는 쪽(들어오는 링크): `kv-cache-fundamentals#parallel-budget`(A7), `multi-head-latent-attention-mechanics#boundary`, `tensor-and-pipeline-parallel-inference#sequence-context-parallel`(A8), `hybrid-attention-serving#mla-vs-gqa`(A9), `parallelism-strategy-and-placement#procedure`(A4)
  - 나가는 쪽: `kv-cache-quantization`, `qwen36-hybrid-runtime`, `sliding-window-kv-and-attention-sinks`, N1
- **커리큘럼**: `ai-llm-serving`에서 `parallelism-strategy-and-placement` 바로 뒤. `ParallelExecutionSeriesLocator` STEPS에도 "KV 배치" 단계로 추가를 검토한다.
- **KG**: 새 concept 두 개.
  - `mla-kv-tp-replication`: `contrasts` `gqa`, `constrains` `llm-serving-capacity`
  - `decode-context-parallel`: `extends` `sequence-and-context-parallel-attention`

#### N1. `ai/serving-architecture-matrix` (T1·T10 종합)

- **제목안**: "모델 구조가 서빙 장비를 정합니다: dense·MoE·MLA·하이브리드·sliding window를 한 표로"
- **범위**: 같은 다섯 가지 질문을 아키텍처마다 수치로 답한다.
  1. 가중치 VRAM
  2. 토큰당 읽는 바이트(÷TP, batch 1 대 batch B)
  3. 에이전트 1개(200K)의 KV 또는 state
  4. 병렬화 선택: TP head 나누어떨어짐, EP가 의미 있는 조건, DCP 필요성
  5. 네트워크 요구: 토큰당 collective 수, PP 경계 바이트, EP all-to-all
- **행**:
  - Llama 3.1 405B: dense+GQA. 126층, KV 8 head → 약 504 KiB/token BF16, TP8에서 head 1개씩.
  - Qwen3-235B-A22B: MoE+GQA. 94층, KV 4 head → 약 188 KiB/token. TP8이면 KV가 2배 복제된다.
  - DeepSeek V3/R1, Kimi K2.5: MoE+MLA. 약 70 KB/token, TP에서 전부 복제.
  - Kimi K3: MoE+KDA/MLA. KV는 24층만, KDA는 고정 state.
  - Qwen3.6 계열과 Qwen3-Next: hybrid DeltaNet.
  - gpt-oss / Gemma: SWA.
  - 근거 00~04에 없는 config 값(405B, Qwen3, Qwen3-Next, gpt-oss)은 **작성 시 config.json으로 재확인**한다.
- **절 개요**:
  - S. 같은 8장에서 어떤 모델은 18 에이전트, 어떤 모델은 1 에이전트인 이유
  - B. 다섯 질문
  - 0. K2.5 한 행 계산(A1 숫자 재사용)
  - 1~4. 질문별로 행 채우기. 각 열의 "왜"를 한 단락씩.
  - 5·6. config 원문 발췌
  - 7. 표가 말하지 않는 것: kernel 지원 매트릭스(SM120의 NVFP4 TP8 #48898, CUTLASS FP8 #47990), spec decode 수락률
  - 복습
- **Viz**: 행(아키텍처) × 열(다섯 질문) 비교 Viz. 계약서 §4의 "같은 비교축" 요건을 지킨다. 한 열을 고르면 그 열의 계산 단계를 펼친다.
- **링크**: `model-vram-budgeting`, `mixture-of-experts`, `kv-cache-fundamentals`, `hybrid-attention-serving`, `kimi-k3-architecture`, `qwen36-hybrid-architecture`, `sliding-window-kv-and-attention-sinks`, `expert-parallelism-moe-systems`, N2, N4가 이 글로 들어오고 이 글에서 나간다.
- **커리큘럼**: `ai-llm-serving`에서 N2 다음, `disaggregated-prefill-decode-serving` 앞.

#### N3. `ai/agent-serving-slo-and-capacity` (T5·T7)

- **제목안**: "에이전트 서빙의 용량은 동시 에이전트 수로 잽니다: P25 속도, 캐시 적중, KV 상주"
- **범위**:
  - 총 tok/s와 요청당 속도가 다르다는 점: 900@100 = 9, wide-EP 2.2k/GPU = 요청당 8.6.
  - AA-AgentPerf 방법: OpenCode trace 재생, 입력 평균 약 27K, 출력 중앙 약 150, P25 출력 속도, P95 TTFT, 최대 동시 에이전트(지수 증가 + 이진 탐색).
  - 티어 20/10s, 60/5s, 180/3s. NVIDIA 블로그의 30/100/300은 오기다.
  - 결과: H200×8 11, B300×8 144, GB300 1,840/32. AgentX P90 ≥ 50도 소개하되 정의가 공개되지 않았다는 점을 쓴다.
  - MLPerf 80 ms = 12.5 tok/s가 부적합한 이유.
  - 워크로드 모양: 입력:출력 100~131:1(공개), 448:1(자체 Claude Code 887 세션). 적중률 94~99%. LLM이 실행 시간의 71~98%.
  - KV 용량을 넘으면 적중률이 98%에서 17%로 붕괴한다. 대책은 호스트 오프로드(LMCache)와 prefix 인지 라우팅(llm-d EPP)이다.
  - 권장 SLO: 기본 P25 ≥ 30, TTFT P95 ≤ 10 s. 프리미엄 60/5 s.
- **절 개요**:
  - S. 900 tok/s인데 에이전트 하나는 9 tok/s
  - B. 입력은 trace와 SLO, 출력은 최대 동시 에이전트
  - 0. 동시 1/8/32 표 재사용
  - 2. 왜 P25인가: 출력이 짧은 요청이 많아서
  - 3. 이름: AgentPerf, 티어
  - 4. 측정 절차 의사코드(AlgorithmBlock)
  - 5·6. AA 원문과 임베디드 JSON
  - 6. 적중률 붕괴 실측
  - 7. 한계: AA 단계 간 캐시 차단, 실제 턴 간 지연 5.2 s 대 시뮬레이션 1 s
  - 복습
- **Viz**: 동시성 축 sweep 애니메이션. 동시성이 오르면 총 tok/s는 오르고 P25는 내려가며, KV 상한을 넘는 순간 적중률이 꺾인다.
- **링크**:
  - 받는 쪽: `serving-latency-metrics-and-slo#throughput`(A10), `serving-benchmark-methodology#load`(A11), `prefix-caching-radix-attention#eviction`(A12), `serving-memory-admission-and-preemption`(A13), `inference-cost-and-capacity-planning#capacity`(A15)
  - 나가는 쪽: `own-vs-rent-inference-capacity`, `onprem-k8s-inference-platform`(TwoLevelScheduling의 EPP prefix 라우팅), N2
- **커리큘럼**: `ai-llm-serving`에서 `serving-benchmark-methodology` 뒤, `inference-cost-and-capacity-planning` 앞.

#### N4. `gpu/pcie-blackwell-moe-node-build` (T9·T2 하드웨어; 파일은 `hw/` 관례를 따르고 카탈로그는 `src/content/gpu/articlesHw.ts`)

- **제목안**: "NVLink 없는 Blackwell 8장으로 1T MoE 노드를 짤 때: PCIe 스위치, CPU, P2P, RDMA, 라이선스"
- **범위**:
  - RTX PRO 6000 Server Edition: 1,597 GB/s, 600 W(450 W 캡 SKU 있음), NVLink 없음.
  - K2.5 INT4 595 GB가 768 GB에 들어간다.
  - 토폴로지: dual-root PCIe 스위치(예: SYS-522GA-NRT)와 ConnectX-8 내장 Gen6 스위치(GPU:NIC = 2:1). PIX와 SYS 경로가 TP all-reduce에 주는 영향.
  - 듀얼 소켓, 소켓당 12채널 DDR5-6400, 1.5 TB 이상. Turin 65 대 Genoa 32(통제 안 됨). xGMI를 16 GB/s로 오인식하는 버그를 토폴로지 XML로 우회한다.
  - P2P와 NCCL 설정 표: 단일 배치용 `NCCL_P2P_LEVEL=SYS`와 고동시성용 `NCCL_P2P_DISABLE=1`이 서로 반대다. IOMMU off, `uvm_disable_hmm=1`.
  - GPUDirect RDMA는 공식 문서에 명시가 없다. 확인 명령은 `ib_write_bw --use_cuda`, `NCCL_NET_GDR_READ=1`.
  - 확장은 노드당 복제본 + EPP로 한다. 노드 간 wide-EP는 보류한다(T4). 노드 간 PP는 대역폭이 거의 들지 않는다(T3).
  - 4090과 개조 48GB를 제외하는 이유: EULA §2.7·§2.8, P2P 없음, 16장 필요.
- **절 개요**:
  - S
  - B. 입력은 모델, 출력은 BOM과 검증 명령
  - 0. 595 GB가 768 GB에 들어가고 KV 여유가 남는 계산
  - 1. 토폴로지 그림
  - 2. 왜 스위치·CPU·P2P가 속도를 2~3배 가르나
  - 3. 이름
  - 4. 노드 수락 절차(AlgorithmBlock: topo → nvbandwidth → nccl-tests → `ib_write_bw` → 단일 스트림·동시성 벤치)
  - 5·6. 제품 페이지, 포럼, EULA 원문
  - 7. 한계: 미측정, 임대 실측 먼저(RunPod 약 $20/h)
  - 복습
- **링크**:
  - 받는 쪽: `gpu/modded-rtx4090-moe-serving`(A16), `hw/network/Interconnect`·`RDMA`(A17), `hw/server-cpu-lineup-comparison#…MemoryChannels`, `parallelism-strategy#fabric-tiers`(A5)
  - 나가는 쪽: N1, N2, `own-vs-rent-inference-capacity`
- **커리큘럼**: `hw-ai-cluster`에서 `ai-cluster-software-compatibility` 뒤. SM120 지원 매트릭스와 이어진다. 블로그 다른 글들이 B300 위주라 PCIe 대안 노드로 대비된다.

### 3.3 새 글·절 추가 시 지켜야 할 블로그 규칙 (`docs/blog-rewrite-contract.md` 발췌)

- **절 순서(§1.3 teach-system)**: `S → B → 0 작은 수치 사례 → 1 이름 없는 그림 → 2 왜 → 3 이름 → 4 한 경로 추적 → 5·6 원문 실물 → 7 한계 → 복습 질문`.
  - S와 B가 맨 앞이다.
  - 글의 앞 1/5에는 부품 이름을 쓰지 않는다.
  - 한 절에 새 용어는 3개까지다.
  - 끝은 `(답: N절)`이 달린 예측 질문 2~3개로 맺는다.
  - 기존 글은 `<section id=… data-teach-level=…>` 형식이다. 같은 형식으로 절을 끼워 넣는다.
- **수식(§3)**: `ExplainedFormula`의 question·idea·formula·annotatedFormula·operations·terms·assumptions·interpretation을 채운다. operations에는 실제 기호를 쓴다. 다단계 계산은 `CalculationWalkthrough`로 단위와 반복 이유를 먼저 밝힌다.
- **주장 등급(§2.2.1)**: rtx6kpro·디스코드 수치는 "현장 경험"이고 environment fingerprint가 일부 비어 있다. "sweet spot"이나 보편 배수로 쓰지 말고 조건을 붙여 인용한다. AA는 "독립 평가", vendor 블로그는 "공식/자기보고"다.
- **Viz(§4, viz-design-standard.md)**: 한 Viz에는 메커니즘 하나만 담는다. 시간 순서가 있으면 재생·정지·단계 선택을 넣고 `prefers-reduced-motion`을 지원한다. 레거시 Viz를 재사용하지 않는다. 390px과 1440px에서 직접 확인한다. 절차형 개념에는 `AlgorithmBlock`과 단계 실행 Viz가 필요하다.
- **등록**: `src/content/registrations/<slug>.ts`에 CONCEPTS, edges, learning contract, evidence, editorial boundary를 쓰고 `node scripts/merge-registrations.mjs …`로 정본 파일에 병합한다. 정본 파일은 `knowledge-graph.ts`, `article-learning.ts`, `article-evidence.ts`, `editorial-ownership.ts`다. 형식은 `docs/coverage-batch-playbook.md`를 따른다.
  - 카탈로그: AI 글은 `src/content/ai/articlesVLLM.ts`(slug, title, subcategory `ai-llm-serving`, sections[], component). HW 글은 `src/content/gpu/articlesHw.ts`.
  - 커리큘럼: `src/content/article-reading-curricula.ts`의 `ai-llm-serving`과 `hw-ai-cluster`.
  - 시리즈 내비: `src/pages/articles/ai/shared/ParallelExecutionSeriesLocator.tsx`의 STEPS.
- **KG(§6.1)**: `introducedHere` 개념마다 owner는 정확히 한 글이다. 새 개념마다 의미 있는 edge가 하나 이상 있어야 한다. 기존 node(`sequence-and-context-parallel-attention`, `mla-latent-kv-compression` → `/cs/ai/motif-3-architecture#gdla`, `decode-memory-bound-regime`, `expert-parallelism`, `slo-serving-goodput`, `prefix-cache-hit-rate`, `moe-total-active-parameter-ledger`)는 재사용하고, 정의를 복제하지 않는다.
- **href**: 본문 링크는 `/cs/ai/...` 공개 href와 `Link`를 쓴다. route key(`ai/...`)는 데이터 키에만 쓴다.
- **검사(§8)**:
  - `npm run audit:learning -- --strict --require-registration <category/slug>`
  - `npm run audit:viz -- --strict <변경 Viz>`
  - `npm run audit:pseudocode -- --strict`
  - `npm run audit:graph -- --strict`
  - `npm run audit:topology`(새 글 생성 시 topology decision 기록)
  - `npm run build`
  - Playwright 1440/390
  - 마무리로 `humanize-korean → ko-natural`

### 3.4 권장 순서

1. **C4·A9**: 사실 오류이고 수정 범위가 작다.
2. **N2와 A7·A8·A4**: 이 근거 묶음의 핵심 발견이고, 블로그에는 완전히 공백이다.
3. **A1·A2·A3·C3**: 토큰당 장부. N1이 이 숫자를 재사용한다.
4. **N1**: 아키텍처 매트릭스.
5. **N3와 A10~A15**
6. **A6·C6**
7. **N4와 A16·A17·C1**: `hw/` 쪽은 다른 세션의 미커밋 작업이 끝난 뒤 진행한다.

수치 중 근거 00~04에 없는 것은 모두 작성 시 원문으로 재확인한다. 대상은 다음과 같다.

- 405B, Qwen3-235B, Qwen3-Next, gpt-oss의 config 값.
- K2.5 토큰당 약 30 GB 추정의 tensor별 분해.
- DCP가 층마다 추가하는 collective의 정확한 종류.
- 하이브리드 state의 TP 분할 여부.
