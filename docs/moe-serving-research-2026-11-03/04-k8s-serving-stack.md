# 04. 1T급 MoE 서빙 스택 조사: RTX PRO 6000(SM120)·RTX 4090(SM89), k8s 다중 노드

- 조사일: 2026-11-03
- 방식: GitHub 소스는 태그 기준으로 읽었다. 릴리스 노트, 공식 문서, 이슈, HF 모델 카드와 API도 확인했다.
- 실행 여부: **하드웨어에서 실행한 것은 하나도 없다.**
- 초안 YAML: [`k8s-drafts/`](k8s-drafts/README.md). 클러스터에 적용하지 않았다.

상태 표기는 다음과 같다.

| 표기 | 뜻 |
|---|---|
| **CODE** | 태그의 소스에서 확인 |
| **DOC** | 공식 문서·README·릴리스 노트에 명시 |
| **USER-OK** | 사용자 이슈·포럼에서 동작 보고 |
| **BROKEN** | 실패 보고 |
| **?** | 확인 못 함 |

## 기준 버전 (2026-11-03 `gh api …/releases` 조회)

| 구성요소 | 최신 | 이 저장소 고정값 |
|---|---|---|
| vLLM | v0.32.0 (2026-10-18). v0.33.0rc3(2026-11-02)은 pre-release인데 `gh release list`에는 Latest로 표시된다 | 0.27.1 |
| SGLang | v0.5.22 (2026-10-19) | – |
| llm-d | v1.0.0 (2026-10-20) | – |
| llm-d router | v1.0.0 (2026-10-16). 저장소 이름이 `llm-d/llm-d-inference-scheduler`에서 `llm-d/llm-d-router`로 바뀌었다 | v0.11.0 |
| GAIE | v1.6.2 (2026-09-17) | v1.6.2 |
| LeaderWorkerSet | v1.0.0 (2026-10-16) | – |
| Kueue | v0.20.4 (2026-10-29) | 0.20.4 |
| Grove | v0.2.0-beta1 (2026-10-30) | – |
| KAI Scheduler | v0.18.7 (2026-11-02) | – |
| GPU Operator | v26.7.2 (2026-10-14) | 26.7.2 |
| Network Operator | v26.7.1 (2026-10-16). v26.10.0-rc.5는 pre-release | – |
| NIXL | v1.5.2 (2026-10-29) | – |
| FlashInfer | v0.7.2.post1 (2026-10-23) | – |
| DeepEP | 태그는 v1.2.1(2025-09-16)이 마지막이다. main은 V2.5(2026-10-21 커밋) | – |
| dra-driver-nvidia-gpu | v0.5.1 (2026-10-12) | – |

## 지원 매트릭스

vLLM 행은 v0.32.0(커밋 5df63a7) 기준이고 SGLang 행은 v0.5.22 기준이다. 별도 표기가 없으면 이슈 번호는 해당 저장소의 이슈다.

