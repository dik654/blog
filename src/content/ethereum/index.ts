import type { Category } from '../types';
import { nodeSections } from '@/pages/articles/ethereum/node-architecture/meta';

const ethereum: Category = {
  slug: 'ethereum',
  name: 'Ethereum',
  description: '이더리움 프로토콜, P2P 네트워크, 합의 메커니즘 학습 노트',
  subcategories: [
    { slug: 'architecture', name: 'Architecture' },
    { slug: 'p2p', name: 'P2P Network' },
    { slug: 'consensus', name: 'Consensus' },
    { slug: 'evm', name: 'EVM' },
  ],
  articles: [
    {
      slug: 'node-architecture',
      title: '이더리움 노드 아키텍처 (EL + CL)',
      subcategory: 'architecture',
      sections: nodeSections,
      component: () => import('@/pages/articles/ethereum/node-architecture'),
    },
    {
      slug: 'fork-id',
      title: 'Fork ID (EIP-2124) 분석',
      subcategory: 'p2p',
      sections: [
        { id: 'overview', title: '개요' },
        { id: 'crc32-enr', title: 'CRC32 & ENR' },
        { id: 'pow-to-pos', title: 'PoW→PoS 전환' },
        { id: 'test-design', title: '테스트 케이스 설계' },
      ],
      component: () => import('@/pages/articles/ethereum/fork-id'),
    },
  ],
};

export default ethereum;
