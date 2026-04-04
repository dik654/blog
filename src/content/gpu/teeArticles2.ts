import type { Article } from '../types';

export const teeArticles2: Article[] = [
  {
    slug: 'dstack',
    title: 'dStack: Intel TDX 기밀 VM 인프라',
    subcategory: 'tee-infra',
    sections: [
      { id: 'overview', title: '개요 & 아키텍처' },
      { id: 'vm-creation', title: 'VM 생성 & 프로비저닝' },
      { id: 'tdx-attestation', title: 'TDX Quote & RA-TLS' },
      { id: 'key-management', title: '계층적 키 관리 시스템' },
    ],
    component: () => import('@/pages/articles/tee/dstack'),
  },
  {
    slug: 'keylime',
    title: 'Keylime: TPM 기반 원격 증명 프레임워크',
    subcategory: 'tee-infra',
    sections: [
      { id: 'overview', title: '개요' },
      { id: 'tpm-attestation', title: 'TPM 기반 원격 증명' },
      { id: 'agent-verifier', title: '에이전트-검증자 아키텍처' },
      { id: 'ima-integrity', title: 'IMA 무결성 측정' },
      { id: 'policy-system', title: '정책 시스템' },
    ],
    component: () => import('@/pages/articles/tee/keylime'),
  },
  {
    slug: 'oasis',
    title: 'Oasis Network: TEE 기반 기밀 스마트 컨트랙트',
    subcategory: 'tee-net',
    sections: [
      { id: 'overview', title: '개요 & 2계층 아키텍처' },
      { id: 'core-architecture', title: 'Core 아키텍처' },
      { id: 'consensus-services', title: '합의 서비스' },
      { id: 'runtime-system', title: '런타임 시스템' },
      { id: 'p2p-networking', title: 'P2P 네트워킹' },
      { id: 'storage-system', title: '스토리지 시스템' },
      { id: 'tee-security', title: 'TEE 보안' },
      { id: 'sapphire', title: 'Sapphire: 기밀 EVM' },
      { id: 'sapphire-detail', title: 'Sapphire EVM 상세' },
      { id: 'key-manager', title: '키 매니저 & 런타임 보안' },
      { id: 'developer-tools', title: '개발자 도구' },
    ],
    component: () => import('@/pages/articles/tee/oasis'),
  },
  {
    slug: 'phala',
    title: 'Phala Network: TEE 기반 오프체인 컴퓨팅 프로토콜',
    subcategory: 'tee-net',
    sections: [
      { id: 'overview', title: '개요 & 시스템 아키텍처' },
      { id: 'phat-contract', title: 'Phat Contract (Pink Runtime)' },
      { id: 'tee-worker', title: 'TEE Worker (pRuntime & Phactory)' },
      { id: 'distributed', title: '분산 컴퓨팅 (클러스터 & 롤업)' },
      { id: 'tokenomics', title: '토크노믹스 (PHA)' },
    ],
    component: () => import('@/pages/articles/tee/phala'),
  },
];
