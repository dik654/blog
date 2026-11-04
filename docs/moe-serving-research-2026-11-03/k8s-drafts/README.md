# MoE 서빙 k8s 초안 (검증 전)

**이 디렉터리의 YAML은 검증하지 않은 초안이다.** 어떤 클러스터에도 적용하지 않았고 `kubectl`로 서버에 접속하지도 않았다. 2026-11-03에 로컬에서 한 검사는 아래 두 가지뿐이다.

- Ruby Psych 3.1.0(`ruby -ryaml`)으로 모든 파일의 YAML 문법을 파싱했다. 모든 문서에 `apiVersion`·`kind`·`metadata`가 있는지도 확인했다.
- LWS 필드 이름(`leaderWorkerTemplate`, `leaderTemplate`, `workerTemplate`, `size`, `restartPolicy`, `startupPolicy`)을 lws v1.0.0의 `api/leaderworkerset/v1/leaderworkerset_types.go` json 태그와 대조했다.

다음 검사는 하지 못했다.

- kubeconform은 설치되어 있지 않다. 외부 바이너리 내려받기는 권한 정책이 막았다.
- `kubectl --dry-run=client`는 API discovery 때문에 서버 접속이 필요해서 쓸 수 없었다.

그러므로 CRD 스키마 검증(LWS, Kueue, InferencePool, NicClusterPolicy, ResourceClaimTemplate)은 아직 하지 않은 상태다.

## 파일과 용도

| 파일 | 내용 | 상태 |
|---|---|---|
| `00-namespace-and-claims.yaml` | 네임스페이스, Kueue LocalQueue, DRA `ResourceClaimTemplate` 두 개(GPU 8장, 같은 PCIe root의 GPU 4장) | 초안 |
| `10-lws-kimi-k25-1node-tp8.yaml` | Kimi K2.5 INT4, 노드 1대 TP8, LWS size=1 | **1순위 시험 대상** |
| `11-lws-kimi-k25-1node-tp4-pp2.yaml` | 같은 모델, 노드 안에서 TP4×PP2 | PCIe all-reduce 비교용 |
| `20-inferencepool-epp.yaml` | InferencePool(LWS 리더만 선택)과 llm-d EPP. router는 v0.11.0이고 설정은 `llm-d.ai/v1alpha1` | 초안 |
| `30-network-operator.yaml` | Network Operator v26.7.1용 NicClusterPolicy(RDMA shared device plugin, Multus, NV-IPAM), IPPool, MacvlanNetwork | 초안 |
| `40-lws-kimi-k25-2node-tp8-pp2.yaml` | 노드 2대, TP8×PP2. 멀티프로세싱으로 `--nnodes`·`--headless`를 쓰고 Ray는 쓰지 않는다 | 다중 노드 기본안 |
| `41-lws-kimi-k25-2node-dp16-ep16.yaml` | 노드 2대, DP16/EP16 wide-EP 형태. `allgather_reducescatter` 사용 | **비교 실험 전용** |
| `50-gpu-operator-values.pro6000.yaml` | GPU Operator v26.7.2 DRA(GPUCluster) values | 초안 |

적용 순서는 50 → 30 → 00 → 10(또는 11) → 20이다. 다중 노드는 그다음에 40과 41로 넘어간다.

## 출처로 확인한 필드와 플래그

