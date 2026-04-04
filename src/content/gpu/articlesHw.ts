import type { Article } from '../types';

export const hwArticles: Article[] = [
  /* ── Compute ── */
  {
    slug: 'hw-gpu-comparison', title: 'GPU 비교: RTX 4090 vs 5090 vs A100 vs H100', subcategory: 'hw-compute',
    sections: [{ id: 'overview', title: '왜 GPU를 비교해야 하는가' }, { id: 'consumer', title: '컨슈머 GPU (4090, 5090)' }, { id: 'datacenter', title: '데이터센터 GPU (A100, H100)' }, { id: 'blockchain', title: '블록체인 워크로드별 선택' }],
    component: () => import('@/pages/articles/hw/gpu-comparison'),
  },
  {
    slug: 'hw-server-vs-desktop', title: '서버 vs 데스크톱: 부품 차이 완전 정리', subcategory: 'hw-compute',
    sections: [{ id: 'overview', title: '왜 서버 부품이 다른가' }, { id: 'cpu', title: 'CPU: Xeon/EPYC vs Core/Ryzen' }, { id: 'motherboard', title: '메인보드: 듀얼 소켓, IPMI, PCIe 레인' }, { id: 'reliability', title: '안정성: ECC, 핫스왑, 이중 전원' }],
    component: () => import('@/pages/articles/hw/server-vs-desktop'),
  },

  /* ── Storage ── */
  {
    slug: 'hw-nvme-storage', title: 'NVMe 스토리지: M.2 vs U.2 vs E1.S', subcategory: 'hw-storage',
    sections: [{ id: 'overview', title: '왜 폼팩터가 중요한가' }, { id: 'm2', title: 'M.2: 컨슈머 표준 (2280, 히트싱크)' }, { id: 'u2', title: 'U.2: 서버/엔터프라이즈 (핫스왑, 전력)' }, { id: 'e1s', title: 'E1.S/E3.S: 차세대 데이터센터' }],
    component: () => import('@/pages/articles/hw/nvme-storage'),
  },
  {
    slug: 'hw-storage-comparison', title: '스토리지 비교: SATA vs NVMe vs SAS', subcategory: 'hw-storage',
    sections: [{ id: 'overview', title: '프로토콜별 특성' }, { id: 'interface', title: '인터페이스: AHCI vs NVMe 큐 구조' }, { id: 'enterprise', title: '엔터프라이즈 SSD: 내구성(DWPD), 전력 손실 보호' }, { id: 'filecoin', title: 'Filecoin 마이닝: 스토리지 선택 가이드' }],
    component: () => import('@/pages/articles/hw/storage-comparison'),
  },

  /* ── Memory ── */
  {
    slug: 'hw-memory', title: '메모리: DDR4 vs DDR5, ECC, RDIMM', subcategory: 'hw-memory',
    sections: [{ id: 'overview', title: '왜 메모리 선택이 중요한가' }, { id: 'ddr', title: 'DDR4 vs DDR5: 대역폭, 레이턴시, 채널' }, { id: 'ecc', title: 'ECC: 에러 정정 (서버 필수, 왜?)' }, { id: 'rdimm', title: 'RDIMM vs UDIMM vs LRDIMM' }],
    component: () => import('@/pages/articles/hw/memory'),
  },

  /* ── Infrastructure ── */
  {
    slug: 'hw-power-cooling', title: '전력 & 냉각: TDP, 블로워 vs 오픈에어, 랙 설계', subcategory: 'hw-infra',
    sections: [{ id: 'overview', title: '왜 전력/냉각이 중요한가' }, { id: 'tdp', title: 'TDP & 전력 소비: GPU별 실측' }, { id: 'cooling', title: '냉각: 블로워 vs 오픈에어 vs 수냉' }, { id: 'rack', title: '랙마운트: 1U/2U/4U, 전력 분배' }],
    component: () => import('@/pages/articles/hw/power-cooling'),
  },
  {
    slug: 'hw-network', title: '서버 네트워크: 10G/25G/100G, RDMA, InfiniBand', subcategory: 'hw-infra',
    sections: [{ id: 'overview', title: '왜 서버 네트워크가 다른가' }, { id: 'ethernet', title: '10G/25G/100G 이더넷' }, { id: 'rdma', title: 'RDMA & RoCE v2' }, { id: 'infiniband', title: 'InfiniBand: GPU 클러스터 연결' }],
    component: () => import('@/pages/articles/hw/network'),
  },
];
