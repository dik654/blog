# H. NVLS(NVLink SHARP)·Seagate CORVAULT 리서치 반영 (2026-10-12)

사용자 요청: "seagate covault, 엔비디아 NVLS 등도 리서치해서 적용해줘". 1차 자료를 직접 열어 확인한 사실만 반영한다. 규칙은 `BRIEF-fix.md`·`BRIEF-followup.md`, 재작성은 teach-system.

## NVLS 반영 결과
| 항목 | 판정 | 근거 |
|---|---|---|
| NVLS를 어디에 둘지 | `gpu/gpu-collective-network`(`hw/network/InfiniBand.tsx`)의 busbw 보정식 바로 뒤 새 절 `#nvls-in-switch-reduction` | 이 글은 이미 "Reduction offload … busbw가 물리 link traffic과 일치하지 않을 수 있다"고만 적고 이유를 설명하지 않았다. NVLS가 그 경계의 실제 사례다. 새 concept id 없이 `nccl-algbw-busbw-boundary`의 사례로 둔다. |
| 장치·연산자·data type | 적용 | NVIDIA NVSwitch 3세대 블로그(2022-08-23) "SHARP collectives and multicast support": "A SHARP controller · SHARP arithmetic logic units (ALUs) highly leveraged from those in the NVIDIA Hopper Architecture · Embedded SRAM", "logical, min/max, and add", "signed/unsigned integers, FP16, FP32, FP64, and BF16" |
| 4N vs 2N+2 | 적용(operation 수로만, byte와 분리) | 같은 블로그 "all-reduce operation compatibility": "4 N total operations" / "2 N +2 operations, or approximately halving the number of read/write operations" |
| 사용 조건 | 적용 | NCCL env.html `NCCL_NVLS_ENABLE (since 2.17)`: "NVLink SHARP is available in third-generation NVSwitch systems (NVLink4) with Hopper and later GPU architectures" / 2.27·2.28 fallback hang, 2.29 되돌림 / 같은 GPU 다중 rank면 "NVLS will be silently disabled" / MNNVL "requires a fully configured and operational IMEX domain" |
| NCCL 버전 | 적용 | rel_2-17-1 "Add support for NVLink SHARP Reduction / Broadcast to accelerate intra-node allreduce operations." / rel_2-18-1 "Add inter-node algorithms for NVLink SHARP: NVLink SHARP + IB SHARP (NVLS), NVLink SHARP + Tree (NVLSTREE)." |
| 지원 collective·protocol·비용 모델 | 적용 | NVIDIA/nccl v2.32.3-1 `src/tuning/nvls.cc` 11–16, 29, 54–67행: "// NVLS is supported for AR, AG, and RS." "// NVLSTree is only supported for AR." Simple 이외 비활성화, `if (c == ncclFuncAllReduce) { intraBw *= 2.0f; }` |
| multicast·multimem | 적용 | CUDA Driver API Multicast(`cuMulticastCreate`·`cuMulticastAddDevice`·`cuMulticastBindMem`), CUDA Programming Guide 4.17.4 "a multicast team of N GPUs has N physical replicas", PTX ISA 9.7.10.15 multimem.ld_reduce/st/red, "Introduced in PTX ISA version 8.1." "Requires sm_90 or higher." NCCL `reduce_kernel.h` 1131행 multimem.ld_reduce 인라인 PTX, `all_reduce.h` NVLS kernel의 Scatter/Reduce/Bcast/Gather warp |
| 8 GPU·1GB byte 원장 | 적용(이 글의 유도로 표시) | ring 2(n−1)/n은 nccl-tests PERFORMANCE.md와 `tuning_general.cc` 2*(nRanks-1). NVLS 1.125GB는 multimem 의미론으로 직접 셈 — 원장 각주에 "이 글이 직접 센 이상적인 link byte"라고 밝힘 |
| 미반영 | — | H100 NVLS busbw 실측(NVIDIA 1차 수치 없음), 비피어리뷰 B300 프리프린트의 ring·NVLS 교차점, NCCL_NVLS_CHUNKSIZE·NVLS_NCHANNELS(공식 env 문서에 없음), NVLS buffer GB 수치(산식만 있음) |

## 공용 파일 수정 목록 (NVLS)
old는 2026-10-12 현재 각 파일에서 한 번만 나온다.

