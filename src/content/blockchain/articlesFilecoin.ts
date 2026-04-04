import type { Article } from '../types';

export const filecoinArticles: Article[] = [
  /* ── 개요 & 합의 ── */
  {
    slug: 'filecoin-lotus', title: 'Filecoin Lotus 아키텍처', subcategory: 'fil-overview',
    sections: [{ id: 'overview', title: '개요' }, { id: 'consensus-proofs', title: '합의 & Sealing 파이프라인' }, { id: 'chainstore', title: 'ChainStore & StateManager' }, { id: 'block-creation', title: '블록 생성 파이프라인' }],
    component: () => import('@/pages/articles/blockchain/filecoin-lotus'),
  },
  {
    slug: 'expected-consensus', title: 'Expected Consensus', subcategory: 'fil-overview',
    sections: [{ id: 'sortition', title: 'Poisson Sortition' }, { id: 'tipset', title: 'Tipset 선택' }, { id: 'validation', title: '블록 검증 파이프라인' }, { id: 'weight', title: '체인 가중치 계산' }],
    component: () => import('@/pages/articles/filecoin/expected-consensus'),
  },
  {
    slug: 'filecoin-f3', title: 'Filecoin F3: Fast Finality (GossiPBFT)', subcategory: 'fil-overview',
    sections: [{ id: 'overview', title: '왜 F3가 필요한가' }, { id: 'gossipbft', title: 'GossiPBFT 프로토콜' }, { id: 'integration', title: 'EC + F3 통합' }],
    component: () => import('@/pages/articles/blockchain/filecoin-f3'),
  },

  /* ── Lotus 내부 (심층) ── */
  {
    slug: 'lotus-chain', title: 'Lotus 체인 동기화 & 블록 검증', subcategory: 'fil-lotus',
    sections: [{ id: 'overview', title: 'ChainSync 전체 흐름' }, { id: 'tipset-validation', title: 'Tipset 검증' }, { id: 'state-computation', title: '상태 계산 & VM' }],
    component: () => import('@/pages/articles/blockchain/lotus-chain'),
  },
  {
    slug: 'lotus-miner', title: 'Lotus 마이닝 & 섹터 관리', subcategory: 'fil-lotus',
    sections: [{ id: 'overview', title: '마이닝 전체 흐름' }, { id: 'sector-lifecycle', title: '섹터 라이프사이클' }, { id: 'winning-post', title: 'WinningPoSt & 블록 생성' }],
    component: () => import('@/pages/articles/blockchain/lotus-miner'),
  },
  {
    slug: 'lotus-market', title: 'Lotus 스토리지 딜 & 리트리벌', subcategory: 'fil-lotus',
    sections: [{ id: 'overview', title: '딜 흐름 개요' }, { id: 'storage-deal', title: '스토리지 딜 라이프사이클' }, { id: 'retrieval', title: '리트리벌 마켓' }],
    component: () => import('@/pages/articles/blockchain/lotus-market'),
  },
  {
    slug: 'lotus-mpool', title: 'Lotus 메시지 풀 & 가스', subcategory: 'fil-lotus',
    sections: [{ id: 'overview', title: '메시지 풀 구조' }, { id: 'gas-estimation', title: '가스 추정 & 선택' }, { id: 'nonce-management', title: 'Nonce 관리' }],
    component: () => import('@/pages/articles/blockchain/lotus-mpool'),
  },
  {
    slug: 'lotus-state', title: 'Lotus 상태 관리 (Actor & HAMT)', subcategory: 'fil-lotus',
    sections: [{ id: 'overview', title: 'Actor 시스템' }, { id: 'hamt-amt', title: 'HAMT & AMT 자료구조' }, { id: 'state-tree', title: 'StateTree & 스냅샷' }],
    component: () => import('@/pages/articles/blockchain/lotus-state'),
  },
];
