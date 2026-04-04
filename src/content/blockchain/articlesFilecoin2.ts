import type { Article } from '../types';

export const filecoin2Articles: Article[] = [
  /* ── 저장 증명 ── */
  {
    slug: 'filecoin-proofs', title: 'Filecoin 저장 증명 개요: PoRep & PoSt', subcategory: 'fil-proofs',
    sections: [{ id: 'overview', title: '개요 & 봉인 파이프라인' }, { id: 'sdr', title: 'SDR 그래프' }, { id: 'post', title: 'PoSt 증명' }],
    component: () => import('@/pages/articles/blockchain/filecoin-proofs'),
  },
  {
    slug: 'proofs-porep', title: 'PoRep 봉인 파이프라인 심층 (PC1→PC2→C1→C2)', subcategory: 'fil-proofs',
    sections: [{ id: 'overview', title: '봉인 전체 흐름' }, { id: 'pc1', title: 'PreCommit1: SDR 그래프 생성' }, { id: 'pc2', title: 'PreCommit2: 칼럼 해시 + 트리 R' }, { id: 'commit', title: 'C1/C2: Groth16 증명 생성' }],
    component: () => import('@/pages/articles/blockchain/proofs-porep'),
  },
  {
    slug: 'proofs-post', title: 'PoSt 심층: WindowPoSt vs WinningPoSt', subcategory: 'fil-proofs',
    sections: [{ id: 'overview', title: 'PoSt 개요' }, { id: 'window-post', title: 'WindowPoSt: 데드라인 & 파티션' }, { id: 'winning-post', title: 'WinningPoSt: 블록 보상' }, { id: 'fault-recovery', title: '장애 & 복구' }],
    component: () => import('@/pages/articles/blockchain/proofs-post'),
  },
  {
    slug: 'proofs-snark', title: 'Filecoin SNARK: Groth16 & GPU 가속', subcategory: 'fil-proofs',
    sections: [{ id: 'overview', title: 'SNARK 개요' }, { id: 'groth16', title: 'Groth16 증명/검증' }, { id: 'gpu', title: 'bellperson GPU 가속' }, { id: 'supraseal', title: 'SupraSeal 최적화' }],
    component: () => import('@/pages/articles/blockchain/proofs-snark'),
  },

  /* ── 핫스토리지 ── */
  {
    slug: 'filecoin-pdp', title: 'PDP: Proof of Data Possession (핫스토리지 검증)', subcategory: 'fil-hot',
    sections: [{ id: 'overview', title: 'PDP vs PoRep: 왜 다른 증명이 필요한가' }, { id: 'protocol', title: 'SHA2 챌린지 & 160바이트 응답' }, { id: 'onchain', title: '온체인 검증 & 스케줄링' }],
    component: () => import('@/pages/articles/blockchain/filecoin-pdp'),
  },
  {
    slug: 'filecoin-storacha', title: 'Storacha: 탈중앙 핫스토리지 네트워크', subcategory: 'fil-hot',
    sections: [{ id: 'overview', title: 'Saturn → Storacha 전환' }, { id: 'architecture', title: 'Storage · Indexing · Retrieval 노드' }, { id: 'ucan', title: 'UCAN 인증 & 권한 위임' }, { id: 'forge', title: 'Forge: IPFS 호환 warm storage' }],
    component: () => import('@/pages/articles/blockchain/filecoin-storacha'),
  },
  {
    slug: 'filecoin-onchain-cloud', title: 'Filecoin Onchain Cloud 플랫폼', subcategory: 'fil-hot',
    sections: [{ id: 'overview', title: '플랫폼 개요' }, { id: 'pdp-integration', title: 'PDP 기반 검증 가능 스토리지' }, { id: 'settlement', title: '온체인 정산 & 사용량 과금' }],
    component: () => import('@/pages/articles/blockchain/filecoin-onchain-cloud'),
  },

  /* ── 네트워크 인프라 ── */
  {
    slug: 'ipfs-filecoin-storage', title: 'IPFS & Filecoin 연동', subcategory: 'fil-infra',
    sections: [{ id: 'overview', title: '개요' }, { id: 'ipfs-architecture', title: 'IPFS 아키텍처' }, { id: 'hot-storage', title: '핫스토리지 & 캐싱' }],
    component: () => import('@/pages/articles/blockchain/ipfs-filecoin-storage'),
  },
  {
    slug: 'filecoin-ipc', title: 'IPC: InterPlanetary Consensus 서브넷', subcategory: 'fil-infra',
    sections: [{ id: 'overview', title: 'IPC 아키텍처' }, { id: 'subnet', title: '서브넷 생성 & 관리' }, { id: 'checkpointing', title: '체크포인팅 & 크로스 서브넷 메시지' }],
    component: () => import('@/pages/articles/blockchain/filecoin-ipc'),
  },
  {
    slug: 'filecoin-fvm', title: 'FVM: Filecoin Virtual Machine', subcategory: 'fil-infra',
    sections: [{ id: 'overview', title: 'FVM 아키텍처' }, { id: 'wasm-runtime', title: 'WASM 런타임 & Actor 실행' }, { id: 'builtin-actors', title: 'Built-in Actors (Storage, Market, Power)' }],
    component: () => import('@/pages/articles/blockchain/filecoin-fvm'),
  },
];