### `src/content/article-learning.ts`
```old
requiredConcepts: ["collective-rank-semantics", "nccl-algbw-busbw-boundary"], sectionId: "infiniband" },
    ],
    papers: [
      { title: "InfiniBand Trade Association — About InfiniBand"
```
```new
requiredConcepts: ["collective-rank-semantics", "nccl-algbw-busbw-boundary"], sectionId: "infiniband" },
      { level: "basic", question: "GPU 8개가 각자 1GB를 all-reduce할 때 ring과 NVLS에서 GPU 한 대가 link에 보내는 byte를 계산하라.", answerChecklist: ["2 times 7 over 8", "1.75GB", "1GB once to switch", "1/8GB broadcast", "1.125GB", "about 1.56x"], requiredConcepts: ["nccl-algbw-busbw-boundary"], sectionId: "nvls-in-switch-reduction" },
      { level: "advanced", question: "NVLS가 켜진 nccl-tests에서 busbw가 NVLink 속도를 넘었다. 측정 오류인지 판정하고 ring과의 선택 기준을 세워라.", answerChecklist: ["point-to-point assumption", "in-switch reduction", "multimem ld_reduce st", "NCCL_ALGO Ring NVLS", "operation time", "switch NIC counter", "memory multi-rank limit"], requiredConcepts: ["nccl-algbw-busbw-boundary"], sectionId: "nvls-in-switch-reduction" },
    ],
    papers: [
      { title: "InfiniBand Trade Association — About InfiniBand"
```

### `src/content/article-learning.ts`
```old
notClaim: "Busbw가 실제 wire traffic과 항상 같지 않습니다.", sectionId: "paper-nccl-tests-performance" },
    ],
```
```new
notClaim: "Busbw가 실제 wire traffic과 항상 같지 않습니다.", sectionId: "paper-nccl-tests-performance" },
      { title: "NVIDIA — Third-Generation NVSwitch (NVLink SHARP)", href: "https://developer.nvidia.com/blog/upgrading-multi-gpu-interconnectivity-with-the-third-generation-nvidia-nvswitch/", problem: "Ring all-reduce는 GPU가 조각을 주고받으며 직접 더하므로 GPU interface마다 read/write가 많습니다.", contribution: "NVSwitch 안 SHARP controller·ALU·SRAM이 reduction과 multicast를 맡아 all-reduce read/write를 4N에서 2N+2로 줄인다고 설명합니다.", assumptions: "Hopper 이후 GPU와 3세대 이상 NVSwitch, 지원 연산자·data type 안의 reduction입니다.", evidenceScope: "NVIDIA의 구조 설명과 operation 수 비교입니다.", notClaim: "모든 message size에서 ring보다 빠르다는 측정이 아니며, operation 수가 byte 수와 같다는 뜻도 아닙니다.", sectionId: "paper-nvlink-sharp" },
    ],
```

### `src/content/article-evidence.ts`
```old
      note: "Collective operation별 algbw·busbw 계산과 해석 경계",
    },
  ],
  "gpu/b300-switchless-network": [
```
```new
      note: "Collective operation별 algbw·busbw 계산과 해석 경계",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA Technical Blog — Upgrading Multi-GPU Interconnectivity with the Third-Generation NVIDIA NVSwitch (2022-08-23)",
      href: "https://developer.nvidia.com/blog/upgrading-multi-gpu-interconnectivity-with-the-third-generation-nvidia-nvswitch/",
      note: "3세대 NVSwitch의 SHARP controller·ALU·SRAM, 연산자(logical·min/max·add)와 data type, all-reduce read/write 4N→2N+2. 2026-10-12 원문 확인.",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA NCCL User Guide — Environment Variables (NCCL_NVLS_ENABLE, NCCL_ALGO)",
      href: "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html",
      note: "NVLS는 3세대 NVSwitch(NVLink4)와 Hopper 이후에서 사용, 기본값 2, 2.27·2.28 fallback hang 위험과 2.29 되돌림, 같은 GPU 다중 rank에서 비활성화, MNNVL의 IMEX 요구. 2026-10-12 원문 확인.",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA NCCL Release Notes 2.17.1 · 2.18.1",
      href: "https://docs.nvidia.com/deeplearning/nccl/release-notes/rel_2-18-1.html",
      note: "2.17.1 node 안 all-reduce용 NVLink SHARP 도입(https://docs.nvidia.com/deeplearning/nccl/release-notes/rel_2-17-1.html), 2.18.1 NVLS(+IB SHARP)·NVLSTree node 간 algorithm 추가. 2026-10-12 원문 확인.",
    },
    {
      kind: "공식 문서",
      label: "NVIDIA PTX ISA — multimem.ld_reduce, multimem.st, multimem.red",
      href: "https://docs.nvidia.com/cuda/parallel-thread-execution/index.html",
      note: "multimem 주소의 모든 replica에서 읽어 줄이거나 모두에 쓰는 의미론, PTX ISA 8.1·sm_90 이상. CUDA Programming Guide 4.17.4의 multicast team replica 설명과 함께 2026-10-12 원문 확인.",
    },
    {
      kind: "공식 코드",
      label: "NVIDIA/nccl v2.32.3-1 — src/tuning/nvls.cc, src/device/reduce_kernel.h",
      href: "https://github.com/NVIDIA/nccl/blob/v2.32.3-1/src/tuning/nvls.cc",
      note: "NVLS는 AR·AG·RS, NVLSTree는 AR만, Simple protocol만 허용, all-reduce intraBw ×2. reduce_kernel.h의 multimem.ld_reduce 인라인 PTX. 2026-10-12 원문 확인.",
    },
  ],
  "gpu/b300-switchless-network": [
```

