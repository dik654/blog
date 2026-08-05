import type { Article } from '../types';

/**
 * Hardware deep — 아키텍처 · bandwidth · 백업 · 벤더.
 * 컴포넌트 파일은 ops 디렉토리에 그대로 두고 (역사적 위치), 카테고리만 gpu 의 hw-deep 으로 노출.
 */
export const hwDeepArticles: Article[] = [
  {
    slug: 'hw-gpu-architecture-evolution',
    title: 'GPU 아키텍처 진화 — Volta → Ampere → Hopper → Blackwell',
    subcategory: 'hw-deep',
    sections: [
      { id: 'overview', title: '개요 + timeline' },
      { id: 'sm', title: 'SM 구조 진화' },
      { id: 'tensor-core', title: 'Tensor Core 세대별' },
      { id: 'innovations', title: '아키텍처별 핵심 혁신' },
    ],
    component: () => import('@/pages/articles/ops/gpu-architecture-evolution'),
  },
  {
    slug: 'hw-bandwidth-deep-dive',
    title: 'Bandwidth Deep Dive — Roofline · LLM · 네트워크 · I/O',
    subcategory: 'hw-deep',
    sections: [
      { id: 'overview', title: '개요 — bandwidth 가 결정하는 모든 것' },
      { id: 'roofline', title: 'Roofline Model 진단' },
      { id: 'llm', title: 'LLM 추론은 왜 memory bound 인가' },
      { id: 'network', title: '네트워크 bandwidth (multi-GPU)' },
      { id: 'io-storage', title: 'I/O · Storage · PCIe' },
    ],
    component: () => import('@/pages/articles/ops/bandwidth-deep-dive'),
  },
  {
    slug: 'hw-fundamentals',
    title: '하드웨어 기초 — CPU · GPU · HBM · NPU · 냉각 · 벤더',
    subcategory: 'hw-deep',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'cpu', title: 'CPU (Intel vs AMD)' },
      { id: 'gpu', title: 'GPU 계층 + NPU' },
      { id: 'memory-storage', title: '메모리 · 스토리지 (HBM · HBF · NVMe · HDD)' },
      { id: 'cooling', title: '냉각 (공조 vs DLC vs 침지)' },
      { id: 'vendors', title: '서버 · 스토리지 벤더' },
    ],
    component: () => import('@/pages/articles/ops/hardware-fundamentals'),
  },
  {
    slug: 'hw-raid-backup-strategy',
    title: 'RAID · 백업 전략 — 비용·속도·크기 trade-off',
    subcategory: 'hw-deep',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'raid-levels', title: 'RAID 레벨 비교' },
      { id: 'backup-321', title: '3-2-1 규칙 + 도구' },
      { id: 'cost-model', title: '비용 · 속도 · 크기 모델' },
      { id: 'scenarios', title: '워크로드별 설계' },
    ],
    component: () => import('@/pages/articles/ops/raid-backup-strategy'),
  },
];
