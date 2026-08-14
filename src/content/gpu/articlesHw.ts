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
    slug: "hw-network",
    title: "서버 네트워크: Ethernet·RDMA·InfiniBand 설계",
    subcategory: "hw-infra",
    sections: [
      { id: "overview", title: "서버 네트워크는 workload에서 시작한다" },
      { id: "interconnect", title: "PCIe·NVLink에서 fabric까지" },
      { id: "ethernet", title: "Ethernet 링크와 leaf-spine fabric" },
      { id: "rdma", title: "RDMA와 RoCE v2의 실제 데이터 경로" },
      { id: "infiniband", title: "InfiniBand와 GPU collective fabric" },
    ],
    component: () => import("@/pages/articles/hw/network"),
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
