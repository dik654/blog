import type { Article } from "../types";

export const hwArticles: Article[] = [
  /* ── Compute ── */
  {
    slug: "hw-gpu-comparison",
    title: "GPU 비교: RTX 4090 vs 5090 vs A100 vs H100",
    subcategory: "hw-compute",
    sections: [
      { id: "overview", title: "제품보다 workload부터" },
      { id: "workload-envelope", title: "Capacity·SLA 요구사항" },
      { id: "consumer", title: "RTX 4090·5090 경계" },
      { id: "datacenter", title: "A100·H100과 fabric" },
      { id: "blockchain", title: "Workload별 paired benchmark" },
      { id: "release-gate", title: "Procurement gate" },
    ],
    component: () => import("@/pages/articles/hw/gpu-comparison"),
  },
  {
    slug: "ai-accelerator-vendor-comparison",
    title: "가속기 비교는 스펙표가 아니라 네 축으로 합니다",
    subcategory: "hw-compute",
    sections: [
      { id: "overview", title: "스펙표를 나란히 놓는 것으로는 결론이 안 납니다" },
      { id: "memory-axis", title: "용량은 올라가느냐를, 대역폭은 얼마나 빠르냐를 정합니다" },
      {
        id: "link-axis",
        title: "가속기를 잇는 방식에서 셋이 갈라집니다",
        subsections: [{ id: "scale-up-vs-out", title: "노드 안과 노드 밖을 구분해서 봐야 합니다" }],
      },
      { id: "form-factor", title: "폼팩터가 전력과 냉각, 그리고 조달 선택지를 함께 정합니다" },
      { id: "software-axis", title: "같은 코드가 그대로 도는지가 네 번째 축입니다" },
      { id: "snapshot-gate", title: "스냅샷은 기준일과 함께 읽습니다" },
    ],
    component: () => import("@/pages/articles/hw/ai-accelerator-vendor-comparison"),
  },
  {
    slug: "hw-server-vs-desktop",
    title: "서버 vs 데스크톱: 부품 차이 완전 정리",
    subcategory: "hw-compute",
    sections: [
      { id: "overview", title: "서버는 운영 플랫폼이다" },
      { id: "workload-envelope", title: "Workload resource envelope" },
      { id: "platform-topology", title: "Lane·memory·NUMA topology" },
      { id: "serviceability", title: "BMC·Redfish·serviceability" },
      { id: "release-gate", title: "Platform release gate" },
    ],
    component: () => import("@/pages/articles/hw/server-vs-desktop"),
  },
  {
    slug: "server-cpu-lineup-comparison",
    title: "GPU 서버의 CPU는 레인과 채널로 고릅니다",
    subcategory: "hw-compute",
    sections: [
      { id: "overview", title: "가속기 서버에서 CPU는 연산보다 통로를 담당합니다" },
      {
        id: "lane-budget",
        title: "레인은 나눠 쓰는 자원이라 먼저 예산을 짭니다",
        subsections: [{ id: "lane-arithmetic", title: "나눠 쓰면 언제 문제가 되는지 계산합니다" }],
      },
      { id: "memory-channels", title: "채널 수가 대역폭과 최대 용량을 함께 정합니다" },
      {
        id: "core-character",
        title: "코어는 개수보다 성격과 배치가 중요합니다",
        subsections: [{ id: "numa-placement", title: "어느 소켓에 붙은 가속기인지가 성능을 바꿉니다" }],
      },
      { id: "product-tiers", title: "제품군 경계는 코어가 아니라 플랫폼 기능이 정합니다" },
      { id: "selection-gate", title: "구성표를 먼저 적고 그다음에 제품을 고릅니다" },
    ],
    component: () => import("@/pages/articles/hw/server-cpu-lineup-comparison"),
  },

  /* ── Storage ── */
  {
    slug: "hw-nvme-storage",
    title: "NVMe 스토리지: M.2 vs U.2 vs E1.S",
    subcategory: "hw-storage",
    sections: [
      { id: "overview", title: "NVMe와 form factor 분리" },
      { id: "protocol-form-factor", title: "Protocol·mechanical 계약" },
      { id: "path-budget", title: "Lane·shared path budget" },
      { id: "thermal-serviceability", title: "Thermal·serviceability" },
      { id: "release-gate", title: "NVMe device release gate" },
    ],
    component: () => import("@/pages/articles/hw/nvme-storage"),
  },
  {
    slug: "hw-storage-comparison",
    title: "스토리지 비교: SATA vs NVMe vs SAS",
    subcategory: "hw-storage",
    sections: [
      { id: "overview", title: "Workload tier부터 고정" },
      { id: "io-path", title: "Command·transport·topology" },
      { id: "endurance-reserve", title: "Endurance·capacity reserve" },
      { id: "workload-placement", title: "Failure-domain placement" },
      { id: "release-gate", title: "Storage tier release gate" },
    ],
    component: () => import("@/pages/articles/hw/storage-comparison"),
  },

  /* ── Memory ── */
  {
    slug: "hw-memory",
    title: "메모리: DDR4 vs DDR5, ECC, RDIMM",
    subcategory: "hw-memory",
    sections: [
      { id: "overview", title: "왜 메모리 선택이 중요한가" },
      { id: "ddr", title: "DDR4와 DDR5: 채널·대역폭·지연시간" },
      { id: "ecc", title: "ECC: 보호 범위와 오류 운영" },
      { id: "rdimm", title: "UDIMM·RDIMM·3DS·MRDIMM" },
    ],
    component: () => import("@/pages/articles/hw/memory"),
  },

  /* ── Infrastructure ── */
  {
    slug: "hw-power-cooling",
    title: "서버 전력·냉각: 입력 전력부터 랙 열 제거까지",
    subcategory: "hw-infra",
    sections: [
      { id: "overview", title: "Wall power에서 heat rejection까지" },
      { id: "power-heat", title: "Input power·heat balance" },
      { id: "rack-power", title: "A/B feed·N−1 headroom" },
      { id: "cooling-path", title: "Air·liquid cooling path" },
      { id: "release-gate", title: "Power·cooling release gate" },
    ],
    component: () => import("@/pages/articles/hw/power-cooling"),
  },
  {
    slug: "datacenter-site-readiness",
    title: "랙에 들어가는지는 무게와 냉각으로 먼저 갈립니다",
    subcategory: "hw-infra",
    sections: [
      { id: "overview", title: "사양서에 없는 조건에서 막히는 경우가 많습니다" },
      {
        id: "cooling-type",
        title: "같은 카드라도 바람을 어디로 버리느냐가 다릅니다",
        subsections: [{ id: "airflow-direction", title: "섀시 기류 방향이 랙 배치와 맞아야 합니다" }],
      },
      {
        id: "power-sizing",
        title: "명판 전력과 실제 전력은 다른 숫자입니다",
        subsections: [{ id: "redundancy", title: "이중화 표기는 감당 범위를 말합니다" }],
      },
      {
        id: "floor-load",
        title: "가속기 랙은 바닥 허용치를 먼저 넘습니다",
        subsections: [{ id: "load-arithmetic", title: "숫자를 한 번 넣어 봅니다" }],
      },
      { id: "seismic", title: "고정하지 않은 랙은 흔들림에 먼저 쓰러집니다" },
      { id: "readiness-gate", title: "건물이 정한 제약에서 거꾸로 올라옵니다" },
    ],
    component: () => import("@/pages/articles/hw/datacenter-site-readiness"),
  },
  {
    slug: "hw-network",
    title: "서버 네트워크 기초: Workload · Goodput · Ethernet Fabric",
    subcategory: "hw-infra",
    sections: [
      { id: "overview", title: "서버 네트워크는 workload에서 시작한다" },
      { id: "workload-contract", title: "Traffic matrix의 형태" },
      { id: "goodput-boundary", title: "Line rate와 payload goodput" },
      { id: "ethernet", title: "Ethernet 링크와 leaf-spine fabric" },
    ],
    component: () => import("@/pages/articles/hw/network"),
  },
  {
    slug: "gpu-interconnects",
    title: "GPU Interconnects: PCIe · NVLink · Device Topology",
    subcategory: "hw-infra",
    sections: [
      { id: "overview", title: "GPU buffer의 실제 device path" },
      { id: "pcie-transaction-bandwidth-latency", title: "PCIe raw rate와 payload 경계" },
      { id: "pcie-topology-peer-path", title: "Switch · root · NUMA topology" },
      { id: "nvlink-device-fabric-boundary", title: "NVLink와 node-external 경계" },
    ],
    component: () => import("@/pages/articles/hw/gpu-interconnects"),
  },
  {
    slug: "rdma-roce",
    title: "RDMA · RoCE: Memory Registration에서 GPUDirect까지",
    subcategory: "hw-infra",
    sections: [
      { id: "overview", title: "Control과 data path 분리" },
      { id: "rdma-control-data-path", title: "Work request와 NIC DMA" },
      { id: "rdma-memory-registration", title: "Range · key · lifetime" },
      { id: "roce-gid-routing", title: "RoCE v2 GID와 route" },
      { id: "gpudirect-topology", title: "GPU–HCA direct path" },
    ],
    component: () => import("@/pages/articles/hw/rdma-roce"),
  },
  {
    slug: "gpu-collective-network",
    title: "GPU Collective Network: Rank · Fabric · NCCL 측정",
    subcategory: "hw-infra",
    sections: [
      { id: "overview", title: "Rank buffer에서 collective 완료까지" },
      { id: "collective-rank-semantics", title: "Operation · count · datatype 계약" },
      { id: "nccl-bandwidth-boundary", title: "algbw · busbw · wire counter" },
      { id: "infiniband", title: "Fabric 선택과 acceptance ledger" },
    ],
    component: () => import("@/pages/articles/hw/gpu-collective-network"),
  },
  {
    slug: "modded-rtx4090-moe-serving",
    title: "개조 RTX 4090 48GB와 MoE Serving: NVLink 공백을 엔지니어링으로 메우기",
    subcategory: "hw-infra",
    sections: [
      { id: "overview", title: "용량은 늘어도 링크는 그대로" },
      { id: "capacity-mod", title: "48GB 개조의 회로 수준 메커니즘" },
      { id: "nvlink-gap-quantified", title: "4090 · 3090 · A100 · H100 대역폭 정량 대조" },
      { id: "moe-communication-sensitivity", title: "MoE all-to-all이 dense all-reduce보다 예민한 이유" },
      { id: "engineering-recovery", title: "Expert 배치 · 병렬화 선택 · quantization · batching" },
      { id: "release-gate", title: "용량 병목 vs 통신 병목 판단 순서" },
    ],
    component: () => import("@/pages/articles/hw/modded-rtx4090-moe-serving"),
  },
  {
    slug: "b300-switchless-network",
    title: "DGX B300 Switchless: ConnectX-8 직결 RoCE 클러스터",
    subcategory: "hw-infra",
    sections: [
      { id: "overview", title: "스위치를 없애면 fabric을 직접 구현한다" },
      { id: "ports", title: "8 OSFP와 16 logical 400GbE" },
      { id: "topology", title: "노드 수·케이블 수·대역폭 설계" },
      { id: "addressing", title: "링크별 /30과 자동 설정" },
      { id: "nccl", title: "Peer-aware GID 선택 patch" },
      { id: "measurement", title: "787GB/s가 의미하는 범위" },
      { id: "operations", title: "지원·복구·확장 한계" },
    ],
    component: () => import("@/pages/articles/hw/b300-switchless-network"),
  },
];