## 공용 파일 수정 목록 (NVLS 연습문제 개수)
학습 계약은 기초 6·심화 4개 고정이라, 새 NVLS 문제와 겹치는 기존 두 문제(algbw·busbw 정의, busbw를 wire 효율로 본 오류 교정)를 뺀다. 두 내용은 새 문제의 checklist("point-to-point assumption", "operation time")와 기존 16-rank busbw 계산 문제가 덮는다.

### `src/content/article-learning.ts`
```old
      { level: "basic", question: "Operation time·algbw·busbw를 각각 정의하라.", answerChecklist: ["wall time", "payload over time", "correction factor", "rank count", "not same"], requiredConcepts: ["nccl-algbw-busbw-boundary"], sectionId: "nccl-bandwidth-boundary" },
      { level
```
```new
      { level
```

### `src/content/article-learning.ts`
```old
      { level: "advanced", question: "Busbw를 wire throughput으로 보고 line-rate 효율을 계산한 오류를 교정하라.", answerChecklist: ["derived metric", "algorithm accounting", "offload hierarchy", "wire counter", "same direction units", "no direct ratio"], requiredConcepts: ["nccl-algbw-busbw-boundary"], sectionId: "nccl-bandwidth-boundary" },
      { level
```
```new
      { level
```

## CORVAULT 반영 결과
| 항목 | 판정 | 근거 |
|---|---|---|
| 제품명 | "covault" = Seagate Exos CORVAULT로 판단 | seagate.com 범위 검색에서 "CoVault"는 모두 CORVAULT 문서. 같은 이름 제품은 찾지 못함(부재 증명은 아님). EVault·Commvault와 혼동 가능성 기록 |
| 위치 | `gpu/ai-cluster-storage-io` 10절(limits) `data.ts`의 2PB raw·8+2 EC 문단 뒤 10문단 | 이 글의 기존 예(2PB raw, 8+2)가 CORVAULT 4U106(raw 2.0~2.5PB, ADAPT 기본 8+2)과 같은 규모라 같은 사례를 이어 씀. 숫자(전통 RAID 재구축 27시간) → 아이디어(stripe·예비 공간 분산) → 이름(ADAPT·ADR) → 비용·선택 기준 순서 |
| 정의·구성 | 적용 | 데이터시트 DS2058.4 1~2쪽 "multi-petabyte capacity block storage system that is self-healing", "Redundant, active-active, VelosCT Controllers", "Four mini-SAS-3 HD ports on each controller", "12 GB/s sequential read throughput, 10 GB/s sequential write throughput". HIMG 9쪽 "up to 106 hot-swappable drive modules" |
| ADAPT | 적용 | ADAPT 문서 1쪽 정의, SMG 18쪽 "Spare disks are not used by ADAPT disk groups since the RAID design provides built-in spare capacity that is spread across all disks", "the sum of the largest two disks", SMG 28쪽 "When one disk is failed, not all stripes will be degraded" / "Reconstruction will start immediately without waiting for replacement of the failed disk." CLI 가이드 38~41쪽 stripe-width 8+2(기본)·16+2·8+3·16+3 |
| 재구축 시간 | 적용(2018 모델값으로 표시) | ADAPT 문서 3쪽 표 "Rebuild 1 drive: 55.5 hours / 24 hours / 10 hours / 5.3 hours", 성능 영향 "-41% / -23% / -11% / -6%", "these are modeled numbers and results may vary" |
| ADR | 적용 | CLI 가이드 용어집 "detects and removes a bad head and its corresponding media surface, and returns the disk to service minus the capacity of the bad surface", 139쪽 "ADR is supported only for ADAPT disk groups." SMG 20~21쪽 Phase 1·2, "Process only one degraded disk with a failed head at a time.", FDE 잠금 상태 CAUTION, 재편입 후 rebalance |
| 상위 software | 적용 | QuantaStor 브리프 1쪽 "Turning that SAS attached block storage into NAS, SAN, and S3-compatible object storage" / "ADAPT hardware erasure coding combines effectively with QuantaStor's software level RAID (scale-up) and erasure coding (scale-out)" |
| 이 글이 계산한 값 | 표시 | 24TB×106=2,544TB, 예비 48TB 뒤 ×8/10≈1,997TB, 24TB÷250MB/s≈27시간(250MB/s는 가정), 20면 가정 시 22.8TB, 200GB/s÷12GB/s≈17대 — 모두 본문에 (가정) 또는 계산식으로 표시 |
| 미반영 | — | 제품 투어의 14/12GB/s·17,680 IOPS(데이터시트와 불일치), "ADR 95% 빠름"·"18TB 이상만 ADR"·HAMR 첫 출하(2차 출처만), AI 전용 포지셔닝 원자료, MinIO·Ceph 연계, ADR 성공률 |

