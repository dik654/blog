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
      { id: "overview", title: "왜 서버 부품이 다른가" },
      { id: "cpu", title: "CPU: 클럭보다 플랫폼 한계를 본다" },
      { id: "motherboard", title: "메인보드: 연결과 관리의 설계도" },
      { id: "reliability", title: "안정성: 고장을 서비스 중단과 분리한다" },
    ],
    component: () => import("@/pages/articles/hw/server-vs-desktop"),
  },

  /* ── Storage ── */
  {
    slug: "hw-nvme-storage",
    title: "NVMe 스토리지: M.2 vs U.2 vs E1.S",
    subcategory: "hw-storage",
    sections: [
      { id: "overview", title: "왜 폼팩터가 중요한가" },
      { id: "m2", title: "M.2: 작은 내부 모듈의 열 설계" },
      { id: "u2", title: "U.2/U.3: 전면 베이와 정비 경로" },
      { id: "e1s", title: "E1.S/E3.S: 밀도와 공기 흐름을 함께 설계" },
    ],
    component: () => import("@/pages/articles/hw/nvme-storage"),
  },
  {
    slug: "hw-storage-comparison",
    title: "스토리지 비교: SATA vs NVMe vs SAS",
    subcategory: "hw-storage",
    sections: [
      { id: "overview", title: "SATA·SAS·NVMe는 무엇이 다른가" },
      { id: "interface", title: "큐와 전송 경로: AHCI·SCSI·NVMe" },
      { id: "enterprise", title: "엔터프라이즈 SSD: 쓰기 예산과 실패 복구" },
      { id: "filecoin", title: "Filecoin: scratch·sector·metadata를 분리한다" },
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
      { id: "overview", title: "왜 전력과 냉각을 함께 설계하는가" },
      { id: "tdp", title: "정격에서 입력 전력·열 부하까지" },
      { id: "cooling", title: "공랭·직접수냉·침지냉각의 열 경로" },
      { id: "rack", title: "랙·전원 분배·장애 상태 설계" },
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