| 기능 | SM120 (RTX PRO 6000) | SM89 (RTX 4090) | 상태 | 출처 |
|---|---|---|---|---|
| **Kimi K2.5 네이티브 INT4 W4A16 MoE** (compressed-tensors, group 32) | Marlin MoE가 자동 선택된다. 빌드 아키텍처는 `MARLIN_MOE_ARCHS "8.0+PTX;12.0f"`이다 | Marlin MoE | CODE. SM120은 USER-OK이지만 커스텀 이미지를 썼다(vllm#40608, Kimi-K2.6, 8×RTX 6000 Pro, TP8) | vLLM v0.32.0 `oracle/int_wna16.py`, CMakeLists; https://github.com/vllm-project/vllm/issues/40608 |
| 같은 기능, SGLang | `CompressedTensorsWNA16MarlinMoEMethod` | 같음 | CODE. SM120 크래시는 #14322에서 shared-mem 타일을 고쳐 해결됐다 | SGLang v0.5.22 `compressed_tensors.py`, `extend_attention.py:97`; https://github.com/sgl-project/sglang/issues/14322 |
| **NVFP4 MoE W4A4** | 기본은 FLASHINFER_CUTLASS다. TRTLLM-gen과 CuteDSL은 SM100 전용이다 | Marlin W4A16 fallback(weight-only) | CODE·DOC(v0.30 #55170). BROKEN: #48898(OPEN) TP8에서 per-rank K가 32 정렬이 아니면 torch.compile 아래 출력이 깨진다 | `oracle/nvfp4.py`; https://github.com/vllm-project/vllm/issues/48898 |
| NVFP4 weight-only(W4A16) | 여전히 Marlin | Marlin | CODE. #31085 OPEN, 수정 PR #47577은 머지 없이 닫혔다 | https://github.com/vllm-project/vllm/issues/31085 |
| **FP8 block-scaled 128×128** (DeepSeek R1/V3) | MoE와 linear 모두 vLLM 포크 DeepGEMM의 SM120 포트가 기본이다(`VLLM_USE_DEEP_GEMM=1`) | linear는 Marlin FP8 weight-only, MoE는 Triton | CODE·DOC(v0.30 #56876, v0.31 #57218). BROKEN: #47990(OPEN, v0.31.0에서 재현) SM120 CUTLASS blockwise가 N=576(`kv_a_proj_with_mqa`)에서 실패한다. DeepGEMM을 끄면 이 문제를 밟는다. **v0.32에서 R1/V3 FP8이 SM120에서 동작한 보고는 찾지 못했다** | https://github.com/vllm-project/vllm/issues/47990, https://github.com/vllm-project/vllm/issues/58241 (SM89) |
| **MLA attention** (dense: V3/R1/Kimi) | TRITON_MLA만 쓸 수 있다. FlashMLA는 major 9·10, FLASH_ATTN_MLA는 9, FLASHINFER_MLA·CUTLASS_MLA는 10만 지원한다 | TRITON_MLA | CODE | vLLM `platforms/cuda.py`: `major == 12 -> [TRITON_MLA, FLASHINFER_MLA_SPARSE_SM120]` |
| MLA, SGLang | 기본 `triton`이다. 문서의 "Blackwell: flashinfer"는 SM100에만 해당한다. `trtllm_mla`는 SM120에서 실패한다 | `triton` | CODE. BROKEN: SGLang #24633. FlashInfer 메인테이너의 답: "not supported on SM120… no plans" | https://github.com/sgl-project/sglang/issues/24633 |
| Sparse MLA (DeepSeek V3.2/V4 계열) | FLASHINFER_MLA_SPARSE_SM120. `index_topk=2048`과 BF16이 필요하다. V4.1은 page 32에서 커널이 없다 | 경로 없음 | CODE. BROKEN: #59203, #56892, #52938(모두 OPEN) | https://github.com/vllm-project/vllm/issues/59203, https://github.com/vllm-project/vllm/issues/54059 |
| **DCP** (`-dcp`) | TRITON_MLA가 `supports_dcp=True`를 선언한다. sparse-SM120 impl은 False다 | 같은 코드 경로지만 ? | CODE. USER-OK: #40608에서 DCP 4·8 사용. BROKEN: #41623(OPEN) 출력 drift | https://github.com/vllm-project/vllm/issues/41623 |
| **EP all2all `allgather_reducescatter`** | 동작(NCCL 기반) | 동작 | DOC: "works with any EP+DP configuration". 기본값이다 | vLLM v0.32.0 `docs/serving/expert_parallel_deployment.md`, `config/parallel.py:219` |
| EP `deepep_high_throughput`·`deepep_v2` | **PCIe 전용 노드에서는 불가**. normal 모드는 NVLink가 필수다 | 불가(P2P 없음) | DOC: DeepEP README "NVLink for intranode". 메인테이너(#216): "For normal mode, NVLink is a must". BROKEN: DeepEP#584(OPEN) 8×PCIe에서 init 실패 | https://github.com/deepseek-ai/DeepEP/issues/216, https://github.com/deepseek-ai/DeepEP/issues/584 |
| EP `deepep_low_latency` | NVSHMEM/IBGDA가 필요하다. 순수 PCIe에서는 동작 보고가 있지만 allgather보다 느리다(H800 PCIe, #462). SM120 보고는 없다 | 불가 | DOC·USER-OK(H800)·? | https://github.com/deepseek-ai/DeepEP/issues/462 |
| DeepEP `hybrid-ep` 브랜치(PCIe normal 모드) | 모든 트래픽을 RDMA NIC으로 보낸다. H20(NVLink를 끈 상태)에서만 시험했다 | – | DOC. SM120은 ? | https://github.com/deepseek-ai/DeepEP/pull/375 |
| EP `pplx` | vLLM에서 제거됐다(`allgather_reducescatter`로 fallback). pplx-kernels 자체도 deprecated다 | 같음 | CODE·DOC. BROKEN: pplx-kernels#35 4090/5090 PCIe | https://github.com/perplexityai/pplx-kernels |
| EP `nixl_ep`, `mori`, `moonep`, `flashinfer_nvlink_*` | nixl_ep은 RDMA와 NVLink 경로만 문서화돼 있다. flashinfer_nvlink와 moonep은 NVLink 전용이다 | 불가 | DOC·? | vLLM `expert_parallel_deployment.md`; https://github.com/ai-dynamo/nixl (`examples/device/ep`) |
| **P/D KV 전송 NIXL(UCX)** | RoCE: DOC. TCP+`cuda_copy` 호스트 스테이징은 정상 동작한 보고가 있다 | TCP·호스트 스테이징만 가능 | USER-OK: nixl#2512에서 `UCX_TLS=tcp,cuda_copy,self`는 정상이었다. **주의**: 같은 이슈에서 `rc`+dma-buf로 4 GiB 이상 정렬된 등록이 조용히 깨졌다. 커널 7.1 미만의 우회책은 `UCX_CUDA_COPY_DMABUF=no`다 | https://github.com/ai-dynamo/nixl/issues/2512 |
| **GPUDirect RDMA** | NVIDIA가 제품명으로 명시한 자료는 없다. GPU Operator 문서의 "data center, Quadro RTX, and RTX GPU"에 포함되는 것으로 읽힌다. 포럼 사용자 1명이 Max-Q에서 동작을 보고했다 | **불가**(GeForce) | DOC(간접)·USER-OK(약함) / DOC | https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/26.7/gpu-operator-rdma.html, https://forums.developer.nvidia.com/t/346764 |
| **PCIe P2P** | 동작은 한다. 다만 IOMMU·ACS 설정에 따라 NCCL hang과 custom all-reduce hang 보고가 있다 | 드라이버가 막아 둔다. tinygrad 패치에는 580 브랜치가 없다 | BROKEN(조건부) / DOC | https://forum.level1techs.com/t/242403, https://discuss.vllm.ai/t/2540, https://github.com/vllm-project/vllm/issues/56180 |
| **다중 노드 PP** (mp: `--nnodes/--node-rank/--master-addr/--headless`) | 동작(문서·코드) | 동작(문서·코드) | CODE: `nnodes>1`이면 mp로 강제되고 Ray에서는 거부된다. DOC: LWS 문서의 Multiprocessing 탭. BROKEN: #52071(spec decode+PP 오출력, OPEN) | vLLM v0.32.0 `arg_utils.py`, `docs/deployment/frameworks/lws.md`; https://github.com/vllm-project/vllm/issues/52071 |
| **Kimi K2.5 EAGLE3** | `lightseekorg/kimi-k2.5-eagle3-mla`(6.0 GB, HF sha 9c0c42dfe8, "vLLM >= 0.18.0"). `nvidia/Kimi-K2.5-Thinking-Eagle3`은 TRT-LLM용이다 | 같은 드래프트지만 ? | CODE: `KimiK25ForConditionalGeneration`이 SupportsEagle3를 구현한다. USER-OK: SM120 #40608(커스텀 이미지) | https://huggingface.co/lightseekorg/kimi-k2.5-eagle3-mla |
| Kimi K2.5 MTP | **없다**(`num_nextn_predict_layers: 0`) | – | CODE(HF config) | https://huggingface.co/moonshotai/Kimi-K2.5 |
| DeepSeek R1 MTP (`method: "mtp"`) | 코드 경로는 있다. SM120 R1 보고는 없다. TRITON_MLA는 DCP>1일 때 draft metadata 갱신을 건너뛴다 | ? | CODE·?. BROKEN: #65139(OPEN) **v0.33.0의 회귀**, b12x attention+MTP에서 IMA | https://github.com/vllm-project/vllm/issues/65139 |
| Kimi K2.5 비전 타워 | ViT attention assert(K2.6에서 보고) | ? | BROKEN #45847(OPEN). 텍스트만 쓸 때는 `--language-model-only`로 피한다 | https://github.com/vllm-project/vllm/issues/45847 |
| llm-d wide-EP 가이드 | 검증된 장비는 H200·B200·GB200뿐이다. `deepep_v2`와 all-to-all RDMA가 필요하다 | – | DOC: "Validated on 32×H200 … InfiniBand … and … GKE with RoCE" | https://github.com/llm-d/llm-d/tree/v1.0.0/guides/wide-ep |
| llm-d P/D (NIXL) | "NIXL works over TCP, but RDMA … highly recommended". 검증 장비는 H200이다 | – | DOC | https://github.com/llm-d/llm-d/tree/v1.0.0/guides/pd-disaggregation |

## 1. vLLM v0.32.0과 SGLang v0.5.22의 SM120·SM89 지원

### 1.1 Kimi K2.5 경로: 단일 노드에서 가장 가능성이 높다

- **체크포인트**: `moonshotai/Kimi-K2.5`(HF sha 4d01dfe033, 2026-04-30)는 safetensors 합계 **595.2 GB**다. 2026-11-03 HF API로 확인했다.
  - attention, shared expert, dense MLP는 BF16이다.
  - routed expert는 INT4 group-32 symmetric(compressed-tensors pack-quantized)이다.
- **필요한 GPU 메모리**: 8×96 GB = 768 GB다. `--gpu-memory-utilization 0.92`로 잡으면 약 707 GB가 남는다. 가중치를 빼면 KV와 activation에 약 110 GB가 남는다.
  - MLA KV는 토큰당 약 61층 × 576 × 2 B ≈ 70 KB다. 따라서 대략 100만 토큰대를 담을 수 있다.
  - 이 계산은 추정이고, 측정이 필요하다.
- **커널 경로(CODE)**:
  - MoE는 Marlin(`oracle/int_wna16.py`)이다. TRTLLM mxint4는 `family(100)` 전용이다.
  - attention은 TRITON_MLA다.
  - Machete는 Hopper 전용(`MACHETE_ARCHS "9.0a"`)이다.
  - Humming은 SM90에서만 우선 선택된다.
- **실증 근거**: vllm#40608이 가장 가깝다. Kimi-K2.6을 8×RTX 6000 Pro에서 TP8, TRITON_MLA, FP8 KV, DCP 1/4/8, eagle3로 돌렸다.
  - 이 실행은 커스텀 이미지 `voipmonitor/vllm:cu130-mtp-tuned-v3-20260423`과 패치를 썼다.
  - 이슈 본문에 "TRITON_MLA did not support full CUDA graph capture for the uniform spec-verify decode shapes"라는 기록이 있다.
  - 이 이슈는 2026-09-14에 stale로 닫혔다. 그 패치가 v0.32.0에 모두 들어갔는지는 **?**다.
- **FP8 KV**: #46721(CLOSED)에서 Kimi K2.7 FP8 KV가 SM120에서 "Out of Resource"로 실패했다. 초안은 KV dtype을 기본값으로 두었다.
- **SGLang**: v0.5.22의 Kimi-K2.5 cookbook은 ">=140GB each"를 요구하고 H200·B300·GB300·MI300X만 나열한다. RTX PRO 6000은 공식 구성에 없다(DOC).

### 1.2 DeepSeek-R1/V3 경로: 단일 노드 FP8은 메모리상 불가능에 가깝다

- **체크포인트 크기**: `deepseek-ai/DeepSeek-R1-0528`는 **688.6 GB**다. 707 GB 안에 가중치만 겨우 들어가고 KV를 둘 자리가 거의 없다.
  - 그래서 **FP8은 2노드 PP가 필요하다.**
  - `nvidia/DeepSeek-R1-0528-NVFP4`는 **423.6 GB**라 단일 노드에 들어간다.
- **FP8 커널**:
  - SM120에서는 vLLM 포크 DeepGEMM의 SM120 포트가 기본이다.
  - CUTLASS fallback은 #47990(OPEN)으로 깨져 있다. 수정 PR #47988과 #48588도 OPEN이다.
  - 이전 보고로 #26211(stale close)이 있다. 8×RTX PRO 6000에서 DeepSeek-V3.1이 `cutlass_scaled_mm`에서 실패했다.
  - SM120에서 v0.32로 R1/V3를 서빙한 보고는 **없다**. 최근 SM120 이슈는 모두 V4·V4.1에 관한 것이다.
- **NVFP4 커널**: FLASHINFER_CUTLASS가 선택된다. TP8 정렬 버그 #48898(OPEN)이 있어 TP8 대신 TP4×PP2나 EP 구성을 함께 비교해야 한다.
- **SGLang**: FP8 MoE는 a2a 백엔드가 deepep, mooncake, nixl일 때만 DeepGEMM을 쓴다. 그 외에는 Triton으로 간다(`fp8.py:1410`).
  - SGLang에서 NVFP4 EP2가 2×RTX PRO 6000에서 IMA로 실패했다(#44291, OPEN). v0.5.22보다 새로운 nightly `20261021-c1c287a4`에서는 동작한다는 보고가 있다.

### 1.3 SM89 (RTX 4090)

- **INT4 MoE**: Kimi 네이티브 W4A16, AWQ, GPTQ 모두 Marlin MoE로 간다(CODE).
- **GGUF**: 코어에서 빠져 OOT `vllm-gguf-plugin`으로 옮겨졌다(DOC). DeepSeek와 Kimi에서 동작하는지는 ?다.
- **FP8**: SM89에는 DeepGEMM과 CUTLASS blockwise가 없다.
  - linear는 Marlin FP8로 weight-only dequant한다(#58241 OPEN, 수정 PR #61224 OPEN).
  - MoE는 Triton이다.
  - 동작은 하지만 네이티브 FP8 연산은 아니다.
- **MLA**: TRITON_MLA다. sparse MLA 경로는 Ada에 없다(#54059 OPEN).
- **결론**: 1T MoE 한 복제본에 4090이 13장 이상 필요하다. 이 저장소의 48 GiB 모델 기준이며 KV는 뺀 수치다. P2P와 GDR이 없으니 TP는 호스트를 거쳐야 한다. **4090은 1T MoE 서빙 풀에 넣지 않는 것이 맞다.**

### 1.4 다중 노드 실행 방식 (vLLM v0.32.0)

- **mp가 기본이다(CODE)**. `arg_utils.py`에 `elif current_platform.is_cuda() and self.nnodes > 1: backend = "mp"`가 있다. Ray에서 `nnodes > 1`을 쓰면 "nnodes > 1 can only be set when distributed executor backend is mp, uni or external_launcher"로 거부된다.
  - 같은 저장소의 `parallelism_scaling.md`에는 "The default distributed runtimes are Ray for multi-node"라는 낡은 문장이 남아 있다. **이 문장은 코드와 다르다.**
- **LWS 문서(DOC)**: `docs/deployment/frameworks/lws.md`의 기본 탭은 Multiprocessing이다.
  - 리더: `vllm serve … --tensor-parallel-size 8 --pipeline-parallel-size $(LWS_GROUP_SIZE) --nnodes $(LWS_GROUP_SIZE) --node-rank $(LWS_WORKER_INDEX) --master-addr $(LWS_LEADER_ADDRESS)`
  - 워커: 같은 명령에 `--headless`를 붙인다.
  - Ray 방식은 `examples/ray_serving/multi-node-serving.sh`를 쓰는 대안으로만 남아 있다.
- **이 저장소의 기존 예제 `manifests/vllm-tp4-pp2-kuberay-values.example.yaml`(KubeRay)**: 새 기본 경로가 아니다. LWS와 mp 조합으로 바꾸는 것이 upstream 방향과 맞다(추론).

## 2. llm-d wide-EP, P/D, PP

### 2.1 wide-EP 가이드 (llm-d v1.0.0 `guides/wide-ep`)

- **배포 구조**: plain LWS 대신 `DisaggregatedSet`(`disaggregatedset.x-k8s.io/v1`, LWS 컨트롤러가 제공)을 쓴다. prefill과 decode는 각각 노드 2대의 DP16/EP16 그룹이다.
- **기본 구성**: "`deepseek-ai/DeepSeek-R1-0528` on 32 NVIDIA H200 GPUs … DeepEP for the expert all-to-all and NIXL for the KV transfer over RDMA."
- **검증 장비**: "Validated on a 32×H200 cluster with InfiniBand networking (`coreweave`) and a 32×H200 cluster on GKE with RoCE networking (`gke`)". v0.10.0에는 32×B200 GKE RoCE도 있었다.
- **네트워크 요구(원문)**: "require all-to-all RDMA connectivity: every NIC on a host must be able to communicate with every NIC on all other hosts. Networks restricted to … rail-only connectivity will fail."
- **vLLM 인자(CODE, `disaggregatedset.yaml`@v1.0.0)**:
  - `--data-parallel-size $((LWS_GROUP_SIZE*DP_SIZE_LOCAL)) --data-parallel-size-local 8 --data-parallel-address ${LWS_LEADER_ADDRESS} --data-parallel-rpc-port 5555 --data-parallel-start-rank $START_RANK`
  - `--enable-expert-parallel --moe-backend deep_gemm --all2all-backend deepep_v2 --data-parallel-multi-port-external-lb`
  - 이미지는 `vllm/vllm-openai:v0.30.0`이다. 주석: "required for DeepEP v2 + NCCL GIN".
- **환경 변수와 권한**: `VLLM_SKIP_P2P_CHECK=1`, `NVIDIA_GDRCOPY=enabled`, `IPC_LOCK`·`SYS_RAWIO`.
  - InfiniBand 오버레이는 `rdma/ib`를 쓴다.
  - GKE RoCE 오버레이는 DRA GPU+NIC claim, `privileged`, `DEEP_EP_DEVICE_TO_HCA_MAPPING`, `NVSHMEM_DISABLE_GDRCOPY=true`를 쓴다.
- **RoCE 이력**:
  - v0.10.0은 "NVSHMEM bug on RoCE impacting DeepEP HT" 때문에 커스텀 이미지를 썼다.
  - v1.0.0에서 upstream 이미지로 돌아갔다(llm-d#1532, CLOSED 2026-09-29).
  - GKE README는 BROKEN을 기록한다: "R580 drivers … crash DeepEP high-throughput kernels with `cudaErrorIllegalAddress`".
  - **이 저장소의 호스트 드라이버 기준은 ≥580이다.**
- **PCIe와 소비자급 GPU**:
  - llm-d#84(stale close)에서 메인테이너는 llm-d가 "data center grade accelerators (H100 or newer) … datacenter networking as well (100+ Gbps)"을 대상으로 한다고 답했다.
  - SM120이나 PCIe 전용 구성의 wide-EP 사례는 동작이든 실패든 **없다**.

### 2.2 P/D 분리 (`guides/pd-disaggregation`@v1.0.0)

- **문서 원문**: "NIXL works over TCP, but RDMA networking (InfiniBand, RoCE, EFA) is **highly recommended** for production". NixlConnector의 전송은 "UCX (RDMA / TCP)"로 적혀 있다.
- **검증 구성**: H200, gpt-oss-120b, 1P TP1 + 1D TP4다.
- **UCX 설정**: RDMA 문서는 `UCX_TLS=sm,cuda_ipc,cuda_copy,rc,tcp`를 예로 든다. TCP 전용이면 `UCX_TLS=tcp`, 선택된 전송 확인은 `UCX_PROTO_INFO=y`다.
- **GPUDirect 없이 쓰는 경우**:
  - UCX FAQ는 GDR이 없으면 "copy the data to/from host memory"(rendezvous pipeline cuda_copy)라고 설명한다.
  - NIXL에서도 USER-OK다(#2512의 tcp+cuda_copy). 다만 느리다는 보고가 있다(#1097 OPEN, L20).
- **알려진 함정**:
  - llm-d#759: DP와 P/D를 함께 쓸 때 NIC bonding 때문에 hang이 났다. `/sys/class/net/bonding`을 마운트해 해결했다.
  - llm-d#632: hostNetwork를 쓰면 P/D 포트 라우팅이 깨졌다. DRANet으로 바꿔 해결했다.

### 2.3 PP와 다중 노드 TP

- **llm-d 메인테이너 입장(llm-d#99)**: "Rather than TP or PP, our focus for llm-d multinode deployments is large scale MoE serving, using a Data Parallel deployment… TP won't be expected to scale well in the multinode case."
- **GPU 다중 노드 PP 가이드**: llm-d v1.0.0에는 없다.
  - 다중 노드 TP는 GB200 MNNVL(DeepSeek-V4 low-latency)에만 있다.
  - TP×PP 다중 노드 패턴은 **LWS 저장소 예제**(`docs/examples/leaderworkerset/basic/vllm.yaml`@v1.0.0, "no Ray")와 vLLM 문서에 있다.
- **InferencePool이 리더만 고르게 하는 방법**:
  - llm-d 가이드는 워커에 다른 레이블 값을 붙인다(`llm-d.ai/guide: optimized-baseline-worker`).
  - `leaderworkerset.sigs.k8s.io/worker-index: "0"` selector는 레이블이 코드에 존재하므로 가능하다. 다만 가이드에는 이 예가 없다(추론).

### 2.4 router v0.11.0 / GAIE v1.6.2와의 호환성

| llm-d | router | GAIE | Gateway API | LWS |
|---|---|---|---|---|
| v0.10.0 | v0.11.0 | **v1.5.0** | v1.5.1 | – |
| v1.0.0 | v1.0.0 | v1.6.2 | v1.6.2 | 1.0.0 |

- **이 저장소의 조합(router v0.11.0 + GAIE v1.6.2)은 어느 llm-d 릴리스도 고정하지 않은 조합이다.**
  - InferencePool은 두 쪽 모두 `inference.networking.k8s.io/v1`이다.
  - GAIE v1.6.0은 alpha `InferenceObjective`와 `EndpointPickerConfig` CRD를 제거했다. router v0.11.0은 자체 `llm-d.ai` InferenceObjective CRD를 가지고 있다.
  - 따라서 호환될 가능성이 높다. 실측으로 확인하지는 않았다.
- **router v1.0.0의 breaking change**:
  - `inference.networking.x-k8s.io` 그룹을 제거했다.
  - EPP 설정이 `llm-d.ai/v1`로 바뀌었다.
  - `data-parallel-profile-handler` 플러그인을 제거했다.
  - 헤더 접두사가 `x-llm-d-`로 바뀌었다.
  - sidecar의 `--vllm-port`를 제거했다.
- **v1.0.0 가이드를 router v0.11.0에 그대로 쓸 수는 없다.** router v0.11.0은 `llm-d.ai/v1`을 strict decoding으로 거부한다. sidecar 플래그 `--secure-serving=false`도 v0.11.0에는 없다. 방법은 둘이다.
  - router를 v1.0.0으로 올린다.
  - v0.10.0 가이드(`llm-d.ai/v1alpha1`)를 쓴다.

## 3. 다중 노드 복제본을 위한 k8s 구성 요소

| 구성 요소 | 현재 상태 (2026-11-03) | 이 클러스터(k3s 1.34)에서 |
|---|---|---|
| **LWS v1.0.0** | `leaderworkerset.x-k8s.io/v1`. `size`, `leaderTemplate`(선택), `workerTemplate`, `restartPolicy`(기본 RecreateGroupOnPodRestart), `startupPolicy` LeaderCreated(기본)/LeaderReady, `subGroupPolicy`. 환경 변수 `LWS_LEADER_ADDRESS`·`LWS_GROUP_SIZE`·`LWS_WORKER_INDEX`. llm-d 문서의 "LeaderCreatedFirst" 표기는 오기다 | 문서상 K8s ≥1.34이고, 1.34에서는 `MaxUnavailableStatefulSet` feature gate가 필요하다. **native gang(`spec.scheduling`)은 K8s 1.37이 필요하므로 쓸 수 없다** |
| **Kueue v0.20.4** | LWS 통합이 기본으로 켜져 있다(`kueue.x-k8s.io/queue-name`). TAS는 Beta이며 v0.14부터 기본 켜짐이다. 어노테이션은 `podset-required-topology`, `podset-preferred-topology`, `podset-group-name`, `podset-slice-*`이고 두 템플릿 모두에 붙인다 | 사용 가능하다. 이미 저장소에서 쓰고 있다. 다만 **TAS와 DRA를 함께 쓰려면 `KueueDRADeviceFeasibility`(alpha, 기본 꺼짐)가 필요하다.** 이 gate가 없으면 "TAS places the Pod by its other resources alone… The Pod stays Pending while the workload holds the quota." |
| **KAI Scheduler v0.18.7** | LWS podgrouper가 있다(LeaderCreated면 MinAvailable=groupSize). `kai.scheduler/v1alpha1 Topology`, `kai.scheduler/topology-required-placement`. README에 DRA 지원이 명시돼 있다 | 가능하다. 다만 두 번째 스케줄러가 되어 Kueue 쿼터 체계와 역할이 겹친다 |
| **Grove v0.2.0-beta1** | API가 `grove.io/v1beta1`(PodCliqueSet, PodClique, PodCliqueScalingGroup)로 올라갔다. PodGang은 `scheduler.grove.io/v1alpha1`에 남아 있다. **gang 스케줄러는 KAI만 지원한다.** K8s 1.34는 CI에서 "compatibility smoke suite"(k3s v1.34.11)만 돈다 | 시기상조다 |

어떤 조합이 표준인지는 프로젝트마다 다르다.

- **NVIDIA Dynamo v1.6.1**: "Grove is the default and recommended orchestrator for multinode deployments. It requires KAI Scheduler". 대안은 LWS와 Volcano다.
- **llm-d와 vLLM**: LWS(또는 DisaggregatedSet)에 선택적으로 Kueue TAS를 붙인다.
- **이 저장소의 권장**: 이미 Kueue와 DRA를 쓰고 있으므로 **LWS v1.0.0 + Kueue v0.20 TAS**가 가장 변경이 적다. 2–4노드 그룹의 gang 승인은 Kueue Workload 단위로 처리한다.

## 4. Network Operator, GPUDirect RDMA, RoCE

- **Network Operator v26.7.1**:
  - K8s v1.32–1.36을 지원한다.
  - "DOCA-Host (host-installed) and the containerized DOCA-OFED driver are mutually exclusive". 호스트에 DOCA가 있으면 `ofedDriver`를 생략한다.
  - NicClusterPolicy 필드(CODE): `rdmaSharedDevicePlugin`, `sriovDevicePlugin`, `secondaryNetwork{multus,cniPlugins,ipoib}`, `nvIpam`, `nicConfigurationOperator`, `spectrumXOperator`, `nodeAffinity`, `tolerations`. 노드별 정책용 `NicNodePolicy`가 새로 생겼다.
  - 문서의 모드 설명: MacVLAN + RDMA shared는 "Multi-tenant segmentation…", SR-IOV는 "distributed ML training", Host Device는 "exclusive hardware access"다.
  - **어느 모드도 GPUDirect 전용 모드로 지정돼 있지 않다.** 노드당 8-GPU Pod 하나라면 macvlan과 shared plugin 조합이 가장 단순하다.
  - 출처: https://docs.nvidia.com/networking/display/kubernetes2670/quick-start/quick-start-k8s.html
- **GPU Operator v26.7.2 GPUDirect**:
  - DOC: "NVIDIA recommends using the DMA-BUF rather than using the `nvidia-peermem` kernel module". 조건은 open kernel module과 Linux ≥5.12다.
  - **이 저장소의 GPUCluster(DRA) 경로에는 RDMA 설정 필드가 없다**(CODE `gpucluster_types.go`). `driver.rdma.*`는 operator가 관리하는 드라이버 컨테이너에만 적용된다.
  - 따라서 GDR은 **호스트 작업**이다. Blackwell은 open module 전용이므로 호스트의 580 드라이버와 inbox 또는 DOCA-Host mlx5만 있으면 DMA-BUF 경로가 성립한다. 이 부분은 추론이다.
  - 출처: https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/26.7/gpu-operator-rdma.html
- **GPU Operator 플랫폼 지원**: "RTX PRO 6000 Blackwell Server Edition"(driver ≥575.57.08)이 목록에 있다. Workstation Edition과 RTX 4090은 **목록에 없다**.
  - 출처: https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/26.7/platform-support.html
- **RTX PRO 6000의 GDR과 P2P**:
  - 제품을 명시한 NVIDIA 문서는 없다(?).
  - RTX PRO AI Factory RA의 요구: "NIC … under the same PCIe switch or PCIe root complex as the GPUs", "maximum 2:1 GPU to NIC ratio".
  - ConnectX-8 SuperNIC은 "up to eight NVIDIA RTX PRO 6000 Blackwell Server Edition GPUs" 구성의 RTX PRO Server에 들어간다(NVIDIA 블로그 2025-05-18).
  - P2P hang 보고(Level1Techs 2025-12, discuss.vllm.ai #2540)는 IOMMU를 끄거나 pass-through로 두고 ACS를 끄면 해결됐다.
  - "does not advertise PCIe ATS" 보고(NVIDIA 포럼 362222)는 ESXi 환경이다.
- **RTX 4090**:
  - GDR은 "Tesla and Quadro"에만 해당하므로 **불가**다.
  - P2P는 드라이버 525.105.17 이후 막혀 있다.
  - tinygrad P2P 패치는 570.148.08이 마지막이고 580 브랜치가 없다. 이 패치는 P2P만 열고 RDMA는 열지 않는다.
- **RoCE**:
  - NVIDIA Cumulus 5.15는 "NVUE defaults to RoCE lossless"다. PFC는 prio 3, DSCP 26, CNP는 DSCP 48, ECN은 TC 3에 둔다.
  - lossy(ECN만 쓰는) 모드도 문서화돼 있다.
  - NIC 쪽 설정: `mlnx_qos --trust dscp --pfc 0,0,0,1,0,0,0,0`, `cma_roce_tos -t 106`, MTU 9000(스위치 9216).
  - NCCL 설정: `NCCL_IB_TC=106`으로 PFC 클래스와 맞춘다. `NCCL_IB_GID_INDEX`는 2.32u1부터 AUTO다. **`NCCL_NET_GDR_READ`는 NVLink가 없는 플랫폼에서 기본 0이다.**
  - BROKEN: CX7과 Nexus 9000에서 ToS 104로 PFC를 켜자 "transport retry counter exceeded"가 났다(NVIDIA 포럼 368378).
- **DRA for NIC**:
  - SR-IOV DRA 드라이버는 v26.7.1에 Tech Preview로 들어 있다("not recommended for production").
  - DRANET은 v1.5.0(kubernetes-sigs)이다.
  - RDMA *shared* device plugin을 대신할 NVIDIA DRA는 찾지 못했다.
  - GPU는 DRA로, NIC은 device plugin으로 할당하면 NUMA 정렬을 보장할 수단이 없다(추론).

## 5. Speculative decoding

- **Kimi K2.5 EAGLE3 드래프트(HF)**:
  - `lightseekorg/kimi-k2.5-eagle3-mla`: `Eagle3DeepseekV2ForCausalLM`, 카드에 "vLLM >= 0.18.0"이라고 적혀 있다.
  - `lightseekorg/kimi-k2.5-eagle3`: Llama 구조다.
  - `nvidia/Kimi-K2.5-Thinking-Eagle3`: TRT-LLM 대상이다.
  - 그 밖에 `AQ-MedAI/Kimi-K25-eagle3`, `amd/Kimi-K2.5-Eagle3-FP8`이 있다.
  - vLLM은 `KimiK25ForConditionalGeneration`에서 SupportsEagle3를 구현하고, `Eagle3DeepseekV2/V3ForCausalLM`을 `deepseek_eagle3`로 매핑한다(CODE).
  - SM120에서의 동작 근거는 #40608(커스텀 이미지)뿐이다.
- **Kimi K2.5에는 MTP가 없다**(`num_nextn_predict_layers: 0`).
- **DeepSeek-R1-0528 MTP**:
  - `num_nextn_predict_layers: 1`이다. `method: "mtp"`를 쓰며 `deepseek_mtp`는 deprecated다(CODE).
  - SM120에서 R1 MTP가 동작한 보고는 없다(?).
  - 회귀 보고가 둘 있다. v0.33.0의 b12x+MTP IMA(#65139)와 spec decode+PP 오출력(#52071)이다. **v0.33.0으로의 즉시 업그레이드는 보류하는 편이 좋다.**

## 6. 결정에 직접 쓰이는 결론

1. **PRO 6000과 RoCE 조합에서 노드를 넘는 wide-EP는 현재 현실적이지 않다.**
   - DeepEP의 normal/HT 모드는 NVLink가 필수다. PCIe 전용 8-GPU 호스트에서는 init 자체가 실패한 보고가 있다(DeepEP#584 OPEN).
   - pplx는 vLLM에서 제거됐다.
   - llm-d wide-EP는 H200·B200·GB200과 `deepep_v2`, all-to-all RDMA, pre-R580 드라이버에서만 검증됐다.
   - 남는 것은 `allgather_reducescatter`(NCCL)뿐이다. 이 방식은 토큰 hidden state를 모든 rank에 모으므로 노드 간 트래픽이 DP 크기에 비례해 늘어난다.
   - EP와 DP는 **노드 안**의 비교 실험으로만 남기고, 노드 간 확장은 **복제본 수평 확장**을 기본으로 한다. 한 노드에 들어가지 않는 모델에만 **PP=2**를 쓴다.
2. **Kimi K2.5 INT4(595 GB)는 8×PRO 6000 한 노드(TP8 또는 TP4×PP2)에 들어간다. 1순위 구성은 노드당 한 복제본을 두고 llm-d EPP로 분산하는 것이다.**
   - 커널 경로는 Marlin MoE와 TRITON_MLA다.
   - upstream v0.32.0 이미지로 동작한 공개 사례는 없고, 커스텀 이미지 사례만 있다.
   - PCIe P2P와 custom all-reduce hang에 대비해 `--disable-custom-all-reduce`와 `NCCL_P2P_DISABLE`을 fallback으로 준비한다.
   - 비전은 `--language-model-only`로 일단 뺀다.
3. **DeepSeek-R1 FP8(688.6 GB)은 단일 노드에서 KV 공간이 거의 없다.** 선택지는 둘이다.
   - NVFP4(423.6 GB)로 단일 노드에 올린다. TP8 정렬 버그 #48898을 피해 TP4×PP2를 비교한다.
   - FP8을 2노드 PP=2로 올린다. DeepGEMM SM120 포트에 의존하고, CUTLASS fallback은 #47990으로 깨져 있다.
   - 어느 쪽이든 SM120에서 R1/V3가 동작한 upstream 사례는 없으므로 실측이 먼저다.
4. **다중 노드 PP의 기준 구현은 LWS v1.0.0과 vLLM mp(`--nnodes/--node-rank/--master-addr/--headless`)다.** Ray와 KubeRay가 아니다.
   - vLLM 코드는 `nnodes>1`에서 Ray를 거부한다.
   - gang 승인은 Kueue LWS 통합과 TAS로 한다. K8s 1.34에서는 LWS native gang을 쓸 수 없다.
   - TAS와 DRA를 함께 쓰려면 alpha gate가 필요하다는 점을 먼저 시험해야 한다.
   - 저장소의 KubeRay TP4×PP2 예제는 이 방식으로 교체할 대상이다.
5. **llm-d v1.0.0 가이드(wide-EP, P/D, DisaggregatedSet)를 쓰려면 router를 v0.11.0에서 v1.0.0으로 올려야 한다.**
   - 이유: `llm-d.ai/v1` 설정과 `--secure-serving` 플래그.
   - P/D(NIXL/UCX)는 TCP나 GDR 없는 RoCE에서도 동작한 보고가 있다(nixl#2512). dma-buf와 커널 7.1 미만 조합에서는 4 GiB 이상 등록이 조용히 깨지는 문제가 있어 `UCX_CUDA_COPY_DMABUF=no` 우회를 확인해야 한다.
   - GPU Operator의 DRA(GPUCluster) 경로에는 RDMA 옵션이 없다. GPUDirect RDMA는 호스트 DMA-BUF 작업으로 처리하고, 노드마다 `ib_write_bw --use_cuda`로 먼저 증명해야 한다. RTX PRO 6000의 GDR을 NVIDIA가 제품명으로 명시한 문서는 없다.

## 확인하지 못한 것

- vllm#40608의 커스텀 패치가 v0.32.0에 모두 들어갔는가.
- SGLang `fa3`·`flashmla`·`cutlass_mla`가 SM120과 SM89에서 동작하는가.
- DeepEP low-latency, hybrid-ep, nixl_ep을 SM120과 RoCE에서 쓸 수 있는가.
- NVSHMEM이 RTX PRO 6000을 공식 지원하는가. 문서에는 "NVIDIA Data Center GPU … Volta or later"라고만 적혀 있다.
- Network Operator 26.7과 GPU Operator 26.7의 호환 행. GPU Operator 매트릭스는 Network Operator 26.1.0까지만 나열한다.
- Kueue TAS와 LWS 조합의 열린 버그. GitHub 검색이 rate limit에 걸려 확인하지 못했다.
- 이 보고서의 모든 처리량·메모리 수치는 계산값이다. 측정값이 아니다.