## 공용 파일 수정 목록 (CORVAULT)
old는 2026-10-12 현재 파일에서 한 번만 나온다.

### `src/content/article-evidence.ts`
```old
    { kind: "공식 문서", label: "Ceph recovery state", href: "https://docs.ceph.com/en/latest/rados/operations/monitoring-osd-pg/",
```
```new
    { kind: "공식 문서", label: "Seagate · Exos CORVAULT Storage Management Guide (204818500-00-A)", href: "https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/support-content/raid-storage-systems/corvault/_shared/files/204818500-00-A_Seagate_Exos_CORVAULT_Storage_Management_Guide.pdf", note: "ADAPT 분산 예비 공간(가장 큰 disk 두 개의 합), 한 disk 고장 시 일부 stripe만 degraded·교체 없이 즉시 재구축, ADR 1·2단계와 한 번에 한 disk·FDE 잠금 제약. 2026-10-12 원문 확인." },
    { kind: "공식 문서", label: "Seagate · Exos CORVAULT Data Sheet (DS2058.4.2309US)", href: "https://www.seagate.com/content/dam/seagate/en/content-fragments/products/datasheets/exos-pods/corvault-self-healing-storage-DS2058-4-2309US-en_US.pdf", note: "4U106 raw 2.0~2.5PB, active-active controller, controller당 mini-SAS-3 HD 4포트, 순차 12GB/s read·10GB/s write. 2026-10-12 원문 확인." },
    { kind: "공식 문서", label: "Seagate · ADAPT Technology (SB505.1-1808US)", href: "https://www.seagate.com/content/dam/seagate/migrated-assets/www-content/solutions/backup/backup-and-recovery/adapt-technology.pdf", note: "Drive 1개 재구축 RAID 8+2 55.5시간 vs ADAPT 106 drive 5.3시간, 성능 저하 −41%→−6%. Seagate가 modeled numbers라고 밝힌 2018년 값. 2026-10-12 원문 확인." },
    { kind: "공식 문서", label: "Ceph recovery state", href: "https://docs.ceph.com/en/latest/rados/operations/monitoring-osd-pg/",
```

## 공용 파일 수정 목록 (topology)
NVLS 절로 `gpu/gpu-collective-network`의 section이 9→10이 되어 split-review 기준에 닿았다. NVLS는 `nccl-algbw-busbw-boundary`의 사례이고 새 concept·선수 지식을 만들지 않으므로 keep을 유지하고, 구조 필드(concept 2·stage 2·file 10·formula 1·Viz 4)가 section 수 외에는 그대로임을 `--json`으로 확인했다.

### `src/content/article-topology-decisions.ts`
```old
    reviewedAt: "2026-10-08",
    rationale: "Rank 계약, node 내부 경로, node 밖 fabric과 NCCL 측정은 collective 한 번이 가장 느린 rank 때문에 끝나지 않는 사건의 연속 단계입니다. 개별 transport의 상세는 interconnect·RDMA 글로 재사용합니다.",
```
```new
    reviewedAt: "2026-10-12",
    rationale: "Rank 계약, node 내부 경로, node 밖 fabric과 NCCL 측정은 collective 한 번이 가장 느린 rank 때문에 끝나지 않는 사건의 연속 단계입니다. 2026-10-12에 더한 NVLS 절은 새 concept가 아니라 busbw 보정식의 point-to-point 전제가 깨지는 사례라 같은 측정 단계에 둡니다(section 9→10). 개별 transport의 상세는 interconnect·RDMA 글로 재사용합니다.",
```

### `src/content/article-topology-decisions.ts`
```old
  "gpu/gpu-collective-network": "efb1cbd685897ce3",
```
```new
  "gpu/gpu-collective-network": "4751fd16da89e24d",
```