| 필드·플래그 | 출처(버전) |
|---|---|
| `leaderworkerset.x-k8s.io/v1`, `leaderWorkerTemplate.{size,leaderTemplate,workerTemplate,restartPolicy}`, `startupPolicy: LeaderCreated\|LeaderReady`, 환경 변수 `LWS_LEADER_ADDRESS`·`LWS_GROUP_SIZE`·`LWS_WORKER_INDEX`, 레이블 `leaderworkerset.sigs.k8s.io/worker-index` | kubernetes-sigs/lws v1.0.0 `api/leaderworkerset/v1/leaderworkerset_types.go` |
| 노드마다 `--tensor-parallel-size 8 --pipeline-parallel-size N --nnodes $(LWS_GROUP_SIZE) --node-rank $(LWS_WORKER_INDEX) --master-addr $(LWS_LEADER_ADDRESS)`, 워커에는 `--headless` 추가 | vLLM v0.32.0 `docs/deployment/frameworks/lws.md`(기본값인 Multiprocessing 탭), lws v1.0.0 `docs/examples/leaderworkerset/basic/vllm.yaml` |
| `nnodes > 1`이면 실행기가 mp로 강제되고, Ray에서는 `nnodes > 1`이 거부된다 | vLLM v0.32.0 `vllm/engine/arg_utils.py`(커밋 5df63a7) |
| `--data-parallel-size/-size-local/-start-rank/-address/-rpc-port`, `--headless`, `--enable-expert-parallel`, `--all2all-backend`, `--enable-eplb`, `--decode-context-parallel-size`, `--disable-custom-all-reduce`, `--language-model-only`, `--speculative-config` | vLLM v0.32.0 `arg_utils.py`, `docs/serving/data_parallel_deployment.md` |
| `--tool-call-parser kimi_k2`, `--reasoning-parser kimi_k2` | vLLM v0.32.0 `vllm/tool_parsers/__init__.py`, `vllm/reasoning/__init__.py` |
| `allgather_reducescatter`는 기본값이며 문서 표현으로 "works with any EP+DP configuration"이다 | vLLM v0.32.0 `vllm/config/parallel.py:219`, `docs/serving/expert_parallel_deployment.md` |
| 이미지 `vllm/vllm-openai:v0.32.0@sha256:befccf0e…` | 2026-11-03 Docker Hub API 조회 |
| `resource.k8s.io/v1 ResourceClaimTemplate`의 `devices.requests[].exactly.{deviceClassName,allocationMode,count,selectors}`와 `constraints[].matchAttribute` | dra-driver-nvidia-gpu v0.5.1 `demo/specs/fabric-manager-partitioning/resourceClaimTemplates.yaml` |
| DeviceClass `gpu.nvidia.com`, 속성 `cudaComputeCapability`(version)·`productName`·`architecture` | dra-driver-nvidia-gpu v0.5.1 `templates/deviceclass-gpu.yaml`, `cmd/gpu-kubelet-plugin/deviceinfo.go` |
| `resource.kubernetes.io/pcieRoot` | 같은 저장소의 vendor `k8s.io/dynamic-resource-allocation/deviceattribute/attribute.go` |
| `kueue.x-k8s.io/queue-name`(LWS metadata.labels), `podset-required-topology`·`podset-group-name`(두 템플릿 모두) | kueue v0.20.4 `apis/kueue/v1beta2/topology_types.go`와 LWS TAS 예제 |
| InferencePool `inference.networking.k8s.io/v1`, EPP 설정 `llm-d.ai/v1alpha1` | GAIE v1.6.2, llm-d-router v0.11.0 `apix/config/v1alpha1`, 이미 돌고 있는 추론 스택 설정·`kv-scoring.yaml` |
| NicClusterPolicy의 `rdmaSharedDevicePlugin`·`secondaryNetwork{multus,cniPlugins}`·`nvIpam`·`nodeAffinity`·`tolerations`, MacvlanNetwork, IPPool(`nv-ipam.nvidia.com/v1alpha1`) | Mellanox/network-operator v26.7.1 `api/v1alpha1/nicclusterpolicy_types.go`, `example/crs/…-nvidia-ipam.yaml` |
| Pod의 `k8s.v1.cni.cncf.io/networks`, `IPC_LOCK`, `rdma/rdma_shared_device_a` | network-operator v26.7.1 `example/rdma-gpu-test-pod1.yml` |
| NCCL 변수 `NCCL_IB_GID_INDEX`(2.32u1부터 AUTO), `NCCL_IB_TC`(기본 0), `NCCL_NET_GDR_READ`(NVLink가 없으면 기본 0) | NCCL 2.32.3 env 문서 |
| GPUCluster 경로에는 RDMA 필드가 없고, `computeDomains`는 MNNVL 전용이다 | gpu-operator v26.7.2 `gpucluster_types.go`, dra-driver-nvidia-gpu v0.5.1 |

## 아직 확인하지 않은 값

아래 값은 출처로 확인하지 못했다. 실제 장비에서 측정해 바꿔야 한다.

- 레이블 `example.com/gpu-model: rtx-pro-6000-bw`, `example.com/rdma-fabric: roce-a`, `topology.example.com/network-fabric`. 앞의 둘은 새로 만들 레이블이다. 마지막 것은 기존 클러스터의 Topology 레벨 이름에 맞춰야 한다.
- `ens1f0np0`, `mlx5_0`, `NCCL_IB_TC=106`, 서브넷 값. `ibdev2netdev`와 스위치 QoS 설정을 확인한 뒤 바꾼다.
- CEL `cudaComputeCapability.compareTo(semver('12.0.0')) == 0`. 문법을 확인하지 않았다. 실패하면 ResourceSlice에 실제로 나온 `productName` 문자열로 바꾼다.
- 모델 hostPath `/var/lib/models`. 실제 배포 경로에 맞춰야 한다.
- InferencePool selector에 `leaderworkerset.sigs.k8s.io/worker-index: "0"`을 쓰는 방식. 이 레이블은 코드에 있지만 llm-d 가이드에는 이 사용 예가 없다. 40·41 파일은 같은 목적으로 워커 Pod의 `inference.example.com/model` 값도 바꿔 두었다.
- Kueue TAS와 DRA를 함께 쓰는 경우. `KueueDRADeviceFeasibility`는 v0.20에서 alpha이고 기본값이 꺼져 있다. 이 상태에서 GPU 수를 고려하지 않은 배치가 생겨 Pod가 Pending에 머물 수 있다.
- LWS v1.0.0을 Kubernetes 1.34에서 쓰려면 `MaxUnavailableStatefulSet` feature gate가 필요하다(LWS 문서). k3s 서버 인자로 켜야 한다.

## 이 초안에서 의도적으로 뺀 것

- **DeepEP, pplx, NIXL-EP 경로.** 근거는 `../04-k8s-serving-stack.md`에 있다. 41번 파일에 주석으로만 남겼다.
- **llm-d v1.0.0의 `DisaggregatedSet`, `llm-d.ai/v1` 설정.** 지금 쓰는 router v0.11.0은 `llm-d.ai/v1`을 strict decoding으로 거부한다. 쓰려면 router를 v1.0.0으로 올려야 한다.
- **RTX 4090(SM89) 노드.** Kimi K2.5 체크포인트는 595 GB여서 이 저장소의 48 GiB 4090으로도 KV를 빼고 13장 이상, 24 GB 카드로는 25장 이상이 필요하다. 4090은 P2P와 GPUDirect RDMA가 모두 막혀 있어 이 초안의 대상에서 뺐다.
